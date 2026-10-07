# Deutsche-Bank-Seitenleiste korrigieren

## Ziel
Die sichtbare Scrollbar innerhalb der rechten Seitenleiste auf `/de/deutsche-bank` entfernen, ohne die zuletzt festgelegte Position oder Breite der Spalte zu verschieben.

## Umsetzung
- Die Ursache in der Desktop-Regel der rechten Spalte beheben: Die aktuell erzwungene sichtbare `overflow-y`-Scrollbar wird entfernt.
- Falls der Inhalt bei niedriger Fensterhöhe weiterhin innerhalb der feststehenden Spalte gescrollt werden muss, bleibt das Scrollen möglich, aber die Scrollbar selbst wird in Chrome, Safari und Firefox unsichtbar.
- Bild, Texte, Trennlinien, Hinweisbereiche und Fußzeile bleiben in derselben Reihenfolge und werden nicht horizontal verschoben.
- Anschließend die Seite bei der aktuellen Desktop-Größe prüfen: keine sichtbare Scrollbar in der weißen Spalte, kein abgeschnittener Inhalt und unveränderte Ausrichtung.

## Technischer Hinweis
Die Änderung bleibt auf die Deutsche-Bank-Seite und die Klasse der rechten Spalte begrenzt; andere Seiten werden nicht beeinflusst.