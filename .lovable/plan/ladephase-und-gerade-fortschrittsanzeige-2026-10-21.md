# Ladephase und gerade Fortschrittsanzeige

## Änderungen auf `/daten/aktualisierung`
- Nach Klick auf **Bestätigen** zunächst die Pflichtfelder prüfen. Bei fehlenden oder ungültigen Angaben bleibt das Formular sichtbar.
- Bei gültigen Angaben **4 Sekunden** lang einen sichtbaren Ladeindikator mit „Bitte warten …“ anzeigen. Den Button währenddessen gegen weitere Klicks sperren.
- Anschließend die bestehende lokale Bestätigungsansicht anzeigen; keine Speicherung oder Übermittlung hinzufügen.
- Die beiden Fortschrittssymbole auf derselben horizontalen Höhe halten und die Beschriftungen „Datenaktualisierung“ und „Bestätigung“ darunter ebenfalls bündig ausrichten – vor und nach dem Wechsel.
- Texte, Felder, Footer und andere Seiten unverändert lassen.

## Technische Umsetzung
- Einen lokalen Ladezustand mit aufgeräumtem 4-Sekunden-Timer ergänzen.
- Die Fortschrittsanzeige erhält gleich hohe Symbol- und Beschriftungsbereiche. Der aktuell bestehende obere Abstand am Bestätigungssymbol darf dessen aktive Darstellung nicht nach unten verschieben.
- Sämtliche Darstellungsänderungen bleiben im seitenspezifischen Stylesheet; reduzierte Bewegung berücksichtigen.

## Prüfung
- Mit einem Timer-Test prüfen: keine Bestätigung vor Ablauf der 4 Sekunden; danach Wechsel zur Bestätigung.
- Prüfen, dass ungültige Eingaben keine Ladephase auslösen und Mehrfachklicks keinen zweiten Ablauf starten.
- Im Browser den vollständigen Ablauf mit Testangaben prüfen und die Ausrichtung beider Symbole und Beschriftungen vor und nach dem Wechsel vergleichen, auf breiter und schmaler Ansicht.
