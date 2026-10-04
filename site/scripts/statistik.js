/* manibase Reichweitenmessung mit Umami, selbst betrieben auf dem eigenen Server.
   Spec: docs/superpowers/specs/2026-10-04-statistik-umami-design.md
   1) Abschaltung: Global Privacy Control, Do Not Track oder ?statistik=aus
      (Vermerk im Browser-Speicher, zurueck mit ?statistik=an).
   2) Laedt /u.js (Umami-Tracker; nginx reicht an Umami durch, CSP bleibt 'self').
   3) window.statistik(name, daten): Ereignis an Umami. Vor dem Laden gepuffert,
      danach nacheinander gesendet, weil Umamis Trichter die Reihenfolge auswertet.
      Klicks (klick-*) sind keine Trichterstufen und gehen direkt raus, damit ein
      Klick mit Seitenwechsel nicht hinter einem haengenden Aufruf verloren geht.
      Vor dem Senden vereinheitlicht window.manibaseVorSenden (data-before-send des
      Trackers) /index.html zu /, sonst zaehlt die Startseite doppelt.
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
  // sofort: ohne Kette senden (Klicks). Vor dem Laden wird beides gepuffert.
  function melden(name, daten, sofort) {
    if (aus || kaputt) { return; }
    if (!bereit) { puffer.push([name, daten, sofort]); return; }
    if (sofort) { senden(name, daten); } else { nacheinander(name, daten); }
  }

  window.statistik = function (name, daten) { melden(name, daten, false); };

  /* Der Tracker ruft window[data-before-send](typ, nutzlast) und sendet, was zurueckkommt. */
  function einheitlich(adresse) {
    if (typeof adresse !== 'string') { return adresse; }
    return adresse.replace(/^((?:https?:\/\/(?:www\.)?manibase\.de)?)\/index\.html(?=$|[?#])/i, '$1/');
  }
  window.manibaseVorSenden = function (typ, nutzlast) {
    try {
      if (nutzlast && typeof nutzlast === 'object') {
        if ('url' in nutzlast) { nutzlast.url = einheitlich(nutzlast.url); }
        if ('referrer' in nutzlast) { nutzlast.referrer = einheitlich(nutzlast.referrer); }
      }
    } catch (e) { /* Nutzlast unveraendert weitergeben */ }
    return nutzlast;
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
  s.setAttribute('data-before-send', 'manibaseVorSenden');
  s.onerror = function () { kaputt = true; puffer = []; };
  s.onload = function () {
    if (!window.umami || typeof window.umami.track !== 'function') { s.onerror(); return; }
    bereit = true;
    var liste = puffer;
    puffer = [];
    for (var i = 0; i < liste.length; i++) { melden(liste[i][0], liste[i][1], liste[i][2]); }
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
    if (/^tel:/i.test(href)) { melden('klick-telefon', undefined, true); return; }
    if (/^mailto:/i.test(href)) { melden('klick-email', undefined, true); return; }
    if (/#termin$/.test(href)) { melden('klick-kontakt', { seite: seite() }, true); return; }
    if (/^https?:$/.test(a.protocol) && a.hostname && a.hostname !== window.location.hostname) {
      melden('klick-extern', { ziel: a.hostname }, true);
    }
  }, true);
})();
