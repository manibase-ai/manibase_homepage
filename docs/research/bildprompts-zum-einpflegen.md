# Bild-Prompts zum Einpflegen (Gemini / ChatGPT)

Fünf Bilder für die Startseite. Jeder Prompt ist **eigenständig** und enthält Stil, Farben und Ausschlüsse bereits im Text, weil Gemini und ChatGPT kein eigenes Feld für Negativ-Prompts haben. Einfach den Codeblock kopieren und abschicken.

## So gehst du vor

1. **Reihenfolge:** Bild 1 zuerst. Dann Bild 2, 3 und 4 **in derselben Unterhaltung nacheinander**, damit das Werkzeug Tischfläche, Licht und Schattenrichtung übernimmt. Bild 5 ist optional.
2. **Seitenverhältnis:** steht in jedem Prompt. Bietet das Werkzeug nur feste Formate an, nimm das nächstgrößere und beschneide danach. Deshalb sind alle wichtigen Objekte mittig komponiert.
3. **Sprache:** Prompts sind auf Englisch, weil die Modelle bei Licht, Material und Komposition damit präziser sind. Du kannst sie unverändert in eine deutsche Unterhaltung einfügen.
4. **Nicht die erste Version nehmen.** Zwei bis drei Durchläufe je Bild, dann das beste auswählen. Korrektursätze stehen unter jedem Prompt.

**Optionaler Stil-Anker:** Wenn du mit ChatGPT arbeitest, schick das einmal am Anfang der Unterhaltung. Danach wirken alle fünf Prompts als Satz.

```
I need a set of five images that must look like they belong together. Style for all of them: clean architectural visualization renders, not photographs. Soft overcast daylight, long gentle shadows, matte surfaces, subtle paper grain, restrained detail. Cool desaturated palette of off-white, pale blue-grey and deep navy. No people anywhere in any image. No readable text, letters, numbers or logos anywhere. I will send the five scenes one at a time.
```

---

## Bild 1 · Hero

**Zweck:** Ersetzt den gezeichneten Plankopf im Hero. Zeigt Plan, Büro und Baustelle in einem Bild, passend zur Headline.
**Format:** 4:5 hoch. Ersatzweise 1:1 und auf 4:5 beschneiden.
**Datei später:** `site/assets/illu-hero-plan-buero.webp`, gerendert 1600 × 2000

```
A clean architectural visualization render, not a photograph. Vertical composition, aspect ratio 4:5.

Scene: A large unrolled architectural floor plan lies on a pale grey desk. The plan shows fine dark navy line work on off-white paper, its edges slightly curled and weighted down at one corner. A yellow folding ruler, partly unfolded, rests diagonally across the plan and is the only saturated colour in the image. Three loose A4 sheets sit slightly offset on top of the plan; their content is abstracted into soft grey horizontal lines. Behind the desk stands a full-height window. Through it, softly out of focus, a concrete-shell construction site with scaffolding and a tower crane under flat overcast daylight.

Light and materials: soft directional daylight from the left, long gentle shadows, matte surfaces, subtle paper grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, plus the single yellow ruler. No other saturated colour.

Mood: calm, precise, documentary, quiet early morning.

Show no people, no faces, no hands and no silhouettes. Show no readable text, no numbers, no letters, no logos, no screens and no user interfaces. Avoid neon, glowing lines, holograms, purple or blue gradients, lens flare, dramatic sunset light, HDR effects and any science-fiction or AI-themed imagery. Keep the desk uncluttered: no coffee cups, no plants, no decorative objects.
```

**Wenn etwas nicht stimmt:**
- Zollstock zu dominant: `Make the yellow folding ruler smaller and move it further toward the lower left.`
- Baustelle zu scharf: `Make the construction site behind the window much softer and more out of focus.`
- Zu bunt: `Reduce all colour saturation except the yellow ruler. Everything else should be nearly neutral.`

---

## Bild 2 · Projekt- und Unternehmenswissen

**Zweck:** Ersetzt den leeren Kasten „Visual-Platzhalter 02A". Aus vielen getrennten Ablagen wird eine Antwort mit belegter Fundstelle.
**Format:** 3:2 quer. Ersatzweise 16:9 und beschneiden.
**Datei später:** `site/assets/illu-wissen.webp`, gerendert 2400 × 1600

```
A clean architectural visualization render, not a photograph. Strict top-down overhead view, camera at 90 degrees. Horizontal composition, aspect ratio 3:2.

Scene: A pale desk surface seen from directly above. On the left half of the frame lie five separate stacks of documents and hanging files at slightly different heights, turned at slightly different angles, deliberately unsorted but not chaotic; all their content is abstracted into soft grey lines. On the right half lies one single clean A4 sheet, isolated, with generous empty space around it; one line on this sheet is underscored with a thin cobalt blue mark. A fine cobalt blue thread runs across the surface from that mark back to one specific stack on the left.

Light and materials: soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces, no hands. Show no readable text, no numbers, no letters, no logos, no screens and no user interfaces. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

**Wenn etwas nicht stimmt:**
- Schrift lesbar geworden: `Replace all text on the documents with plain soft grey horizontal lines. No letters at all.`
- Rechte Seite zu voll: `Leave much more empty space around the single sheet on the right.`

---

## Bild 3 · Baudokumentation und Nachweise

**Zweck:** Ersetzt „Visual-Platzhalter 02B". Aus ungeordneten Eingaben von der Baustelle wird ein prüfbarer Entwurf. Der Wechsel läuft über die Oberfläche, staubig nach sauber, ohne Pfeil.
**Format:** 3:2 quer
**Datei später:** `site/assets/illu-doku.webp`, gerendert 2400 × 1600

```
A clean architectural visualization render, not a photograph. Strict top-down overhead view, camera at 90 degrees. Horizontal composition, aspect ratio 3:2. Same desk surface, same lighting and same shadow direction as the previous image.

Scene: On the left half of the frame, a smartphone with a dark, empty, switched-off screen lies on a dusty, creased construction site plan. Beside it lies a small open notebook filled with abstracted handwriting scribbles, a worn carpenter's pencil, and fine concrete dust scattered across the surface. On the right half, the same table surface is clean and free of dust, holding one single clearly structured report sheet with a header block and three content blocks, all content abstracted into soft grey lines, and at the bottom a sign-off line marked with a small cobalt blue check mark. The transition from dusty to clean runs softly through the middle of the frame.

Light and materials: soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces, no hands. Show no readable text, no numbers, no letters, no logos and no visible user interface on the phone screen. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

**Wenn etwas nicht stimmt:**
- Handy leuchtet: `The phone screen must be completely dark and switched off, with no glow and no interface.`
- Staub zu stark: `Reduce the concrete dust to a very subtle trace on the left side only.`

### Bild 3, Variante A · zwei getrennte Gruppen statt Materialübergang

Gleiche Aussage, aber ohne die zwei schwierigen Stellen: kein Staubverlauf quer durchs Bild und kein Smartphone. Der Gegensatz entsteht allein durch **Unordnung links, Ordnung rechts** und viel Luft dazwischen.

```
A clean architectural visualization render, not a photograph. Strict top-down overhead view, camera at 90 degrees. Horizontal composition, aspect ratio 3:2. Same pale desk surface, same lighting and same shadow direction as the previous image.

Scene: The desk surface is uniform and clean throughout. Two clearly separated groups of objects lie on it, with generous empty space between them.

Left group: a creased, folded construction site plan, a small open notebook whose pages carry only abstracted grey scribble marks, and a worn carpenter's pencil lying across it. These objects overlap each other and sit at slightly irregular angles.

Right group: one single clearly structured report sheet, lying perfectly straight and alone, with a header block and three content blocks below it, all content abstracted into soft grey lines, and a sign-off line at the bottom marked with a small cobalt blue check mark.

Light and materials: soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces and no hands. Show no phone and no screens of any kind. Show no readable text, no letters, no numbers and no logos; all writing must be abstracted grey marks. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

### Bild 3, Variante B · das Ergebnis liegt auf seinem Ursprung (empfohlen)

Andere Bildidee, deutlich einfacher zu erzeugen, weil nur **ein** Objekt die Hauptrolle spielt. Der saubere Entwurf liegt direkt auf dem zerknitterten Baustellenplan, aus dem er entstanden ist. Das erzählt dieselbe Geschichte in einem einzigen Bildgedanken, ohne Vorher-Nachher-Teilung.

```
A clean architectural visualization render, not a photograph. Strict top-down overhead view, camera at 90 degrees. Horizontal composition, aspect ratio 3:2. Same pale desk surface, same lighting and same shadow direction as the previous image.

Scene: A creased, well-used construction site plan covers most of the desk, seen from directly above; its folds and worn edges are clearly visible and its line work is abstracted into fine grey lines. Resting on top of it, slightly rotated, lies one single crisp report sheet, visibly newer, brighter and cleaner than everything beneath it. This sheet is laid out as a header block and three content blocks, all content abstracted into soft grey lines, with a sign-off line at the bottom marked by a small cobalt blue check mark. At the edge of the frame, partly cropped, lie a small closed notebook and a worn carpenter's pencil, pushed aside.

Light and materials: soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces and no hands. Show no phone and no screens of any kind. Show no readable text, no letters, no numbers and no logos; all writing must be abstracted grey marks. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

**Wenn etwas nicht stimmt:**
- Entwurf hebt sich zu wenig ab: `Make the report sheet on top noticeably brighter and cleaner than the plan beneath it, with a clear drop shadow.`
- Plan zu neu: `The construction plan underneath should look worn and heavily creased, clearly older than the sheet on top.`

### Bild 3, Variante C · Klemmbrett an der Rohbauwand (empfohlen)

Anderes Motiv statt einer dritten Papieraufsicht. Bild 2 und Bild 4 sind Aufsichten auf einen Tisch; wenn Bild 3 dazwischen dasselbe macht, entsteht genau die Gleichförmigkeit, die auf der Seite ohnehin das Problem ist.

Was das Bild leistet:

- **Anderer Ort.** Es spielt auf der Baustelle, nicht am Schreibtisch. Damit deckt der Dreiersatz Büro, Baustelle und Büro ab, statt dreimal Büro.
- **Andere Kamera.** Frontal auf eine Wand statt senkrecht von oben.
- **Anderes Material.** Sichtbeton mit Schalungsspuren bringt Textur ins Spiel. Genau die fehlt der Seite bisher komplett, weil alles Papier und Strichzeichnung ist.
- Die Aussage bleibt: Dokumentation entsteht dort, wo gebaut wird, und trägt einen Freigabepunkt.

```
A clean architectural visualization render, not a photograph. Horizontal composition, aspect ratio 3:2. Camera at eye level, facing the wall straight on, slightly off centre.

Scene: A raw concrete wall inside an unfinished building shell, with visible formwork marks, tie holes and a fine layer of construction dust. A simple metal clipboard hangs on a nail on this wall. Clamped to it is a single documentation sheet, laid out as a header block and three content blocks, all content abstracted into soft grey lines, with a sign-off line at the bottom marked by a small cobalt blue check mark. A worn carpenter's pencil hangs on a short string beside the clipboard. Daylight enters from a window opening outside the frame on the left and grazes across the concrete, revealing its texture.

Light and materials: soft overcast daylight from the left, long gentle shadows, matte concrete, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Grey concrete, off-white paper, pale blue-grey and deep navy in the shadows, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces and no hands. Show no screens of any kind. Show no readable text, no letters, no numbers and no logos; all writing must be abstracted grey marks. Avoid neon, glowing effects, gradients, lens flare, dramatic sunlight and any science-fiction or AI-themed imagery.
```

**Wenn etwas nicht stimmt:**
- Wand zu glatt: `Give the concrete wall stronger formwork marks and visible tie holes, clearly an unfinished building shell.`
- Zu dunkel: `Brighten the overall scene; the daylight should be soft and even, not moody.`
- Blatt zu klein im Bild: `Move the camera closer so the clipboard fills about one third of the frame width.`

### Bild 3, Variante D · Reihe Bautagebücher im Regal (Rückfallebene)

Nur nehmen, falls Variante C nicht überzeugt. **Achtung:** Das Motiv liegt inhaltlich nah an Bild 4 (dicker Ausschreibungsordner), beide zeigen Papierlast. Dann stehen zwei ähnliche Aussagen untereinander.

```
A clean architectural visualization render, not a photograph. Horizontal composition, aspect ratio 3:2. Camera facing the shelf straight on, slightly elevated.

Scene: A plain shelf holding a long row of about fourteen thick ring binders standing upright, spines facing the camera. The spine labels are abstracted into soft grey blocks and lines with no readable text. The binders look used: slightly different heights, a few leaning against each other. One single binder is pulled forward out of the row by a few centimetres, and its spine label carries a thin cobalt blue mark. On a narrow ledge in front of the shelf lies one crisp report sheet, laid out as a header block and three content blocks in abstracted grey lines.

Light and materials: soft even daylight from the left, long gentle shadows, matte cardboard and paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces and no hands. Show no screens of any kind. Show no readable text, no letters, no numbers and no logos. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

---

## Bild 4 · Angebots- und Projektvorbereitung

**Zweck:** Ersetzt „Visual-Platzhalter 02C". Aus vielen Unterlagen wird ein strukturierter Arbeitsstand. Der abgelegte, unbenutzte Bleistift zeigt: die Entscheidung trifft weiterhin ein Mensch.
**Format:** 3:2 quer
**Datei später:** `site/assets/illu-angebot.webp`, gerendert 2400 × 1600

```
A clean architectural visualization render, not a photograph. Strict top-down overhead view, camera at 90 degrees. Horizontal composition, aspect ratio 3:2. Same desk surface, same lighting and same shadow direction as the previous image.

Scene: On the left half of the frame, a thick open tender document folder is surrounded by about eight loose sheets fanned out and overlapping, plus two stapled specification booklets. This side looks dense, heavy and hard to survey; all content is abstracted into soft grey lines. On the right half lies one single overview sheet carrying a clear table grid of rows and columns rendered as soft grey lines, with one row marked by a narrow cobalt blue bracket in the margin. A plain pencil rests beside that sheet, lying unused.

Light and materials: soft even daylight from the upper left, long gentle shadows, matte paper, subtle grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, with cobalt blue as the only accent. No yellow anywhere.

Show no people, no faces, no hands. Show no readable text, no numbers, no letters, no logos, no screens and no user interfaces. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery.
```

**Wenn etwas nicht stimmt:**
- Linke Seite zu ordentlich: `Make the left side denser and more overlapping, clearly harder to survey than the right side.`
- Tabelle sieht aus wie Software: `The grid must look like a printed sheet of paper, not like a screen or a spreadsheet application.`

---

## Bild 5 · Der Klartag (optional)

**Zweck:** Der Klartag ist der einzige bezahlte Einstieg und hat bisher kein Bild. Ein leerer, vorbereiteter Tisch zeigt, was ein Klartag ist, ohne einen stattgefundenen Kundentermin zu behaupten.
**Format:** 3:2 quer
**Datei später:** `site/assets/illu-klartag.webp`, gerendert 2400 × 1600

```
A clean architectural visualization render, not a photograph. Slightly elevated camera angle, about 35 degrees above the table. Horizontal composition, aspect ratio 3:2.

Scene: A large pale meeting table. At its centre lies an unrolled architectural plan. Beside it lies a large sheet carrying an abstracted evaluation matrix: a grid of rows and columns with a few cells softly tinted, no readable text. Three notepads and three pens are placed at three settings around the table. Three chairs are pulled slightly back from the table. Nobody is seated and the room is empty. A single yellow marker rests on the matrix sheet and is the only saturated colour in the image.

Light and materials: soft directional morning daylight from the side, long gentle shadows, matte surfaces, subtle paper grain, restrained detail. The look of a professional architectural rendering rather than a photo.

Colour: cool and desaturated. Off-white, pale blue-grey and deep navy, plus the single yellow marker.

Mood: calm, prepared, precise, documentary.

Show no people, no faces, no hands and no silhouettes. Show no readable text, no numbers, no letters, no logos, no screens and no user interfaces. Avoid neon, glowing effects, gradients, lens flare and any science-fiction or AI-themed imagery. Keep the table uncluttered: no coffee cups, no water bottles, no plants.
```

**Wenn etwas nicht stimmt:**
- Wirkt verlassen statt vorbereitet: `The table should look freshly prepared for a meeting that is about to start, not abandoned.`

---

## Prüfliste, bevor du mir ein Bild schickst

- [ ] Keine Person, kein Gesicht, keine Hand
- [ ] Kein lesbarer Text, keine Zahlen, keine Logos, keine Bedienoberfläche
- [ ] Gelb nur in Bild 1 und Bild 5, und dort nur als Zollstock beziehungsweise Marker
- [ ] Bilder 2, 3 und 4 haben dieselbe Tischfläche und dieselbe Schattenrichtung
- [ ] Das Bild kann nicht als reales Kundenprojekt gelesen werden

## Was ich danach mache

Bilder als PNG oder JPG in maximaler Größe an mich. Ich übernehme Zuschnitt, WebP-Konvertierung, zwei Auflösungen je Bild, Alt-Texte, Kennzeichnung („KI-generierte Illustration") und den Einbau.
