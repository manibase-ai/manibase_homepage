/* Frontend-Regressionstests (Node + jsdom).
 *
 * Zwei Fehler aus dem Review zu PR #11 sind hier festgenagelt, weil beide erst im
 * echten Browser aufgefallen sind und ein statischer Blick auf den Diff sie nicht
 * gezeigt hat:
 *
 *   1) Zwei Umschaltpunkte fuer dieselbe Navigation (1120px alt, 1100px neu) haben
 *      zwischen 1101 und 1120px weder Menue noch Hamburger stehen lassen.
 *   2) Der "Weiter"-Button der Qualifizierungs-Maske stand auch auf den
 *      data-auto-Schritten, waehrend die Pruefung nur Checkboxen kannte: die drei
 *      Pflichtfragen liessen sich ueberspringen.
 *
 * Aufruf: node scripts/test-frontend.mjs   (braucht jsdom, siehe verify.yml)
 */
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const CSS_PATH = 'site/styles/site.css';
const HTML_PATH = 'site/index.html';
const JS_PATH = 'site/scripts/site.js';

/* Umschaltpunkt der Navigation. Steht bewusst als Konstante hier: wer ihn im CSS
   verschiebt, muss ihn hier mitziehen und stolpert dabei ueber diesen Test. */
const NAV_BREAKPOINT = 1100;

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

/* --- CSS-Miniparser: nur so viel, wie fuer die Umschaltpunkt-Pruefung noetig ---- */

// Liefert alle @media-Bloecke als {cond, body}. Verschachtelung kommt in site.css
// nicht vor; ein innerer Block wuerde hier zusaetzlich auftauchen, was fuer die
// Pruefung unschaedlich ist.
function mediaBlocks(css) {
  const out = [];
  const re = /@media([^{]+)\{/g;
  let m;
  while ((m = re.exec(css))) {
    let i = re.lastIndex;
    let depth = 1;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    out.push({ cond: m[1].trim(), body: css.slice(re.lastIndex, i - 1) });
    re.lastIndex = i;
  }
  return out;
}

function rules(css) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (sel && !sel.startsWith('@')) {
      out.push({ selectors: sel.split(',').map((s) => s.trim()), decls: m[2] });
    }
  }
  return out;
}

function declValue(decls, prop) {
  const m = new RegExp(prop + '\\s*:\\s*([^;}]+)').exec(decls);
  return m ? m[1].trim() : null;
}

function widthOf(cond, kind) {
  const m = new RegExp(kind + '-width\\s*:\\s*(\\d+)px').exec(cond);
  return m ? Number(m[1]) : null;
}

const css = readFileSync(CSS_PATH, 'utf8');
const blocks = mediaBlocks(css);

test('Navigation: .nav__links wird nur am ' + NAV_BREAKPOINT + 'px-Umschaltpunkt versteckt', () => {
  const offenders = [];
  for (const block of blocks) {
    for (const rule of rules(block.body)) {
      if (!rule.selectors.includes('.nav__links')) continue;
      if (declValue(rule.decls, 'display') !== 'none') continue;
      const max = widthOf(block.cond, 'max');
      if (max !== NAV_BREAKPOINT) {
        offenders.push('@media ' + block.cond + ' { ' + rule.selectors.join(',') + ' }');
      }
    }
  }
  assert(
    offenders.length === 0,
    'Zusaetzliche Umschaltpunkte verstecken die Hauptnavigation:\n         ' + offenders.join('\n         ')
  );
});

test('Navigation: .nav__toggle erscheint genau an diesem Umschaltpunkt', () => {
  const shown = new Set();
  for (const block of blocks) {
    for (const rule of rules(block.body)) {
      if (!rule.selectors.includes('.nav__toggle')) continue;
      const display = declValue(rule.decls, 'display');
      if (!display || display === 'none') continue;
      const max = widthOf(block.cond, 'max');
      assert(max !== null, '.nav__toggle wird in "@media ' + block.cond + '" ohne max-width eingeblendet');
      shown.add(max);
    }
  }
  assert(shown.size === 1, 'Der Hamburger wird an mehreren Breiten eingeblendet: ' + [...shown].join(', '));
  assert(
    shown.has(NAV_BREAKPOINT),
    'Hamburger erscheint bei ' + [...shown][0] + 'px, .nav__links verschwindet bei ' + NAV_BREAKPOINT + 'px'
  );
});

test('Navigation: .nav__toggle ist ohne Media-Query versteckt', () => {
  // Basisregeln = CSS ohne die @media-Bloecke.
  let base = css;
  for (const block of blocks) base = base.split(block.body).join('');
  const found = rules(base).filter(
    (r) => r.selectors.includes('.nav__toggle') && declValue(r.decls, 'display')
  );
  assert(found.length > 0, '.nav__toggle hat keine Basis-display-Regel');
  assert(
    found.every((r) => declValue(r.decls, 'display') === 'none'),
    '.nav__toggle ist auf dem Desktop sichtbar'
  );
});

/* --- Qualifizierungs-Maske im DOM ------------------------------------------- */

function bootWizard() {
  const dom = new JSDOM(readFileSync(HTML_PATH, 'utf8'), {
    url: 'https://manibase.de/',
    runScripts: 'outside-only',
  });
  // jsdom kennt matchMedia nicht; site.js fragt damit prefers-reduced-motion ab.
  // "matches:false" = normale Animationen, also der Alltagsfall im Browser.
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
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

function click(window, el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

test('Maske: "Weiter" ohne Auswahl bleibt auf dem Schritt und meldet den Fehler', () => {
  const w = bootWizard();
  assert(w.activeIndex() === 0, 'Maske startet nicht auf Schritt 1');
  assert(w.next && !w.next.hidden, '"Weiter" ist auf Schritt 1 nicht bedienbar');

  click(w.window, w.next);

  assert(w.activeIndex() === 0, 'Pflichtfrage 1 liess sich ohne Auswahl ueberspringen');
  assert(w.err && !w.err.hidden, 'Kein Fehlerhinweis nach "Weiter" ohne Auswahl');
});

test('Maske: keiner der Radio-Schritte laesst sich ohne Auswahl ueberspringen', () => {
  const w = bootWizard();
  const radioSteps = w.steps.filter((s) => s.querySelector('input[type="radio"]'));
  assert(radioSteps.length >= 3, 'Weniger Radio-Schritte als erwartet: ' + radioSteps.length);

  for (let i = 0; i < radioSteps.length; i++) {
    assert(w.activeIndex() === i, 'Unerwarteter Schritt ' + w.activeIndex() + ', erwartet ' + i);
    click(w.window, w.next);
    assert(w.activeIndex() === i, 'Schritt ' + (i + 1) + ' liess sich ohne Auswahl ueberspringen');

    // Auswahl setzen und regulaer weiterschalten. Bewusst per "change" statt "click",
    // damit der Auto-Advance-Timer der Maske den Test nicht zusaetzlich weiterschiebt.
    const radio = radioSteps[i].querySelector('input[type="radio"]');
    radio.checked = true;
    radio.dispatchEvent(new w.window.Event('change', { bubbles: true }));
    click(w.window, w.next);
    assert(w.activeIndex() === i + 1, 'Schritt ' + (i + 1) + ' schaltet mit Auswahl nicht weiter');
  }
});

test('Maske: Mehrfachauswahl verlangt weiterhin die Geschaeftsfuehrung', () => {
  const w = bootWizard();
  // Bis zum Teilnehmer-Schritt vorspulen.
  const radioSteps = w.steps.filter((s) => s.querySelector('input[type="radio"]'));
  for (const step of radioSteps) {
    const radio = step.querySelector('input[type="radio"]');
    radio.checked = true;
    radio.dispatchEvent(new w.window.Event('change', { bubbles: true }));
    click(w.window, w.next);
  }
  const step = w.steps[w.activeIndex()];
  const boxes = [...step.querySelectorAll('input[type="checkbox"]')];
  assert(boxes.length > 0, 'Teilnehmer-Schritt nicht erreicht');

  const before = w.activeIndex();
  click(w.window, w.next);
  assert(w.activeIndex() === before, 'Teilnehmer-Schritt liess sich ohne Auswahl ueberspringen');

  // Nur Nicht-GF ankreuzen: muss weiterhin blockieren.
  const it = step.querySelector('input[name="teilnehmer"][value="it"]');
  it.checked = true;
  it.dispatchEvent(new w.window.Event('change', { bubbles: true }));
  click(w.window, w.next);
  assert(w.activeIndex() === before, 'Ohne Geschaeftsfuehrung wurde weitergeschaltet');

  const gf = step.querySelector('input[name="teilnehmer"][value="gf"]');
  gf.checked = true;
  gf.dispatchEvent(new w.window.Event('change', { bubbles: true }));
  click(w.window, w.next);
  assert(w.activeIndex() === before + 1, 'Mit Geschaeftsfuehrung wurde nicht weitergeschaltet');
});

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
console.log('\nAlle Frontend-Tests bestanden.');
