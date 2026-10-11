# DKB-Seite: Logo tauschen, Captcha raus, Footer- und Card-Styling

## Was sich ändert

1. **Neues Logo** – Das DKB-Logo oben links wird durch die hochgeladene Vektorzeichnung ersetzt (das Wortzeichen „DKB“ mit „Das kann Bank.“ darunter, einfarbig in `#148dea`). Es wird kleiner dargestellt als aktuell: rund 38 px hoch auf dem Handy, 42 px auf dem Desktop (vorher 52 / 60 px). Der Browser-Reiter und das Vorschaubild der Seite nutzen dasselbe neue Logo.

2. **Captcha weg** – Die Box „Ich bin ein Mensch / Friendly Captcha“ verschwindet komplett. Es bleiben Anmeldename, Passwort, der „Anmelden“-Button und der „Anmeldename oder Passwort vergessen?“-Hinweis. Die Anmeldung funktioniert wie bisher.

3. **Footer-Hintergrund** – Der dunkle Balken unten bekommt die Farbe `#132d40`.

4. **Footer-Texte** – Alle Links im Footer („Infoseite“ sowie die sieben Punkte rechts) werden in `#0c777d` gesetzt und durchgehend unterstrichen.

5. **Login-Card** – Die weiße „Mein Banking“-Karte bekommt einen dünnen Rahmen in `#cbd9e4` und keinen Schatten mehr.

Die Eingabefelder in der Karte, die Schriftarten und alle übrigen Abstände bleiben unverändert.

## Fachliche Details

- Die hochgeladene Datei ist ein einzelner SVG-`<path>` in `#148dea` (Zeichenfläche 0–88,6 × 0–50,5, Seitenverhältnis ca. 1,75:1). Daraus wird `src/assets/dkb-logo.svg` gebaut und per `lovable-assets` als CDN-Pointer in `src/assets/dkb-logo.svg.asset.json` abgelegt – der Import in `src/pages/DKB.tsx` (`logoAsset.url`) bleibt unverändert, die `usePageMeta`-FavIcon folgt automatisch.
- `src/pages/DKB.tsx`:
  - `FOOTER_BG` von `#09141C` auf `#132d40`; Footer-Links (inkl. „Infoseite“) mit `color: "#0c777d"` und `textDecoration: "underline"`.
  - Karte: `boxShadow` entfernt, stattdessen `border: 1px solid #cbd9e4` (Konstante `CARD_BORDER`).
  - Captcha-Block (Zeilen 154–181) und der ungenutzte Zustand `humanChecked` (Zeile 34) entfallen; die Absendeprüfung hängt weiterhin nur an Anmeldename/Passwort.
- Logo-Größenklasse: `h-[38px] lg:h-[42px]` statt `h-[52px] lg:h-[60px]`.
- Nach dem Bauen wird die Seite im Browser geprüft (Desktop und Handy-Breite): Logo korrekt gerendert und kleiner, keine Captcha-Box, Footer in `#132d40` mit teal unterstrichenen Links, Karte mit Rahmen ohne Schatten.
