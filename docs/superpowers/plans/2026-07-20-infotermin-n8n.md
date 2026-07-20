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
# Strikte statische Gates für die Infotermin-n8n-Artefakte. Kein Ausführungs-
# beweis (der kommt aus dem Abnahmeprotokoll in der Zielinstanz), aber echte
# jq-Struktur-, Konsistenz- und Sicherheits-Checks, die semantisch kaputte
# Vorlagen NICHT grün melden.
set -euo pipefail
cd "$(dirname "$0")/.."
WF=docs/n8n/workflows
SCHEMA=docs/n8n/config-schema.md
N8N_MIN_VERSION="1.60.0"   # Vorlagen gegen diese n8n-Version erstellt (Version-Pin)
fail=0
err(){ printf 'FAIL: %s\n' "$*"; fail=1; }
note(){ printf '%s\n' "$*"; }

EXPECTED=(wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-3-reminder wf-4-interessent wf-5-dankesmail wf-6-cleanup)

# 0) Genau die sechs erwarteten Dateien, keine zusätzlichen
for n in "${EXPECTED[@]}"; do [ -f "$WF/$n.json" ] || err "$n.json fehlt"; done
count=$(find "$WF" -maxdepth 1 -name '*.json' | wc -l | tr -d ' ')
[ "$count" = "6" ] || err "erwartet 6 Workflow-JSONs, gefunden $count"

# helper
has_type(){ jq -e --arg t "$2" 'any(.nodes[]; .type==$t)' "$WF/$1.json" >/dev/null 2>&1; }
sval(){ jq -e --arg s "$2" '[.. | strings] | any(contains($s))' "$WF/$1.json" >/dev/null 2>&1; }
resp_code(){ jq -e --arg c "$2" 'any(.nodes[]; (.type|test("respondToWebhook")) and ((.parameters.responseCode // empty|tostring)==$c))' "$WF/$1.json" >/dev/null 2>&1; }

# 1) Valides JSON + Grundstruktur + typeVersion an jedem Node (Version-Pin)
for n in "${EXPECTED[@]}"; do
  f="$WF/$n.json"; [ -f "$f" ] || continue
  jq empty "$f" 2>/dev/null || { err "$n: kein valides JSON"; continue; }
  jq -e '(.nodes|type=="array") and (.nodes|length>0)' "$f" >/dev/null || err "$n: nodes fehlen"
  jq -e '(.connections|type=="object") and (.connections|length>0)' "$f" >/dev/null || err "$n: connections leer"
  jq -e 'all(.nodes[]; has("typeVersion"))' "$f" >/dev/null || err "$n: Node ohne typeVersion"
done

# 2) Trigger je WF (konkrete Node-Typen)
has_type wf-1-anmeldung-empfang n8n-nodes-base.webhook          || err "wf-1: webhook-Trigger fehlt"
has_type wf-2-anmeldung-confirm n8n-nodes-base.webhook          || err "wf-2: webhook-Trigger fehlt"
has_type wf-3-reminder          n8n-nodes-base.scheduleTrigger  || err "wf-3: scheduleTrigger fehlt"
has_type wf-4-interessent       n8n-nodes-base.webhook          || err "wf-4: webhook-Trigger fehlt"
has_type wf-5-dankesmail        n8n-nodes-base.manualTrigger    || err "wf-5: manualTrigger fehlt"
has_type wf-6-cleanup           n8n-nodes-base.scheduleTrigger  || err "wf-6: scheduleTrigger fehlt"

# 3) Kein Inline-Secret: PFADBASIERT — sensible SCHLÜSSEL dürfen nur {{CONFIG:*}}
#    oder eine n8n-Credential-/Expression-Referenz ("={{...}}") tragen, nie einen Rohwert.
#    check_secrets gibt den Fund aus und liefert 1; der Aufrufer entscheidet (keine
#    fail-Verschmutzung -> nutzbar für den Negativ-Selbsttest).
check_secrets(){ # $1=file $2=label
  local f="$1" lbl="$2"
  while IFS=$'\t' read -r keypath val; do
    printf '%s' "$keypath" | grep -qiE 'password|secret|token|api_?key|authorization|bearer' || continue
    case "$val" in
      *'{{CONFIG:'*'}}'*|'='*|''|'true'|'false') : ;;   # Platzhalter/Expression/leer/Bool ok
      *) printf '%s: sensitiver Schlüssel mit Rohwert: %s=%s' "$lbl" "$keypath" "$val"; return 1 ;;
    esac
  done < <(jq -r 'paths(scalars) as $p | ($p|map(tostring)|join("."))+"\t"+(getpath($p)|tostring)' "$f")
  return 0
}
for n in "${EXPECTED[@]}"; do
  f="$WF/$n.json"; [ -f "$f" ] || continue
  out=$(check_secrets "$f" "$n") || err "$out"
done
# Negativ-Selbsttest: gefälschte Vorlage mit Klartext-Secret MUSS erkannt werden (return 1).
_neg=$(mktemp); printf '{"nodes":[{"parameters":{"password":"rawsecret123"}}]}' >"$_neg"
if check_secrets "$_neg" SELFTEST >/dev/null; then err "Secret-Gate erkennt Klartext-Secret NICHT (Selbsttest)"; fi
rm -f "$_neg"

# 4) Webhook-WFs: Secret-Header-Check nur via Platzhalter (nicht literal)
for n in wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-4-interessent; do
  sval "$n" 'X-Manibase-Secret'        || err "$n: X-Manibase-Secret-Check fehlt"
  sval "$n" '{{CONFIG:SHARED_SECRET}}' || err "$n: SHARED_SECRET nur als Platzhalter erlaubt"
  resp_code "$n" 401                   || err "$n: 401-Respond-Zweig fehlt"
done

# 5) Atomare Claims (DB-Constraint-Muster)
sval wf-1-anmeldung-empfang 'x_infotermin_reg' || err "wf-1: x_infotermin_reg fehlt"
sval wf-1-anmeldung-empfang 'create'           || err "wf-1: Odoo create fehlt"
for n in wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-3-reminder wf-5-dankesmail; do
  sval "$n" 'x_infotermin_outbox' || err "$n: x_infotermin_outbox fehlt"
  sval "$n" 'mail_key'            || err "$n: mail_key (Claim) fehlt"
  sval "$n" 'failed_unknown'      || err "$n: failed_unknown-Pfad fehlt"
done

# 6) Confirm-WF: echte respondToWebhook-Nodes mit 200/409/410
for c in 200 409 410; do resp_code wf-2-anmeldung-confirm "$c" || err "wf-2: respondToWebhook $c fehlt"; done

# 7) Zeitzone + ICS
sval wf-3-reminder 'Europe/Berlin'          || err "wf-3: Europe/Berlin fehlt"
sval wf-6-cleanup  'Europe/Berlin'          || err "wf-6: Europe/Berlin fehlt"
sval wf-2-anmeldung-confirm 'TZID=Europe/Berlin' || err "wf-2: ICS TZID fehlt"

# 8) Cleanup: beide Löschpfade (termin + created)
sval wf-6-cleanup 'termin'      || err "wf-6: Termin-Löschpfad fehlt"
sval wf-6-cleanup 'created'     || err "wf-6: created-Löschpfad fehlt"

# 9) Platzhalter <-> config-schema BIDIREKTIONAL (Mengengleichheit)
json_ph=$(grep -rhoE '\{\{CONFIG:[A-Za-z0-9_]+\}\}' "$WF" | sed -E 's/.*CONFIG:([A-Za-z0-9_]+)\}\}/\1/' | sort -u)
doc_ph=$(grep -oE 'CONFIG:[A-Za-z0-9_]+' "$SCHEMA" | sed 's/CONFIG://' | sort -u)
for k in $json_ph; do grep -qx "$k" <<<"$doc_ph" || err "Platzhalter $k nicht in config-schema.md dokumentiert"; done
for k in $doc_ph; do grep -qx "$k" <<<"$json_ph" || err "config-schema-Key $k in keinem Workflow verwendet"; done

[ "$fail" -eq 0 ] && { note "verify-n8n: alle statischen Gates bestanden (n8n>=$N8N_MIN_VERSION)"; exit 0; } \
                  || { note "verify-n8n: FEHLGESCHLAGEN"; exit 1; }
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

- [ ] **Step 1: wf-1-anmeldung-empfang.json** (idempotent, Review-R1.1) — Webhook(POST) → IF(Header `X-Manibase-Secret` == `{{CONFIG:SHARED_SECRET}}` sonst Respond 401) → Set(normalisieren email_norm/termin) → Code(Token generieren, SHA-256-Digest berechnen) → HTTP(Odoo `create` `x_infotermin_reg` **mit** token_digest).
  - **Create-Erfolg (Neuanmeldung):** HTTP(Odoo `create` `x_infotermin_outbox` mail_key `doi:<reg_id>`) → HTTP(Graph sendMail DOI-Link `{{CONFIG:BASE_URL}}/api/event-confirm.php?t=<token>`) → HTTP(outbox state=sent) → Respond 200.
  - **Unique-Violation (Doppelanmeldung / Recovery, Review-R2.2):** bestehenden reg-Datensatz lesen und den **`doi:<reg_id>`-Outbox-Zustand** prüfen — NICHT pauschal „nie erneut senden":
    - `doi`-Outbox `state=sent` → bereits sicher versandt → Digest NICHT ändern, idempotent Respond 200 (erster Link bleibt gültig).
    - `doi`-Outbox **fehlt** (Erstlauf scheiterte vor dem Claim) → Claim `create doi:<reg_id>` → DOI-Mail senden (mit dem am reg gespeicherten Digest) → `state=sent` → 200. So sperrt ein transienter Fehler die email+termin-Kombination NICHT dauerhaft aus.
    - `doi`-Outbox `state=sending` und `ts` alt (Graph-Ausgang unbekannt) → NICHT blind neu senden → Reconciliation (Test `crash-reconcile-presend`), idempotent 200.
  - Token/Digest wird nur **einmal** (beim ersten reg-`create`) erzeugt; Recovery nutzt den bestehenden Digest, erzeugt keinen neuen (sonst würde ein evtl. doch zugestellter erster Link entwertet).
  - Abnahmetests: `dup-anmeldung` (zweite Anmeldung → 1 gültiger Link, keine 2. Mail bei bereits `sent`); `presend-crash-wf1` (Abbruch nach reg-create vor DOI-`sent` → spätere Anmeldung liefert einen nutzbaren DOI-Link, keine Dauersperre).

- [ ] **Step 2: wf-2-anmeldung-confirm.json** (atomarer Claim, Review-R1.2) — Webhook(POST `{token}`) → IF Secret → Code(SHA-256 des Tokens) → HTTP(Odoo `search_read` reg by token_digest).
  - IF **nicht gefunden** (auch nach Cleanup) → Respond **410**.
  - IF **status==confirmed** → Respond **409**.
  - IF **TTL überschritten** (`termin < now` bzw. >7 Tage) → Respond **410**.
  - Sonst (`received`, TTL ok): **atomarer Entscheidungspunkt = HTTP(Odoo `create` outbox `invite:<reg_id>`)** — die Reihenfolge ist bewusst **Claim → Status-Write → Versand**, damit ein Crash keinen „bestätigt ohne Einladung"-Zustand erzeugt:
    - **Create-Erfolg (Gewinner):** HTTP(write status=confirmed) → Code(ICS: VTIMEZONE Europe/Berlin, UID `<reg_id>@manibase.de`, DTSTAMP, SEQUENCE 0, DTSTART;TZID, 60min) → HTTP(Graph sendMail Einladung + ICS-Base64 + Teams-Link) → HTTP(outbox `invite` state=sent) → Respond **200**.
    - **Unique-Violation (bestehender Claim) — Read-after-Conflict statt pauschal 409 (Review-R2.1):** tatsächlichen Zustand lesen:
      - reg `status=confirmed` UND `invite`-Outbox `state=sent` → echte Bestätigung → Respond **409**.
      - reg `status=received` (Claim existiert, aber Status-Write/Versand hing) → **weitertreiben**: status=confirmed setzen (falls nötig), Einladung senden falls `invite` noch nicht `sent`, dann Respond **200** (idempotent). Kein Dauer-409.
      - `invite`-Outbox `state=sending` und `ts` alt → Reconciliation (Test `crash-reconcile`), neutral Respond 200/409 je nach ermitteltem Zustand.
  - Damit: paralleler Doppel-Confirm → genau **1×200, sonst 409**, genau 1 Einladung; ein Crash zwischen Claim und Status-Write sperrt den Token NICHT dauerhaft. n8n-Concurrency 1 deckt die Rest-Mikrorace. **Alternative Hart-Atomizität** (optional, wenn gewünscht): eine Odoo-Custom-Methode `confirm_registration(digest)`, die Claim + Status in einer DB-Transaktion macht und einen Zustands-Enum zurückgibt (§datenmodell als Upgrade-Pfad dokumentiert).
  - Abnahmetests: `parallel-confirm` (1×200/sonst 409, 1 Einladung); `presend-crash-wf2` (Abbruch nach `invite`-Claim vor Status-Write → Retry liefert 200 + Einladung, kein Dauer-409).

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

- [ ] **Step 1: abnahme-protokoll.md** — nummerierte, abhakbare Go-live-Checkliste mit **stabilen Test-IDs** (jeder Punkt: Setup / erwarteter DB-Zustand / HTTP-Code / Mailanzahl). Verbindliche, **nicht überspringbare** IDs:
  - `odoo-models` Odoo-Modelle + `_sql_constraints` (reg unique(email_norm,termin), outbox unique(mail_key)) angelegt.
  - `graph-rbac` Entra/Graph RBAC + `Test-ServicePrincipalAuthorization` positiv/negativ + echter Negativversand scheitert.
  - `teams-links` zwei Teams-Meetings, Links in Config.
  - `config-disabled` `/etc/manibase/n8n.php` gesetzt, `enabled=false`.
  - `nginx-503` nginx-Snippet aktiv, `nginx -t`, echter `POST /api/event.php` → **503** (nicht 404/PHP-Quelle).
  - `import-wire` 6 Workflows importiert, Credentials/Config verdrahtet, Concurrency 1 gesetzt.
  - `smoke` `smoke-event.sh` grün (13 Fälle).
  - `dup-anmeldung` zweite Anmeldung email+termin → genau 1 gültiger DOI-Link, keine 2. DOI-Mail.
  - `parallel-confirm` gleichzeitiger Doppel-Confirm → **genau 1×200, sonst 409**, genau 1 Einladung.
  - `doi-after-cleanup` DOI-Link nach Cleanup des Datensatzes → **410** (nicht 5xx).
  - `crash-reconcile` Versand-Abbruch nach Graph-Erfolg vor `sent`-Write → Outbox-Row bleibt `sending`; Reconciliation-Query (`state=sending AND ts<now-15min`) findet sie; **kein** Auto-Retry/Doppelmail; manuelle Auflösung dokumentiert.
  - `presend-crash-wf1` Abbruch in wf-1 nach reg-`create` vor DOI-`sent` → spätere Anmeldung (email+termin) liefert einen nutzbaren DOI-Link (Recovery), **keine** Dauersperre.
  - `presend-crash-wf2` Abbruch in wf-2 nach `invite`-Claim vor Status-Write → Retry liefert **200 + Einladung** (Read-after-Conflict), **kein** Dauer-409.
  - `cleanup-confirm-race` Cleanup läuft gleichzeitig mit aktiver Bestätigung → keine inkonsistente Registrierung; späte Bestätigung nach Löschung → `doi-after-cleanup`-Verhalten (410). Erwartete DB-Zustände + Mailanzahl notiert.
  - `ics-clients` ICS-Zeit in Outlook/Apple/Google = 19:30 Europe/Berlin.
  - `cleanup-both-paths` Cleanup-Testlauf für `created<now-14d` UND `termin<now`, Audit-Zählwerte ohne PII.
  - `go-live` erst nach allen obigen: `enabled=true` + Link an Innungen.

- [ ] **Step 2: README.md** — Runbook: Reihenfolge (datenmodell → entra → config → import → smoke → abnahme), Import-Anleitung („Import from File" je WF), Credential-Zuordnung, Verweise auf die anderen Docs, Kill-Switch/`enabled`, Verweis auf PR1-Deploy-Gate.

- [ ] **Step 3: Vollständigkeits-Check** — exakte Test-ID-Liste vorhanden (keine fehlt)

Run:
```bash
for id in odoo-models graph-rbac teams-links config-disabled nginx-503 import-wire smoke \
          dup-anmeldung parallel-confirm doi-after-cleanup crash-reconcile presend-crash-wf1 \
          presend-crash-wf2 cleanup-confirm-race ics-clients cleanup-both-paths go-live; do
  grep -q "$id" docs/n8n/abnahme-protokoll.md || echo "FEHLT: $id"
done; echo "check done"
```
Expected: nur „check done", **keine** `FEHLT:`-Zeile.

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

### Eingearbeitete Plan-Review-Findings (Codex, Runde 1)

1. **[P1] Doppelanmeldung entwertet DOI-Link** → wf-1: Token/DOI nur im Create-Erfolgszweig; Duplicate-Zweig idempotent ohne Neu-Digest (Test `dup-anmeldung`).
2. **[P1] Parallel-Confirm ohne CAS** → wf-2: `create` des `invite:<reg_id>`-Outbox-Keys ist der atomare Entscheidungspunkt (Gewinner→200, Unique-Violation→409); Test `parallel-confirm` assertiert beide Codes.
3. **[P1] verify-n8n.sh zu schwach** → jq-basierte Struktur (genau 6 Dateien, konkrete Node-Typen, typeVersion, echte respondToWebhook-Codes 200/401/409/410), Secret-Allowlist, mail_key/failed_unknown/create-Referenzen, bidirektionale Platzhalter↔Config-Mengengleichheit.
4. **[P1] Laufzeit-Gate unvollständig** → Abnahme-IDs `crash-reconcile` + `cleanup-confirm-race` ergänzt; Vollständigkeitsprüfung als exakte Test-ID-Liste statt Grep-Schwelle.

**Hinweis Task 6 (smoke):** `crash-reconcile` und `cleanup-confirm-race` sind DB-/timing-basiert und stehen als manuelle Abnahmepunkte im Protokoll; `smoke-event.sh` deckt die curl-testbaren Fälle ab.

### Eingearbeitete Plan-Review-Findings (Codex, Runde 2 — abschließend)

1. **[P1] Confirm-CAS nicht atomar mit Status-Write** → wf-2 Read-after-Conflict: bei bestehendem `invite`-Claim tatsächlichen Zustand lesen (confirmed→409; received-hängt→weitertreiben→200), kein Dauer-409; Reihenfolge Claim→Status→Versand; optionaler Odoo-Custom-Method-Upgrade-Pfad; Test `presend-crash-wf2`.
2. **[P1] DOI-Recovery vor Erstversand** → wf-1 Duplicate-Zweig prüft `doi`-Outbox-Zustand: `sent`→idempotent, fehlt→(re)senden, `sending`-alt→reconcile; keine Dauersperre bei transientem Fehler; Test `presend-crash-wf1`.
3. **[P1] Secret-Gate wertbasiert** → `check_secrets` pfadbasiert (`jq paths(scalars)`, Key+Wert), sensible Schlüssel nur `{{CONFIG:*}}`/Expression; Negativ-Selbsttest mit Klartext-Secret erwartet Exit 1.

**Plan-Review-Phase abgeschlossen** (harte 2-Runden-Grenze). Verbleibende Hart-Atomizität (Odoo-Custom-Method) ist als optionaler Upgrade-Pfad dokumentiert; die Read-after-Conflict-Recovery + Concurrency 1 + Reconciliation ist die proportionale Umsetzung für die Veranstaltungsgröße.
