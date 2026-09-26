#!/usr/bin/env python3
"""Setzt an jeden lokalen CSS- und JS-Verweis einen Inhalts-Hash als ?v=-Stempel.

Warum: nginx liefert /styles/*.css und /scripts/*.js mit
`Cache-Control: public, max-age=604800, immutable` aus. `immutable` heisst, dass der
Browser innerhalb der Woche NICHT nachfragt, auch nicht beim Neuladen. Ohne neue URL
sieht ein wiederkehrender Besucher deshalb neues HTML mit altem CSS. Passiert am
21.07.2026 (Honeypot-Feld sichtbar im Formular) und beinahe wieder am 17.08.2026
(Review-Fixes zu PR #11 mit unveraendertem Hand-Stempel).

Der Hash haengt am Dateiinhalt, nicht am Commit: unveraenderte Dateien behalten ihre
URL und bleiben im Cache.

Die Verweise werden aus den Seiten selbst gesammelt (href/src in site/**/*.html und
site/**/*.php), es gibt also keine Liste, die veralten kann. Ein vorhandener Stempel
wird ersetzt, egal ob Hash oder alter Hand-Stempel. Ein Verweis auf eine Datei, die es
nicht gibt, bricht den Lauf ab.

    python3 scripts/cache-bust.py site           Stempel setzen (vor dem Commit)
    python3 scripts/cache-bust.py --check site   nur pruefen, Exit 1 bei Abweichung (CI)
"""
import argparse
import hashlib
import pathlib
import re
import sys

# href="..." oder src="...", auch innerhalb eines PHP-Strings. Externe URLs
# (https://, //) scheitern am Ausschluss von ':' im Pfad bzw. am Pruefen unten.
REF = re.compile(
    r'''(?<![\w-])((?:href|src)=(["']))'''
    r'''([^"'?#\s]+\.(?:css|js))'''
    r'''(\?v=[^"'#\s]*)?'''
    r'''(?=\2)''')


def stamp(path: pathlib.Path, cache: dict) -> str:
    if path not in cache:
        cache[path] = hashlib.sha256(path.read_bytes()).hexdigest()[:10]
    return cache[path]


def resolve(root: pathlib.Path, page: pathlib.Path, url: str):
    if url.startswith('//') or ':' in url:
        return None  # extern
    target = root / url.lstrip('/') if url.startswith('/') else page.parent / url
    return target.resolve()


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

    hashes, errors, stale, writes = {}, [], [], []
    for page in pages:
        rel_page = page.relative_to(root)
        # newline='': Zeilenenden unveraendert lassen, sonst wird aus CRLF still LF.
        with open(page, encoding='utf-8', newline='') as f:
            text = f.read()

        def repl(m):
            url, old = m.group(3), m.group(4) or ''
            target = resolve(root, page, url)
            if target is None:
                return m.group(0)
            if not target.is_file() or root not in target.parents:
                errors.append(f'{rel_page}: {url} zeigt auf keine Datei unter {root.name}/')
                return m.group(0)
            new = f'?v={stamp(target, hashes)}'
            if old != new:
                stale.append(f'{rel_page}: {url}{old or " (ohne Stempel)"} -> {new}')
            return f'{m.group(1)}{url}{new}'

        updated = REF.sub(repl, text)
        if updated != text:
            writes.append((page, updated))

    for e in errors:
        print(f'FEHLER: {e}', file=sys.stderr)
    if errors:
        return 1

    if args.check:
        if stale:
            print(f'cache-bust: {len(stale)} Verweise mit veraltetem Stempel:', file=sys.stderr)
            for s in stale:
                print(f'  {s}', file=sys.stderr)
            print('Beheben mit: python3 scripts/cache-bust.py site', file=sys.stderr)
            return 1
        print(f'cache-bust: alle Stempel aktuell ({len(hashes)} Dateien, {len(pages)} Seiten)')
        return 0

    # Erst schreiben, wenn alle Seiten fehlerfrei durchgelaufen sind: kein halb
    # gestempelter Stand, wenn ein Verweis ins Leere zeigt.
    for page, updated in writes:
        with open(page, 'w', encoding='utf-8', newline='') as f:
            f.write(updated)
    print(f'cache-bust: {len(stale)} Verweise neu gestempelt')
    for path, h in sorted(hashes.items()):
        print(f'  {path.relative_to(root)}?v={h}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
