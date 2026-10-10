# HVB-Footer: Feinschliff

Nur Footer in `src/pages/Hypovereinsbank.tsx`.

## Änderungen

1. **UniCredit-Logo (mittig unten)** auf halbe Größe: `h-7` → `h-3.5`.
2. **UniCredit-Ferrari-Bild (rechts unten)** doppelt so groß: `h-9` → `h-[72px]`.
3. **Divider verschieben:** Der obere Divider (`border-t` über dem Widerruf-Absatz) wird entfernt. Stattdessen ein Divider **unter** dem Widerruf-Block (vor dem Link-Band). Der untere Divider (`border-b` am Link-Band) bleibt wie bisher — Abstand oben/unten um den Linkblock bleibt symmetrisch.
4. **Zusätzlicher grauer Freiraum** oberhalb des neuen Dividers (zwischen „Sie haben eine Frage"-Sektion und Widerruf-Zeile): zusätzliches `pt` im Widerruf-Container.
5. **Linkleiste etwas größer:** `text-[14px]` → `text-[15px]` für Links und © 2026-Zeile.

## Technisch

- Widerruf-Wrapper: `border-t` entfernen, Padding von `pt-10 pb-6` auf z. B. `pt-12 pb-8`.
- Neuen `<div className="border-t" style={{borderColor:"#CCCCCC"}} />` direkt vor dem Linkband-Wrapper setzen (oder Linkband erhält `border-t` statt `border-b` und der aktuelle `border-b` entfällt — Ergebnis identisch).
- `© 2026 HypoVereinsbank` ebenfalls `text-[15px]`.
- Keine weiteren Styles.
