# Odoo-Datenmodell — Infotermin (Odoo Online, ohne Custom-Module)

**Plattform-Realität:** Die Instanz ist **Odoo Online** (`manibase-ug.odoo.com`). Odoo Online
erlaubt **keine** Custom-Python-Module — also **weder** eigene Model-Methoden **noch**
`_sql_constraints`. Die früher geplante DB-Atomizität (Unique-Constraints, transaktionale
Methode) ist hier **nicht installierbar**. Die Modelle werden daher per **Odoo Studio nur mit
Feldern** angelegt (keine Constraints, keine Methoden).

**Nebenläufigkeit (Best-Effort, proportional zur Veranstaltungsgröße):**
- Jeder zustandsändernde Workflow läuft mit **n8n „Limit execution to 1"** (Concurrency 1, im
  n8n-Workflow-Settings-UI zu setzen). Dadurch ist **innerhalb** eines Workflows jeder
  „suchen → schreiben"-Schritt serialisiert = kollisionsfrei.
- Dedup/Idempotenz über **search-before-create**: vor jedem `create` wird per `search_read`
  geprüft, ob der Datensatz (reg per `email_norm`+`termin`, Versand per `mail_key`) schon
  existiert.
- **Bewusste, ehrliche Grenze:** Ein echtes workflow-**übergreifendes** Race (z. B. Cleanup
  löscht, während eine Bestätigung läuft) ist ohne DB-Constraint nicht hart ausgeschlossen.
  Bei eurer Größenordnung (Dutzende über Tage eintröpfelnde Anmeldungen, Bestätigungen als
  einzelne Nutzer-Klicks) ist die reale Kollisionswahrscheinlichkeit ≈ 0. Wer harte Garantien
  braucht: **Upgrade auf Odoo.sh / on-prem** ermöglicht ein Modul mit Unique-Constraints +
  transaktionaler `confirm`-Methode (Upgrade-Pfad, hier bewusst nicht umgesetzt).

> **⚠️ Technische Feldnamen (Studio):** Odoo Studio vergibt für Custom-Felder eigene technische
> Namen (oft `x_studio_<name>`). Die hier und in den Workflow-JSONs genutzten **logischen** Namen
> (`email_norm`, `termin`, `token_digest`, `mail_key`, `state`, `ts`, `status`, `name`,
> `unternehmen`) müssen beim Anlegen entweder exakt als technischer Name gesetzt oder **vor dem
> Import** in den JSONs per Suchen-und-Ersetzen an die von Studio erzeugten Namen angeglichen
> werden — sonst „Invalid field". Siehe [`README.md`](README.md#odoo-studio-feldnamen).

## Modell `x_infotermin_reg` (Registrierung = Quelle der Wahrheit)

| Feld | Typ | Zweck |
|------|-----|-------|
| `email_norm` | Char | normalisierte E-Mail (lowercase, trim) |
| `name` | Char | Name (für crm.lead-Spiegel nach Bestätigung) |
| `unternehmen` | Char | Firma (für crm.lead-Spiegel) |
| `termin` | Char | offset-ISO, z. B. `2026-07-29T19:30:00+02:00` |
| `status` | Selection | `received` → `confirmed` |
| `token_digest` | Char | SHA-256-Hex des DOI-Tokens (nie Klartext) |

Cleanup-Frist über Odoos automatisches `create_date`. **Dedup:** WF-1 macht vor `create` ein
`search_read` auf `email_norm`+`termin`; existiert die reg schon → Recovery-Zweig statt Doublette
(unter Concurrency 1 sicher).

## Modell `x_infotermin_outbox` (Versand-Tracker, search-before-create)

| Feld | Typ | Zweck |
|------|-----|-------|
| `mail_key` | Char | `<typ>:<reg_id>`, z. B. `doi:42`, `invite:42`, `reminder1d:42`, `reminder1h:42`, `thanks:42` |
| `reg_id` | Many2one → `x_infotermin_reg` | Zuordnung |
| `state` | Selection | `sending` → `sent` \| `failed_unknown` |
| `ts` | Datetime | Claim-/Sendezeit |

**Claim = search-before-create (unter Concurrency 1):** vor dem Versand `search_read` auf
`mail_key`. Existiert eine Row mit `state=sent` → **nicht** erneut senden (409/skip). Existiert
eine Row in `sending`/`failed_unknown` → **kein Auto-Resend** (unbekannter Versandzustand) →
Reconciliation. Nur wenn **keine** Row existiert → `create` (state `sending`) + senden +
`write state=sent`. So wird bei unbekanntem Zustand nie doppelt versandt.

## Statusmodell

```
Registrierung:  received ──(DOI-POST bestätigt)──▶ confirmed
Outbox je Mail: (kein Row) ──create──▶ sending ──Graph ok──▶ sent
                                         └── Graph-Fehler ──▶ failed_unknown
                                         └── Abbruch nach Graph-Erfolg vor sent-Write: bleibt sending
```

**Reconciliation-Query** (Betrieb/Abnahme): `state = sending AND ts < now-15min`
→ manuell prüfen (Graph-Postausgang):
- Mail nachweislich zugestellt → auf `sent` setzen.
- Mail nachweislich NICHT zugestellt → Row **löschen** (nicht nur `failed_unknown` setzen), damit
  ein späterer Confirm-/Anmelde-Retry den Claim (`invite:<id>`/`doi:<id>`) neu anlegen und senden
  kann. Sonst findet der nächste **search-before-create** die vorhandene Row und überspringt den
  Versand dauerhaft (Confirm-Verlierer bekommt 409, Anmelde-Recovery sendet nicht neu).

**Kein Auto-Retry** (bei transaktionalen Event-Mails ist ein Zweifelsfall besser als Doppelmail).
Der Confirm-Verlierer bei echtem Parallel-Confirm sendet **nie** (immer 409) — dank **Concurrency 1
+ search-before-create** findet der zweite (serialisierte) Lauf die vorhandene invite-Row; ein
abgestürzter Gewinner wird über diese Reconciliation (Row löschen) wieder retry-fähig. Harte
Inline-Atomizität nur mit Odoo.sh-Modul (Upgrade-Pfad).

## Modell `x_infotermin_audit` (Cleanup-Nachweis, PII-frei)

| Feld | Typ | Zweck |
|------|-----|-------|
| `ts` | Datetime | Laufzeitpunkt |
| `deleted` | Integer | Anzahl gelöschter/anonymisierter Registrierungen (aus den tatsächlichen unlink-Ergebnissen) |

WF-6 schreibt je Lauf einen Datensatz (keine personenbezogenen Daten). Erfüllt die zugesagte,
lead-unabhängige Löschdokumentation.

## crm.lead-Spiegel

Für den Vertrieb wird je `confirmed`-Registrierung ein `crm.lead` gespiegelt (Name, Firma,
E-Mail, Termin, Stufe „Angemeldet Infoveranstaltung"). Interessenten (WF-4) landen direkt als
`crm.lead` „Interessent nach Infoveranstaltung". Der Lead ist **nicht** der race-kritische
Speicher — der ist `x_infotermin_reg`/`x_infotermin_outbox`.

## ICS-Semantik (Einladung, WF-2)

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//manibase//Infotermin//DE
METHOD:REQUEST
BEGIN:VTIMEZONE
TZID:Europe/Berlin
...DST-Regel...
END:VTIMEZONE
BEGIN:VEVENT
UID:<reg_id>@manibase.de           ← stabil, erlaubt Update/Absage ohne Dublette
DTSTAMP:<UTC-Erzeugungszeit>
SEQUENCE:0                          ← bei Updates hochzählen
DTSTART;TZID=Europe/Berlin:20260729T193000
DTEND;TZID=Europe/Berlin:20260729T203000   ← 60 min
SUMMARY:manibase Infotermin
ORGANIZER:mailto:kontakt@manibase.de
LOCATION:<Teams-URL>
END:VEVENT
END:VCALENDAR
```
Als Base64 (`contentBytes`) in `sendMail` anhängen. Vor Go-live in Outlook, Apple Calendar und
Google Calendar prüfen (Abnahme `ics-clients`).

## Confirm-Ablauf ohne Custom-Methode (WF-2, Concurrency 1)

Da Odoo Online keine Methode erlaubt, orchestriert WF-2 den Ablauf mit Standard-RPC unter
Concurrency 1 (serialisiert → kein Race innerhalb WF-2):

1. `search_read x_infotermin_reg` per `token_digest` (Felder id/status/termin/email_norm/name/
   unternehmen/`create_date`).
2. **TTL offset-korrekt** (Review-Finding 6): Termin als offset-ISO in echten Zeitpunkt parsen
   (`new Date(termin)` respektiert `+02:00`), `create_date` (UTC) + 7 Tage. Abgelaufen → 410.
3. nicht gefunden → 410; `status=confirmed` **und** `invite`-Outbox `sent` → 409.
4. `search_read x_infotermin_outbox` per `mail_key=invite:<id>`:
   - `state=sent` → 409 (fertig).
   - `state=sending`/`failed_unknown` → **kein Auto-Resend** → 409 + Reconciliation (unbekannter
     Zustand; s. u.).
   - keine Row → `create` (`sending`) → `write reg.status=confirmed` → ICS/Graph senden →
     `write outbox state=sent` (mit Fehlerprüfung) → `crm.lead` → 200.

Damit: Parallel-Confirm → dank Concurrency 1 läuft der zweite erst nach dem ersten → sieht die
Outbox-Row → 409 (genau 1× senden). Ein Crash mit hängender `sending`-Row → 409 bis die
Reconciliation die Row **löscht**; danach re-sendet ein Retry (search findet keine Row → sendet).

**Wichtig:** „Concurrency 1" wird im n8n-Workflow-Settings-UI gesetzt („Limit execution to 1").
Das ist der Serialisierungs-Mechanismus dieses Best-Effort-Designs.
