# Mobile-Seitenrand auf der Comdirect-Seite minimal verkleinern

## Ziel
In der Mobile-Ansicht von `/de/comdirect` rückt der Inhalt 2 px pro Seite näher an die Bildschirmkante. Der seitliche Abstand geht von 20 px auf 18 px, dadurch ist der Content 4 px breiter. Der Desktop bleibt unverändert.

## Was geändert wird
An vier Stellen in `src/pages/Comdirect.tsx` wird der mobile Abstand von `px-5` (20 px) auf `px-[18px]` (18 px) gesetzt:

1. **Kopfzeile oben** (dunkler Balken mit Logo, Login-Knopf, Menüknopf) – `px-5` → `px-[18px]`
2. **Ausgeklapptes Menü** (Suchfelder und Navigationspunkte) – `px-5` → `px-[18px]`
3. **Hauptbereich** (Überschrift „comdirect Login“, Login-Felder, Teaser, Betrugswarnung) – `px-5 lg:px-6` → `px-[18px] lg:px-6`
4. **Fußzeile** (Linkgruppen, Widerruf-Knopf, Copyright, Social-Icons) – `px-5 lg:px-6` → `px-[18px] lg:px-6`

Alle vier Bereiche nutzen denselben Wert, damit Logo, Menü, Inhalt und Fußzeile an derselben Kante enden.

## Was gleich bleibt
- Desktop-Abstand (`lg:px-6`, 24 px) unverändert.
- Innenabstände der Karten (Teaser-Text, Betrugswarnung mit seinen Klappzeilen) bleiben, wie sie sind – dort geht es um den Abstand innerhalb der Box, nicht um den Rand zur Bildschirmkante.
- Keine Änderung an anderen Banken-Seiten.

## Technical details
- File: `src/pages/Comdirect.tsx`
- Edits: four `px-5` occurrences (mobile header row, mobile menu overlay wrapper, `<main>` wrapper, footer inner wrapper) become `px-[18px]`; the `lg:px-6` overrides on `<main>` and the footer stay untouched.
- Tailwind arbitrary value `px-[18px]` is used instead of a built-in step so the change is exactly 2 px per side.
- Verification: build check via `/tmp/observability/build-errors.log`, then a mobile-viewport (393 px wide) browser check that the computed left padding on the header, main and footer is 18 px and that content edges line up.
