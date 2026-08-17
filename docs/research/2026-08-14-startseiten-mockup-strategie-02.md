# Startseiten-Mockup 02 – grafisches Rework

**Stand:** 14. August 2026
**Mockup:** `site/index-mockup-strategie-v2.html`
**Gestaltung:** `site/styles/home-mockup-strategie-v2.css`
**Status:** separat prüfbar; `site/index.html` und Mockup 01 bleiben unverändert

## Visuelle Leitidee

> Die Startseite ist ein durchlaufender **Werkplansatz**: Jeder Abschnitt ist ein nummeriertes Blatt mit Blattkopf, das Angebot wird in Plankopf, Schnittzeichnung, Maßkette und Bauteil-Datenblättern erklärt, und der menschliche Prüfpunkt erscheint als Prüfstempel.

Damit kommt der Bau- und Planungsbezug aus der Darstellungsform selbst und nicht aus Stockmotiven. Die Form passt zugleich zur Kernaussage: kontrollierte Einführung, dokumentierte Entscheidungen, geprüfte Freigaben.

Umsetzung der Leitidee je Abschnitt:

| Blatt | Abschnitt | Werkplan-Motiv |
|---|---|---|
| 01 | Hero | Plankopf mit Eingang, Weg, Ergebnis, Prüfstempel und Schriftfeld (Projekt, Blatt, Gezeichnet, Geprüft, Stand, Maßstab) |
| 02 | Arbeitssituationen | Ablaufkette mit Knotenpunkten: Anlass, Ergebnis, Prüfpunkt |
| 03 | manibase-System | Schnittzeichnung: Klartag als Eingang, drei Modulräume, schraffiertes Fundament |
| 04 | Module | Bento aus vier ungleichen Feldern statt gleichförmiger Kartenreihe |
| 05 | KI-Helfer | Bauteil-Datenblätter mit Prüfstempel „Reifestatus offen“ |
| 06 | Time-to-Value | Maßkette mit fünf Stationen und Torvermerken |
| 07 | Governance | Cobalt-Band als übergreifende Ebene |
| 08 | Klartag | Leistungsblatt in Gelb mit hartem Versatzschatten |
| 09 | Architektur | Drei Varianten A, B, C mit Umriss-Variantenbuchstaben |
| 10 | Team | Schriftfeld-Logik: Person, Rolle, Verantwortung |
| 11 | Finaler CTA | dunkles Schlussblatt |

## Wichtigste gestalterische Abweichungen von Mockup 01

1. **Hell-Dunkel gedreht.** Der Hero steht jetzt auf hellem Planpapier mit feinem Raster, die Marke trägt über Typografie und Zeichnung. Dunkel sind nur noch drei Bänder: System (Tiefblau), Governance (Cobalt) und finaler CTA (Tiefblau). Damit entsteht Rhythmus statt gleichmäßiger Dunkelverteilung, und die 60/30/10-Regel wird eingehalten.
2. **Hero neu komponiert.** Statt eines gerahmten Platzhalterkastens erklärt der Plankopf den Mechanismus: Eingang, Verarbeitungspfeil, vorbereitetes Ergebnis, Prüfstempel. Das Schriftfeld darunter macht die Illustration eindeutig als Zeichnung lesbar.
3. **Portfolio als Legende.** Die drei Angebotsbausteine sitzen als Planlegende unter dem Hero-Grid, über die volle Breite, mit eigener Überschrift „Legende · Das modulare Angebot“.
4. **Systembild als Schnitt statt Flussdiagramm.** Klartag ist ein gelber Eingangsraum mit Pfeil, die drei Module sind weiße Räume darüber, das Governance-Fundament trägt sie als schraffiertes Band. Mobil kippt das in einen vertikalen Schnitt in korrekter Reihenfolge, nicht in eine verkleinerte Desktopgrafik.
5. **Module als Bento.** 5/7 und 7/5 statt vier gleich großer Karten; Klartag (gelb) und KI-Helfer (tiefblau) stehen diagonal gegenüber.
6. **Helfer als Datenblätter.** Bernd, Anton und Willy erscheinen als technische Bauteilblätter mit Kopf, Datenfeldern und Onboarding-Fuß. Der offene Reifestatus ist ein Prüfstempel in Cobalt, kein roter oder gelber Warnzustand.
7. **Time-to-Value als Maßkette.** Die fünf Schritte hängen an einer durchlaufenden Maßlinie mit Endstrichen; die Entscheidungstore sind gerahmte Vermerke.
8. **Blattköpfe als Seitenrhythmus.** Jeder Abschnitt beginnt mit „Blatt NN — Name“ plus Maßlinie. Das ersetzt die wiederholte Eyebrow-Struktur und macht den Seitenfortschritt lesbar.
9. **Gelb sparsamer und gezielter.** Gelb trägt jetzt drei Gesten: Klartag als Eingang im Systembild, Klartag-Modul im Bento, Klartag-Leistungsblatt und die beiden CTA-Buttons. Es steht nie als Text auf Hell.

## Inhaltliche Änderungen

Copy wurde als Baseline behandelt. Ergänzt wurden ausschließlich vier Beschriftungen, die vorhandene Aussagen sichtbar machen, ohne neue Leistungen zu behaupten:

- Systembild: Untertitel je Modul („OpenWebUI-basiert oder Microsoft 365“, „im Plattformweg oder standalone mit n8n“, „Bernd · Anton · Willy“) — übernommen aus dem Hero-Portfolio und Modul 04.
- Systembild: Vermerk „Nicht jedes Modul wird verkauft: Der Klartag kann auch zu einer Standardempfehlung, einer einzelnen Automation, einem einzelnen Helfer – oder zu keiner Umsetzung führen.“ — wörtlich aus Abschnitt 5.1 der Strategie.
- Module 02: „Weg A“ und „Weg B“ als Kennzeichnung der beiden Plattformwege.
- Plankopf-Schriftfeld: Projekt, Blatt, Gezeichnet, Geprüft („Fachseite des Kunden“), Stand („nach Klartag“), Maßstab („modular“) — reine Zeichnungsmetadaten.

Nicht verändert: Angebotsarchitektur, Klartag als verpflichtender Einstieg, Time-to-Value-Formulierung, Reifestatus der Helfer, Governance-Vorbehalt, Microsoft, OpenWebUI und n8n samt ihrer Einordnung.

## Technische Prüfung

Geprüft bei 375 × 812, 768 × 1024 und 1440 px.

- kein horizontaler Überlauf (scrollWidth ≤ Viewport bei allen drei Breiten)
- keine Konsolenfehler; alle 11 Netzwerk-Requests mit Status 200
- genau eine H1; Überschriftenfolge ohne Sprünge
- keine doppelten IDs, keine fehlenden internen Sprungziele
- alle Bilder laden; Alternativtexte gesetzt, dekorative Signets bewusst leer
- Skip-Link ist erstes fokussierbares Element; Mobile-Menü über `details/summary` per Tastatur bedienbar
- Kontraste: 39 geprüfte Text-Hintergrund-Kombinationen, alle ≥ 4,5:1 (WCAG AA)
- Fokusring auf den dunklen Bändern zusätzlich in Gelb, da der globale blaue Ring dort zu schwach ist
- Bewegung nur in `@media (prefers-reduced-motion: no-preference)`
- `site/index.html` und Mockup 01 unverändert

### Im Verlauf behobene Fehler

- Footer-Spaltenüberschriften sind `h2` und erbten die Display-Skala und Ink-Farbe des Mockups (riesig, dann unsichtbar auf Tiefblau) — jetzt explizit zurückgesetzt.
- Mobil rutschte das Governance-Fundament zwischen Klartag und Module, weil die Grid-Zeilen im Breakpoint nicht zurückgesetzt waren.
- Bei 768 px liefen die Erklärtexte der Plattformwege über die Kartenkante hinaus — Weg-Erklärung steht jetzt unter dem Weg-Namen.
- Die Variantenbuchstaben A, B, C wurden oben abgeschnitten.
- Mobiler Hero war zu hoch: Kicker-, Lead- und Headline-Maße gestrafft, damit Headline, Lead und beide CTAs im ersten Sichtfeld liegen.

## Offene Entscheidungen

Unverändert offen aus Mockup 01 (Produkt- und Rechtsfragen, siehe `2026-08-14-startseiten-mockup-strategie-01.md`), insbesondere Reifestatus der Helfer, Klartag-Preis, Zielkundengröße und Betriebsverantwortung.

Zusätzlich gestalterisch offen:

1. **Werkplansatz oder ruhigere Fassung.** Die Blattnummerierung ist eine starke Setzung. Sie kann auf die vier Hauptabschnitte reduziert werden, falls sie für den Zielkunden zu technisch wirkt.
2. **Branchenvisuals.** Die Platzhalter 02A bis 02C sind weiterhin bewusst leer. Sobald echte, freigegebene Arbeitsobjekte vorliegen, ersetzen sie die Kästen; die Kettendarstellung bleibt.
3. **Hero-Visual.** Der Plankopf erklärt den Mechanismus. Falls stattdessen eine authentische Bau- oder Planungssituation gewünscht ist, müsste sie mit dem Plankopf kombiniert oder gegen ihn getauscht werden.
4. **Reihenfolge der Arbeitssituationen.** Weiterhin nach Vertriebspriorität festzulegen; aktuell Wissen, Dokumentation, Angebote.

## Vorschauartefakte

- `docs/research/startseitenstrategie-v2-hero-desktop.png`
- `docs/research/startseitenstrategie-v2-hero-mobile.png`
- `docs/research/startseitenstrategie-v2-system-desktop.png`
- `docs/research/startseitenstrategie-v2-system-mobile.png`
- `docs/research/startseitenstrategie-v2-module-desktop.png`
- `docs/research/startseitenstrategie-v2-helfer-desktop.png`
- `docs/research/startseitenstrategie-v2-golive-desktop.png`

## Lokal ansehen

```bash
python -m http.server 8000 --directory site
```

Danach `http://localhost:8000/index-mockup-strategie-v2.html` öffnen.
