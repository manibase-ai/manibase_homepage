# Bauauftrag manibase.de

**Für eine frische Sitzung.** Diese Datei allein reicht, um zu bauen.
Belege stehen in `00-recherche.md`, Begründungen in `01-entscheidungen.md` (E1–E27),
gesammelte Gesprächseinwände in `02-einwand-log.md`. Bei Widersprüchen gilt die höhere
E-Nummer.

Stand: 4. August 2026. Fragenkatalog abgeschlossen (20 von 20).

---

## 1 · Unantastbar

- `site/impressum.html`, `site/datenschutz.html`, `site/api/*.php` und alles rund um
  Sicherheit bleiben **inhaltlich unverändert**. Kundenvorgabe.
  Ausnahme, bereits erledigt: Kontaktadresse auf `kontakt@manibase.de` vereinheitlicht.
- Kein Preis für den Retainer auf der Seite.
- Keine erfundenen Kundenzahlen, keine anonymen Zitate, keine gekauften Siegel.
- **Ein Merge auf `main` deployt sofort live auf manibase.de.** Kein Zwischenschritt,
  keine manuelle Freigabe (`.github/workflows/deploy.yml`).

## 2 · Wer liest die Seite

**Ein Leser: die Geschäftsführung** eines Bau- oder Planungsunternehmens mit
**100 bis 200 Mitarbeitenden** (Korridor; real reicht die Kundenliste von 18 aufwärts).
Die **IT-Leitung ist Vetogeber**, nicht Käufer: Sie bekommt eine eigene Unterseite, die
ihr das Nein nimmt, statt sie zum Kauf zu überreden.

Kleine Handwerksbetriebe gehören **nicht** hierher, sondern auf matthias-geisler.com.
Deshalb gilt der alte Claim „Holen Sie sich Ihre Abende zurück" auf manibase.de nicht
mehr, und die gesamte heutige Startseite ist auf den falschen Kunden getextet.
**Das ist ein Neubau der Texte, kein Redesign.**

## 3 · Was verkauft wird

**Flaggschiff: das strukturierte KI-Einführungsprojekt.** Drei Stufen:

| Stufe | Inhalt |
|---|---|
| **1 Gespräch** | 30 Minuten. Machbarkeit klären. Mögliches Ergebnis ausdrücklich: geht nicht |
| **2 Klartag** | Tagesworkshop, 3.000–5.000 €, wird beim Folgeprojekt **voll angerechnet**. Ergebnis: Roadmap |
| **3 Projekt** | 6 Monate, Retainer 6.000–10.000 €/Monat (**Zahl nicht auf die Seite**) |

**Zwei Leistungsbausteine**, je nach Schreibtischquote:

- **Planungs-/Bürobetrieb** (Architekturbüro, TGA): jeder braucht Zugang → ganzheitliche
  Einführung, skaliert mit Kopfzahl.
- **Ausführender Betrieb** (Bau, Dachdecker, Spengler, GaLaBau, SHK): nur ein Drittel bis
  ein Fünftel hat einen Schreibtisch → **ein Helfer, einmal eingerichtet**, skaliert
  nicht mit der Nutzerzahl.

Als **zwei Bausteine eines Angebots** zeigen, nicht als zwei Produkte mit getrennten
Türen.

**Koexistenz mit Microsoft, keine Konfrontation.** manibase arbeitet in der
Microsoft-Welt (RAG, SharePoint, Teams, interne Wikis) *und* baut eigene Infrastruktur
(n8n, Open WebUI, LibreChat, manibase-Worker, Cockpit). Leitsatz:
**konstant ist die Einführung, variabel ist die Plattform.**

## 4 · Argumente, in dieser Reihenfolge

**Rahmen (eine Sektion unter dem Hero, nicht im Hero):**
> Alles, was jetzt unstrukturiert eingeführt wird und woran sich die Belegschaft
> gewöhnt, führt in ein bis zwei Jahren zu einem schmerzhaften Transformationsprojekt.
> Jetzt ist das Fenster, es von Anfang an richtig zu bauen.

**Risiko vermeiden** (verschafft das Gespräch):
1. **Schatten-KI und Compliance** — keine Richtlinien, keine TOMs. manibase liefert
   Compliance-Check mit AVV, TOMs, VVT, vom DSB abgesegnet.
2. **Datensouveränität** — Entwürfe und geistiges Eigentum, kein US-Transfer, eigener
   Server, für hochsensible Daten lokale Verarbeitung möglich.

**Wert schaffen** (rechtfertigt das Budget):
3. **Kosten** — Lizenzmodelle skalieren linear mit der Kopfzahl. Von 150 Leuten brauchen
   vielleicht 20 einen Office-Copilot, die anderen 130 laufen tokenbasiert.
   Formulierung: **Sie zahlen Nutzung statt Plätze.**
4. **Firmen-Assets statt Abhängigkeiten** — als **Eigentumsfrage** formulieren („Was wir
   bauen, gehört Ihnen und bleibt, auch wenn es uns nicht mehr gibt"), **nicht** als
   Renditeversprechen. „steigert EBITDA" ist ohne Beleg verboten.
5. **Systemintegration** — gehört auf die IT-Unterseite, nicht auf die Startseite.

## 5 · Beweismittel, in dieser Rangfolge

1. **Architektur-Vergleich** *(existiert noch nicht → Platzhalter)*
2. **Screenshots** Open WebUI, n8n — ehrlich beschriften („So sieht der Zugang für Ihre
   Mitarbeitenden aus"). Es ist Open Source, nicht manibase-Eigenentwicklung.
   Cockpit **nicht** zeigen, UX noch nicht vorzeigbar.
3. **Das laufende Projekt als Tatsache:** „Wir führen derzeit bei einem Architekturbüro
   mit 18 Mitarbeitern ein KI-System ein." Freigabe liegt vertraglich vor. Kein Ergebnis
   behaupten.
4. **Gründer** — Nikolaus Schauersberger, 15 Jahre freiberuflicher Softwareentwickler ·
   Matthias Geisler, IT-Projektmanager für Dokumentenmanagementsysteme. Porträts liegen
   in `site/assets/`. **0 von 6 Wettbewerbern zeigen Gründergesichter.**
5. **Leerer Platz für das erste echte Kundenzitat.** Bewusst leer lassen.

**Risikoumkehr, wörtlich auf die Seite** (nur Du → Sie ändern):
> „Sie können mit dieser Roadmap gerne zur Konkurrenz gehen, das ist völlig in Ordnung.
> Oder wir machen daraus ein gemeinsames Projekt über sechs Monate."

**Kapazität statt Warteliste:**
> Wir arbeiten zu zweit und nehmen bis Jahresende drei Projekte an.
> Zwei Plätze sind vergeben.

Zahl nur nennen, wenn sie stimmt, und pflegen.

## 6 · Reibung und Umgang (zweispaltig, sechs Zeilen)

Der einzige Inhalt, den kein Wettbewerber abschreiben kann.

| Reibung | Umgang |
|---|---|
| Zwei bis drei Wochen passiert nichts Sichtbares (Verträge, Einrichtung beim IT-Dienstleister) | vorher sagen |
| Erfahrene Mitarbeitende ziehen nicht mit | AI Champions, interne Kommunikation, Schulung mit Zertifikat. **Nicht über die Leute spotten** |
| Use Cases müssen pivotieren | vorher ansagen: von fünf werden ein bis zwei ausgetauscht. Dann ist der Pivot Planbestätigung |
| Legacy-Systeme ohne echte Schnittstellen | „Wir sagen Ihnen im Klartag, was sich anbinden lässt und was nicht. Auch wenn Ihr Softwarehersteller etwas anderes behauptet." |
| Niemand kennt die realen Abläufe | „In jedem Betrieb wird anders gearbeitet, als es auf dem Papier steht. Deshalb sprechen wir mit der Arbeitsebene." |
| Fehlende Mitwirkung | Zeitaufwand vorher beziffern (Abschnitt 7) |

## 7 · Zeitaufwand des Kunden

> Rund eine Stunde pro Woche für fünf bis sechs Leute. Über sechs Monate **etwa drei
> Arbeitstage pro Person**. Dazu der Klartag (ein Tag, Geschäftsleitung + Führung + IT)
> und die Schulung.

**Auflagen:** „mindestens" mitsagen. Schulung und Test-Reviews sind **nicht** enthalten,
also nicht als Gesamtaufwand ausgeben.

## 8 · Seitenstruktur

**Startseite** (Reihenfolge):
Hero · Wertband (vier Argumente) · Videoabschnitt *(Platzhalter)* · Architektur-Vergleich
*(Platzhalter)* · Rahmen „Kosten des Wartens" · zwei Bausteine · fünf Kaufargumente ·
drei Stufen · Reibung und Umgang · Gründer · Kapazität · Termin.

**Unterseiten:**

| Seite | Inhalt |
|---|---|
| **Der Klartag** | Ablauf, Besetzung, Preis, Anrechnung, Risikoumkehr-Satz. Ersetzt `ki-klartag.html` |
| **Das Einführungsprojekt** | volle Roadmap (7 Schritte), Zeitaufwand, Abschlusskriterien |
| **Für Ihre IT** | Betrieb, Root, Patches, Ausfall, Backup, Entra ID, Datenwege, Region, Schnittstellen-Ehrlichkeit, Exit, Systemintegration |
| **Über uns** | Gründer, Werdegang, Haltung |
| **Veranstaltungen** | erst online, wenn ein Termin in der Zukunft liegt |

**Entfällt:** Karriere · Produktseiten für Bodo und PIA (erst wenn spruchreif) · Blog
als Blog. Stattdessen drei bis fünf **datumslose** Texte: Was eine KI-Einführung kostet ·
Copilot oder eigene Plattform · Schatten-KI und Haftung · warum Schnittstellen
versprochen und nicht geliefert werden.

**Bestand:** `infotermin.html`, `interessent.html`, `ki-klartag.html` sind alle
`noindex` und unverlinkt. `infotermin.html` bleibt als Vorlage für die
Veranstaltungsseite liegen (Widerspruch „Zoom" im Text gegen „Teams" in der Auswahl vor
Wiederverwendung bereinigen). Der Blogbeitrag „Papierkram am Chef" ist auf den alten
Zielkunden getextet → Kandidat für den Umzug auf matthias-geisler.com.

**Navigation:** 4 bis 6 Punkte oben (Median der Recherche: 5–6), ein CTA im Header
(11/11 Wettbewerber).

## 9 · Texte, die feststehen

**Hero:**
> **KI im Betrieb einführen. Strukturiert, und auf Ihre Abläufe zugeschnitten.**
>
> Ohne Lizenzchaos, ohne Schatten-KI. In sechs Monaten drei bis fünf Anwendungsfälle,
> die sich rechnen, und Mitarbeitende, die damit arbeiten können.

**Wertband, vier Felder:** kein teures Lizenzchaos · keine Schatten-KI · Anwendungsfälle
mit beziffertem Nutzen · befähigte Mitarbeitende.

**CTA primär:** „Machbarkeit klären", darunter klein:
*30 Minuten, mit der Geschäftsführung, gern zusammen mit Ihrer IT.*
**CTA sekundär:** „So läuft ein Klartag".

**Zu klären, bevor der Satz steht:** Wird im Klartag je Anwendungsfall eine Messgröße
festgelegt? Wenn ja: „Anwendungsfälle, deren Nutzen wir vorher beziffern." Wenn nein,
weicher formulieren.

**Verboten:** „individuell zugeschnitten" (Floskel) → „auf Ihre Abläufe, nicht auf eine
Branchenschablone". Keine Gedankenstriche im Text. Keine Buzzwords. Sie-Ansprache.
Button-Labels = Verb + Objekt.

## 10 · Maske vor dem Kalender (vier Schritte)

1. Mitarbeiterzahl
2. Art des Unternehmens — **beide Seiten anbieten**: Planungsbüro, Architekturbüro,
   TGA-Planung *und* Bauunternehmen, Dachdecker, Spengler, GaLaBau, SHK
3. Wer wäre dabei: Geschäftsführung · weitere Führungskräfte · IT.
   **Frage, keine Schranke.** Ohne Geschäftsführung erscheint ein Hinweis, keine
   Blockade: „Erfahrungsgemäß führt ein Gespräch ohne Geschäftsführung selten weiter.
   Wir sprechen trotzdem gern mit Ihnen und planen dann einen zweiten Termin ein."
4. Kontakt und Einwilligung, so knapp wie möglich

Wizard-Mechanik und Zeeg-Prefill existieren bereits in `site/scripts/site.js`, nur die
Fragen wechseln. Kalender lädt erst nach Abschluss und Einwilligung.

## 11 · Optik

**Vorgabe:** cleaner, aufgeräumter, ruhiger. Capmo-Richtung. Heller Hintergrund, guter
Kontrast, dezente Stilmittel. **Keine großen Farbflächen mehr.**

**Ist-Zustand: fünf vollflächige dunkle oder farbige Bänder** (Hero-Duotone, `.folge`
Cobalt, `.ctaband` Ink, `.newsletter` Cobalt, Footer). Capmo hat eines.
**Ziel: höchstens eines, dunkel, nahe dem Footer.**

**Farbverteilung neu: 88 / 6 / 5 / 1**

| Farbe | Rolle | Fläche |
|---|---|---|
| Off-Weiß-Treppe | Leinwand | ~88 % |
| `#14224F` Tiefblau | Fließtext und Überschriften statt Schwarz, **ein** dunkles Band, Schattenton | ~6 % |
| `#2F3FDB` Cobalt | nur Buttonfläche, Link, Icon-Strich, Häkchen, aktiver Zustand. **Keine Cobalt-Sektion** | ~5 % |
| `#F2D414` Gelb | einmal pro **Seite**, nicht pro Screen. Als Buttonfläche entfällt es | ~1 % |

**Offene Entscheidung, beim Bau mit Vergleich vorlegen:** Bleibt die warme Leinwand
`#F8F4EC`, oder wird sie durch eine **kühle** Off-Weiß-Treppe ersetzt (Vorbild Cosuno:
`#f8fafc`, `#f1f5fa`, `#f4f6fb`)? Die Wärme ist das, was „kleiner Betrieb" signalisiert.
Cobalt, Tiefblau und Gelb bleiben in jedem Fall unverändert — ein Palettenwechsel wäre
ein Markenwechsel und war nicht der Auftrag.

**Die acht Ruhe-Hebel** (gemessen an Capmo, Cosuno, Plancraft):

1. Überschriften auf `font-weight: 400` — stärkster Einzelhebel
2. höchstens ein eingefärbtes Band pro Seite
3. Off-Weiß-Treppe mit 1–3 Helligkeitsstufen statt Farbe
4. Schatten **nie schwarz**, in Markenfarbe:
   `0 4px 10px rgba(20,34,79,.10), 0 20px 50px rgba(20,34,79,.05)`
5. Markenfarbe nur auf Buttons, Links, Icons
6. Body `line-height: 1.75`
7. Sektionspolsterung 4–5rem
8. Trennlinien blaugrau getönt

**Startwerte:** Karten-Radius 8–12px · Karten-Padding 1.5–2rem · Rahmen `1px solid
#E8E2D6` (bei kühler Leinwand entsprechend anpassen) · H1 `clamp(2.75rem, …, 4.25rem)`
in Sora **400** statt 600/700 · Body 1rem/1.75 · Haarlinie `#DCE0F7`.

**Schrift bleibt:** Sora (Display), Hanken Grotesk (Body), JetBrains Mono nur für
Zahlen. Selbst gehostet.

**Bildsprache:** Produkt-Screenshot, echte Fotos, monochrome Logos, Outline-Icons.
**Keine Maskottchen** (null Treffer bei sieben Wettbewerbern). Die Helfer-Sektion
„Unsere Helden" entfällt auf der Startseite.

## 12 · Platzhalter

Erlaubt an **genau zwei** Stellen: Videoabschnitt und Architektur-Vergleich.

- Müssen wie Absicht aussehen, nicht wie Vergessen. Sauber gesetzter Bereich, eine
  Zeile Erklärung („Dieser Bereich wird gerade erweitert"), kein grauer Kasten mit
  „Bild folgt".
- **Nicht erlaubt** bei Gründern, Leistungen, Ablauf, Preisen, Kontakt. Diese
  Abschnitte sind vollständig oder gar nicht.
- Video später **selbst hosten**, kein YouTube oder Vimeo (Drittanbieter-Verbindung vor
  Einwilligung). **Klick zum Abspielen**, kein Autostart.
- Vorschlag für das Video: **animiertes Architekturdiagramm**, nicht Zeichentrickfiguren.
  Erstes Standbild = statisches Hero-Bild. Ein Asset, zwei Verwendungen.

## 12a · Stand der Umsetzung (4.8.2026)

**Gebaut und committet** (`531b37b`):

| Datei | Was daran neu ist |
|---|---|
| `site/index.html` | vollständig neu geschrieben. Alle Sektionen aus Abschnitt 8, beide Platzhalter, Maske auf vier Schritte |
| `site/styles/tokens.css` | Redesign-Block am Ende: kühle Off-Weiß-Treppe als Standard, warme Variante über `<html data-canvas="warm">`, Schatten in Markenfarbe, ruhigere Radien, `--fw-heading:400` |
| `site/styles/site.css` | Redesign-Schicht am Ende. Überschreibt bewusst zuletzt, damit Impressum, Datenschutz, Blog und Infotermin unverändert funktionieren |

**Unangetastet:** `impressum.html`, `datenschutz.html`, `api/`, `scripts/site.js`,
`blog/`, `infotermin.html`, `interessent.html`, `ki-klartag.html`.

**Neue CSS-Klassen:** `.hero--calm` · `.ph` (Platzhalter) · `.frame` · `.mods`/`.mod` ·
`.args`/`.arg` · `.stages`/`.stage-price` · `.frict` · `.capacity`.

**Aus fünf Farbbändern ist eines geworden:** nur noch `.ctaband` vor dem Footer.
`.folge`, `.newsletter` und das Cobalt-Gründerband kommen auf der Startseite nicht mehr
vor. Die Klassen bleiben im Stylesheet, weil andere Seiten sie nutzen.

**Screenshots** liegen in diesem Ordner: `v2-kuehl-1..3.png` (kühl, 1440 px),
`v2-warm-1..3.png` (warm, zum Vergleich), `v2-mobil-1..2.png` (390 px).

### Offen, blockiert die Unterseiten

- [ ] **Kühle oder warme Leinwand.** Umschalten kostet ein Attribut am `<html>`-Element.
      Standard ist derzeit kühl.

### Noch nicht gebaut

Die vier Unterseiten aus Abschnitt 8 (Klartag, Einführungsprojekt, Für Ihre IT,
Über uns). Die Navigation zeigt deshalb ausschließlich auf Abschnitte der Startseite.

## 13 · Was zu tun bleibt, nach dem Bau

- Architektur-Vergleich zeichnen (**fair**: echte Vorteile der Microsoft-Seite nennen,
  sonst unglaubwürdig). Achse: **gewachsen gegen gebaut**, nicht manibase gegen Microsoft
- Screenshots Open WebUI und n8n
- Videoskript und Produktion, DSB-Freigabe zur KI-Kennzeichnung
- Lizenzpreise verifizieren, bevor eine Kostenaussage veröffentlicht wird
- `PRODUCT.md` und `CLAUDE.md` nachziehen: branchenoffen → Bau · 10–20 MA → 100–200 ·
  60/30/10 → 88/6/5/1 · 1.800 € (16 Nennungen) auflösen
- Schulungsdauer pro Kopf und Zeitanteil der Geschäftsführung nachtragen (E21)
- Klartag-Besetzung überdenken: Arbeitsebene fehlt (E22)
- Einwand-Log füllen, dann die IT-Unterseite schärfen
