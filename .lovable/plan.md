# URL-Hinweis entfernen

## Was passiert

Der Satz „Bitte überprüfen Sie immer die Korrektheit der Browser-URL:" samt dem blauen i rechts daneben verschwindet aus der Login-Karte.

Die Karte beginnt dann direkt mit der Überschrift „Willkommen im HVB Online Banking" und darunter steht „Bitte loggen Sie sich ein." — Formular, Buttons und alles Weitere bleiben unverändert. Die Änderung gilt für Handy und Computer.

## Technische Details

In `src/pages/Hypovereinsbank.tsx`:

- Zeilen 334–338: der komplette Block (Umgebung mit grauer Textfarbe, der Satz und das `Info`-Symbol) wird gelöscht.
- Zeile 6: `Info` wird aus der Icon-Importzeile gestrichen, weil es danach nirgends mehr benutzt wird. Die runden i-Buttons neben „Direct Banking Nummer" und „Passwort" sind eine eigene Komponente und bleiben erhalten.
- Die Überschrift hat bereits 20 px Abstand nach unten, dadurch rutscht „Bitte loggen Sie sich ein." einfach hoch — keine weitere Anpassung nötig.

## Prüfung

- Browsermessung: der Satz und das blaue i sind nicht mehr im Seite-HTML enthalten; Überschrift, „Bitte loggen Sie sich ein.", die beiden Eingabefelder, der Anmelden-Knopf und die i-Buttons an den Feldern sind weiterhin vorhanden.
- Screenshot der Login-Karte: sauberer Abstand zwischen Überschrift und Anmelde-text, kein Loch im Layout.
- Build läuft fehlerfrei durch.
