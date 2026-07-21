# Abnahmeprotokoll — Infotermin (verbindliches Go-live-Gate)

Der einzige belastbare Ausführungsnachweis. **Alle** Punkte müssen abgehakt sein, bevor
`enabled=true` gesetzt und der Link an die Innungen gegeben wird. Jeder Punkt: Setup /
erwarteter Zustand / erwarteter HTTP-Code / erwartete Mailanzahl.

- [ ] **`odoo-models`** — `x_infotermin_reg`, `x_infotermin_outbox`, `x_infotermin_audit` per
  Odoo **Studio** mit den Feldern aus `datenmodell-odoo.md` angelegt (Odoo Online: **keine**
  `_sql_constraints`/Methoden). Dedup/Atomizität kommt aus n8n-Concurrency 1 + search-before-create.
- [ ] **`graph-rbac`** — Entra-App ohne Tenant-Consent; Exchange RBAC scope auf `kontakt@manibase.de`;
  `Test-ServicePrincipalAuthorization` positiv (eigene Mailbox) + negativ (Fremdpostfach); echter
  Negativversand scheitert.
- [ ] **`meeting-links`** — zwei Zoom-Meetings angelegt, Join-Links als `MEETING_LINK_T1/T2` in Config.
- [ ] **`config-disabled`** — `/etc/manibase/n8n.php` gesetzt (Secret, Webhook-URLs), `enabled=false`.
- [ ] **`nginx-503`** — nginx-Snippet (PR1) im vhost aktiv, `nginx -t` ok; echter
  `POST /api/event.php` (ohne scharfe Config) → **503** (nicht 404, nicht PHP-Quelltext).
- [ ] **`import-wire`** — 6 Workflows importiert; Credentials (Graph-OAuth2) + `{{CONFIG:*}}` ersetzt;
  je zustandsänderndem Workflow (wf-1/2/3/5/6) **„Limit execution to 1" (Concurrency 1)** im
  n8n-UI gesetzt — das ist hier der **Serialisierungs-Mechanismus** (nicht nur Defense-in-Depth).
- [ ] **`smoke`** — `scripts/smoke-event.sh` gegen die Zielumgebung grün (alle curl-Fälle).
- [ ] **`dup-anmeldung`** — zweite Anmeldung mit gleicher E-Mail+Termin → genau **1** gültiger
  DOI-Link, **keine** zweite DOI-Mail (search-before-create auf reg + doi-Outbox `sent`).
- [ ] **`parallel-confirm`** — denselben Bestätigungs-Token **parallel** doppelt abfeuern →
  genau **1×200**, der andere **409**; genau **1** Einladung. Mechanismus: **Concurrency 1**
  serialisiert die beiden Läufe, der zweite findet die invite-Outbox-Row → 409.
- [ ] **`doi-after-cleanup`** — Registrierung per Cleanup löschen, dann DOI-Link aufrufen →
  **410** (nicht 5xx), neutrale „Link ungültig/abgelaufen"-Seite.
- [ ] **`crash-reconcile`** — Versand-Abbruch nach Graph-Erfolg vor `sent`-Write simulieren →
  Outbox-Row bleibt `sending`; Reconciliation-Query (`state=sending AND ts<now-15min`) findet sie;
  **kein** Auto-Retry/Doppelmail; manuelle Auflösung dokumentiert.
- [ ] **`presend-crash-wf1`** — Abbruch in WF-1 **vor** dem doi-Claim → spätere Anmeldung findet
  keine doi-Outbox-Row → Recovery re-sendet → **nutzbarer DOI-Link**, keine Dauersperre. Abbruch
  **nach** dem Claim (Row `sending`) → Recovery re-sendet NICHT (unbekannt) → idempotent 200;
  Reconciliation löscht die stale Row, danach ist ein Retry wieder sendefähig.
- [ ] **`presend-crash-wf2`** — Abbruch in WF-2 nach `invite`-Claim vor Versand → Retry findet
  die `sending`-Row → **409** (kein Doppelversand). Nach **Reconciliation** (stale Row löschen)
  liefert der nächste Retry **200 + Einladung**. (Best-Effort auf Odoo Online; harte Inline-
  Recovery nur mit Odoo.sh-Modul, s. `datenmodell-odoo.md`.)
- [ ] **`cleanup-confirm-race`** — **BEST-EFFORT (akzeptiertes Restrisiko, Odoo Online).** Ein
  workflow-übergreifender Mutex ist ohne DB-Constraints/Methode nicht möglich; das ist bewusst
  akzeptiert. Absicherung durch: (a) Cleanup läuft **nachts 03:00** (`wf-6`), außerhalb des
  Abend-Event-/Bestätigungsfensters; (b) die Löschkriterien treffen einen *gerade* bestätigenden
  Datensatz praktisch nie (unbestätigt+jung ODER Termin schon vorbei — beides schließt die aktive
  Bestätigungsphase aus). Prüfen: Cleanup-Zeit ≠ erwartete Bestätigungszeiten; späte Bestätigung
  nach Löschung → `410` (wie `doi-after-cleanup`), **keine** Doppel-/Fehlmail. Harte Garantie nur
  mit Odoo.sh-Modul (Upgrade-Pfad in `datenmodell-odoo.md`).
- [ ] **`ics-clients`** — ICS-Anhang öffnet in Outlook, Apple Calendar und Google Calendar als
  **19:30 Europe/Berlin** (nicht um 2 h verschoben).
- [ ] **`cleanup-both-paths`** — Cleanup-Testlauf für `created_at < now-14d` **und** separat
  `termin < now`; Audit-Zählwerte ohne PII geschrieben; Fehler-Alarm an `TEAM_NOTIFY_TO` getestet.
- [ ] **`go-live`** — erst nach allen obigen: `/etc/manibase/n8n.php` `enabled=true`; finaler
  Live-Smoke; dann Link an die Innungen.
