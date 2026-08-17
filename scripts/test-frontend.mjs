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

if (failed) {
  console.error('\n' + failed + ' Test(s) fehlgeschlagen.');
  process.exit(1);
}
console.log('\nAlle Frontend-Tests bestanden.');
