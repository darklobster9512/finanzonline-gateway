# Floating-Label-Farbe anpassen

Auf `/de/commerzbank` sollen die Platzhalter-Labels (Benutzername, Passwort) auch im hochgefloateten (aktiven) Zustand die Farbe `#002530` annehmen statt des aktuellen Grautons `#506c74`.

## Änderung
- `src/pages/Commerzbank.tsx`: In beiden Label-Farblogiken den aktiven/fokussierten Zustand von `#506c74` auf `#002530` setzen. Ruhezustand bleibt `#506c74`, Hover im Ruhezustand bleibt `#002530`.
