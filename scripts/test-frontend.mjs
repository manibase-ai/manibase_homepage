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
import { readFileSync, readdirSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const CSS_PATH = 'site/styles/site.css';
const HTML_PATH = 'site/index.html';
const JS_PATH = 'site/scripts/site.js';

/* Umschaltpunkt der Navigation. Steht bewusst als Konstante hier: wer ihn im CSS
   verschiebt, muss ihn hier mitziehen und stolpert dabei ueber diesen Test. */
const NAV_BREAKPOINT = 1100;

let failed = 0;
// Asynchrone Tests geben ein Promise zurueck und werden mit `await test(...)`
// aufgerufen (Top-Level-await, die Datei ist ein ES-Modul). Synchrone Tests
// laufen wie bisher sofort durch.
function test(name, fn) {
  const fehler = (err) => {
    failed++;
    console.error('FAIL ' + name + '\n       ' + err.message);
  };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r.then(() => console.log('ok   ' + name), fehler);
    }
    console.log('ok   ' + name);
  } catch (err) {
    fehler(err);
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

function bootWizard(opts = {}) {
  const dom = new JSDOM(readFileSync(HTML_PATH, 'utf8'), {
    url: opts.url || 'https://manibase.de/',
    runScripts: 'outside-only',
  });
  // jsdom kennt matchMedia nicht; site.js fragt damit prefers-reduced-motion ab.
  // "matches:false" = normale Animationen, also der Alltagsfall im Browser.
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  // Optionaler Hook fuer Stubs, die site.js schon beim Laden sehen muss
  // (statistik.js, IntersectionObserver, Browser-Signale, localStorage, Zeeg).
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

/* --- Reichweitenmessung (statistik.js) und Formular-Trichter -------------------
 *
 * statistik.js laedt Umami und stellt window.statistik bereit; site.js meldet die
 * Maske darueber (Specs 2026-10-03-formular-trichter-design.md und
 * 2026-10-04-statistik-umami-design.md). jsdom kennt weder IntersectionObserver
 * noch scrollIntoView und laedt keine externen Skripte; bootSeite setzt Stubs und
 * fuehrt statistik.js vor site.js aus, umamiLaden spielt den geladenen Tracker.
 */

const STATISTIK_PATH = 'site/scripts/statistik.js';
const WEBSITE_ID = 'c7a7cd2d-e528-4fc1-bcea-667f89052ea2';

function bootSeite(extra = {}) {
  const beobachter = [];
  const vorbereiten = (w) => {
    w.Element.prototype.scrollIntoView = function () {};
    w.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; this.ziele = []; beobachter.push(this); }
      observe(el) { this.ziele.push(el); }
      unobserve(el) { this.ziele = this.ziele.filter((z) => z !== el); }
      disconnect() { this.ziele = []; }
    };
    // Links nicht wirklich oeffnen (jsdom meldet sonst "navigation not implemented").
    w.addEventListener('click', (ev) => ev.preventDefault());
    if (extra.vorbereiten) extra.vorbereiten(w);
    if (extra.ohneStatistik) return;
    w.eval(readFileSync(STATISTIK_PATH, 'utf8'));
  };
  const w = bootWizard({ url: extra.url, vorbereiten });
  w.tracker = () => w.window.document.querySelector('script[src="/u.js"]');
  w.sichtbar = (el, quote = 1) => {
    for (const b of beobachter) {
      if (b.ziele.includes(el)) b.cb([{ isIntersecting: true, intersectionRatio: quote, target: el }], b);
    }
  };
  return w;
}

// Spielt den geladenen Umami-Tracker: setzt window.umami und loest "load" aus.
// track(name, daten) protokolliert in w.gesendet; antwort(i) bestimmt den
// Rueckgabewert des i-ten Aufrufs (Vorgabe: undefined, also synchron).
function umamiLaden(w, antwort = () => undefined) {
  w.gesendet = [];
  w.window.umami = {
    track(name, daten) {
      w.gesendet.push(daten === undefined ? { name } : { name, daten });
      return antwort(w.gesendet.length - 1, name);
    },
  };
  const t = w.tracker();
  assert(t, 'Tracker-Skript /u.js wurde nicht eingefuegt');
  t.dispatchEvent(new w.window.Event('load'));
  return w;
}

const namen = (w) => w.gesendet.map((g) => g.name).join(' ');
const pause = () => new Promise((r) => setTimeout(r, 0));

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

test('Statistik: laedt den Umami-Tracker mit den festgelegten Attributen', () => {
  const w = bootSeite();
  const t = w.tracker();
  assert(t, 'Kein script[src="/u.js"]');
  assert(t.parentNode === w.window.document.head, 'Tracker steht nicht im head');
  assert(t.async === true, 'Tracker nicht async');
  const soll = {
    'data-website-id': WEBSITE_ID, 'data-domains': 'manibase.de',
    'data-exclude-hash': 'true', 'data-do-not-track': 'true',
  };
  for (const [k, v] of Object.entries(soll)) {
    assert(t.getAttribute(k) === v, k + ' = ' + t.getAttribute(k) + ', erwartet ' + v);
  }
  assert(typeof w.window.statistik === 'function', 'window.statistik fehlt');
});

test('Statistik: GPC, Do Not Track und Vermerk verhindern das Laden', () => {
  const faelle = {
    'navigator.globalPrivacyControl': (w) => Object.defineProperty(w.navigator, 'globalPrivacyControl', { configurable: true, value: true }),
    'navigator.doNotTrack': (w) => Object.defineProperty(w.navigator, 'doNotTrack', { configurable: true, value: '1' }),
    'window.doNotTrack': (w) => { w.doNotTrack = '1'; },
    'localStorage': (w) => w.localStorage.setItem('manibase-statistik', 'aus'),
  };
  for (const [name, vorbereiten] of Object.entries(faelle)) {
    const w = bootSeite({ vorbereiten });
    assert(!w.tracker(), name + ': Tracker trotzdem geladen');
    const aufrufe = [];
    w.window.umami = { track: (n) => { aufrufe.push(n); } };
    w.window.statistik('probe');
    bisKontakt(w);
    assert(aufrufe.length === 0, name + ': trotzdem gemeldet: ' + aufrufe.join(' '));
  }
});

test('Statistik: ?statistik=aus speichert, raeumt die Adresse auf, ?statistik=an hebt auf', () => {
  const w = bootSeite({ url: 'https://manibase.de/?q=a%20b&flag&statistik=aus#termin' });
  assert(w.window.location.href === 'https://manibase.de/?q=a%20b&flag#termin', 'Adresse danach: ' + w.window.location.href);
  assert(w.window.localStorage.getItem('manibase-statistik') === 'aus', 'Vermerk nicht gespeichert');
  assert(!w.tracker(), 'Tracker trotz ?statistik=aus geladen');

  const an = bootSeite({
    url: 'https://manibase.de/?statistik=an',
    vorbereiten: (win) => win.localStorage.setItem('manibase-statistik', 'aus'),
  });
  assert(an.window.location.href === 'https://manibase.de/', 'Adresse danach: ' + an.window.location.href);
  assert(an.window.localStorage.getItem('manibase-statistik') === null, 'Vermerk nicht entfernt');
  assert(an.tracker(), 'Nach ?statistik=an kein Tracker');
});

test('Statistik: ?statistik=aus wirkt auch bei gesperrtem Browser-Speicher', () => {
  const w = bootSeite({
    url: 'https://manibase.de/?statistik=aus',
    vorbereiten: (win) => Object.defineProperty(win, 'localStorage', {
      configurable: true, get() { throw new Error('gesperrt'); },
    }),
  });
  assert(!w.tracker(), 'Tracker trotz ?statistik=aus geladen');
});

test('Statistik: Adresse wird vor dem Einfuegen des Trackers bereinigt', () => {
  const zustand = [];
  bootSeite({
    url: 'https://manibase.de/?statistik=an',
    vorbereiten: (win) => {
      const original = win.history.replaceState.bind(win.history);
      win.history.replaceState = (...args) => {
        zustand.push(!!win.document.querySelector('script[src="/u.js"]'));
        return original(...args);
      };
    },
  });
  assert(zustand.join() === 'false', 'replaceState lief bei vorhandenem Tracker: ' + zustand.join());
});

await test('Statistik: Puffer sendet nach dem Laden in Reihenfolge und nacheinander', async () => {
  const w = bootSeite();
  w.window.statistik('a');
  w.window.statistik('b', { x: 1 });
  const offen = [];
  umamiLaden(w, () => new Promise((r) => offen.push(r)));
  assert(namen(w) === 'a', 'Vor Abschluss von "a" schon gesendet: ' + namen(w));
  offen[0]();
  await pause();
  assert(namen(w) === 'a b', 'Nach "a": ' + namen(w));
  assert(JSON.stringify(w.gesendet[1].daten) === '{"x":1}', 'Daten von "b": ' + JSON.stringify(w.gesendet[1]));
  w.window.statistik('c');
  assert(namen(w) === 'a b', '"c" ueberholt "b": ' + namen(w));
  offen[1]();
  await pause();
  assert(namen(w) === 'a b c', 'Nach "b": ' + namen(w));
});

await test('Statistik: Fehler in umami.track stoeren die Seite nicht', async () => {
  const w = bootSeite();
  umamiLaden(w, (i) => {
    if (i === 0) throw new Error('kaputt');
    return Promise.reject(new Error('abgelehnt'));
  });
  w.window.statistik('a');
  w.window.statistik('b');
  w.window.statistik('c');
  await pause();
  assert(namen(w) === 'a b c', 'Nach Fehlern: ' + namen(w));
});

test('Statistik: Ladefehler verwirft Puffer und spaetere Ereignisse', () => {
  const w = bootSeite();
  w.window.statistik('a');
  w.tracker().dispatchEvent(new w.window.Event('error'));
  const aufrufe = [];
  w.window.umami = { track: (n) => { aufrufe.push(n); } };
  w.window.statistik('b');
  // Auch ein spaeteres "load" darf nach einem Ladefehler nichts mehr senden.
  w.tracker().dispatchEvent(new w.window.Event('load'));
  w.window.statistik('c');
  assert(aufrufe.length === 0, 'Nach Ladefehler gemeldet: ' + aufrufe.join(' '));
});

test('Statistik: Klicks auf Telefon, E-Mail, Kontakt und fremde Links', () => {
  const w = umamiLaden(bootSeite({ url: 'https://manibase.de/index.html' }));
  const doc = w.window.document;
  const links = ['tel:+4915565697065', 'mailto:kontakt@manibase.de', 'index.html#termin', 'https://example.org/x', 'ueber-uns.html'];
  for (const href of links) {
    const a = doc.createElement('a');
    a.setAttribute('href', href);
    a.textContent = 'x';
    doc.body.appendChild(a);
    click(w.window, a);
  }
  const ist = JSON.stringify(w.gesendet);
  const soll = JSON.stringify([
    { name: 'klick-telefon' }, { name: 'klick-email' },
    { name: 'klick-kontakt', daten: { seite: '/' } }, { name: 'klick-extern', daten: { ziel: 'example.org' } },
  ]);
  assert(ist === soll, 'Klicks: ' + ist + '\n       erwartet: ' + soll);
});

test('Statistik: Mittelklick zaehlt nicht', () => {
  const w = umamiLaden(bootSeite());
  const a = w.window.document.createElement('a');
  a.setAttribute('href', 'tel:+4915565697065');
  w.window.document.body.appendChild(a);
  a.dispatchEvent(new w.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 1 }));
  assert(w.gesendet.length === 0, 'Mittelklick gemeldet: ' + namen(w));
});

test('Trichter: Durchlauf meldet jede Stufe genau einmal', () => {
  const w = umamiLaden(bootSeite());
  const fortschritt = w.form.querySelector('.wizard__progress');
  w.sichtbar(fortschritt);
  w.sichtbar(fortschritt);
  bisKontakt(w);
  // Zurueck und wieder vor: Schritt 5 darf nicht doppelt gemeldet werden.
  click(w.window, w.form.querySelector('.wizard__back'));
  click(w.window, w.next);
  kontaktAusfuellen(w);
  absenden(w);
  const soll = 'maske-gesehen maske-begonnen maske-schritt-2 maske-schritt-3 maske-schritt-4 maske-schritt-5 maske-abgeschickt';
  assert(namen(w) === soll, 'Ereignisse: ' + namen(w) + '\n       erwartet: ' + soll);
});

test('Trichter: begonnen ohne sichtbare Fortschrittszeile meldet gesehen nach', () => {
  const w = umamiLaden(bootSeite());
  bisKontakt(w);
  assert(namen(w).startsWith('maske-gesehen maske-begonnen maske-schritt-2'), 'Ereignisse: ' + namen(w));
});

test('Trichter: gesehen erst bei voller Sichtbarkeit', () => {
  const w = umamiLaden(bootSeite());
  const fortschritt = w.form.querySelector('.wizard__progress');
  w.sichtbar(fortschritt, 0.5);
  assert(namen(w) === '', 'Bei halber Sichtbarkeit gemeldet: ' + namen(w));
  w.sichtbar(fortschritt, 1);
  assert(namen(w) === 'maske-gesehen', 'Bei voller Sichtbarkeit: ' + namen(w));
});

test('Trichter: Pruefmeldungen tragen Schritt und Grund', () => {
  const w = umamiLaden(bootSeite());
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
  const ist = JSON.stringify(w.gesendet.filter((g) => g.name === 'maske-fehler').map((g) => g.daten));
  const soll = JSON.stringify([
    { schritt: 1, grund: 'auswahl' }, { schritt: 4, grund: 'mehrfach' }, { schritt: 4, grund: 'gf' },
    { schritt: 5, grund: 'name' }, { schritt: 5, grund: 'email' }, { schritt: 5, grund: 'firma' },
    { schritt: 5, grund: 'einwilligung' },
  ]);
  assert(ist === soll, 'Pruefmeldungen: ' + ist + '\n       erwartet: ' + soll);
});

test('Trichter: Formularwerte gehen nie an die Messung', () => {
  const w = umamiLaden(bootSeite());
  bisKontakt(w);
  kontaktAusfuellen(w);
  absenden(w);
  const roh = JSON.stringify(w.gesendet);
  for (const wert of ['@', 'Erika', 'Mustermann', 'example', 'Musterbau']) {
    assert(!roh.includes(wert), 'Formularwert gemeldet: ' + wert);
  }
});

test('Trichter: ohne statistik.js laesst sich die Maske abschicken', () => {
  const w = bootSeite({ ohneStatistik: true });
  bisKontakt(w);
  kontaktAusfuellen(w);
  absenden(w);
  assert(w.form.hidden, 'Maske ohne statistik.js nicht abschickbar');
});

test('Trichter: wirft umami.track, laesst sich die Maske trotzdem abschicken', () => {
  const w = umamiLaden(bootSeite(), () => { throw new Error('kaputt'); });
  bisKontakt(w);
  kontaktAusfuellen(w);
  absenden(w);
  assert(w.form.hidden, 'Maske bei werfendem umami.track nicht abschickbar');
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

test('Trichter: Kalender meldet ok oder fehler', () => {
  const lauf = (vorbereiten) => {
    const w = umamiLaden(bootSeite({ vorbereiten }));
    bisKontakt(w);
    kontaktAusfuellen(w);
    absenden(w);
    return w;
  };
  const kalender = (w) => w.gesendet.filter((g) => g.name.startsWith('maske-kalender')).map((g) => g.name).join(' ');
  const zeeg = (w) => w.window.document.querySelector('script[src*="zeeg"]');

  const ok = lauf((win) => { win.Zeeg = { initInlineWidget() {} }; });
  assert(kalender(ok) === 'maske-kalender-ok', 'Zeeg vorhanden: ' + kalender(ok));

  const wirft = lauf((win) => { win.Zeeg = { initInlineWidget() { throw new Error('kaputt'); } }; });
  assert(kalender(wirft) === 'maske-kalender-fehler', 'initInlineWidget wirft: ' + kalender(wirft));

  const halb = lauf((win) => { win.Zeeg = {}; });
  assert(kalender(halb) === 'maske-kalender-fehler', 'Zeeg ohne initInlineWidget: ' + kalender(halb));

  const spaet = lauf();
  spaet.window.Zeeg = { initInlineWidget() {} };
  zeeg(spaet).dispatchEvent(new spaet.window.Event('load'));
  assert(kalender(spaet) === 'maske-kalender-ok', 'Skript geladen mit Zeeg: ' + kalender(spaet));

  const leer = lauf();
  zeeg(leer).dispatchEvent(new leer.window.Event('load'));
  assert(kalender(leer) === 'maske-kalender-fehler', 'Skript geladen ohne Zeeg: ' + kalender(leer));

  const blockiert = lauf();
  zeeg(blockiert).dispatchEvent(new blockiert.window.Event('error'));
  assert(kalender(blockiert) === 'maske-kalender-fehler', 'Skript blockiert: ' + kalender(blockiert));
});

/* --- Rechenbeispiel #hochrechnung und Klartag-Leistungsblatt ------------------
 *
 * Das Leistungsblatt verweist mit "weniger als zwei Arbeitstagen" auf die
 * Maßkette in Blatt 01. Wer dort eine Annahme aendert (Fachkraefte, Stunden,
 * Verrechnungssatz) oder den Preis anfasst, merkt nicht, dass der Satz unten auf
 * der Seite still falsch wird. Review zu PR #17.
 */
const zahl = (t) => Number(t.replace(/\./g, '').replace(',', '.').match(/[\d.]+/)[0]);

function massketten() {
  const doc = new JSDOM(readFileSync(HTML_PATH, 'utf8')).window.document;
  const ketten = [...doc.querySelectorAll('#hochrechnung .hp-mass__chain')].map((ol) =>
    [...ol.querySelectorAll('li')].map((li) => ({
      wert: zahl(li.querySelector('b').textContent),
      text: li.textContent,
      ergebnis: li.classList.contains('hp-mass__result'),
    })));
  return { doc, ketten };
}

test('Rechenbeispiel: jede Maßkette geht auf', () => {
  const { ketten } = massketten();
  assert(ketten.length === 2, 'Erwartet zwei Maßketten, gefunden: ' + ketten.length);
  const [team, gf] = ketten;
  const produkt = (k) => k.filter((s) => !s.ergebnis).reduce((a, s) => a * s.wert, 1);
  const ergebnis = (k) => k.find((s) => s.ergebnis).wert;
  assert(produkt(team) === ergebnis(team),
    'Team: Produkt ' + produkt(team) + ' ≠ Ergebnis ' + ergebnis(team));
  const teamStunden = team[0].wert * team[1].wert;
  assert(team.at(-1).text.includes(teamStunden + '\u00a0Stunden'),
    'Team: Stundenangabe im Ergebnis passt nicht zu ' + teamStunden + ' h');
  // Geschaeftsfuehrung: Stunden x Wochen, umgerechnet auf Achtstundentage
  assert(produkt(gf) / 8 === ergebnis(gf),
    'Geschaeftsfuehrung: ' + produkt(gf) + ' h / 8 ≠ ' + ergebnis(gf) + ' Tage');
});

test('Klartag-Leistungsblatt: "weniger als zwei Arbeitstage" passt zum Rechenbeispiel', () => {
  const { doc, ketten } = massketten();
  const [team] = ketten;
  const preis = zahl(doc.querySelector('.hp-ksheet__meta strong').textContent);
  const satz = team[2].wert;
  const teamStundenProTag = (team[0].wert * team[1].wert) / 5;
  const tage = preis / satz / teamStundenProTag;
  const zeile = [...doc.querySelectorAll('.hp-ksheet small')].map((s) => s.textContent).join(' ');
  assert(/weniger als zwei Arbeitstagen/.test(zeile),
    'Zeile im Leistungsblatt geaendert, Test mitziehen: ' + zeile);
  assert(tage < 2,
    preis + ' € / ' + satz + ' € = ' + preis / satz + ' h, das sind ' + tage.toFixed(2)
    + ' Arbeitstage des Teams, nicht weniger als zwei');
});

/* --- SEO- und Asset-Gates ueber alle Seiten -------------------------------------
 *
 * Warum diese Tests hier stehen: Header und Footer werden nicht von Hand gepflegt,
 * sondern von `scratchpad/nav.py` erzeugt. Der Generator liegt NICHT im Repo. Ein
 * Lauf auf einem Rechner mit alter Vorlage schreibt die Bloecke in allen Seiten neu
 * und macht dabei stillschweigend rueckgaengig:
 *
 *   - die Signets als WebP (signet.png wog 132 KB bei einer Darstellung von 36x36 px,
 *     zusammen mit dem Negativ-Signet 192 KB auf jedem Seitenaufruf),
 *   - das kleine Favicon (dieselbe 132-KB-Datei diente als Favicon),
 *   - den LinkedIn-Link in der Footer-Spalte "Unternehmen".
 *
 * Im Diff sieht das aus wie ein normaler Generatorlauf. Diese Tests machen daraus
 * einen roten CI-Lauf. Wer die Vorlage bewusst aendert, zieht sie hier mit.
 *
 * Die Canonical- und Open-Graph-Pruefungen schuetzen denselben PR an Stellen, die
 * nicht generiert werden: sie waren einzeln von Hand nachgetragen und fallen bei
 * einer neuen Seite sonst lautlos weg.
 */

const SEITEN = readdirSync('site')
  .filter((f) => f.endsWith('.html'))
  .map((f) => ({ name: f, html: readFileSync('site/' + f, 'utf8') }));

// Seiten mit noindex sind bewusst nicht in der Sitemap und brauchen kein Open Graph.
const istIndexierbar = (s) => !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(s.html);

// einfuehrungsprojekt.html und ki-klartag.html sind Weiterleitungen alter URLs per
// meta-refresh. Sie tragen bewusst einen minimalen Head ohne Favicon und keinen
// Footer: sie sind nie eine Landefläche, sondern nur eine Durchreiche.
const istWeiterleitung = (s) => /http-equiv="refresh"/i.test(s.html);

// Nicht jede Seite traegt den vollen Footer. impressum.html und datenschutz.html
// haben nur footer__bottom, infotermin.html und interessent.html eine einzelne
// Spalte "Rechtliches" mit Impressum und Datenschutz. In eine Spalte dieses Namens
// gehoert kein LinkedIn-Verweis. Geprueft wird deshalb genau dort, wo er hingehoert:
// in der Spalte "Unternehmen" des vollen Footers.
const hatUnternehmensSpalte = (s) => /class="footer__h">Unternehmen</.test(s.html);

test('Alle Seiten: Signets werden als WebP eingebunden, nicht als PNG', () => {
  assert(SEITEN.length >= 14, 'Unerwartet wenige Seiten gefunden: ' + SEITEN.length);
  for (const s of SEITEN) {
    const treffer = s.html.match(/<img[^>]+src="[^"]*signet(-negative)?\.png"/g);
    assert(!treffer, s.name + ': Signet als PNG eingebunden (' + treffer + '). '
      + 'Vermutlich hat nav.py mit alter Vorlage gelaufen, siehe Kommentar oben.');
  }
});

test('Alle Seiten: Favicon zeigt auf die kleinen Dateien, nicht auf signet.png', () => {
  for (const s of SEITEN) {
    if (istWeiterleitung(s)) continue;
    const icons = [...s.html.matchAll(/<link[^>]+rel="icon"[^>]*>/g)].map((m) => m[0]);
    assert(icons.length > 0, s.name + ': kein rel="icon" gefunden');
    for (const i of icons) {
      assert(!/signet\.png/.test(i), s.name + ': signet.png als Favicon (132 KB). ' + i);
    }
    // Google empfiehlt fuer das Such-Favicon ein Vielfaches von 48px.
    assert(icons.some((i) => /favicon-96\.png/.test(i)),
      s.name + ': kein 96px-Favicon fuer die Google-Suche');
  }
});

test('Footer-Spalte "Unternehmen" verlinkt die LinkedIn-Unternehmensseite', () => {
  const mitSpalte = SEITEN.filter(hatUnternehmensSpalte);
  assert(mitSpalte.length >= 10, 'Unerwartet wenige Seiten mit vollem Footer: ' + mitSpalte.length);
  for (const s of mitSpalte) {
    assert(s.html.includes('linkedin.com/company/manibase/'),
      s.name + ': LinkedIn-Link in der Footer-Spalte "Unternehmen" fehlt');
  }
});

test('Alle Seiten: genau ein Canonical', () => {
  for (const s of SEITEN) {
    const n = (s.html.match(/rel="canonical"/g) || []).length;
    assert(n === 1, s.name + ': ' + n + ' Canonicals statt genau einem');
  }
});

test('Indexierbare Seiten: Open Graph mit Bild und twitter:card', () => {
  const idx = SEITEN.filter(istIndexierbar);
  assert(idx.length >= 10, 'Unerwartet wenige indexierbare Seiten: ' + idx.length);
  for (const s of idx) {
    for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
      assert(s.html.includes('property="' + tag + '"'), s.name + ': ' + tag + ' fehlt');
    }
    assert(s.html.includes('name="twitter:card"'), s.name + ': twitter:card fehlt');
  }
});

test('Sitemap enthaelt genau die indexierbaren Seiten', () => {
  const sitemap = readFileSync('site/sitemap.xml', 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const erwartet = SEITEN.filter(istIndexierbar)
    .map((s) => (s.name === 'index.html' ? 'https://manibase.de/' : 'https://manibase.de/' + s.name));
  for (const u of erwartet) assert(locs.includes(u), 'Sitemap: ' + u + ' fehlt');
  for (const u of locs) {
    assert(erwartet.includes(u), 'Sitemap fuehrt ' + u + ', die Seite ist aber noindex oder weg');
  }
});

test('robots.txt sperrt keinen KI-Crawler aus', () => {
  const robots = readFileSync('site/robots.txt', 'utf8');
  // Vor dem 17.08.2026 gab es keine robots.txt. Dadurch war nichts gesperrt und alle
  // KI-Crawler hatten Zugriff. Die Datei darf diesen Zustand nur halten. Ein aus dem
  // Netz kopierter Standardblock sperrt genau diese Bots.
  const bots = ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot',
    'Google-Extended', 'Bingbot', 'Googlebot'];
  for (const bot of bots) {
    const block = new RegExp('User-agent:\\s*' + bot + '\\s*\\n(?:#[^\\n]*\\n)*Disallow:\\s*/', 'i');
    assert(!block.test(robots), 'robots.txt sperrt ' + bot);
    assert(new RegExp('User-agent:\\s*' + bot, 'i').test(robots),
      'robots.txt nennt ' + bot + ' nicht mehr ausdruecklich');
  }
  assert(/^Disallow:\s*\/\s*$/m.test(robots) === false, 'robots.txt sperrt die ganze Seite');
  assert(/Sitemap:\s*https:\/\/manibase\.de\/sitemap\.xml/.test(robots), 'Sitemap-Direktive fehlt');
});

test('Startseite: Organization-Schema traegt die Entitaetsfelder', () => {
  const html = readFileSync(HTML_PATH, 'utf8');
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  assert(blocks.length >= 1, 'Kein JSON-LD auf der Startseite');
  const org = JSON.parse(blocks[0][1]);
  // Der Markenname kollidiert in Suchergebnissen mit "Manbase" und "MANBASE".
  // Dagegen hilft nur Dichte und Konsistenz der Signale.
  for (const feld of ['sameAs', 'alternateName', 'areaServed', 'knowsAbout', 'founder', 'identifier']) {
    assert(org[feld], 'Organization-Schema: ' + feld + ' fehlt');
  }
  assert(org.sameAs.some((u) => u.includes('linkedin.com/company/manibase')),
    'Organization.sameAs ohne LinkedIn-Unternehmensseite');
  assert(org.founder.length === 2, 'Organization.founder: ' + org.founder.length + ' statt 2');
  for (const p of org.founder) {
    assert(p.sameAs && p.sameAs.length, 'Person ohne sameAs: ' + p.name);
  }
});

test('ueber-uns: rel="me" nur fuer die eigene Unternehmensseite', () => {
  // rel="me" bezeichnet eine Ressource ueber den Autor des Link-Kontexts. Die Seite
  // ist nicht von einer einzelnen Person verfasst; zwei rel="me" auf zwei
  // verschiedene Personen wuerden Identitaetsdienste in die Irre fuehren.
  // Die Zuordnung der Gruender leistet Person.sameAs im JSON-LD.
  const html = readFileSync('site/ueber-uns.html', 'utf8');
  const meLinks = [...html.matchAll(/<a[^>]+rel="me"[^>]*>/g)].map((m) => m[0]);
  assert(meLinks.length === 1, 'Erwartet genau ein rel="me", gefunden: ' + meLinks.length);
  assert(meLinks[0].includes('linkedin.com/company/manibase/'),
    'Das rel="me" zeigt nicht auf die Unternehmensseite: ' + meLinks[0]);
});

test('Voller Footer: Telefonnummer als tel:-Link', () => {
  // Seit dem Folgeaudit vom 26.09.2026 Teil der Generator-Vorlage (footer__bottom).
  // Ein nav.py-Lauf mit alter Vorlage nimmt ihn sonst lautlos wieder heraus.
  for (const s of SEITEN.filter(hatUnternehmensSpalte)) {
    assert(s.html.includes('href="tel:+4915565697065"'),
      s.name + ': tel:-Link im Footer fehlt, vermutlich nav.py mit alter Vorlage');
  }
});

// SEITEN umfasst nur site/*.html; die Seiten unter site/blog/ sind reine
// Weiterleitungen (meta-refresh) und laden bewusst keine Messung.
test('Statistik: alle Inhaltsseiten binden statistik.js vor site.js ein, Weiterleitungen nicht', () => {
  let anzahl = 0;
  for (const s of SEITEN) {
    const tags = s.html.match(/<script[^>]+scripts\/statistik\.js[^>]*>/g) || [];
    if (istWeiterleitung(s)) {
      assert(tags.length === 0, s.name + ': Weiterleitung laedt statistik.js');
      continue;
    }
    assert(tags.length === 1, s.name + ': statistik.js ' + tags.length + 'x eingebunden');
    assert(/\bdefer\b/.test(tags[0]), s.name + ': statistik.js ohne defer');
    const posStatistik = s.html.indexOf('scripts/statistik.js');
    const posSite = s.html.indexOf('scripts/site.js');
    assert(posSite === -1 || posStatistik < posSite, s.name + ': statistik.js steht nach site.js');
    anzahl++;
  }
  assert(anzahl === 14, 'Erwartet 14 Inhaltsseiten mit statistik.js, gefunden ' + anzahl);
});

test('Startseite: Title und Description passen in die Suchergebnisanzeige', () => {
  const html = readFileSync(HTML_PATH, 'utf8');
  const title = /<title>([^<]*)<\/title>/.exec(html)[1];
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)[1];
  // Google schneidet Titel bei rund 600 px (ca. 60 Zeichen) und Descriptions bei rund
  // 160 Zeichen ab. Vor dem 26.09.2026 standen hier 87 und 258 Zeichen.
  assert(title.length <= 60, 'Title hat ' + title.length + ' Zeichen: ' + title);
  assert(desc.length <= 160, 'Description hat ' + desc.length + ' Zeichen');
});

test('llms.txt verweist nur auf vorhandene Seiten', () => {
  const llms = readFileSync('site/llms.txt', 'utf8');
  assert(/^# manibase$/m.test(llms), 'llms.txt ohne H1 "# manibase"');
  const urls = [...llms.matchAll(/\]\((https:\/\/manibase\.de\/[^)]*)\)/g)].map((m) => m[1]);
  assert(urls.length >= 10, 'llms.txt verlinkt nur ' + urls.length + ' Seiten');
  const namen = new Set(SEITEN.map((s) => s.name));
  for (const u of urls) {
    const datei = u.replace('https://manibase.de/', '') || 'index.html';
    assert(namen.has(datei), 'llms.txt verlinkt ' + u + ', die Datei gibt es nicht');
    const seite = SEITEN.find((s) => s.name === datei);
    assert(!istWeiterleitung(seite), 'llms.txt verlinkt die Weiterleitung ' + u);
  }
  // Preis und Handelsregister stehen auch im Schema und im Impressum. Wer sie dort
  // aendert, muss sie hier mitziehen.
  assert(llms.includes('3.900 €'), 'llms.txt: Klartag-Preis weicht ab');
  assert(llms.includes('HRB 18632'), 'llms.txt: Handelsregisternummer fehlt');
  // Betriebsgroesse wird bewusst nicht oeffentlich genannt (Geschaeftsfuehrung, 02.10.2026).
  assert(!/\d+\s*(bis|–|-)\s*\d+\s*Mitarbeitende/.test(llms), 'llms.txt nennt eine Betriebsgroesse');
});

test('Datenschutz: Reichweitenmessung mit Umami ist vollstaendig beschrieben', () => {
  const html = readFileSync('site/datenschutz.html', 'utf8');
  for (const teil of ['12. Reichweitenmessung mit Umami', 'Seitentitel', 'UTM', 'Stadt', 'täglich wechselnden',
    'Global Privacy Control', 'Do Not Track', 'spätestens 13 Monaten', 'datenschutz.html?statistik=aus',
    'datenschutz.html?statistik=an', 'Art. 21 DSGVO', 'in der Regel nach 15 Tagen', '(Abschnitt 12)',
    'Uhrzeit des Aufrufs', 'Zugriffsprotokoll', 'Namen der Zielwebsite',
    'Stand: 4. Oktober 2026']) {
    assert(html.includes(teil), 'Fehlt in datenschutz.html: ' + teil);
  }
  for (const alt of ['trichter=', 'Zählung der Formularschritte', 'nicht auf Ihrem Gerät gespeichert']) {
    assert(!html.includes(alt), 'Veralteter Text in datenschutz.html: ' + alt);
  }
  assert(!/kein(en)? Zugriff auf (Ihr |das )?Endgerät/i.test(html), 'Behauptung "kein Zugriff auf das Endgerät" steht im Text');
});

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
console.log('\nAlle Frontend-Tests bestanden.');
