# Log-Rotation auf dem Produktivserver

Server `72.61.153.206` (Debian 13). Bis zum 03.10.2026 war `logrotate` nicht installiert; `/var/log/nginx/access.log` wuchs seit dem 13.07.2026 ungebremst und enthält IP-Adressen aller Vhosts.

## Stand

- `logrotate` 3.22.0-1 installiert am 03.10.2026, `logrotate.timer` aktiv (täglich).
- Mit der Installation sind alle vorhandenen Regeln unter `/etc/logrotate.d/` aktiv geworden: nginx (täglich, 14 Generationen, `notifempty`), php8.4-fpm, apt, dpkg, letsencrypt, ufw, unattended-upgrades, monarx-agent, cloud-init, btmp, wtmp. Probelauf `logrotate -d /etc/logrotate.conf` ohne Fehler.
- Die Paketregel `/etc/logrotate.d/nginx` ist unverändert (dpkg-Konfigurationsdatei). Wegen `notifempty` kann eine leere Datei länger liegen bleiben; die Datenschutzerklärung sagt deshalb „in der Regel nach 15 Tagen“.
- Die Messaufrufe der Reichweitenmessung (`/u.js`, `/api/send`) schreibt nginx gar nicht ins Log (siehe `statistik-umami.md`).

## Altdaten

logrotate rotiert beim allerersten Lauf noch nicht, danach täglich; die Altdaten aus `access.log` sind damit etwa am 19.10.2026 gelöscht. Sofort löschen **nur auf Anweisung der Geschäftsführung** (nicht umkehrbar):

```bash
ls -la /var/log/nginx/      # vorher ansehen: nur access.log* und error.log* (alle Vhosts teilen sich diese Dateien)
logrotate -f /etc/logrotate.d/nginx && rm -f /var/log/nginx/access.log.[0-9]* /var/log/nginx/error.log.[0-9]*
ls -la /var/log/nginx/
```

## Prüfen

```bash
ssh root@72.61.153.206 'systemctl list-timers logrotate.timer; ls -la /var/log/nginx/'
```
