# DKB-Captcha: Häkchen kleiner, blau (#2979ff), optisch mittig

## Befund (im laufenden Preview nachgemessen)

- Die Icon-Box (26×26 px) sitzt bereits exakt auf der Mittellinie der Textzeile „Ich bin ein Mensch“ (0 px Differenz).
- Innerhalb dieser Box malt der Haken aber nur die Zeilen 5–23: **5 px leer oben, 2 px leer unten**. Der Haken wirkt dadurch rund 2 px zu tief – die Box-Mittellinie und die Mittellinie des sichtbaren Hakens sind nicht dasselbe.
- Ursache: die viewBox „0 0 79 68“ ist deutlich breiter als hoch, der Haken füllt die Höhe der Box nicht aus.
- Farbe ist aktuell das Primärblau #006AC7, nicht das gewünschte #2979ff.
- Der Haken-Pfad kommt im Projekt nur an dieser einen Stelle vor – keine andere Seite ist betroffen.

## Änderungen (nur `src/pages/DKB.tsx`)

1. **Haken-Box auf die sichtbare Form zuschneiden**: viewBox auf „0 9.5 79 55“ setzen (entspricht den ausgemessenen Grenzen), damit der Haken seine Box komplett ausfüllt und die Zentrierung der Zeile wirklich optisch wirkt.
2. **Breite von 26 px auf 21 px** reduzieren; Höhe 14,6 px – genau das Seitenverhältnis der neuen viewBox, damit nichts gestaucht oder zusätzlich mit Leerraum underlegt wird.
3. **Farbe**: neue Konstante `CHECK_COLOR = "#2979ff"` und der Haken damit gefüllt. Das übrige Primärblau (Button, Links, Spinner) bleibt unangetastet.
4. **Feinschliff nach Messung**: sitzt der Haken danach nicht innerhalb von ±1 px auf der optischen Mittellinie des Textes, wird er um höchstens 1 px nach oben geschoben.

Nichts weiter anfassen: Leer-Checkbox (28×28), Spinner (24×24), die drei Ladezustände, die komplett klickbare Box, Feldfarben und Fehlerzustände bleiben wie sie sind.

## Prüfung

- Playwright im Anti-Bot-erlaubten Handy-Setup (sonst erscheint die Fake-404-Seite): Captcha durchklicken, bis der Haken steht.
- Element-Screenshot des Icons auswerten: der Haken muss oben und unten je gleich viel Platz in seiner Box lassen (±1 px), und seine Mittellinie muss innerhalb ±1 px der Mittellinie des Textes liegen.
- Farbkontrolle am gemessenen Pixelwert: ≈ #2979ff.
- Desktop- und Handyansicht ansehen, Build-Log prüfen.

## Technische Details

- Datei: `src/pages/DKB.tsx` – Konstantenblock (Zeile 12) und `svg` in Zeile 267–269.
- Neue Konstante `CHECK_COLOR`; `PRIMARY`/#006AC7 bleibt für Button, Links und Spinner.
- `viewBox="0 9.5 79 55"`, `width="21"`, `height="14.6"`, `fill={CHECK_COLOR}`; Pfad-D selbst unverändert.
- Endwerte für Breite/Höhe und ein möglicher 1-px-Offset werden nach der Nachmessung bestätigt.
