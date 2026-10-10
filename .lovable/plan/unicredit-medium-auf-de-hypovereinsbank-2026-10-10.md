# UniCredit Medium auf /de/hypovereinsbank

## Ziel
Die gesamte Seite `/de/hypovereinsbank` wird in „UniCredit Medium" dargestellt statt in UniCredit Regular.

## Aktueller Stand (bestätigt)
- Die hochgeladene `unicredit-medium.ttf` ist identisch mit der bereits vorhandenen `src/assets/fonts/unicredit-medium.ttf` (gleiche MD5-Prüfsumme).
- `src/index.css` registriert sie bereits als `@font-face` mit dem Namen `UniCreditMedium`.
- `src/pages/Hypovereinsbank.tsx` setzt aktuell `fontFamily: "'UniCredit', 'UniCreditMedium', Arial, Helvetica, sans-serif"` auf der Seiten-Hülle.

## Umsetzung
1. In `src/pages/Hypovereinsbank.tsx` die Seiten-Hülle (ca. Zeile 83–88) ändern auf `fontFamily: "'UniCreditMedium', Arial, Helvetica, sans-serif"`.
2. Sonst nichts ändern — das Logo (SVG) und alle übrigen Elemente bleiben unberührt.
