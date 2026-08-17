# Visual-Report: Mockup V2 gegen die aktuelle Startseite

**Stand:** 14. August 2026
**Verglichen:** `site/index-mockup-strategie-v2.html` (Mockup 02, Werkplansatz) gegen `site/index.html` (läuft auf localhost:8000)
**Maßstab:** `START-HERE-STARTSEITENSTRATEGIE.md`, Abschnitt 4 (Positionierung), 10 (Visuelle Strategie), 15 (Abnahmekriterien)

---

## 1. Gemessene Fakten

| | localhost:8000 (`index.html`) | Mockup V2 |
|---|---|---|
| Seitenhöhe Desktop 1440 | 10.133 px | 11.052 px + Footer |
| H1-Größe | 54,7 px | 77,8 px |
| Bilder auf der ganzen Seite | 4 | 4 |
| davon **inhaltliche** Bilder | **1** (`hero-hands.jpg`) | **0** |
| Gründerfotos | 2 (112 px) | 2 (132 px) |
| Dunkle Bänder | 640 px = **6 %** der Seite | 2.374 px = **21 %** der Seite |
| Hintergrundtöne hell | 5 kaum unterscheidbare Weißtöne | 2 klar getrennte Töne |
| Echte Schaubilder (meine Zählung) | 2 | 3 |
| Karten-Grids / Listen | 6 | 5 |
| Leere gestrichelte Platzhalterkästen | 0 | 3 |
| Mono-Labels (Blattköpfe, Kicker) | wenige | 31 |

## 2. Der Befund in einem Satz

Beide Seiten haben dasselbe Grundproblem in zwei Ausprägungen: **es gibt praktisch keine Bilder.** Zusammen enthalten beide Startseiten genau ein einziges inhaltliches Foto, und das zeigt Hände an einem Laptop, also exakt das Motiv, das die eigene Strategie unter „keine generische Person am Laptop" ausschließt. Alles andere ist gezeichnete Typografie.

V2 macht daraus konsequent ein System (Werkplansatz) und ist dadurch inhaltlich deutlich klarer als die Live-Seite. Aber nach elf gleich gebauten Blättern kippt die Systematik in Monotonie, und weil kein einziges echtes Motiv dagegen steht, liest sich die Seite wie ein technisches Beiblatt, nicht wie eine Website, auf der ein Bauunternehmer hängen bleibt.

## 3. Warum der Hero auf localhost ruhiger wirkt

Deine Wahrnehmung stimmt, und sie hat vier messbare Ursachen:

1. **Die Headline ist 42 % kleiner** (54,7 px gegen 77,8 px). Auf 1440 px füllt die V2-Headline vier Zeilen und über 300 px Höhe.
2. **Das lauteste Element im V2-Hero ist ein schwarzer Balken mit „ILLUSTRATION · PLATZHALTER · KEIN KUNDENBELEG".** Er hat höheren Kontrast als die H1 selbst. Das Erste, was das Auge im Bildbereich liest, ist das Wort „Platzhalter".
3. **Rund ein Drittel der Hero-Illustration ist Verwaltung**: das Schriftfeld (Projekt, Blatt, Gezeichnet, Geprüft, Stand, Maßstab) plus Disclaimer belegt etwa 205 von 614 px Illustrationshöhe. Das ist Information für den Zeichner, nicht für den Kunden.
4. **Keine Ruhefläche.** Feines Planraster im Hintergrund, Mono-Labels, drei Schriftfamilien und zwölf beschriftete Kleinelemente im selben Sichtfeld. Der localhost-Hero hat dagegen ein großes Foto als ruhige Fläche und einen Flow mit nur drei Stationen.

Wichtig: **Ruhiger heißt hier nicht besser.** Der localhost-Hero ist ruhig, aber austauschbar. Er sagt in fünf Sekunden nicht, dass es um Bau und Planung geht, und das Foto könnte auf jeder Beratungsseite stehen. V2 sagt das sofort, kauft es aber mit Unruhe.

Die richtige Antwort ist deshalb weder „V2 beruhigen" noch „localhost behalten", sondern: **V2s Mechanismus behalten, V2s Zeichnungs-Bürokratie streichen, und die fehlende Ruhefläche durch ein echtes Bild ersetzen.**

## 4. Visual-Inventar V2, Blatt für Blatt

| Blatt | Visual | Erklärt es einen Mechanismus? | Urteil |
|---|---|---|---|
| 01 Hero | Plankopf: Eingang, Pfeil, Ergebnis, Prüfstempel, Schriftfeld | ja | **Konzept richtig, Ausführung überladen.** Schwarzer Platzhalterbalken und Schriftfeld raus, dann trägt es. |
| 01b Legende | 3 Textspalten | nein | reine Aufzählung, kein Visual |
| 02 Arbeitssituationen | 3 Zeilen mit Definitionsliste plus **3 leere gestrichelte Kästen** | nein | **Schwächster Abschnitt.** 1.828 px = 17 % der Seite, davon drei sichtbare Löcher. Die „Kette" ist typografisch, nicht gezeichnet. |
| 03 System | Schnittzeichnung: gelber Klartag-Eingang, drei weiße Modulräume, schraffiertes Fundament | ja | **Bestes Asset der Seite.** Erklärt die Angebotsarchitektur in einem Blick, hält 60/30/10 ein. |
| 04 Module | Bento 2×2, Klartag gelb, Helfer tiefblau diagonal | teilweise | gute Asymmetrie, aber im Kern vier Textkarten |
| 05 KI-Helfer | 3 Datenblätter mit Stempel „REIFESTATUS OFFEN" | teilweise | ehrlich, aber drei identische Tabellen, und **drei gleiche Offen-Stempel lesen wie „nichts davon läuft"** |
| 06 Time-to-Value | Maßkette mit 5 Stationen und Torvermerken | ja | echtes Diagramm, funktioniert; Torkästen brechen den Linienrhythmus |
| 07 Governance | Cobalt-Band mit 6 nummerierten Zeilen | nein | starkes Farbband, aber inhaltlich nur eine Liste |
| 08 Klartag | gelbes Leistungsblatt mit Versatzschatten | nein | gute Gelb-Geste, kein Schaubild nötig |
| 09 Architektur | 3 gleich gebaute Karten A / B / C | nein | drei Wege, die sich visuell nicht unterscheiden, obwohl sie inhaltlich sehr unterschiedlich sind |
| 10 Team | 2 Fotos à 132 px | entfällt | **einziger menschlicher Moment der Seite, und er ist briefmarkengroß** |
| 11 Finaler CTA | dunkles Schlussblatt | entfällt | in Ordnung |

**Zusammengefasst:** von elf Blättern tragen drei ein echtes Schaubild. Sechs sind Karten oder Listen im Werkplan-Kostüm. Der Werkplansatz ist eine gute Idee, die zu gleichmäßig angewendet wird: weil alles ein Blatt ist, hebt sich nichts mehr ab.

## 5. Was ich ändern würde, nach Wirkung sortiert

### P0, ohne das bleibt alles andere kosmetisch

1. **Echte Bilder beschaffen.** Ein einziges Foto auf zwei Startseitenfassungen ist die Ursache für fast jede Schwäche in diesem Report. Siehe Aufträge 1 bis 3.
2. **Die drei gestrichelten Platzhalter in Blatt 02 füllen oder den Abschnitt halbieren.** Sichtbare Löcher auf 17 % der Seitenhöhe kosten mehr Glaubwürdigkeit, als die Ehrlichkeit einbringt.
3. **Hero entrümpeln:** schwarzen Platzhalterbalken streichen, Schriftfeld von sechs auf höchstens zwei Felder, H1 auf etwa 64 px, und die eine Gelb-Geste in die Illustration holen (Freigabestempel gelb hinterlegen statt cobalt-outline). Damit wird der Hero ruhig, ohne den Mechanismus zu verlieren.

### P1, sichtbare Aufwertung mit vorhandenen Mitteln

4. **Werkplan-Systematik von elf auf vier Blätter reduzieren.** Die Strategie nennt das selbst als offene Entscheidung. Blattköpfe nur noch bei Hero, System, Klartag und Abschluss. Die anderen Abschnitte bekommen normale Überschriften. Das allein nimmt der Seite die Gleichförmigkeit.
5. **Systembild nach oben holen.** Der Schnitt aus Blatt 03 ist das stärkste Bild, das ihr habt. Er gehört direkt unter den Hero, nicht auf Position drei.
6. **Gründerfotos groß setzen.** 132 px für den einzigen menschlichen Moment einer Seite ohne Cases und ohne Logos ist verschenkt.
7. **Architektur A/B/C visuell differenzieren.** Drei identische Karten für drei sehr unterschiedliche Wege. OpenWebUI-Umgebung, Microsoft-Tenant und standalone n8n haben unterschiedliche Formen: das sollte man sehen, nicht lesen müssen.

### P2, Feinschliff

8. **Farbrhythmus der Live-Seite ist tot.** Fünf kaum unterscheidbare Weißtöne (255/253/250/244/240) und nur 6 % dunkle Fläche. V2 macht das mit 21 % deutlich besser; das gehört in die finale Fassung übernommen.
9. **Helfer-Datenblätter:** Stempel „Reifestatus offen" dreimal nebeneinander ist eine selbst zugefügte Wunde. Bis die Produktentscheidung da ist, lieber eine ruhige Statuszeile.
10. **Maßkette Blatt 06:** Torkästen auf einheitliche Höhe, damit die Linie durchläuft.

## 6. Konkrete Produktionsaufträge an dich

### Auftrag 1: Bildmaterial aus echter Bau- und Planungsarbeit (höchste Priorität)

Die Strategie verlangt im Hero eine „authentische Bau- oder Planungssituation" und bei den Arbeitssituationen „reale Dokumenttypen oder neutrale schematische Arbeitsobjekte". Beides fehlt vollständig.

Gebraucht werden 6 bis 8 Aufnahmen, quer, mindestens 2400 px breit:

1. Planbesprechung am Tisch: ausgedruckter Plan, Rotstift, zwei Personen, schräg von oben. Gesichter nicht nötig.
2. Baustellensituation mit Gerät in der Hand: jemand hält Smartphone oder Tablet vor einem Rohbau.
3. Realer Arbeitsplatz im Planungsbüro: zwei Monitore mit CAD, daneben Papier.
4. Ordnerrücken oder Aktenlage: die Dokumentationslast als Bild.
5. Bauleiter-Notizbuch mit handschriftlichen Baustellennotizen, anonymisiert.
6. Abnahme- oder Übergabesituation: Unterschrift auf einem Protokoll.

Regeln: kein Stock-Lächeln, kein Bauhelm mit Daumen hoch, keine gestellte Meeting-Szene. Wenn die Bilder beim laufenden Architekturbüro-Projekt entstehen, brauchst du eine schriftliche Freigabe, **und die Bilder dürfen auf der Seite nicht als Referenz oder Case lesbar sein**, weil die Strategie eine Proof-Sektion bewusst ausschließt. Bildunterschriften bleiben neutral, nie mit Kundenbezug.

### Auftrag 2: Drei Arbeitsobjekt-Paare (ersetzt die gestrichelten Kästen 02A bis 02C)

Je Arbeitssituation ein Vorher-Nachher-Paar, sichtbar als „Schematische Darstellung" gekennzeichnet, mit sichtbarem Prüfpunkt:

- **02A Wissen:** links vier verstreute Ablagen, rechts eine Antwort mit markierter Fundstelle im Dokument.
- **02B Dokumentation:** links ungeordnete Notizen oder eine Sprachnachricht, rechts strukturierter Dokumentationsentwurf im Zielformat mit Freigabezeile.
- **02C Angebot:** links Stapel Ausschreibungsunterlagen, rechts strukturierter Arbeitsstand für die Kalkulation.

Das kannst du selbst liefern: nehmt eure eigenen echten, anonymisierten Beispielartefakte, statt sie zu erfinden. Das ist der einzige Beleg, den ihr nach eurer eigenen Regel zeigen dürft.

### Auftrag 3: Gründerfotos neu

Beide im selben Termin, gleiche Location, gleiches Licht, gleicher Ausschnitt, halbnah statt Passfoto, vor einer realen Arbeitsumgebung statt weißer Wand. Zusätzlich eine Querformataufnahme von euch beiden für den Team-Abschnitt.

## 7. Zum Erklärvideo im Hero

**Meine Empfehlung: ja, aber nicht als abspielendes Element im Hero.**

Dafür spricht: Ihr habt bewusst keine Proof-Sektion, also keine Cases, keine Logos, keine Zahlen. Ein echtes Gesicht, das eine erklärungsbedürftige Leistung ruhig erklärt, ersetzt kein Kundenbeispiel, schlägt aber jede Illustration. Und es löst nebenbei das Bildproblem im Hero.

Dagegen spricht: Der 5-Sekunden-Test verlangt, dass Headline, Subline und CTA sofort erfassbar sind. Ein laufendes Video zieht den Blick weg und verlangt 60 bis 90 Sekunden Investition, bevor irgendetwas verstanden ist. Autoplay mit Ton geht nicht, Autoplay ohne Ton erklärt nichts.

**Der Kompromiss, der beides löst:** Ein Standbild aus dem Video wird das Hero-Visual, mit Play-Button. Du, real, in echter Arbeitsumgebung. Klick öffnet das Video. Damit bekommt der Hero endlich ein echtes Bild, die Seite bekommt ein Gesicht, und der Plankopf-Mechanismus wandert an seinen richtigen Platz, nämlich zum Systembild.

Format:
- Länge 60 bis 90 Sekunden. Erklärungsbedürftig heißt nicht lang.
- Fünf Beats: (1) für wen wir arbeiten, (2) was wir immer wieder sehen, (3) warum das kein Werkzeugproblem ist, (4) was ein Klartag konkret liefert und dass „nicht umsetzen" ein zulässiges Ergebnis ist, (5) was danach modular dazukommt.
- Ein zweites, längeres Video gehört auf `klartag.html` oder `einfuehrungsprojekt.html`, nicht auf die Startseite.
- Technisch: kein Autoplay, `poster`-Attribut, `preload="none"`, selbst gehostet statt YouTube-Embed (sonst neuer Datenschutzabschnitt), Untertitel als `.vtt`, Transkript darunter.

**Wichtiger Hinweis:** `docs/video/manibase-erklaervideo-82-sekunden.md` ist bereits fertig ausgearbeitet, verkauft aber noch das alte Modell: „mindestens drei Anwendungen" und „sechs Monate". Genau das hat die Startseitenstrategie kassiert. Wenn du produzierst, müssen Szene 8 und der durchgehende Sprechertext neu, sonst widerspricht das Video der Seite. Außerdem ist das ein animiertes Erklärvideo, kein Gründervideo. Beides ist sinnvoll, aber es sind zwei Produktionen.

**Nebenbefund:** Auch `site/index.html` trägt die kassierten Aussagen noch an vier Stellen, inklusive Meta-Description (Zeilen 7, 60, 61, 175, 226).

## 8. Nachtrag: unabhängige Bestandsaufnahme der Live-Seite

Eine zweite, unabhängige Analyse von `site/index.html` bestätigt den Befund und liefert zwei Zahlen, die schwerer wiegen als alles bisher Genannte.

**Die 60/30/10-Regel ist auf der Live-Seite faktisch außer Kraft.** Gemessen nach tatsächlicher Farbfläche:

| Farbe | Vorgabe | gemessen |
|---|---|---|
| warme/helle Neutrals | ca. 60 % | **85 %** |
| Cobalt als Fläche | ca. 30 % | **0,38 %** |
| Gelb | ca. 10 % | **0,07 %** (exakt 7 Elemente) |

Cobalt existiert fast nur noch als Textfarbe in Eyebrows, Links und Mono-Nummern. Als Fläche bleiben vier Buttons, ein Flow-Kasten, die Häkchen-Quadrate und der Fortschrittsbalken. Tiefblau hat die Rolle übernommen, die Cobalt tragen sollte, kommt aber nur auf 10,6 % Bandfläche. Deshalb wirkt die Seite trotz starker Marke farblos: es gibt schlicht keine Markenfläche.

**Ein einziges Kachelmuster trägt vier Sektionen.** „Mono-Nummer 01 bis 04, Überschrift, Absatz, gerahmte Zelle" kommt in Anwendungen, Umsetzung, Befähigung und Architektur vor, insgesamt 15 Kacheln. Dazu sechs identisch gebaute Zweispalten-Textblöcke. Die Seitenmitte von „Anwendungen" bis „Befähigung" liest sich als eine durchgehende Kachelstrecke.

**Zwei konkrete Fehler im Hero**, die vorher niemandem aufgefallen sind:

- Die dunkle Flow-Karte überdeckt **93 % der Bildunterschrift** „Der tatsächliche Arbeitsablauf ist der Ausgangspunkt". Vom Foto bleiben links etwa 7 % der Breite frei sichtbar. Das einzige inhaltliche Foto der Seite ist also fast vollständig verdeckt.
- In der 630 px breiten Karte stehen 12 Textfragmente in 0,66 bis 0,68 rem. Der Unruhesprung zwischen der ruhigen linken und der dichten rechten Hälfte ist gebaut, nicht empfunden.

**Bildmaterial insgesamt:** 3 Fotos, kein einziges Inhalts-SVG. Pfeile und Häkchen sind Textzeichen (`→`, `✓`).

Das bestätigt die Priorisierung in Abschnitt 5 und ergänzt sie um einen Punkt: **Farbfläche ist genauso knapp wie Bildmaterial.** Die dunklen und cobaltfarbenen Bänder aus V2 (21 % gegen 6 %) sind deshalb nicht Geschmackssache, sondern der Weg zurück zu 60/30/10.

## 9. Was nur du entscheiden kannst

1. Reifestatus von Bernd, Anton und Willy. Blockiert Blatt 05.
2. Bekommst du Zugang für echte Fotos beim laufenden Projekt, und mit welcher schriftlichen Freigabe?
3. Werkplansatz voll, auf vier Blätter reduziert oder ganz raus?
4. Gründervideo-Standbild statt Plankopf als Hero-Visual: ja oder nein?
5. Bleibt der Klartag-Preis von 3.900 Euro netto verbindlich? Er steht im Mockup mit Sternchen.
