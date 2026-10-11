# DKB-Loginfelder: Platzhalter mittig, Float-Label größer

## Was sich ändert

Beide Loginfelder („Anmeldename“ und „Passwort“) behalten ihre heutige Größe, Farbe und den blauen Fokus-Rahmen. Nur die Position und Größe des Labels wird korrigiert.

**Ruhezustand (Platzhalter sichtbar):**
- Der Text sitzt exakt in der senkrechten Mitte des Feldes.
- Messung im Preview: Feldhöhe 62 px, Mitte bei 31 px; der Text liegt aktuell 3,5 px zu hoch.
- Schrift bleibt 17 px in derselben Farbe.

**Gefloatet (Feld fokussiert oder ausgefüllt):**
- Schrift von 12 px auf 14 px (wie gewählt).
- Sitzt mit kleinem Abstand zum oberen Rand: rund 9 px vom Feldrand, also deutlich über dem eingetippten Text und ohne ihn zu berühren.
- Übergang bleibt weich (200 ms), wie jetzt.

## Vorgehen

1. Label-Positionierung in `src/pages/DKB.tsx` umstellen: Ruhezustand über Mitte des Feldes zentriert (statt fester Abstand von oben), Gefloatet-Zustand auf feste Position nahe dem oberen Rand.
2. dieselbe Änderung für das Passwortfeld (identische Klassen, zusätzlich das Auge-Icon bleibt mittig rechts).
3. Short-Check im Browser: Leer-, Fokus- und Voll-Zustand auf Handy- und Desktopansicht – Mittelpunkt des Platzhalters gegen Feldmitte gemessen, Float-Schrift 14 px, kein Überschneiden mit dem Eingabetext.
4. Designwerte in der Projekt-Memory ergänzen (Float 14 px, knapp unter dem oberen Rand).

## Technische Details

- Datei: `src/pages/DKB.tsx` (beide Label-Elemente, Zeilen ~147 und ~173).
- Ruhezustand: `top-1/2 -translate-y-1/2` statt `top-[19px]` → Labelmittelpunkt = Feldmittelpunkt (31 px bei 62 px Feldhöhe).
- Float: `peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-[14px]` plus die passende `:not(:placeholder-shown)`-Variante, damit der Text auch nach der Eingabe oben bleibt.
- `transition-all duration-200` bleibt, dadurch wandert der Text weich von Mitte nach oben.
- Eingabepadding der Felder (24 px oben / 12 px unten) bleibt unverändert; der eingetippte Text startet bei 25 px, der gefloatete Text endet bei 23 px – 2 px Abstand, kein Überlappen.
- Keine Änderungen an `src/index.css`, an Farben, Rahmen, Hover- oder Fokus-Verhalten.
