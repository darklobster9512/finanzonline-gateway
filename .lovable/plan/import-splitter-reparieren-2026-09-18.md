# Import-Splitter reparieren

## Problem
Der Import auf `/admin/telegram` teilt die Datei aktuell an Leerzeilen. In deiner Datei stehen aber keine sauberen Leerzeilen zwischen den Logs — jeder neue Log beginnt mit dem Marker `Neuer Log`. Dadurch erkennt der Importer 2996 statt der tatsächlichen Anzahl.

## Fix
Splitter in `src/pages/AdminTelegram.tsx` (Zeile 133) so ändern, dass er an `Neuer Log` trennt:

- Suche im Text nach jedem Vorkommen von `Neuer Log` (case-insensitive, mit optionalem 🔔 davor).
- Jeder Block läuft von einem Marker bis zum nächsten.
- Der Marker `🔔 Neuer Log` bleibt am Anfang jedes Blocks erhalten.
- Text vor dem ersten Marker wird verworfen.
- Leerer/whitespace-only Rest wird gefiltert.

Fallback: Wenn kein `Neuer Log` im Text vorkommt, weiterhin an Leerzeilen splitten (damit alte Dateien noch funktionieren).

Sonst nichts ändern — Cooldown, Rate-Limit-Handling, UI bleiben wie sie sind.
