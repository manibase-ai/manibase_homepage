#!/usr/bin/env python3
"""Haengt an CSS- und JS-Verweise in den HTML-Dateien einen Inhalts-Hash an.

Warum: nginx liefert /styles/*.css und /scripts/site.js mit
`Cache-Control: public, max-age=604800, immutable` aus. `immutable` heisst, dass der
Browser innerhalb der Woche NICHT nachfragt, auch nicht beim Neuladen. Ohne Version in
der URL sieht ein wiederkehrender Besucher deshalb neues HTML mit altem CSS. Genau das
ist am 21.07.2026 passiert: das Honeypot-Feld stand sichtbar im Formular, weil die Regel,
die es versteckt, im gecachten Stylesheet noch fehlte.

Ein geaenderter Header repariert das NICHT, denn er erreicht den Browser erst nach
Ablauf. Nur eine andere URL erzwingt einen neuen Abruf. Deshalb der Hash als Query.

Der Hash haengt am Dateiinhalt, nicht am Commit: unveraenderte Dateien behalten ihre URL
und bleiben im Cache.

Lauf (im Deploy, auf der Kopie des Runners):  python3 scripts/cache-bust.py site
"""
import hashlib
import pathlib
import re
import sys

ASSETS = ['styles/tokens.css', 'styles/site.css', 'scripts/site.js']


def main(root_arg: str) -> int:
    root = pathlib.Path(root_arg)
    if not root.is_dir():
        print(f'FEHLER: {root} ist kein Verzeichnis', file=sys.stderr)
        return 1

    hashes = {}
    for rel in ASSETS:
        f = root / rel
        if not f.is_file():
            print(f'FEHLER: {f} fehlt', file=sys.stderr)
            return 1
        hashes[rel] = hashlib.sha1(f.read_bytes()).hexdigest()[:10]

    html = sorted(root.rglob('*.html'))
    if not html:
        print(f'FEHLER: keine HTML-Dateien unter {root}', file=sys.stderr)
        return 1

    total = 0
    for page in html:
        text = page.read_text(encoding='utf-8')
        before = text
        for rel, h in hashes.items():
            # Trifft "styles/site.css" ebenso wie "../styles/site.css" (blog/),
            # aber nur direkt vor dem schliessenden Anfuehrungszeichen: eine schon
            # versionierte URL (?v=...) wird nicht ein zweites Mal angefasst.
            text = re.sub(r'(%s)(["\'])' % re.escape(rel), r'\1?v=%s\2' % h, text)
        if text != before:
            page.write_text(text, encoding='utf-8')
            total += 1

    print(f'cache-bust: {total} HTML-Dateien angepasst')
    for rel, h in hashes.items():
        print(f'  {rel}?v={h}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'site'))
