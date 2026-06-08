/* manibase One-Pager — minimal JS, keine Abhängigkeiten.
   1) Scroll-Reveal (mit reduced-motion-Fallback)
   2) Hero: wechselnde Begriffe
   3) Newsletter-Anmeldung (Frontend, Double-Opt-In-Hinweis)
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
      if (!input || !EMAIL_RE.test(input.value.trim())) {
        if (input) { input.focus(); input.setAttribute('aria-invalid', 'true'); }
        return;
      }
      // Frontend-only: hier später Versand-Endpoint anbinden (Double-Opt-In).
      var row = nl.querySelector('.newsletter__row');
      var note = nl.querySelector('.newsletter__note');
      var ok = nl.querySelector('.newsletter__ok');
      if (row) { row.hidden = true; }
      if (note) { note.hidden = true; }
      if (ok) { ok.hidden = false; }
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
      // Frontend-only: Antworten stehen für späteren Versand bereit (FormData).
      // var data = new FormData(form);
      form.hidden = true;
      revealCalendar();
    });

    render(false);
  }

  /* Kalender erst nach Abschluss + Einwilligung laden ----------------------- */
  function revealCalendar() {
    var box = document.getElementById('booking-calendar');
    if (!box) return;
    box.hidden = false;
    loadBookingCalendar(box);
    box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  // Einziger Wechselpunkt für das Buchungstool (Calendly ⇄ Zeeg).
  function loadBookingCalendar(box) {
    var target = box.querySelector('#cal-target');
    var url = box.getAttribute('data-cal-url');
    if (!target || !url || target.getAttribute('data-loaded')) return;
    target.setAttribute('data-loaded', '1');

    var SRC = 'https://assets.calendly.com/assets/external/widget.js';
    function init() {
      if (window.Calendly && window.Calendly.initInlineWidget) {
        window.Calendly.initInlineWidget({ url: url, parentElement: target });
      }
    }
    if (window.Calendly) { init(); return; }
    var s = document.createElement('script');
    s.src = SRC; s.async = true; s.onload = init;
    document.body.appendChild(s);
  }
})();
