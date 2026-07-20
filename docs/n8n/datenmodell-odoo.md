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
→ manuell prüfen (Graph-Postausgang):
- Mail nachweislich zugestellt → auf `sent` setzen.
- Mail nachweislich NICHT zugestellt → Row **löschen** (nicht nur `failed_unknown` setzen), damit
  ein späterer Confirm-/Anmelde-Retry den Claim (`invite:<id>`/`doi:<id>`) neu anlegen und senden
  kann. Sonst blockiert der Unique-Constraint den Retry dauerhaft (Confirm-Verlierer bekommt sonst
  immer 409, Anmelde-Recovery sendet nicht neu, weil eine Row existiert).

**Kein Auto-Retry** (bei transaktionalen Event-Mails ist ein Zweifelsfall besser als Doppelmail).
Der Confirm-Verlierer bei echtem Parallel-Confirm sendet **nie** (immer 409) — der Unique-Constraint
lässt genau einen Gewinner senden; ein abgestürzter Gewinner wird über diese Reconciliation
(Row löschen) wieder retry-fähig. Für harte Inline-Atomizität die Odoo-Custom-Method (unten).

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

## Pflicht: transaktionale Bestätigungsmethode `confirm_by_digest`

Die Confirm-WF (WF-2) ruft **eine** atomare Odoo-Methode auf, die in **einer** DB-Transaktion
TTL prüft, den `invite`-Claim setzt und den Status auf `confirmed` bringt. Das ist der einzige
robuste Weg, parallele Bestätigungen (genau 1× senden) UND Crash-Recovery (Pre-Send-Crash bzw.
confirmed-aber-nicht-versandt → erneut senden) korrekt zu behandeln — ohne race-anfällige
Mehrfach-RPCs in n8n. Als kleines Odoo-Modul auf `x_infotermin_reg` ergänzen:

```python
from odoo import api, fields, models
from datetime import timedelta

class InfoterminReg(models.Model):
    _inherit = 'x_infotermin_reg'   # bzw. _name im eigenen Modul

    @api.model
    def confirm_by_digest(self, digest):
        rec = self.search([('token_digest', '=', digest)], limit=1)
        if not rec:
            return {'outcome': 'not_found'}
        now = fields.Datetime.now()
        # TTL: Termin vorbei ODER >7 Tage seit Anlage
        termin_dt = fields.Datetime.from_string((rec.termin or '').replace('T', ' ')[:19])
        expired = (termin_dt and termin_dt < now) or \
                  (rec.create_date and rec.create_date < now - timedelta(days=7))
        if expired:
            return {'outcome': 'expired'}
        Outbox = self.env['x_infotermin_outbox']
        key = 'invite:%d' % rec.id
        ob = Outbox.search([('mail_key', '=', key)], limit=1)
        if ob and ob.state == 'sent':
            return {'outcome': 'already', 'reg_id': rec.id}
        if ob and ob.state in ('sending', 'failed_unknown'):
            # frischer Claim eines parallelen Gewinners -> dieser Aufrufer sendet NICHT
            if ob.ts and ob.ts > now - timedelta(minutes=15):
                return {'outcome': 'already', 'reg_id': rec.id}
            ob.write({'state': 'sending', 'ts': now})       # stale -> übernehmen
        elif not ob:
            # Unique-Constraint auf mail_key: bei echtem Parallel-Create gewinnt genau
            # einer; der Verlierer wiederholt die RPC (Odoo-Serialisierung) und sieht
            # dann den frischen Claim -> 'already'.
            Outbox.create({'mail_key': key, 'reg_id': rec.id, 'state': 'sending', 'ts': now})
        if rec.status != 'confirmed':
            rec.status = 'confirmed'
        return {'outcome': 'confirm_now', 'reg_id': rec.id, 'outbox_id':
                Outbox.search([('mail_key', '=', key)], limit=1).id,
                'email_norm': rec.email_norm, 'name': rec.name,
                'unternehmen': rec.unternehmen, 'termin': rec.termin}
```

**Rückgabe-Enum → HTTP:** `not_found`/`expired` → 410, `already` → 409, `confirm_now` → WF-2
sendet die Einladung und markiert die `invite`-Outbox `sent`/`failed_unknown`. Idempotent:
`confirmed`-aber-nicht-`sent` liefert erneut `confirm_now` (Recovery), erst `sent` → `already`.
