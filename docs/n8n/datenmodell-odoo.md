# Odoo-Datenmodell — Infotermin

Die Nebenläufigkeits-Korrektheit (kein Doppel-Lead, kein Doppelversand, atomarer DOI)
kommt aus **Datenbank-Unique-Constraints**, nicht aus n8n. Dafür zwei kleine Custom-Modelle.
Anlegen per Odoo Studio (Felder + „SQL Constraints") oder als kleines Modul.

## Modell `x_infotermin_reg` (Registrierung = Quelle der Wahrheit)

| Feld | Typ | Zweck |
|------|-----|-------|
| `email_norm` | Char | normalisierte E-Mail (lowercase, trim) |
| `name` | Char | Name (für crm.lead-Spiegel nach Bestätigung) |
| `unternehmen` | Char | Firma (für crm.lead-Spiegel) |
| `termin` | Char | offset-ISO, z. B. `2026-07-29T19:30:00+02:00` |
| `status` | Selection | `received` → `confirmed` |
| `token_digest` | Char | SHA-256-Hex des DOI-Tokens (nie Klartext) |

Für die Cleanup-Frist wird Odoos **automatisches `create_date`** genutzt (kein eigenes Feld
nötig — jedes Odoo-Modell hat es).

**SQL-Constraint (Pflicht):**
```python
_sql_constraints = [
    ('reg_uniq', 'unique(email_norm, termin)',
     'Pro E-Mail und Termin nur eine Registrierung.'),
]
```
→ WF-1 `create` einer Doublette scheitert atomar an der DB → Recovery-Zweig (idempotent),
kein `search→create`-Race.

## Modell `x_infotermin_outbox` (Versand-Jobs = atomarer Claim)

| Feld | Typ | Zweck |
|------|-----|-------|
| `mail_key` | Char | `<typ>:<reg_id>`, z. B. `doi:42`, `invite:42`, `reminder1d:42`, `reminder1h:42`, `thanks:42` |
| `reg_id` | Many2one → `x_infotermin_reg` | Zuordnung |
| `state` | Selection | `sending` → `sent` \| `failed_unknown` |
| `ts` | Datetime | Claim-/Sendezeit |

**SQL-Constraint (Pflicht):**
```python
_sql_constraints = [
    ('mailkey_uniq', 'unique(mail_key)',
     'Jede Mail wird höchstens einmal beansprucht.'),
]
```
→ **Claim = `create`**: gelingt der Insert, sendet dieser Lauf; Unique-Violation = ein anderer
Lauf (egal welcher der sechs Workflows) hat bereits beansprucht → überspringen. Workflow-
übergreifend atomar auf DB-Ebene. Dies ist zugleich der **CAS** der confirm-WF (wer `invite:<id>`
zuerst anlegt, gewinnt → 200; Verlierer → 409).

## Statusmodell

```
Registrierung:  received ──(DOI-POST bestätigt)──▶ confirmed
Outbox je Mail: (kein Row) ──create──▶ sending ──Graph ok──▶ sent
                                         └── Graph-Fehler ──▶ failed_unknown
                                         └── Abbruch nach Graph-Erfolg vor sent-Write: bleibt sending
```

**Reconciliation-Query** (Betrieb/Abnahme): `state = sending AND ts < now-15min`
→ manuell prüfen (Graph-Postausgang), dann auf `sent` oder `failed_unknown` setzen. **Kein**
Auto-Retry (bei transaktionalen Event-Mails ist ein Zweifelsfall besser als Doppelmail).

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

## Optionaler Upgrade-Pfad: Hart-Atomizität

Statt Read-after-Conflict eine Odoo-Custom-Methode `confirm_registration(token_digest)`, die in
**einer** DB-Transaktion Status-Wechsel + `invite`-Claim macht und einen Zustands-Enum
zurückgibt (`confirmed` / `already` / `expired` / `not_found`). n8n ruft sie via `execute_kw`.
Für die Veranstaltungsgröße nicht nötig; die Read-after-Conflict-Recovery + Reconciliation reicht.
