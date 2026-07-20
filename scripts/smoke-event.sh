#!/usr/bin/env bash
# Prod-/Staging-Smoke für die Infotermin-Endpunkte (curl). Testet den Proxy aus PR1
# und das beobachtbare Endverhalten. Schreibende Fälle nutzen klar markierte Testadressen.
#
# Nutzung:  BASE_URL=https://manibase.de SECRET=<optional> scripts/smoke-event.sh
# DB-/timing-basierte Fälle (crash-reconcile, cleanup-confirm-race, parallel-confirm mit
# echter Nebenläufigkeit) sind manuelle Abnahmepunkte -> docs/n8n/abnahme-protokoll.md.
set -uo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8347}"
EP="$BASE_URL/api/event.php"
CONFIRM="$BASE_URL/api/event-confirm.php"
TERMIN="2026-07-29T19:30:00+02:00"
TS="$(date +%s 2>/dev/null || echo 0)"
TESTMAIL="smoketest+${TS}@example.com"
pass=0; failn=0
ok(){ printf 'PASS %s\n' "$1"; pass=$((pass+1)); }
no(){ printf 'FAIL %s (%s)\n' "$1" "$2"; failn=$((failn+1)); }
code(){ curl -s -o /dev/null -w '%{http_code}' "$@"; }
# chk LABEL ERWARTET IST -> PASS/FAIL (ohne A&&B||C-Falle)
chk(){ if [ "$3" = "$2" ]; then ok "$1"; else no "$1" "$3"; fi; }

# 1) falsche Methode -> 405
chk "method-405" 405 "$(code -X GET "$EP")"

# 2) Honeypot befüllt -> 200 ohne Wirkung
chk "honeypot-200" 200 "$(code -X POST "$EP" -H 'Content-Type: application/json' -d '{"form":"anmeldung","website":"x"}')"

# 3) ungültige E-Mail -> 422
chk "bademail-422" 422 "$(code -X POST "$EP" -H 'Content-Type: application/json' \
  -d "{\"form\":\"anmeldung\",\"name\":\"T\",\"unternehmen\":\"T\",\"email\":\"nope\",\"kenntnisnahme\":true,\"termin\":\"$TERMIN\"}")"

# 4) fehlende Kenntnisnahme -> 422
chk "noconsent-422" 422 "$(code -X POST "$EP" -H 'Content-Type: application/json' \
  -d "{\"form\":\"anmeldung\",\"name\":\"T\",\"unternehmen\":\"T\",\"email\":\"$TESTMAIL\",\"kenntnisnahme\":false,\"termin\":\"$TERMIN\"}")"

# 5) Rate-Limit: viele schnelle Requests -> irgendwann 429/503 (nur Hinweis, nicht hart)
rl="n/a"; for _ in $(seq 1 25); do rl=$(code -X POST "$EP" -H 'Content-Type: application/json' -d '{"form":"x"}'); done
printf 'INFO rate-limit letzter Code: %s (erwartet zeitweise 429/503 unter Last)\n' "$rl"

# 6) GET auf Confirm ändert nichts (neutrales Interstitial mit POST-Form)
if curl -s "$CONFIRM?t=smoketoken123" | grep -q 'method="post"'; then ok "confirm-get-interstitial"; else no "confirm-get-interstitial" "kein POST-Form"; fi

# 7) gültige Anmeldung -> 200 (DOI-Mail wird versandt; Bestätigung ist manuell)
chk "anmeldung-200" 200 "$(code -X POST "$EP" -H 'Content-Type: application/json' \
  -d "{\"form\":\"anmeldung\",\"name\":\"Smoke Test\",\"unternehmen\":\"Test GmbH\",\"email\":\"$TESTMAIL\",\"kenntnisnahme\":true,\"termin\":\"$TERMIN\"}")"

# 8) Doppel-Anmeldung (Dedup) -> weiterhin 200, keine zweite DOI-Mail (manuell im Postfach prüfen)
chk "dup-anmeldung-200" 200 "$(code -X POST "$EP" -H 'Content-Type: application/json' \
  -d "{\"form\":\"anmeldung\",\"name\":\"Smoke Test\",\"unternehmen\":\"Test GmbH\",\"email\":\"$TESTMAIL\",\"kenntnisnahme\":true,\"termin\":\"$TERMIN\"}")"

# 9) Interessent -> 200
chk "interessent-200" 200 "$(code -X POST "$EP" -H 'Content-Type: application/json' \
  -d "{\"form\":\"interessent\",\"name\":\"Smoke\",\"unternehmen\":\"Test\",\"email\":\"$TESTMAIL\",\"kenntnisnahme\":true,\"info\":\"smoke\"}")"

# 10) Confirm-POST mit unbekanntem Token -> 410 (bzw. 409), nie 5xx
c=$(code -X POST "$CONFIRM" -d 't=unbekannt-oder-abgelaufen-000')
if [ "$c" = 410 ] || [ "$c" = 409 ]; then ok "confirm-unknown-410"; else no "confirm-unknown-410" "$c"; fi

printf '\n== Smoke: %d PASS, %d FAIL ==\n' "$pass" "$failn"
printf 'Hinweis: parallel-confirm, crash-reconcile, cleanup-confirm-race, ics-clients sind\n'
printf 'manuelle Abnahmepunkte (docs/n8n/abnahme-protokoll.md).\n'
[ "$failn" -eq 0 ] || exit 1
