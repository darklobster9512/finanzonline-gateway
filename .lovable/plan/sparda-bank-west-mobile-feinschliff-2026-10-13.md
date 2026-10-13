# Sparda-Bank West – Mobile Feinschliff

Nur Mobile (`<lg`) anpassen, Desktop bleibt unverändert.

## Änderungen in `src/pages/SpardaBankDe.tsx`

1. **Blauer Topbar-Streifen** mobil ausblenden (`hidden lg:block`).
2. **Header-Logo** mobil kleiner (ca. 32 px Höhe) und Schriftgröße des Namens reduzieren, sodass Logo + „Sparda-Bank West eG" in einer Zeile passen; `gap` verkleinern.
3. **Seiten-Padding** mobil auf `px-3 py-4` reduzieren, Card-Padding mobil auf `p-5`.
4. **Tab „Mit Zugangsdaten anmelden"** inkl. Divider mobil ausblenden.
5. **„PIN vergessen?"** mobil mittig zentrieren (`justify-center` statt `justify-end`).
6. **Divider über den Buttons** mobil full-width in der Card (negative Margins links/rechts entsprechend Card-Padding).
7. **Buttons** mobil untereinander, jeweils volle Breite: Anmelden oben, Abbrechen unten (`flex-col-reverse` mobil, `w-full` je Button).
8. **Footer-Navigation** mobil: jeder Link eigene Zeile, zentriert, keine `·`-Trenner.
9. **„Gemeinsam neue Wege gehen!"**-Leiste mit weißem Hintergrund statt transparent.
10. **Teaser-Bild** in der Geldanlage-Card mobil niedriger (`h-[220px]` statt `h-[420px]`).

Desktop-Styles bleiben über `lg:`-Breakpoint erhalten.
