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

// Unicode-sicher messen/kleinschreiben, aber ohne harte mbstring-Abhängigkeit:
// fehlt die (optionale) Extension, fällt es auf byteweise Funktionen zurück,
// statt mit einem Fatal Error abzubrechen (wie newsletter.php ohne mb_*).
function slen(string $s): int {
    if (function_exists('mb_strlen')) { return mb_strlen($s); }
    // Ohne mbstring UTF-8-codepoint-genau zählen (nicht byteweise), damit z.B.
    // Umlaute nicht doppelt zählen. Bei invalidem UTF-8 Byte-Fallback.
    $n = preg_match_all('/./us', $s);
    return $n === false ? strlen($s) : $n;
}
function slower(string $s): string {
    return function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s);
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
    'webhook_confirm'     => 'MANIBASE_N8N_WEBHOOK_CONFIRM',
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
if (slen($name) > 120 || slen($unternehmen) > 120 || slen($email) > 254) {
    respond(422, ['ok' => false, 'error' => 'field_too_long']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'invalid_email']);
}
if (($in['kenntnisnahme'] ?? false) !== true) {
    respond(422, ['ok' => false, 'error' => 'consent_required']);
}

// kenntnisnahme wird mitgesendet: die n8n-Workflows revalidieren sie und
// dokumentieren sie als Einwilligungs-/Kenntnisnahme-Nachweis im CRM.
$payload = [
    'form'          => $form,
    'name'          => $name,
    'unternehmen'   => $unternehmen,
    'email'         => slower($email),
    'kenntnisnahme' => true,
];

if ($form === 'anmeldung') {
    // DOI-Kette nur annehmen, wenn auch der Bestätigungs-Webhook konfiguriert
    // ist. Sonst würde die Anmeldung zwar angenommen und die DOI-Mail versandt,
    // der spätere Bestätigungs-POST aber in event-confirm.php mit 503 enden
    // (Nutzer sieht Erfolg, kann aber nie abschließen).
    if (empty($cfg['webhook_confirm'])) {
        error_log('event.php: webhook_confirm fehlt, Anmeldung nicht abschließbar');
        respond(503, ['ok' => false, 'error' => 'unavailable']);
    }
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
    if (slen($info) > 2000) {
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
