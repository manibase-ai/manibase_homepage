<?php
/*
 * manibase Newsletter-Proxy -> Odoo (JSON-RPC).
 *
 * Nimmt {"email": "..."} per POST entgegen und trägt die Adresse in die
 * Odoo-Mailing-Liste "Newsletter" (id 1) ein.
 *
 * Double-Opt-In läuft vollständig in Odoo, nicht hier: Die Kampagne
 * "Double Opt-in" (App "Marketing Automation") schickt neuen Kontakten dieser
 * Liste die Bestätigungsmail und verschiebt Klicker in die Liste
 * "Confirmed contacts". Nur diese Liste gilt als einwilligend, Newsletter-
 * Versand darf ausschließlich an sie gehen. "Newsletter" ist die Warteschlange
 * mit unbestätigten Adressen.
 *
 * Den Versand der Bestätigungsmail stößt dieser Proxy unten selbst an, damit
 * sie in Sekunden statt über die Cron-Kette ankommt (siehe Kommentar dort).
 *
 * Zugangsdaten liegen AUSSERHALB des Webroots und NICHT im Repo:
 *   /etc/manibase/odoo.php   (aus site/api/odoo.config.example.php erzeugen,
 *                             Werte eintragen, chmod 600, chown www-data)
 * Alternativ Pfad via Umgebungsvariable MANIBASE_ODOO_CONFIG setzen.
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

// Konfiguration: zuerst Umgebungsvariablen (MANIBASE_ODOO_*), fehlende Werte
// dann aus /etc/manibase/odoo.php (Env hat Vorrang). Bei PHP-FPM müssen Env-Vars
// im Pool gesetzt werden (env[MANIBASE_ODOO_API_KEY] = ...), da FPM die
// System-Umgebung standardmäßig nicht durchreicht.
$cfg = [];
foreach ([
    'url'      => 'MANIBASE_ODOO_URL',
    'db'       => 'MANIBASE_ODOO_DB',
    'username' => 'MANIBASE_ODOO_USERNAME',
    'api_key'  => 'MANIBASE_ODOO_API_KEY',
    'list_id'  => 'MANIBASE_ODOO_LIST_ID',
    'campaign_id' => 'MANIBASE_ODOO_CAMPAIGN_ID', // optional: DOI-Kampagne (id), für Sofortversand
] as $k => $envName) {
    $v = getenv($envName);
    if ($v !== false && $v !== '') { $cfg[$k] = $v; }
}
// Datei immer laden (Env hat Vorrang via +=), sonst ginge z.B. campaign_id aus
// der Datei verloren, wenn die 5 Pflicht-Keys bereits aus der Env kommen.
$configPath = getenv('MANIBASE_ODOO_CONFIG') ?: '/etc/manibase/odoo.php';
if (is_file($configPath)) {
    $fileCfg = require $configPath;
    if (is_array($fileCfg)) { $cfg += $fileCfg; } // vorhandene (Env-)Keys bleiben
}
foreach (['url', 'db', 'username', 'api_key', 'list_id'] as $k) {
    if (empty($cfg[$k])) {
        error_log('newsletter: config key missing: ' . $k);
        respond(500, ['ok' => false, 'error' => 'server_misconfigured']);
    }
}

$raw = file_get_contents('php://input');
$in = json_decode($raw !== false ? $raw : '', true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}

// Honeypot: ist das versteckte Feld befüllt, ist es ein Bot -> still "ok".
if (!empty($in['website'])) {
    respond(200, ['ok' => true]);
}

$email = trim((string) ($in['email'] ?? ''));
if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'invalid_email']);
}

/* -------- Odoo JSON-RPC -------- */
function odoo_call(string $url, string $service, string $method, array $args) {
    $payload = json_encode([
        'jsonrpc' => '2.0',
        'method'  => 'call',
        'params'  => ['service' => $service, 'method' => $method, 'args' => $args],
        'id'      => 1,
    ]);
    $ch = curl_init(rtrim($url, '/') . '/jsonrpc');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT        => 15,
    ]);
    $res = curl_exec($ch);
    if ($res === false) {
        $err = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('odoo_unreachable: ' . $err);
    }
    curl_close($ch);
    $data = json_decode($res, true);
    if (!is_array($data)) {
        throw new RuntimeException('odoo_bad_response');
    }
    if (isset($data['error'])) {
        throw new RuntimeException('odoo_error: ' . json_encode($data['error']));
    }
    return $data['result'] ?? null;
}

try {
    $uid = odoo_call($cfg['url'], 'common', 'authenticate',
        [$cfg['db'], $cfg['username'], $cfg['api_key'], new stdClass()]);
    if (!$uid) {
        throw new RuntimeException('auth_failed');
    }
    $listId = (int) $cfg['list_id'];

    $exec = function (string $model, string $method, array $args, array $kwargs = []) use ($cfg, $uid) {
        return odoo_call($cfg['url'], 'object', 'execute_kw',
            [$cfg['db'], $uid, $cfg['api_key'], $model, $method, $args, $kwargs]);
    };

    // Vorhandenen Kontakt finden oder neu anlegen; immer der Newsletter-Liste zuordnen.
    // (4, id) = Verknüpfung ergänzen, ohne bestehende Listen zu entfernen.
    $existing = $exec('mailing.contact', 'search_read',
        [[['email', '=ilike', $email]]], ['fields' => ['id'], 'limit' => 1]);
    if (is_array($existing) && count($existing) > 0) {
        $exec('mailing.contact', 'write',
            [[$existing[0]['id']], ['list_ids' => [[4, $listId]]]]);
    } else {
        $exec('mailing.contact', 'create',
            [['name' => $email, 'email' => $email, 'list_ids' => [[4, $listId]]]]);
    }

    // Bestätigungsmail sofort auslösen statt auf die Cronjobs zu warten.
    // Odoo verschickt die DOI-Mail sonst über nacheinander laufende Cronjobs
    // (Teilnehmer synchronisieren -> Aktivitäten ausführen), im Ergebnis bis zu
    // einer halben Stunde Verzögerung. Hier stoßen wir GEZIELT NUR die
    // konfigurierte DOI-Kampagne an (campaign_id) — NICHT alle laufenden
    // Kampagnen, und NICHT die globale Mail-Warteschlange (das würde fachfremde
    // Kampagnen und wartende Mails ungeplant auslösen).
    //
    // Ohne campaign_id passiert nichts Sofortiges; die Odoo-Cronjobs holen den
    // Versand als Sicherheitsnetz nach. Bewusst eigenes try/catch: schlägt es
    // fehl, ist die Adresse trotzdem eingetragen.
    if (!empty($cfg['campaign_id'])) {
        try {
            $campId = (int) $cfg['campaign_id'];
            $exec('marketing.campaign', 'sync_participants', [[$campId]]);
            $exec('marketing.campaign', 'execute_activities', [[$campId]]);
        } catch (Throwable $e) {
            error_log('newsletter: sofortversand fehlgeschlagen (cron holt nach): ' . $e->getMessage());
        }
    }
} catch (Throwable $e) {
    error_log('newsletter: ' . $e->getMessage());
    respond(502, ['ok' => false, 'error' => 'upstream']);
}

// Immer neutral bestätigen (keine Auskunft, ob die Adresse schon existierte).
respond(200, ['ok' => true]);
