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

## E6 · Segmentierungsachse für Unterseiten

**Status: offen.**

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

## Unberührt

`impressum.html`, `datenschutz.html`, `site/api/*.php` und alles rund um Sicherheit
bleiben inhaltlich unverändert (Kundenvorgabe).
