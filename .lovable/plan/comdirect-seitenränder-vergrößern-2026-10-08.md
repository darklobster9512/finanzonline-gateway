# Comdirect: Seitenränder vergrößern

Der gesamte Seiteninhalt (Header, Navbar, Login/Teaser-Bereich, Footer) soll denselben, schmaleren Content-Rahmen bekommen. Die äußere Breite richtet sich an den Navbar-Punkten aus — alle Bereiche beginnen und enden auf derselben Linie.

## Umsetzung

In `src/pages/Comdirect.tsx` den gemeinsamen Container von aktuell `max-w-[1200px] mx-auto px-6` auf einen schmaleren Rahmen umstellen (ein einziger Wert, überall gleich), konkret auf `max-w-[1040px] mx-auto px-6`. Betroffen sind die vier Stellen:

- Header-Zeile (Logo + Suche + Login)
- Navbar-Zeile
- Main (Login-Formular + Teaser/Warnung)
- Footer

Keine inhaltlichen Änderungen, nur Container-Breite. Innenaufbau (Spalten, Teaser, Footer-Grid) bleibt wie bisher und zentriert sich automatisch im neuen schmaleren Rahmen.
