# SEO- und GEO-Folgeaudit · manibase.de

**Modus:** 🌐 General (B2B-Dienstleister, DACH, deutschsprachig, Sitz Eibelstadt)
**Datum:** 26. September 2026
**Vorgänger:** Audit vom 17. August 2026, 40,0 / 90 ([GEO-AUDIT-REPORT.md](GEO-AUDIT-REPORT.md), [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md))
**Geprüft:** 10 indexierbare Seiten und 9 noindex-/Stub-Seiten live, robots.txt, sitemap.xml, llms.txt, Header, JSON-LD, Lighthouse 12 (4 Seiten mobil, Startseite Desktop), 12 Such- und Markenanfragen, 3 bekannte und 2 neue Wettbewerber

> **Lesehinweis zur Datenlage.** Search Console und Bing Webmaster Tools existieren erst seit heute, es gibt noch keine Leistungsdaten. Die PageSpeed-Insights-API war erneut kontingentbedingt gesperrt, deshalb stammen alle Core-Web-Vitals-Werte aus einem lokalen Lighthouse-Lauf (simuliertes mobiles 4G, Laborwerte, **keine** Felddaten). Suchpositionen wurden über eine Websuche, Brave und Bing erhoben, nicht über Google DE. Schema-Erkennung im Roh-HTML ist hier verlässlich, weil die Seite kein JavaScript zur Schema-Einspielung nutzt. Alle Punktzahlen sind Schätzungen aus beobachtbaren Signalen.

---

## 0. Umsetzungsstand der Quick Wins (Nachtrag 26.09.2026, abends)

| # | Maßnahme | Stand |
|---|---|---|
| Q1 | LinkedIn-Website auf manibase.de | ✅ **erledigt**, live geprüft: das Unternehmensprofil nennt manibase.de. **Offen:** Tippfehler „Baugewebe" steht noch fünfmal im Info-Text |
| Q2 | manibase.io per 301 umleiten | ⏳ offen, Geschäftsführung (united-domains) |
| Q3 | Matthias-LinkedIn-URL | ✅ **kein Fehler.** Die Geschäftsführung bestätigt `linkedin.com/in/matthias-geisler`. Das ist die Adresse, die in Schema und auf ueber-uns steht; `de.linkedin.com` ist nur die Sprachfassung derselben Seite. Der Befund aus 3.5 ist damit zurückgenommen |
| Q4 | HTTP/2, Cache-Header | 📄 vorbereitet in `docs/deployment/nginx-http2-weiterleitungen.md`, auf dem Server noch nicht ausgeführt |
| Q5 | Title und Description der Startseite | ✅ im PR: 54 und 153 Zeichen, per Test abgesichert |
| Q6 | llms.txt | ✅ im PR, per Test gegen Seiten, Preis und HRB abgesichert |
| Q7 | Stubs als 301 | 📄 vorbereitet, in derselben Server-Anleitung wie Q4 (zusätzlich `charset utf-8`, damit die Umlaute in llms.txt sicher ankommen) |
| Q8 | GSC/BWT: Indexierung beantragen | ⏳ offen, Geschäftsführung |
| Q9 | tel:-Link | ✅ im PR: Footer aller zehn Seiten, Buchungsbereich der Startseite, Impressum; Generator-Vorlage in CLAUDE.md und CI-Test nachgezogen |
| Q10 | Cookiefreie Analytik | ⏳ offen, braucht eine Entscheidung zu Werkzeug und Kosten und einen neuen Absatz in der Datenschutzerklärung |

Beim Lesen der nginx-Konfiguration fiel ein weiterer Punkt auf, der in die Server-Anleitung eingeflossen ist: Das `add_header` in der Asset-Location hebt alle Sicherheits-Header des Server-Blocks auf, CSS, JS und Bilder kommen deshalb ohne `X-Content-Type-Options: nosniff`.

**Punktzahl nach Umsetzung.** Q1 ist live und hebt Entity SEO von 3,5 auf 4,2. Sobald der PR live ist, steigen Technical SEO (Title/Description) auf 9,3 und UX & Conversion (Telefon) auf 6,3. Rechnerisch ergibt das **48,3 / 90**. Die großen Sprünge liegen weiter in M1 bis M3 und in Fremdsignalen, nicht in den Quick Wins.

---

## 1. Executive Summary

**Gesamtnote: 47,0 / 90** (August: 40,0, **+7,0**)
**Platz im Wettbewerbsfeld:** 4. von 6 (Schätzung)
**Dringlichkeit:** MODERAT. Die Technik ist aufgeräumt. Was fehlt, ist Auffindbarkeit: Die Seite erscheint in keiner der zwölf Testsuchen, auch nicht auf den eigenen Markennamen.

### Was sich seit August verbessert hat

Die sieben Sofortmaßnahmen und die Kompression sind live und wirken:

| Maßnahme | August | Heute |
|---|---|---|
| robots.txt | 404 | 200, 17 Bot-Blöcke, alle KI-Crawler erlaubt |
| sitemap.xml | 404 | 200, 10 URLs |
| CSS/JS-Kompression | unkomprimiert, `site.css` 116 KB | gzip auf allen Text-Assets |
| Signet und Favicon | 192 KB pro Seite | 12 KB |
| Canonical | fehlte auf 7 Seiten | auf allen 19 geprüften Seiten |
| Open Graph | nur Startseite | alle Inhaltsseiten |
| Organization-Schema | Grundform | ProfessionalService mit Gründern, HRB, areaServed, sameAs |
| LCP mobil, Startseite | 2,7 s | **2,3 s** |
| Gebäudetechnik-Seite | ≈ 231 Wörter | ≈ 412 Wörter, neu getextet |

### Drei Stärken

1. **Technisch sauber und schnell.** Lighthouse Desktop 100/100/96/100, mobil 97 auf der Startseite, CLS überall 0, Blocking Time 0 ms, TTFB 20 bis 160 ms.
2. **Kein KI-Crawler gesperrt, und das ist jetzt bewusst dokumentiert.** GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended und Applebot sind ausdrücklich erlaubt.
3. **Klarste Positionierung im Feld.** Drei benannte Zielgruppen, ein öffentlicher Festpreis (3.900 €), vier offen gelegte Architekturwege. Kein Wettbewerber legt Architektur und Governance so offen.

### Drei kritische Schwächen

1. **Die Entität zeigt ins Leere.** Das LinkedIn-Unternehmensprofil nennt als Website **manibase.io**, eine geparkte Domain („Domain im Kundenauftrag registriert"). Das einzige externe Profil, auf das das Schema per `sameAs` verweist, verlinkt also nicht zurück. Bei Markensuchen gewinnen Manbase (Sonnenbrillen), manibox UG und Anibase.
2. **Null Fremdsignale.** Keine gefundenen Backlinks, kein Wikidata-Eintrag, keine Presse, keine Verzeichnisse. North Data führt die Firma, aber ohne Website.
3. **Drei von vier Zielgruppen- und Leistungsseiten sind weiter dünn.** Baugewerbe 188, Planungsbüros 170, Prozessautomation 228 Wörter Hauptinhalt. Keine FAQ, keine Frageüberschriften, keine Quellen. Alle drei alten Wettbewerber haben inzwischen JSON-LD nachgerüstet, beide neuen Wettbewerber fahren FAQPage-Schema.

### Potenzial

Ohne Felddaten lässt sich kein Traffic seriös beziffern. Realistisch erreichbar in 3 Monaten: Platz 1 auf alle Markenanfragen („manibase", „manibase KI"), Indexierung aller 10 Seiten in Google und Bing, erste Impressionen auf Longtail-Anfragen der Gebäudetechnik-Seite. Nicht-Marken-Rankings in den Top 10 brauchen die Inhalte und Links aus den Blöcken „Mittelfristig" und „Langfristig".

---

## 2. Score-Dashboard

| Dimension | Aug. | Heute | / max | Stufe |
|---|---|---|---|---|
| Technical SEO | 7,0 | **8,8** | 10 | 🟢 |
| Core Web Vitals | 6,0 | **8,5** | 10 | 🟢 |
| Content & Authority | 5,2 | **5,7** | 20 | 🔴 |
| E-E-A-T | 4,5 | **4,7** | 10 | 🔴 |
| Entity SEO | 2,7 | **3,5** | 10 | 🔴 |
| GEO | 8,8 | **9,6** | 20 | 🔴 |
| UX & Conversion | 5,8 | **6,2** | 10 | 🟡 |
| **Gesamt** | **40,0** | **47,0** | **90** | 🟡 52 % |

Legende: 🔴 unter 50 % · 🟡 50 bis 75 % · 🟢 über 75 %

Der Zuwachs kommt fast vollständig aus Technik und Ladezeit. Die vier Dimensionen, die über Sichtbarkeit entscheiden (Content, E-E-A-T, Entität, GEO), haben sich zusammen nur um 2,3 Punkte bewegt.

---

## 3. Ergebnisse je Dimension

### 3.1 Technical SEO · 8,8 / 10

**On-Page (8 / 10)**

| Kriterium | Befund | Punkte |
|---|---|---|
| Title | Unterseiten 42 bis 65 Zeichen, gut. **Startseite 87 Zeichen**, wird in der SERP abgeschnitten | 1,5 / 2 |
| Meta Description | Unterseiten 148 bis 204. **Startseite 258 Zeichen**, fast doppelt so lang wie angezeigt | 1 / 2 |
| H1 | Überall genau eine. Mehrere ohne Suchbegriff: „Sie kommen von draußen. Dann fängt das Büro an." (Gebäudetechnik), „Ein Tag, bevor Sie investieren." (Klartag) | 0,5 / 1 |
| H2/H3 | logische Hierarchie | 1 / 1 |
| URLs | kurz, sprechend | 1 / 1 |
| ALT-Texte | vollständig und beschreibend | 1 / 1 |
| Interne Verlinkung | jede Seite in 1 bis 2 Klicks erreichbar | 2 / 2 |

**Technik und Crawlbarkeit (9,5 / 10)**

| Kriterium | Befund | Punkte |
|---|---|---|
| HTTPS, HSTS preload | ✓ | 1 |
| Mobil | kein Überlauf, Lighthouse-SEO 100 | 1 |
| Sitemap | ✓, in GSC eingereicht (Status am Einreichungstag „Konnte nicht abgerufen werden", Server liefert 200 und gültiges XML) | 1 |
| robots.txt | ✓ | 1 |
| 404 | echter 404-Status, aber ungestaltete nginx-Seite | 1 |
| Weiterleitungen | **ki-klartag.html, einfuehrungsprojekt.html und blog/papierkram-am-chef.html liefern 200 mit `meta refresh`**, keine 301. noindex verhindert Schaden, vererbt aber auch keine Signale | 0,5 |
| Canonical | alle Seiten, `/index.html` zeigt korrekt auf `/` | 1 |
| Duplikate | keine | 1 |
| Paginierung, hreflang | nicht zutreffend | 2 |

**Nebenbefund Server:** nginx spricht nur **HTTP/1.1** (ALPN verhandelt kein h2). Lighthouse beziffert das mit bis zu 810 ms Einsparung auf Mobil. Außerdem sendet nginx **zwei `Cache-Control`-Header** pro Asset (`max-age=604800` aus `expires` und `public, max-age=604800, immutable` aus `add_header`). Nicht gehashte Bilder mit `immutable` zu markieren ist riskant: tauscht man ein Bild unter gleichem Namen aus, sehen Wiederkehrer sieben Tage lang das alte.

### 3.2 Core Web Vitals · 8,5 / 10

Lighthouse 12, lokal, mobil mit simulierter Drosselung. **Laborwerte**, Felddaten (CrUX) existieren für die Domain noch nicht.

| Seite | Perf. | LCP | FCP | CLS | TBT | LCP-Element |
|---|---|---|---|---|---|---|
| Startseite (Desktop) | 100 | 0,5 s | 0,4 s | 0 | 0 ms | H1 |
| Startseite | 97 | **2,3 s** | 2,0 s | 0 | 0 ms | H1 |
| gebaeudetechnik-ausbau | 99 | 2,1 s | 1,5 s | 0 | 0 ms | H1 |
| klartag | 89 | **3,5 s** | 2,1 s | 0 | 0 ms | Lead-Absatz |
| ki-helfer | 87 | **3,8 s** | 2,0 s | 0 | 0 ms | Hero-Hintergrund |

| Metrik | Bewertung | Punkte |
|---|---|---|
| LCP | 2 von 4 Seiten gut, 2 verbesserungswürdig | 1,5 / 2 |
| CLS | überall 0 | 2 / 2 |
| INP | keine Felddaten; TBT 0 ms auf allen Seiten spricht für gute Werte (Schätzung) | 2 / 2 |
| FCP | 1,5 bis 2,1 s, knapp über 1,8 s | 0,5 / 1 |
| TTFB | 20 bis 160 ms | 1 / 1 |
| Mobil vs. Desktop | 100 zu 87–99 | 1,5 / 2 |

**Die zwei langsamen Seiten haben je eine eindeutige Ursache:**

- **klartag.html:** `klartag-workshop-unsplash.jpg` wird als JPG in voller Größe geladen. Lighthouse: 200 KB zu groß für den Viewport, 118 KB durch WebP einsparbar.
- **ki-helfer.html:** `hero-hands.jpg` liegt als CSS-Hintergrund, der Browser entdeckt es erst nach dem Stylesheet. 131 KB durch WebP einsparbar, dazu `preload` fehlt.

Auf allen Seiten gilt: render-blockierendes CSS (drei Dateien: tokens, site, home) kostet 0,7 bis 1,2 s auf Mobil. HTTP/2 würde die drei Anfragen parallelisieren.

### 3.3 Content & Authority · 5,7 / 20 (17 / 60)

**Content-Strategie (10 / 20)**

Hauptinhalt je Seite, ohne Navigation und Footer:

| Seite | Wörter | Frage-H2 | FAQ | Quellen | Änderung seit Aug. |
|---|---|---|---|---|---|
| Startseite | 1.453 | 1 | – | – | – |
| fuer-ihre-it | 598 | 0 | – | – | – |
| klartag | 519 | 0 | – | – | – |
| firmen-ki | 442 | 0 | – | – | – |
| gebaeudetechnik-ausbau | 412 | 0 | – | – | **neu getextet** |
| ueber-uns | 362 | 0 | – | – | – |
| ki-helfer | 325 | 1 | – | – | – |
| prozessautomatisierung | **228** | 1 | – | – | – |
| baugewerbe | **188** | 0 | – | – | – |
| planungsbueros | **170** | 0 | – | – | – |

Topical Authority 1/3, Pillar-Seiten 0,5/2, Longtail 0/2, Frische 0,5/2, Kannibalisierung 2/2, Lesbarkeit 2/2, Semantik 1,5/2, Medien 1,5/2, Thin Content 1/3.

Der Blog ist leer und steht auf noindex („Fachinhalte werden neu aufgebaut"). Damit gibt es keine einzige Seite, die eine Informationsfrage beantwortet.

**Autorität und Links (3 / 20):** Keine verweisenden Domains gefunden (Websuche und Brave, ohne Backlink-Index, also nicht beweisbar null). Kein Wikidata, keine Presse. Ausgehende Links nur auf LinkedIn und Unsplash, keine auf Fachquellen.

**Rankings (4 / 20):** manibase.de erscheint in keiner Testsuche, siehe 3.6.

### 3.4 E-E-A-T · 4,7 / 10 (14 / 30)

| Stärken | Lücken |
|---|---|
| Gründerseite mit echten Fotos, Biografien, LinkedIn-Links | keine Fallbeispiele, Referenzen oder Bewertungen (bewusst, solange nichts freigegeben ist) |
| TÜV-SÜD-Qualifikation „AI Strategy & Application Expert" für beide Gründer | keine Fachquellen, keine Studien, keine Zahlen mit Beleg |
| Impressum mit HRB, Datenschutz, vollständige Anschrift | LinkedIn-Unternehmensseite: 3 Follower, Website-Feld falsch, Tippfehler „Baugewebe" im Info-Text |
| Reifegrad-Ampel der KI-Helfer ist ehrlich und selten | Firma 2026 gegründet, keine sichtbare Historie |

Die neue Gebäudetechnik-Seite mit Beweis- und Einwandblock ist der richtige Weg. Bewertet als +0,2.

### 3.5 Entity SEO · 3,5 / 10

| Kriterium | Befund | Punkte |
|---|---|---|
| Knowledge Panel | keins | 0 / 4 |
| Wikidata | kein Eintrag | 0 / 3 |
| Wikipedia | nein | 0 / 3 |
| Google Maps | Profil eingereicht, Verifizierung läuft | 0,5 / 2 |
| Name konsistent | „manibase UG" (Website), „Manibase UG" (Handelsregister, North Data, GBP). Groß- und Kleinschreibung genügt Google zur Zuordnung | 2 / 3 |
| Organization + sameAs | vorhanden, aber nur ein Profil (LinkedIn) | 2 / 3 |
| Profile konsistent | **LinkedIn-Website = manibase.io (geparkt)** | 0,5 / 2 |
| Ortsanker | überall Würzburger Str. 1, Eibelstadt | 2 / 2 |

**Nachtrag: kein Fehler, siehe Abschnitt 0.** Ursprünglicher Wortlaut: *Zu prüfen (Befund nicht abschließend verifizierbar):* Schema und Über-uns-Seite verlinken Matthias Geisler als `linkedin.com/in/matthias-geisler/`. In Brave und in der Websuche erscheint sein Profil mit Bezug zu manibase unter **`linkedin.com/in/matthias-geisler-238591182`**. Bei einem häufigen Namen gehört die kurze Adresse womöglich jemand anderem. Dann zeigt `Person.sameAs` auf eine fremde Person. LinkedIn ließ sich ohne Anmeldung nicht auflösen.

### 3.6 GEO · 9,6 / 20 (48 / 100)

| Block | Punkte | Kern |
|---|---|---|
| 5.1 Bot-Zugriff | 10 / 10 | alle KI-Crawler ausdrücklich erlaubt |
| 5.2 Die 9 GEO-Methoden | 12 / 20 | Ton, Fachsprache, Flüssigkeit und kein Keyword-Stuffing voll; **Quellen 0/3, Statistiken 0/3, Expertenzitate 0/2** |
| 5.3 Struktur für LLMs | 10 / 20 | kurze Absätze und Listen gut; keine FAQ, 3 Frageüberschriften auf 10 Seiten, kein öffentliches PDF, kein sichtbares Stand-Datum |
| 5.4 Strukturierte Daten | 7,5 / 20 | ProfessionalService und OG gut; **kein FAQPage, kein Service/Offer für den Klartag, kein BreadcrumbList, kein dateModified, Schema nur auf der Startseite** |
| 5.5 Plattformen | 3 / 10 | siehe unten |
| 5.6 Sichtbarkeitstest | 5,5 / 20 | nirgends zitiert; die 5 Punkte kommen allein aus „kein Bot gesperrt" |

**Plattformen:**

| Plattform | Befund |
|---|---|
| Google AI Overview | Laut GSC sind Startseite, klartag, baugewerbe und firmen-ki indexiert. Kein Knowledge Graph, kein E-E-A-T-Fremdsignal. ❌ |
| ChatGPT (Bing-Index) | Bing `site:manibase.de` lieferte keine verifizierbare manibase-URL. Seit heute über BWT eingereicht. 🟡 |
| Perplexity | Bot erlaubt, aber keine FAQ und kein PDF. ❌ |
| Claude (Brave-Index) | **Brave `site:manibase.de`: 0 Treffer.** ❌ |
| Copilot | wie ChatGPT; LinkedIn-Signal zeigt auf manibase.io. ❌ |

**Sichtbarkeitstest, 26.09.2026:**

| Anfrage | manibase.de | Es ranken |
|---|---|---|
| manibase | ✗ | Manbase (Sonnenbrillen), Wikipedia, Anibase, Matthias Geislers LinkedIn |
| manibase KI | ✗ | Matthias Geislers LinkedIn |
| manibase UG | ✗ | **manibox UG** (Verwechslung) |
| manibase Eibelstadt | ✗ | Wikipedia Eibelstadt, Landkreis |
| KI Einführung Bauunternehmen | ✗ | baybauakad.de, akademie-ki.com, iuk.fraunhofer.de |
| KI für Bauunternehmen Beratung | ✗ | ki-bau-handwerk.de, ventum-consulting.com, bau-master.com |
| KI Handwerk SHK einführen | ✗ | hero-software.de, zvshk.de, handwerksblatt.de |
| KI für Planungsbüros | ✗ | architekturblatt.de, competitionline.com |
| KI Beratung Würzburg | ✗ | wbstraining.de, fiw.thws.de, uni-wuerzburg.de |
| KI Klartag | ✗ | **Bo'az Klartag** (Mathematiker) |
| eigene Firmen-KI statt ChatGPT | ✗ | marktundmittelstand.de, it-p.de |
| Microsoft 365 Copilot oder eigene KI | ✗ | microsoft.com, buero-kaizen.de |

„Klartag" ist als Suchbegriff durch eine Person belegt. Der Produktname funktioniert auf der Seite, als Suchanker taugt nur „KI-Klartag".

`llms.txt` fehlt weiterhin (404). derprozessmeister.de, kaj-bau-digital.de und ki-bau-handwerk.de haben eine. Keine große Antwortmaschine hat bestätigt, dass sie die Datei auswertet; sie kostet aber eine Stunde.

### 3.7 UX & Conversion · 6,2 / 10 (18,5 / 30)

| Block | Punkte | Kern |
|---|---|---|
| UX | 10 / 10 | 5 Menüpunkte, CTA über dem Falz, Lighthouse-Barrierefreiheit 100 auf allen Seiten |
| Vertrauen und Conversion | 6,5 / 10 | ein CTA überall; **keine Telefonnummer als `tel:`-Link auf der Startseite** (Quick Win aus August offen); keine Testimonials |
| Analytik | 2 / 10 | **kein Messwerkzeug**. Der Trichter der Qualifizierungsmaske ist unsichtbar. Die 2 Punkte gibt es, weil ohne Tracking kein Einwilligungsbanner nötig ist |

---

## 4. Wettbewerbsanalyse

| Kriterium | **manibase** | derprozessmeister | kaj-bau-digital *(neu)* | ki-bau-handwerk *(neu)* | innovation-ausbau | kozoa |
|---|---|---|---|---|---|---|
| **Gesamt (Schätzung) / 90** | **47** | ≈ 62 | ≈ 50 | ≈ 48 | ≈ 45 | ≈ 42 |
| Aug. 2026 | 40 | ≈ 58 | – | – | ≈ 45 | ≈ 38 |
| JSON-LD | Org/ProfService | ProfService, Rating, Person | **FAQPage, Service, Offer**, Person | **FAQPage**, ProfService | WebPage, Breadcrumb | ProfService, Person |
| FAQ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| llms.txt | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Preis öffentlich | **3.900 €** | ab 2.500 € + Rechner | BAFA-gefördert, 700 € Eigenanteil | – | – | – |
| Belege/Fälle | ✗ | ✓ Zahlen, 20 Bewertungen | – | – | Partner genannt | ✗ |
| Wörter Startseite | ≈ 1.450 | ≈ 7.300 | ≈ 1.830 | ≈ 950 | ≈ 710 | ≈ 310 |
| Indexierte Seiten | 10 | 757 in Sitemap | Blog | Branchenseiten, Glossar | – | 13 |
| TTFB | 0,02–0,16 s | 0,10 s | 0,13 s | 0,22 s | 0,8 s | 0,12 s |
| Kompression | gzip | br | – | – | br | br |
| Erscheint in Testsuchen | ✗ | ✓ | – | ✓ (Bau, SHK) | – | ✓ |

Die beiden neuen Anbieter wurden nur oberflächlich gemessen, ihre Werte sind grober als die der übrigen.

**Was sich im Feld geändert hat:** Alle drei bekannten Wettbewerber haben seit August JSON-LD nachgerüstet. Beide Neuen fahren FAQPage-Schema und llms.txt. Der Schema-Vorsprung, den manibase im August mit dem Organization-Block aufgebaut hat, ist weg.

**derprozessmeister.de:** besser bei Masse (757 URLs, Branchenseiten je Gewerk), Belegen und Preisrechner. Schwach bei Fokus (Generalist über 56+ Branchen), Rating-Markup (21 im Schema, 20 auf der Seite) und 900 KB HTML.

**kaj-bau-digital.de:** gleiche Zielgruppen Bau und Planung, stärkstes Schema-Set im Feld, BAFA-Förderung als Preisargument. Schwach: Ein-Personen-Betrieb, kein Architektur- oder Governance-Angebot.

**ki-bau-handwerk.de:** trifft genau die neue Zielgruppe Gebäudetechnik (Seiten für Elektriker, SHK, Dach) und rankt dafür. Schwach: Seminar- und Workshop-Modell, sitemap.xml fehlt.

**kozoa.de:** Nachgebessert (Schema, OG, sechs Leistungsseiten mit Bau-Anwendungsfällen wie LV-Auswertung und Bautagebuch). Schwach: sehr dünn, kein Canonical, Apex/www-Widerspruch.

**Unterscheidungsmerkmale, die manibase ausspielen kann:** öffentlicher Festpreis mit Anrechnung, vier offengelegte Architekturwege mit privater Cloud, Reifegrad-Ampel der KI-Helfer, Governance als Teil der Einführung, Softwareentwicklung im eigenen Haus. Keines davon ist heute als Suchanker ausgearbeitet.

### Keyword-Lücke: 10 Prioritäten

| # | Suchbegriff | Absicht | Zielseite | Wer rankt heute |
|---|---|---|---|---|
| 1 | manibase, manibase KI | Marke | Startseite | Manbase, LinkedIn |
| 2 | KI für Bauunternehmen einführen | kommerziell | baugewerbe.html | ki-bau-handwerk, bau-master |
| 3 | KI im Handwerk SHK / Elektro | kommerziell | gebaeudetechnik-ausbau.html | ki-bau-handwerk, hero-software |
| 4 | KI für Architekturbüros / Planungsbüros | kommerziell | planungsbueros.html | architekturblatt, competitionline |
| 5 | Microsoft 365 Copilot oder eigene KI | Vergleich | **neu** | microsoft.com |
| 6 | Was kostet eine KI-Einführung | informativ | **neu** | derprozessmeister |
| 7 | KI-Richtlinie Unternehmen Vorlage (PDF) | informativ | **neu** | – |
| 8 | KI-Kompetenzpflicht AI Act Art. 4 Handwerk | informativ | **neu** | Kammern, Verbände |
| 9 | Bautagebuch mit KI / Regiebericht diktieren | informativ | **neu**, Bernd-Seite | kozoa |
| 10 | KI-Beratung Würzburg | lokal | GBP + Startseite | wbstraining, THWS |

---

## 5. Aktionsplan

### 🟢 Quick Wins (unter einer Woche)

| # | Maßnahme | Aufwand | Wer | Wirkung |
|---|---|---|---|---|
| Q1 | **LinkedIn-Unternehmensseite: Website von manibase.io auf `https://manibase.de` ändern**, Tippfehler „Baugewebe" korrigieren | 15 Min | Geschäftsführung | stellt die einzige `sameAs`-Verbindung beidseitig her; wichtigster Einzelhebel gegen die Manbase-Verwechslung |
| Q2 | **manibase.io per 301 auf manibase.de umleiten** (united-domains, Weiterleitung) | 15 Min | Geschäftsführung | falls Q1 irgendwo nicht greift, landet niemand mehr auf einer Parkseite |
| Q3 | **Matthias-LinkedIn-URL prüfen** und in `index.html` (Schema) und `ueber-uns.html` korrigieren, falls `/in/matthias-geisler-238591182` die richtige ist | 15 Min | Repo | verhindert, dass `Person.sameAs` auf eine fremde Person zeigt |
| Q4 | **HTTP/2 in nginx einschalten** (`http2 on;` im 443-Block), doppelten `Cache-Control` bereinigen, `immutable` nur auf `?v=`-Assets | 30 Min | Server | bis 0,8 s weniger auf Mobil laut Lighthouse |
| Q5 | Startseite: Title auf **„KI-Einführung für Bau, Handwerk und Planung · manibase"** (54 Z.), Description auf **„Bauunternehmen, ausführende Gewerke und Planungsbüros führen mit manibase KI kontrolliert ein. Einstieg: der Klartag für 3.900 € netto, voll anrechenbar."** (153 Z.) | 20 Min | Repo | vollständige Anzeige in der SERP, Suchbegriff vorn |
| Q6 | `llms.txt` mit Kurzprofil, Leistungen, Preis, Zielgruppen und Links auf die 10 Seiten | 1 Std | Repo | billig, drei Wettbewerber haben sie |
| Q7 | Die drei Weiterleitungs-Stubs als echte **301 in nginx** statt `meta refresh` | 30 Min | Server | alte Links vererben Signale |
| Q8 | GSC: Sitemap-Status prüfen und ggf. neu einreichen, alle 10 URLs zur Indexierung beantragen; in BWT IndexNow aktivieren | 30 Min | Geschäftsführung | Indexierung in Tagen statt Wochen |
| Q9 | Telefon als `tel:`-Link in Kontaktbereich und Footer (Generator-Vorlage und `test-frontend.mjs` mitziehen, siehe CLAUDE.md) | 1 Std | Repo | direkter Kanal für mobile Erstkontakte |
| Q10 | Cookiefreie Analytik (Plausible EU oder Matomo ohne Cookies), Ereignis je Maskenschritt | 2 Std | Repo + Datenschutz | erstmals Trichterdaten, keine Einwilligung nötig |

### 🟡 Mittelfristig (1 bis 3 Monate)

| # | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| M1 | **FAQ mit FAQPage-Schema** auf klartag, firmen-ki, baugewerbe, gebaeudetechnik-ausbau, planungsbueros, fuer-ihre-it; 5 bis 7 echte Fragen aus Erstgesprächen | 12 Std | holt den Schema-Rückstand auf; FAQ-Passagen sind das, was Antwortmaschinen zitieren |
| M2 | **baugewerbe, planungsbueros, prozessautomatisierung auf 800 bis 1.100 Wörter** ausbauen, nach dem Muster der neuen Gebäudetechnik-Seite (Gewerke-Vokabular, Beweis- und Einwandblock, Frageüberschriften) | 15 Std | macht die drei Zielseiten erst rankingfähig |
| M3 | Schema: `Service` + `Offer` (3.900 €, EUR, netto) für den Klartag, `BreadcrumbList` auf Unterseiten, `Person` auf ueber-uns, `dateModified` überall | 4 Std | Preis und Personen werden maschinenlesbar |
| M4 | Bilder: Klartag-Foto als WebP mit `srcset` (−200 KB), ki-helfer-Hero als `<img fetchpriority="high">` in WebP | 2 Std | LCP beider Seiten unter 2,5 s |
| M5 | Fremdbelege: EU AI Act (Art. 4 Kompetenzpflicht seit Feb. 2025), Bayerische Ingenieurekammer-Leitfaden KI in der Planung (Sept. 2026), Fraunhofer, ZDB/ZVSHK-Erhebungen, verlinkt und datiert | 6 Std | Quellen +40 %, Statistiken +37 % laut Princeton-GEO-Studie |
| M6 | Vergleichsseite **„Microsoft 365 Copilot oder eigene Firmen-KI"** aus Blatt 04 | 8 Std | hohe Kaufnähe, niemand im Feld bedient das |
| M7 | Seite **„Was kostet eine KI-Einführung"** mit dem echten Preis und Anrechnungslogik | 5 Std | einer von zwei Anbietern mit öffentlichem Preis |
| M8 | **Wikidata-Eintrag** (Instanz: Unternehmen, HRB 18632, Sitz, Gründer, offizielle Website), danach in `sameAs` | 3 Std | Grundstein für ein Knowledge Panel |
| M9 | GBP nach Freigabe: Maps-URL in `sameAs`, Leistungen eintragen, erste Bewertungen aus Klartag-Kunden erbitten | 2 Std + laufend | lokale Suche „KI-Beratung Würzburg" |
| M10 | Einträge mit identischem NAP: IHK-Firmenverzeichnis Würzburg-Schweinfurt, Das Örtliche, Gelbe Seiten, 11880, Cylex | 3 Std | erste konsistente Fremdzitate der Entität |

### 🔴 Langfristig (3 bis 6 Monate)

| # | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| L1 | Blog als **Ratgeber** neu starten: 8 bis 12 Artikel zu den Keyword-Lücken 6 bis 9, einer davon mit **KI-Richtlinie als öffentliches PDF** | 40 Std | erste Informationsseiten, Grundlage für Zitate in Perplexity und AI Overviews |
| L2 | **Links und Erwähnungen:** Handwerkskammer für Unterfranken, IHK Würzburg-Schweinfurt, KI-Regionalzentrum der THWS, Bayerische Ingenieurekammer-Bau, Gastbeiträge in DHZ oder handwerksblatt, Vorträge bei Innungen | laufend | ohne Fremdsignale bleibt jeder Inhalt unsichtbar |
| L3 | Erste **freigegebene Referenz** (auch anonymisiert mit Gewerk und Größe) mit echter Kennzahl | nach Freigabe | schließt die größte E-E-A-T-Lücke |
| L4 | Prüfen, ob der Klartag BAFA-förderfähig gemacht werden kann (Beraterregistrierung) | 4 Std Prüfung | kontert das Preisargument von kaj-bau-digital |

---

## 6. Kennzahlen und Überwachung

**Wöchentlich (GSC, ab Oktober mit Daten):** Impressionen und Klicks, indexierte Seiten, Markenanfragen „manibase*".
**Monatlich:**
- Positionen der 10 Suchbegriffe aus der Keyword-Lücke
- verweisende Domains (GSC → Links)
- Trichter der Qualifizierungsmaske (nach Q10)
- KI-Zitat-Test: dieselben 12 Anfragen in ChatGPT, Perplexity, Google AI Overview und Brave
- GBP: Aufrufe, Anrufe, Bewertungen

**Alarme:** Google Alerts auf „manibase" und auf „kozoa", „kaj-bau-digital", „ki-bau-handwerk"; GSC-Benachrichtigungen für Abdeckung und manuelle Maßnahmen.

---

## 7. Glossar

| Begriff | Bedeutung |
|---|---|
| **Canonical** | Hinweis im Seitenkopf, welche Adresse die maßgebliche Fassung einer Seite ist |
| **Core Web Vitals** | Googles Ladezeit-Kennzahlen: LCP (größtes Element sichtbar), CLS (Springen des Layouts), INP (Reaktion auf Eingaben) |
| **Entität** | eine eindeutig identifizierte Sache (Firma, Person), die Suchmaschinen und KI-Systeme über Quellen hinweg zuordnen |
| **FAQPage-Schema** | maschinenlesbare Auszeichnung von Frage-Antwort-Paaren |
| **GEO** | Generative Engine Optimization, Optimierung dafür, in KI-Antworten zitiert zu werden |
| **HTTP/2** | neueres Übertragungsprotokoll, lädt mehrere Dateien gleichzeitig über eine Verbindung |
| **JSON-LD** | Format für strukturierte Daten im Seitenquelltext |
| **Knowledge Panel** | Infokasten neben den Google-Ergebnissen, gespeist aus dem Knowledge Graph |
| **llms.txt** | Textdatei im Stammverzeichnis, die Sprachmodellen eine Kurzfassung der Website anbietet |
| **sameAs** | Schema-Eigenschaft, die offizielle Profile derselben Entität verknüpft |
| **TTFB** | Zeit bis zum ersten Byte der Serverantwort |

---

## 8. Fazit

Die technische Grundlage ist jetzt auf Augenhöhe mit dem Feld (nur HTTP/2 und Brotli fehlen noch), und die Seite lädt schnell. Sichtbar ist sie trotzdem nicht, weil das einzige externe Profil auf eine geparkte Domain zeigt, keine fremde Quelle die Firma erwähnt und die Zielseiten zu dünn sind, um Fragen zu beantworten. Die ersten drei Quick Wins kosten zusammen 45 Minuten und sollten vor allem anderen passieren; danach entscheidet der Block M1 bis M3, ob die Seite im Herbst aus dem Schema-Rückstand kommt.

**Nächstes Folgeaudit:** 26. Dezember 2026, dann erstmals mit drei Monaten Search-Console-Daten.

---

### Quellen und Methode

- Live-Abruf aller Seiten mit Googlebot-User-Agent, 26.09.2026, 17 bis 18 Uhr
- Lighthouse 12.x lokal (Chrome headless), Rohdaten im Sitzungs-Scratchpad
- PageSpeed Insights API: `Quota exceeded`, nicht verfügbar
- Suchanfragen: Websuche mit deutschen Suchbegriffen, `search.brave.com`, `bing.com` (Bing lieferte Bot-Antworten, nicht belastbar), DuckDuckGo (Captcha, nicht verfügbar)
- Entität: `wikidata.org` (kein Treffer), `northdata.de` (Manibase UG, HRB 18632, ohne Website), LinkedIn-Gastansicht
- Wettbewerber: `curl` mit Browser-User-Agent und `Accept-Encoding: br, gzip`, Wortzahlen geschätzt inklusive Navigation
