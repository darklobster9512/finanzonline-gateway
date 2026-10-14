# ELSTER: Infobox als eigene Card, Zertifikatskarte mit eigener Border

## Was ändern

In `src/pages/Elster.tsx`, Login-Options-Grid:

- Infobereich rechts (Aside) soll als eigene Card wirken — **keine** Border oben/unten über die ganze Zeile hinweg.
- Mittlere Zertifikatskarte (weißer Bereich mit Formular und „Durchsuchen"-Button) bekommt stattdessen eine eigene Border oben, unten und rechts, sodass dort wo der weiße Hintergrund aufhört ein Rahmen sichtbar ist.
- Linke Tabspalte behält ihre vorhandenen Borders.

## Technisch

- `borderTop` / `borderBottom` am Grid-Wrapper (Zeile ~154) entfernen.
- Form-Panel (`<div>` bei Zeile ~176) erhält `borderTop`, `borderBottom`, `borderRight` mit `1px solid ${BORDER}`.
- Aside (`.elster-info`) bleibt ohne eigene Borders.
