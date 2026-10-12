# Targobank Login-Felder: Rahmen dünner, Lücke wirklich transparent

## Problem
- Der Rahmen der Eingabefelder wirkt zu fett (aktuell 2 px).
- Die Lücke zwischen innerem Rahmen und äußerer Linie ist nicht sichtbar transparent, weil sie mit einem `box-shadow` in Transparent simuliert wurde, der visuell wie eine durchgehende Fläche wirkt.

## Lösung
In `src/pages/Targobank.tsx`:

1. Innerer Rahmen zurück auf **1 px solid #002f5f** (statt 2 px).
2. Für den Fokuszustand `box-shadow` entfernen und stattdessen eine echte zweite Linie mit `outline` + `outline-offset` verwenden:
   - `outline: 2px solid #002f5f;`
   - `outline-offset: 2px;`
   - Fehlerzustand: Outline-Farbe rot.
3. Dadurch ist der 2-px-Spalt zwischen Feld-Rahmen und Outline tatsächlich transparent (zeigt die Card-Hintergrundfarbe).

Keine anderen Styles, Labels oder Abstände werden angefasst.
