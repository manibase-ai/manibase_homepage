#!/usr/bin/env python3
"""Setzt an jeden lokalen CSS- und JS-Verweis einen Inhalts-Hash als ?v=-Stempel.

Warum: nginx liefert /styles/*.css, /scripts/*.js und /fonts/_fontface.css mit
`Cache-Control: public, max-age=604800, immutable` aus. `immutable` heisst, dass der
Browser innerhalb der Woche NICHT nachfragt, auch nicht beim Neuladen. Ohne neue URL
sieht ein wiederkehrender Besucher deshalb neues HTML mit altem CSS. Passiert am
21.07.2026 (Honeypot-Feld sichtbar im Formular) und beinahe wieder am 17.08.2026
(Review-Fixes zu PR #11 mit unveraendertem Hand-Stempel).

Der Hash haengt am Dateiinhalt, nicht am Commit: unveraenderte Dateien behalten ihre
URL und bleiben im Cache. Zeilenenden werden vor dem Hashen auf LF gebracht, damit ein
Checkout mit CRLF (Windows, autocrlf) dieselben Stempel ergibt wie die CI.

Die Verweise werden aus den Seiten selbst gesammelt (href/src in site/**/*.html und
site/**/*.php), es gibt also keine Liste, die veralten kann. Ein @import in einer
gestempelten CSS-Datei (tokens.css -> fonts/_fontface.css) wird ebenfalls gestempelt;
weil der Stempel dann im Inhalt der importierenden Datei steht, wandert deren Hash mit.
Ein vorhandener Stempel wird ersetzt, egal ob Hash oder alter Hand-Stempel. Ein Verweis
auf eine Datei, die es nicht gibt, bricht den Lauf ab, bevor etwas geschrieben wird.

    python3 scripts/cache-bust.py site           Stempel setzen (vor dem Commit)
    python3 scripts/cache-bust.py --check site   nur pruefen, Exit 1 bei Abweichung (CI)
"""
import argparse
import hashlib
import pathlib
import re
import sys

# href="..." oder src="...", auch innerhalb eines PHP-Strings.
PAGE_REF = re.compile(
    r'''(?<![\w-])((?:href|src)=(["']))'''
    r'''([^"'?#\s]+\.(?:css|js))'''
    r'''(\?v=[^"'#\s]*)?'''
    r'''(?=\2)''')

# @import url('...'), @import url(...) oder @import "..." in CSS.
CSS_IMPORT = re.compile(
    r'''(@import\s+(?:url\(\s*)?(["']?))'''
    r'''([^"'?#\s)]+\.css)'''
    r'''(\?v=[^"'#\s)]*)?'''
    r'''(?=\2)''')


def read(path: pathlib.Path) -> str:
    # newline='': Zeilenenden unveraendert lassen, sonst wird aus CRLF still LF.
    with open(path, encoding='utf-8', newline='') as f:
        return f.read()


def resolve(root: pathlib.Path, base: pathlib.Path, url: str):
    if url.startswith('//') or ':' in url:
        return None  # extern
    target = root / url.lstrip('/') if url.startswith('/') else base.parent / url
    return target.resolve()


class Stamper:
    def __init__(self, root: pathlib.Path):
        self.root = root
        self.hashes = {}    # Asset -> Stempel
        self.content = {}   # Datei -> Inhalt nach dem Stempeln
        self.original = {}  # Datei -> Inhalt auf der Platte
        self.errors, self.stale = [], []
        self._busy = set()

    def rewrite(self, path: pathlib.Path, pattern) -> str:
        """Stempelt alle Verweise in `path`; der Inhalt wird nur gemerkt, nicht geschrieben."""
        if path in self.content:
            return self.content[path]
        text = self.original[path] = read(path)
        rel = path.relative_to(self.root)

        def repl(m):
            url, old = m.group(3), m.group(4) or ''
            target = resolve(self.root, path, url)
            if target is None:
                return m.group(0)
            if not target.is_file() or self.root not in target.parents:
                self.errors.append(f'{rel}: {url} zeigt auf keine Datei unter {self.root.name}/')
                return m.group(0)
            new = f'?v={self.stamp(target)}'
            if old != new:
                self.stale.append(f'{rel}: {url}{old or " (ohne Stempel)"} -> {new}')
            return f'{m.group(1)}{url}{new}'

        self.content[path] = pattern.sub(repl, text)
        return self.content[path]

    def stamp(self, path: pathlib.Path) -> str:
        if path in self.hashes:
            return self.hashes[path]
        if path in self._busy:
            self.errors.append(f'{path.relative_to(self.root)}: @import-Zyklus')
            return 'zyklus'
        if path.suffix == '.css':
            self._busy.add(path)
            data = self.rewrite(path, CSS_IMPORT).encode('utf-8')
            self._busy.discard(path)
        else:
            data = path.read_bytes()
        data = data.replace(b'\r\n', b'\n')
        self.hashes[path] = hashlib.sha256(data).hexdigest()[:10]
        return self.hashes[path]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('root', nargs='?', default='site')
    ap.add_argument('--check', action='store_true', help='nichts schreiben, nur pruefen')
    args = ap.parse_args()

    root = pathlib.Path(args.root).resolve()
    if not root.is_dir():
        print(f'FEHLER: {root} ist kein Verzeichnis', file=sys.stderr)
        return 1

    pages = sorted(p for p in root.rglob('*') if p.suffix in ('.html', '.php') and p.is_file())
    if not pages:
        print(f'FEHLER: keine Seiten unter {root}', file=sys.stderr)
        return 1

    s = Stamper(root)
    for page in pages:
        s.rewrite(page, PAGE_REF)

    for e in s.errors:
        print(f'FEHLER: {e}', file=sys.stderr)
    if s.errors:
        return 1

    if args.check:
        if s.stale:
            print(f'cache-bust: {len(s.stale)} Verweise mit veraltetem Stempel:', file=sys.stderr)
            for line in s.stale:
                print(f'  {line}', file=sys.stderr)
            print('Beheben mit: python3 scripts/cache-bust.py site', file=sys.stderr)
            return 1
        print(f'cache-bust: alle Stempel aktuell ({len(s.hashes)} Dateien, {len(pages)} Seiten)')
        return 0

    # Erst schreiben, wenn alles fehlerfrei durchgelaufen ist: kein halb gestempelter
    # Stand, wenn ein Verweis ins Leere zeigt.
    for path, text in s.content.items():
        if text != s.original[path]:
            with open(path, 'w', encoding='utf-8', newline='') as f:
                f.write(text)
    print(f'cache-bust: {len(s.stale)} Verweise neu gestempelt')
    for path, h in sorted(s.hashes.items()):
        print(f'  {path.relative_to(root)}?v={h}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
