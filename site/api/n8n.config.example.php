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
    'enabled'             => false, // erst nach Prod-Smoke-Test auf true
    'shared_secret'       => 'CHANGE_ME_langes_zufälliges_secret',
    'webhook_anmeldung'   => 'https://n8n.employees.aicoreinfra.de/webhook/manibase-anmeldung',
    'webhook_interessent' => 'https://n8n.employees.aicoreinfra.de/webhook/manibase-interessent',
    'webhook_confirm'     => 'https://n8n.employees.aicoreinfra.de/webhook/manibase-confirm',
];
