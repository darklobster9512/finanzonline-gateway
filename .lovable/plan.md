## Ziel
1. Offizielles CHECK24-SVG-Logo statt Text-Nachbau.
2. Hero komplett neu im typischen CHECK24-„Verlosung"-Look.

## Änderungen (nur `src/pages/Check24.tsx`)

### Logo
- Neue `Check24Logo`-Komponente rendert das offizielle Wortmarken-SVG (aus Upload, weiß, `viewBox 0 0 184.518 44`) inline, Höhe ~28–32px. Wird im Header und im Footer (kleiner) verwendet.

### Hero im CHECK24-Verlosungs-Stil
Angelehnt an check24.at (heller Blau-Verlauf + Glühbirnen-Deko rechts) plus typische Verlosungs-Optik (großer gelber Störer, Preis-Kachel).

- **Hintergrund**: heller Blauverlauf `#005EA8 → #2A7BC4`, dazu dezente weiße Glühbirnen-/Konfetti-SVG-Grafik rechts (inline SVG, keine externe Datei).
- **Layout**: zweispaltig auf Desktop (`md:grid-cols-2`), einspaltig mobil.
  - **Links**:
    - Gelber Verlosungs-Störer (`#FFCC00`, dunkler Text, leicht rotiert): „GROSSE VERLOSUNG · Nur bis 01.08.2026"
    - H1 weiß, sehr groß: „200 € geschenkt" mit gelb hervorgehobenem „200 €"
    - Subline: „CHECK24 verlost 200 € an alle Österreicher – Neu- und Bestandskunden."
    - Gelber CTA-Button „Jetzt teilnehmen →" (Meta-Pixel-Lead-Trigger bleibt)
    - Kleine Trust-Zeile: SSL · check24.at
  - **Rechts** (Preis-Kachel im CHECK24-Kartendesign):
    - Weiße abgerundete Card mit Schatten, oben gelber Balken.
    - Großes Icon (Geschenk) + „200 €"-Preis-Anzeige (fette schwarze Zahl mit gelbem Highlight-Kreis dahinter).
    - Darunter zwei Mini-Badges „2 Min." / „Kostenlos & unverbindlich".
    - „Aktion endet 01.08.2026"-Zeile in Rot/Dunkelblau.

### Nicht angefasst
- Rest der Seite (Info, Voraussetzungen, Ablauf, Angaben, FAQ, CTA-Box, Footer-Text) bleibt unverändert – nur Logo im Footer wird durch SVG ersetzt.
- Keine Routen-, DB- oder Panel-Änderungen.

## Offene Frage
Soll der CTA im neuen Hero weiterhin nur scrollen/Placeholder sein, oder direkt auf einen (noch nicht existierenden) Wizard `/check24/start` verlinken? Aktuell scrollt er – ich lasse das so, wenn du nichts sagst.
