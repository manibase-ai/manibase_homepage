# SEO-Aktionsplan · manibase.de

**Basis:** [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) vom 17. August 2026
**Ausgangswert:** SEO Health Score 56 / 100
**Erwartung nach Critical + High:** ca. 78 / 100

Aufwand in Personenstunden geschätzt. „Repo" = Änderung in `site/`, geht über den bestehenden CI/CD-Deploy live. „Server" = Änderung an der nginx-Konfiguration auf `72.61.153.206`, braucht SSH und `nginx -t` + `reload`.

---

## CRITICAL — sofort

Blockiert Indexierung oder kostet unmittelbar Ranking.

### C-1 · robots.txt anlegen
**Aufwand:** 15 Min · **Ort:** Repo · `site/robots.txt`

```
User-agent: *
Allow: /

# KI-Crawler ausdrücklich erlaubt
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://manibase.de/sitemap.xml
```

Der Zugang für KI-Crawler ist heute nur deshalb offen, weil gar keine robots.txt existiert. Er muss beim Anlegen bewusst erlaubt werden, sonst kippt der Ist-Zustand versehentlich.

### C-2 · sitemap.xml anlegen
**Aufwand:** 30 Min · **Ort:** Repo · `site/sitemap.xml`

Nur die elf indexierbaren Seiten aufnehmen. **Nicht** aufnehmen: `index.html` (Duplikat von `/`), `datenschutz.html`, `impressum.html`, `infotermin.html`, `interessent.html`, die vier Weiterleitungs-Stubs.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://manibase.de/</loc><lastmod>2026-08-17</lastmod><priority>1.0</priority></url>
  <url><loc>https://manibase.de/klartag.html</loc><lastmod>2026-08-17</lastmod><priority>0.9</priority></url>
  <url><loc>https://manibase.de/firmen-ki.html</loc><lastmod>2026-08-17</lastmod><priority>0.9</priority></url>
  <url><loc>https://manibase.de/baugewerbe.html</loc><lastmod>2026-08-17</lastmod><priority>0.8</priority></url>
  <url><loc>https://manibase.de/gebaeudetechnik-ausbau.html</loc><lastmod>2026-08-17</lastmod><priority>0.8</priority></url>
  <url><loc>https://manibase.de/planungsbueros.html</loc><lastmod>2026-08-17</lastmod><priority>0.8</priority></url>
  <url><loc>https://manibase.de/prozessautomatisierung.html</loc><lastmod>2026-08-17</lastmod><priority>0.7</priority></url>
  <url><loc>https://manibase.de/ki-helfer.html</loc><lastmod>2026-08-17</lastmod><priority>0.7</priority></url>
  <url><loc>https://manibase.de/fuer-ihre-it.html</loc><lastmod>2026-08-17</lastmod><priority>0.7</priority></url>
  <url><loc>https://manibase.de/ueber-uns.html</loc><lastmod>2026-08-17</lastmod><priority>0.6</priority></url>
</urlset>
```

`lastmod` muss bei inhaltlichen Änderungen mitgepflegt werden, sonst ist das Feld schädlicher als kein Feld. Sinnvoll: in `scratchpad/nav.py` mit erzeugen, dort wird ohnehin schon über alle Seiten iteriert.

### C-3 · gzip für CSS und JS aktivieren
**Aufwand:** 20 Min · **Ort:** Server (nginx)

Aktuell wird nur `text/html` komprimiert. `site.css` geht mit 116 KB roh raus und blockiert das Rendering — das ist die direkte Ursache des mobilen LCP von 2,7 s.

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    application/rss+xml
    image/svg+xml;
```

Falls das Brotli-Modul verfügbar ist, zusätzlich `brotli on; brotli_types …` — das bringt bei CSS nochmal 15–20 % gegenüber gzip.

**Verifikation:**
```bash
curl -sS -D - --compressed -o /dev/null https://manibase.de/styles/site.css | grep -i 'content-encoding\|content-length'
```
Erwartet: `content-encoding: gzip` und ca. 18–20 KB statt 116 KB.

### C-4 · Logo-PNGs verkleinern
**Aufwand:** 30 Min · **Ort:** Repo · `site/assets/`

| Datei | jetzt | Ziel |
|---|---|---|
| `signet.png` | 129 KB, 512×512 | ≈2 KB, 72×72 WebP + PNG-Fallback |
| `signet-negative.png` | 62 KB, 281×237 | ≈2 KB, 72×72 WebP + PNG-Fallback |

Beide werden bei 36×36 px dargestellt, 72×72 deckt 2×-Displays ab. **191 KB Ersparnis auf jeder einzelnen Seite.** Auf Mobil braucht `signet.png` heute 2,4 s und konkurriert dabei direkt mit `site.css`.

```bash
cd site/assets
sips -Z 72 signet.png --out signet-72.png
cwebp -q 88 -resize 72 72 signet.png -o signet.webp
cwebp -q 88 -resize 72 72 signet-negative.png -o signet-negative.webp
```

Da beide Logos aus dem Nav-Generator kommen, die Änderung in `scratchpad/nav.py` machen, nicht in 13 Dateien einzeln. `alt=""` bleibt — das ist korrekt, der Wortmarken-Text steht daneben.

**Nicht vergessen:** Der Asset-Versionsstempel muss mit (siehe `docs`/Memory zum Cache-Busting), sonst sehen wiederkehrende Besucher sieben Tage lang das alte Logo.

### C-5 · Canonicals ergänzen
**Aufwand:** 10 Min · **Ort:** Repo

```html
<!-- site/klartag.html -->     <link rel="canonical" href="https://manibase.de/klartag.html">
<!-- site/ueber-uns.html -->   <link rel="canonical" href="https://manibase.de/ueber-uns.html">
<!-- site/fuer-ihre-it.html --><link rel="canonical" href="https://manibase.de/fuer-ihre-it.html">
```

`datenschutz.html` und `impressum.html` sind noindex, dort optional.

---

## HIGH — innerhalb einer Woche

Kostet spürbar Ranking oder Klickrate.

### H-1 · Open-Graph-Tags auf alle Unterseiten
**Aufwand:** 1,5 Std · **Ort:** Repo (über `nav.py` oder per Seite)

Heute hat **nur die Startseite** OG-Tags. Jede in LinkedIn oder WhatsApp geteilte Unterseite erscheint als nackte URL. Bei einem B2B-Vertrieb, der Seiten per Mail und LinkedIn verschickt, ist das direkt verlorene Aufmerksamkeit.

Pro Seite in den `<head>`:

```html
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="manibase">
<meta property="og:url" content="https://manibase.de/klartag.html">
<meta property="og:title" content="Klartag: ein Tag, bevor Sie in KI investieren">
<meta property="og:description" content="…"><!-- = meta description der Seite -->
<meta property="og:image" content="https://manibase.de/assets/og-manibase.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image" content="https://manibase.de/assets/og-manibase.jpg">
```

Auf der Startseite fehlen `twitter:title/description/image` — X fällt auf OG zurück, das funktioniert, sollte aber explizit stehen. Mittelfristig eigene OG-Bilder je Seitentyp; kurzfristig reicht `og-manibase.jpg` überall.

### H-2 · Startseiten-Title und -Description kürzen
**Aufwand:** 20 Min · **Ort:** Repo · `site/index.html`

Aktuell: Title 90 Zeichen, Description 265 Zeichen. Beides wird in der SERP abgeschnitten.

```html
<title>KI für Bau, Handwerk und Planung einführen · manibase</title>
<meta name="description" content="manibase führt KI strukturiert in Bauunternehmen, ausführenden Gewerken und Planungsbüros ein: Arbeitsplatz, Automatisierungen, Helfer. Einstieg über den Klartag, 3.900 € netto.">
```

Title 53 Zeichen, Description 178 Zeichen — Letztere noch leicht über der Kappungsgrenze, aber die Kernaussage inklusive Preis steht vorn. Der Preis in der Description ist ein starker CTR-Hebel, weil ihn im Wettbewerb praktisch niemand nennt.

Sechs weitere Descriptions liegen zwischen 171 und 208 Zeichen. Bei Gelegenheit auf ≤ 160 kürzen, der Schaden ist dort aber gering, weil die Kernaussage jeweils vorn steht.

### H-3 · Die vier dünnen Zielseiten ausbauen
**Aufwand:** 8–12 Std · **Ort:** Repo · **Der größte inhaltliche Hebel des gesamten Audits**

| Seite | eigene Wörter heute | Ziel |
|---|---|---|
| `planungsbueros.html` | ≈180 | 800–1.000 |
| `baugewerbe.html` | ≈196 | 800–1.000 |
| `gebaeudetechnik-ausbau.html` | ≈231 | 800–1.000 |
| `prozessautomatisierung.html` | ≈236 | 700–900 |

Das sind die Einstiegsseiten für die kommerziell wertvollsten Suchanfragen („KI für Bauunternehmen einführen", „KI im Handwerksbetrieb", „KI im Architekturbüro"). Sie konkurrieren gegen Ratgeber mit 1.500+ Wörtern und haben aktuell keine Chance.

Die Gliederung steht bereits (4–6 H2, 3–4 H3), es fehlt Substanz darunter. Pro Seite ergänzen:

- **Definitorischer Einstiegsabsatz** (2–3 Sätze) — zitierbar für AI-Systeme.
- **Drei bis vier konkrete Arbeitssituationen** aus dem jeweiligen Gewerk, je 80–120 Wörter, in der Sprache der Zielgruppe. Der Baukasten dafür existiert schon auf der Startseite (Blatt 01) und in `docs/relaunch/`.
- **Was manibase nicht macht** — Abgrenzung schafft Vertrauen und ist zitierbar.
- **FAQ-Block mit 4–6 Fragen** (siehe H-5).
- **Zwei bis drei kontextuelle Links im Fließtext** auf `klartag.html`, `firmen-ki.html`, `fuer-ihre-it.html` mit variierendem Ankertext (siehe H-4).

**Wichtig:** Keine erfundenen Fallbeispiele, keine Zahlen ohne Beleg. Die bestehende Linie („noch keine erfundene Erfolgsgeschichte") ist ein Vertrauensvorteil und darf beim Ausbau nicht geopfert werden. Substanz entsteht hier aus Fachtiefe, nicht aus Referenzen.

### H-4 · Kontextuelle interne Verlinkung
**Aufwand:** 2 Std · **Ort:** Repo · **kombiniert mit H-3 erledigen**

Heute stammen alle 11–13 internen Links jeder Seite aus Header und Footer. Es gibt keinen einzigen Link aus dem Fließtext, folglich sitewide identische Ankertexte und einen völlig flachen Linkgraphen.

Zielbild:
- Zielgruppenseiten → `klartag.html` (Ankertext variieren: „im Klartag prüfen", „an einem Tag klären, welcher Ablauf trägt")
- Zielgruppenseiten → `firmen-ki.html` und `ki-helfer.html`
- `fuer-ihre-it.html` → `firmen-ki.html` (Architekturwege)
- `klartag.html` → alle drei Zielgruppenseiten („für Bauunternehmen", „für Gebäudetechnik und Ausbau", „für Planungsbüros")
- `ueber-uns.html` → `klartag.html`

### H-5 · FAQ-Blöcke mit `FAQPage`-Schema
**Aufwand:** 4 Std · **Ort:** Repo

Vier bis sechs Fragen je auf `klartag.html`, `fuer-ihre-it.html` und den drei Zielgruppenseiten. Doppelter Nutzen: Featured Snippets bei Google und deutlich bessere Zitierbarkeit in ChatGPT, Perplexity und AI Overviews — AI-Systeme bevorzugen Passagen, die eine explizite Frage beantworten.

Kandidatenfragen (aus dem vorhandenen Material ableitbar):
- Was kostet ein Klartag und was ist enthalten?
- Wird der Klartag auf ein Folgeprojekt angerechnet?
- Bleiben unsere Daten im Haus?
- Brauchen wir Microsoft 365 dafür?
- Wie lange dauert eine KI-Einführung?
- Was muss unsere IT vorher klären?

Sichtbaren Text und Schema **identisch** halten — Google verwirft `FAQPage`-Markup, dessen Inhalt nicht auf der Seite steht.

### H-6 · Schema ausbauen
**Aufwand:** 3 Std · **Ort:** Repo

Aktuell existiert genau ein JSON-LD-Block auf der ganzen Website (`Organization`, Startseite). Er ist valide, aber minimal.

**Startseite — `Organization` erweitern:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://manibase.de/#org",
  "name": "manibase",
  "legalName": "manibase UG (haftungsbeschränkt)",
  "url": "https://manibase.de/",
  "logo": { "@type": "ImageObject", "url": "https://manibase.de/assets/signet.png",
            "width": 512, "height": 512 },
  "email": "kontakt@manibase.de",
  "telephone": "+4915565697065",
  "address": { "@type": "PostalAddress", "streetAddress": "Würzburger Str. 1",
               "postalCode": "97246", "addressLocality": "Eibelstadt", "addressCountry": "DE" },
  "areaServed": { "@type": "Country", "name": "DE" },
  "knowsLanguage": "de",
  "founder": [
    { "@type": "Person", "name": "Matthias Geisler" },
    { "@type": "Person", "name": "Nikolaus Schauersberger" }
  ],
  "sameAs": ["<LinkedIn-Firmenprofil>"],
  "description": "…"
}
```

Für `logo` ein quadratisches Bild verwenden (`signet.png`), nicht `wortmarke.png` — das 4:1-Querformat wird von Google häufig verworfen.

**`klartag.html` — `Service` + `Offer`:** Der offen genannte Preis von 3.900 € netto ist ein Differenzierungsmerkmal, das kaum ein Wettbewerber hat. Er gehört ausgezeichnet.

**`ueber-uns.html` — zwei `Person`-Objekte** mit `jobTitle`, `worksFor` (Verweis auf `#org`) und `sameAs`. Direkter E-E-A-T-Hebel.

**Alle Unterseiten — `BreadcrumbList`.**

**Nicht auszeichnen:** `AggregateRating` und `Review`, solange keine echten Bewertungen vorliegen. Das wäre ein Richtlinienverstoß.

### H-7 · Hero-Bilder als WebP mit responsiven Varianten
**Aufwand:** 2 Std · **Ort:** Repo

| Datei | jetzt | Problem |
|---|---|---|
| `hero-hands.jpg` | 257 KB, 2200×1467 | CSS-Hintergrund → LCP 4,3 s auf `ki-helfer.html` |
| `klartag-workshop-unsplash.jpg` | 236 KB, 1800×1350 | LCP-Element, kein `srcset` |
| `it-team-unsplash.jpg` | 218 KB | kein WebP |

Alle drei brauchen WebP-Varianten in zwei Breiten (900 / 1800) und `srcset`. Erwartbare Ersparnis: 60–70 %.

Für `hero-hands.jpg` zusätzlich: Es ist ein CSS-`background-image` und wird deshalb erst nach dem CSS-Parsing entdeckt — auf Mobil frühestens nach 2,4 s. Entweder im `<head>` von `ki-helfer.html` vorladen:

```html
<link rel="preload" as="image" href="assets/hero-hands.webp" fetchpriority="high">
```

oder — sauberer — auf ein echtes `<img>` mit `fetchpriority="high"` umstellen, wie es `klartag.html` bereits macht.

---

## MEDIUM — innerhalb eines Monats

### M-1 · HTTP/2 aktivieren
**Aufwand:** 15 Min · **Ort:** Server

Der Server antwortet mit HTTP/1.1. Bei 10–14 Ressourcen und 150 ms RTT auf Mobil kostet das mehrere hundert Millisekunden durch Head-of-Line-Blocking.

```nginx
# nginx < 1.25.1
listen 443 ssl http2;
# nginx >= 1.25.1
listen 443 ssl;
http2 on;
```

Verifikation: `curl -sS -o /dev/null -w '%{http_version}\n' https://manibase.de/` → erwartet `2`.

### M-2 · H1 auf `ki-helfer.html` entschlacken
**Aufwand:** 30 Min · **Ort:** Repo

Der H1 enthält im `sr-only`-Span die vollständige Rotator-Wortliste — 283 Zeichen mit 14 aufgezählten Leistungen. Barrierefrei ist das korrekt gelöst, für Suchmaschinen ist es eine Keyword-Aufzählung im wichtigsten Element der Seite. Das Risiko ist nicht Abstrafung, sondern Verwässerung.

`sr-only`-Text auf drei bis vier Begriffe kürzen:
```html
<span class="sr-only">Ihre individuelle KI-Assistenz für Berichte, Angebote und Dokumentation.</span>
```
Die vollständige Liste in einen sichtbaren Absatz oder eine `<ul>` unter dem H1 verschieben, wo sie inhaltlich zählt. Die `aria-hidden`-Rotator-Mechanik bleibt unverändert.

### M-3 · Echte 301-Weiterleitungen statt Meta-Refresh
**Aufwand:** 45 Min · **Ort:** Server

Vier Alt-URLs nutzen `<meta http-equiv="refresh">`. Handwerklich sauber (mit noindex und Canonical), aber ein Meta-Refresh vererbt Linkjuice schlechter und wird langsamer als permanent gewertet.

```nginx
location = /ki-klartag.html            { return 301 /klartag.html; }
location = /einfuehrungsprojekt.html   { return 301 /firmen-ki.html; }
location = /blog/                      { return 301 /; }
location = /blog/papierkram-am-chef.html { return 301 /#arbeitssituationen; }
location = /index.html                 { return 301 /; }
```

Die HTML-Stubs im Repo als Sicherheitsnetz belassen — falls die nginx-Konfiguration beim nächsten Provisionieren verloren geht, greifen sie weiter.

### M-4 · nginx-Header aufräumen
**Aufwand:** 30 Min · **Ort:** Server

Zwei Punkte:

1. **`Cache-Control` wird doppelt gesendet** (`max-age=604800` und `public, max-age=604800, immutable`). Deutet auf zwei konkurrierende `add_header`-Blöcke — `add_header` in einem `location`-Block addiert, es überschreibt nicht.
2. **`Content-Type` ohne Charset.** Browser fallen auf `<meta charset>` zurück, aber jeder Parser, der dem Header vertraut, dekodiert nach ISO-8859-1 und verstümmelt jeden Umlaut. Genau das ist beim Crawl für dieses Audit passiert.

```nginx
charset utf-8;
charset_types text/html text/css application/javascript application/json text/xml;
```

### M-5 · Restliche Meta-Descriptions kürzen
**Aufwand:** 45 Min · **Ort:** Repo

Auf ≤ 160 Zeichen: `gebaeudetechnik-ausbau.html` (208), `ki-helfer.html` (207), `baugewerbe.html` (193), `firmen-ki.html` (192), `klartag.html` (178), `fuer-ihre-it.html` (171).

### M-6 · Footer-Überschriften von `<h2>` auf `<p>`
**Aufwand:** 15 Min · **Ort:** Repo (`nav.py`)

`Zielgruppen`, `KI-Einführung`, `Unternehmen` stehen auf jeder Seite als `<h2 class="footer__h">`. Auf `baugewerbe.html` sind damit 3 von 6 H2 reine Navigation. Auf `<p class="footer__h">` umstellen — die CSS-Klasse trägt die Optik ohnehin, es ändert sich optisch nichts.

### M-7 · `/favicon.ico` bereitstellen
**Aufwand:** 20 Min · **Ort:** Repo

`<link rel="icon">` ist gesetzt, das reicht für Browser. Google fragt zusätzlich `/favicon.ico` ab (404). Ein 48×48-Icon unter `/favicon.ico` sichert das Favicon in den Suchergebnissen.

### M-8 · Aktualitätssignale einführen
**Aufwand:** 1,5 Std · **Ort:** Repo

Es gibt auf der gesamten Website **keine einzige Datumsangabe** — kein `datePublished`, kein `dateModified`, kein `<time>`. Weder Google noch AI-Systeme haben ein Aktualitätssignal.

Pro Seite ein `WebPage`-Schema mit `dateModified` plus ein dezentes „Stand: August 2026" im Footer. Über `nav.py` mit erzeugen, dann pflegt es sich mit jedem Nav-Lauf.

---

## LOW — Backlog

### L-1 · `llms.txt` anlegen
**Aufwand:** 1 Std

Der Standard ist noch nicht etabliert und kein Rankingfaktor. Für eine Firma, die KI-Einführung verkauft, ist die Datei aber auch ein Positionierungssignal an eine technisch versierte Zielgruppe. Inhalt: Firmenprofil, Leistungen, Preise, Kontakt, Verweise auf die Hauptseiten.

### L-2 · Falsche `width`/`height` am Klartag-Hero korrigieren
**Aufwand:** 5 Min

```html
<img src="assets/klartag-workshop-unsplash.jpg" … width="4032" height="3024" …>
```
Die Datei ist 1800×1350. Das Seitenverhältnis stimmt, deshalb entsteht **kein** Layout Shift (CLS ist gemessen 0,000). Trotzdem korrigieren, sonst führt die nächste Bildänderung zu einem stillen Fehler.

### L-3 · Ungenutzte und überdimensionierte Assets aufräumen
**Aufwand:** 30 Min

- `manibase-cockpit.png` (947 KB) ist der `<img src>`-Fallback hinter den WebP-Quellen. Moderne Browser laden ihn nie, aber ein JPEG bei Qualität 82 wäre ~200 KB.
- `logo.png` (144 KB) liegt ungenutzt in `assets/`.
- `wortmarke.png` (105 KB, 900×225) wird nur im Schema referenziert — nach H-6 dort durch `signet.png` ersetzt und dann ebenfalls prüfbar.

### L-4 · `site.css` aufteilen
**Aufwand:** 3 Std

116 KB für eine 13-seitige statische Website ist viel. Nach C-3 (gzip) ist der Druck deutlich geringer — erst danach bewerten, ob sich Startseiten-spezifische Regeln noch nach `home.css` verschieben lassen.

### L-5 · Informationalen Content aufbauen
**Aufwand:** laufend · **strategisch der wichtigste Punkt überhaupt**

Alle 13 Seiten sind transaktional. Es existiert **keine einzige informationale Seite** — kein Ratgeber, kein Glossar, kein Fachbeitrag. Der Blog ist eine noindex-Weiterleitung.

Die Domain hat null Autoritätssignale: keine Backlinks, keine externen Erwähnungen, keine `sameAs`-Profile. Für eine Domain in dieser Lage ist informationaler Content der einzige realistische Weg, überhaupt Sichtbarkeit aufzubauen — und gleichzeitig der wirksamste GEO-Hebel, weil AI-Systeme erklärende Passagen zitieren, keine Verkaufsseiten.

Themen, für die die fachliche Substanz nachweislich vorhanden ist (Beleg: `fuer-ihre-it.html`):
- EU AI Act für Bau- und Handwerksbetriebe: was ab wann gilt
- DSGVO-konforme KI im Betrieb: private Cloud gegen Microsoft 365
- Microsoft 365 Copilot gegen eigene KI-Umgebung: eine Entscheidungshilfe
- KI in der Baudokumentation: was heute funktioniert und was nicht
- Was eine KI-Einführung im Mittelstand tatsächlich kostet

Flankierend: LinkedIn-Firmenprofil aufsetzen und als `sameAs` einbinden, Einträge in Branchenverzeichnissen Bau/Handwerk.

---

## Reihenfolge in der Umsetzung

**Block 1 — ein Nachmittag, Repo + Server** (C-1 bis C-5)
robots.txt, sitemap.xml, gzip, Logo-PNGs, Canonicals. Danach: Search Console einrichten, Sitemap einreichen, Indexierung anstoßen.
→ Score-Erwartung: 56 → ca. 68

**Block 2 — eine Woche, überwiegend Repo** (H-1, H-2, H-6, H-7 + M-1)
OG-Tags, Startseiten-Meta, Schema, Hero-Bilder, HTTP/2. Alles technisch, keine Redaktion nötig.
→ Score-Erwartung: ca. 68 → ca. 78

**Block 3 — zwei bis drei Wochen, redaktionell** (H-3, H-4, H-5)
Zielseiten ausbauen, interne Verlinkung, FAQ. Der eigentliche Ranking-Hebel und der aufwendigste Teil.
→ Score-Erwartung: ca. 78 → ca. 86

**Block 4 — laufend** (M-2 bis M-8, L-1 bis L-5)
Feinschliff und Content-Aufbau.

---

## Verifikation nach Umsetzung

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://manibase.de/robots.txt
curl -sS -o /dev/null -w '%{http_code}\n' https://manibase.de/sitemap.xml
curl -sS -D - --compressed -o /dev/null https://manibase.de/styles/site.css | grep -i content-encoding
curl -sS -o /dev/null -w '%{http_version}\n' https://manibase.de/
curl -sS -o /dev/null -w '%{size_download}\n' https://manibase.de/assets/signet.png
```

Danach mit dem Rich Results Test (`search.google.com/test/rich-results`) das Schema prüfen und den mobilen LCP über PageSpeed Insights gegenmessen. Nach etwa vier Wochen die Felddaten in der Search Console gegen die hier gemessenen synthetischen Werte halten.
