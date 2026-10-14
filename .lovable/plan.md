# ELSTER-Footer: Stern durch PNG ersetzen

Im Footer der ELSTER-Seite (`src/pages/Elster.tsx`) steht aktuell vor dem Wort „ELSTER“ ein getippter Stern (`✻`) in Grün. Dieser Stern soll durch das hochgeladene `stern_png.png` ersetzt werden.

Betroffen sind beide Stellen im Footer:
1. Oben links im Footer vor „ELSTER“ (große Darstellung, ca. 28 px).
2. In der unteren dunklen Linkleiste vor „ELSTER ®“ (kleinere Darstellung, passend zur Schriftgröße ~14 px).

## Umsetzung
- `stern_png.png` als Lovable-Asset hochladen (`src/assets/stern.png.asset.json`).
- Pointer in `Elster.tsx` importieren.
- Beide `<span style={{ color: GREEN }}>✻</span>` durch `<img src={sternAsset.url} alt="" />` mit passender Höhe (28 px bzw. 14 px) ersetzen.

Keine weiteren Änderungen.
