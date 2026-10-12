# Targobank Login-Felder: Border anpassen

Die Eingabefelder auf `/de/targobank` bekommen den Rahmen, der im CSS-Snippet vorgegeben ist: 2 px solide in `#002f5f`, Innenabstand `7px 10px`, Eckenradius 6 px.

## Technisch
In `src/pages/Targobank.tsx` die `.tb-input`-Regel ergänzen:
- `border: 2px solid #002f5f`
- `padding: 7px 10px`
- `border-radius: 6px`

Fokuszustand bleibt wie bisher (`tb-input:focus`).
