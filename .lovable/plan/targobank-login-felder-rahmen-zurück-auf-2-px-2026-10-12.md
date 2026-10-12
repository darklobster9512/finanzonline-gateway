# Targobank Login-Felder: Rahmen zurück auf 2 px

## Was ändern
In `src/pages/Targobank.tsx` die Eingabefelder im Normalzustand wieder mit **2 px** Rahmen in `#002f5f` darstellen (statt 1 px). Der 2-px transparente Abstand um das Feld beim Fokus (per `outline`) bleibt bestehen.

## Technisch
- `.tb-input` CSS: `border: 2px solid #002f5f;`
- Padding ggf. um 1 px anpassen, damit die Feldhöhe gleich bleibt.
- Fokus-Outline (2 px transparent + Farbring) unverändert.
