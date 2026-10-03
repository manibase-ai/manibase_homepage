# Konzept: Antworten auf den Emotions-Check vom 01.10.2026

Grundlage: `marketing/workspace/daten/261001-emotions-check/` (Report und `reportdaten.json`), Ergebnis **43 von 100**.
Neu dazugekommen ist die Vorgabe der Geschäftsführung zur Zielgruppe:

> Die Geschäftsführung will **am** Unternehmen arbeiten, nicht **im** Unternehmen. Damit sie dafür Zeit hat, gehören Büro- und Informationsweitergabe-Tätigkeiten auf ein Minimum reduziert.

Dieser Satz schließt die Lücke, die der Report als „Was die Geschäftsführung selbst umtreibt“ offen lässt, und er wird hier zur Leitidee für die ganze Startseite.

> **Stand 02.10.2026: Paket 1 und 2 umgesetzt** (Branch `copy/emotions-check-paket-1-2`). Entscheidungen der Geschäftsführung: Hauptüberschrift Fassung 1 · Betriebsgröße wird **nicht** genannt · Verrechnungssatz **100 €** je Stunde (geprüft, siehe Abschnitt 4) · höchstens **10 Klartage** im Monat · Modulpreise **noch nicht** · Werkstattbericht Architekturbüro auf die **nächste Iteration** verschoben.

---

## 1. Leitidee: zwei Ebenen, ein Zustand

Die Seite beschreibt heute gut, was **Fachkräfte** Zeit kostet (Blatt 01). Sie sagt nicht, was das den **Betrieb** und die **Geschäftsführung** kostet. Die neue Leitidee verbindet beides:

| Ebene | Heute (Pain) | Danach (Zustand, Stufe 4) |
|---|---|---|
| Geschäftsführung | Sie ist die Drehscheibe. Wer etwas wissen will, fragt oben. Wer etwas weitergeben muss, gibt es über oben weiter. Abends wird abgezeichnet, eingesammelt, weitergeleitet. | Informationen erreichen die Richtigen ohne Umweg über ihren Tisch. Die Zeit geht in Akquise, Personal, Strategie. |
| Team | Suchen, Nacharbeiten, Abtippen, Nachfragen. | Fachzeit für fachliche Entscheidungen (steht schon auf `baugewerbe.html`, gehört nach oben). |
| Absicherung (Seelenfrieden) | Wildwuchs mit privaten KI-Konten, unklare Datenwege, Haftung bei der Geschäftsführung. | Geregelt und dokumentiert, wer im Betrieb welche KI mit welchen Daten nutzt. |

**Erzählbogen der Startseite danach:** Zustand der Geschäftsführung (Hero) → woher die Zeit verloren geht (Blatt 01, Team) → was das hochgerechnet kostet (neu: Maßkette) → wie es sicher wird (System, Prüftore, Governance) → womit man anfängt (Klartag mit Preis neben dem Nutzen) → wer dahintersteht → Gespräch.

Die Bausteine, Blattköpfe und das Design bleiben. Geändert wird vor allem Text, dazu zwei kleine neue Bausteine.

---

## 2. Hero (Leiterstufe, größter Einzelhebel)

**Kicker bleibt** unverändert (Langform ist durch CLAUDE.md gesetzt und trägt die Branchen).

**Hauptüberschrift, drei Fassungen:**

1. **(empfohlen)** *Mehr Zeit, am Unternehmen zu arbeiten. Weniger Zeit für Ablage und Rückfragen.*
   Spricht die Geschäftsführung direkt an, ist ein Zustand und nimmt die bekannte Formel auf, die Inhaber kennen.
2. *Weniger Rückfragen auf Ihrem Tisch. Mehr Zeit, das Unternehmen zu führen.*
   Das konkretere Bild („auf Ihrem Tisch“), dafür etwas weniger Wiedererkennung.
3. *Mehr Fachzeit zwischen Plan, Baustelle und Büro: KI übernimmt Suchen, Sortieren und Protokollieren, Ihr Team gibt frei.* (Vorschlag aus dem Report)
   Gut, aber auf Ebene Team. Passt besser als Unterzeile oder als Kopf von Blatt 01.

**Unterzeile** (holt „Plan, Baustelle und Büro“ als Zugehörigkeitssignal zurück und spielt den Seelenfrieden oben aus):

> Zwischen Plan, Baustelle und Büro übernimmt KI das Suchen, Sortieren, Protokollieren und Weitergeben. Ihr Team gibt frei, Ihre Daten bleiben in Ihrer Cloud, und kein Baustein geht ungeprüft in Betrieb.

**Microcopy unter den Buttons** (statt „Erhalten Sie eine Ersteinschätzung …“):

> 30 Minuten, Geschäftsführung mit Geschäftsführung. Danach wissen Sie, ob sich ein Klartag für Sie lohnt, auch wenn die Antwort Nein heißt.

~~**Betriebsgröße sichtbar machen**~~ Entschieden 02.10.2026: wird nicht genannt. Die Größe bleibt Frage 1 der Maske.

---

## 3. Blatt 01: Ergebniszeilen auf Zustand, Brücke zur Geschäftsführung

Die Überschrift „Niemand hat Zeit. Und doch verschwenden Fachkräfte …“ bleibt, der Report zählt sie zu den stärksten Sätzen.

**Ergebniszeilen in der Kette** von Kategorie auf Bild umstellen. Keine zusätzliche Zeile in der Kette (Vorgabe „weniger kleine Textbausteine“), stattdessen trägt der Ergebnissatz beide Ebenen:

| Situation | Heute | Neu |
|---|---|---|
| 01 Wissen | Zeitersparnis. Informationen werden anhand der Quellen gegengeprüft. | Die Projektleitung bekommt die Antwort mit Fundstelle und prüft sie dort nach. Die Rückfrage bei Ihnen entfällt. |
| 02 Dokumentation | Fertige Protokolle und Checklisten für die Mitarbeiter. | Das Protokoll liegt am selben Tag vor. Wer den Stand braucht, liest ihn nach, statt anzurufen. |
| 03 Anfragen | Datengetriebene Entscheidungsgrundlage, in einem Bruchteil der Zeit. | Sie entscheiden über die Anfrage auf einer Seite Vorprüfung, nicht nach einem Abend Lektüre. |

Anmerkung zu 03: Anton (Angebotsassistenz) ist rot und nicht buchbar. Der Satz beschreibt die Situation, nicht Anton, und darf nicht mit Anton verknüpft werden.

---

## 4. Neu: Maßkette „Hochgerechnet auf Ihren Betrieb“ (Pain beziffern, Bremse „Kein Bedarf“)

**Ort:** als Abschluss von Blatt 01, vor dem dunklen Band Blatt 02. Hell, damit nicht zwei dunkle Bänder aufeinander folgen. Darstellung als Bemaßungskette im Werkplan-Stil (gibt es als Maßkette bereits bei Time-to-Value), Zahlen in JetBrains Mono.

**Inhalt, ausdrücklich als Rechenbeispiel gekennzeichnet:**

> **Ein Rechenbeispiel. Ihre echten Werte erheben wir im Klartag.**
>
> 60 Fachkräfte × 2 Stunden pro Woche für Suchen, Nacharbeiten und Weitergeben × 100 € Verrechnungssatz
> = **12.000 € pro Woche**, das sind 120 Stunden oder rund **drei Vollzeitstellen**.
>
> Dazu die Geschäftsführung: 10 Stunden pro Woche für Rückfragen, Einsammeln und Weiterleiten × 44 Arbeitswochen
> = **55 Arbeitstage im Jahr**, die nicht in das Unternehmen fließen.

Rechenweg: 60 × 2 h = 120 h; 120 h × 100 € = 12.000 €; 120 h ÷ 40 h = 3 Stellen. 44 Arbeitswochen = 52 Wochen abzüglich rund 30 Urlaubs- und 10 Feiertagen. 10 h × 44 = 440 h ÷ 8 h = 55 Tage.

**Faktencheck 100 € je Stunde (02.10.2026).** Hält als *Verrechnungssatz* für die Fachkräfte, um die es in Blatt 01 geht (Projektleitung, Bauleitung, Planung), liegt aber am oberen Rand. Nicht als Lohn oder interne Kosten bezeichnen.
- Planungsbüros: Orientierungswerte des Bayerischen Bauministeriums (Juli 2023, zitiert im Merkblatt M02 der Bayerischen Architektenkammer, 06/2024) 86 € für Mitarbeitende und 121 € für Auftragnehmer, ausdrücklich „eher an der unteren Grenze“. Der Statusbericht 2000plus nannte schon 2001 bis 120 € für leitende Angestellte.
- Ausführende Gewerke: Verrechnungssätze 2025 laut Branchenratgebern für Gesellen rund 58 bis 72 €, für Meister 75 bis 95 € (Ballungsräume bis 85 € im Elektrohandwerk). Für die Monteursebene wären 100 € zu hoch, für Bau- und Projektleitung passend.
- Konsequenz im Text: „Verrechnungssatz je Stunde“, nie „Stundenlohn“.
Die Annahmen stehen sichtbar dabei, die Zahl ist nicht als Messwert getarnt. Damit bleibt der Abschnitt in der Haltung der Seite („was noch nicht belegt ist, behaupten wir nicht“) und verstößt nicht gegen „kein Proof-Abschnitt“.

**Ausbaustufe (optional, Paket 3):** derselbe Baustein als kleiner Rechner mit drei Reglern (Fachkräfte, Stunden je Woche, Stunden der Geschäftsführung). Erst sinnvoll, wenn die statische Fassung steht.

---

## 5. Zielgruppen auf der Startseite unterscheiden (Zugehörigkeit)

Report: „Die Startseite unterscheidet nicht zwischen Bauunternehmen, Gewerk und Planungsbüro.“

**Vorschlag:** eine schmale Wegweiser-Zeile zwischen Hero und Blatt 01, drei Einträge in der gesetzten Reihenfolge, je ein Satz aus dem Alltag und ein Link auf die Zielgruppenseite. Als Textzeile mit Trennlinien, **nicht** als drei gleiche Karten (Copy-Regel gegen identische Card-Grids).

- **Bauunternehmen:** Bautagesbericht, Mängelliste, Nachtrag. Alles läuft über die Bauleitung, und die Bauleitung läuft über Sie. → `baugewerbe.html`
- **Ausführende Gewerke:** Regiebericht, Wartungsprotokoll, Aufmaß. Bis es im Büro ankommt, wird dreimal nachgefragt. → `gebaeudetechnik-ausbau.html`
- **Planungsbüros:** Was stand im Protokoll vom März zur Fassade? Die Antwort weiß meist nur eine Person. → `planungsbueros.html`

Die Sätze greifen das Vokabular der jeweiligen Zielgruppenseite auf (CLAUDE.md, gebaeudetechnik-ausbau). Vor dem Einbau mit den Seitenköpfen abgleichen.

**Folgearbeit:** Die drei Zielgruppenseiten bekommen dieselbe Leitidee im Seitenkopf (Geschäftsführung als Drehscheibe, Zustand danach). Der Report hat nur `baugewerbe.html` geprüft.

---

## 6. Seelenfrieden vom Verfahren zur Wirkung

Die Belege stehen schon auf der Seite, sie bekommen jeweils einen Satz über den Zustand beim Leser:

| Ort | bleibt | neu dazu (eine Zeile) |
|---|---|---|
| Prüftore | „KI kommt nicht ungeprüft ins Haus.“ | *Sie wissen jederzeit, wer im Betrieb welche KI mit welchen Daten nutzt, und können jeden Baustein anhalten.* |
| Governance-Band | „KI-Einführung im Betrieb ist weit mehr als Technik.“ | Überschrift ersetzen: *Wenn jemand fragt, wer hier KI mit Kundendaten nutzt, haben Sie die Antwort schriftlich.* |
| Modulübersicht | „Ihre KI-Strategie für die Zukunft.“ (Report: Stufe 1, Floskel) | *Vom ersten Tag bis zum Helfer, der Ihrem Team das Protokoll abnimmt.* (Nicht „Vier Bausteine“, das steht schon in Blatt 04.) |

**Sachlicher Anlass, der zugleich Seelenfrieden ist:** Art. 4 der KI-Verordnung (EU) 2024/1689 gilt seit 02.02.2025. **Achtung, Rechtsstand geändert:** Der Digital Omnibus on AI, Verordnung (EU) 2026/1744, in Kraft seit 27.07.2026, hat Art. 4 abgeschwächt. Statt „ausreichende KI-Kompetenz sicherstellen“ heißt es jetzt sinngemäß „Maßnahmen ergreifen, um die Entwicklung von KI-Kompetenz zu fördern“, ausdrücklich ohne Pflicht, ein bestimmtes Niveau zu garantieren. Umgesetzter Satz im Governance-Band, mit beiden Fassungen vereinbar: *Die EU-KI-Verordnung verlangt von Betrieben, die KI einsetzen, Maßnahmen zur KI-Kompetenz ihrer Mitarbeitenden (Art. 4). Die Schulung ist deshalb Teil jeder Einführung.* Gegenlesen durch DSZ365 bleibt empfohlen.

---

## 7. Klartag: Preis neben den Nutzen (Bremse „Kein Wert“)

- **Klartag-Seite, Unterzeile zur Überschrift** „Ein Tag, bevor Sie investieren.“: *Damit Sie kein Geld in eine Plattform stecken, die nicht zu Ihrem Betrieb passt.* Spricht den Schutz aus, der heute nur anklingt.
- **Startseite, Leistungsblatt Klartag:** unter „3.900 € netto“ eine Zeile, die auf die Maßkette zurückverweist: *Im Rechenbeispiel aus Blatt 01 entspricht der Preis weniger als zwei Arbeitstagen der Zeit, die das Team mit Suchen und Weitergeben verbringt.* (3.900 € ÷ 100 € = 39 h; 120 h/Woche ÷ 5 = 24 h je Tag; 39 h ≈ 1,6 Tage.)
- **Umsetzungsmodule:** ein Preisrahmen („ab“ oder Spanne) für Firmen-KI, Automatisierung und Helfer. **Kaufmännische Entscheidung**, siehe offene Punkte.

---

## 8. Beziehung und Vertrauen (Kauf-Formel, schwächster Faktor)

Die Kauf-Formel multipliziert, deshalb ist Beziehung zusammen mit dem bezifferten Pain der größte Hebel (Report: 6 → 12 bis 16 Punkte).

**a) Werkstattbericht aus dem Architekturbüro** (gated, erst nach Freigabe live)
- Format: kurzer Block auf der Startseite unter Blatt 01, ausführlich auf `ueber-uns.html` anstelle des heutigen Abschnitts „Ein laufendes Projekt …“.
- Inhalt: Ausgangslage in zwei Sätzen, was läuft (Open-WebUI-Umgebung, Bernd), **eine** gemessene Größe (zum Beispiel Minuten je Protokoll vorher und nachher, über eine genannte Zahl von Protokollen), **ein** Satz einer Person aus dem Büro mit Rolle. Name des Büros nur mit Freigabe, sonst „Architekturbüro, Unterfranken, rund N Mitarbeitende“.
- Vorbereitung jetzt: Messgröße mit dem Büro abstimmen und ab sofort mitschreiben.
- Regel aus CLAUDE.md gilt weiter: ohne Freigabe kein Platzhalter, keine geschätzte Zahl, kein Mockup.

**b) Was ohne Kundenfreigabe geht** (belegt Funktion, nicht Kundenerfolg)
- **Bernd im Einsatz zeigen:** 60 bis 90 Sekunden Bildschirmaufnahme, ein eingesprochenes Diktat wird zum Protokoll. Mit Testdaten, sichtbar so gekennzeichnet. Bernd ist grün, das darf gezeigt werden.
- **Muster eines Klartag-Ergebnisses:** eine geschwärzte oder mit Beispieldaten gefüllte Seite der Roadmap als Bild, gekennzeichnet als Muster. Zeigt, was man für 3.900 € in der Hand hat.
- Den Satz „Ein laufendes Projekt, noch keine erfundene Erfolgsgeschichte.“ behalten. Der Report nennt ihn einen Vertrauensbeleg.

**c) Status nach innen:** Den Pflichthinweis im Formular („Die Beteiligung der Geschäftsführung ist für das Erstgespräch erforderlich.“) als Anerkennung formulieren: *Sie sprechen direkt mit uns beiden: Geschäftsführung mit Geschäftsführung.*

---

## 9. Eile (einzige Bremse, die gar nicht bearbeitet ist)

Nur echte Anlässe, keine künstliche Verknappung:

1. **Kapazität:** *Beide Gründer sitzen bei jedem Klartag mit am Tisch. Deshalb sind es höchstens zehn Klartage im Monat.* N = 10, entschieden 02.10.2026, auf der Startseite unter dem Klartag umgesetzt.
2. **Saison:** *Klartag im Winter, Einführung vor der Bausaison.* Branchenlogik, für Bau und Gewerke glaubwürdig, für Planungsbüros weniger. Eher auf `baugewerbe.html` und `gebaeudetechnik-ausbau.html` als auf der Startseite.
3. **KI-Kompetenzpflicht** (siehe Abschnitt 6): ist bereits in Kraft, also Anlass ohne Countdown.

---

## 10. Reibung im Kontaktweg

- **Zweite Tür sofort:** neben die Qualifizierungs-Maske eine Zeile *Lieber direkt? kontakt@manibase.de oder +49 15565 697065.* Heute stehen beide erst auf „Über uns“.
- **Abschlussband:** „Welche Bausteine passen zu Ihrem Betrieb?“ (fragt nach Produkt) ersetzen durch *Was landet heute auf Ihrem Tisch, das dort nicht hingehört? Klären wir es in 30 Minuten.*
- **Maske selbst:** erst messen, dann kürzen. Der Report kann Abbrüche nicht sehen. Sobald Zahlen da sind (Starts gegen Abschlüsse, datensparsam ohne Drittanbieter), entscheiden, ob Schritt 3 (KI-Stand) und 4 (Teilnehmer) ins Gespräch wandern. Bis dahin bleiben fünf Schritte, weil die Maske auch filtert.

---

## 11. Umsetzung in Paketen

| Paket | Inhalt | Aufwand | Abhängigkeit | Erwartete Wirkung laut Report-Logik |
|---|---|---|---|---|
| **1 · Text** | Hero (Abschnitt 2 ohne Größenzeile), Ergebniszeilen (3), Modul-Überschrift und Prüftor-Zeile (6), Klartag-Unterzeile (7), Abschlussband, zweite Tür, Formularsatz (10, 8c) | ½ Tag | Wahl der Hauptüberschrift | Leiterstufe +6 bis 8, Antrieb +1, Bremsen +1 |
| **2 · Neue Bausteine** | Maßkette (4), Wegweiser (5), Preiszeile im Leistungsblatt (7), Governance-Überschrift und KI-Kompetenz-Satz (6) | 1 Tag | Annahmen der Maßkette freigeben, DSZ365 für Art. 4 | Pain 3 → 4, Kauf-Formel 6 → 8, Bremsen +2 |
| **3 · Belege** (nächste Iteration) | Werkstattbericht (8a), Bernd-Video, Klartag-Muster (8b), Modulpreisrahmen (7, „noch nicht“), Zielgruppenseiten nachziehen (5). Kapazitätssatz ist vorgezogen, Größenzeile entfällt | 2 bis 3 Tage plus Freigaben | Architekturbüro, kaufmännische Entscheidungen | Beziehung 2 → 3 bis 4, Kauf-Formel bis 12 bis 16 |

Grobe Erwartung: nach Paket 1 und 2 rund **55**, nach Paket 3 rund **65 bis 70** von 100. Das sind Schätzungen aus den Punktangaben des Reports, kein Versprechen. Prüfen durch einen zweiten Emotions-Check nach jedem Paket.

**Technisch** betrifft Paket 1 nur `site/index.html` und `site/klartag.html`. Paket 2 braucht einen neuen Baustein in `site/styles/home.css` (`hp-`-Präfix) und danach `scripts/cache-bust.py site`. Kicker- und Labelgrößen über `--t-eyebrow`, eine Gelb-Geste pro Screen, keine Gedankenstriche.

---

## 12. Entscheidungen der Geschäftsführung (02.10.2026)

1. Hauptüberschrift: Fassung 1. **Umgesetzt.**
2. Betriebsgröße öffentlich nennen: **nein.**
3. Maßkette: 2 h je Fachkraft, 10 h Geschäftsführung, **100 € Verrechnungssatz** (Faktencheck in Abschnitt 4). **Umgesetzt.**
4. Kapazität: **10 Klartage im Monat.** **Umgesetzt.**
5. Preisrahmen Umsetzungsmodule: **noch nicht.**
6. Architekturbüro (Messgröße, Stimme, Name): **nächste Iteration.**
