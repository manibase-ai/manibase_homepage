# Formular-Trichter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Qualifizierungs-Maske meldet ohne Cookies und ohne Drittanbieter, wie weit Besucher kommen; ein Node-Skript wertet das nginx-Log zum Trichter aus.

**Architecture:** `site/scripts/site.js` bekommt eine kleine Funktion `trichter(e, n, r)`, die per `navigator.sendBeacon` an `/t` meldet (dedupliziert, abschaltbar). nginx beantwortet `/t` mit 204 und loggt ohne IP (Server-Teil macht die Hauptsitzung, nicht dieser Plan; die versionierte Konfiguration legt Task 7 an). `scripts/trichter-auswertung.mjs` liest das Log und rechnet die Stufen kumulativ.

**Tech Stack:** Vanilla-JS (ES5-Stil wie `site.js`), Node 20 ohne Abhängigkeiten für die Auswertung, jsdom für die Frontend-Tests, GitHub Actions (`verify.yml`).

**Spec:** `docs/superpowers/specs/2026-10-03-formular-trichter-design.md` (verbindlich, bei Widerspruch gilt die Spec).

**Arbeitsverzeichnis:** Worktree `/Users/nikolausschauersberger/Projects/web/manibase-trichter`, Branch `feat/formular-trichter`. Alle Befehle dort ausführen. **Niemals** `git checkout`, `switch`, `stash`, `reset` oder `push`.

**Hausregeln:** Kommentare im Stil der Datei (deutsch, in `site.js` meist ohne Umlaute). Keine neuen Abhängigkeiten. Commits mit Abschlusszeile `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Dateiübersicht

| Datei | Aktion | Verantwortung |
|---|---|---|
| `scripts/trichter-auswertung.mjs` | neu | Logzeilen lesen, Trichter rechnen, Text ausgeben, CLI |
| `scripts/test-trichter.mjs` | neu | Tests der Auswertung |
| `site/scripts/site.js` | ändern | Funktion `trichter`, Aufrufe in `initWizard` und `loadBookingCalendar`, Enter-Korrektur |
| `scripts/test-frontend.mjs` | ändern | `bootWizard(opts)`, Hilfsfunktionen, neue Tests |
| `site/datenschutz.html` | ändern | Abschnitte 3, 5, 11, Stand |
| `.github/workflows/verify.yml` | ändern | Testschritt für die Auswertung |
| `docs/deploy/nginx-trichter.conf` | neu | versionierte nginx-Konfiguration |
| `docs/deploy/logrotate-manibase-trichter` | neu | versionierte logrotate-Regel |
| `site/**/*.html` | ändern (nur Stempel) | `?v=`-Hash von `site.js` |

---

### Task 1: Arbeitsumgebung

**Files:** keine

- [ ] **Step 1: jsdom im Worktree installieren**

Run: `npm i --no-save jsdom`
Expected: `added … packages`. `node_modules/` und `package-lock.json` stehen in `.gitignore`; `git status --short` zeigt danach nichts Neues.

- [ ] **Step 2: Bestehende Tests laufen grün**

Run: `node scripts/test-frontend.mjs`
Expected: nur `ok   …`-Zeilen, Exit 0.

---

### Task 2: Auswertung (`scripts/trichter-auswertung.mjs`)

**Files:**
- Create: `scripts/test-trichter.mjs`
- Create: `scripts/trichter-auswertung.mjs`
- Modify: `.github/workflows/verify.yml` (vor dem Schritt „Frontend-Regressionstests“)

- [ ] **Step 1: Tests schreiben**

`scripts/test-trichter.mjs`:

```js
/* Tests der Trichter-Auswertung (scripts/trichter-auswertung.mjs).
 *
 * Aufruf: node scripts/test-trichter.mjs   (keine Abhaengigkeiten)
 */
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { zeileLesen, auswerten, formatieren, dateiLesen, argumente } from './trichter-auswertung.mjs';

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log('ok   ' + name);
  } catch (err) {
    failed++;
    console.error('FAIL ' + name + '\n       ' + err.message);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Eine Logzeile, wie nginx sie schreibt (Werte, die nicht passen, stehen als "-").
const z = (felder = {}) => JSON.stringify({
  t: '2026-10-10T10:00:00+00:00', v: '1', s: 'abcdefghij', e: 'gesehen', n: '-', r: '-', b: '0', ...felder,
});
const zahlen = (erg) => erg.stufen.map((st) => st.sitzungen).join(',');

test('zeileLesen: gueltige Zeilen', () => {
  const g = zeileLesen(z());
  assert(g && g.e === 'gesehen' && g.n === null && g.tag === '2026-10-10' && g.bot === false, 'gesehen: ' + JSON.stringify(g));
  const s = zeileLesen(z({ e: 'schritt', n: '3' }));
  assert(s && s.n === 3, 'schritt: ' + JSON.stringify(s));
  const f = zeileLesen(z({ e: 'fehler', n: '4', r: 'gf' }));
  assert(f && f.n === 4 && f.r === 'gf', 'fehler: ' + JSON.stringify(f));
  const k = zeileLesen(z({ e: 'kalender', r: 'ok' }));
  assert(k && k.r === 'ok', 'kalender: ' + JSON.stringify(k));
  assert(zeileLesen(z({ b: '1' })).bot === true, 'Bot-Kennzeichen nicht gelesen');
});

test('zeileLesen: verwirft ungueltige Zeilen', () => {
  const kaputt = [
    'kein json', 'null', z({ v: '2' }), z({ s: 'ABCDEFGHIJ' }), z({ s: '-' }), z({ e: 'klick' }),
    z({ e: 'schritt', n: '7' }), z({ e: 'schritt', n: '-' }), z({ e: 'fehler', n: '2', r: 'quatsch' }),
    z({ e: 'fehler', n: '0', r: 'name' }), z({ e: 'kalender', r: '-' }), z({ b: '-' }), z({ t: 'gestern' }),
  ];
  for (const zeile of kaputt) assert(zeileLesen(zeile) === null, 'Nicht verworfen: ' + zeile);
});

test('zeileLesen: Kalendertag in Europe/Berlin, auch ueber die Zeitumstellung', () => {
  const tag = (t) => zeileLesen(z({ t })).tag;
  assert(tag('2026-10-24T22:30:00+00:00') === '2026-10-25', 'Sommerzeit: ' + tag('2026-10-24T22:30:00+00:00'));
  assert(tag('2026-10-25T22:30:00+00:00') === '2026-10-25', 'Winterzeit: ' + tag('2026-10-25T22:30:00+00:00'));
  assert(tag('2026-10-25T23:30:00+00:00') === '2026-10-26', 'Mitternacht Winterzeit: ' + tag('2026-10-25T23:30:00+00:00'));
});

// a: bis Schritt 4 · b: nur Pruefmeldung in Schritt 3 · c: nur Kalender · d: nur gesehen
const BEISPIEL = [
  z({ s: 'aaaaaaaaaa' }), z({ s: 'aaaaaaaaaa', e: 'begonnen' }),
  z({ s: 'aaaaaaaaaa', e: 'schritt', n: '2' }), z({ s: 'aaaaaaaaaa', e: 'schritt', n: '3' }),
  z({ s: 'aaaaaaaaaa', e: 'schritt', n: '4' }),
  z({ s: 'bbbbbbbbbb', e: 'fehler', n: '3', r: 'auswahl' }),
  z({ s: 'cccccccccc', e: 'kalender', r: 'ok' }),
  z({ s: 'dddddddddd' }),
];

test('auswerten: Stufen kumulativ, auch indirekt belegt', () => {
  const erg = auswerten(BEISPIEL);
  assert(zahlen(erg) === '4,3,3,3,2,1,1', 'Stufen: ' + zahlen(erg));
  assert(erg.fehler['3|auswahl'] === 1, 'Pruefmeldung: ' + JSON.stringify(erg.fehler));
  assert(erg.kalender.ok === 1 && erg.kalender.fehler === 0, 'Kalender: ' + JSON.stringify(erg.kalender));
});

test('auswerten: Bots ausgeblendet, auf Wunsch mitgezaehlt', () => {
  const zeilen = [z({ s: 'xxxxxxxxxx', b: '1' }), z({ s: 'yyyyyyyyyy' })];
  const ohne = auswerten(zeilen);
  assert(ohne.stufen[0].sitzungen === 1 && ohne.bots === 1, 'ohne Bots: ' + JSON.stringify(ohne));
  const mit = auswerten(zeilen, { mitBots: true });
  assert(mit.stufen[0].sitzungen === 2, 'mit Bots: ' + zahlen(mit));
});

test('auswerten: Datumsfilter ist inklusive', () => {
  const zeilen = [
    z({ s: 'tag9tag9ta', t: '2026-10-09T10:00:00+00:00' }),
    z({ s: 'tag0tag0ta', t: '2026-10-10T10:00:00+00:00' }),
    z({ s: 'tag1tag1ta', t: '2026-10-11T10:00:00+00:00' }),
  ];
  assert(auswerten(zeilen, { von: '2026-10-10', bis: '2026-10-10' }).stufen[0].sitzungen === 1, 'ein Tag');
  assert(auswerten(zeilen, { von: '2026-10-10', bis: '2026-10-11' }).stufen[0].sitzungen === 2, 'zwei Tage');
  assert(auswerten(zeilen, { bis: '2026-10-09' }).stufen[0].sitzungen === 1, 'nur bis');
});

test('auswerten: ungueltige Zeilen werden gezaehlt, Leerzeilen nicht', () => {
  const erg = auswerten(['', '   ', 'x', z()]);
  assert(erg.ungueltig === 1, 'ungueltig: ' + erg.ungueltig);
  assert(erg.stufen[0].sitzungen === 1, 'gesehen: ' + zahlen(erg));
});

test('auswerten: Pruefmeldung zaehlt je Sitzung nur einmal', () => {
  const zeile = z({ e: 'fehler', n: '1', r: 'auswahl' });
  const erg = auswerten([zeile, zeile]);
  assert(erg.fehler['1|auswahl'] === 1, 'doppelt gezaehlt: ' + JSON.stringify(erg.fehler));
});

test('dateiLesen: liest Klartext und gzip', () => {
  const ordner = mkdtempSync(join(tmpdir(), 'trichter-'));
  const text = z() + '\n' + z({ e: 'begonnen' }) + '\n';
  writeFileSync(join(ordner, 'a.log'), text);
  writeFileSync(join(ordner, 'b.log.gz'), gzipSync(text));
  for (const name of ['a.log', 'b.log.gz']) {
    const zeilen = dateiLesen(join(ordner, name)).filter(Boolean);
    assert(zeilen.length === 2 && zeileLesen(zeilen[1]).e === 'begonnen', name + ': ' + JSON.stringify(zeilen));
  }
});

test('formatieren: Stufen, Anteile und Sitzungshinweis', () => {
  const text = formatieren(auswerten(BEISPIEL));
  for (const teil of ['Eine Sitzung ist ein Seitenaufruf', 'Schritt 4', '50 %', 'Schritt 3 · auswahl: 1', 'Kalender: ok 1']) {
    assert(text.includes(teil), 'Fehlt in der Ausgabe: ' + teil + '\n' + text);
  }
});

test('argumente: Datum geprueft, Vorgabe ist stdin', () => {
  assert(argumente([]).dateien.join() === '-', 'Vorgabe nicht stdin');
  const opt = argumente(['--von', '2026-10-01', 'x.log', '--mit-bots', '--bis', '2026-10-31']);
  assert(opt.von === '2026-10-01' && opt.bis === '2026-10-31' && opt.mitBots && opt.dateien.join() === 'x.log', JSON.stringify(opt));
  let geworfen = 0;
  for (const falsch of [['--von', '01.10.2026'], ['--bis'], ['--unbekannt']]) {
    try { argumente(falsch); } catch { geworfen++; }
  }
  assert(geworfen === 3, 'Ungueltige Argumente akzeptiert');
});

test('CLI: liest stdin, Exit 2 bei falschem Datum', () => {
  const lauf = (args, input) => spawnSync(process.execPath, ['scripts/trichter-auswertung.mjs', ...args], { input, encoding: 'utf8' });
  const ok = lauf(['-'], z() + '\n');
  assert(ok.status === 0 && /gesehen\s+1\b/.test(ok.stdout), 'stdin: ' + ok.status + ' ' + ok.stdout + ok.stderr);
  const falsch = lauf(['--von', '1.10.2026'], '');
  assert(falsch.status === 2, 'Exit-Code bei falschem Datum: ' + falsch.status);
});

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
```

- [ ] **Step 2: Test laufen lassen, er muss scheitern**

Run: `node scripts/test-trichter.mjs`
Expected: Abbruch mit `ERR_MODULE_NOT_FOUND` für `trichter-auswertung.mjs`.

- [ ] **Step 3: Auswertung schreiben**

`scripts/trichter-auswertung.mjs`:

```js
#!/usr/bin/env node
/* Auswertung des Formular-Trichters (Schema v1).
 *
 * Liest die JSON-Zeilen, die nginx fuer /t nach /var/log/manibase/trichter.log
 * schreibt (docs/deploy/nginx-trichter.conf), und zeigt, wie viele Seitenaufrufe
 * welche Stufe der Qualifizierungs-Maske erreicht haben.
 * Spec: docs/superpowers/specs/2026-10-03-formular-trichter-design.md
 *
 * Aufruf vom eigenen Rechner (das Skript liegt bewusst nicht auf dem Server):
 *   ssh root@72.61.153.206 'zcat -f /var/log/manibase/trichter.log*' \
 *     | node scripts/trichter-auswertung.mjs - --von 2026-10-01 --bis 2026-10-31
 *
 * Optionen: --von/--bis JJJJ-MM-TT (inklusive, Kalendertag in Europe/Berlin),
 *           --mit-bots (Bot-Sitzungen mitzaehlen). Dateien duerfen gzip sein.
 */
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const STUFEN = ['gesehen', 'begonnen', 'Schritt 2', 'Schritt 3', 'Schritt 4', 'Schritt 5', 'abgeschickt'];
const EREIGNISSE = new Set(['gesehen', 'begonnen', 'schritt', 'fehler', 'abgeschickt', 'kalender']);
const GRUENDE = new Set(['auswahl', 'mehrfach', 'gf', 'name', 'email', 'firma', 'einwilligung']);
const KENNUNG = /^[a-z0-9]{10}$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;
// en-CA formatiert als JJJJ-MM-TT; die Zeitzone macht aus der Serverzeit den deutschen Kalendertag.
const TAG = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
});

function ganzzahl(wert, min, max) {
  if (!/^\d+$/.test(String(wert))) return null;
  const n = Number(wert);
  return n >= min && n <= max ? n : null;
}

/** Eine Logzeile -> {tag, s, e, n, r, bot} oder null, wenn sie nicht zum Schema passt. */
export function zeileLesen(zeile) {
  let o;
  try { o = JSON.parse(zeile); } catch { return null; }
  if (!o || typeof o !== 'object') return null;
  if (o.v !== '1' || !KENNUNG.test(String(o.s)) || !EREIGNISSE.has(o.e)) return null;
  if (o.b !== '0' && o.b !== '1') return null;
  const zeit = new Date(o.t);
  if (Number.isNaN(zeit.getTime())) return null;
  let n = null;
  let r = null;
  if (o.e === 'schritt') {
    n = ganzzahl(o.n, 2, 5);
    if (n === null) return null;
  } else if (o.e === 'fehler') {
    n = ganzzahl(o.n, 1, 5);
    if (n === null || !GRUENDE.has(o.r)) return null;
    r = o.r;
  } else if (o.e === 'kalender') {
    if (o.r !== 'ok' && o.r !== 'fehler') return null;
    r = o.r;
  }
  return { tag: TAG.format(zeit), s: o.s, e: o.e, n, r, bot: o.b === '1' };
}

/** Index in STUFEN, den ein Ereignis mindestens belegt. Eine Pruefmeldung in
 *  Schritt k beweist, dass Schritt k erreicht war; der Kalender beweist das Absenden. */
export function stufeVon(ev) {
  switch (ev.e) {
    case 'gesehen': return 0;
    case 'begonnen': return 1;
    case 'schritt': return ev.n;
    case 'fehler': return ev.n === 1 ? 1 : ev.n;
    default: return 6; // abgeschickt, kalender
  }
}

/** Zeilen -> Trichter. Eine Sitzung (= ein Seitenaufruf) zaehlt fuer jede Stufe bis
 *  zu ihrer hoechsten belegten Stufe. */
export function auswerten(zeilen, { von = null, bis = null, mitBots = false } = {}) {
  const sitzungen = new Map();
  let ungueltig = 0;
  for (const zeile of zeilen) {
    if (!zeile.trim()) continue;
    const ev = zeileLesen(zeile);
    if (!ev) { ungueltig++; continue; }
    if ((von && ev.tag < von) || (bis && ev.tag > bis)) continue;
    let si = sitzungen.get(ev.s);
    if (!si) {
      si = { stufe: 0, bot: false, fehler: new Set(), kalender: new Set() };
      sitzungen.set(ev.s, si);
    }
    si.stufe = Math.max(si.stufe, stufeVon(ev));
    if (ev.bot) si.bot = true;
    if (ev.e === 'fehler') si.fehler.add(ev.n + '|' + ev.r);
    if (ev.e === 'kalender') si.kalender.add(ev.r);
  }
  const alle = [...sitzungen.values()];
  const basis = mitBots ? alle : alle.filter((si) => !si.bot);
  const fehler = {};
  const kalender = { ok: 0, fehler: 0 };
  for (const si of basis) {
    for (const k of si.fehler) fehler[k] = (fehler[k] || 0) + 1;
    for (const k of si.kalender) kalender[k]++;
  }
  return {
    von, bis, mitBots,
    stufen: STUFEN.map((name, i) => ({ name, sitzungen: basis.filter((si) => si.stufe >= i).length })),
    fehler, kalender,
    bots: alle.filter((si) => si.bot).length,
    ungueltig,
  };
}

function prozent(teil, ganz) {
  return ganz ? Math.round((teil / ganz) * 100) + ' %' : '-';
}

/** Ergebnis -> lesbarer Text fuer die Konsole. */
export function formatieren(erg) {
  const zeilen = [];
  zeilen.push('Formular-Trichter, ' + (erg.von || 'Anfang') + ' bis ' + (erg.bis || 'heute'));
  zeilen.push('Hinweis: Eine Sitzung ist ein Seitenaufruf. Wer in der Maske neu lädt, zählt als Abbruch plus neue Sitzung.');
  zeilen.push('');
  zeilen.push('Stufe          Sitzungen   von Vorstufe   von gesehen');
  const basis = erg.stufen[0].sitzungen;
  erg.stufen.forEach((st, i) => {
    const vor = i === 0 ? '-' : prozent(st.sitzungen, erg.stufen[i - 1].sitzungen);
    zeilen.push(st.name.padEnd(14) + String(st.sitzungen).padStart(9) + vor.padStart(15) + prozent(st.sitzungen, basis).padStart(14));
  });
  zeilen.push('');
  const fehler = Object.entries(erg.fehler).sort(([a], [b]) => a.localeCompare(b));
  zeilen.push('Prüfmeldungen (Sitzungen):' + (fehler.length ? '' : ' keine'));
  for (const [k, anzahl] of fehler) {
    const [n, r] = k.split('|');
    zeilen.push('  Schritt ' + n + ' · ' + r + ': ' + anzahl);
  }
  zeilen.push('Kalender: ok ' + erg.kalender.ok + ' · fehler ' + erg.kalender.fehler);
  zeilen.push((erg.mitBots ? 'Bot-Sitzungen mitgezählt: ' : 'Ausgeblendete Bot-Sitzungen: ') + erg.bots
    + ' · ungültige Zeilen: ' + erg.ungueltig);
  return zeilen.join('\n');
}

/** Datei oder '-' (stdin) lesen; gzip wird am Dateikopf erkannt. */
export function dateiLesen(pfad) {
  const roh = pfad === '-' ? readFileSync(0) : readFileSync(pfad);
  const daten = roh.length > 1 && roh[0] === 0x1f && roh[1] === 0x8b ? gunzipSync(roh) : roh;
  return daten.toString('utf8').split('\n');
}

/** Kommandozeile -> {von, bis, mitBots, dateien}; wirft bei falschen Angaben. */
export function argumente(argv) {
  const opt = { von: null, bis: null, mitBots: false, dateien: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--von' || a === '--bis') {
      const wert = argv[++i];
      if (!DATUM.test(wert || '')) throw new Error(a + ' braucht ein Datum JJJJ-MM-TT');
      opt[a.slice(2)] = wert;
    } else if (a === '--mit-bots') {
      opt.mitBots = true;
    } else if (a.startsWith('--')) {
      throw new Error('Unbekannte Option: ' + a);
    } else {
      opt.dateien.push(a);
    }
  }
  if (!opt.dateien.length) opt.dateien.push('-');
  return opt;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let opt;
  try {
    opt = argumente(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
  console.log(formatieren(auswerten(opt.dateien.flatMap(dateiLesen), opt)));
}
```

- [ ] **Step 4: Tests grün**

Run: `node scripts/test-trichter.mjs`
Expected: 12 Zeilen `ok   …`, Exit 0.

- [ ] **Step 5: CLI von Hand prüfen**

Run: `printf '%s\n' '{"t":"2026-10-10T10:00:00+00:00","v":"1","s":"abcdefghij","e":"gesehen","n":"-","r":"-","b":"0"}' | node scripts/trichter-auswertung.mjs -`
Expected: Tabelle mit `gesehen` = 1, Rest 0, Hinweiszeile zur Sitzung.

Run: `node scripts/trichter-auswertung.mjs --von 1.10.2026; echo $?`
Expected: `--von braucht ein Datum JJJJ-MM-TT`, dann `2`.

- [ ] **Step 6: CI-Schritt ergänzen**

In `.github/workflows/verify.yml` **vor** dem Schritt „Frontend-Regressionstests (Navigation, Qualifizierungs-Maske)“ einfügen (der Test braucht kein jsdom und soll auch laufen, wenn die Frontend-Tests scheitern):

```yaml
      # Auswertung des Formular-Trichters (docs/superpowers/specs/2026-10-03-formular-trichter-design.md):
      # Stufenlogik, Zeitzone ueber die Zeitumstellung, gzip, ungueltige Zeilen.
      - name: Formular-Trichter (Auswertung)
        run: node scripts/test-trichter.mjs

```

- [ ] **Step 7: Commit**

```bash
git add scripts/trichter-auswertung.mjs scripts/test-trichter.mjs .github/workflows/verify.yml
git commit -m "Trichter-Auswertung: Stufen, Zeitzone, gzip, CLI mit Tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Meldefunktion `trichter` in `site.js` mit Opt-out

**Files:**
- Modify: `scripts/test-frontend.mjs` (Funktion `bootWizard` ab Zeile 142, neue Hilfen und Tests direkt nach dem Test „Maske: Mehrfachauswahl verlangt weiterhin die Geschaeftsfuehrung“, vor dem Block „Rechenbeispiel #hochrechnung“)
- Modify: `site/scripts/site.js` (neuer Block direkt vor `/* 4) Qualifizierungs-Maske`)

- [ ] **Step 1: `bootWizard` um Start-URL und Vorbereitungs-Hook erweitern**

In `scripts/test-frontend.mjs` die Funktion `bootWizard` ersetzen durch:

```js
function bootWizard(opts = {}) {
  const dom = new JSDOM(readFileSync(HTML_PATH, 'utf8'), {
    url: opts.url || 'https://manibase.de/',
    runScripts: 'outside-only',
  });
  // jsdom kennt matchMedia nicht; site.js fragt damit prefers-reduced-motion ab.
  // "matches:false" = normale Animationen, also der Alltagsfall im Browser.
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  // Optionaler Hook fuer Stubs, die site.js schon beim Laden sehen muss
  // (Beacon, IntersectionObserver, Browser-Signale, localStorage, Zeeg).
  if (opts.vorbereiten) opts.vorbereiten(dom.window);
  // site.js laeuft als IIFE beim Laden; jsdom holt externe Skripte hier nicht
  // selbst, deshalb wird die Datei nach dem Parsen im Fensterkontext ausgefuehrt.
  dom.window.eval(readFileSync(JS_PATH, 'utf8'));
  const form = dom.window.document.getElementById('qualify');
  assert(form, '#qualify nicht gefunden');
  return {
    window: dom.window,
    form,
    steps: [...form.querySelectorAll('.wstep')],
    next: form.querySelector('.wizard__next'),
    err: form.querySelector('.wizard__err'),
    activeIndex() {
      return this.steps.findIndex((s) => s.classList.contains('is-active'));
    },
  };
}
```

- [ ] **Step 2: Hilfsfunktionen und Opt-out-Tests schreiben**

Direkt nach dem Test „Maske: Mehrfachauswahl verlangt weiterhin die Geschaeftsfuehrung“ einfügen:

```js
/* --- Formular-Trichter ---------------------------------------------------------
 *
 * Die Maske meldet per Beacon an /t, wie weit Besucher kommen (Spec
 * docs/superpowers/specs/2026-10-03-formular-trichter-design.md). jsdom kennt
 * weder sendBeacon noch fetch, IntersectionObserver oder scrollIntoView; die
 * Stubs setzt bootTrichter vor dem Laden von site.js.
 */

function bootTrichter(extra = {}) {
  const gesendet = [];
  const beobachter = [];
  const vorbereiten = (w) => {
    Object.defineProperty(w.navigator, 'sendBeacon', {
      configurable: true,
      value: (u) => { gesendet.push(String(u)); return true; },
    });
    w.Element.prototype.scrollIntoView = function () {};
    w.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; this.ziele = []; beobachter.push(this); }
      observe(el) { this.ziele.push(el); }
      unobserve(el) { this.ziele = this.ziele.filter((z) => z !== el); }
      disconnect() { this.ziele = []; }
    };
    if (extra.vorbereiten) extra.vorbereiten(w);
  };
  const w = bootWizard({ url: extra.url, vorbereiten });
  w.gesendet = gesendet;
  w.ereignisse = () => gesendet.map((u) => {
    const url = new URL(u, 'https://manibase.de/');
    return { pfad: url.pathname, ...Object.fromEntries(url.searchParams) };
  });
  // Meldet dem Observer, der das Element beobachtet, "ist sichtbar".
  w.sichtbar = (el) => {
    for (const b of beobachter) {
      if (b.ziele.includes(el)) b.cb([{ isIntersecting: true, intersectionRatio: 1, target: el }], b);
    }
  };
  return w;
}

const kurz = (ev) => [ev.e, ev.n, ev.r].filter(Boolean).join(':');

function waehlen(w, input) {
  input.checked = true;
  input.dispatchEvent(new w.window.Event('change', { bubbles: true }));
}

// Schritte 1 bis 4 gueltig ausfuellen, endet auf dem Kontakt-Schritt.
function bisKontakt(w) {
  for (const step of w.steps.filter((s) => s.querySelector('input[type="radio"]'))) {
    waehlen(w, step.querySelector('input[type="radio"]'));
    click(w.window, w.next);
  }
  waehlen(w, w.form.querySelector('input[name="teilnehmer"][value="gf"]'));
  click(w.window, w.next);
}

function kontaktAusfuellen(w) {
  w.form.querySelector('[name="name"]').value = 'Erika Mustermann';
  w.form.querySelector('[name="email"]').value = 'erika@example.org';
  w.form.querySelector('[name="firma"]').value = 'Musterbau GmbH';
  w.form.querySelector('[name="consent"]').checked = true;
}

function absenden(w) {
  w.form.dispatchEvent(new w.window.Event('submit', { bubbles: true, cancelable: true }));
}

test('Trichter: GPC, Do Not Track und Opt-out unterdruecken jede Meldung', () => {
  const faelle = {
    'navigator.globalPrivacyControl': (w) => Object.defineProperty(w.navigator, 'globalPrivacyControl', { configurable: true, value: true }),
    'navigator.doNotTrack': (w) => Object.defineProperty(w.navigator, 'doNotTrack', { configurable: true, value: '1' }),
    'window.doNotTrack': (w) => { w.doNotTrack = '1'; },
    'localStorage': (w) => w.localStorage.setItem('manibase-trichter', 'aus'),
  };
  for (const [name, vorbereiten] of Object.entries(faelle)) {
    const w = bootTrichter({ vorbereiten });
    w.sichtbar(w.form.querySelector('.wizard__progress'));
    bisKontakt(w);
    assert(w.gesendet.length === 0, name + ': trotzdem gesendet: ' + w.gesendet.join(' '));
  }
});

test('Trichter: ?trichter=aus schaltet ab und verschwindet aus der Adresse', () => {
  const w = bootTrichter({ url: 'https://manibase.de/?x=1&trichter=aus#termin' });
  assert(w.window.location.href === 'https://manibase.de/?x=1#termin', 'Adresse danach: ' + w.window.location.href);
  assert(w.window.localStorage.getItem('manibase-trichter') === 'aus', 'Opt-out nicht gespeichert');
  bisKontakt(w);
  assert(w.gesendet.length === 0, 'Trotz Opt-out gesendet');

  const an = bootTrichter({
    url: 'https://manibase.de/?trichter=an',
    vorbereiten: (win) => win.localStorage.setItem('manibase-trichter', 'aus'),
  });
  assert(an.window.location.href === 'https://manibase.de/', 'Adresse danach: ' + an.window.location.href);
  assert(an.window.localStorage.getItem('manibase-trichter') === null, 'Opt-out nicht entfernt');
});

test('Trichter: ?trichter=aus wirkt auch bei gesperrtem Browser-Speicher', () => {
  const w = bootTrichter({
    url: 'https://manibase.de/?trichter=aus',
    vorbereiten: (win) => Object.defineProperty(win, 'localStorage', {
      configurable: true, get() { throw new Error('gesperrt'); },
    }),
  });
  bisKontakt(w);
  assert(w.gesendet.length === 0, 'Trotz ?trichter=aus gesendet: ' + w.gesendet.join(' '));
});

test('Trichter: wirft der Beacon, laeuft die Maske weiter', () => {
  const w = bootTrichter({
    vorbereiten: (win) => Object.defineProperty(win.navigator, 'sendBeacon', {
      configurable: true, value: () => { throw new Error('blockiert'); },
    }),
  });
  bisKontakt(w);
  assert(w.activeIndex() === 4, 'Maske blieb stehen bei Schritt ' + (w.activeIndex() + 1));
});
```

Hinweis: Ereignisse (`begonnen`, `schritt`) baut erst Task 4 ein; die Tests, die gesendete Ereignisse brauchen, kommen deshalb erst dort dazu. Die GPC/DNT-Prüfung ist bis Task 4 trivial grün und wird dort scharf.

- [ ] **Step 3: Tests laufen lassen, sie müssen scheitern**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL Trichter: ?trichter=aus …` mit „Adresse danach: …?x=1&trichter=aus#termin“; alle älteren Tests `ok`.

- [ ] **Step 4: Meldefunktion einbauen**

In `site/scripts/site.js` direkt **vor** der Zeile `  /* 4) Qualifizierungs-Maske ----------------------------------------------- */` einfügen:

```js
  /* 4a) Formular-Trichter ----------------------------------------------------
     Zaehlt, wie weit Besucher in der Qualifizierungs-Maske kommen. Schema v1,
     Spec: docs/superpowers/specs/2026-10-03-formular-trichter-design.md.
     Gesendet werden nur v, s, e, n, r an /t; nginx antwortet 204 und loggt ohne
     IP. Keine Cookies, die Kennung s lebt nur im Speicher dieses Seitenaufrufs.
     Aus bei Global Privacy Control, Do Not Track oder ?trichter=aus (Team). */
  var trichter = (function () {
    var KEY = 'manibase-trichter';
    var aus = false;
    var p = null;
    try { p = new URL(window.location.href).searchParams.get('trichter'); } catch (e) { p = null; }
    if (p === 'aus') { aus = true; }
    try {
      if (p === 'aus') { window.localStorage.setItem(KEY, 'aus'); }
      if (p === 'an') { window.localStorage.removeItem(KEY); }
      if (window.localStorage.getItem(KEY) === 'aus') { aus = true; }
    } catch (e) { /* Speicher gesperrt: das Opt-out gilt dann nur fuer diesen Aufruf */ }
    if (p !== null) {
      // Parameter aus der Adresse nehmen, damit der Link nicht weitergegeben wird.
      try {
        var u = new URL(window.location.href);
        u.searchParams.delete('trichter');
        window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash);
      } catch (e) { /* Adresse bleibt stehen, die Messung ist davon unberuehrt */ }
    }
    var nav = window.navigator || {};
    if (nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1') { aus = true; }
    var c = window.crypto;
    if (!c || typeof c.getRandomValues !== 'function') { aus = true; }

    var sid = '';
    if (!aus) {
      var zeichen = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var zufall = new Uint8Array(10);
      c.getRandomValues(zufall);
      for (var i = 0; i < zufall.length; i++) { sid += zeichen.charAt(zufall[i] % zeichen.length); }
    }
    var gemeldet = Object.create(null);

    return function (e, n, r) {
      if (aus) { return; }
      var key = e + '|' + (n || '') + '|' + (r || '');
      if (gemeldet[key]) { return; }
      gemeldet[key] = true;
      var url = '/t?v=1&s=' + sid + '&e=' + e + (n ? '&n=' + n : '') + (r ? '&r=' + r : '');
      // Die Messung darf die Maske nie stoeren: jeder Fehler beim Senden wird
      // bewusst verschluckt, ohne Beacon und fetch wird still nichts gesendet.
      try {
        if (typeof nav.sendBeacon === 'function') {
          nav.sendBeacon(url);
        } else if (typeof window.fetch === 'function') {
          window.fetch(url, { method: 'POST', keepalive: true, credentials: 'omit' }).catch(function () {});
        }
      } catch (err) { /* siehe oben */ }
    };
  })();

```

- [ ] **Step 5: Kopfkommentar von `site.js` ergänzen**

Im Kopfkommentar die Zeile
```
   4) Qualifizierungs-Maske + Kalender erst nach Einwilligung laden (DSGVO)
```
ersetzen durch
```
   4a) Formular-Trichter: zaehlt Schritte der Maske ohne Cookies (Beacon an /t)
   4) Qualifizierungs-Maske + Kalender erst nach Einwilligung laden (DSGVO)
```

- [ ] **Step 6: Tests laufen lassen**

Run: `node scripts/test-frontend.mjs`
Expected: alle Zeilen `ok`, Exit 0.

- [ ] **Step 7: Commit**

```bash
python3 scripts/cache-bust.py site
git add site scripts/test-frontend.mjs
git commit -m "Trichter: Meldefunktion mit Opt-out (GPC, DNT, ?trichter=aus)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Ereignisse der Maske und Enter-Korrektur

**Files:**
- Modify: `scripts/test-frontend.mjs` (Tests ans Ende des Trichter-Blocks aus Task 3)
- Modify: `site/scripts/site.js` (`initWizard`)

- [ ] **Step 1: Tests schreiben**

Ans Ende des Trichter-Blocks in `scripts/test-frontend.mjs` anhängen:

```js
test('Trichter: gesendet werden nur v, s, e, n, r, nie Formularwerte', () => {
  const w = bootTrichter();
  bisKontakt(w);
  kontaktAusfuellen(w);
  absenden(w);
  const evs = w.ereignisse();
  assert(evs.length >= 5, 'Zu wenige Ereignisse: ' + evs.length);
  const erlaubt = new Set(['pfad', 'v', 's', 'e', 'n', 'r']);
  for (const ev of evs) {
    assert(ev.pfad === '/t', 'Falscher Pfad: ' + ev.pfad);
    for (const k of Object.keys(ev)) assert(erlaubt.has(k), 'Unerlaubter Parameter: ' + k);
    assert(ev.v === '1', 'Schema-Version fehlt: ' + JSON.stringify(ev));
    assert(/^[a-z0-9]{10}$/.test(ev.s), 'Kennung ungueltig: ' + ev.s);
  }
  assert(new Set(evs.map((e) => e.s)).size === 1, 'Kennung wechselt innerhalb eines Seitenaufrufs');
  const roh = w.gesendet.join(' ');
  for (const wert of ['@', 'Erika', 'Mustermann', 'example', 'Musterbau']) {
    assert(!roh.includes(wert), 'Formularwert im Beacon: ' + wert);
  }
  const zweiter = bootTrichter();
  bisKontakt(zweiter);
  assert(zweiter.ereignisse()[0].s !== evs[0].s, 'Zwei Seitenaufrufe teilen sich eine Kennung');
});

test('Trichter: nach ?trichter=an wird wieder gemessen', () => {
  const an = bootTrichter({
    url: 'https://manibase.de/?trichter=an',
    vorbereiten: (win) => win.localStorage.setItem('manibase-trichter', 'aus'),
  });
  bisKontakt(an);
  assert(an.gesendet.length > 0, 'Nach ?trichter=an wird nicht gemessen');
});

test('Trichter: ohne Beacon meldet fetch per POST ohne Cookies', () => {
  const aufrufe = [];
  const w = bootTrichter({
    vorbereiten: (win) => {
      Object.defineProperty(win.navigator, 'sendBeacon', { configurable: true, value: undefined });
      win.fetch = (url, opts) => { aufrufe.push({ url: String(url), opts }); return Promise.resolve(); };
    },
  });
  bisKontakt(w);
  assert(aufrufe.length >= 4, 'fetch nicht genutzt: ' + aufrufe.length);
  for (const a of aufrufe) {
    assert(a.url.startsWith('/t?v=1&'), 'Falsche Adresse: ' + a.url);
    assert(a.opts && a.opts.method === 'POST' && a.opts.keepalive === true && a.opts.credentials === 'omit',
      'Falsche fetch-Optionen: ' + JSON.stringify(a.opts));
  }
});

test('Trichter: Durchlauf meldet jede Stufe genau einmal', () => {
  const w = bootTrichter();
  const fortschritt = w.form.querySelector('.wizard__progress');
  w.sichtbar(fortschritt);
  w.sichtbar(fortschritt);
  bisKontakt(w);
  // Zurueck und wieder vor: Schritt 5 darf nicht doppelt gemeldet werden.
  click(w.window, w.form.querySelector('.wizard__back'));
  click(w.window, w.next);
  kontaktAusfuellen(w);
  absenden(w);
  const ist = w.ereignisse().map(kurz).join(' ');
  const soll = 'gesehen begonnen schritt:2 schritt:3 schritt:4 schritt:5 abgeschickt';
  assert(ist === soll, 'Ereignisse: ' + ist + '\n       erwartet: ' + soll);
});

test('Trichter: Pruefmeldungen tragen Schritt und Grund', () => {
  const w = bootTrichter();
  click(w.window, w.next); // Schritt 1 ohne Auswahl
  click(w.window, w.next); // zweites Mal: keine zweite Meldung
  for (const step of w.steps.filter((s) => s.querySelector('input[type="radio"]'))) {
    waehlen(w, step.querySelector('input[type="radio"]'));
    click(w.window, w.next);
  }
  click(w.window, w.next); // Schritt 4 ohne Auswahl
  waehlen(w, w.form.querySelector('input[name="teilnehmer"][value="it"]'));
  click(w.window, w.next); // Schritt 4 ohne Geschaeftsfuehrung
  waehlen(w, w.form.querySelector('input[name="teilnehmer"][value="gf"]'));
  click(w.window, w.next);
  absenden(w); // Schritt 5 leer
  w.form.querySelector('[name="name"]').value = 'Erika Mustermann';
  absenden(w); // ohne E-Mail
  w.form.querySelector('[name="email"]').value = 'erika@example.org';
  absenden(w); // ohne Unternehmen
  w.form.querySelector('[name="firma"]').value = 'Musterbau GmbH';
  absenden(w); // ohne Einwilligung
  const ist = w.ereignisse().filter((e) => e.e === 'fehler').map(kurz).join(' ');
  const soll = 'fehler:1:auswahl fehler:4:mehrfach fehler:4:gf fehler:5:name fehler:5:email fehler:5:firma fehler:5:einwilligung';
  assert(ist === soll, 'Pruefmeldungen: ' + ist + '\n       erwartet: ' + soll);
});

test('Maske: Enter vor dem letzten Schritt schaltet weiter statt Kontaktfehler', () => {
  const w = bootWizard();
  absenden(w); // Enter ohne Auswahl
  assert(w.activeIndex() === 0, 'Schritt 1 uebersprungen');
  assert(w.err.textContent === 'Bitte wählen Sie eine Antwort aus.', 'Falsche Meldung: ' + w.err.textContent);
  waehlen(w, w.steps[0].querySelector('input[type="radio"]'));
  absenden(w); // Enter mit Auswahl
  assert(w.activeIndex() === 1, 'Enter mit Auswahl schaltet nicht weiter');
  assert(w.err.hidden, 'Fehlermeldung trotz gueltiger Auswahl');
});

test('Trichter: ohne Beacon und fetch laesst sich die Maske abschicken', () => {
  // fetch ausdruecklich entfernen: bekaeme jsdom eines Tages fetch, ginge sonst aus
  // der CI ein echter Request an manibase.de.
  const w = bootWizard({
    vorbereiten: (win) => {
      win.Element.prototype.scrollIntoView = function () {};
      win.fetch = undefined;
    },
  });
  bisKontakt(w);
  kontaktAusfuellen(w);
  absenden(w);
  assert(w.form.hidden, 'Maske ohne Beacon nicht abschickbar');
});
```

- [ ] **Step 2: Tests laufen lassen, sie müssen scheitern**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL` für „gesendet werden nur …“ (Zu wenige Ereignisse), „nach ?trichter=an …“, „ohne Beacon meldet fetch …“, „Durchlauf …“, „Pruefmeldungen …“ und „Enter vor dem letzten Schritt …“ (Meldung lautet „Bitte geben Sie Ihren Namen an.“). „ohne Beacon und fetch …“ ist schon grün (jsdom hat kein fetch); der Test sichert den Zustand ab.

- [ ] **Step 3: `showErr` um den Grund erweitern**

In `initWizard` ersetzen:

```js
    function showErr(msg, field) {
      if (errBox) { errBox.hidden = false; errBox.textContent = msg; }
      if (field) { field.setAttribute('aria-invalid', 'true'); }
    }
```

durch:

```js
    function showErr(msg, field, grund) {
      if (errBox) { errBox.hidden = false; errBox.textContent = msg; }
      if (field) { field.setAttribute('aria-invalid', 'true'); }
      if (grund) { trichter('fehler', idx + 1, grund); }
    }
```

- [ ] **Step 4: Gründe in `valid()` setzen**

Drei Aufrufe ändern:

- `showErr('Bitte wählen Sie eine Antwort aus.');` → `showErr('Bitte wählen Sie eine Antwort aus.', null, 'auswahl');`
- `if (!any) { showErr('Bitte wählen Sie mindestens einen Punkt.'); return false; }` → `if (!any) { showErr('Bitte wählen Sie mindestens einen Punkt.', null, 'mehrfach'); return false; }`
- `showErr('Bitte beziehen Sie die Geschäftsführung in das Erstgespräch ein.');` → `showErr('Bitte beziehen Sie die Geschäftsführung in das Erstgespräch ein.', null, 'gf');`

- [ ] **Step 5: Schrittwechsel melden**

```js
    function next() {
      if (!valid(steps[idx])) return;
      if (idx < total - 1) { idx++; render(true); }
    }
```

ersetzen durch:

```js
    function next() {
      if (!valid(steps[idx])) return;
      if (idx < total - 1) { idx++; trichter('schritt', idx + 1); render(true); }
    }
```

- [ ] **Step 6: „begonnen“ melden**

Die beiden Listener ersetzen:

```js
    form.addEventListener('change', function (ev) {
      trichter('begonnen');
      if (ev.target) { ev.target.removeAttribute('aria-invalid'); }
      if (ev.target && (ev.target.type === 'checkbox' || ev.target.type === 'radio')) clearErr();
    });
    form.addEventListener('input', function (ev) {
      trichter('begonnen');
      if (ev.target) { ev.target.removeAttribute('aria-invalid'); }
      clearErr();
    });
```

- [ ] **Step 7: Submit-Handler: Enter-Korrektur, Gründe, „abgeschickt“**

Den Submit-Handler in `initWizard` ersetzen durch:

```js
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      // Enter auf einer Auswahl in Schritt 1 bis 4 loest die implizite Absendung
      // aus (der versteckte Absende-Button bleibt Default-Button). Dann wie "Weiter",
      // statt den Namen fuer ein unsichtbares Feld anzumahnen.
      if (idx < total - 1) { next(); return; }
      var name = form.querySelector('[name="name"]');
      var mail = form.querySelector('[name="email"]');
      var firma = form.querySelector('[name="firma"]');
      var consent = form.querySelector('[name="consent"]');
      if (!name.value.trim()) { showErr('Bitte geben Sie Ihren Namen an.', name, 'name'); name.focus(); return; }
      if (!EMAIL_RE.test(mail.value.trim())) { showErr('Bitte geben Sie eine gültige E-Mail-Adresse an.', mail, 'email'); mail.focus(); return; }
      if (firma && !firma.value.trim()) { showErr('Bitte geben Sie Ihr Unternehmen an.', firma, 'firma'); firma.focus(); return; }
      if (!consent.checked) { showErr('Bitte bestätigen Sie die Verarbeitung Ihrer Angaben.', consent, 'einwilligung'); consent.focus(); return; }
      clearErr();
      trichter('abgeschickt');
      // Antworten der Maske einsammeln und in den Kalender (Zeeg) vorbefüllen,
      // damit sie nicht verloren gehen und das Gespräch sofort beim Thema ist.
      var booking = buildBookingPrefill(form);
      form.hidden = true;
      revealCalendar(booking);
    });
```

- [ ] **Step 8: „gesehen“ melden**

In `initWizard` die letzte Zeile `    render(false);` ersetzen durch:

```js
    render(false);

    // Trichter: "gesehen", sobald die Fortschrittszeile ganz im Bild ist. Die
    // Maske selbst ist auf dem Handy hoeher als der Bildschirm und erreichte eine
    // Sichtbarkeitsschwelle nie, deshalb die kleine Zeile darueber. 0.99 statt 1:
    // bei Zoom und Subpixel-Lagen erreicht die Quote 1 oft nie. Die Quote wird
    // selbst geprueft, weil der erste Callback nach observe() immer kommt und
    // isIntersecting die Schwelle nicht beachtet.
    var progress = form.querySelector('.wizard__progress');
    if (progress && 'IntersectionObserver' in window) {
      var sichtbar = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.99) { trichter('gesehen'); sichtbar.disconnect(); }
        });
      }, { threshold: 0.99 });
      sichtbar.observe(progress);
    }
```

- [ ] **Step 9: Tests grün**

Run: `node scripts/test-frontend.mjs`
Expected: alle Zeilen `ok`, Exit 0.

- [ ] **Step 10: Commit**

```bash
python3 scripts/cache-bust.py site
git add site scripts/test-frontend.mjs
git commit -m "Trichter: Ereignisse der Maske; Enter in Schritt 1 bis 4 schaltet weiter

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Kalender-Ereignis

**Files:**
- Modify: `scripts/test-frontend.mjs` (Test ans Ende des Trichter-Blocks)
- Modify: `site/scripts/site.js` (`loadBookingCalendar`)

- [ ] **Step 1: Test schreiben**

```js
test('Trichter: Kalender meldet ok oder fehler', () => {
  const lauf = (vorbereiten) => {
    const w = bootTrichter({ vorbereiten });
    bisKontakt(w);
    kontaktAusfuellen(w);
    absenden(w);
    return w;
  };
  const kalender = (w) => w.ereignisse().filter((e) => e.e === 'kalender').map(kurz).join(' ');

  const ok = lauf((win) => { win.Zeeg = { initInlineWidget() {} }; });
  assert(kalender(ok) === 'kalender:ok', 'Zeeg vorhanden: ' + kalender(ok));

  const wirft = lauf((win) => { win.Zeeg = { initInlineWidget() { throw new Error('kaputt'); } }; });
  assert(kalender(wirft) === 'kalender:fehler', 'initInlineWidget wirft: ' + kalender(wirft));

  const halb = lauf((win) => { win.Zeeg = {}; });
  assert(kalender(halb) === 'kalender:fehler', 'Zeeg ohne initInlineWidget: ' + kalender(halb));

  const geladen = lauf();
  const skript = geladen.window.document.querySelector('script[src*="zeeg"]');
  assert(skript, 'Zeeg-Skript wurde nicht angehaengt');
  skript.dispatchEvent(new geladen.window.Event('load'));
  assert(kalender(geladen) === 'kalender:fehler', 'Skript geladen ohne Zeeg: ' + kalender(geladen));

  const blockiert = lauf();
  blockiert.window.document.querySelector('script[src*="zeeg"]').dispatchEvent(new blockiert.window.Event('error'));
  assert(kalender(blockiert) === 'kalender:fehler', 'Skript blockiert: ' + kalender(blockiert));
});
```

- [ ] **Step 2: Test scheitert**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL Trichter: Kalender meldet ok oder fehler`.

- [ ] **Step 3: `loadBookingCalendar` anpassen**

Den Teil ab `    var answerId = box.getAttribute('data-cal-answer');` bis zum Ende der Funktion ersetzen durch:

```js
    var answerId = box.getAttribute('data-cal-answer');
    // true, wenn das Widget gestartet wurde; false, wenn Zeeg fehlt (Trichter: kalender).
    function init() {
      if (!(window.Zeeg && window.Zeeg.initInlineWidget)) { return false; }
      var opts = { url: url, parentElement: target };
      if (booking && booking.prefill) {
        opts.prefill = booking.prefill;
        if (answerId && booking.summary) {
          opts.prefill.answers = {};
          opts.prefill.answers[answerId] = booking.summary;
        }
      }
      // Wirft das Widget, bleibt der Absende-Pfad heil und der Trichter sieht den Fehler.
      try { window.Zeeg.initInlineWidget(opts); } catch (e) { return false; }
      return true;
    }
    function melden(ok) { trichter('kalender', null, ok ? 'ok' : 'fehler'); }
    if (window.Zeeg) { melden(init()); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = function () { melden(init()); };
    // Werbeblocker oder Netzfehler: ohne diese Meldung bliebe der leere Kalender unsichtbar.
    s.onerror = function () { melden(false); };
    document.body.appendChild(s);
  }
```

- [ ] **Step 4: Tests grün**

Run: `node scripts/test-frontend.mjs`
Expected: alle `ok`.

- [ ] **Step 5: Commit**

```bash
python3 scripts/cache-bust.py site
git add site scripts/test-frontend.mjs
git commit -m "Trichter: Kalender meldet ok oder fehler, auch bei blockiertem Zeeg-Skript

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Datenschutzerklärung

**Files:**
- Modify: `site/datenschutz.html` (Abschnitt 3 Zeile 53, Abschnitt 5 nach Zeile 59, Abschnitt 11 Zeile 82, Stand Zeile 84)
- Modify: `scripts/test-frontend.mjs` (Test ans Dateiende vor der Abschlussprüfung `if (failed)`)

Copy-Regeln aus `CLAUDE.md`: Sie-Ansprache, **keine Gedankenstriche (—, –) im Text**, keine Buzzwords.

- [ ] **Step 1: Test schreiben**

```js
test('Datenschutz: Zaehlung der Formularschritte und Log-Frist sind beschrieben', () => {
  const html = readFileSync('site/datenschutz.html', 'utf8');
  for (const teil of ['Zählung der Formularschritte', 'Global Privacy Control', 'Do Not Track',
    'spätestens 13 Monaten', 'index.html?trichter=aus', 'in der Regel nach 15 Tagen', 'Stand: 3. Oktober 2026',
    'Gespeichert werden der Zeitpunkt', 'automatisierten Programm', 'Art. 21 DSGVO']) {
    assert(html.includes(teil), 'Fehlt in datenschutz.html: ' + teil);
  }
  assert(!html.includes('nicht auf Ihrem Gerät gespeichert'), 'Behauptung "nicht auf Ihrem Gerät gespeichert" steht im Text');
  assert(!/kein(en)? Zugriff auf (Ihr |das )?Endgerät/i.test(html), 'Behauptung "kein Zugriff auf das Endgerät" steht im Text');
});
```

- [ ] **Step 2: Test scheitert**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL Datenschutz: …`.

- [ ] **Step 3: Abschnitt 3 ergänzen**

Am Ende des Absatzes in Abschnitt 3, also nach `(AVV) nach Art. 28 DSGVO.` und vor dem `</p>` (der kürzere Anker `nach Art. 28 DSGVO.</p>` kommt auch in Abschnitt 7 vor), einfügen:

```
 Die Server-Logdaten werden täglich rotiert und in der Regel nach 15 Tagen gelöscht.
```

- [ ] **Step 4: Abschnitt 5 ergänzen**

Nach dem bestehenden `<p>` in Abschnitt 5 (endet mit `(Durchführung vorvertraglicher Maßnahmen).</p>`) einfügen:

```html
    <p><strong>Zählung der Formularschritte.</strong> Damit wir erkennen, an welcher Stelle das Formular schwer verständlich ist, meldet Ihr Browser an unseren eigenen Server, sobald der Anfang des Formulars sichtbar wird, und beim Ausfüllen, welcher Schritt erreicht wurde, ob ein Hinweis auf eine fehlende Angabe erschien, ob das Formular abgeschickt wurde und ob der Terminkalender geladen werden konnte. Ihre Eingaben im Formular sind nicht Teil dieser Meldung. Gespeichert werden der Zeitpunkt (auf die volle Stunde gekürzt), das gemeldete Ereignis, eine zufällige Kennung, die nur während dieses Seitenaufrufs im Arbeitsspeicher Ihres Browsers vorliegt und danach verworfen wird, sowie ein Vermerk, ob die Anfrage laut Browserkennung von einem automatisierten Programm (etwa einer Suchmaschine) stammt. Ihre IP-Adresse und die Browserkennung selbst speichern wir für diese Zählung nicht; die IP-Adresse wird nur kurz im Arbeitsspeicher unseres Servers verarbeitet, um missbräuchlich viele Meldungen abzuweisen. Es werden keine Cookies gesetzt. Rechtsgrundlage ist unser berechtigtes Interesse an einem verständlichen Formular (Art. 6 Abs. 1 lit. f DSGVO). Die Aufzeichnungen löschen wir nach spätestens 13 Monaten. Hat Ihr Browser das Signal „Global Privacy Control“ oder „Do Not Track“ eingeschaltet, findet keine Zählung statt. Sie können dieser Verarbeitung jederzeit widersprechen (Art. 21 DSGVO), am einfachsten über den Link <a href="index.html?trichter=aus">Zählung abschalten</a>: Er öffnet unsere Startseite und schaltet die Zählung für diesen Browser ab, eine Bestätigung erscheint dabei nicht. Dazu legen wir im Speicher Ihres Browsers einen Vermerk ab, den Sie über <a href="index.html?trichter=an">Zählung wieder zulassen</a> oder durch Löschen der Websitedaten entfernen.</p>
```

- [ ] **Step 5: Abschnitt 11 und Stand**

Abschnitt 11: den Absatz

```html
    <p>Wir verarbeiten personenbezogene Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen es vorschreiben.</p>
```

ersetzen durch:

```html
    <p>Wir verarbeiten personenbezogene Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen es vorschreiben. Server-Logdaten (Abschnitt 3) löschen wir in der Regel nach 15 Tagen, die Aufzeichnungen der Zählung der Formularschritte (Abschnitt 5) nach spätestens 13 Monaten.</p>
```

`Stand: 13. Juli 2026` → `Stand: 3. Oktober 2026`.

- [ ] **Step 6: Tests grün, Gedankenstriche prüfen**

Run: `node scripts/test-frontend.mjs`
Expected: alle `ok`.

Run: `git diff -U0 site/datenschutz.html | grep '^+' | python3 -c "import sys;print(sum(c in '\u2013\u2014' for c in sys.stdin.read()))"`
Expected: `0`.

- [ ] **Step 7: Commit**

```bash
git add site/datenschutz.html scripts/test-frontend.mjs
git commit -m "Datenschutz: Zaehlung der Formularschritte und Frist der Server-Logdaten

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Versionierte Server-Konfiguration

**Files:**
- Create: `docs/deploy/nginx-trichter.conf`
- Create: `docs/deploy/logrotate-manibase-trichter`

Nur Dateien im Repo anlegen. **Nichts auf dem Server ausführen**, das macht die Hauptsitzung.

- [ ] **Step 1: `docs/deploy/nginx-trichter.conf`**

```nginx
# manibase.de, Formular-Trichter (Spec docs/superpowers/specs/2026-10-03-formular-trichter-design.md)
#
# Die Website meldet per Beacon an /t, wie weit Besucher in der
# Qualifizierungs-Maske kommen. nginx antwortet 204 und schreibt eine JSON-Zeile
# OHNE IP-Adresse, Referrer oder User-Agent nach /var/log/manibase/trichter.log
# (pseudonym, nicht anonym: Zufallskennung je Seitenaufruf, Zeit auf die Stunde).
# Auswertung: scripts/trichter-auswertung.mjs (laeuft lokal, nicht auf dem Server).
#
# Alle Regexe in map-Bloecken stehen in Anfuehrungszeichen: { } und ; brechen
# sonst den Parser. [|] statt \| vermeidet Escape-Fragen.

# ---- Teil 1: http-Kontext -> /etc/nginx/conf.d/manibase-trichter.conf ----------

limit_req_zone $binary_remote_addr zone=manibase_trichter:10m rate=60r/m;

# Jeder Abfragewert wird auf die erlaubten Werte gefiltert, alles andere wird "-".
# Das begrenzt auch die Zeilenlaenge (escape=json allein verhindert nur Injektion).
map $arg_v $trichter_v { "1" "1"; default "-"; }
map $arg_s $trichter_s { "~^[a-z0-9]{10}$" $arg_s; default "-"; }
map $arg_e $trichter_e { "~^(gesehen|begonnen|schritt|fehler|abgeschickt|kalender)$" $arg_e; default "-"; }
map $arg_n $trichter_n { "~^[1-5]$" $arg_n; default "-"; }
map $arg_r $trichter_r { "~^(auswahl|mehrfach|gf|name|email|firma|einwilligung|ok|fehler)$" $arg_r; default "-"; }

# Geloggt wird nur bei Schema 1, gueltiger Kennung und bekanntem Ereignis.
map "$arg_v|$arg_s|$arg_e" $trichter_log {
    "~^1[|][a-z0-9]{10}[|](gesehen|begonnen|schritt|fehler|abgeschickt|kalender)$" 1;
    default 0;
}

# Bots fuehren JS aus (Googlebot, PageSpeed) und wuerden "gesehen" ausloesen.
# Geloggt wird nur das Kennzeichen, nicht der User-Agent. "bot" trifft auch
# Handy-Kennungen wie "CUBOT"; bei den Stueckzahlen hingenommen.
map $http_user_agent $trichter_bot {
    "~*(bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|python|curl|wget)" 1;
    default 0;
}

# Zeitstempel auf die volle Stunde kappen: sekundengenau liesse sich eine
# Sitzung ueber die Uhrzeit dem access.log (mit IP) oder einer Zeeg-Buchung
# zuordnen. Die Zeitverschiebungen sind ganze Stunden, der Berliner Kalendertag
# bleibt damit exakt.
map $time_iso8601 $trichter_t {
    "~^(?<stunde>[0-9-]{10}T[0-9]{2}):[0-9]{2}:[0-9]{2}(?<zone>.*)$" "$stunde:00:00$zone";
    default "-";
}

log_format manibase_trichter escape=json
    '{"t":"$trichter_t","v":"$trichter_v","s":"$trichter_s","e":"$trichter_e",'
    '"n":"$trichter_n","r":"$trichter_r","b":"$trichter_bot"}';

# ---- Teil 2: im HTTPS-server{}-Block von manibase.de ---------------------------
#
# Warum try_files: "return" laeuft in der rewrite-Phase VOR limit_req (preaccess);
# mit "return 204" direkt in /t griffe das Rate-Limit nie. try_files laeuft danach
# und leitet auf die benannte Location um.
# Kein add_header in beiden Locations: sonst entfallen die geerbten Security-Header
# (snippets/manibase-security-headers.conf ist auf Server-Ebene eingebunden).
# Kein empty_gif: das beantwortet POST (sendBeacon) mit 405.
#
# location = /t {
#     access_log off;                  # abgewiesene Aufrufe (503) erzeugen keine Zeile
#     client_max_body_size 1k;
#     limit_req zone=manibase_trichter burst=30 nodelay;
#     limit_req_log_level info;        # unter "error": keine IP im error.log
#     try_files /__trichter_nie__ @trichter;
# }
#
# location @trichter {
#     access_log /var/log/manibase/trichter.log manibase_trichter if=$trichter_log;
#     return 204;
# }
```

- [ ] **Step 2: `docs/deploy/logrotate-manibase-trichter`**

```
# /etc/logrotate.d/manibase-trichter  (Spec docs/superpowers/specs/2026-10-03-formular-trichter-design.md)
#
# Pseudonymes Trichter-Log (keine IP, Zeitstempel auf die Stunde gekappt):
# monatlich, 11 Generationen plus laufende Datei = hoechstens rund 12 Monate,
# damit die Zusage "spaetestens 13 Monate" auch mit Timer-Verzoegerung haelt.
# Bewusst OHNE notifempty: ein leerer Monat muss trotzdem
# rotieren, sonst rueckt nichts nach und die aelteste Generation bleibt laenger
# liegen. maxage hilft dagegen nicht, logrotate prueft es nur beim Rotieren.
# Verzeichnis /var/log/manibase muss root:adm 0755 sein: die nginx-Worker laufen
# als www-data und oeffnen die Datei bei USR1 selbst neu. Ohne x-Recht schrieben
# sie in .1 weiter und die Zeilen gingen bei der naechsten Komprimierung verloren.
/var/log/manibase/trichter.log {
	monthly
	rotate 11
	maxsize 50M
	missingok
	compress
	delaycompress
	create 0640 www-data adm
	sharedscripts
	postrotate
		invoke-rc.d nginx rotate >/dev/null 2>&1
	endscript
}
```

- [ ] **Step 3: Commit**

```bash
git add docs/deploy/nginx-trichter.conf docs/deploy/logrotate-manibase-trichter
git commit -m "Doku: versionierte nginx- und logrotate-Konfiguration fuer den Trichter

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Gesamtprüfung

**Files:**
- Modify: alle HTML-Dateien, die `site.js` einbinden (nur `?v=`)

- [ ] **Step 1: Stempel setzen**

Run: `python3 scripts/cache-bust.py site`
Expected: keine Änderung mehr (Tasks 3 bis 5 haben schon gestempelt); `git status --short` ist leer.

- [ ] **Step 2: Alle Prüfungen wie in der CI**

```bash
python3 scripts/cache-bust.py --check site
node scripts/test-frontend.mjs
node scripts/test-trichter.mjs
for f in site/api/*.php; do php -l "$f"; done
```

Expected: `--check` ohne Abweichung (Exit 0), alle Tests `ok`. Falls `php` lokal fehlt, den letzten Befehl auslassen und das im Bericht nennen (die Datei-Änderungen betreffen kein PHP).

- [ ] **Step 3: Binärdateien im Diff ausschließen**

Run: `git diff --numstat origin/main...HEAD | awk -F'\t' '$1=="-" {print "BINÄR: "$3}'`
Expected: keine Ausgabe.

- [ ] **Step 4: Commit nur falls Step 1 doch etwas geändert hat**

```bash
if [ -n "$(git status --short site)" ]; then
  git add site && git commit -m "Cache-Stempel nachgezogen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
fi
```

---

## Nicht Teil dieses Plans (Hauptsitzung)

- Server: `apt install logrotate`, `/var/log/manibase`, conf.d-Datei, beide Locations, logrotate-Regel, Abnahme laut Spec §7 Punkt 10.
- `docs/deployment/trichter-und-logrotate.md` mit dem tatsächlich ausgeführten Stand (inklusive Hinweis fürs Team: der Abschalt-Link gibt keine Rückmeldung) und der `CLAUDE.md`-Abschnitt; beide gehören in den PR und in dessen Checkliste.
- Vor dem Einfügen der Locations `grep -n limit_req` im Vhost: ein `limit_req` auf Server-Ebene würde in `@trichter` vererbt.
- `CLAUDE.md`: Datenschutz hat 11 Abschnitte, nicht 10.
- Härtungsdurchgang (Direktive E2): localStorage, Fristzusagen, stille Fallbacks, Nebenläufigkeit (zwei Tabs).
- PR.

## Offene Review-Punkte

Runde 2 (D): alle Findings übernommen. W3 mit der Mindestlösung (Linktext sagt, dass die Startseite öffnet und keine Bestätigung erscheint) statt `site.js` auf `datenschutz.html` einzubinden: die Seite lädt `site.js` bisher nicht, und eine Statuszeile wäre neues UI ohne Auftrag. K12: der Plan schreibt `[|]` statt `\|` in der Regex, gleichwertig und ohne Escape-Fragen.

Runde 1 (D): alle Findings übernommen. K2 so gelöst: Tests, die Ereignisse brauchen, stehen in Task 4; jeder Commit mit `site.js` stempelt sofort.
