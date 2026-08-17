# nginx: Kompression für CSS und JavaScript aktivieren (S3)

**Status: offen, muss auf dem Server ausgeführt werden.** Diese Änderung liegt nicht im Repo, weil der nginx-Vhost auf dem Produktivserver gepflegt wird (`setup-manibase.sh`, nicht versioniert).

## Befund

Gemessen am 17.08.2026 gegen `https://manibase.de`, jeweils mit `Accept-Encoding: gzip, br`:

| Datei | ausgeliefert | `content-encoding` |
|---|---:|---|
| `/styles/site.css` | 116.032 B | *(leer)* |
| `/styles/home.css` | 36.090 B | *(leer)* |
| `/scripts/site.js` | 23.578 B | *(leer)* |

HTML wird komprimiert, `text/css` und `application/javascript` nicht. Alle drei geprüften Wettbewerber (kozoa.de, derprozessmeister.de, innovation-ausbau.de) liefern `br`.

## Warum das die wichtigste Einzelmaßnahme ist

`site.css` ist renderblockierend. Im mobilen Labortest (390 px, 4× CPU-Drossel, 1,6 Mbit/s) ist die Datei bei 2.605 ms fertig, und 99 ms später fällt der LCP bei 2.704 ms. Das ist keine Korrelation, sondern die Kausalkette. Mit gzip fällt `site.css` auf etwa 18 KB, der mobile LCP voraussichtlich unter 1,5 Sekunden.

## Umsetzung

Im Vhost `/etc/nginx/sites-available/manibase.de` innerhalb des `server`-Blocks:

```nginx
gzip              on;
gzip_vary         on;
gzip_comp_level   6;
gzip_min_length   256;
gzip_proxied      any;
gzip_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml
    application/rss+xml;
```

`text/html` ist in `gzip_types` bewusst nicht aufgeführt: nginx komprimiert HTML immer, und die Angabe würde eine Warnung erzeugen.

Prüfen und neu laden:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Ergebnis nachmessen

```bash
curl -sI -H "Accept-Encoding: gzip, br" https://manibase.de/styles/site.css | grep -i "content-encoding\|content-length"
```

Erwartet: `content-encoding: gzip` und eine Größe um 18 KB.

## Optional: Brotli

Brotli liefert bei CSS nochmals etwa 15 bis 20 Prozent weniger als gzip. Auf Debian 13 über `libnginx-mod-brotli`:

```bash
sudo apt install libnginx-mod-brotli
```

```nginx
brotli            on;
brotli_comp_level 6;
brotli_types      text/plain text/css application/javascript application/json image/svg+xml;
```

gzip bleibt dabei als Rückfallebene aktiv. Wenn die Zeit knapp ist: gzip allein holt den weitaus größten Teil des Effekts, Brotli kann später nachgezogen werden.

## Ebenfalls offen: Cache-Header für die neuen Bilder

`assets/*` läuft aktuell auf `max-age=604800` (7 Tage). Das passt weiterhin. Die neuen Dateien `signet-72.webp`, `signet-negative-72.webp` und `favicon-32.png` tragen eigene Namen, es gibt also kein Cache-Problem beim Umstieg.
