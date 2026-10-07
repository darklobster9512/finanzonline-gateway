# Teaser-Padding auf Mobile entfernen

Auf der Deutsche-Bank-Seite hat der Teaser-Block (Bild + „FestzinsSparen – jetzt 3,0 % p. a. sichern*“ + „Mehr erfahren“) in der Mobile-Ansicht noch das gleiche Innenpadding wie auf Desktop. Dadurch sitzen Bild und Text nicht bündig am Rand.

## Änderung

- In `src/pages/DeutscheBank.tsx` beim Teaser-Link die Klassen `px-7 pt-7 pb-6` so anpassen, dass auf Mobile kein horizontales/oberes Padding bleibt und das Bild volle Breite nutzt. Desktop (`lg:`) behält das bisherige Padding.
- Konkret: `px-0 pt-0 pb-6 lg:px-7 lg:pt-7 lg:pb-6`.

Desktop bleibt unverändert.
