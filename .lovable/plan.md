# Rechte Footer-Ausrichtung korrigieren

- Den Textblock in der rechten Footer-Spalte an den rechten Rand setzen. Die einzelnen Zeilen bleiben innerhalb dieses Blocks linksbündig.
- Dadurch endet der längste Eintrag „Nutzungsbedingungen“ genau an der rechten Außenkante der Karte „Persönliche Informationen“.
- Linken Abstand, 70/30-Spaltenaufteilung, weiße Schrift und bestehende Inhalte unverändert lassen.

## Technische Umsetzung und Prüfung
- Nur die seitenspezifischen Footer-Regeln in `src/pages/DatenAktualisierungNeu.css` anpassen: rechten Flex-Container mit `align-items: flex-end` ausrichten und die enthaltenen Texte auf eine gemeinsame, am längsten Eintrag orientierte Blockbreite bringen.
- Im Browser prüfen, dass die rechte Textkante des längsten Eintrags mit der rechten Kartenkante übereinstimmt und nichts überläuft.
- Keine Änderungen an Eingaben, Speicherung, Übermittlung oder anderen Seiten.
