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
foreach (['MANIBASE_N8N_ENABLED' => 'enabled', 'MANIBASE_N8N_SECRET' => 'shared_secret',
          'MANIBASE_N8N_WEBHOOK_CONFIRM' => 'webhook_confirm'] as $env => $k) {
    $v = getenv($env);
    if ($v !== false && $v !== '') { $cfg[$k] = $v; }
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
