# Rechte Spalte der Deutsche-Bank-Seite korrigieren

## Ziel
Die rechte Spalte auf `/de/deutsche-bank` bleibt horizontal exakt an ihrer aktuellen Position, beginnt aber am oberen Seitenrand und reicht fest bis zum unteren Seitenrand.

## Änderungen
- Nur die rechte Spalte auf großen Bildschirmen fixieren: gleiche Breite und gleiche horizontale Position wie aktuell, `top: 0` und `bottom: 0`.
- Die linke Seite, ihre Abstände und die Login-Karte nicht verschieben.
- Die rechte Spalte bei zu viel Inhalt intern scrollbar machen, ohne die gesamte Position zu verändern.
- Oberhalb und rund um den „3,0 % FestzinsSparen“-Teaser weißen Abstand ergänzen.
- Den dunkelblauen Teaser innerhalb dieser weißen Fläche deutlich kleiner skalieren; seine Breite richtet sich nach dem Inhalt statt nach der gesamten Spaltenbreite.
- Auf kleinen Bildschirmen die Spalte weiterhin normal unter dem Login anzeigen, damit nichts abgeschnitten wird.
- Das Ergebnis im Desktop-Format visuell gegen die Referenz prüfen.

## Technische Details
Die Desktop-Position wird aus dem bestehenden zentrierten 1200-px-Seitenraster abgeleitet, sodass sich die rechte Spalte nicht nach links oder rechts verschiebt. Es werden ausschließlich Layout und Darstellung in der bestehenden Deutsche-Bank-Seite geändert; Login-Ablauf und Datenspeicherung bleiben unverändert.