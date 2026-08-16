# Umsetzungsplan für den inhaltlichen Relaunch von manibase.de

**Stand:** 13. August 2026  
**Grundlage:** `docs/relaunch/00-relaunch-briefing.md`  
**Priorität:** Inhalt und Konsistenz vor visueller Ausgestaltung  
**Ziel:** belastbarer, überprüfter Relaunch ohne erfundene Produktreife oder Claims

---

## 1. Arbeitsprinzipien

1. Das Relaunch-Briefing ist die fachliche Single Source of Truth.
2. Bestehende Copy wird nicht nur kosmetisch überarbeitet; Angebots- und
   Argumentationsstruktur werden zuerst korrigiert.
3. Die Startseite verkauft ein Hauptangebot: strukturierte KI-Einführung.
4. Klartag, Architekturwege und individuelle Software werden hierarchisch korrekt
   eingeordnet.
5. Visuelle Gestaltung beginnt erst, wenn Copy und Seitenstruktur inhaltlich stehen.
6. Jede Leistungs-, Technik- und Compliance-Aussage wird auf Belegbarkeit geprüft.
7. Bestehende Nutzeränderungen und nicht zum Relaunch gehörende Dateien bleiben
   unangetastet.
8. Kein Deployment, Merge oder Push ohne ausdrücklichen Auftrag.

---

## 2. Zielzustand des Seitensystems

### Kernseiten

| Seite | Zielrolle |
|---|---|
| `index.html` | Hauptpositionierung, Problemhierarchie, Angebotsweg, Proof und Anfrage |
| `klartag.html` | verpflichtendes Diagnoseprodukt, Ablauf, Ergebnisse, Preis 3.900 € netto |
| `einfuehrungsprojekt.html` | sechsmonatige Einführung, Architekturgabel, drei Anwendungen, Befähigung |
| `fuer-ihre-it.html` | Betrieb, Architektur, Daten, Verantwortlichkeiten, Governance und Exit |
| `ueber-uns.html` | Gründer, Qualifikation, Projekterfahrung und direkte Verantwortung |

### Zu integrierende oder nachrangige Seiten

| Bestehende Seite | Maßnahme |
|---|---|
| `firmen-ki.html` | nicht als gleichrangiges Produkt; Inhalte in Architekturgabel/IT integrieren oder klar nachrangig führen |
| `prozessautomatisierung.html` | als möglicher Lieferbaustein und Anwendungsform integrieren; keine gleichrangige Hauptwelt |
| `ki-helfer.html` | aus Navigation und Hauptpfad entfernen oder vollständig auf reale Reifegrade umstellen |
| `ki-klartag.html` | alte Seite dauerhaft aus öffentlichem Pfad entfernen oder auf `klartag.html` weiterleiten |
| Blog mit Kleinbetriebs-/Feierabend-Positionierung | nicht als tragender Inhalt der neuen Positionierung verwenden |

### Vorläufige Navigation

Maximal fünf Punkte plus CTA:

```text
KI-Einführung
Anwendungen
Der Klartag
Für Ihre IT
Über uns
[Jetzt anfragen]
```

Die endgültigen Labels werden im Copy-Schritt geprüft. Keine tiefe Mega-Navigation.

---

## 3. Phasen und Arbeitspakete

## Phase 0 – Bestand sichern und Arbeitsbereich prüfen

### Aufgaben

- `git status --short` ausführen und vorhandene Nutzeränderungen dokumentieren;
- keine fremden Änderungen zurücksetzen;
- aktuelle Marketingseiten und gemeinsame CSS-/JS-Dateien erfassen;
- prüfen, ob bereits ein lokaler Server oder Browser-Testpfad vorhanden ist;
- bestehende Inhalte und Links inventarisieren;
- sicherstellen, dass Rechtstexte und API-/Formularlogik nicht unbeabsichtigt geändert
  werden.

### Ergebnis

- klare Liste der zu bearbeitenden Dateien;
- dokumentierter Ausgangszustand;
- keine verlorenen Nutzeränderungen.

---

## Phase 1 – Copy-Agent erneut beauftragen

### Aufgabe

Den Auftrag aus `docs/relaunch/02-copy-agent-auftrag.md` an einen geeigneten
deutschsprachigen B2B-Copy-Agenten geben.

Der Agent soll:

- das neue Relaunch-Briefing vollständig berücksichtigen;
- die bisherigen Audit-Ergebnisse nicht blind wiederholen;
- alle aktuellen Seiten gegen die neuen Entscheidungen prüfen;
- eine vollständige Copy-Deck-Fassung liefern;
- Widersprüche, unbelegte Claims und notwendige Freigaben markieren;
- keine Website-Dateien verändern.

### Gate 1

Vor Implementierung müssen mindestens vorliegen:

- finale Startseitenstruktur;
- Hero, Subline und CTA;
- Problemsektionen A/B/C;
- Angebotsweg;
- Klartag-Copy inklusive 3.900 € netto;
- Architekturgabel;
- Projektversprechen mit drei gemeinsam produktiv umgesetzten Anwendungen;
- Proof- und Governance-Copy;
- Änderungsempfehlungen je Unterseite.

---

## Phase 2 – Inhaltsarchitektur festlegen

### Aufgaben

1. Copy-Deck gegen Relaunch-Briefing prüfen.
2. Jede Sektion einer einzigen Käuferfrage zuordnen.
3. Wiederholungen zwischen Startseite und Unterseiten entfernen.
4. Angebotsphase, technische Option und Produktart sauber trennen.
5. festlegen, welche vorhandenen Seiten integriert, umgeleitet oder aus der Navigation
   entfernt werden.
6. CTA-Pfade vereinheitlichen.
7. Footerclaim und Meta-Texte an die neue Positionierung anpassen.

### Empfohlene Käuferfragen auf der Startseite

1. Ist das für ein Unternehmen wie unseres?
2. Welches Problem löst manibase?
3. Warum reicht Nichtstun, Copilot oder ein weiteres Einzeltool nicht immer?
4. Was kaufe ich zuerst?
5. Was passiert nach dem Klartag?
6. Welche technische Architektur ist möglich?
7. Was wird nach sechs Monaten erreicht?
8. Wie werden IT, Datenschutz und Mitarbeitende eingebunden?
9. Warum können Matthias und Nikolaus das liefern?
10. Wie frage ich an?

### Gate 2

- genau ein Hauptangebot erkennbar;
- Klartag eindeutig verpflichtender Einstieg;
- eigene Architektur und Microsoft 365 als Gabelung erklärt;
- individuelle Software nachrangig, aber auffindbar;
- keine unreifen Helfer als fertiges Portfolio;
- Problemhierarchie A → B → C sichtbar.

---

## Phase 3 – Wahrheits- und Claim-Gate

Vor dem Schreiben in HTML eine Claim-Matrix anlegen:

| Claim | Status | Beleg | Freigabe/Prüfung |
|---|---|---|---|
| 3.900 € netto für Klartag | bestätigt | Preisentscheidung 13.08.2026 | frei |
| mindestens drei Anwendungen gemeinsam produktiv | bestätigt als Leistungsversprechen | Briefing | Vertrag/Scope berücksichtigen |
| Open WebUI auf Kunden-Cloud | aktuelles Betriebsmodell | Architektur | technisch prüfen |
| Microsoft Foundry Region Frankfurt | geplant/konfigurationsabhängig | Vertrag/Deployment | vor Veröffentlichung prüfen |
| kein Modelltraining mit Kundendaten | konfigurations-/vertragsabhängig | Anbieterunterlagen | vor Veröffentlichung prüfen |
| TÜV SÜD Akademie AI Strategy & Application Expert | bestätigt | Zertifikat | Markenregeln beachten |
| Architekturbüro mit 18 Mitarbeitenden | bestehender Projektstatus | Projekt | Freigabe prüfen |
| 50 % Zeitersparnis | unbewiesen | keiner | nicht veröffentlichen |

### Aufgaben

- alle neuen Texte durch diese Matrix prüfen;
- Rechts-/Datenschutzclaims mit zuständiger Stelle abgleichen;
- Microsoft- und Hosting-Aussagen technisch verifizieren;
- IP-/Eigentumssätze gegen Vertrag prüfen;
- Proof-Screenshots anonymisieren und Freigabe dokumentieren.

### Gate 3

Kein P0-Claim ohne Beleg oder klare Kennzeichnung als Ziel, Test beziehungsweise
Architekturoption.

---

## Phase 4 – Copy in die Website implementieren

### Reihenfolge

1. Navigation und Footerstruktur;
2. Startseite;
3. Klartag;
4. Einführungsprojekt;
5. Für Ihre IT;
6. Über uns;
7. Integration beziehungsweise Rückbau der nachrangigen Seiten;
8. Meta-Titel und Meta-Descriptions;
9. Formulare und CTA-Microcopy;
10. interne Links und Weiterleitungen.

### Startseite – Zielsektionen

1. Hero;
2. früher Proof;
3. Schatten-KI und Kontrolle;
4. Fachzeit und konkrete Arbeitswelten;
5. Insellösungen und gemeinsame Ebene;
6. Anfrage → Klartag → Umsetzung;
7. Klartag mit Preis;
8. eigene Architektur versus Microsoft 365;
9. drei gemeinsam produktiv umgesetzte Anwendungen;
10. AI Champions, Schulung und Governance;
11. Gründer und Delivery-Kompetenz;
12. finaler CTA.

### Umsetzungsregeln

- zuerst vorhandene Komponenten wiederverwenden;
- keine neue visuelle Komponentenbibliothek entwickeln, solange Content nicht stabil ist;
- Platzhaltertexte vollständig entfernen;
- keine sichtbaren internen Produktionsnotizen;
- kein Screenshot, der Produktreife überzeichnet;
- rechtliche Seiten inhaltlich nicht ohne eigenen Auftrag ändern;
- Formulare und Kalenderfunktion erhalten, nur Beschriftung und Kontext anpassen.

---

## Phase 5 – Technische Konsolidierung

Nur soweit für einen sicheren Relaunch notwendig:

- duplizierte Navigationen und Footer konsistent nachziehen;
- tote oder alte Links entfernen;
- alte Klartag-Seite weiterleiten oder sicher aus dem öffentlichen Pfad nehmen;
- nicht mehr verwendete Marketingelemente erst nach Verwendungsprüfung entfernen;
- CSS nur für tatsächlich benötigte Contentstrukturen anpassen;
- bestehendes JavaScript nicht architektonisch neu schreiben, sofern es funktioniert;
- Seiteneinstieg des Formulars mitschicken, wenn ohne großen Eingriff möglich.

Kein Wechsel zu React, CMS oder einem großen Framework für diesen Relaunch.

---

## Phase 6 – Inhaltliche und funktionale Verifikation

### Automatisierte Prüfungen

- interne Links und Assets;
- HTML-Struktur und doppelte IDs;
- alle öffentlichen Preisvorkommen;
- alte Produktnamen und unreife Helfer;
- Begriffe wie „Beratung“, „DSGVO-konform“, „alles gehört Ihnen“, „50 %“;
- Meta-Titel und Meta-Descriptions;
- Formular- und Kalenderpfad;
- fehlende Alt-Texte;
- mobile Überläufe.

### Manuelle Inhaltsprüfung

Nach fünf Sekunden muss ein Testleser beantworten können:

1. Was macht manibase?
2. Für wen ist das Angebot?
3. Welches Hauptproblem wird gelöst?
4. Was ist der erste bezahlte Schritt?
5. Was geschieht danach?

Nach vollständiger Startseite zusätzlich:

6. Worin unterscheiden sich eigene Architektur und Microsoft 365?
7. Was wird nach sechs Monaten erreicht?
8. Was muss der Kunde beitragen?
9. Wer trägt fachliche und technische Verantwortung?
10. Was ist der nächste Schritt?

### Funktionsprüfung

- Desktop und Mobil;
- Navigation und mobile Navigation;
- alle CTA-Links;
- Qualifizierungsformular;
- Kalender erst nach vorgesehener Aktion;
- Tastaturnavigation;
- Reduced Motion;
- keine externen Medien ohne Einwilligung;
- keine vertraulichen Daten in Bildern.

### Gate 4

Kein Relaunch, wenn:

- mehrere Hauptangebote gleichrangig erscheinen;
- Preisangaben widersprüchlich sind;
- alte Helfer als fertig erscheinen;
- technische Claims ungeprüft sind;
- Platzhalter öffentlich sichtbar bleiben;
- Anfrage- oder Kalenderpfad nicht funktioniert.

---

## Phase 7 – Visuelle Vertiefung nach dem Inhalts-Relaunch

Nicht Teil des ersten Content-Gates. Anschließend möglich:

- Open-WebUI-Screenshot professionell anonymisieren und ins Layout setzen;
- Cockpit-Screenshot aufbereiten;
- Prozessgrafik für Schatten-KI versus gemeinsame Plattform;
- Architekturgabel visualisieren;
- echtes Roadmap-Artefakt zeigen;
- Erklärvideo mit 60–75 Sekunden entwickeln;
- später Baudokumentations-App und Kundenstimme ergänzen.

Das Video darf die Hauptargumentation nicht ersetzen. Die Seite muss ohne Wiedergabe
vollständig funktionieren.

---

## 4. Definition of Done

Der inhaltliche Relaunch ist abgeschlossen, wenn:

- Zielgruppe 50–500 Mitarbeitende aus Bau und Planung klar ist;
- Problemhierarchie Schatten-KI → Fachzeit → Insellösungen verständlich ist;
- strukturierte KI-Einführung das einzige Hauptangebot ist;
- Klartag als verpflichtender Einstieg mit 3.900 € netto sichtbar ist;
- eigene Architektur und Microsoft 365 korrekt eingeordnet sind;
- mindestens drei Anwendungen als gemeinsame produktive Umsetzung formuliert sind;
- Kundenmitwirkung auf der Projektseite transparent ist;
- Governance, Schulung und interne Befähigung erkennbar sind;
- Softwareentwicklung als begründete Option statt als Standard erscheint;
- reale Proof-Assets verwendet und korrekt anonymisiert sind;
- keine unreifen Produkte, erfundenen Ergebnisse oder pauschalen Rechtsclaims erscheinen;
- Navigation, CTA, Formular und mobile Darstellung funktionieren;
- kein Deployment ohne ausdrückliche Freigabe erfolgt.

---

## 5. Empfohlene Übergabe im neuen Kontext

Das neue Kontextfenster soll zuerst vollständig lesen:

1. `docs/relaunch/00-relaunch-briefing.md`
2. `docs/relaunch/01-umsetzungsplan.md`
3. `docs/relaunch/02-copy-agent-auftrag.md`
4. `docs/audit/00-abschlussbericht.md`

Danach:

1. Arbeitsbaum prüfen;
2. Copy-Agent mit dem vorbereiteten Auftrag starten;
3. Copy-Ergebnis gegen das Briefing prüfen;
4. Plan aktualisieren;
5. erst dann Website-Dateien ändern.

