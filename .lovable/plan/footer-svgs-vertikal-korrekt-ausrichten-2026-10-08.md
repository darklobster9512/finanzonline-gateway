# Footer-SVGs vertikal korrekt ausrichten

## Ziel
Die beiden dekorativen SVGs im comdirect-Footer sollen nicht nur horizontal, sondern auch vertikal exakt wie in `footer-5.png` sitzen.

## Umsetzung
- Die bisherige gemeinsame Ausrichtung an der Footer-Unterkante entfernen.
- Beide Grafiken unabhängig mit festen oberen Positionen ausrichten:
  - linkes Kreiselement nahe der oberen Footer-Kante, mit dem Viererblock darunter
  - rechtes Ringelement auf Höhe des Logos und der oberen Linkzeilen
- Größe und horizontale Position unverändert lassen.
- Footer-Inhalt, Texte, Abstände und alle übrigen Seitenelemente unverändert lassen.
- Die Positionen bei der aktuellen Desktopbreite von 1572 px direkt gegen die Referenz vergleichen und bei Bedarf pixelgenau nachjustieren.

## Technische Details
Die SVG-Wrapper erhalten getrennte `top`-Positionen statt `bottom-0`, damit ihre vertikale Lage nicht mehr von der tatsächlichen Footer-Höhe abhängt. Anschließend werden Build und Desktopdarstellung geprüft.