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
    # Secrets liegen in node.parameters — connections/Node-Namen ausklammern,
    # sonst flaggt ein Node-Name wie "IF Secret ok" fälschlich den connections-Key.
    case "$keypath" in *parameters.*|*parameters) : ;; *) continue ;; esac
    local leaf="${keypath##*.}" sensitive=0
    printf '%s' "$leaf" | grep -qiE '^(password|secret|client_?secret|shared_secret|api_?key|token|authorization)$' && sensitive=1
    case "$val" in 'Bearer '*|'bearer '*) sensitive=1 ;; esac
    [ "$sensitive" = 1 ] || continue
    case "$val" in
      *'{{CONFIG:'*'}}'*|'='*|''|'true'|'false') : ;;   # Platzhalter/Expression/leer/Bool ok
      *) printf '%s: sensitiver Schlüssel/Wert mit Rohwert: %s=%s' "$lbl" "$keypath" "$val"; return 1 ;;
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
sval wf-3-reminder 'Europe/Berlin'               || err "wf-3: Europe/Berlin fehlt"
sval wf-6-cleanup  'Europe/Berlin'               || err "wf-6: Europe/Berlin fehlt"
sval wf-2-anmeldung-confirm 'TZID=Europe/Berlin' || err "wf-2: ICS TZID fehlt"

# 8) Cleanup: beide Löschpfade (termin + created)
sval wf-6-cleanup 'termin'  || err "wf-6: Termin-Löschpfad fehlt"
sval wf-6-cleanup 'created' || err "wf-6: created-Löschpfad fehlt"

# 9) Platzhalter <-> config-schema BIDIREKTIONAL (Mengengleichheit)
json_ph=$(grep -rhoE '\{\{CONFIG:[A-Za-z0-9_]+\}\}' "$WF" | sed -E 's/.*CONFIG:([A-Za-z0-9_]+)\}\}/\1/' | sort -u)
doc_ph=$(grep -oE 'CONFIG:[A-Za-z0-9_]+' "$SCHEMA" | sed 's/CONFIG://' | sort -u)
for k in $json_ph; do grep -qx "$k" <<<"$doc_ph" || err "Platzhalter $k nicht in config-schema.md dokumentiert"; done
for k in $doc_ph; do grep -qx "$k" <<<"$json_ph" || err "config-schema-Key $k in keinem Workflow verwendet"; done

if [ "$fail" -eq 0 ]; then
  note "verify-n8n: alle statischen Gates bestanden (n8n>=$N8N_MIN_VERSION)"; exit 0
else
  note "verify-n8n: FEHLGESCHLAGEN"; exit 1
fi
