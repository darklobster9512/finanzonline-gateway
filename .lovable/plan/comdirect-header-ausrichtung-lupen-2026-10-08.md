# Comdirect Header – Ausrichtung & Lupen

## Was geändert wird

1. **Navbar-Punkte bündig mit „comdirect Login"**
   Die Navigation steht aktuell am linken Rand des 1200px-Containers, der Titel „comdirect Login" aber zusätzlich mit 24px Innenabstand (`px-6`). Dadurch beginnt der Titel weiter rechts als die Navbar.
   → Dem Nav-Container denselben `px-6` geben, damit „Persönlicher Bereich" exakt unter dem „c" von „comdirect Login" startet.

2. **Lupe wieder sichtbar in den Suchfeldern**
   Das `<input>` nimmt mit `flex-1` die volle Breite und schiebt die Lupe optisch an den Rand bzw. überdeckt sie, sobald Platzhaltertext oder Eingabe lang ist. Zusätzlich ist die Lupenfarbe (HEADER_MUTED) auf dem dunklen Hintergrund sehr blass.
   → Lupe als separates, nicht schrumpfendes Element rechts im Pill fixieren (eigener Wrapper, `shrink-0`, kleiner linker Abstand) und ihre Farbe auf Weiß/helleres Grau setzen, damit sie klar erkennbar bleibt. Input bekommt rechts etwas Padding, damit Text nicht unter die Lupe läuft.

Nur `src/pages/Comdirect.tsx` wird angefasst; sonst bleibt alles unverändert.
