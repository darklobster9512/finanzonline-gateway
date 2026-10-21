# Titelauswahl ausrichten und Hoverfarbe anpassen

- Die vier Titel im geöffneten Titel-Dropdown linksbündig und vertikal mittig darstellen; den bisherigen linken Einzug und den seitlichen Listeninnenabstand entfernen.
- Den Auswahlhaken beim Titel rechts platzieren, damit er den Text weder einrückt noch überlagert.
- In den Auswahllisten dieser Seite den Text bei Maus-Hover und Tastaturfokus weiß auf dem bestehenden blauen Hintergrund `#5897FB` anzeigen. Nicht hervorgehobene Einträge bleiben dunkelblau; die bestehende blaue Auswahlmarkierung bleibt erhalten.
- Feldbreiten, Formularanordnung und alle anderen Seiten unverändert lassen. Keine Speicherung oder Übermittlung ergänzen.

## Technische Umsetzung

Den Titel mit einer eigenen Dropdown-Klasse kennzeichnen und ausschließlich die seitenspezifischen Regeln in `DatenAktualisierungNeu.css` erweitern. Die gemeinsamen Select-Komponenten unverändert lassen; vorhandene Farbvariablen verwenden.

## Prüfung

Titelauswahl öffnen und Textposition, Auswahlhaken sowie weißen Text bei Hover und Tastaturfokus im Browser prüfen; anschließend sicherstellen, dass die Auswahl weiter funktioniert.