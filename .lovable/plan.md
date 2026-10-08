# Commerzbank-Login: Felder & Augen-Icon

Kleine visuelle Anpassungen am Login-Formular auf `/de/commerzbank`.

## Änderungen

1. **Eingabefelder (Benutzername & Passwort)**
   - Border-Dicke unten: 2px, sobald man mit der Maus darüberfährt oder reinklickt (hover + focus). Im Ruhezustand bleibt die Linie wie bisher.
   - Platzhalter-/Label-Text im Ruhezustand minimal größer (von 16 auf 17 px).

2. **Augen-Icon beim Passwortfeld**
   - Ruhezustand (Passwort versteckt): neues "offenes Auge"-SVG aus der Anweisung.
   - Aktiver Zustand (Passwort sichtbar): neues "durchgestrichenes Auge"-SVG aus der eingefügten HTML.

## Technisch

- Datei: `src/pages/Commerzbank.tsx`
- `EyeIcon`-Komponente: beide `path`-Blöcke durch die neuen SVG-Pfade ersetzen (viewBox 0 0 24 24, fill currentColor beibehalten).
- Für die 2px-Border beim Hover: zusätzlichen `onMouseEnter/Leave`-State pro Feld oder einfacher via Wrapper mit Tailwind `group` und `group-hover`/`focus-within` — Border am Container statt am Input, damit kein Layout-Shift entsteht (padding-bottom um 1px kompensieren).
- Label-Fontsize im Ruhezustand: 17 statt 16; aktiver (schwebender) Zustand bleibt 13.
