# Comdirect Mobile-Menü als feste Vollbild-Ebene

Nur das geöffnete mobile Hamburger-Menü auf `/de/comdirect` ändern. Desktop bleibt unverändert.

## Verhalten

- Beim Öffnen das Scrollen der gesamten Seite sperren, damit weder Hintergrund noch Header wegrutschen können.
- Das Menü fest an den sichtbaren Bildschirm binden und weiterhin direkt unter dem 88-px-Header beginnen lassen.
- Die interne Scrollbar des Menüs entfernen; der vorhandene Menüinhalt bleibt vollständig in der verfügbaren Bildschirmhöhe sichtbar.
- Beim Schließen über X oder Escape die Scrollsperre zuverlässig entfernen und die vorherige Seitenposition beibehalten.

## Technisch

- In `src/pages/Comdirect.tsx` einen an `menuOpen` gebundenen Effekt ergänzen, der `document.body` gegen Scrollen sperrt und beim Schließen beziehungsweise Verlassen der Seite aufräumt.
- Beim mobilen Menü `overflowY: auto` durch eine nicht scrollbare Darstellung ersetzen.
- Header und Menü bleiben als getrennte feste Ebenen mit bestehender Animation und korrekter Stapelreihenfolge erhalten.

Keine Änderungen an Größen, Inhalten oder Desktop-Darstellung.