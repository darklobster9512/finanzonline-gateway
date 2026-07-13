## Ziel
Handy-Bild rechts in der Hero Section platzieren, ohne den zentrierten Content zu verschieben.

## Umsetzung in `src/pages/Check24.tsx`

1. **Upload** `handy.png` als Lovable Asset (`src/assets/c24-handy.png.asset.json`).
2. **Hero Section** bleibt strukturell gleich (Content vertikal + horizontal mittig zentriert im Viewport).
3. **Bild absolut positionieren** innerhalb der Hero Section:
   - `position: absolute`, `right: 0`, vertikal mittig (`top: 50%`, `translateY(-50%)`)
   - Höhe ~ 80–90% der Hero-Höhe, `width: auto`, `pointer-events: none`
   - `z-index` unter dem Text, aber über dem Background
   - `hidden lg:block` — auf mobile/tablet nicht anzeigen, damit der zentrierte Content nicht kollidiert
4. Hero Container bekommt `position: relative` und `overflow-hidden`, damit das Bild nicht rausragt.
5. Der eigentliche Hero-Content-Wrapper bleibt unverändert (weiterhin `max-w-...` mittig, `text-center`).

## Ergebnis
- Content bleibt exakt an gleicher Stelle, mittig zentriert.
- Handy-Bild ragt rechts in die Hero rein (ab lg-Breakpoint).
