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

## E2 · Segmentierungsachse für Unterseiten

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
