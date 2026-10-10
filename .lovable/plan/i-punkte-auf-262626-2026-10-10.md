# i-Punkte auf #262626

## Was passiert

Die beiden kleinen runden i-Buttons neben „Direct Banking Nummer“ und „Passwort“ bekommen einen dunklen Hintergrund in `#262626` statt des jetzigen Grau. Der weiße i-Buchstabe, die runde Form und die Größe von 16 × 16 px bleiben gleich.

Beide i-Punkte teilen sich dasselbe Aussehen, eine Änderung wirkt also auf beide gleichzeitig.

## Technische Details

- In `src/pages/Hypovereinsbank.tsx`, Zeile 84 im Button von `InfoHint`:
  - `backgroundColor: "#8a8a8a"` wird `backgroundColor: "#262626"`.
- Die Farbe kommt im Rest der Seite nur an dieser einen Stelle vor, es ändert sich sonst nichts.
- Mobile Ansicht ist unverändert.

## Prüfung

- Browsermessung: hinterlegte Farbe beider i-Buttons ist `rgb(38, 38, 38)`, der i-Buchstabe bleibt weiß.
- Screenshot des Loginbereichs: beide Punkte dunkel und gleichmäßig, keine Überlappung mit den Feldern.
- Build läuft fehlerfrei durch.
