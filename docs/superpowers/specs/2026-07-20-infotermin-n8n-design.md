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
  datenmodell-odoo.md           Odoo-Modelle x_infotermin_reg + x_infotermin_outbox (mit
                                _sql_constraints), crm.lead-Spiegel, Statusmodell, ICS-Semantik
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
- **DB-atomare Claims statt n8n-Serialisierung (Kern-Invariante, Review-Finding R1.1+R2.1):** n8n „Limit execution to 1" serialisiert nur **innerhalb eines** Workflows, **nicht** zwischen Confirm/Reminder/Cleanup — die geben also **keine** workflowübergreifende Atomizität. Die Atomizität kommt daher aus **Odoo-Datenbank-Constraints**, nicht aus n8n. Zwei dedizierte Odoo-Modelle (per Odoo Studio / kleines Modul anzulegen, §datenmodell):
  - **`x_infotermin_reg`** (Registrierung, Quelle der Wahrheit für den Status): Felder `email_norm`, `termin`, `status` (`received`/`confirmed`), `token_digest`, `created_at`. **`_sql_constraints`: unique(email_norm, termin)**. WF-1 macht `create`; eine parallele Doublette scheitert an der DB-Constraint → WF fängt die Unique-Violation ab und liest den bestehenden Datensatz (idempotent). Kein `search→create`-Race.
  - **`x_infotermin_outbox`** (Versand-Jobs, je Mail): Felder `mail_key`, `reg_id`, `state` (`sending`/`sent`/`failed_unknown`), `ts`. **`_sql_constraints`: unique(mail_key)** mit `mail_key = "<typ>:<reg_id>"` (`doi`/`invite`/`reminder1d`/`reminder1h`/`thanks`). **Claim = `create`**: gelingt der Insert → dieser Lauf sendet; wirft er Unique-Violation → ein anderer Lauf hat den Versand bereits beansprucht → **überspringen**. Das ist workflowübergreifend atomar (DB-Ebene), unabhängig davon, welcher der sechs Workflows gerade läuft.
- **Versandablauf:** Outbox-Claim (`create` mail_key, `state=sending`) → Graph-`sendMail` → `write state=sent, ts`. Abbruch nach Graph-Erfolg vor `sent`-Write → Row bleibt `sending` → **kein Auto-Retry**, Reconciliation-Query (`state=sending AND ts<now-15min`) im Betrieb/Abnahme.
- **crm.lead = CRM-Spiegel** für den Vertrieb (aus `x_infotermin_reg` erzeugt/aktualisiert), **nicht** der race-kritische Speicher.
- **n8n Concurrency 1** an allen sechs Workflows zusätzlich als Defense-in-Depth (reduziert Last/Kollisionen), aber **nicht** der Korrektheitsmechanismus.
- **Cleanup-Schutz:** Cleanup läuft zeitlich getrennt (nächtlich) und löscht nur nach den Fristen; ein `received`-Datensatz in aktiver Bestätigung ist entweder jung (nicht >14d) oder hat Zukunfts-Termin — der Grenzfall „späte Bestätigung nach Cleanup" wird über die 410-Antwort abgefangen (siehe DOI-Token unten), nicht über eine Sperre.
- **Graph-Versand** über HTTP-Request-Node (POST `https://graph.microsoft.com/v1.0/users/kontakt@manibase.de/sendMail`) mit OAuth2-Credential (Client-Credentials, RBAC-scoped, §entra-graph-rbac). **Kein** Secret im JSON.
- **Zeitzone:** Schedule-Trigger explizit `Europe/Berlin`. Termine offset-behaftet (`+02:00`).
- **DOI-Token (Review-Finding R1.2+R2.2):** kryptografisch zufällig, **≥128 bit Entropie**; nur als **SHA-256-Digest** in `x_infotermin_reg.token_digest` gespeichert (nie Klartext), **an Registrierung + Termin gebunden**. **TTL** = bis zum Termin, längstens 7 Tage. **Single-Use** über atomaren Claim: confirm-WF sucht den Digest und setzt `status=confirmed` **bedingt** (`write` nur wenn noch `received`); der Insert des `invite`-Outbox-Keys (unique) entscheidet, welcher paralleler Lauf tatsächlich die Einladung sendet. **Antwort-Taxonomie (widerspruchsfrei zu Cleanup, R2.2):**
  - **200** = jetzt bestätigt (Digest gefunden, `received`, TTL ok).
  - **409** = bereits bestätigt (Digest gefunden, schon `confirmed`).
  - **410** = abgelaufen **ODER Digest nicht (mehr) gefunden** (z. B. nach Cleanup gelöscht) — bewusst zusammengefasst als „Link ungültig/abgelaufen", damit ein legitimer alter Link nach dem Löschen **nicht** in 5xx fällt und zugleich nicht verraten wird, ob der Token je existierte.
  - **5xx** nur bei echten technischen Fehlern (Odoo/Graph nicht erreichbar).
  `event-confirm.php` (PR1) mappt 409/410 bereits auf die neutrale „bereits genutzt/abgelaufen"-Seite; 200 auf „bestätigt". **Abnahmetest:** DOI-Link nach Cleanup aufrufen → 410 (kein 5xx).
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
- Struktur-Check je WF: erwartete Node-Typen vorhanden (`n8n-nodes-base.webhook`/`.scheduleTrigger`/`.httpRequest`/`.set`/`.if`/`.code`), Trigger vorhanden, mind. eine Connection. **Hinweis:** Concurrency 1 ist Defense-in-Depth, NICHT der Korrektheitsmechanismus (der sind die Odoo-Unique-Constraints) — das statische Gate behandelt es daher nur als Empfehlung und behauptet keine Atomizität daraus. Stattdessen prüft das Gate, dass die Versand-WFs den **Outbox-Claim per `create` auf `x_infotermin_outbox`** referenzieren (Grep auf Modellname/`mail_key`) und WF-1 ein `create` auf `x_infotermin_reg` mit Unique-Violation-Fehlerzweig hat.
- **Platzhalter-Konsistenz:** jeder `{{CONFIG:x}}` in den JSONs hat genau einen Eintrag in `config-schema.md` und umgekehrt (Skript-Check) → keine undokumentierten/unaufgelösten Platzhalter.
- **Kein Inline-Secret:** grep stellt sicher, dass Graph-Client-Secret/Shared-Secret **nicht** im JSON stehen (nur Credential-Referenzen).
- **Response-Code-Assertions:** confirm-WF enthält die Zweige/Response-Nodes für 200/409/410; Webhook-WFs den 401-Zweig bei Secret-Mismatch.
- **Failure-Path-Präsenz:** je Versand-WF ein `failed-unknown`-Pfad/Fehlerzweig vorhanden.
- `bash -n` + `shellcheck` (falls vorhanden) auf `smoke-event.sh`.
- Doku-Vollständigkeit: jeder Master-Spec-§9-Abnahmepunkt steht im Protokoll; jeder Config-Wert aus `event.php`/`event-confirm.php` in `config-schema.md`.

**Bewusst NICHT im Repo** (unverhältnismäßig für ein statisches Marketing-Site-Repo ohne CI-Testinfrastruktur): eine echte n8n-Instanz in CI hochfahren, importieren und gegen Mock-Odoo/Mock-Graph ausführen. Der ausführbare Nachweis wird **einmalig in der Zielinstanz** über das Abnahmeprotokoll erbracht (Import + Mock-/Testlauf-Schritte dort beschrieben), bevor `enabled=true` gesetzt wird. Das ist die ehrliche Gate-Verortung: Repo = Struktur/Konsistenz, Zielinstanz = Ausführung.

**Dynamischer Pflicht-Abnahmetest (Zielinstanz, wegen R2.1):** ein **paralleler Cross-Workflow-Test** — denselben confirm-Request doppelt/parallel abfeuern (→ genau 1× 200, sonst 409, genau 1 Einladung dank Unique `mail_key`) und Cleanup gleichzeitig mit einer laufenden Bestätigung (→ keine inkonsistente Registrierung; späte Bestätigung nach Cleanup → 410). Steht als eigener Punkt im Abnahmeprotokoll.

## §Review — eingearbeitete Findings (Runde 1)

1. **[P1] Outbox nicht atomar** → Concurrency 1 an ALLEN sechs Workflows (serialisierter Claim statt verteiltem CAS), konkretes Outbox-Zustandsmodell (`pending→sending→sent|failed-unknown`) + Reconciliation.
2. **[P1] DOI/Upsert TOCTOU** → Concurrency 1 auch für Anmelde-/Confirm-Webhook; Token als SHA-256-Digest, ≥128 bit, an Lead+Termin gebunden, 409=verbraucht/410=abgelaufen exakt.
3. **[P1] Cleanup-Frist unvollständig** → `received AND (created<now-14d OR termin<now)` + `confirmed AND termin<now-30d`, lead-unabhängiges Audit, zwei Abnahmetests.
4. **[P1] Repo-Checks belegen nicht „import-fertig"** → Umbenannt in „import-startbare Vorlagen"; stärkere statische Gates (Platzhalter↔Config-Konsistenz, kein Inline-Secret, Response-Code-/Failure-Path-Asserts, n8n-Version gepinnt). Volles n8n-in-CI bewusst außerhalb dieses Repos; Abnahmeprotokoll = verbindliches ausführbares Gate.

## §Review — eingearbeitete Findings (Runde 2, abschließend)

1. **[P1] Concurrency 1 nicht workflowübergreifend** → Korrektheit kommt jetzt aus Odoo-DB-Constraints: `x_infotermin_reg` unique(email_norm, termin) + `x_infotermin_outbox` unique(mail_key); Claim = `create`, Unique-Violation = überspringen. n8n-Concurrency nur noch Defense-in-Depth. Statisches Gate prüft Modell-/mail_key-Referenzen statt fälschlich `executionOrder`; dynamischer Cross-Workflow-Paralleltest im Abnahmeprotokoll.
2. **[P1] Cleanup vs. 410** → Antwort-Taxonomie konsistent: Digest nicht gefunden (auch nach Cleanup) → **410**, nicht 5xx; 409 = bereits bestätigt; Abnahmetest „DOI-Link nach Cleanup → 410".

**Spec-Review-Phase abgeschlossen** (harte 2-Runden-Grenze). Zusatzkosten bewusst akzeptiert: zwei kleine Odoo-Custom-Modelle (Odoo Studio) statt einer Feld-Notiz — der korrekte Preis für echte Atomizität; dokumentiert in datenmodell-odoo.md.
