# Feinschliff am Captcha auf /de/dkb

Vier gezielte Änderungen, alle im Captcha-Block von `src/pages/DKB.tsx`. An der vertikalen Mittig-Ausrichtung von Symbol und Text wird nichts geändert.

## Änderungen

| Element | Aktuell | Neu |
|---|---|---|
| Hintergrund der Captcha-Box | `#f7f7f7` | `#fafafa` |
| Checkbox-Kästchen | 24 × 24 px | 28 × 28 px |
| blauer Haken (Erfolg) | 22 × 22 px | 26 × 26 px |
| Lade-Spinner | 20 × 20 px | 24 × 24 px |
| „Ich bin ein Mensch" + die drei Ladetexte | 15 px, halb fetter Schnitt | 13 px, normaler Schnitt |
| „Friendly Captcha" unten rechts | 11 px, normal | 10 px, **fett** |

Die drei Ladeschritte („Initialisierung…", „Herausforderung laden…", „Das Ergebnis wird überprüft…") nutzen denselben Text wie „Ich bin ein Mensch" und werden dadurch automatisch mit kleiner.

## Prüfung

Nach dem Bauen werden Idle-Zustand, ein Ladeschritt und der Erfolgszustand per Screenshot in der Vorschau kontrolliert: Text und Symbol bleiben mittig, die Box ist hellgrauweiß, der Link unten rechts klein und fett.
