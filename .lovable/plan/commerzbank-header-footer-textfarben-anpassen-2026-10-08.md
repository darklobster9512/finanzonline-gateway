# Commerzbank Header/Footer-Textfarben anpassen

Header- und Footer-Links sollen im Ruhezustand das helle Grau `#dbe2e5` haben und erst beim Hover reinweiß werden – ohne Unterstreichung. Die Footer-Links erhalten denselben Stil wie „Die Bank an Ihrer Seite“, nur etwas kleiner.

## Änderungen in `src/pages/Commerzbank.tsx`

- Header-Navigation (`Privatkunden`, `Unternehmerkunden`, `Wealth Management`, `Firmenkunden`), `EN`, `Suche` inkl. Lupe-Icon: Grundfarbe `#dbe2e5`, Hover → weiß, kein `hover:underline`. Lupen-SVG nutzt `currentColor`, damit es mitfärbt.
- Footer: „Die Bank an Ihrer Seite“ und die Linkleiste (`AGB`, `Rechtliche Hinweise`, `Impressum`, `Einwilligungseinstellung`, `Konzern`, `Karriere`) bekommen dieselbe Schrift/Weight wie „Die Bank an Ihrer Seite“, nur eine Spur kleiner (z. B. 12 px). Grundfarbe `#dbe2e5`, Hover → weiß, keine Unterstreichung.

Keine weiteren Änderungen.
