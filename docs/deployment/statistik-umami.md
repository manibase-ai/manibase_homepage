# Reichweitenmessung mit Umami (selbst betrieben)

Spec: `docs/superpowers/specs/2026-10-04-statistik-umami-design.md`. Versionierte Server-Dateien: `docs/deploy/umami/` (Kopie des Serverstands vom 04.10.2026; Geheimnisse liegen nur auf dem Server).

## Was wo läuft

| Teil | Ort |
|---|---|
| Dashboard | **https://statistik.manibase.de** (Login) |
| Umami 3.4.0 + Postgres 16 | Docker-Stack `/opt/umami` auf `72.61.153.206`, Umami nur auf `127.0.0.1:3005` |
| Geheimnisse | `/opt/umami/.env` (0600): `POSTGRES_PASSWORD`, `APP_SECRET`, `TWO_FACTOR_ENCRYPTION_KEY`. **`APP_SECRET` nie ändern**, sonst verschieben sich Sitzungskennungen und alle Anmeldungen werden ungültig. |
| Erfassung | über `manibase.de`: `/u.js` (Tracker) und `/api/send` (Messaufrufe), beide ohne Zugriffslog, `/api/send` gedrosselt (300/min, Burst 300, max. 8 KB). Auf `statistik.manibase.de` sind alle Erfassungswege gesperrt, die ohne Anmeldung funktionieren (`/api/send`, `/api/batch`, `/api/record`, `/script.js`, `/recorder.js`, `/p/…`, `/q/…`); erfasst wird nur gedrosselt über `manibase.de`. Restfall: Ist Umami nicht erreichbar oder eine Anfrage zu groß, schreibt nginx eine Zeile mit Client-IP ins `error.log` (Löschung nach Abschnitt 3 der Datenschutzerklärung, in der Regel 15 Tage). |
| Website im Dashboard | „manibase.de“, ID `c7a7cd2d-e528-4fc1-bcea-667f89052ea2` (steht auch in `site/scripts/statistik.js`) |
| Löschung nach 13 Monaten | `umami-aufbewahrung.timer` (täglich) → `/opt/umami/aufbewahrung.sh` |
| nginx | `/etc/nginx/conf.d/manibase-statistik.conf` (Drosselzonen), Vhost `statistik.manibase.de`, im Vhost `manibase.de` der Block „Reichweitenmessung mit Umami“ vor `location / {` |

Die Startseite wird einheitlich als `/` gezählt: `statistik.js` setzt `data-before-send="manibaseVorSenden"`, das `/index.html` in Adresse und Herkunft zu `/` vereinheitlicht (alle internen Links zeigen auf `index.html`).

Wichtige Einstellungen (`docker-compose.yml`): `SALT_ROTATION=day` (Besucherkennung wechselt täglich; Wiederkehrer über mehrere Tage sind deshalb **nicht** erkennbar, Umstellen nur zusammen mit der Datenschutzerklärung), `SKIP_LOCATION_HEADERS=1`, `PRIVATE_MODE=1`, Telemetrie aus, Update-Hinweise an.

## Erster Login (einmalig, Geschäftsführung)

1. Zugang steht auf dem Server: `ssh root@72.61.153.206 'cat /root/umami-zugang.txt'`.
2. Auf https://statistik.manibase.de anmelden, unter **Profil** das Passwort ändern und **Zwei-Faktor-Anmeldung** einschalten.
3. Danach die Datei löschen: `ssh root@72.61.153.206 'shred -u /root/umami-zugang.txt'`.
4. Eigene Browser von der Messung ausnehmen: einmal je Browser `https://manibase.de/datenschutz.html?statistik=aus` öffnen (keine Bestätigung, der Parameter verschwindet aus der Adresse). Zurück mit `?statistik=an`. Gilt nicht im privaten Fenster.

## Wo sehe ich was

- **Übersicht** der Website: Besucher, Seitenaufrufe, Besuche, Absprungrate, Verweildauer, Seiten, Herkunft, Kampagnen (UTM), Länder/Regionen/Städte, Browser, Betriebssysteme, Geräte, Bildschirmgrößen, Sprachen. Oben rechts den Zeitraum wählen.
- **Echtzeit**: wer gerade auf der Seite ist.
- **Ereignisse**: alle Ereignisse mit Zählung; ein Klick zeigt die Eigenschaften (z. B. bei `maske-fehler` Schritt und Grund, bei `klick-extern` das Ziel).
- **Trichter** (einmal anlegen unter *Berichte → Trichter*, Typ jeweils „Ereignis“, Fenster z. B. 60 Minuten), Schritte in dieser Reihenfolge (höchstens 8):
  `maske-gesehen` → `maske-begonnen` → `maske-schritt-2` → `maske-schritt-3` → `maske-schritt-4` → `maske-schritt-5` → `maske-abgeschickt` → `maske-kalender-ok`.
  Umami zählt streng der Reihe nach je Besucher. „Besucher“ heißt hier: derselbe Browser am selben Tag (UTC).
- **Wo die Maske hakt**: Ereignis `maske-fehler`, Eigenschaften `schritt` und `grund` (`auswahl`, `mehrfach`, `gf`, `name`, `email`, `firma`, `einwilligung`).
- **Kontaktwege**: `klick-kontakt` (mit `seite`), `klick-telefon`, `klick-email`, `klick-extern` (mit `ziel`).
- **Nicht sichtbar**: ob nach `maske-kalender-ok` wirklich gebucht wurde. Das zeigt nur Zeeg.

## Prüfen, ob alles läuft

```bash
ssh root@72.61.153.206 'cd /opt/umami && docker compose ps && curl -s http://127.0.0.1:3005/api/heartbeat'
ssh root@72.61.153.206 'systemctl list-timers umami-aufbewahrung.timer; journalctl -u umami-aufbewahrung -n 3 --no-pager'
curl -s -o /dev/null -w '%{http_code}\n' https://manibase.de/u.js        # 200
```

Schlägt der Aufbewahrungs-Timer fehl, gilt die Löschzusage der Datenschutzerklärung (13 Monate) nicht mehr; einen Mailversand gibt es auf dem Server nicht, deshalb gelegentlich prüfen.

## Updates

Das Dashboard zeigt an, wenn eine neue Umami-Version erscheint (Releases: https://github.com/umami-software/umami/releases). Sicherheitsupdates zeitnah einspielen, zuständig ist die Geschäftsführung bzw. die Claude-Sitzung auf Anweisung:

```bash
ssh root@72.61.153.206
cd /opt/umami
docker pull docker.umami.is/umami-software/umami:postgresql-latest
docker image inspect docker.umami.is/umami-software/umami:postgresql-latest --format '{{index .RepoDigests 0}}'
# neuen Digest in docker-compose.yml eintragen (Kommentar mit Version anpassen), dann:
docker compose up -d && curl -s http://127.0.0.1:3005/api/heartbeat
```

Danach `docs/deploy/umami/docker-compose.yml` im Repo nachziehen. Postgres-Hauptversionen nicht ohne Dump/Restore wechseln.

## Sicherung

Die Statistik ist verzichtbar und wird nicht gesichert. Bei Bedarf: `docker compose exec -T db pg_dump -U umami umami | gzip > umami-$(date +%F).sql.gz`.

## Rückbau

`site/scripts/statistik.js` und die `<script>`-Zeilen entfernen, Datenschutz Abschnitt 12 zurücknehmen; auf dem Server den Block „Reichweitenmessung mit Umami“ aus dem Vhost `manibase.de` nehmen, `statistik.manibase.de` aus `sites-enabled` entfernen, `conf.d/manibase-statistik.conf` löschen, `nginx -t && systemctl reload nginx`; `systemctl disable --now umami-aufbewahrung.timer`; `cd /opt/umami && docker compose down -v` (löscht alle Messdaten).

## Protokoll der Einrichtung (04.10.2026)

- Stack angelegt, Standardpasswort durch ein zufälliges ersetzt (nur in `/root/umami-zugang.txt`), Website per SQL angelegt, Zertifikat per certbot (Webroot), nginx mit Sicherungen unter `/root/*.bak-20261004-*`.
- Abnahme: Test-Ereignisse an eine eigene Test-Website kamen samt Land/Region/Stadt und Ereignisdaten an; Test-Website und Daten danach gelöscht. `docker compose restart` übersteht der Stack. Nicht geprüft: Neustart des ganzen Servers.
- **Zwischenfall 09:42 UTC:** Eine lokale Arbeitsdatei war durch die offizielle Umami-Vorlage überschrieben und wurde eingespielt. Folge: zwei Minuten ein zweiter, leerer Datenbank-Container; Umami startete nicht (Port belegt), nach außen war nichts offen, die Website war nicht betroffen. Aus der Sicherung wiederhergestellt, Original-Volume unberührt, Fremd-Volume und Images entfernt.
