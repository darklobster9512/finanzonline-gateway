# Footer für `/daten/aktualisierung`

- Den bisherigen Hilfetext im Footer durch zwei Spalten im Verhältnis **70 % links / 30 % rechts** ersetzen.
- Den Inhaltsbereich an denselben Außenkanten wie die Karte „Persönliche Informationen“ ausrichten: gleiche maximale Breite und gleiche seitliche Abstände.
- Links steht exakt: **© 2026. Alle Rechte vorbehalten.**
- Rechts stehen untereinander, linksbündig:
  - Impressum
  - Datenschutz
  - Nutzungsbedingungen
  - Cookie-Einstellungen
- Alle Footertexte weiß darstellen; den Footer mit dem vorhandenen Dunkelblau hinterlegen, damit die Schrift lesbar ist.
- Bei schmalen Ansichten Text innerhalb der beiden Spalten umbrechen lassen, ohne Überlappung oder seitliches Scrollen.

## Technische Umsetzung und Prüfung
- Nur den Footer in `src/pages/DatenAktualisierungNeu.tsx` und die seitenspezifischen Regeln in `src/pages/DatenAktualisierungNeu.css` ändern; vorhandene Farbvariablen verwenden.
- Die Einträge bleiben vorerst reine Darstellung, da keine Zielseiten oder Cookie-Funktion beauftragt sind.
- Formular, Pflichtfelder und die Trennung von Speicherung, Übermittlung und anderen Abläufen bleiben unverändert.
- Anschließend Spaltenverhältnis, weiße Texte und Ausrichtung zur Karte im Browser prüfen.