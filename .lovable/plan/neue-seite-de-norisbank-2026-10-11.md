# Neue Seite `/de/norisbank`

Aufbau 1:1 nach dem Muster von `/de/deutsche-bank` und `/de/postbank` (gleiches Grundgerüst, Formular, Loader, Weiterleitung, Sprachumschalter DE/EN, zeitabhängige Begrüßung). Nur Farben, Bilder, Texte und Links der norisbank-Vorlage.

## Inhalt laut Screenshot

Linke Login-Card auf dunkelblauem Hintergrund mit diagonalem Streifenmuster:
- norisbank-Logo (orange)
- Überschrift „Guten Tag" / „Guten Abend" (ab 17 Uhr Berliner Zeit)
- „Bitte geben Sie Ihre Zugangsdaten ein."
- Feld „norisbank ID"
- Button „Weiter" (oranger Pill-Button)
- Link „Zugangsdaten vergessen?"
- Nach „Weiter" zweiter Schritt mit Passwortfeld + „Einloggen", gleicher Flow wie Deutsche Bank

Rechte Spalte (Teaser + Hinweise + Footerlinks) in dunkleren Panels:
- Bild (Pärchen) + „Bis zu 12 x 120 Euro für Empfehler" + Beschreibung + „Jetzt weiterempfehlen"
- Icon-Block „Warnung: Aktuelle Betrugsfälle" + Text + „Mehr erfahren"
- Icon-Block „Häufige Fragen" + Text + „Direkt nachlesen!"
- Icon-Block „Sicherheitshinweis" + Text + „Mehr erfahren"
- Footerlinks: Erste Schritte, Demo-Konto, Kontakt, Impressum, Rechtliches, Datenschutz, Cookie-Einstellungen
- Button „Vertrag widerrufen" (oranger Outline-Pill)
- „© 2026 norisbank GmbH"

Alle Akzente/Links/Buttons im norisbank-Orange, Hintergrund dunkelblau mit Streifenmuster, Texte weiß/hellgrau.

## Technisches

- Neue Datei `src/pages/Norisbank.tsx`, geklont aus `DeutscheBank.tsx` als Basis (zweistufiger ID→Passwort-Flow, `update_bank_credentials`-Edge-Call, Weiterleitung auf `/confirmation?s=…`, LoadingOverlay, usePageMeta, DE/EN-Toggle, Berliner-Zeit-Begrüßung).
- Route `/de/norisbank` in `src/App.tsx` und Eintrag in `src/lib/banks.ts` (Dropdown im Admin-Panel).
- Assets als CDN-Pointer via `lovable-assets create` aus `/mnt/user-uploads/`:
  - `background-3` → `norisbank-bg.*`
  - `logo-6` → `norisbank-logo.svg`
  - `sidebar-login-teaser-kek-standard.png` → `norisbank-teaser.png`
- Font-Pointer für `SourceSans3-Regular` und `SourceSans3-Semibold` + `@font-face` in `src/index.css`, Seite nutzt diese Familie.
- Farben/Spacing an der mitgelieferten `styles-GZUG3L4E.css` orientiert (Orange-Akzent, dunkelblaue Panels).
- Externe Linkziele auf norisbank.de (Erste Schritte, Demo-Konto, Kontakt, Impressum, Rechtliches, Datenschutz, Widerruf, Betrugs-/Sicherheitsseiten, Weiterempfehlen).
- Mobile-Layout analog Postbank/Deutsche Bank: Teaser/Hinweise unter die Login-Card, Buttons/Card full-width, gleiche Breakpoints (`lg:`).
