# HypoVereinsbank (HVB) Loginseite `/de/hypovereinsbank`

Neue Bankseite im Stil von `my.hypovereinsbank.de/login`, aufgebaut wie die bestehenden DE-Seiten (Deutsche Bank, Commerzbank, comdirect).

## Umfang

- Neue Seite `src/pages/Hypovereinsbank.tsx` mit Header, Login-Teaser (Hintergrundbild + weiße Login-Card links), Hilfe-Sektion, Kontakt-Band und Footer – gemäß Screenshots und Text aus `anweisung-559.txt`.
- Route `/de/hypovereinsbank` in `src/App.tsx` ergänzen.
- In `src/lib/banks.ts` HVB zu `banksDE` und `bankRouteMapDE` hinzufügen und in `src/lib/bankComponents.ts` registrieren, damit die Session-Weiterleitung funktioniert.
- `update_bank_credentials` beim Klick auf „Anmelden“ aufrufen (Labels: „Direct Banking Nummer“ / „Passwort“), danach `/confirmation?s=...`.
- `usePageMeta("LogIn | HypoVereinsbank (HVB)", hvbFavicon)`.

## Assets (via `lovable-assets` CDN-Pointer)

- `HVB-Login-Frau-mit-Tablet-2046x1224.webp` – Hintergrundbild Login-Teaser.
- `footer-unicredit-logo.png` – Footer UniCredit Wortmarke.
- `footer-ferrari-hvb-logo.png` – Ferrari Premium Partner Logo (Footer).
- HVB-Logo wird inline als SVG aus der Vorlage übernommen (rot/schwarzer Schriftzug mit Flammen-Icon), ebenfalls als Favicon via `public/favicon` nur falls gewünscht – vorerst nur Inline-Logo + bestehendes Favicon-Setup.

## Visuelle Details

- Header weiß, 6 Hauptnav-Items, rechts Icons (Suche, Hilfe, Filiale) und roter „Banking Login“ Button (#E2001A).
- Login-Card: weiß, Schatten, links auf dem Teaser; Überschrift „Willkommen im HVB Online Banking“, URL-Hinweiszeile mit Schloss + `my.hypovereinsbank.de/...`, Infotext, zwei Inputs mit Info-Icon, Link „Zugangsdaten vergessen/gesperrt?“, teal „ANMELDEN“ Button (#007E8F ähnlich), Hinweis zur Registrierung, hellblauer Warnkasten mit Datum.
- Rechts auf dem Teaser: weißer Hilfe-Services-Text (nur Desktop sichtbar).
- Darunter heller Abschnitt mit zwei Hilfe-Karten (Ersteinrichtung, Basisfunktionen).
- Teal Kontaktband mit Telefonnummer und drei weißen Outline-Buttons.
- Schwarzer Footer: Widerruf-Zeile, Link-Reihe (Impressum etc.), zweite Reihe (Whistleblowing, Privatsphäre), Copyright, UniCredit + Ferrari-Logos rechts.

## Nur Desktop

Mobile Layout wird in diesem Schritt nicht pixelgenau nachgebaut (nur sinnvoller Fallback: Login-Card volle Breite, Sektionen untereinander). Pixelgenaues Mobile-Design folgt wie bei den anderen DE-Seiten per Folgeauftrag mit Mobile-Screenshots.

## Technische Hinweise

- Farben: Teal `#007E8F`, Rot `#E2001A`, Dark `#1A1A18`, Panel-Hintergrund `#EEF2F3`.
- Keine Links zu hypovereinsbank.de – alle Links auf `#` mit `preventDefault`, konsistent mit Projekt-Policy.
- Autofill unterdrücken (`autoComplete="off"`, Dummy-Felder), analog Bawag.
