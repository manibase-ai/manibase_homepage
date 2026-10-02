# nginx: HTTP/2, Cache-Header, echte Weiterleitungen, Zeichensatz (Q4, Q7)

**Status: vorbereitet, NICHT auf dem Server ausgeführt.** Grundlage ist der Vhost `/etc/nginx/sites-available/manibase.de`, gelesen am 26.09.2026 (nginx 1.26.3). Der Vhost ist nicht im Repo versioniert; diese Datei beschreibt die Änderung und dient zum Wiederaufbau. Herleitung: [Folgeaudit vom 26.09.2026](../audit/seo/2026-09-26-FOLGEAUDIT.md), Maßnahmen Q4 und Q7.

## Befund

| Punkt | Ist | Folge |
|---|---|---|
| Protokoll | `listen 443 ssl;` ohne `http2`. ALPN verhandelt nur HTTP/1.1 | Lighthouse: bis 810 ms Einsparung mobil, weil CSS, Fonts und Bilder nacheinander über wenige Verbindungen laufen |
| Nachbar-Vhosts | librechat, librechat-admin, ccleads und meckelein haben HTTP/2 bereits | manibase.de ist der einzige Vhost auf dem Server ohne |
| Cache-Header | `expires 7d;` plus `add_header Cache-Control "public, max-age=604800, immutable";` | zwei `Cache-Control`-Header pro Datei |
| `immutable` | gilt auch für Bilder und Fonts ohne `?v=`-Stempel | ein unter gleichem Namen ausgetauschtes Bild bleibt bei Wiederkehrern bis zu 7 Tage alt |
| Sicherheits-Header | das `add_header` in der Asset-Location hebt alle `add_header` des Server-Blocks auf | CSS, JS, Bilder und Schriften kommen ohne jeden Sicherheits-Header: kein HSTS, kein `nosniff`, keine Referrer-Policy, keine CSP (`curl -sI https://manibase.de/styles/site.css` am 03.10.2026: nur die zwei `Cache-Control`-Zeilen) |
| Alte URLs | `ki-klartag.html`, `einfuehrungsprojekt.html`, `blog/papierkram-am-chef.html` liefern 200 mit `meta refresh` | Signale alter Links werden nicht vererbt |
| Zeichensatz | `text/plain` ohne `charset` | `llms.txt` enthält Umlaute; ohne Angabe raten manche Clients Latin-1 |

## Änderung

**1. HTTP/2** in beiden 443-Server-Blöcken (`manibase.de` und `www.manibase.de`), je eine Zeile unter den Certbot-`listen`-Zeilen. Ab nginx 1.25.1 ist `http2` eine eigene Direktive und gilt je Server; der alte Parameter `listen … http2` erzeugt eine Warnung.

```nginx
    http2 on;
```

**2. Zeichensatz** im Server-Block `manibase.de`, neben den `add_header`-Zeilen. Die nginx-Vorgabe für `charset_types` umfasst `text/html`, `text/plain` und `text/xml`, also genau HTML, robots.txt, llms.txt und die Sitemap.

```nginx
    charset utf-8;
```

**3. Echte Weiterleitungen** im Server-Block `manibase.de`, vor `location /`. Exakte Treffer (`location =`) haben Vorrang vor allen anderen Locations. Die Stub-Dateien bleiben im Repo liegen, falls die Seite einmal ohne diesen Vhost ausgeliefert wird.

```nginx
    location = /ki-klartag.html              { return 301 /klartag.html; }
    location = /einfuehrungsprojekt.html     { return 301 /firmen-ki.html; }
    location = /blog/papierkram-am-chef.html { return 301 /#arbeitssituationen; }
```

**4. Sicherheits-Header in ein gemeinsames Include.** nginx vererbt `add_header` nur an Locations, die selbst kein `add_header` setzen. Jede Location mit eigenem Header (die Asset-Locations unten, gegebenenfalls auch `location = /api/newsletter.php`) verliert sonst den kompletten Satz des Server-Blocks. Einzelne Header in jeder Location zu wiederholen, vergisst beim nächsten neuen Header eine Stelle; deshalb stehen alle an genau einer Stelle.

Die `add_header`-Zeilen des Server-Blocks `manibase.de` **unverändert** (inklusive der Zeeg-CSP) in eine eigene Datei verschieben:

```nginx
# /etc/nginx/snippets/manibase-security-headers.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header X-Permitted-Cross-Domain-Policies "none" always;
add_header Content-Security-Policy "…wörtlich aus dem Vhost übernehmen…" always;
```

Die Liste oben ist der Stand der Antwort-Header vom 03.10.2026, nicht der Vhost selbst. Maßgeblich sind die Zeilen im Vhost; was dort steht, wandert 1:1 in die Datei.

Im Server-Block stehen die Zeilen danach nicht mehr, sondern:

```nginx
    include snippets/manibase-security-headers.conf;
```

**5. Asset-Location ersetzen.** CSS und JS tragen seit PR #15 einen Inhalts-Hash (`scripts/cache-bust.py`, CI-Gate in `verify.yml`), dort bleibt `immutable` richtig. Bilder und Fonts haben keinen Stempel und bekommen es nicht mehr. Beide Blöcke binden das Include aus Schritt 4 ein, sonst fehlen dort alle Sicherheits-Header.

Vorher:

```nginx
    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|webp|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
```

Nachher:

```nginx
    # CSS/JS: per ?v=-Hash gestempelt, darf unveraenderlich sein.
    location ~* \.(?:css|js)$ {
        include snippets/manibase-security-headers.conf;
        add_header Cache-Control "public, max-age=604800, immutable" always;
    }

    # Bilder und Fonts: ohne Stempel, deshalb ohne immutable.
    location ~* \.(?:jpg|jpeg|gif|png|svg|ico|webp|woff2?)$ {
        include snippets/manibase-security-headers.conf;
        add_header Cache-Control "public, max-age=604800" always;
    }
```

Danach jede weitere Location im Vhost prüfen: Wer dort ein eigenes `add_header` hat, bekommt dieselbe `include`-Zeile.

## Ausführen

```bash
cp /etc/nginx/sites-available/manibase.de /etc/nginx/sites-available/manibase.de.bak-$(date +%Y%m%d-%H%M%S)
nginx -t && systemctl reload nginx
```

## Nachmessen

```bash
curl -s -o /dev/null -w "%{http_version}\n" --http2 https://manibase.de/
curl -sI https://manibase.de/styles/site.css | grep -ic '^cache-control'
curl -sI https://manibase.de/assets/signet-72.webp | grep -i '^cache-control'
for u in / /styles/site.css /assets/signet-72.webp /fonts/Sora.woff2; do curl -sI https://manibase.de$u | grep -icE '^(strict-transport-security|x-content-type-options|referrer-policy|content-security-policy):'; done
curl -sI https://manibase.de/ki-klartag.html | grep -iE '^(HTTP|location)'
curl -sI https://manibase.de/llms.txt | grep -i '^content-type'
```

Erwartet: `2`, dann `1`, dann `public, max-age=604800` ohne `immutable`, dann viermal `4` (HTML, CSS, Bild und Schrift tragen dieselben Sicherheits-Header), dann `301` mit `location: https://manibase.de/klartag.html`, dann `text/plain; charset=utf-8`.
