# Sidebar-Header auf Landing-Header-Höhe bringen

## Ziel
Die Kopfzeile der mobilen Sidebar (geöffnetes Menü) soll exakt dieselbe Höhe haben wie der Header der Seite darunter.

## Ausgangslage
- Landing-Header: 72 px hoch (`src/pages/Hypovereinsbank.tsx`, Zeile 264).
- Sidebar-Kopfzeile: 56 px hoch (Zeile 369) — also 16 px zu niedrig.

## Umsetzung
1. Höhe der Sidebar-Kopfzeile in `src/pages/Hypovereinsbank.tsx` (Zeile 369) von 56 px auf 72 px setzen — identisch zum Landing-Header.
2. Die feine Trennlinie unterhalb der Kopfzeile bleibt erhalten; das Seitenscrollen beim Öffnen bleibt gesperrt.
3. Anordnung und Größen der Inhalte in der Kopfzeile (Schließen-Kreuz, Suche/Hilfe/Filiale, rote Banking-Login-Kachel) bleiben unverändert — nur die Zeilenhöhe wächst, die Elemente bleiben vertikal zentriert.

## Prüfung
- Build-Log prüfen.
- Browserprüfung am Handy-Viewport:both Headers nachmessen — Kopfzeile der Sidebar und Landing-Header müssen identische Höhe haben; Menü öffnet/schließt weiterhin sauber.

## Technische Details
- Datei: `src/pages/Hypovereinsbank.tsx`, Zeile 369.
- Änderung: `h-14` (56 px) → `h-[72px]` am Wrapper-Div der Sidebar-Kopfzeile.
- Beide Zeilen nutzen `box-sizing: border-box`, daher enthält die 72 px die 1 px Trennlinie — die Gesamthöhe stimmt damit exakt mit dem Landing-Header überein.
- Kein Eingriff in Desktop-Ansicht (Sidebar ist auf großen Bildschirmen ausgeblendet) und keine Änderung an Breiten (`w-14`, `w-[55px]`) oder Icon-Größen.
