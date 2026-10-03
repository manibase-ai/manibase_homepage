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
// Die Zeitzone macht aus der Serverzeit den deutschen Kalendertag; die Teile werden
// selbst zu JJJJ-MM-TT zusammengesetzt, damit nichts am Ausgabeformat einer Sprache haengt.
const TAG_TEILE = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
});
const TAG = {
  format(zeit) {
    const t = Object.fromEntries(TAG_TEILE.formatToParts(zeit).map((p) => [p.type, p.value]));
    return t.year + '-' + t.month + '-' + t.day;
  },
};

/** true, wenn JJJJ-MM-TT ein wirklich vorhandener Kalendertag ist (kein 31. Februar). */
function kalendertag(text) {
  if (!DATUM.test(text)) return false;
  const [j, m, t] = text.split('-').map(Number);
  const d = new Date(Date.UTC(j, m - 1, t));
  return d.getUTCFullYear() === j && d.getUTCMonth() === m - 1 && d.getUTCDate() === t;
}

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
      if (!kalendertag(wert || '')) throw new Error(a + ' braucht ein gueltiges Datum JJJJ-MM-TT');
      opt[a.slice(2)] = wert;
    } else if (a === '--mit-bots') {
      opt.mitBots = true;
    } else if (a.startsWith('--')) {
      throw new Error('Unbekannte Option: ' + a);
    } else {
      opt.dateien.push(a);
    }
  }
  if (opt.von && opt.bis && opt.von > opt.bis) throw new Error('--von liegt nach --bis');
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
