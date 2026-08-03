# Übergabe an die IT

Dieses Paket ist eine vollständige Kopie des Repositories `manibase-ai/manibase_homepage`
inklusive Git-Historie, mit zusätzlicher Arbeit am Website-Redesign.

## Was drin ist

```
site/                     die Website, unverändert lauffähig
docs/redesign/            NEU: Konzeptarbeit zum Redesign
  00-recherche.md         Wettbewerbs- und Zielgruppenrecherche mit Quellen
  01-entscheidungen.md    Protokoll der getroffenen Entscheidungen
  UEBERGABE.md            diese Datei
.github/workflows/        Deploy und CI, unverändert
```

## Für die IT: was zu tun ist

Das Paket ist ein normales Git-Repository. Die neuen Commits liegen auf dem Branch
`claude/manibase-website-cloud-sync-0y5jhu` und wurden **nie gepusht**, weil der
Sitzung die Schreibrechte fehlten.

```bash
unzip manibase-website-<datum>.zip
cd manibase_homepage

# Was ist neu?
git log --oneline main..claude/manibase-website-cloud-sync-0y5jhu
git diff main..claude/manibase-website-cloud-sync-0y5jhu --stat

# Auf GitHub bringen
git remote set-url origin https://github.com/manibase-ai/manibase_homepage
git push -u origin claude/manibase-website-cloud-sync-0y5jhu
```

Danach auf GitHub einen Pull Request gegen `main` öffnen und normal reviewen.

## Wichtig vor dem Merge

**Ein Merge auf `main` deployt sofort live auf manibase.de.** Der Workflow
`.github/workflows/deploy.yml` rsynct `site/` auf den Server `72.61.153.206` und
schaltet den `current`-Symlink um. Es gibt keinen Zwischenschritt und keine manuelle
Freigabe.

`main` ist derzeit **ungeschützt**. Eine Branch-Protection-Regel mit
Pull-Request-Pflicht wäre an dieser Stelle sinnvoll.

## Was bewusst nicht angefasst wurde

Auf Kundenwunsch unverändert: `site/impressum.html`, `site/datenschutz.html`,
`site/api/*.php` und alles rund um Sicherheit.

## Ein bekannter Fehler, noch nicht behoben

Die Website führt zwei verschiedene Kontaktadressen:

| Adresse | Wo |
|---|---|
| `kontakt@manibase.de` | Footer, Formulare, aktuelle Unterlagen |
| `kontakt@demiospace.ai` | `impressum.html`, `datenschutz.html` (2×), `index.html`, `scripts/site.js` |

Das Impressum nennt also eine andere Adresse als der Rest der Seite. Bewusst nicht
korrigiert, weil Impressum und Datenschutz unangetastet bleiben sollten. Freigabe zur
Angleichung steht aus.
