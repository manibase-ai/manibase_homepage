"""Prueft, ob die jsonBody-Payloads der n8n-HTTP-Nodes gueltiges JSON ergeben.

Ein n8n-Ausdruck {{ ... }} kann an zwei Stellen stehen:
  - INNERHALB eines JSON-Strings ("doi:{{ id }}")  -> ersetzt sich durch Text
  - als eigenstaendiger Wert (,{{ JSON.stringify(x) }})  -> liefert selbst JSON
Ein naiver Regex verwechselt beides und erzeugt selbst kaputtes JSON. Deshalb
ein Scanner, der mitzaehlt, ob er gerade in einem String-Literal steht.
"""
import json, re, sys, glob


def evaluate(body: str) -> str:
    out, i, in_str = [], 0, False
    while i < len(body):
        ch = body[i]
        if ch == '\\' and in_str:
            out.append(body[i:i + 2]); i += 2; continue
        if ch == '"':
            in_str = not in_str; out.append(ch); i += 1; continue
        if body.startswith('{{', i):
            end = body.find('}}', i)
            if end == -1:
                out.append(ch); i += 1; continue
            out.append('X' if in_str else '"X"')
            i = end + 2
            continue
        out.append(ch); i += 1
    return ''.join(out)


def check(paths):
    bad = tot = 0
    for f in sorted(paths):
        for n in json.load(open(f))['nodes']:
            b = n.get('parameters', {}).get('jsonBody')
            if not isinstance(b, str) or not b.startswith('='):
                continue
            tot += 1
            try:
                # ODOO_UID steht unquotiert im JSON; die uebrigen CONFIG-Platzhalter
                # stehen in Anfuehrungszeichen und stoeren die Struktur nicht.
                json.loads(evaluate(b[1:].replace('{{CONFIG:ODOO_UID}}', '0')))
            except Exception as e:
                bad += 1
                print(f'{f.split("/")[-1][:34]:36} {n["name"][:42]:44} {e}')
    print(f'\n{bad} von {tot} jsonBody-Payloads sind ungueltiges JSON')
    return bad


if __name__ == '__main__':
    sys.exit(1 if check(sum((glob.glob(p) for p in sys.argv[1:]), [])) else 0)
