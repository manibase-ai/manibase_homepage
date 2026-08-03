# Redesign-Entscheidungen

Laufendes Protokoll. Jede Entscheidung mit Begründung, damit später nachvollziehbar
ist, warum etwas so ist. Ergänzt `00-recherche.md`.

---

## E1 · Positionierung: Bau und Handwerk, verbindlich

**Entscheidung:** manibase legt sich auf Bau und Handwerk fest. Die Startseite nennt
die Branche. Die bisherige Regel „branchenoffen ansprechen, Bau ist nur ein möglicher
Beachhead" aus `PRODUCT.md` und `CLAUDE.md` ist damit **aufgehoben**.

**Begründung: die reale Kundenlage ist zu 100 % Bau.**

| Kunde | Status | Inhalt |
|---|---|---|
| Architekturbüro, 18 MA | **laufendes Pilotprojekt** | Open Web UI als Corporate LLM, Projektmanagement, Use-Case-Findung, parallel Softwareentwicklung Baudokumentation (Spracheingabe + RAG) |
| Spenglerbetrieb | Zielkunde | Baudokumentation, nichts geht verloren, Einsprechen auf der Baustelle und im Auto |
| Dachdeckerbetrieb | laufende KI-Einführung (über vorgeschaltete Firma) | zunächst ChatGPT-Einführung, absehbar eigene Software für Angebotsabwicklung |
| Garten- und Landschaftsbau | Zielkunde | Neuaufstellung im Bereich KI |
| Raiffeisenbank Lohr | Vorstellung durch Architekten geplant | Standortanalyse und Projektentwicklung, KI-Tool mit API-Schnittstellen |

**Segment genauer:** nicht nur ausführendes Handwerk, sondern **Planung und Ausführung**
(Architekturbüro, Bank/Projektentwicklung auf der einen Seite, Spengler, Dachdecker,
GaLaBau auf der anderen). Die Klammer ist das Bauprojekt, nicht das Gewerk.

**Konsequenzen:**
- `PRODUCT.md` und `CLAUDE.md` müssen nachgezogen werden (Abschnitt „Branchenoffen").
- Headline darf die Branche nennen.
- Bildsprache darf Baustelle sein.
- Die Barriere „lohnt nur für größere Betriebe" (Bitkom 59 %) wird durch die reale
  Kundengröße gedeckt: 18 MA im Pilotprojekt, exakt die Zielgröße.

**Offen:** Segmentierungsachse für Unterseiten (siehe E2).

---

## E2 · Geschäftsmodell: Produkt plus Einführung, nicht Beratung

**Entscheidung:** manibase ist kein Beratungshaus. Die operative Gesellschaft wurde
gegründet, um aus der Beratung heraus **direkt in die Umsetzung** zu gehen. Beratung ist
Aufhänger, nicht Produkt.

**Zwei Standbeine:**

1. **Eigene Assets (Helfer).** Benannte Software-Bausteine, die manibase gehören:
   - **Bodo, der Baudokumentationshelfer** — Spracheingabe auf der Baustelle,
     Wiederauffinden über RAG. Entsteht im Pilotprojekt Architekturbüro.
   - **Anton, der Angebotsassistent** — nimmt Vorarbeiten der Angebotserstellung ab,
     Spracheingabe auch während der Autofahrt.
   - **Stefan, der Standortanalysehelfer** — holt über offene Schnittstellen erste
     Daten zu einer Adresse.
2. **Einführung und Projektgeschäft.** Open-WebUI-Implementierung als Dienstleister,
   saubere KI-Einführung mit konkreten Use Cases, Projektmanagement,
   Software-Deployment. Perspektivisch eigene Automatisierungen,
   Prozessverbesserungen und eigene Softwarelösungen.

**Der KI-Klartag wird nachrangig.** Begründung des Kunden: Ein Kunde muss bereits
Vertrauen mitbringen, um 2.000 bis 3.000 € für einen reinen Beratungstag auszugeben.
Vertrieblich schwierig als Einstieg. Es gibt Betriebe, die darauf warten, aber es ist
nicht das Geschäft, das manibase machen will.

**Konsequenzen für die Seite:**
- Die heutige Seite ist ein einziger Funnel auf den Klartag, inklusive eigener
  Landingpage `ki-klartag.html`. Diese Architektur bildet das neue Modell **nicht** ab.
- Es braucht einen Produktbereich (11/11 Wettbewerber haben einen).
- Die Helfer wechseln die Rolle: von dekorativen Maskottchen zur **Produktlinie**.
  Das entkräftet Teil der Warnung aus `00-recherche.md` Abschnitt 5, aber nicht die
  Warnung vor Cartoon-Stil und vor Personifizierung, die Ersetzungsangst weckt.

**Offene Punkte:**
- Preisangabe: Die Seite nennt durchgängig **1.800 €** Festpreis, der Kunde spricht von
  **2.000 bis 3.000 €**. Muss geklärt werden, bevor irgendwo eine Zahl steht.
- Was wird aus **Emma** (E-Mail-Assistenz), **Doreen** (Dokumentationshilfe) und
  **Wiktor** (Wissensmanager) der heutigen Seite? Bodo deckt Doreen und Wiktor
  inhaltlich ab. Emma ist im neuen Modell nicht erwähnt.
- Die Namensreihe Bodo, Anton, Stefan ist rein männlich, die heutige Reihe war
  paritätisch (Anton, Emma, Doreen, Wiktor). Bewusst entscheiden, nicht nebenbei.

---

## E3 · Leistungsspektrum: drei Bereiche, ein Flaggschiff

**Flaggschiff ist die Dienstleistung**, nicht das Produkt: das **strukturierte
KI-Einführungsprojekt**. Es läuft bereits gut und ist in den nächsten sechs Monaten
reproduzierbar lieferbar, für Betriebe von 50 bis 150 Mitarbeitern.

### Die drei Bereiche

| # | Bereich | Inhalt | Haltung |
|---|---|---|---|
| 1 | **Diagnose und Strategie** | Workshop: Use Cases, Aufgaben und Prozesse definieren. KI-Vision. Roadmap mit wirtschaftlichem Nutzen je Use Case | Einstieg in die Leiter |
| 2 | **Umsetzung auf bestehender Kundenarchitektur** | Kunde hat schon Copilot oder Langdock, manibase hilft beim Agentenbau | **wird ungern gemacht** („in einer bestehenden Architektur herumpfuschen") |
| 3 | **Eigene Architektur (Premium)** | n8n, Open WebUI oder LibreChat auf privater Cloud des Kunden. Prozesse und Automatisierungen sauber aufgesetzt | Zielgeschäft |

**Der KI-Klartag ist nicht verschwunden, er ist Bereich 1 geworden.** Aus einem
alleinstehenden Produkt mit Preisschild wurde die erste Stufe einer Leiter. Das löst
das Vertriebsproblem aus E2, ohne den Inhalt aufzugeben.

### Das Einführungsprojekt im Detail

- **Technische Bereitstellung:** private Cloud des Kunden, Basis Open WebUI,
  modellagnostisch, in Deutschland auf Azure- oder Stackit-Modellen, alternativ
  komplett lokal auf eigenen Servern. Zugang für alle Mitarbeitenden über die
  hauseigene **Microsoft Entra ID**.
- **Begleitung:** Workshops, Kick-offs, Projektmanagement, Change-Management.
- **Erste Use Cases:** Wissensdatenbank für **DIN-Normen**, Text- und
  Angebotsbausteine für den Betrieb.

### Eigentum und Abrechnung

- Der Code der Helfer (Bodo und folgende) **gehört manibase**, nicht dem Kunden.
- Individualisierungen für den Kunden (Prompt-Vorlagen, Schnittstellen zur hauseigenen
  Software) **gehören dem Kunden**.
- Der Kunde **rechnet die Cloud selbst ab** und kann eigenständig weiterarbeiten,
  auch wenn es manibase nicht mehr geben sollte.

**Bewertung:** Der letzte Punkt ist das stärkste Vertrauensargument im gesamten
Material. Er beantwortet gleichzeitig das 96-%-Hemmnis (Datensicherheit) und die
unausgesprochene Lock-in-Angst. Gehört prominent auf die Seite, nicht ins Kleingedruckte.

### Empfehlung zu Bereich 2

Nicht mit gleichem Gewicht ausstellen. Was auf der Seite steht, bestimmt, welche
Anfragen kommen. Wer Bereich 2 gleichrangig zeigt, bekommt Bereich-2-Anfragen.
Entweder weglassen oder ausdrücklich als Brücke formulieren („Sie arbeiten schon mit
Copilot? Wir helfen punktuell weiter, der saubere Weg ist aber eine eigene Architektur").

---

## E4 · Produktreife (Stand 3.8.2026)

| Produkt | Funktion | Reifegrad | Konsequenz für die Seite |
|---|---|---|---|
| **Bodo** (Name nicht final) | Baudokumentation, Spracheingabe, Wiederauffinden | **Erste Versionen im Test.** Feedback von Architekturbüro und einem Spenglerbetrieb, der es ausprobiert hat | einziger zeigbarer Kandidat, aber ohne festen Namen |
| **PIA** | Frühe Grundstücks- und Projektprüfung für Architektur- und Planungsbüros | **Entwurfsphase.** Infopaper vom 26.7.2026 geht an potenzielle Pilotpartner, Experteninterviews geplant | als Pilotpartner-Aufruf zeigbar, nicht als Produkt |
| **Anton** | Angebotsvorarbeiten | **Existiert nicht, kein Konzept.** Angebotsprozess in den Betrieben muss erst verstanden werden | nicht zeigen |

**Namenssystem:** Der Anfangsbuchstabe ist an die Funktion gekoppelt.
**B**odo → **B**audokumentation · **P**IA → **P**lanung/Projektprüfung ·
**A**nton → **A**ngebote. Das System trägt. „Stefan, der Standortanalysehelfer" ist
durch PIA überholt und entfällt.

Damit ist auch die Sorge aus E2 erledigt, die Reihe sei rein männlich: PIA ist weiblich.

**Haltung des Kunden zu den Figuren:** „müssen nicht zwingend auf die Webseite, die
vielleicht etwas kitschig aussehen". Eventuell später eigene Seite je Helfer mit Bild
und Funktionsbeschreibung.

**Empfehlung:** Helfer vorerst **nicht** auf die Startseite. Begründung: Bodos Name ist
nicht final, Anton existiert nicht, PIA sucht noch Pilotpartner. Drei Produktkacheln,
hinter denen nichts Kaufbares steht, treffen genau die 57-%-Skepsis gegenüber
Praxisreife. Die Startseite verkauft das Einführungsprojekt. Produkte bekommen eigene
Seiten, sobald sie liefern.

---

## E5 · Der unfaire Vorteil

Zwei nachprüfbare Fakten, die im Wettbewerb unbesetzt sind:

- **Nikolaus Schauersberger:** 15 Jahre als freiberuflicher Softwareentwickler vor der
  Gründung.
- **Matthias Geisler:** erfahrener IT-Projektmanager für die Einführung von
  **Dokumentenmanagementsystemen**.

Die DMS-Einführung ist strukturell dieselbe Disziplin wie eine KI-Einführung:
Dokumentprozesse, Change-Management, Widerstand in der Belegschaft, Altbestand.
Das ist keine Marketingbehauptung, sondern ein überprüfbarer Werdegang.

Die Recherche (`00-recherche.md`, Abschnitt 4) zeigt: **Kein einziger der sechs
untersuchten Wettbewerber zeigt Gründergesichter.** Das ist die offene Flanke, und
manibase hat jetzt die Substanz, sie zu besetzen. Gehört above the fold.

---

## E6 · Beweisführung: Gründer statt Referenzen

**Ausgangslage (Stand 3.8.2026):**

| Kunde | Freigabe | Belastbarkeit |
|---|---|---|
| Architekturbüro (18 MA) | **vertraglich als Referenz vereinbart** | Pilotprojekt läuft noch, kein Ergebnis vorzeigbar |
| Spenglerbetrieb | – | kein zitierbarer Satz |
| Dachdecker | – | nichts Belastbares |
| Garten- und Landschaftsbau | – | nichts Belastbares |

**Entscheidung:** Kein Ergebnis-Testimonial. Stattdessen vier Anker:

1. **Gründergesichter und Werdegang** (siehe E5). Im Wettbewerb unbesetzt, 0 von 6.
2. **Das laufende Projekt als Tatsache**, nicht als Erfolgsmeldung:
   „Wir führen derzeit bei einem Architekturbüro mit 18 Mitarbeitern ein KI-System ein."
   Behauptet kein Ergebnis, belegt die Tätigkeit. Freigabe liegt vor.
   Nebeneffekt: „18 Mitarbeiter" ist die wirksamste Antwort auf die 59-%-Barriere
   („lohnt nur für größere Betriebe").
3. **Der Prozess, minutiös beschrieben.** Überprüfbar statt behauptet.
4. **Eigentum und Datenschutz konkret**: private Cloud, Kunde rechnet selbst ab,
   kann ohne manibase weiterarbeiten.

**Bauvorgabe:** Der Platz für ein echtes Kundenzitat wird eingeplant, aber leer
gelassen. Nach Abschluss des Pilotprojekts wird eine Zeile getauscht, nicht die Seite
umgebaut.

**Verboten** (aus `00-recherche.md`, Abschnitt 4): erfundene Kundenzahlen, anonyme
Zitate, die wie echte aussehen, gekaufte Siegel, Referenzbehauptungen aus dem Vorleben
ohne Beleg.

---

## E7 · Kontaktadresse vereinheitlicht

`kontakt@demiospace.ai` war eine Legacy-Adresse und stand noch an 5 Stellen
(impressum.html, datenschutz.html 2×, index.html, scripts/site.js), während der Rest
der Seite bereits `kontakt@manibase.de` nannte. Umgestellt am 3.8.2026, die Seite ist
jetzt durchgängig. Inhaltlich sonst nichts an Impressum und Datenschutz geändert.

---

## E8 · Preis: keine Zahl auf der Seite, aber die Form

**Entscheidung: kein Preis auf der Website.**

**Interne Kalkulation (nicht öffentlich):** Retainer **2.000 bis 5.000 € im Monat**,
Projektlaufzeit **3 bis 6 Monate**, bei größeren Organisationen standardmäßig eher 6.
Zielgröße 5.000 €/Monat. Ein zweiter Kunde würde noch zu vergünstigten
Pilotkonditionen aufgenommen.

**Warum kein Preis:** Zu viele Faktoren, und es fehlen Ankerwerte aus abgeschlossenen
Projekten. Der Preis hängt an Organisationsgröße, Schulungsbedarf, Umfang der
Compliance-Arbeit (Nutzungsrichtlinien), Anzahl Schulungssitze, Teamgröße, Zeit für
Use Cases, Onboarding und KI-Champion-Training.

**Im Markt vertretbar:** capmo und hero nennen ebenfalls keinen Preis (2 von 6).
Aber NN/g (Loranger 2013) gilt weiter: Wer den Preis verbirgt, wirkt ausweichend.

**Deshalb wird statt der Zahl die Form gezeigt:**

1. **Die Struktur:** „Projektlaufzeit drei bis sechs Monate, Abrechnung als monatlicher
   Retainer." Keine Zahl, aber eine Größenordnung zum Einordnen.
2. **Die Preistreiber offen auflisten:** Teamgröße, Schulungsbedarf, Compliance-Umfang,
   Anzahl Use Cases, KI-Champion-Training. Wirkt souverän statt ausweichend.
3. **Was der Kunde *nicht* an manibase zahlt:** laufende Modell- und Cloudkosten gehen
   direkt an Azure oder Stackit. Entschärft die Abo-Fallen-Angst und stützt das
   Eigentumsargument aus E3.

**Konsequenz:** Die 16 Nennungen von „1.800 € Festpreis" auf der Seite gehören zum
Klartag und passen nicht mehr zum Modell. Muss beim Umbau aufgelöst werden.

---

## E9 · Pilotkonditionen als Haltung, nicht als Schwäche

Auf `infotermin.html` und `interessent.html` steht bereits:
„Wir nehmen aktuell nur noch **3 Projektpartner** auf, die Plätze vergeben wir nach
Eingang und einer kurzen Eignung."

Das ist die richtige Formulierung und wird auf die neue Startseite gehoben. Ein junges
Unternehmen ohne Referenzen wirkt schwach; ein Unternehmen, das bewusst nur drei
Partner aufnimmt, wirkt selektiv. Dieselbe Tatsache, andere Haltung, und sie ist wahr.

Gekoppelt an den Werdegang aus E5 ergibt das die Position: junges Unternehmen,
erfahrene Leute, sucht gerade die richtigen ersten Partner.

---

## Gefundene Fehler auf der Live-Seite

| Fund | Ort | Status |
|---|---|---|
| Kontaktadresse uneinheitlich | 5 Stellen | **behoben** (E7) |
| Infotermin-Termine abgelaufen (29.07./31.07., heute 3.8.) | `infotermin.html` | offen, Entscheidung des Kunden |
| „per Zoom" im Text, „per Teams" in der Auswahl | `infotermin.html` | offen |

---

## E10 · Eingänge: aus vier Türen werden zwei

**Ist-Zustand:** Die Seite hat vier konkurrierende Eingänge — 15-Minuten-Gespräch
(Startseite), Infotermin (`infotermin.html`), „Ich habe Interesse"
(`interessent.html`), KI-Klartag (`ki-klartag.html`).

Die Recherche ist eindeutig: immer ein CTA-**Paar**, nie mehr. 11 von 11 Anbietern
haben genau einen Button im Header. Der einzige Ausreißer (openhandwerk, vier
Hero-CTAs) wird in der Auswertung als verwässert beschrieben.

**Entscheidung:**

```
Primär    Erstgespräch buchen        für die, die reden wollen
Sekundär  Nächste KI-Sprechstunde    für die, die erst zuhören wollen
```

Das entspricht dem Sales-led-Muster von capmo, sablono und moser.

- `ki-klartag.html` entfällt als eigener Eingang (der Klartag ist Bereich 1 eines
  Projekts, siehe E3).
- `interessent.html` wird Auffangformular, keine eigene Tür mehr.

---

## E11 · Veranstaltungsformate

### KI-Sprechstunde für Bau und Handwerk (das Zielformat)

Kostenlos, online, rund eine Stunde. Inhalt: was heute machbar ist, wie man es selbst
umsetzen könnte (Open WebUI installieren, eigenes Projekt anlegen, Workshops).
Haltung ausdrücklich: „Das könnten die Betriebe vermutlich auch selbst, wir können es
besser begleiten." Am Ende ein QR-Code, unverbindlich, ohne Druck. Vorbild Baulig.

**Als wiederkehrender Rhythmus bauen, nicht als Einzeltermine.**
„Jeden ersten Mittwoch, 19:30 Uhr" veraltet nie. Zwei feste Daten veralten am dritten
Tag, genau das ist im Juli passiert.

### Weitere Formate

- **Infotermin kommende Woche:** eigenes Format für **SHK-Handwerksbetriebe**, um
  Baudokumentation und Angebotserstellung in einem **Verbundprojekt mit fünf Betrieben**
  zu starten. Einmalig, nicht das wiederkehrende Format.
- **Vorträge bei Branchenverbänden** (Bauplaner- und Bau-Info-Veranstaltungen) als
  fester Kanal. Termine auf der Website, direkte Anmeldung.

### Einwilligungsstruktur

Das Dilemma „Daten vorab sammeln oder nicht" ist ein Scheinwiderspruch: Für einen
Online-Termin ist die E-Mail-Adresse zwingend, sonst kann der Einwahllink nicht
zugestellt werden. Die eigentliche Frage ist die spätere Werbenutzung, und die braucht
eine **getrennte** Einwilligung (Zweckbindung).

| | |
|---|---|
| **Pflicht-Checkbox** | „Einladung, Einwahllink und Erinnerung." Zweckgebunden, kein Marketing |
| **Optionale zweite Checkbox** | „Außerdem alle paar Wochen eine kurze Mail." Ungehakt voreingestellt |
| **QR-Code am Ende der Veranstaltung** | Für alle, die danach mehr wollen |

Die Pflicht-Variante ist auf `infotermin.html` bereits sauber gebaut. Es fehlt nur die
zweite, optionale Box. Vom externen DSB (DSZ365) gegenprüfen lassen.

---

## E12 · Zwei Marken, ein Layer-Modell

**Das ist die zentrale Entscheidung des ganzen Konzepts.** Es gibt nicht eine Zielgruppe
mit zwei Formaten, sondern **zwei Marken mit getrennten Märkten**.

| Ebene | Inhalt | Marke |
|---|---|---|
| **Layer 0** · Reine Information | YouTube (Long- und Shortform), LinkedIn, Instagram. Kein Gegenwert verlangt, reiner Goodwill | matthias-geisler.com |
| **Layer 1** · Erste Interaktion und Community | kostenlose Community · kostenlose KI-Sprechstunden · kostenfreie Workshops (verlost, bis 5 Teilnehmer, 4 Stunden hands-on, erste reale Ergebnisse) · E-Mail-Newsletter | matthias-geisler.com |
| **Layer 2** · Schulung und Einführung | Schulungen, saubere KI-Einführung, **Compliance-Check mit AVV, TOMs und VVT**, vom DSB abgesegnet, einmalige Hilfe oder leichtes Coaching | matthias-geisler.com |
| **Layer 3** · Diagnose und Strategie | Der **Klartag als strategisches Instrument**, im besten Fall integraler Teil eines großen Projekts. Kanal: kostenlose Infoveranstaltungen bei **Handwerksinnungen und Kreishandwerkerschaften**. Auftritt als strategischer Partner, nicht als Sprechstunde | **manibase.de** |
| **Layer 4** · Prozessbegleitung | Hilfe auf der Kundenwelt: Microsoft Copilot, erste RAG-Systeme, NotebookLM. **Krücke, nicht nachhaltig.** Nur wenn der Kunde wirklich Hilfe braucht und gut bezahlt | **manibase.de** |
| **Layer 5** · Infrastruktur und Assets | **Flaggschiff.** Assets, Agents und Workflows auf hauseigener Infrastruktur: n8n, Open WebUI, manibase-Worker, Cockpit mit Standardmodulen. Teurer, steigert aber den Firmenwert des Kunden. Langfristige Partnerschaft, monatliche Retainer für Wartung, Service, Weiterentwicklung. Perspektive: einzelne Module als SaaS | **manibase.de** |

### Zielgruppen der beiden Marken

- **matthias-geisler.com:** kleine Handwerksbetriebe, die Orientierung und Hilfe suchen.
  Wenig Geld, viel Reichweite, Vertrauen aufbauen, Referenzen und Testimonials sammeln.
- **manibase.de:** größere Handwerksbetriebe, Bauplaner, Bauingenieure und
  baubranchenspezifische Unternehmen mit **dutzenden bis hunderten Mitarbeitern**,
  Zielkorridor **100 bis 200**. Auftritt als strategischer Partner.
  Geschäftsziel: 100 bis 200 solcher Kunden bedeuten volle Auslastung.

### Damit ist Frage 7 beantwortet, gegen die Empfehlung

Empfohlen war die Startseite für 10 bis 30 Mitarbeiter. **Entschieden ist das Gegenteil:
manibase.de schreibt für die Großen.** Die Begründung trägt: Der kleine Markt ist nicht
verloren, er wandert nur auf die persönliche Marke, wo er ohne Preisdruck bedient
werden kann.

### Konsequenzen, die daraus zwingend folgen

1. **Der Claim „Holen Sie sich Ihre Abende zurück" gehört nicht mehr auf manibase.de.**
   Er ist auf einen Inhaber gemünzt, der selbst abends Angebote schreibt. In einem
   Betrieb mit 150 Mitarbeitern entscheidet eine Geschäftsführung oder IT-Leitung, und
   deren Problem ist nicht der eigene Feierabend. Der Claim ist gut, aber er gehört
   nach matthias-geisler.com.
2. **Die gesamte heutige Startseite ist auf den falschen Kunden geschrieben**
   (Pains, Helden, Wertband, Klartag-Funnel). Das ist kein Redesign mehr, das ist
   ein Neubau der Texte.
3. **Teile der Recherche müssen neu gewichtet werden.** Die Bitkom-Studie 2025 befragt
   **Handwerksunternehmen**, überwiegend klein. Für Betriebe mit 100 bis 200
   Mitarbeitern tragen Befunde wie „84 % kein Thema" oder „lohnt nur für größere
   Betriebe" **nicht mehr**. Was bleibt: Datenschutz- und Sicherheitsbedenken,
   Zweifel an Praxisreife, Angst vor Kontrollverlust.
4. **Der relevante Wettbewerb verschiebt sich.** Nicht mehr plancraft, craftnote,
   meisterwerk, hero (Werkzeuge für kleine Handwerksbetriebe), sondern **capmo,
   nevaris, sablono, cosuno**. Und genau diese vier zeigen keine Preise, machen keine
   Gewerke-Seiten und segmentieren nach Rolle und Unternehmenstyp. Die
   Preisentscheidung aus E8 und die Absage an Gewerke-Seiten sind damit rückwirkend
   besser begründet als vorher.

### Offen

- **Sekundärer CTA:** Die KI-Sprechstunde scheidet aus (gehört zu Layer 1 und damit
  zur anderen Marke). Ersatz noch offen.
- **„Erstgespräch buchen" gilt dem Kunden als ausgelutscht.** Bessere Formulierung
  gesucht. Aus der Recherche: CTA wörtlich benennen, nicht „Jetzt durchstarten".
  Kandidat mit Substanz, weil er den unfairen Vorteil aus E5 nutzt:
  ein Gespräch **direkt mit den Gründern**, nicht mit einem Vertrieb.
- **Übergabe zwischen den Marken:** Was passiert, wenn ein Zwölf-Mann-Betrieb auf
  manibase.de landet? Verweis auf matthias-geisler.com oder stiller Verlust?
- Schreibweise **manibase-Worker** bestätigen (im Diktat stand „Manybase").

---

## E13 · Segmentierungsachse: nach Betriebsgröße, nicht nach Gewerk

**Status: durch E12 weitgehend erledigt.** Die Achse ist Betriebsgröße und Reifegrad,
und sie verläuft zwischen den beiden Marken statt innerhalb einer Seite.

---

## E14 · Werteangebot für manibase.de: fünf Argumente, zwei Lager

Die Kaufgründe, die der Kunde nennt. Sortiert nach Funktion im Verkaufsgespräch.

### Der Rahmen: Kosten des Wartens

Kein eigenes Argument, sondern die Klammer, die alle anderen dringlich macht:

> Alles, was jetzt unstrukturiert eingeführt wird und woran sich die Belegschaft
> gewöhnt, führt in ein bis zwei Jahren zu einem schmerzhaften Transformationsprojekt,
> wenn der Wildwuchs wieder eingesammelt und sauber neu aufgesetzt werden muss.
> Jetzt ist das Fenster, es von Anfang an richtig zu bauen.

Das ist die stärkste Erzählung im ganzen Material, weil sie „wir haben noch Zeit" in
„Warten wird teurer" umdreht. Gehört in den Hero oder direkt darunter.

### Lager A: Risiko vermeiden (verschafft das Gespräch)

| # | Argument | Substanz |
|---|---|---|
| 1 | **Schatten-KI und Compliance** | Belegschaft nutzt irgendwelche Tools. Keine Einführung, keine Schulung, kein Onboarding, keine Richtlinien, keine TOMs. manibase liefert Compliance-Check mit AVV, TOMs und VVT, vom DSB abgesegnet |
| 2 | **Datensouveränität** | Baubranche ist besonders empfindlich (Entwürfe, geistiges Eigentum). Kein US-Transfer. Eigener Server beim Kunden, den er selbst betreut, ein- und ausschaltet, sichert. Für hochsensible Daten komplett lokale Verarbeitung möglich (z. B. Mac Mini vor Ort) mit Open-Source-Modellen |

### Lager B: Wert schaffen (rechtfertigt das Budget)

| # | Argument | Substanz |
|---|---|---|
| 3 | **Kosteneffizienz** | Lizenzmodelle wie Copilot skalieren linear mit der Kopfzahl. Eine tokenbasierte Architektur ist deutlich günstiger: für die breite Masse der Verwaltung ein kleineres, spezialisiertes Modell per API-Inferenz statt überall Frontier-Modelle |
| 4 | **Firmen-Assets statt Abhängigkeiten** | Was auf eigenen Servern läuft, ist ein Asset, keine Liability. Proprietäre Prozesse und Automatisierungen steigern Unternehmenswert und Bewertung, besonders relevant bei einer **Unternehmensübergabe** |
| 5 | **Systemintegration** | Mit ChatGPT oder Claude sind tiefe Integrationen schwer. Die eigene Infrastruktur ist das Bindeglied, um bestehende Systeme und Datenbestände anzuzapfen und intern weiterzuverwerten |

### Empfohlene Reihenfolge auf der Seite

Defensive Argumente verschaffen Termine, offensive rechtfertigen Budgets.
Also: **Rahmen (Kosten des Wartens) → 1 → 2 → 3 → 4**, Nummer 5 als technische Tiefe
weiter unten oder auf einer Unterseite.

Nummer 4 ist der ungewöhnlichste Gedanke im ganzen Material und im Wettbewerb
unbesetzt. In inhabergeführten Bauunternehmen dieser Größe ist die Nachfolge ein
Dauerthema.

### Zwei Warnungen

**Zu Nummer 4:** „steigert EBITDA und Bewertung erheblich" ist ohne Beleg eine
Behauptung der Sorte, vor der `00-recherche.md` Abschnitt 4 ausdrücklich warnt.
Die Logik (proprietäre Prozesse sind Vermögenswerte) trägt, die Bezifferung nicht.
Formulieren als Eigentumsfrage, nicht als Renditeversprechen.

**Zu Nummer 3:** Das ist das einzige Argument, zu dem eine **harte Zahl** möglich ist.
manibase kann den eigenen Preis nicht zeigen (E8), aber die **Kostenrechnung des
Kunden** sehr wohl: Lizenzkosten pro Kopf und Jahr gegen tokenbasierte Inferenz für
dieselbe Belegschaft. Aktuelle Lizenzpreise vor Veröffentlichung verifizieren.
Das wäre die einzige belastbare Zahl auf der ganzen Seite und entsprechend wertvoll.

Die zwei vom Kunden beschriebenen Formate beschreiben nicht zwei Veranstaltungen,
sondern **zwei verschiedene Kundentypen**:

| | KI-Sprechstunde | Strukturierte Einführung |
|---|---|---|
| Zielgruppe | Handwerksbetriebe, kleinere Planungsbüros | „größere Betriebe" |
| Haltung | „Das könnt ihr auch selbst, wir begleiten besser" | „Um Systematik kommen Sie nicht herum" |
| Ergebnis | Hilfe zur Selbsthilfe | Retainer 3–6 Monate, eigene Infrastruktur |

Damit ist die Achse **Betriebsgröße und Reifegrad**, nicht Gewerk. Das entspricht
capmo, nevaris und plancraft („Segmente" nach Betriebsgröße auf der Startseite) und
umgeht das Substanzproblem der Gewerke-Seiten (nur 30–40 % echter Inhalt, siehe
`00-recherche.md`).

**Ungeklärter Widerspruch, blockiert die Tonalität der ganzen Seite:**

| Quelle | Betriebsgröße |
|---|---|
| `PRODUCT.md`, heutige Seite | 10–20 Mitarbeiter |
| Pilotkunde Architekturbüro | 18 |
| Einführungsprojekt laut E3 | 50, 100 oder 150 |
| Spengler, Dachdecker, GaLaBau | vermutlich unter 20 |

**Empfehlung:** Startseite für 10–30 Mitarbeiter schreiben, mit einer sichtbaren Tür
für Größere. Begründung: reale Kundenliste, das beste Argument („18 Mitarbeiter, und
es funktioniert") und der Claim „Holen Sie sich Ihre Abende zurück" zeigen alle in
dieselbe Richtung. Der Claim ist auf einen Inhaber gemünzt, nicht auf eine
Geschäftsführung. Größere Betriebe kommen ohnehin über Verband und Vortrag, nicht über
die Startseite.

Drei Achsen stehen zur Wahl. Aus der Recherche (`00-recherche.md`, Abschnitt 2):

- **Nach Gewerk** (plancraft 18 Seiten, hero ~26, meisterwerk 21, craftnote 9).
  Ehrlicher Substanzanteil nur 30–40 %, echte Differenzierung braucht
  gewerkespezifische Schnittstellen (DATANORM, IDS Connect). Für manibase heute
  nicht einlösbar.
- **Nach Rolle oder Unternehmenstyp** (capmo, nevaris, sablono, openhandwerk).
  Capmo, das optische Vorbild, macht es so.
- **Nach Anwendungsfall.** Ergibt sich neu aus der Kundenlage: Baudokumentation ·
  Angebotsabwicklung · Standortanalyse und Projektentwicklung · Corporate LLM.
  Zwei unabhängige Kunden (Architekturbüro, Spengler) fragen dasselbe nach, das ist
  ein Produktsignal.

---

## E15 · Was gezeigt wird: die Architektur, nicht die Gesichter

**Entscheidung des Kunden:** Gesichter und Helfer-Figuren sind nicht das Beweismittel
für manibase.de. Sie gehören zum kleinen Handwerksbetrieb, also zur anderen Marke
(E12). Gezeigt wird stattdessen **die Architektur**.

### Das Leitbild der Seite: der Architektur-Vergleich

Zwei Schaubilder nebeneinander auf einer Seite:

| | |
|---|---|
| **links** | die manibase-Grundarchitektur, grob als Referenzdiagramm. Bewusst **ohne** Produktnamen wie n8n oder Open WebUI im Bild, sonst verliert man sich im Werkzeugkasten |
| **rechts** | die herkömmliche Variante: über Microsoft gelöst, im schlimmsten Fall direkt über ChatGPT |
| **darunter** | Vor- und Nachteile beider Wege gegenübergestellt |

**Bewertung: das ist der stärkste Inhalt der neuen Seite.** Er beweist Kompetenz, macht
das Datensouveränitäts-Argument (E14 Nummer 2) sichtbar statt behauptet, trägt
gleichzeitig das Kosten- (Nummer 3) und das Eigentumsargument (Nummer 4) und verrät
kein einziges Kundengeheimnis. Ein Bild statt drei Absätzen Text.

**Warnung, ernst gemeint:** Eine Gegenüberstellung, bei der links alles grün und rechts
alles rot ist, liest sich als Werbung und verliert genau den Leser, den sie gewinnen
soll. Eine IT-Leitung in einem Betrieb mit 150 Mitarbeitern kennt die Microsoft-Welt
besser als wir. Der Vergleich ist nur glaubwürdig, wenn er die echten Vorteile der
Gegenseite benennt: tiefe Integration in eine vorhandene Microsoft-Landschaft, kein
eigener Betrieb, sofort verfügbar, ein Vertragspartner. Die manibase-Seite gewinnt
trotzdem, weil sie bei Datenhoheit, Kosten pro Kopf und Eigentum vorne liegt. **Ein
fairer Vergleich, den man verliert, überzeugt mehr als ein unfairer, den man gewinnt.**

### Screenshots: was geht, was nicht

| Motiv | Verfügbar | Entscheidung |
|---|---|---|
| Open WebUI / LibreChat | ja, sofort | zeigen, aber **ehrlich beschriften**: „So sieht der Zugang für Ihre Mitarbeitenden aus." Es ist Open-Source-Software, nicht manibase-Eigenentwicklung. Als eigenes Produkt ausgegeben wäre es genau die Sorte Behauptung, die ein technischer Leser in zehn Sekunden auffliegen lässt |
| n8n-Workflow | ja, sofort | zeigen, als Beleg für „hier läuft echte Automatisierung", nicht als Produkt |
| **Cockpit mit den Helfern** | technisch ja, **UX noch nicht vorzeigbar** | **vorerst nicht zeigen** |
| Bodo im Einsatz (UGC-Video, Baustelle + Bildschirm) | machbar | gute Idee, **nicht Priorität 1**. Kommt, wenn Bodos Name final ist (E4) |
| Fotos aus echten Projekten, Workshop-Situationen | nein | später |

**Zum Cockpit:** Das ist der wunde Punkt. Es ist das Flaggschiff-Asset aus Layer 5, und
es ist das Einzige, was manibase wirklich selbst gebaut hat. Nicht zeigen ist richtig,
solange es nicht dem Branchenstandard entspricht. Aber: **das Designsystem, das wir
gerade für die Website bauen, ist zugleich das Designsystem fürs Cockpit.** Dieselben
Farben, dieselbe Typoskala, dieselben Karten und Abstände. Wer beides in einer
Handschrift baut, spart sich die zweite Grundsatzentscheidung und bekommt einen
Screenshot, der irgendwann von selbst passt. Das sollte beim Bau mitgedacht werden.

### Korrektur zur Ausgangslage

„Fotos von uns haben wir noch nicht" trifft nur auf Projekt- und Workshop-Fotos zu.
**Zwei brauchbare Porträts liegen bereits im Repository** (`site/assets/matthias.jpg`,
`site/assets/nikolaus.webp`) und sind auf der heutigen Seite im Einsatz. Sie bleiben
verwendbar.

### Was das an E5 und E6 ändert

E6 hatte die Gründergesichter zum ersten Beweisanker erklärt und „above the fold"
verortet. **Das wird korrigiert, aber nicht gestrichen.** Für eine Geschäftsführung
mit 150 Mitarbeitern lautet die stille Frage nicht „sind das sympathische Leute",
sondern „gibt es diesen kleinen Anbieter in zwei Jahren noch, und kann er das
überhaupt". Auf die erste Hälfte antwortet der Werdegang (E5), auf die zweite
antwortet die Architektur.

**Neue Rangfolge der Beweismittel auf manibase.de:**

1. **Architektur-Vergleich** — beweist Können
2. **Screenshots** (Open WebUI, n8n) — beweist, dass es real läuft
3. **Das laufende Projekt als Tatsache** (E6 Punkt 2) — beweist Praxis
4. **Gründer mit Werdegang** (E5) — beweist Verlässlichkeit, aber weiter unten,
   nicht im Hero
5. **Platzhalter für das erste echte Kundenzitat** (E6) — bleibt leer

### Produktionsaufwand, ehrlich benannt

Von den fünf Beweismitteln existiert heute genau eines fertig (Gründerfotos). Der
Architektur-Vergleich ist **noch zu erstellen**, und er ist kein Nebenprodukt: zwei
saubere Diagramme plus eine faire Vor-/Nachteil-Tabelle. Das ist Arbeit, die vor dem
Bau der Seite erledigt sein muss, nicht währenddessen. Screenshots sind eine Stunde,
das Diagramm ist ein Termin.

---

## E16 · Ein Leser, ein Vetogeber

**Befund aus der Praxis:** In allen bisherigen Gesprächen war der Ansprechpartner die
**Geschäftsführung**. Ein Gegenbeispiel gibt es, und es ist lehrreich.

> **Der Fall Bruxafort.** Workshop zum Konzept der eigenen Architektur. Am Tisch saßen
> der IT-Leiter, einige Mitarbeitende und die Assistenz der Geschäftsführung. Die beiden
> Geschäftsführer **nicht**. Ergebnis: kein Projekt.

**Interpretation, vorsichtig:** Ein einzelner gescheiterter Workshop beweist keine
Regel, es können Budget, Zeitpunkt oder Passung dahinterstecken. Aber er passt zum
Muster aller anderen Gespräche, und die Richtung ist eindeutig genug, um danach zu
bauen.

### Die Asymmetrie

**Die IT kann dieses Projekt nicht kaufen, aber sie kann es verhindern.**

Das ist kein klassisches Buying Center mit zwei Entscheidern, sondern ein Entscheider
und ein Vetogeber. Daraus folgt für die Seite etwas anderes, als ich in Frage 10
vermutet hatte:

| | |
|---|---|
| **Die Startseite hat genau einen Leser:** die Geschäftsführung | Nutzen, Risiko, Kosten, Eigentum. Keine Halbtechnik, die niemanden erreicht |
| **Die IT bekommt eine eigene Seite** | Aufgabe ist **nicht**, die IT zum Kauf zu überreden. Aufgabe ist, ihr das Nein zu nehmen |

Eine Seite, die versucht, beide gleichzeitig zu bedienen, wird für die Geschäftsführung
zu technisch und für die IT zu dünn. Getrennte Ebenen sind hier keine Bequemlichkeit,
sondern Voraussetzung.

### Die technische Unterseite (erste inhaltlich begründete Unterseite)

Trocken, vollständig, ohne Verkaufston. Sie beantwortet die Fragen, die eine IT-Leitung
stellt, bevor sie gefragt wird:

- Wer **betreibt** das System, wer hat Root, wer patcht?
- Was passiert bei **Ausfall**, wie sieht **Backup** und Wiederanlauf aus?
- Wie hängt es an der vorhandenen **Entra ID**, wie an bestehenden Systemen?
- **Wo liegen die Daten**, welcher Anbieter, welche Region, welcher Vertrag?
- Was passiert, **wenn es manibase nicht mehr gibt** (Antwort steht in E3 und ist stark)?
- Was muss die IT selbst leisten, und was ausdrücklich nicht?

### Das Veto vorab entschärfen: die IT einladen, nicht umgehen

Die zweite Frage des Kunden („wie decken wir das IT-Veto im Vorfeld ab") hat eine
Antwort, die zugleich die Lehre aus Bruxafort umsetzt: **Die Einladung zum Erstgespräch
sagt selbst, wer dabei sein soll.**

> „Das Gespräch führen wir mit der Geschäftsführung, gern zusammen mit Ihrer IT."

Das leistet drei Dinge auf einmal:

1. Es macht die Anwesenheit der Geschäftsführung zur Bedingung, ohne unhöflich zu sein.
   Der Bruxafort-Fall wäre so nicht zustande gekommen.
2. Es holt die IT **früh** an den Tisch. Eine IT-Leitung, die erst erfährt, dass etwas
   läuft, wenn entschieden ist, legt aus Prinzip das Veto ein. Eine, die von Anfang an
   gefragt wurde, wird zum Fürsprecher.
3. Es signalisiert Ebenbürtigkeit: Wer sagt, wer am Tisch sitzen soll, verkauft nicht,
   sondern prüft mit.

Die vorhandene **Qualifizierungs-Maske** auf der heutigen Seite fragt die Rolle bereits
ab. Der Mechanismus ist gebaut, er muss nur diesem Zweck dienen.

### Was der Geschäftsführer davon hat

Die erste Frage des Kunden („welchen konkreten Nutzen hat der Geschäftsführer") ist mit
E14 schon beantwortet, aber die Zuordnung wird hier scharf:

| Leser | Argumente aus E14 |
|---|---|
| **Geschäftsführung** | Rahmen (Kosten des Wartens) · 1 Schatten-KI und Haftung · 2 Datensouveränität · 3 Kosten pro Kopf · 4 Firmen-Asset und Nachfolge |
| **IT-Leitung** | 2 Datensouveränität technisch · 5 Systemintegration · plus die Betriebsfragen oben |

Argument 5 (Systemintegration) war in E14 als „technische Tiefe weiter unten" markiert.
**Es gehört jetzt konkret auf die IT-Seite** und hat dort einen Adressaten.

### Konsequenz für den CTA

Der seit E12 offene Punkt bekommt Kontur: Der CTA muss **selektieren**, nicht nur
einladen. Ein Gespräch, das ohne Geschäftsführung stattfindet, ist verlorene Zeit für
beide Seiten. Formulierungen, die das leisten, ohne abweisend zu wirken, sind der
nächste offene Punkt.

---

## Unberührt

`impressum.html`, `datenschutz.html`, `site/api/*.php` und alles rund um Sicherheit
bleiben inhaltlich unverändert (Kundenvorgabe).
