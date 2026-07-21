/**
 * Dynamischer Regressionstest fuer die Graph-Payloads und den Kalendereintrag.
 *
 * Warum zusaetzlich zu check-n8n-jsonbody.py: der statische Checker ersetzt jeden
 * n8n-Ausdruck durch "X" und beantwortet damit nur, ob das JSON-Geruest stimmt. Ob ein
 * Name wie  Max "Mustermann"  den Body zerlegt, sieht er nicht. Dieser Test fuehrt die
 * Code-Nodes wirklich aus, rendert die jsonBody-Ausdruecke und parst das Ergebnis.
 *
 * Lauf:  node scripts/test-n8n-payloads.mjs   (Exit != 0 bei Fehler)
 * Braucht luxon (in den Code-Nodes als DateTime verfuegbar, wie in n8n).
 */
import { readFileSync } from 'node:fs';
import { DateTime } from 'luxon';

const WF = 'docs/n8n/workflows';

// Werte wie beim Import; nur Form und Zeichenvorrat muessen realistisch sein.
const CONFIG = {
  ODOO_URL: 'https://example.odoo.com', ODOO_DB: 'db', ODOO_UID: '2', ODOO_APIKEY: 'k',
  SENDER: 'kontakt@manibase.de', BASE_URL: 'https://manibase.de',
  SHARED_SECRET: 's', TEAM_NOTIFY_TO: 'kontakt@manibase.de',
  MEETING_LINK_T1: 'https://us06web.zoom.us/j/1?pwd=a', MEETING_LINK_T2: 'https://us06web.zoom.us/j/2?pwd=b',
  MEETING_INFO_T1: 'Meeting-ID 1, Kenncode a', MEETING_INFO_T2: 'Meeting-ID 2, Kenncode b',
  TERMIN_T1: '2026-07-29T19:30:00+02:00', TERMIN_T2: '2026-07-31T19:30:00+02:00',
  RECORDING_URL: 'https://manibase.de/x',
};

// Der Boesewicht: bricht JSON (") und HTML (<, &), plus Backslash und ICS-Sonderzeichen.
const HOSTILE = 'Max "Mustermann" \\ <script>alert(1)</script> & Co.; Firma, GmbH';
const HOSTILE_MAIL = 'a"b\\c@example.de';

const subst = (s) => s.replace(/\{\{CONFIG:([A-Z_0-9]+)\}\}/g, (_, k) => {
  if (!(k in CONFIG)) throw new Error(`unbekannter CONFIG-Key: ${k}`);
  return CONFIG[k];
});

const load = (file) => JSON.parse(readFileSync(`${WF}/${file}`, 'utf8'));
const node = (wf, name) => {
  const n = wf.nodes.find((x) => x.name === name);
  if (!n) throw new Error(`Node fehlt: ${name}`);
  return n;
};

/** Fuehrt den jsCode eines Code-Nodes aus. `refs` bildet $('Name') nach. */
function runCode(code, { json = {}, refs = {} } = {}) {
  const $ = (name) => {
    if (!(name in refs)) throw new Error(`$('${name}') nicht gestellt`);
    return { item: { json: refs[name] } };
  };
  const fn = new Function('$json', '$', 'DateTime', 'Buffer', 'require', subst(code));
  const out = fn(json, $, DateTime, Buffer, () => ({
    randomBytes: (n) => Buffer.alloc(n, 7),
    createHash: () => ({ update() { return this; }, digest: () => 'd'.repeat(64) }),
  }));
  return out[0].json;
}

/** Rendert einen jsonBody: ersetzt {{ ... }} durch das ausgewertete Ergebnis. */
function renderBody(body, { json = {}, refs = {} } = {}) {
  const $ = (name) => ({ item: { json: refs[name] } });
  return subst(body).replace(/^=/, '').replace(/\{\{([\s\S]*?)\}\}/g, (_, expr) => {
    const v = new Function('$json', '$', 'JSON', `return (${expr});`)(json, $, JSON);
    return String(v);
  });
}

let failed = 0;
const check = (name, fn) => {
  try { fn(); console.log(`ok   ${name}`); }
  catch (e) { failed++; console.log(`FAIL ${name}: ${e.message}`); }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

// ---------------------------------------------------------------- wf-1 DOI-Mail
const wf1 = load('wf-1-anmeldung-empfang.json');
const item1 = runCode(node(wf1, 'Normalize + Token/Digest').parameters.jsCode, {
  json: { body: { name: HOSTILE, unternehmen: HOSTILE, email: HOSTILE_MAIL, termin: CONFIG.TERMIN_T1 } },
});

for (const nm of ['Graph sendMail DOI', 'Recovery: Graph sendMail DOI (neuer Token)']) {
  check(`wf-1 ${nm}: gueltiges JSON trotz Anfuehrungszeichen im Namen`, () => {
    const rendered = renderBody(node(wf1, nm).parameters.jsonBody, {
      refs: { 'Normalize + Token/Digest': item1 },
    });
    const p = JSON.parse(rendered); // wirft bei kaputtem Body
    assert(p.message.body.content.includes('&quot;Mustermann&quot;'), 'Name nicht HTML-escaped');
    assert(!p.message.body.content.includes('<script>'), 'rohes <script> im Mailtext');
    assert(p.message.toRecipients[0].emailAddress.address === item1.email_norm.toLowerCase(),
      'Empfaenger verfaelscht');
  });
}

check('wf-1: Anrede enthaelt kein rohes Markup', () => {
  assert(!item1.anrede.includes('<script>'), 'rohes <script> in der Anrede');
  assert(item1.anrede.includes('&lt;script&gt;'), 'Anrede nicht escaped');
});

// ---------------------------------------------------------------- wf-2 Einladung + ICS
const wf2 = load('wf-2-anmeldung-confirm.json');
const dedup = { reg_id: 42, termin: CONFIG.TERMIN_T1, email_norm: 'test@example.de',
  name: HOSTILE, unternehmen: HOSTILE };
const item2 = runCode(node(wf2, 'Build ICS (Europe/Berlin, VTIMEZONE, LOCATION/URL/DESCRIPTION)').parameters.jsCode,
  { refs: { 'Dedup-Entscheidung': dedup } });

check('wf-2 Einladung: gueltiges JSON trotz Anfuehrungszeichen im Namen', () => {
  const p = JSON.parse(renderBody(node(wf2, 'Graph sendMail Einladung + ICS').parameters.jsonBody, { json: item2 }));
  assert(p.message.body.content.includes('&quot;Mustermann&quot;'), 'Name nicht HTML-escaped');
  assert(!p.message.body.content.includes('<script>'), 'rohes <script> im Mailtext');
  assert(p.message.attachments[0].contentBytes === item2.ics_base64, 'Anhang verfaelscht');
});

const ics = Buffer.from(item2.ics_base64, 'base64').toString();

check('wf-2 ICS: CN ist ein quoted-string nach RFC 5545/6868', () => {
  const line = ics.replace(/\r\n /g, '').split('\r\n').find((l) => l.startsWith('ATTENDEE'));
  assert(line, 'ATTENDEE fehlt');
  const cn = /;CN=([^:]*):mailto:/.exec(line);
  assert(cn, `CN nicht gefunden in: ${line}`);
  assert(cn[1].startsWith('"') && cn[1].endsWith('"'), `CN nicht gequotet: ${cn[1]}`);
  // Im quoted-string darf kein rohes " stehen; RFC 6868 kodiert es als ^'
  assert(!cn[1].slice(1, -1).includes('"'), `rohes Anfuehrungszeichen im CN: ${cn[1]}`);
  assert(cn[1].includes("^'"), 'RFC-6868-Escaping fehlt');
  // Komma und Semikolon sind im quoted-string erlaubt und duerfen NICHT den Parameter beenden
  assert(line.split(':mailto:').length === 2, 'Parameterteil zerfaellt');
});

check('wf-2 ICS: Struktur und Zeitzone unveraendert', () => {
  const flat = ics.replace(/\r\n /g, '');
  assert(flat.includes('DTSTART;TZID=Europe/Berlin:20260729T193000'), 'DTSTART falsch');
  assert(flat.includes('METHOD:REQUEST') && flat.includes('ATTENDEE'), 'REQUEST ohne ATTENDEE');
  assert(ics.split('\r\n').every((l) => Buffer.byteLength(l, 'utf8') <= 75), 'Zeile laenger als 75 Byte');
});

// ---------------------------------------------------------------- wf-4 Interessent
const wf4 = load('wf-4-interessent.json');
const hook4 = { body: { name: HOSTILE, unternehmen: HOSTILE, email: HOSTILE_MAIL, info: HOSTILE } };
for (const nm of ['Graph interne Benachrichtigung', 'Graph Bestätigung an Interessent']) {
  check(`wf-4 ${nm}: gueltiges JSON trotz Sonderzeichen`, () => {
    JSON.parse(renderBody(node(wf4, nm).parameters.jsonBody, { refs: { 'Webhook Interessent': hook4 } }));
  });
}

console.log(failed ? `\nFEHLGESCHLAGEN (${failed})` : '\nalle Payload-Tests gruen');
process.exit(failed ? 1 : 0);
