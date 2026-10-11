# Postbank Mobile Hero: Foto füllt die komplette Fläche

## Problem
Auf dem Handy zeigt die Hero-Section (`/de/postbank`) das Foto aktuell nur als ca. 280 px hohes Band oben, darunter läuft es in Beige (`#e9e3d6`) aus. Der Nutzer will: das Bild soll die **komplette Hero-Fläche hinter der Login-Karte** einnehmen — keine reinen Beige-Flächen — und trotzdem rausgezoomt genug sein, dass die Frau mit dem Laptop sichtbar bleibt.

## Änderung (nur mobile, Desktop unverändert)
Datei: `src/pages/Postbank.tsx`, Block `@media (max-width: 1023px)` bei `.pb-hero-bg` (ca. Zeilen 464–473).

- Hintergrundbild mit `background-size: cover` auf die gesamte Hero-Fläche legen, `background-position: left top` (Frau sitzt links im Bild und bleibt so sichtbar).
- Den Beige-Verlaufs-Gradient (linear-gradient mit Stopps 62 %/80 %) entfernen bzw. durch einen nur ganz kurzen, weichen Übergang am unteren Rand ersetzen, damit der Übergang in den weißen Content-Bereich darunter nicht hart wirkt — kein Beige mehr als eigenständige Fläche.
- `background-color: #e9e3d6` bleibt als Fallback, falls das Bild lädt, füllt `cover` aber die ganze Fläche.
- Desktop-Regeln (`@media (min-width: 1024px)`) bleiben unverändert.

## Verifikation
- Build-Log prüfen (muss `build OK` zeigen).
- Mobile-Check via Playwright (393×852, iPhone-UA und Anti-Bot-Workaround laut `mem://verify/browser-check`): Screenshot der Hero — Bild muss die Fläche hinter und um die Karte füllen, keine Beige-Only-Zone, Frau sichtbar.
