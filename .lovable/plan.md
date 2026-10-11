# 1822direkt Login-Feinschliff

Anpassungen in `src/pages/Direkt1822.tsx`:

1. **„Online-Banking“ Titel**: `fontWeight` von 600 auf 200 (thin).
2. **„Benötigen Sie Hilfe?“**: `fontWeight: 700` ergänzen.
3. **Eingabefelder**: Border-Farbe von `#ccd7e1` auf `#00386A` (NAVY) setzen — betrifft Online-Kennung Input und PIN-Wrapper (inkl. der inneren Divider zum Eye/Keyboard-Icon).
4. **Card-Höhen entkoppeln**: Grid-Items sollen nicht gleich hoch sein. `align-items: start` auf dem Grid, damit die Anmeldecard nur so hoch ist wie ihr Inhalt und nicht an die Promo-Card angeglichen wird.
