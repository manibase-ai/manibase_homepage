# Design: Infotermin n8n-Workflows + Betriebs-/Setup-Doku (Teilfeature 2)

**Datum:** 2026-07-20
**Status:** Entwurf (autonomer Workflow, abgeleitet aus Master-Spec v3)
**Master-Spec:** [`2026-07-20-veranstaltung-anmeldung-design.md`](2026-07-20-veranstaltung-anmeldung-design.md) (v3, final) — §3/§5/§6/§9 definieren die n8n-Seite. Diese Spec konkretisiert die **Lieferartefakte**.

## Ziel

Die serverseitige Automation hinter dem in PR1 gelieferten Proxy: n8n-Workflows (als Import-JSON), die Betriebs-/Setup-Doku (Entra/Graph-RBAC, Teams, nginx-Provisionierung, Config, Odoo, DOI/Outbox/ICS/Zeitzone) und ein Smoke-Test-Skript + Abnahmeprotokoll. Der Kunde (Nikolaus, Tenant-Admin) importiert/konfiguriert; dieser PR liefert die Bausteine + das Runbook.

## Realistische Scope-Grenze (wichtig, ehrlich)

Es gibt hier **keine** n8n-Instanz, keine echten Odoo-Feld-/Tag-IDs, keine Credentials. Daher:

- Die **Workflow-JSONs sind import-fertige Vorlagen** (valides n8n-Format, `jq`-prüfbar) mit klar markierten Platzhaltern (`{{CONFIG:...}}`) für Credentials, Webhook-Pfade, Odoo-IDs, Teams-Links. Sie bilden die in der Master-Spec §3 beschriebene Logik ab, sind aber in der Zielinstanz zu verdrahten und zu testen (Abnahmeprotokoll).
- Der **primäre Wert/Risikoträger ist die Runbook-Doku** (exakte Klick-/CLI-Schritte). Sie ist so geschrieben, dass ein Admin sie ohne diese Konversation abarbeiten kann.
- **Verifizierbar in diesem Repo:** JSON-Gültigkeit (`jq`), Struktur-Checks (erwartete Node-Typen/Verbindungen vorhanden), Shellcheck/`bash -n` für das Smoke-Skript, Vollständigkeits-Check Doku gegen Master-Spec. **Nicht** verifizierbar: echter Lauf gegen n8n/Odoo/Graph (→ Abnahmeprotokoll beim Go-live).

## Lieferartefakte (Dateien)

```
docs/n8n/
  README.md                     Runbook: Reihenfolge, Import, Credentials, Go-live-Gate
  config-schema.md              Alle Config-Werte (Webhooks, Secret, Odoo-IDs, Teams-Links, Graph)
  entra-graph-rbac.md           Schritt-für-Schritt: App ohne Tenant-Consent + Exchange RBAC scope
  datenmodell-odoo.md           crm.lead-Felder/Tags, Statusmodell, Outbox/Versand-Keys, ICS-Semantik
  abnahme-protokoll.md          Go-live-Checkliste (13 Punkte aus Master-Spec §9) + Negativtests
  workflows/
    wf-1-anmeldung-empfang.json      Webhook: Secret-Check, Validierung, Odoo-Upsert (received),
                                     DOI-Mail via Graph (Outbox-Key doi)
    wf-2-anmeldung-confirm.json      Webhook: Token prüfen+entwerten, Status->confirmed,
                                     Einladung + .ics via Graph (Outbox-Key invite)
    wf-3-reminder.json               Schedule (Europe/Berlin, 4 Zeitpunkte): confirmed + Termin,
                                     Reminder via Graph (Keys reminder1d/reminder1h)
    wf-4-interessent.json            Webhook: Secret-Check, Odoo-Upsert (interessent),
                                     interne Mail + Bestätigung via Graph
    wf-5-dankesmail.json             Manual: confirmed -> Danke + Aufzeichnungslink (Key thanks)
    wf-6-cleanup.json                Schedule (täglich): received>14d / confirmed>Termin+30d
                                     löschen/anonymisieren, Audit-Log
scripts/
  smoke-event.sh                curl-Abnahme gegen die Zielumgebung (13 Fälle, Master-Spec §9)
```

## Workflow-Design (verdichtet aus Master-Spec §3)

Gemeinsame Konventionen in allen Workflows:

- **Secret-Check** (Webhook-WFs): erster Node prüft Header `X-Manibase-Secret` gegen Config; Mismatch → 401.
- **Odoo JSON-RPC** über HTTP-Request-Nodes (`authenticate` → `execute_kw`), Muster wie `newsletter.php`. Upsert = `search_read` → `write`/`create`.
- **Idempotenz/Outbox:** Versand-Keys (`doi:<uid>`, `invite:<uid>`, `reminder1d/1h:<uid>`, `thanks:<uid>`) als Feld/Tag am Lead. Vor Graph-Versand: Key noch nicht gesetzt? → atomar auf „sending", senden, auf „sent". Reminder/Cleanup-WF: n8n-Setting **„Limit execution to 1"** (Concurrency 1).
- **Graph-Versand** über HTTP-Request-Node (POST `https://graph.microsoft.com/v1.0/users/kontakt@manibase.de/sendMail`) mit OAuth2-Credential (Client-Credentials, RBAC-scoped, §entra-graph-rbac). **Kein** Secret im JSON.
- **Zeitzone:** Schedule-Trigger explizit `Europe/Berlin`. Termine offset-behaftet (`+02:00`).
- **DOI-Token:** kryptografisch zufällig, im Lead **gehasht** gespeichert, TTL bis Termin (≤7 Tage), Single-Use (atomar entwerten). confirm-WF prüft Hash + TTL + „schon verwendet".
- **ICS** (invite): `VCALENDAR`/`METHOD:REQUEST`/`VTIMEZONE Europe/Berlin`/stabile `UID`/`DTSTAMP`/`SEQUENCE`/`ORGANIZER kontakt@manibase.de`, `DTSTART;TZID=Europe/Berlin`, 60 min. Als Base64-Anhang in `sendMail`.

Payload-Kontrakt (aus PR1, verbindlich):
- Anmeldung: `{form:"anmeldung", termin, name, unternehmen, email, kenntnisnahme:true}`
- Interessent: `{form:"interessent", name, unternehmen, email, info, kenntnisnahme:true}`
- Confirm: `{token}` (von `event-confirm.php`)
- confirm-WF-Antwortcodes: 200 ok, 409/410 bereits verwendet/abgelaufen (steuert `event-confirm.php`-Seite).

## Entra/Graph (§entra-graph-rbac.md, aus Master-Spec §6)

- **Kein** Tenant-Admin-Consent für `Mail.Send` (additiv mit RBAC → wirkungslos).
- `Application Mail.Send` **nur** via Exchange Online RBAC for Applications: `New-ServicePrincipal`, Custom Management Scope (Recipient-Filter auf `kontakt@manibase.de`), `New-ManagementRoleAssignment`.
- Rest-Grants/AAPs auditieren. `Test-ServicePrincipalAuthorization` positiv (eigene Mailbox) + negativ (Fremdpostfach), echter Negativversand scheitert.
- Client-Secret nur als verschlüsseltes n8n-Credential; Rotation/Ablauf dokumentiert.

## Abnahme & Go-live (§abnahme-protokoll.md, aus Master-Spec §9)

13 Punkte inkl. nginx-Provisionierung + `nginx -t` + echter 503-Test (koppelt an PR1-Deploy-Gate), DOI-GET-ändert-nichts, ICS-Zeit in Outlook/Apple/Google, Dedup/Race, Crash-after-send→Reconciliation, Graph Positiv/Negativ, Reminder-Filter, Cleanup-Testlauf. Erst nach bestandenem Prod-Smoke: `/etc/manibase/n8n.php` `enabled=true` + Link an die Innungen.

## Entscheidungen/Annahmen (autonom getroffen)

- **JSON-Format:** n8n-Export-Schema (`{name, nodes[], connections{}, settings, ...}`), importierbar über „Import from File". Platzhalter als String-Tokens, in der Doku aufgelöst.
- **Kein separater Outbox-Store:** Versand-Keys als Odoo-Tags/Feld am Lead (kein Zusatzsystem) — proportional zur Veranstaltungsgröße (Master-Spec §12-Vermerk). Crash-after-send → manuelle Reconciliation (dokumentiert), kein Auto-Retry.
- **Reminder-Zeitpunkte** fix im Schedule (4 Cron-Ausdrücke, Europe/Berlin), da nur zwei bekannte Termine.

## Testbarkeit (dieses Repo)

- `jq empty` auf jede Workflow-JSON (valides JSON).
- Struktur-Check je WF: erwartete Node-Typen vorhanden (`n8n-nodes-base.webhook`/`.scheduleTrigger`/`.httpRequest`/`.set`/`.if`), mind. eine Connection, Trigger vorhanden.
- `bash -n` + `shellcheck` (falls vorhanden) auf `smoke-event.sh`.
- Doku-Vollständigkeit: jeder Master-Spec-§9-Abnahmepunkt taucht im Protokoll auf; jeder Config-Wert aus `event.php`/`event-confirm.php` steht in `config-schema.md`.
