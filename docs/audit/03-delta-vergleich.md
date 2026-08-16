# Delta-Vergleich: manibase gegen Bau-, Software- und KI-Einführungs-Benchmarks

**Stand:** 12. August 2026  
**Scope:** aktuelles statisches Seitensystem unter `site/`, die Redesign-Entscheidungen und die beiden Benchmarkberichte  
**Zweck:** ehrliche Bewertung von Positionierung, Informationsarchitektur, Angebotslogik, Proof, Governance, Conversion und Seiten-Framework. Dies ist **keine Copy-Fassung und keine Implementierung**.

> **Markenhinweis:** Im Auftrag wurde die Schreibweise „ManyBase“ verwendet. Die Marke und deshalb auch dieser Bericht schreiben **manibase**.

## 1. Urteil in einem Satz

manibase hat heute mehr methodische und technische Substanz als die Startseite erkennen lässt, aber die Website verteilt diese Substanz auf zu viele gleichrangige Begriffe und ersetzt den noch fehlenden Marktbeweis teilweise durch Konzepte, Mock-ups und Angebote, deren Reife nicht belegt ist.

Die Seite ist **kein Totalschaden**. Klartag, Einführungsprojekt, Eigentums-/Exit-Logik und die IT-Seite sind inhaltlich teilweise konkreter als bei vielen Bauanbietern. Gegen die besten Seiten beider Benchmarkgruppen verliert manibase aber in den kaufentscheidenden ersten Ebenen:

1. **Kein eindeutiges Kaufobjekt:** Klartag, „Das Projekt“, Firmen-KI, Einführungsprojekt, Prozessautomatisierung und KI-Helfer konkurrieren um dieselbe Aufmerksamkeit.
2. **Kein früher Realitätsbeweis:** Das laufende Projekt, die Gründererfahrung und die ehrliche Produktreife stehen nicht dort, wo der Besucher sein erstes Vertrauensurteil fällt.
3. **Zu wenig wiedererkennbare Bauarbeit:** Die Startseite spricht über Prozesse, Daten, Rechte und Anwendungen, zeigt aber kaum konkrete Arbeitsvorgänge aus Planung, Baustelle, Angebot, Dokumentation oder Projektwissen.
4. **Konzept statt Produktbeweis:** Prozessdiagramme, CSS-Oberflächen und eine explizit als später zu ersetzende Medienfläche erklären die Idee, beweisen aber keine laufende Lösung.
5. **Ein Glaubwürdigkeitsbruch ist P0:** Die Seite „Individuelle KI-Helfer“ stellt vier benannte Helfer wie bestehende Angebote dar, obwohl die interne Reifeentscheidung festhält, dass mehrere davon nicht existieren oder nicht spruchreif sind.

## 2. Gesamtbewertung nach Prüfpunkt

Skala: **stark** = bereits differenzierend; **solide** = brauchbar, aber nicht Referenzniveau; **schwach** = klar hinter beiden Benchmarkgruppen; **kritisch** = erzeugt Fehlorientierung oder Vertrauensrisiko.

| Prüfpunkt | Bewertung | Kurzdiagnose |
|---|---|---|
| 5-Sekunden-Klarheit | **solide** | Branche und KI-Einführung sind erkennbar; Unternehmensfit, konkretes Ergebnis und Differenzierung bleiben abstrakt. |
| Zielgruppenfit | **kritisch inkonsistent** | Startseite zielt breit auf Bau, Planung und Handwerk; die Helfer-Seite fällt ausdrücklich in den kleinen inhabergeführten Betrieb und Feierabend-Pain zurück. |
| Angebots-/Produktarchitektur | **kritisch** | Ein Flaggschiff ist intern definiert, extern aber in sechs sichtbare Kaufbegriffe zerlegt. |
| Homepage-Sequenz | **schwach** | Erklärmodell und Konzeptmedien kommen vor Realitätsbeweis, Use Cases, kaufbarer Leistung und aktuellem Projekt. |
| Navigationslogik | **schwach** | Sechs Menüpunkte plus Dropdown und CTA; „Das Projekt“ ist zugleich Oberbegriff und Einzelseite. |
| Konkrete Use Cases | **schwach** | Einzelne Beispiele existieren, sind aber generisch, auf Unterseiten verstreut und nicht als Rollen-/Arbeitswelt-System organisiert. |
| Proof / Trust | **kritisch** | Keine Kundenstimme, keine Case Study, kein echter Produkt-Screenshot, kein Musterartefakt; vorhandene ehrliche Ersatzbeweise sind zu spät. |
| Projekt-/Methodenbeweis | **stark** | Klartag, sieben Projektschritte, Mitwirkung und Abschlusskriterien sind konkret und ungewöhnlich transparent. |
| Governance / IT / Ownership | **solide bis stark** | Root, Betrieb, Datenort, Entra ID, Backup und Exit werden konkret; Logging, Qualitätskontrolle, Modell-Governance und Incident-/Audit-Mechanik fehlen. |
| Conversion / CTA | **solide** | Ein zentraler Kalenderpfad und datenschutzbewusstes Laden sind gut; Labels und Kontext sind inkonsistent, der Vier-Schritt-Wizard ist für kalte Leads hochschwellig. |
| Seitenlänge / Dopplung | **solide bis schwach** | Einzelne Seiten sind nicht extrem lang; dieselben Versprechen, CTAs und Angebotsbegriffe werden jedoch mehrfach neu erklärt. |
| Visuelle Produktdemonstration | **kritisch** | Die Startseite zeigt Konzept und Platzhalter; fast alle Leistungsseiten haben null Bilder oder reale Artefakte. |
| SEO / Content | **schwach** | Gute Meta-Basics, aber keine dauerhaften Fachtexte, Cases, strukturierte Daten, Canonicals, Sitemap/robots-Dateien oder Suchintentionen nach konkreter Bauarbeit. |
| Konsistenz zwischen Seiten | **kritisch** | Zielgröße, Angebotsreife, Eigentumsumfang, Branchenfassung und CTA-Bezeichnung driften. |
| Statisches Frontend-Framework | **solide im Betrieb, schwach in Pflege** | Schnell, lokal, zugänglich und ohne Framework-Abhängigkeit; Header/Footer sind dupliziert und das CSS besteht aus mehreren chronologischen Override-Schichten. |

## 3. Was bereits gut und differenzierend ist

### 3.1 Klartag und Einführungsprojekt sind echte Kaufobjekte

Die Klartag-Seite benennt Dauer, Preis, Anrechnung und vier konkrete Outputs (`site/klartag.html:55-73`). Sie erklärt außerdem Vorbereitung, Aufnahme realer Abläufe, Bewertung und Infrastrukturentscheidung (`site/klartag.html:93-121`). Das ist deutlich stärker als eine generische Workshop-Seite.

Die Projektseite nennt sechs Monate, drei bis fünf produktive Anwendungsfälle, Compliance und Befähigung bereits im Hero (`site/einfuehrungsprojekt.html:53-62`). Der Sieben-Schritte-Ablauf benennt sogar die für Kunden unangenehme unsichtbare Einrichtungsphase (`site/einfuehrungsprojekt.html:82-140`) und legt den Eigenaufwand offen (`site/einfuehrungsprojekt.html:145-161`). Das entspricht dem stärksten Muster aus [appliedAI](https://www.appliedai.de/) und [Palantirs AIP Bootcamp](https://www.palantir.com/platforms/aip/bootcamp): Format, Dauer, Outputs und Mitwirkung werden als Angebot verpackt.

**Differenzierend:** Die bewusste Obergrenze von drei bis fünf Use Cases, der vorab benannte Austausch von ein bis zwei Fällen und die Abschlusskriterien sind glaubwürdiger als „wir skalieren KI im ganzen Unternehmen“. Hier besitzt manibase eigenes, erlebtes Material.

### 3.2 Risiko- und Aufwandstransparenz ist überdurchschnittlich

Die Roadmap bleibt beim Kunden, der Klartag wird voll angerechnet, und ein negatives Machbarkeitsergebnis ist ausdrücklich möglich (`site/klartag.html:184-217`). Die Projektseite zeigt Preisform, Preistreiber und Direktabrechnung der Cloud-/Modellkosten (`site/einfuehrungsprojekt.html:193-228`).

Das ist die richtige Art von Risikoreduktion. Im Bau-Benchmark ist [Meisterwerk](https://www.meisterwerk.app/preise) der Gewinner, weil Kosten, Bedingungen, Einführung und Risiko konkret nebeneinanderstehen. manibase kann dieses Prinzip für ein sales-led Projekt glaubwürdig übersetzen, ohne einen Self-Service-Test zu imitieren.

### 3.3 Die IT-Seite nimmt den technischen Leser ernst

Root-Zugriff, Patch-Verantwortung, Ausfall, Backup und Wiederanlauf werden konkret beantwortet (`site/fuer-ihre-it.html:92-121`). Entra ID, Datenort, Modellwahl und Unterlagen werden nicht nur als „sicher“ behauptet (`site/fuer-ihre-it.html:125-155`). Schnittstellen, Eigentum und Exit sind als eigene Fragen sichtbar (`site/fuer-ihre-it.html:159-189`).

Damit liegt manibase klar über vielen Bau-Websites, deren IT-Vertrauen bei „DSGVO-konform“ endet. Das richtige internationale Vorbild ist [deepset](https://www.deepset.ai/solutions/enterprise), wo Souveränität über Deployment, Rechte, Audit Logs, Guardrails und Modellwahl technisch belegt wird, sowie [IBM AI Governance](https://www.ibm.com/consulting/ai-governance), wo Governance als Arbeitspaket und nicht als Footerclaim erscheint.

### 3.4 Die Gründerkombination ist ein glaubwürdiger Ersatzbeweis

Die Verbindung aus DMS-Einführung/Projektsteuerung und 15 Jahren Softwareentwicklung wird konkret beschrieben (`site/ueber-uns.html:61-96`). Auch die Haltung „erst schauen, dann bauen“ und die Bereitschaft abzusagen sind plausibel (`site/ueber-uns.html:100-140`).

Das ist kein Ersatz für Kundenresultate, aber für ein junges Unternehmen ein guter **Personen- und Lieferfähigkeitsbeweis**. [Zühlke](https://www.zuehlke.com/de/) nutzt fachliche Ansprechpartner als Vertrauensziel; manibase kann diesen Vorteil sogar direkter spielen, weil die Ansprechpartner tatsächlich liefern.

### 3.5 Das technische Seitengerüst ist funktional vernünftig

Das System nutzt selbst gehostete Schriften und zentrale Design-Tokens (`site/styles/tokens.css:1-6`, `site/styles/tokens.css:101-148`). Es berücksichtigt reduzierte Bewegung und progressive Reveal-Effekte (`site/scripts/site.js:9-22`). Der Buchungskalender wird erst nach Qualifizierung und Einwilligung nachgeladen (`site/scripts/site.js:282-296`, `site/scripts/site.js:338-378`).

Das ist für Performance, Datenschutz und Zugänglichkeit eine solide Basis. Ein schweres CMS oder JavaScript-Framework ist für diese Seitengröße nicht erforderlich.

## 4. Was intern logisch, extern aber unklar ist

### 4.1 Die Angebotsleiter ist intern klarer als die Navigation

Intern lautet die Logik: Erstgespräch → Klartag → sechsmonatiges Einführungsprojekt; Plattform, Automatisierungen und Helfer sind mögliche Bestandteile oder Ergebnisse. Extern erscheinen dagegen:

- „Der Klartag“,
- „Das Projekt“ als Dropdown,
- „Hauseigene Firmen-KI“,
- „KI-Einführungsprojekt“,
- „Prozessautomatisierung mit KI“,
- „Individuelle KI-Helfer“.

Diese sechs Begriffe stehen bereits in der Hauptnavigation und ihrem Dropdown (`site/index.html:24-31`). Die Startseite erklärt danach erst drei Angebotskarten (`site/index.html:159-201`) und anschließend noch einmal drei Projektbereiche (`site/index.html:203-231`). Ein externer Leser muss deshalb selbst rekonstruieren, ob er ein Projekt, eine Plattform, eine Automation oder einen Helfer kaufen soll.

Im KI-Benchmark gewinnt [appliedAI](https://www.appliedai.de/) genau die umgekehrte Disziplin: unterscheidbare Programme sind Kaufoptionen; Methoden und technische Bausteine bleiben darunter. Bei manibase werden **Phasen, Lieferbausteine und Lösungstypen auf dieselbe Ebene gezogen**.

### 4.2 „Das Projekt“ bezeichnet drei verschiedene Dinge

In der Navigation ist „Das Projekt“ der Oberbegriff für drei Unterseiten (`site/einfuehrungsprojekt.html:24-28`). Auf der Startseite ist „Das Projekt“ eine Angebotskarte neben Klartag und Helfern (`site/index.html:178-198`). Gleichzeitig heißt eine Unterseite „KI-Einführungsprojekt“ und beschreibt das gesamte sechsmonatige Vorhaben (`site/einfuehrungsprojekt.html:53-80`).

Das ist intern erklärbar, extern aber semantisch instabil. Ein Oberbegriff darf nicht zugleich ein einzelnes Angebot und ein Teilbereich desselben Angebots sein.

### 4.3 Plattformentscheidung und Produktversprechen laufen gegeneinander

Die Seite zur Firmen-KI verkauft eine eigene zentrale Umgebung als sichtbares Angebot (`site/firmen-ki.html:35-65`), relativiert sie später aber korrekt: Wenn Microsoft besser passt, findet dieselbe Einführung dort statt (`site/firmen-ki.html:67-72`). Die IT-Seite sagt ebenfalls, die Plattform sei variabel (`site/fuer-ihre-it.html:62-90`).

Die richtige interne Haltung lautet also: **Die Einführung ist das Produkt, die Plattform eine Entscheidung.** Die heutige IA macht trotzdem die „Hauseigene Firmen-KI“ zum ersten von drei Projektbereichen. Damit priorisiert die Navigation eine Option, bevor die Diagnose stattgefunden hat.

### 4.4 Zielgröße ist nur als Formularvariable sichtbar

Die Startseite nennt Bau, Planung und Handwerk, aber keine Betriebsgröße oder Reifevoraussetzung (`site/index.html:52-67`). Erst am Seitenende fragt der Wizard nach bis 20, 21 bis 50, 51 bis 150 und mehr als 150 Mitarbeitenden (`site/index.html:306-324`).

Die besten Fit-Seiten sagen früh, für wen sie gebaut sind. [Meisterwerk](https://www.meisterwerk.app/) nennt 1 bis 50 Personen und die passende Auftragsart; [Sablono](https://www.sablono.com/de/home) segmentiert nach Ergebnis, Sektor, Rolle und Anwendungsfall. Bei manibase ist der relevante Fit intern vorhanden, aber extern versteckt.

## 5. Wo manibase schwächer als beide Benchmarkgruppen ist

### 5.1 5-Sekunden-Klarheit: Kategorie ja, Kaufgrund nein

Der Hero erfüllt die Basiskategorie: KI-Einführung für Bau, Planung und Handwerk (`site/index.html:53-67`). „Orientierung“, „technische Grundlage“ und „verlässliche Anwendungen“ bleiben jedoch Sammelbegriffe. In fünf Sekunden fehlen:

- der Kernfit, etwa Unternehmensart/-größe oder vorhandener KI-Wildwuchs,
- ein konkretes Arbeitsbild,
- das zeitlich greifbare Flaggschiff,
- ein Beweis direkt neben dem Versprechen,
- der scharfe Unterschied zu klassischer KI-Beratung oder einem Softwarehaus.

[Capmo](https://www.capmo.com/) benennt Rolle, Baukontext und konkrete KI-Aufgaben. [Palantir AIP Bootcamp](https://www.palantir.com/platforms/aip/bootcamp) verbindet Zeit und Output. [deepset](https://www.deepset.ai/) benennt mit Infrastruktur-, Modell- und Datengrenzen einen konkreten Konflikt. manibase bleibt im Hero auf der Ebene „erst ordnen, dann passend bauen“.

### 5.2 Zielgruppenfit: eine Seite spricht wieder zum falschen Markt

Die Helfer-Seite adressiert „inhabergeführte Betriebe“, Verwaltung nach dem Arbeitstag und Bürokratie im Feierabend (`site/ki-helfer.html:18-23`). Das ist exakt die kleinere Zielgruppe, die laut Redesign-Entscheidung nicht auf manibase.de, sondern auf die persönliche Marke gehört.

Dieser Bruch ist nicht nur tonal. Er verändert:

- Entscheider: Inhaber statt Geschäftsführung/IT,
- Problem: persönlicher Feierabend statt Organisationsrisiko und Skalierung,
- Kauflogik: einzelner Helfer statt strukturiertes Einführungsprojekt,
- Preis-/Liefermodell: kleine Einzelaufgabe statt sechsmonatiges Vorhaben.

Die Startseite kann deshalb nicht gleichzeitig als Enterprise-/Mittelstandsseite und als Helfer-Shop gelesen werden.

### 5.3 Produktreife: Darstellung und interner Stand widersprechen sich

Die Helfer-Seite präsentiert Anton, Emma, Doreen und Wiktor als vier bestehende, klar abgegrenzte Angebote (`site/ki-helfer.html:25-30`). Bereits auf der Startseite werden drei Figuren bildlich als Leistung gezeigt (`site/index.html:187-198`).

Die interne Reifeentscheidung sagt dagegen: Nur ein Baudokumentationshelfer ist in ersten Tests; PIA ist Entwurf/Pilotpartnersuche; Anton existiert nicht und hat kein Konzept (`docs/redesign/01-entscheidungen.md:132-155`). Der Bauauftrag warnt später nochmals, dass Anton kein Konzept hat und ein Dashboard keine Lieferbarkeit suggerieren darf (`docs/redesign/03-bauauftrag.md:503-509`).

Das ist der härteste Befund dieses Audits: **Die Website behauptet faktisch Portfolio-Reife, die intern ausdrücklich verneint wird.** Kein Copy-Feinschliff kann das lösen. Bis Reife, Pilotstatus und Rechte geklärt sind, gehören diese Helfer nicht als vier kaufbare Angebote in die Hauptnavigation.

### 5.4 Use Cases: Fähigkeiten statt wiedererkennbare Arbeit

Die Startseite zeigt als abstrakten Flow „E-Mail/PDF/Foto → KI-Helfer → Freigabe“ (`site/index.html:70-86`) und später Plattform-, Einführungs- und Automatisierungsbegriffe (`site/index.html:203-229`). Konkrete Arbeitsobjekte wie Mangel, Baubericht, Nachtrag, Ausschreibungsunterlage, DIN-Norm, Planprüfung, Angebot oder Rechnungsfreigabe werden dort nicht als zusammenhängende Anwendungsbibliothek sichtbar.

Auf Unterseiten existieren einzelne Beispiele:

- Baudokumentation und Angebotserstellung auf dem Klartag (`site/klartag.html:85-88`),
- E-Mail/Formular, Rechnung und Projektablage bei Automatisierung (`site/prozessautomatisierung.html:27`),
- Angebot, E-Mail, Dokumentation und Wissen bei Helfern (`site/ki-helfer.html:25-30`).

Sie sind jedoch weder nach Rolle noch Arbeitswelt geordnet und besitzen keine vierteilige Use-Case-Logik: Nutzer, heutige Arbeit, konkreter Output, menschliche Entscheidung.

Die Baugewinner [Capmo](https://www.capmo.com/), [HERO](https://hero-software.de/) und [plancraft](https://plancraft.com/de-de) zeigen reale Arbeitsobjekte und Handlungen. [Palantir AIP Now](https://aip.palantir.com/) ordnet Anwendungen nach Branche und Funktion. manibase braucht keine riesige Bibliothek, aber mindestens drei bis sechs **baukonkrete Arbeitsbilder**.

### 5.5 Proof: Behauptung und Methode stehen fast ohne Marktbeweis

Die Startseite enthält:

- kein Kundenlogo,
- keine Kundenstimme,
- keine Case Study,
- keine Kennzahl aus einem Kundenprojekt,
- keinen echten Produkt-/Workflow-Screenshot,
- keinen Ausschnitt einer Roadmap, Richtlinie oder Betriebsdokumentation,
- nicht einmal die auf der Über-uns-Seite erlaubte Tatsache des laufenden Projekts.

Stattdessen erklärt sie offen, dass Grafiken später durch Screenshots, Video und Kundenprozess ersetzt werden können (`site/index.html:107-136`). Ehrlichkeit ist richtig, aber **ein sichtbarer Platzhalter ist kein Trust-Asset**. Er lenkt die Aufmerksamkeit gerade auf das, was noch fehlt.

Die vorhandenen Ersatzbeweise stehen spät oder auf anderen Seiten: Gründer (`site/index.html:267-281`) und laufendes Architekturbüroprojekt (`site/ueber-uns.html:145-155`).

Beide Benchmarks priorisieren Proof früh. [Craftnote](https://craftnote.de/) zeigt menschliche Stimmen direkt nach dem Hero; [Merantix Momentum](https://www.merantix-momentum.com/) zeigt Logos und Ergebniswerte früh; [MaibornWolff](https://www.maibornwolff.de/referenzen/) strukturiert Referenzen in Ziel, Lösung und Nutzen; [EPAM](https://www.epam.com/services/client-work/delivering-software-products-faster-more-efficiently-with-ai) führt den Beweis bis Methode und Messkontext.

manibase darf keine Ergebnisse erfinden. Es kann aber den aktuellen Projektstatus, reale Arbeitspakete, Architektur, Meilenstein und Gründererfahrung früher zeigen.

### 5.6 Produktdemonstration: visuell erklärt, nicht real gezeigt

Die Startseite hat sieben Bilder, doch die Beweiskraft ist gering:

- dasselbe generische Hände-/Laptopmotiv erscheint im Hero und erneut als Videoplatzhalter (`site/index.html:70-87`, `site/index.html:128-135`),
- drei Helferfiguren visualisieren ein unreifes Portfolio (`site/index.html:187-198`),
- die eigentliche Produkt-/Prozessdarstellung besteht aus HTML/CSS-Konzeptgrafiken.

Alle Seiten zu Klartag, Einführungsprojekt, Firmen-KI, Automatisierung und IT enthalten im Hauptinhalt **kein einziges echtes Bild**. Die Firmen-KI zeigt lediglich eine schematische Oberfläche (`site/firmen-ki.html:52-64`).

[Cosuno](https://www.cosuno.com/de/) ist im Bau-Benchmark der Gewinner für „Product in the page“, weil reale Ausschreibungen statt Behauptungen sichtbar sind. Für manibase lautet der Transfer nicht „mehr Dekoration“, sondern: ein echter anonymisierter Workflow, ein echter UI-Ausschnitt, ein Roadmap-Ausschnitt, eine Richtlinie oder ein Betriebsdiagramm.

### 5.7 Governance ist konkret, aber noch nicht vollständig

Die IT-Seite ist eine gute Basis, beantwortet aber nicht alle Fragen, die [IBM](https://www.ibm.com/consulting/ai-governance), [deepset](https://www.deepset.ai/solutions/enterprise), [appliedAI](https://www.appliedai.de/) und [Accenture Responsible AI](https://www.accenture.com/ch-en/case-studies/data-ai/blueprint-responsible-ai) als prüfbare Governance-Ebene zeigen.

Es fehlen oder bleiben zu unscharf:

- Modellinventar und erlaubte Modelle/Provider,
- Rollenmodell jenseits der Entra-Anmeldung,
- Logging, Audit Trail und Datenherkunft,
- Guardrails und PII-/Geheimniserkennung,
- Human Approval je Risikoklasse,
- Qualitätsmessung für Genauigkeit, Halluzinationen, Bias und Drift,
- Kostenmonitoring und Limits,
- Incident-Prozess, Wiederanlaufziel und Verantwortlicher,
- Datenaufbewahrung und Löschung,
- EU-AI-Act-Klassifizierung, Schulungspflichten und laufende Dokumentation.

Auch starke Aussagen wie „kein Transfer in die USA“ (`site/fuer-ihre-it.html:143-146`) oder das pauschale „DSGVO-konform“ im Footer (`site/index.html:398-401`) brauchen je Betriebsmodell einen belegbaren Mechanismus. Sonst wird aus der erfreulich konkreten IT-Seite an einzelnen Stellen wieder eine Absolutheitsbehauptung.

### 5.8 Conversion: zentraler Pfad, aber kein einheitlicher Auftrag

Positiv ist, dass alle Hauptpfade auf einen Terminprozess führen und der Kalender erst nach Einwilligung geladen wird. Negativ ist die Bezeichnung:

- Header: „Sprechen Sie uns an“ (`site/index.html:32-34`),
- Hero: „Erstgespräch vereinbaren“ (`site/index.html:59-62`),
- Helfer: „Helfer besprechen“ (`site/ki-helfer.html:19`),
- Automatisierung: „Prozess besprechen“ (`site/prozessautomatisierung.html:19`),
- Unterseiten erneut „Erstgespräch vereinbaren“ oder „Sprechen Sie uns an“.

Das Ziel ist zwar gleich, der erwartete Inhalt aber nicht. [Capmo](https://www.capmo.com/) und [deepset](https://www.deepset.ai/) halten ihr CTA-Paar über die Seite stabil. manibase sollte einen konstanten Primärpfad und einen konstanten lesenden Sekundärpfad haben.

Der Vier-Schritt-Wizard fragt Größe, Unternehmensart, Teilnehmer und Kontakt (`site/index.html:303-353`). Für einen qualifizierten Enterprise-Lead ist das vertretbar; für einen ersten 30-Minuten-Kontakt ist es dennoch mehr Reibung als bei den meisten Vergleichsseiten. Außerdem wird der Seitenkontext „Firmen-KI“, „Automation“ oder „Helfer“ nicht in die Buchung übernommen; das Script überträgt nur Größe, Art, Teilnehmer, Firma und Telefon (`site/scripts/site.js:301-335`).

## 6. Konsistenzbrüche zwischen den Seiten

| Bruch | Lokaler Befund | Wirkung |
|---|---|---|
| Zielgruppe | Enterprise-/Mittelstandslogik auf Start-/IT-/Projektseite, aber inhabergeführter Kleinbetrieb und Feierabend auf `site/ki-helfer.html:18-23` | Die Marke spricht mit zwei Stimmen und zieht zwei inkompatible Leadtypen an. |
| Produktreife | Vier fertige Helfer auf `site/ki-helfer.html:25-30`; intern mehrere nicht existent/unreif in `docs/redesign/01-entscheidungen.md:132-155` | Größtes Glaubwürdigkeitsrisiko. |
| Angebotsrang | Klartag/Projekt/Helfer als drei Karten auf `site/index.html:159-199`; Plattform/Einführung/Automation als drei weitere Bereiche auf `site/index.html:203-229` | Kein eindeutiges Flaggschiff. |
| Einstiegspflicht | Startseite sagt, man könne mit einem einzelnen Baustein beginnen (`site/index.html:163-166`); Projektseite sagt, ohne Klartag beginne man nicht (`site/einfuehrungsprojekt.html:55-63`) | Unklar, was tatsächlich separat kaufbar ist. |
| Eigentum | Footer: „Eigentum bleibt im Haus“ (`site/index.html:373-401`); Projekt: „Das System gehört Ihnen“ (`site/einfuehrungsprojekt.html:217-226`); IT: eigener manibase-Code bleibt lizenziert (`site/fuer-ihre-it.html:176-186`) | Pauschale Claim-Ebene widerspricht der korrekten vertraglichen Differenzierung. |
| Branchenfassung | Footer der großen Seiten nennt nur Bau und Planung (`site/index.html:373-401`), jüngere Kurzseiten nennen Bau, Planung und Handwerk (`site/firmen-ki.html:78`) | Handwerk ist je Seite ein- oder ausgeschlossen. |
| CTA | „Sprechen Sie uns an“, „Erstgespräch vereinbaren“, „Prozess besprechen“, „Helfer besprechen“ | Gleicher Zielpfad mit unterschiedlichen Leistungsversprechen. |
| Proof | Das laufende Projekt steht nur auf Über uns (`site/ueber-uns.html:145-155`), nicht auf Start- oder Projektseite | Der stärkste ehrliche Realitätsbeweis ist vom Kaufpfad getrennt. |
| Plattform | Firmen-KI wirkt als eigener Projektbereich (`site/firmen-ki.html:35-50`), IT-Seite sagt korrekt: Plattform ist variabel (`site/fuer-ihre-it.html:62-90`) | Technikoption und eigentliches Produkt werden verwechselt. |

## 7. Seitenlänge und Dopplung

Automatisiert aus dem jeweiligen `<main>` gezählt:

| Seite | ca. Wörter | H2 | Bilder im Hauptinhalt | Bewertung |
|---|---:|---:|---:|---|
| Startseite | 936 | 10 | 7 | Nicht zu lang, aber zu viele Erklärmodelle vor Proof und Use Cases. |
| Klartag | 830 | 6 | 0 | Inhaltlich stark; Preis, Roadmap und nächster Schritt werden mehrfach wiederholt. |
| Einführungsprojekt | 941 | 5 | 0 | Angemessene Tiefe; ohne Artefakt/Case wirkt die lange Methodik selbstreferenziell. |
| Firmen-KI | 381 | 4 | 0 | Kurz, aber als eigene Kaufseite zu dünn und zu früh produktisiert. |
| Prozessautomatisierung | 436 | 5 | 0 | Gute Grundstruktur, aber generisch und ohne Bau-/Projektsoftwarebezug oder Proof. |
| KI-Helfer | 452 | 5 | 4 | Visuell lebendiger, aber Zielgruppen- und Reiferisiko macht die Seite aktuell untragbar. |
| Für Ihre IT | 898 | 6 | 0 | Tiefe ist für den Vetogeber sinnvoll; als FAQ-/Kontrollseite gut scanbar. |
| Über uns | 641 | 5 | 2 | Plausibel, aber Projektbeweis und Kapazität gehören zusätzlich in den Kaufpfad. |

Das Problem ist deshalb nicht schlicht „zu viel Text“. [plancraft](https://plancraft.com/de-de) und [Capmo](https://www.capmo.com/) sind länger, tragen die Länge aber mit Produktansichten, Proof und konkreten Arbeitsbildern. Bei manibase wirkt die gleiche Textmenge schwerer, weil die visuellen Pausen überwiegend dekorativ oder konzeptionell sind.

Die größte strukturelle Dopplung liegt auf der Startseite: vier Grundlagen (`site/index.html:91-105`), Systemkonzept (`site/index.html:107-138`), drei Angebotskarten (`site/index.html:159-201`), drei Projektbereiche (`site/index.html:203-231`), vier Haltungsprinzipien (`site/index.html:233-250`) und drei Phasen (`site/index.html:252-265`) erklären nacheinander Varianten derselben Botschaft: erst verstehen, dann strukturiert und kontrolliert umsetzen.

## 8. SEO- und Content-Lücken

### 8.1 Technische Basis

Die untersuchten Marketingseiten besitzen individuelle `<title>` und Meta-Descriptions, aber im aktuellen Bestand fehlen:

- Canonical-Tags,
- Open-Graph-/Social-Metadaten,
- strukturierte Daten für `Organization`, `Service`, `Person`, `FAQPage` oder `BreadcrumbList`,
- eine sichtbare `robots.txt` und Sitemap im `site/`-Root,
- Breadcrumbs für die inzwischen tiefe Projektarchitektur.

Diese Punkte allein erzeugen kein Ranking, reduzieren aber technische Unklarheit und machen das Seitensystem maschinenlesbarer.

### 8.2 Suchintention und fachliche Tiefe

Die aktuelle Architektur deckt vor allem Marken-/Leistungsbegriffe ab. Es fehlen dauerhafte, belastbare Inhalte zu den Fragen, die ein Geschäftsführer oder IT-Leiter vor dem Kontakt tatsächlich sucht:

- KI-Einführung im Bauunternehmen: Ablauf, Mitwirkung, Kostenlogik,
- KI im Architekturbüro/Planungsbüro: Projektwissen, Normen, Entwürfe, Datenschutz,
- Baustellen- und Baudokumentation mit Spracheingabe,
- Copilot versus eigene KI-Ebene: Wann passt was?,
- Schatten-KI im Bau: Verantwortung, Richtlinien, Betriebsrat,
- Schnittstellen zu bestehender Bausoftware: Machbarkeit und Grenzen,
- KI-Governance für mittelständische Bau-/Planungsunternehmen.

Das bedeutet **keine dünnen Gewerke-Seiten**. [NEVARIS](https://www.nevaris.com/) und [123erfasst](https://123erfasst.de/) zeigen die Stärke bauspezifischer Ressourcen, aber auch die Gefahr einer überlangen Homepage und veralteter Inhalte. Für manibase sind drei bis fünf datumslose, gepflegte Fachtexte besser als ein Blog mit Frequenzversprechen.

### 8.3 Proof-Content fehlt als eigener Seitentyp

Es gibt keinen Bereich für Praxis, Projekte oder Case Studies. Solange kein abgeschlossener Ergebnis-Case vorliegt, sollte eine ehrliche Projektseite nach folgendem Raster entstehen: Segment und Ausgangslage, Ziel, aktueller Stand, bereits umgesetzte Arbeitspakete, technische/organisatorische Architektur, nächster Meilenstein. Das entspricht dem belastbaren Frühphasenformat aus dem KI-Benchmark und vermeidet erfundene Resultate.

## 9. Frontend-Framework: Stärken und Schulden

### 9.1 Stärken

- **Keine unnötige Laufzeitkomplexität:** statisches HTML, CSS und kleines Vanilla-JavaScript.
- **Lokale Marke und Datenschutz:** selbst gehostete Fonts und Tokens (`site/styles/tokens.css:1-6`).
- **Responsives, konsistentes Designfundament:** zentrale Farben, Typografie, Abstände und Radien (`site/styles/tokens.css:8-89`, `site/styles/tokens.css:101-148`).
- **Zugänglichkeit:** Skip-Link, semantische Navigation, Fieldsets, Reduced-Motion-Fallback und Fokussteuerung im Wizard (`site/index.html:15-16`, `site/scripts/site.js:9-22`, `site/scripts/site.js:226-245`).
- **Datenschutzbewusste Conversion:** Drittanbieter-Kalender wird erst nach ausdrücklicher Aktion geladen (`site/scripts/site.js:338-378`).

### 9.2 Schulden

- **Kein gemeinsames Template:** Header, Navigation und Footer sind in jeder HTML-Datei dupliziert. Die unterschiedlichen Footerclaims zeigen bereits den erwartbaren Drift (`site/index.html:373-401` gegen `site/firmen-ki.html:78`).
- **Chronologische CSS-Schichten:** `site.css` hat 1.469 Zeilen und mehrere große, nacheinander angehängte Redesign-/Erweiterungsblöcke ab etwa `site/styles/site.css:535`, `site/styles/site.css:794`, `site/styles/site.css:892`, `site/styles/site.css:1140` und `site/styles/site.css:1288`. Das funktioniert, erschwert aber Vorhersagbarkeit, visuelle Konsistenz und das Entfernen alter Komponenten.
- **Legacy-JavaScript bleibt aktiv im Bundle:** Rotator, Newsletter und Eventform-Logik werden noch mitgeführt (`site/scripts/site.js:24-205`), obwohl die neuen Marketingseiten hauptsächlich Reveal und Booking nutzen. Das ist klein, zeigt aber dieselbe additive statt konsolidierende Entwicklung.
- **Komponenten spiegeln nicht die Informationsarchitektur:** Es gibt viele Karten-/Bandtypen, aber keine zentrale Daten-/Templatequelle für Navigation, CTA, Footerclaim oder Angebotsstatus.
- **Seitenkontext geht bei Conversion verloren:** Der Wizard erhält nicht, von welcher Leistungsseite der Besucher kam (`site/scripts/site.js:301-335`).

**Bewertung:** Das statische Modell kann bleiben. Vor weiterem Ausbau braucht es aber eine Konsolidierung in gemeinsame Partials/Includes oder einen kleinen Static-Site-Build, plus Bereinigung der CSS-Schichten. Das ist kein Plädoyer für React oder ein großes CMS.

## 10. Priorisierte Delta-Matrix

### P0 – vor weiterer Copy- oder Designpolitur

| Delta | Warum P0 | Zielzustand |
|---|---|---|
| **Unreife KI-Helfer nicht als fertiges Portfolio zeigen** | Direkter Widerspruch zwischen Website und intern dokumentierter Reife; Vertrauens- und mögliches Erwartungsrisiko. | Nur reale, belegbare Helfer zeigen; Entwurf/Pilot explizit so markieren; nicht existierende Angebote aus Hauptnavigation und Startseite nehmen. |
| **Ein Flaggschiff und eine Hierarchie festlegen** | Der Besucher kann aktuell Phase, Projekt, Plattform und Produkt nicht auseinanderhalten. | „Strukturierte KI-Einführung“ als einziges Hauptangebot; Erstgespräch, Klartag und Projekt als Phasen; Plattform, Automation und Helfer als optionale Lieferbausteine/Anwendungsformen darunter. |
| **Frühen Proof-Block auf die Startseite** | Beide Benchmarks zeigen Proof direkt nach dem Hero; manibase zeigt dort Theorie. | Laufendes Projekt als Status, Gründererfahrung und ein reales Arbeitsartefakt direkt nach dem Hero; keine Ergebnisbehauptung. |
| **Konkrete Bau-Use-Cases vor Framework-Erklärung** | Der Markt verkauft Arbeitsvorgänge, manibase primär Kategorien. | Drei bis sechs Use Cases nach Arbeitswelt mit Nutzer, heutiger Arbeit, Systemoutput und menschlicher Freigabe. |
| **Platzhalter durch Realitätsbeweis ersetzen oder entfernen** | Die Seite erklärt sichtbar, was noch nicht da ist; das schwächt einen jungen Anbieter. | Echter Screenshot/Artefakt oder kompakter schematischer Erklärblock ohne Platzhalter-Kommentar. |
| **Zielgruppenbruch beheben** | KI-Helfer-Seite spricht kleinen Inhaber an, Gesamtseite größere Geschäftsführung. | Pro Domain ein primärer Entscheider und Fit; kleinere Betriebe sauber an die andere Marke übergeben. |
| **Eigentums- und Datenschutzclaims präzisieren** | Footer-/Projektclaims sind weiter als die technische Vertragslogik. | Kundeneigentum, manibase-IP, Nutzungsrecht, Cloudvertrag, Datenregion und Exit getrennt und je Betriebsmodell formulieren. |

### P1 – nächste strukturelle Ausbaustufe

| Delta | Begründung | Zielzustand |
|---|---|---|
| **Navigation auf fünf klare Punkte plus CTA reduzieren** | Heute sechs Punkte plus Dropdown und CTA; „Das Projekt“ ist doppeldeutig. | Angebot, Anwendungen, Ablauf, Für IT, Über/Praxis; genaue Benennung erst nach Angebotsentscheidung. |
| **Homepage proof-led neu sequenzieren** | Aktuell Konzept vor Leistung und Proof. | Hero → früher Proof → konkrete Arbeitsbilder → Flaggschiff/Phasen → reales Artefakt → Governance/Ownership → Praxis/Gründer → CTA. |
| **Case-/Praxis-Seitentyp einführen** | Proof ist heute auf Über uns versteckt und nicht modular. | Frühphasen-Case jetzt; später Ergebnisfelder und Kundenstimme ergänzen. |
| **Governance um Kontrollmechanismen ergänzen** | IT-Seite ist gut, aber noch unter deepset/IBM-Niveau. | Modell-/Dateninventar, Rechte, Logging, Freigaben, Qualität, Monitoring, Incident, Aufbewahrung, AI Act, Owner und Exit. |
| **CTA-Paar und Erwartung vereinheitlichen** | Mehrere Labels führen auf denselben Kalender, aber versprechen verschiedene Gespräche. | Ein Primärziel mit klarer Gesprächsleistung; ein lesender Sekundärpfad zu Ablauf oder Praxis. |
| **Seiten zusammenlegen, die noch keine eigenständige Beweiskette haben** | Firmen-KI und Automation sind kurz, proof-frei und aktuell eher Module. | In eine Seite „Anwendungen und technische Bausteine“ bzw. in die Hauptleistungsseite integrieren; erst bei eigenem Case/Produktstatus wieder ausgliedern. |
| **Frontend-Templates und CSS konsolidieren** | Duplizierte Navigation/Footer und additive Overrides erzeugen bereits Drift. | Gemeinsame Partials/Datenquelle, ein bereinigtes Komponentenset, totes CSS/JS entfernen. |

### P2 – nach geklärter Positionierung und echtem Proof

| Delta | Begründung | Zielzustand |
|---|---|---|
| **Dauerhafte Fachinhalte statt Blog-Frequenz** | Relevante Suchintentionen sind ungedeckt, ein leerer Blog wäre schlechter. | Drei bis fünf gepflegte Leitfäden zu Kosten, Copilot/eigener Ebene, Schatten-KI, Schnittstellen und Governance. |
| **Technisches SEO vervollständigen** | Keine Canonicals, Social-Metadaten, strukturierten Daten, Sitemap/robots. | Saubere Indexierungs- und Entitätsbasis; strukturierte Daten nur für tatsächlich sichtbare Inhalte. |
| **Use-Case-Seiten nur bei echter Tiefe** | Gewerke-/Themenbibliotheken können ranken, werden aber schnell dünn. | Erst ausgliedern, wenn Prozess, Daten, Schnittstellen, Rollen und Proof je Use Case wirklich verschieden sind. |
| **Produktseiten nach Reifegrad aufbauen** | Ein echter Helfer kann später stark differenzieren. | Eigener Produktstatus, echte Screens, Einsatzgrenzen, Betriebsmodell, Preislogik und Pilot-/Kundenbeleg. |
| **Trust Center / Betriebsdokumentation** | Bei wachsendem Enterprise-Geschäft wird Governance eigenständiger Kaufbeweis. | Aktuelle Sicherheits-/Betriebsinformationen, Verantwortlichkeiten, Subprozessoren und Richtlinien zentral pflegen. |

## 11. Vorgeschlagenes Ziel-Framework

### 11.1 Angebotsarchitektur

```text
Ein Hauptangebot: Strukturierte KI-Einführung
├─ Phase 0: Machbarkeit / Erstgespräch
├─ Phase 1: Klartag (bezahltes, anrechenbares Entscheidungsprodukt)
└─ Phase 2: Einführungsprojekt (sechs Monate)
   ├─ Lieferbaustein: vorhandene Plattform / Microsoft-Welt
   ├─ Lieferbaustein: eigene Firmen-KI
   ├─ Lieferbaustein: Prozessautomatisierung
   └─ Lieferbaustein: abgegrenzter KI-Helfer, sofern real und reif
```

Der Kunde kauft nicht vier Technologien. Er kauft eine kontrollierte Einführung; die technischen Bausteine ergeben sich aus Diagnose und Roadmap.

### 11.2 Startseite

```text
1. Hero: Zielgruppe + betriebliches Ergebnis + klarer Angebotsname
   Primär-CTA + lesender Sekundärpfad

2. Früher Proof
   laufendes Projekt als Status + Gründererfahrung + reales Artefakt/Ansicht

3. Drei bis sechs konkrete Arbeitsbilder
   Planung / Baustelle / Angebot / Projektwissen / Dokumente / IT-Betrieb

4. Das Flaggschiff
   Erstgespräch → Klartag → sechsmonatige Einführung
   Dauer, Outputs, Kundenmitwirkung

5. Was je nach Ausgangslage gebaut wird
   Microsoft-Welt, eigene Ebene, Automation, reifer Helfer
   als Module, nicht als konkurrierende Produkte

6. Reales Vorgehen und Artefakt
   anonymisierter Workflow, Roadmap-Ausschnitt, UI oder Betriebsdiagramm

7. Governance und Ownership
   Daten, Rechte, Freigabe, Logging, Betrieb, Eigentum, Exit

8. Praxisbeweis
   aktueller Projektstand; später Case mit Ziel, Lösung, Nutzen

9. Gründer und Liefermodell
   direkte Verantwortung, Kapazität, Rollen

10. Finaler CTA
    derselbe nächste Schritt wie im Hero
```

### 11.3 Seitensystem und mögliche Zusammenlegungen

| Heutige Seite | Vorschlag | Begründung |
|---|---|---|
| `index.html` | Startseite als proof-led Hybrid | Ein Angebot, konkrete Arbeit, früher Beweis. |
| `klartag.html` | Behalten; als Phase/Entscheidungsprodukt einordnen | Stärkste, klarste einzelne Leistungsseite. |
| `einfuehrungsprojekt.html` | Behalten und zum Hauptangebot machen | Hier liegt der eigentliche wirtschaftliche Kern. |
| `firmen-ki.html` | Vorläufig mit technischen Lieferbausteinen zusammenlegen oder klar als Option unter dem Projekt führen | Plattform ist laut eigener Haltung variabel, nicht das erste Kaufobjekt. |
| `prozessautomatisierung.html` | In „Anwendungen/Lösungsbausteine“ integrieren, bis ein eigener Case vorliegt | Heute generisch, kurz und proof-frei. |
| `ki-helfer.html` | Aus Hauptnavigation nehmen; nur reale Produkte/Piloten zeigen | Zielgruppen- und Reifewiderspruch. |
| `fuer-ihre-it.html` | Behalten, zu Governance/Betrieb erweitern | Echter Vetogeber-Nutzen und differenzierende Tiefe. |
| `ueber-uns.html` | Behalten; Projektstatus zusätzlich in Praxis-/Proof-Fläche spiegeln | Personenbeweis ja, aber nicht als einziger Proof-Ort. |
| neu: Praxis/Projektstatus | Ergänzen, sobald Freigaben geklärt sind | Case-Beweiskette ohne erfundene Resultate. |
| neu: Fachwissen | Erst P2, datumslose Leitfäden | SEO/GEO und Verkaufsunterstützung ohne Blogpflicht. |

### 11.4 Navigation als Zielbild

Maximal fünf Punkte plus CTA:

```text
KI-Einführung
Anwendungen
Ablauf / Klartag
Für Ihre IT
Über uns / Praxis
[Primär-CTA]
```

Die exakten Labels sind Copy-Arbeit und deshalb hier nicht final. Wichtig ist die Hierarchie: **Angebot → Anwendungen → Vorgehen → technische Absicherung → Beweis/Personen.**

## 12. Was manibase bewusst nicht kopieren sollte

1. **Keinen kostenlosen Test vortäuschen.** Das product-led Muster von [plancraft](https://plancraft.com/de-de), [HERO](https://hero-software.de/) oder [Meisterwerk](https://www.meisterwerk.app/) passt nicht zu einem sechsmonatigen Einführungsprojekt.
2. **Keine Gewerke-Farm bauen.** Viele Handwerksanbieter skalieren über 9 bis 26 Gewerke-Seiten. Ohne unterschiedliche Prozesse, Daten und Schnittstellen wäre das bei manibase nur SEO-Duplizierung.
3. **Keine Enterprise-Meganavigation imitieren.** [adesso](https://www.adesso.de/de/) und [EPAM](https://www.epam.com/) brauchen Tiefe wegen echter Portfoliobreite. Bei manibase würde sie Unsicherheit vergrößern.
4. **Keine Logo-Wall erfinden oder Vorleben als Kundenbeweis umdeuten.** Bis belastbare Referenzen vorliegen, sind ehrlicher Projektstatus, Artefakte und Werdegang die korrekten Beweise.
5. **Kein Pathos und keine Führungsclaims ohne Proof.** „10x“, „Nr. 1“, „marktführend“ oder „KI-Spitze“ würden die Beweislücke vergrößern.
6. **Keine Microsoft-Konfrontation.** Koexistenz ist glaubwürdiger als ein beweglicher Produktvergleich und respektiert die bestehende IT-Entscheidung.
7. **Keine endlose Homepage kopieren.** [plancraft](https://plancraft.com/de-de), [NEVARIS](https://www.nevaris.com/) und [123erfasst](https://123erfasst.de/) sind gute Inhaltsbibliotheken, aber keine Längenvorbilder.
8. **Keine Produktnamenflut.** EPAMs und großer Beratungen Framework-Dichte ist für einen kleinen Spezialisten kein Größensignal, sondern Dekodierarbeit.
9. **Keine abstrakte C-Level-Sprache von Accenture kopieren.** Ohne institutionelle Bekanntheit wirken „Transformation“, „Reinvention“ und „Enterprise Value“ distanziert statt groß.
10. **Keine Cartoon-Figuren als Hauptproof.** Sie können später ein echtes Produkt merkbar machen, dürfen aber weder Reife noch Kundenbeweis ersetzen.

## 13. Schlussfolgerung

manibase muss nicht zuerst „besser klingen“. Es muss zuerst **klarer wahr sein**:

- ein Hauptangebot statt sechs konkurrierender Begriffe,
- reale Arbeitsvorgänge statt Capability-Sprache,
- Projektstatus und Artefakte statt Platzhalter,
- reife Produkte statt Portfolio-Simulation,
- konkrete Kontrollen statt pauschaler Sicherheitsclaims,
- ein einheitlicher nächster Schritt.

Die vorhandenen Stärken – Klartag, sechsmonatiger Ablauf, ehrlicher Eigenaufwand, IT-Tiefe, Eigentums-/Exit-Denken und direkte Gründerverantwortung – reichen aus, um ein glaubwürdiges Ziel-Framework zu bauen. Sie werden heute nur nicht in der Reihenfolge gezeigt, in der ein skeptischer Geschäftsführer Vertrauen aufbaut.

Der nächste Copy-Audit sollte deshalb nicht Satz für Satz auf dem aktuellen Seitensystem optimieren. Er sollte auf der oben vorgeschlagenen Angebots- und Proof-Hierarchie arbeiten; sonst poliert er Widersprüche, die strukturell bleiben.

