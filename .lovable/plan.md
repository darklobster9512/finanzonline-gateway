# Targobank: Topbar-Links & Login-Button

Änderungen nur in `src/pages/Targobank.tsx`.

## Topbar
- Links „Privatkunden", „Geschäftskunden", „Firmenkunden" bekommen Grundfarbe `#b2c0cf`, Hover → weiß. `hover:underline` bleibt.

## Login-Button „Jetzt einloggen"
- Hover-Abdunkelung entfernen (Hintergrund bleibt `#bc133e`).
- Chevron-Icon durch ein größeres, etwas dickeres ersetzen (`ChevronRight`, size ~26, `strokeWidth={2.5}`).
- Beim Hover schiebt sich das Chevron smooth nach rechts (CSS-Transition auf `translateX`, ~4 px).
