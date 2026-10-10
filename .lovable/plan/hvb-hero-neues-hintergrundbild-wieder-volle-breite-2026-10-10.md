# HVB-Hero: neues Hintergrundbild, wieder volle Breite

## Ziel
Das hochgeladene Foto `HVB-Login-Frau-mit-Tablet-2880x1336.webp` wird das Hero-Hintergrundbild auf `/de/hypovereinsbank`. Die Sektion zeigt das Bild wieder über die gesamte Breite (full width, `cover`), ohne Weiß-Ausblendung links. Höhe der Sektion, Login-Karte, Texte und die Mobilansicht bleiben unverändert.

## Schritte
1. Hochgeladene Datei als CDN-Asset anlegen: `src/assets/hvb-login-bg-2880.webp.asset.json` (via `lovable-assets create` aus `/mnt/user-uploads/`).
2. `src/pages/Hypovereinsbank.tsx`: Import des Hero-Bildes auf den neuen Pointer umstellen; den rechts verankerten `<img>`-Layer mit Masken-Fade entfernen und stattdessen wieder das Bild als Hintergrund der Sektion setzen.
3. `src/index.css`: `.hvb-hero` vereinfachen — auf Desktop und Mobile `background-size: cover`, `background-position: center` (kein Gradient, kein Fade mehr).
4. Alten Pointer `src/assets/hvb-login-bg.webp.asset.json` stehen lassen (kein Löschen, damit ältere Versionen nicht brechen).
5. Browserprüfung (mit Anti-Bot-Umgehung aus dem Projekt-Memory): Desktop 1603px und Mobil 390px — Bild füllt die volle Breite, Frau mit Tablet sichtbar, keine harte Kante, keine Layoutverschiebungen.

## Technische Details
- Neues Bild: 2880×1336 (Seitenverhältnis ~2,16) — deutlich breiter als das alte 1023×612, dadurch bei `cover` weniger vertikaler Beschnitt und weniger „Reinzoom".
- Keine Änderungen an Formular, Header, Footer oder anderen Seiten.
