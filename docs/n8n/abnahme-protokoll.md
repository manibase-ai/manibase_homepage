# Abnahmeprotokoll — Infotermin (verbindliches Go-live-Gate)

Der einzige belastbare Ausführungsnachweis. **Alle** Punkte müssen abgehakt sein, bevor
`enabled=true` gesetzt und der Link an die Innungen gegeben wird. Jeder Punkt: Setup /
erwarteter Zustand / erwarteter HTTP-Code / erwartete Mailanzahl.

- [ ] **`odoo-models`** — `x_infotermin_reg` (unique(email_norm, termin)) und `x_infotermin_outbox`
  (unique(mail_key)) angelegt; Constraints greifen (Test: zweimal identisch anlegen → 2. schlägt fehl).
- [ ] **`graph-rbac`** — Entra-App ohne Tenant-Consent; Exchange RBAC scope auf `kontakt@manibase.de`;
  `Test-ServicePrincipalAuthorization` positiv (eigene Mailbox) + negativ (Fremdpostfach); echter
  Negativversand scheitert.
- [ ] **`teams-links`** — zwei Teams-Meetings angelegt, Join-Links als `TEAMS_LINK_T1/T2` in Config.
- [ ] **`config-disabled`** — `/etc/manibase/n8n.php` gesetzt (Secret, Webhook-URLs), `enabled=false`.
- [ ] **`nginx-503`** — nginx-Snippet (PR1) im vhost aktiv, `nginx -t` ok; echter
  `POST /api/event.php` (ohne scharfe Config) → **503** (nicht 404, nicht PHP-Quelltext).
- [ ] **`import-wire`** — 6 Workflows importiert; Credentials (Graph-OAuth2) + `{{CONFIG:*}}` ersetzt;
  je Workflow „Limit execution to 1" (Concurrency 1) gesetzt (Defense-in-Depth).
- [ ] **`smoke`** — `scripts/smoke-event.sh` gegen die Zielumgebung grün (alle curl-Fälle).
- [ ] **`dup-anmeldung`** — zweite Anmeldung mit gleicher E-Mail+Termin → genau **1** gültiger
  DOI-Link, **keine** zweite DOI-Mail (reg-Constraint + doi-Outbox `sent`).
- [ ] **`parallel-confirm`** — denselben Bestätigungs-Token **parallel** doppelt abfeuern →
  genau **1×200**, der andere **409**; genau **1** Einladung (invite-Outbox-Unique = CAS).
- [ ] **`doi-after-cleanup`** — Registrierung per Cleanup löschen, dann DOI-Link aufrufen →
  **410** (nicht 5xx), neutrale „Link ungültig/abgelaufen"-Seite.
- [ ] **`crash-reconcile`** — Versand-Abbruch nach Graph-Erfolg vor `sent`-Write simulieren →
  Outbox-Row bleibt `sending`; Reconciliation-Query (`state=sending AND ts<now-15min`) findet sie;
  **kein** Auto-Retry/Doppelmail; manuelle Auflösung dokumentiert.
- [ ] **`presend-crash-wf1`** — Abbruch in WF-1 nach reg-`create` vor DOI-`sent`; spätere Anmeldung
  (email+termin) → liefert einen **nutzbaren DOI-Link** (Recovery), **keine** Dauersperre.
- [ ] **`presend-crash-wf2`** — Abbruch in WF-2 nach `invite`-Claim vor Status-Write; Retry →
  **200 + Einladung** (Read-after-Conflict), **kein** Dauer-409.
- [ ] **`cleanup-confirm-race`** — Cleanup läuft gleichzeitig mit aktiver Bestätigung → keine
  inkonsistente Registrierung; späte Bestätigung nach Löschung → Verhalten wie `doi-after-cleanup`
  (410). Erwartete DB-Zustände + Mailanzahl notiert.
- [ ] **`ics-clients`** — ICS-Anhang öffnet in Outlook, Apple Calendar und Google Calendar als
  **19:30 Europe/Berlin** (nicht um 2 h verschoben).
- [ ] **`cleanup-both-paths`** — Cleanup-Testlauf für `created_at < now-14d` **und** separat
  `termin < now`; Audit-Zählwerte ohne PII geschrieben; Fehler-Alarm an `TEAM_NOTIFY_TO` getestet.
- [ ] **`go-live`** — erst nach allen obigen: `/etc/manibase/n8n.php` `enabled=true`; finaler
  Live-Smoke; dann Link an die Innungen.
