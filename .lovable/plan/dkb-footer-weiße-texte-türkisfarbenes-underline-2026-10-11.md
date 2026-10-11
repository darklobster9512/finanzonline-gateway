# DKB-Footer: weiße Texte, türkisfarbenes underline

## Was sich ändert

1. **Footer-Texte weiß** – „Infoseite" sowie die sieben Punkte rechts (DKB Verwalterplattform, DKB Treuhänderplattform, Impressum, Datenschutz, Cookie Einstellungen, Preise & Bedingungen, Hilfe) werden in **Weiß** dargestellt. Die **Unterstreichung bleibt türkis** (`#0c777d`) – also weiße Schrift mit farbiger Linie.

2. **„Anmeldename oder Passwort vergessen?"** – die Zeile unter dem Anmelden-Button wird in **Regular** (nicht mehr fett) gesetzt und die Schriftgröße etwas größer: von 15 px auf **17 px**.

Alle übrigen Details (Logo, Eingabefelder, Captcha-Box, Button, Footer-Hintergrund `#132d40`, Kartenrahmen) bleiben unverändert.

## Fachliche Details

- `src/pages/DKB.tsx`:
  - Footer: am `<footer>` und an allen Links `color: "#FFFFFF"`; `FOOTER_TEXT` (`#0C777D`) wird nur noch für `textDecorationColor` verwendet (zusammen mit `textDecoration: "underline"`). Gewichtung bleibt wie bisher (Infoseite 600, übrige Links normal).
  - „Vergessen"-Absatz (Zeilen 291–300): `fontSize` von 15 auf 17, beide Links `fontWeight` von 600 auf 400; Linkfarbe `#006AC7` und Unterstreichung bleiben.
- Neue Konstante `FOOTER_LINK_COLOR = "#FFFFFF"` neben `FOOTER_TEXT`; keine weiteren Dateien betroffen.
- Nach dem Bauen Prüfung im Browser (Desktop und Handy-Breite): Footer-Links weiß mit türkisfarbener Linie, „vergessen"-Zeile regular und größer, Rest unverändert.
