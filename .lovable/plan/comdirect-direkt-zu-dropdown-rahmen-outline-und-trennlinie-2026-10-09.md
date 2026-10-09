# Comdirect „Direkt zu"-Dropdown: Rahmen, Outline und Trennlinie

## Ziel
In `src/pages/Comdirect.tsx` (Komponente `DirektZuDropdown`, gilt für Desktop und Mobile):

1. **Popdown-Rahmen zu dick**
   - Der Rahmen der aufgeklappten Liste steht aktuell auf `2px solid rgb(11, 30, 37)`.
   - Änderung auf `1px solid rgb(11, 30, 37)` (linker/rechter/unterer Rand; `borderTop: none` bleibt, damit die Liste bündig am Feld ansitzt).

2. **Doppelte Outline am Eingabefeld korrigieren**
   - Aktuell: 1px Feld-Border plus `boxShadow`-Segmente mit 2px Versatz → wirkt insgesamt 3px dick und unsauber.
   - Neu: `boxShadow`-Segmente (oben, links, rechts) mit 1px Versatz, sodass Border + Schatten zusammen eine saubere, durchgehende 2px-Outline ergeben, die exakt an den 1px-Rahmen des Popdowns anschließt.
   - Geschlossen bleibt es beim normalen 1px-Rahmen (`rgb(133, 142, 146)`), Hover/Open-Farbe `rgb(11, 30, 37)` unverändert.

3. **Gestrichelte Trennlinie (-----)**
   - Aktuell: `width: 70px`, `borderTop: 2px dashed` → wenige, große Striche.
   - Neu: feinere Striche (1px hoch, feine Dash-Struktur via `repeating-linear-gradient`), Farbe `rgb(96, 109, 113)` unverändert.
   - Breite so wählen, dass die Linie etwas weiter reicht als der Text „Musterdepot" (ca. 110px).
