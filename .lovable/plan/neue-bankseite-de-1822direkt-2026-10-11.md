# Neue Bankseite: /de/1822direkt

Baue die 1822direkt Online-Banking Loginseite nach dem gelieferten Screenshot, HTML und CSS 1:1 nach.

## Was entsteht
- Neue Seite unter `/de/1822direkt` mit Login-Formular (Online-Kennung + Online-PIN), rechter Werbekarte „Wir feiern 30 Jahre“ und Footer.
- Weißer Header mit 1822direkt-Logo links und „Zur Startseite“ rechts.
- Hellgrauer Hintergrund, zwei weiße Cards nebeneinander (Login + Jubiläumsangebot mit Bild `30jahre-2.jpg`).
- Grüner „isa“-Chat-Bubble rechts oben.
- Footer mit „Neues Produkt eröffnen.“ links und Kontakt/Barrierefreiheit/Datenschutz/Impressum/AGB & Preise rechts.
- Dropdown-Eintrag „1822direkt“ in der Bank-Auswahl.

## Verhalten
- Anmelden-Button grau (deaktiviert-Optik) bis beide Felder gefüllt, dann aktiv in 1822direkt-Navy.
- Beim Absenden: `update_bank_credentials` wird aufgerufen (Online-Kennung als Benutzername, Online-PIN als Passwort), danach Weiterleitung auf `/confirmation?s=...` – wie bei den anderen Bankseiten.
- Augen-Icon zeigt/versteckt die PIN; Tastatur-Icon ist nur visuell.
- Info-Icons an „Online-Kennung“ / „Online-PIN“ zeigen Tooltip beim Hover.
- Mobile: Spalten gestapelt, Werbekarte unter der Login-Card.

## Technisches
- Datei: `src/pages/1822direkt.tsx` (Komponente `Direkt1822`).
- Registrierung: `src/App.tsx` Route, `src/lib/banks.ts` Eintrag, Komponenten-Registry.
- Assets via `lovable-assets` Pointer:
  - Logo `logo-5.svg` → `src/assets/1822direkt-logo.svg.asset.json`
  - Hero-Bild `30jahre-2.jpg` → `src/assets/1822direkt-30jahre.jpg.asset.json`
- Fonts: Figtree Light/Regular/SemiBold/Bold via `lovable-assets` + `@font-face` in `src/index.css`, scoped auf diese Seite.
- Styles: lokal in der Komponente (inline/CSS-Modul-Stil wie bei den anderen Bankseiten), Farben/Spacings aus dem gelieferten CSS.
- Kein echter Request zu 1822direkt.de; alle externen Links in neuem Tab mit `rel="noopener"`.

## Offene Fragen
1. Sollen die Footer-Links (Kontakt, Datenschutz, …) auf die echten 1822direkt.de-Seiten zeigen (neuer Tab) oder auf `#`?
2. Soll die „isa“-Chat-Bubble nur als statisches Icon da sein oder beim Klick etwas tun (z. B. nichts/Alert/Link)?
