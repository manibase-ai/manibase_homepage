# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# manibase · Website (One-Pager)

Statische Marketing-Website (One-Pager + Rechtsseiten) für **manibase UG (haftungsbeschränkt)**.
Quelltext liegt in `site/`. Kein Build, kein Framework: reines HTML/CSS/JS.

## Was die Firma macht (Positionierung)
- **Versprechen:** „Holen Sie sich Ihre Abende zurück." KI-Helfer übernehmen den Verwaltungs-/Doku-Kram (Angebote, E-Mails, Berichte, Planung), für den inhabergeführte Betriebe niemanden finden.
- **Zielkunde:** inhabergeführte Betriebe, 10–20 MA, hohe Doku-/Bürolast, Arbeit kippt auf Abend/Wochenende.
- **Branchenoffen kommunizieren.** Bau/Planung ist nur ein möglicher Beachhead, steht NICHT auf dem Markenschild. Keine Branche im Marketing-Text festnageln.
- **Einstiegsprodukt = KI-Klartag:** 1 Tag, **1.800 € Festpreis**, Ergebnis: Maßnahmenplan mit Ampel (rot=verbrennt Zeit / gelb=prüfen / grün=sofort abnehmbar). Wird bei Folgeprojekt voll angerechnet. Danach KI-Helfer zum Monatspreis.
- **Haupt-CTA der Seite:** **15-Minuten-Orientierungsgespräch** (kostenlos). Der KI-Klartag ist Schritt 2 im Funnel, nicht mehr der Haupt-CTA. Termin-Sektion `#termin`: erst kurze **Qualifizierungs-Maske**, dann Kalender (Calendly on-demand, `https://calendly.com/geisler-matthias/orientierungscall`; Tool evtl. Zeeg).
- Quelle: `positionierung-spickzettel.docx`, `positioning-canvas.docx` (April Dunford). Tonalität: Sie-Ansprache, warm, konkret, nicht aphoristisch.

## Designsystem-Herkunft
- Vollständiges Brand Kit liegt in `Claude Design/` (Skill `manibase-design`): Tokens, Logos, Fonts, fertige JSX-Website-Komponenten. **Single Source of Truth der Tokens:** `Claude Design/colors_and_type.css`.
- Für die Live-Seite übernommen nach `site/styles/tokens.css` — einzige Änderung: **Fonts selbst gehostet** (DSGVO), nicht über Google-CDN.

## Marken-Regeln (nicht verhandelbar)
- **Farben:** warme Leinwand `#F8F4EC`, Cobalt `#2F3FDB` macht die lesbare Arbeit (Text/Links/Primärbutton), Tiefblau `#14224F` für dunkle Bänder/Footer (nie Schwarz).
- **Golden Yellow Rule:** Gelb `#F2D414` ist NUR Fläche mit dunklem Text drauf ODER Akzent auf Dunkel. Nie gelber Text auf Hell, nie dünne gelbe Linie. Eine Gelb-Geste pro Screen.
- **60/30/10:** ~60 % warme Neutrals, ~30 % Cobalt, ~10 % Gelb.
- **Schrift:** Sora (Display/Zahlen), Hanken Grotesk (Body), JetBrains Mono NUR für Zahlen/Preise/Maße. Manrope liegt bei, wird aktuell nicht genutzt.
- **Wortmarke:** „mani"(cobalt) + „base"(ink/auf-dunkel: paper) + gelber Punkt. In CSS gerendert (`.wordmark`), nicht als SVG (gelieferte SVGs sind leere `<image>`-Hüllen). **Punkt-Proportion aus Original-Logo gemessen** (`Claude Design/assets/manibase-logo-yellow.png`): Punkt ≈ 0.2em, Unterkante auf der Grundlinie (`.dot{width:.2em;height:.2em;align-self:baseline}`) — NICHT größer/schwebend. Inline im Fließtext via `.wordmark--inline` (erbt Schriftgröße).
- **KI-Helfer „Unsere Helden"** (illustrierte Maskottchen, vom Kunden geliefert in `Bilder/`, optimiert nach `site/assets/helfer-*.webp`): **Anton** Angebotsmanager (Dachs) · **Emma** E-Mail-Assistenz (Biene) · **Doreen** Dokumentationshilfe (Eichhörnchen) · **Wiktor** Wissensmanager (Eule). Auf der Seite als **heller, zentrierter Balken** (`.heroes__grid` = Flex mit `justify-content:safe center` + `scroll-snap`, **kein** Tiefblau-Hintergrund mehr; Desktop alle Karten nebeneinander, Mobil/Überlauf horizontal swipebar — skaliert für künftig mehr Helfer). Hover/Tap blendet Info-Bereich von unten ein, Hintergrund **Cobalt** + weiße Schrift (wie Primärbutton „Gespräch buchen"). Überschrift „Unsere **Helden**" mit gelbem `.mark` auf hellem Grund (Überschrift dunkel, Intro sekundär). Texte in **Sie** (Kunde hatte „du" geliefert, auf Sie vereinheitlicht). Alte Namen (Mailo/Kalla/Pia/Doku) ersetzt.

## Copy-Regeln (= weg vom AI-Look)
- **Keine Gedankenstriche (—) im Text.** Komma, Doppelpunkt, Punkt, Klammern.
- Keine Buzzwords (streamline, empower, seamless, nahtlos, revolutionär …). Konkretes Substantiv + Verb.
- Sie-Ansprache. Button-Labels = Verb + Objekt.
- Keine Eyebrow über jeder Sektion, keine „01/02/03"-Marker als Default-Gerüst, keine identischen Card-Grids.

## Dateistruktur
```
site/
  index.html            One-Pager: Hero(Foto, **zentriert**, **rotierende Headline**; 3 Trust-Badges: DSGVO / Server DE / **individuell auf Sie zugeschnitten**) · Wertband · **„Kennen Sie das?"(#pains: 3 editoriale Pain-Rows mit Haarlinien + 2-spaltiges **Cobalt**-„Folge"-Band `.folge` (Frage links, betonte Konsequenzen rechts mit fettem Punch + lighter `.folge__sub`, 1 Gelb-Mark; trägt bewusst die 30%-Cobalt-Geste fürs 60/30/10))** · **„So nehmen wir Ihnen das ab."(#loesung: `.solve` Checkliste 2×2, Cobalt-Häkchen, spiegelt die Folgen, + CTA → #termin)** · „Unsere Helden"(#helfer) · **„So funktioniert unsere KI-Hilfe"(#hilfe, 3 .steps)** · Über uns(#team) · Warum manibase? · CTA-Band · Timeline(#ablauf; Schritt 2 verlinkt → ki-klartag.html) · **Newsletter(.newsletter, Cobalt-Band, Frontend)** · Termin(#termin: **Qualifizierungs-Maske/Wizard → dann Kalender**) · Footer(+Blog-Link). Inline `<script>…className+=' js'</script>` im head, damit `.js .wstep` die Maskenschritte flackerfrei versteckt.
  ki-klartag.html       Landingpage KI-Klartag (noindex, follow). NICHT in Hauptnav; verlinkt aus Timeline-Schritt 2 + Footer. Nutzt vorhandene .klartag/.ticket/.ampel/.steps/.spotlight-cta-Styles. CTA → index.html#termin.
  blog/index.html       Blog-Übersicht (1 Beitrag als .postcard). Relative Pfade ../.
  blog/papierkram-am-chef.html  Erster Beitrag (+BlogPosting JSON-LD). CTA-Band → index.html#termin.
  impressum.html        § 5 DDG (Daten gesetzt, UG i. G.)
  datenschutz.html      DSGVO; jetzt 10 Abschnitte: 5=Anfrage-/Buchungsformular, 6=Calendly (lädt erst nach Maske+Einwilligung), 7=Newsletter (Double-Opt-In). Offen: DPA mit Calendly (.ph)
  styles/tokens.css     Marken-Tokens (@import ../fonts/_fontface.css)
  styles/site.css       Layout/Komponenten (+ `[hidden]{display:none!important}`, .how, .newsletter, .wizard/.qcard/.field, .blog/.postcard/.post)
  scripts/site.js       Reveal + Rotator + Newsletter-Handler + Qualifizierungs-Maske (Wizard, 5 Schritte) + `loadBookingCalendar()` (Calendly on-demand; **einziger Buchungstool-Wechselpunkt Calendly⇄Zeeg**). Kein Karussell, kein Auto-Load mehr.
  fonts/                Self-hosted woff2 (Sora, Hanken Grotesk, JetBrains Mono) + _fontface.css
  assets/               signet.png (Favicon), logo.png, hero-hands.jpg (Hero-Foto: Marissa Grootes/Unsplash), matthias.jpg, nikolaus.webp, helfer-*.webp
```

## Impeccable (de-AI-Pass)
- Installiert in `.claude/skills/impeccable`. Skill: `/impeccable <command>`.
- Deterministischer Scan: `npx impeccable detect site/index.html site/styles/site.css …`
- **Bekannte/akzeptierte Flags:** `cream-palette` (= committete Marken-Leinwand, identity-preservation; nur ändern, wenn der Kunde es will). Cramped-padding-Flags auf Full-Bleed-Sektionen sind großteils Limitierungen der statischen Analyse (Inset kommt von `.container`).

## Firmen-/Rechtsdaten (Stand: gesetzt)
- **Anbieter:** manibase UG (haftungsbeschränkt) **i. G.** (in Gründung), Würzburger Str. 1, 97246 Eibelstadt. „i. G." steht in allen 5 Stellen (impressum/datenschutz Anbieter + alle 3 Footer-Copyrights). **Nach HR-Eintragung „i. G." überall entfernen.**
- **GF:** Matthias Geisler und Nikolaus Schauersberger. Inhaltlich verantwortlich (§ 18 MStV): Matthias Geisler.
- **Kontakt:** Tel. +49 15565 697065, E-Mail `kontakt@demiospace.ai` (manibase-Exchange-Postfach folgt in wenigen Tagen, dann ggf. auf manibase-Domain umstellen — überall konsistent: impressum.html, datenschutz.html, site.js mailto-Fallback).
- **Register:** UG in Gründung, Eintragung beim **Amtsgericht Würzburg** beantragt, noch nicht erfolgt. Impressum-Block textlich auf „in Gründung" gestellt (kein HRB-Platzhalter mehr). HRB steht NICHT im Gesellschaftsvertrag → nach Eintragung über handelsregister.de / Eintragungsnachricht ergänzen.
- **USt-IdNr.:** noch keine → Block im Impressum entfernt; bei Erhalt wieder einsetzen (§ 27a UStG).
- **Datenschutz (gesetzt):** Hosting = **ALL-INKL.COM – Neue Medien Münnich** (Server DE; Domain bei united-domains gekauft, Transfer zu All-Inkl geplant). Externer **DSB = DSZ365**; im Datenschutz über die Firmenadresse + `kontakt@demiospace.ai` (Stichwort „Datenschutz") erreichbar gemacht — rechtlich zulässig, keine benannte Person nötig (Art. 37 Abs. 7 DSGVO). Kein Buchungstool → Abschnitt „Terminvereinbarung" auf E-Mail/Telefon gestellt. Schriften lokal (kein Google). Stand: 5. Juni 2026. **Keine `.ph`-Platzhalter mehr auf der Seite.**

## Offene Punkte / TODO
- [ ] **Formulare sind Frontend-only (kein Backend!).** Newsletter + Qualifizierungs-Maske zeigen nur Erfolgs-/Bestätigungstexte, senden aber NICHTS. **Vor Live-Gang Versand-Backend anbinden**, sonst sind die „Bestätigungs-Mail"-Hinweise irreführend. Antworten der Maske stehen als `FormData` bereit (auskommentiert in site.js).
- [ ] **Buchungstool-Entscheidung Calendly ⇄ Zeeg** (Kunde unentschieden; Calendly DSGVO-kritisch + landet im Spam). Wechsel nur an EINER Stelle nötig: `loadBookingCalendar()` in site.js + `data-cal-url`/Fallback-Link in `#booking-calendar`. Bei Zeeg Datenschutz-Abschnitt 6 ersetzen.
- [ ] Nach HR-Eintragung: **HRB-Nummer** im Impressum-Registerblock ergänzen **und „i. G." an allen 5 Stellen entfernen**.
- [ ] Optional: falls DSZ365 eine eigene Direktadresse/-Mail veröffentlicht haben will, im Datenschutz-Abschnitt 2 ersetzen (aktuell über Firmenadresse geroutet).
- [ ] AVV mit ALL-INKL tatsächlich abschließen (in Datenschutz bereits als bestehend formuliert). Falls Seite vor dem Transfer woanders live geht, Hoster-Abschnitt anpassen.
- [x] **Termin-Sektion `#termin` = Qualifizierungs-Maske (Wizard) → dann Kalender** (Vorbild nextstrategy.ai). 5 Schritte (Unternehmensgröße / Rolle / Wo brennt's [Mehrfach] / Dringlichkeit / Kontakt+Consent), Auswahlkarten `.qcard` (`:has(input:checked)`), Einfach-Auswahl mit Auto-Advance (an `click`, nicht `change`, damit Pfeiltasten frei navigieren). Erst nach Abschluss **+ Consent** wird der Kalender geladen → **entschärft den alten DSGVO-Punkt** (keine US-Verbindung vor Einwilligung). Calendly via `initInlineWidget` on-demand. Booking-Sektion hell (`--color-surface-sunken`), getrennt vom Footer. **Offen: DPA mit Calendly** (.ph) + Tool-Entscheidung (s. o.).
- [x] **Newsletter-Band** (`.newsletter`, Cobalt, gelber „Anmelden"-Button = Akzent auf Dunkel). Double-Opt-In-Hinweis. Frontend-only.
- [x] **„So funktioniert unsere KI-Hilfe"** (`#hilfe`, nach Helden): 3 `.steps` (Abläufe kennenlernen → Helfer bauen → freigeben & dranbleiben), Hintergrund `--color-surface-sunken` für Rhythmus.
- [x] **KI-Klartag-Landingpage** (`ki-klartag.html`, noindex) + **Blog** (`blog/index.html` + 1 Beitrag). Beide Marken-konform, reuse vorhandener Komponenten.
- [x] Header: Signet + Wortmarke links, Menü rechts (Sulista-Layout). Helfer-Sektion „Unsere Helden" mit 4 Avatar-Karten (swipebar, Hover-Info). Funnel-CTAs überall → Orientierungsgespräch (#termin).
- [x] Hero: vollflächiges Foto („Hände bei der Arbeit", Notizbuch/Laptop) mit Tiefblau-Duotone-Tönung (Cobalt-Glow + feines Bauplan-Raster), helle Headline, gelbe Gelb-Geste auf „Abende", gelber Primär-CTA. Vorbild Aufbau: sulista.ch (Kundenwunsch). Body-Sektionen bleiben Creme.
- [x] Gründer-Abschnitt „Wer hinter manibase steht" (id="team", nach „Was wir übernehmen", vor KI-Klartag): zwei Karten (Matthias = Monogramm „MG" / Nikolaus = echtes Foto), darunter aufgewertetes Cobalt-Band „Was uns ausmacht" (`.founders__label` Mono-Label + Tick / `.founders__claim` Display-Aussage **über volle Bandbreite**, zwei Stärken fett, Schatten + Radial-Glow für Tiefe). Intro: „Kein anonymer Anbieter." (nicht „Agentur"). **Überschrift rendert „manibase" als Inline-Wortmarke** (`.wordmark.wordmark--inline`, erbt Schriftgröße; mani cobalt/base ink/gelber Punkt, kein Signet). Bios faktenbasiert (Nikolaus aus schauersberger.com). **Matthias-Headshot fehlt noch** → `.founder__photo--mono` durch `<img>` ersetzen, sobald Foto da.
- [x] Wertband unter Hero (`.valueband`, 4 Werte: 1.800 € Festpreis · 1 Tag · voll anrechenbar · DSGVO). Ehrlich, keine erfundenen Kundenzahlen.
- [x] Prozess-Abschnitt „So läuft ein KI-Klartag" (`#ablauf`, 4 nummerierte Schritte mit gestricheltem Verbinder), direkt vor dem KI-Klartag-Angebot. Hero-Button „So läuft ein Klartag" → #ablauf.
- [x] Matthias-Foto eingesetzt (assets/matthias.jpg, aus Bilder/Headshot.jpg quadratisch zugeschnitten). Beide Gründer mit echtem Foto.

## Aktueller Seiten-Fluss (Sulista-Vorbild, Markenstil)
Hero(Foto, 3 Badges) · Wertband · „Kennen Sie das?"(#pains: 3 Pain-Points + Folge-Band) · „So nehmen wir Ihnen das ab."(#loesung: Checkliste) · „Unsere Helden"(#helfer) · „So funktioniert unsere KI-Hilfe"(#hilfe) · Über uns/Gründer(#team, +Cobalt-Band) · „Warum manibase?" · CTA-Band · Timeline(#ablauf, Schritt 2 → ki-klartag.html) · Newsletter(Cobalt) · Termin(#termin: Maske → Kalender) · Footer(+Blog).
Separate Seiten: `ki-klartag.html` (noindex), `blog/` (Index + 1 Beitrag).
Entfernt: altes Helfer-Karussell, „Was wir übernehmen"-Liste, alte Problem-Sektion (→ Pains), Calendly-Auto-Load (jetzt on-demand nach Maske).

## Dev-Hinweis: Screenshots
Headless-Edge-Screenshots: `& msedge --headless=new --screenshot ... --window-size=W,H`. **Schmale Breiten (z. B. 390) werden unter Windows auf eine Mindest-Fensterbreite geklemmt → Leinwand beschneidet rechts, täuscht Überlauf vor.** Für echte Mobilprüfung eine Mess-/Harness-Seite mit `<iframe width=… src="/">` nutzen (zur Maske scrollen via `getBoundingClientRect`+`pageYOffset`) und mit `--virtual-time-budget=1500 --force-prefers-reduced-motion` screenshotten (sonst hält der Rotator-`setInterval` den Shot auf). `--force-prefers-reduced-motion` nötig, damit `.reveal`-Elemente sichtbar sind. **Edge kappt sehr hohe `--window-size`-Screenshots (>~5000px → keine Datei); Full-Page nicht zuverlässig — abschnittsweise via Anker/Harness shotten.** Temp-Harness-Dateien (`site/_*.html`) nach Gebrauch löschen.
- **CSS-Gotcha:** Das HTML-Attribut `hidden` wird von display-setzenden Klassen (`.btn{display:inline-flex}`, flex/grid) überschrieben → globale Regel `[hidden]{display:none!important}` ist gesetzt und nötig (sonst zeigen Wizard-Nav-Buttons/Newsletter-Row trotz `hidden`).
- [x] Section-Spacing reduziert: `--section-y` jetzt `clamp(3rem,2rem+4vw,5.5rem)` (vorher max 8.5rem).
- [x] Responsive-Check 320/768/1024/1440 bestanden (kein H-Overflow, `html{overflow-x:clip}` als Schutz). Mobil-Fixes: Header-CTA ≤480 aus (steckt im Menü), Hero-CTAs + ctaband/timeline-CTAs vollbreit/umbrechend, Hero-Headline `hyphens:auto`, Gründer-Karten ≤560 einspaltig, Helden-Karten `clamp(200px,21vw,236px)` (4 passen ab ~1000px, darunter Swipe), Calendly-Widget `min-width:0`.
- [ ] Finaler `/impeccable polish` + Lighthouse + Calendly im echten Browser testen.

## Lokal ansehen
`python -m http.server 8000 --directory site` → http://localhost:8000

## Deployment
- **Live-Domain:** `manibase.aicoreinfra.de` (Server `deploy@72.62.42.27`, Ubuntu 24.04, nginx + certbot; Schwester-Subdomains radar/employees/kva/n8n liegen auf demselben Host).
- **CI/CD:** `.github/workflows/deploy.yml` deployt `site/` bei **jedem Merge auf `main`** (GitHub-hosted Runner → SSH-rsync in `…/releases/<timestamp>` → atomarer `current`-Symlink, alte Releases werden auf 5 reduziert). Manuell auslösbar via `workflow_dispatch`. Secret: `DEPLOY_SSH_KEY` (dedizierter ed25519-Key `github-actions-deploy@manibase`, Public-Key liegt in `~deploy/.ssh/authorized_keys`).
- **Docroot:** `/var/www/manibase.aicoreinfra.de/current` (deploy-owned, releases/current-Pattern wie schauersberger.com).
- **Einmalige Provisionierung:** `~deploy/setup-manibase.sh` (auf dem Server, liegt im deploy-Home neben den anderen `setup-*.sh`-Skripten = Server-Konvention, **nicht im Repo versioniert**). Legt Docroot + nginx-vhost mit Security-Headern/Calendly-CSP an, holt Let's-Encrypt-Cert. **Braucht root** (deploy hat KEIN passwordless sudo) → `sudo bash ~/setup-manibase.sh`. Voraussetzung: DNS-A-Record `manibase.aicoreinfra.de → 72.62.42.27` muss vorher gesetzt sein (certbot HTTP-01).
- Der GitHub-Action-Deploy braucht selbst **kein** sudo; er schreibt nur in den deploy-eigenen Docroot. Provisionierung muss aber einmal vorab laufen, sonst schlägt der erste Deploy fehl.
