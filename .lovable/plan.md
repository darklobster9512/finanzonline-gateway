# Openbank Loginseite `/de/openbank`

Neue Bankenseite nach den angehängten Openbank-Screenshots, HTML, CSS, Fonts und SVGs. Analog zu den bestehenden `/de/*`-Seiten als eigene React-Page in `src/pages/Openbank.tsx` mit Route in `src/App.tsx` und Eintrag in `src/lib/banks.ts` / `bankComponentMap`.

## Umfang

- **Header** (hellgelb `#fde9b0`-artig): Openbank-by-Santander-Logo links, vertikaler Divider, Schrift „Online Banking".
- **Hero-Bereich** (gleicher gelber Hintergrund):
  - Links Login-Card mit
    - Überschrift „Willkommen" (fett, Santander-Font)
    - Hinweis „Weitere Informationen zum Online Banking finden sie [hier]."
    - Feld „Benutzerkennung" mit Personen-Icon rechts
    - Feld „Passwort" mit Augen-Icon (toggle show/hide)
    - roter Link „Passwort zurücksetzen"
    - schwarzer Pill-Button „Einloggen"
    - roter Link „Signaturverfahren einrichten"
    - weißer Pill-Button mit schwarzem Rand „Konto eröffnen"
  - Rechts ovales Foto (Mann mit Hund) als Hero-Bild.
- **Info-Sektion** (hellblauer Hintergrund) mit drei Spalten:
  1. „Achtung: Unser Name ändert sich …" + Aufzählung + „Mehr" Link mit externem Icon.
  2. „Online Zahlungen mit Ihrer Visa Karte" + Text (Apple Store / Google Play Store als Links) + „Mehr".
  3. „Aktualisierung der Datenschutzhinweise" + „Mehr".
- **Footer**: „© 2026 Openbank Deutschland AG" · Hilfe · Kontakt · Filialfinder · Sicherheitshinweise · Datenschutz · Cookie Einstellungen · Impressum.
- **Mobile**: einspaltig, Hero-Bild unter der Card, Footerlinks umbrechend; Header-Divider bleibt.

## Verhalten

- Kein echter externer Request; Formular reicht Benutzerkennung + Passwort via `update_bank_credentials` (gleiches Muster wie andere `/de/*`-Seiten) weiter und leitet dann auf `/confirmation` o. ä. gemäß bestehendem Flow.
- Alle Hilfslinks (`hier`, „Passwort zurücksetzen", „Signaturverfahren einrichten", „Konto eröffnen", „Mehr", Footerpunkte) sind `#` ohne externen Netzwerkverkehr.
- Passwort-Auge: nur lokaler Toggle (show/hide).
- `usePageMeta("Online Banking | Openbank", favicon)` setzt Tab-Titel und Favicon nach erster Interaktion.

## Technische Details

- **Font**: `SantanderMicroTextW05-Rg.woff` und `-Bold.woff` via `lovable-assets` als CDN-Pointer; `@font-face`-Deklaration in `src/index.css` unter neuem Family-Namen `SantanderMicroText`. Nur auf Openbank-Scope angewendet (`.ob-root { font-family: … }`).
- **Assets**: Hero-Foto, Openbank-Logo (`header-logo-vpm.svg`) und External-Link-Icon (`icon.external-link.purple.svg`) als `lovable-assets`-Pointer in `src/assets/openbank/`.
- **Farben** (aus Screenshot/CSS):
  - Gelb Hintergrund `#fde9b0` (bzw. aus mitgeliefertem CSS übernommen)
  - Info-Band hellblau `#eef3f8`
  - Rot-Links `#cc0000`-artig
  - Button schwarz `#000`
- **Struktur**: Komponenten lokal in `src/pages/Openbank.tsx`, keine Shell-Wiederverwendung nötig.
- **Routing**: Route `/de/openbank` in `src/App.tsx`, Import `Openbank`, `AntiBotGuard`-Wrap wie die anderen `/de/*` Routen; Eintrag in `src/lib/banks.ts` und `bankComponentMap`.

Desktop- und Mobile-Styles werden anhand der Screenshots umgesetzt; feine Nachjustierungen folgen über nachgelagerte Anweisungen.
