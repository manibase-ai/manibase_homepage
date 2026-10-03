/* Tests der Trichter-Auswertung (scripts/trichter-auswertung.mjs).
 *
 * Aufruf: node scripts/test-trichter.mjs   (keine Abhaengigkeiten)
 */
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
const CLI = fileURLToPath(new URL('./trichter-auswertung.mjs', import.meta.url));
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
  try {
    for (const name of ['a.log', 'b.log.gz']) {
      const zeilen = dateiLesen(join(ordner, name)).filter(Boolean);
      assert(zeilen.length === 2 && zeileLesen(zeilen[1]).e === 'begonnen', name + ': ' + JSON.stringify(zeilen));
    }
  } finally {
    rmSync(ordner, { recursive: true, force: true });
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

test('argumente: Kalenderdaten gibt es wirklich, von liegt nicht nach bis', () => {
  const wirft = (args) => { try { argumente(args); return false; } catch { return true; } };
  assert(wirft(['--von', '2026-02-31']), '31. Februar akzeptiert');
  assert(wirft(['--bis', '2026-13-01']), 'Monat 13 akzeptiert');
  assert(wirft(['--von', '2026-00-10']), 'Monat 0 akzeptiert');
  assert(wirft(['--von', '2026-10-11', '--bis', '2026-10-10']), 'von nach bis akzeptiert');
  assert(!wirft(['--von', '2028-02-29']), 'Schalttag abgelehnt');
  assert(!wirft(['--von', '2026-10-10', '--bis', '2026-10-10']), 'von gleich bis abgelehnt');
  assert(!wirft(['--bis', '2026-10-10', '--von', '2026-10-01']), 'Reihenfolge der Optionen darf egal sein');
});

test('CLI: liest stdin, Exit 2 bei falschem Datum', () => {
  const lauf = (args, input) => spawnSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8' });
  const ok = lauf(['-'], z() + '\n');
  assert(ok.status === 0 && /gesehen\s+1\b/.test(ok.stdout), 'stdin: ' + ok.status + ' ' + ok.stdout + ok.stderr);
  const falsch = lauf(['--von', '1.10.2026'], '');
  assert(falsch.status === 2, 'Exit-Code bei falschem Datum: ' + falsch.status);
  const umgekehrt = lauf(['--von', '2026-10-11', '--bis', '2026-10-10'], '');
  assert(umgekehrt.status === 2, 'Exit-Code bei von nach bis: ' + umgekehrt.status);
});

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
