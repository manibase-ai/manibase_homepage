/* manibase One-Pager — minimal JS, keine Abhängigkeiten.
   1) Scroll-Reveal (mit reduced-motion-Fallback)
   2) Hero: wechselnde Begriffe
   3) Newsletter-Anmeldung (POST an /api/newsletter.php -> Odoo, Double-Opt-In)
   4) Qualifizierungs-Maske + Kalender erst nach Einwilligung laden (DSGVO)
*/
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navigation: Aufklappmenues (Desktop) und Panel mit Akkordeon (Mobil) ---- */
  var header = document.querySelector('.site-header');
  var navTriggers = Array.prototype.slice.call(document.querySelectorAll('.nav__trigger'));

  function closeDropdowns(keepOpen) {
    navTriggers.forEach(function (trigger) {
      var item = trigger.closest('.nav__item');
      if (item === keepOpen) return;
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (panel) { panel.hidden = true; }
    });
  }

  navTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.nav__item');
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var opening = !item.classList.contains('is-open');
      closeDropdowns(item);
      item.classList.toggle('is-open', opening);
      trigger.setAttribute('aria-expanded', String(opening));
      if (panel) { panel.hidden = !opening; }
    });
  });

  var navToggle = document.querySelector('.nav__toggle');
  var navPanel = document.querySelector('.nav__mobile');

  function closeMobileNav(returnFocus) {
    if (!navToggle || !navPanel) return;
    var wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
    navPanel.classList.remove('is-open');
    navPanel.hidden = true;
    document.body.classList.remove('menu-open');
    if (wasOpen && returnFocus) { navToggle.focus(); }
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var opening = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(opening));
      navToggle.setAttribute('aria-label', opening ? 'Menü schließen' : 'Menü öffnen');
      navPanel.classList.toggle('is-open', opening);
      navPanel.hidden = !opening;
      document.body.classList.toggle('menu-open', opening);
    });
    navPanel.addEventListener('click', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('a')) { closeMobileNav(false); }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.nav__acc>button')).forEach(function (button) {
    button.addEventListener('click', function () {
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      var opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      if (panel) { panel.hidden = !opening; }
    });
  });

  document.addEventListener('click', function (ev) {
    if (header && !header.contains(ev.target)) { closeDropdowns(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    var open = document.querySelector('.nav__trigger[aria-expanded="true"]');
    closeDropdowns();
    closeMobileNav(true);
    if (open) { open.focus(); }
  });

  /* 1) Reveal --------------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* 2) Hero: wechselnde Begriffe ------------------------------------------- */
  var rotWord = document.querySelector('.rotator .rotator__word');
  if (rotWord && !reduce) {
    var rotWords = ['Angebotserstellung', 'E-Mails', 'Wissensmanagement', 'Kundensupport',
                    'Dokumentation', 'Terminplanung', 'Berichte', 'Schriftverkehr'];
    var ri = 0;
    window.setInterval(function () {
      rotWord.classList.add('is-out');
      window.setTimeout(function () {
        ri = (ri + 1) % rotWords.length;
        rotWord.textContent = rotWords[ri];
        rotWord.classList.remove('is-out');
        rotWord.classList.add('is-pre');
        void rotWord.offsetWidth; // Reflow erzwingen
        rotWord.classList.remove('is-pre');
      }, 400);
    }, 2400);
  }

  /* 2b) KI-Helfer: Wortwechsel im Seitenkopf (aus Phase 3 zurueckgeholt).
     Die vollstaendige Liste steht als .sr-only im h1, hier wechselt nur die
     sichtbare Zeile. */
  var helperRotator = document.querySelector('[data-helper-rotator]');
  if (helperRotator && !reduce) {
    var helperWords = ['Angebotserstellung', 'Berichte', 'Schriftverkehr', 'E-Mails',
                       'Wissensmanagement', 'Kundensupport', 'Dokumentation', 'Terminplanung',
                       'Baudokumentation', 'Aktenvermerke', 'Normen und Vorgaben',
                       'Auftragsvorbereitung', 'Auftragsprüfung'];
    var hi = 0;
    window.setInterval(function () {
      if (document.hidden) return;
      helperRotator.classList.add('is-changing');
      window.setTimeout(function () {
        hi = (hi + 1) % helperWords.length;
        helperRotator.textContent = helperWords[hi];
        helperRotator.classList.remove('is-changing');
      }, 200);
    }, 2600);
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* 3) Newsletter ----------------------------------------------------------- */
  var nl = document.getElementById('newsletter');
  if (nl) {
    nl.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = nl.querySelector('input[type="email"]');
      var btn = nl.querySelector('button[type="submit"]');
      var err = nl.querySelector('.newsletter__err');
      if (err) { err.hidden = true; }
      if (input) { input.removeAttribute('aria-invalid'); }
      if (!input || !EMAIL_RE.test(input.value.trim())) {
        if (input) { input.focus(); input.setAttribute('aria-invalid', 'true'); }
        if (err) { err.hidden = false; err.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse an.'; }
        return;
      }

      var endpoint = nl.getAttribute('data-endpoint') || '/api/newsletter';
      var hp = nl.querySelector('[name="website"]');
      if (btn) { btn.disabled = true; }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: input.value.trim(), website: hp ? hp.value : '' })
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        // Erfolg: Adresse steht in Liste "Newsletter" (Odoo). Die Kampagne
        // "Double Opt-in" verschickt jetzt die Bestätigungsmail.
        var row = nl.querySelector('.newsletter__row');
        var note = nl.querySelector('.newsletter__note');
        var ok = nl.querySelector('.newsletter__ok');
        if (row) { row.hidden = true; }
        if (note) { note.hidden = true; }
        if (ok) { ok.hidden = false; }
      }).catch(function () {
        if (btn) { btn.disabled = false; }
        if (err) {
          err.hidden = false;
          err.textContent = 'Das hat gerade nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an kontakt@manibase.de.';
        }
      });
    });
  }

  /* 3b) Infotermin-Formulare (Anmeldung / Interessent) ---------------------- */
  var eventForms = Array.prototype.slice.call(document.querySelectorAll('.eventform'));
  eventForms.forEach(initEventForm);

  function initEventForm(form) {
    // Vergangene/laufende Termine ausgrauen und sperren (Server lehnt sie ohnehin
    // ab). Sind alle Termine vorbei, Formular sperren und Hinweis zeigen.
    if (form.getAttribute('data-form') === 'anmeldung') {
      var now = Date.now();
      var radios = form.querySelectorAll('[name="termin"]');
      var available = 0;
      Array.prototype.forEach.call(radios, function (r) {
        var t = Date.parse(r.value);
        if (!isNaN(t) && t <= now) {
          r.disabled = true;
          var card = r.closest('.qcard');
          if (card) { card.classList.add('qcard--past'); card.setAttribute('aria-disabled', 'true'); }
        } else { available++; }
      });
      if (radios.length && available === 0) {
        var noneBtn = form.querySelector('button[type="submit"]');
        var noneErr = form.querySelector('.eventform__err');
        if (noneBtn) { noneBtn.disabled = true; }
        if (noneErr) { noneErr.hidden = false; noneErr.textContent = 'Aktuell sind keine Termine verfügbar. Bitte schreiben Sie uns an kontakt@manibase.de.'; }
      }
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = form.querySelector('.eventform__err');
      var btn = form.querySelector('button[type="submit"]');
      if (err) { err.hidden = true; }

      var kind = form.getAttribute('data-form'); // "anmeldung" | "interessent"
      var name = form.querySelector('[name="name"]');
      var firma = form.querySelector('[name="unternehmen"]');
      var mail = form.querySelector('[name="email"]');
      var consent = form.querySelector('[name="kenntnisnahme"]');
      var hp = form.querySelector('[name="website"]');

      function fail(msg, el) { if (err) { err.hidden = false; err.textContent = msg; } if (el) { el.focus(); } }

      if (!name.value.trim()) { return fail('Bitte geben Sie Ihren Namen an.', name); }
      if (!firma.value.trim()) { return fail('Bitte geben Sie Ihr Unternehmen an.', firma); }
      if (!EMAIL_RE.test(mail.value.trim())) { return fail('Bitte geben Sie eine gültige E-Mail-Adresse an.', mail); }

      var payload = {
        form: kind,
        name: name.value.trim(),
        unternehmen: firma.value.trim(),
        email: mail.value.trim(),
        kenntnisnahme: !!(consent && consent.checked),
        website: hp ? hp.value : ''
      };
      if (!payload.kenntnisnahme) { return fail('Bitte bestätigen Sie die Kenntnisnahme.', consent); }

      if (kind === 'anmeldung') {
        var termin = form.querySelector('[name="termin"]:checked');
        if (!termin) { return fail('Bitte wählen Sie einen Termin.', form.querySelector('[name="termin"]')); }
        payload.termin = termin.value;
      } else {
        var info = form.querySelector('[name="info"]');
        payload.info = info ? info.value.trim() : '';
      }

      // Fehlermeldung mit echtem mailto-Fallback (nur statische Strings -> innerHTML sicher).
      var MAILTO = '<a href="mailto:kontakt@manibase.de">kontakt@manibase.de</a>';
      function failHtml(html) { if (err) { err.hidden = false; err.innerHTML = html; } }

      if (btn) { btn.disabled = true; }
      fetch('/api/event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        // Body als JSON lesen; nur echtes {ok:true} zählt als Erfolg.
        // Schützt gegen einen fehlenden PHP-Endpunkt (nginx liefert dann die
        // Datei statisch mit 200 oder 404): res.ok allein würde sonst fälschlich
        // Erfolg anzeigen.
        return res.text().then(function (txt) {
          var data = null; try { data = JSON.parse(txt); } catch (e) {}
          return { status: res.status, data: data };
        });
      }).then(function (r) {
        if (r.data && r.data.ok === true) {
          var body = form.querySelector('.eventform__body');
          var okEl = form.querySelector('.eventform__ok');
          if (body) { body.hidden = true; }
          if (okEl) { okEl.hidden = false; if (okEl.focus) { okEl.focus(); } }
          return;
        }
        if (btn) { btn.disabled = false; }
        var code = r.data && r.data.error;
        if (r.status === 503) {
          // Kill-Switch: Formular bewusst geschlossen (Spec: eigener Text + mailto).
          failHtml('Die Anmeldung ist gerade nicht möglich. Bitte schreiben Sie uns kurz an ' + MAILTO + '.');
        } else if (r.status === 422 || r.status === 413) {
          // Validierungsfehler serverseitig: konkret sagen, was zu korrigieren ist
          // (sonst versucht der Nutzer denselben ungültigen Wert erneut).
          if (code === 'invalid_email') {
            fail('Bitte prüfen Sie Ihre E-Mail-Adresse.', mail);
          } else if (code === 'field_too_long' || r.status === 413) {
            fail('Ihre Eingabe ist zu lang. Bitte kürzen Sie Name, Unternehmen oder Nachricht.');
          } else if (code === 'consent_required') {
            fail('Bitte bestätigen Sie die Kenntnisnahme.', consent);
          } else {
            fail('Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.');
          }
        } else {
          failHtml('Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an ' + MAILTO + '.');
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; }
        failHtml('Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an ' + MAILTO + '.');
      });
    });
  }

  /* 4) Qualifizierungs-Maske ----------------------------------------------- */
  var wiz = document.getElementById('qualify');
  if (wiz) initWizard(wiz);

  function initWizard(form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll('.wstep'));
    var total = steps.length;
    var idx = 0;

    var backBtn = form.querySelector('.wizard__back');
    var nextBtn = form.querySelector('.wizard__next');
    var submitBtn = form.querySelector('.wizard__submit');
    var errBox = form.querySelector('.wizard__err');
    var barFill = form.querySelector('.wizard__bar-fill');
    var counter = form.querySelector('.wizard__count');

    function clearErr() { if (errBox) { errBox.hidden = true; errBox.textContent = ''; } }
    function showErr(msg, field) {
      if (errBox) { errBox.hidden = false; errBox.textContent = msg; }
      if (field) { field.setAttribute('aria-invalid', 'true'); }
    }

    function render(doFocus) {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      var step = steps[idx];
      var isLast = idx === total - 1;
      var isAuto = step.hasAttribute('data-auto');

      backBtn.hidden = idx === 0;
      submitBtn.hidden = !isLast;
      nextBtn.hidden = isLast;

      if (barFill) { barFill.style.width = ((idx + 1) / total * 100) + '%'; }
      if (counter) { counter.innerHTML = 'Schritt <b>' + (idx + 1) + '</b> von ' + total; }

      clearErr();
      // Fokus auf das erste Bedienelement des Schritts (a11y) — nicht beim Erst-Render,
      // sonst springt die Seite beim Laden in die Maske.
      if (doFocus) {
        var focusEl = step.querySelector('input, button');
        if (focusEl) { try { focusEl.focus({ preventScroll: true }); } catch (e) { focusEl.focus(); } }
      }
    }

    function valid(step) {
      // Multi-Select: mindestens eine Auswahl
      var checks = step.querySelectorAll('input[type="checkbox"]:not([name="consent"])');
      if (checks.length) {
        var any = Array.prototype.some.call(checks, function (c) { return c.checked; });
        if (!any) { showErr('Bitte wählen Sie mindestens einen Punkt.'); return false; }
      }
      var management = step.querySelector('input[name="teilnehmer"][value="gf"]');
      if (management && !management.checked) {
        showErr('Bitte beziehen Sie die Geschäftsführung in das Erstgespräch ein.');
        management.focus();
        return false;
      }
      return true;
    }

    function next() {
      if (!valid(steps[idx])) return;
      if (idx < total - 1) { idx++; render(true); }
    }
    function back() { if (idx > 0) { idx--; render(true); } }

    form.addEventListener('change', function (ev) {
      if (ev.target) { ev.target.removeAttribute('aria-invalid'); }
      if (ev.target && (ev.target.type === 'checkbox' || ev.target.type === 'radio')) clearErr();
    });
    form.addEventListener('input', function (ev) {
      if (ev.target) { ev.target.removeAttribute('aria-invalid'); }
      clearErr();
    });

    // Auto-Advance nur bei aktiver Auswahl (Klick/Tap oder Leertaste), nicht bei
    // Pfeiltasten-Navigation innerhalb der Radio-Gruppe.
    form.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t && t.type === 'radio' && t.checked && steps[idx].hasAttribute('data-auto')) {
        // Schritt festhalten: verhindert, dass schnelle Doppelauswahl einen Schritt überspringt.
        var from = idx;
        window.setTimeout(function () { if (idx === from) next(); }, 260);
      }
    });

    nextBtn.addEventListener('click', next);
    backBtn.addEventListener('click', back);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.querySelector('[name="name"]');
      var mail = form.querySelector('[name="email"]');
      var firma = form.querySelector('[name="firma"]');
      var consent = form.querySelector('[name="consent"]');
      if (!name.value.trim()) { showErr('Bitte geben Sie Ihren Namen an.', name); name.focus(); return; }
      if (!EMAIL_RE.test(mail.value.trim())) { showErr('Bitte geben Sie eine gültige E-Mail-Adresse an.', mail); mail.focus(); return; }
      if (firma && !firma.value.trim()) { showErr('Bitte geben Sie Ihr Unternehmen an.', firma); firma.focus(); return; }
      if (!consent.checked) { showErr('Bitte bestätigen Sie die Verarbeitung Ihrer Angaben.', consent); consent.focus(); return; }
      clearErr();
      // Antworten der Maske einsammeln und in den Kalender (Zeeg) vorbefüllen,
      // damit sie nicht verloren gehen und das Gespräch sofort beim Thema ist.
      var booking = buildBookingPrefill(form);
      form.hidden = true;
      revealCalendar(booking);
    });

    render(false);
  }

  // Wizard-Antworten -> Zeeg-Prefill (firstName/lastName/email + Freitext-Zusammenfassung).
  function buildBookingPrefill(form) {
    var val = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var fullName = val('name');
    var parts = fullName.split(/\s+/).filter(Boolean);
    var firstName = parts.shift() || fullName;
    var lastName = parts.join(' ');

    var TXT = {
      'unter-50': 'unter 50 Mitarbeitende', '50-99': '50 bis 99 Mitarbeitende',
      '100-249': '100 bis 249 Mitarbeitende', '250-500': '250 bis 500 Mitarbeitende',
      'ueber-500': 'mehr als 500 Mitarbeitende',
      'architektur-planung': 'Architektur- oder Planungsbüro',
      'ingenieur-tga': 'Ingenieur- oder TGA-Büro', bau: 'Bauunternehmen',
      gebaeudetechnik: 'Gebäudetechnik (SHK, Elektro, Lüftung)',
      'dach-ausbau': 'Dach- oder Ausbaugewerk', andere: 'anderes Unternehmen',
      'einzelne-versuche': 'einzelne Versuche',
      'lizenzen-ohne-rahmen': 'Lizenzen ohne gemeinsamen Rahmen',
      'erste-anwendungen': 'erste Anwendungen oder Piloten', 'noch-offen': 'noch offen',
      gf: 'Geschäftsführung', fuehrung: 'weitere Führungskräfte',
      it: 'interne IT oder IT-Dienstleister', fachbereich: 'Fachverantwortliche'
    };
    var label = function (v) { return TXT[v] || v; };
    var radio = function (n) { var el = form.querySelector('[name="' + n + '"]:checked'); return el ? label(el.value) : ''; };
    var checks = function (n) {
      return Array.prototype.map.call(
        form.querySelectorAll('[name="' + n + '"]:checked'), function (c) { return label(c.value); }
      ).join(', ');
    };

    var lines = [];
    if (radio('groesse')) { lines.push('Betriebsgröße: ' + radio('groesse')); }
    if (radio('art')) { lines.push('Unternehmensart: ' + radio('art')); }
    if (radio('ki-stand')) { lines.push('Stand der KI-Nutzung: ' + radio('ki-stand')); }
    if (checks('teilnehmer')) { lines.push('Teilnehmende: ' + checks('teilnehmer')); }
    if (val('firma')) { lines.push('Unternehmen: ' + val('firma')); }
    if (val('telefon')) { lines.push('Telefon: ' + val('telefon')); }

    return {
      prefill: { firstName: firstName, lastName: lastName, email: val('email') },
      summary: lines.join('\n')
    };
  }

  /* Kalender erst nach Abschluss + Einwilligung laden ----------------------- */
  function revealCalendar(booking) {
    var box = document.getElementById('booking-calendar');
    if (!box) return;
    box.hidden = false;
    box.setAttribute('tabindex', '-1');
    loadBookingCalendar(box, booking);
    box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    box.focus({ preventScroll: true });
  }

  // Einziger Wechselpunkt für das Buchungstool (Zeeg).
  // Konfiguration am #booking-calendar-Element:
  //   data-cal-url    = Zeeg-Event-Link (Pflicht)
  //   data-cal-script = Zeeg-Embed-Script-URL aus dem Zeeg-Dashboard-Snippet (Pflicht)
  //   data-cal-answer = ID der Freitextfrage im Zeeg-Event (optional, z.B. "a1"),
  //                     in die die Wizard-Zusammenfassung geschrieben wird.
  function loadBookingCalendar(box, booking) {
    var target = box.querySelector('#cal-target');
    var url = box.getAttribute('data-cal-url');
    var src = box.getAttribute('data-cal-script');
    if (!target || !url || !src || target.getAttribute('data-loaded')) { return; }
    target.setAttribute('data-loaded', '1');

    var answerId = box.getAttribute('data-cal-answer');
    function init() {
      if (!(window.Zeeg && window.Zeeg.initInlineWidget)) { return; }
      var opts = { url: url, parentElement: target };
      if (booking && booking.prefill) {
        opts.prefill = booking.prefill;
        if (answerId && booking.summary) {
          opts.prefill.answers = {};
          opts.prefill.answers[answerId] = booking.summary;
        }
      }
      window.Zeeg.initInlineWidget(opts);
    }
    if (window.Zeeg) { init(); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true; s.onload = init;
    document.body.appendChild(s);
  }
})();
