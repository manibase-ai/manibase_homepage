# Design: Infotermin n8n-Workflows + Betriebs-/Setup-Doku (Teilfeature 2)

**Datum:** 2026-07-20
**Status:** Entwurf v2 (autonomer Workflow, abgeleitet aus Master-Spec v3; Codex-Design-Review Runde 1 eingearbeitet)
**Master-Spec:** [`2026-07-20-veranstaltung-anmeldung-design.md`](2026-07-20-veranstaltung-anmeldung-design.md) (v3, final) — §3/§5/§6/§9 definieren die n8n-Seite. Diese Spec konkretisiert die **Lieferartefakte**.

## Ziel

Die serverseitige Automation hinter dem in PR1 gelieferten Proxy: n8n-Workflows (als Import-JSON), die Betriebs-/Setup-Doku (Entra/Graph-RBAC, Teams, nginx-Provisionierung, Config, Odoo, DOI/Outbox/ICS/Zeitzone) und ein Smoke-Test-Skript + Abnahmeprotokoll. Der Kunde (Nikolaus, Tenant-Admin) importiert/konfiguriert; dieser PR liefert die Bausteine + das Runbook.

## Realistische Scope-Grenze (wichtig, ehrlich)

Es gibt hier **keine** n8n-Instanz, keine echten Odoo-Feld-/Tag-IDs, keine Credentials. Daher:

- Die **Workflow-JSONs sind import-STARTBARE Vorlagen** (nicht „fertig laufend"; valides n8n-Format, `jq`-prüfbar) mit klar markierten Platzhaltern (`{{CONFIG:...}}`) für Credentials, Webhook-Pfade, Odoo-IDs, Teams-Links. Sie bilden die Master-Spec-§3-Logik ab, müssen aber in der Zielinstanz verdrahtet und getestet werden. **Der einzige belastbare Ausführungsnachweis ist das Abnahmeprotokoll (§abnahme) in der Zielumgebung** — es ist das verbindliche, ausführbare Go-live-Gate, nicht die Repo-Checks (Review-Finding 4).
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
    wf-6-cleanup.json                Schedule (täglich): received AND (created<now-14d OR
                                     termin<now); confirmed AND termin<now-30d; löschen/
                                     anonymisieren, lead-unabhängiges Audit-Log
scripts/
  smoke-event.sh                curl-Abnahme gegen die Zielumgebung (13 Fälle, Master-Spec §9)
```

## Workflow-Design (verdichtet aus Master-Spec §3)

Gemeinsame Konventionen in allen Workflows:

- **Secret-Check** (Webhook-WFs): erster Node prüft Header `X-Manibase-Secret` gegen Config; Mismatch → 401.
- **Odoo JSON-RPC** über HTTP-Request-Nodes (`authenticate` → `execute_kw`), Muster wie `newsletter.php`. Upsert = `search_read` → `write`/`create`.
- **Serialisierung statt verteiltem CAS (Kern-Invariante, Review-Finding 1+2):** Odoo-RPC bietet keinen einfachen atomaren Compare-and-swap über `search_read → write/create`. Statt einen verteilten Outbox-Store mit DB-Unique-Constraint zu bauen (unverhältnismäßig für wenige Dutzend Anmeldungen), laufen **ALLE zustandsändernden Workflows** (Anmeldung-Empfang, Anmeldung-Confirm, Reminder, Interessent, Dankes, Cleanup) mit n8n-Setting **„Limit execution to 1"** (Concurrency 1). Dadurch ist jeder „prüfen → schreiben"-Schritt de facto serialisiert = atomar; zwei gleichzeitige Requests können nicht beide denselben Lead anlegen oder denselben Token verbrauchen. Das ist die bewusst gewählte, dem Maßstab angemessene Umsetzung der Master-Spec-Invariante.
- **Outbox-Zustandsmodell (persistent, je Mail-Key):** pro Lead und Mailtyp (`doi`, `invite`, `reminder1d`, `reminder1h`, `thanks`) ein Zustand `pending → sending → sent | failed-unknown` mit Zeitstempel (als strukturiertes Feld/Notiz am Lead, z. B. JSON im `x_mail_state`-Feld). Ablauf je Versand: Zustand lesen; nur wenn `pending`/leer → auf `sending` schreiben → Graph-`sendMail` → auf `sent` (mit Zeit). Bei Abbruch nach Graph-Erfolg vor `sent`-Write bleibt `sending`/`failed-unknown` → **kein Auto-Retry**, sondern Reconciliation (Abnahme/Betrieb, §abnahme). Dank Concurrency 1 kein Doppel-Claim.
- **Dedup-Key:** normalisierte E-Mail (lowercase/trim) **+ Termin**; `search_read` vor `create`; die Serialisierung (Concurrency 1) verhindert die Race, da Odoo-RPC keine einfache Unique-Constraint-Durchsetzung bietet.
- **Graph-Versand** über HTTP-Request-Node (POST `https://graph.microsoft.com/v1.0/users/kontakt@manibase.de/sendMail`) mit OAuth2-Credential (Client-Credentials, RBAC-scoped, §entra-graph-rbac). **Kein** Secret im JSON.
- **Zeitzone:** Schedule-Trigger explizit `Europe/Berlin`. Termine offset-behaftet (`+02:00`).
- **DOI-Token (Review-Finding 2):** kryptografisch zufällig, **≥128 bit Entropie**; im Lead nur als **SHA-256-Digest** gespeichert (nie Klartext), **an Lead + Termin gebunden**. **TTL** = bis zum Termin, längstens 7 Tage. **Single-Use** über die serialisierte confirm-WF (Concurrency 1): Digest suchen → wenn gefunden und nicht verbraucht und nicht abgelaufen → als verbraucht markieren + Status `confirmed` + Einladung. **Exakte Antwortzuordnung:** 200 = jetzt bestätigt; **409 = Token bereits verbraucht**; **410 = Token abgelaufen (TTL überschritten)**; sonstiger Fehler → 5xx. `event-confirm.php` (PR1) mappt 409/410 auf „bereits genutzt/abgelaufen".
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

## Cleanup-Löschlogik (verbindlich, Review-Finding 3)

WF-6 (täglich, Europe/Berlin, Concurrency 1) löscht/anonymisiert:

- **Unbestätigte:** `registration_status = received AND (created_at < now-14d OR termin < now)` — also spätestens 14 Tage nach Anmeldung **oder** sobald der gewählte Termin vorbei ist (was zuerst eintritt). So bleibt eine kurz vor dem Event eingegangene, unbestätigte Anmeldung nach dem Event nicht liegen.
- **Bestätigte:** `registration_status = confirmed AND termin < now-30d` (30 Tage nach dem Termin), sofern kein Ausschluss-Tag „weiter kontaktieren" gesetzt ist.
- **Audit-Nachweis lead-unabhängig:** je Lauf nur **Zählwerte** (Anzahl gelöscht/anonymisiert je Kategorie) + Zeitstempel in ein separates Audit-Log/Notiz schreiben (keine personenbezogenen Daten im Audit). Fehler → interne Alarm-Mail.
- **Zwei getrennte Abnahmetests** (§abnahme): Pfad „>14 Tage" und Pfad „Termin vorbei" je mit Testdaten.

## Entscheidungen/Annahmen (autonom getroffen)

- **JSON-Format:** n8n-Export-Schema (`{name, nodes[], connections{}, settings, ...}`), importierbar über „Import from File". Platzhalter als String-Tokens, in der Doku aufgelöst.
- **Kein separater Outbox-Store:** Versand-Keys als Odoo-Tags/Feld am Lead (kein Zusatzsystem) — proportional zur Veranstaltungsgröße (Master-Spec §12-Vermerk). Crash-after-send → manuelle Reconciliation (dokumentiert), kein Auto-Retry.
- **Reminder-Zeitpunkte** fix im Schedule (4 Cron-Ausdrücke, Europe/Berlin), da nur zwei bekannte Termine.

## Testbarkeit (dieses Repo)

Was **im Repo** prüfbar ist (statische Gates, kein Ausführungsbeweis, Review-Finding 4):

- `jq empty` auf jede Workflow-JSON (valides JSON) **und n8n-Version gepinnt** (`meta.instanceId`/erwartete `typeVersion` je Node dokumentiert, damit klar ist, gegen welche n8n-Version importiert wird).
- Struktur-Check je WF: erwartete Node-Typen vorhanden (`n8n-nodes-base.webhook`/`.scheduleTrigger`/`.httpRequest`/`.set`/`.if`/`.code`), Trigger vorhanden, mind. eine Connection, **Concurrency-1-Setting** (`settings.executionOrder`/`executionTimeout` bzw. `settings` mit Limit) an allen sechs.
- **Platzhalter-Konsistenz:** jeder `{{CONFIG:x}}` in den JSONs hat genau einen Eintrag in `config-schema.md` und umgekehrt (Skript-Check) → keine undokumentierten/unaufgelösten Platzhalter.
- **Kein Inline-Secret:** grep stellt sicher, dass Graph-Client-Secret/Shared-Secret **nicht** im JSON stehen (nur Credential-Referenzen).
- **Response-Code-Assertions:** confirm-WF enthält die Zweige/Response-Nodes für 200/409/410; Webhook-WFs den 401-Zweig bei Secret-Mismatch.
- **Failure-Path-Präsenz:** je Versand-WF ein `failed-unknown`-Pfad/Fehlerzweig vorhanden.
- `bash -n` + `shellcheck` (falls vorhanden) auf `smoke-event.sh`.
- Doku-Vollständigkeit: jeder Master-Spec-§9-Abnahmepunkt steht im Protokoll; jeder Config-Wert aus `event.php`/`event-confirm.php` in `config-schema.md`.

**Bewusst NICHT im Repo** (unverhältnismäßig für ein statisches Marketing-Site-Repo ohne CI-Testinfrastruktur): eine echte n8n-Instanz in CI hochfahren, importieren und gegen Mock-Odoo/Mock-Graph ausführen. Der ausführbare Nachweis wird **einmalig in der Zielinstanz** über das Abnahmeprotokoll erbracht (Import + Mock-/Testlauf-Schritte dort beschrieben), bevor `enabled=true` gesetzt wird. Das ist die ehrliche Gate-Verortung: Repo = Struktur/Konsistenz, Zielinstanz = Ausführung.

## §Review — eingearbeitete Findings (Runde 1)

1. **[P1] Outbox nicht atomar** → Concurrency 1 an ALLEN sechs Workflows (serialisierter Claim statt verteiltem CAS), konkretes Outbox-Zustandsmodell (`pending→sending→sent|failed-unknown`) + Reconciliation.
2. **[P1] DOI/Upsert TOCTOU** → Concurrency 1 auch für Anmelde-/Confirm-Webhook; Token als SHA-256-Digest, ≥128 bit, an Lead+Termin gebunden, 409=verbraucht/410=abgelaufen exakt.
3. **[P1] Cleanup-Frist unvollständig** → `received AND (created<now-14d OR termin<now)` + `confirmed AND termin<now-30d`, lead-unabhängiges Audit, zwei Abnahmetests.
4. **[P1] Repo-Checks belegen nicht „import-fertig"** → Umbenannt in „import-startbare Vorlagen"; stärkere statische Gates (Platzhalter↔Config-Konsistenz, kein Inline-Secret, Response-Code-/Failure-Path-Asserts, n8n-Version gepinnt). Volles n8n-in-CI bewusst außerhalb dieses Repos; Abnahmeprotokoll = verbindliches ausführbares Gate.
