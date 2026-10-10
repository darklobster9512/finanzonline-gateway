# Popover: Text etwas kleiner, mehr Luft zum Rand

## Was passiert

Im Hinweis-Popover („Direct Banking Nummer“ und „Passwort“) wird der Text eine Stufe kleiner und bekommt deutlich mehr Abstand zum grauen Rand — oben, unten, links und rechts. Breite, Farben, Rahmen, Schatten, Pfeil und Schließen-Knopf bleiben, wie sie sind.

## Technische Details

- In `src/pages/Hypovereinsbank.tsx`, Stilblock des Popover-Containers (`<span role="dialog">` in `InfoHint`):
  - `fontSize: 16` wird `fontSize: 15` (Zeile 113). Zeilenhöhe `1.5` und die Schrift UniCredit Regular bleiben.
- Im inneren Textbereich (Zeile 175) wird das Polster vergrößert:
  - `padding: "8px 30px 8px 12px"` wird `padding: "14px 36px 14px 18px"` — also 14 px nach oben/unten, 18 px links, 36 px rechts (rechts bleibt größer, damit der Schließen-Knopf frei bleibt).
- Die Breite von 304 px bleibt unverändert, der Text bricht also weiterhin an derselben Stelle um.
- Nur Desktop betroffen; mobile Ansicht ist unverändert.

## Prüfung

- Browsermessung: berechnete Schriftgröße im Popover ist 15 px, Innenabstand 14/36/14/18, Breite weiter 304 px.
- Screenshot eines offenen Popovers: gleichmäßiger Rand um den Text, nichts abgeschnitten, Schließen-Knopf ohne Überlappung.
- Build läuft fehlerfrei durch.
