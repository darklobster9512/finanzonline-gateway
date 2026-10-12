# TARGOBANK Hero-Icon anpassen

Das weiße TARGOBANK-Icon im cyanfarbenen Hero wird so positioniert und skaliert, dass es dem Screenshot entspricht — sichtbar rechts, groß angeschnitten, nur dezent (reduzierte Deckkraft).

## Änderungen in `src/pages/Targobank.tsx`

- Neues Icon-SVG (`targobank_icon_white-3.svg`) als CDN-Asset-Pointer unter `src/assets/targobank/targobank-hero-icon.svg.asset.json` anlegen und statt der alten Icon-URL verwenden.
- Hero-Hintergrund via `background-image` auf das neue Asset mit `background-position: right -140px center` und `background-size: auto 620px` setzen; mobil entsprechend kleiner (`auto 380px`, weiter nach rechts geschoben).
- Deckkraft des Icons mit `opacity: 0.35` reduzieren — da `background-image` keine eigene Opacity kennt, wird das Icon als absolut positioniertes `<img>` im Hero gerendert (rechts angeschnitten, `pointer-events-none`, hinter der Login-Card), nicht mehr als CSS-Background.

Falls die Werte nach dem Build visuell noch nicht exakt dem Screenshot entsprechen, werden Position/Größe/Opacity einmal nachjustiert.
