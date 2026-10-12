# Targobank Login-Button

Drei kleine Anpassungen am "Jetzt einloggen"-Button auf `/de/targobank`:

1. Beim Hovern bleibt der Button in derselben Farbe (`#bc133e`), kein Abdunkeln mehr.
2. Das Chevron-Symbol wird größer und etwas kräftiger dargestellt (ca. 26 px, Strichstärke 2.5).
3. Beim Hovern über den Button gleitet das Chevron sanft ein paar Pixel nach rechts (CSS-Transition).

## Technisch

- `src/pages/Targobank.tsx`:
  - `.tb-login-btn:hover` Hintergrund entfernen, stattdessen Transition für das Chevron.
  - `<ChevronRight>` auf `size={26}` und `strokeWidth={2.5}`, Klasse mit `transition-transform` und `group-hover:translate-x-1` (bzw. per CSS-Regel am Button-Hover).
