# Infotermin — n8n-Automation (Runbook)

Serverseitige Automation hinter dem Same-Origin-Proxy aus PR1 (`site/api/event.php` /
`event-confirm.php`). Diese Workflows importiert/konfiguriert **der Kunde** (Tenant-Admin);
dieser Ordner liefert die Bausteine + das Runbook.

> **Import-STARTBARE Vorlagen**, nicht „fertig laufend": Die JSONs müssen in der Zielinstanz
> verdrahtet (Credentials, `{{CONFIG:*}}`, Odoo-Modelle) und über das **Abnahmeprotokoll**
> getestet werden. Das Repo-Gate `scripts/verify-n8n.sh` prüft nur Struktur/Konsistenz/Sicherheit.

## Reihenfolge

1. **[`datenmodell-odoo.md`](datenmodell-odoo.md)** — Odoo-**Studio**-Modelle
   `x_infotermin_reg` (Felder inkl. name/unternehmen), `x_infotermin_outbox`,
   `x_infotermin_audit` anlegen — **nur Felder**, KEINE `_sql_constraints`/Methoden
   (Odoo Online lässt keine Custom-Module zu). crm.lead-Spiegel. Nebenläufigkeit über
   n8n-Concurrency 1 + search-before-create (s. Doku).
2. **[`entra-graph-rbac.md`](entra-graph-rbac.md)** — Graph-App **ohne** Tenant-Consent,
   `Mail.Send` nur via Exchange RBAC auf `kontakt@manibase.de`; n8n-OAuth2-Credential anlegen.
3. **[`config-schema.md`](config-schema.md)** — alle Werte bereitstellen (Teams-Links, Termine,
   Odoo, Absender, Base-URL, interne Empfänger).
4. **Import** der 6 Workflows (`workflows/wf-1…wf-6.json`) in n8n via „Import from File".
   Danach je Workflow: Graph-Credential zuweisen, `{{CONFIG:*}}` durch echte Werte ersetzen
   (n8n-Variablen oder Set-Node), **„Limit execution to 1"** setzen (Defense-in-Depth), aktivieren.
5. **Webhook-URLs** aus wf-1/wf-4/wf-2 in `/etc/manibase/n8n.php` eintragen
   (`webhook_anmeldung`/`webhook_interessent`/`webhook_confirm`), `shared_secret` = `SHARED_SECRET`.
6. **nginx** (PR1-Snippet `docs/deploy/nginx-event-locations.conf`) provisionieren, `nginx -t`,
   echter 503-Test (siehe PR1-Deploy-Gate).
7. **[`abnahme-protokoll.md`](abnahme-protokoll.md)** komplett abarbeiten (inkl.
   `smoke-event.sh`). Erst dann `enabled=true` + Link an die Innungen.

## Die 6 Workflows

| Datei | Trigger | Zweck |
|-------|---------|-------|
| `wf-1-anmeldung-empfang` | Webhook | Anmeldung → reg `create` (unique) → DOI-Mail; Duplicate-Recovery |
| `wf-2-anmeldung-confirm` | Webhook | Token prüfen (200/409/410) → `invite`-Claim (CAS) → Einladung + ICS |
| `wf-3-reminder` | Schedule (Europe/Berlin, 4×) | Reminder 1 Tag / 1 Std an `confirmed` |
| `wf-4-interessent` | Webhook | Interessent → crm.lead + interne Mail + Bestätigung |
| `wf-5-dankesmail` | Manual | Danke + Aufzeichnungslink an `confirmed` |
| `wf-6-cleanup` | Schedule (täglich) | DSGVO-Löschung (received>14d ODER termin<now; confirmed>termin+30d) |

## Kill-Switch

Der Versand hängt am PHP-Proxy-Flag `enabled` in `/etc/manibase/n8n.php` (PR1). `enabled=false`
→ Formulare geschlossen (503), Frontend zeigt `mailto`-Fallback. So bleibt alles bis zur
bestandenen Abnahme geschlossen.

## Sicherheits-Kurzregeln

- Secrets nur als n8n-Credentials / `{{CONFIG:*}}` — nie literal im JSON (Gate erzwingt das).
- Graph-App RBAC-scoped auf eine Mailbox; Negativtest Pflicht.
- **Nebenläufigkeit = Best-Effort** (Odoo Online, keine DB-Constraints): n8n **Concurrency 1**
  je Workflow (im UI setzen) + **search-before-create**. Innerhalb eines Workflows kollisionsfrei;
  ein workflow-**übergreifendes** Race (z. B. Cleanup ↔ Confirm) ist nicht hart ausgeschlossen,
  bei eurer Größenordnung aber praktisch irrelevant. Harte Garantien nur mit Odoo.sh-Modul.

## ⚠️ Odoo-Studio-Feldnamen (vor dem Import prüfen!)

Beim Anlegen der Modelle/Felder in Odoo **Studio** vergibt Odoo technische Namen (Modelle
`x_...`, Studio-Felder oft `x_studio_...`). Die Workflow-JSONs verwenden die **logischen**
Namen aus `datenmodell-odoo.md` (`email_norm`, `termin`, `token_digest`, `mail_key`, `state`,
`ts`, `status`, `name`, `unternehmen`). **Vor dem Import** die tatsächlich von Studio erzeugten
technischen Namen ermitteln (Studio → Feld → „Technischer Name") und in den sechs JSONs per
Suchen-und-Ersetzen angleichen — sonst brechen die RPC-Aufrufe mit „Invalid field" ab. Tipp:
Beim Feld-Anlegen in Studio den technischen Namen möglichst genau auf den logischen Namen setzen,
dann ist der Aufwand minimal.
