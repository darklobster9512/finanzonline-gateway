# ELSTER Datenaktualisierung – Untertitel anpassen

Nur `src/pages/ElsterDatenaktualisierung.tsx`, Zeile ~185–191.

1. Untertitel kleiner: `fontSize` von 15 auf 13.
2. „Wichtiger Hinweis:" von `#c00` auf `TEXT` (schwarz) umstellen.
3. Textbreite exakt an die darunterliegende Borderbreite koppeln: `maxWidth: 820` entfernen und stattdessen die Breite an das Grid darunter angleichen (Container-Breite minus `paddingRight: 16`, d. h. `calc(100% - 16px)`), damit der Absatz nicht breiter ist als die Rahmenlinie des Formular-/Infoblocks.

Keine weiteren Dateien oder Elemente angefasst.
