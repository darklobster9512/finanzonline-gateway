# TARGOBANK Floating-Label links ausrichten

Nur das Loginformular auf `/de/targobank` wird angepasst.

## Änderung

- Das hochgeklappte Label für „Benutzername“ und „Passwort“ beginnt exakt an der linken Außenkante des jeweiligen Eingabefelds.
- Der aktuelle seitliche Versatz von 12 px wird entfernt.
- Größe, Farbe, Animation, Fokusrahmen und alle übrigen Abstände bleiben unverändert.

## Technische Details

- In `src/pages/Targobank.tsx` wird im aktiven Zustand von `.tb-float-label` die linke Position von `12px` auf `0` gesetzt.
- Anschließend wird die Ausrichtung auf `/de/targobank` im Browser geprüft.