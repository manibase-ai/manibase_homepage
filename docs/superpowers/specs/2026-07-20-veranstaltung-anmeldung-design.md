# Design: Veranstaltungs-Anmeldung + Interessenten-Erfassung (Infotermin)

**Datum:** 2026-07-20
**Status:** Genehmigt (Design v2, nach Codex-Design-Review Runde 1), bereit für Implementierungsplan
**Review:** `adversarial-review` Runde 1 eingearbeitet (7 Findings, siehe §12). Runde 2 nur bei Bedarf.

## Ziel

Lead-Funnel für zwei Online-Infotermine per MS Teams:

- **Termin 1:** Mittwoch, 29.07.2026, 19:30 Uhr (Europe/Berlin) = `2026-07-29T19:30:00+02:00`
- **Termin 2:** Freitag, 31.07.2026, 19:30 Uhr (Europe/Berlin) = `2026-07-31T19:30:00+02:00`

Ablauf laut Briefing: Innungen leiten eine Mail an Betriebe weiter → Link zur Anmeldeseite → nach **bestätigter** Anmeldung automatisch Einladung mit Teams-Link + Kalendereintrag → Reminder 1 Tag und 1 Stunde vorher → während der Veranstaltung tragen sich Interessenten per QR-Code ein → optionale Dankes-/Aufzeichnungsmail danach. Alle Leads landen im Odoo-CRM.

Kernbotschaft auf beiden Seiten: **„Wir nehmen nur noch 3 Projektpartner an. Plätze werden nach Eingang und einer kurzen Eignung vergeben."** (reiner Anzeigetext, keine harte Sperre; Auswahl erfolgt manuell).

## Zeitzone (verbindlich, Finding 5)

- Fachliche Zeitzone durchgängig **`Europe/Berlin`**. Im Juli gilt Sommerzeit → UTC-Offset **`+02:00`**.
- Termin-Werte werden **immer offset-behaftet** transportiert (`2026-07-29T19:30:00+02:00`), nie als naiver lokaler String.
- n8n Schedule-Trigger: Zeitzone explizit auf `Europe/Berlin` konfigurieren (nicht auf die evtl. auf UTC laufende Instanz verlassen).
- Odoo-Filter/`.ics`: siehe §5 (ICS-Semantik) und §3 (Reminder-Feuerzeiten).

## Architektur (gewählter Ansatz, nach Review angepasst)

**Kein direkter Browser → n8n POST** (Finding 1). Stattdessen der bereits im Repo etablierte
**Same-Origin-PHP-Proxy**-Pfad (wie `site/api/newsletter.php`):

```
Browser (Formular)
  └─POST─► /api/event.php          (Same-Origin PHP-Proxy auf manibase.de)
             │  · Honeypot-Feld "website" -> still 200
             │  · Feld-/Größenvalidierung, Content-Length-Limit
             │  · nginx limit_req (Rate-Limit) + einfache Wegwerf-Dedup (siehe §3)
             │  · liest n8n-Webhook-URL + Shared-Secret aus /etc/manibase/n8n.php (NICHT im Repo)
             └─POST (Header X-Manibase-Secret)─► n8n-Webhook (URL bleibt serverseitig geheim)
                                                    └─► Odoo (Upsert) + Microsoft Graph (Mailversand)
```

Vorteile: n8n-URL nie im Client-JS, Missbrauchsschutz an genau einer Stelle (nginx + PHP),
**keine** CSP-`connect-src`/CORS-Freigabe auf n8n nötig (Frontend spricht nur den eigenen Origin an).

- **Frontend:** Zwei eigene manibase-Seiten im Markenlook (kein n8n-iframe), `fetch` an den Proxy. Wiederverwendung der `.wizard/.qcard/.field`-Styles.
- **Proxy:** `site/api/event.php` (+ `site/api/event-confirm.php` für den DOI-Klick, §3). Muster/Config-Handling analog `newsletter.php`.
- **Automation:** n8n (`https://n8n.employees.aicoreinfra.de/`) — Odoo-Upsert, Mailversand, DOI-Statuslogik, Reminder.
- **CRM:** Odoo (`manibase-ug.odoo.com`), `crm.lead` mit Quelle/Stufe/Tag.
- **Mailversand:** Microsoft Graph über eine **auf `kontakt@manibase.de` RBAC-beschränkte** App (Finding 4, §6).

**Scope-Grenze:** In diesem Repo entstehen **Seiten + PHP-Proxy + Datenschutztext + Betriebsdoku + Smoke-Test-Skript**. Die n8n-Workflows werden als Import-JSON + Doku geliefert; Einrichtung in n8n/Entra macht der Kunde (Nikolaus, Tenant-Admin).

## Missbrauchs-/Abuse-Schutz (Finding 1)

Am Proxy (`event.php`) und im nginx-vhost:

- **Honeypot:** verstecktes Feld `website`; wenn befüllt → neutral `200`, keine Weiterleitung (wie `newsletter.php`).
- **nginx `limit_req`** auf `location = /api/event.php` und `location = /api/event-confirm.php` (analog Newsletter-Zone), z. B. 5 r/m pro IP mit kleinem Burst.
- **Größenlimits:** `client_max_body_size` klein (z. B. 8k) am Location-Block; im PHP zusätzlich `strlen($raw)`-Cap und Feldlängen-Caps (Name/Firma ≤ 120, Freitext ≤ 2000, E-Mail ≤ 254).
- **Shared-Secret-Header** Proxy → n8n (`X-Manibase-Secret`); n8n-Webhook lehnt Requests ohne gültigen Header ab (verhindert direkten n8n-Beschuss unter Umgehung des Proxys, da die n8n-URL zwar geheim, aber nicht auth-geschützt ist).
- **Kill-Switch:** fehlt die Config (`/etc/manibase/n8n.php`) oder ist ein Flag `enabled=false`, antwortet der Proxy `503` und das Frontend zeigt einen Fallback (mailto). So lassen sich die Formulare ohne Deploy stilllegen.
- **Monitoring:** Fehler landen via `error_log` (wie Newsletter); n8n-seitig Ausführungs-Log.

## Komponente 1 — Seite `infotermin.html`

- Pfad: `site/infotermin.html`, URL `manibase.de/infotermin`, `<meta name="robots" content="noindex,follow">`.
- **Nicht** in der Hauptnavigation (Link kommt aus der Innungs-Mail).
- Aufbau:
  - Hero: worum geht es, Verknappungs-Botschaft (3 Projektpartner).
  - Terminwahl: Radio-Auswahl (Mi 29.07. 19:30 / Fr 31.07. 19:30) als `.qcard`, Wert = offset-ISO.
  - Felder: Name, Unternehmen, E-Mail.
  - Honeypot-Feld `website` (visuell versteckt, `aria-hidden`, `tabindex=-1`) wie Newsletter.
  - **Pflicht-Checkbox = Kenntnisnahme** (nicht „Einwilligung"), Text siehe §7; verlinkt Datenschutz.
  - Submit → `fetch` POST (JSON) an `/api/event.php`.
  - Erfolgstext: „**Fast geschafft.** Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie darin Ihre Anmeldung, dann erhalten Sie Termin und Einwahllink." (DOI-Hinweis, Finding 2).
  - Fehlerfall: sichtbarer Hinweis + Fallback (mailto `kontakt@manibase.de`). Bei `503` (Kill-Switch): „Anmeldung gerade nicht möglich, bitte per E-Mail."
- JS im Muster von `scripts/site.js` (kein neues Framework). Inline `<script>…className+=' js'</script>` im head (wie Wizard), falls JS-abhängiges Verstecken nötig.

**Payload (POST an /api/event.php):**
```json
{ "form": "anmeldung", "termin": "2026-07-29T19:30:00+02:00",
  "name": "...", "unternehmen": "...", "email": "...",
  "kenntnisnahme": true, "website": "" }
```

## Komponente 2 — Seite `interessent.html`

- Pfad: `site/interessent.html`, URL `manibase.de/interessent`, `noindex`.
- QR-Ziel während der Veranstaltung.
- Felder: Name, Unternehmen, E-Mail, „Zusätzliche Info für uns:" (Freitext, optional) + Honeypot.
- Pflicht-Checkbox = Kenntnisnahme (Kontaktaufnahme). Gleiche Verknappungs-Botschaft.
- Submit → `fetch` POST an `/api/event.php` mit `form:"interessent"`.
- Erfolgstext: „Danke! Wir melden uns in den nächsten Tagen bei Ihnen."
- **Kein DOI** für Interessenten (physisch in der Veranstaltung anwesend, Rechtsgrundlage lit. b/f, §7); dafür weiterhin Honeypot + Rate-Limit + Validierung. Sofort interne Benachrichtigung + kurze Bestätigungsmail.

**Payload:**
```json
{ "form": "interessent", "name": "...", "unternehmen": "...",
  "email": "...", "info": "...", "kenntnisnahme": true, "website": "" }
```

## Komponente 3 — n8n-Workflows (Spec + Import-JSON) inkl. DOI & Idempotenz

Gemeinsame Prinzipien (Finding 2 + 3):

- **Idempotenz/Dedup:** fachlicher Schlüssel = normalisierte E-Mail (lowercase, trim) **+ Termin**. Odoo-Zugriff als **Upsert** (search → write/create), nie blind create. Jeder Mailtyp bekommt einen **Versand-Key** (z. B. `invite:<uid>`, `reminder1d:<uid>`), der in Odoo (Feld/Tag oder Log) markiert wird; vor Versand prüfen → kein Doppelversand bei Retry/Doppelklick.
- **DOI-Statusmodell** (nur Anmeldung): `received` (unbestätigt) → nach Klick `confirmed` → dann `invite_sent`. Reminder-Query filtert **ausschließlich `confirmed`**.
- **Token:** kurzlebiger, signierter/zufälliger Bestätigungstoken pro Anmeldung; im Odoo-Lead gespeichert, im Bestätigungslink transportiert.

Workflows:

1. **WF-Anmeldung-Empfang** (Webhook, Secret-Header-Check)
   - Validieren (Pflichtfelder, E-Mail, `kenntnisnahme=true`, Termin ∈ {T1,T2}).
   - Odoo-Upsert `crm.lead`: Name, Firma, E-Mail, Tag „Infotermin – unbestätigt", Termin, Token, Status `received`.
   - **Bestätigungsmail** (Graph) mit DOI-Link `https://manibase.de/api/event-confirm.php?t=<token>`.
   - HTTP 200 an Proxy (idempotent: erneuter identischer Request sendet dank Versand-Key keine zweite Mail).
2. **WF-Anmeldung-Bestätigung** (Webhook, von `event-confirm.php` aufgerufen)
   - Token validieren, Lead finden, Status → `confirmed`, Tag → „Infotermin – angemeldet".
   - **Einladungsmail** (Graph): Termin, Teams-Join-Link des gewählten Termins, **`.ics`-Anhang** (§5), Erwartungs-Absatz. Versand-Key `invite`.
   - Rückgabe steuert die Bestätigungsseite (`event-confirm.php` zeigt „Anmeldung bestätigt").
3. **WF-Reminder** (Schedule-Trigger, Zeitzone `Europe/Berlin`, 4 feste Feuerzeitpunkte)
   - Di 28.07. 19:30 (1 Tag vor T1), Mi 29.07. 18:30 (1 Std vor T1),
     Do 30.07. 19:30 (1 Tag vor T2), Fr 31.07. 18:30 (1 Std vor T2).
   - Je Feuerung: alle Leads mit Status `confirmed` **und** passendem Termin **und** ohne den jeweiligen Reminder-Versand-Key aus Odoo holen → Reminder-Mail (Teams-Link) → Versand-Key setzen. Ein zweiter Lauf sendet nichts doppelt.
4. **WF-Interessent** (Webhook, Secret-Header-Check)
   - Odoo-Upsert `crm.lead`: Tag „Interessent nach Infoveranstaltung", Freitext in Notiz.
   - Interne Benachrichtigungsmail an das Team (sofort) + kurze Bestätigungsmail an den Interessenten.
5. **WF-Dankesmail** (Manuell-Trigger)
   - Ausgelöst, sobald die Aufzeichnung hochgeladen ist.
   - An **alle `confirmed`-Angemeldeten** (termingefiltert oder beide): Danke + Aufzeichnungslink. Versand-Key `thanks` → kein Doppelversand.
   - Teams-Anwesenheit wird nicht ausgelesen → bewusst manueller Versand an alle Bestätigten. Der Aufzeichnungslink ist Teil der angefragten Veranstaltungsleistung (lit. b/f), **keine** Werbung; Angebote/Werbung erfordern separate Einwilligung (§7).

**Teams-Links & Config:** Nikolaus legt vorab zwei Teams-Meetings an (je Termin eins). Join-URLs + Odoo-Tag-/Feld-IDs + Absenderadresse liegen als **Config in n8n** (Set-Node / n8n-Variablen), **nicht** im Import-JSON hartkodiert (Finding 4/7). Ein dokumentiertes Config-Schema liegt der Lieferung bei (§7-Doku).

## Komponente 4 — Odoo-CRM

- Alle Leads als `crm.lead`, per Upsert, mit eindeutiger Quelle/Stufe/Tag:
  - „Infotermin – unbestätigt" → „Infotermin – angemeldet" (inkl. Termin) nach DOI.
  - „Interessent nach Infoveranstaltung" (inkl. Freitext).
- Mailversand ausschließlich über n8n/Graph, **nicht** über Odoo → Odoo-Tageslimit irrelevant.
- Erwartete Tag-/Feld-IDs werden als Config-Werte geführt und im Abnahmeprotokoll (§9) verifiziert.

## Komponente 5 — E-Mail-Versand & ICS

**Graph (Finding 4):** siehe §6.

**ICS-Semantik (Finding 5):** Der `.ics`-Anhang der Einladung (WF 2) enthält:
- `BEGIN:VCALENDAR` / `VERSION:2.0` / `PRODID` / `METHOD:REQUEST`.
- `VTIMEZONE` für `Europe/Berlin` (mit DST-Regel) **oder** UTC-Zeiten; gewählt: `DTSTART;TZID=Europe/Berlin:20260729T193000`, `DTEND;TZID=Europe/Berlin:20260729T203000` (60 min).
- **Stabile `UID`** pro (Termin + Teilnehmer), z. B. `<uid>-t1@manibase.de` → erlaubt spätere Updates/Absagen ohne Dublette.
- `DTSTAMP` (UTC, Erzeugungszeit), `SEQUENCE:0` (bei Updates hochzählen), `ORGANIZER:mailto:kontakt@manibase.de`, `SUMMARY`, `DESCRIPTION` (mit Teams-Link), `LOCATION` (Teams-URL).
- Test gegen Outlook, Apple Calendar, Google Calendar vor Freigabe (Abnahme §9).

## Komponente 6 — Microsoft Graph, RBAC-beschränkt (Finding 4)

- **Dedizierte** Entra-App-Registrierung, ausschließlich **Application Permission `Mail.Send`** (Admin-Consent).
- Zugriff über **Exchange Online Application RBAC** (`New-ServicePrincipal` + `New-ManagementRoleAssignment` mit Scope auf eine Mail-enabled Security Group, die **nur** `kontakt@manibase.de` enthält) — so kann die App **nur** als diese Shared Mailbox senden, nicht tenantweit.
  - Alternative (älter): `New-ApplicationAccessPolicy` (Restrict) auf dieselbe Gruppe. RBAC ist der aktuell empfohlene Weg.
- **Client-Secret** ausschließlich in n8n als verschlüsseltes Credential; **niemals** im Import-JSON oder Repo. Rotation/Ablaufdatum + Entzug dokumentiert.
- **Abnahme:** vor Go-live testen, dass Versand als `kontakt@manibase.de` klappt **und** ein Versand als beliebiges anderes Postfach **scheitert** (Negativtest).
- Einrichtung im Entra-/Exchange-Admin durch Nikolaus (Admin). Schritte in der Setup-Doku.

## Komponente 7 — DSGVO / Datenschutz (Finding 6)

Neuer Datenschutz-Abschnitt „Veranstaltungsanmeldung / Interessentenerfassung", pro Zweck klare Rechtsgrundlage:

- **Anmeldung Infotermin (Einladung, Reminder, `.ics`):** Art. 6 Abs. 1 lit. b DSGVO (Durchführung der angefragten Teilnahme). UI-Text = **Kenntnisnahme**, keine „Einwilligung". DOI dient dem Nachweis der Adressinhaberschaft und dem Missbrauchsschutz, nicht als Werbe-Einwilligung.
- **Dankes-/Aufzeichnungsmail:** lit. b/f (Teil der angefragten Leistung). **Werbliche** Folgeangebote nur mit separater, freiwilliger Einwilligung (lit. a) + Widerruf.
- **Interessentenerfassung:** lit. b/f (angefragte Kontaktaufnahme zur möglichen Zusammenarbeit).
- **Empfänger/Verarbeiter konkret benennen:** n8n (self-hosted auf `aicoreinfra.de`, Server DE), Odoo (Odoo S.A. / Odoo-Hosting), Microsoft 365 (Microsoft Ireland/Corp., Mailversand; EU-Data-Boundary, DPA/SCC-Status nennen), Hostinger (Hosting). AVV-Status je Verarbeiter angeben.
- **Löschkonzept & Fristen:**
  - `received` (unbestätigt, kein DOI-Klick): Löschung nach **14 Tagen** bzw. spätestens nach dem Termin.
  - `confirmed` (Teilnahme, kein weiterer Kontakt gewünscht): Löschung **30 Tage** nach der Veranstaltung, sofern kein CRM-Lead-Fortgang.
  - Interessenten: nach CRM-Lead-Regeln.
  - Umsetzung: als n8n-Aufräum-Workflow oder dokumentierter manueller Job (im Abnahmeprotokoll verankert), damit die zugesagte Löschung real passiert.
- Interessenabwägung für lit. f kurz dokumentieren. Freigabe des Texts durch DSB (DSZ365) empfohlen (organisatorisch, nicht Repo-blockierend).

## Komponente 8 — Betrieb: nginx, Config, Kill-Switch

- **nginx (`manibase.de`):** je einen `location = /api/event.php` und `location = /api/event-confirm.php` (PHP-FPM, wie Newsletter), beide mit `limit_req` + kleinem `client_max_body_size`. **Keine** neue CSP-`connect-src`-Regel nötig (Frontend spricht nur den eigenen Origin an — Vorteil des Proxy-Ansatzes).
- **Config `/etc/manibase/n8n.php`** (chmod 600, www-data, **nicht im Repo**; `site/api/n8n.config.example.php` als Vorlage): n8n-Webhook-URLs (Anmeldung/Interessent), `shared_secret`, `enabled`-Flag.
- **Kill-Switch:** `enabled=false` oder fehlende Config → Proxy `503`.

## Komponente 9 — Abnahme & Go-live-Gate (Finding 7)

Lieferbestandteile:

- **Config-Schema-Doku:** alle nötigen Werte (n8n-URLs, Secret, Odoo-Tag-/Feld-IDs, Teams-Links, Graph-App-ID/Secret-Handling, Absenderadresse).
- **Smoke-Test-Skript** (`scripts/smoke-event.sh`, curl-basiert, im Repo): prüft gegen die Zielumgebung
  1. `OPTIONS`/falsche Methode → 405, 2. Honeypot befüllt → 200 ohne Wirkung, 3. ungültige E-Mail → 422, 4. Rate-Limit greift, 5. gültige Anmeldung → 200 + DOI-Mail kommt, 6. DOI-Klick → Einladung + `.ics` mit korrekter Zeit, 7. Dedup (Doppel-POST → 1 Lead), 8. Interessent-POST → Lead + interne Mail, 9. Graph-Absender korrekt + Negativtest, 10. Reminder-Query trifft nur `confirmed`.
- **Go-live-Gate:** Die Formular-Submits sind erst nach dokumentiertem **Prod-Smoke-Test** freigeschaltet. Bis dahin greift der Kill-Switch (`enabled=false` → 503, Frontend-Fallback). Verhindert die aus [`CLAUDE.md`](../../CLAUDE.md) bekannte Falle „Formular zeigt Bestätigung, sendet aber nichts".

## Testbarkeit in diesem Repo (Abweichung vom generischen Workflow)

Kein Build/kein JS-Testframework. Verifikation je PR:

- **PHP:** `php -l` auf `event.php`/`event-confirm.php` (Syntax); Logik-Smoke lokal mit `php -S` + curl gegen einen Stub-Webhook (n8n mockbar).
- **Frontend:** lokaler Server (`python -m http.server --directory site`) + Browser-Check (mcp Browser): Formular-Flow, Fehlerpfade, Erfolgstext, Mobil 320/768/1024, kein H-Overflow.
- **Marke:** `npx impeccable detect` auf neue HTML/CSS (bekannte Flags akzeptiert, keine neuen).
- **n8n-JSON:** `jq .` (valides JSON) + manuelles Abnahmeprotokoll (§9), da keine Zielinstanz hier.

## Teilfeature-Zerlegung (→ PRs)

- **PR1 (Teilfeature 1, gegen `main`):** Frontend + Proxy + Datenschutz.
  `infotermin.html`, `interessent.html`, JS-Handler in `site.js`, CSS-Ergänzungen, `api/event.php`, `api/event-confirm.php`, `api/n8n.config.example.php`, Datenschutz-Abschnitt. Kill-Switch aktiv (503 bis Backend live). Enthält den bereits im Client sichtbaren Teil vollständig.
- **PR2 (Teilfeature 2, gegen `main`, unabhängig):** n8n-Import-JSON (5 Workflows) + Setup-/Config-Doku (Entra/Graph-RBAC, Teams, nginx, Config-Schema, DOI/Idempotenz) + `scripts/smoke-event.sh` + Abnahmeprotokoll.

Beide unabhängig (Doku/Backend vs. Client), daher je gegen `main`. Payload-Kontrakt (§1/§2) ist in beiden dokumentiert; PR-Bodies verweisen aufeinander.

## Offene Punkte / Abhängigkeiten (Kunde, organisatorisch)

- Entra-App + `Application Mail.Send` + **Exchange RBAC** scope auf `kontakt@manibase.de` (Nikolaus, Admin).
- Zwei Teams-Meetings anlegen, Join-URLs in n8n-Config hinterlegen.
- n8n-Webhooks aktivieren, Shared-Secret setzen, DOI-/Reminder-/Cleanup-Workflows importieren.
- `/etc/manibase/n8n.php` auf dem Prod-Server anlegen (Secret, URLs, `enabled`), nginx-Locations ergänzen.
- Odoo-Tags/Felder anlegen, IDs in Config eintragen.
- Prod-Smoke-Test durchführen, dann Submit-Gate öffnen (`enabled=true`) und Link an die Innungen geben.
- Aufzeichnungslink nachliefern (für WF-Dankesmail).
- DSGVO-Text/Löschkonzept vom DSB freigeben lassen.

## Zeitdruck

Heute 20.07., erster Termin 29.07. → Seiten + Proxy + Automation sollten in 2–3 Tagen stehen, damit die Innungen rechtzeitig verteilen. Der DOI-Schritt kostet den Anmeldern einen Klick mehr, ist aber wegen Abuse-/Nachweislage gesetzt.

## §12 — Eingearbeitete Review-Findings (Runde 1)

1. **Öffentl. Webhook** → Same-Origin-PHP-Proxy + Honeypot + nginx-Rate-Limit + Shared-Secret + Kill-Switch (§Architektur/Abuse-Schutz).
2. **Adress-Inhaberschaft/DOI** → Double-Opt-In für Anmeldung, Reminder nur an `confirmed`; Interessent lit. b/f ohne DOI (§3/§7).
3. **Idempotenz** → Dedup-Key (E-Mail+Termin), Odoo-Upsert, Versand-Keys pro Mailtyp (§3).
4. **`Mail.Send` tenantweit** → dedizierte App + Exchange RBAC scope + Secret-Handling + Negativtest (§6).
5. **Zeitzone/ICS** → Europe/Berlin, offset-ISO, Schedule-TZ, VTIMEZONE/UID/SEQUENCE/DTSTAMP (§Zeitzone/§5).
6. **Rechtsgrundlage** → pro Zweck lit. b bzw. a; Kenntnisnahme statt Einwilligung; konkrete Verarbeiter, Fristen, Löschjob (§7).
7. **Abnahme/Go-live** → Config-Schema, `scripts/smoke-event.sh`, Abnahmeprotokoll, Submit-Gate via Kill-Switch (§9).
