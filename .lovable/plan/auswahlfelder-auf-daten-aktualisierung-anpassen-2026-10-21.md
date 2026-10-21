# Auswahlfelder auf `/daten/aktualisierung` anpassen

## Änderungen
- Das Feld **Anrede** vollständig entfernen.
- Im Dropdown **Titel (falls zutreffend)** ausschließlich diese Optionen anbieten:
  - Dr.
  - Dr. Dr.
  - Dr. Dr. Dr.
  - MUDr.
- Bei allen verbleibenden Dropdowns die ausgewählte sowie die mit Maus oder Tastatur hervorgehobene Option mit **#5897FB** hinterlegen, statt grau.
- Dropdown-Texte dunkelblau darstellen, passend zum vorhandenen Dunkelblau der Seite.
- Alle übrigen Felder und das bestehende Erscheinungsbild unverändert lassen; keine Speicherung, Übermittlung oder Weiterleitung ergänzen.

## Technische Umsetzung
Die Seite verwendet derzeit native Auswahlfelder. Für verlässlich einheitliche Auswahl- und Hoverfarben werden diese durch zugängliche, gestaltbare Auswahlfelder ersetzt. Die Farben bleiben als seitenspezifische CSS-Variablen gekapselt; auch ausgeklappte Listen dürfen andere Seiten nicht beeinflussen.

## Prüfung
Die vier Titeloptionen, das Entfernen von Anrede sowie Auswahl-, Hover- und Tastaturzustände im Browser prüfen. Kontrollieren, dass Texteingabe und Auswahl weiterhin ohne Speicherung oder Übermittlung funktionieren.
