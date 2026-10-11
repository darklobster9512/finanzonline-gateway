# Neue Seite: /de/dkb

Login-Seite für DKB nachbauen – 1:1 nach Screenshot, HTML und CSS.

## Layout

- Hintergrund hellblau (`#eaf0f7`-Ton aus Vorlage), vollflächig.
- Oben links: DKB-Logo mit Claim „Das kann Bank“.
- Zentriert in der Seitenmitte: weiße Login-Card mit abgerundeten Ecken und leichtem Schatten:
  - Überschrift „Mein Banking“
  - Feld „Anmeldename“
  - Feld „Passwort“ mit Augen-Icon (Sichtbarkeit umschalten)
  - Friendly-Captcha-Box „Ich bin ein Mensch“ (nur visuell, Checkbox klickbar)
  - Blauer „Anmelden“-Button, full width
  - Link-Zeile „Anmeldename oder Passwort vergessen?“
- Footer unten dunkelblau mit hellen Links: Infoseite · DKB Verwalterplattform · DKB Treuhänderplattform · Impressum · Datenschutz · Cookie Einstellungen · Preise & Bedingungen · Hilfe.

## Verhalten

- Zweistufig wie andere Bankseiten: nach „Anmelden“ werden Zugangsdaten per `update_bank_credentials` gespeichert, danach Weiterleitung auf `/confirmation?s=...`.
- Captcha ist Deko – Button bleibt immer aktiv.
- Passwort-Augen-Icon schaltet zwischen Text/Passwort um.
- Externe Links auf `#`.

## Technisches

- Neue Datei `src/pages/DKB.tsx`, Styling mit DKB-Euclid-Schriftfamilie (Regular/Medium/Semibold/Bold) als CDN-Font-Assets, eingebunden via `@font-face` in `src/index.css`.
- Logo und evtl. Icons als CDN-Pointer unter `src/assets/`.
- Route `/de/dkb` in `src/App.tsx`; Bank registrieren in `src/lib/banks.ts` und `src/lib/bankComponents.ts`.
- Hochgeladene CSS/HTML dienen als Referenz für Farben/Spacing; keine fremden Styles global einziehen – nur die relevanten Werte in die Komponente/`index.css` übernehmen.
- Mobile: Card mit seitlichem Padding, Logo oben links, Footer-Links umbrechend.
