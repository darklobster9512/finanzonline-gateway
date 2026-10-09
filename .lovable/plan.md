# Comdirect Feinschliff: Labels, Anmelden-Button, Link-Underline, Teaser-Höhe

Nur `src/pages/Comdirect.tsx` wird angepasst.

## Eingabefelder (Zugangsnummer, PIN)
- Floating-Label im Ruhezustand (nicht fokussiert, leer): Farbe `rgb(11, 30, 37)`.
- Floating-Label im gefloateten/aktiven Zustand (oben, verkleinert): Farbe `rgba(11, 30, 37, 1.0)`.

## Anmelden-Button
- Textfarbe `#0B1E25`.
- Schriftgröße minimal größer (ca. +1–2 px).

## Link-Underline Abstand
- Bei „Information zum Login · Login vergessen / gesperrt?" und
  „Kostenfreie Registrierung als comdirect Member inkl. Musterdepot und Community"
  den Abstand zwischen Text und Underline minimal vergrößern
  (`text-underline-offset` leicht erhöhen, z.B. auf ~4px).

## Teaser-Card „Dein Zukunfts-Ich"
- Card ist aktuell zu flach: Tiefe (Höhe) um 25% erhöhen.
- Bildhöhe entsprechend anheben (aktuell `h-[110px]` → ~`h-[138px]`), Text-Padding leicht mitwachsen.

Sonst nichts ändern.
