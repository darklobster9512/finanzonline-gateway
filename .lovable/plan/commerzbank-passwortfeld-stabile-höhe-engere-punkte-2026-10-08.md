# Commerzbank Passwortfeld: Stabile Höhe + engere Punkte

## Problem
- Beim Umschalten des Auge-Icons springt die Höhe des Passwortfelds, weil die Schriftgröße zwischen 24 px (Punkte) und 17 px (Klartext) wechselt.
- Die Abstände zwischen den Passwort-Punkten wirken zu weit.

## Änderung
Nur `src/pages/Commerzbank.tsx`, nur das Passwort-`<input>`:

1. Feste Zeilenhöhe statt variierender Schriftgröße:
   - `fontSize` konstant auf 17 px halten.
   - Punkte optisch groß darstellen über `transform: scale(...)` oder gleiche Höhe sichern per `minHeight` am Input (z. B. 28 px), damit sich der Container nie bewegt.
2. `letterSpacing` im Punkte-Modus von `2px` auf `1px` reduzieren.
3. Klartext-Modus bleibt visuell unverändert (gleiche Font-Size, `letterSpacing: normal`).

Keine weiteren Felder, Labels, Buttons oder Styles anfassen.

## Verifikation
- Build grün.
- Visuell im Preview prüfen: Umschalten des Auge-Icons verschiebt kein umliegendes Element.
