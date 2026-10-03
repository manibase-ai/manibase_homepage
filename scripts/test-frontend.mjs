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

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
console.log('\nAlle Frontend-Tests bestanden.');
