## Kategorie-Cards zwischen Hero und Body

6 Cards mit KI-generierten Bildern, exakt wie im Screenshot: Die obere Hälfte der Cards ragt in den blauen Hero-Bereich, die untere Hälfte in den weißen Body-Bereich.

### Umsetzung

1. **6 Bilder per KI generieren** (je ~400x300):
   - Hotels entdecken (Hotelpool/Resort)
   - Stromtarife vergleichen (Windräder/Energie)
   - Ferienwohnung buchen (Ferienhaus am See)
   - Handytarife vergleichen (Smartphone)
   - Steuer gratis erledigen (Steuerformular/Laptop)
   - Finanzprodukte vergleichen (Geldscheine/Charts)

2. **Layout-Anpassung in `Check24.tsx`**:
   - Hero-Container bekommt extra `pb-[100px]` Padding unten
   - Neuer Card-Container mit `relative -mt-[80px] z-10` → Cards ragen nach oben in den Hero
   - 6 Cards in einer horizontalen Scroll-Row (mobile) / 6-Spalten-Grid (Desktop)
   - Jede Card: weißer Hintergrund, Titel oben, Bild darunter, Border + leichter Schatten, rounded corners

3. **`<main>` Anpassung**: `space-y` bleibt, Cards-Section kommt vor dem bisherigen Content.
