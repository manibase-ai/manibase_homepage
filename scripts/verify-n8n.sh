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
# Achtung: der Statuscode gehoert bei respondToWebhook in parameters.options.responseCode.
# Auf oberster Ebene ignoriert n8n ihn stillschweigend und antwortet 200 (siehe Go-live 21.07.2026).
resp_code(){ jq -e --arg c "$2" 'any(.nodes[]; (.type|test("respondToWebhook")) and ((.parameters.options.responseCode // empty|tostring)==$c))' "$WF/$1.json" >/dev/null 2>&1; }

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
# Zusätzlich: serialisierte Bodies (jsonBody u.ä.) auf eingebettete Roh-Secrets scannen.
# Sensible JSON-Schlüssel INNERHALB eines String-Werts dürfen nur einen
# {{CONFIG:*}}-Platzhalter tragen, keinen Rohwert.
check_serialized(){ # $1=file $2=label
  local f="$1" lbl="$2" bad
  # Alle String-Werte durchgehen und nach '"sensitiver_key":"rohwert"' suchen,
  # wobei {{CONFIG:...}} als Wert erlaubt ist.
  bad=$(jq -r '[.. | strings] | .[]' "$f" \
        | grep -oiE '"(client_?secret|shared_secret|api_?key|password|token|authorization)"[[:space:]]*:[[:space:]]*"[^"]*"' \
        | grep -viE ':[[:space:]]*"\{\{CONFIG:' || true)
  if [ -n "$bad" ]; then err "$lbl: eingebettetes Roh-Secret in serialisiertem Body: $(printf '%s' "$bad" | head -1)"; fi
  return 0
}
for n in "${EXPECTED[@]}"; do
  f="$WF/$n.json"; [ -f "$f" ] || continue
  out=$(check_secrets "$f" "$n") || err "$out"
  check_serialized "$f" "$n"
done
# Negativ-Selbsttests: Klartext-Secret als Leaf UND in serialisiertem Body -> beide erkannt.
_neg=$(mktemp); printf '{"nodes":[{"parameters":{"password":"rawsecret123"}}]}' >"$_neg"
if check_secrets "$_neg" SELFTEST >/dev/null; then err "Secret-Gate (leaf) erkennt Klartext-Secret NICHT"; fi
_neg2=$(mktemp); printf '{"nodes":[{"parameters":{"jsonBody":"={\\"api_key\\":\\"AKIAROHWERT123\\"}"}}]}' >"$_neg2"
sbad=$(jq -r '[.. | strings] | .[]' "$_neg2" | grep -oiE '"api_?key"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -viE ':[[:space:]]*"\{\{CONFIG:' || true)
[ -n "$sbad" ] || err "Secret-Gate (serialisiert) erkennt eingebettetes Klartext-Secret NICHT"
rm -f "$_neg" "$_neg2"

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
sval wf-6-cleanup 'termin'      || err "wf-6: Termin-Löschpfad fehlt"
sval wf-6-cleanup 'create_date' || err "wf-6: create_date-Löschpfad fehlt"

# 8b) Connection-Integrität: eindeutige Node-Namen; jede Connection-Quelle UND
#     jedes -Ziel muss ein existierender Node sein (fängt Dangling-Connections
#     nach Umbenennungen). Plus: jeder Webhook-WF erreicht mind. einen
#     respondToWebhook-Node über die Connections.
check_connections(){ # $1=file $2=label
  local f="$1" lbl="$2" names dupe src tgt
  names=$(jq -r '.nodes[].name' "$f")
  dupe=$(printf '%s\n' "$names" | sort | uniq -d | head -1)
  [ -n "$dupe" ] && err "$lbl: doppelter Node-Name: $dupe"
  while IFS= read -r src; do
    [ -z "$src" ] && continue
    printf '%s\n' "$names" | grep -qxF "$src" || err "$lbl: Connection-Quelle '$src' ist kein Node"
  done < <(jq -r '.connections | keys[]' "$f")
  while IFS= read -r tgt; do
    [ -z "$tgt" ] && continue
    printf '%s\n' "$names" | grep -qxF "$tgt" || err "$lbl: Connection-Ziel '$tgt' ist kein Node"
  done < <(jq -r '[.connections[].main[]?[]?.node] | .[]' "$f" | sort -u)
  return 0
}
for n in "${EXPECTED[@]}"; do
  f="$WF/$n.json"; [ -f "$f" ] || continue
  check_connections "$f" "$n"
done
# Webhook-WFs: Trigger erreicht (über Connections) einen respondToWebhook-Node.
for n in wf-1-anmeldung-empfang wf-2-anmeldung-confirm wf-4-interessent; do
  f="$WF/$n.json"
  # BFS vom/von den Trigger-Node(s) aus über die Connections; erreicht ein respondToWebhook?
  reach=$(jq -r '
    . as $doc
    | def targets($src): [$doc.connections[$src].main[]?[]?.node];
      def expand($seen): ($seen + [ $seen[] as $s | targets($s)[] ]) | unique;
      [ $doc.nodes[] | select(.type|test("webhook")) | .name ] as $start
    | (reduce range(0; ($doc.nodes|length)) as $_ ($start; expand(.))) as $reach
    | [ $doc.nodes[] | select(.type|test("respondToWebhook")) | select(.name as $nm | $reach | index($nm)) ] | length
  ' "$f")
  [ "${reach:-0}" -gt 0 ] || err "$n: kein respondToWebhook vom Webhook-Trigger aus erreichbar"
done

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
