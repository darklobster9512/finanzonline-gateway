# DKB-Captcha exakt vertikal zentrieren

## Änderung
- Checkbox, Lade-Spinner beziehungsweise blauen Haken und den zugehörigen Status-Text als eine gemeinsame Zeile behandeln.
- Diese Zeile über die gesamte Höhe des Captcha-Elements exakt vertikal mittig positionieren, statt sie im normalen Inhaltsfluss oberhalb des „Friendly Captcha“-Links auszurichten.
- Die drei Punkte bleiben separat oben rechts; „Friendly Captcha“ bleibt separat unten rechts. Beide beeinflussen die Zentrierung der Hauptzeile nicht.
- Alle Captcha-Zustände erhalten dieselbe feste Geometrie, damit beim Wechsel zwischen Checkbox, Spinner und Haken nichts springt.

## Prüfung
- Idle-, Lade- und Erfolgszustand in der Vorschau kontrollieren.
- Für jeden Zustand messen, dass die Mitte von Symbol und Text mit der vertikalen Mitte des gesamten Captcha-Elements übereinstimmt.
- Sicherstellen, dass Punkte und Footer-Link nicht überlappen und der restliche DKB-Login unverändert bleibt.

## Technische Details
- Nur den Captcha-Bereich in `src/pages/DKB.tsx` ändern.
- Hauptzeile absolut mit `top: 50%` und `translateY(-50%)` zentrieren; Container erhält eine stabile Höhe und relative Positionierung.
- Keine Änderungen an Farben, Schriftgrößen oder anderen Seitenelementen.