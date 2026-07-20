# Infotermin Frontend + PHP-Proxy + Datenschutz — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zwei markenkonforme Seiten (`infotermin.html` Anmeldung, `interessent.html` QR-Erfassung) plus einen Same-Origin-PHP-Proxy (`event.php` + `event-confirm.php`), der Formulare abuse-geschützt an n8n weiterreicht, inkl. neuem Datenschutz-Abschnitt.

**Architecture:** Browser-Formular → `fetch` POST an eigenen Origin `/api/event.php` (Honeypot, Validierung, Größen-Cap, Kill-Switch, Shared-Secret) → n8n-Webhook (URL serverseitig geheim). DOI-Bestätigung über `event-confirm.php`: GET zeigt nur ein neutrales Interstitial, erst POST löst die Bestätigung aus (linkscanner-fest). Kein direkter Browser→n8n-Kontakt, daher keine CSP/CORS-Änderung nötig.

**Tech Stack:** Statisches HTML/CSS/JS (kein Build), PHP 8.4 (FPM, wie `newsletter.php`), nginx. Verifikation: `php -l`, lokaler `php -S`-Stub + `curl`, `python -m http.server` + Browser-Check, `npx impeccable detect`.

**Referenz-Spec:** [`docs/superpowers/specs/2026-07-20-veranstaltung-anmeldung-design.md`](../specs/2026-07-20-veranstaltung-anmeldung-design.md) (v3, final).

---

## File Structure

- **Create** `site/api/n8n.config.example.php` — Config-Vorlage (Webhook-URLs, Shared-Secret, `enabled`-Flag). Analog `odoo.config.example.php`.
- **Create** `site/api/event.php` — Proxy für `form=anmeldung|interessent`. Honeypot, Validierung, Größen-Cap, Kill-Switch, Weiterleitung an n8n mit `X-Manibase-Secret`.
- **Create** `site/api/event-confirm.php` — DOI: GET = neutrales Interstitial mit POST-Button; POST = Token an n8n-Confirm-Webhook, Ergebnis-Seite.
- **Create** `site/infotermin.html` — Anmeldeseite (noindex,follow), Terminwahl + Kontaktfelder.
- **Create** `site/interessent.html` — QR-Erfassung (noindex), Kontaktfelder + Freitext.
- **Modify** `site/scripts/site.js` — `initEventForm()` für beide Seiten (JSON-POST, Fehler-/Erfolgspfade).
- **Modify** `site/styles/site.css` — minimale Ergänzungen (`.eventform`-Rhythmus, `.eventpage`-Hero, `.confirm`-Seite). Reuse `.field/.qcard/.consent/.btn/.container`.
- **Modify** `site/datenschutz.html` — neuer Abschnitt „8. Veranstaltungsanmeldung und Interessentenerfassung"; bestehende 8/9/10 → 9/10/11.
- **Create** `docs/deploy/nginx-event-locations.conf` — versioniertes nginx-Snippet (zwei `location =`-Blöcke mit `limit_req` + `client_max_body_size` + PHP-FPM), das beim Provisionieren in den `manibase.de`-vhost aufgenommen werden MUSS. Grund: produktiv wird laut [`CLAUDE.md`](../../CLAUDE.md) nur die exakt konfigurierte PHP-Route ausgeführt — ohne diesen Block sind `event.php`/`event-confirm.php` nach Merge weder ausführbar noch rate-limitiert.

> **Deploy-Gating (wichtig):** PR1 ist **nicht eigenständig produktiv lauffähig**. Der Site-Deploy kopiert nur `site/`; die PHP-Endpunkte werden erst nach Aufnahme des nginx-Snippets + Anlegen von `/etc/manibase/n8n.php` (`enabled=true`) aktiv. Bis dahin greift der Kill-Switch (Frontend zeigt `mailto`-Fallback). Der Go-live ist damit technisch von der Provisionierung (Server-seitig / PR2) abhängig — im PR-Body als Merge-Hinweis vermerken.

**Payload-Kontrakt** (auch in PR2 dokumentiert):
- Anmeldung: `{form:"anmeldung", termin:"2026-07-29T19:30:00+02:00"|"2026-07-31T19:30:00+02:00", name, unternehmen, email, kenntnisnahme:true, website:""}`
- Interessent: `{form:"interessent", name, unternehmen, email, info:"", kenntnisnahme:true, website:""}`
- Termin-Allowlist zentral in `event.php`.

---

## Task 1: Config-Vorlage `n8n.config.example.php`

**Files:**
- Create: `site/api/n8n.config.example.php`

- [ ] **Step 1: Datei schreiben**

```php
<?php
/*
 * Vorlage für die n8n-Proxy-Konfiguration des Infotermin-Formulars.
 *
 * Kopieren nach /etc/manibase/n8n.php (chmod 600, chown www-data), Werte
 * eintragen. NICHT ins Repo committen (echte Werte). Alternativ Pfad via
 * Umgebungsvariable MANIBASE_N8N_CONFIG setzen; einzelne Werte via
 * MANIBASE_N8N_* (Env hat Vorrang).
 *
 * Kill-Switch: 'enabled' => false (oder fehlende Datei) => Proxy antwortet 503,
 * das Frontend zeigt den E-Mail-Fallback. So lassen sich die Formulare ohne
 * Deploy stilllegen und vor dem Go-live-Smoke-Test geschlossen halten.
 */
return [
    'enabled'            => false, // erst nach Prod-Smoke-Test auf true
    'shared_secret'      => 'CHANGE_ME_langes_zufälliges_secret',
    'webhook_anmeldung'  => 'https://n8n.employees.aicoreinfra.de/webhook/manibase-anmeldung',
    'webhook_interessent'=> 'https://n8n.employees.aicoreinfra.de/webhook/manibase-interessent',
    'webhook_confirm'    => 'https://n8n.employees.aicoreinfra.de/webhook/manibase-confirm',
];
```

- [ ] **Step 2: Syntax prüfen**

Run: `php -l site/api/n8n.config.example.php`
Expected: `No syntax errors detected`

- [ ] **Step 3: Commit**

```bash
git add site/api/n8n.config.example.php
git commit -m "feat(infotermin): n8n-Proxy Config-Vorlage"
```

---

## Task 2: Proxy `event.php` — Grundgerüst, Methode, Config, Kill-Switch

**Files:**
- Create: `site/api/event.php`
- Test (Harness, nicht committen): `php -S` Stub siehe Step 2.

- [ ] **Step 1: `event.php` schreiben (vollständig)**

```php
<?php
/*
 * manibase Infotermin-Proxy -> n8n (Same-Origin, DSGVO-/Abuse-geschützt).
 *
 * Nimmt das Anmelde- bzw. Interessenten-Formular per JSON-POST entgegen und
 * leitet es serverseitig an den passenden n8n-Webhook weiter. Die n8n-URL
 * bleibt geheim (nie im Client-JS). Missbrauchsschutz: Honeypot, Größen-Cap,
 * Feldvalidierung; zusätzlich nginx-Rate-Limit am Location-Block.
 *
 * Config: /etc/manibase/n8n.php (Vorlage: n8n.config.example.php), oder
 * MANIBASE_N8N_CONFIG / MANIBASE_N8N_* (Env hat Vorrang).
 * Kill-Switch: enabled=false oder fehlende Config => 503.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// ---- Config laden (Env vor Datei) ----
$cfg = [];
foreach ([
    'enabled'             => 'MANIBASE_N8N_ENABLED',
    'shared_secret'       => 'MANIBASE_N8N_SECRET',
    'webhook_anmeldung'   => 'MANIBASE_N8N_WEBHOOK_ANMELDUNG',
    'webhook_interessent' => 'MANIBASE_N8N_WEBHOOK_INTERESSENT',
] as $k => $env) {
    $v = getenv($env);
    if ($v !== false && $v !== '') { $cfg[$k] = $v; }
}
$configPath = getenv('MANIBASE_N8N_CONFIG') ?: '/etc/manibase/n8n.php';
if (is_file($configPath)) {
    $fileCfg = require $configPath;
    if (is_array($fileCfg)) { $cfg += $fileCfg; }
}

// Kill-Switch: fehlende Config oder enabled=false => Formular geschlossen.
$enabled = $cfg['enabled'] ?? false;
if ($enabled === 'false' || $enabled === '0') { $enabled = false; }
if (!$enabled || empty($cfg['shared_secret'])
    || empty($cfg['webhook_anmeldung']) || empty($cfg['webhook_interessent'])) {
    respond(503, ['ok' => false, 'error' => 'unavailable']);
}

// ---- Body lesen + Größen-Cap (VOR dem Lesen prüfen) ----
$len = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
if ($len > 8000) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
// Höchstens 8001 Bytes lesen (fängt chunked/fehlende Content-Length ab).
$stream = fopen('php://input', 'rb');
$raw = $stream ? stream_get_contents($stream, 8001) : false;
if ($stream) { fclose($stream); }
if ($raw === false) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}
if (strlen($raw) > 8000) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
try {
    $in = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
} catch (\JsonException $e) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}

// Honeypot: befülltes verstecktes Feld => Bot => neutral 200, nichts weiterleiten.
if (!empty($in['website'])) {
    respond(200, ['ok' => true]);
}

// ---- Validierung (strikt: nur Strings, Überlänge => 422, kein stilles Kürzen) ----
$TERMINE = ['2026-07-29T19:30:00+02:00', '2026-07-31T19:30:00+02:00'];

$form = $in['form'] ?? '';
if (!is_string($form) || ($form !== 'anmeldung' && $form !== 'interessent')) {
    respond(422, ['ok' => false, 'error' => 'invalid_form']);
}

foreach (['name', 'unternehmen', 'email'] as $req) {
    if (!isset($in[$req]) || !is_string($in[$req])) {
        respond(422, ['ok' => false, 'error' => 'missing_fields']);
    }
}
$name        = trim($in['name']);
$unternehmen = trim($in['unternehmen']);
$email       = trim($in['email']);

if ($name === '' || $unternehmen === '') {
    respond(422, ['ok' => false, 'error' => 'missing_fields']);
}
if (mb_strlen($name) > 120 || mb_strlen($unternehmen) > 120 || mb_strlen($email) > 254) {
    respond(422, ['ok' => false, 'error' => 'field_too_long']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'invalid_email']);
}
if (($in['kenntnisnahme'] ?? false) !== true) {
    respond(422, ['ok' => false, 'error' => 'consent_required']);
}

$payload = [
    'form'        => $form,
    'name'        => $name,
    'unternehmen' => $unternehmen,
    'email'       => mb_strtolower($email),
];

if ($form === 'anmeldung') {
    $termin = $in['termin'] ?? '';
    if (!is_string($termin) || !in_array($termin, $TERMINE, true)) {
        respond(422, ['ok' => false, 'error' => 'invalid_termin']);
    }
    $payload['termin'] = $termin;
    $webhook = $cfg['webhook_anmeldung'];
} else {
    $info = $in['info'] ?? '';
    if (!is_string($info)) {
        respond(422, ['ok' => false, 'error' => 'invalid_info']);
    }
    $info = trim($info);
    if (mb_strlen($info) > 2000) {
        respond(422, ['ok' => false, 'error' => 'field_too_long']);
    }
    $payload['info'] = $info;
    $webhook = $cfg['webhook_interessent'];
}

// Payload sicher serialisieren (fehlgeschlagene Kodierung => kein falscher Erfolg).
try {
    $body = json_encode($payload, JSON_THROW_ON_ERROR);
} catch (\JsonException $e) {
    error_log('event.php: payload encode failed: ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'server_error']);
}

// ---- An n8n weiterreichen (Shared-Secret-Header) ----
$ch = curl_init($webhook);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'X-Manibase-Secret: ' . $cfg['shared_secret'],
    ],
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT        => 15,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($res === false || $code < 200 || $code >= 300) {
    error_log('event.php: upstream fail (' . $code . '): ' . $err);
    respond(502, ['ok' => false, 'error' => 'upstream']);
}

respond(200, ['ok' => true]);
```

- [ ] **Step 2: Test-Harness anlegen (Scratchpad, nicht committen)**

Stub-Webhook (Port 9099) läuft die **ganze** Task 2+3 durch und wird NICHT zwischendurch beendet. Der zu testende Proxy läuft getrennt auf 9098 und wird bei Config-Wechsel gezielt per eigener PID beendet.

```bash
set -u
SP="$TMPDIR/manibase-stub"; mkdir -p "$SP"
# Stub, der Hits zählt und 200 liefert:
cat > "$SP/stub.php" <<'PHP'
<?php file_put_contents(getenv('STUB_LOG'), file_get_contents('php://input')."\n", FILE_APPEND); echo '{"ok":true}';
PHP
# Stub, der einen wählbaren Statuscode liefert (für DOI 409/410/502-Tests): ?code=409
cat > "$SP/status.php" <<'PHP'
<?php $c=(int)($_GET['code']??200); http_response_code($c); echo '{"code":'.$c.'}';
PHP
cat > "$SP/n8n.php" <<'PHP'
<?php return ['enabled'=>true,'shared_secret'=>'testsecret',
  'webhook_anmeldung'=>'http://127.0.0.1:9099/stub.php',
  'webhook_interessent'=>'http://127.0.0.1:9099/stub.php',
  'webhook_confirm'=>'http://127.0.0.1:9099/stub.php'];
PHP
: > "$SP/hits.log"
STUB_LOG="$SP/hits.log" php -S 127.0.0.1:9099 -t "$SP" >/dev/null 2>&1 &
echo $! > "$SP/stub.pid"
sleep 1
```

- [ ] **Step 3: `php -l` + Kill-Switch-Test (Config fehlt) — muss 503 liefern**

Run:
```bash
php -l site/api/event.php
MANIBASE_N8N_CONFIG=/nonexistent php -S 127.0.0.1:9098 -t site/api >/dev/null 2>&1 &
echo $! > "$SP/proxy.pid"; sleep 1
curl -s -o /dev/null -w 'killswitch->%{http_code}\n' -XPOST http://127.0.0.1:9098/event.php \
  -H 'Content-Type: application/json' -d '{"form":"anmeldung"}'
kill "$(cat "$SP/proxy.pid")" 2>/dev/null   # NUR den Proxy beenden, Stub läuft weiter
```
Expected: `No syntax errors detected` und `killswitch->503`.

- [ ] **Step 4: Positiv-/Negativmatrix gegen Stub (Proxy neu mit Stub-Config)**

Run:
```bash
MANIBASE_N8N_CONFIG="$SP/n8n.php" php -S 127.0.0.1:9098 -t site/api >/dev/null 2>&1 &
echo $! > "$SP/proxy.pid"; sleep 1
B=http://127.0.0.1:9098/event.php
: > "$SP/hits.log"
echo -n "GET->405 ";       curl -s -o /dev/null -w '%{http_code}\n' $B
echo -n "honeypot->200 ";  curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","website":"x"}'
echo -n "bademail->422 ";  curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","name":"A","unternehmen":"B","email":"nope","kenntnisnahme":true,"termin":"2026-07-29T19:30:00+02:00"}'
echo -n "badtermin->422 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","name":"A","unternehmen":"B","email":"a@b.de","kenntnisnahme":true,"termin":"2026-01-01T00:00:00+01:00"}'
echo -n "noconsent->422 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","name":"A","unternehmen":"B","email":"a@b.de","kenntnisnahme":false,"termin":"2026-07-29T19:30:00+02:00"}'
echo -n "longname->422 ";  curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d "{\"form\":\"anmeldung\",\"name\":\"$(printf 'x%.0s' {1..121})\",\"unternehmen\":\"B\",\"email\":\"a@b.de\",\"kenntnisnahme\":true,\"termin\":\"2026-07-29T19:30:00+02:00\"}"
echo -n "nonstring->422 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","name":123,"unternehmen":"B","email":"a@b.de","kenntnisnahme":true,"termin":"2026-07-29T19:30:00+02:00"}'
echo -n "oversize->413 ";  curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B --data-binary "{\"form\":\"interessent\",\"name\":\"A\",\"unternehmen\":\"B\",\"email\":\"a@b.de\",\"kenntnisnahme\":true,\"info\":\"$(printf 'y%.0s' {1..9000})\"}"
echo -n "valid->200 ";     curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"anmeldung","name":"A","unternehmen":"B","email":"A@B.de","kenntnisnahme":true,"termin":"2026-07-29T19:30:00+02:00"}'
echo -n "interessent->200 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d '{"form":"interessent","name":"A","unternehmen":"B","email":"a@b.de","kenntnisnahme":true,"info":"hallo"}'
echo "--- stub hits (soll: 2) ---"; grep -c . "$SP/hits.log"; grep -o '"email":"[^"]*"' "$SP/hits.log"
```
Expected Codes: `405, 200, 422, 422, 422, 422, 422, 413, 200, 200`. Stub-Hit-Zähler = **2** (nur die validen); `email` in den Hits ist lowercase (`a@b.de`).

- [ ] **Step 5: Proxy stoppen (Stub für Task 3 weiterlaufen lassen), committen**

```bash
kill "$(cat "$SP/proxy.pid")" 2>/dev/null   # Stub 9099 bleibt für Task 3 aktiv
git add site/api/event.php
git commit -m "feat(infotermin): event.php Proxy (Honeypot, Validierung, Kill-Switch, n8n-Forward)"
```

---

## Task 3: `event-confirm.php` — DOI GET-Interstitial + POST

**Files:**
- Create: `site/api/event-confirm.php`

- [ ] **Step 1: Datei schreiben (vollständig)**

```php
<?php
/*
 * manibase Infotermin-DOI-Bestätigung.
 *
 * Linkscanner-fest (Safe Links / Prefetch dürfen NICHT bestätigen):
 *   GET  ?t=<token>  -> zeigt nur eine neutrale Seite mit Bestätigen-Button,
 *                       ändert nichts.
 *   POST t=<token>   -> reicht den Token an den n8n-Confirm-Webhook weiter,
 *                       der ihn prüft, atomar entwertet und die Einladung
 *                       auslöst. Danach Ergebnis-Seite.
 * Config wie event.php (/etc/manibase/n8n.php). Kill-Switch => 503-Seite.
 */
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

function page(int $code, string $title, string $body): void {
    http_response_code($code);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
       . '<meta name="robots" content="noindex,nofollow">'
       . '<title>' . htmlspecialchars($title) . ' · manibase</title>'
       . '<link rel="icon" type="image/png" href="/assets/signet.png">'
       . '<link rel="stylesheet" href="/styles/tokens.css">'
       . '<link rel="stylesheet" href="/styles/site.css"></head><body>'
       . '<main id="main" class="confirm"><div class="container confirm__inner">'
       . '<span class="wordmark" aria-hidden="true"><span class="mani">mani</span>'
       . '<span class="base">base</span><span class="dot"></span></span>'
       . $body
       . '</div></main></body></html>';
    exit;
}

// Token einlesen (GET oder POST), streng validieren.
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$token  = (string) ($method === 'POST' ? ($_POST['t'] ?? '') : ($_GET['t'] ?? ''));
$token  = trim($token);
$tokenOk = $token !== '' && strlen($token) <= 200 && preg_match('/^[A-Za-z0-9._-]+$/', $token);

if (!$tokenOk) {
    page(400, 'Link ungültig',
        '<h1 class="h1">Dieser Link ist ungültig.</h1><p class="lead">Bitte prüfen Sie den '
      . 'Link aus Ihrer E-Mail oder schreiben Sie an <a href="mailto:kontakt@manibase.de">kontakt@manibase.de</a>.</p>');
}

// GET: neutrale Bestätigungsseite, KEINE Zustandsänderung (linkscanner-fest).
if ($method !== 'POST') {
    page(200, 'Anmeldung bestätigen',
        '<h1 class="h1">Anmeldung bestätigen</h1>'
      . '<p class="lead">Bitte bestätigen Sie Ihre Anmeldung zum Infotermin. Danach erhalten '
      . 'Sie den Termin mit Einwahllink und einen Kalendereintrag.</p>'
      . '<form method="post" action="/api/event-confirm.php">'
      . '<input type="hidden" name="t" value="' . htmlspecialchars($token) . '">'
      . '<button class="btn btn--accent" type="submit">Anmeldung jetzt bestätigen</button></form>');
}

// --- POST: Config laden, an n8n-Confirm weiterreichen ---
$cfg = [];
$configPath = getenv('MANIBASE_N8N_CONFIG') ?: '/etc/manibase/n8n.php';
if (is_file($configPath)) {
    $fileCfg = require $configPath;
    if (is_array($fileCfg)) { $cfg = $fileCfg; }
}
foreach (['MANIBASE_N8N_ENABLED'=>'enabled','MANIBASE_N8N_SECRET'=>'shared_secret',
          'MANIBASE_N8N_WEBHOOK_CONFIRM'=>'webhook_confirm'] as $env=>$k) {
    $v = getenv($env); if ($v !== false && $v !== '') { $cfg[$k] = $v; }
}
$enabled = $cfg['enabled'] ?? false;
if ($enabled === 'false' || $enabled === '0') { $enabled = false; }
if (!$enabled || empty($cfg['shared_secret']) || empty($cfg['webhook_confirm'])) {
    page(503, 'Gerade nicht möglich',
        '<h1 class="h1">Bestätigung gerade nicht möglich.</h1><p class="lead">Bitte versuchen '
      . 'Sie es später erneut oder schreiben Sie an <a href="mailto:kontakt@manibase.de">kontakt@manibase.de</a>.</p>');
}

$ch = curl_init($cfg['webhook_confirm']);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json',
                               'X-Manibase-Secret: ' . $cfg['shared_secret']],
    CURLOPT_POSTFIELDS     => json_encode(['token' => $token]),
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT        => 15,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// n8n antwortet 200 bei Erfolg, 409/410 bei bereits verwendet/abgelaufen.
if ($res !== false && $code >= 200 && $code < 300) {
    page(200, 'Anmeldung bestätigt',
        '<h1 class="h1">Danke, Ihre Anmeldung ist bestätigt.</h1><p class="lead">Sie erhalten '
      . 'gleich eine E-Mail mit dem Termin, dem Einwahllink und einem Kalendereintrag. Bis bald!</p>');
}
if ($code === 409 || $code === 410) {
    page(200, 'Link bereits genutzt',
        '<h1 class="h1">Dieser Link wurde bereits genutzt oder ist abgelaufen.</h1><p class="lead">'
      . 'Falls Sie keine Einladung erhalten haben, schreiben Sie an '
      . '<a href="mailto:kontakt@manibase.de">kontakt@manibase.de</a>.</p>');
}
error_log('event-confirm.php: upstream fail (' . $code . ')');
page(502, 'Gerade nicht möglich',
    '<h1 class="h1">Das hat gerade nicht geklappt.</h1><p class="lead">Bitte versuchen Sie es '
  . 'später erneut oder schreiben Sie an <a href="mailto:kontakt@manibase.de">kontakt@manibase.de</a>.</p>');
```

- [ ] **Step 2: `php -l` + GET-Interstitial ändert nichts (linkscanner-fest)**

Run (Stub 9099 aus Task 2 läuft noch):
```bash
SP="$TMPDIR/manibase-stub"
php -l site/api/event-confirm.php
MANIBASE_N8N_CONFIG="$SP/n8n.php" php -S 127.0.0.1:9097 -t site/api >/dev/null 2>&1 &
echo $! > "$SP/confirm.pid"; sleep 1
: > "$SP/hits.log"
echo -n "get-interstitial(method=post vorhanden): "
curl -s 'http://127.0.0.1:9097/event-confirm.php?t=abc123' | grep -c 'method="post"'
echo -n "get-hits(soll 0): "; grep -c . "$SP/hits.log"
```
Expected: `No syntax errors detected`, `get-interstitial…: 1`, `get-hits(soll 0): 0` — der **GET** löst KEINEN Stub-Hit aus (Safe-Links/Prefetch bestätigen nicht).

- [ ] **Step 3: POST bestätigt; ungültige/abgelaufene/wiederverwendete Token**

Run:
```bash
B=http://127.0.0.1:9097/event-confirm.php
echo -n "post-ok->200 ";    curl -s -o /dev/null -w '%{http_code}\n' -XPOST $B -d 't=abc123'
echo -n "post-hits(soll 1): "; grep -c . "$SP/hits.log"; grep -o '"token":"[^"]*"' "$SP/hits.log"
echo -n "badchar->400 ";    curl -s -o /dev/null -w '%{http_code}\n' 'http://127.0.0.1:9097/event-confirm.php?t=%3C%3Ebad'
# Confirm-Webhook auf Statuscodes umbiegen: 409/410 -> "bereits genutzt"-Seite (200), 502 -> Fehlerseite (502)
cat > "$SP/n8n409.php" <<'PHP'
<?php return ['enabled'=>true,'shared_secret'=>'testsecret','webhook_confirm'=>'http://127.0.0.1:9099/status.php?code=409'];
PHP
cat > "$SP/n8n502.php" <<'PHP'
<?php return ['enabled'=>true,'shared_secret'=>'testsecret','webhook_confirm'=>'http://127.0.0.1:9099/status.php?code=502'];
PHP
kill "$(cat "$SP/confirm.pid")" 2>/dev/null
MANIBASE_N8N_CONFIG="$SP/n8n409.php" php -S 127.0.0.1:9097 -t site/api >/dev/null 2>&1 & echo $! > "$SP/confirm.pid"; sleep 1
echo -n "used->200 ";       curl -s -o /dev/null -w '%{http_code}\n' -XPOST http://127.0.0.1:9097/event-confirm.php -d 't=abc123'
kill "$(cat "$SP/confirm.pid")" 2>/dev/null
MANIBASE_N8N_CONFIG="$SP/n8n502.php" php -S 127.0.0.1:9097 -t site/api >/dev/null 2>&1 & echo $! > "$SP/confirm.pid"; sleep 1
echo -n "upstreamfail->502 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST http://127.0.0.1:9097/event-confirm.php -d 't=abc123'
kill "$(cat "$SP/confirm.pid")" 2>/dev/null
# Kill-Switch: keine Config -> 503-Seite
MANIBASE_N8N_CONFIG=/nonexistent php -S 127.0.0.1:9097 -t site/api >/dev/null 2>&1 & echo $! > "$SP/confirm.pid"; sleep 1
echo -n "killswitch->503 "; curl -s -o /dev/null -w '%{http_code}\n' -XPOST http://127.0.0.1:9097/event-confirm.php -d 't=abc123'
```
Expected: `post-ok->200`, `post-hits(soll 1): 1` mit `{"token":"abc123"}`, `badchar->400`, `used->200`, `upstreamfail->502`, `killswitch->503`.

- [ ] **Step 4: Alle Test-Server stoppen + committen**

```bash
kill "$(cat "$SP/confirm.pid")" 2>/dev/null; kill "$(cat "$SP/stub.pid")" 2>/dev/null
git add site/api/event-confirm.php
git commit -m "feat(infotermin): event-confirm.php DOI (GET-Interstitial, POST bestätigt)"
```

---

## Task 4: JS-Handler `initEventForm()` in `site.js`

**Files:**
- Modify: `site/scripts/site.js` (neue Funktion + Aufruf; Muster wie Newsletter-Handler Zeilen 45-87)

- [ ] **Step 1: Aufruf + Funktion einfügen** (vor der schließenden `})();`-Zeile, nach `initWizard`)

Nach dem Newsletter-Block (nach Zeile 87) den Init-Aufruf ergänzen:

```javascript
  /* 3b) Infotermin-Formulare (Anmeldung / Interessent) ---------------------- */
  var eventForms = Array.prototype.slice.call(document.querySelectorAll('.eventform'));
  eventForms.forEach(initEventForm);

  function initEventForm(form) {
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
        if (res.ok) {
          var body = form.querySelector('.eventform__body');
          var ok = form.querySelector('.eventform__ok');
          if (body) { body.hidden = true; }
          if (ok) { ok.hidden = false; if (ok.focus) { ok.focus(); } }
          return;
        }
        if (btn) { btn.disabled = false; }
        if (res.status === 503) {
          // Kill-Switch: Formular bewusst geschlossen (Spec: eigener Text + mailto).
          failHtml('Die Anmeldung ist gerade nicht möglich. Bitte schreiben Sie uns kurz an ' + MAILTO + '.');
        } else {
          failHtml('Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an ' + MAILTO + '.');
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; }
        failHtml('Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an ' + MAILTO + '.');
      });
    });
  }
```

- [ ] **Step 2: `node --check` (Syntax)**

Run: `node --check site/scripts/site.js`
Expected: kein Output, Exit 0.

- [ ] **Step 3: Commit**

```bash
git add site/scripts/site.js
git commit -m "feat(infotermin): initEventForm JSON-POST-Handler"
```

---

## Task 5: Seite `infotermin.html`

**Files:**
- Create: `site/infotermin.html`

- [ ] **Step 1: Datei schreiben** (Header/Footer aus `ki-klartag.html` übernehmen; Formular im Markenlook)

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Infotermin anmelden · manibase</title>
<meta name="description" content="Melden Sie sich zum kostenlosen Online-Infotermin von manibase an.">
<meta name="robots" content="noindex, follow">
<link rel="icon" type="image/png" href="assets/signet.png">
<link rel="preload" href="fonts/Sora.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/HankenGrotesk.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.className+=' js';</script>
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/site.css">
</head>
<body>
<a class="skip-link" href="#main">Zum Inhalt springen</a>

<header class="site-header">
  <div class="container nav">
    <a class="brand" href="index.html" aria-label="manibase Startseite">
      <img class="brand__signet" src="assets/signet.png" alt="" width="34" height="34">
      <span class="wordmark" aria-hidden="true"><span class="mani">mani</span><span class="base">base</span><span class="dot"></span></span>
    </a>
    <div class="nav__cta" style="margin-left:auto">
      <a class="btn btn--secondary" href="index.html">Zur Startseite</a>
    </div>
  </div>
</header>

<main id="main">
  <section class="booking eventpage" aria-labelledby="it-h">
    <div class="container">
      <div class="booking__head">
        <p class="eventpage__flag">Nur noch 3 Projektpartner</p>
        <h1 class="h1" id="it-h">Kostenloser Online-Infotermin</h1>
        <p class="lead">Wir zeigen in einer knappen Stunde per MS Teams, wie KI-Helfer den Büro- und Doku-Kram übernehmen. Wir nehmen aktuell nur noch <b>3 Projektpartner</b> auf, die Plätze vergeben wir nach Eingang und einer kurzen Eignung.</p>
      </div>

      <form class="eventform" data-form="anmeldung" novalidate>
        <div class="eventform__body">
          <div class="eventform__hp" aria-hidden="true"><label>Website (bitte frei lassen)<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>

          <fieldset class="wstep is-active">
            <legend class="wstep__q">Welcher Termin passt Ihnen?</legend>
            <div class="qgrid">
              <label class="qcard"><input type="radio" name="termin" value="2026-07-29T19:30:00+02:00"><span class="qcard__t">Mittwoch, 29.07.</span><span class="qcard__d">19:30 Uhr, online per Teams</span></label>
              <label class="qcard"><input type="radio" name="termin" value="2026-07-31T19:30:00+02:00"><span class="qcard__t">Freitag, 31.07.</span><span class="qcard__d">19:30 Uhr, online per Teams</span></label>
            </div>
          </fieldset>

          <div class="field"><label for="it-name">Name</label><input id="it-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="it-firma">Unternehmen</label><input id="it-firma" name="unternehmen" type="text" autocomplete="organization" required></div>
          <div class="field"><label for="it-mail">E-Mail</label><input id="it-mail" name="email" type="email" inputmode="email" autocomplete="email" required></div>

          <label class="consent"><input type="checkbox" name="kenntnisnahme" required><span>Ich möchte am Infotermin teilnehmen und nehme zur Kenntnis, dass manibase mir dazu die Einladung, den Einwahllink und Erinnerungen per E-Mail schickt. Hinweise in der <a href="datenschutz.html">Datenschutzerklärung</a>.</span></label>

          <div class="eventform__actions">
            <button type="submit" class="btn btn--accent">Zum Infotermin anmelden</button>
          </div>
          <p class="eventform__err" role="alert" hidden></p>
        </div>
        <div class="eventform__ok" role="status" tabindex="-1" hidden>
          <h2 class="h2">Fast geschafft.</h2>
          <p class="lead">Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie darin Ihre Anmeldung, dann erhalten Sie Termin, Einwahllink und Kalendereintrag.</p>
        </div>
      </form>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer__top">
      <div>
        <span class="wordmark on-ink"><span class="mani">mani</span><span class="base">base</span><span class="dot" aria-hidden="true"></span></span>
        <p class="footer__claim">KI-Helfer für die Büroarbeit, die niemand machen will. Gebaut für inhabergeführte Betriebe.</p>
      </div>
      <nav class="footer__col" aria-label="Rechtliches">
        <p class="footer__h">Rechtliches</p>
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <span>© 2026 manibase UG (haftungsbeschränkt) i. G.</span>
      <span class="num">Server in Deutschland · DSGVO-konform</span>
    </div>
  </div>
</footer>

<script src="scripts/site.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add site/infotermin.html
git commit -m "feat(infotermin): Anmeldeseite infotermin.html"
```

---

## Task 6: Seite `interessent.html`

**Files:**
- Create: `site/interessent.html`

- [ ] **Step 1: Datei schreiben** (wie Task 5, ohne Terminwahl, mit Freitext, `data-form="interessent"`, `noindex,nofollow`)

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interessent · manibase</title>
<meta name="description" content="Tragen Sie sich als Interessent bei manibase ein.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="assets/signet.png">
<link rel="preload" href="fonts/Sora.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/HankenGrotesk.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.className+=' js';</script>
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/site.css">
</head>
<body>
<a class="skip-link" href="#main">Zum Inhalt springen</a>

<header class="site-header">
  <div class="container nav">
    <a class="brand" href="index.html" aria-label="manibase Startseite">
      <img class="brand__signet" src="assets/signet.png" alt="" width="34" height="34">
      <span class="wordmark" aria-hidden="true"><span class="mani">mani</span><span class="base">base</span><span class="dot"></span></span>
    </a>
  </div>
</header>

<main id="main">
  <section class="booking eventpage" aria-labelledby="ip-h">
    <div class="container">
      <div class="booking__head">
        <p class="eventpage__flag">Nur noch 3 Projektpartner</p>
        <h1 class="h1" id="ip-h">Ich habe Interesse.</h1>
        <p class="lead">Tragen Sie sich hier ein, dann kommen wir in den nächsten Tagen auf Sie zu. Wir nehmen aktuell nur noch <b>3 Projektpartner</b> auf, die Plätze vergeben wir nach Eingang und einer kurzen Eignung.</p>
      </div>

      <form class="eventform" data-form="interessent" novalidate>
        <div class="eventform__body">
          <div class="eventform__hp" aria-hidden="true"><label>Website (bitte frei lassen)<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>

          <div class="field"><label for="ip-name">Name</label><input id="ip-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="ip-firma">Unternehmen</label><input id="ip-firma" name="unternehmen" type="text" autocomplete="organization" required></div>
          <div class="field"><label for="ip-mail">E-Mail</label><input id="ip-mail" name="email" type="email" inputmode="email" autocomplete="email" required></div>
          <div class="field"><label for="ip-info">Zusätzliche Info für uns: <span class="field__opt">(optional)</span></label><textarea id="ip-info" name="info" rows="3"></textarea></div>

          <label class="consent"><input type="checkbox" name="kenntnisnahme" required><span>Ich nehme zur Kenntnis, dass manibase meine Angaben verwendet, um mit mir Kontakt zur möglichen Zusammenarbeit aufzunehmen. Hinweise in der <a href="datenschutz.html">Datenschutzerklärung</a>.</span></label>

          <div class="eventform__actions">
            <button type="submit" class="btn btn--accent">Als Interessent eintragen</button>
          </div>
          <p class="eventform__err" role="alert" hidden></p>
        </div>
        <div class="eventform__ok" role="status" tabindex="-1" hidden>
          <h2 class="h2">Danke!</h2>
          <p class="lead">Wir melden uns in den nächsten Tagen bei Ihnen.</p>
        </div>
      </form>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer__top">
      <div>
        <span class="wordmark on-ink"><span class="mani">mani</span><span class="base">base</span><span class="dot" aria-hidden="true"></span></span>
        <p class="footer__claim">KI-Helfer für die Büroarbeit, die niemand machen will. Gebaut für inhabergeführte Betriebe.</p>
      </div>
      <nav class="footer__col" aria-label="Rechtliches">
        <p class="footer__h">Rechtliches</p>
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <span>© 2026 manibase UG (haftungsbeschränkt) i. G.</span>
      <span class="num">Server in Deutschland · DSGVO-konform</span>
    </div>
  </div>
</footer>

<script src="scripts/site.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add site/interessent.html
git commit -m "feat(infotermin): Interessenten-Seite interessent.html"
```

---

## Task 7: CSS-Ergänzungen in `site.css`

**Files:**
- Modify: `site/styles/site.css` (ans Ende anhängen; reuse vorhandener Klassen, nur Neues ergänzen)

- [ ] **Step 1: Regeln anhängen**

```css
/* Infotermin-Seiten (infotermin.html / interessent.html) --------------------- */
.eventpage { min-height: 60vh; }
.eventpage__flag {
  display: inline-block; font-family: var(--font-mono, monospace);
  font-size: .78rem; letter-spacing: .04em; text-transform: uppercase;
  color: var(--color-primary, #2F3FDB); margin: 0 0 .6rem;
}
.eventform { max-width: 640px; }
.eventform__hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.eventform .field, .eventform .consent { margin-top: 1rem; }
.eventform__actions { margin-top: 1.5rem; }
.eventform__err { margin-top: 1rem; color: #b3261e; }
.eventform__ok { padding: 1rem 0; }
.eventform textarea {
  width: 100%; font: inherit; padding: .7rem .8rem;
  border: 1px solid var(--color-border, #d9d2c4); border-radius: 10px;
  background: var(--color-surface, #fff); resize: vertical; min-width: 0;
}
/* DOI-Bestätigungsseite (event-confirm.php) --------------------------------- */
.confirm { padding: clamp(3rem, 2rem + 6vw, 7rem) 0; }
.confirm__inner { max-width: 640px; }
.confirm .wordmark { display: inline-block; margin-bottom: 1.5rem; }
.confirm form { margin-top: 1.5rem; }
```

- [ ] **Step 2: Token-Namen verifizieren** (existieren `--color-cobalt`, `--color-border`, `--font-mono`, `--color-surface`?)

Run: `grep -nE '\-\-color-primary\b|\-\-color-border\b|\-\-font-mono\b|\-\-color-surface\b' site/styles/tokens.css`
Expected: Treffer für alle vier (Cobalt = `--color-primary` #2F3FDB, `--color-border` #E2DBCB, `--font-mono`, `--color-surface` #FCFAF4). Fallback-Werte in den CSS-Regeln bleiben als Sicherheit.

- [ ] **Step 3: Commit**

```bash
git add site/styles/site.css
git commit -m "feat(infotermin): CSS für Event-Formulare + Confirm-Seite"
```

---

## Task 8: Datenschutz-Abschnitt ergänzen

**Files:**
- Modify: `site/datenschutz.html` (neuer Abschnitt 8, bestehende 8/9/10 → 9/10/11)

- [ ] **Step 1: Neuen Abschnitt vor „8. Kontaktaufnahme" einfügen**

Vor der Zeile `<h2>8. Kontaktaufnahme</h2>` einfügen:

```html
    <h2>8. Veranstaltungsanmeldung und Interessentenerfassung</h2>
    <p>Über unsere Anmeldeseite zum Online-Infotermin sowie über das Interessentenformular während der Veranstaltung können Sie uns Ihren Namen, Ihr Unternehmen und Ihre E-Mail-Adresse (beim Interessentenformular zusätzlich eine optionale Freitextnachricht) übermitteln. Diese Angaben verarbeiten wir, um Ihre Teilnahme am angefragten Infotermin zu organisieren (Einladung mit Einwahllink zu Microsoft Teams, Kalendereintrag, Erinnerungen sowie eine Dankes-E-Mail mit Aufzeichnungslink) beziehungsweise um mit Ihnen als Interessent Kontakt zur möglichen Zusammenarbeit aufzunehmen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der von Ihnen angefragten Maßnahme) sowie Art. 6 Abs. 1 lit. f DSGVO (unser berechtigtes Interesse an der Organisation der Veranstaltung und der Kontaktaufnahme mit Interessenten). Werbliche Folgeangebote versenden wir nur mit Ihrer gesonderten Einwilligung.</p>
    <p>Bei der Anmeldung zum Infotermin bestätigen wir zunächst Ihre E-Mail-Adresse: Sie erhalten eine E-Mail mit einem Bestätigungslink, und erst nach Ihrer ausdrücklichen Bestätigung versenden wir Einladung und Erinnerungen. So stellen wir sicher, dass Anmeldungen tatsächlich von Ihnen stammen. Zur technischen Abwicklung nutzen wir unseren eigenen Automatisierungsdienst (n8n, auf einem Server in Deutschland betrieben), das CRM-System Odoo der Odoo S.A., Chaussée de Namur 40, 1367 Ramillies, Belgien, sowie für den E-Mail-Versand Microsoft 365 der Microsoft Ireland Operations Ltd., One Microsoft Place, Dublin, Irland. Mit diesen Auftragsverarbeitern bestehen Verträge zur Auftragsverarbeitung nach Art. 28 DSGVO; der Versand erfolgt über unser Postfach kontakt@manibase.de.</p>
    <p>Bestätigen Sie eine Infotermin-Anmeldung nicht, löschen wir die dazu gespeicherten Daten spätestens 14 Tage nach der Anmeldung. Daten bestätigter Teilnehmer löschen oder anonymisieren wir spätestens 30 Tage nach der Veranstaltung, sofern nicht auf Ihren Wunsch ein weiterer Kontakt zur Zusammenarbeit erfolgt. Angaben aus dem Interessentenformular verarbeiten wir im Rahmen unserer Kundenkontakte weiter, bis der Zweck entfällt oder Sie widersprechen.</p>
```

- [ ] **Step 2: Folge-Abschnitte umnummerieren**

`8. Kontaktaufnahme` → `9. Kontaktaufnahme`, `9. Ihre Rechte` → `10. Ihre Rechte`, `10. Speicherdauer` → `11. Speicherdauer`.

Run zur Kontrolle:
```bash
grep -n '<h2>' site/datenschutz.html
```
Expected: fortlaufend 1–11, „8. Veranstaltungsanmeldung…", danach 9/10/11 korrekt.

- [ ] **Step 3: Commit**

```bash
git add site/datenschutz.html
git commit -m "feat(infotermin): Datenschutz-Abschnitt Veranstaltungsanmeldung"
```

---

## Task 9: nginx-Location-Snippet + Deploy-Abhängigkeit (versioniert)

**Files:**
- Create: `docs/deploy/nginx-event-locations.conf`

- [ ] **Step 1: Snippet schreiben** (Muster wie die bestehende `/api/newsletter.php`-Location; exakte `location =`-Pfade, Rate-Limit, kleiner Body-Cap, PHP-FPM)

```nginx
# manibase.de — Infotermin-Endpunkte. In den server{}-Block des vhost aufnehmen.
# Die limit_req_zone gehört in den http{}-Kontext (einmalig, ggf. schon für den
# Newsletter vorhanden — dann NICHT doppelt anlegen, Namen wiederverwenden):
#   limit_req_zone $binary_remote_addr zone=manibase_forms:10m rate=5r/m;
#
# Produktiv wird NUR exakt diese beiden Pfade als PHP ausgeführt (Rest kein PHP).

location = /api/event.php {
    limit_req zone=manibase_forms burst=3 nodelay;
    client_max_body_size 8k;
    include snippets/fastcgi-php.conf;         # bzw. die im vhost genutzte PHP-FPM-Include
    fastcgi_pass unix:/run/php/php8.4-fpm.sock; # Socket wie beim Newsletter-Endpunkt
}

location = /api/event-confirm.php {
    limit_req zone=manibase_forms burst=5 nodelay;
    client_max_body_size 8k;
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
}
```

- [ ] **Step 2: Syntax grob prüfen** (Klammern/Semikolons)

Run: `grep -c 'location =' docs/deploy/nginx-event-locations.conf`
Expected: `2`. (Vollständige `nginx -t`-Prüfung erfolgt server-seitig beim Provisionieren, nicht im Repo.)

- [ ] **Step 3: Commit**

```bash
git add docs/deploy/nginx-event-locations.conf
git commit -m "feat(infotermin): nginx-Location-Snippet für event-Endpunkte (Deploy-Gate)"
```

---

## Task 10: Integrations-/Browser-Verifikation + Markencheck

**Files:** keine (nur Verifikation)

- [ ] **Step 1: HTML lokal ausliefern + Konsole prüfen**

Run: `python -m http.server 8000 --directory site` (Hintergrund), dann im Browser (mcp) `http://localhost:8000/infotermin.html` und `/interessent.html` öffnen.
Expected: keine Konsolenfehler; Layout markenkonform; Terminkarten wählbar; Formular-Validierung zeigt Fehlermeldungen bei leeren Feldern.

- [ ] **Step 2: End-to-End gegen Proxy-Stub** (Frontend + `event.php` zusammen)

Run: `event.php` via `php -S` mit Stub-Config (wie Task 2) auf Port 8000 einbinden — einfachste Variante: `php -S 127.0.0.1:8000 -t site` mit `MANIBASE_N8N_CONFIG` auf die Stub-Config; Seite über `http://127.0.0.1:8000/infotermin.html` absenden.
Expected: gültige Anmeldung → Erfolg-Block „Fast geschafft." sichtbar, Body versteckt; Stub-Log zeigt korrekten Payload (termin/name/unternehmen/email lowercase). Ungültige/fehlende Felder → Fehlermeldung, kein Request.

- [ ] **Step 3: Kill-Switch-Pfad im Frontend (503-spezifisch)**

Run: denselben Server mit `MANIBASE_N8N_CONFIG=/nonexistent` starten, gültiges Formular absenden.
Expected: `event.php` liefert 503 → Frontend zeigt **exakt** den 503-Text „Die Anmeldung ist gerade nicht möglich." mit klickbarem `mailto:kontakt@manibase.de`-Link (nicht der generische Fehlertext, kein „Fast geschafft."-Erfolgsblock). Der Unterschied zum generischen Fehler wird bewusst geprüft.

- [ ] **Step 4: Responsive-Check** 320 / 768 / 1024 (Browser-Resize)
Expected: kein horizontaler Overflow, Terminkarten und Felder umbrechen sauber.

- [ ] **Step 5: Impeccable-Markenscan**

Run: `npx impeccable detect site/infotermin.html site/interessent.html site/styles/site.css`
Expected: keine **neuen** Flags außer den bekannten/akzeptierten (`cream-palette`, container-bedingte cramped-padding). Neue echte Flags beheben.

- [ ] **Step 6: Abschluss-Commit (falls Fixes)**

```bash
git add -A && git commit -m "fix(infotermin): Verifikations-Anpassungen Frontend/Proxy"
```

---

## Self-Review-Ergebnis (gegen Spec v3)

- **Spec-Abdeckung:** Same-Origin-Proxy (Task 2), Honeypot/Validierung/Größen-Cap/Kill-Switch (Task 2), DOI-GET-Interstitial+POST (Task 3), Anmelde-/Interessentenseite mit Verknappungs-Botschaft (Task 5/6), Kenntnisnahme-Text statt „Einwilligung" (Task 5/6/8), Rechtsgrundlage lit. b/f + Fristen (Task 8), Europe/Berlin-Offset in Termin-Allowlist (Task 2/5). ICS/Graph/Reminder/Cleanup/Idempotenz-Outbox liegen bewusst in **PR2** (n8n-Seite) — hier nur der Client + Proxy-Kontrakt.
- **Kill-Switch = Go-live-Gate:** `enabled=false`/fehlende Config → 503, Frontend-Fallback (verhindert „sendet nichts, zeigt aber Erfolg"). Öffnen erst nach Prod-Smoke (PR2).
- **Keine Platzhalter:** alle PHP/JS/HTML-Blöcke vollständig; Token-/Feldnamen konsistent (`kenntnisnahme`, `unternehmen`, `termin`, `website`, `info`) zwischen Frontend, Proxy und Payload-Kontrakt.
- **Testbarkeit:** `php -l`/`node --check` (Syntax), `php -S`+curl-Matrix (Proxy), Browser (Frontend), impeccable (Marke) — angepasst an die statische Site ohne Testframework.

### Eingearbeitete Plan-Review-Findings (Codex, Runde 1)

1. **[P1] Test-Harness fehlerhaft** → Stub (9099) läuft durchgehend, nur der Proxy (9098/9097) wird per eigener PID beendet; Hit-Zähler vor/nach jedem Fall; DOI-Tests für 503/409-410/502 ergänzt (Task 2/3).
2. **[P1] Keine Prod-Route/Rate-Limit** → versioniertes nginx-Snippet als Lieferbestandteil (Task 9) + explizites Deploy-Gating (PR1 nicht eigenständig deploybar; Go-live hängt an Provisionierung + `enabled=true`).
3. **[P2] Größen-Cap nach Lesen** → `CONTENT_LENGTH`-Vorabprüfung + gedeckeltes Lesen (8001) + Übergrößen-Test + nginx `client_max_body_size` (Task 2/9).
4. **[P2] Stilles Feld-Kürzen** → Überlänge/Nicht-String → 422, `mb_strlen`, `JSON_THROW_ON_ERROR`; Grenz-/Typtests (Task 2).
5. **[P2] 503-Frontendpfad** → eigener 503-Text + `mailto`-Fallback, Browsertest prüft exakt diesen Zustand (Task 4/10).
