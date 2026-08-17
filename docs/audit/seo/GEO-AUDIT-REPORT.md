# SEO- und GEO-Expertenaudit · manibase.de

**Modus:** Allgemein 🌐 (B2B-Dienstleister, DACH, deutschsprachig einsprachig)
**Datum:** 17. August 2026
**Geprüfte Domain:** https://manibase.de/
**Umfang:** 15 Live-Seiten, robots.txt, Header, Schema, KI-Bot-Zugriff, 4 Marken- und Longtail-Suchen, 3 Wettbewerber

> **Umsetzungsstand, nachgetragen am 17.08.2026.** Die Sofortmaßnahmen **S1 bis S7 sind umgesetzt** (S3 dokumentiert, Serverarbeit steht aus). Die Scores in diesem Bericht beschreiben den **Zustand vor der Umsetzung**; sie werden bewusst nicht überschrieben, damit der Nachaudit-Vergleich eine Basislinie hat. Details am Ende in Abschnitt 10.
>
> **Verhältnis zum bestehenden Audit.** `FULL-AUDIT-REPORT.md` vom selben Tag deckt Technik, On-Page, Content und Core Web Vitals ab. Dieses Audit übernimmt dessen Messwerte, wo sie heute noch gelten (nachgeprüft: CSS weiterhin unkomprimiert, `signet.png` weiterhin 132 KB), und ergänzt die vier Dimensionen, die dort nicht vorkommen: **E-E-A-T, Entity SEO, GEO (Sichtbarkeit in KI-Systemen) und Wettbewerbsvergleich**. Die Gesamtnote nach diesem Raster ist strenger, weil Autorität und Entität mitgewogen werden.

---

## 1. Executive Summary

### Gesamtnote: **40 / 90** (44 %)

**Platzierung im Wettbewerb: 3. von 4.** Hinter derprozessmeister.de und innovation-ausbau.de, etwa gleichauf mit kozoa.de.

**Dringlichkeit: HOCH.** Nicht wegen technischer Fehler, sondern weil die Seite drei Tage nach dem Relaunch für Suchmaschinen praktisch nicht existiert und dieser Zustand ohne Gegenmaßnahmen bleibt.

### Der eine Satz

Die Seite ist handwerklich sauber gebaut und sprachlich deutlich besser als der gesamte Wettbewerb, aber sie ist **auffindbar wie ein Prospekt in einer verschlossenen Schublade**: keine robots.txt, keine Sitemap, keine eingehenden Links, keine Entität in den Wissensgraphen, kein einziger Fund in vier Testsuchen, nicht einmal auf den eigenen Markennamen.

### Drei Stärken

1. **Sprachqualität ist der größte ungehobene Aktivposten.** Nach dem Princeton-GEO-Raster (KDD 2024) erreicht der Text volle Punktzahl in *authoritative tone*, *accessible content*, *technical terminology* und *fluency*, plus volle Punktzahl für die Abwesenheit von Keyword-Stuffing. Genau diese Kombination aus Flüssigkeit und Fachbegriffen wird von generativen Systemen bevorzugt zitiert. Der Rohstoff ist da, es fehlt die Verpackung.
2. **Kein einziger KI-Crawler ist blockiert.** GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Bingbot, Googlebot und Google-Extended erhalten alle HTTP 200. Viele Wettbewerber sperren hier aus Reflex. Das ist ein Startvorteil.
3. **CLS ist auf allen Seiten exakt 0,000, TTFB unter 150 ms, Desktop-LCP unter 600 ms.** Sicherheits-Header vollständig, HSTS mit preload, saubere 301-Weiterleitungen. Die Grundlage trägt.

### Drei kritische Schwächen

1. **Die Entität „manibase" existiert außerhalb der eigenen Domain nicht.** Die Suche nach `"manibase"` liefert genau einen relevanten Treffer, und das ist Matthias Geislers LinkedIn-Profil, nicht die Website. Der Rest der Ergebnisseite gehört fremden Marken („Manbase" Herrenausstatter Australien, „MANBASE" Südafrika, „Minibase"). Der Markenname kollidiert mit etablierten Namen, und es gibt kein einziges Signal, das dagegenhält: kein `sameAs` im Schema, kein Wikidata-Eintrag, kein LinkedIn-Unternehmensprofil, keine Verlinkung der Gründerprofile von `ueber-uns.html` (dort stehen **null** externe Links).
2. **Strukturierte Daten sind faktisch nicht vorhanden.** Ein einziger `Organization`-Block auf der Startseite, ohne `sameAs`, ohne `founder`, ohne `foundingDate`, ohne `areaServed`, ohne Registerkennung. 14 von 15 Seiten haben gar kein JSON-LD. Kein `FAQPage` (der stärkste Einzelhebel für KI-Zitate), kein `Offer` für den Klartag mit seinem öffentlichen Festpreis von 3.900 Euro netto, kein `ProfessionalService`, kein `BreadcrumbList`, kein `Person` für die beiden Gründer. **Wichtig:** Die Seite ist statisch und injiziert kein Schema per JavaScript, die Erkennung im HTML ist hier also verlässlich und nicht der übliche Fehlalarm.
3. **Null Messbarkeit.** Kein GA4, kein Matomo, kein Plausible, kein Tag Manager, kein dataLayer. Der einzige Treffer auf „consent" ist eine Checkbox im Formular. Die fünfstufige Qualifizierungsmaske ist der wichtigste Konversionspfad der Seite, und niemand kann sagen, in welchem Schritt die Leute aussteigen.

### Verkehrspotenzial

Der Ausgangswert liegt bei näherungsweise null organischen Besuchern. Bei Umsetzung der Sofortmaßnahmen plus der mittelfristigen Inhaltsarbeit ist im DACH-Raum für dieses Segment eine Größenordnung von **150 bis 400 organischen Sitzungen pro Monat nach sechs bis neun Monaten** plausibel. Das klingt wenig und ist es auch, aber bei einem Angebot mit 3.900 Euro Einstiegspreis genügt ein Abschluss je Quartal, damit sich der Aufwand trägt. Die Zahl ist eine Schätzung ohne Search-Console-Daten und entsprechend unsicher.

---

## 2. Score-Dashboard

| Dimension | Score | max | Niveau |
|---|---:|---:|:--:|
| Technical SEO | 7,0 | 10 | 🟡 |
| Core Web Vitals | 6,0 | 10 | 🟡 |
| Content & Authority | 5,2 | 20 | 🔴 |
| E-E-A-T | 4,5 | 10 | 🔴 |
| Entity SEO | 2,7 | 10 | 🔴 |
| GEO (KI-Sichtbarkeit) | 8,8 | 20 | 🟡 |
| UX & Conversion | 5,8 | 10 | 🟡 |
| **GESAMT** | **40,0** | **90** | **🔴 44 %** |

Legende: 🔴 unter 50 % · 🟡 50 bis 75 % · 🟢 über 75 %

Das Muster ist eindeutig: **alles, was auf der eigenen Domain passiert, ist mittelmäßig bis gut. Alles, was außerhalb der Domain passiert, ist bei null.**

---

## 3. Ergebnisse im Detail

### 3.1 Technical SEO · 7,0 / 10

**On-Page 7,25/10 · Technik 7,25/10**

| Prüfpunkt | Befund |
|---|---|
| HTTPS, HSTS preload, Security-Header | ✓ vollständig, inkl. CSP mit Zeeg-Freigabe |
| `http` → `https`, `www` → Apex | ✓ je 301, keine Ketten |
| `lang="de"`, Viewport | ✓ auf allen 15 Seiten |
| Alt-Texte | ✓ **kein einziges Bild ohne `alt`** |
| Interne Verlinkung | ✓ jede Inhaltsseite von 9 Seiten erreichbar, Tiefe 1 |
| Kannibalisierung | ✓ keine, die Seiten trennen sauber |
| **robots.txt** | ✗ **404** |
| **sitemap.xml** | ✗ **404** |
| **Canonical** | ✗ fehlt auf 7 von 15 Seiten |
| **Open Graph** | ✗ nur die Startseite hat welche (9 Tags), 14 Seiten haben null |
| 404-Seite | ✗ nginx-Standardseite, ohne Navigation und ohne Marke |

**Canonical fehlt auf:** `klartag.html`, `ueber-uns.html`, `fuer-ihre-it.html`, `datenschutz.html`, `impressum.html`, `infotermin.html`, `interessent.html`.

**Titel und Beschreibungen.** Alle eindeutig und keywordtragend, aber die Längen laufen aus dem Ruder. Der Startseitentitel hat 87 Zeichen und wird in der Ergebnisliste hinter „Automatisierungen und Helfer für Bau, Hand…" abgeschnitten, die Startseiten-Description hat 258 Zeichen und verliert die letzten beiden Sätze. Fünf weitere Descriptions liegen zwischen 170 und 204 Zeichen.

**Überschriftenstruktur.** Ein H1 je Seite, korrekt. Aber die Footer-Spaltenköpfe „Zielgruppen", „KI-Einführung", „Unternehmen" sind als `h2` ausgezeichnet und hängen damit auf jeder Seite im Gliederungsbaum. Auf `baugewerbe.html` sind das 3 von 6 H2, also die Hälfte der Gliederung ist Footer.

**URL-Struktur.** Kurz und lesbar, aber mit `.html`-Endung: `/klartag` liefert 404, nur `/klartag.html` funktioniert. Kein Rankingfehler, aber die URL ist nicht diktierfähig und wirkt technisch veraltet. Umstellung lohnt nur, wenn ohnehin am nginx-Vhost gearbeitet wird.

**Impressum und Datenschutz stehen auf `noindex`.** In Deutschland verbreitet, hier trotzdem ein Nachteil: Google zieht genau diese Seiten für die Verifikation der Unternehmensentität heran (Adresse, Registernummer, Geschäftsführung). Bei einer Marke ohne jede externe Erwähnung verschenkt man damit das einzige belastbare Identitätssignal, das man besitzt.

---

### 3.2 Core Web Vitals · 6,0 / 10

Messwerte übernommen aus dem Playwright-Lauf vom selben Tag (Desktop 1440 px ungedrosselt, Mobil 390 px mit 4× CPU-Drossel und 1,6 Mbit/s). Die Voraussetzungen habe ich nachgeprüft und sie gelten unverändert.

| Metrik | Desktop | Mobil | Bewertung |
|---|---|---|---|
| LCP | 348 bis 600 ms 🟢 | 2.452 bis **4.320** ms 🔴 | halbe Punkte |
| FCP | unter 500 ms 🟢 | 2.432 bis 2.992 ms 🟡 | halbe Punkte |
| TTFB | 80 bis 148 ms 🟢 | 🟢 | voll |
| CLS | **0,000** 🟢 | **0,000** 🟢 | voll |
| INP | nicht gemessen | nicht gemessen | geschätzt gut |
| Desktop-Mobil-Abstand | 496 ms vs. 2.704 ms | | **0 Punkte** |

**Die Ursache ist eine Konfigurationszeile.** Nachgeprüft am 17.08.2026, mit `Accept-Encoding: gzip, br`:

```
/styles/site.css   116.032 B   content-encoding: (leer)
/styles/home.css    36.090 B   content-encoding: (leer)
/scripts/site.js    23.578 B   content-encoding: (leer)
/assets/signet.png 132.231 B   dargestellt bei 36×36 px
```

nginx komprimiert HTML, aber nicht `text/css` und nicht `application/javascript`. `site.css` ist renderblockierend, wird auf Mobil bei 2.605 ms fertig, und 99 ms später fällt der LCP. Das ist keine Korrelation, das ist die Kausalkette.

**Zum Vergleich, dieselbe Messung bei den drei Wettbewerbern:** alle drei liefern `content-encoding: br`. manibase ist der einzige im Feld, der unkomprimiert ausliefert.

**INP wurde nicht gemessen.** Ohne Felddaten aus der Search Console und ohne Interaktionstest bleibt das eine begründete Annahme: Die Seite lädt 23 KB eigenes JavaScript, bindet keine Fremdskripte vor der Einwilligung ein und hat keine schweren Handler. Das Risiko ist gering, belegt ist es nicht.

---

### 3.3 Content & Authority · 5,2 / 20

**Content-Strategie 9/20 · Linkprofil 3/20 · Rankings 3,5/20**

**Was inhaltlich gut ist.** Die Lesbarkeit ist die beste im gesamten Vergleichsfeld. Kurze Sätze, konkrete Substantive, kein Buzzword-Nebel, keine Floskeln. Das Fachvokabular sitzt: Regiebericht, Aufmaß, Nachtrag, Herstellerunterlagen, Wartungsprotokoll, LV, n8n, OpenWebUI, Microsoft 365 Copilot. Ein Bauleiter erkennt daran innerhalb eines Absatzes, dass hier jemand die Branche kennt. Es gibt keine Kannibalisierung, die vier Angebots- und drei Zielgruppenseiten trennen sauber.

**Wo es kippt: Umfang.** Netto-Wortzahl nach Abzug von rund 139 Wörtern Navigations- und Footer-Boilerplate:

| Seite | brutto | ca. netto | Rolle |
|---|---:|---:|---|
| `planungsbueros.html` | 317 | **≈180** | kommerzielle Zielseite |
| `baugewerbe.html` | 333 | **≈196** | kommerzielle Zielseite |
| `gebaeudetechnik-ausbau.html` | 368 | **≈231** | kommerzielle Zielseite |
| `prozessautomatisierung.html` | 373 | **≈236** | kommerzielle Zielseite |
| `ki-helfer.html` | 468 | ≈330 | Angebotsseite |
| `firmen-ki.html` | 588 | ≈450 | **Kernangebot** |
| `klartag.html` | 663 | ≈525 | Einstiegsangebot |
| `fuer-ihre-it.html` | 736 | ≈600 | längste Seite der Website |

Die vier dünnsten Seiten sind exakt die, die auf „KI für Bauunternehmen", „KI für SHK-Betriebe" und „KI für Architekturbüros" ranken sollen. Die längste Seite der Website hat 600 Wörter. Der SEO-stärkste Wettbewerber fährt auf einer einzigen vergleichbaren Seite geschätzt 4.500 bis 5.500 Wörter.

**Keine Frequenz, keine Frische.** Der Blog ist auf `noindex` gestellt und leitet weiter („Fachinhalte werden neu aufgebaut"). Es gibt auf der gesamten Website **keine einzige Jahreszahl und kein Datum im Fließtext**, kein `dateModified`, kein „Stand:". Für ChatGPT ist Inhaltsfrische der zweitstärkste Zitierfaktor (Inhalte unter 30 Tagen werden rund 3,2-mal häufiger zitiert); die Seite sendet dieses Signal überhaupt nicht, obwohl sie vor drei Tagen relauncht wurde.

**Belege und Zahlen fehlen fast vollständig.** Über fünf geprüfte Seiten hinweg: `index.html` **null** Zahlen mit Einheit und **ein** externer Link (der Zeeg-Kalender), `fuer-ihre-it.html` null Zahlen, `baugewerbe.html` genau eine („30 Minuten"). Die einzige belastbare Zahl der Website ist der eigene Preis.

**Das ist zum Teil eine bewusste Entscheidung, und die respektiere ich.** In `CLAUDE.md` steht: kein Proof-Abschnitt, keine Cases, keine Logos, keine Kennzahlen, solange nichts freigegeben ist, und die Lücke soll nicht durch Erfundenes verdeckt werden. Das ist die richtige Haltung, und ich schlage ausdrücklich nicht vor, sie aufzugeben.

**Sie hat aber einen messbaren Preis, und der lässt sich anders bezahlen.** Belege müssen nicht aus eigenen Projekten stammen. Eine verlinkte Zahl aus der Fraunhofer-IAO-Studie zur KI in der Bauwirtschaft, ein Verweis auf den Zeitplan des EU AI Act, eine Angabe aus einer Bauindustrie-Erhebung: das sind fremde, überprüfbare Belege. Nach dem Princeton-Raster bringt „cite sources" plus 40 Prozent und „add statistics" plus 37 Prozent Sichtbarkeit in generativen Antworten, und beides verletzt die Proof-Regel nicht, weil es nichts über eigene Kunden behauptet.

**Linkprofil.** Kein Hinweis auf einen einzigen verweisenden Fremd-Domain-Link. Keine Wikipedia-, keine Wikidata-Präsenz. Der einzige gefundene Außenbezug ist ein LinkedIn-Beitrag über Matthias Geislers Vortrag vor Business-Analytics-Studenten der THWS Würzburg-Schweinfurt. Das ist ein echter, sofort verwertbarer Aktivposten, der nur nirgends auf der Website vorkommt: kein Hochschulbezug, keine Vortragsseite, keine Verlinkung.

Immerhin: **keine toxischen Links**, sauber durch Abwesenheit.

---

### 3.4 E-E-A-T · 4,5 / 10

**Experience & Expertise 2/10 · Authority & Trust 11/20**

**Was trägt.**

| Signal | Befund |
|---|---|
| Über-uns-Seite | ✓ zwei namentliche Gründer, echte Fotos, faktenbasierte Biografien |
| Kontaktdaten vollständig | ✓ Anschrift, Telefon, E-Mail, konsistent über alle Seiten |
| Impressum | ✓ § 5 DDG vollständig, HRB 18632, Amtsgericht Würzburg |
| Datenschutzerklärung | ✓ 10 Abschnitte, aktuell, konkret (Zeeg, Odoo, Hosting benannt) |
| Zurückhaltung bei Versprechen | ✓ „ohne pauschale Rechts- oder Sicherheitsversprechen" |
| Reifegrad-Ampel | ✓ Anton offen als „In Entwicklung, derzeit nicht buchbar" gekennzeichnet |
| **Qualifikation** | ✓ beide Gründer mit „AI Strategy & Application Expert" der TÜV SÜD Akademie, auf `ueber-uns.html` belegt |

Die Reifegrad-Ampel verdient eine ausdrückliche Erwähnung. Ein Anbieter, der auf der eigenen Angebotsseite schreibt, dass ein Produkt noch nicht buchbar ist, verhält sich genau so, wie die Quality Rater Guidelines es unter *Trustworthiness* beschreiben. Das ist selten und sollte bleiben.

Dasselbe gilt für die TÜV-SÜD-Qualifikation: Sie steht auf der Seite mit dem Zusatz, dass sie „keinen Projektbeleg" ersetzt und deshalb nicht als pauschales Siegel geführt wird. Genau diese Selbstbegrenzung ist ein Vertrauenssignal. Sie sollte allerdings auch in den strukturierten Daten auftauchen (`Person.hasCredential`), damit sie maschinenlesbar wird.

**Was fehlt.**

| Lücke | Wirkung |
|---|---|
| Keine Autorenseiten, keine Bylines | kein Expertise-Signal, weil es keine Fachinhalte gibt, unter die man einen Namen setzen könnte |
| **Keine Verlinkung der Gründerprofile** | `ueber-uns.html` enthält **null** externe Links. Die LinkedIn-Profile beider Gründer sind vorhanden und werden nicht verlinkt. |
| Keine Quellenzitate | kein Beleg-Signal auf der gesamten Website |
| Keine Mitgliedschaften, keine Partnerlogos | insbesondere keine Microsoft-Partnerschaft, obwohl M365 Copilot als Architekturweg B beworben wird |
| Keine Drittanbieterbewertungen | kein Google-Profil, kein ProvenExpert, kein Trustpilot |
| Keine AGB | bei einem Angebot mit veröffentlichtem Festpreis auffällig |
| Unternehmensalter | Gründung 2026, Relaunch vor drei Tagen. Nicht behebbar, nur aussitzbar. |

---

### 3.5 Entity SEO · 2,7 / 10

**Wissensgraph 0,4/10 · Konsistenz 5/10**

Das ist die schwächste Dimension und zugleich die, die alle anderen bremst. Google und die generativen Systeme arbeiten nicht mit Domains, sondern mit Entitäten. Für „manibase" existiert keine.

| Prüfpunkt | Befund |
|---|---|
| Google Knowledge Panel | ✗ keiner |
| Wikidata | ✗ kein Q-Identifier |
| Wikipedia | ✗ keine Erwähnung |
| Google-Business-Profil / Maps | ✗ nicht auffindbar |
| `Organization`-Schema | 🟡 vorhanden, aber **ohne `sameAs`** |
| `founder`, `foundingDate`, `areaServed`, `vatID`/Registerkennung | ✗ alle nicht im Schema |
| Kanonische Profil-URLs verlinkt | ✗ keine, weder LinkedIn-Firmenseite noch Gründerprofile |
| Geografische Verankerung | ✓ Adresse konsistent in Schema, Impressum, Footer |

**Der Namenskonflikt ist real und wird unterschätzt.** Die Exact-Match-Suche `"manibase"` liefert:

| Rang | Treffer | gehört zu |
|---|---|---|
| 1 | Matthias Geisler, Manibase, LinkedIn | ✓ Ihnen, aber nicht die Website |
| 2 bis 8 | El Maní, Manises Air Base, Homebase, Manbase Shop (Facebook), Minibase, MANBASE Australien, MANBASE eBay | ✗ fremd |

**manibase.de erscheint auf der eigenen Marke nicht.** Bei einem Kunstwort ist das ungewöhnlich und hat zwei Ursachen, die sich addieren: die Domain ist neu und ohne Links, und der Name kollidiert phonetisch und in der Schreibweise mit mehreren etablierten Marken. Gegen beides hilft dasselbe Mittel, nämlich dichte, konsistente Entitätssignale.

Der aktuelle `Organization`-Block:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "manibase UG (haftungsbeschränkt)",
  "url": "https://manibase.de/",
  "logo": "https://manibase.de/assets/wortmarke.png",
  "email": "kontakt@manibase.de",
  "telephone": "+49 15565 697065",
  "address": { "@type": "PostalAddress", … }
}
```

Fachlich korrekt, aber es ist eine Visitenkarte, keine Entitätsdefinition. Es fehlt genau das Feld, das eine Entität zusammenbindet: `sameAs`.

---

### 3.6 GEO · 8,8 / 20 (43,75 / 100)

| Teilbereich | Score |
|---|---:|
| 5.1 KI-Bot-Zugänglichkeit | **10 / 10** 🟢 |
| 5.2 Die neun GEO-Methoden (Princeton/KDD 2024) | 12,5 / 20 🟡 |
| 5.3 Inhaltsstruktur für LLMs | 9,5 / 20 🔴 |
| 5.4 Strukturierte Daten für KI | **3,25 / 20** 🔴 |
| 5.5 Plattformspezifische Optimierung | 3 / 10 🔴 |
| 5.6 Sichtbarkeitstest | 5,5 / 20 🔴 |

#### 5.1 Bot-Zugang: volle Punktzahl

Live geprüft am 17.08.2026, je ein Request mit dem echten User-Agent:

| Bot | Antwort |
|---|---|
| Googlebot | 200 ✓ |
| Google-Extended | 200 ✓ |
| GPTBot | 200 ✓ |
| ChatGPT-User | 200 ✓ |
| ClaudeBot | 200 ✓ |
| PerplexityBot | 200 ✓ |
| Bingbot | 200 ✓ |

Da keine robots.txt existiert, ist per Definition nichts gesperrt. Das ist hier ein Glücksfall und wird bei der Neuanlage der Datei leicht zerstört: **wer jetzt eine robots.txt schreibt, muss die KI-Bots aktiv erlauben, sonst verschlechtert die neue Datei die Lage gegenüber dem heutigen 404.**

#### 5.2 Die neun Methoden

| Methode | Boost | Bewertung |
|---|---|---|
| 1. Quellen zitieren | +40 % | 🔴 keine |
| 2. Statistiken | +37 % | 🔴 nur der eigene Preis |
| 3. Expertenzitate | +30 % | 🔴 keine |
| 4. Autoritativer Ton | +25 % | 🟢 **voll** |
| 5. Verständlichkeit | +20 % | 🟢 **voll** |
| 6. Fachterminologie | +18 % | 🟢 **voll** |
| 7. Wortschatzvielfalt | +15 % | 🟢 **voll** |
| 8. Sprachfluss | +15 bis 30 % | 🟢 **voll** |
| 9. Kein Keyword-Stuffing | −10 % vermieden | 🟢 **voll** |

Sechs von neun Methoden voll erfüllt, und die drei Fehlenden sind genau die drei, die man an einem Nachmittag nachrüstet. Die Princeton-Studie nennt die Kombination aus Sprachfluss und Statistiken als stärkste Paarung. Die eine Hälfte davon liegt fertig vor.

#### 5.3 Struktur für Sprachmodelle

**Das Kernproblem sind die Überschriften.** Über die ganze Website hinweg sind von rund 180 Überschriften genau **drei** als Frage formuliert. Die H2 der Zielseiten lauten „Fachzeit für fachliche Entscheidungen.", „Erst Ablauf und Machbarkeit prüfen.", „Erst entscheiden, was trägt. Dann gezielt einführen."

Das sind gute Sätze. Als Marketingtexte sind sie den Wettbewerbern überlegen. Aber ein Sprachmodell, das eine Passage zur Frage „Wie führe ich KI in einem Bauunternehmen ein?" sucht, findet in diesen Überschriften kein Anschlussstück. Der Absatz darunter beantwortet die Frage oft richtig; nur führt kein Weg dorthin.

| Kriterium | Befund |
|---|---|
| Antwort zuerst | 🟡 teilweise, der Lead-Absatz von `baugewerbe.html` macht es richtig |
| Absatzlänge | 🟢 durchweg kurz |
| **Strukturierte FAQ** | 🔴 **null auf allen 15 Seiten** |
| Klare Definitionen | 🟡 „Was ist ein Klartag" wird nirgends als Definitionssatz beantwortet |
| Listen und Tabellen | 🟢 Bento, Datenblätter, Maßkette |
| **Frageüberschriften** | 🔴 **3 von ~180** |
| Eigenständiger Inhalt | 🟢 vollständig original, aus erster Hand |
| Öffentliche PDFs | 🔴 keine (Perplexity bevorzugt sie) |
| **Frische** | 🔴 kein Datum, nirgends |

#### 5.4 Strukturierte Daten: 3,25 / 20

| Typ | Status | Warum es hier zählt |
|---|---|---|
| `FAQPage` | ✗ | stärkster Einzelhebel, rund +40 % KI-Sichtbarkeit |
| `Offer` / `Service` | ✗ | Klartag hat einen **öffentlichen Festpreis von 3.900 Euro netto**, ein Lehrbuchfall |
| `ProfessionalService` | ✗ | passt zum Geschäftsmodell |
| `Person` (2×) | ✗ | beide Gründer namentlich mit Foto und Biografie vorhanden |
| `BreadcrumbList` | ✗ | |
| `Organization.sameAs` | ✗ | |
| `Article` + `dateModified` | ✗ | keine Artikel vorhanden |
| `Review` / `AggregateRating` | ✗ | keine Bewertungen vorhanden, korrekt nicht ausgezeichnet |
| Open Graph | 🟡 | **nur Startseite.** Jede geteilte Unterseite erscheint in LinkedIn und WhatsApp ohne Bild und ohne Titel. |
| JSON-LD als Format | ✓ | korrekt gewählt |

**Zur Verlässlichkeit dieser Erkennung:** Bei CMS-Seiten wäre die Aussage „kein Schema gefunden" wertlos, weil Yoast, RankMath, Shopify und Webflow ihr JSON-LD per JavaScript nachliefern. manibase ist eine statische Website ohne Framework; die einzigen Skripte sind `kinetic-grid.js`, `site.js` und ein Inline-Einzeiler, der eine CSS-Klasse setzt. Es gibt keinen Injektionspfad. **Die Erkennung im Roh-HTML ist hier belastbar.**

#### 5.5 Plattformen im Einzelnen

**ChatGPT.** Rangfaktor Nummer eins ist Domain-Autorität, gemessen an verweisenden Domains. Hier: nahe null. Frischesignal: keines. Eigene Marken-Domain: ✓. Wikipedia- oder Reddit-Präsenz (zusammen rund 9,6 Prozent aller ChatGPT-Zitate): keine. **Kurzfristig aussichtslos, das ist der langsamste Kanal.**

**Perplexity.** PerplexityBot ✓ zugelassen. FAQ-Schema ✗. Öffentliche PDFs ✗. Themenautorität dünn. Perplexity bewertet neue Inhalte allerdings schnell und wiegt semantische Passung höher als Autorität. **Das ist der realistischste erste Kanal**, und FAQ plus ein herunterladbares PDF sind der direkte Weg dorthin.

**Google AI Overview.** Braucht E-E-A-T und eine Entität im Knowledge Graph. Beides fehlt. Der autoritative Ton (+89 Prozent Sichtbarkeit) und autoritative Zitate (+132 Prozent) sind die zwei Stellschrauben, und die erste ist bereits bedient.

**Copilot / Bing.** Bingbot ✓ zugelassen. Indexierung nicht verifizierbar (siehe Methodik). Bing indexiert neue Domains ohne Sitemap sehr langsam. LinkedIn-Präsenz ist im Microsoft-Ökosystem ein Bonus, und ein LinkedIn-Unternehmensprofil fehlt bisher.

**Claude.** Bezieht seinen Index über **Brave Search**, nicht über Google oder Bing. ClaudeBot ✓ zugelassen. Brave-Indexierung nicht verifizierbar. Das Verhältnis von Crawl zu Zitat liegt bei Claude bei etwa 38.065 zu 1, die Auswahl ist also extrem selektiv und belohnt Faktendichte und klare Extrahierbarkeit. Die Struktur ist gut, die Faktendichte ist das Nadelöhr.

#### 5.6 Sichtbarkeitstest

Vier Suchen, alle ohne Fund:

| Suche | manibase gefunden? | Wer stattdessen |
|---|---|---|
| `manibase UG Eibelstadt KI-Einführung Bauunternehmen` | ✗ | Branchenverzeichnisse, Fraunhofer, TU Darmstadt |
| `manibase.de KI-Einführung Bau Handwerk Planung` | ✗ | handwerk-digitalisieren.de, streit-software.de, BZB |
| `KI Einführung Bauunternehmen Beratung Anbieter Deutschland` | ✗ | kozoa.de, derprozessmeister.de, innovation-ausbau.de |
| `Wie führt man KI im Handwerksbetrieb SHK Elektro kontrolliert ein DSGVO` | ✗ | 9 Wettbewerberseiten |

Die vierte Suche ist die aussagekräftigste. Sie beschreibt manibases Angebot fast wörtlich, inklusive der Gewerke aus der eigenen Zielgruppendefinition und des DSGVO-Arguments, das die Startseite im Tiefblau-Band führt. Es antworten neun andere Anbieter.

Einziger voller Punktgewinn in diesem Abschnitt: kein Bot ist blockiert (5/5).

---

### 3.7 UX & Conversion · 5,8 / 10

**UX 9,5/10 · Conversion 6,5/10 · Analytics 1,5/10**

**UX ist sehr gut.** Sechs Menüpunkte auf erster Ebene, zwei Aufklappmenüs, CTA im Header und im Hero über der Falte, ein einziges Konversionsziel auf allen Seiten. Responsive bei 320, 768, 1024 und 1440 geprüft. Kontrast und Schriftgrößen in Ordnung. Der einzige Abzug: auf Mobil steht 2,4 bis 3,0 Sekunden lang eine weiße Fläche, weil das unkomprimierte CSS blockiert.

**Conversion, gemischt.**

| Punkt | Befund |
|---|---|
| Primärer CTA | ✓ „Kontakt aufnehmen" → `#termin`, überall identisch |
| SERP-zu-Landing-Kohärenz | ✓ Titel und Seiteninhalt passen zusammen |
| Vertrauenssignale | 🟡 Datenhoheit-Band und Reifegrad-Ampel ja, Zertifikate und Garantien nein |
| Referenzen | 🔴 keine (bewusste Entscheidung) |
| Kontaktformular | 🟡 fünfstufige Maske statt fünf Felder. Gut gebaut, aber für einen Erstkontakt viel. |
| **Telefonnummer** | 🔴 nur in Footer und Impressum, **nicht im Seitenkopf**, mobil nicht als `tel:`-Link oben erreichbar |

Der letzte Punkt zählt in dieser Branche mehr als anderswo. Ein Geschäftsführer mit 80 Mitarbeitern, der auf der Baustelle mobil auf die Seite kommt, ruft an. Er füllt keine fünfstufige Maske aus.

**Analytics: 1,5 / 10, Stufe „ohne Instrumente".**

Geprüft und **nicht** gefunden: GA4, gtag, Google Tag Manager, dataLayer, Matomo, Plausible, Umami, Fathom, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag. Der einzige Treffer auf „consent" ist eine Formular-Checkbox, keine Consent-Plattform.

Das hat eine gute Seite: keine Drittanbieterskripte, kein Cookie-Banner, kein Einwilligungskonflikt, und das passt zur Datenschutz-Positionierung der Marke. Nur ist der Preis, dass niemand beantworten kann, in welchem der fünf Maskenschritte die Interessenten aussteigen, welche Zielgruppenseite Termine bringt und ob eine Optimierung gewirkt hat.

**Empfehlung, die zur Marke passt:** selbstgehostetes Matomo ohne Cookies oder Plausible mit EU-Hosting. Beide arbeiten ohne personenbezogene Daten, brauchen kein Einwilligungsbanner, kosten unter 100 ms Ladezeit und liefern Trichterdaten. Das ist kein Widerspruch zur Positionierung, sondern deren praktische Anwendung.

---

## 4. Wettbewerbsanalyse

Die Vergleichswerte sind aus dem Roh-HTML, den Response-Headern und den Suchergebnissen erhoben. Die Score-Spalten der Wettbewerber sind **Schätzungen aus beobachtbaren Signalen**, keine vollständigen Audits.

| Kriterium | **manibase.de** | derprozessmeister.de | innovation-ausbau.de | kozoa.de |
|---|---|---|---|---|
| **Technical SEO /10** | 7,0 | ~7 | ~6 | ~7 |
| **Core Web Vitals /10** | 6,0 | ~7 | ~4 | ~7 |
| **Content & Authority /20** | 5,2 | ~14 | ~10 | ~5 |
| **E-E-A-T /10** | 4,0 | ~6 | ~6 | ~3 |
| **Entity SEO /10** | 2,7 | ~5 | ~6 | ~3 |
| **GEO /20** | 8,8 | ~12 | ~8 | ~7 |
| **UX & Conversion /10** | 5,8 | ~7 | ~5 | ~6 |
| **GESAMT /90** | **40,0** | **~58** | **~45** | **~38** |
| robots.txt | ✗ **404** | ✓ 200 | ✓ 200 | ✓ 200 |
| sitemap.xml | ✗ **404** | ✓ 200 | 🟡 301 | ✓ 200 |
| Kompression CSS/JS | ✗ **keine** | ✓ brotli | ✓ brotli | ✓ brotli |
| TTFB Startseite | **0,15 s** ✓ bester Wert | 0,18 s | 1,00 s | 0,39 s |
| JSON-LD im Roh-HTML | 🟡 nur `Organization` | ✗ keines | ✗ keines | ✗ keines |
| Open Graph im Roh-HTML | 🟡 nur Startseite | ✗ | ✗ | ✗ |
| FAQ-Inhalt auf Seite | ✗ | ✓ ausführlich | 🟡 | ✗ |
| Preise öffentlich | ✓ 3.900 € | ✓ ab 2.500 € | ✗ | ✗ |
| Referenzen und Kennzahlen | ✗ (bewusst) | ✓ „150+ Kunden", „4,9★", „35 h/Monat" | ✓ Google-Cloud-Partnerschaft | ✗ |
| Wortzahl längste Seite | ~600 | ~4.500 bis 5.500 | mittel | kurz |
| In Testsuchen gefunden | ✗ **0 von 4** | ✓ | ✓ | ✓ |
| Analytics | ✗ keines | ✓ | ✓ | unklar |
| Publikationsfrequenz | keine | regelmäßig | regelmäßig | keine |

### derprozessmeister.de · der SEO-reife Wettbewerber

**Was besser läuft:** massiver Textumfang auf kommerziellen Seiten, ausgebauter FAQ-Bereich, transparente Preisstaffel, quantifizierte Fallbeispiele, regionale Landingpage-Struktur über viele Städte.
**Angreifbar:** Die Positionierung ist breit („80+ Branchen"), Bau ist eine von vielen. Die Zahlen wirken generisch. Kein JSON-LD im ausgelieferten HTML, trotz FAQ-Inhalt.
**Anmerkung zur Sorgfalt:** Eine erste automatisierte Auswertung meldete `FAQPage`-Schema auf dieser Seite. Die direkte Prüfung des Roh-HTML fand **kein JSON-LD**. Der FAQ-*Inhalt* ist vorhanden, die *Auszeichnung* ist nicht belegt. Ich führe sie deshalb als nicht vorhanden.

### innovation-ausbau.de · KI-Businessclub BAU

**Was besser läuft:** Verbandsnähe, Google-Cloud-Partnerschaft als Autoritätssignal, etablierte Marke im Segment.
**Angreifbar:** TTFB von 1,0 Sekunde ist der schlechteste Wert im Feld. Clubmodell statt konkreter Einführungsleistung. Kein Festpreiseinstieg.

### kozoa.de · der direkteste Wettbewerber

**Fast dieselbe Positionierung:** „KI-Beratung für die Bauindustrie", mittelständische Bauunternehmen im DACH-Raum, 2026 gegründet (Düsseldorf), RAG-Wissenssysteme, LV-Auswertung, automatisches Bautagebuch, 45-minütiges kostenloses Erstgespräch, Zusage „8 bis 12 Wochen".
**Was besser läuft:** robots.txt, Sitemap, brotli. Erscheint in Suchergebnissen, manibase nicht.
**Angreifbar, und zwar deutlich:** kein Schema, kein Open Graph, kein Blog, keine FAQ, keine Referenzen, sehr dünne Seite, Ein-Personen-Betrieb ohne Governance-Angebot.

**Das ist die wichtigste Erkenntnis des Vergleichs.** kozoa liegt bei etwa 38 von 90, manibase bei 40. Der direkteste Wettbewerber ist inhaltlich schwächer aufgestellt und wird trotzdem gefunden, weil er drei Dateien hat, die manibase fehlen. Das Rennen in diesem Segment ist nicht entschieden, und es wird gerade an einer Stelle verloren, die einen Nachmittag Arbeit kostet.

### Differenzierungsmerkmale, die manibase belegbar besitzt

1. **Zwei Gründer mit unterschiedlichen, nachprüfbaren Profilen.** Einführung, Projektsteuerung, Change und Schulung auf der einen Seite, Architektur und Softwareentwicklung auf der anderen. kozoa ist eine Person, derprozessmeister ist eine Agentur ohne Gesichter.
2. **Vier benannte Architekturwege statt einer Blackbox.** Eigene Firmen-KI, Microsoft 365 Copilot, n8n als eigener Dienst, KI-Helfer-Software, dazu die Aussage zur privaten Cloud. Kein Wettbewerber legt das offen. Das ist eine Inhaltsstrecke, keine Textbox.
3. **Ehrlichkeit als Alleinstellungsmerkmal.** Die Reifegrad-Ampel und der Satz, dass Anton nicht buchbar ist, sind das genaue Gegenteil der Konkurrenzkommunikation. In einer Branche, die von KI-Versprechen ermüdet ist, ist das ein Verkaufsargument, das aktuell nur auf einer Karte in der Fußzeile steht.
4. **Sprachqualität**, siehe GEO-Abschnitt 5.2.

### Keyword-Lücke: zehn Ziele

Volumina sind Größenordnungsschätzungen für den DACH-Raum ohne Keyword-Tool-Daten, entsprechend unsicher.

| # | Suchbegriff | Absicht | Zielseite | Aufwand |
|---|---|---|---|---|
| 1 | KI im Bauunternehmen einführen | kommerziell | `baugewerbe.html` ausbauen | mittel |
| 2 | KI für Handwerksbetriebe DSGVO-konform | kommerziell | `gebaeudetechnik-ausbau.html` | mittel |
| 3 | eigene Firmen-KI statt ChatGPT | kommerziell | `firmen-ki.html` | mittel |
| 4 | Microsoft 365 Copilot vs. eigene KI-Umgebung | Vergleich | **neu**, aus Blatt 04 | hoch, hoher Wert |
| 5 | KI-Richtlinie Unternehmen Vorlage | informativ | **neu**, Leitfaden als PDF | hoch, Linkmagnet |
| 6 | Bautagebuch automatisch erstellen KI | informativ | **neu**, Bernd-Fallseite | mittel |
| 7 | LV-Auswertung mit KI | informativ | **neu** | mittel |
| 8 | n8n für Handwerksbetriebe | informativ | `prozessautomatisierung.html` | niedrig |
| 9 | KI-Beratung Würzburg / Unterfranken | lokal | **neu**, plus Google-Profil | niedrig |
| 10 | Was kostet eine KI-Einführung im Mittelstand | informativ | **neu**, mit dem echten Preis | niedrig, hoher Wert |

Nummer 10 verdient eine Randbemerkung: manibase ist einer von zwei Anbietern im Feld mit einem öffentlichen Preis. Eine Seite, die diese Frage geradeheraus beantwortet, ist mit vorhandenem Wissen schreibbar und bedient eine Suchabsicht mit sehr hoher Kaufnähe.

---

## 5. Maßnahmenplan mit Aufwand und erwarteter Wirkung

### 🟢 Sofort, unter einer Woche

| # | Maßnahme | Aufwand | Wirkung | Erwartung |
|---|---|---|---|---|
| S1 | **robots.txt anlegen**, KI-Bots ausdrücklich erlauben, Sitemap referenzieren | 0,5 h | Indexierung | Voraussetzung für alles Weitere |
| S2 | **sitemap.xml anlegen** (13 indexierbare Seiten) und in der Search Console einreichen | 1 h | Indexierung | Indexierung in 1 bis 2 Wochen statt Monaten |
| S3 | **gzip/brotli für `text/css` und `application/javascript`** in nginx | 0,5 h | CWV | rund 105 KB weniger, mobiler LCP von 2,7 s auf voraussichtlich unter 1,5 s |
| S4 | **`signet.png` und `signet-negative.png`** als 72×72-WebP | 0,5 h | CWV | rund 190 KB weniger auf **jeder** Seite |
| S5 | **`Organization` um `sameAs`, `founder`, `foundingDate`, `areaServed` erweitern** | 1 h | Entity | einziger Weg aus der Namenskollision |
| S6 | **Canonical auf den 7 fehlenden Seiten** | 0,5 h | Technik | Duplikatrisiko aus |
| S7 | **Open Graph auf alle 14 Unterseiten** | 1 h | Reichweite | geteilte Links bekommen Bild und Titel |
| S8 | **Titel und Descriptions kürzen** (Startseite 87 → unter 60 Zeichen, Descriptions auf 150 bis 160) | 1 h | CTR | +10 bis 20 % Klickrate bei gleicher Position |
| S9 | **Telefonnummer als `tel:`-Link in den Seitenkopf**, mobil sichtbar | 1 h | Conversion | direkter Kanal für den anrufenden Bauleiter |
| S10 | **LinkedIn-Profile beider Gründer auf `ueber-uns.html` verlinken**, LinkedIn-Unternehmensseite anlegen und in `sameAs` aufnehmen | 1,5 h | E-E-A-T, Entity | verbindet die einzige rankende Fremdquelle mit der Domain |
| S11 | **Datenschutzfreundliche Analytik** (Matomo ohne Cookies oder Plausible EU) | 2 h | Messbarkeit | Trichterdaten der Maske, ohne Einwilligungsbanner |
| S12 | **Branded 404-Seite** mit Navigation | 0,5 h | UX | |

**Summe: rund 11 Stunden.** S1 bis S4 sind die vier, die zuerst laufen müssen.

> ⚠️ **Zu S1, weil es leicht schiefgeht.** Heute ist nichts blockiert, weil die Datei fehlt. Eine neu angelegte robots.txt kann diesen Zustand nur halten oder verschlechtern. Sie muss `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended` und `Bingbot` ausdrücklich erlauben. Ein aus dem Netz kopierter Standardblock sperrt genau diese Bots und wirft die einzige volle GEO-Teilnote weg.

### 🟡 Mittelfristig, ein bis drei Monate

| # | Maßnahme | Aufwand | Wirkung | Erwartung |
|---|---|---|---|---|
| M1 | **FAQ-Bereich mit `FAQPage`-Schema** auf den vier Angebots- und drei Zielgruppenseiten, 5 bis 7 echte Fragen je Seite in der Sprache der Kunden | 12 h | GEO, SERP | rund +40 % KI-Sichtbarkeit, Chance auf Rich Results |
| M2 | **Die vier dünnen Zielseiten auf 900 bis 1.200 Wörter ausbauen**, mit Frageüberschriften und Antwort im ersten Absatz | 20 h | Rankings | die vier kommerziell wichtigsten Seiten werden erst dadurch rankingfähig |
| M3 | **Fremdbelege einbauen:** Fraunhofer IAO, EU AI Act, Bauindustrie-Erhebungen. Verlinkt und datiert. Verletzt die Proof-Regel nicht. | 6 h | GEO, E-E-A-T | „cite sources" +40 %, „statistics" +37 % |
| M4 | **Vergleichsseite „Microsoft 365 Copilot oder eigene KI-Umgebung"** aus Blatt 04 | 8 h | Rankings | hohe Kaufnähe, niemand im Feld bedient das |
| M5 | **Seite „Was kostet eine KI-Einführung"** mit dem echten Preis | 5 h | Rankings, Conversion | einer von zwei Anbietern mit öffentlichem Preis |
| M6 | **`Offer`/`Service`-Schema für den Klartag**, plus `Person` für beide Gründer, plus `BreadcrumbList` | 4 h | Entity, GEO | Preis und Personen werden maschinenlesbar |
| M7 | **„Stand: TT.MM.JJJJ" und `dateModified`** auf allen Inhaltsseiten | 2 h | GEO | Frischesignal, ChatGPT gewichtet es rund 3,2-fach |
| M8 | **Wikidata-Eintrag** für manibase UG mit Registerdaten und Domainbezug | 3 h | Entity | Grundstein für ein Knowledge Panel |
| M9 | **Google-Unternehmensprofil** für den Sitz Eibelstadt | 2 h | Entity, lokal | bedient „KI-Beratung Würzburg" |
| M10 | **`ki-helfer.html`: Hintergrundbild zu `<img>` mit `fetchpriority`** | 2 h | CWV | LCP von 4,3 s auf unter 2,5 s |

**Summe: rund 64 Stunden.**

### 🔴 Langfristig, drei bis sechs Monate

| # | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| L1 | **Fachinhalte wieder aufbauen**, zwei Beiträge im Monat entlang der Keyword-Lücke, mit Byline eines der Gründer | 8 h je Beitrag | Themenautorität, Frische, Linkgrundlage |
| L2 | **Leitfaden „KI-Richtlinie für Bau- und Handwerksbetriebe" als PDF**, gegen E-Mail-Adresse | 20 h | Linkmagnet, Leads, und Perplexity bevorzugt PDFs |
| L3 | **Gezielter Linkaufbau:** Handwerkskammer Unterfranken, Bauinnungen, THWS (der Vortragsdraht besteht bereits), Fachpresse | 30 h | die derzeit größte Einzellücke |
| L4 | **Erste Referenz freigeben lassen**, sobald ein Kunde zustimmt | laufend | löst die selbstauferlegte Proof-Lücke sauber auf |
| L5 | **URLs ohne `.html`** mit 301-Weiterleitungen | 6 h | kosmetisch, nur bei ohnehin anstehender nginx-Arbeit |

---

## 6. Kennzahlen für die Nachverfolgung

**Zuerst, vor allem anderen:** Google Search Console einrichten und Bing Webmaster Tools anlegen. Ohne beides ist jede Aussage über Positionen eine Schätzung, auch dieses Audit.

| Kennzahl | Quelle | Takt |
|---|---|---|
| Indexierte Seiten (Ziel: 13 von 13) | Search Console, Abdeckung | wöchentlich im ersten Monat |
| Impressionen und Klicks | Search Console | wöchentlich |
| Positionen auf den 10 Keywords aus Abschnitt 4 | Search Console | monatlich |
| Ranking auf die eigene Marke „manibase" | manuelle Suche | monatlich, **das ist der erste Erfolgsindikator** |
| Verweisende Domains | Ahrefs Webmaster Tools (kostenlos für die eigene Domain) | monatlich |
| Mobiler LCP | Search Console, Core Web Vitals | monatlich |
| Abbruchquote je Maskenschritt | Matomo oder Plausible nach S11 | monatlich |
| KI-Zitate | dieselben 4 Testsuchen plus Perplexity und ChatGPT | monatlich |

**Alarme einrichten:** Google Alert auf „manibase", Google Alert auf „KI Einführung Bauunternehmen", Search-Console-Benachrichtigungen für Abdeckung und Core Web Vitals.

---

## 7. Methodik und Grenzen

**Was gemessen wurde.** 15 Live-Seiten mit Googlebot-User-Agent abgerufen und ausgewertet (Titel, Description, Canonical, Robots-Meta, Open Graph, JSON-LD, Überschriftenbaum, Alt-Texte, Wortzahl, interne Verlinkung). robots.txt, sitemap.xml und llms.txt geprüft. Response-Header und Kompression je Asset gemessen. Sieben KI-Bot-User-Agents einzeln getestet. Vier Suchanfragen. Drei Wettbewerber technisch abgeklopft und inhaltlich ausgewertet.

**Was geschätzt ist.**

- **Core-Web-Vitals-Werte** stammen aus dem Playwright-Laborlauf vom selben Tag, nicht aus Felddaten. Die PageSpeed-Insights-API war kontingentbedingt nicht verfügbar (HTTP 429, Tageslimit 0 ohne API-Schlüssel). Die zugrundeliegenden Ursachen habe ich direkt nachgeprüft und sie bestehen unverändert.
- **INP** wurde nicht gemessen.
- **Indexierungsstand.** `site:`-Abfragen bei Bing, Brave und DuckDuckGo lieferten leere Ergebnisse. Da auch Kontrollabfragen leer blieben, ist das mit hoher Wahrscheinlichkeit eine Scraping-Sperre der Suchmaschinen und **kein Beleg für Nichtindexierung**. Die Aussage „nicht auffindbar" stützt sich auf die vier inhaltlichen Suchen, nicht auf die `site:`-Abfragen. **Verlässliche Klärung nur über die Search Console.**
- **Die Websuche dieses Werkzeugs ist auf US-Ergebnisse ausgerichtet.** Deutsche SERPs können abweichen. Dass eine Marke bei vier verschiedenen Suchen und einer Exact-Match-Abfrage auf den eigenen Namen nirgends erscheint, ist trotzdem ein belastbares Signal.
- **Wettbewerber-Scores** sind Schätzungen aus beobachtbaren Signalen, keine vollständigen Audits.
- **Verweisende Domains** wurden ohne Backlink-Werkzeug erhoben, also über Suchsignale. „Nahe null" ist eine begründete Annahme, keine Messung.
- **Verkehrsprognosen** sind Größenordnungen. Ohne Search-Console-Historie gibt es keine Basislinie.

---

## 8. Glossar

**Canonical** · Ein Verweis im Seitenkopf, der Suchmaschinen sagt, welche URL die maßgebliche Fassung einer Seite ist.
**Core Web Vitals** · Googles drei Messwerte für die Nutzererfahrung: LCP (wann das größte sichtbare Element steht), CLS (ob beim Laden etwas springt), INP (wie schnell die Seite auf eine Eingabe reagiert).
**E-E-A-T** · Experience, Expertise, Authoritativeness, Trustworthiness. Googles Bewertungsraster für Glaubwürdigkeit.
**Entität** · Ein Ding, das Suchmaschinen als eigenständigen Gegenstand kennen (eine Firma, eine Person, ein Ort), unabhängig von Suchbegriffen.
**GEO** · Generative Engine Optimization. Die Arbeit daran, von KI-Systemen wie ChatGPT, Perplexity, Gemini und Google AI Overviews als Quelle zitiert zu werden. Diese Systeme ranken keine Seiten, sie zitieren Quellen.
**Knowledge Panel** · Der Informationskasten rechts neben Google-Ergebnissen bei Suchen nach Firmen oder Personen.
**JSON-LD / Schema** · Ein maschinenlesbarer Datenblock im Seitenquelltext, der Suchmaschinen sagt, was auf der Seite steht (Firma, Angebot, Preis, Person, Frage und Antwort).
**LCP** · Largest Contentful Paint. Gut unter 2,5 Sekunden.
**robots.txt** · Textdatei im Wurzelverzeichnis, die Suchmaschinen und KI-Crawlern sagt, was sie lesen dürfen und wo die Sitemap liegt.
**`sameAs`** · Das Schema-Feld, das die eigene Domain mit den offiziellen Profilen derselben Entität verbindet (LinkedIn, Wikidata, Branchenverzeichnisse). Der wichtigste Einzelbaustein der Entitätsbildung.
**Verweisende Domain** · Eine fremde Website, die mindestens einmal auf die eigene verlinkt.

---

## 9. Fazit

Die Website ist besser gebaut und deutlich besser geschrieben als alles im Vergleichsfeld, und sie ist trotzdem unsichtbar, weil drei Dateien fehlen und die Marke außerhalb der eigenen Domain keine Spuren hinterlässt. Die vier Sofortmaßnahmen S1 bis S4 kosten zusammen etwa zweieinhalb Stunden und heben die Seite aus der Nichtexistenz auf die Startlinie. Danach entscheidet sich alles an zwei Fragen: ob die vier kommerziellen Zielseiten von 200 auf 1.000 Wörter wachsen, und ob die Marke „manibase" in den Wissensgraphen und auf LinkedIn eine überprüfbare Spur bekommt.

Der direkteste Wettbewerber kozoa.de liegt bei etwa 38 von 90 und wird gefunden, manibase liegt bei 40 und wird nicht gefunden. Der Unterschied ist keine Frage der Qualität, sondern der Erreichbarkeit. Das ist die günstigste Art von Rückstand.

**Nachaudit empfohlen in drei Monaten**, sinnvollerweise erst nach Einrichtung der Search Console, damit beim nächsten Mal Messwerte an die Stelle der Schätzungen treten.

---

## 10. Umsetzungsstand S1 bis S7 (17. August 2026)

> **Lesehinweis.** Dieser Abschnitt beschreibt durchgehend den **aktuellen Stand des Codes**, nicht den ersten Wurf. Der Unterabschnitt „Nachbesserungen aus dem Review" ist reine Änderungshistorie: was dort steht, ist bereits umgesetzt und in den Tabellen darüber schon berücksichtigt. Wer wissen will, wie das Markup heute aussieht, liest die Tabellen. Wer wissen will, warum, liest die Historie.

| # | Maßnahme | Stand |
|---|---|---|
| S1 | `site/robots.txt` angelegt, 17 User-agent-Blöcke, alle KI-Bots ausdrücklich erlaubt, Sitemap referenziert | ✅ |
| S2 | `site/sitemap.xml` angelegt, **10** indexierbare Seiten | ✅ Einreichung in der Search Console offen |
| S3 | nginx-Kompression für CSS und JS | 📄 dokumentiert in `docs/deployment/nginx-kompression.md`, **Serverarbeit steht aus** |
| S4 | `signet-72.webp`, `signet-negative-72.webp`, `favicon-32.png` und `favicon-96.png` erzeugt, Referenzen in 14 Dateien umgestellt | ✅ Signets **192 KB auf 12 KB** pro Seite, Favicon **132 KB auf rund 9 KB** (32px für den Browser-Tab, 96px für die Google-Suche, beide mit `sizes` deklariert) |
| S5 | `Organization`-Schema erweitert | ✅ mit Vorbehalten, siehe unten |
| S6 | Canonical auf 7 Seiten ergänzt, jetzt genau eines auf allen 16 Seiten | ✅ |
| S7 | Open Graph und `twitter:card` auf 13 Seiten ergänzt | ✅ |

### Korrektur zur Seitenzahl

Der Bericht nannte oben 13 indexierbare Seiten, übernommen aus dem früheren Audit. **Nachgezählt sind es 10.** Die übrigen tragen `noindex`: `impressum.html`, `datenschutz.html`, `infotermin.html`, `interessent.html`, `blog/index.html`, `einfuehrungsprojekt.html`, `ki-klartag.html`. Die Sitemap enthält entsprechend 10 URLs.

### Nachtrag: LinkedIn-Verknüpfung

Die drei LinkedIn-URLs lagen nach dem ersten Durchgang vor und wurden an drei Stellen eingesetzt, absichtlich nicht an vier:

| Ort | Was | Designrisiko |
|---|---|---|
| Schema | `Organization.sameAs` → Firmenseite · `founder[].sameAs` → beide Personenprofile | keins, unsichtbar |
| Footer, Spalte „Unternehmen", alle 10 Seiten | `<a rel="me">LinkedIn</a>` auf die **Firmen**seite. `rel="me"` ist hier korrekt: die eigene Domain verweist auf das eigene Profil. | keins, identisches Element wie die vier Geschwisterlinks. Nachgemessen: gleiche Farbe, Größe, Abstand, Breite. |
| `ueber-uns.html`, unter jeder Gründer-Biografie | Textlink „LinkedIn-Profil von …", **ohne `rel`-Attribut**. Die Personenzuordnung leistet `Person.sameAs` im JSON-LD, nicht das Markup. Begründung unter „Nachbesserungen aus dem Review". | gering, `<a>` im `<p>` ist auf derselben Seite bereits im Kontaktblock im Einsatz. Rendert in Cobalt `#2F3FDB` mit Unterstreichung, also die Rolle, die Cobalt laut Markenregeln hat. |

**Bewusst nicht platziert: Blatt 05 „Ihre Ansprechpartner" auf der Startseite.** Die Karten dort sind eng getaktet (132px-Porträt, `h3`, `hp-label`, ein Satz). Eine fünfte Zeile pro Karte stört den Rhythmus des Planblatts, und die Startseite verlinkt ohnehin auf „Über uns". Kleiner Gewinn, größtes Risiko am sichtbarsten Ort.

**Organisatorisch, keine Codeänderung:** Im LinkedIn-Firmenprofil muss im Feld „Website" `https://manibase.de` stehen. Erst der Rückverweis macht aus zwei Seiten eine Entität; ein einseitiger Link ist nur die halbe Verknüpfung.

### Was am Schema noch fehlt

Ergänzt wurden: zweiter Typ `ProfessionalService`, `@id`, `legalName`, `alternateName` („manibase" ohne Rechtsform, gegen die Namenskollision), `sameAs`, `areaServed` (DE, AT, CH), `knowsAbout` mit 9 Themen, `contactPoint`, `identifier` mit HRB 18632, `logo` als `ImageObject` sowie `founder` mit beiden Gründern und deren `sameAs`.

**Zwei Angaben fehlen, weil ich sie nicht erfinden wollte:**

1. **Wikidata-Q-ID.** Es gibt keinen Eintrag. Gehört nach dessen Anlage zusätzlich in `Organization.sameAs` (Maßnahme M8).
2. **`foundingDate`.** Das Datum der Handelsregistereintragung ist mir nicht bekannt.

Dazu neu aufgefallen: **`Person.hasCredential`** für die TÜV-SÜD-Qualifikation beider Gründer wäre die passende Auszeichnung. Siehe Korrektur unten.

### Korrektur zur E-E-A-T-Bewertung

Die erste Fassung führte „keine Zertifikate" als Lücke. **Das war falsch.** `ueber-uns.html` enthält den Abschnitt „Gemeinsame Qualifikation": beide Gründer haben bei der TÜV SÜD Akademie die Qualifikation „AI Strategy & Application Expert" erworben, mit dem Zusatz, dass sie keinen Projektbeleg ersetzt. Ich hatte für diese Seite nur Kennzahlen erhoben und den Fließtext nicht gelesen.

Folge: Authority & Trust von 10 auf 11 von 20, E-E-A-T von 4,0 auf 4,5 von 10, Gesamtnote von 39,5 auf **40,0 von 90**. Am Befund selbst ändert das wenig, an der Aussage „es gibt keinerlei Qualifikationsnachweis" aber schon.

### Achtung bei der nächsten Navigations-Generierung, jetzt durch CI abgesichert

`scratchpad/nav.py` erzeugt Header und Footer. **Der Generator liegt weder im Repo noch auf dieser Maschine**, seine Vorlage lässt sich hier also nicht mitziehen. Ein Lauf mit alter Vorlage würde die Signet-Umstellung aus S4, das kleine Favicon und den LinkedIn-Link zurücknehmen, und im Diff sähe das aus wie ein normaler Generatorlauf.

Weil sich die Ursache nicht beseitigen ließ, ist stattdessen die Wirkung abgefangen: **`scripts/test-frontend.mjs` prüft alle betroffenen Punkte über sämtliche Seiten**, und `verify.yml` führt die Datei bei jedem Pull Request aus. Ein Rückfall macht die CI rot, statt unbemerkt zu deployen. Die Testdatei begründet diese Bauart bereits für zwei ältere Fehler: „Ein Gate, das nur lokal auf Zuruf läuft, fängt genau den Fall nicht ab, der ihn braucht."

Neu abgesichert sind:

| Test | fängt ab |
|---|---|
| Signets als WebP | Rückfall auf die 192 KB PNG |
| Favicon klein, 96px vorhanden | Rückfall auf `signet.png` als Favicon |
| LinkedIn in der Spalte „Unternehmen" | Verlust des Entitätssignals |
| genau ein Canonical je Seite | S6 |
| Open Graph auf indexierbaren Seiten | S7 |
| Sitemap deckt sich mit den indexierbaren Seiten | neue Seite ohne Sitemap-Eintrag |
| robots.txt sperrt keinen KI-Crawler | ein kopierter Standardblock |
| Organization-Schema mit `sameAs`, `founder`, `knowsAbout` … | S5 |
| `rel="me"` genau einmal je Seite, und zwar auf der Firmenseite | Wiedereinführung von `rel="me"` an den Gründerlinks |

Für die Vorlage selbst stehen die vier Zeilen in `CLAUDE.md` im Abschnitt „Navigation".

### Nachbesserungen aus dem Review (Änderungshistorie, bereits umgesetzt)

| Punkt | Änderung |
|---|---|
| `rel="me"` bei den Gründerlinks | **entfernt.** Die Relation bezeichnet laut IANA eine Ressource über den Autor des Link-Kontexts. `ueber-uns.html` ist nicht von einer einzelnen Person verfasst, zwei `rel="me"` auf zwei verschiedene Personen hätten Identitätsdienste in die Irre geführt. Die Zuordnung leistet `Person.sameAs` im JSON-LD. Am Footer-Link auf die **Unternehmens**seite bleibt `rel="me"`, dort ist es korrekt: die eigene Domain verweist auf das eigene Profil. |
| Favicon zu klein | `favicon-96.png` ergänzt, beide Größen mit `sizes` deklariert. Google akzeptiert ab 8×8, empfiehlt aber ein Vielfaches von 48 für die verschiedenen Suchoberflächen. 32px bleibt für den Browser-Tab. Zusammen rund 9 KB gegenüber 132 KB vorher. |

Zwei Fehlannahmen in meinen eigenen neuen Tests sind dabei aufgefallen und korrigiert worden: Die Weiterleitungs-Stubs (`einfuehrungsprojekt.html`, `ki-klartag.html`) tragen bewusst keinen Favicon-Link, und die Lead-Seiten (`infotermin.html`, `interessent.html`) haben eine einzelne Footer-Spalte „Rechtliches", in die ein LinkedIn-Verweis semantisch nicht gehört. Beide Ausnahmen stehen jetzt mit Begründung im Test.

Am Rande aufgefallen: `infotermin.html` und `interessent.html` setzen die Footer-Spaltenköpfe bereits als `<p class="footer__h">`, während der volle Footer `<h2>` verwendet. Der oben unter 3.1 beschriebene Gliederungsfehler ist dort also schon richtig gelöst; die Vorlage könnte sich das abschauen.

### Geprüft nach der Umsetzung

Alle 16 HTML-Dateien: genau ein Canonical je Seite, JSON-LD parst fehlerfrei, HTML-Grundstruktur unversehrt. Lokal im Browser gerendert: beide Signets laden (144×144 und 144×121 natürlich, dargestellt 36×36 wie zuvor, das Seitenverhältnis des Negativ-Signets wurde exakt erhalten), keine Konsolenfehler. `robots.txt` und `sitemap.xml` liefern 200, die Sitemap ist valides XML.

**Nicht geprüft, weil noch nicht live:** die tatsächliche Wirkung auf den mobilen LCP. Die hängt an S3 und lässt sich erst nach der nginx-Änderung messen.
