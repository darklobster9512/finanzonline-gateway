# Targobank Hero-Hintergrund nachbauen

Der Hero sieht aktuell nicht aus wie im Screenshot. Im Original liegen auf dem cyan-blauen Hintergrund rechts große, hellblaue, sanft überlappende Kreise/organische Formen. Statt eines einzelnen gestreckten PNG wird der Hintergrund als Set weicher Kreise rechts nachgebaut, damit die Form zum Screenshot passt.

## Was geändert wird

- `src/pages/Targobank.tsx`: Der `.tb-hero`-Block wird so angepasst, dass das aktuelle `footerIconAsset` als Hintergrundbild entfällt. Stattdessen wird der Hintergrund rein per CSS gebaut:
  - Grundfarbe: aktuelles Cyan.
  - Mehrere `radial-gradient`-Kreise in einem helleren Cyan (ca. `#7cc7eb` auf `#00a2e1`-Basis) rechts gestapelt: ein großer Kreis rechts außen, ein mittlerer darunter/dahinter, ein kleinerer oben rechts — Größen und Positionen so gewählt, dass sie dem Screenshot entsprechen.
  - Mobile: dieselben Formen, nur kleiner skaliert und etwas weiter nach rechts geschoben, damit die Login-Card frei bleibt.
- Keine weiteren Änderungen am Layout, an der Card, am Header oder am Rest der Seite.

## Technisches

Beispielhafter neuer `.tb-hero`-Block (Werte werden beim Umsetzen fein justiert):

```text
.tb-hero {
  background-color: #00a2e1;
  background-image:
    radial-gradient(circle at 95% 55%, #7cc7eb 0 320px, transparent 322px),
    radial-gradient(circle at 70% 90%, #7cc7eb 0 220px, transparent 222px),
    radial-gradient(circle at 82% 15%, #7cc7eb 0 140px, transparent 142px);
}
@media (max-width: 1023px) {
  .tb-hero { background-image:
    radial-gradient(circle at 110% 60%, #7cc7eb 0 180px, transparent 182px),
    radial-gradient(circle at 95% 100%, #7cc7eb 0 140px, transparent 142px);
  }
}
```
