# Postbank Mobile: Abstand oben kleiner, Ausblenden unten weg

Zwei Änderungen, nur in der mobilen Ansicht von `/de/postbank`. Desktop bleibt unverändert.

## Was sich ändert

1. **Weniger Leerraum zwischen oberem Seitenrand und Login-Karte**
   Aktuell liegen 180 px Foto über der gelben Karte. Das wird auf 110 px reduziert – die Karte rückt spürbar höher, vom Foto bleibt trotzdem ein Streifen mit dem Kopf der Frau über der Karte sichtbar.

2. **Weicher Übergang unten am Bild entfernen**
   Unten läuft das Foto in einer sanften Blende ins Helle aus. Diese Blende wird entfernt. Das Foto endet dann an einer klaren Kante direkt über dem weißen Inhaltsbereich.

## Ablauf

- Mobile-Header-Abstand in `src/pages/Postbank.tsx` verkleinern.
- Blenden-Layer aus der mobilen Bild-Definition entfernen, so dass nur noch das Foto selbst liegt.
- Mit einem Handy-Screenshot prüfen: Karte sitzt höher, kein weicher Übergang mehr unten, Desktop unverändert.
- Build-Log gegenlesen.

## Technical details

In `src/pages/Postbank.tsx`:

- Zeile 499: Wrapper-Klasse `pb-hero-bg px-2 pt-[180px] pb-10` → `pt-[110px]` (seitliche und untere Abstände bleiben).
- Zeilen 465–472: der `linear-gradient(...)`-Layer wird aus `background-image` gestrichen; es bleibt nur `url(...)` mit `background-size: cover`, `background-position: left top`, `background-repeat: no-repeat`. Die zugehörigen Doppelwerte in `background-size` / `background-position` / `background-repeat` werden auf je einen Wert zurückgeführt.
- Die `@media (min-width: 1024px)`-Regel für Desktop bleibt byte-identisch.

Der 110-px-Wert ist ein Vorschlag – sag einfach „enger“ oder „mehr Abstand“, dann passe ich ihn an.
