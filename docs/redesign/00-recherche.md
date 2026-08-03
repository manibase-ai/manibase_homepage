# Redesign-Recherche (August 2026)

Grundlage für das Website-Redesign. Drei parallele Recherchen: Informationsarchitektur
im Wettbewerb, visuelle Stilmittel, Vertrauenspsychologie der Zielgruppe.

Stand: 3. August 2026. Alle Wettbewerbsangaben an diesem Tag abgerufen.

---

## 1. Zahlen, die das Konzept bestimmen

Bitkom Research 2025, n=504 Handwerksunternehmen, telefonisch, KW 23–29/2025,
repräsentativ gewichtet, Fehlerspanne ±4 %. **Befragt wurde jeweils die Geschäftsführung**,
also genau unsere Zielperson.
Quelle: https://www.bitkom.org/sites/main/files/2026-01/bitkom-studienbericht-handwerk.pdf

| Befund | Wert | Konsequenz für die Seite |
|---|---|---|
| Bedenken IT-Sicherheit + Datenschutz | **96 %** | Datenschutz ist Verkaufsargument, nicht Pflichttext |
| „Kein Thema" bei KI | **84 %** | „KI" gehört nicht in die Headline |
| Zu viel zu tun für Digitalisierung | **72 %** | Versprechen muss „ohne Ihr Zutun" lauten |
| Hohe Investitionskosten | **69 %** | Festpreis nennen, Anrechnung betonen |
| „Lohnt nur für größere Betriebe" | **59 %** | „10–20 Mitarbeiter" wörtlich auf die Seite |
| Zweifel an Praxisreife | **57 %** | Prozess überprüfbar beschreiben |
| „Ende traditioneller Handwerkskunst" | **56 %** | keine verspielte Ästhetik |
| Angst vor ständiger Überwachung | **56 %** | Freigabe-Prinzip betonen |
| „KI bestimmt bald, wie wir arbeiten" | **52 %** | Kontrolle beim Betrieb lassen |
| Berührungsängste | **42 %** | Einstiegshürde niedrig halten |
| „KI führt zu Stellenabbau" | **41 %** | Helfer ersetzen niemanden, sie ersetzen Abendarbeit |
| Digitalisierung als Chance | 89 %, Selbstnote nur **3,0** | Grundoffenheit ist da, Zutrauen fehlt |

Kernaussage: Die Barriere ist **Kontrollverlust und Identität**, nicht Technikverständnis.

Ergänzend, älter und nur als Trend: Telekom Digitalisierungsindex Mittelstand 2021/22,
Baugewerbe 53/100 Punkte, Hemmnisse Investitionskosten 35 %, Zeitmangel 28 %.

### Web-Glaubwürdigkeit

- Stanford Web Credibility Project (Fogg, >4.500 Befragte): Nutzer prüfen zuerst das
  **Aussehen**. Wer nicht seriös wirkt, wird verlassen, bevor Inhalt gelesen wird.
- NN/g (Harley 2016), vier Faktoren: Designqualität · **Upfront Disclosure**
  (Kontakt und Kosten sichtbar, keine Formularhürde) · Vollständigkeit und Aktualität ·
  Verbindung zum übrigen Web. Externe Bewertungen wirken stärker als eigene Testimonials.
  https://www.nngroup.com/articles/trustworthy-design/
- NN/g (Loranger 2013): Preis ist der wichtigste Informationsbedarf, auch im B2B.
  Wer ihn verbirgt, wirkt „evasive and untrustworthy".
  https://www.nngroup.com/articles/show-price/

---

## 2. Informationsarchitektur im Wettbewerb

Untersucht und geladen (11): capmo.com/de · plancraft.com/de-de · hero-software.de ·
craftnote.de · 123erfasst.de · openhandwerk.de · meisterwerk.app · cosuno.com ·
sablono.com/de · nevaris.com · moser.de

Nicht mehr existent: ediotool.de und zimmersoft.de (NXDOMAIN), tool-time.de (Domain
steht zum Verkauf), sander-doll.de (dauerhaft 503). Der Markt ist konsolidiert.

### Seitentypen nach Häufigkeit

| Seitentyp | n | Beispiele |
|---|---|---|
| Produkt/Funktionen mit Unterseiten | 11/11 | plancraft, hero, 123erfasst |
| Über uns | 11/11 | alle |
| Blog/Ressourcen/Wissen | 11/11 | 123erfasst „Know-How", capmo „Ressourcen" |
| Referenzen/Kundenstories | 11/11 | hero (Seite je Kunde), plancraft „Erfolgsgeschichten" |
| Karriere | 11/11 | alle |
| Branchen-/Gewerke-Unterseiten | 10/11 | plancraft 18, hero ~26, meisterwerk 21, craftnote 9 |
| Preise als Navigationspunkt | 8/11 | plancraft, craftnote, 123erfasst, meisterwerk |
| Integrationen/Schnittstellen | 8/11 | openhandwerk, moser, 123erfasst |
| Events/Webinare | 8/11 | nevaris, 123erfasst, capmo |
| Support/Hilfe im Menü | 7/11 | craftnote, 123erfasst, hero |
| Login im Header | 9/11 | capmo, hero, craftnote, meisterwerk |

### Dominantes Homepage-Muster (8 von 8 ausgewertet)

```
Hero mit CTA-Paar
  -> Social Proof unmittelbar darunter (Zahl, Logos oder Award)
  -> Nutzen / Problem
  -> 3-5 Funktionsblöcke
  -> Testimonials
  -> Zielgruppen-Segmentierung (Gewerk, Betriebsgröße oder Rolle)
  -> Menschen / Support
  -> FAQ
  -> Abschluss-CTA
  -> Mega-Footer
```

Abweichungen: craftnote zieht Testimonials auf Position 2, noch vor jede Funktion.
meisterwerk blockt den Einstieg mit einem Modal „Sind Sie Handwerker?" — direkte
Parallele zum bestehenden manibase-Wizard, der damit kein Vertrauensbruch ist.
cosuno bricht aus (Marktplatz mit Live-Ausschreibungen statt Feature-Marketing).

### Zwei Segmentierungsachsen

- **Nach Gewerk**: plancraft (18), hero (~26), meisterwerk (21), craftnote (9).
  URL-Muster `/gewerke/elektriker-software`. Hub-Seite plus Einzelseiten.
- **Nach Rolle oder Unternehmenstyp**: capmo („Industrien": GU, Bauherren, Planer),
  nevaris („Ihr Unternehmen / Ihre Rolle / Ihre Herausforderung"), sablono, openhandwerk.

**Capmo, das optische Vorbild, macht selbst keine Gewerke-Seiten.**

Ehrlicher Substanzanteil einer Gewerke-Seite: **30–40 %** wirklich gewerkespezifisch
(Vokabular, ein Testimonial aus dem Gewerk), der Rest ist Boilerplate mit getauschtem
Namen. Echte Differenzierung liefert nur, wer gewerkespezifische Schnittstellen nennt
(hero: DATANORM, IDS Connect, Sonepar; plancraft: DATANORM). Das ist für manibase
derzeit nicht einlösbar, deshalb ist die Rollen-/Größenachse die ehrlichere.

### CTA und Navigation

Zwei Modelle: **Self-Service** („Kostenlos testen" primär, „Demo buchen" sekundär) bei
hero, craftnote, plancraft, meisterwerk, 123erfasst. **Sales-led** („Beratungsgespräch
buchen" primär) bei capmo, openhandwerk, sablono, moser, nevaris.

Immer ein CTA-**Paar**, nie einer allein. 11/11 haben einen CTA im Header.
Negativbeispiel openhandwerk: vier gleichzeitige Hero-CTAs, verwässert.

Für manibase passt das Sales-led-Muster, weil es kein Self-Service-Produkt gibt.

Navigation: 4–7 Top-Level-Punkte (Median 5–6), Mega-Menü bei 10/11, Mega-Footer mit
30–80 Links bei allen.

---

## 3. Visuelle Stilmittel

Alle Werte aus heruntergeladenen Stylesheets, nicht aus Screenshots.
Nicht auswertbar, weil clientseitig gerendert: linear.app, vercel.com, stripe.com.

### Der entscheidende Befund

**Capmo hat auf der gesamten Startseite genau ein farbiges Band.**
7 `<section>`-Elemente: eine mit `bg-neutral-100` (#f4f6f6), eine dunkel
(`.dark-background-section`, #253232, `padding: 5rem 0`), die übrigen **fünf weiß**.

Geschätzter Neutralanteil der Seitenfläche über alle untersuchten Seiten: **85–92 %**.

### Cosuno fährt praktisch die manibase-Palette

| Cosuno | Wert | manibase-Entsprechung |
|---|---|---|
| `--primary` | #001c4b | Tiefblau #14224F |
| `--neon` | #3074eb | Cobalt #2F3FDB |
| `--gold` | #f89c1b | Gelb #F2D414 |
| `--background-light` | #f1f5fa | (Rolle von #F8F4EC) |
| `--background-lighter` | #f8fafc | |
| `--border-light` | #e0e6f0 | |

Auszählung der `background-color`-Deklarationen bei Cosuno: **weiß 63×** gegen
`--background-light` 10× + `--background-lighter` 7× + `--brand` 10×.
Das grelle `--neon` kommt im **gesamten CSS 8×** vor, `--gold` 4×.
Die „farbigen" Sektionen sind 2–4 % gesättigte Tints, auf dem Screen praktisch weiß.

Capmo analog: `var(--green-400)` 16×, `var(--neutral-100)` 26× — die Neutrals werden
häufiger referenziert als die Markenfarbe.

Plancraft gliedert die gesamte Seite mit drei kaum unterscheidbaren Off-Weiß-Tönen:
#f8f8f8 / #f2f1f2 / #f9f9f9.

### Die acht Ruhe-Hebel

1. Überschriften auf `font-weight: 400`. Größe trägt, nicht Fettung.
   Capmo-CSS: **400 → 117×, 500 → 94×, 700 → 35×, 300 → 16×**.
2. Höchstens **ein** eingefärbtes Band pro Seite, dunkel, nahe am Footer.
3. Sektionswechsel über eine Off-Weiß-Treppe mit 1–3 Helligkeitsstufen, nicht über Farbe.
4. Schatten **nie in Schwarz**, sondern in der eigenen Markenfarbe bei 5–15 % Alpha
   und 36–60px Blur. Capmo `7px 7px 36px #cad7d280`, Cosuno `0 4px 10px #001c4b1a`.
5. Markenfarbe nur auf Buttons, Textlinks, Icons.
6. Body-Zeilenhöhe 1.75em (Capmo `p{line-height:1.75em}`).
7. Sektionspolsterung 4–5rem vertikal (Capmo `.section{padding:4rem 0}`).
8. Trennlinien blaugrau getönt statt neutralgrau (Cosuno #d1dcf2, #e0e6f0).

### Karten und Typografie (gemessen)

| | Capmo | Cosuno | Plancraft |
|---|---|---|---|
| Radius | 8px (53×), 4px, 12px | 20px (49×), 8px (19×) | .5/1/1.25/1.5rem |
| Schatten | `7px 7px 36px #cad7d280` | `0 4px 10px #001c4b1a, 0 20px 50px #001c4b0d` | `0 0 0 1px #0000001a, 0 1px 3px #0000001a` |

Capmo-Typoskala: heading-xxl 4.25rem/68px bei **weight 400**, line-height 1.1em ·
heading-xl 3.25rem · heading-l 2.25rem · heading-xs 1.75rem · Body 1rem/1.75em.
Mobil fällt heading-xxl auf 2.75rem. Sprung H1→H2 rund 1,3×, H2→Body rund 2,25×.

### Bildsprache

Muster über alle Seiten: **Produkt-Screenshot + echtes Foto arbeitender Menschen +
monochrome Kundenlogos**. Icons durchgängig schlichte Outline-SVGs.

**Maskottchen: null Treffer auf allen sieben untersuchten Seiten.**
Cosunos 14 „Illustration"-Fundstellen sind ausnahmslos `ReferenceProjectIllustration.svg`,
ein Platzhalter-Thumbnail für Ausschreibungen ohne Bild.

---

## 4. Vertrauen aufbauen

### Trust-Elemente im Wettbewerb (beobachtet)

| Element | plancraft | hero | capmo | craftnote | 123erfasst | meisterwerk |
|---|---|---|---|---|---|---|
| Referenzzahl | 30.000+ | 8.000+ | 100.000+ Projekte | 35.000 | ja | 8.000+ |
| Kundenlogos | ja | – | ja | ja | ja | ja |
| Testimonial Klarname + Foto | ja (10+) | ja | ja | ja (9, + Video) | ja | ja (6) |
| Zahl im Zitat | 8 Std./Woche | – | 75 % Zeitersparnis | – | – | – |
| Bewertungssiegel | Google 4,9 (703), Capterra 5,0, Trustpilot 5,0 | Google 4,8, trusted.de | Capterra, Google | 6.000+ | – | Google 4,8 |
| Presse-Logos | – | Handwerk Magazin | – | – | – | WiWo, Handelsblatt, DHZ |
| DSGVO/GoBD genannt | ja | – | ja | – | ja | ja |
| Server DE explizit | EU implizit | – | – | – | BITMi-Siegel | ja |
| Telefonnummer sichtbar | ja (2) | – | ja | ja | – | ja |
| Supportzeiten genannt | ja | – | ja | ja | – | ja |
| Testphase | 7 Tage | ja | Produkttour | 30 Tage | ja | 14 Tage |
| Preis sichtbar | 47,92–249,90 €/Mon. | nein | nein | nein | „ab 0 €" | „ab 49 €" auf Startseite |
| Geld-zurück-Garantie | nein | nein | nein | nein | nein | nein |
| ISO 27001 / TÜV | nein | nein | nein | nein | nein | nein |
| **Gründer-/Teamfotos** | **nein** | **nein** | **nein** | **nein** | („vom Bau für den Bau") | **nein** |

Standard bei 6/6: Testimonials mit Klarnamen und Foto, Referenzzahl.
Häufig: Bewertungssiegel, Telefonnummer, Testphase.
Selten: sichtbarer Preis, „Server in Deutschland".
**Nirgends besetzt: Gründergesichter, Geld-zurück-Garantie, ISO/TÜV.**

### Beweisführung ohne Referenzkunden, nach Wirkung

1. **Gründer mit Gesicht, Namen, Werdegang.** Im Wettbewerb unbesetzt, deckt das
   Fogg-Kriterium „echte Organisation dahinter". Stärkster Hebel.
2. **Festpreis 1.800 € offen zeigen** plus volle Anrechnung = Risikoumkehr ohne
   Garantieversprechen.
3. **Prozess minutiös beschreiben**: was passiert am Tag, wer ist dabei, was liegt
   abends auf dem Tisch. Schlägt jede Fallstudie, weil überprüfbar.
4. **Datenschutz konkret statt Badge**: Server DE, AVV, benannter DSB, keine
   Google-Fonts. Gegen das 96-%-Hemmnis.
5. **Ergebnis-Garantie**: „Kein verwertbarer Maßnahmenplan? Sie zahlen nicht."
   Legitim, weil selbst erfüllbar.
6. **„Für Betriebe mit 10–20 Mitarbeitern"** wörtlich auf die Seite, gegen die
   59-%-Barriere.
7. Telefonnummer und Gesprächspartner sichtbar, regionale Nähe (Eibelstadt/Würzburg).
8. Referenzen aus früherer Tätigkeit, **nur mit Namensnennung und Einwilligung**.

**Riskant oder unsauber:** erfundene Kundenzahlen; anonyme „ein Bauunternehmer aus
Bayern"-Testimonials; gekaufte Siegel; „über 100 Projekte" aus dem Vorleben ohne Beleg;
Fake-Bewertungssterne.

### Sprache

| Statt | Besser |
|---|---|
| KI-Helfer, KI-Agent | Ihr Büro-Rückhalt, „übernimmt das Schreiben" |
| automatisiert | „schreibt vor, Sie geben frei" |
| Lösung, Plattform, Tool | Angebot, Bericht, E-Mail |
| Digitalisierung | weniger Papierkram |
| Potenzialanalyse | „Wir schauen uns einen Tag Ihren Bürokram an" |
| skalierbar, effizient | „zwei Abende pro Woche zurück" |
| Onboarding | „wir richten es ein" |

Der bestehende Claim **„Holen Sie sich Ihre Abende zurück" ist genau richtig** und bleibt.

### Erster Eindruck, Sekunden 0 bis 5

- Echte Menschen und echte Baustelle statt Stockfoto-Abstraktion, Gesicht above the fold
- Telefonnummer im Header, klickbar (fehlt bei hero und 123erfasst)
- Ortsangabe sichtbar
- Preis und Dauer ohne Scrollen erkennbar
- keine Tippfehler, keine toten Links
- kein Formular vor der Information
- ein einziger, wörtlich benannter CTA („15 Minuten telefonieren", nicht „Jetzt durchstarten")

---

## 5. Widerspruch zwischen den Recherchen: die Maskottchen

**Position A (Informationsarchitektur):** KI ist 2026 bei allen Anbietern eine Sektion,
nicht die Positionierung. Wer KI als Kern verkauft, muss sie konkret machen, und
benannte Assistenten mit klarer Aufgabe leisten genau das.

**Position B (Vertrauenspsychologie):** eher schädlich in der aktuellen Rolle.
(a) Kein einziger der sechs Wettbewerber setzt Maskottchen ein, die Konvention der
Kategorie ist Realismus. (b) Menschliche Vornamen für Software, die Büroarbeit
übernimmt, adressiert direkt die 41 % Stellenabbau-Angst. (c) Comictiere lesen sich als
Consumer-Format und kollidieren mit Fogg sowie mit der 57-%-Skepsis gegenüber
Praxisreife. (d) 56 % fürchten das „Ende traditioneller Handwerkskunst", verspielte
Ästhetik verstärkt das Gefühl, nicht ernst genommen zu werden.

**Auflösung:** Die Positionen widersprechen sich nur scheinbar. Position A verlangt,
die KI **nach Aufgabe** konkret zu machen. Position B warnt vor der **Personifizierung
mit menschlichem Vornamen** und vor dem **Cartoon-Stil**. Beides ist erfüllbar:
Funktion konkret benennen („schreibt Ihre Angebote vor"), auf Vornamen und bunte
Tierillustration im Erstkontakt verzichten.

Position B stützt sich auf gemessene Daten, Position A auf eine Ableitung.
Im Zweifel wiegt B schwerer. Entscheidung liegt beim Kunden (die Figuren wurden
vom Kunden geliefert).

---

## 6. Übertragung auf manibase

### Ist-Zustand: fünf vollflächige dunkle oder farbige Bänder

| Element | Fläche |
|---|---|
| Hero | dunkles Foto mit Tiefblau-Duotone |
| `.folge` | Cobalt (`--color-primary`) |
| `.ctaband` / Gründer-Band | Tiefblau (`--color-ink`) |
| `.newsletter` | Cobalt |
| Footer | Tiefblau |

Zum Vergleich: Capmo hat eines.

### Ziel-Farbverteilung

Aus **60/30/10** wird **88/6/5/1**.

| Farbe | Neue Rolle | Fläche |
|---|---|---|
| #F8F4EC + Weiß | **Leinwand**, nicht mehr Band. Dazu #FCFAF5 und #F2ECE0 als warme Off-Weiß-Treppe | ~88 % |
| #14224F | Fließtext und Überschriften statt Schwarz. Ein dunkles Band vor dem Footer. Zusätzlich als Schattenton | ~6 % |
| #2F3FDB | Nur Buttonfläche, Link, Icon-Strich, Häkchen, aktiver Zustand. Keine Cobalt-Sektion mehr | ~5 % |
| #F2D414 | Einmal pro **Seite** statt einmal pro Screen. Als Buttonfläche entfällt es | ~1 % |

Die Golden Yellow Rule bleibt technisch gültig, nur die Frequenz sinkt.

### Startwerte

```
Karten-Radius     8-12px
Karten-Padding    1.5-2rem
Sektionspolster   4-5rem
Rahmen            1px solid #E8E2D6
Schatten          0 4px 10px rgba(20,34,79,.10), 0 20px 50px rgba(20,34,79,.05)
H1                clamp(2.75rem, ..., 4.25rem), Sora 400 statt 600/700
Body              1rem / line-height 1.75
Haarlinie         #DCE0F7
```

Größter Einzelgewinn: die drei Cobalt-/Tiefblau-Vollflächen (`.folge`, Gründer-Band,
`.newsletter`) auf höchstens eine reduzieren. Das allein bringt die Farbfläche von
grob 30 % auf unter 10 % und ist die wörtliche Erfüllung von „keine riesigen
Farbflächen mehr".

---

## 7. Was unberührt bleibt

Auf Kundenwunsch: `impressum.html`, `datenschutz.html`, die PHP-Proxys unter
`site/api/` und alles rund um Sicherheit. Inhaltlich unverändert; falls Klassen
umbenannt werden, nur die Optik nachziehen, nie den Text.
