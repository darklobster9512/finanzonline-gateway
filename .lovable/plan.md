# Commerzbank Login – Felder verfeinern

Zwei kleine Änderungen an den Eingabefeldern (Benutzername, Passwort/PIN) auf `/de/commerzbank`:

1. **Dünnere Unterlinie:** Border unten auf exakt 1px (statt aktuell 2px).
2. **Floating Label:** Das Label beginnt groß im Feld (als Platzhalter). Bei Fokus oder sobald Text eingegeben ist, floatet es animiert nach oben an die aktuelle Position und wird kleiner (wie jetzt).

## Technisch

- In `src/pages/Commerzbank.tsx`: `border-b-2` → `border-b` (1px).
- Label aus statischem Block über dem Input in ein absolut positioniertes Element umbauen, das zwischen zwei Zuständen animiert:
  - Ruhezustand (leer, nicht fokussiert): im Feld platziert, größer (ca. 16px, Textfarbe gedämpft).
  - Aktiver Zustand (fokussiert ODER Wert vorhanden): nach oben verschoben, 13px, wie bisher.
- CSS-Transition (`transform` + `font-size`/`top`) für sanften Übergang.
- Augen-Button-Position ggf. minimal nachjustieren.
- Desktop und Mobile gleich.
