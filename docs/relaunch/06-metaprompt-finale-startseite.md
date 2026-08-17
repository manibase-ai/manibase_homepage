# Metaprompt: finale Startseite live stellen

**Stand:** 14. August 2026
**Status:** verbindlicher Umsetzungsauftrag
**Ziel:** Aus dem geprüften Mockup `index-mockup-strategie-v2.html` wird die echte, veröffentlichungsfähige `site/index.html`, mit echten Bildern, gesetzten Reifegraden und funktionierender Buchungsstrecke.

> Dieses Dokument ist der Auftrag. Inhaltliche Referenz bleibt `START-HERE-STARTSEITENSTRATEGIE.md`, gestalterische Referenz `docs/research/2026-08-14-startseiten-mockup-strategie-02.md`, Bewertungsgrundlage `docs/research/2026-08-14-visual-report-v2-vs-live.md`. Bei Widerspruch gilt dieses Dokument.

---

## 1. Was vorher fehlte

Die V2 war als Mockup gut, aber nicht veröffentlichungsfähig. Sechs harte Lücken:

| # | Lücke | Auswirkung |
|---|---|---|
| 1 | **Kein Konversionspunkt.** V2 hatte keinen `#termin`, kein Formular, keinen Kalender. Der finale CTA verlinkte auf die alte Startseite. | Die Seite konnte niemanden buchen lassen. |
| 2 | **Kein einziges inhaltliches Bild.** Elf Abschnitte, null Fotos, dafür drei sichtbare gestrichelte Platzhalterkästen. | Blatt 02 war mit 1.828 px die längste Sektion der Seite und bestand zu großen Teilen aus Löchern. |
| 3 | **Drei Prüfstempel „Reifestatus offen“** nebeneinander bei Bernd, Anton und Willy. | Las sich wie „Produkt gibt es noch nicht“. |
| 4 | **`noindex,nofollow` und ein schwarzes Mockup-Banner** über der Seite. | Nicht auffindbar, höchster Kontrast der Seite lag auf einem Disclaimer. |
| 5 | **Elf nummerierte Blätter.** Blattkopf plus Maßlinie vor jedem Abschnitt. | Rhythmus kippt in Systemgeräusch, 31 Mono-Labels auf einer Seite. |
| 6 | **Alte Seitenlogik im Rest der Site.** Navigation, Meta-Texte und Unterseiten trugen noch „mindestens drei Anwendungen“ und die Sechsmonatslogik. | Widerspruch zur neuen Startseite. |

---

## 2. Entscheidungen, die mit diesem Auftrag getroffen sind

Damit gebaut werden kann, sind zwei offene Punkte hiermit entschieden. Beide sind später ohne Umbau änderbar.

### 2.1 Werkplansatz wird auf vier Blätter reduziert

Die Blattköpfe bleiben das gestalterische Rückgrat, aber nur noch dort, wo die Seite tatsächlich eine neue Ebene betritt:

| Blatt | Abschnitt |
|---|---|
| 01 | Drei Arbeitssituationen |
| 02 | Das manibase-System |
| 03 | Der Klartag |
| 04 | Architektur für Ihre IT |

Alle übrigen Abschnitte bekommen normale Überschriften. **Begründung:** Der Werkplansatz trägt die Branchenbedeutung dann immer noch, verliert aber die Redundanz. Elf Blattköpfe erklären nichts, was vier nicht auch erklären.

### 2.2 Reifegrade sind gesetzt (Vorgabe der Geschäftsführung vom 14. August 2026)

| Helfer | Aufgabe | Ampel | Öffentlicher Status |
|---|---|---|---|
| **Bernd** | Baudokumentation | grün | **im Einsatz** |
| **Willy** | Wissensmanager | gelb | **in Pilotierung** |
| **Anton** | Angebotsassistenz | rot | **Entwicklung steht an** |

Die Ampel wird nicht als Warnung inszeniert, sondern als Sachangabe im Datenblattkopf. Rot heißt hier ausdrücklich „noch nicht buchbar“, nicht „defekt“. Die Bestehende `.ampel`-Komponente in `site/styles/site.css` (`--success` / `--warning` / `--error`) liefert die Farben.

**Wichtig für die Copy:** Anton darf mit rotem Status nicht so beschrieben werden, als könne man ihn heute kaufen. Formulierung deshalb im Futur beziehungsweise als Planungsstand.

---

## 3. Bildinventar

Alle Bilder sind KI-generiert und werden gekennzeichnet. Keine echten Kundenartefakte, keine erfundenen Firmen, keine lesbaren Fremddaten.

### 3.1 Verwendet

| Slot | Quelle in `Downloads` | Ziel in `site/assets` | Motiv |
|---|---|---|---|
| Hero quer | `Hero.png` | `hero-plan.webp` | Plan mit gelbem Stift, Baustelle im Fenster, sonnig |
| Hero hoch | `Hero 4zu5.png` | `hero-plan-hoch.webp` | dasselbe Motiv im Hochformat für Mobil |
| Situation 01 Wissen | `ChatGPT Image … 18_13_15.png` | `sit-wissen.webp` | Ordner und Blätter, Text vollständig zu grauen Balken abstrahiert, cobaltfarbene Klammer markiert die Fundstelle |
| Situation 02 Dokumentation | `ChatGPT Image … 18_19_57.png` | `sit-doku.webp` | staubiger Plan, Handy mit dunklem Display, abstrahierte Handschrift, sauberes Blatt mit cobaltfarbenem Haken |
| Klartag | `ChatGPT Image … 17_56_58.png` | `klartag-raum.webp` | leerer Besprechungsraum, Bewertungsmatrix und gelber Stift auf dem Tisch |
| Willy | `Willy WIssensmanager.png` | `helfer-willy.webp` | Eule mit Ordnern, bereits freigestellt |
| Signet | `Manibase Logo.png` | `signet.png` | ersetzt die bisherige niedrigere Auflösung |
| Wortmarke | `Manibase Logo Text.png` | `wortmarke.png` | nur für Favicon, OG-Bild und Druck |

Jedes Inhaltsbild wird in zwei Breiten ausgeliefert (`…-800.webp` und `…-1600.webp`) und über `srcset` eingebunden. Jedes bekommt einen Alternativtext, der das Motiv beschreibt, und eine sichtbare Bildunterschrift mit dem Zusatz **„KI-generierte Illustration“**.

### 3.2 Nicht verwendet und warum

| Datei | Grund |
|---|---|
| `02a Wissen.png` | vollständig lesbarer englischer Text, „PROJECT PHOENIX“, „Q1 FINANCIAL REPORT“. Weder deutsch noch Bau, und die Abstraktionsregel ist verletzt. |
| `ChatGPT Image … 17_47_51.png` | erfundene Firma „BAUWERK Projekt GmbH“ mit Logo, Namen, Unterschrift, grüner Haken außerhalb der Palette. |
| `ChatGPT Image … 17_59_46.png` | erfundene Firmen samt echter Koblenzer Straßenadressen und einer Gesamtsumme von 753.412,80 Euro. Das ist simulierter Kundenbeleg und ausdrücklich verboten. |
| `ChatGPT Image … 18_05_56.png` / `18_19_50.png` | zweite Hero-Variante, kühl und ohne Gelb-Geste. Gute Datei, aber die Startseite braucht nur einen Hero. Vorgesehen als Aufmacher für `klartag.html` oder `fuer-ihre-it.html`. |

### 3.3 Noch offen

| Slot | Was fehlt |
|---|---|
| Situation 03 Angebote | Motiv im Stil von `sit-wissen`: Ausschreibungsordner links, strukturierter Arbeitsstand rechts, **Text vollständig zu grauen Balken abstrahiert**, eine cobaltfarbene Markierung. Prompt steht in `docs/research/bildprompts-zum-einpflegen.md`. |
| Bernd, Anton | Avatare fehlen; nur Willy liegt vor. |

Solange sie fehlen, wird kein Platzhalterkasten gezeigt. Der dritte Situationsblock läuft ohne Bild und ist dafür bewusst als textstarker Abschluss der Reihe gesetzt; die Helferblätter tragen die Ampel statt eines Avatars. Beides ist ein Einzeiler an Änderung, sobald die Dateien da sind.

---

## 4. Was gebaut wird

### 4.1 Neue Startseite

`site/index.html` wird vollständig ersetzt. Grundlage ist die Struktur der V2, mit diesen Änderungen:

1. Mockup-Banner, `noindex,nofollow` und alle Mockup-Vermerke entfallen.
2. Titel, Meta-Description, Canonical, Open-Graph und Twitter-Card werden gesetzt.
3. Der Hero bekommt das echte Bild und wird entrümpelt: der schwarze Platzhalter-Balken und das sechszeilige Schriftfeld fallen weg.
4. Blatt 02 wird neu gebaut: pro Arbeitssituation eine Zeile aus Bild und Kette, im Wechsel links und rechts. Die gestrichelten Platzhalter verschwinden ersatzlos.
5. Das Systembild rückt direkt hinter die Arbeitssituationen. Es ist das stärkste vorhandene Element und erklärt das Angebot in einem Blick.
6. Die Helfer bekommen Ampel und Statuszeile statt „Reifestatus offen“.
7. Der Klartag-Abschnitt bekommt das Besprechungsraum-Bild.
8. Vor dem Footer steht die vollständige Buchungsstrecke `#termin` aus der alten Startseite: Qualifizierungsmaske mit fünf Schritten, danach der Zeeg-Kalender.
9. Das Inline-Skript `document.documentElement.className+=' js'` gehört zwingend in den `<head>`, sonst blitzen alle Maskenschritte beim Laden auf.
10. Footer und Navigation werden auf die echte Seitenstruktur gesetzt.

### 4.2 Farbverteilung

Die Live-Seite lag gemessen bei 85 Prozent hellen Neutrals, 0,38 Prozent Cobalt und 0,07 Prozent Gelb. Vorgabe sind 60/30/10. Die dunklen Bänder der V2 sind deshalb keine Geschmacksfrage, sondern die Korrektur. Es bleiben drei: System (Tiefblau), Governance (Cobalt), Schluss-CTA (Tiefblau). Gelb bleibt bei den beiden Hauptbuttons, dem Klartag-Eingang im Systembild und dem Klartag-Leistungsblatt.

### 4.3 Restliche Seiten

- Zurückgezogene Aussagen entfernen: „mindestens drei Anwendungen“ und die Sechsmonatslogik in `index.html` (auch in der Meta-Description), `klartag.html`, `einfuehrungsprojekt.html`.
- Navigation überall auf **Module · Klartag · Für Ihre IT · Über uns** plus Button **Passung klären**.
- Die drei Mockup-Dateien und ihre CSS löschen.

---

## 5. Textbausteine

Diese Texte werden eingebaut. Sie sind die Arbeitsfassung; Umformulierungen ändern nur den Text, nicht die Struktur.

### Hero

- **Kicker:** Strukturierte KI-Einführung für Bauunternehmen und Planungsbüros
- **Headline:** KI muss zwischen Plan, Baustelle und Büro funktionieren.
- **Lead:** manibase führt die passende KI-Arbeitsumgebung ein und ergänzt sie um Automatisierungen und vorbereitete Helfer für Baudokumentation, Angebote und Wissen. Regeln, Schulung und Übergabe gehören dazu.
- **Primär:** Passung klären → `#termin`
- **Sekundär:** Module ansehen → `#module`
- **Microcopy:** Im Erstgespräch klären wir Ausgangslage, Nutzerkreis und Systeme. Der Klartag entscheidet anschließend über Use Cases, Plattform und Scope.

### Blatt 01 · Drei Arbeitssituationen

Überschrift: **Wenn Fachzeit in Suchen, Übertragen und Vorbereiten verschwindet.**

Je Situation dasselbe Schema: Anlass → vorbereitetes Ergebnis → Prüfpunkt. Texte unverändert aus der V2 übernehmen.

### Blatt 02 · System

Überschrift: **Ein klarer Einstieg. Danach nur die Bausteine, die zum Betrieb passen.**
Vermerk unter der Zeichnung bleibt wörtlich: „Nicht jedes Modul wird verkauft: Der Klartag kann auch zu einer Standardempfehlung, einer einzelnen Automation, einem einzelnen Helfer oder zu keiner Umsetzung führen.“

### Helfer

| | Bernd | Willy | Anton |
|---|---|---|---|
| Rolle | Baudokumentation | Wissensmanager | Angebotsassistenz |
| Status | im Einsatz | in Pilotierung | Entwicklung steht an |
| Statuszeile | Wird heute bei Kunden eingesetzt und im Onboarding auf deren Formate angepasst. | Läuft in Pilotprojekten. Umfang und Datenquellen werden dort noch geschärft. | In Entwicklung. Für den Einsatz noch nicht buchbar. |

### Klartag

Preis **3.900 € netto**, ein gemeinsamer Arbeitstag, bei Folgeprojekt vollständig anrechenbar. Der Sternchen-Vermerk „vor Veröffentlichung kaufmännisch bestätigen“ entfällt, der Preis ist bestätigt.

### Schluss

Überschrift: **Welche Bausteine passen zu Ihrem Betrieb?** CTA **Passung klären** springt auf `#termin`.

---

## 6. Abnahme

- [ ] Ein primärer CTA, überall dasselbe Ziel `#termin`
- [ ] Buchungsstrecke läuft durch bis zum Zeeg-Kalender
- [ ] Kein `noindex` mehr auf der Startseite, Meta und OG gesetzt
- [ ] Kein sichtbarer Platzhalterkasten, kein Mockup-Vermerk
- [ ] Jedes Bild mit Alternativtext und Kennzeichnung „KI-generierte Illustration“
- [ ] Kein lesbarer erfundener Firmenname, keine erfundene Summe, keine erfundene Adresse
- [ ] Reifegrade sichtbar, Anton nicht als kaufbar dargestellt
- [ ] Kein Gedankenstrich im Fließtext
- [ ] Gelb nur als Fläche mit dunklem Text oder als Akzent auf Dunkel
- [ ] Kein horizontaler Überlauf bei 320, 768, 1024, 1440
- [ ] Keine Konsolenfehler, alle Requests 200
- [ ] Genau eine H1, Überschriftenfolge ohne Sprünge

---

## 7. Danach

1. Bild für Situation 03 nachliefern, Avatare für Bernd und Anton.
2. Gründervideo als Poster mit Abspielknopf im Hero. Bewusst als Standbild, damit der Fünf-Sekunden-Test nicht durch ein laufendes Video verdeckt wird.
3. Fünf-Sekunden-Test mit fünf bis acht echten Zielpersonen, Auswertung nach dem Schema in Abschnitt 8.5 der Startseitenstrategie.
4. Lighthouse und finaler `/impeccable polish`.
