# Elster-Login: Bereich als eine Card

Der dreispaltige Login-Bereich (Tabs | Formular | Info) soll optisch als eine zusammenhängende Karte wirken.

## Änderungen in `src/pages/Elster.tsx`

- Grid-Container der drei Spalten erhält durchgehende obere und untere Border (`1px solid #e0e0e0`), die über die gesamte Breite läuft.
- Info-Spalte rechts bekommt:
  - Hintergrund `#f8f8f8` (gleich wie inaktive Tabs links)
  - rechte Border `1px solid #e0e0e0`
  - Padding, damit Inhalt nicht am Rand klebt
  - streckt sich auf die volle Höhe der Card (bis zur unteren Border), auch wenn der Inhalt kürzer ist
- Linke Tab-Spalte: eigene Top/Bottom-Border werden entfernt, da jetzt vom Container gezeichnet; linke Border bleibt.
- Mittlere Formular-Spalte behält weißen Hintergrund, bekommt gleiche Höhe wie Nachbarspalten.

Keine weiteren Änderungen (Header, Footer, Tabs-Verhalten, Formular bleiben wie bisher).
