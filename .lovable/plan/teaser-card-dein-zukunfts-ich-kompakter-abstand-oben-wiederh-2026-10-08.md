# Teaser-Card „Dein Zukunfts-Ich" kompakter + Abstand oben wiederherstellen

Aktueller Stand in `src/pages/Comdirect.tsx` (Zeile 391–402):
- Bild ist `w-[155px] object-cover` → zieht die Card-Höhe hoch, weil das Bild die volle Höhe bestimmt.
- Textcontainer: `pt-2 pb-1` → oben zu wenig Abstand.

## Änderungen

1. **Card-Höhe reduzieren**: Bild bekommt feste Höhe (z. B. `h-[110px]`) statt sich an der Card-Höhe aufzuspannen. Container-Alignment auf `items-center`, damit es sauber sitzt.
2. **Abstand oben wiederherstellen**: Textblock von `pt-2 pb-1` auf `py-4` (oder `pt-4 pb-3`) setzen, damit zwischen Oberkante und Titel wieder sichtbarer Abstand ist.
3. Chevron-Container Padding gleich lassen.

Nur die Teaser-Card wird angefasst, nichts anderes.
