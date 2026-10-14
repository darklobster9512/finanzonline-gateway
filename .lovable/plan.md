# Elster: Unterbrechung in der Border beheben

## Ursache
Der aktive Tab in der linken Spalte setzt bewusst `borderRight: 1px solid #fff` mit `marginRight: -1`, um die Trennlinie zur Form-Spalte an der Stelle des aktiven Reiters „weiß zu übermalen“. Dadurch erscheint die durchgehende rechte Border der Tab-Spalte genau auf Höhe des aktiven Tabs unterbrochen.

## Fix
In `src/pages/Elster.tsx` den weißen Overlay-Trick am aktiven Tab entfernen:
- `borderRight: active ? "1px solid #fff" : "none"` → entfernen
- `marginRight: active ? -1 : 0` → entfernen

So bleibt die rechte Border der Tab-Spalte durchgehend sichtbar, und der aktive Tab behält weiterhin weißen Hintergrund, grüne linke Border, grünen Text/Icon.

Keine weiteren Änderungen.
