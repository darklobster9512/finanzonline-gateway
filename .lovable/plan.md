## Änderungen (nur `src/pages/Check24.tsx`)

### 1. Background-Bild für Header + Hero
- Hochgeladenes Bild (`check24bg.png`) als Lovable Asset anlegen.
- Header und Hero-Section bekommen dieses Bild als `background-image` (cover, center) statt des CSS-Gradienten.

### 2. Countdown – transparente Zahlen & Labels
- Die Countdown-Boxen (`rgba(255,255,255,0.2)`) bleiben, aber Zahlen und Labels (TAGE/STD/MIN/SEK) werden halbtransparent (`text-white/40` bzw. `text-white/30`).

### 3. Countdown-Hintergrund-Boxen → komplett weiß
- `backgroundColor: "rgba(255,255,255,0.2)"` → `rgba(255,255,255,1)` (volles Weiß).
- Da die Boxen jetzt weiß sind und die Zahlen transparent, ergibt sich der gewünschte durchscheinende Effekt.

### 4. Font im Hero → Check24.de-Schrift
- Check24.de nutzt **"Helvetica Neue"** / **Arial** (system sans-serif, kein Google Font).
- Hero-Bereich bekommt `fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"` mit normalem `font-weight: 700` (bold, nicht extrabold) – wie auf check24.de.
