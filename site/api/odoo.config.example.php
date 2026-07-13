<?php
/*
 * Vorlage für die Odoo-Zugangsdaten des Newsletter-Proxys.
 *
 * SO EINRICHTEN (auf dem Server, NICHT im Repo):
 *   1) Diese Datei nach /etc/manibase/odoo.php kopieren.
 *   2) Werte unten eintragen (API-Key in Odoo: Einstellungen -> Konto/Nutzer
 *      -> "API-Schlüssel entwickeln"). Der Nutzer braucht Zugriff auf E-Mail-Marketing.
 *   3) Rechte setzen:  chown www-data:www-data /etc/manibase/odoo.php
 *                      chmod 600 /etc/manibase/odoo.php
 *   4) list_id = ID der Mailing-Liste "Newsletter" (in Odoo: E-Mail-Marketing
 *      -> Mailinglisten -> Liste öffnen, ID steht in der URL id=...).
 *
 * WICHTIG: Diese .example-Datei enthält KEINE Geheimnisse und darf ins Repo.
 * Die echte /etc/manibase/odoo.php darf es NICHT.
 */
return [
    'url'      => 'https://IHRE-FIRMA.odoo.com', // Basis-URL der Odoo-Instanz (ohne /jsonrpc)
    'db'       => 'IHRE-DATENBANK',              // Odoo-Datenbankname
    'username' => 'api@ihre-firma.de',           // Login des API-Nutzers
    'api_key'  => 'ODOO_API_SCHLUESSEL',          // API-Schlüssel (nicht das Passwort)
    'list_id'  => 0,                              // ID der Mailing-Liste "Newsletter"
];
