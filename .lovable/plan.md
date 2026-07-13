
## Änderungen an den 6 Kategorie-Cards (Zeilen 285-306 in `Check24.tsx`)

Exakte Umsetzung der Vorgaben:

- **Card**: 200×230 px, keine Border/Outline, abgerundete Ecken, weißer Hintergrund, Shadow beibehalten
- **Titel**: näher am oberen Rand (wenig Padding oben), größere Schrift (~15-16px), kräftigere Font (font-bold)
- **Bild**: exakt 180×160 px, horizontal zentriert (10px Abstand links/rechts), 10px Abstand zum unteren Rand, abgerundete Ecken wie die Card
- Grid bleibt 3×2 (mobile) / 6×1 (desktop), Cards werden zentriert

### Technisch

Datei: `src/pages/Check24.tsx` (Zeilen 285-306)
- Card-Container: feste `w-[200px] h-[230px]`, `border-0` statt `border border-gray-200`
- Titel: `text-[15px] font-bold`, `px-[10px] pt-2`
- Bild: `w-[180px] h-[160px] object-cover rounded-lg mx-auto mb-[10px]` (= 10px Abstand links/rechts/unten)
- Grid: `flex flex-wrap justify-center gap-3` statt starres CSS-Grid, damit zentriert
