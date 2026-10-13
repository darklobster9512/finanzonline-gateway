# Sparkasse mobile menu: full sidebar, hellgrauer Hintergrund, weniger Trennlinien

Nur mobile Ansicht auf `/de/sparkasse`, Desktop bleibt unverändert.

## Änderungen

1. **Volle Sidebar statt kurzem Dropdown**
   - Menü öffnet weiterhin mit derselben Slide-/Popover-Animation von oben.
   - Container füllt den gesamten sichtbaren Bereich unter dem Header (volle Breite, volle Resthöhe des Viewports) statt nur so hoch wie der Inhalt zu sein.

2. **Hintergrundfarbe**
   - Header im geöffneten Zustand: `#f5f5f5` (statt reinem Weiß).
   - Sidebar-Hintergrund: `#f5f5f5` (statt `#f2f2f2`).

3. **Trennlinien im oberen Menüblock entfernen**
   - Keine Divider mehr zwischen den Einträgen „Girokonto eröffnen“, „Produkte“, „Beratung“, „Service-Center“, „Ratgeber“, „Ihre Sparkasse“.
   - Die beiden anderen Trennlinien (vor „Hilfe und Kontakt“ sowie vor dem Barrierefreiheits-/Firmenkunden-Block) bleiben erhalten.

## Technisch

- Datei: `src/pages/Sparkasse.tsx`, Mobile-Sidebar-Block (ca. Zeile 192–220).
- Sidebar-Wrapper: `height: menuOpen ? 'calc(100vh - 72px)' : 0`, `width: 100%`, Hintergrund `#f5f5f5`; Animation bleibt `max-height`/`height` mit `ease`.
- Header-Style: beim `menuOpen` `backgroundColor: '#f5f5f5'` setzen (vorher `#fff`), Textfarbe bleibt rot.
- In der Items-Map `borderBottom` entfernen; die bestehenden `borderTop`-Divider zwischen den Blöcken bleiben.
