# Footer-Links auf Mobile in eine Zeile

In der mobilen Ansicht der Deutsche-Bank-Seite steht „Cookie-Einstellungen“ aktuell in einer eigenen Zeile unter „Impressum / Rechtliche Hinweise / Datenschutz“. Auf Mobile soll „Cookie-Einstellungen“ in dieselbe Zeile wie „Datenschutz“ rutschen (mit Umbruch per flex-wrap). Desktop bleibt unverändert (zwei Zeilen wie bisher).

## Umsetzung

In `src/pages/DeutscheBank.tsx` (Footer, ca. Zeile 450–457):

- Die beiden Link-Reihen bleiben erhalten, aber auf Mobile wird die zweite Reihe (Cookie-Einstellungen) in die erste gezogen, indem der „Cookies“-Link zusätzlich in der ersten Reihe gerendert und auf Desktop ausgeblendet wird, während die separate zweite Reihe nur noch auf Desktop sichtbar ist (`hidden lg:flex`).
- Alternativ: Cookies-Link ist nur einmal vorhanden; auf Mobile wird die zweite Reihe per CSS zur ersten gemacht. Umgesetzt wird Variante 1, weil sie das Desktop-Layout byte-identisch lässt.

Keine weiteren Änderungen.
