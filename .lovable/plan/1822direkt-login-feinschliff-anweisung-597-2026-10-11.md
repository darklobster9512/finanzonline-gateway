# 1822direkt Login-Feinschliff (anweisung-597)

Änderungen in `src/pages/Direkt1822.tsx`:

1. Links fett: „Online-Kennung vergessen?“, „Neu im Online-Banking?“, „Online-PIN vergessen?“ auf `fontWeight: 700`.
2. Deaktivierter „Anmelden“-Button Hintergrund `#757575` (statt `#8a8a8a`).
3. Eingabefelder (Kennung + PIN-Wrapper): Border `2px solid #176BC0`.
4. Fokus: Zusätzliche äußere Doppel-Outline in `#e6ebf0` mit kleinem Abstand (via `box-shadow: 0 0 0 3px #fff, 0 0 0 5px #e6ebf0` oder `outline` + `outline-offset`). Innere 2px-Border bleibt `#176BC0`. Umsetzen über `onFocus`/`onBlur`-State pro Feld.
5. PIN-Divider zwischen Icons: Farbe weiß statt navy, Höhe reduziert (nicht full-height, nur knapp höher als das Icon, z. B. 28px zentriert) — statt `borderLeft` ein mittig positioniertes `<span>` mit `width:1px; height:28px; background:#fff`.
6. Login-Card und 30-Jahre-Card: leichter Schatten (z. B. `box-shadow: 0 4px 14px rgba(0,56,106,.10)`).
