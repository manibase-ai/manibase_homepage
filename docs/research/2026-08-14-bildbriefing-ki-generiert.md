# Bildbriefing: KI-generierte Motive für die Startseite

**Stand:** 14. August 2026
**Anlass:** Es gibt keine echten Bau- und Planungsaufnahmen und keinen Zugang zu Kundenbaustellen. Die Bildlücke wird mit generierten Motiven geschlossen und gekennzeichnet.
**Bezug:** `docs/research/2026-08-14-visual-report-v2-vs-live.md`, `START-HERE-STARTSEITENSTRATEGIE.md` Abschnitt 10

---

## 1. Die eine Entscheidung vorweg: kein Fotorealismus

Eure gesamte Glaubwürdigkeitsstrategie lautet „keine simulierte Produktreife, keine erfundenen Cases". Ein fotorealistisches Bild einer Baustelle auf dieser Seite arbeitet dagegen, auch mit Kennzeichnung: im Vorbeiscrollen liest niemand die Bildunterschrift, das Bild behauptet auf den ersten Blick Zugang zu realen Projekten. Kennzeichnung repariert das nicht, sie protokolliert es nur.

**Empfehlung: Architektur-Rendering-Register statt Fotografie.** Also die Bildsprache, mit der Planungsbüros ohnehin täglich arbeiten. Das löst drei Dinge gleichzeitig:

- **Ehrlich per Gattung.** Ein Rendering behauptet gattungsbedingt nichts Reales. Die Zielgruppe versteht das ohne Bildunterschrift, weil sie selbst Renderings produziert.
- **Branchennah statt generisch.** Es ist Bau- und Planungssprache, kein Stockmotiv-Vokabular.
- **Es löst das eigentliche Problem.** Der Report hat kritisiert, dass die Seite nur aus flacher Strichzeichnung besteht. Ein Rendering bringt Licht, Volumen und Materialtiefe, also genau den Gegensatz, der der Seite fehlt. Noch mehr Vektorgrafik im Werkplanstil würde nichts ändern.

Damit entsteht eine saubere Dreiteilung, die man auch verteidigen kann:

| Ebene | Register | Wahrheitsstatus |
|---|---|---|
| Mechanismus | Strichzeichnung, Werkplan | Schema, offensichtlich konstruiert |
| Atmosphäre und Arbeitsobjekte | Rendering, generiert | gekennzeichnet, keine Realbehauptung |
| Menschen | echte Fotos und Video von euch beiden | real, überprüfbar |

## 2. Harte Regel: keine generierten Menschen

Auf keinem generierten Bild sind Personen zu sehen. Weder Gesichter noch Hände noch Silhouetten. Begründung: Menschen sind das Einzige auf der Seite, was Vertrauen tragen soll, und ihr habt echte (ihr beide, plus geplantes Video). Generierte Personen daneben zu setzen entwertet die echten sofort. Alles Generierte zeigt **Räume und Arbeitsobjekte**.

Das ist kein Verlust: leere, vorbereitete Arbeitssituationen wirken in diesem Register ruhiger und teurer als bevölkerte.

## 3. Gemeinsamer Stil-Baukasten

Diese Angaben gehen in **jeden** Prompt, damit die Bilder als Satz zusammengehören.

**Licht und Kamera**
- weiches gerichtetes Tageslicht von einer Seite, bedeckter Himmel, keine harte Sonne
- lange weiche Schatten, matte Oberflächen, feines Papierkorn
- leichte Tiefenschärfe-Staffelung, kein extremes Bokeh
- Kamera: entweder **Aufsicht 90 Grad** (Arbeitsobjekte) oder **leichte Schräge 30 bis 40 Grad** (Räume). Nichts dazwischen.

**Palette** (aus `Claude Design/colors_and_type.css`)
- Grundflächen: Off-White `#FAFBFD`, Papierweiß `#FFFFFF`
- Kühle Grautöne: `#E4E9F2`, `#F0F3FF`
- Tiefblau `#14224F` in Schatten, Linienwerk und dunklen Objekten
- Cobalt `#2F3FDB` **nur** als kleiner gesetzter Akzent, etwa eine Markierung oder ein Haken
- Gelb `#F2D414` **höchstens einmal pro Bild und nur als physisches Objekt**, nicht als Licht oder Fläche

**Die Gelb-Geste:** benutzt den **gelben Zollstock**. Er ist unverwechselbar deutsches Bauhandwerk, er ist von Natur aus in eurem Gelb, und er ist kein Klischee wie der Bauhelm. Ein gelber Marker tut es ebenfalls. Nach der Golden Yellow Rule: pro Screen eine Gelb-Geste, also erscheint Gelb nur im Hero und im Klartag-Bild, **nicht** in den drei Arbeitsobjekt-Bildern, weil die nebeneinander stehen.

**Textregel (wichtig)**
Auf keinem Bild steht lesbarer Text. Alle Dokumentinhalte werden zu **abstrahierten grauen Linien**. Das ist nicht nur ein Qualitätsproblem generierter Schrift, es verhindert auch, dass ein Bild als echtes Kundenartefakt oder als fertige Produktoberfläche gelesen wird. Beides verbietet die Strategie ausdrücklich.

**Negativ-Prompt für alle Bilder**

> no people, no faces, no hands, no silhouettes, no readable text, no lettering, no numbers, no logos, no brand marks, no user interface, no screens with visible UI, no robots, no AI imagery, no glowing lines, no holograms, no neon, no purple or blue gradients, no HDR, no lens flare, no dramatic sunset light, no stock photo styling, no heroic hard hats, no clutter, no cartoon, no plastic 3D look, no watermark

**Prompts auf Englisch.** Die Bildmodelle sind darin deutlich präziser, gerade bei Licht, Material und Komposition.

---

## 4. Die Bilder

Fünf Motive. Vier davon lösen konkrete Lücken, das fünfte ist optional.

---

### Bild 1 · Hero: Plan, Baustelle und Büro in einem Bild

**Platz:** Hero-Visual, ersetzt den Plankopf beziehungsweise steht bis zum Gründervideo an dessen Stelle
**Bildfläche gemessen:** 534 × 615 px Anzeige → **Format 4:5, rendern in 1600 × 2000**
**Zweck:** Die Headline lautet „KI muss zwischen Plan, Baustelle und Büro funktionieren." Das Bild zeigt genau diese drei Welten in einem einzigen Rahmen, ohne Text.

**Was zu sehen ist, von vorne nach hinten:**

1. **Vorne, untere Bildhälfte:** ein großer aufgerollter Grundrissplan auf einem hellgrauen Arbeitstisch. Feines dunkelblaues Linienwerk auf Off-White-Papier. Die Rollkanten leicht gewellt, an einer Ecke beschwert.
2. **Auf dem Plan:** ein **gelber Zollstock**, teilweise aufgeklappt, diagonal liegend. Das ist die einzige gesättigte Farbe im Bild.
3. **Daneben:** drei bis vier lose A4-Blätter, leicht versetzt übereinander, Inhalt als weiche graue Linien abstrahiert.
4. **Hinten:** eine raumhohe Fensterfläche. Dahinter, weich unscharf, ein Rohbau im Tageslicht: Betonskelett, Gerüst, ein Turmdrehkran, flaches bedecktes Licht.
5. **Keine Personen. Keine Kaffeetassen, keine Deko.** Stimmung: früher, ruhiger Morgen.

**Sicherheitsbereich:** Plan und Zollstock in den unteren 60 Prozent halten, damit ein quadratischer oder 3:4-Beschnitt für Mobil noch funktioniert.

**Prompt**

> Architectural visualization, editorial still life, vertical 4:5 composition. A large unrolled architectural floor plan lies on a pale grey desk, fine dark navy line work on off-white paper, edges slightly curled and weighted at one corner. A yellow folding ruler, partly unfolded, rests diagonally across the plan. Three loose A4 sheets sit slightly offset on the plan, their content abstracted into soft grey horizontal lines, no readable text. Behind the desk a full-height window; through it, softly out of focus, a concrete-shell construction site with scaffolding and a tower crane under flat overcast daylight. No people. Soft directional daylight from the left, long gentle shadows, matte surfaces, subtle paper grain, shallow depth staggering. Cool desaturated palette of off-white, pale blue-grey and deep navy, with one single saturated yellow object. Calm, precise, documentary, quiet early morning mood.

---

### Bild 2 · Arbeitssituation 02A: Projekt- und Unternehmenswissen

**Platz:** ersetzt den gestrichelten Kasten „Visual-Platzhalter 02A"
**Bildfläche gemessen:** 476 px breit → **Format 3:2, rendern in 2400 × 1600** (verträgt Beschnitt auf 2:1 und 16:9)
**Aussage:** Aus vielen getrennten Ablagen wird eine Antwort mit belegter Fundstelle.

**Was zu sehen ist:** strenge Aufsicht, 90 Grad, auf eine helle Tischfläche.

- **Linke Bildhälfte:** fünf voneinander getrennte Dokumentstapel und Hängeregister, unterschiedlich hoch, unregelmäßig verteilt, leicht verdreht. Bewusst ungeordnet, aber nicht chaotisch. Inhalte als graue Linien.
- **Rechte Bildhälfte:** ein einzelnes A4-Blatt, sauber, mit viel Luft ringsum. Darauf eine einzige Textzeile mit einer dünnen **cobaltfarbenen** Unterstreichung.
- **Verbindung:** ein feiner cobaltfarbener Faden oder eine gezogene Linie führt von dieser markierten Stelle zurück zu genau einem der linken Stapel. Das ist die Fundstelle.
- Kein Gelb. Kein Pfeil-Symbol, die Linie genügt.

**Prompt**

> Top-down flat lay, 90 degree overhead view on a pale desk surface, architectural visualization style, 3:2 horizontal composition. On the left half, five separate stacks of documents and hanging files at slightly different heights and angles, deliberately unsorted, their content abstracted into soft grey lines, no readable text. On the right half, a single clean A4 sheet isolated with generous empty space around it, one line on it underscored with a thin cobalt blue mark. A fine cobalt blue thread runs from that mark back to one specific stack on the left. Soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain. Cool desaturated palette of off-white, pale blue-grey and deep navy with a single cobalt blue accent. No yellow. Quiet, precise, documentary.

---

### Bild 3 · Arbeitssituation 02B: Baudokumentation und Nachweise

**Platz:** ersetzt „Visual-Platzhalter 02B"
**Format:** 3:2, rendern in 2400 × 1600
**Aussage:** Aus ungeordneten Eingaben von der Baustelle wird ein prüfbarer Entwurf.

**Was zu sehen ist:** Aufsicht, 90 Grad. Der Wechsel wird über die **Oberfläche** erzählt, nicht über einen Pfeil.

- **Linke Bildhälfte:** ein Smartphone mit dunklem, leerem Display liegt auf einem staubigen, geknickten Baustellenplan. Daneben ein kleines aufgeschlagenes Notizbuch mit abstrahierter Handschrift, ein abgenutzter Zimmermannsbleistift, feiner Betonstaub auf der Fläche.
- **Rechte Bildhälfte:** dieselbe Tischfläche, aber sauber. Darauf ein einzelnes, klar gegliedertes Berichtsblatt: Kopfblock, drei Inhaltsblöcke, alles als graue Linien. Unten eine Freigabezeile mit einem kleinen **cobaltfarbenen** Haken.
- Der Übergang von staubig nach sauber verläuft weich durch die Bildmitte.
- Kein Gelb.

**Prompt**

> Top-down flat lay, 90 degree overhead view, architectural visualization style, 3:2 horizontal composition. Left half: a smartphone with a dark empty screen lying on a dusty creased construction site plan, beside it a small open notebook with abstracted handwriting scribbles, a worn carpenter pencil, fine concrete dust scattered on the surface. Right half: the same table surface but clean and dust free, holding one single clearly structured report sheet with a header block and three content blocks, all text abstracted into soft grey lines, and at the bottom a sign-off line with a small cobalt blue check mark. The transition from dusty to clean runs softly through the middle of the frame. Soft even daylight from the upper left, matte surfaces, subtle grain. Cool desaturated palette of off-white, pale blue-grey and deep navy with a single cobalt blue accent. No yellow, no readable text, no people.

---

### Bild 4 · Arbeitssituation 02C: Angebots- und Projektvorbereitung

**Platz:** ersetzt „Visual-Platzhalter 02C"
**Format:** 3:2, rendern in 2400 × 1600
**Aussage:** Aus vielen Unterlagen wird ein strukturierter Arbeitsstand, die Entscheidung bleibt offen beim Menschen.

**Was zu sehen ist:** Aufsicht, 90 Grad.

- **Linke Bildhälfte:** ein dicker aufgeschlagener Ausschreibungsordner, darum herum sieben bis acht lose Blätter fächerförmig überlappend, dazu zwei geheftete Leistungsverzeichnisse. Dicht, schwer, unübersichtlich.
- **Rechte Bildhälfte:** ein einzelnes Übersichtsblatt mit einem klar erkennbaren Tabellenraster, Zeilen und Spalten als graue Linien. Eine Zeile mit einer schmalen **cobaltfarbenen** Klammer am Rand markiert.
- **Daneben liegt ein Bleistift**, unbenutzt abgelegt. Er zeigt: hier entscheidet noch jemand. Kein Haken, keine Unterschrift.
- Kein Gelb.

**Prompt**

> Top-down flat lay, 90 degree overhead view, architectural visualization style, 3:2 horizontal composition. Left half: a thick open tender document folder surrounded by eight loose sheets fanned out and overlapping, plus two stapled specification booklets, dense and heavy, all content abstracted into soft grey lines. Right half: one single overview sheet carrying a clear table grid of rows and columns rendered as soft grey lines, with one row marked by a narrow cobalt blue bracket in the margin. A plain pencil rests beside the sheet, unused. Soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain. Cool desaturated palette of off-white, pale blue-grey and deep navy with a single cobalt blue accent. No yellow, no readable text, no people.

---

### Bild 5 · Der Klartag als vorbereitete Situation (optional)

**Platz:** Blatt 08, Klartag, neben dem gelben Leistungsblatt
**Format:** 3:2, rendern in 2400 × 1600
**Zweck:** Der Klartag ist der einzige bezahlte Einstieg und hat bisher kein Bild. Ein **leerer, vorbereiteter** Besprechungstisch behauptet keinen stattgefundenen Kundentermin und zeigt trotzdem, was ein Klartag ist.

**Was zu sehen ist:** leichte Schräge von oben, etwa 35 Grad.

- Ein großer heller Besprechungstisch, in der Mitte ein aufgerollter Plan.
- Daneben ein großes Bogenblatt mit einer abstrahierten Bewertungsmatrix: Raster aus Zeilen und Spalten, einige Felder leicht getönt. Das ist die Use-Case-Bewertung.
- Drei Notizblöcke und drei Stifte, jeweils an einem Platz. **Drei Stühle**, leicht herausgezogen, als hätte man gerade Platz gemacht. Niemand sitzt.
- Ein **gelber Marker** liegt auf der Matrix. Das ist die Gelb-Geste und markiert den Entscheidungspunkt.
- Morgenlicht von der Seite, ruhig.

**Prompt**

> Architectural visualization, editorial interior still life, 3:2 horizontal composition, slightly elevated camera angle about 35 degrees. A large pale meeting table with an unrolled architectural plan at its centre. Beside it a large sheet carrying an abstracted evaluation matrix of rows and columns with a few softly tinted cells, no readable text. Three notepads and three pens placed at three settings, three chairs pulled slightly back from the table, nobody seated. A single yellow marker rests on the matrix sheet. Soft directional morning daylight from the side, long gentle shadows, matte surfaces, subtle paper grain. Cool desaturated palette of off-white, pale blue-grey and deep navy, with one single saturated yellow object. Calm, prepared, precise, documentary.

---

## 5. Kennzeichnung auf der Seite

Zwei Ebenen, beide zurückhaltend. Der schwarze Balken „ILLUSTRATION · PLATZHALTER · KEIN KUNDENBELEG" aus dem Mockup fällt ersatzlos weg, er war das lauteste Element im Hero.

**Pro Bild**, kleine Mono-Zeile in gedämpftem Grau direkt unter dem Bild:

> KI-generierte Illustration

Bei den drei Arbeitsobjekt-Bildern zusätzlich der bereits vorgesehene Zusatz:

> KI-generierte Illustration · schematische Darstellung, kein Kundenartefakt

**Einmal global**, im Footer oder im Impressum:

> Die Bildmotive dieser Seite sind KI-generierte Illustrationen. Sie zeigen keine realen Kundenprojekte, keine realen Baustellen und keine Produktoberflächen.

Damit ist die Kennzeichnung erfüllt, ohne dass jedes Bild sich selbst entwertet.

## 6. Produktion und Einbau

1. **Alle fünf Motive in einer Sitzung erzeugen**, mit gleicher Stilreferenz beziehungsweise gleichem Seed. Der Satzcharakter ist wichtiger als das einzelne beste Bild.
2. **Die drei Aufsichten (Bild 2 bis 4) unbedingt zusammen**, sie stehen untereinander und müssen dieselbe Tischfläche, dasselbe Licht und dieselbe Schattenrichtung haben. Weicht eines ab, fällt es sofort auf.
3. Ergebnisse hochskalieren, dann als **WebP** ablegen unter `site/assets/`, Vorschlag: `illu-hero-plan-buero.webp`, `illu-wissen.webp`, `illu-doku.webp`, `illu-angebot.webp`, `illu-klartag.webp`.
4. Zwei Breiten je Bild (etwa 800 und 1600 px) über `srcset`, `width`/`height` immer gesetzt, das Hero-Bild mit `fetchpriority="high"`, alle anderen `loading="lazy"`.
5. Alt-Texte beschreiben, **was zu sehen ist**, nicht was es bedeuten soll. Beispiel Bild 2: „Aufsicht auf mehrere getrennte Dokumentstapel und ein einzelnes Blatt mit markierter Fundstelle."

## 7. Prüfliste, bevor ein Bild auf die Seite geht

- [ ] Keine Person, kein Gesicht, keine Hand im Bild
- [ ] Kein lesbarer Text, keine Zahlen, keine Logos, keine Bedienoberfläche
- [ ] Gelb höchstens einmal und nur als physisches Objekt (Zollstock oder Marker)
- [ ] Cobalt nur als kleiner gesetzter Akzent, nicht als Fläche
- [ ] Schattenrichtung stimmt mit den anderen Bildern des Satzes überein
- [ ] Kann das Bild vernünftigerweise als reales Kundenprojekt gelesen werden? Wenn ja, zurück in die Generierung
- [ ] Kennzeichnung gesetzt

## 8. Was das nicht löst

Diese fünf Bilder schließen die Bildlücke und brechen die Monotonie der Strichzeichnung. Sie ersetzen **nicht** den menschlichen Moment. Der kommt weiterhin nur aus echtem Material: den beiden Gründerfotos, groß gesetzt statt in 132 px, und dem geplanten Gründervideo. Ohne das bleibt die Seite präzise und kühl, aber gesichtslos.
