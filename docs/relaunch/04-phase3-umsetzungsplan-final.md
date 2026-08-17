# Finaler Umsetzungsplan: manibase Relaunch Phase 3

**Stand:** 13. August 2026  
**Status:** Zur Umsetzung freigegeben, sobald der separate Umsetzungsauftrag mit `JETZT ÄNDERN` gestartet wird  
**Ziel:** Eine dritte, kombinierte Website-Fassung aus den beiden unveränderlichen Vergleichsständen erstellen  
**Komplexität:** Hoch

## 1. Verbindlichkeit und Prioritäten

Dieser Plan konsolidiert das vollständige Phase-3-Feedback. Bei Widersprüchen gilt folgende Reihenfolge:

1. Dieser finale Phase-3-Plan und die darin dokumentierten jüngsten Entscheidungen.
2. `docs/relaunch/03-copy-deck.md` als freigegebene inhaltliche Grundlage.
3. `docs/relaunch/02-copy-agent-auftrag.md`.
4. `docs/relaunch/01-umsetzungsplan.md`.
5. `docs/relaunch/00-relaunch-briefing.md`.
6. Die beiden visuellen Vergleichsstände.

Neuere Entscheidungen in diesem Plan ersetzen ältere Vorgaben insbesondere bei:

- der Navigation und den vier Unterseiten unter „KI-Einführung“;
- der eigenständigen Seite „Prozessautomation“;
- der eigenständigen Seite „Individuelle KI-Helfer“;
- der öffentlichen Benennung des Klartags ohne das Wort „verpflichtend“;
- der Darstellung der Schulungszertifikate;
- dem Betriebsmodell der privaten Kunden-Cloud.

Positionierung, Angebotslogik und bereits freigegebene Aussagen dürfen außerhalb der hier dokumentierten Änderungen nicht neu erfunden oder erweitert werden.

## 2. Unveränderliche Vergleichsstände und neues Arbeitsziel

Diese Verzeichnisse sind schreibgeschützt zu behandeln:

- Alter Entwurf: `C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase1-baseline\site`
- Neuer Entwurf: `C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase2-v1\site`

Die kombinierte Fassung wird als dritte, separat startbare Version angelegt:

- Ziel: `C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase3-combined\site`

Falls dieses Ziel beim Start bereits existiert, darf es nicht ungeprüft überschrieben werden. Zuerst Status, Inhalt und Herkunft klären.

Vor jeder Änderung:

1. `git status --short` prüfen.
2. Alle fremden Änderungen im Arbeitsbaum bewahren.
3. Beide Vergleichsstände ausschließlich lesen und visuell beziehungsweise technisch vergleichen.
4. Die geeignetere technische Basis bestimmen und in das neue Phase-3-Verzeichnis kopieren.
5. Ausschließlich Phase 3 bearbeiten.

Kein Deployment, kein Push, kein Commit, keine Veröffentlichung und keine Änderung externer Systeme.

## 3. Informationsarchitektur und Navigation

### 3.1 Hauptnavigation

Die Navigation bleibt bewusst übersichtlich:

- Startseite
- Zielgruppen
  - Baugewerbe
  - Planungsbüros
- KI-Einführung
  - Der Einstieg: Unser Klartag
  - Einführung
  - Prozessautomation
  - Individuelle KI-Helfer
- Über uns
- Für Ihre IT

Unter „KI-Einführung“ gibt es genau vier Unterseiten. Der Menüpunkt „KI-Einführung“ ist auf Desktop und Mobil der Auslöser des Untermenüs und keine zusätzliche, fünfte Zielseite. Es wird kein eigener Button für eine KI-Einführungs-Übersichtsseite ergänzt.

„Zielgruppen“ ist ebenfalls ein übersichtlicher Menücontainer für die beiden Zielgruppenseiten. Vorhandene Routen und Dateinamen aus Phase 2 sind nach Möglichkeit weiterzuverwenden, damit keine unnötigen Linkbrüche entstehen.

### 3.2 Interaktionsprinzip

Das Aufklappmenü orientiert sich funktional und visuell am Capmo-Menü, ohne dessen Inhalte oder proprietäre Assets zu kopieren:

- großzügiges, klar gruppiertes Desktop-Dropdown;
- zuverlässige Bedienung per Klick und Tastatur;
- sichtbarer Fokus;
- Schließen per Escape und Klick außerhalb;
- korrekte ARIA-Zustände;
- mobile Darstellung als verständliches Akkordeon;
- kein Hover-only-Verhalten;
- aktiven Seitenzustand kenntlich machen.

## 4. Startseite

### 4.1 Hero: textbasiert und großzügig

Der Hero wird vollständig ohne Bild und ohne Schaubild gestaltet. Der bisher links geballte Textblock wird entzerrt und erhält mehr Raum.

Diese Aussagen bleiben unverändert, solange keine neue Freigabe erfolgt:

> KI ist längst im Betrieb. Bringen Sie sie unter Kontrolle.

> KI hat in vielen Betrieben längst schleichend Einzug gehalten. Doch häufig fehlen gemeinsame Regeln, klare Zuständigkeiten und ein verlässlicher Überblick über den tatsächlichen Nutzen. manibase bringt Struktur in die bestehende Nutzung und führt KI kontrolliert im Unternehmen ein.

Die visuelle Richtung soll ruhig, hochwertig und textzentriert sein. Es werden keine neuen Hero-Effekte, Bilder oder Claims ergänzt.

### 4.2 Direkt unter dem Hero: Erklärvideo und Infobereich

Der bisherige Faktenblock mit Projektlaufzeit, Berufserfahrung und Verantwortung entfällt an dieser Stelle vollständig. Die optisch gute Grundwirkung und der dunkle Hintergrund bleiben als Ausgangspunkt erhalten.

Neue Struktur:

- ein großer, zentraler Platzhalter für ein Erklärvideo;
- rechts daneben eine kleinere, helle Infobox beziehungsweise ein kleines Schaubild;
- Infobox-Inhalte vorerst als neutrale Stichpunkt-Platzhalter;
- Desktop und Tablet: Video und Infobereich nebeneinander;
- Smartphone: Video und Infobereich untereinander;
- kein echtes Video, Autoplay oder externes Embed ergänzen, solange kein Video geliefert wurde.

### 4.3 Problem 1: ungeregelte und unsichtbare Nutzung

Der bisherige rechte Fließtext wird durch ein kompaktes Schaubild ersetzt. Der linke Problem-Titel und die Kernaussage bleiben erhalten.

Linke Seite des Schaubilds, als mehrere kleine Module in leicht roten Boxen:

- Private KI-Accounts im Einsatz
- Fehlende Datenschutzgrundlagen
- Teure Lizenzen für E-Mails und Textbausteine
- Geteilte Konten
- Keine Schulung
- Nutzen kaum messbar

Danach folgt eine gestrichelte Trennlinie. Rechts steht ein größerer Lösungsblock:

**Zentrale KI-Infrastruktur**

- Zugang für alle Mitarbeiter
- Schulung mit manibase-Schulungszertifikat
- KI-Anwendungsfälle für Geschäftsprozesse
- Anbindung an Ihre Daten möglich
- Automatisierung von Prozessen

Nicht „akkreditierte Schulung“, „staatlich anerkannt“ oder eine vergleichbare externe Anerkennung behaupten. manibase stellt die Schulungszertifikate selbst aus. Die Website darf daraus kein pauschales Compliance-Versprechen für Art. 4 EU AI Act ableiten.

Auf kleinen Bildschirmen wird das Diagramm in eine verständliche vertikale Abfolge überführt. Es darf kein horizontaler Überlauf entstehen.

### 4.4 Problem 2: Fachzeit in Nebenarbeit

Der gesamte Abschnitt wird deutlich kompakter und weniger flächenintensiv:

- vier Themen beibehalten;
- jeden Punkt mit einem eigenständigen, verständlichen Icon versehen;
- Beschreibungstexte unter den Titeln massiv kürzen;
- Innen- und Außenabstände reduzieren;
- keine vier übergroßen, inhaltsarmen Karten;
- auf Mobil als gut lesbare Einzelpunkte stapeln.

Themen:

1. Projektwissen und Recherche
2. Dokumentation und Nachweise
3. Auftrags- und Projektvorbereitung
4. Kommunikations- und Textarbeit

Die Kurztexte werden ausschließlich aus dem bestehenden Copy-Deck destilliert. Keine Einsparquoten oder neuen Leistungsversprechen ergänzen.

### 4.5 Problem 3: wachsende Insellandschaft

Der bestehende Titel ist zu lang und wird deutlich gekürzt. Der rechte Fließtext wird auf den Kern reduziert.

Inhaltlich zu erhalten:

- Für jedes Thema entsteht schnell ein weiteres Konto oder Tool.
- Dadurch wachsen Verträge, Datenwege, doppelte Funktionen und Abhängigkeiten.
- Eine gemeinsame KI-Ebene kann mehrere Anwendungen und Systeme verbinden.
- Microsoft 365 kann bei einer passenden vorhandenen Umgebung der richtige Weg sein.

Zentrale Begriffe werden visuell hervorgehoben. Die konkrete Kurz-Copy muss sachlich bleiben und darf Microsoft nicht zum Gegner erklären.

### 4.6 Neue Section: typische Anwendungsfälle

Auf der Startseite wird eine neue, kompakte Section mit genau drei Beispielen ergänzt:

1. KI-Werkzeuge und Promptvorlagen für ganze Teams erstellen.
2. Interne Dokumente mit KI schneller durchsuchen und relevante Informationen finden.
3. Wiederkehrende KI-Arbeitsschritte aufbauen, die arbeitsreife Dokumente vorbereiten.

Die Fachbegriffe „RAG“ und „Skills“ werden nicht als alleinstehende Überschriften verwendet. Falls sie technisch erwähnt werden, folgt unmittelbar eine laienverständliche Erklärung. Keine weiteren Anwendungsfälle eigenmächtig ergänzen.

### 4.7 Neue Section: Souveränität und Daten

Die Startseite erhält einen eigenständigen Bereich zu Kontrolle, Souveränität und dem Betriebsmodell der Daten.

Verbindliche Abgrenzung:

- Private Kunden-Cloud: Open WebUI, n8n und individuelle KI-Helfer laufen in der Kundenumgebung beziehungsweise auf dem Kundenserver.
- Die zugehörigen dauerhaft gespeicherten Kundendaten liegen in dieser Kundenumgebung.
- Microsoft-365-Projekte bleiben in der Microsoft-Umgebung.
- Datenwege, Modellaufrufe und Verantwortlichkeiten werden für die konkrete Architektur nachvollziehbar beschrieben.

Die Copy muss den Unterschied zwischen eigener Kunden-Cloud und Microsoft-365-Weg verständlich machen, ohne pauschale Rechts-, Datenschutz- oder absolute Datenhoheitsgarantien zu formulieren.

### 4.8 Kompakter Bereich „KI-Einführung“

Die Startseite muss das Thema KI-Einführung sichtbar erklären, die ausführlichen Inhalte liegen jedoch auf der Unterseite „Einführung“.

Startseitenumfang:

- kurzer Überblick über den Einführungsansatz;
- kompakte Vorschau der eigenen KI-Plattform;
- Einbindung des bereitgestellten, bereits geschwärzten Plattform-Screenshots;
- klare Verlinkung auf die Unterseite „Einführung“;
- kein vollständiger Plattformvergleich auf der Startseite.

Der Screenshot darf nicht nachträglich entschwärzt, rekonstruiert oder mit erfundenen Kundendaten ergänzt werden.

### 4.9 Anfrage, Klartag und zwei Folgewege

Die bisher lineare Darstellung wird zu einem gemeinsamen Einstieg mit sichtbarer Gabelung:

1. Jetzt anfragen
2. Klartag
3. Danach zwei mögliche Wege:
   - Strukturiertes KI-Einführungsprojekt
   - Individuelle KI-Softwarelösung für Ihren Betrieb

Das Wort „verpflichtend“ wird aus der sichtbaren Bezeichnung des Klartags entfernt. Die Angebotslogik bleibt dennoch: Jede Umsetzung mit manibase beginnt nach dem Erstgespräch mit einem Klartag.

Die Überschrift „Drei Schritte“ wird nicht unverändert weiterverwendet, weil sie die Gabelung falsch beschreibt. Desktop zeigt die Verzweigung grafisch, Mobil eine eindeutige vertikale Abfolge.

### 4.10 Klartag-Teaser auf der Startseite

Neue Überschrift:

> Der Klartag: Ein Tag, der Klarheit verschafft.

Subtext sinngemäß:

> Bevor wir etwas umsetzen, braucht es eine klare Strategie und eine Machbarkeitsprüfung.

Der Abschnitt wird visuell auffälliger und weniger trocken. Die vorhandenen Leistungsbausteine bleiben grundsätzlich erhalten, werden aber neu gruppiert. Das fehlerhafte Spacing rund um „Architekturentscheidung“ und den benachbarten Haken wird vollständig korrigiert.

Eine auffällige Infobox erklärt:

- Die gemeinsame Ausarbeitung von Vision und Grundvoraussetzungen ist ein wesentlicher Baustein für den Projekterfolg.
- Der Betrieb kann das Ergebnis des Klartags unabhängig weiterverwenden.
- Eigene Weiterentwicklung oder die Beauftragung anderer Dienstleister bleibt möglich.
- Es entsteht keine Bindung an ein Folgeprojekt mit manibase.

Die Preisangabe bleibt gemäß verbindlichem Copy-Deck bei 3.900 Euro netto als Festpreis, einschließlich der dort dokumentierten Bedingungen und Anrechnung. Keine alte Preisfassung aus `CLAUDE.md` übernehmen.

### 4.11 Team-Teaser

Der Teamabschnitt wird gestalterisch vollständig überarbeitet:

- Personenbilder deutlich größer;
- lebendigere, weniger tabellarische Komposition;
- kreativer Gestaltungsspielraum ist ausdrücklich freigegeben;
- Namen, Erfahrung und belegte Qualifikationen bleiben unverändert;
- keine erfundenen Referenzen oder Rollen ergänzen;
- Link zur Seite „Über uns“ beibehalten.

Die exakte Formulierung zur TÜV SÜD Akademie bleibt gemäß Copy-Deck. Nicht „TÜV-zertifizierte KI-Experten“ schreiben.

### 4.12 Anfrageformular

Im Schritt zur Unternehmensgröße werden die fünf Antwortkarten größer und bewusst auf zwei Reihen verteilt. „Mehr als 500“ darf nicht als einzelne, zufällig umgebrochene Karte stehen.

Anforderungen:

- ausgewogenes Raster auf Desktop;
- angepasste, nicht gequetschte Darstellung auf Tablet;
- einspaltig oder sinnvoll zweispaltig auf Smartphone;
- die gesamte Karte ist anklickbar;
- sichtbare Hover-, Auswahl- und Fokuszustände;
- Fortschritt, Tastaturbedienung und Validierung funktionieren weiterhin.

### 4.13 Klartag-CTA

Neue Überschrift:

> Buchen Sie Ihren Termin für einen Klartag.

Neuer Subtext:

> Erfahren Sie, wo KI in Ihrem Betrieb Potenzial hat und wie sie nachhaltig in den Betrieb integriert werden kann.

Der Button „Klartag anfragen“ bleibt erhalten.

## 5. Unterseite „Der Einstieg: Unser Klartag“

Die Seite erklärt den Klartag ausführlich:

- klare Strategie und Machbarkeitsprüfung;
- Aufnahme relevanter Abläufe und Anwendungsfälle;
- Daten und Schnittstellen;
- Architekturentscheidung;
- priorisierte Roadmap und Ergebnisdokument;
- freie Weiternutzung der Ergebnisse;
- Preis, Anrechnung und abgestimmte Reisekosten gemäß Copy-Deck;
- CTA zur Klartag-Anfrage.

Der Hero beziehungsweise der zugehörige große Rechtsbereich erhält das lokale Workshopfoto:

- Datei: `C:\Users\Matthias\Downloads\sebastien-bonneval-UIpFY1Umamw-unsplash.jpg`
- Credit: „Foto von Sebastien Bonneval auf Unsplash“
- Fotograf: `https://unsplash.com/de/@sebastien_bonneval?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`
- Foto: `https://unsplash.com/de/fotos/mann-im-grauen-hemd-vor-haftnotizen-UIpFY1Umamw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`

Das Foto wird groß auf der rechten Seite eingesetzt und responsiv sinnvoll zugeschnitten. Der Credit bleibt sichtbar und vollständig verlinkt.

## 6. Unterseite „Einführung“

Diese Seite enthält die ausführlichen Einführungsinhalte, die auf der Startseite nur angerissen werden.

### 6.1 Eigene KI-Plattform oder Microsoft 365 Copilot

Der ausführliche Plattformvergleich wird von der Startseite auf diese Seite verschoben.

Eigene Kunden-Cloud:

- Open WebUI;
- n8n;
- individuelle KI-Helfer;
- dauerhaft gespeicherte Kundendaten in der Kundenumgebung;
- Möglichkeit eigener Schnittstellen und Erweiterungen;
- konkrete Modell- und Datenwege projektbezogen dokumentieren.

Microsoft-365-Weg:

- bleibt in der Microsoft-Umgebung;
- vorhandene Identitäten, Rechte, Lizenzen und Dienste können genutzt werden;
- keine pauschale Abwertung von Microsoft.

Visuelle Kennzeichnung:

- Eigene Plattform: `C:\Users\Matthias\Downloads\Manibase Logo no text.png`
- Microsoft 365 Copilot: offizielles Copilot-Logo aus der vom Nutzer angegebenen Microsoft-Quelle bevorzugen:
  `https://store-images.s-microsoft.com/image/apps.21661.9007199267161390.afb6b8cd-d194-4a99-b633-03cd80118a21.e9a094be-ee73-4e19-8cdf-49a27b0974ed`
- Alternative Referenz nur falls erforderlich:
  `https://teamascend.com/wp-content/uploads/2024/12/Copilot-Vertical_Dark.png`

Beide Logos gleichrangig, unverzerrt und mit passenden Alternativtexten darstellen. Das offizielle Microsoft-Asset hat Vorrang vor der Drittquelle.

### 6.2 Screenshot der eigenen KI-Plattform

Der bereitgestellte Screenshot wird auf der Einführungsseite ausführlicher gezeigt und auf der Startseite nur als Vorschau verwendet:

- Datei: `C:\Users\Matthias\Downloads\Screenshot eigene KI-Plattform.jpg`
- Schwärzungen unverändert erhalten;
- keine identifizierenden Inhalte rekonstruieren;
- sachlicher Alternativtext;
- sinnvolle Darstellung auf kleinen Bildschirmen.

### 6.3 Mindestens drei Anwendungen

Der komplette Abschnitt wird auf dieser Unterseite platziert:

> Mindestens drei Anwendungen gehen gemeinsam in den Betrieb.

Mit den vier Schritten:

1. Gemeinsam entwickeln
2. Prüfen und freigeben
3. Alle Nutzer schulen
4. Dokumentiert übergeben

Die bestehende Infobox „Ihr Beitrag“ wird übernommen. Die Texte dürfen verdichtet, aber inhaltlich nicht ausgeweitet werden.

### 6.4 Regeln, Schulung und Übergabe

Der ausführliche Bereich wird vollständig auf der Unterseite „Einführung“ geführt, nicht ausführlich auf der Startseite.

Die vier Themen bleiben:

1. Regeln und Freigaben
2. Schulung aller Nutzer
3. Unterstützung bei Compliance und Datenschutz
4. Individuelle Software bei Bedarf

Karte 03 ersetzt „Interne KI-Verantwortliche“. Der Beschreibungstext erklärt organisatorische und fachliche Unterstützung, ohne Rechtsberatung oder pauschale Datenschutzkonformität zu behaupten.

Für Schulungen gilt:

- manibase führt die Schulungen durch;
- manibase stellt eigene Schulungszertifikate aus;
- keine Akkreditierung behaupten;
- keine externe Anerkennung suggerieren;
- keinen automatischen Nachweis vollständiger Art.-4-Compliance versprechen.

## 7. Unterseite „Prozessautomation“

Die Seite bleibt als eine der vier Unterseiten unter „KI-Einführung“ bestehen. Sie wird nicht aus der Navigation entfernt, auch wenn ältere Relaunch-Unterlagen dies anders vorsehen.

Umsetzungsgrundsätze:

- Prozessautomation von allgemeinen KI-Helfern verständlich abgrenzen;
- Aufnahme, Eignungsprüfung, Ausnahmefälle, menschliche Freigabe und Betrieb erklären;
- Verbindung zum Klartag und zur Machbarkeitsprüfung herstellen;
- keine erfundenen Automatisierungsfälle oder Erfolgsquoten ergänzen;
- CTAs und Navigation an Phase 3 anpassen.

## 8. Unterseite „Individuelle KI-Helfer“

Diese Unterseite wird vollständig aufgebaut beziehungsweise grundlegend überarbeitet und bleibt als eine der vier Unterseiten sichtbar.

Quellen und Vorgehen:

1. Die aktuelle öffentliche Seite `https://manibase.de/` zum Umsetzungszeitpunkt nur lesend prüfen.
2. Die dortige Header-/Hero-Komposition als gestalterische Referenz verwenden.
3. Relevante bestehende Inhalte grob übernehmen, nicht wortblind kopieren.
4. Begriffe und Aussagen an die neue Pain- und Angebotslogik anpassen.
5. Ältere, widersprüchliche Kleinbetriebs-, Produkt- oder Erfolgsclaims nicht übernehmen.

Inhaltliche Schwerpunkte:

- gemeinsame KI-Werkzeuge und Promptvorlagen für Teams;
- interne Dokumente schneller auffinden und auswerten;
- arbeitsreife Dokumente nach definierten Arbeitsschritten vorbereiten;
- wiederkehrende Prozessschritte automatisieren;
- vorhandene Daten und Systeme anbinden, sofern technisch möglich;
- individuelle Lösung nur, wenn Standardplattformen den Ablauf nicht ausreichend abbilden.

Der Hero übernimmt die strukturelle Idee der bestehenden manibase.de-Headersection. Die Begriffe müssen jedoch zu Schatten-KI, Fachzeit, Insellösungen und den tatsächlichen KI-Helfer-Angeboten passen.

## 9. Unterseite „Für Ihre IT“

Der rechte grafische Platzhalter wird durch ein großes Stockfoto ersetzt:

- Datei: `C:\Users\Matthias\Downloads\compagnons-Im_cQ6hQo10-unsplash.jpg`
- Credit: „Foto von Compagnons auf Unsplash“
- Fotograf: `https://unsplash.com/de/@sigmund?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`
- Foto: `https://unsplash.com/de/fotos/frau-im-schwarzen-hemd-sitzt-neben-schwarzem-flachbildschirm-Im_cQ6hQo10?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`

Das Foto wird groß auf der rechten Seite eingesetzt und responsiv sinnvoll zugeschnitten. Der Credit bleibt sichtbar und vollständig verlinkt.

Inhaltliche Themen bleiben:

- Zielarchitektur;
- Zugänge und Rollen;
- Daten und Modelle;
- Schnittstellen;
- Protokollierung;
- Backup;
- Verantwortlichkeiten;
- Übergabe und Exit.

Das konkrete Kunden-Cloud-/Microsoft-Betriebsmodell ist konsistent mit Abschnitt 4.7 und 6.1 darzustellen.

## 10. Seite „Über uns“ und Startseiten-Teaser

Die vollständige Seite bleibt die Detailquelle für:

- Matthias Geisler;
- Nikolaus Schauersberger;
- belegte Erfahrung;
- gemeinsame Arbeitsweise;
- exakte Qualifikation bei der TÜV SÜD Akademie.

Die Startseite zeigt einen visuellen, stark verbesserten Teaser mit größeren Fotos. Keine erfundenen Kundenlogos, Projekterfolge oder Referenzen ergänzen.

## 11. Assets und Medienverarbeitung

Alle gelieferten Assets werden nur in Phase 3 kopiert beziehungsweise eingebunden:

- `Manibase Logo no text.png`
- `Screenshot eigene KI-Plattform.jpg`
- `compagnons-Im_cQ6hQo10-unsplash.jpg`
- `sebastien-bonneval-UIpFY1Umamw-unsplash.jpg`
- offizielles Microsoft-365-Copilot-Logo

Anforderungen:

- keine Originaldateien in `Downloads` verändern;
- lokale, webgeeignete Kopien in Phase 3 anlegen, sofern lizenz- und markenkonform;
- sinnvolle Dateinamen verwenden;
- Bildabmessungen und Dateigröße optimieren;
- Seitenverhältnis erhalten;
- responsive Varianten beziehungsweise `object-position` prüfen;
- Alternativtexte setzen;
- Unsplash-Credits sichtbar und verlinkt ausgeben;
- Markenlogos nicht umfärben, verzerren oder anderweitig verfremden.

## 12. Copy-, Fakten- und Rechtsprüfung

Vor Abschluss jede sichtbare Aussage gegen diesen Plan und das Copy-Deck prüfen:

- immer „manibase“;
- keine unbelegten Claims;
- keine pauschalen Rechts- oder Datenschutzversprechen;
- keine erfundenen Referenzen;
- keine überzogenen Erfolgsversprechen;
- keine pauschale Einsparquote;
- keine Akkreditierung der manibase-Schulung behaupten;
- Schulungszertifikate korrekt als von manibase ausgestellt darstellen;
- keine pauschale Art.-4-EU-AI-Act-Konformität versprechen;
- private Kunden-Cloud und Microsoft-365-Weg sauber trennen;
- „auf Ihrem Server“ nur für die Kunden-Cloud-Komponenten und die dort gespeicherten Daten verwenden;
- Modell- und Datenwege nicht verschweigen oder absolut vereinfachen;
- Microsoft nicht pauschal abwerten;
- exakte TÜV-SÜD-Akademie-Qualifikation verwenden;
- keine alten Preise oder CTAs aus `CLAUDE.md` übernehmen.

## 13. Implementierungsphasen

### Phase A: Bestandsaufnahme

- Arbeitsbaum sichern und Fremdänderungen dokumentieren.
- Phase 1 und Phase 2 technisch und visuell vergleichen.
- Dateistruktur, Navigation, gemeinsame Komponenten und Assets erfassen.
- technische Basis für Phase 3 bestimmen.

### Phase B: Phase-3-Arbeitsversion

- separates Zielverzeichnis erstellen.
- Basis vollständig kopieren.
- eigene Startkonfiguration beziehungsweise Localhost-Port vorsehen.
- Vergleichsstände unverändert lassen.

### Phase C: Informationsarchitektur

- Navigation und mobile Navigation umbauen.
- vier KI-Einführungs-Unterseiten korrekt zuordnen.
- Zielgruppenseiten, Über uns und Für Ihre IT einbinden.
- interne Links und CTAs konsistent machen.

### Phase D: Startseite

- textbasierten Hero umsetzen.
- Video-/Infoplatzhalter ergänzen.
- drei Problembereiche überarbeiten.
- typische Anwendungsfälle ergänzen.
- Souveränitäts-/Datenbereich ergänzen.
- kompakten KI-Einführungs-/Plattformteaser integrieren.
- Angebotsgabelung umsetzen.
- Klartag-Teaser neugestalten.
- Team-Teaser neugestalten.
- Formularraster korrigieren.
- Klartag-CTA aktualisieren.

### Phase E: Unterseiten

- Klartag-Seite inklusive Workshopfoto und Credit.
- Einführung inklusive Plattformvergleich, Logos, Screenshot, Anwendungsfällen sowie Regeln/Schulung/Übergabe.
- Prozessautomation an neue Navigation und Angebotslogik anpassen.
- Individuelle KI-Helfer auf Basis der genehmigten Quellen und Pains aufbauen.
- Für Ihre IT inklusive Entwicklerfoto und Credit.
- Über uns konsistent halten.

### Phase F: Responsive und Barrierefreiheit

- Layouts für Desktop, Tablet und Smartphone nacharbeiten.
- Menü, Diagramme, Karten, Formulare und Bilder per Tastatur und Touch prüfen.
- semantische Überschriften, Alternativtexte, Fokus, Kontrast und Formularlabels prüfen.

### Phase G: Review und Korrektur

- passenden Code-Reviewer nach allen Codeänderungen einsetzen.
- Review-Funde beheben.
- Copy- und Claim-Audit durchführen.
- abschließende Regression gegen Phase 1 und Phase 2.

## 14. Verifikation und Abnahmekriterien

Alter Entwurf, neuer Entwurf und Phase 3 werden parallel auf drei getrennten Localhost-Instanzen gestartet. Exakte Ports werden nach Prüfung der vorhandenen Startbefehle gewählt und dokumentiert.

Mindestens prüfen:

- Desktop: 1280 und 1440 Pixel Breite;
- Tablet: 768 und 1024 Pixel, hoch und quer;
- Smartphone: 320, 375 und 390 Pixel;
- keine horizontalen Überläufe;
- keine abgeschnittenen Überschriften oder Karten;
- Video und Infobox auf Mobil untereinander;
- Problem-1-Schaubild mobil verständlich;
- Menüs per Maus, Touch und Tastatur;
- Escape, Fokusführung und ARIA-Zustände;
- alle internen Links und CTAs;
- Formular vollständig durchspielen;
- Auswahlkarten, Validierung und Fortschritt;
- Bilder, Zuschnitte, Logos und Credits;
- Alt-Texte und Überschriftenhierarchie;
- Farbkontraste und sichtbare Fokuszustände;
- Formulare und grundlegende Screenreader-Semantik;
- keine 404-Links;
- keine unbeabsichtigten Änderungen an Phase 1, Phase 2 oder dem bestehenden `site`-Verzeichnis.

## 15. Abschluss und Rückkehr in den Feedbackmodus

Nach erfolgreicher Umsetzung:

1. Pfad der neuen Phase-3-Version nennen.
2. Drei Localhost-URLs nennen.
3. Geänderte beziehungsweise neu erstellte Dateien zusammenfassen.
4. Durchgeführte Browser- und Barrierefreiheitsprüfungen nennen.
5. Verbleibende echte Blocker oder Platzhalter offen aufführen.
6. Nicht deployen, pushen oder veröffentlichen.
7. Automatisch zurück in den Feedbackmodus wechseln.

Weitere Website-Änderungen erfolgen danach erst nach einem erneuten ausdrücklichen `JETZT ÄNDERN`.

