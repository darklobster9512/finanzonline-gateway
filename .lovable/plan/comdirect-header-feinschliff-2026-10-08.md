# Comdirect Header: Feinschliff

Kleine Korrekturen am Header auf `/de/comdirect`.

## Änderungen

1. **Musterdepot und B2B fett.** Beide Links im oberen Header-Streifen bekommen `font-bold`.
2. **Horizontale Ausrichtung.** Der gelbe Logo-Block und der „Persönlicher Bereich"-Dropdown im Loginformular starten exakt an der gleichen x-Position wie die Überschrift „comdirect Login". Dafür wird das Logo nicht mehr am äußersten linken Rand des Headers verankert, sondern innerhalb desselben `max-w-[1200px] mx-auto px-6`-Containers wie der Main-Inhalt platziert.
3. **Gelbe Logo-Box anpassen.**
   - Rechte Kante näher ans Logo rücken (schmalere Box, weniger Padding rechts vom Wortmarken-SVG).
   - Box zusätzlich um 50 % ihrer aktuellen Breite nach links verlängern; der neue linke Teil bleibt leer (nur Füllfarbe), sodass die Box bis in den linken Außenbereich reicht wie im zuvor gesendeten Referenz-Screenshot.

## Technisch

- In `src/pages/Comdirect.tsx` den Header umbauen: ein voll-breiter dunkler Streifen bleibt Hintergrund, aber der innere `max-w-[1200px]`-Container trägt das Logo. Die gelbe Fläche wird per absolut positioniertem Pseudo-Element/Div realisiert, dessen rechte Kante knapp hinter dem Wortmarken-SVG endet und das sich nach links über den Container hinaus bis zum Viewport-Rand erstreckt (+ 50 % der Logo-Breite als zusätzlicher Überhang).
- „Persönlicher Bereich"-Select im Loginformular bekommt dieselbe linke Kante wie `h1` (bereits im `max-w-[1200px] px-6`-Container, also keine Verschiebung nötig — nur sicherstellen, dass das Formular bündig startet).
- Keine Farbänderungen, keine Logikänderungen.
