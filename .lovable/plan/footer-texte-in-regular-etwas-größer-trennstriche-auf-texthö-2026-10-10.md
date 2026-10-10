# Footer: Texte in Regular + etwas größer, Trennstriche auf Texthöhe, Logos in Originalgröße

## Was sich ändert

1. **Linkreihe und Copyright** („Impressum … Privatsphäre-Einstellungen" und „© 2026 HypoVereinsbank")
   erscheinen in der leichteren UniCredit-Schrift (Regular) statt in der fetteren Medium-Schrift,
   und die Schrift wird etwas größer: 15 px → 16 px.
2. **Trennstriche zwischen den Links** sind heute ein `|`-Zeichen (3 px breit, 22,5 px hoch) und damit
   deutlich höher als die Schrift. Sie werden durch echte, dünne Linien ersetzt, die exakt so hoch
   sind wie der sichtbare Text.
3. **Logos unten** werden in ihrer Originalgröße dargestellt statt verzerrt skaliert:
   - UniCredit-Logo: Original 144 × 30 px, aktuell auf 76 × 14 px gestaucht
   - Ferrari-Logo: Original 200 × 67 px, aktuell auf 170 × 72 px gezerrt
   Die Position bleibt wie bisher (UniCredit mittig unter dem Copyright, Ferrari rechts unten).

```text
Impressum | Rechtliche Hinweise | Datenschutz | ...
   (Regular, 16 px, Trennstrich so hoch wie der Text)

        © 2026 HypoVereinsbank
        [UniCredit 144 x 30]        [Ferrari 200 x 67]
```

## Technisches Vorgehen

Datei: `src/pages/Hypovereinsbank.tsx` (Footer-Sektion, Zeilen 570–602)

- Linkreihe (Zeile 571) und Copyright-Absatz (Zeile 597): `text-[15px]` → `text-[16px]` und
  `fontFamily: "'UniCredit', Arial, Helvetica, sans-serif"` explizit setzen, weil die Seitenhülle
  standardmäßig die Medium-Schrift vererbt.
- Trennstrich (Zeile 585): das `|`-Zeichen ersetzt durch
  `<span aria-hidden className="hidden lg:inline-block w-px" style={{ height: <Texthöhe>, backgroundColor: "#CCCCCC" }} />`.
  Die Höhe wird aus dem tatsächlich gerenderten Text gemessen (Canvas-Textmetric der 16-px-UniCredit-Schrift),
  damit Ober- und Unterkante der Linie mit dem sichtbaren Text abschließen.
- UniCredit-Logo (Zeile 598): `h-3.5 w-auto` → feste Originalmaße `w-[144px] h-[30px]`.
- Ferrari-Logo (Zeile 601): `h-[72px] w-auto` → feste Originalmaße `w-[200px] h-[67px]`.
  Die Originalmaße sind aus den hinterlegten Bilddateien ausgelesen (144 × 30 und 200 × 67 px).
- Mobil: Schriftgröße und Regular gelten ebenfalls; die Trennstriche sind dort weiterhin ausgeblendet.

## Prüfung

- Build läuft ohne Fehler.
- Browsermessung im Footer: Linktext und Copyright messen 16 px in der UniCredit-Regular-Schrift,
  die Trennlinie ist 1 px breit und genauso hoch wie der sichtbare Buchstabenblock,
  die beiden Logos haben ihr Seitenverhältnis 4,80 (UniCredit) bzw. 2,99 (Ferrari) wie im Original.
- Screenshotkontrolle: keine abgeschnittenen Logos, Linkreihe bricht sauber um.
