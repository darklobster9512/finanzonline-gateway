# Comdirect: Teaser-Card und Platzhalter

## Teaser „Dein Zukunfts-Ich fragt, wann du startest"
- Chevron-Pfeil (›) deutlich größer: Icon-Größe von `text-[24px]` auf `text-[40px]` anheben, Padding des Pfeil-Containers leicht reduzieren.
- Card vertikal kompakter: inneres Padding reduzieren (`py-1.5` → `py-1`), Zeilenabstände straffen.
- Text-Padding nach oben verringern: Titel-Block näher am oberen Rand (Flex-Ausrichtung `justify-start` + `pt-2` statt `justify-center`).

## Login-Eingabefelder (Zugangsnummer / PIN)
- Inaktive Floating-Label-Farbe von `TEXT_SECONDARY` (#5a6b73) auf die Border-Farbe `rgb(133, 142, 146)` setzen, sodass der „Platzhalter" dieselbe Textfarbe/-font-Wirkung wie der Rahmen hat.

## Technische Details
- Datei: `src/pages/Comdirect.tsx`
- Betroffene Stellen: `FloatingInput` (Zeilen 61–100), Teaser-Card (Zeilen 391–402).
- Keine weiteren Komponenten/Dateien.
