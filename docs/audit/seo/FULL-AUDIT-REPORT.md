# SEO-Vollaudit · manibase.de

**Datum:** 17. August 2026
**Geprüfte Domain:** https://manibase.de/
**Gecrawlte Seiten:** 13 indexierbare HTML-Seiten (+ 6 noindex-Seiten geprüft)
**Messung:** Live-Crawl, Header-Analyse, Chromium (Playwright) Desktop 1440px und Mobil 390px mit 4× CPU-Drossel und 1,6 Mbit/s

---

## Executive Summary

### SEO Health Score: **56 / 100**

| Kategorie | Gewicht | Score | Beitrag |
|---|---|---|---|
| Technical SEO | 25 % | 62 | 15,5 |
| Content Quality | 25 % | 55 | 13,8 |
| On-Page SEO | 20 % | 65 | 13,0 |
| Schema / Structured Data | 10 % | 25 | 2,5 |
| Performance (CWV) | 10 % | 58 | 5,8 |
| Images | 5 % | 60 | 3,0 |
| AI Search Readiness | 5 % | 40 | 2,0 |
| **Gesamt** | | | **55,6 → 56** |

### Erkannter Geschäftstyp

**B2B-Dienstleister / Beratung mit lokalem Sitz** (KI-Einführung für Bau, Handwerk und Planung, DACH, deutschsprachig einsprachig, Sitz Eibelstadt bei Würzburg, Leistungsverkauf über Erstgespräch und einen bepreisten Einstiegstag). Relevanter Schema-Stack wäre folglich `Organization` + `ProfessionalService` + `Service`/`Offer` + `Person` + `BreadcrumbList`, nicht E-Commerce oder Publisher.

### Die fünf kritischsten Befunde

1. **Keine robots.txt** — `https://manibase.de/robots.txt` liefert 404. Suchmaschinen finden keinen Sitemap-Verweis, es gibt keine Crawl-Steuerung.
2. **Keine sitemap.xml** — 404. Bei einer Seite ohne externe Verlinkung und ohne Blog ist die Sitemap der schnellste Weg zur vollständigen Indexierung.
3. **CSS und JS werden unkomprimiert ausgeliefert** — `site.css` geht mit **116 KB roh** über die Leitung (HTML wird korrekt gzip-komprimiert, CSS/JS nicht). Die Datei ist render-blockierend und bestimmt auf Mobil direkt den LCP: auf der Startseite ist `site.css` bei 2.605 ms fertig, der LCP fällt bei 2.704 ms.
4. **Canonical fehlt auf fünf Seiten** — `klartag.html`, `ueber-uns.html`, `fuer-ihre-it.html`, `datenschutz.html`, `impressum.html` haben kein `<link rel="canonical">`. Alle übrigen Seiten haben eines.
5. **Vier kommerzielle Zielseiten sind dünn** — `planungsbueros.html` (≈180 eigene Wörter), `baugewerbe.html` (≈196), `gebaeudetechnik-ausbau.html` (≈231), `prozessautomatisierung.html` (≈236), jeweils nach Abzug von 139 Wörtern Navigations- und Footer-Boilerplate. Das sind genau die Seiten, die auf „KI für Bauunternehmen" ranken sollen.

### Die fünf schnellsten Gewinne

1. **`signet.png` verkleinern** — 512×512 PNG mit **129 KB**, dargestellt bei 36×36 px. Dazu `signet-negative.png` mit 62 KB. Zusammen **191 KB Ballast auf jeder einzelnen Seite**. Ein 72×72-WebP kostet ca. 2 KB. Aufwand: 10 Minuten, Wirkung: −190 KB sitewide.
2. **gzip für `text/css` und `application/javascript` in nginx aktivieren** — eine Zeile `gzip_types`, spart ca. 105 KB pro Erstaufruf und schneidet den mobilen LCP spürbar.
3. **robots.txt und sitemap.xml anlegen** — zwei statische Dateien in `site/`, mit dem bestehenden Deploy sofort live.
4. **Canonicals auf den fünf Seiten ergänzen** — fünf Zeilen HTML.
5. **Open-Graph-Tags auf alle Unterseiten** — aktuell hat **nur die Startseite** OG-Tags. Jede geteilte Unterseite erscheint in LinkedIn und WhatsApp ohne Bild und ohne Titelbild.

---

## 1. Technical SEO

**Score: 62 / 100**

### Was gut ist

| Prüfpunkt | Ergebnis |
|---|---|
| HTTPS | ✓ gültiges Zertifikat, sauberer Handshake (64 ms) |
| HSTS | ✓ `max-age=31536000; includeSubDomains; preload` |
| `http://` → `https://` | ✓ 301 |
| `www.` → Apex | ✓ 301 |
| `X-Content-Type-Options` | ✓ `nosniff` |
| `X-Frame-Options` | ✓ `DENY` |
| `Referrer-Policy` | ✓ `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ✓ restriktiv gesetzt |
| `Content-Security-Policy` | ✓ vollständig, mit Zeeg-Ausnahmen |
| `Cross-Origin-Opener-Policy` | ✓ `same-origin` |
| Viewport-Meta | ✓ auf allen 13 Seiten |
| `lang="de"` | ✓ auf allen Seiten |
| 404-Handling | ✓ echter 404-Status für unbekannte Pfade |
| Horizontaler Überlauf mobil | ✓ keiner, auf allen vier geprüften Seiten |
| JS-Rendering nötig? | ✓ nein, Inhalt steht vollständig im HTML |

Die Security-Header sind besser als bei den meisten Mittelstands-Websites. Das ist kein Rankingfaktor, aber es ist sauber.

### Befunde

**T-1 · KRITISCH · robots.txt fehlt (404)**
Ohne robots.txt gibt es keinen `Sitemap:`-Verweis. Google findet die Sitemap dann nur über die Search Console. Für AI-Crawler (GPTBot, ClaudeBot, PerplexityBot) gilt: ohne robots.txt sind sie standardmäßig erlaubt — das ist hier erwünscht, sollte aber bewusst dokumentiert statt zufällig sein.

**T-2 · KRITISCH · sitemap.xml fehlt (404)**
Auch `sitemap_index.xml` ist 404. 13 indexierbare Seiten, keine eingehenden Links von außen (der Crawl fand nur ausgehende Links zu Zeeg, Unsplash und der EU-ODR-Plattform). Die Sitemap ist hier der Haupt-Discovery-Pfad.

**T-3 · HOCH · CSS und JS ohne Kompression**

```
GET /                   Content-Encoding: gzip     42.717 B → 13.216 B  ✓
GET /styles/site.css    (keine)                   116.032 B            ✗
GET /scripts/site.js    (keine)                    23.578 B            ✗
```

nginx komprimiert offenbar nur `text/html`. `gzip_types` muss um `text/css application/javascript` (und `image/svg+xml`, `font/woff2` bringt nichts, woff2 ist bereits komprimiert) erweitert werden. `site.css` würde von 116 KB auf ca. 18–20 KB fallen.

**T-4 · HOCH · Canonical fehlt auf fünf Seiten**

| Seite | Canonical |
|---|---|
| `/` | ✓ `https://manibase.de/` |
| `/index.html` | ✓ `https://manibase.de/` (korrekt entduplizierend) |
| `/baugewerbe.html` | ✓ |
| `/gebaeudetechnik-ausbau.html` | ✓ |
| `/planungsbueros.html` | ✓ |
| `/firmen-ki.html` | ✓ |
| `/prozessautomatisierung.html` | ✓ |
| `/ki-helfer.html` | ✓ |
| `/klartag.html` | ✗ **fehlt** |
| `/ueber-uns.html` | ✗ **fehlt** |
| `/fuer-ihre-it.html` | ✗ **fehlt** |
| `/datenschutz.html` | ✗ fehlt (noindex, unkritisch) |
| `/impressum.html` | ✗ fehlt (noindex, unkritisch) |

`klartag.html` ist die Umsatzseite mit dem 3.900-Euro-Angebot. Dort fehlt das Canonical.

**T-5 · MITTEL · Kein HTTP/2**
Der Server antwortet mit `HTTP/1.1`. Bei 10–14 Ressourcen pro Seite kostet das Head-of-Line-Blocking messbar Zeit. `listen 443 ssl http2;` in der nginx-vhost-Konfiguration genügt (bei nginx ≥ 1.25.1: `http2 on;`).

**T-6 · MITTEL · Alte URLs nutzen Meta-Refresh statt 301**

| URL | Mechanik | Ziel |
|---|---|---|
| `/ki-klartag.html` | `<meta http-equiv="refresh" content="0; url=klartag.html">` + noindex + canonical | klartag.html |
| `/einfuehrungsprojekt.html` | dito | firmen-ki.html |
| `/blog/` | dito | ../index.html |
| `/blog/papierkram-am-chef.html` | dito | ../index.html#arbeitssituationen |

Handwerklich sauber gemacht (noindex + canonical + Refresh), aber ein Meta-Refresh vererbt Linkjuice schlechter als ein `301` und Google braucht länger, ihn als permanent zu werten. Auf einem eigenen nginx ist ein echter `return 301` verfügbar und kostenlos.

**T-7 · NIEDRIG · `Cache-Control` wird doppelt gesendet**

```
Cache-Control: max-age=604800
Cache-Control: public, max-age=604800, immutable
```

Zwei Header derselben Sorte bei jedem Asset. Browser sind tolerant, aber es deutet auf zwei konkurrierende `add_header`-Blöcke in der nginx-Konfiguration. `add_header` in einem `location`-Block überschreibt geerbte Header nicht, er addiert. Aufräumen.

**T-8 · NIEDRIG · `Content-Type` ohne Charset**
`Content-Type: text/html` ohne `; charset=utf-8`. Browser fallen auf das `<meta charset="UTF-8">` im Dokument zurück, es ist also live unauffällig — aber jeder Crawler oder Parser, der sich auf den Header verlässt, dekodiert nach ISO-8859-1 und verstümmelt jeden Umlaut. (Genau das ist beim Crawl für dieses Audit passiert.) `charset utf-8;` in nginx setzen.

**T-9 · NIEDRIG · `/favicon.ico` liefert 404**
`<link rel="icon" href="assets/signet.png">` ist gesetzt, das reicht für Browser. Google fragt zusätzlich `/favicon.ico` ab. Ein 48×48-Multiple-Icon unter `/favicon.ico` ist die sicherere Variante für das Favicon in den Suchergebnissen.

---

## 2. Content Quality

**Score: 55 / 100**

### E-E-A-T-Bewertung

| Signal | Bewertung | Beleg |
|---|---|---|
| **Experience** | mittel | Konkrete Arbeitssituationen (Regiebericht, Aufmaß, Nachtrag, Herstellerunterlagen) zeigen Branchenkenntnis. Aber: keine Projektberichte, keine Zahlen, keine Screenshots aus echten Einführungen. |
| **Expertise** | gut | `fuer-ihre-it.html` (738 Wörter) geht in Architektur, Rollen, Betrieb, Exit — das liest sich wie jemand, der es gemacht hat. Beide Gründer sind mit Namen, Foto und Werdegang genannt. |
| **Authoritativeness** | schwach | Keine externen Erwähnungen, keine Referenzen, keine Logos, keine Fachbeiträge, kein Blog, keine `sameAs`-Profile im Schema. Die Domain hat keinerlei Autoritätssignale. |
| **Trustworthiness** | **sehr gut** | Vollständiges Impressum mit HRB 18632, ausführliche Datenschutzerklärung mit 11 Abschnitten, echte Adresse, echte Telefonnummer, Preis offen genannt (3.900 Euro netto). Besonders stark: `ueber-uns.html` sagt wörtlich „Ein laufendes Projekt, noch keine erfundene Erfolgsgeschichte" — diese Ehrlichkeit ist ein echtes Vertrauenssignal, nicht nur Rhetorik. Auch `ki-helfer.html` weist den Reifegrad jedes Helfers offen aus. |

**Fazit:** Trust ist überdurchschnittlich, Authority ist praktisch null. Das ist das typische Profil einer jungen, seriösen Firma. Der Hebel liegt eindeutig bei Authority, nicht bei Trust.

### Thin Content

Boilerplate (Header + Footer) = 139 Wörter pro Seite. Netto-Eigeninhalt:

| Seite | Gesamt | Netto | Bewertung |
|---|---|---|---|
| `index.html` | 1.864 | ≈1.725 | ✓ solide |
| `fuer-ihre-it.html` | 738 | ≈599 | ✓ ausreichend |
| `klartag.html` | 665 | ≈526 | ⚠ knapp für eine Umsatzseite |
| `firmen-ki.html` | 590 | ≈451 | ⚠ knapp |
| `ueber-uns.html` | 497 | ≈358 | ⚠ knapp |
| `ki-helfer.html` | 470 | ≈331 | ⚠ dünn |
| `prozessautomatisierung.html` | 375 | ≈236 | ✗ **dünn** |
| `gebaeudetechnik-ausbau.html` | 370 | ≈231 | ✗ **dünn** |
| `baugewerbe.html` | 335 | ≈196 | ✗ **dünn** |
| `planungsbueros.html` | 319 | ≈180 | ✗ **dünn** |

Die drei Zielgruppenseiten sind die Einstiegspunkte für die wichtigsten kommerziellen Suchanfragen („KI für Bauunternehmen", „KI im Handwerk einführen", „KI im Architekturbüro"). Mit unter 250 eigenen Wörtern konkurrieren sie gegen Ratgeberartikel mit 1.500+ Wörtern. Sie haben je 4–6 H2 und 3–4 H3 — die Struktur steht, es fehlt der Inhalt darunter.

### Duplicate Content

Nur ein Fall, und der ist korrekt gelöst: `/` und `/index.html` liefern identisches HTML, beide setzen Canonical auf `/`. Ein zusätzlicher `301` von `/index.html` auf `/` wäre die sauberere Lösung, ist aber nicht dringend.

Keine kannibalisierenden Titel oder Descriptions über die restlichen elf Seiten. Jede Seite hat eine eigene Description, jede ist inhaltlich unterscheidbar geschrieben.

### Lesbarkeit und Sprache

Die Copy ist deutlich besser als der Branchenschnitt: kurze Sätze, konkrete Substantive, keine Buzzwords, durchgehend Sie-Ansprache, keine Gedankenstriche. Die H2 sind vollständige Aussagesätze („Fachzeit gehört an die Anlage, nicht an die Ablage.") statt Substantivblöcke — das ist gut für Featured Snippets und für AI-Zitierbarkeit.

**Aber:** Es gibt **keinerlei Datumsangaben** auf der gesamten Seite. Kein `datePublished`, kein `dateModified`, kein `<time>`-Element. Für Suchmaschinen und für AI-Systeme gibt es kein Aktualitätssignal.

### Content-Lücke

Der Blog ist eine noindex-Weiterleitung („Fachinhalte werden neu aufgebaut"). Es existiert **keine einzige informationale Seite** — kein Ratgeber, kein Glossar, keine FAQ, kein Beitrag zu EU AI Act, DSGVO bei KI, Copilot vs. eigene Umgebung, KI in der Baudokumentation. Alle 13 Seiten sind transaktional. Für eine Domain ohne Backlinks ist informationaler Content der einzige realistische Weg, überhaupt Sichtbarkeit aufzubauen.

---

## 3. On-Page SEO

**Score: 65 / 100**

### Title-Tags

| Seite | Länge | Bewertung |
|---|---|---|
| `/` | **90** | ✗ zu lang, wird bei ~580 px abgeschnitten |
| `klartag.html` | 68 | ⚠ grenzwertig |
| `planungsbueros.html` | 63 | ✓ |
| `ki-helfer.html` | 60 | ✓ |
| `fuer-ihre-it.html` | 60 | ✓ |
| `ueber-uns.html` | 59 | ✓ |
| `gebaeudetechnik-ausbau.html` | 57 | ✓ |
| `firmen-ki.html` | 56 | ✓ |
| `prozessautomatisierung.html` | 48 | ✓ |
| `baugewerbe.html` | 45 | ✓ |

Alle unique, alle mit konsistentem `· manibase`-Suffix, alle mit Keyword vorn. Nur die Startseite bricht aus:

> `KI-Arbeitsplätze, Automatisierungen und Helfer für Bau, Handwerk und Planung · manibase` (90 Zeichen)

Vorschlag (58 Zeichen): `KI für Bau, Handwerk und Planung einführen · manibase`

### Meta-Descriptions

| Seite | Länge | Bewertung |
|---|---|---|
| `/` | **265** | ✗ deutlich zu lang, Abschnitt ab ~160 wird verworfen |
| `gebaeudetechnik-ausbau.html` | 208 | ⚠ |
| `ki-helfer.html` | 207 | ⚠ |
| `baugewerbe.html` | 193 | ⚠ |
| `firmen-ki.html` | 192 | ⚠ |
| `klartag.html` | 178 | ⚠ |
| `fuer-ihre-it.html` | 171 | ✓ |
| `planungsbueros.html` | 159 | ✓ |
| `prozessautomatisierung.html` | 157 | ✓ |
| `ueber-uns.html` | 149 | ✓ |

Inhaltlich sind sie gut (konkret, mit Nutzenversprechen). Sechs von zehn liegen über den ~155–160 Zeichen, die in der Desktop-SERP ankommen. Der wichtige Teil steht jeweils vorn, der Schaden ist begrenzt — aber die Startseite verliert über 100 Zeichen.

### Überschriftenstruktur

Genau ein `<h1>` pro Seite auf allen 13 Seiten. ✓

**Zwei Befunde:**

**O-1 · MITTEL · `ki-helfer.html` hat einen 283 Zeichen langen H1 mit Keyword-Liste**

Der H1 enthält ein `<span class="sr-only">` mit der vollständigen Wortliste des Rotators:

> „Ihre individuelle KI-Assistenz für Berichte, Schriftverkehr, Angebotserstellung, E-Mails, Wissensmanagement, Kundensupport, Dokumentation, Terminplanung, Baudokumentation, Aktenvermerke, Normen und Vorgaben, Auftragsvorbereitung und Auftragsprüfung."

Barrierefrei ist das korrekt gelöst (sr-only-Fassung plus `aria-hidden` auf der animierten Fassung). Für Suchmaschinen ist es eine 14-gliedrige Keyword-Aufzählung im wichtigsten Element der Seite. Das Risiko ist nicht Abstrafung, sondern Verwässerung: kein Keyword bekommt Gewicht. Empfehlung: sr-only-Text auf drei bis vier Begriffe kürzen (`… für Berichte, Angebote und Dokumentation.`) und die volle Liste in einen sichtbaren Absatz oder eine `<ul>` unter dem H1 verschieben, wo sie inhaltlich zählt statt zu verdünnen.

**O-2 · NIEDRIG · Footer-Spaltenüberschriften sind `<h2>`**

`Zielgruppen`, `KI-Einführung`, `Unternehmen` stehen auf jeder Seite als `<h2 class="footer__h">`. Dadurch endet jede Seitengliederung mit drei Navigations-H2 auf derselben Ebene wie die Inhaltsabschnitte. Auf `baugewerbe.html` sind das 3 von 6 H2. Empfehlung: auf `<p class="footer__h">` umstellen, die CSS-Klasse trägt die Optik ohnehin.

### Open Graph und Twitter Cards

**O-3 · HOCH · Nur die Startseite hat Social-Meta-Tags**

| Seite | og:title | og:image | twitter:card |
|---|---|---|---|
| `/` | ✓ | ✓ `og-manibase.jpg` | ✓ `summary_large_image` |
| **alle 12 Unterseiten** | ✗ | ✗ | ✗ |

Wenn `klartag.html` oder `baugewerbe.html` in LinkedIn oder WhatsApp geteilt wird — und genau das passiert bei B2B-Vertrieb ständig — erscheint eine nackte URL ohne Vorschaubild. Zusätzlich: auf der Startseite ist `twitter:card` gesetzt, aber `twitter:title`, `twitter:description` und `twitter:image` fehlen; X fällt dann auf OG zurück, das funktioniert, ist aber unnötig implizit.

### Interne Verlinkung

**O-4 · MITTEL · Verlinkung ist reine Navigation**

Jede Seite bekommt 11–13 interne Links — und das sind auf allen Seiten dieselben, weil sie aus Header-Dropdown und Footer stammen. Es gibt praktisch **keine kontextuellen Links im Fließtext**. Folgen:

- Ankertexte sind sitewide identisch („Baugewerbe", „Firmen-KI"), es gibt keine Variation für semantische Signale.
- Der Linkgraph ist flach: jede Seite ist von jeder Seite gleich weit entfernt, es gibt keine thematische Nähe.
- Keine Breadcrumbs, weder visuell noch als Schema.

Empfehlung: In den Fließtext der Zielgruppenseiten je zwei bis drei kontextuelle Links setzen (z. B. von `baugewerbe.html` auf `klartag.html` mit Ankertext „im Klartag prüfen, welcher Ablauf trägt", von `fuer-ihre-it.html` auf `firmen-ki.html`). Beim Content-Ausbau der dünnen Seiten fällt das ohnehin an.

---

## 4. Schema und Structured Data

**Score: 25 / 100**

### Aktueller Stand

**Ein einziger JSON-LD-Block auf der gesamten Website**, auf der Startseite:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "manibase UG (haftungsbeschränkt)",
  "url": "https://manibase.de/",
  "logo": "https://manibase.de/assets/wortmarke.png",
  "email": "kontakt@manibase.de",
  "telephone": "+49 15565 697065",
  "address": { "@type": "PostalAddress", "streetAddress": "Würzburger Str. 1",
               "postalCode": "97246", "addressLocality": "Eibelstadt", "addressCountry": "DE" },
  "description": "…"
}
```

Der Block ist **syntaktisch valide** und die Daten stimmen mit Impressum und Footer überein (NAP-Konsistenz ✓). Er ist nur minimal.

### Fehlende Felder im vorhandenen Block

`legalName`, `sameAs` (LinkedIn/Xing der Firma und der Gründer), `foundingDate`, `founder`, `contactPoint` mit `contactType: "sales"` und `availableLanguage: "de"`, `areaServed`, `vatID` (sobald vorhanden), `identifier` für HRB 18632, `image`.

`logo` zeigt auf `wortmarke.png` (900×225). Google verlangt für das Organisationslogo ein Bild von mindestens 112×112 px — das ist erfüllt — empfiehlt aber ein quadratisches oder nahezu quadratisches Format. Das 4:1-Querformat wird häufig verworfen.

### Fehlende Schema-Typen

| Typ | Wo | Nutzen |
|---|---|---|
| `ProfessionalService` | Startseite (statt/ergänzend zu Organization) | Lokale Sichtbarkeit im Raum Würzburg, Entitätsverständnis |
| `Service` + `Offer` | `klartag.html` | Der Preis (3.900 € netto) ist offen genannt und wäre auszeichenbar — starkes Differenzierungssignal, kaum ein Wettbewerber nennt Preise |
| `Service` | `firmen-ki.html`, `prozessautomatisierung.html`, `ki-helfer.html` | Leistungsverständnis |
| `Person` | `ueber-uns.html` | Beide Gründer mit `jobTitle`, `sameAs`, `worksFor` — direkter E-E-A-T-Hebel |
| `BreadcrumbList` | alle Unterseiten | Breadcrumb-Darstellung in der SERP statt roher URL |
| `WebSite` | Startseite | Entitätsverankerung |
| `FAQPage` | Zielgruppenseiten, `fuer-ihre-it.html` | Sobald FAQ-Blöcke existieren (siehe Content-Empfehlung) |

**Wichtige Einschränkung:** `AggregateRating` und `Review` dürfen **nicht** ausgezeichnet werden, solange es keine echten, verifizierbaren Bewertungen gibt. Das wäre ein Richtlinienverstoß und passt auch nicht zur Linie „keine erfundene Erfolgsgeschichte".

---

## 5. Performance / Core Web Vitals

**Score: 58 / 100**

### Messwerte

**Desktop (1440 px, ungedrosselt)**

| Seite | LCP | FCP | TTFB | CLS | Transfer |
|---|---|---|---|---|---|
| `/` | **496 ms** ✓ | 496 ms | 139 ms | **0,000** ✓ | 564 KB |
| `klartag.html` | **408 ms** ✓ | 340 ms | 105 ms | **0,000** ✓ | 689 KB |
| `baugewerbe.html` | **348 ms** ✓ | 348 ms | 80 ms | **0,000** ✓ | 441 KB |
| `ki-helfer.html` | **600 ms** ✓ | 500 ms | 86 ms | **0,000** ✓ | 836 KB |

**Mobil (390 px, 4× CPU-Drossel, 1,6 Mbit/s, 150 ms RTT)**

| Seite | LCP | FCP | Load | CLS | LCP-Element |
|---|---|---|---|---|---|
| `/` | **2.704 ms** ⚠ | 2.704 ms | 4.129 ms | **0,000** ✓ | H1 (Text) |
| `klartag.html` | **2.992 ms** ⚠ | 2.992 ms | 3.867 ms | **0,000** ✓ | `p.lead` (Text) |
| `baugewerbe.html` | **2.452 ms** ⚠ | 2.452 ms | 2.774 ms | **0,000** ✓ | `p.lead` (Text) |
| `ki-helfer.html` | **4.320 ms** ✗ | 2.432 ms | 4.296 ms | **0,000** ✓ | `.helper-hero` (CSS-Hintergrundbild) |

Schwellen: LCP gut ≤ 2.500 ms, verbesserungswürdig ≤ 4.000 ms, schlecht > 4.000 ms. CLS gut ≤ 0,1.

### Bewertung

**CLS ist auf allen Seiten exakt 0,000.** Das ist bemerkenswert und verdient festgehalten zu werden: alle `<img>` tragen `width` und `height`, die Fonts sind selbst gehostet und vorgeladen, es gibt keine nachträglich eingeschobenen Banner. Diese Disziplin sollte bei jeder Änderung erhalten bleiben.

**Desktop ist durchweg exzellent.** TTFB unter 140 ms, LCP unter 600 ms.

**Mobil ist der Problembereich.** Drei Seiten liegen im gelben Bereich, `ki-helfer.html` im roten. Die Ursachen sind eindeutig und behebbar:

**P-1 · HOCH · Render-blockierendes, unkomprimiertes CSS bestimmt den mobilen LCP**

Auf `/` mobil:

```
tokens.css            fertig bei    591 ms      7,6 KB
_fontface.css         fertig bei  1.382 ms      0,9 KB
home.css              fertig bei  1.463 ms     36,4 KB
site.css              fertig bei  2.605 ms    116,3 KB   ← blockiert
FCP / LCP                         2.704 ms
```

Der LCP fällt **99 ms nachdem `site.css` fertig geladen ist**. Das ist kein Zufall, das ist Kausalität. Mit gzip fiele `site.css` auf ~18 KB und der LCP damit voraussichtlich unter 1,5 s. Das ist die wirksamste Einzelmaßnahme des gesamten Audits.

Zusätzlich: `site.css` mit 116 KB ist für eine 13-seitige statische Website groß. Ein Teil davon wird auf jeder Unterseite geladen, aber nur auf der Startseite gebraucht. Nach dem gzip-Fix lohnt ein Blick, ob sich Startseiten-spezifische Regeln nach `home.css` verschieben lassen.

**P-2 · HOCH · Logo-PNGs kosten 191 KB auf jeder Seite**

| Datei | Dateigröße | Bildmaße | Darstellung |
|---|---|---|---|
| `signet.png` | **129 KB** | 512×512 | 36×36 px (Header) |
| `signet-negative.png` | **62 KB** | 281×237 | 36×36 px (Footer) |

Auf Mobil braucht `signet.png` allein **2.439 ms** zum Laden und konkurriert dabei mit `site.css` um Bandbreite. Ein 72×72-WebP (für 2× Displays) kostet etwa 2 KB. Ersparnis: ca. **190 KB pro Seitenaufruf, auf allen 13 Seiten**.

Hinweis: `alt=""` an beiden Signets ist **korrekt** — der Wortmarken-Text steht direkt daneben, das Bild ist dekorativ. Das ist kein Fehler und soll so bleiben.

**P-3 · MITTEL · `ki-helfer.html`: LCP ist ein CSS-Hintergrundbild**

`.helper-hero` lädt `hero-hands.jpg` (2200×1467, **257 KB**) per `background-image` in `site.css` und `seiten.css`. Ein CSS-Hintergrund wird erst entdeckt, wenn das CSS geparst ist — auf Mobil also frühestens nach 2,4 s, dann folgen 1,9 s Ladezeit → LCP 4.320 ms.

Drei Maßnahmen, kombinierbar:
1. WebP-Variante erzeugen (erwartbar ~80 KB statt 257 KB).
2. `<link rel="preload" as="image" href="assets/hero-hands.webp" fetchpriority="high">` im `<head>` von `ki-helfer.html`.
3. Besser noch: auf ein echtes `<img>` mit `fetchpriority="high"` und `srcset` umstellen, wie es `klartag.html` bereits macht.

Dasselbe gilt für `it-team-unsplash.jpg` (218 KB) auf `fuer-ihre-it.html`.

**P-4 · MITTEL · Kein HTTP/2** (siehe T-5). Bei 10–14 Ressourcen und 150 ms RTT auf Mobil kostet das mehrere hundert Millisekunden.

**P-5 · NIEDRIG · Drittanbieter**
Zeeg wird korrekt erst **nach** Abschluss der Qualifizierungs-Maske und expliziter Einwilligung nachgeladen (`loadBookingCalendar()`). Es gibt keinerlei Third-Party-Skripte beim Erstaufruf. Kein Analytics, kein Tag Manager, keine Fonts von Google. Das ist der Grund für die guten Desktop-Werte und sollte so bleiben.

**INP** ließ sich nicht synthetisch messen (erfordert echte Nutzerinteraktion). Risikoeinschätzung: gering. Das ausgelieferte JS ist klein (`site.js` 23,6 KB, `kinetic-grid.js` 10,2 KB), es gab **keine Konsolenfehler** auf keiner geprüften Seite. Einzige Beobachtung: `kinetic-grid.js` zeichnet auf `mousemove` in eine Canvas; auf schwachen Geräten könnte das die Hauptthread-Latenz erhöhen. Das Skript respektiert bereits `prefers-reduced-motion`. Nach dem Livegang über die Search Console mit Felddaten gegenprüfen.

---

## 6. Images

**Score: 60 / 100**

### Was gut ist

- **Alle Inhaltsbilder haben beschreibenden Alternativtext.** Beispiel: `alt="manibase-Cockpit mit KI-Helfern für Baudokumentation, Angebotsassistenz und weiteren betrieblichen Rollen"`. Das ist deutlich über dem Durchschnitt.
- **Alle `<img>` tragen `width` und `height`** → CLS 0,000.
- **`loading="lazy"` konsequent** auf allen Bildern unterhalb des Falzes (9 von 11 auf der Startseite), `fetchpriority="high"` + `loading="eager"` auf dem Hero von `klartag.html`.
- **WebP mit `srcset` und `sizes`** für die Inhaltsbilder (`sit-*`, `hero-plan-*`, `helfer-*`, `manibase-cockpit-*`).
- `alt=""` an den dekorativen Signets ist korrekt gesetzt.

### Befunde

**I-1 · HOCH · Logo-PNGs massiv überdimensioniert** — siehe P-2.

**I-2 · MITTEL · Unsplash-Hero-Fotos nur als JPEG, ohne responsive Varianten**

| Datei | Größe | Maße | Einsatz |
|---|---|---|---|
| `hero-hands.jpg` | 257 KB | 2200×1467 | CSS-Hintergrund `.helper-hero` |
| `klartag-workshop-unsplash.jpg` | 236 KB | 1800×1350 | `<img>` auf `klartag.html`, LCP-Element |
| `it-team-unsplash.jpg` | 218 KB | — | `fuer-ihre-it.html` |

Anders als die selbst erzeugten Bilder haben diese drei keine WebP-Variante und kein `srcset`. Auf einem 390-px-Display wird ein 1800-px-Bild geladen. WebP bei Qualität 80 plus zwei Breiten (900/1800) würde etwa 60–70 % einsparen.

**I-3 · NIEDRIG · Falsche `width`/`height` auf dem Klartag-Hero**

```html
<img src="assets/klartag-workshop-unsplash.jpg" … width="4032" height="3024" …>
```

Die Datei ist tatsächlich 1800×1350. Das Seitenverhältnis (4:3) stimmt überein, deshalb entsteht **kein** Layout Shift — CLS ist gemessen 0,000. Trotzdem sollten die Werte die Realität abbilden, sonst führt die nächste Bildänderung zu einem stillen Fehler.

**I-4 · NIEDRIG · `manibase-cockpit.png` ist ein 947-KB-Fallback**

Im `<picture>`-Element ist `manibase-cockpit.png` (3200×2400, 947 KB) der `<img src>`-Fallback hinter den WebP-Quellen. Moderne Browser laden ihn nie. Trotzdem: ein JPEG bei Qualität 82 wäre etwa 200 KB und würde denselben Zweck erfüllen. Zusätzlich liegt eine ungenutzte `logo.png` mit 144 KB im Assets-Ordner.

---

## 7. AI Search Readiness (GEO)

**Score: 40 / 100**

### Crawler-Zugang

| Crawler | Status |
|---|---|
| GPTBot (ChatGPT) | ✓ erlaubt (keine robots.txt = keine Sperre) |
| ClaudeBot | ✓ erlaubt |
| PerplexityBot | ✓ erlaubt |
| Google-Extended | ✓ erlaubt |

Der Zugang ist offen, aber **unbeabsichtigt offen**. Sobald eine robots.txt angelegt wird (Empfehlung T-1), muss der Zugang für diese Crawler bewusst erlaubt werden, sonst kippt ein Vorteil versehentlich ins Gegenteil.

**Kein `llms.txt`** vorhanden (404). Der Standard ist noch nicht etabliert und kein Rankingfaktor, aber für eine Firma, die KI-Einführung verkauft, ist eine `llms.txt` auch ein Positionierungssignal an eine technisch versierte Zielgruppe.

**JS-Rendering ist nicht erforderlich** — der gesamte Inhalt steht im ausgelieferten HTML. Das ist für AI-Crawler wichtiger als für Google, weil die meisten kein JavaScript ausführen. ✓

### Zitierbarkeit

**Stärken:**
- H2 als vollständige Aussagesätze sind gut extrahierbare Passagen.
- Konkrete, überprüfbare Fakten: „3.900 Euro netto", „bei Folgeprojekt vollständig anrechenbar", die vier Architekturwege, die Reifegrade der Helfer.
- Klare Entität: Firmenname, Rechtsform, Adresse, Register, benannte Personen.

**Schwächen:**
- **Keine Frage-Antwort-Strukturen.** AI-Systeme zitieren bevorzugt Passagen, die eine explizite Frage beantworten. Keine einzige Seite hat einen FAQ-Block.
- **Keine definitorischen Passagen.** Es gibt keinen Absatz der Form „Ein Klartag ist …" oder „Prozessautomation bezeichnet …". Genau solche Passagen werden zitiert.
- **Keine Datumsangaben** → kein Aktualitätssignal, und Aktualität ist bei AI-Antworten ein starkes Auswahlkriterium.
- **Minimales Schema** → schwache Entitätsverankerung im Knowledge Graph.
- **Keine externen Erwähnungen.** Brand Mentions außerhalb der eigenen Domain sind der wichtigste GEO-Faktor, und es gibt keine.

### Empfohlene Maßnahmen

1. Je einen FAQ-Block (4–6 Fragen) auf `klartag.html`, `fuer-ihre-it.html` und den drei Zielgruppenseiten, mit `FAQPage`-Schema.
2. Am Anfang jeder Leistungsseite einen definitorischen Absatz in zwei bis drei Sätzen.
3. `dateModified` in einem `WebPage`-Schema pro Seite, sichtbares „Stand: Monat Jahr" im Footer.
4. `llms.txt` mit Firmenprofil, Leistungen, Preisen und Kontakt.
5. Externe Präsenz aufbauen: LinkedIn-Firmenprofil (dann als `sameAs` einbinden), Fachbeiträge, Branchenverzeichnisse Bau/Handwerk.

---

## Anhang: Vollständige Seitenübersicht

| URL | Status | Titel-Länge | Desc-Länge | Canonical | H1 | JSON-LD | Wörter |
|---|---|---|---|---|---|---|---|
| `/` | 200 | 90 ⚠ | 265 ⚠ | ✓ | 1 | Organization | 1.864 |
| `/index.html` | 200 | 90 ⚠ | 265 ⚠ | ✓ → `/` | 1 | Organization | 1.864 |
| `/baugewerbe.html` | 200 | 45 | 193 | ✓ | 1 | — | 335 |
| `/gebaeudetechnik-ausbau.html` | 200 | 57 | 208 | ✓ | 1 | — | 370 |
| `/planungsbueros.html` | 200 | 63 | 159 | ✓ | 1 | — | 319 |
| `/klartag.html` | 200 | 68 | 178 | ✗ | 1 | — | 665 |
| `/firmen-ki.html` | 200 | 56 | 192 | ✓ | 1 | — | 590 |
| `/prozessautomatisierung.html` | 200 | 48 | 157 | ✓ | 1 | — | 375 |
| `/ki-helfer.html` | 200 | 60 | 207 | ✓ | 1 ⚠ 283 Zeichen | — | 470 |
| `/ueber-uns.html` | 200 | 59 | 149 | ✗ | 1 | — | 497 |
| `/fuer-ihre-it.html` | 200 | 60 | 171 | ✗ | 1 | — | 738 |
| `/datenschutz.html` | 200 noindex | 33 | — | ✗ | 1 | — | 1.169 |
| `/impressum.html` | 200 noindex | 21 | — | ✗ | 1 | — | 115 |

**Zusätzlich geprüft (alle noindex, korrekt behandelt):**

| URL | Mechanik | Ziel |
|---|---|---|
| `/ki-klartag.html` | noindex + canonical + meta-refresh | `klartag.html` |
| `/einfuehrungsprojekt.html` | noindex + canonical + meta-refresh | `firmen-ki.html` |
| `/blog/` | noindex + canonical + meta-refresh | `/` |
| `/blog/papierkram-am-chef.html` | noindex + canonical + meta-refresh | `/#arbeitssituationen` |
| `/infotermin.html` | `noindex, follow` | Lead-Formular, kein Canonical |
| `/interessent.html` | `noindex, nofollow` | Lead-Formular, kein Canonical |

**Fehlende Ressourcen:** `/robots.txt` (404), `/sitemap.xml` (404), `/llms.txt` (404), `/favicon.ico` (404).
