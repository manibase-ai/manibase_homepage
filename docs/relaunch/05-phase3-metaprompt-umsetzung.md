# Metaprompt für ein frisches Umsetzungsfenster

Den folgenden Prompt vollständig in ein neues Codex-Fenster kopieren:

---

JETZT ÄNDERN

Du setzt jetzt die dritte, kombinierte Fassung des Relaunchs von manibase.de um.

## Verbindliche Hauptanweisung

Lies zuerst diese Datei vollständig und behandle sie als finalen Umsetzungsauftrag:

`C:\Users\Matthias\.claudecode\Manibase New Website\docs\relaunch\04-phase3-umsetzungsplan-final.md`

Lies danach die dort genannten Relaunch-Grundlagen nur soweit nötig. Bei Widersprüchen hat der finale Phase-3-Plan Vorrang. Ergänze keine eigenen Angebote, Texte, Claims, Effekte oder Seiten, die dort nicht vorgesehen sind.

## Unveränderliche Vergleichsstände

Diese beiden Verzeichnisse sind verbindliche Vergleichsstände und dürfen unter keinen Umständen verändert, überschrieben, formatiert oder bereinigt werden:

1. `C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase1-baseline\site`
2. `C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase2-v1\site`

Erstelle eine dritte, separat startbare Fassung unter:

`C:\Users\Matthias\.claudecode\Manibase New Website\versions\2026-08-13-phase3-combined\site`

Falls dieses Ziel bereits existiert, überschreibe es nicht ungeprüft. Ermittle zuerst, ob es zum aktuellen Auftrag gehört und bewahre alle vorhandenen Arbeiten.

## Arbeitsweise

1. Fasse zu Beginn knapp zusammen, was du umsetzen wirst.
2. Prüfe `git status --short` und bewahre ausnahmslos alle fremden Änderungen.
3. Lies Projektanweisungen und relevante Dateien vollständig.
4. Vergleiche Phase 1 und Phase 2 ausschließlich lesend.
5. Bestimme die geeignete technische Basis und kopiere sie in Phase 3.
6. Bearbeite ausschließlich die neue Phase-3-Version und die für diesen Auftrag ausdrücklich vorgesehenen lokalen Dokumentationsartefakte.
7. Nutze die vorhandenen Design-Tokens, Komponenten und Schriften, soweit sie zur freigegebenen Phase-3-Gestaltung passen.
8. Setze alle Punkte des finalen Plans um, nicht nur die Startseite.
9. Ändere keine Rechtsseiten oder produktiven Integrationen, sofern der Plan dies nicht ausdrücklich verlangt.
10. Verwende keine destruktiven Git-Befehle.

## Quellen und Medien

Die lokalen Quelldateien stehen hier:

- `C:\Users\Matthias\Downloads\Manibase Logo no text.png`
- `C:\Users\Matthias\Downloads\Screenshot eigene KI-Plattform.jpg`
- `C:\Users\Matthias\Downloads\compagnons-Im_cQ6hQo10-unsplash.jpg`
- `C:\Users\Matthias\Downloads\sebastien-bonneval-UIpFY1Umamw-unsplash.jpg`

Verändere die Originale nicht. Lege bei Bedarf optimierte Kopien nur in Phase 3 an. Erhalte alle Schwärzungen des Plattform-Screenshots. Binde die beiden Unsplash-Credits exakt mit den im finalen Plan dokumentierten Fotografen- und Fotolinks ein.

Für Microsoft 365 Copilot verwende bevorzugt das offizielle, im Plan angegebene Microsoft-Asset. Verzerre oder verfremde keine Markenlogos.

Für die neue Seite „Individuelle KI-Helfer“ darfst du die aktuelle öffentliche Seite `https://manibase.de/` ausschließlich lesend als inhaltliche und visuelle Referenz prüfen. Übernimm keine älteren Aussagen, die dem finalen Plan oder Copy-Deck widersprechen. Für das Navigationsprinzip darfst du das aktuelle Capmo-Aufklappmenü ausschließlich als Referenz untersuchen.

## Nicht verhandelbare Inhaltsregeln

- immer die Markenschreibweise „manibase“;
- keine unbelegten Claims;
- keine pauschalen Rechts- oder Datenschutzversprechen;
- keine erfundenen Referenzen;
- keine überzogenen Erfolgsversprechen;
- keine nicht belegten Einsparquoten;
- keine Akkreditierung der manibase-Schulungen behaupten;
- Schulungszertifikate korrekt als von manibase ausgestellt darstellen;
- keine pauschale Art.-4-EU-AI-Act-Konformität versprechen;
- eigene Kunden-Cloud und Microsoft-365-Weg klar unterscheiden;
- Microsoft nicht als Gegner darstellen;
- Hero-Aussage und Hero-Absatz exakt gemäß finalem Plan erhalten;
- keine alten Preise oder Funnel-Aussagen aus `CLAUDE.md` übernehmen, wenn sie dem finalen Relaunch-Plan widersprechen.

## Navigation

Unter „KI-Einführung“ gibt es genau vier Unterseiten:

1. Der Einstieg: Unser Klartag
2. Einführung
3. Prozessautomation
4. Individuelle KI-Helfer

„KI-Einführung“ selbst ist nur der Menüauslöser und keine fünfte Zielseite. Zielgruppen enthält Baugewerbe und Planungsbüros. Danach folgen Über uns und Für Ihre IT.

## Qualitätssicherung

Führe nach der Umsetzung eine vollständige Prüfung durch:

- starte alten Entwurf, neuen Entwurf und Phase 3 auf getrennten Localhost-Instanzen;
- prüfe Desktop, Tablet und Smartphone;
- prüfe horizontale Überläufe, Navigation, Dropdowns, Links, CTAs und Formulare;
- spiele den Formularablauf vollständig durch;
- prüfe Tastaturbedienung, Fokus, Semantik, Alt-Texte und Kontraste;
- prüfe Bildzuschnitte, Fotografen-Credits, Logos und den geschwärzten Screenshot;
- kontrolliere alle sichtbaren Claims gegen den finalen Plan;
- verwende nach Codeänderungen den passenden Code-Reviewer und behebe berechtigte Funde;
- führe einen abschließenden Browser-Regressionstest durch.

Wenn ein Test wegen einer fehlenden lokalen Voraussetzung nicht möglich ist, dokumentiere exakt, was geprüft wurde und was nicht. Ersetze einen fehlgeschlagenen Test nicht durch eine Behauptung.

## Grenzen

- nicht deployen;
- nicht pushen;
- keinen Pull Request erstellen;
- nichts veröffentlichen;
- keine externen Systeme verändern;
- keine Vergleichsversion verändern;
- keine fremden Arbeitsbaumänderungen zurücksetzen;
- keine neuen Ideen außerhalb des finalen Plans ergänzen.

## Abschluss

Beende die Umsetzung erst, wenn die neue Phase-3-Fassung separat aufrufbar ist und die Prüfungen abgeschlossen sind. Nenne anschließend:

1. den Pfad der neuen Version;
2. die drei Localhost-URLs;
3. die wichtigsten umgesetzten Bereiche;
4. die geprüften Viewports und Funktionen;
5. verbleibende Platzhalter oder echte Blocker.

Danach automatisch in den Feedbackmodus zurückkehren. Weitere Website-Änderungen nur nach einem neuen ausdrücklichen `JETZT ÄNDERN`.

---
