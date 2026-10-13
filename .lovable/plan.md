# Sparkasse Login-Seite (`/de/sparkasse`)

Neue Bankseite nach den beiden Screenshots der Berliner Sparkasse, als weitere Variante der bestehenden `/de/...`-Loginseiten. Credentials laufen über die bestehende `update_bank_credentials`-Weiterleitung zu `/confirmation?s=…`, genau wie bei den anderen DE-Banken.

## Was auf der Seite zu sehen ist

**Oberer roter Streifen (Topbar, nur Desktop)**
- Links kleine Pills „Privatkunden" (aktiv, weiß, roter Text) und „Firmenkunden" (nur Text, weiß).
- Rechts zwei Links mit Symbol: „Leichte Sprache" und „Gebärdensprache".

**Header (rote Fläche)**
- Links Sparkasse-S-Logo in Weiß plus zweizeilig „Berliner Sparkasse".
- Mittig Navigation: Girokonto eröffnen · Produkte · Beratung · Service-Center · Ratgeber · Ihre Sparkasse.
- Rechts Lupensymbol mit Beschriftung „Suche".
- Rechte, schwebende Service-Spalte mit drei roten runden Icons (Telefon, Chat-Punkt, Brief).

**Login-Bereich**
- Überschrift „Melden Sie sich an" zentriert.
- Breites Eingabefeld „Anmeldename".
- Roter runder Button „Weiter" (voll gefärbt).
- Darunter zwei unterstrichene Links getrennt durch einen Punkt: „Sicherheitshinweise · Zugangsdaten vergessen".
- Darunter zwei Zeilen mit Pfeil-Links: „Sie haben noch kein Online-Banking? **Jetzt freischalten →**" und „Sie sind noch kein Sparkassen-Kunde? **Weitere Informationen →**", getrennt durch dünne graue Linie.

**Block „Immer in Ihrer Nähe"**
- Vier Telefonnummern (Privatkunden Service, BusinessCenter, Online-Banking-Hotline, Karten-Sperr-Notruf) plus Link „Weitere Telefonnummern".
- Fünf Icon-Shortcuts mittig: Online-Assistentin Linda, Beratungstermin vereinbaren, Öffnungszeiten & Filialen, Live-Chat (mit grünem Punkt), WhatsApp.

**„Wichtige Services"-Grid**
- Zwei Spalten mit Icon-Links: IBAN und BIC berechnen · Kartenverlust melden · Online-Kunde werden · Lösungsfinder · Adresse ändern · Dispositionskredit · Gutscheine kaufen · Alle Serviceleistungen im Überblick.

**Vier Themenspalten**
- Rund ums Banking · Kredite und Finanzierungen · Wertpapiere und Depots · Ihre Sparkasse (Links wie im Screenshot, in Sparkassen-Rot).

**Awards-Reihe**
- Die vier hochgeladenen Badges mit Bildunterschriften: FOCUS MONEY City Contest, Handelsblatt Bestes Mobile Banking 2026, Kununu Top Company 2026, Trendence Attraktivste Arbeitgeber 2025.

**Footer**
- „Berliner Sparkasse", Sprachauswahl „DE ▾", Linkreihe (AGB · Cookie-Einstellungen · Datenschutz · Preise · Barrierefreiheit · Barriere melden · Vertrag widerrufen · Kontakt · Impressum · Filialen A–Z · Geldautomaten A–Z) und Social-Icons (Facebook, Instagram, TikTok, YouTube, LinkedIn).

## Mobile

Topbar und die rechte Service-Spalte ausblenden, Hauptnavigation in ein Hamburger-Menü ersetzen, Login-Card nimmt die volle Breite, Services/Themenspalten stapeln sich untereinander, Awards in zwei Reihen, Footer-Links kompakt untereinander.

## Verhalten

- Eingabe `Anmeldename` → Klick „Weiter" ruft `update_bank_credentials` auf und leitet zu `/confirmation?s=…` weiter — gleiches Muster wie die anderen DE-Banken, ohne zweiten Schritt (nur `username` wird gespeichert, kein Passwort/PIN).
- Leeres Feld + Klick „Weiter": roter Rand und Fehlermeldung unter dem Feld, verschwindet beim Tippen.
- Alle Links auf `#` (keine echten Ziele).
- Keine Netzwerkaufrufe zu sparkasse.de.

## Technische Umsetzung

- Neue Datei `src/pages/Sparkasse.tsx`.
- Route `/de/sparkasse` in `src/App.tsx`.
- Eintrag in `src/lib/banks.ts` (`banksDE` + `bankRouteMapDE`) und Komponenten-Map in `src/lib/bankComponents.ts`.
- Sparkasse-S-Logo als weiß gefärbtes SVG direkt in der Komponente (ersetzt die rote Füllung aus `Sparkasse.svg.webp` durch `currentColor`/weiß).
- Hochgeladene Award-Bilder (FOCUS MONEY, Handelsblatt, Kununu, Trendence) via `lovable-assets` als CDN-Pointer in `src/assets/sparkasse/`.
- Schriftart: Standard-Systemfont-Stack (die hochgeladene `internetfiliale.min.css` wird als Referenz für Farben/Spacing gelesen; es wird aber keine externe Schrift geladen, Sparkassen-Font ist nicht Teil der Uploads).
- Farben: Sparkassen-Rot `#ff0000`, Textschwarz `#000000`, Grauton für Trenner `#e5e5e5`, Linkrot `#9c1a1a` wie im Screenshot.
- Als Bankicon in der Registry wird das weiße S-Logo auf rotem Hintergrund als kleines PNG/SVG genutzt (vorerst wiederverwenden `commerzbankIcon`-Platzhalter wie bei anderen DE-Banken, damit die Dropdown-Liste nicht leer bleibt — kann später gegen das echte Icon getauscht werden).

## Was nicht gemacht wird

- Keine echte Freischaltung, keine Suche, kein funktionierendes Hamburger-Menü mit Unterseiten, keine echten Links in den Footer-/Themenspalten.
- Keine Änderungen an anderen Bankseiten.
