# Formular-Trichter und Log-Rotation auf dem Produktivserver

Server `72.61.153.206` (Debian 13), Vhost `/etc/nginx/sites-available/manibase.de`. Spec: `docs/superpowers/specs/2026-10-03-formular-trichter-design.md`. Die versionierten Konfigurationsdateien liegen in `docs/deploy/nginx-trichter.conf` und `docs/deploy/logrotate-manibase-trichter`; der Vhost selbst ist nicht im Repo.

## Stand (03.10.2026)

| Teil | Status |
|---|---|
| `logrotate` installiert | **erledigt**, 03.10.2026 gegen 17:05 Uhr, Paket 3.22.0-1. `logrotate.timer` aktiv, erster Lauf am 04.10.2026 um 00:56 UTC. Probelauf `logrotate -d /etc/logrotate.conf` ohne Fehler; mit der Installation sind alle vorhandenen Regeln unter `/etc/logrotate.d/` aktiv geworden (nginx, php8.4-fpm, apt, dpkg, letsencrypt, ufw, unattended-upgrades, monarx-agent, cloud-init, btmp, wtmp). |
| `/var/log/manibase/`, logrotate-Regel, nginx-Konfiguration für `/t` | **offen.** Das Einspielen in den produktiven nginx wurde am 03.10.2026 von der Rechteprüfung der Claude-Sitzung abgelehnt und ist deshalb nicht passiert. Die Dateien liegen fertig auf dem Server unter `/root/` (siehe unten). |

**Vor dem Merge des PR muss der offene Teil eingespielt sein.** Sonst laufen die Beacons der Website nach dem Deploy auf `location /` und landen als 404 im allgemeinen `access.log`, der Trichter zählt nichts.

## Einspielen (offener Teil)

Auf dem Server als root. Vorbereitet sind `/root/manibase-trichter.conf` (Teil 1 aus `docs/deploy/nginx-trichter.conf`), `/root/logrotate-manibase-trichter` und `/root/locations.conf` (Teil 2, ohne Kommentarzeichen). Sicherung des Vhost vom 03.10.2026: `/root/manibase.de.vhost.bak-20261003-170417`.

```bash
# 1. Log-Verzeichnis: 0755 wie /var/log/nginx. Die nginx-Worker laufen als www-data
#    und oeffnen die Datei bei der Rotation selbst neu; ohne x-Recht schrieben sie in .1 weiter.
install -d -o root -g adm -m 0755 /var/log/manibase
install -o www-data -g adm -m 0640 /dev/null /var/log/manibase/trichter.log

# 2. logrotate-Regel
install -m 0644 /root/logrotate-manibase-trichter /etc/logrotate.d/manibase-trichter

# 3. nginx: http-Kontext
install -m 0644 /root/manibase-trichter.conf /etc/nginx/conf.d/manibase-trichter.conf

# 4. nginx: beide Locations im HTTPS-Serverblock von manibase.de vor "location / {" einfuegen
#    (die Zeile kommt im Vhost genau einmal vor; gezielt einfuegen, die Datei nicht ersetzen,
#    sie wird auch von anderen Sitzungen gepflegt)

# 5. pruefen und neu laden
nginx -t && systemctl reload nginx
```

Rückfall bei Problemen: Vhost aus der Sicherung zurückkopieren, `/etc/nginx/conf.d/manibase-trichter.conf` entfernen, `nginx -t && systemctl reload nginx`.

## Abnahme nach dem Einspielen

```bash
U='https://manibase.de/t?v=1&s=abnahme001&e=gesehen'
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$U"                 # 204
tail -1 /var/log/manibase/trichter.log                                # nur t,v,s,e,n,r,b; t auf volle Stunde
grep -c 'abnahme001' /var/log/nginx/access.log                        # 0
curl -s -o /dev/null -X POST 'https://manibase.de/t?v=1&s=abnahme001&e=%3Cx%3E'
tail -1 /var/log/manibase/trichter.log                                # keine neue Zeile (unbekanntes e)
curl -s -o /dev/null -X POST -A 'Googlebot/2.1' 'https://manibase.de/t?v=1&s=abnahme002&e=gesehen'
tail -1 /var/log/manibase/trichter.log                                # "b":"1"
for i in $(seq 35); do curl -s -o /dev/null -w '%{http_code} ' -X POST "$U"; done; echo   # mindestens ein 503
sleep 40                                                              # Rate-Limit-Eimer wieder fuellen
curl -s -D - -o /dev/null -X POST "$U" | grep -i strict-transport     # Security-Header kommen an
curl -sI https://manibase.de/ | grep -i connect-src                   # 'self' erlaubt
curl -s -o /dev/null -w '%{http_code}\n' 'https://manibase.de/index.html?trichter=aus'   # 200
grep -rn error_log /etc/nginx                                         # keine Stufe unter "error"
logrotate -f /etc/logrotate.d/manibase-trichter
curl -s -o /dev/null -X POST 'https://manibase.de/t?v=1&s=abnahme003&e=gesehen'
tail -1 /var/log/manibase/trichter.log                                # abnahme003 steht in der NEUEN Datei
grep 'open()' /var/log/nginx/error.log | tail -3                      # kein "Permission denied"
for h in librechat librechat-admin meckelein ccleads; do curl -s -o /dev/null -w "$h %{http_code}\n" https://$h.manibase.de/; done
```

Danach die Abnahmezeilen entfernen, damit sie nicht in die Auswertung gehen: `: > /var/log/manibase/trichter.log && rm -f /var/log/manibase/trichter.log.1`.

## Auswertung

Vom eigenen Rechner im Repo:

```bash
ssh root@72.61.153.206 'zcat -f /var/log/manibase/trichter.log*' | node scripts/trichter-auswertung.mjs - --von 2026-10-01 --bis 2026-10-31
```

`--mit-bots` zählt Bot-Sitzungen mit. Eine Sitzung ist ein Seitenaufruf.

## Eigene Besuche ausklammern

Jede Person im Team ruft einmal je Browser `https://manibase.de/?trichter=aus` auf. Es erscheint keine Bestätigung; der Parameter verschwindet aus der Adresse und ein Vermerk im Browser-Speicher schaltet die Zählung ab. Zurück mit `?trichter=an`. Gilt nicht im privaten Fenster.

## Altdaten in access.log

`access.log` enthält IP-Adressen seit dem 13.07.2026. logrotate rotiert beim allerersten Lauf noch nicht, danach täglich; die Altdaten sind damit etwa am 19.10.2026 gelöscht. Sofort löschen **nur auf Anweisung der Geschäftsführung** (nicht umkehrbar):

```bash
logrotate -f /etc/logrotate.d/nginx && rm -f /var/log/nginx/access.log.1 /var/log/nginx/error.log.1
```

## Rückbau

Locations aus dem Vhost entfernen, `/etc/nginx/conf.d/manibase-trichter.conf` und `/etc/logrotate.d/manibase-trichter` löschen, `nginx -t && systemctl reload nginx`. In `site/scripts/site.js` den Block „4a) Formular-Trichter“ und die `trichter(...)`-Aufrufe entfernen, Datenschutz Abschnitte 5 und 11 zurücknehmen.
