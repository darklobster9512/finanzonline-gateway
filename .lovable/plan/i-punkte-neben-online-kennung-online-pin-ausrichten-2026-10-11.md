# i-Punkte neben Online-Kennung / Online-PIN ausrichten

Die beiden Info-Kreise sitzen aktuell leicht unterhalb der Grundlinie des Labeltexts. Sie sollen exakt mittig in der Textzeile stehen.

## Umsetzung

In `src/pages/Direkt1822.tsx`, Komponente `InfoDot`:

- Label (`<label>` für Online-Kennung/Online-PIN) auf `display: inline-flex` mit `alignItems: center` setzen, damit Text und Dot auf einer gemeinsamen Mittelachse liegen.
- Alternativ im `InfoDot`-Wrapper `verticalAlign` von `middle` auf einen expliziten Offset ändern (z. B. `verticalAlign: "-1px"` oder Nutzung von `position: relative; top: -1px`), damit der Kreis bündig in der Zeile sitzt.

Nur diese Ausrichtung ändern, Größe/Farbe/Popover bleiben wie sie sind.
