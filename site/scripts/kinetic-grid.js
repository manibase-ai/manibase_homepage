/* Kinetic Grid - Bauplanraster auf einer Leinwand.
   Es zieht sich zum Zeiger und wirft beim Klick eine auslaufende Welle.
   Keine Punkte, nur Linien. Die Leuchtfarbe kommt aus der Variante:
   cobalt auf hell, weiss auf Cobalt, gelb auf Tiefblau.

   Einbau im Markup:
     <section class="hp-hero" data-kinetic="cobalt">…</section>
     <section class="hp-final" data-kinetic="gelb" data-kinetic-axis="x"
              data-kinetic-guard=".hp-final__action p">…</section>

   data-kinetic         cobalt | weiss | gelb
   data-kinetic-axis    y (Verlauf nach unten, Vorgabe) | x (Verlauf nach rechts)
   data-kinetic-guard   Auswahl der Textbereiche, ueber denen es nur gedaempft leuchtet
   data-kinetic-schutz  Faktor dieser Daempfung, Vorgabe 0.3

   Bei prefers-reduced-motion bleibt das statische CSS-Raster stehen. */
(function () {
  'use strict';

  var hosts = document.querySelectorAll('[data-kinetic]');
  if (!hosts.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Vorgabe der Geschaeftsfuehrung, 15. August 2026:
     weites Raster, grosser Einflussradius, so gut wie kein Verzug,
     verhaltenes Leuchten. */
  var CELL = 50, RADIUS = 240, PULL = 1, GLOW = 0.5;

  var RIPPLE_SPEED = 470, RIPPLE_LIFE = 1.55, RIPPLE_WIDTH = 74, RIPPLE_PUSH = 26;
  var BUCKETS = 5, BANDS = 10;

  var VARIANTEN = {
    cobalt: { ink: '20,34,79',    baseAlpha: 0.075, accent: '47,63,219',  glowAlpha: 0.92, halo: 1 },
    weiss:  { ink: '255,255,255', baseAlpha: 0.12,  accent: '255,255,255', glowAlpha: 0.88, halo: 0.55 },
    gelb:   { ink: '255,255,255', baseAlpha: 0.07,  accent: '242,212,20',  glowAlpha: 0.62, halo: 0.5 }
  };

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function ramp(t, a, b) { return clamp01((t - a) / (b - a)); }

  /* Senkrechter Verlauf: das Grundraster bleicht nach unten ganz aus,
     das Leuchten nur zur Haelfte, sonst bliebe unten nichts vom Zeiger. */
  function fadeBaseY(t) {
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return t < 0.58 ? 1 - 0.58 * (t / 0.58) : 0.42 * (1 - (t - 0.58) / 0.42);
  }
  function fadeGlowY(t) { return t <= 0 ? 1 : (t >= 1 ? 0.4 : 1 - 0.6 * t); }

  /* Waagerechter Verlauf fuer Baender, deren Raster rechts neben dem Text
     sitzt. Links bleibt ein Rest Leuchten: der Zeiger holt das Raster dort
     hervor, wo gar kein Grundraster gezeichnet ist. */
  function fadeBaseX(t) { return ramp(t, 0.50, 0.80); }
  function fadeGlowX(t) { return 0.45 + 0.55 * ramp(t, 0.10, 0.72); }

  function kineticGrid(host) {
    var variante = VARIANTEN[host.getAttribute('data-kinetic')] || VARIANTEN.cobalt;
    var achse = host.getAttribute('data-kinetic-axis') === 'x' ? 'x' : 'y';
    var guardSel = host.getAttribute('data-kinetic-guard');
    var guardFactor = parseFloat(host.getAttribute('data-kinetic-schutz'));
    if (!(guardFactor >= 0)) guardFactor = 0.3;
    var fadeBase = achse === 'x' ? fadeBaseX : fadeBaseY;
    var fadeGlow = achse === 'x' ? fadeGlowX : fadeGlowY;

    var canvas = document.createElement('canvas');
    if (!canvas.getContext) return;
    canvas.className = 'kg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.firstChild);
    host.classList.add('kg-host');

    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
    var PX = null, PY = null, PI = null, guards = [];
    var px = 0, py = 0, tx = 0, ty = 0;
    var strength = 0, target = 0, running = false, last = 0, seen = false;
    var ripples = [];

    function layout() {
      var r = host.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) { requestAnimationFrame(layout); return; }
      w = Math.round(r.width);
      h = Math.round(r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Textschutz: ueber Fliesstext leuchtet es nur gedaempft, sonst
         schneiden die Linien durch die Zeilen. */
      guards.length = 0;
      if (guardSel) {
        Array.prototype.forEach.call(host.querySelectorAll(guardSel), function (el) {
          var b = el.getBoundingClientRect();
          if (b.width < 4 || b.height < 4) return;
          guards.push([b.left - r.left - 6, b.top - r.top - 4, b.right - r.left + 6, b.bottom - r.top + 4]);
        });
      }

      cols = Math.ceil(w / CELL) + 3;
      rows = Math.ceil(h / CELL) + 3;
      var n = cols * rows;
      PX = new Float32Array(n); PY = new Float32Array(n); PI = new Float32Array(n);
      render();
    }

    function render() {
      var ox = -CELL, oy = -CELL, now = performance.now(), i = 0, c, r, k;

      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++, i++) {
          var bx = ox + c * CELL, by = oy + r * CELL, x = bx, y = by, inten = 0;

          if (strength > 0.002) {
            var dx = bx - px, dy = by - py, d = Math.sqrt(dx * dx + dy * dy);
            if (d < RADIUS) {
              var f = 1 - d / RADIUS, ff = f * f * strength;
              /* Versatz faellt quadratisch ab, das Leuchten traegt weiter */
              inten += Math.pow(f, 1.3) * strength;
              if (d > 0.001) { x -= dx / d * ff * PULL; y -= dy / d * ff * PULL; }
            }
          }

          for (k = 0; k < ripples.length; k++) {
            var rp = ripples[k], age = (now - rp.t) / 1000;
            var rad = age * RIPPLE_SPEED;
            var rx = bx - rp.x, ry = by - rp.y, dd = Math.sqrt(rx * rx + ry * ry);
            var off = dd - rad;
            if (off > 3 * RIPPLE_WIDTH || off < -3 * RIPPLE_WIDTH) continue;
            var g = Math.exp(-(off * off) / (2 * RIPPLE_WIDTH * RIPPLE_WIDTH)) * (1 - age / RIPPLE_LIFE);
            if (g <= 0) continue;
            inten += g * 1.15;
            if (dd > 0.001) { x += rx / dd * g * RIPPLE_PUSH; y += ry / dd * g * RIPPLE_PUSH; }
          }

          PX[i] = x; PY[i] = y; PI[i] = inten;
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      var bands = new Array(BANDS), glow = new Array(BUCKETS), b;
      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          var a1 = r * cols + c;
          if (c < cols - 1) seg(bands, glow, a1, a1 + 1);
          if (r < rows - 1) seg(bands, glow, a1, a1 + cols);
        }
      }

      /* 1. Grundraster, ausgebleicht wie ein altes Planblatt */
      ctx.lineWidth = 1;
      for (b = 0; b < BANDS; b++) {
        if (!bands[b]) continue;
        var ba = variante.baseAlpha * fadeBase((b + 0.5) / BANDS);
        if (ba < 0.002) continue;
        ctx.strokeStyle = 'rgba(' + variante.ink + ',' + ba.toFixed(4) + ')';
        ctx.stroke(bands[b]);
      }

      /* 2. Leuchten dort, wo Zeiger oder Welle wirken */
      for (b = 0; b < BUCKETS; b++) {
        if (!glow[b]) continue;
        var a = (b + 1) / BUCKETS;
        ctx.strokeStyle = 'rgba(' + variante.accent + ',' + (a * variante.glowAlpha).toFixed(3) + ')';
        ctx.lineWidth = 1 + a * 0.75;
        ctx.shadowColor = 'rgba(' + variante.accent + ',' + (a * 0.6 * GLOW * variante.halo).toFixed(3) + ')';
        ctx.shadowBlur = 13 * a * GLOW * variante.halo;
        ctx.stroke(glow[b]);
      }
      ctx.shadowBlur = 0;

      function seg(bandPaths, glowPaths, i1, i2) {
        var mx = (PX[i1] + PX[i2]) * 0.5, my = (PY[i1] + PY[i2]) * 0.5;
        var t = achse === 'y' ? my / h : mx / w;
        var bi = t < 0 ? 0 : (t >= 1 ? BANDS - 1 : Math.floor(t * BANDS));
        var bp = bandPaths[bi] || (bandPaths[bi] = new Path2D());
        bp.moveTo(PX[i1], PY[i1]); bp.lineTo(PX[i2], PY[i2]);

        var a = (PI[i1] + PI[i2]) * 0.5 * fadeGlow(t);
        for (var q = 0; q < guards.length; q++) {
          var G = guards[q];
          if (mx > G[0] && mx < G[2] && my > G[1] && my < G[3]) { a *= guardFactor; break; }
        }
        if (a < 0.035) return;
        if (a > 1) a = 1;
        var gi = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
        var gp = glowPaths[gi] || (glowPaths[gi] = new Path2D());
        gp.moveTo(PX[i1], PY[i1]); gp.lineTo(PX[i2], PY[i2]);
      }
    }

    function frame(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;
      px += (tx - px) * Math.min(1, dt * 11);
      py += (ty - py) * Math.min(1, dt * 11);
      strength += (target - strength) * Math.min(1, dt * 6.5);

      var now = performance.now();
      for (var i = ripples.length - 1; i >= 0; i--) {
        if ((now - ripples[i].t) / 1000 > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      render();

      /* Ist nichts mehr in Bewegung, haelt die Schleife an. */
      if (strength < 0.003 && target === 0 && !ripples.length) {
        running = false; last = 0; strength = 0; render();
        return;
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true; last = 0;
      requestAnimationFrame(frame);
    }

    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!seen) { px = tx; py = ty; seen = true; }
      target = 1; start();
    }, { passive: true });

    host.addEventListener('pointerleave', function () { target = 0; });

    host.addEventListener('pointerdown', function (e) {
      var r = host.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (!seen) { px = tx = x; py = ty = y; seen = true; }
      ripples.push({ x: x, y: y, t: performance.now() });
      if (e.pointerType !== 'mouse') {
        tx = x; ty = y; target = 1;
        window.setTimeout(function () { target = 0; }, 500);
      }
      start();
    }, { passive: true });

    if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    layout();
  }

  Array.prototype.forEach.call(hosts, kineticGrid);
})();
