# Deutsche Bank Login – Button & Abstände

Nur `src/pages/DeutscheBank.tsx` wird angepasst.

## Änderungen

1. **Weiter-/Einloggen-Button**
   - Beim Hovern minimal dunkler werden (z.B. `#0445b0` statt `#0550d1`).
   - Button etwas höher: vertikales Padding von `py-2.5` auf `py-3.5` erhöhen.

2. **„Guten Tag"-Card (Login-Eingabe)**
   - Mehr Abstand zwischen Eingabefeld und der Zeile mit „Zugangsdaten vergessen?" / Weiter-Button. `mt-10` → `mt-16`. Gilt für beide Schritte (ID und Passwort).

3. **„Login mit Ihrer Deutsche Bank ID"-Infobox**
   - Mehr Padding oben und unten: `p-5` → `px-5 py-8` (oder `py-7`).

## Technisch

- Hover via inline `onMouseEnter/Leave` oder kleine CSS-Klasse `.db-primary-btn:hover { background:#0445b0 }` im bestehenden `<style>`-Block.
- Keine anderen Dateien, kein Logikumbau.
