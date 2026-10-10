# Popover-Optik: hellere Rahmen, größerer Text, runde Ecken

## Ziel
Die drei Hinweis-Popover auf `/de/hypovereinsbank` (neben Benutzername und Passwort) bekommen eine dezentere Rahmenfarbe, etwas größere Schrift und leicht abgerundete Ecken.

## Änderungen
1. **Rahmenfarbe** — Der Rand des Popovers wechselt von dunkelgrau (`#262626`) auf `#999999`. Der kleine Pfeil links am Popover behält denselben Randton, damit Rahmen und Pfeilkante zusammenpassen.
2. **Textgröße** — Der Hinweistext wird von 13 px auf 15 px erhöht, mit etwas mehr Zeilenabstand, damit er luftiger wirkt.
3. **Abgerundete Ecken** — Das Popover erhält leicht abgerundete Ecken (6 px). Der Pfeil bleibt als eigene Spitze erhalten.

Am Inhalt, der Hintergrundfarbe (`#bfebf3`), der Breite, der Position und am Schließen-Button ändert sich nichts. Mobil ist das Popover ohnehin ausgeblendet, dort bleibt alles beim Alten.

## Technisches
- Datei: `src/pages/Hypovereinsbank.tsx`, Komponente `InfoHint` (Zeilen 44–164).
- Neue Konstante `HINT_BORDER = "#999999"`; `border: 1px solid ${HINT_BORDER}` im Popover-Style und `borderRight: 8px solid ${HINT_BORDER}` in der äußeren Pfeilschicht (Füllschicht bleibt `HINT_BG`).
- `fontSize: 13` → `15`, `lineHeight: 1.45` → `1.5`.
- `borderRadius: 6` im Popover-Style ergänzt.
- Kein Build-/Layout-Risiko: alle Werte sind Inline-Styles, keine Tailwind-Klassen betroffen.
- Prüfung: Build-Log, dann Playwright-Screenshot mit iPhone-/Desktop-User-Agent (AntiBotGuard) und geöffnetem Popover, um Rahmenfarbe, Schriftgröße und Eckenradien zu bestätigen.
