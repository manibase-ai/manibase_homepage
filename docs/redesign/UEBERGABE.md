# Übergabe

Vollständige Kopie des Repositories `manibase-ai/manibase_homepage` inklusive
Git-Historie, mit dem Redesign der Website.

Stand: 4. August 2026.

---

## Teil 1 · Für die Weiterarbeit (lokal, in einer neuen Sitzung)

### Sofort ansehen

```bash
unzip manibase-website-<datum>.zip
cd manibase_homepage
python -m http.server 8000 --directory site
# dann http://localhost:8000 öffnen
```

### Der Einstieg für ein frisches Kontextfenster

Eine Zeile genügt:

> Lies `docs/redesign/03-bauauftrag.md` und bau die vier Unterseiten.

Der Bauauftrag ist so geschrieben, dass er **allein reicht**. Nichts muss aus einem
Chatverlauf rekonstruiert werden.

| Datei | Inhalt |
|---|---|
| `docs/redesign/00-recherche.md` | Wettbewerb, Studien, gemessene Stylesheets, Quellen |
| `docs/redesign/01-entscheidungen.md` | E1 bis E27, jede Entscheidung mit Begründung |
| `docs/redesign/02-einwand-log.md` | Sammelvorlage für echte Gesprächseinwände |
| `docs/redesign/03-bauauftrag.md` | **Bauanleitung, Umsetzungsstand, offene Punkte** |
| `docs/redesign/v2-*.png` | Screenshots des aktuellen Standes |

### Was schon gebaut ist

Die **Startseite** ist vollständig neu: Hero, Wertband, zwei Platzhalter (Video und
Architektur-Schaubild), Rahmen „Kosten des Wartens", zwei Leistungsbausteine, Vergleich
*gewachsen gegen gebaut*, vier Kaufargumente, drei Stufen mit Klartag-Preis, sechs
Reibungspunkte, Gründer, dunkles CTA-Band, vierstufige Maske vor dem Kalender.

Geändert wurden nur drei Dateien: `site/index.html`, `site/styles/tokens.css`,
`site/styles/site.css`.

### Was noch fehlt

- Die vier Unterseiten: Klartag · Einführungsprojekt · Für Ihre IT · Über uns
- Architektur-Schaubild und Erklärvideo (beide als Platzhalter angelegt)
- Feinschliff Mobilansicht, Lighthouse, Zeeg-Kalender im echten Browser testen
- Die Restliste in `03-bauauftrag.md`, Abschnitt 13

---

## Teil 2 · Für die IT, zum Einspielen

Die Commits liegen auf dem Branch `claude/manibase-website-cloud-sync-0y5jhu` und wurden
**nie gepusht**. Grund: Die GitHub-App „Claude Code" hat auf dem Repository nur
Lesezugriff. Push und Branch-Erstellung scheitern mit
`403 Resource not accessible by integration`.

**Damit ein Push künftig funktioniert:** Der App muss auf dem Konto `manibase-ai` für
dieses Repository **Contents: Read and write** gegeben werden
(GitHub → Settings → Applications → Installed GitHub Apps → Claude → Configure).

**Bis dahin geht es auch ohne:**

```bash
cd manibase_homepage

# Was ist neu?
git log --oneline main..claude/manibase-website-cloud-sync-0y5jhu
git diff main..claude/manibase-website-cloud-sync-0y5jhu --stat

# Auf GitHub bringen
git remote set-url origin https://github.com/manibase-ai/manibase_homepage
git push -u origin claude/manibase-website-cloud-sync-0y5jhu
```

Danach auf GitHub einen Pull Request gegen `main` öffnen und normal reviewen.

### Wichtig vor dem Merge

**Ein Merge auf `main` deployt sofort live auf manibase.de.** Der Workflow
`.github/workflows/deploy.yml` rsynct `site/` auf den Server `72.61.153.206` und schaltet
den `current`-Symlink um. Es gibt keinen Zwischenschritt und keine manuelle Freigabe.

`main` ist derzeit **ungeschützt**. Eine Branch-Protection-Regel mit
Pull-Request-Pflicht wäre an dieser Stelle sinnvoll.

**Die Seite ist bewusst noch nicht fertig.** Zwei Bereiche tragen sichtbare Hinweise
(„Dieser Bereich wird gerade erweitert"), und die Navigation zeigt nur auf Abschnitte
der Startseite, weil die Unterseiten fehlen. Das ist so entschieden (Weg B: früh live
gehen, nachliefern), sollte vor dem Merge aber bewusst bestätigt werden.

### Was unangetastet blieb

Auf Kundenwunsch inhaltlich unverändert: `site/impressum.html`,
`site/datenschutz.html`, `site/api/*.php`, `site/scripts/site.js` und alles rund um
Sicherheit. Ebenfalls unberührt: `blog/`, `infotermin.html`, `interessent.html`,
`ki-klartag.html` (alle drei sind `noindex` und unverlinkt).

Einzige Ausnahme, ausdrücklich freigegeben: Die Kontaktadresse wurde an fünf Stellen von
`kontakt@demiospace.ai` auf `kontakt@manibase.de` vereinheitlicht. Die Seite führt jetzt
durchgängig eine Adresse.
