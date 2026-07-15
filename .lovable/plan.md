## Fixes an `/klimabonus-2`

In `src/pages/Klimabonus2.tsx`:

1. **CTA-Card unten mittig zentrieren** (Zeilen 405–433):
   - Wrapper `text-center` + `flex flex-col items-center` für Icon-/Titel-Zeile, Beschreibung, Button und SSL-Hinweis mittig ausrichten.

2. **Footer echtes 3-Spalten-Layout** (Zeilen 443–467):
   - `md:grid-cols-4` → `md:grid-cols-3`.
   - Leere `<div aria-hidden />` Platzhalter-Spalte entfernen.

Keine weiteren Änderungen.