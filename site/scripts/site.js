/* manibase One-Pager — minimal JS, keine Abhängigkeiten.
   1) Scroll-Reveal (mit reduced-motion-Fallback)
   2) Hero: wechselnde Begriffe
   3) Newsletter-Anmeldung (POST an /api/newsletter -> Odoo, Single-Opt-In)
   4) Qualifizierungs-Maske + Kalender erst nach Einwilligung laden (DSGVO)
*/
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        // Erfolg: Adresse wurde in die Newsletter-Liste (Odoo) eingetragen (Single-Opt-In).
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
          err.textContent = 'Das hat gerade nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an kontakt@demiospace.ai.';
        }
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
    function showErr(msg) { if (errBox) { errBox.hidden = false; errBox.textContent = msg; } }

    function render(doFocus) {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      var step = steps[idx];
      var isLast = idx === total - 1;
      var isAuto = step.hasAttribute('data-auto');

      backBtn.hidden = idx === 0;
      submitBtn.hidden = !isLast;
      nextBtn.hidden = isLast || isAuto;

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
      return true;
    }

    function next() {
      if (!valid(steps[idx])) return;
      if (idx < total - 1) { idx++; render(true); }
    }
    function back() { if (idx > 0) { idx--; render(true); } }

    form.addEventListener('change', function (ev) {
      if (ev.target && (ev.target.type === 'checkbox' || ev.target.type === 'radio')) clearErr();
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
      var consent = form.querySelector('[name="consent"]');
      if (!name.value.trim()) { showErr('Bitte geben Sie Ihren Namen an.'); name.focus(); return; }
      if (!EMAIL_RE.test(mail.value.trim())) { showErr('Bitte geben Sie eine gültige E-Mail-Adresse an.'); mail.focus(); return; }
      if (!consent.checked) { showErr('Bitte bestätigen Sie die Verarbeitung Ihrer Angaben.'); consent.focus(); return; }
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
      '1-9': '1 bis 9 Mitarbeitende', '10-20': '10 bis 20 Mitarbeitende',
      '21-50': '21 bis 50 Mitarbeitende', '50+': 'mehr als 50 Mitarbeitende',
      inhaber: 'Inhaber oder Geschäftsführung', buero: 'Büro oder Verwaltung', sonstige: 'andere Rolle',
      angebote: 'Angebote & Rechnungen', email: 'E-Mails & Schriftverkehr', doku: 'Dokumentation & Berichte',
      wissen: 'Unterlagen & Wissen finden', termine: 'Termine & Planung', anderes: 'etwas anderes',
      akut: 'akut', quartal: 'dieses Quartal', info: 'erstmal informieren'
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
    if (radio('rolle')) { lines.push('Rolle: ' + radio('rolle')); }
    if (checks('thema')) { lines.push('Wo brennt es: ' + checks('thema')); }
    if (radio('dringlichkeit')) { lines.push('Dringlichkeit: ' + radio('dringlichkeit')); }
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
    loadBookingCalendar(box, booking);
    box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
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
