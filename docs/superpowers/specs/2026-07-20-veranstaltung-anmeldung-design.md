# Design: Veranstaltungs-Anmeldung + Interessenten-Erfassung (Infotermin)

**Datum:** 2026-07-20
**Status:** Genehmigt (Design), bereit für Implementierungsplan

## Ziel

Lead-Funnel für zwei Online-Infotermine per MS Teams:

- **Termin 1:** Mittwoch, 29.07.2026, 19:30 Uhr
- **Termin 2:** Freitag, 31.07.2026, 19:30 Uhr

Ablauf laut Briefing: Innungen leiten eine Mail an Betriebe weiter → Link zur Anmeldeseite → nach Anmeldung automatisch Einladung mit Teams-Link + Kalendereintrag → Reminder 1 Tag und 1 Stunde vorher → während der Veranstaltung tragen sich Interessenten per QR-Code ein → optionale Dankes-/Aufzeichnungsmail danach. Alle Leads landen im Odoo-CRM.

Kernbotschaft auf beiden Seiten: **„Wir nehmen nur noch 3 Projektpartner an. Plätze werden nach Eingang und einer kurzen Eignung vergeben."** (reiner Anzeigetext, keine harte Sperre; Auswahl erfolgt manuell).

## Architektur (gewählter Ansatz)

- **Frontend:** Zwei eigene manibase-Seiten im bestehenden Markenlook (kein n8n-iframe). Formulare posten per `fetch` an n8n-Webhooks. Wiederverwendung der vorhandenen `.wizard/.qcard/.field`-Styles aus `site.css`.
- **Backend/Automation:** n8n (`https://n8n.employees.aicoreinfra.de/`) übernimmt Validierung, Odoo-Eintrag und Mailversand.
- **CRM:** Odoo (`manibase-ug.odoo.com`), CRM-Leads mit Quelle/Stufe zur Trennung von Angemeldeten und Interessenten.
- **Mailversand:** über n8n mit dem **Microsoft-Outlook-Node (Graph / OAuth2, Weg B)**, Absender = Shared Mailbox `kontakt@manibase.de`. Entkoppelt vom Odoo-Tageslimit; kein SMTP-Basic-Auth.

**Scope-Grenze:** In diesem Repo entstehen die **Seiten + POST-Anbindung + Datenschutztext**. Die n8n-Workflows werden als Spec + Import-JSON geliefert; das Einrichten in der n8n-Instanz und im Entra-Portal macht der Kunde (Nikolaus, ist Tenant-Admin).

## Komponente 1 — Seite `infotermin.html`

- Pfad: `site/infotermin.html`, URL `manibase.de/infotermin`, `<meta name="robots" content="noindex,follow">`.
- **Nicht** in der Hauptnavigation (Link kommt aus der Innungs-Mail).
- Aufbau:
  - Hero: worum geht es, Verknappungs-Botschaft (3 Projektpartner).
  - Terminwahl: Radio-Auswahl (Mi 29.07. 19:30 / Fr 31.07. 19:30) als `.qcard`.
  - Felder: Name, Unternehmen, E-Mail.
  - Consent-Checkbox (analog `#termin`, verlinkt Datenschutz).
  - Submit → `fetch` POST (JSON) an n8n-Anmelde-Webhook.
  - Nach Erfolg: Formular ausblenden, Erfolgstext („Ihre Einladung ist unterwegs. Bitte prüfen Sie Ihr Postfach.").
  - Fehlerfall: sichtbarer Hinweis + Fallback (mailto `kontakt@manibase.de`).
- JS im bestehenden Muster von `scripts/site.js` (kein neues Framework).

**Payload (POST):**
```json
{ "form": "anmeldung", "termin": "2026-07-29T19:30" | "2026-07-31T19:30",
  "name": "...", "unternehmen": "...", "email": "...", "consent": true }
```

## Komponente 2 — Seite `interessent.html`

- Pfad: `site/interessent.html`, URL `manibase.de/interessent`, `noindex`.
- QR-Ziel während der Veranstaltung.
- Felder: Name, Unternehmen, E-Mail, „Zusätzliche Info für uns:" (Freitext, optional).
- Consent-Checkbox. Gleiche Verknappungs-Botschaft.
- Submit → `fetch` POST an n8n-Interessenten-Webhook.
- Erfolgstext: „Danke! Wir melden uns in den nächsten Tagen bei Ihnen."

**Payload (POST):**
```json
{ "form": "interessent", "name": "...", "unternehmen": "...",
  "email": "...", "info": "...", "consent": true }
```

## Komponente 3 — n8n-Workflows (Spec + Import-JSON)

1. **WF-Anmeldung** (Webhook)
   - Input validieren (Pflichtfelder, E-Mail-Format, Consent=true).
   - Odoo `crm.lead` anlegen: Name, Firma, E-Mail, Stufe/Tag „Angemeldet Infoveranstaltung", Termin im Feld/Notiz.
   - Einladungsmail (Outlook-Node) an den Angemeldeten: Termin, **Teams-Join-Link des gewählten Termins**, `.ics`-Anhang, kurzer Erwartungs-Absatz.
   - Antwort 200 an Frontend.
2. **WF-Reminder** (Schedule-Trigger, 4 feste Feuerzeitpunkte)
   - Di 28.07. 19:30 (1 Tag vor Termin 1), Mi 29.07. 18:30 (1 Std vor Termin 1),
     Do 30.07. 19:30 (1 Tag vor Termin 2), Fr 31.07. 18:30 (1 Std vor Termin 2).
   - Je Feuerung: alle Angemeldeten des betreffenden Termins aus Odoo holen, Reminder-Mail (Teams-Link) senden.
   - Robuster als „Wait"-Nodes: übersteht n8n-Neustarts, Empfängerliste nachvollziehbar.
3. **WF-Interessent** (Webhook)
   - Odoo `crm.lead` anlegen: Stufe/Tag „Interessent nach Infoveranstaltung", Freitext in Notiz.
   - Interne Benachrichtigungsmail an das Team (sofort).
   - Kurze Bestätigungsmail an den Interessenten.
4. **WF-Dankesmail** (Manuell-Trigger)
   - Vom Nikolaus/Team ausgelöst, sobald die Aufzeichnung hochgeladen ist.
   - An **alle Angemeldeten** (beide Termine oder termingefiltert): Danke + Link zur Aufzeichnung.
   - Teams-Anwesenheit wird nicht ausgelesen → bewusst manueller Versand an alle.

**Teams-Links:** Nikolaus legt vorab zwei Teams-Meetings an (je Termin eins); die zwei Join-URLs werden als Config/Set-Node in n8n hinterlegt.

## Komponente 4 — Odoo-CRM

- Alle Leads als `crm.lead` mit eindeutiger Quelle/Stufe:
  - „Angemeldet Infoveranstaltung" (inkl. gewähltem Termin).
  - „Interessent nach Infoveranstaltung" (inkl. Freitext).
- Mailversand ausschließlich über n8n/Graph, **nicht** über Odoo → Odoo-Tageslimit irrelevant.

## Komponente 5 — E-Mail-Versand (Weg B, Graph/OAuth2)

- Entra-App-Registrierung mit Anwendungsberechtigung `Mail.Send`; Absender = Shared Mailbox `kontakt@manibase.de`.
- n8n „Microsoft Outlook"-Node mit OAuth2-Credential (Client-ID/Secret aus Entra).
- Einrichtung im Entra-Portal durch Nikolaus (Admin). Spec dokumentiert die nötigen Schritte.

## Komponente 6 — DSGVO / Betrieb

- Formulare posten ausschließlich an den eigenen n8n (`n8n.employees.aicoreinfra.de`), kein US-Tool im Frontend, keine Cookies, keine URL-Parameter mit Personendaten.
- Consent-Checkbox auf beiden Seiten (Pflicht), Link zum Datenschutz.
- **Datenschutzseite:** neuer Abschnitt „Veranstaltungsanmeldung / Interessentenerfassung" (Zweck, Empfänger n8n + Odoo + Microsoft 365, Rechtsgrundlage Art. 6 Abs. 1 b/f, Löschung).
- **nginx-CSP (`manibase.de`):** `connect-src` um `https://n8n.employees.aicoreinfra.de` erweitern, damit `fetch` erlaubt ist. CORS auf n8n-Webhook-Seite für Origin `https://manibase.de` freigeben. (Server-Konfig, außerhalb des Repos dokumentiert.)

## Offene Punkte / Abhängigkeiten (Kunde)

- Entra-App-Registrierung + `Mail.Send` (Nikolaus, Admin).
- Zwei Teams-Meetings anlegen, Join-URLs in n8n hinterlegen.
- n8n-Webhooks aktivieren, CORS für `manibase.de`.
- nginx-CSP `connect-src` auf dem Prod-Server ergänzen.
- Aufzeichnungslink nachliefern (für WF-Dankesmail).

## Zeitdruck

Heute 20.07., erster Termin 29.07. → Seiten + Automation sollten in 2–3 Tagen stehen, damit die Innungen rechtzeitig verteilen können.
