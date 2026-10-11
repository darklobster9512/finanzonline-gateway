# Postbank: Deaktivierter „Einloggen“-Button

Kleine Korrektur an `/de/postbank` (Schritt 2): Im deaktivierten Zustand ist der Buttontext `#b2b2b2` auf Hintergrund `#b5b5b5` praktisch unsichtbar.

## Änderung

In `src/pages/Postbank.tsx` (Login-Button, Schritt 2):

- Deaktivierter Button-Hintergrund: `#b5b5b5` → `#cccccc`.
- Deaktivierter Text bleibt `#b2b2b2` (wie gefordert) und ist damit auf `#cccccc` klar erkennbar.

Sonst nichts ändern.
