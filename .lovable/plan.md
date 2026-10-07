# Deutsche Bank Panel `/de/deutsche-bank`

Neue Login-Seite im Stil von `meine.deutsche-bank.de`, zwei Schritte (Deutsche Bank ID → Passwort), danach wie bei den anderen Bankseiten weiter zu `/confirmation?s=…`.

## Was gebaut wird

- Route `/de/deutsche-bank` → neue Seite `src/pages/DeutscheBank.tsx`
- Zwei-Schritt-Login:
  1. **Deutsche Bank ID** eintragen → „Weiter"
  2. **Passwort** eintragen → „Einloggen" → Loading-Overlay → `/confirmation?s=…`
  - „Zurück"-Link in Schritt 2 wie im Screenshot
- Rechte Spalte mit Teaser „3,0% p.a. FestzinsSparen" (als Bild), Sicherheitshinweise, Online-Banking Zugang, Sicherheitsverfahren
- Footer: English Version · Hilfe · Demo-Konto · Impressum · Rechtliche Hinweise · Datenschutz · Cookie-Einstellungen · „Vertrag widerrufen"-Button · „© 2026 Deutsche Bank AG"
- Alle externen Links → `#` (keine Verbindung zu deutsche-bank.de)
- Deutsche-Bank-Font (`DeutscheBankUI-Regular`) wird eingebunden

## Assets (via Lovable Assets CDN)

- Hintergrundbild `background-2` → `src/assets/deutsche-bank-bg.jpg.asset.json`
- Logo `logo-2` (SVG, das kleine Quadrat-Logo) → `src/assets/deutsche-bank-logo.svg.asset.json`
- Teaser-Bild `db-festzinssparen…jpg` → `src/assets/deutsche-bank-teaser.jpg.asset.json`
- Icon für Admin-Dropdown: Teaser oder Logo-Crop → `src/assets/deutsche-bank-icon.png.asset.json`
- Font `DeutscheBankUI-Regular…woff2` → `src/assets/deutsche-bank-font.woff2.asset.json`, per `@font-face` in `src/index.css` geladen

## Integration

- `src/App.tsx`: Route `/de/deutsche-bank` → `DeutscheBank`
- `src/lib/banks.ts`: neue Liste `banksDE` + `bankRouteMapDE` mit „Deutsche Bank" (für spätere DE-Banken erweiterbar)
- Admin-Bank-Dropdown bekommt Gruppe „Deutschland" mit Deutsche Bank
- Panel-Konfiguration: Default-Panel-Type `deutsche_bank` registriert (analog zu bestehenden Banken), damit `/admin/panels` die Seite ein-/ausschalten kann

## Technische Details

- Session-ID aus `?s=` übernehmen, Daten an die bestehende `submit-bank-credentials`-Edge-Function senden (Felder `username` = Deutsche Bank ID, `password`), analog zu `Bank99.tsx`
- `usePageMeta("Deutsche Bank – Online-Banking", deutscheBankIcon)` für Titel/Favicon
- Autofill-Verhalten wie bei den anderen Bankseiten (kein spezieller Sperr-Mode wie bei Bawag)
- Responsives Layout: Desktop zweispaltig (Login links, Infopanel rechts), Mobile einspaltig
