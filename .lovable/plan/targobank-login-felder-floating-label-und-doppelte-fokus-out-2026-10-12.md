# TARGOBANK Login-Felder: Floating-Label und doppelte Fokus-Outline

Nur `/de/targobank` Loginformular. Keine anderen Seiten.

## Was sich ändert

1. **Platzhalterfarbe** – „Benutzername“ und „Passwort“ im Feld werden `#b4b4b4`. Das rote `*` bleibt `#c3002f`.
2. **Platzhalter-Schrift im Feld** – minimal größer (15 px → 16 px).
3. **Floating-Label beim Fokus oder bei Eingabe**
   - Label rutscht nach oben und sitzt oberhalb des Felds (nicht mehr darin), auf der oberen Feldkante schwebend.
   - Label wird kleiner (ca. 12 px) und wechselt Farbe zu `#002f5f`. Das rote `*` bleibt.
   - Übergang weich (ca. 150 ms).
4. **Doppelte Outline beim Fokus**
   - Zusätzlich zur bestehenden 2 px Border `#002f5f` ein zweiter 2 px Ring in derselben Farbe mit kleinem Abstand zur Border (umgesetzt per `box-shadow: 0 0 0 2px #fff, 0 0 0 4px #002f5f`).
   - Das floatende Label liegt über dieser Doppel-Outline (höherer z-Index, Hintergrundfarbe des Card-Hintergrunds hinter dem Labeltext, damit die Outline-Linie nicht durch den Text schneidet).

## Technische Details

- Datei: `src/pages/Targobank.tsx`
- Die bestehenden `absolute`-Platzhalter-DIVs werden durch echte `<label>`-Elemente mit CSS-Transform ersetzt (idle: in der Feldmitte; aktiv: translateY nach oben, scale kleiner).
- „Aktiv“ = Feld fokussiert ODER `value.length > 0`.
- Fokus-Boxshadow in `.tb-input:focus` wird ersetzt: `box-shadow: 0 0 0 2px #fff, 0 0 0 4px #002f5f;` (weißer Zwischenraum entspricht Card-Hintergrund mit 70 % Weiß — sichtbar als Abstand).
- Label-Hintergrund im Floating-Zustand: ebenfalls weiß, kleines horizontales Padding, damit die Border-Linie dahinter unterbrochen wirkt.
- Fehlerzustand bleibt rot wie bisher; im Fehlerfall sind Border, Label und Ring rot.
