# apoBank Loginseite `/de/apobank`

Nachbau der apoBank-Loginseite laut Screenshot, HTML, CSS, Logo und Fonts.

## Seitenaufbau

- Weiße Seite, zentrierte Login-Card (max ca. 900 px breit)
- Card-Kopf weiß mit großem blauen Titel „Login apoBank"
- Card-Body hellgrau (`#eef2f5`-artig, aus CSS übernehmen):
  - „Willkommen im Online-Banking der apoBank" (fett)
  - Zwei Zeilen Label links, Input rechts: „Benutzername", „Passwort"
  - Rechts darunter Button „Anmelden" (outline, blau)
  - Hinweiszeile: „Mit dem Absenden Ihrer Anmeldedaten erkennen Sie die [Sicherheitshinweise] an."
  - Abschnitt „Maßnahmen für sicheres Online-Banking:" mit zwei Icon-Zeilen (Schloss, Mail)
  - Telefonzeile mit Hörer-Icon „+49 211 5998 8000" + Link „Hotlines der apoBank"
- Unterhalb der Card zentriertes apoBank-Logo mit Zusatz „Bank der Gesundheit"

## Login-Flow

- Submit → `update_bank_credentials({ bank: 'apobank', username, password, p_username_label: 'Benutzername', p_password_label: 'Passwort' })`
- `LoadingOverlay` → Weiterleitung `/confirmation?s=…`

## Technisch

- Neue Datei `src/pages/Apobank.tsx` nach Muster `Openbank.tsx`
- Route `/de/apobank` in `src/App.tsx`, Einträge in `src/lib/banks.ts` und `src/lib/bankComponents.ts`
- Logo (`apobank_logo_zusatz.svg`), Source Sans Pro Regular/Semibold woff als `lovable-assets` CDN-Pointer unter `src/assets/apobank/`
- `@font-face` für SourceSansPro im seiteninternen `<style>`-Block
- Farben, Schriftgrößen, Spacings, Button- und Inputstyles aus hochgeladenem `styles.cb4abc7453351435.css` übernehmen
- Icons (Schloss, Mail, Telefon) als Inline-SVG im Stil der Vorlage (dünne Linien, dunkelblau)
- Nur Desktop-Umsetzung in diesem Schritt; grobe Responsivität (Card schrumpft), Mobile-Feinschliff folgt in späterer Anweisung
