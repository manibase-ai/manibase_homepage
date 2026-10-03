# Formular-Trichter (selbst gebaut) und Log-Rotation — Design

**Datum:** 03.10.2026 · **Auftrag:** Nikolaus im Chat („setz das um inklusive logrotate“, Workflow autonom nach `AUTONOMER-FEATURE-WORKFLOW-DIREKTIVE.md`). Der Chatauftrag ersetzt das Feature-File.
**Stand:** nach Spec-Review Runde 2 (beide Runden eingearbeitet, siehe Ende).

## 1. Ziel

Sichtbar machen, **an welchem Schritt der Qualifizierungs-Maske (`#qualify`, `site/index.html`) Besucher aussteigen**, ohne Analyse-Werkzeug, ohne Cookies, ohne Drittanbieter und ohne IP-Adressen im Trichter-Log. Nebenbei die nginx-Logs auf dem Produktivserver rotieren lassen (`logrotate` ist dort nicht installiert, `access.log` wächst seit 13.07.2026 ungebremst und enthält IP-Adressen).

Nicht-Ziele: allgemeine Besucherstatistik (bleibt beim nginx-Log), Dashboard, Messung außerhalb der Maske, Messung der Zeeg-Buchung selbst (siehe 8).

## 2. Ausgangslage (geprüft am 03.10.2026)

- Die Maske hat 5 Schritte (`fieldset.wstep[data-step=1..5]`), Schritte 1–3 mit `data-auto` (Einfachauswahl, Auto-Advance nach 260 ms), Schritt 4 Mehrfachauswahl mit Pflicht „Geschäftsführung“, Schritt 5 Kontakt + Einwilligung. Logik in `site/scripts/site.js` `initWizard()` (ab Zeile 307), Submit blendet die Maske aus und ruft `revealCalendar()` → `loadBookingCalendar()`. Über der Maske steht die Fortschrittszeile `p.wizard__progress#wiz-progress`.
- Alle Schritte laufen auf einer URL; kein Werkzeug sieht Schrittwechsel von selbst.
- CSP liegt nur auf dem Server (`/etc/nginx/snippets/manibase-security-headers.conf`, nicht im Repo) und erlaubt `connect-src 'self'`; wird in der Abnahme per `curl -sI` geprüft.
- `site.js` ist in 12 HTML-Dateien eingebunden; der Cache-Stempel ändert sich in allen.
- `deploy.yml` überträgt nur `site/`; Skripte unter `scripts/` liegen nicht auf dem Server.
- Server: Debian 13, nginx, `node` vorhanden. `/etc/logrotate.d/nginx` liegt da (daily, rotate 14, compress, delaycompress), Paket `logrotate` fehlt (`dpkg -l logrotate` → `un`). Weitere Regeln liegen bereit (u. a. `php8.4-fpm`, `apt`, `dpkg`, `certbot`) und werden mit der Installation alle aktiv.
- Der Vhost `/etc/nginx/sites-available/manibase.de` wurde heute um 15:54 von einer anderen Sitzung geändert (Security-Header-Snippet). Änderungen am Vhost daher nur gezielt einfügen, nie die Datei als Ganzes ersetzen.
- **Vorhandener Fehler (K1):** Enter auf einer Auswahl in Schritt 1–4 löst die implizite Formularabsendung aus; der Submit-Handler (`site.js` ab 410) prüft dann Name/E-Mail und meldet „Bitte geben Sie Ihren Namen an.“ für ein unsichtbares Feld. Das wird mitbehoben, weil es den Trichter verfälschen würde und Nutzer in der Maske festhält.

## 3. Entscheidungen

| # | Entscheidung | Begründung |
|---|---|---|
| E1 | **Kein PHP, kein Speicher-Code:** nginx beantwortet `/t` mit `204` und schreibt eine Logzeile. Aufbau: `location = /t { access_log off; client_max_body_size 1k; limit_req zone=manibase_trichter burst=30 nodelay; limit_req_log_level info; try_files /__trichter_nie__ @trichter; }` und `location @trichter { access_log <trichter-log> manibase_trichter if=$trichter_log; return 204; }`. Kein `add_header` in diesen Locations, damit die Security-Header geerbt werden (das Snippet ist auf Server-Ebene eingebunden, Vhost Zeile 19; ein `error_page` gibt es nicht, geprüft 03.10.2026). | `return` läuft in der rewrite-Phase vor `limit_req` (preaccess); erst über `try_files` (try-files-Phase) greift das Rate-Limit (B1). `empty_gif` scheidet aus, weil es POST (sendBeacon) mit 405 beantwortet. |
| E2 | **Abschließende Feldliste im Log** (`escape=json`): `t=$time_iso8601`, `v`, `s`, `e`, `n`, `r`, `b`. Jeder Abfragewert läuft durch eine `map` mit Regex auf die erlaubten Werte, alles andere wird `-`. Geloggt wird nur, wenn `$trichter_log` = 1, also `v=1` und `s` gültig und `e` aus der Ereignisliste (`map "$arg_v|$arg_s|$arg_e" $trichter_log { "~^1\|[a-z0-9]{10}\|(gesehen|begonnen|schritt|fehler|abgeschickt|kalender)$" 1; default 0; }`); sonst antwortet `/t` trotzdem `204`, schreibt aber nichts. **Alle Regexe in `map`-Blöcken stehen in doppelten Anführungszeichen**, weil `{}` und `;` sonst den Parser brechen. **Nie** geloggt: IP, `$http_referer`, `$http_user_agent`, `$request`, `$request_uri`. | Kein Personenbezug, keine Log-Injektion, keine überlangen Zeilen (W2). |
| E3 | **Sitzungskennung `s`:** 10 Zeichen `[a-z0-9]` aus `crypto.getRandomValues`, nur im Arbeitsspeicher der Seite, neu bei jedem Seitenaufruf. Ohne `crypto.getRandomValues` wird nicht gemessen. | Es wird nichts auf dem Gerät abgelegt oder ausgelesen, um Nutzer wiederzuerkennen. Ob das ausgelöste Senden selbst unter § 25 TDDDG fällt (EDPB-Leitlinien 2/2023 sehen per JS ausgelöste Übertragungen kritisch), ist nicht abschließend geklärt; die Geschäftsführung trägt diese Risikoentscheidung bewusst, im Gegenzug: keine IP, keine Kennung über den Seitenaufruf hinaus, Opt-out (E6/E7). Die Datenschutzerklärung beschreibt, was gesendet wird, und behauptet nicht, dass nicht auf das Endgerät zugegriffen werde (W3). |
| E4 | **Ereignisse dedupliziert** je Seitenaufruf und Schlüssel `(e,n,r)`. | Vor-/Zurück-Klicks blähen sonst Zählungen auf; der Trichter zählt Sitzungen. |
| E5 | **Transport** `navigator.sendBeacon(url)`; fehlt es, `fetch(url,{method:'POST',keepalive:true,credentials:'omit'})`; fehlt beides, wird still nichts gesendet. Jeder Fehler wird verschluckt. | Die Messung darf die Maske nie stören. Der stille Fallback ist gewollt und im Code kommentiert. |
| E6 | **Opt-out des Browsers:** `navigator.globalPrivacyControl === true`, `navigator.doNotTrack === '1'` oder `window.doNotTrack === '1'` → keine Messung. | In der Datenschutzerklärung zusagbar. |
| E7 | **Eigene Besuche ausklammern:** `?trichter=aus` setzt `localStorage['manibase-trichter']='aus'`, `?trichter=an` entfernt den Schlüssel; der Parameter wird vor dem ersten Ereignis ausgewertet und danach per `history.replaceState` aus der Adresse entfernt. Ist der Schlüssel gesetzt, wird nicht gemessen. Jeder Zugriff in `try/catch`. | Teamtests verfälschen bei wenigen Dutzend Sitzungen stark (28.09.: 40 von 57 Aufrufen). Der Eintrag entsteht nur auf ausdrückliche Handlung der Person selbst (§ 25 Abs. 2 Nr. 2 TDDDG). |
| E8 | **Rate-Limit** auf `/t`: Zone `manibase_trichter` (10m, 60r/m), `burst=30 nodelay`, `limit_req_log_level info`. Abgewiesene Anfragen (503) erzeugen keine Trichterzeile (`access_log off` in `/t`) und wegen `info` unterhalb der Debian-Vorgabe `error` auch keinen Eintrag mit IP in `error.log`. | Schutz gegen Log-Flutung ohne neue IP-Spuren. |
| E9 | **Bot-Kennzeichen `b`:** `map $http_user_agent $trichter_bot { "~*(bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|python|curl|wget)" 1; default 0; }`. Geloggt wird nur `b=0/1`, nicht der User-Agent. Bekannte Unschärfe: `bot` trifft auch Handy-Kennungen wie „CUBOT“; bei den Stückzahlen hingenommen und dokumentiert. Die Auswertung blendet `b=1` standardmäßig aus und weist die Zahl aus. | Googlebot, PageSpeed und Headless-Crawler führen JS aus und würden `gesehen` auslösen (W5). |
| E10 | **Trichter-Log getrennt** unter `/var/log/manibase/trichter.log`. Verzeichnis `root:adm 0755` wie `/var/log/nginx` (die Worker laufen als `www-data` und öffnen die Datei bei USR1 selbst neu; ohne x-Recht schrieben sie in `.1` weiter und die Zeilen gingen verloren). Die Datei wird vor dem ersten Reload mit `install -o www-data -g adm -m 0640 /dev/null …` angelegt. Eigene logrotate-Regel: `monthly`, `rotate 12`, `maxage 400`, `maxsize 50M`, `compress`, `delaycompress`, `missingok`, `notifempty`, `create 0640 www-data adm`, `sharedscripts`, `postrotate` → `invoke-rc.d nginx rotate >/dev/null 2>&1` (wie die Debian-Regel; scheitert nicht, wenn nginx steht). Aufbewahrung damit höchstens 13 Monate, `maxage` sichert das auch bei leeren Monaten ab. | Anonym, daher längere Aufbewahrung vertretbar; liegt bewusst außerhalb von `/var/log/nginx/*.log`. |
| E11 | **Auswertung als Node-Skript** `scripts/trichter-auswertung.mjs` ohne Abhängigkeiten, liest Dateien (auch `.gz`) oder `-` für stdin. Aufruf vom eigenen Rechner: `ssh root@72.61.153.206 'zcat -f /var/log/manibase/trichter.log*' | node scripts/trichter-auswertung.mjs - --von … --bis …`. | Das Skript gehört nicht nach `site/` (wäre öffentlich) und `scripts/` wird nicht deployt (W4). |
| E12 | **Datum** aus `$time_iso8601` samt Offset parsen und mit `Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin'})` dem Kalendertag zuordnen; `--von`/`--bis` inklusive. | Server läuft in UTC; Sommerzeit-Grenze 25.10.2026 im Test (K9). |
| E13 | **Altdaten in `access.log`** (IP-Adressen seit 13.07.2026) werden **nicht** von Hand gelöscht. logrotate rotiert beim allerersten Lauf noch nicht (legt nur den Status an), danach täglich mit zufälliger Timer-Verzögerung; die Altdaten sind damit etwa am 19.10.2026 gelöscht. Die Datenschutzerklärung nennt die Frist als Regelfall („werden täglich rotiert und in der Regel nach 15 Tagen gelöscht“), weil `notifempty` mit zählbasiertem `rotate` bei einem leeren Tag eine Datei länger liegen lassen kann; die Paket-Regel `/etc/logrotate.d/nginx` (dpkg-Konfigurationsdatei) wird bewusst nicht geändert. Bis die Altdaten durchrotiert sind, ist die Aussage für Altbestände noch nicht erfüllt. Ob die Altdaten sofort gelöscht werden sollen, entscheidet die Geschäftsführung; der PR-Body und die Doku nennen den Befehl. | Löschen ist nicht umkehrbar; die Daten waren Grundlage der Auswertungen vom 26.09. und 03.10. (B2). |

## 4. Ereignisse (Schema v1)

Aufruf: `POST /t?v=1&s=<id>&e=<ereignis>[&n=<zahl>][&r=<grund>]` (fetch-Fallback ebenfalls POST). Es werden **nur** diese Parameter gesendet, nie Formularwerte.

| `e` | `n` | `r` | Auslöser |
|---|---|---|---|
| `gesehen` | – | – | Fortschrittszeile `#wiz-progress` erstmals vollständig sichtbar (`IntersectionObserver`, `threshold: 1`); fehlt der Observer, entfällt das Ereignis |
| `begonnen` | – | – | erstes `change`- oder `input`-Ereignis in der Maske |
| `schritt` | 2–5 | – | Schritt n erstmals vorwärts erreicht |
| `fehler` | 1–5 | `auswahl`, `mehrfach`, `gf`, `name`, `email`, `firma`, `einwilligung` | Prüfmeldung angezeigt; `n` ist immer der aktive Schritt (`idx + 1`) |
| `abgeschickt` | – | – | Submit gültig, Kalender wird eingeblendet |
| `kalender` | – | `ok`, `fehler` | `ok`: `Zeeg.initInlineWidget` wurde aufgerufen (nicht: iframe geladen). `fehler`: Zeeg-Skript löst `error` aus (neues `s.onerror`) **oder** `init()` findet `window.Zeeg.initInlineWidget` nicht, und zwar auf beiden Pfaden (nach `load` und beim Sofortpfad `if (window.Zeeg) { init(); return; }`). Dazu liefert `init()` künftig `true`/`false` |

Die Gründe für `fehler` werden an den bestehenden `showErr`-Stellen gesetzt: `valid()` → `auswahl` (Radio offen), `mehrfach` (keine Checkbox), `gf` (Geschäftsführung fehlt); Submit-Handler → `name`, `email`, `firma`, `einwilligung`.

**Reihenfolge im Submit:** `abgeschickt` wird gesendet, bevor `revealCalendar()` läuft.

**Opt-out-Parameter (E7):** wird auf jeder Seite ausgewertet, die `site.js` lädt (nicht nur auf der Startseite); `replaceState` entfernt nur `trichter` und behält übrige Parameter und den Hash (`#termin`).

**Submit-Korrektur (K1):** Der Submit-Handler ruft `ev.preventDefault()` und, solange nicht der letzte Schritt aktiv ist, `next()` statt der Kontaktprüfung. Enter in Schritt 1–4 verhält sich damit wie „Weiter“.

## 5. Trichter-Logik (Auswertung)

- Gültige Zeile: JSON, `v=="1"`, `s` passt auf `^[a-z0-9]{10}$`, `e` aus der Tabelle, `n`/`r` wie vorgesehen, `b` ist `0` oder `1`. Ungültige Zeilen werden gezählt und ausgewiesen.
- Stufen: `gesehen`(0) → `begonnen`(1) → `schritt 2`(2) → `schritt 3`(3) → `schritt 4`(4) → `schritt 5`(5) → `abgeschickt`(6). Je Sitzung zählt die **höchste belegte Stufe**; eine Sitzung auf Stufe k zählt für alle Stufen ≤ k. Belegt wird eine Stufe auch indirekt: `fehler n=k` belegt die Stufe von Schritt k (Schritt 1 = `begonnen`), `kalender` belegt `abgeschickt` (K3).
- „Sitzung“ heißt ein Seitenaufruf: Wer mitten in der Maske neu lädt, zählt als Abbruch plus neue Sitzung. Das steht als Hinweis in der Ausgabe.
- Ausgabe: Zeitraum; je Stufe Sitzungen, Anteil an der Vorstufe, Anteil an „gesehen“; darunter `fehler` je Schritt und Grund (Sitzungen), `kalender ok/fehler`; Anzahl Bot-Sitzungen (ausgeblendet) und ungültiger Zeilen. `--mit-bots` nimmt Bots mit auf.

## 6. Dateien

**Repo (PR):**
- `site/scripts/site.js` — Messmodul im Abschnitt 4 (eine Funktion `trichter(e, n, r)` plus Initialisierung), Aufrufe in `initWizard()`, `loadBookingCalendar()`; Submit-Korrektur (K1).
- `site/*.html` und `site/**/*.html` mit `site.js`-Einbindung — nur Cache-Stempel (`python3 scripts/cache-bust.py site`).
- `site/datenschutz.html` — Abschnitt 3: Löschfrist der Server-Logdaten („werden täglich rotiert und in der Regel nach 15 Tagen gelöscht“); in Abschnitt 5 ein **eigener, mit fettem Stichwort abgesetzter Absatz** „Zählung der Formularschritte“ (was gesendet wird, keine Cookies, keine IP im Zähl-Log, Zufallskennung pro Seitenaufruf, Zweck, Rechtsgrundlage Art. 6 Abs. 1 lit. f getrennt vom lit. b des Formulars, höchstens 13 Monate, Browser-Signale GPC/DNT, Abschalten über `?trichter=aus` mit Eintrag im Browser-Speicher); Abschnitt 11: 13 Monate für die Zählung; Stand-Datum.
- `scripts/trichter-auswertung.mjs` — exportierte reine Funktionen (`zeileLesen`, `auswerten`, `formatieren`) + CLI.
- `scripts/test-trichter.mjs` — Tests der Auswertung (ohne Abhängigkeiten).
- `scripts/test-frontend.mjs` — `bootWizard({ url, vorbereiten })` bekommt optional eine Start-URL (für `?trichter=aus`) und einen Hook, der vor dem `eval` von `site.js` Stubs setzt: Beacon-Spion, IO-Stub mit `observe`/`unobserve`/`disconnect` (der Reveal-Code ab `site.js:88` nutzt ihn mit; die bestehenden Tests dürfen sich dadurch nicht ändern), `Element.prototype.scrollIntoView` (fehlt in jsdom, `revealCalendar` würde werfen), `globalPrivacyControl`/`doNotTrack` per `Object.defineProperty`, `localStorage`-Vorbelegung, `window.Zeeg`. Das Zeeg-Skript lädt unter `runScripts:'outside-only'` nie; der Test löst `load`/`error` am angehängten `script[src*="zeeg"]` selbst aus. Neue Tests für die Ereignisse.
- `.github/workflows/verify.yml` — Schritt `node scripts/test-trichter.mjs`.
- `docs/deploy/nginx-trichter.conf` — versionierte Kopie (http-Kontext: `log_format`, `limit_req_zone`, `map`s; server-Kontext: beide Locations).
- `docs/deploy/logrotate-manibase-trichter` — versionierte logrotate-Regel.
- `docs/deployment/trichter-und-logrotate.md` — was auf dem Server umgesetzt wurde, Auswertungsbefehl, Opt-out-Link fürs Team, Befehl zum sofortigen Löschen der Altdaten (nur auf Anweisung), Rückbau.
- `CLAUDE.md` — kurzer Abschnitt „Formular-Trichter“.

**Server (Hauptsitzung, vor dem Merge, mit Backup und `nginx -t`):**
1. `apt install logrotate`; Probelauf `logrotate -d /etc/logrotate.conf` vollständig sichten (alle Regeln werden aktiv, K8); `logrotate.timer` aktiv.
2. `/var/log/manibase/` (`root:adm 0755`), Datei per `install -o www-data -g adm -m 0640 /dev/null /var/log/manibase/trichter.log`, `/etc/logrotate.d/manibase-trichter`.
3. `/etc/nginx/conf.d/manibase-trichter.conf` (http-Kontext).
4. Beide Locations im HTTPS-Serverblock von `manibase.de` gezielt einfügen.

Reihenfolge: Server zuerst; ohne Server-Teil landeten die Beacons nach dem Deploy als 404 im allgemeinen Log.

## 7. Abnahmekriterien (Definition of Done)

1. `gesehen`, `begonnen`, jeder Schrittwechsel, jede Prüfmeldung, der Submit und das Laden bzw. Scheitern des Kalenders erzeugen genau ein Ereignis je Seitenaufruf und Schlüssel nach Schema v1 (jsdom-Test).
2. Gesendete Adressen enthalten ausschließlich die Parameter `v, s, e, n, r` (Whitelist-Test, Formularwerte nie).
3. Bei GPC, DNT=1 (`navigator` oder `window`) oder `trichter=aus` wird nichts gesendet; `?trichter=aus` verschwindet aus der Adresse (Test).
4. Wirft der Beacon oder fehlen Beacon und fetch, funktioniert die Maske unverändert (Test).
5. Enter in Schritt 1–4 schaltet weiter statt eine Kontaktfehlermeldung zu zeigen (Test).
6. Die bestehenden Masken-Tests bleiben grün.
7. `trichter-auswertung.mjs`: Stufen kumulativ mit indirekter Belegung, Bots standardmäßig ausgeblendet, Datum in Europe/Berlin über die Sommerzeitgrenze korrekt, `.gz` und stdin lesbar, ungültige Zeilen ausgewiesen (Tests).
8. CI (`verify.yml`) führt beide Testdateien aus; `cache-bust.py --check site` grün.
9. Datenschutzerklärung beschreibt Schrittzählung und Log-Löschfrist; keine Behauptung „kein Zugriff auf das Endgerät“.
10. Server: `logrotate` installiert, Timer aktiv, Probelauf ohne Fehler; `POST /t?...` → `204`; die Zeile in `/var/log/manibase/trichter.log` enthält nur die Felder aus E2; manipulierte Werte erscheinen als `-`; `access.log` enthält den Testaufruf nicht; 35 Aufrufe in einer Schleife: mindestens einer liefert `503`, für die abgewiesenen entsteht keine Trichterzeile und kein `error.log`-Eintrag; Bot-UA ergibt `b=1`; Antwort auf `/t` trägt die Security-Header; `curl -sI https://manibase.de/ | grep -i connect-src` zeigt `'self'`; `nginx -t` grün; die anderen Vhosts antworten wie vorher; nach `logrotate -f /etc/logrotate.d/manibase-trichter` landet ein neuer Beacon in der frischen `trichter.log` und `error.log` meldet kein „open() failed“.

## 8. Bewusst offen

- **Zeeg-Buchung nicht messbar.** `https://assets.zeeg.me/embed.min.js` (geprüft 03.10.2026) verarbeitet nur Nachrichten zur Höhe (`zeeg.page_height`, `zeeg.embed_layout`); ein Buchungsereignis an die Elternseite ist nicht dokumentiert. Eine Probebuchung würde einen echten Termin erzeugen. Die Buchungszahl kommt aus dem Zeeg-Dashboard.
- **Kein Dashboard.** Auswertung per Skript.
- **Altdaten-Löschung** liegt bei der Geschäftsführung (E13).

## Offene Review-Punkte

Runde 2: alle Findings übernommen, mit zwei Abweichungen: (a) W3 schlug vor, die Löschfrist für alle nginx-Logs per `maxage 15` zu erzwingen; das hieße, die dpkg-Konfigurationsdatei `/etc/logrotate.d/nginx` zu ändern. Stattdessen nennt die Datenschutzerklärung die Frist als Regelfall. (b) K-g (Bot-Regex trifft „CUBOT“): hingenommen und dokumentiert statt engerer Regex.

Runde 1: alle Findings übernommen, mit einer Abweichung: B2 schlug vor, die Altdaten beim Go-live einmalig zu löschen. Das geschieht nicht automatisch (E13), weil Löschen nicht umkehrbar ist und die Geschäftsführung die Daten zuletzt am 03.10. ausgewertet hat; die Entscheidung wird im PR vorgelegt.
