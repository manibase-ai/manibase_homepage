# Infotermin n8n-Workflows + Betriebsdoku — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import-startbare n8n-Workflow-Vorlagen (6), Betriebs-/Setup-Doku (Runbook, Config-Schema, Entra/Graph-RBAC, Odoo-Datenmodell, Abnahmeprotokoll) und ein Smoke-Test-Skript + Repo-Verifikations-Skript für den Infotermin-Automations-Stack hinter dem PR1-Proxy.

**Architecture:** Reine Liefer-/Doku-Artefakte (keine ausführbare App hier). Korrektheit der Nebenläufigkeit über Odoo-DB-Unique-Constraints (`x_infotermin_reg`, `x_infotermin_outbox`), DOI als SHA-256-Digest mit 200/409/410-Taxonomie, Mailversand über RBAC-scoped Microsoft Graph, Zeitzone Europe/Berlin, ICS mit VTIMEZONE/UID/SEQUENCE. Ausführbarer Nachweis = Abnahmeprotokoll in der Zielinstanz.

**Tech Stack:** n8n (Export-JSON), Markdown-Runbooks, Bash (`smoke-event.sh`, `verify-n8n.sh`). Verifikation: `jq`, `bash -n`, `shellcheck` (falls vorhanden), Grep-basierte statische Gates.

**Referenz-Spec:** [`docs/superpowers/specs/2026-07-20-infotermin-n8n-design.md`](../specs/2026-07-20-infotermin-n8n-design.md) (v3, final) + Master-Spec v3.

---

## Adaptation-Hinweis (große generierte Artefakte)

Die 6 n8n-JSONs sind umfangreiche Export-Strukturen. Der Plan spezifiziert je Workflow den **Node-Graph** (Nodes, Kernparameter, Connections, Platzhalter) + die **Gate-Checks**; das vollständige JSON entsteht in der Umsetzung und wird durch `verify-n8n.sh` geprüft (valides JSON, erwartete Nodes/Referenzen, keine Inline-Secrets, Platzhalter↔Config-Konsistenz). Das ist die angemessene Form für Artefakte, die hier nicht ausführbar testbar sind.

## File Structure

- Create `docs/n8n/README.md` — Runbook (Reihenfolge, Import, Credentials, Go-live-Gate).
- Create `docs/n8n/config-schema.md` — alle `{{CONFIG:*}}`-Werte, 1:1 mit den JSON-Platzhaltern.
- Create `docs/n8n/entra-graph-rbac.md` — App ohne Tenant-Consent + Exchange RBAC scope + Negativtest.
- Create `docs/n8n/datenmodell-odoo.md` — `x_infotermin_reg` + `x_infotermin_outbox` (Felder, `_sql_constraints`), crm.lead-Spiegel, Statusmodell, ICS-Semantik.
- Create `docs/n8n/abnahme-protokoll.md` — Go-live-Checkliste (Master-Spec §9, 13 Punkte) + Cross-Workflow-Paralleltest + DOI-nach-Cleanup-Test.
- Create `docs/n8n/workflows/wf-1-anmeldung-empfang.json` … `wf-6-cleanup.json`.
- Create `scripts/smoke-event.sh` — curl-Abnahme gegen Prod (Proxy + Endverhalten).
- Create `scripts/verify-n8n.sh` — statische Repo-Gates über die JSONs + Doku-Konsistenz.

---

## Task 1: Repo-Verifikations-Skript `verify-n8n.sh` (zuerst — es ist der Test)

**Files:**
- Create: `scripts/verify-n8n.sh`

- [ ] **Step 1: Skript schreiben** (prüft alles, was im Repo prüfbar ist; failt hart)

```bash
#!/usr/bin/env bash
# Statische Gates für die Infotermin-n8n-Artefakte. Kein Ausführungsbeweis
# (der kommt aus dem Abnahmeprotokoll in der Zielinstanz), sondern Struktur-,
# Konsistenz- und Sicherheits-Checks.
set -euo pipefail
cd "$(dirname "$0")/.."
WF=docs/n8n/workflows
fail=0
note(){ printf '%s\n' "$*"; }
err(){ printf 'FAIL: %s\n' "$*"; fail=1; }

# 1) Alle Workflow-JSONs valid + erwartete Struktur
for f in "$WF"/wf-*.json; do
  jq empty "$f" 2>/dev/null || { err "$f: kein valides JSON"; continue; }
  jq -e '.nodes and (.nodes|length>0)' "$f" >/dev/null || err "$f: keine nodes"
  jq -e '.connections' "$f" >/dev/null || err "$f: keine connections"
  # mind. ein Trigger-Node (webhook | scheduleTrigger | manualTrigger)
  jq -e '[.nodes[].type] | any(test("webhook|scheduleTrigger|manualTrigger"))' "$f" >/dev/null \
    || err "$f: kein Trigger-Node"
done

# 2) Kein Inline-Secret in den JSONs (nur Credential-Referenzen erlaubt)
if grep -RniE '"(client_secret|shared_secret|api_key|password)"\s*:\s*"[^"]+"' "$WF" ; then
  err "Inline-Secret in Workflow-JSON gefunden"
fi

# 3) Webhook-WFs: Secret-Check-Referenz (X-Manibase-Secret) vorhanden
for f in wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-4-interessent; do
  grep -q 'X-Manibase-Secret' "$WF/$f.json" || err "$f: Secret-Header-Check fehlt"
done

# 4) Atomare Claims: Outbox-/Reg-Modell referenziert
grep -q 'x_infotermin_reg' "$WF/wf-1-anmeldung-empfang.json" || err "wf-1: x_infotermin_reg fehlt"
for f in wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-3-reminder wf-5-dankesmail; do
  grep -q 'x_infotermin_outbox' "$WF/$f.json" || err "$f: x_infotermin_outbox (Versand-Claim) fehlt"
done

# 5) Confirm-WF: 200/409/410-Response-Codes vorhanden
for c in 200 409 410; do
  grep -q "\"$c\"\|responseCode.*$c\|$c" "$WF/wf-2-anmeldung-confirm.json" || err "wf-2: Response $c fehlt"
done

# 6) Reminder + ICS + Zeitzone
grep -q 'Europe/Berlin' "$WF/wf-3-reminder.json" || err "wf-3: Europe/Berlin fehlt"
grep -q 'Europe/Berlin' "$WF/wf-6-cleanup.json" || err "wf-6: Europe/Berlin fehlt"
grep -q 'VTIMEZONE\|TZID=Europe/Berlin' "$WF/wf-2-anmeldung-confirm.json" || err "wf-2: ICS VTIMEZONE fehlt"

# 7) Platzhalter <-> config-schema.md Konsistenz
ph=$(grep -rhoE '\{\{CONFIG:[A-Za-z0-9_]+\}\}' "$WF" | sort -u || true)
for p in $ph; do
  key=$(printf '%s' "$p" | sed -E 's/\{\{CONFIG:([A-Za-z0-9_]+)\}\}/\1/')
  grep -q "$key" docs/n8n/config-schema.md || err "Platzhalter $key nicht in config-schema.md dokumentiert"
done

# 8) Cleanup-Löschregel beider Pfade dokumentiert
grep -q 'termin' "$WF/wf-6-cleanup.json" || err "wf-6: Termin-Löschpfad fehlt"

[ "$fail" -eq 0 ] && note "verify-n8n: alle statischen Gates bestanden" || { note "verify-n8n: FEHLGESCHLAGEN"; exit 1; }
exit 0
```

- [ ] **Step 2: `bash -n` + shellcheck**

Run: `bash -n scripts/verify-n8n.sh && (command -v shellcheck >/dev/null && shellcheck scripts/verify-n8n.sh || echo "shellcheck n/a")`
Expected: kein Syntaxfehler; shellcheck ohne Errors (Warnungen ok) oder „n/a".

- [ ] **Step 3: chmod + Commit** (Skript failt jetzt noch, da JSONs fehlen — das ist ok, es ist der Test)

```bash
chmod +x scripts/verify-n8n.sh
git add scripts/verify-n8n.sh
git commit -m "test(infotermin-n8n): statisches Verifikations-Gate verify-n8n.sh"
```

---

## Task 2: `datenmodell-odoo.md` (definiert die Modelle, die die JSONs referenzieren)

**Files:**
- Create: `docs/n8n/datenmodell-odoo.md`

- [ ] **Step 1: Datei schreiben** — vollständige Modell-Definition:
  - `x_infotermin_reg`: Felder `email_norm` (char), `termin` (char/datetime), `status` (selection received/confirmed), `token_digest` (char), `created_at`. `_sql_constraints = [('reg_uniq','unique(email_norm,termin)','...')]`. Anlegen via Odoo Studio (Schritt-für-Schritt) oder kleines Modul (Beispielcode `models.py` mit `_sql_constraints`).
  - `x_infotermin_outbox`: `mail_key` (char), `reg_id` (m2o), `state` (selection sending/sent/failed_unknown), `ts` (datetime). `_sql_constraints unique(mail_key)`.
  - crm.lead-Spiegel: welche Felder/Tags gespiegelt werden.
  - Statusmodell-Diagramm (received→confirmed; Outbox pending/sending/sent/failed_unknown).
  - ICS-Semantik (VCALENDAR/METHOD/VTIMEZONE/UID/DTSTAMP/SEQUENCE/DTSTART TZID/60min) als konkretes Beispiel.
  - Reconciliation-Query (`state=sending AND ts<now-15min`).

- [ ] **Step 2: Konsistenz-Check** — Modellnamen exakt wie in verify-n8n.sh (`x_infotermin_reg`, `x_infotermin_outbox`).

Run: `grep -c 'x_infotermin_reg\|x_infotermin_outbox' docs/n8n/datenmodell-odoo.md`
Expected: ≥ 2.

- [ ] **Step 3: Commit** — `git commit -m "docs(infotermin-n8n): Odoo-Datenmodell (reg/outbox, Constraints, ICS)"`

---

## Task 3: `config-schema.md` (jeder `{{CONFIG:*}}`-Platzhalter)

**Files:**
- Create: `docs/n8n/config-schema.md`

- [ ] **Step 1: Datei schreiben** — Tabelle aller Config-Werte, jeweils `CONFIG:KEY` | Beschreibung | Beispiel | wo verdrahtet. Mindestens: `WEBHOOK_PATH_ANMELDUNG`, `WEBHOOK_PATH_CONFIRM`, `WEBHOOK_PATH_INTERESSENT`, `SHARED_SECRET` (als n8n-Credential/Header-Auth, nicht inline), `ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_APIKEY` (Credential), `GRAPH_CRED` (OAuth2-Credential-Name), `SENDER=kontakt@manibase.de`, `TEAMS_LINK_T1`, `TEAMS_LINK_T2`, `TERMIN_T1=2026-07-29T19:30:00+02:00`, `TERMIN_T2=2026-07-31T19:30:00+02:00`, `RECORDING_URL`, `TEAM_NOTIFY_TO`. Die tatsächlich in den JSONs genutzten Platzhalter müssen alle hier stehen (verify-n8n Gate 7).

- [ ] **Step 2: Commit** — `git commit -m "docs(infotermin-n8n): Config-Schema"`

---

## Task 4: `entra-graph-rbac.md`

**Files:**
- Create: `docs/n8n/entra-graph-rbac.md`

- [ ] **Step 1: Datei schreiben** — exakte Schritte:
  - App-Registrierung anlegen (Client-ID/Secret), **KEIN** Admin-Consent für Graph-`Mail.Send`.
  - Exchange Online RBAC: `Connect-ExchangeOnline`; `New-ServicePrincipal -AppId ... -ObjectId ...`; `New-ManagementScope`/Recipient-Filter auf `kontakt@manibase.de`; `New-ManagementRoleAssignment -App <sp> -Role "Application Mail.Send" -CustomResourceScope <scope>`.
  - Rest-Grants/AAP auditieren + entfernen.
  - `Test-ServicePrincipalAuthorization -Identity <sp> -Resource kontakt@manibase.de` (erlaubt) + Fremdpostfach (verweigert) + echter Negativversand.
  - n8n: OAuth2-Client-Credentials-Credential anlegen (Token-URL, Scope `https://graph.microsoft.com/.default`), Secret nur dort; Rotation/Ablauf notieren.

- [ ] **Step 2: Commit** — `git commit -m "docs(infotermin-n8n): Entra/Graph RBAC-Setup"`

---

## Task 5: Workflow-JSONs wf-1 … wf-6

**Files:**
- Create: `docs/n8n/workflows/wf-1-anmeldung-empfang.json` … `wf-6-cleanup.json`

Jede Datei ist ein valides n8n-Export-Objekt `{"name","nodes":[...],"connections":{...},"settings":{...}}`. Platzhalter als `{{CONFIG:KEY}}` in Parameterwerten. Node-Graphen:

- [ ] **Step 1: wf-1-anmeldung-empfang.json** — Webhook(POST) → IF(Header `X-Manibase-Secret` == `{{CONFIG:SHARED_SECRET}}` sonst Respond 401) → Set(normalisieren email_norm/termin) → HTTP(Odoo `create` `x_infotermin_reg`, Unique-Violation-Zweig → HTTP `search_read` bestehend) → Code(Token generieren, SHA-256-Digest, in reg schreiben) → HTTP(Odoo `create` `x_infotermin_outbox` mail_key `doi:<reg_id>`) → HTTP(Graph sendMail DOI-Link `{{CONFIG:...}}/api/event-confirm.php?t=<token>`) → HTTP(outbox state=sent) → Respond 200.

- [ ] **Step 2: wf-2-anmeldung-confirm.json** — Webhook(POST `{token}`) → IF Secret → Code(SHA-256 des Tokens) → HTTP(Odoo `search_read` reg by token_digest) → IF nicht gefunden → Respond **410** ; IF status==confirmed → Respond **409** ; IF TTL überschritten → Respond **410** ; sonst → HTTP(write status=confirmed **nur wenn received**) → HTTP(create outbox `invite:<reg_id>`; Unique-Violation → skip) → Code(ICS bauen: VTIMEZONE Europe/Berlin, UID, DTSTAMP, SEQUENCE, DTSTART;TZID) → HTTP(Graph sendMail Einladung + ICS-Base64-Anhang + Teams-Link des Termins) → HTTP(outbox sent) → Respond **200**.

- [ ] **Step 3: wf-3-reminder.json** — ScheduleTrigger(Europe/Berlin, 4 Cron: `30 19 28 7 *`, `30 18 29 7 *`, `30 19 30 7 *`, `30 18 31 7 *`) → Set(bestimmt Termin + reminder-Typ aus Datum) → HTTP(Odoo `search_read` reg `status=confirmed AND termin=<T>` ohne outbox-Key) → SplitInBatches → HTTP(create outbox `reminder1d|1h:<reg_id>`; Violation→skip) → HTTP(Graph sendMail Reminder + Teams-Link) → HTTP(outbox sent). settings: Concurrency 1.

- [ ] **Step 4: wf-4-interessent.json** — Webhook(POST) → IF Secret → Set → HTTP(Odoo upsert reg/lead als „interessent", info in Notiz) → HTTP(Graph sendMail interne Notiz an `{{CONFIG:TEAM_NOTIFY_TO}}`) → HTTP(Graph sendMail Bestätigung an Interessent) → Respond 200.

- [ ] **Step 5: wf-5-dankesmail.json** — ManualTrigger → HTTP(Odoo `search_read` reg `status=confirmed`) → SplitInBatches → HTTP(create outbox `thanks:<reg_id>`; Violation→skip) → HTTP(Graph sendMail Danke + `{{CONFIG:RECORDING_URL}}`) → HTTP(outbox sent).

- [ ] **Step 6: wf-6-cleanup.json** — ScheduleTrigger(täglich, Europe/Berlin) → HTTP(Odoo `unlink`/anonymisieren reg `status=received AND (created_at<now-14d OR termin<now)`) → HTTP(reg `status=confirmed AND termin<now-30d` ohne „weiter kontaktieren"-Tag) → HTTP(zugehörige outbox löschen) → Code(Audit-Zählwerte ins Audit-Log, keine PII) → IF Fehler → Graph sendMail Alarm. settings: Concurrency 1.

- [ ] **Step 7: Gate laufen lassen**

Run: `scripts/verify-n8n.sh`
Expected: „verify-n8n: alle statischen Gates bestanden" (Exit 0). Falls FAIL: fehlende Node/Referenz/Platzhalter beheben, bis grün.

- [ ] **Step 8: Commit** — `git commit -m "feat(infotermin-n8n): 6 Workflow-Vorlagen (Import-JSON)"`

---

## Task 6: `smoke-event.sh` (Prod-Abnahme, curl)

**Files:**
- Create: `scripts/smoke-event.sh`

- [ ] **Step 1: Skript schreiben** — parametrisiert (`BASE_URL`, `SECRET` optional), testet gegen die Live-/Staging-URL die 13 Fälle aus Master-Spec §9: falsche Methode→405, Honeypot→200-ohne-Wirkung, ungültige E-Mail→422, Rate-Limit, gültige Anmeldung→200+DOI-Mail (manuelle Bestätigung), GET-Confirm ändert nichts, POST-Confirm→Einladung+ICS-Zeit, Token abgelaufen/verwendet→410/409, Dedup+Race (paralleler Doppel-POST → 1 Lead), Interessent→200, Reminder-Query nur confirmed, Cleanup-Testlauf. Jeder Schritt druckt PASS/FAIL. Read-only wo möglich; schreibende Fälle klar markiert (Testadressen).

- [ ] **Step 2: `bash -n` + shellcheck** — Run: `bash -n scripts/smoke-event.sh && (command -v shellcheck>/dev/null && shellcheck scripts/smoke-event.sh || echo n/a)` — Expected: sauber.

- [ ] **Step 3: chmod + Commit** — `chmod +x scripts/smoke-event.sh && git commit -m "test(infotermin-n8n): Prod-Smoke-Skript"`

---

## Task 7: `abnahme-protokoll.md` + `README.md`

**Files:**
- Create: `docs/n8n/abnahme-protokoll.md`, `docs/n8n/README.md`

- [ ] **Step 1: abnahme-protokoll.md** — nummerierte Go-live-Checkliste: (a) Odoo-Modelle + Constraints angelegt; (b) Entra/Graph RBAC + Negativtest bestanden; (c) Teams-Meetings angelegt, Links in Config; (d) `/etc/manibase/n8n.php` gesetzt, `enabled=false`; (e) nginx-Snippet aktiv, `nginx -t`, echter 503-Test; (f) 6 Workflows importiert + Credentials verdrahtet; (g) `smoke-event.sh` grün; (h) Cross-Workflow-Paralleltest (Doppel-Confirm→1×200/409, 1 Einladung); (i) DOI-Link nach Cleanup→410; (j) ICS-Zeit in Outlook/Apple/Google korrekt; (k) Graph Positiv/Negativ; (l) Cleanup-Testlauf beide Pfade; (m) erst dann `enabled=true` + Link an Innungen. Jede Zeile abhakbar.

- [ ] **Step 2: README.md** — Runbook: Reihenfolge (datenmodell → entra → config → import → smoke → abnahme), Import-Anleitung („Import from File" je WF), Credential-Zuordnung, Verweise auf die anderen Docs, Kill-Switch/`enabled`, Verweis auf PR1-Deploy-Gate.

- [ ] **Step 3: Vollständigkeits-Check** — jeder Master-Spec-§9-Punkt im Protokoll?

Run: `grep -ciE 'nginx|503|honeypot|dedup|cleanup|graph|reminder|ics|409|410|parallel' docs/n8n/abnahme-protokoll.md`
Expected: ≥ 8 (alle Kernpunkte referenziert).

- [ ] **Step 4: Commit** — `git commit -m "docs(infotermin-n8n): Abnahmeprotokoll + README-Runbook"`

---

## Task 8: Gesamt-Verifikation

- [ ] **Step 1: verify-n8n grün** — Run: `scripts/verify-n8n.sh` — Expected: alle Gates bestanden.
- [ ] **Step 2: Alle JSON valid** — Run: `for f in docs/n8n/workflows/*.json; do jq empty "$f" && echo "ok $f"; done` — Expected: nur „ok".
- [ ] **Step 3: Skripte sauber** — Run: `bash -n scripts/verify-n8n.sh && bash -n scripts/smoke-event.sh && echo OK`.
- [ ] **Step 4: Platzhalter-Konsistenz** — Run: `scripts/verify-n8n.sh` (Gate 7) — Expected: keine undokumentierten Platzhalter.

---

## Self-Review (gegen Spec v3)

- **Abdeckung:** 6 Workflows (Task 5), Odoo-Datenmodell mit Constraints (Task 2), Config (Task 3), Entra/Graph-RBAC (Task 4), Abnahme+Runbook (Task 7), Smoke (Task 6), statische Gates (Task 1). DB-atomare Claims, DOI-410-Taxonomie, Cleanup-Doppelpfad, ICS/Zeitzone, kein Inline-Secret — alle in den Tasks referenziert.
- **Testbarkeit:** `verify-n8n.sh` ist der Repo-Test (Struktur/Konsistenz/Sicherheit); ausführbarer Nachweis via Abnahmeprotokoll (Zielinstanz) — ehrlich abgegrenzt.
- **Keine Platzhalter im Plan-Sinn:** verify-Skript vollständig inline; JSON-Node-Graphen präzise spezifiziert (Adaptation-Hinweis oben); Doku-Inhalte konkret gelistet.
