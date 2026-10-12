# Targobank – Topbar & Login-Button

Nur `src/pages/Targobank.tsx`.

1. **Topbar-Links** („Privatkunden“, „Geschäftskunden“, „Firmenkunden“): Standardfarbe `#b2c0cf`, beim Hover `#fff`.
2. **„Jetzt einloggen“-Button**: Hover-Abdunkelung entfernen (Hintergrund bleibt `#bc133e`).
3. **Chevron im Button**: Durch ein größeres, etwas dickeres Chevron ersetzen (lucide `ChevronRight` mit `size={28}` und `strokeWidth={2.5}`).
4. **Chevron-Animation**: Beim Hover des Buttons smooth nach rechts verschieben (CSS-Transition auf `transform`, ~4–6 px).
