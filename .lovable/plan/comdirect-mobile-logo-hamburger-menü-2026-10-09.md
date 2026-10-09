# Comdirect Mobile – Logo & Hamburger-Menü

Nur mobile Ansicht von `/de/comdirect`. Desktop unverändert.

## Änderungen

- C-Logo im mobilen Header verkleinern (von 70 px auf ca. 54 px).
- Hamburger-Menü: Header bleibt beim Öffnen sichtbar; das Overlay beginnt direkt unterhalb des Headers (nicht über ihn).

## Technisch

- `src/pages/Comdirect.tsx`:
  - `CMark size={70}` → `size={54}` im mobilen Header-Block.
  - Mobile Header-Container erhält `sticky top-0 z-50` (bleibt sichtbar).
  - Overlay-Container: statt `fixed inset-0` → `fixed left-0 right-0 bottom-0 top-32` (startet unter dem 128 px hohen Header). Transform/Transition bleibt gleich.
