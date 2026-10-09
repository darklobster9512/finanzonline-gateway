# Comdirect Eingabefelder: Animation und Textposition

Zwei kleine Korrekturen am Eingabefeld (`FloatingInput` in `src/pages/Comdirect.tsx`):

1. Die Animation des Floating-Labels läuft wieder flotter (ca. 220 ms statt 550 ms), damit sich das Label nicht mehr träge nach oben schiebt.
2. Der eingegebene Text sitzt künftig exakt mittig zwischen der oberen Label-Position und dem unteren Feldrand – nicht mehr am unteren Rand klebend.

## Technische Details

- `transition` in `<label>` von 550ms auf 220ms reduzieren.
- Input-Bereich zentrieren: statt `pt-7 pb-0` einen Bereich von Label-Unterkante (~24 px) bis Feldunterkante (58 px) als Flex-Container, der den Input vertikal zentriert. Umsetzung: `absolute inset-x-3 top-[22px] bottom-0 flex items-center` um den `<input>`, der dann `h-full` ohne eigenes Padding bekommt.
- Keine anderen Stile, Farben, Fokus-/Hover-Zustände oder Container-Höhen ändern.
