# Infotermin-Formulare live schalten (Go-live-Runbook)

Schritt-für-Schritt-Anleitung, um die Formulare `manibase.de/infotermin` (Anmeldung) und
`manibase.de/interessent` (QR-Erfassung) produktiv zu schalten.

**Ausgangslage:** Code ist auf `main` gemergt und deployt (PR #5 Frontend + Proxy, PR #6
Automation). Die Seiten sind live, aber **geschlossen** (Kill-Switch → HTTP 503, Frontend zeigt
`mailto`-Fallback), bis Schritt 5 + 8 erledigt sind. **Reihenfolge einhalten.**

> Plattform: **Odoo Online** (`manibase-ug.odoo.com`) → keine Custom-Module/SQL-Constraints/
> Methoden. Nebenläufigkeit = Best-Effort über n8n-Concurrency 1 + search-before-create
> (für die Veranstaltungsgröße ausreichend; Details in [`datenmodell-odoo.md`](datenmodell-odoo.md)).

---

## Schritt 1 — Odoo (Studio): 3 Custom-Modelle
Referenz: [`datenmodell-odoo.md`](datenmodell-odoo.md)

Drei Modelle **nur mit Feldern** anlegen (keine Constraints/Methoden möglich). Auf dieser
Instanz ging das **nicht über Studio**: `manibase-ug.odoo.com` läuft auf `saas~19.3` und
`web_studio` ist gar nicht installiert. Angelegt wurde per RPC über `ir.model` /
`ir.model.fields` (+ je eine `ir.model.access`-Regel für `base.group_user`, sonst ist das
Modell auch für Admins nicht lesbar):

- **`x_infotermin_reg`**: `email_norm` (Char), `name` (Char), `unternehmen` (Char),
  `termin` (Char), `status` (Selection `received`/`confirmed`), `token_digest` (Char).
  (`create_date` ist automatisch vorhanden.)
- **`x_infotermin_outbox`**: `mail_key` (Char), `reg_id` (Many2one → `x_infotermin_reg`),
  `state` (Selection `sending`/`sent`/`failed_unknown`), `ts` (Datetime).
- **`x_infotermin_audit`**: `ts` (Datetime), `deleted` (Integer).

> **✅ Erledigt am 21.07.2026.** Der Weg über RPC hat den Vorteil, dass die technischen
> Feldnamen frei wählbar sind: sie heißen `x_email_norm`, `x_name`, `x_unternehmen`,
> `x_termin`, `x_status`, `x_token_digest`, `x_mail_key`, `x_reg_id`, `x_state`, `x_ts`,
> `x_deleted` statt `x_studio_...`. Über Studio hätte man jeden Namen einzeln ablesen und in
> die Workflows übertragen müssen. Das `x_`-Präfix ist bei Odoo für Custom-Felder Pflicht.

## Schritt 2 — Microsoft Graph (RBAC) für den Mailversand
Referenz: [`entra-graph-rbac.md`](entra-graph-rbac.md)

1. Entra-App-Registrierung (Client-ID + Secret), **KEIN** tenantweiter Admin-Consent für `Mail.Send`.
2. Exchange Online (PowerShell): `Application Mail.Send` **nur** auf `kontakt@manibase.de` scopen
   (`New-ServicePrincipal`, Custom Management Scope, `New-ManagementRoleAssignment`).
3. Negativtest: `Test-ServicePrincipalAuthorization` gegen ein Fremdpostfach muss **scheitern**.
4. In n8n ein **OAuth2-Credential** (Client Credentials, Scope `https://graph.microsoft.com/.default`)
   anlegen — das Secret liegt nur hier.

## Schritt 3 — Zwei Zoom-Meetings
Je Termin ein Meeting anlegen (Mi 29.07. 19:30 / Fr 31.07. 19:30). Notieren:

- **Join-Link inklusive `?pwd=`** → `MEETING_LINK_T1/T2`. Mit dem eingebetteten Kenncode
  genügt ein Klick; ohne ihn muss jeder Teilnehmer den Code tippen.
- **Meeting-ID und Kenncode im Klartext** → `MEETING_INFO_T1/T2`, Form:
  `Meeting-ID 823 0682 0597, Kenncode 3KfGpd`. Das steht in Einladung, Erinnerung und in der
  Beschreibung des Kalendereintrags, für alle, die in der App beitreten statt über den Link.

## Schritt 4 — n8n: 6 Workflows importieren & verdrahten
Referenzen: [`README.md`](README.md), [`config-schema.md`](config-schema.md)

1. `workflows/wf-1 … wf-6.json` über „Import from File" importieren.
2. **Feldnamen:** bereits erledigt, die JSONs im Repo nutzen die technischen Namen aus
   Schritt 1. Nur nötig, falls die Modelle neu mit anderen Namen angelegt werden. Achtung:
   angeglichen werden muss **beides** — die Odoo-Anfragen *und* die Ausdrücke, die deren
   Antworten lesen (`r.x_...` in den Code-Nodes). Gate 10d in `verify-n8n.sh` prüft das.
3. Alle `{{CONFIG:*}}`-Platzhalter durch echte Werte ersetzen (Beschreibungen in
   [`config-schema.md`](config-schema.md)). Jeder Name hier einzeln ausgeschrieben, damit die
   Liste greppbar ist und `verify-n8n.sh` sie gegen die tatsächlich verwendeten Platzhalter
   prüfen kann:

   | Platzhalter | Wert |
   |---|---|
   | `CONFIG:ODOO_URL` | `https://manibase-ug.odoo.com` |
   | `CONFIG:ODOO_DB` | `manibase-ug` |
   | `CONFIG:ODOO_UID` | `2` |
   | `CONFIG:ODOO_APIKEY` | aus `/etc/manibase/odoo.php` auf dem Produktivserver |
   | `CONFIG:SENDER` | `kontakt@manibase.de` |
   | `CONFIG:BASE_URL` | `https://manibase.de` |
   | `CONFIG:MEETING_LINK_T1` / `CONFIG:MEETING_LINK_T2` | Join-Links aus Schritt 3 |
   | `CONFIG:MEETING_INFO_T1` / `CONFIG:MEETING_INFO_T2` | Meeting-ID und Kenncode aus Schritt 3 |
   | `CONFIG:TERMIN_T1` | `2026-07-29T19:30:00+02:00` |
   | `CONFIG:TERMIN_T2` | `2026-07-31T19:30:00+02:00` |
   | `CONFIG:RECORDING_URL` | erst nach der Veranstaltung, siehe Schritt 8 |
   | `CONFIG:TEAM_NOTIFY_TO` | interne Adresse für Alarme und Interessenten-Meldungen |
   | `CONFIG:SHARED_SECRET` | langer Zufallswert, identisch mit Schritt 5 |
4. Den HTTP-Graph-Nodes das OAuth2-Credential aus Schritt 2 zuweisen.
5. **Concurrency 1.** Ein Limit **pro Workflow** gibt es in n8n 1.70 nicht (die Public API
   weist jeden solchen `settings`-Key ab). Die Serialisierung, auf der das Best-Effort-Design
   beruht, kommt aus der **instanzweiten** Umgebungsvariable `N8N_CONCURRENCY_PRODUCTION_LIMIT=1`.
   Auf der Zielinstanz ist sie gesetzt, zusammen mit `NODE_FUNCTION_ALLOW_BUILTIN=crypto`
   (ohne die hat der Code-Node **keinerlei** Krypto: weder `require('crypto')` noch
   `globalThis.crypto`, und wf-1 kann keinen DOI-Token erzeugen). Beides gehört in die
   Bundle-Quelle, nicht nur in die gerenderte Compose-Datei — sonst entfernt der nächste
   Deploy es wieder.
6. Webhook-URLs von wf-1 (Anmeldung), wf-4 (Interessent), wf-2 (Confirm) notieren.

## Schritt 5 — Server: Config + nginx
Referenzen: `site/api/n8n.config.example.php`, [`../deploy/nginx-event-locations.conf`](../deploy/nginx-event-locations.conf)

1. `/etc/manibase/n8n.php` anlegen (chmod 600, chown www-data; Vorlage =
   `site/api/n8n.config.example.php`): `shared_secret` (= `SHARED_SECRET`), die drei Webhook-URLs,
   **`enabled => false`** (erstmal).
2. Das nginx-Snippet in den `manibase.de`-vhost aufnehmen (die `limit_req_zone manibase_event`
   in `http{}`, die zwei `location =`-Blöcke in `server{}`), `nginx -t`, reload.
3. **Gate-Test:** `curl -i -X POST https://manibase.de/api/event.php` → muss **503** liefern
   (nicht 404, nicht PHP-Quelltext). Erst wenn das stimmt, weiter.

## Schritt 6 — (separat) Newsletter-Sofortversand nachziehen
Mit gemergt: `newsletter.php` stößt jetzt **nur die konfigurierte DOI-Kampagne** an (nicht mehr
alle laufenden Kampagnen). Damit die Newsletter-Bestätigungsmail weiter **sofort** rausgeht: in
`/etc/manibase/odoo.php` das neue Feld **`campaign_id`** auf die ID eurer „Double Opt-in"-Kampagne
setzen. Leer/0 lassen = Odoo-Cron holt es nach (etwas langsamer). Betrifft nur den Newsletter,
nicht den Infotermin.

## Schritt 7 — Abnahme (Pflicht, vor dem Scharfschalten)
Referenz: [`abnahme-protokoll.md`](abnahme-protokoll.md) (17 Test-IDs).

- Kurz-Smoke: `BASE_URL=https://manibase.de scripts/smoke-event.sh`.
- Manuell: Testanmeldung → DOI-Mail kommt → bestätigen → Einladung + `.ics` (öffnet als
  **19:30 Europe/Berlin** in Outlook/Apple/Google) → Interessentenformular → interne Mail.
- Graph-Negativtest (Schritt 2) bestanden.

## Schritt 8 — Scharfschalten & verteilen
1. `/etc/manibase/n8n.php` → **`enabled => true`** (kein Deploy nötig, wirkt sofort).
2. Finaler Live-Test: eine echte Anmeldung durchklicken.
3. **Dann** den Link `https://manibase.de/infotermin` an die Innungen geben.
4. Für die Veranstaltung: QR-Code auf `https://manibase.de/interessent` erzeugen.
5. Nach der Veranstaltung: `RECORDING_URL` in wf-5 eintragen und wf-5 (Dankesmail) manuell auslösen.

---

## Wichtig zu wissen
- **Zeitdruck:** erster Termin **29.07.** — Schritte 1–5 (Odoo-Modelle + n8n + Entra) sind der
  kritische Pfad, damit die Innungen den Link rechtzeitig verteilen.
- **Alles bleibt geschlossen**, solange `enabled=false` oder die Config fehlt — kein irreführender
  „Erfolg" möglich (das Frontend akzeptiert nur echtes JSON `{ok:true}`).
- **Nebenläufigkeit = Best-Effort:** ein workflow-übergreifendes Cleanup/Confirm-Race ist als
  akzeptiertes Restrisiko dokumentiert; Cleanup läuft nachts, die Löschkriterien treffen eine
  gerade laufende Bestätigung praktisch nie. Harte Garantien nur mit Odoo.sh-Modul (nicht nötig).

## Prompt für einen neuen Chat
> „Hilf mir, die Infotermin-Formulare live zu schalten. Folge `docs/n8n/GO-LIVE.md`:
> Odoo-Studio-Modelle, Entra/Graph-RBAC, n8n-Import + Feldnamen angleichen + Concurrency 1,
> `/etc/manibase/n8n.php` + nginx-Snippet + 503-Test, Abnahme, dann `enabled=true`.
> Wir sind auf Odoo Online."
