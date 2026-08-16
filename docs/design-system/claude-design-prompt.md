# Master-Prompt für Claude Design: manibase Designsystem 2026+

```text
Du arbeitest als Senior Brand Designer, Design-System-Architekt und Frontend-Entwickler am zukünftigen Designsystem von manibase.

Deine Aufgabe ist nicht, eine beliebige neue Website-Optik zu erfinden. Überarbeite und konsolidiere das bestehende manibase-Designsystem auf Basis der zuletzt überarbeiteten Website. Entwickle daraus ein dauerhaft nutzbares visuelles System, mit dem wir künftig Website-Sektionen, Roadmaps, Prozessdarstellungen, Architekturdiagramme, Produktgrafiken, Mockups und weitere erklärende Darstellungen konsistent gestalten und direkt im Web programmieren können.

WICHTIGER AUSGANGSPUNKT

Analysiere vor der Gestaltung zuerst diese bestehenden Dateien und behandle die aktuelle Website als visuelle Referenz:

- `site/styles/tokens.css`
- `site/styles/site.css`
- `site/index.html`
- `site/klartag.html`
- `site/einfuehrungsprojekt.html`
- `site/fuer-ihre-it.html`
- `site/ueber-uns.html`
- `site/fonts/_fontface.css`
- `docs/redesign/00-recherche.md`
- `docs/redesign/01-entscheidungen.md`
- `docs/redesign/03-bauauftrag.md`

Wenn Screenshots der aktuellen Fassung vorliegen, verwende sie zusätzlich zur visuellen Kalibrierung. Übernimm jedoch keine veralteten Inhalte, Preise, Leistungsversprechen oder Zielgruppenaussagen aus älteren Entwürfen. Die aktuellen HTML-Seiten sind für Aussagen und Angebotslogik maßgeblich.

MARKENKERN

manibase führt KI strukturiert in Bau-, Planungs- und größeren Handwerksunternehmen ein. Die Marke verbindet drei Welten:

1. die konkrete Arbeitsrealität in Bau und Planung,
2. technische und organisatorische Kontrolle,
3. eine verständliche, verantwortete Einführung statt einzelner KI-Experimente.

Die Gestaltung soll wirken wie ein präziser Werkplan für eine moderne Organisation: ruhig, glaubwürdig, technisch kompetent, menschlich und umsetzungsnah. Nicht wie ein KI-Startup, keine klassische Unternehmensberatung und keine verspielte Handwerkerwerbung.

Die zentrale gestalterische Idee lautet:

„Werkplan statt KI-Show.“

Jede Darstellung soll Orientierung geben. Sie muss zeigen, wie etwas funktioniert, wer verantwortlich ist, welche Entscheidung ansteht oder wie ein Zustand in den nächsten übergeht.

ZIELGRUPPE UND WIRKUNG

Die wichtigsten Betrachter sind Geschäftsführung, interne IT beziehungsweise IT-Dienstleister und Fachverantwortliche in Bau- und Planungsunternehmen. Die Gestaltung muss gleichzeitig folgende Signale senden:

- Für die Geschäftsführung: Klarheit, Verbindlichkeit, wirtschaftliche Vernunft und ein nachvollziehbarer Weg.
- Für die IT: technische Seriosität, Datenkontrolle, Verantwortlichkeiten, Betriebsfähigkeit und Exit-Fähigkeit.
- Für Fachanwender: Verständlichkeit, Praxisnähe und sichtbare menschliche Freigabe.

Gewünschter Ersteindruck: „Diese Menschen verstehen reale Abläufe, bauen strukturiert und übertreiben nicht.“

VISUELLE RICHTUNG

Nutze eine ruhige, technische Editorial-Ästhetik mit Anklängen an Werkplan, Bauplan, Projektdokumentation und Systemarchitektur. Die Anklänge bleiben subtil: feine Raster, Maßlinien, nummerierte Module, Legenden, Statuspunkte, Achsen, Ebenen und klar beschriftete Verbindungen. Kein Baustellen-Kitsch und keine dekorativen Blaupausen über die gesamte Fläche.

Das System soll hochwertig und frisch wirken, aber nicht modisch altern. Präzision entsteht durch Typografie, Weißraum, klare Hierarchien und saubere Informationsgrafik, nicht durch Effekte.

Verwende echte Arbeitsfotos nur dort, wo sie einen glaubwürdigen Kontext schaffen: Menschen im Gespräch, Dokumente, Planung, Baustelle, Laptop oder konkrete Arbeitsabläufe. Fotos leicht entsättigen und bei Bedarf mit Tiefblau oder Cobalt zurückhaltend tönen. Keine generischen Roboter, Gehirne, leuchtenden Datenströme, Hände mit Hologrammen oder andere KI-Stockmotive.

FARBLOGIK

Behalte die bestehende Markenpalette als verbindliche Grundlage:

- Cobalt 500: `#2F3FDB` – primäre Aktion, Links, aktive Zustände, wichtige Linien und ausgewählte Diagrammelemente.
- Tiefblau / Ink: `#14224F` – Überschriften, starke Kontrastflächen, technische Basis und Diagrammachsen.
- Gelb: `#F2D414` – seltenes Entscheidungssignal, Meilenstein, Statuspunkt oder gezielte Marken-Geste.
- Text primär: `#1B2440`.
- Text sekundär: `#5A6485`.
- Weiß: `#FFFFFF`.
- Kühle Leinwand: `#FAFBFD`.
- Eingesunkene Fläche: `#F4F6FB`.
- Bläuliche Trennlinie: `#E4E9F2`.
- Vertiefte blaue Waschfläche: ungefähr `#F0F3FF`.
- Zurückhaltendes Papierweiß als optionale redaktionelle Fläche: ungefähr `#FDFCF8`.

Ziel der Flächenverteilung: ungefähr 88 Prozent Weiß und Off-White, 6 Prozent Tiefblau, 5 Prozent Cobalt und höchstens 1 Prozent Gelb.

Regeln:

- Cobalt ist keine beliebige Sektionsfarbe. Nutze es hauptsächlich für Handlung, Orientierung und aktive Zustände.
- Gelb nie großflächig verwenden. Es markiert einen wichtigen Punkt, eine Entscheidung oder einen Meilenstein.
- Pro Ansicht höchstens eine dominante dunkle Fläche; ein schmales Proof- oder Statusband darf zusätzlich vorkommen.
- Schatten niemals neutral-schwarz, sondern mit Tiefblau bei geringer Deckkraft.
- Statusfarben nur semantisch verwenden: Erfolg `#2E9E5B`, Warnung `#E08A1E`, Fehler `#DC3B3B`.
- Kontrast und Lesbarkeit müssen mindestens WCAG 2.2 AA erfüllen.

TYPOGRAFIE

Verwende ausschließlich die bereits selbst gehosteten Schriften:

- Sora für Überschriften und markante Zahlen.
- Hanken Grotesk für Fließtext, Navigation, Formulare und UI-Texte.
- JetBrains Mono für Kicker, technische Labels, Schrittzahlen, Legenden, Zeitachsen, Statuscodes und kleine Metadaten.

Typografische Haltung:

- Große Überschriften leben durch Größe und Raum, nicht durch starke Fettung.
- H1 und H2 überwiegend in Sora 400 bis 500.
- Keine enge negative Laufweite bei Überschriften.
- Desktop-Hero maximal ungefähr 68 px, mobil ungefähr 36 bis 49 px.
- Bereichsüberschriften ungefähr 38 bis 44 px.
- Body 16 px mit ungefähr 1.65 bis 1.75 Zeilenhöhe.
- Fließtextbreite meist 55 bis 65 Zeichen.
- Technische Mono-Labels klein, präzise und sparsam; nie als lange Textpassage.
- Die Marke wird immer als `manibase` geschrieben, grundsätzlich kleingeschrieben.

LAYOUT UND RAUM

- Maximaler Container: 1280 px inklusive 24 px Seitenabstand; nutzbare Inhaltsbreite ungefähr 1232 px.
- Desktop-Sektionen erhalten ungefähr 64 bis 100 px vertikalen Raum, je nach Bedeutung.
- Nutze starke redaktionelle Kompositionen: große Textfläche plus Diagramm, Split-Layout, horizontale Prozesslinie, strukturierte Vergleichsfläche oder bewusst offene Liste.
- Vermeide einen gleichförmigen Kartenfriedhof. Nicht jede Information gehört in eine abgerundete Karte.
- Kartenradien überwiegend 4 bis 8 px. Größere Radien nur bei wenigen übergeordneten Flächen.
- Pillen nur für echte Status- oder Filterelemente, nicht als dekorative Standardform.
- Rahmen sind meist 1 px und blaugrau. Schatten bleiben selten und weich.
- Komponenten müssen bei 1440 px, 1024 px, 768 px und 390 px funktionieren. Kein horizontaler Überlauf.

GESTALTUNGSGRAMMATIK FÜR GRAFIKEN

Baue eine wiederverwendbare visuelle Sprache, keine Sammlung voneinander unabhängiger Illustrationen.

Verwende als Grundelemente:

- feine blaugraue Raster in kleinen, gezielten Ausschnitten,
- Maß- und Verbindungslinien,
- nummerierte Knoten,
- klar beschriftete Ebenen und Container,
- Cobalt für den aktiven oder empfohlenen Pfad,
- Tiefblau für Fundament, Systemgrenze und stabile Struktur,
- Gelb für Entscheidung, Freigabe, Meilenstein oder menschlichen Kontrollpunkt,
- Off-White und Weiß für inaktive beziehungsweise neutrale Flächen,
- Pfeile nur bei echter Richtung oder Abhängigkeit,
- Legenden, wenn Farben oder Linien mehr als eine Bedeutung haben.

Jede Grafik braucht:

1. eine klare Aussage als Überschrift,
2. eine erkennbare Leserichtung,
3. kurze und konkrete Beschriftungen,
4. eine sichtbare menschliche oder organisatorische Verantwortung, sofern relevant,
5. eine mobile Fassung, die nicht nur verkleinert, sondern sinnvoll neu angeordnet wird,
6. semantisches HTML und eine verständliche Textalternative.

Vermeide:

- dekorative Linien ohne Bedeutung,
- unbeschriftete Icons,
- austauschbare Isometrie-Illustrationen,
- 3D-Objekte und Hochglanz-Renderings,
- Neonfarben und lila-blaue KI-Verläufe,
- Glassmorphism,
- übergroße Farbverläufe,
- Comicfiguren oder Maskottchen im Erstkontakt,
- schwebende Karten ohne räumliche oder inhaltliche Logik,
- Diagramme, die nur Komplexität simulieren,
- erfundene Kennzahlen, Logos, Zertifikate oder Produktreife.

ROADMAP-SYSTEM

Entwickle eine eigenständige, wiederverwendbare Roadmap-Komponente für den Klartag und das sechsmonatige Einführungsprojekt.

Die Roadmap darf das Projekt nicht als unrealistisch lineare Abfolge darstellen. Zeige parallele Arbeitsstränge und klare Entscheidungspunkte. Nutze beispielsweise folgende Ebenen:

- Steuerung und Entscheidungen,
- technische Grundlage und Betrieb,
- Anwendungsfälle und Tests,
- Governance und Freigaben,
- Schulung und interne Befähigung,
- Übergabe und Verstetigung.

Die bekannten Projektstationen sind:

- Kick-off,
- technische Grundlage,
- Projektgruppe,
- Anwendungsfälle definieren und testen,
- Freigaben und Governance,
- Schulung,
- dokumentierte Übergabe.

Gestalte für Desktop eine horizontale Zeitachse über sechs Monate mit Swimlanes oder klar getrennten Arbeitssträngen. Zeige Meilensteine und Entscheidungen in Gelb, laufende Arbeit in Cobalt, Abhängigkeiten in blaugrauen Linien und das stabile Fundament in Tiefblau. Zeige nur Zeitangaben, die fachlich belegt sind. Keine erfundenen Wochenpläne oder Ergebniszahlen.

Für Mobilgeräte wird die Roadmap zu einer vertikalen Abfolge mit denselben Arbeitssträngen, nicht zu einer winzigen horizontalen Grafik. Inhalte müssen weiterhin lesbar und vollständig zugänglich sein.

ARCHITEKTURDIAGRAMME

Entwickle ein modulares System für technische Architekturdiagramme. Die Diagramme sollen auch für Geschäftsführungen verständlich sein, ohne für IT-Verantwortliche unseriös zu wirken.

Mögliche Ebenen:

- Nutzer und Rollen,
- Anmeldung und Rechte,
- Cockpit beziehungsweise Anwendungen,
- Automatisierung und Orchestrierung,
- Modelle und Modellzugänge,
- Datenquellen und Schnittstellen,
- Protokollierung, Governance und Betrieb,
- menschliche Prüfung und fachliche Freigabe.

Kennzeichne die Systemgrenze der Kundenumgebung eindeutig. Zeige Datenflüsse und Verantwortungen nur, wenn sie inhaltlich belegt sind. Erstelle eine faire Vergleichslogik für „eigene KI-Architektur“ und „Microsoft 365“: kein Siegerpodest, kein Kampf, keine Abwertung. Die eigene Architektur darf als häufige Empfehlung hervorgehoben werden, während echte Vorteile einer passenden Microsoft-Umgebung sichtbar bleiben.

PROZESSDARSTELLUNGEN

Für einfache Abläufe nutze eine kompakte Prozesskette nach dem Muster:

Freigegebene Daten → KI bereitet vor → Mensch prüft und gibt fachlich frei.

Für komplexere Abläufe nutze Knoten, Zustände, Entscheidungen und Rückkopplungen. Der Mensch darf nicht als letzter dekorativer Haken erscheinen, sondern als tatsächliche Freigabeinstanz. Zeige klar, wo Daten herkommen, was die KI tut und was sie ausdrücklich nicht entscheidet.

PRODUKT- UND UI-GRAFIKEN

Wenn reale Screenshots noch fehlen, entwerfe glaubwürdige abstrahierte UI-Darstellungen statt Fake-Produktfotos. Diese sollen wie echte Arbeitsoberflächen aufgebaut sein: Navigation, Dokumentquelle, Status, Nutzerrolle, Freigabe, Ergebnis und Protokollierung. Verwende keine Lorem-ipsum-Inhalte und keine erfundenen Kundendaten.

Markiere den Reifegrad ehrlich. Unterscheide sichtbar zwischen:

- heute vorhanden,
- im Pilot,
- Konzept,
- mögliche spätere Anwendung.

Stelle nichts als fertiges Produkt dar, was nur eine Idee oder ein Pilot ist.

KOMPONENTEN, DIE DAS SYSTEM ABDECKEN MUSS

Definiere und gestalte mindestens:

- Header und Navigation,
- Hero mit Text plus erklärender Arbeitsgrafik,
- primäre, sekundäre und helle Buttons,
- Textlinks und Fokuszustände,
- Eyebrow beziehungsweise technische Bereichsmarke,
- Proof- oder Statusband,
- Kennzahlenband,
- Problem-zu-Ziel-Darstellung,
- Prozesskette,
- mehrmonatige Roadmap,
- Architekturdiagramm,
- Zwei-Wege-Vergleich,
- Anwendungsfeld-Matrix,
- Verantwortungs- beziehungsweise RACI-nahe Darstellung,
- Karten für sachliche Module,
- Checklisten und Ergebnislisten,
- Personen- und Kompetenzdarstellung,
- CTA-Kontrastfläche,
- Formulare, Auswahlkarten, Fortschritt und Fehlerzustände,
- Tabellen und Legenden,
- leere, ladende und nicht verfügbare Zustände für spätere digitale Produkte.

INTERAKTION UND MOTION

- Bewegung unterstützt Verständnis, nicht Aufmerksamkeit um ihrer selbst willen.
- Dauer überwiegend 120 bis 220 ms, größere erklärende Übergänge maximal etwa 500 ms.
- Erlaubt sind dezentes Einblenden, Fortschrittswechsel, Hervorheben eines aktiven Pfads und kontrolliertes Aufklappen von Details.
- Kein Parallax, kein permanentes Schweben, keine animierten Hintergrundverläufe und keine Scroll-Show.
- `prefers-reduced-motion` vollständig respektieren.
- Hover darf nie die einzige Erklärung eines Elements enthalten.

SPRACHE IN DER OBERFLÄCHE

- Deutsch, Sie-Ansprache, konkret, ruhig und souverän.
- Eine Aussage pro Fläche.
- Keine Buzzwords und keine künstlich futuristische Sprache.
- Benenne reale Tätigkeiten: prüfen, dokumentieren, freigeben, anbinden, schulen, übergeben.
- Verwende „KI-Anwendung“ oder die konkrete Tätigkeit, nicht pauschal „KI-Agent“.
- Erfinde keine Leistungsversprechen, Preise, Zahlen, Zertifizierungen oder Kundenbeispiele.
- Bestehende freigegebene Website-Texte nicht ohne Auftrag umschreiben.

TECHNISCHE UMSETZUNG

- Arbeite mit semantischem HTML, CSS Custom Properties und möglichst wenig JavaScript.
- Verwende die vorhandenen selbst gehosteten Fonts. Keine externen Font-CDNs.
- Nutze SVG oder HTML/CSS für Diagramme, wenn dadurch Responsivität und Zugänglichkeit besser werden. Canvas nur, wenn es sachlich notwendig ist.
- Icons als konsistente, einfache Outline-SVGs mit ungefähr 1.5 bis 2 px Strichstärke.
- Alle Komponenten benötigen sinnvolle Fokus-, Hover-, Active-, Disabled-, Error- und Reduced-Motion-Zustände.
- Verwende keine unnötige Bibliothek und keine neue Abhängigkeit, wenn HTML, CSS oder SVG ausreichen.
- Die aktuelle CSS-Datei enthält historische und teilweise überlagernde Designschichten. Hänge nicht einfach weitere Overrides unten an. Ermittle die tatsächlich aktiven Regeln, konsolidiere sie in verständliche Tokens und Komponenten und dokumentiere bewusst erhaltene Abweichungen.
- Bestehende Funktionalität, Formulare, Links, Datenschutzmechanismen und Inhalte dürfen durch die visuelle Überarbeitung nicht beschädigt werden.

ARBEITSPROZESS

Arbeite in dieser Reihenfolge:

1. Bestandsaufnahme: Extrahiere aktive Tokens, Komponenten, Muster und Inkonsistenzen aus dem aktuellen Code.
2. Designentscheidung: Formuliere die visuelle Leitidee in wenigen präzisen Prinzipien.
3. System: Definiere Farben, Typografie, Abstände, Radien, Rahmen, Schatten, Raster, Diagrammfarben und Zustände als Tokens.
4. Komponenten: Entwickle die wiederverwendbaren Website- und Diagrammbausteine.
5. Schlüsselbeispiele: Gestalte mindestens eine sechsmonatige Roadmap, ein Architekturdiagramm, eine Prozesskette und eine Produkt- beziehungsweise Arbeitsgrafik in vollständiger Desktop- und Mobilfassung.
6. Implementierung: Programmiere die Komponenten als produktionsnahes HTML/CSS/SVG und integriere sie konsistent in die bestehende Struktur.
7. Prüfung: Teste Responsivität, Kontrast, Tastaturbedienung, Reduced Motion, Textskalierung und horizontalen Überlauf.
8. Dokumentation: Halte fest, wann welcher Baustein eingesetzt wird und was ausdrücklich vermieden werden soll.

ERWARTETE ERGEBNISSE

Liefere:

- ein kompaktes Design-System-Dokument mit Markenprinzipien und Einsatzregeln,
- eine bereinigte Token-Struktur als CSS Custom Properties,
- eine Komponentenübersicht mit Zuständen und Anwendungsfällen,
- eine kleine visuelle Grammatik für Roadmaps, Prozesse und Architekturdiagramme,
- programmierte Referenzkomponenten für Desktop und Mobil,
- eine übersichtliche Preview- oder Pattern-Library-Seite,
- eine Liste der gegenüber der aktuellen Fassung konsolidierten oder bewusst geänderten Regeln,
- eine kurze Qualitätsprüfung mit gefundenen Restproblemen.

ABNAHMEKRITERIEN

Das Ergebnis ist gelungen, wenn:

- manibase auf den ersten Blick als seriöser Umsetzungspartner für KI-Einführung erkennbar ist,
- alle neuen Grafiken sichtbar zur aktuellen Website gehören,
- Roadmap und Architektur auch ohne begleitenden Vortrag verständlich sind,
- Gelb selten und dadurch bedeutungsvoll bleibt,
- die Seite modern wirkt, ohne typische generische KI-Ästhetik zu übernehmen,
- technische Tiefe sichtbar ist, ohne die Geschäftsführung auszuschließen,
- Desktop und Mobil jeweils eigenständig gestaltet sind,
- keine unbelegten Aussagen oder Produktreife suggeriert werden,
- der Code wartbarer und nicht nur optisch erweitert wurde.

Beginne mit einer kurzen Bestandsdiagnose und drei konkreten Designprinzipien. Zeige danach das vorgeschlagene System und setze anschließend die Schlüsselkomponenten um. Triff innerhalb dieses Rahmens selbstständig begründete Entscheidungen. Führe am Ende nur wirklich offene fachliche Entscheidungen separat auf.
```

