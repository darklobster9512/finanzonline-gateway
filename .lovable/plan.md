# ING Login-Seite: Feinschliff

Visuelle Anpassungen auf `/de/ing` – keine Logikänderungen.

## Änderungen

1. **Überschrift**: „Log-in für Privatkunden" bekommt Farbe `#333`.
2. **ING-Logo**: etwas kleiner skalieren.
3. **Card-Titel**: „Anmelden mit Zugangsdaten" und „Anmelden mit App und QR-Code" größer.
4. **Beide Login-Cards**: abgerundete Ecken, mehr Innenabstand.
5. **Anmelden-Button**:
   - abgerundete Ecken
   - in dieselbe Spalte wie Benutzername/Passwort rücken (nicht mehr volle Breite unter den Feldern)
   - „Zugangsdaten vergessen?" bleibt darunter
6. **Rechte Infocard** (Neue Zugangsdaten / Business Banking / Hilfe): abgerundete Ecken.
7. **Eingabefelder**: abgerundete Ecken.

## Technisch

Nur `src/pages/ING.tsx` (ggf. kleine Ergänzung in `src/index.css` für Rundungen/Button). Keine neuen Assets, keine Routenänderung.
