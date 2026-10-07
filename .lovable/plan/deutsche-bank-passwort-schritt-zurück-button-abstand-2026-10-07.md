# Deutsche Bank – Passwort-Schritt: Zurück-Button & Abstand

Zwei kleine Anpassungen auf `/de/deutsche-bank`, Schritt 2 (Passwort).

## Änderungen

1. **Zurück-Button an die Stelle von „Guten Tag"**
   - Aktuell steht der Zurück-Button oberhalb des (unsichtbaren) Titel-Platzhalters.
   - Neu: Der Zurück-Button rückt genau an die Position, an der auf Schritt 1 die Überschrift „Guten Tag" steht. Der leere Titel-Platzhalter entfällt bzw. wird durch den Zurück-Button ersetzt – Höhe bleibt identisch.

2. **„Bitte geben Sie Ihre Zugangsdaten ein." tiefer setzen**
   - Auf Schritt 2 bekommt der Hinweistext zusätzlichen oberen Abstand, sodass er sichtbar weiter unten steht als auf Schritt 1.

## Technisch

Nur `src/pages/DeutscheBank.tsx`:
- Zurück-Block (Zeilen 174–183) und leeren Titel-Platzhalter (Zeile 190) entfernen.
- Im `step === 2`-Zweig den Zurück-Button an derselben Stelle rendern wie die `h1 "Guten Tag"` auf Schritt 1, mit vergleichbarer Höhe (`text-[28px]`/`mb-2`).
- Dem `<p>Bitte geben Sie Ihre Zugangsdaten ein.</p>` auf Schritt 2 zusätzliches `mt-*` geben (Schritt 1 unverändert).
