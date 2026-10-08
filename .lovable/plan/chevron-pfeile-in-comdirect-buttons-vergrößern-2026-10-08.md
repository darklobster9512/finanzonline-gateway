# Chevron-Pfeile in Comdirect-Buttons vergrößern

Die drei Buttons „Anmelden", „Depot eröffnen" und „Girokonto eröffnen" auf `/de/comdirect` zeigen aktuell ein kleines `›`-Zeichen in Standardgröße. Die Pfeile werden deutlich größer und etwas kräftiger dargestellt, damit sie zum Button-Stil passen.

## Änderungen

- `src/pages/Comdirect.tsx`: Bei den drei Buttons das `›` so anpassen, dass es größer (ca. 22–24 px bei „Anmelden", ca. 20 px bei den beiden grauen Buttons) und mit leicht reduzierter Zeilenhöhe vertikal zentriert erscheint. Keine weiteren Button-Eigenschaften (Höhe, Farbe, Abstand, Hover) ändern.

Keine anderen Dateien betroffen.
