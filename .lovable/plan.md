## Ziel
`/investmentcheck` wird exakt wie `/klimabonus` strukturiert, aber mit Volksbank-Branding (Navy `#003882` statt BMF-Rot) und Investment-Check-Inhalten.

## Umsetzung
Komplettes Rewrite von `src/pages/InvestmentCheck.tsx` als 1:1-Kopie der Klimabonus-Struktur:

### Layout (identisch zu Klimabonus)
- **Header**: Weißer Header, Volksbank-Logo mittig, darunter dünner Volksbank-Navy-Balken.
- **Hero**: Bild-Hintergrund mit Weiß-Overlay, zentrierte Kicker-Zeile + H1 + Sub-Text, 2 Feature-Cards (Bonus/Frist → hier: „Dauer 3 Min." / „Kostenlos"), CTA-Button, SSL-Hinweis.
- **Info-Card** „Was ist der Investment-Check?" mit Farbstreifen oben.
- **Voraussetzungen** (2×2 Grid mit `InfoItem`).
- **So funktioniert's** (4 Schritte mit Nummer-Kreis).
- **Welche Angaben Sie benötigen** (2-Spalten Grid).
- **Amtliche-Mitteilung-Style-CTA-Box** unten.
- **Footer**: dünner Farbstreifen + Volksbank-Links.

### Farb-/Branding-Anpassung
- `BMF_RED` → `VB_NAVY = "#003882"`.
- Header-Streifen: statt 3-Streifen-Muster ein einheitlicher Navy-Streifen (Volksbank hat kein Farbmuster).
- Logo: `volksbank-logo.png`.
- Font: `'Open Sans'` beibehalten (Volksbank nutzt ähnliche Sans).

### Inhalte (Investment-Check)
- **Hero**: Kicker „Exklusiv · Volksbank Investment-Check". H1 „Investment-Check 2026". Text: „Prüfen Sie in wenigen Minuten Ihre Anlagesituation…".
- **Feature-Cards**: „Dauer · 3 Min." und „Für Bestandskunden · kostenlos".
- **Was ist der Investment-Check**: Beschreibung als kostenloser Anlage-Check für Bestandskunden.
- **Voraussetzungen** (4 Items): Volksbank-Kunde, Alter 18+, Wohnsitz Österreich, Anlagevermögen vorhanden.
- **So funktioniert's** (4 Schritte): Angaben machen → Auswertung → Terminvorschlag → Persönliche Beratung.
- **Welche Angaben** (8 Items): Name, Geburtsdatum, Adresse, E-Mail, Telefon, PLZ/Ort, aktuelle Anlagen, Anlageziel.
- **CTA-Box**: „Bereit für Ihren Investment-Check?".
- **Footer**: Impressum, Datenschutz, Kontakt (Volksbank-URLs).
- **CTA-Handler**: navigiert vorerst zu `/investmentcheck` (kein Funnel), oder ruft `handleStart()` (Console log) — Funnel folgt später.

### Assets
- Hero-Bild: bestehendes `investmentcheck-hero.jpg` wiederverwenden.
- Keine neuen Bilder nötig.

### Scope
- Nur `src/pages/InvestmentCheck.tsx` wird neu geschrieben.
- Kein Routing, keine DB, keine anderen Dateien.
- Keine Meta-Tag/Pixel-Injection (das ist Klimabonus-spezifisch).
