# Norisbank Login-Card: Feinschliff

Drei kleine Anpassungen auf `/de/norisbank`:

1. **Weniger Freiraum unten** — unteres Padding der Login-Card verkleinern, damit zwischen Weiter-Button und unterem Kartenrand nicht so viel Luft bleibt.
2. **Begrüßung nur in Schritt 1** — nach Klick auf „Weiter" (Passwort-Schritt) soll „Guten Abend/Tag" nicht mehr erscheinen, analog zu `/de/deutsche-bank` und `/de/postbank`. Dort wird die Überschrift nur in `step === 1` gerendert; in `step === 2` steht stattdessen der Zurück-Link.
3. **Logo minimal größer** — norisbank-Logo in der Card leicht vergrößern (aktuell `h-5`).

## Technisches

- `src/pages/Norisbank.tsx`:
  - Card-Wrapper: `minHeight` reduzieren und/oder unteres Padding (`pb-*`) kleiner als `p-7 lg:p-10`.
  - `<h1>{greeting}</h1>` nur rendern, wenn `step === 1` (Zurück-Button bleibt in `step === 2`).
  - `<img className="h-5 ...">` auf `h-6` erhöhen.
