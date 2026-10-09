# „Direkt zu" Dropdown an Screenshot angleichen

Feinschliff des aufgeklappten Panels, damit es 1:1 zum Screenshot passt.

## Änderungen (nur `src/pages/Comdirect.tsx`)

1. **Trennlinie kürzer und zentriert**: Statt fast voller Breite (`mx-3`) eine kurze, zentrierte, gestrichelte Linie (~120 px breit, mittig), wie im Screenshot (`-----------------`).
2. **Panel-Rahmen**: dünne Linie in dunklerem Grau (`rgb(96, 109, 113)`) statt des helleren Grautons, damit der Rand sichtbarer wird wie im Screenshot.
3. **Zeilenhöhe/Padding**: Einträge etwas luftiger — vertikales Padding von `py-2` auf `py-2.5`, damit die Höhe pro Zeile zum Screenshot passt.
4. **Separator-Eintrag ohne vertikales Padding** (dünne Linie mit etwas Abstand ober-/unterhalb statt direkt an den Nachbarzeilen zu kleben) — Höhe ~1 px Linie + 6 px Luft oben/unten.
5. **Selektierter Eintrag beim Öffnen**: bleibt mit dunklem Hintergrund und weißer Schrift markiert (bereits vorhanden) — Hintergrundfarbe auf `rgb(74, 90, 96)` prüfen und ggf. leicht anpassen, damit der Ton exakt dem Screenshot entspricht.

Alles andere (Feldaussehen geschlossen, doppelte Outline bei Fokus, Reihenfolge der Einträge, Verhalten) bleibt unverändert.
