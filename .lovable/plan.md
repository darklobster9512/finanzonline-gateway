# Chevron-Icon an Comdirect-Original anpassen

Die aktuellen Chevrons stammen aus Lucide (`ChevronRight`) und sehen zu dick/eckig aus. Im Original nutzt comdirect ein Icon-Font-Glyph `.button__icon` (angle-right, Codepoint `\e91d` in Medium bzw. `\e91e` Regular) – ein schlankes, hohes „›“.

## Umsetzung

- Neue kleine SVG-Komponente `ComdirectChevron` in `src/pages/Comdirect.tsx` (oder inline), die ein dünnes angle-right nachbildet:
  - viewBox `0 0 16 16`, stroke `currentColor`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, Pfad `M6 3 L11 8 L6 13`.
  - Größe passt sich via `width/height` (1em) der Textgröße an, Farbe erbt per `currentColor`.
- Alle vier Stellen ersetzen, die aktuell `ChevronRight` nutzen:
  1. Login-Button „Anmelden“
  2. Teaser-Card „Dein zukunftssicher“-CTA
  3. „Depot eröffnen“
  4. „Girokonto eröffnen“
- Lucide-Import für `ChevronRight` entfernen, falls nicht mehr genutzt.
- Keine weiteren Styles/Abstände ändern.

## Technische Details

Icon-Font ist nicht lizenziert verfügbar; ein nachgebautes SVG ist der einfachste 1:1-Ersatz und erbt automatisch Farbe/Größe des Buttons.
