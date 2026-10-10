# Footer-Divider korrekt setzen

Die beiden grauen Trennlinien gehören um den Widerrufsblock („Möchten Sie einen Widerruf erklären? … Vertrag widerrufen“), nicht um die Linkliste (Impressum, Rechtliche Hinweise, …).

## Änderung

In `src/pages/Hypovereinsbank.tsx` im Footer:

- Die `border-t border-b`-Umhüllung von der Linkliste entfernen.
- Stattdessen den Widerrufsblock mit einer `border-t border-b` in `#CCCCCC` oben und unten umranden.
- Linkreihe und Copyright-/Logo-Bereich bleiben unverändert.
