# Gesamtstatistik mit Umami Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alle Inhaltsseiten laden die Reichweitenmessung (Umami, selbst betrieben), die Maske meldet ihren Trichter darüber; der bisherige Transport an `/t` samt Log-Auswertung entfällt.

**Architecture:** Neues `site/scripts/statistik.js` (Abschaltung, Tracker nachladen, gepufferte Funktion `window.statistik`, Klickzählung). `site.js` behält Dedupe und Zeitpunkte der Maskenereignisse, sendet aber über `window.statistik` mit Umami-Namen. Der Server-Teil (Umami, nginx `/u.js` und `/api/send`) ist bereits live.

**Tech Stack:** Vanilla-JS (ES5-Stil), Node 20 + jsdom für Tests, GitHub Actions.

**Specs (verbindlich):** `docs/superpowers/specs/2026-10-04-statistik-umami-design.md` (§3a geht §3 vor) und für die Ereignisse `docs/superpowers/specs/2026-10-03-formular-trichter-design.md` §4.

**Arbeitsverzeichnis:** Worktree `/Users/nikolausschauersberger/Projects/web/manibase-trichter`, Branch `feat/formular-trichter`. Niemals `git checkout`, `switch`, `stash`, `reset`, `push`, keine Serververbindung. jsdom ist installiert.

**Hausregeln:** Kommentare im Stil der Datei (deutsch, in `site.js`/`statistik.js` ohne Umlaute). Keine neuen Abhängigkeiten. Commit-Abschlusszeile `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Website-Text: Sie-Ansprache, keine Gedankenstriche (— –).

---

## Dateiübersicht

| Datei | Aktion |
|---|---|
| `site/scripts/statistik.js` | neu |
| `site/scripts/site.js` | Abschnitt 4a ersetzen, Kopfkommentar |
| `scripts/test-frontend.mjs` | `test()` kann asynchron, Trichter-Block ersetzen, Seiten- und Datenschutz-Test |
| 14 Inhaltsseiten in `site/` | `<script src="scripts/statistik.js" defer>` vor `site.js` bzw. vor `</head>` |
| `site/datenschutz.html` | Abschnitt 5 kürzen, Abschnitt 11 anpassen, Abschnitt 12 neu, Stand |
| `scripts/trichter-auswertung.mjs`, `scripts/test-trichter.mjs`, `docs/deploy/nginx-trichter.conf`, `docs/deploy/logrotate-manibase-trichter` | löschen |
| `.github/workflows/verify.yml` | Schritt „Formular-Trichter (Auswertung)“ entfernen |

---

### Task 1: Asynchrone Tests und `statistik.js`

**Files:** Create `site/scripts/statistik.js`; Modify `scripts/test-frontend.mjs`

- [ ] **Step 1: `test()` für asynchrone Tests erweitern**

In `scripts/test-frontend.mjs` die Funktion `test` ersetzen durch:

```js
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
```

In `bootWizard` den Kommentar `// (Beacon, IntersectionObserver, Browser-Signale, localStorage, Zeeg).` ersetzen durch `// (statistik.js, IntersectionObserver, Browser-Signale, localStorage, Zeeg).`

- [ ] **Step 2: Test-Hilfen und Tests für `statistik.js` schreiben**

Den gesamten Block ab der Zeile `/* --- Formular-Trichter ---------------------------------------------------------` bis **ausschließlich** zur Zeile `/* --- Rechenbeispiel #hochrechnung und Klartag-Leistungsblatt ------------------` löschen und durch Folgendes ersetzen (die Trichter-Tests kommen in Task 2 dazu, an die mit `// TRICHTER-TESTS` markierte Stelle):

```js
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

// TRICHTER-TESTS
```

- [ ] **Step 3: Tests laufen lassen, sie müssen scheitern**

Run: `node scripts/test-frontend.mjs`
Expected: Die neuen `Statistik:`-Tests scheitern (`ENOENT … statistik.js` bzw. „Kein script[src="/u.js"]“). Alle älteren Tests bleiben `ok`. Die alten Trichter-Tests gibt es nicht mehr.

- [ ] **Step 4: `site/scripts/statistik.js` anlegen**

```js
/* manibase Reichweitenmessung mit Umami, selbst betrieben auf dem eigenen Server.
   Spec: docs/superpowers/specs/2026-10-04-statistik-umami-design.md
   1) Abschaltung: Global Privacy Control, Do Not Track oder ?statistik=aus
      (Vermerk im Browser-Speicher, zurueck mit ?statistik=an).
   2) Laedt /u.js (Umami-Tracker; nginx reicht an Umami durch, CSP bleibt 'self').
   3) window.statistik(name, daten): Ereignis an Umami. Vor dem Laden gepuffert,
      danach nacheinander gesendet, weil Umamis Trichter die Reihenfolge auswertet.
   4) Klicks auf Telefon, E-Mail, Kontakt (#termin) und fremde Links.
   Die Messung darf die Seite nie stoeren: Fehler werden bewusst verschluckt. */
(function () {
  'use strict';
  var WEBSITE_ID = 'c7a7cd2d-e528-4fc1-bcea-667f89052ea2';
  var KEY = 'manibase-statistik';
  var aus = false;

  /* 1) Abschaltung. Direkt auf location.search: URLSearchParams wuerde uebrige
        Parameter umschreiben ("a%20b" zu "a+b", "flag" zu "flag="). */
  var p = null;
  try {
    var treffer = /(?:^|[?&])statistik=([^&#]*)/.exec(window.location.search);
    if (treffer) { p = decodeURIComponent(treffer[1]); }
  } catch (e) { p = null; }
  if (p === 'aus') { aus = true; }
  try {
    if (p === 'aus') { window.localStorage.setItem(KEY, 'aus'); }
    if (p === 'an') { window.localStorage.removeItem(KEY); }
    if (window.localStorage.getItem(KEY) === 'aus') { aus = true; }
  } catch (e) { /* Speicher gesperrt: das Abschalten gilt dann nur fuer diesen Aufruf */ }
  if (p !== null) {
    // Vor dem Einfuegen des Trackers: er haengt sich an replaceState und
    // zaehlte die bereinigte Adresse sonst als zweiten Seitenaufruf.
    try {
      var rest = window.location.search.replace(/^\?/, '').split('&').filter(function (t) {
        return t !== 'statistik' && t.indexOf('statistik=') !== 0;
      }).join('&');
      window.history.replaceState(window.history.state, '',
        window.location.pathname + (rest ? '?' + rest : '') + window.location.hash);
    } catch (e) { /* Adresse bleibt stehen, die Messung ist davon unberuehrt */ }
  }
  var nav = window.navigator || {};
  if (nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1') { aus = true; }

  /* 3) Ereignisse */
  var puffer = [];
  var bereit = false;
  var kaputt = false;
  var kette = null;

  function senden(name, daten) {
    try {
      var r = daten === undefined ? window.umami.track(name) : window.umami.track(name, daten);
      if (r && typeof r.then === 'function') { return r.then(null, function () {}); }
    } catch (e) { /* siehe Kopf */ }
    return null;
  }
  function nacheinander(name, daten) {
    kette = kette ? kette.then(function () { return senden(name, daten); }) : senden(name, daten);
  }

  window.statistik = function (name, daten) {
    if (aus || kaputt) { return; }
    if (!bereit) { puffer.push([name, daten]); return; }
    nacheinander(name, daten);
  };

  if (aus) { return; }

  /* 2) Tracker laden */
  var s = document.createElement('script');
  s.src = '/u.js';
  s.async = true;
  s.setAttribute('data-website-id', WEBSITE_ID);
  s.setAttribute('data-domains', 'manibase.de');
  s.setAttribute('data-exclude-hash', 'true');
  s.setAttribute('data-do-not-track', 'true');
  s.onerror = function () { kaputt = true; puffer = []; };
  s.onload = function () {
    if (!window.umami || typeof window.umami.track !== 'function') { s.onerror(); return; }
    bereit = true;
    var liste = puffer;
    puffer = [];
    for (var i = 0; i < liste.length; i++) { nacheinander(liste[i][0], liste[i][1]); }
  };
  (document.head || document.documentElement).appendChild(s);

  /* 4) Klicks (Capture-Phase, damit andere Handler sie nicht verschlucken) */
  function seite() {
    var pfad = window.location.pathname;
    return pfad === '/index.html' ? '/' : pfad;
  }
  document.addEventListener('click', function (ev) {
    if (ev.button !== 0) { return; }
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) { return; }
    var href = a.getAttribute('href') || '';
    if (/^tel:/i.test(href)) { window.statistik('klick-telefon'); return; }
    if (/^mailto:/i.test(href)) { window.statistik('klick-email'); return; }
    if (/#termin$/.test(href)) { window.statistik('klick-kontakt', { seite: seite() }); return; }
    if (/^https?:$/.test(a.protocol) && a.hostname && a.hostname !== window.location.hostname) {
      window.statistik('klick-extern', { ziel: a.hostname });
    }
  }, true);
})();
```

- [ ] **Step 5: Tests laufen lassen**

Run: `node scripts/test-frontend.mjs`
Expected: alle `ok`. Die Maske meldet noch über den alten Weg, das ändert Task 2.

- [ ] **Step 6: Commit**

```bash
git add site/scripts/statistik.js scripts/test-frontend.mjs
git commit -m "Reichweitenmessung: statistik.js laedt Umami, puffert Ereignisse, zaehlt Klicks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Maske meldet über `window.statistik`

**Files:** Modify `site/scripts/site.js` (Kopfkommentar, Abschnitt 4a); Modify `scripts/test-frontend.mjs` (Stelle `// TRICHTER-TESTS`)

- [ ] **Step 1: Trichter-Tests schreiben**

Die Zeile `// TRICHTER-TESTS` ersetzen durch:

```js
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
```

Hinweis: `bootSeite` lädt auch den Umami-Tracker per `<script src="/u.js">` (jsdom lädt ihn nicht) und den Zeeg-Tracker gibt es nur nach dem Absenden; `script[src*="zeeg"]` trifft also nur das Zeeg-Skript.

- [ ] **Step 2: Tests scheitern**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL` für „Durchlauf …“, „begonnen ohne sichtbare …“, „gesehen erst bei …“, „Pruefmeldungen …“, „Kalender …“ (es wird nichts an `umami.track` gemeldet, weil `site.js` noch per Beacon sendet). „Formularwerte …“, „ohne statistik.js …“ und „Enter …“ sind schon grün.

- [ ] **Step 3: Abschnitt 4a in `site.js` ersetzen**

Den gesamten Block von `  /* 4a) Formular-Trichter ----------------------------------------------------` bis einschließlich der Zeile `  })();` direkt vor `  /* 4) Qualifizierungs-Maske` ersetzen durch:

```js
  /* 4a) Formular-Trichter ----------------------------------------------------
     Meldet, wie weit Besucher in der Qualifizierungs-Maske kommen, als Ereignis
     an die Reichweitenmessung (scripts/statistik.js, Umami). Ereignisse und
     Zeitpunkte: docs/superpowers/specs/2026-10-03-formular-trichter-design.md,
     Namen und Transport: 2026-10-04-statistik-umami-design.md.
     Jedes Ereignis geht je Seitenaufruf nur einmal raus. Umamis Trichter verlangt
     alle Vorstufen in Reihenfolge, deshalb kommt vor "begonnen" ein noch
     fehlendes "gesehen" (wer etwas eingibt, hat die Maske gesehen). */
  var trichter = (function () {
    var gemeldet = Object.create(null);
    function trichter(e, n, r) {
      var key = e + '|' + (n || '') + '|' + (r || '');
      if (gemeldet[key]) { return; }
      if (e === 'begonnen') { trichter('gesehen'); }
      gemeldet[key] = true;
      // Fehlt statistik.js (oder ist sie abgeschaltet), wird still nichts gemeldet.
      if (typeof window.statistik !== 'function') { return; }
      if (e === 'fehler') { window.statistik('maske-fehler', { schritt: n, grund: r }); }
      else if (e === 'schritt') { window.statistik('maske-schritt-' + n); }
      else if (e === 'kalender') { window.statistik('maske-kalender-' + r); }
      else { window.statistik('maske-' + e); }
    }
    return trichter;
  })();
```

- [ ] **Step 4: Kopfkommentar**

Zeile `   4a) Formular-Trichter: zaehlt Schritte der Maske ohne Cookies (Beacon an /t)` ersetzen durch `   4a) Formular-Trichter: meldet Schritte der Maske an die Reichweitenmessung (statistik.js)`.

- [ ] **Step 5: Tests grün**

Run: `node scripts/test-frontend.mjs`
Expected: alle `ok`.

- [ ] **Step 6: Commit**

```bash
python3 scripts/cache-bust.py site
git add site scripts/test-frontend.mjs
git commit -m "Trichter: Maske meldet ueber statistik.js an Umami statt an /t

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Einbindung auf allen Inhaltsseiten

**Files:** Modify 14 Seiten in `site/`; Modify `scripts/test-frontend.mjs` (Test nach `test('Voller Footer: Telefonnummer als tel:-Link'…)`)

- [ ] **Step 1: Test schreiben**

Nach dem Test „Voller Footer: Telefonnummer als tel:-Link“ einfügen:

```js
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
```

- [ ] **Step 2: Test scheitert**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL Statistik: alle Inhaltsseiten …` mit „statistik.js 0x eingebunden“.

- [ ] **Step 3: Einbinden**

Run (einmalig, setzt den Tag direkt vor `site.js`, auf `datenschutz.html` und `impressum.html` vor `</head>`):

```bash
python3 - <<'EOF'
import pathlib, re
tag = '<script src="scripts/statistik.js" defer></script>\n'
for p in sorted(pathlib.Path('site').glob('*.html')):
    s = p.read_text(encoding='utf-8')
    if 'http-equiv="refresh"' in s or 'scripts/statistik.js' in s:
        continue
    m = re.search(r'<script src="scripts/site\.js[^"]*" defer></script>', s)
    if m:
        s = s[:m.start()] + tag + s[m.start():]
    elif p.name in ('datenschutz.html', 'impressum.html'):
        assert s.count('</head>') == 1, p
        s = s.replace('</head>', tag + '</head>')
    else:
        raise SystemExit('Unerwartete Seite ohne site.js: ' + p.name)
    p.write_text(s, encoding='utf-8')
    print('eingebunden:', p.name)
EOF
python3 scripts/cache-bust.py site
```

Expected: 14 Zeilen `eingebunden: …`; danach stempelt `cache-bust.py` die neuen Verweise.

- [ ] **Step 4: Tests grün**

Run: `node scripts/test-frontend.mjs && python3 scripts/cache-bust.py --check site`
Expected: alle `ok`; `--check` Exit 0.

- [ ] **Step 5: Commit**

```bash
git add site scripts/test-frontend.mjs
git commit -m "Reichweitenmessung auf allen 14 Inhaltsseiten eingebunden

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Datenschutzerklärung

**Files:** Modify `site/datenschutz.html`; Modify `scripts/test-frontend.mjs` (alten Datenschutz-Test ersetzen)

- [ ] **Step 1: Test ersetzen**

Den Test `test('Datenschutz: Zaehlung der Formularschritte und Log-Frist sind beschrieben', …)` vollständig ersetzen durch:

```js
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
```

- [ ] **Step 2: Test scheitert**

Run: `node scripts/test-frontend.mjs`
Expected: `FAIL Datenschutz: Reichweitenmessung …` mit „Fehlt in datenschutz.html: 12. Reichweitenmessung mit Umami“.

- [ ] **Step 3: Abschnitt 5**

Den Absatz, der mit `    <p><strong>Zählung der Formularschritte.</strong>` beginnt (eine Zeile, endet mit `</p>`), ersetzen durch:

```html
    <p>Wie weit das Formular ausgefüllt wird, erfassen wir im Rahmen der Reichweitenmessung (Abschnitt 12). Ihre Eingaben sind nicht Teil dieser Messung.</p>
```

- [ ] **Step 4: Abschnitt 11**

In Abschnitt 11 `die Aufzeichnungen der Zählung der Formularschritte (Abschnitt 5) nach spätestens 13 Monaten.` ersetzen durch `die Daten der Reichweitenmessung (Abschnitt 12) nach spätestens 13 Monaten.`

- [ ] **Step 5: Abschnitt 12 einfügen**

Direkt **vor** der Zeile `    <p class="ticket__note" style="margin-top:32px">Stand: 3. Oktober 2026</p>` einfügen und das Datum dort auf `Stand: 4. Oktober 2026` setzen:

```html
    <h2>12. Reichweitenmessung mit Umami</h2>
    <p>Um zu verstehen, wie unsere Website genutzt wird und an welcher Stelle unser Anfrageformular schwer verständlich ist, setzen wir die Open-Source-Software Umami ein. Wir betreiben sie selbst auf unserem Server in Frankfurt am Main (siehe Abschnitt 3); die Daten gehen an keinen Dritten. Es werden keine Cookies gesetzt.</p>
    <p>Beim Aufruf einer Seite verarbeiten wir dabei: Datum und Uhrzeit des Aufrufs, die aufgerufene Adresse einschließlich ihrer Parameter und den Seitentitel, die Seite, von der Sie kommen, Kampagnenangaben in der Adresse (etwa UTM-Parameter oder Klick-Kennungen von Werbenetzwerken), Browser, Betriebssystem, Gerätetyp, Bildschirmgröße und Spracheinstellung sowie das aus Ihrer IP-Adresse abgeleitete Land, die Region und die Stadt. Außerdem zählen wir einzelne Ereignisse: welche Schritte des Anfrageformulars erreicht wurden, ob ein Hinweis auf eine fehlende Angabe erschien (mit Schritt und Art des Hinweises), ob das Formular abgeschickt und der Terminkalender geladen wurde, sowie Klicks auf Telefonnummer, E-Mail-Adresse, Kontaktaufnahme und Links zu anderen Websites (mit dem Namen der Zielwebsite). Ihre Eingaben im Formular werden nicht erfasst.</p>
    <p>Ihre IP-Adresse wird nur kurzzeitig verarbeitet, um daraus den Ort und eine pseudonyme Kennung zu bilden und übermäßig viele Meldungen abzuweisen; gespeichert wird sie dafür nicht, auch nicht im Zugriffsprotokoll des Servers. Die Kennung entsteht aus IP-Adresse, Browserkennung und einem täglich wechselnden Wert. Besuche desselben Browsers lassen sich dadurch nur innerhalb eines Tages einander zuordnen. Rechtsgrundlage ist unser berechtigtes Interesse an der Verbesserung unserer Website (Art. 6 Abs. 1 lit. f DSGVO). Die Daten löschen wir nach spätestens 13 Monaten.</p>
    <p>Hat Ihr Browser das Signal „Global Privacy Control“ oder „Do Not Track“ eingeschaltet, findet keine Messung statt. Sie können der Messung außerdem jederzeit widersprechen (Art. 21 DSGVO), am einfachsten über den Link <a href="datenschutz.html?statistik=aus">Messung abschalten</a>. Dazu legen wir im Speicher Ihres Browsers einen Vermerk ab; eine Bestätigung erscheint nicht. Über <a href="datenschutz.html?statistik=an">Messung wieder zulassen</a> oder durch Löschen der Websitedaten heben Sie das auf.</p>

```

- [ ] **Step 6: Tests grün, Gedankenstriche prüfen**

Run: `node scripts/test-frontend.mjs`
Expected: alle `ok`.

Run: `git diff -U0 site/datenschutz.html | grep '^+' | python3 -c "import sys;print(sum(c in '–—' for c in sys.stdin.read()))"`
Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add site/datenschutz.html scripts/test-frontend.mjs
git commit -m "Datenschutz: Abschnitt 12 Reichweitenmessung mit Umami

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Alten Transport entfernen, Gesamtprüfung

**Files:** Delete `scripts/trichter-auswertung.mjs`, `scripts/test-trichter.mjs`, `docs/deploy/nginx-trichter.conf`, `docs/deploy/logrotate-manibase-trichter`; Modify `.github/workflows/verify.yml`

- [ ] **Step 1: Entfernen**

```bash
git rm -q scripts/trichter-auswertung.mjs scripts/test-trichter.mjs docs/deploy/nginx-trichter.conf docs/deploy/logrotate-manibase-trichter
```

In `.github/workflows/verify.yml` den Kommentar „# Auswertung des Formular-Trichters …“ (zwei Zeilen) samt Schritt `- name: Formular-Trichter (Auswertung)` / `run: node scripts/test-trichter.mjs` und der folgenden Leerzeile löschen.

- [ ] **Step 2: Reste suchen**

Run: `grep -rn "trichter-auswertung\|test-trichter\|nginx-trichter\|/t?v=\|sendBeacon" site scripts .github`
Expected: keine Treffer.

- [ ] **Step 3: Gesamtprüfung**

```bash
python3 scripts/cache-bust.py --check site
node scripts/test-frontend.mjs
git diff --numstat origin/main...HEAD | awk -F'\t' '$1=="-" {print "BINÄR: "$3}'
```

Expected: `--check` Exit 0, alle Tests `ok`, keine Binärdateien.

- [ ] **Step 4: Commit**

```bash
git add -A .github scripts docs/deploy
git commit -m "Trichter: Transport an /t und Log-Auswertung entfernt (ersetzt durch Umami)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Nicht Teil dieses Plans (Hauptsitzung)

- Versionierte Server-Dateien unter `docs/deploy/umami/` aus dem tatsächlichen Serverstand, `docs/deployment/statistik-umami.md`, `docs/deployment/trichter-und-logrotate.md` auf logrotate reduzieren, `CLAUDE.md`.
- Härtungsdurchgang, PR-Text aktualisieren.

## Offene Review-Punkte

Runde 1 (D): alle Funde übernommen. Punkt 9 (Verweise in `CLAUDE.md` und Doku auf gelöschte Dateien) ist in der Hauptsitzung vor dem PR erledigt (Commit „Doku: Umami-Betrieb …“). Punkt 10 (Puffer vor Seitenaufruf, verlorene Klicks beim Seitenwechsel) hingenommen.
