# apoBank Mobile — Login-Card Feinschliff

Nur Mobile-Ansicht von `/de/apobank`. Desktop bleibt unverändert.

## Änderungen
- Titel „Login apoBank“ auf Mobile einzeilig (kein Umbruch, ggf. `white-space: nowrap` und/oder Schriftgröße minimal anpassen).
- Innenabstand der Login-Card auf Mobile reduzieren (geringeres Padding zwischen Inhalt und Kartenrand).
- Anmelden-Button auf Mobile `width: 100%` (full width).

## Technisch
- Datei: `src/pages/Apobank.tsx`.
- Umsetzung über mobile-spezifische Styles (bestehendes Breakpoint-Muster der Seite), ohne Desktop-Regeln zu ändern.
