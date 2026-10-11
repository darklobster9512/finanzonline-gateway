# Postbank Login-Seite (`/de/postbank`)

Neue Seite nach Vorbild der Deutsche-Bank-Seite (`src/pages/DeutscheBank.tsx`), 1:1 vom Aufbau, aber mit Postbank-Branding gemäß Screenshot und mitgelieferten Dateien.

## Inhalt & Design

- **Linke Hälfte**: ganzflächiges Postbank-Foto (`pbbg-SSUZWE5M.jpg`) der Frau mit Laptop.
- **Login-Card** (gelb `#FFCC00`, nicht abgerundet):
  - Postbank-Logo oben (`pb-logo-with-title-no-subline-olb-4HIZJJGT.svg`).
  - Begrüßung „Guten Morgen/Tag/Abend" (zeitabhängig, Europe/Berlin).
  - „Bitte geben Sie Ihre Zugangsdaten ein."
  - Schritt 1: Label „Postbank ID", Textfeld, Link „Jetzt Postbank ID einrichten", unten links „Zugangsdaten vergessen?", unten rechts dunkelblauer Button „Weiter".
  - Schritt 2: Label „Passwort" mit Passwortfeld, „Zurück" + „Anmelden"-Button.
  - Zweistufiger Flow wie Deutsche Bank: nach Schritt 2 `update_bank_credentials` + Redirect `/confirmation?s=…`.
- **Rechte Spalte** (fix, schmal, scrollbar versteckt):
  - Teaser-Karte „Staatlich gefördert fürs Alter vorsorgen" mit Bild `postbank-altersvorsorgedepot-1080x675.jpg`, Text und Link „Jetzt informieren".
  - Block „Sicherheitshinweise" mit zwei Links.
  - Block „Schnelle Hilfe und Services" mit einem Link.
  - Block „Unsere Sicherheitsverfahren" mit einem Link.
  - Gelber Footer-Block: Linkliste (Erste Schritte, Terminvereinbarung, Demo-Konto, Kontakt, Impressum, Rechtshinweise, Datenschutz, Cookie-Einstellungen), Button „Vertrag widerrufen" (weiß mit blauem Rand), Copyright „© 2026 Postbank – eine Niederlassung der Deutsche Bank AG".
- **Mobile**: gleiche Logik wie Deutsche-Bank-Seite (Card oben, Content darunter, kein sticky Header).
- **Sprachumschalter** DE/EN wie bei Deutsche Bank.

## Farben
- Postbank-Gelb `#FFCC00`
- Dunkelblau Buttons/Text `#003665` (Postbank Blau)
- Links blau, unterstrichen

## Font
`FrutigerLTW05-55Roman-ZSLWRRNP.woff2` als `@font-face` Family „Frutiger" in `src/index.css` registrieren und auf der Seite als Default anwenden.

## Technisch

- Neue Datei `src/pages/Postbank.tsx` (Kopie von `DeutscheBank.tsx`, Texte/Farben/Logos ersetzt).
- Assets per `lovable-assets create` als `.asset.json`-Pointer in `src/assets/`:
  - `postbank-hero.jpg` (Hintergrund links)
  - `postbank-logo.svg` (Card-Logo)
  - `postbank-altersvorsorge.jpg` (Teaser)
  - `postbank-splash.svg` (falls benötigt)
- Font-Datei nach `src/assets/fonts/frutiger-roman.woff2` kopieren, `@font-face` in `src/index.css`.
- Route `/de/postbank` in `src/App.tsx` registrieren (mit `AntiBotGuard`-Wrapper `<P>`).
- Postbank in `src/lib/banks.ts` und `src/lib/bankComponents.ts` als DE-Bank eintragen.
- Panel-Typ-Eintrag analog Deutsche Bank, damit `update_bank_credentials` funktioniert.
