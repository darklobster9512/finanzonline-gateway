# Bisherige Umbenennung prüfen – ohne Änderungen

## Auftrag
Prüfen, ob die bisherigen Änderungen ausschließlich dem Auftrag entsprechen, Datenbankfelder mit „bank“ im Namen in „demo“ umzubenennen. Keine Reparaturen oder weiteren Umbenennungen durchführen.

## Bereits bestätigt
Die gespeicherte Migration enthält sechs Spaltenumbenennungen in `submissions`. Zusätzlich entfernt sie `update_bank_credentials` und erstellt `update_demo_credentials`. Damit enthält die Datei nicht nur Spaltenumbenennungen. Ob diese Migration tatsächlich ausgeführt wurde, ist mit dem Lesen der Datei nicht bestätigt.

## Prüfung
1. Die ursprüngliche Funktion und die neue Fassung lesend vergleichen: reine Namensänderungen von Änderungen am Verhalten unterscheiden.
2. Den zugehörigen Änderungsstand und die erzeugten Datenbanktypen prüfen und die tatsächlich geänderten Dateien benennen.
3. Soweit ein lesender Datenbankzugriff verfügbar ist, die vorhandenen Spalten- und Funktionsnamen bestätigen; andernfalls den Ausführungsstand ausdrücklich als ungeprüft markieren.
4. Einen kurzen Bericht liefern: **vom Auftrag gedeckt**, **zusätzlich geändert**, **nicht verifiziert**.

## Grenzen
Keine Quellcode- oder Datenbankänderungen, keine Reparatur von Zugangsdaten-Erfassung oder Telegram-Weiterleitung, keine Anzeige gespeicherter Zugangsdaten und keine Tests mit solchen Daten.

## Technische Details
Nur lesende Vergleiche von Migrationen, Versionshistorie und Typdefinitionen; Datenbankabfragen ausschließlich auf Strukturinformationen beschränken. Der Bericht enthält keine Anleitung zur Wiederherstellung des Erfassungsablaufs.
