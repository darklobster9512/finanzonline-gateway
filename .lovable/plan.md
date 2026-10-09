# Comdirect Mobile Header anpassen

Nur die mobile Ansicht von `/de/comdirect` ändern. Desktop bleibt gleich.

## Änderungen

- Das gelbe C-Logo im mobilen Header ca. 20 % kleiner darstellen.
- Login-Link und Hamburger-Icon oben rechts platzieren (rechtsbündig in einer Reihe).
- Mobiler Header ist nicht mehr sticky/fixed — er scrollt mit der Seite.
- Vollbild-Menü-Overlay entsprechend anpassen, damit es weiterhin korrekt öffnet (ohne fixierten Header darüber positioniert).

## Technisch

- Datei: `src/pages/Comdirect.tsx`
- Mobile Header-Container: `fixed`/`sticky`-Klassen entfernen, Höhe reduzieren.
- Logo-Breite/-Höhe um ~20 % reduzieren.
- Flex-Layout: Logo links, Login + Hamburger als Gruppe rechts.
- Menü-Overlay: Positionierung von „unter fixiertem Header“ auf `fixed inset-0` zurück oder passend anpassen.
