# Gesamtstatistik mit Umami (selbst betrieben) plus Formular-Trichter — Design

**Datum:** 04.10.2026 · **Auftrag:** Nikolaus im Chat: „Gesamttracking der Webseite plus des Funnels, Maximum mit minimum Effort“. Entscheidungen per Rückfrage: **Umami selbst gehostet**; Server-Änderungen führt Claude selbst aus. Workflow nach `AUTONOMER-FEATURE-WORKFLOW-DIREKTIVE.md` (je eine Review-Runde für Spec und Plan).
**Verhältnis zur Spec vom 03.10.:** `2026-10-03-formular-trichter-design.md` bleibt gültig für **Ereignisse der Maske** (§4: welche Ereignisse, wann, Dedupe, Enter-Korrektur, Kalender). **Ersetzt** werden Transport (`/t`, nginx-Log), Auswertung (`trichter-auswertung.mjs`) und Opt-out-Parameter. Der Server-Teil von damals (`/t`) wurde nie eingespielt.

## 1. Ziel

Ein Dashboard für die ganze Website (Besucher, Seitenaufrufe, Absprungrate, Verweildauer, Herkunft inkl. UTM, Land, Gerät, Browser, Echtzeit) **und** den Trichter der Qualifizierungs-Maske. Alles läuft auf dem eigenen Server, ohne Cookies und ohne Banner, und erfordert so wenig eigenen Code wie möglich.

## 2. Ausgangslage (geprüft 04.10.2026)

- `*.manibase.de` zeigt per Wildcard auf `72.61.153.206`; `statistik.manibase.de` löst bereits auf.
- Server: 4 vCPU, 15,6 GB RAM (12 GB verfügbar), 154 GB frei. Belegte lokale Ports: 3000 (admin-panel), 3010, 3080, 4000, 5175. `/opt/umami` existiert nicht.
- Umami: Image `docker.umami.is/umami-software/umami:postgresql-latest`, Postgres ≥ 12.14, Port 3000 im Container, Standardzugang `admin`/`umami`, Variablen u. a. `DATABASE_URL`, `APP_SECRET`, `DISABLE_TELEMETRY`, `CLIENT_IP_HEADER`; keine eingebaute Aufbewahrungsfrist.
- Website: `site.js` steht in 12 Seiten im `<head>` mit `defer`. Ohne `site.js` sind `datenschutz.html` und `impressum.html` (echte Inhaltsseiten) sowie die Weiterleitungsseiten `blog/index.html`, `blog/papierkram-am-chef.html`, `ki-klartag.html` und `einfuehrungsprojekt.html` (`http-equiv="refresh"`).
- CSP (Server-Snippet): `script-src 'self' …`, `connect-src 'self' …`.
- PR #18 (Branch `feat/formular-trichter`, nicht gemergt) enthält den Trichter mit Transport an `/t`.

## 3. Entscheidungen

| # | Entscheidung | Begründung |
|---|---|---|
| U1 | **Umami als Docker-Stack** unter `/opt/umami` (Umami + `postgres:16-alpine`, Volume, Netz nur intern). Umami an `127.0.0.1:3005`. Geheimnisse (`APP_SECRET`, DB-Passwort) in `/opt/umami/.env` (0600, root), zufällig erzeugt, nie im Repo und nie im Chat. `DISABLE_TELEMETRY=1`, `DISABLE_UPDATES=1`. Image auf die beim Einrichten gezogene Version festgeschrieben (Tag oder Digest in der Compose-Datei). | Fertiges Dashboard inkl. Trichter, kein eigener Code. Fester Stand statt `latest`, damit ein Neustart nicht unbemerkt aktualisiert. |
| U2 | **Erfassung über die eigene Domain**: im Vhost `manibase.de` `location = /u.js` → Umami `/script.js` und `location = /api/send` → Umami `/api/send`. Weiterreichen mit `X-Real-IP`/`X-Forwarded-For` = `$remote_addr`, `CLIENT_IP_HEADER=x-real-ip`. | CSP bleibt bei `'self'`, keine Drittdomain, weniger Werbeblocker-Verluste. Umami braucht die echte IP fürs Land und den Sitzungs-Hash, speichert sie aber nicht. |
| U3 | **Dashboard** unter `https://statistik.manibase.de` (eigener Vhost, Let's-Encrypt per certbot, Security-Header-Snippet, `limit_req` auf `/api/auth/login`). Der Standardzugang wird beim Einrichten durch ein zufälliges Passwort ersetzt; das liegt nur in `/root/umami-zugang.txt` (0600). Nikolaus ändert es beim ersten Login. | Fertige Oberfläche, nicht offen mit Standardpasswort. |
| U4 | **`site/scripts/statistik.js`** auf allen 14 Inhaltsseiten (die 12 mit `site.js` plus `datenschutz.html` und `impressum.html`), im `<head>` mit `defer`, **vor** `site.js`. Nicht auf den vier Weiterleitungsseiten. Aufgaben: (1) Abschaltung prüfen (U5), (2) falls erlaubt das Umami-Skript `/u.js` mit `data-website-id` und `data-domains="manibase.de"` nachladen, (3) `window.statistik(name, daten)` bereitstellen, das Ereignisse puffert, bis Umami geladen ist, und danach `umami.track` aufruft, (4) Klicks zählen (U6). | Ein Ort für Einbindung und Abschaltung; `data-domains` verhindert Zählung lokal und in Vorschauen. Der Puffer fängt `gesehen` ab, das bei Direktlinks auf `#termin` vor dem Laden von Umami kommen kann. |
| U5 | **Abschaltung**: Global Privacy Control, `navigator.doNotTrack`/`window.doNotTrack === '1'` oder Vermerk `localStorage['manibase-statistik'] === 'aus'` → Umami wird nicht geladen, `window.statistik` tut nichts. Gesetzt/gelöscht über `?statistik=aus` / `?statistik=an` auf jeder Seite mit `statistik.js`; der Parameter wird danach per `history.replaceState` aus der Adresse genommen (ohne Normalisierung der übrigen Parameter, Verfahren wie im Review-Fix vom 03.10.). | Wie bisher, nur für die ganze Seite. Der alte Parameter `trichter` war nie live und entfällt. |
| U6 | **Klicks** (delegierter Listener auf `document`, nur Primärklick): `tel:` → `klick-telefon`, `mailto:` → `klick-email`, Links auf `#termin` → `klick-kontakt` mit `{ seite }`, Links auf fremde Hosts → `klick-extern` mit `{ ziel: host }`. Keine Markup-Änderung, Header/Footer-Generator bleibt unberührt. | Kein Eingriff in die generierten Header/Footer (siehe CLAUDE.md, Generator-Drift). |
| U7 | **Trichter-Ereignisse** (Inhalt und Zeitpunkte unverändert aus Spec 03.10. §4) gehen über `window.statistik` an Umami. Namen: `maske-gesehen`, `maske-begonnen`, `maske-schritt-2` … `maske-schritt-5`, `maske-abgeschickt`, `maske-kalender-ok`, `maske-kalender-fehler`, `maske-fehler` mit Daten `{ schritt, grund }`. Dedupe je Seitenaufruf bleibt in `site.js`. | Umami-Trichter arbeiten mit Ereignisnamen; der Schritt steckt deshalb im Namen. Prüfmeldungen sind kein Trichterschritt, sondern eine Auswertung nach Eigenschaft. |
| U8 | **Aufbewahrung 13 Monate**: systemd-Timer `umami-aufbewahrung.timer` (täglich) führt im Postgres-Container `DELETE … WHERE created_at < now() - interval '13 months'` auf den Ereignis-, Ereignisdaten-, Sitzungsdaten- und (ohne verbleibende Ereignisse) Sitzungstabellen aus. Tabellennamen werden nach der Installation aus dem Schema bestätigt. | Umami löscht nicht von selbst; die Datenschutzerklärung nennt 13 Monate. |
| U9 | **Entfällt aus PR #18**: `scripts/trichter-auswertung.mjs`, `scripts/test-trichter.mjs`, CI-Schritt, `docs/deploy/nginx-trichter.conf`, `docs/deploy/logrotate-manibase-trichter`, der Beacon/fetch-Transport und die Opt-out-Logik in `site.js` (wandern nach `statistik.js`). `logrotate` auf dem Server bleibt (schon installiert, unabhängig). | YAGNI: Umami ersetzt Log und Auswertung. |
| U10 | **Datenschutzerklärung**: neuer Abschnitt **„12. Reichweitenmessung mit Umami“** (nach 11, vor Stand): Zweck, Betrieb auf eigenem Server in Frankfurt, keine Cookies, was verarbeitet wird (aufgerufene Seite, Herkunftsseite, Browser, Betriebssystem, Gerätetyp, Bildschirmgröße, Sprache, aus der IP abgeleitetes Land und Region, Ereignisse der Formularschritte und Klicks auf Kontaktwege), IP-Adresse wird nicht gespeichert, sondern nur kurzzeitig zur Ableitung von Land und einer pseudonymen Sitzungskennung verarbeitet, Art. 6 Abs. 1 lit. f, Löschung nach 13 Monaten, Widerspruch per GPC/DNT oder Link `?statistik=aus` (Startseite öffnet, keine Bestätigung). Abschnitt 5: Absatz „Zählung der Formularschritte“ wird durch einen Verweis auf Abschnitt 12 ersetzt. Abschnitt 11: Fristen nennen. Formulierungen über den Sitzungs-Hash erst nach Prüfung des Umami-Codes festlegen (wie lange die Kennung stabil bleibt). | Wahrheitsgemäß, ohne Behauptung „kein Zugriff auf das Endgerät“. |

## 3a. Änderungen nach Spec-Review Runde 1 (verbindlich, gehen §3 vor)

Server (am 04.10.2026 umgesetzt, siehe `docs/deploy/umami/`):
- **R1 Sitzungskennung täglich** statt monatlich: `SALT_ROTATION=day`. Umami bildet die Kennung aus Website, IP, User-Agent, einem aus dem Tagesbeginn abgeleiteten Salt und `APP_SECRET`. Wiederkehrer werden damit nur innerhalb eines Kalendertags (UTC) verknüpft; Trichter innerhalb eines Besuchs bleiben voll nutzbar, Wiederkehrer-Zahlen über Tage entfallen bewusst. Umstellen auf `month` nur mit angepasster Datenschutzerklärung.
- **R2 Risikoentscheidung § 25 TDDDG:** Der Tracker liest Bildschirmgröße, Sprache und `localStorage['umami.disabled']`, `statistik.js` liest den eigenen Abschalt-Vermerk. Es werden keine Cookies gesetzt und nichts zur Wiedererkennung auf dem Gerät gespeichert. Die Geschäftsführung trägt die verbleibende Rechtsunsicherheit (wie Spec 03.10. E3); Minimierung durch R1, GPC/DNT-Respekt und Abschaltlink.
- **R3 Fälschungsschutz:** `SKIP_LOCATION_HEADERS=1` (Geo-Header vom Client werden ignoriert). Umami übernimmt `ip`/`userAgent` auch aus dem Request-Body; gefälschte Ereignisse bleiben Restrisiko, begrenzt durch `limit_req` (300r/m, burst 300 wegen Veranstaltungen hinter einer NAT-IP) und `client_max_body_size 8k`. Auf `statistik.manibase.de` sind `/api/send` und `/script.js` gesperrt (404).
- **R4 Kein Zugriffslog** für `/u.js` und `/api/send` (`access_log off`), damit nginx zu Messaufrufen keine IP ablegt; `limit_req_log_level info`.
- **R5 Dashboard:** eigene Header (HSTS, `X-Frame-Options DENY`, `Referrer-Policy no-referrer`, `X-Robots-Tag noindex`), nicht das manibase-Snippet (dessen CSP bricht Next.js). `TWO_FACTOR_ENCRYPTION_KEY` gesetzt (2FA beim ersten Login einschalten), `PRIVATE_MODE=1`, `DISABLE_UPDATES` **nicht** gesetzt (Update-Hinweis im Dashboard), Update-Routine im Betriebsdokument.
- **R6 Compose:** Digest-Pins (Umami 3.4.0, Postgres 16), `init: true`, Docker-Logrotation 10 MB × 3, `mem_limit`. `APP_SECRET` nie ändern.
- **R7 Aufbewahrung:** zusätzlich `session_link`, `revenue`, `heatmap_event`, `session_replay`; kein Fremdschlüssel, daher Reihenfolge im Skript. Prüfbefehl im Betriebsdokument (`systemctl list-timers umami-aufbewahrung.timer`, `journalctl -u umami-aufbewahrung`).

Repo (Plan):
- **R8 Tracker-Attribute:** `src="/u.js"`, `data-website-id="c7a7cd2d-e528-4fc1-bcea-667f89052ea2"`, `data-domains="manibase.de"`, `data-exclude-hash="true"` (sonst `/` und `/#termin` getrennt), `data-do-not-track="true"` (zweite Sicherung), `async`. Query bleibt erhalten (UTM).
- **R9 Reihenfolge in `statistik.js`:** erst Abschaltung prüfen und `?statistik=` per `replaceState` entfernen, **dann** den Tracker einfügen (er hängt sich an `history.replaceState` und würde sonst einen zweiten Aufruf zählen).
- **R10 Puffer:** wird **nacheinander** geleert (`umami.track` liefert ein Promise; Kette), damit Ereignisse in Reihenfolge ankommen. Bei `onerror` des Trackers Puffer leeren und künftige Aufrufe verwerfen. Fehler in `umami.track` werden verschluckt.
- **R11 Trichter strikt sequenziell:** Umamis Trichter verlangt alle Vorstufen je Sitzung in Reihenfolge, ohne indirekte Belegung. `site.js` sendet deshalb vor `maske-begonnen` ein noch fehlendes `maske-gesehen` (wer etwas eingibt, hat die Maske gesehen). Trichter-Kette mit 8 Schritten (Umami-Grenze): gesehen, begonnen, schritt-2 … schritt-5, abgeschickt, kalender-ok.
- **R12 `site.js`** ruft `window.statistik` nur, wenn `typeof window.statistik === 'function'`.
- **R13 Klick-Regeln:** `href` endet auf `#termin` (auch `index.html#termin`) → `klick-kontakt` mit `{ seite }`, `seite` normalisiert (`/index.html` → `/`).
- **R14 Einbindung:** Test vergleicht die Reihenfolge im Dokument (`statistik.js` vor `site.js`), nicht die Lage im `<head>` (`infotermin.html`, `interessent.html` laden `site.js` am Ende von `body`).
- **R15 Datenschutz Abschnitt 12** nennt vollständig: aufgerufene Adresse samt Parametern und Seitentitel, Herkunftsseite, Kampagnenparameter (UTM, Klick-Kennungen), Browser, Betriebssystem, Gerätetyp, Bildschirmgröße, Sprache, aus der IP abgeleitet Land, Region und Stadt, Ereignisse (Formularschritte, Hinweise, Klicks auf Kontaktwege). IP wird nur kurzzeitig zur Ableitung von Ort und einer täglich wechselnden pseudonymen Kennung verarbeitet und nicht gespeichert, auch nicht im Zugriffslog. Löschung nach 13 Monaten. Abschalten über GPC/DNT oder `datenschutz.html?statistik=aus` (dort läuft `statistik.js` mit).

## 4. Server-Schritte (Hauptsitzung, mit Backups, `nginx -t`, Rückfallweg)

1. `/opt/umami/` mit `docker-compose.yml` und `.env`; `docker compose up -d`; warten, bis Umami antwortet.
2. Standardpasswort ersetzen (U3), Website „manibase.de“ (Domain `manibase.de`) anlegen, `website_id` notieren (keine Geheimnis-Eigenschaft, steht im Seitenquelltext).
3. Vhost `statistik.manibase.de` (HTTP für certbot, dann HTTPS) und certbot.
4. Im Vhost `manibase.de` die beiden Locations aus U2 gezielt vor `location / {` einfügen.
5. Aufbewahrungs-Timer (U8).
6. Abnahme (§6, Punkt 9).

Reihenfolge: Server zuerst, dann PR mergen (nur auf Anweisung). Ohne Server-Teil lädt `/u.js` mit 404, die Seite funktioniert unverändert.

## 5. Dateien (Repo)

- neu `site/scripts/statistik.js`; geändert `site/scripts/site.js` (Transport/Opt-out raus, `trichter` ruft `window.statistik`), 14 HTML-Seiten (Einbindung + Cache-Stempel), `site/datenschutz.html`.
- `scripts/test-frontend.mjs`: Tests für `statistik.js` (Abschaltung, Puffer, Nachladen mit Attributen, Klicks, Einbindung auf genau den 14 Seiten und vor `site.js`) und angepasste Trichter-Tests (Ereignisnamen und Daten an `window.statistik`).
- entfernt laut U9; `verify.yml` ohne den Trichter-Schritt.
- `docs/deploy/umami/` (Compose-Datei ohne Geheimnisse, `.env.example`, nginx-Blöcke, Aufbewahrungs-Skript und systemd-Units), `docs/deployment/statistik-umami.md` (Stand, Zugang, Bedienung: wo ist was, Trichter anlegen, Rückbau), `docs/deployment/trichter-und-logrotate.md` auf logrotate reduziert, `CLAUDE.md`-Abschnitt.

## 6. Abnahmekriterien

1. `statistik.js` lädt Umami nur ohne GPC/DNT/Vermerk; `?statistik=aus|an` setzt bzw. löscht den Vermerk und verschwindet aus der Adresse, andere Parameter und Hash bleiben unverändert (Tests).
2. `window.statistik` puffert vor dem Laden und gibt danach in Reihenfolge an `umami.track` weiter; abgeschaltet tut es nichts; Fehler in `umami.track` stören die Seite nicht (Tests).
3. Das nachgeladene Skript hat `src="/u.js"`, `data-website-id`, `data-domains="manibase.de"`, `defer` (Test).
4. Klicks auf Telefon, E-Mail, `#termin` und fremde Links erzeugen genau die Ereignisse aus U6 (Test).
5. Die Maske meldet die Ereignisse aus U7 je Seitenaufruf genau einmal, mit den Daten `{schritt, grund}` bei Prüfmeldungen; Formularwerte gehen nie an `window.statistik` (Tests). Enter-Korrektur und Kalenderfälle bleiben grün.
6. Genau die 14 Inhaltsseiten binden `statistik.js` vor `site.js` ein, die vier Weiterleitungsseiten nicht (Test); `cache-bust.py --check site` grün.
7. Datenschutzerklärung: Abschnitt 12 vorhanden, Abschnitt 5 verweist darauf, Fristen in 11, keine Gedankenstriche, keine Behauptung „kein Zugriff auf das Endgerät“ (Test).
8. CI grün.
9. Server: Umami läuft und übersteht `docker compose restart`; `https://manibase.de/u.js` liefert JavaScript mit Security-Headern; ein Testaufruf an `/api/send` erscheint im Dashboard (danach löschen oder Test-Website verwenden); `https://statistik.manibase.de` zeigt die Login-Seite mit gültigem Zertifikat; Standardpasswort funktioniert nicht mehr; Aufbewahrungs-Timer aktiv und Probelauf ohne Fehler; `nginx -t` grün; andere Vhosts unverändert erreichbar; CSP-Header unverändert.

## 7. Bewusst offen

- Zeeg-Buchung selbst bleibt unsichtbar (Embed meldet nur Höhe). Buchungszahlen aus Zeeg.
- Backups der Umami-Datenbank sind nicht Teil dieses Auftrags (Statistik ist verzichtbar); im Betriebsdokument vermerkt.

## Offene Review-Punkte

Runde 1: alle Funde übernommen (siehe §3a), mit diesen Abweichungen: K2 (Image aus `ghcr.io`) nicht übernommen, `docker.umami.is` ist laut Installationsdoku die offizielle Quelle und per Digest festgeschrieben; K3 Server-Neustart nicht geprüft (Produktivserver mit weiteren Diensten), nur `docker compose restart` und `restart: unless-stopped`; W5 `OnFailure=` nicht eingerichtet (kein Mailversand auf dem Server), stattdessen Prüfbefehl im Betriebsdokument.

**Zwischenfall beim Einrichten (04.10.2026, 09:42 UTC):** Eine lokale Arbeitsdatei war durch die offizielle Umami-Vorlage überschrieben; ein Skript ohne Abbruch bei Fehlern spielte sie ein. Folge: zwei Minuten lang ein leerer zweiter Datenbank-Container, Umami startete nicht (Port belegt). Wiederhergestellt aus der Sicherung, Original-Volume unberührt, Fremd-Volume und Images entfernt. Seitdem: Dateien vor dem Hochladen inhaltlich prüfen, `set -euo pipefail`.
