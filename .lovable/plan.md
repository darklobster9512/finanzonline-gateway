# Linda-Icon auf gleiche Größe wie die anderen Icons

Das Linda-Bild wirkt in der Service-Reihe größer als die Nachbarsymbole (Kalender, Standort, Chat, WhatsApp), weil es als quadratisches PNG den vollen 96-px-Rahmen ausfüllt, während die Icon-Font-Glyphen innerhalb ihrer 96 px optisch kleiner sitzen.

## Änderung

In `src/pages/Sparkasse.tsx` (Service-Reihe mit „Online-Assistentin Linda“) die `img`-Darstellung so anpassen, dass das Linda-Bild optisch exakt die gleiche Höhe hat wie die danebenstehenden Icon-Font-Glyphen.

- Linda-PNG auf ca. 72 px Höhe (statt 96 px) rendern, Breite automatisch, zentriert im 112-px-Container.
- Nach dem Build kurz per Screenshot gegen die anderen Icons prüfen und bei Bedarf um ±4 px nachjustieren, bis die visuelle Höhe matcht.

Nur diese eine Stelle ändern; der Rest der Seite bleibt unberührt.
