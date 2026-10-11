# Norisbank mobile: Footer + Login-Buttons

Nur Mobile-Ansicht von `/de/norisbank` ändern, Desktop bleibt unverändert.

## Änderungen in `src/pages/Norisbank.tsx`

- Im Footer der rechten Spalte den „English Version"-Button auf Mobile ausblenden (`hidden lg:inline` o. ä.). Auf Desktop weiterhin sichtbar.
- Login-Card (Schritt 1 „Weiter" und Schritt 2 „Einloggen"):
  - Button auf Mobile über den „Zugangsdaten vergessen?"-Link setzen (Reihenfolge: Button zuerst, dann Link darunter).
  - Button auf Mobile full-width.
  - Desktop-Layout (Link links, Button rechts in einer Zeile) unverändert.

Umsetzung via `flex-col lg:flex-row`, `order`-Klassen und `w-full lg:w-auto` am Button; keine weiteren Änderungen an Texten, Verhalten oder anderen Seiten.
