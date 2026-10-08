# Comdirect Footer 1:1 nachbauen

Der Footer unter `/de/comdirect` wird komplett neu aufgebaut, damit er dem Screenshot entspricht.

## Was sichtbar anders wird

- Logo links in gelb (`#FFF500`), aus dem gelieferten SVG-Pfad (240×40 viewBox), nicht mehr der kleine Wordmark.
- Vier Linkspalten rechts daneben in exakt dieser Reihenfolge und mit genau diesem Inhalt:
  1. Kontakt, Über uns, Presse, Magazin, Barrierefreiheit
  2. Karriere, Community, Apps, Kunden werben Kunden
  3. Impressum, Datenschutz, Einwilligungseinstellungen, Sicherheit, Nutzungsbedingungen, AGB
- Darunter in einer Zeile:
  - links: Pill-Button „Vertrag widerrufen ›“ (dunkleres Petrol, abgerundet)
  - mittig: „© comdirect – eine Marke der Commerzbank AG“
  - rechts: Facebook-, YouTube-, Instagram-Icons (aus dem gelieferten HTML, `currentColor` weiß)
- Dekoration:
  - Links unten: vier dunkelgraue gefüllte Kreise plus ein Ring (Donut) oben – exakt wie im `footer__shape`-SVG.
  - Rechts: ein großer Ring mit halbgelbem Segment, wie im Screenshot.
- Hintergrund dunkel `#0B1E25` (bleibt), Linktext hellgrau, Hover unterstrichen.
- Links öffnen in neuem Tab mit den im HTML gelieferten URLs (comdirect.de, Commerzbank-Jobs, Community etc.). Nur „Einwilligungseinstellungen“ bleibt `#`.

## Technisches

- Nur `src/pages/Comdirect.tsx` wird geändert.
- Neues `footerLinks`-Array mit `{label, href, external}` ersetzt `footerCols`.
- Neue Komponenten `FooterLogo` (240×40 SVG-Pfad aus Upload) und `FooterShape` (das `footer__shape`-SVG mit linken Kreisen und rechtem Donut), beide inline.
- `SocialIcons` nutzt die drei SVG-Pfade aus dem HTML-Upload (saubere Ränder, 24×24).
- Layout: `max-w-[1200px]`, Grid `grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr]`, darunter Flex-Zeile mit Button/Copyright/Social.
- Shape-SVGs sind `absolute inset-0`, `pointer-events-none`, hinter dem Content.
