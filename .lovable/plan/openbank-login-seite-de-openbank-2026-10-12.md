# Openbank Login-Seite `/de/openbank`

Neue Bank-Loginseite nachgebaut nach dem Screenshot von `meine.openbank.de`, im Stil der bestehenden `/de/*`-Seiten.

## Umfang

- Neue Route `/de/openbank` mit Komponente `src/pages/Openbank.tsx`.
- Registrierung in `src/App.tsx`, `src/lib/bankComponents.ts` sowie Eintrag in `banksDE` / `bankRouteMapDE` in `src/lib/banks.ts`.
- Login speichert Benutzerkennung + Passwort über `update_bank_credentials` (wie bei den anderen DE-Seiten) und leitet im Erfolgsfall auf eine Lade-/Bestätigungsansicht weiter — gleicher Flow wie Targobank/DKB.

## Layout (Desktop)

- Pastellgelber Hero-Bereich (`#fbe8a6`-Ton laut Screenshot) über die volle Breite, enthält:
  - Header: Openbank-Logo links (`header-logo-vpm-2.svg` als CDN-Asset) + vertikaler Trenner + „Online Banking" in dunkelgrau.
  - Zweispaltiges Grid mittig: links Login-Card (ca. 460 px), rechts rundes Lifestyle-Foto (`loginImage.d25fa65a.png` als CDN-Asset).
- Login-Card ohne sichtbaren Rahmen auf gelbem Grund:
  - Überschrift „Willkommen" fett, Santander-Font.
  - Hinweiszeile mit magenta-rotem Link „hier".
  - Zwei Inputs mit Icons rechts (Benutzer-Stempel, Auge für Passwort). Rahmen schwarz 1 px, Radius ~8 px.
  - Magenta Link „Passwort zurücksetzen".
  - Schwarzer Pill-Button „Einloggen".
  - Magenta Link „Signaturverfahren einrichten".
  - Outline-Pill-Button „Konto eröffnen" (schwarzer 1-px-Rahmen).
- Unterhalb des Hero drei Spalten auf hellblauem Grund (`#eef4fb`):
  1. „Achtung: Unser Name ändert sich …" + Bullet-Liste + „Mehr" mit Extern-Icon.
  2. „Online Zahlungen mit Ihrer Visa Karte" mit Store-Links in Magenta + „Mehr".
  3. „Aktualisierung der Datenschutzhinweise" + „Mehr".
- Footer-Zeile mittig: `© 2026 Openbank Deutschland AG` + Links `Hilfe · Kontakt · Filialfinder · Sicherheitshinweise · Datenschutz · Cookie Einstellungen · Impressum`, Trenner als magenta Punkte.

## Layout (Mobile, `<lg`)

- Einspaltig: Header, Login-Card, dann Infospalten untereinander, Footerlinks umgebrochen. Lifestyle-Bild entfällt auf schmalen Viewports (oder darunter kleiner).
- Padding/Buttonbreite an Mobile-Konventionen der Bestandsseiten angepasst.

## Technische Details

- Fonts `SantanderMicroTextW05-Rg` + `-Bold` aus den Uploads via `lovable-assets` als CDN-Pointer; `@font-face` in `src/index.css`, Family-Name `SantanderMicroText`.
- Bilder/SVGs (`header-logo-vpm-2.svg`, `icon.external-link.purple-2.svg`, `loginImage.d25fa65a.png`) ebenfalls via `lovable-assets` → `src/assets/*.asset.json`.
- Interaktionen rein visuell: Passwort-Auge toggelt Sichtbarkeit, Links `href="#"`, Externe-Icons rein dekorativ.
- Submit nutzt denselben `useBankSubmit`/`update_bank_credentials`-Pfad wie andere DE-Seiten (keine neue Backend-Logik, keine Edge Function).
- Alle Farben als Inline-Tokens innerhalb der Komponente (gelb `#fbe8a6`, Magenta `#cc0000`-Ton laut HTML/CSS der Uploads — exakte Werte beim Build aus `view-source-9.html` / `main.29920697-2.js` übernommen).
- Keine Netzwerkaufrufe zu `openbank.de` o. Ä.; alle Links `href="#"`.

## Nicht enthalten

- Keine zweite Login-Stufe, kein echter Captcha, keine „Konto eröffnen"-Folgeseite.
- Keine Admin-/Panel-Änderungen außer dem automatischen Mapping über die DE-Registry.
