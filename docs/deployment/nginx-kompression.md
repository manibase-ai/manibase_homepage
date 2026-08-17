# nginx: Kompression für CSS und JavaScript (S3)

**Status: umgesetzt am 17.08.2026, 19:02 Uhr.** Ausgeführt auf `72.61.153.206` im Vhost `/etc/nginx/sites-available/manibase.de`, Backup unter `manibase.de.bak-20260817-190213`. Diese Datei bleibt als Herleitung und für den Wiederaufbau des Servers stehen; der Vhost selbst ist nicht im Repo versioniert.

## Ergebnis

| Datei | vorher | jetzt | |
|---|---:|---:|---|
| `site.css` | 116.032 B | **25.943 B** | −78 % |
| `home.css` | 36.090 B | **8.665 B** | −76 % |
| `site.js` | 23.578 B | **7.059 B** | −70 % |
| `kinetic-grid.js` | 10.159 B | **3.768 B** | −63 % |
| `seiten.css` | 8.121 B | **2.736 B** | −66 % |
| `tokens.css` | 7.354 B | **3.175 B** | −57 % |

Renderblockierende Last der Startseite: **193 KB auf 49 KB**.

Mobiler LCP, gemessen mit derselben Drosselung wie im Audit (390 px, 4× CPU, 1,6 Mbit/s, 150 ms RTT):

| Seite | vorher | jetzt | |
|---|---:|---:|---|
| `/` | 2.704 ms | **1.356 ms** | −50 % 🟢 |
| `klartag.html` | 2.992 ms | **1.612 ms** | −46 % 🟢 |
| `baugewerbe.html` | 2.452 ms | **1.036 ms** | −58 % 🟢 |
| `ki-helfer.html` | 4.320 ms | **2.856 ms** | −34 % 🟡 |

CLS bleibt auf allen Seiten 0,000. `ki-helfer.html` ist als einzige noch nicht im grünen Bereich: dort ist der LCP ein CSS-Hintergrundbild, das erst nach dem Parsen des CSS entdeckt wird. Das behebt Maßnahme M10, nicht die Kompression.

---

## Herleitung (Stand vor der Änderung)

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

## Was eingesetzt wurde

Im Vhost `/etc/nginx/sites-available/manibase.de` innerhalb des `server`-Blocks für `manibase.de`, direkt vor `root`. **Bewusst dort und nicht global in `nginx.conf`**: auf demselben Server liegen die Vhosts `librechat.manibase.de` und `librechat-admin.manibase.de`, die von der Änderung unberührt bleiben sollten.

`nginx.conf` hatte bereits `gzip on;` (Zeile 47), aber `gzip_types` war auskommentiert. Die nginx-Vorgabe kennt in dem Fall nur `text/html`, was genau das beobachtete Bild erklärt: HTML komprimiert, CSS und JS nicht.

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
