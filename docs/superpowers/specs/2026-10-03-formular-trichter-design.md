# Formular-Trichter (selbst gebaut) und Log-Rotation — Design

**Datum:** 03.10.2026 · **Auftrag:** Nikolaus im Chat („setz das um inklusive logrotate“, Workflow autonom nach `AUTONOMER-FEATURE-WORKFLOW-DIREKTIVE.md`). Der Chatauftrag ersetzt das Feature-File.

## 1. Ziel

Sichtbar machen, **an welchem Schritt der Qualifizierungs-Maske (`#qualify`, `site/index.html`) Besucher aussteigen**, ohne Analyse-Werkzeug, ohne Cookies, ohne Drittanbieter und ohne IP-Adressen. Nebenbei die nginx-Logs auf dem Produktivserver endlich rotieren lassen (`logrotate` ist dort nicht installiert, `access.log` wächst seit 13.07.2026 ungebremst und enthält IP-Adressen).

Nicht-Ziele: allgemeine Besucherstatistik (bleibt beim nginx-Log), Dashboard, Messung außerhalb der Maske, Messung der Zeeg-Buchung selbst (siehe 7).

## 2. Ausgangslage (geprüft am 03.10.2026)

- Die Maske hat 5 Schritte (`fieldset.wstep[data-step=1..5]`), Schritte 1–3 mit `data-auto` (Einfachauswahl, Auto-Advance nach 260 ms), Schritt 4 Mehrfachauswahl mit Pflicht „Geschäftsführung“, Schritt 5 Kontakt + Einwilligung. Logik in `site/scripts/site.js` `initWizard()` (ab ca. Zeile 307), Submit blendet die Maske aus und ruft `revealCalendar()` → `loadBookingCalendar()`.
- Alle Schritte laufen auf einer URL; kein Werkzeug sieht Schrittwechsel von selbst.
- CSP (`/etc/nginx/snippets/manibase-security-headers.conf`) erlaubt `connect-src 'self'`; ein Beacon an die eigene Domain ist erlaubt.
- Server: Debian 13, nginx, `node` vorhanden. `/etc/logrotate.d/nginx` liegt da (daily, rotate 14, compress, delaycompress), Paket `logrotate` fehlt (`dpkg -l logrotate` → `un`).
- Der Vhost `/etc/nginx/sites-available/manibase.de` wurde heute um 15:54 von einer anderen Sitzung geändert (Security-Header-Snippet). Änderungen am Vhost daher nur gezielt einfügen, nie die Datei als Ganzes ersetzen.

## 3. Entscheidungen

| # | Entscheidung | Begründung |
|---|---|---|
| E1 | **Kein PHP, kein Speicher-Code:** nginx beantwortet `/t` mit `204` und schreibt die Abfrageparameter in ein eigenes Log. | Null Angriffsfläche durch eigenen Code, nichts zu warten, kein RAM. |
| E2 | **Log ohne IP**, eigenes `log_format` mit `escape=json`, eine JSON-Zeile je Ereignis. | IP ist personenbezogen und für den Trichter nicht nötig; `escape=json` verhindert Log-Injektion über die Parameter. |
| E3 | **Sitzungskennung `s`:** 10 Zeichen `[a-z0-9]` aus `crypto.getRandomValues`, nur im Arbeitsspeicher der Seite, neu bei jedem Seitenaufruf. | Kein Zugriff auf das Endgerät → keine Einwilligung nach § 25 TDDDG. Reicht, weil die Maske auf einer Seite liegt. Ohne `crypto` wird nicht gemessen. |
| E4 | **Ereignisse dedupliziert** je Seitenaufruf und Schlüssel `(e,n,r)`. | Vor-/Zurück-Klicks blähen sonst Zählungen auf; der Trichter zählt Sitzungen, nicht Klicks. |
| E5 | **Transport** `navigator.sendBeacon(url)`; fehlt es, `fetch(url,{method:'POST',keepalive:true,credentials:'omit'})`. Jeder Fehler wird verschluckt. | Messung darf die Maske nie stören. Der stille Fallback ist hier gewollt und im Code kommentiert. |
| E6 | **Opt-out respektiert:** `navigator.globalPrivacyControl === true` oder `navigator.doNotTrack === '1'` → keine Messung. | Datenschutzfreundlich, im Text der Datenschutzerklärung zusagbar. |
| E7 | **Eigene Besuche ausklammern:** `?trichter=aus` setzt `localStorage['manibase-trichter']='aus'`, `?trichter=an` löscht den Schlüssel. Ist er gesetzt, wird nicht gemessen. Zugriff in `try/catch`. | Bei wenigen Dutzend Sitzungen verfälschen Teamtests das Bild stark (28.09.: 40 von 57 Aufrufen). Der Eintrag entsteht nur auf ausdrückliche Handlung der Person selbst. |
| E8 | **Rate-Limit** auf `/t`: eigene Zone `manibase_trichter` (60r/m, burst 30, nodelay). | Schutz gegen Log-Flutung. Die Zone hält IPs nur im Speicher. |
| E9 | **Trichter-Log getrennt** unter `/var/log/manibase/trichter.log`, eigene logrotate-Regel: monatlich, 13 Rotationen, komprimiert. | Anonym, daher längere Aufbewahrung vertretbar; liegt bewusst außerhalb von `/var/log/nginx/*.log`, damit die 14-Tage-Regel dort nicht greift. |
| E10 | **Auswertung als Node-Skript** `scripts/trichter-auswertung.mjs` (ohne Abhängigkeiten, liest auch `.gz`). | Node läuft im CI und auf dem Server; Tests wie die übrigen Repo-Tests. |
| E11 | **Datum in Europe/Berlin**, Filter `--von`/`--bis` inklusive. | Deckt sich mit der bisherigen Auswertung. |

## 4. Ereignisse (Schema v1)

Aufruf: `GET|POST /t?v=1&s=<id>&e=<ereignis>[&n=<zahl>][&r=<grund>]`

| `e` | `n` | `r` | Auslöser |
|---|---|---|---|
| `gesehen` | – | – | Maske erstmals zu ≥ 50 % sichtbar (`IntersectionObserver`; fehlt er, entfällt das Ereignis) |
| `begonnen` | – | – | erstes `change`- oder `input`-Ereignis in der Maske |
| `schritt` | 2–5 | – | Schritt n erstmals vorwärts erreicht |
| `fehler` | 1–5 | `auswahl`, `mehrfach`, `gf`, `name`, `email`, `firma`, `einwilligung` | Prüfmeldung angezeigt |
| `abgeschickt` | – | – | Submit gültig, Kalender wird eingeblendet |
| `kalender` | – | `ok`, `fehler` | Zeeg-Widget initialisiert bzw. Zeeg-Skript nicht ladbar (`onerror`, etwa Werbeblocker) |

Die Gründe für `fehler` werden an den bestehenden `showErr`-Aufrufen gesetzt, ein Grund je Prüfregel in `valid()` und im Submit-Handler.

## 5. Trichter-Logik (Auswertung)

- Gültige Zeile: JSON, `v=="1"`, `s` passt auf `^[a-z0-9]{10}$`, `e` aus der Tabelle, `n` ganzzahlig 1–5 wo vorgesehen, `r` aus der Liste. Ungültige Zeilen werden gezählt und ausgewiesen, nicht stillschweigend verworfen.
- Stufen in Reihenfolge: `gesehen` → `begonnen` → `schritt 2` → `schritt 3` → `schritt 4` → `schritt 5` → `abgeschickt`. Je Sitzung zählt die **höchste erreichte Stufe**; eine Sitzung auf Stufe k zählt für alle Stufen ≤ k (fehlt `gesehen` mangels Observer, verfälscht das die Zählung nicht).
- Ausgabe: je Stufe Sitzungen, Anteil an der Vorstufe, Anteil an „gesehen“; darunter `fehler` je Schritt und Grund (Sitzungen), `kalender ok/fehler`, Zeitraum, Anzahl ungültiger Zeilen.

## 6. Dateien

**Repo (PR):**
- `site/scripts/site.js` — Messmodul `trichter()` im Abschnitt 4, Aufrufe in `initWizard()`, `revealCalendar()`/`loadBookingCalendar()`.
- `site/index.html` — nur Cache-Stempel (`scripts/cache-bust.py site`).
- `site/datenschutz.html` — Abschnitt 3: Löschfrist der Server-Logdaten („spätestens nach 15 Tagen“, tägliche Rotation, 14 Generationen); Abschnitt 5: Absatz zur Schrittzählung (was, ohne Cookies/IP, Zufallskennung pro Seitenaufruf, Zweck, Art. 6 Abs. 1 lit. f, 13 Monate, GPC/DNT); Stand-Datum.
- `scripts/trichter-auswertung.mjs` — Auswertung (exportierte reine Funktionen + CLI).
- `scripts/test-trichter.mjs` — Tests der Auswertung.
- `scripts/test-frontend.mjs` — Tests der Ereignisse im Browser-DOM (jsdom).
- `.github/workflows/verify.yml` — Schritt `node scripts/test-trichter.mjs`.
- `docs/deploy/nginx-trichter.conf` — versionierte Kopie der Server-Konfiguration (http-Kontext + Location).
- `docs/deploy/logrotate-manibase-trichter` — versionierte logrotate-Regel.
- `docs/deployment/trichter-und-logrotate.md` — was auf dem Server umgesetzt wurde, Auswertungsbefehl, Rückbau.
- `CLAUDE.md` — kurzer Abschnitt „Formular-Trichter“.

**Server (Hauptsitzung, vor dem Merge, mit Backup und `nginx -t`):**
- `apt install logrotate`, `logrotate.timer` aktiv, Probelauf `logrotate -d`.
- `/etc/nginx/conf.d/manibase-trichter.conf` (log_format + limit_req_zone).
- Location `= /t` im HTTPS-Serverblock von `manibase.de` einfügen.
- `/var/log/manibase/` anlegen, `/etc/logrotate.d/manibase-trichter`.

Reihenfolge: Server zuerst. `/t` antwortet bis zum Merge nur auf Testaufrufe; ohne Server-Teil würden die Beacons nach dem Deploy als 404 im allgemeinen Log landen.

## 7. Bewusst offen

- **Zeeg-Buchung nicht messbar.** `https://assets.zeeg.me/embed.min.js` (geprüft 03.10.2026) verarbeitet nur Nachrichten zur Höhe (`zeeg.page_height`, `zeeg.embed_layout`), ein Buchungsereignis an die Elternseite ist nicht dokumentiert. Eine Probebuchung würde einen echten Termin erzeugen. Die Buchungszahl kommt aus dem Zeeg-Dashboard.
- **Kein Dashboard.** Auswertung per Skript auf dem Server.

## 8. Abnahmekriterien (Definition of Done)

1. Jeder Schritt, jede Prüfmeldung, der Submit und das Laden des Kalenders erzeugen genau ein Ereignis je Seitenaufruf nach Schema v1 (jsdom-Test).
2. Bei GPC, DNT=1 oder `trichter=aus` wird nichts gesendet (Test).
3. Ein Fehler beim Senden (Beacon wirft) lässt die Maske unverändert funktionieren (Test).
4. Die bestehenden Masken-Tests bleiben grün.
5. `trichter-auswertung.mjs` berechnet Stufen kumulativ, filtert nach Datum in Europe/Berlin, liest `.gz`, weist ungültige Zeilen aus (Tests).
6. CI (`verify.yml`) führt beide Testdateien aus; `cache-bust.py --check site` grün.
7. Datenschutzerklärung beschreibt Schrittzählung und Log-Löschfrist wahrheitsgemäß.
8. Server: `logrotate` installiert und Timer aktiv; `/t` antwortet `204`; eine Testzeile landet ohne IP in `/var/log/manibase/trichter.log`; `access.log` enthält den Testaufruf nicht; `nginx -t` grün; die anderen Vhosts antworten wie vorher.

## Offene Review-Punkte

(werden nach Phase B ergänzt)
