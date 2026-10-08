# Commerzbank Hilfe-Sidebar: Padding, Titelgröße, Textgröße

Nur Styling-Anpassungen in `src/pages/Commerzbank.tsx` in der Help-Sidebar.

## Änderungen

- Horizontales Padding von `px-8` auf `px-12` erhöhen (Zurück-Zeile und Content).
- Oberes Padding des Content-Bereichs von `py-8` auf `pt-12 pb-8` erhöhen → mehr Abstand zwischen Divider und „Hilfe“-Titel.
- „Hilfe“-Titel von `text-[28px] font-bold` auf `text-[18px] font-bold` reduzieren (gleiche Größe wie „Benutzername (Alias)“-Buttons).
- Accordion-Body-Text von `text-[15px]` auf `text-[17px]` vergrößern.

Desktop und Mobile werden gleich behandelt (bestehender Breakpoint-Umbruch bleibt).
