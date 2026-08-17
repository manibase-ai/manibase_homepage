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
| **2 Klartag** | Diagnose- und Entscheidungstag, 3.900 € netto, wird beim Folgeprojekt **voll angerechnet**. Ergebnis: Roadmap |
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

### Entschieden am 4.8.2026

- **Kühle Leinwand.** Begründung des Kunden: nehmen, was der Wettbewerb macht und sich
  bewährt hat. Deckt sich mit der Messung: Capmo `#f4f6f6`, Cosuno `#f1f5fa`,
  Plancraft `#f8f8f8`. Die warme Variante bleibt über `data-canvas="warm"` erhalten,
  wird aber nicht mehr gepflegt.
- **Buttons eckig statt rund** (Capmo-Richtung): `border-radius:4px`. Eingabefelder 6px,
  Auswahlkarten 8px, Inhaltskarten 12–16px. Die Abstufung ist Absicht: je kleiner das
  Element, desto kantiger.

### CTA-Rhythmus: vier Anker über die Seitenlänge

| Position | Ort auf der Seite | Umsetzung |
|---|---|---|
| **~10 %** | Hero | „Machbarkeit klären" plus sekundär „So läuft ein Klartag" |
| **~50 %** | nach dem Vergleich *gewachsen gegen gebaut* | `.ctamid`, nach Hook und Re-Hook |
| **~75 %** | nach den drei Stufen, also nach der Angebots- und Preiserklärung | `.ctamid` |
| **100 %** | dunkles Band plus Buchungsmaske | `.ctaband` und `#termin` |

**Dazwischen bewusst keine Knöpfe.** Wertband, Video, Rahmen, Bausteine, Argumente,
Reibung und Gründer bleiben frei, damit der Leser die Argumentation am Stück lesen kann.

**Bekannte Spannung:** Der Knopf im Kopfbereich ist sticky und damit immer sichtbar,
was der Idee einer Pause widerspricht. Er bleibt trotzdem, weil 11 von 11 untersuchten
Wettbewerbern einen führen und er die Haupt-Conversion-Fläche für wiederkehrende
Besucher ist.

### Die vier Unterseiten, gebaut am 4.8.2026

| Datei | Inhalt |
|---|---|
| `site/klartag.html` | Seitenkopf, Kennzahlenband (ein Tag · 3.900 € netto · voll anrechenbar · Roadmap), „Warum ein ganzer Tag", vier Blöcke Ablauf, Besetzung beider Seiten, vier Ergebnisse, Preis und Anrechnung als Frage-Antwort, **Risikoumkehr-Satz wörtlich**, dunkles Band |
| `site/einfuehrungsprojekt.html` | Kennzahlenband, **volle Sieben-Schritte-Roadmap** im vorhandenen `.tl`-Bauteil, Zeitaufwand nach E21 mit „mindestens" und dem Hinweis, dass Schulung und Tests nicht enthalten sind, vier Abschlusskriterien, Preistreiber ohne Zahl |
| `site/fuer-ihre-it.html` | Leitsatz „konstant ist die Einführung", zwei Betriebsmodelle, drei Frage-Antwort-Blöcke (Betrieb und Verantwortung · Daten, Anmeldung, Unterlagen · Anbindung, Eigentum, Ausstieg), „was wir brauchen und was nicht". Trocken, ohne Verkaufston |
| `site/ueber-uns.html` | beide Gründer mit Werdegang, fünf Sätze Haltung, laufendes Projekt als Tatsache, Kapazitätsaussage, Firmendaten |

**Neue CSS-Klassen** (Redesign-Schicht am Ende von `site.css`): `.phero` ·
`.factband` (nutzt `.valueband__grid`) · `.qa`/`.qa__row` · `.grouphead` ·
`.founder--lg` · `.founder__facts` · Zustand `a[aria-current="page"]`.

**Navigation jetzt fünf Punkte** plus ein CTA im Kopf: Was wir machen (Startseite) ·
Der Klartag · Das Projekt · Für Ihre IT · Über uns. Nachgezogen in Kopf, Mobilmenü und
Fuß aller Seiten. Auf der Startseite zeigen zusätzlich der sekundäre Hero-Knopf auf
`klartag.html`, Stufe 2 und 3 der Stufenliste auf die jeweilige Unterseite, Argument 2
auf `fuer-ihre-it.html` und das Gründerband auf `ueber-uns.html`.

**Jede Unterseite trägt genau ein eingefärbtes Band** (`.ctaband` vor dem Fuß), sonst
Off-Weiß-Treppe. Kein Platzhalter auf den Unterseiten: sie sind vollständig oder
stünden nicht da.

**Geprüft:** kein horizontaler Überlauf bei 390 px auf allen fünf Seiten
(`scrollWidth == clientWidth`), Sichtprüfung bei 1440 px.

**Bewusst offen gelassen**, weil es Kundenentscheidungen sind:

- Der Klartag nennt seit der Preisentscheidung vom 13. August 2026 einen Festpreis von
  **3.900 € netto**. Vorbereitung, Durchführung und schriftliche Roadmap sind enthalten.
- Die Besetzung des Klartags nennt die Arbeitsebene als **Bitte an den Kunden**
  („für einzelne Themen jemand aus der Praxis"), nicht als festen Bestandteil. Der
  Widerspruch aus E22 ist damit entschärft, aber nicht entschieden.
- `ki-klartag.html` ist inhaltlich abgelöst, liegt aber weiter im Ordner
  (`noindex`, unverlinkt; Preis zur Vermeidung eines Widerspruchs aktualisiert). Löschen oder liegen lassen ist eine
  Entscheidung, keine Bauaufgabe.

## 12b · Nachschärfung am 4.8.2026 (Textmenge, Typografie, Akzente)

### Gemessen statt geschätzt

Startseiten der Wettbewerber geladen und mit derselben Methode ausgezählt wie die
eigenen Seiten (sechs von elf lieferten aus, plancraft und craftnote blocken):

| Seite | Wörter | Fließtext in `<p>` | Ø Absatz | **Bilder** |
|---|---|---|---|---|
| capmo | 1531 | 1300 in 48 | 27 W | **109** |
| sablono | 1389 | 908 in 118 | 8 W | 45 |
| moser | 1292 | 935 in 44 | 21 W | 31 |
| cosuno | 1282 | 676 in 32 | 21 W | 70 |
| hero | 1206 | 735 in 61 | 12 W | 105 |
| nevaris | 980 | 844 in 46 | 18 W | 99 |
| manibase Start (vorher) | 1647 | 1117 in 49 | 23 W | **3** |

**Befund: nicht die Textmenge war das Problem, sondern das Fehlen von Bildern.**
Gleiche Menge Text, aber nichts, wo das Auge sich ausruht. Der wirksamste Hebel gegen
den Eindruck „Textschlacht" ist deshalb nicht Kürzen, sondern die offenen Punkte aus
Abschnitt 13 (Schaubild, Screenshots Open WebUI und n8n).

### Trotzdem gekürzt (Kundenentscheidung)

Startseite 1647 → **1358 Wörter im `<main>`**, Für Ihre IT 1134 → **864**. Gekürzt wurde
nur Wiederholung: der Microsoft-Absatz im Vergleich, die Leads unter zwei H2, die
rechte Spalte der Reibungszeilen, die Stufenbeschreibungen (die Unterseiten führen sie
jetzt aus), zweite Absätze in den IT-Antworten. Kein Argument ist entfallen.

### Typografie auf die Vorgabe aus §11 korrigiert

| | vorher | jetzt | Capmo |
|---|---|---|---|
| H1 | 56px | **44 bis 68px** | 68px |
| Body | 17px | **16px** | 16px |
| Sprung H1 zu Body | 3,3× | **4,25×** | 4,25× |

Die H1 der Startseite läuft dafür über **beide Spalten** des Hero, darunter erst Text
und Schaubild. In einer halben Spalte wäre sie bei 68px fünfzeilig.

### **Bug gefunden: 13 zerbrochene `clamp()`**

In CSS brauchen `+` und `-` innerhalb von `clamp()` und `calc()` **Leerzeichen**.
`clamp(1.3rem,1.05rem+1.1vw,1.95rem)` ist ungültig, der Browser verwirft die
**gesamte Deklaration**. Betroffen waren unter anderem `.frame__quote` (rendert 16px
statt 31px), `.vstat b`, `.wstep__q` im Buchungs-Wizard, `.founders__claim`,
`.ticket__price b` und vier Sektionspolsterungen. Teils seit der ersten Fassung der
Seite live. Alle 13 Stellen korrigiert, Prüfausdruck:

```bash
grep -nE "(clamp|calc)\([^)]*[0-9a-z]%?[+-][.0-9]" site/styles/*.css
```

### Akzente zurückgeholt

Nach dem Redesign war die Marke nur noch auf Knöpfen sichtbar, Gelb auf den hellen
Seiten gar nicht mehr. Neu, ohne eine einzige Fläche einzufärben:

- **Kennzahlen in Cobalt** (`.factband .vstat b`), tragen Farbe über die Seitenlänge
- **Genau eine Gelb-Geste je Seite** auf der hellen Leinwand: Marker auf „Strukturiert"
  (Start), „Klartag", „sechs Monate", „verkauft nichts". Über uns trägt den gelben Punkt
  der Wortmarke in der H1
- **Knopf im dunklen Band von Gelb auf Papierweiß** (`.btn--paper`), weil §11 sagt, als
  Buttonfläche entfällt Gelb. Dadurch erscheint Gelb je Seite genau einmal
- **Cobalt-Oberkante auf `.mod`-Karten**, Häkchen auf getönter Scheibe, Ziffern der
  Argumentliste als Chip

### Maße am Kopfbereich an Capmo angeglichen

Werte aus Capmos eigenem Stylesheet gemessen, nicht aus dem Screenshot geschätzt:

| | Capmo | manibase vorher | manibase jetzt |
|---|---|---|---|
| Container | `max-width:80rem` + `padding:1.5rem` = **1232px Inhalt** | 1160px, Polster 40px = 1080px | **1232px** |
| Kopfleiste | `.navbar-2 height:92px` | ca. 62px | **92px** |
| Luft Leiste bis Kicker | `padding-top:13rem` minus Leiste = **116px** | 80px | **116px** |
| Sektionspolster | `.section padding:4rem 0` | 88px | **64px** |
| H1 | `4.25rem/400`, volle Containerbreite | 68px, auf 24ch gedeckelt, 3 Zeilen | **68px, 2 Zeilen** |
| Anordnung | Logo, Menü direkt daneben, Knopf ganz rechts | Menü rechtsbündig | **wie Capmo** |

Der `ch`-Deckel war der Grund, warum die Überschrift zu groß wirkte: gleiche
Schriftgröße wie Capmo, aber drei statt zwei Zeilen.

**Kicker-Zeile im Hero** ergänzt („KI-Einführung für Bau- und Planungsunternehmen"),
wie Capmos „Nr. 1 Bauprojektmanagement-Software für D-A-CH". Damit hat auch die
Startseite den Aufbau Kicker, Überschrift, Unterzeile, zwei Knöpfe.

**Gelb-Geste der Startseite verschoben:** vom 68px-H1 auf die 38px-H2 „Warten wird
teurer". Der Marker war in der Überschrift 330 × 80 Pixel groß, jetzt 138 × 53.
Capmo setzt seinen grünen Marker ebenfalls auf eine kleine Zeile, nicht auf die H1.

### Hero neu getextet, und eine Korrektur an der Positionierung (4.8.2026, Kunde)

**Neuer Hero:**

> **Kicker:** Ihr Partner für KI-Einführungsprojekte in Bau-, Planungs- und
> Handwerksunternehmen
>
> **H1:** Strukturierte KI-Einführung für Ihren Betrieb. Auf Ihre Prozesse abgestimmt.
>
> **Unterzeile:** Wir bauen das Fundament, auf dem Ihre Leute KI sicher und mit echtem
> Nutzen einsetzen. Verwaltung und Bürokratie werden einfacher, damit Ihre Fachkräfte
> wieder Zeit für die Arbeit haben, für die Sie sie eingestellt haben.
>
> **Drei Marker darunter:** Ihre Daten bleiben im Unternehmen · DSGVO-konform, Server in
> Deutschland · Auf Ihre Abläufe gebaut, nicht auf eine Schablone

Damit ist der Hero-Text aus Abschnitt 9 **abgelöst**. H1 auf `4rem` statt `4.25rem`,
weil die neue Überschrift bei 68px auf drei Zeilen mit Waisenzeile bricht, bei 64px auf
zwei volle. Gemessen im Browser, nicht geschätzt.

**Der zentrale Nutzen ist jetzt benannt:** Verwaltungs- und Bürokratieprozesse mit KI
vereinfachen, damit Fachkräfte wieder das tun, wofür sie ausgebildet sind. Das ist ein
anderer Einstieg als die Reihenfolge aus Abschnitt 4, die mit Risiko (Schatten-KI,
Datensouveränität) eröffnet. **Beides passt zusammen**, wenn der Nutzen führt und Risiko
und Kosten dahinter kommen. Es ist ausdrücklich **nicht** die Rückkehr zu „Holen Sie
sich Ihre Abende zurück": dort ging es um den Feierabend des Inhabers, hier um den
Fachkräftemangel im Betrieb, und das ist ein Thema der Geschäftsführung.

**Zielgruppe bewusst noch offen** (Korrektur zu Abschnitt 2): nicht nur Bau und Planung,
sondern auch ausführende Gewerke wie SHK, für die Software wie Bodo entsteht. Die
Trennlinie ist die **Größe, nicht das Gewerk**: der kleine Handwerksbetrieb gehört
weiter auf matthias-geisler.com, das große Handwerksunternehmen ist Zielkunde
(Anlass: Anfrage Schwender). Deshalb im Kicker „Handwerks**unternehmen**", nicht
„Handwerks**betrieb**". Die eigentliche Größenauswahl leistet nicht die Überschrift,
sondern Schritt 1 der Maske (Mitarbeiterzahl).

**CTA geändert (Kundenentscheidung):** „Machbarkeit klären" wurde ersetzt durch
**„Sprechen Sie uns an"**, an allen 29 Stellen auf fünf Seiten, inklusive der
Überschrift der Buchungssektion. Damit ist die Festlegung aus E25 abgelöst. Der
Kleintext darunter („30 Minuten, mit der Geschäftsführung, gern zusammen mit Ihrer IT")
bleibt und trägt weiter die Auswahlfunktion aus E16. Der neue Knopf ist niedrigschwelliger,
sagt aber nicht mehr, was im Gespräch passiert, und denkt das mögliche „geht nicht"
nicht mehr mit. Das leistet jetzt allein der Kleintext.

**Sprachlich korrigiert:** „Bauplanungs- und Handwerksunternehmen" wurde zu
„Bau-, Planungs- und Handwerksunternehmen". „Bauplanungsunternehmen" ist kein
gängiges Wort, die Branche sagt Planungsbüro oder Ingenieurbüro.

### Struktur- und Kontrastrunde (4.8.2026, Kunde)

- **Hero gekürzt** auf „Strukturierte KI-Einführung für Ihren Betrieb", gelber Punkt aus
  der Wortmarke dahinter. Kleintext „30 Minuten …" im Hero entfällt, die drei
  Vertrauens-Marker sind gekürzt und stehen jetzt direkt unter den Knöpfen.
- **Buchstabenabstand:** Capmo setzt auf Überschriften **keine** negative Laufweite, alle
  ihre `letter-spacing`-Werte sind positiv und gelten Kleintext und Knöpfen. Unsere
  Überschriften liefen auf `-0.02em`. Jetzt `normal`, das war die Ursache des gedrängten
  Eindrucks.
- **Bereichsüberschriften** von max 38px auf **44px**.
- **Wertband ersetzt** durch vier Leistungsbereiche auf **Tiefblau**: Diagnose ·
  Hauseigene KI-Plattform · Training für Ihre Mitarbeiter · KI-Softwarelösung. Nummern
  in Gelb. Das ist zugleich die Kontrastfläche nach Capmo-Vorbild.
- **Gelb-Akzente** aus der Wortmarke: `.dot-y` (der Punkt) und `.uline` (gelbe
  Unterschrift unter Schlüsselbegriffen). Aktuell sieben Gelb-Stellen auf der Startseite.
- **Zwei Querformat-Platzhalter** direkt unter dem Hero, an der Stelle, wo Capmo seine
  Medienreihe hat: (1) Notebook mit der KI-Oberfläche, (2) Dashboard mit den Helfern
  zur Auswahl. Beschriftung bleibt ehrlich: die Oberfläche ist Open Source, die Helfer
  darin sind Eigenbau.

**Damit stehen vier Platzhalter auf der Startseite** statt der zwei aus §12. Bewusste
Kundenentscheidung, die Regel ist damit aufgehoben.

**Zwei Punkte zum Nachziehen in den Produktunterlagen:** Der Baudokumentationshelfer
heißt beim Kunden jetzt **Bernd**, in E2 und E4 steht **Bodo**. Und E4 hält fest, dass
**Anton** kein Konzept hat und **PIA** noch Pilotpartner sucht. Ein Dashboard-Bild mit
allen dreien darf deshalb nicht suggerieren, dass alle drei heute lieferbar sind.

### Firmendaten

`i. G.` an 18 Stellen in 12 Dateien entfernt. Impressum-Registerblock jetzt:
Amtsgericht Würzburg, **HRB 18632**.

## 13 · Was zu tun bleibt, nach dem Bau

- Architektur-Vergleich zeichnen (**fair**: echte Vorteile der Microsoft-Seite nennen,
  sonst unglaubwürdig). Achse: **gewachsen gegen gebaut**, nicht manibase gegen Microsoft
- Screenshots Open WebUI und n8n
- Videoskript und Produktion, DSB-Freigabe zur KI-Kennzeichnung
- Lizenzpreise verifizieren, bevor eine Kostenaussage veröffentlicht wird
- **Bilder sind der größte offene Hebel** (3 gegen 31 bis 109 im Wettbewerb, siehe 12b)
- `PRODUCT.md` und `CLAUDE.md` nachziehen: branchenoffen → Bau · 10–20 MA → 100–200 ·
  60/30/10 → 88/6/5/1 · 1.800 € (16 Nennungen) auflösen · „i. G." ist raus, HRB 18632
- Schulungsdauer pro Kopf und Zeitanteil der Geschäftsführung nachtragen (E21)
- Klartag-Besetzung überdenken: Arbeitsebene fehlt (E22)
- Einwand-Log füllen, dann die IT-Unterseite schärfen

### Wiedervorlage · Geschäftsmodell und Angebotsarchitektur

- IP- und Lizenzgrenze verbindlich festlegen: manibase-eigene Helfer, kundeneigene
  Individualisierungen, Quellcode, Nutzungsrechte und Exit-Szenario
- Retainer-Leistungsumfang, Servicelevel, Wartung, Support und Weiterentwicklung
  als belastbares Angebotspaket definieren
- Lieferkosten, Deckungsbeitrag, Kapazitätsgrenze und Finanzmodell ergänzen
- Produkt-Roadmap und Reifegrade für Bernd/Baudokumentation, PIA und Anton pflegen;
  nichts als lieferbar darstellen, was noch Konzept oder Pilot ist
- Schulungsdauer, Testaufwand und Zeitanteil der Geschäftsführung beziffern
- Besetzung und Methodik des Klartags einschließlich Arbeitsebene entscheiden
- Übergabe und Weiterleitung zwischen manibase.de und matthias-geisler.com festlegen
- Vertriebskennzahlen, Qualifizierung und CRM-Prozess ergänzen

### Wiedervorlage · weitere Leistungs-Unterseiten

Unter dem Navigationspunkt „Strukturierte KI-Einführung“ beziehungsweise
„KI-Einführungsprojekt“ später eine Unterseitenstruktur vorsehen. Inhalt und Benennung
werden separat entschieden; zunächst nur als Informationsarchitektur vormerken:

- Eigene KI-Plattform
- Entwicklung und Priorisierung der Use Cases
- Automatisierung und Prozessoptimierung
- Einführung, Training und Change-Management
- Compliance, Datenschutz und Betriebsmodell

Diese Seiten sind **nicht Teil der aktuellen Designrunde**. Erst Navigation und Inhalte
gemeinsam festlegen, dann bauen; keine leeren oder dünnen Unterseiten veröffentlichen.
