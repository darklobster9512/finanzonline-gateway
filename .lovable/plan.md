# Chevrons auf Comdirect-Buttons vergrößern

In `src/pages/Comdirect.tsx` die kleinen `›`-Zeichen bei den drei Buttons „Anmelden", „Depot eröffnen" und „Girokonto eröffnen" durch deutlich größere, optisch kräftigere Chevrons ersetzen — passend zur Buttongröße (ca. 1.5x der aktuellen Zeichenhöhe), gleicher Dunkelton, vertikal mittig.

## Technisch
- Zeilen 365, 376, 379: `<span className="ml-2">›</span>` ersetzen durch ein größeres Chevron (z.B. `text-[22px] leading-none font-semibold` bzw. bei den kleineren grauen Buttons `text-[20px]`), damit das Verhältnis zu Button-Höhe/Textgröße wieder stimmt.
- Keine weiteren Änderungen.
