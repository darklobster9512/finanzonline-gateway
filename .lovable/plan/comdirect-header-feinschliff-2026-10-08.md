# Comdirect Header – Feinschliff

Nur der Header auf `/de/comdirect` wird angepasst, nichts anderes.

## Änderungen

1. **Logo-Block (gelb)**
   - Gelbton auf `rgb(255, 245, 0)` setzen.
   - Logo kleiner skalieren (Wortmarke-Höhe von 28 → ~22 px, Block-Breite schmaler, z. B. `minWidth: 220`).

2. **Obere Zeile (Musterdepot / B2B / Suchfelder)**
   - "Musterdepot" und "B2B" etwas kleiner (`text-[13px]`), Farbe `rgb(170,176,179)`.
   - Beide Suchfelder: transparenter Hintergrund statt weiß, 1 px Border in `rgb(170,176,179)`.
   - Platzhaltertexte „WKN, ISIN, Name" und „Volltextsuche" dicker (font-weight 600) und Farbe `rgb(170,176,179)`; Lupen-Icon in gleicher Farbe.

3. **Navbar (Persönlicher Bereich … Hilfe & Service)**
   - Alle Links auf `font-normal` (nicht fett).
   - Nav linksbündig starten – exakt an derselben x-Position wie der Beginn des gelben Logo-Blocks (Container ohne zusätzliches Padding links, `justify-start`).

## Technisches

- Datei: `src/pages/Comdirect.tsx`, nur Header-Markup (Zeilen ~257-294) sowie `YELLOW`-Konstante.
- Platzhalterfarbe über eine kleine Inline-`<style>`-Regel oder Tailwind `placeholder:text-[rgb(170,176,179)] placeholder:font-semibold` setzen; Input-Textfarbe gleich.
- Keine Änderungen an Main, Footer, Logik.
