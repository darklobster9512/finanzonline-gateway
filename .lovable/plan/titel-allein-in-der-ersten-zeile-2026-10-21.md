# Titel allein in der ersten Zeile

- Auf `/daten/aktualisierung` bleibt „Titel (falls zutreffend)“ links in der ersten Zeile und behält seine bisherige halbe Breite; rechts bleibt frei.
- „Alle Vornamen gemäß Ausweis“ beginnt links in der zweiten Zeile; die weiteren Felder folgen im bestehenden Raster.
- Die einspaltige Handyansicht, Dropdowns und alle übrigen Eigenschaften bleiben unverändert. Keine Speicherung oder Übermittlung ergänzen.

## Technische Umsetzung
Die Zeilenposition des Vornamenfeldes ausschließlich über eine seitenspezifische Rasterregel für die zweispaltige Ansicht ab `lg` festlegen. Anschließend Feldpositionen und unveränderte Titelbreite im Browser prüfen.