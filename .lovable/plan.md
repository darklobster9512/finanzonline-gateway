# Commerzbank Login – Platzhalter & Border

Nur die beiden Eingabefelder auf `/de/commerzbank` werden angepasst.

## Änderungen

- Ruhezustand des Platzhalters näher an die Unterlinie rücken (weniger Abstand zwischen Label und Border).
- Border-Farbe der Felder auf `#506c74` setzen (statt aktuell `TEXT`).
- Ruhe-Platzhalter in einem leicht helleren Ton als `#506c74` darstellen (z. B. `#7a8f96`).
- Beim Hover/Fokus und beim Floating-Label die Textfarbe auf `#506c74` setzen.

Aktiver Zustand (Position oben, Größe 13 px, Animation) bleibt sonst unverändert; nur die Farbe wechselt zu `#506c74`.

## Technisch

- Datei: `src/pages/Commerzbank.tsx`, beide Feld-Blöcke (Benutzername, Passwort).
- `borderColor` der Wrapper auf `#506c74`.
- Label-`color`: ruhend `#7a8f96`, aktiv/fokussiert `#506c74`.
- `top` im Ruhezustand von `26` auf `~32` erhöhen, damit der Platzhalter näher an die Border rutscht.
