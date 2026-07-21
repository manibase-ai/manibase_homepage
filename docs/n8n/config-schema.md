# Config-Schema — Infotermin-Workflows

Zwei Arten von Konfiguration:

> **Namensgebung:** die Meeting-Platzhalter heissen bewusst `MEETING_*` und nicht nach dem
> Anbieter. Das Konferenztool ist bei manibase schon zweimal gewechselt (Calendly zu Zeeg,
> MS Teams zu Zoom); ein Name wie `TEAMS_LINK` waere nach jedem Wechsel gelogen.

## A) Platzhalter der Form `{{CONFIG:<NAME>}}` in den Workflow-JSONs

Diese Tokens stehen wörtlich in den JSONs und müssen beim Import in der Zielinstanz
ersetzt werden (n8n-Variablen, Set-Node oben im Workflow oder Suchen-und-Ersetzen vor
dem Import). Das Repo-Gate `scripts/verify-n8n.sh` erzwingt, dass diese Menge **exakt**
mit den in den JSONs verwendeten Platzhaltern übereinstimmt (keine undokumentierten,
keine ungenutzten).

| Key | Beschreibung | Beispiel | verwendet in |
|-----|--------------|----------|--------------|
| `CONFIG:SHARED_SECRET` | Shared-Secret, das der PHP-Proxy im Header `X-Manibase-Secret` sendet | (langer Zufallswert) | wf-1, wf-2, wf-4 |
| `CONFIG:ODOO_URL` | Odoo-Basis-URL | `https://manibase-ug.odoo.com` | wf-1…wf-6 |
| `CONFIG:ODOO_DB` | Odoo-Datenbankname | `manibase-ug` | wf-1…wf-6 |
| `CONFIG:ODOO_UID` | Odoo-User-ID für `execute_kw` | `7` | wf-1…wf-6 |
| `CONFIG:ODOO_APIKEY` | Odoo-API-Key (nur als Platzhalter, echter Wert in n8n) | (secret) | wf-1…wf-6 |
| `CONFIG:SENDER` | Absender-Mailbox (RBAC-scoped) | `kontakt@manibase.de` | wf-1, wf-2, wf-3, wf-4, wf-5, wf-6 |
| `CONFIG:BASE_URL` | Öffentliche Basis-URL für den DOI-Link | `https://manibase.de` | wf-1 |
| `CONFIG:MEETING_LINK_T1` | Join-Link Termin 1 (inkl. `pwd`, damit ein Klick reicht) | `https://us06web.zoom.us/j/...?pwd=...` | wf-2, wf-3 |
| `CONFIG:MEETING_LINK_T2` | Join-Link Termin 2 | `https://us06web.zoom.us/j/...?pwd=...` | wf-2, wf-3 |
| `CONFIG:MEETING_INFO_T1` | Meeting-ID und Kenncode Termin 1, im Klartext fuer alle, die in der App beitreten | `Meeting-ID 823 0682 0597, Kenncode 3KfGpd` | wf-2, wf-3 |
| `CONFIG:MEETING_INFO_T2` | Meeting-ID und Kenncode Termin 2 | `Meeting-ID 848 4493 7835, Kenncode 8RRLw4` | wf-2, wf-3 |
| `CONFIG:TERMIN_T1` | Termin 1 (offset-ISO, Europe/Berlin) | `2026-07-29T19:30:00+02:00` | wf-1, wf-3 |
| `CONFIG:TERMIN_T2` | Termin 2 (offset-ISO, Europe/Berlin) | `2026-07-31T19:30:00+02:00` | wf-1, wf-3 |
| `CONFIG:RECORDING_URL` | Link zur Aufzeichnung (Dankesmail) | `https://.../aufzeichnung` | wf-5 |
| `CONFIG:TEAM_NOTIFY_TO` | interne Empfängeradresse (Interessenten-Alarm, Cleanup-Fehler) | `team@manibase.de` | wf-4, wf-6 |

## B) n8n-Credentials (NICHT als Platzhalter, echte Secrets nur hier)

Diese werden als verschlüsselte n8n-Credentials angelegt und pro HTTP-Node referenziert.
Sie tauchen **nicht** als `{{CONFIG:*}}` in den JSONs auf (Repo-Gate: kein Inline-Secret).

- **Microsoft Graph (OAuth2 Client Credentials):** Token-URL `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`, Scope `https://graph.microsoft.com/.default`, Client-ID/-Secret aus der Entra-App (siehe [`entra-graph-rbac.md`](entra-graph-rbac.md)). RBAC-scoped auf `CONFIG:SENDER`.
- **(optional) Odoo:** falls die Odoo-Zugangsdaten nicht als `ODOO_`-Platzhalter (Abschnitt A), sondern als Credential geführt werden sollen — dann die httpRequest-Nodes entsprechend auf das Credential umstellen.

## Kill-Switch / Proxy-Config

Serverseitig in `/etc/manibase/n8n.php` (siehe PR1, `site/api/n8n.config.example.php`):
`enabled`, `shared_secret` (= `CONFIG:SHARED_SECRET`), `webhook_anmeldung`, `webhook_interessent`,
`webhook_confirm` (die drei Webhook-URLs zeigen auf wf-1/wf-4/wf-2).
