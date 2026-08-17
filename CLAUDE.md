# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# manibase · Website

Statische Marketing-Website für **manibase UG (haftungsbeschränkt)**.
Quelltext liegt in `site/`. Kein Build, kein Framework: reines HTML/CSS/JS.

> **Stand 14. August 2026: Relaunch umgesetzt.** Die Startseite ist neu gebaut (Werkplansatz, echte Bilder, Reifegrade, Buchungsstrecke). Verbindlicher Auftrag: `docs/relaunch/06-metaprompt-finale-startseite.md`. Inhaltliche Referenz: `START-HERE-STARTSEITENSTRATEGIE.md`. Alles darunter, was der Strategie widerspricht, ist historisch.

## Was die Firma macht (Positionierung, Stand August 2026)
- **Kategorie:** strukturierte KI-Einführung für **Bauunternehmen, ausführende Gewerke und Planungsbüros**. Die Branche steht ausdrücklich auf dem Markenschild (frühere Anweisung „branchenoffen" ist zurückgezogen).
- **Zielkunde:** Bauunternehmen, ausführende Gewerke (SHK, Elektro, Lüftung, Dach, Ausbau), Architektur-, Ingenieur- und Planungsbüros, etwa 50 bis 500 Mitarbeitende (Größe kaufmännisch noch zu bestätigen).
- **Dritte Zielgruppe „Gebäudetechnik & Ausbau" (Vorgabe der Geschäftsführung, 16.08.2026).** Grund: Ein 60- bis 100-Mann-Betrieb aus SHK, Elektro oder Dach fand auf der Seite kein Wort, das ihn meint, obwohl das Relaunch-Briefing „größere ausführende Bau- und Handwerksunternehmen" längst als Zielgruppe führt. **Reihenfolge überall gleich: Bauunternehmen → ausführende Gewerke → Planungsbüros.** Begründung: Wer eine Aufzählung scannt, steigt beim ersten Nein aus; die neue Gruppe steht deshalb nicht am Ende. **Benennung ist gesetzt:** Im Menü „Gebäudetechnik & Ausbau", weil sich ein Betrieb dieser Größe selbst so nennt und nicht „Handwerksbetrieb". Das Wort **„Handwerk" gehört in Title-Tags und Meta-Angaben** (dort liegt der Suchwert), **nicht ins Menü** (dort zieht es die kleinen inhabergeführten Betriebe an, die das Briefing ausschließt). Kurzform der Dachzeile in Titeln: „Bau, Handwerk und Planung"; Langform in Kicker, Footer-Claim, Meta-Description und Schema: „Bauunternehmen, ausführende Gewerke und Planungsbüros".
- **Modulares Angebot statt Projektlaufzeit:** Klartag als verpflichtender Einstieg, danach kontrollierter KI-Arbeitsplatz (OpenWebUI-basiert oder Microsoft 365), Automatisierungen (im Plattformweg oder standalone n8n) und vorbereitete KI-Helfer. Governance, Schulung und Übergabe gehören zur Einführung.
- **Klartag:** ein gemeinsamer Arbeitstag, **3.900 € netto**, bei Folgeprojekt vollständig anrechenbar. Die alten 1.800 € und die Sechsmonatslogik mit „mindestens drei Anwendungen" sind zurückgezogen.
- **KI-Helfer und Reifegrade** (Vorgabe der Geschäftsführung, 14. August 2026): **Bernd** Baudokumentation = grün, im Einsatz · **Willy** Wissensmanager = gelb, in Pilotierung · **Anton** Angebotsassistenz = rot, Entwicklung steht an. Anton darf nicht als buchbar dargestellt werden; die Karte sagt das seit 16.08.2026 in der Fußzeile („Stand · In Entwicklung, derzeit nicht buchbar") und im Konjunktiv des Beschreibungssatzes („Soll … sichten"). Die früheren dreizeiligen Datenblattfelder („Vorgesehener Eingang" und so weiter) sind entfallen: **eine Karte trägt Porträt, Rollenzeile, Name, Ampel, einen Beschreibungssatz und eine Fußzeile, mehr nicht.** Grund: Geschäftsführung, 16.08.2026, „weniger kleine Textbausteine, liest keiner durch".
- **Haupt-CTA:** **Kontakt aufnehmen** → `#termin` (16.08.2026 umbenannt, vorher „Passung klären“). Termin-Sektion: erst Qualifizierungs-Maske, dann Zeeg-Kalender.
- **Kein Proof-Abschnitt.** Keine Cases, Logos oder Kennzahlen, solange nichts freigegeben ist. Die Lücke darf nicht durch fiktive Oberflächen oder Micro-Cases verdeckt werden.

## Designsystem-Herkunft
- Vollständiges Brand Kit liegt in `Claude Design/` (Skill `manibase-design`): Tokens, Logos, Fonts, fertige JSX-Website-Komponenten. **Single Source of Truth der Tokens:** `Claude Design/colors_and_type.css`.
- Für die Live-Seite übernommen nach `site/styles/tokens.css` — einzige Änderung: **Fonts selbst gehostet** (DSGVO), nicht über Google-CDN.

## Marken-Regeln (nicht verhandelbar)
- **Farben:** warme Leinwand `#F8F4EC`, Cobalt `#2F3FDB` macht die lesbare Arbeit (Text/Links/Primärbutton), Tiefblau `#14224F` für dunkle Bänder/Footer (nie Schwarz).
- **Golden Yellow Rule:** Gelb `#F2D414` ist NUR Fläche mit dunklem Text drauf ODER Akzent auf Dunkel. Nie gelber Text auf Hell, nie dünne gelbe Linie. Eine Gelb-Geste pro Screen.
- **60/30/10:** ~60 % warme Neutrals, ~30 % Cobalt, ~10 % Gelb.
- **Schrift:** Sora (Display/Zahlen), Hanken Grotesk (Body), JetBrains Mono NUR für Zahlen/Preise/Maße. Manrope liegt bei, wird aktuell nicht genutzt.
- **Kleine Überschriften (Eyebrow, Kicker, Blattkopf, Footer-Spalten):** eine einzige Stufe für die ganze Seite, Vorgabe der Geschäftsführung vom 15.08.2026. Werte stehen in `tokens.css` als `--t-eyebrow` (0.875 rem) und `--ls-eyebrow` (0.14 em), Schrift ist Hanken Grotesk 600 in Versalien. Betroffen sind `.eyebrow`, `.phero__kicker`, `.footer__h`, `.hp-kicker`, `.hp-label`, `.hp-sheet`, `.hp-mod__tag`, die Beschriftungen der Systemschnitt-Spalten und „Legende". Wer eine neue kleine Überschrift baut, nimmt diese Tokens und keine eigene Größe. **Abgrenzung:** Feldnamen, Nummern, Stempel und Bildunterschriften in den Plan-Bausteinen (`.hp-datenblatt dt`, `.hp-chain dt`, `.hp-status`, `.hp-stamp`, `.hp-legende`-Nummern, `.hp-shot figcaption b`) bleiben JetBrains Mono, das ist die Zeichnungssprache und keine Überschrift.
- **Wortmarke:** „mani"(cobalt) + „base"(ink/auf-dunkel: paper) + gelber Punkt. In CSS gerendert (`.wordmark`), nicht als SVG (gelieferte SVGs sind leere `<image>`-Hüllen). **Punkt-Proportion aus Original-Logo gemessen** (`Claude Design/assets/manibase-logo-yellow.png`): Punkt ≈ 0.2em, Unterkante auf der Grundlinie (`.dot{width:.2em;height:.2em;align-self:baseline}`) — NICHT größer/schwebend. Inline im Fließtext via `.wordmark--inline` (erbt Schriftgröße).
- **KI-Helfer „Unsere Helden"** (illustrierte Maskottchen, vom Kunden geliefert in `Bilder/`, optimiert nach `site/assets/helfer-*.webp`): **Anton** Angebotsmanager (Dachs) · **Emma** E-Mail-Assistenz (Biene) · **Doreen** Dokumentationshilfe (Eichhörnchen) · **Wiktor** Wissensmanager (Eule). Auf der Seite als **heller, zentrierter Balken** (`.heroes__grid` = Flex mit `justify-content:safe center` + `scroll-snap`, **kein** Tiefblau-Hintergrund mehr; Desktop alle Karten nebeneinander, Mobil/Überlauf horizontal swipebar — skaliert für künftig mehr Helfer). Hover/Tap blendet Info-Bereich von unten ein, Hintergrund **Cobalt** + weiße Schrift (wie Primärbutton „Gespräch buchen"). Überschrift „Unsere **Helden**" mit gelbem `.mark` auf hellem Grund (Überschrift dunkel, Intro sekundär). Texte in **Sie** (Kunde hatte „du" geliefert, auf Sie vereinheitlicht). Alte Namen (Mailo/Kalla/Pia/Doku) ersetzt.

## Copy-Regeln (= weg vom AI-Look)
- **Keine Gedankenstriche (—) im Text.** Komma, Doppelpunkt, Punkt, Klammern.
- Keine Buzzwords (streamline, empower, seamless, nahtlos, revolutionär …). Konkretes Substantiv + Verb.
- Sie-Ansprache. Button-Labels = Verb + Objekt.
- Keine Eyebrow über jeder Sektion, keine „01/02/03"-Marker als Default-Gerüst, keine identischen Card-Grids.

## Seitenbreite und Seitenkopf (16.08.2026 vereinheitlicht)
- **Eine Breite fuer alle Seiten.** `.container` in `site.css` rechnet `width:min(100% - 48px,var(--container))` bei `padding-inline:0`; ab 940px Rinne 40px, ab 700px 32px. Der Rand entsteht also aus der Breite, nicht aus Innenabstand. Vorher hatte nur die Startseite diese Formel (als `.hp-home .container` in `home.css`), alle Unterseiten liefen ueber `max-width` plus `padding-inline` und standen dadurch ab etwa 1300px Fensterbreite rund 48px schmaler. Die Sonderregeln in `home.css` sind entfernt, es gibt die Formel nur noch einmal.
- **Merkmal beim Aendern:** unterhalb von etwa 1300px sind beide Rechenwege deckungsgleich. Ein Breitenfehler zeigt sich also nur am grossen Monitor, im Zweifel dort messen und nicht bei 1024.
- **Ein Raster fuer alle Seitenkoepfe:** `.hp-hero`, `.phero` (site.css) und `.page-hero` (seiten.css) zeichnen dieselbe Flaeche, vollflaechig 44px mit nach unten auslaufender Maske, Rasterfarbe `--hp-grid` (steht jetzt in `site.css` `:root`, nicht mehr in `.hp-home`). Entfallen sind das frueher nur rechts liegende 30px-Raster (`inset:0 0 0 62%`), der Kreis in `.phero::after` und die zugehoerigen Media-Query-Verschiebungen. Bei `page-hero--split` (klartag, fuer-ihre-it) laeuft das Raster unter dem Foto durch; das Foto ist deckend und schneidet sich seinen Teil selbst frei. **Einzige Ausnahme bleibt der KI-Helfer-Kopf** (`helper-hero`, ki-helfer.html) mit seiner eigenen Phase-3-Textur.

## Dateistruktur
```
site/
  index.html            Startseite als Werkplansatz. Reihenfolge: Hero(reiner Textkopf, kein Bild) · Blatt 01 Arbeitssituationen(#arbeitssituationen, 3 Zeilen Bild+Kette im Wechsel) · Blatt 02 System(Tiefblau, Schnittzeichnung) · Module(#module, Bento) · KI-Helfer(#helfer, Datenblätter mit Ampel) · Time-to-Value(Maßkette) · Governance(Cobalt) · Blatt 03 Klartag(#klartag, Bildband + gelbes Leistungsblatt) · Blatt 04 Architektur(#architektur) · Team(#team) · Übergang(#kontakt, Tiefblau) · Buchung(#termin: Qualifizierungs-Maske → Zeeg) · Footer.
                        **Fünf Blattköpfe** (01 Situationen, 02 System, 03 Klartag, 04 Architektur, 05 Ihre Ansprechpartner), bewusst nicht vor jedem Abschnitt. Blatt 05 auf Vorgabe der Geschäftsführung vom 16.08.2026 ergänzt.
                        **Blatt 04 trägt seit 16.08.2026 vier Wege** (A Eigene Firmen-KI · B Microsoft 365 Copilot · C n8n als eigener Dienst · D KI-Helfer-Software) und darunter das Tiefblau-Band `.hp-souveraen`: „Alles außer Microsoft 365 läuft in Ihrer privaten Cloud." Das Band ersetzt die frühere graue Fußnote `.hp-arch-note` (CSS entfernt). Gelb liegt dort nur auf der Dachzeile „Datenhoheit"; der Link darunter ist weiß mit Unterstrich, damit es bei einer Gelb-Geste pro Band bleibt. Inline `<script>…className+=' js'</script>` im head ist zwingend, sonst blitzen die Maskenschritte beim Laden auf.
  klartag.html          Leistungsseite Klartag, 3.900 € netto. **Seitenkopf aus Phase 3 zurückgeholt** (15.08.2026): `page-hero--split` mit Stockfoto (Unsplash, Nachweis im Bild).
  fuer-ihre-it.html     Technische Vertiefung, verlinkt aus Blatt 04. **Aus Phase 3 zurückgeholt** (15.08.2026): Seitenkopf mit Foto plus dunkles Band „Zwei Architekturwege“ (`section--ink`).
  ueber-uns.html        Gründer und Verantwortung. Abschnitt „Die Gründer“ ist seit 15.08.2026 wieder 1:1 der Phase-3-Stand (`founders-teaser` mit `person-card`).
  baugewerbe.html       Zielgruppenseite Bauunternehmen (14.08.2026 aus Phase 3 zurückgeholt).
  gebaeudetechnik-ausbau.html  Zielgruppenseite ausführende Gewerke (16.08.2026 neu): SHK, Elektro, Lüftung, Dach, Ausbau. Aufbau 1:1 wie baugewerbe.html, nur mit Gewerke-Vokabular (Herstellerunterlagen, Regiebericht, Wartungsprotokoll, Aufmaß, Nachtrag). Gelb-Geste sitzt auf einem Wort („Gebäudetechnik"), nicht auf zwei: eine längere Markierung bricht in der h-hero um und macht daraus zwei Gelb-Flächen.
  planungsbueros.html   Zielgruppenseite Architektur/Ingenieur/TGA (dito).
  firmen-ki.html        **Kernangebot**: Einführung der eigenen KI-Umgebung. Aus dem Phase-3-Einführungsprojekt, aber OHNE Sechsmonats-Klammer und ohne „mindestens drei Anwendungen": die Dauer folgt Umfang und Systemlandschaft. Vorgabe der Geschäftsführung, 14.08.2026.
  prozessautomatisierung.html · ki-helfer.html  Wieder echte Inhaltsseiten (vorher Redirect-Stubs).
                        ki-helfer.html trägt seit 15.08.2026 wieder den Phase-3-Seitenkopf (`helper-hero` mit Foto und wechselndem Wort) und die Sektion „Ein Blick ins Produkt“ mit dem Cockpit-Screenshot.
  einfuehrungsprojekt.html  Redirect auf firmen-ki.html (Umbenennung), noindex.
  ki-klartag.html       Redirect-Stub alter URL, noindex.
  blog/index.html       Blog-Übersicht. Relative Pfade ../.
  blog/papierkram-am-chef.html  Archiviert, leitet auf ../index.html#arbeitssituationen weiter.
  impressum.html        § 5 DDG (Daten gesetzt, HRB 18632)
  datenschutz.html      DSGVO, 10 Abschnitte: 5=Anfrage-/Buchungsformular, 6=Zeeg, 7=Newsletter (Double-Opt-In).
  styles/tokens.css     Marken-Tokens (@import ../fonts/_fontface.css)
  styles/site.css       Basis-Layout und geteilte Komponenten (+ `[hidden]{display:none!important}`, .wizard/.qcard/.field/.cal, .blog/.postcard/.post)
  styles/seiten.css     Bausteine der Unterseiten, 15.08.2026 aus Phase 3 zurückgeholt: `page-hero(--split)`, `photo-figure`/`photo-credit`, `section--ink` mit `data-split`, `founders-teaser`/`person-card`, `helper-hero` mit `helper-rotator`, `helper-showcase`/`cockpit-frame`. Eingebunden auf klartag, fuer-ihre-it, ueber-uns und ki-helfer.
  styles/home.css       **Nur Startseite.** Werkplansatz-Schicht mit `hp-`-Präfix: Blattköpfe, Systemschnitt, Bento, Datenblätter, Maßkette, Bildbausteine, Reifegrad-Ampel. Body trägt `class="hp-home"`.
  scripts/kinetic-grid.js  Kinetic Grid (siehe eigenen Abschnitt). Eingebunden auf allen Seiten mit Seitenkopf: index, baugewerbe, gebaeudetechnik-ausbau, planungsbueros, firmen-ki, prozessautomatisierung, klartag, fuer-ihre-it und ueber-uns.
  scripts/site.js       Reveal + Wortwechsel im KI-Helfer-Kopf (`[data-helper-rotator]`) + Qualifizierungs-Maske (Wizard, 5 Schritte, Auto-Advance mit 260 ms Sperre) + `loadBookingCalendar()` (Zeeg on-demand, einziger Wechselpunkt für das Buchungstool).
  fonts/                Self-hosted woff2 (Sora, Hanken Grotesk, JetBrains Mono) + _fontface.css
  assets/               signet.png · signet-negative.png · signet-180.png · wortmarke.png · og-manibase.jpg
                        hero-plan-{1000,1600}.webp · hero-plan-hoch-{600,900}.webp
                        sit-wissen-* · sit-doku-* · sit-angebot-* · klartag-raum-* (je 700 und 1200)
                        helfer-willy-{160,320}.webp (freigestellt) · matthias.jpg · nikolaus.webp
```

## Kinetic Grid (`scripts/kinetic-grid.js`)
Das Bauplanraster liegt auf einer Canvas statt als CSS-Hintergrund: es zieht sich zum Zeiger und wirft beim Klick eine auslaufende Welle. Keine Punkte, nur Linien.

- Einbau nur über Attribute, kein zusätzliches Markup: `data-kinetic="cobalt|weiss|gelb"`, dazu `data-kinetic-axis="x"` für Bänder, deren Raster rechts neben dem Text sitzt (Vorgabe ist der senkrechte Verlauf `y`).
- **Textschutz:** `data-kinetic-guard="<Selektor>"` plus `data-kinetic-schutz="0.35"` dämpft das Leuchten über Fliesstext. Ohne das schneiden die Linien durch die Zeilen, besonders die gelbe Fassung.
- **Werte sind gesetzt** (Vorgabe der Geschäftsführung, 15.08.2026): Rasterweite 50, Einflussradius 240, Zug zum Zeiger 1, Leuchtkraft 0.5. Der Zug von 1 bedeutet: das Raster bleibt gerade, der Zeiger schaltet nur ein Leuchtfeld an. Verformung gibt es allein bei der Klick-Welle.
- Der Verlauf steckt in der Zeichnung (`fadeBase`/`fadeGlow`), **nicht** in einer CSS-Maske: eine Maske würde auch das Leuchten wegnehmen.
- `.kg-host::before{display:none!important}` in `site.css` blendet das statische CSS-Raster des Bandes aus, sobald die Leinwand läuft. Bei `prefers-reduced-motion` startet das Skript nicht, dann bleibt das CSS-Raster stehen.
- Im Einsatz: Startseite (Hero cobalt, Governance-Band weiss, Abschlussband gelb), sowie **alle Seitenköpfe** (baugewerbe, gebaeudetechnik-ausbau, planungsbueros, firmen-ki, prozessautomatisierung, ueber-uns, klartag, fuer-ihre-it) einheitlich mit `data-kinetic="cobalt"`, Vorgabe-Achse y und `data-kinetic-guard=".h-hero, .lead"`. Der KI-Helfer-Kopf behält seine eigene Phase-3-Textur.
- **Achse folgt dem CSS-Auslauf, nicht dem Geschmack:** die Rastermaske verläuft nach unten, deshalb steht überall Achse y. ueber-uns, klartag und fuer-ihre-it liefen bis 16.08.2026 auf x und fielen dadurch aus der Reihe.

## Bildregeln
- **Kurswechsel 15.08.2026 (Geschäftsführung): Stockfotos sind wieder erwünscht.** Wörtlich: „Ich habe es satt, KI-Fotos zu haben.“ Die Seitenköpfe von klartag und fuer-ihre-it tragen deshalb wieder die Unsplash-Fotos aus Phase 3 samt Bildnachweis im Bild (`.photo-credit`). Die folgenden Regeln gelten weiter für die verbliebenen KI-Bilder, nicht als Verbot von Stockmaterial.
- Alle KI-Inhaltsbilder sind **KI-generiert** und tragen sichtbar „KI-generierte Illustration" in der Bildunterschrift plus beschreibenden Alternativtext.
- **Kein lesbarer Text im Bild.** Dokumentinhalte werden zu grauen Balken abstrahiert. Keine erfundenen Firmennamen, Adressen, Personennamen, Projektnummern oder Summen: das wäre simulierter Kundenbeleg und ist verboten.
- **Keine KI-generierten Menschen.** Echte Fotos gibt es nur von den Gründern.
- Register ist Architektur-Rendering, nicht Stockfoto-Realismus. Gelb erscheint im Bild höchstens als physischer Gegenstand (Zimmermannsstift).
- Aufbereitung: `docs/research/2026-08-14-bildbriefing-ki-generiert.md`, Prompts in `docs/research/bildprompts-zum-einpflegen.md`. Rohdateien und verworfene Fassungen liegen in `incoming/` (nicht ausgeliefert).
- **Erledigt (14.08.2026):** Alle drei Avatare liegen vor und stehen in den Datenblättern. Quellen im Projektstamm (`Anton_Angebotsassistenz (1).png`, `Bernd_Baudokuhelfer (2) (1).png`, `Willy WIssensmanager.png`), aufbereitet nach `helfer-{bernd,willy,anton}-{320,640}.webp`: Alpha-Reste unter 12 hart auf 0, auf Inhalt zugeschnitten, quadratisch gefüllt. Dargestellt im `.hp-datenblatt__portrait` (Rasterfeld über dem Kopf), Breite `clamp(150px,15vw,210px)`. **Antons Avatar ist entsättigt** (`.hp-datenblatt--plan`, `saturate(.5)/opacity(.75)`), damit der rote Reifegrad auch im Bild trägt und er nicht wie ein fertiges Produkt aussieht.

## Impeccable (de-AI-Pass)
- Installiert in `.claude/skills/impeccable`. Skill: `/impeccable <command>`.
- Deterministischer Scan: `npx impeccable detect site/index.html site/styles/site.css …`
- **Bekannte/akzeptierte Flags:** `cream-palette` (= committete Marken-Leinwand, identity-preservation; nur ändern, wenn der Kunde es will). Cramped-padding-Flags auf Full-Bleed-Sektionen sind großteils Limitierungen der statischen Analyse (Inset kommt von `.container`).

## Firmen-/Rechtsdaten (Stand: gesetzt)
- **Anbieter:** manibase UG (haftungsbeschränkt), Würzburger Str. 1, 97246 Eibelstadt. Die Gründungsphase ist abgeschlossen; „i. G." darf nicht mehr verwendet werden.
- **GF:** Matthias Geisler und Nikolaus Schauersberger. Inhaltlich verantwortlich (§ 18 MStV): Matthias Geisler.
- **Kontakt:** Tel. +49 15565 697065, E-Mail `kontakt@manibase.de` — überall konsistent verwenden, insbesondere in Impressum, Datenschutz, Formular-Fallbacks und Mailvorlagen.
- **Register:** Eingetragen beim **Amtsgericht Würzburg**, **HRB 18632**.
- **USt-IdNr.:** noch keine → Block im Impressum entfernt; bei Erhalt wieder einsetzen (§ 27a UStG).
- **Datenschutz (gesetzt):** Hosting = **ALL-INKL.COM – Neue Medien Münnich** (Server DE; Domain bei united-domains gekauft, Transfer zu All-Inkl geplant). Externer **DSB = DSZ365**; im Datenschutz über die Firmenadresse + `kontakt@manibase.de` (Stichwort „Datenschutz") erreichbar gemacht — rechtlich zulässig, keine benannte Person nötig (Art. 37 Abs. 7 DSGVO). Kein Buchungstool → Abschnitt „Terminvereinbarung" auf E-Mail/Telefon gestellt. Schriften lokal (kein Google). Stand: 5. Juni 2026. **Keine `.ph`-Platzhalter mehr auf der Seite.**

## Offene Punkte / TODO
- [ ] **Formulare sind Frontend-only (kein Backend!).** Newsletter + Qualifizierungs-Maske zeigen nur Erfolgs-/Bestätigungstexte, senden aber NICHTS. **Vor Live-Gang Versand-Backend anbinden**, sonst sind die „Bestätigungs-Mail"-Hinweise irreführend. Antworten der Maske stehen als `FormData` bereit (auskommentiert in site.js).
- [ ] **Buchungstool-Entscheidung Calendly ⇄ Zeeg** (Kunde unentschieden; Calendly DSGVO-kritisch + landet im Spam). Wechsel nur an EINER Stelle nötig: `loadBookingCalendar()` in site.js + `data-cal-url`/Fallback-Link in `#booking-calendar`. Bei Zeeg Datenschutz-Abschnitt 6 ersetzen.
- [x] Nach HR-Eintragung: **HRB 18632** im Impressum ergänzt und „i. G." aus den aktuellen Website- und Kommunikationsinhalten entfernt.
- [ ] Optional: falls DSZ365 eine eigene Direktadresse/-Mail veröffentlicht haben will, im Datenschutz-Abschnitt 2 ersetzen (aktuell über Firmenadresse geroutet).
- [ ] AVV mit ALL-INKL tatsächlich abschließen (in Datenschutz bereits als bestehend formuliert). Falls Seite vor dem Transfer woanders live geht, Hoster-Abschnitt anpassen.
- [x] **Termin-Sektion `#termin` = Qualifizierungs-Maske (Wizard) → dann Kalender** (Vorbild nextstrategy.ai). 5 Schritte (Unternehmensgröße / Rolle / Wo brennt's [Mehrfach] / Dringlichkeit / Kontakt+Consent), Auswahlkarten `.qcard` (`:has(input:checked)`), Einfach-Auswahl mit Auto-Advance (an `click`, nicht `change`, damit Pfeiltasten frei navigieren). Erst nach Abschluss **+ Consent** wird der Kalender geladen → **entschärft den alten DSGVO-Punkt** (keine US-Verbindung vor Einwilligung). Calendly via `initInlineWidget` on-demand. Booking-Sektion hell (`--color-surface-sunken`), getrennt vom Footer. **Offen: DPA mit Calendly** (.ph) + Tool-Entscheidung (s. o.).
- [x] **Newsletter-Band** (`.newsletter`, Cobalt, gelber „Anmelden"-Button = Akzent auf Dunkel). Double-Opt-In-Hinweis. POST an `/api/newsletter.php`.
- [x] **„So funktioniert unsere KI-Hilfe"** (`#hilfe`, nach Helden): 3 `.steps` (Abläufe kennenlernen → Helfer bauen → freigeben & dranbleiben), Hintergrund `--color-surface-sunken` für Rhythmus.
- [x] **KI-Klartag-Landingpage** (`ki-klartag.html`, noindex) + **Blog** (`blog/index.html` + 1 Beitrag). Beide Marken-konform, reuse vorhandener Komponenten.
- [x] Header: Signet + Wortmarke links, Menü rechts (Sulista-Layout). Helfer-Sektion „Unsere Helden" mit 4 Avatar-Karten (swipebar, Hover-Info). Funnel-CTAs überall → Orientierungsgespräch (#termin).
- [x] Hero: vollflächiges Foto („Hände bei der Arbeit", Notizbuch/Laptop) mit Tiefblau-Duotone-Tönung (Cobalt-Glow + feines Bauplan-Raster), helle Headline, gelbe Gelb-Geste auf „Abende", gelber Primär-CTA. Vorbild Aufbau: sulista.ch (Kundenwunsch). Body-Sektionen bleiben Creme.
- [x] Gründer-Abschnitt „Wer hinter manibase steht" (id="team", nach „Was wir übernehmen", vor KI-Klartag): zwei Karten (Matthias = Monogramm „MG" / Nikolaus = echtes Foto), darunter aufgewertetes Cobalt-Band „Was uns ausmacht" (`.founders__label` Mono-Label + Tick / `.founders__claim` Display-Aussage **über volle Bandbreite**, zwei Stärken fett, Schatten + Radial-Glow für Tiefe). Intro: „Kein anonymer Anbieter." (nicht „Agentur"). **Überschrift rendert „manibase" als Inline-Wortmarke** (`.wordmark.wordmark--inline`, erbt Schriftgröße; mani cobalt/base ink/gelber Punkt, kein Signet). Bios faktenbasiert (Nikolaus aus schauersberger.com). **Matthias-Headshot fehlt noch** → `.founder__photo--mono` durch `<img>` ersetzen, sobald Foto da.
- [x] Wertband unter Hero (`.valueband`, 4 Werte: 1.800 € Festpreis · 1 Tag · voll anrechenbar · DSGVO). Ehrlich, keine erfundenen Kundenzahlen.
- [x] Prozess-Abschnitt „So läuft ein KI-Klartag" (`#ablauf`, 4 nummerierte Schritte mit gestricheltem Verbinder), direkt vor dem KI-Klartag-Angebot. Hero-Button „So läuft ein Klartag" → #ablauf.
- [x] Matthias-Foto eingesetzt (assets/matthias.jpg, aus Bilder/Headshot.jpg quadratisch zugeschnitten). Beide Gründer mit echtem Foto.

## Navigation
Überall gleich, Aufklappmenü wie in Phase 3 (14. August 2026 wiederhergestellt):

- **Startseite**
- **Zielgruppen** ▾ → Baugewerbe · Gebäudetechnik &amp; Ausbau · Planungsbüros

  Seit 16.08.2026 drei Einträge, Reihenfolge gesetzt (siehe oben). Das Dropdown ist deshalb **einspaltig**: `.nav__dropdown--small .nav__dropdown-grid{grid-template-columns:1fr}`. Im 380px breiten Zweispalter reißen die Beschreibungszeilen bei drei Einträgen auseinander und der dritte steht allein in der letzten Reihe.
- **KI-Einführung** ▾ → **Der Einstieg: Unser Klartag** (oben links, „Klartag" mit Textmarker `.mark`) · Firmen-KI · Prozessautomation · Individuelle KI-Helfer

  Reihenfolge ist gesetzt: Der Einstieg steht zuerst, also oben links im 2×2-Raster. Der Textmarker trägt **nur** dort, sonst wird das Menü unruhig. Eine frühere Hervorhebung von Firmen-KI (gelbe Marke „Kernangebot", Zeile über volle Breite) wurde am 14.08.2026 als zu auffällig zurückgenommen.

  **CSS-Falle:** Die Beschreibungszeile im Dropdown wird per `.nav__dropdown-grid a>span` zum Block. Der Kindselektor ist zwingend: als `.nav__dropdown-grid span` erwischt die Regel auch das `.mark` im Titel, und der Textmarker läuft dann als Block über die ganze Spaltenbreite.
- **Über uns** · **Für Ihre IT**
- Button **Kontakt aufnehmen** → `index.html#termin`. Ein primärer CTA, überall dasselbe Ziel.

**Schriftgröße im Menü:** Direktlinks sind `<a>`, die Aufklapp-Punkte `<button class="nav__trigger">`. Die Größenregel muss beide nennen (`.nav__links a,.nav__links .nav__trigger{font-size:.92rem}`), sonst stehen „Zielgruppen“ und „KI-Einführung“ auf .975rem und das Menü wirkt schief (korrigiert 15.08.2026).

Markup, CSS und JS liegen an genau einer Stelle: `.nav__*` in `styles/site.css`, Aufklapp- und Akkordeon-Logik am Anfang von `scripts/site.js`. **Umschaltpunkt auf das Mobilmenü ist 1100px** (nicht mehr 880), weil die Dropdowns mehr Breite brauchen. Das frühere `<details class="menu-mobile">` ist ersetzt: **die Navigation braucht jetzt JavaScript**, `site.js` muss auf jeder Seite eingebunden sein.

Header und Footer werden nicht von Hand gepflegt. Vorlage und Generator: `scratchpad/nav.py` (Schema im Repo nicht versioniert) ersetzt in jeder Seite den Block `<header class="site-header …>…</header>` und `<footer class="site-footer…>…</footer>` und setzt `aria-current="page"` passend zur Datei.

> ⚠️ **Der Generator liegt nicht im Repo, seine Vorlage kann also veralten.** Am 17.08.2026 sind vier Dinge in die generierten Blöcke gewandert, die ein Lauf mit alter Vorlage stillschweigend zurücknehmen würde:
>
> | in der Vorlage | Grund |
> |---|---|
> | `assets/signet-72.webp` statt `assets/signet.png` | das PNG wog 132 KB bei 36×36 px Darstellung |
> | `assets/signet-negative-72.webp` statt `assets/signet-negative.png` | dito, zusammen 192 KB auf jedem Seitenaufruf |
> | `favicon-32.png` und `favicon-96.png` statt `signet.png` als `rel="icon"` | dieselbe 132-KB-Datei diente als Favicon; 96px, weil Google für die Suche ein Vielfaches von 48 empfiehlt |
> | `<a href="https://www.linkedin.com/company/manibase/" rel="me">LinkedIn</a>` in der Spalte „Unternehmen" | Entitätssignal gegen die Namensverwechslung mit „Manbase" |
>
> **Absicherung:** `scripts/test-frontend.mjs` prüft alle vier Punkte über sämtliche Seiten und läuft in `verify.yml` bei jedem Pull Request. Ein Generatorlauf mit alter Vorlage sieht im Diff harmlos aus, macht die CI aber rot. Wer die Vorlage bewusst ändert, zieht die Tests mit.

## Beim Relaunch entfernt
Altes Helfer-Karussell und die vier alten Helden (Anton/Emma/Doreen/Wiktor), „Kennen Sie das?"-Pains, Wertband, Newsletter-Band auf der Startseite, die drei Mockup-Dateien samt CSS (`index-mockup*.html`, `styles/home-mockup*.css`), das sechsmonatige Einführungsprojekt und der Anker `#anwendungen`. Alte Verweise darauf zeigen jetzt auf `#arbeitssituationen`, `#module` oder `#helfer`.
Der Newsletter-Backend-Pfad (`site/api/newsletter.php` → Odoo) bleibt bestehen, ist aber derzeit von keiner Seite aus verlinkt.

## Dev-Hinweis: Screenshots
Headless-Edge-Screenshots: `& msedge --headless=new --screenshot ... --window-size=W,H`. **Schmale Breiten (z. B. 390) werden unter Windows auf eine Mindest-Fensterbreite geklemmt → Leinwand beschneidet rechts, täuscht Überlauf vor.** Für echte Mobilprüfung eine Mess-/Harness-Seite mit `<iframe width=… src="/">` nutzen (zur Maske scrollen via `getBoundingClientRect`+`pageYOffset`) und mit `--virtual-time-budget=1500 --force-prefers-reduced-motion` screenshotten (sonst hält der Rotator-`setInterval` den Shot auf). `--force-prefers-reduced-motion` nötig, damit `.reveal`-Elemente sichtbar sind. **Edge kappt sehr hohe `--window-size`-Screenshots (>~5000px → keine Datei); Full-Page nicht zuverlässig — abschnittsweise via Anker/Harness shotten.** Temp-Harness-Dateien (`site/_*.html`) nach Gebrauch löschen.
- **CSS-Gotcha:** Das HTML-Attribut `hidden` wird von display-setzenden Klassen (`.btn{display:inline-flex}`, flex/grid) überschrieben → globale Regel `[hidden]{display:none!important}` ist gesetzt und nötig (sonst zeigen Wizard-Nav-Buttons/Newsletter-Row trotz `hidden`).
- [x] Section-Spacing reduziert: `--section-y` jetzt `clamp(3rem,2rem+4vw,5.5rem)` (vorher max 8.5rem).
- [x] Responsive-Check 320/768/1024/1440 bestanden (kein H-Overflow, `html{overflow-x:clip}` als Schutz). Mobil-Fixes: Header-CTA ≤480 aus (steckt im Menü), Hero-CTAs + ctaband/timeline-CTAs vollbreit/umbrechend, Hero-Headline `hyphens:auto`, Gründer-Karten ≤560 einspaltig, Helden-Karten `clamp(200px,21vw,236px)` (4 passen ab ~1000px, darunter Swipe), Calendly-Widget `min-width:0`.
- [ ] Finaler `/impeccable polish` + Lighthouse + Calendly im echten Browser testen.

## Lokal ansehen
`python -m http.server 8000 --directory site` → http://localhost:8000

## Deployment
- **Status: PRODUKTIV auf `manibase.de`.** Der P1-Fix-Gate ist erfüllt (siehe unten). Altes Staging `manibase.aicoreinfra.de` wird nach dem Live-Check abgebaut.
- **P1-Fixes umgesetzt (Juli 2026):** #3 Wizard-Antworten werden per **Zeeg**-Prefill übergeben (kein Datenverlust). #4 Datenschutz auf Realität abgeglichen (Hostinger/Zeeg/Odoo). #2 Newsletter: echter POST an `/api/newsletter.php` → PHP-Proxy → Odoo-Mailingliste „Newsletter" (id 1), **Double-Opt-In** (Juli 2026 nachgerüstet).
- **Newsletter-Gotchas (teuer erkauft):** (1) `data-endpoint` MUSS `/api/newsletter.php` sein — nginx führt per `location =` ausschließlich exakt diesen Pfad aus, `/api/newsletter` gibt 404. (2) Odoos externe API ist auf dem Custom-Plan **freigeschaltet**; ein `authenticate` → `false` bedeutet **falscher API-Key**, nicht „Plan gesperrt". Odoo zeigt den Key nur **einmal** an — Kopierfehler beim Anlegen kosteten hier Stunden. Prüfen, wie viele Keys existieren: `res.users.apikeys` (search_read auf `name`/`scope`/`create_date`); `scope: false` = voller RPC-Zugriff (korrekt). (3) Double-Opt-In ist in Odoo **kein Listen-Schalter**, sondern eine *Marketing-Automation*-Kampagne („Double Opt-in"). App ist installiert, Kampagne läuft auf Liste id 1. **Die Kampagne arbeitet mit ZWEI Listen:** der Proxy schreibt weiter in „Newsletter" (id 1) = Warteschlange mit unbestätigten Adressen, bestätigte Klicker werden von Odoo nach **„Confirmed contacts"** verschoben. **Newsletter-Versand ausschließlich an „Confirmed contacts"** — Odoo verhindert einen Versand an Liste 1 technisch NICHT. (4) **Odoo verschickt die DOI-Mail über drei nacheinander laufende Cronjobs** (`sync_participants` → `execute_activities` → Mail-Warteschlange), Vorgabeintervall nach der Installation 12 h → Bestätigungsmail kam erst Stunden später. `newsletter.php` ruft diese ORM-Methoden deshalb nach dem Eintrag **direkt per API auf** (eigenes try/catch, Fehler brechen die Anmeldung nicht ab, Crons bleiben als Sicherheitsnetz). Cron-Intervall in Odoo steht jetzt auf 10 Min. (5) Odoo Online hat ein Tageslimit von 5–200 ausgehenden Mails (zählt alle Mails der DB, nicht nur Newsletter); bei Bedarf über Odoo-Support anheben lassen.
- **Buchungstool: Zeeg** (Zeeg GmbH, Berlin, Server DE). Konfig NUR am `#booking-calendar` in `index.html` (`data-cal-url`, `data-cal-script`=`https://assets.zeeg.me/embed.min.js`, `data-cal-answer`) + `loadBookingCalendar()` in site.js. Calendly ist abgelöst.
- **Hosting: Hostinger** (Server Frankfurt/DE), NICHT ALL-INKL. Produktiv-Server `72.61.153.206` (Debian 13), Staging-Alt `72.62.42.27`.
- **Live-Domain:** `manibase.de` (+ `www` → Redirect auf apex). Server `deploy@72.61.153.206`, nginx + PHP 8.4-FPM + certbot.
- **CI/CD:** `.github/workflows/deploy.yml` deployt `site/` bei **jedem Merge auf `main`** (GitHub-hosted Runner → SSH-rsync in `…/releases/<timestamp>` → atomarer `current`-Symlink, alte Releases auf 5 reduziert). Manuell via `workflow_dispatch`. Secret: `DEPLOY_SSH_KEY` (ed25519 `github-actions-deploy@manibase`, Public-Key in `~deploy/.ssh/authorized_keys` auf dem neuen Server).
- **Docroot:** `/var/www/manibase.de/current` (deploy-owned, releases/current-Pattern).
- **Newsletter-Backend:** `site/api/newsletter.php` (JSON-RPC → Odoo `manibase-ug.odoo.com`, Liste `Newsletter` id=1). Zugangsdaten liegen serverseitig in `/etc/manibase/odoo.php` (chmod 600, www-data; **nicht im Repo**; `odoo.config.example.php` ist die Vorlage). nginx führt NUR `/api/newsletter.php` aus (rate-limited), sonst kein PHP.
- **Einmalige Provisionierung:** `~deploy`/root-Skript `setup-manibase.sh` (nicht im Repo versioniert = Server-Konvention). Installiert nginx/PHP-FPM/certbot, legt deploy-User + Docroot + nginx-vhost (Security-Header + **Zeeg-CSP**) an, holt Let's-Encrypt-Cert für `manibase.de` + `www`. Braucht root. Voraussetzung: DNS-A-Records `manibase.de`/`www` → `72.61.153.206` (certbot HTTP-01).
- **Staging abgebaut** (Juli 2026): `manibase.aicoreinfra.de` entfernt (vhost, Zertifikat, Docroot, DNS-Record). Nachbar-Seiten auf dem alten Host (schauersberger.com, radar, n8n, openwebui, automationskurs.de) unberührt.
- **Offen (organisatorisch):** AVV Hostinger abschließen (Zeeg- und Odoo-AVV liegen bei). Unbestätigte Adressen in Liste id 1 gelegentlich aufräumen (Datenschutz-Abschnitt 7 sagt „löschen wir regelmäßig" zu, bewusst ohne feste Frist; Odoo räumt nicht von selbst auf).
