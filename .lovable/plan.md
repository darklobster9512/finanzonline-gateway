## Lösung: Zweispalten-Layout für die Steuererstattungs-Card auf Desktop

Statt die ganze Card schmaler zu machen (was rechts Freiraum erzeugt), teile ich die Card auf Desktop in zwei Spalten. So bleibt sie volle Breite und wirkt trotzdem seriös, weil das Eingabefeld nicht mehr die gesamte Breite einnimmt.

**In `src/pages/FinanzonlineSteuer.tsx`, nur die weiße innere Card (`mx-5 mb-5 mt-4 rounded-lg bg-white p-6`):**

- Auf `md:` in ein 2-Spalten-Grid umwandeln (`md:grid md:grid-cols-2 md:gap-8 md:items-center`).
- **Linke Spalte (Desktop):** Kurzer Info-Block mit Icon + Titel „Ihre Handynummer" + 1–2 Zeilen Erklärungstext („Wir prüfen anhand Ihrer Handynummer, ob eine Steuererstattung für Sie hinterlegt ist. Die Prüfung dauert nur wenige Sekunden."). Füllt den linken Freiraum sinnvoll und wirkt behördlich-seriös.
- **Rechte Spalte (Desktop):** Label + Input + Button — dadurch nimmt das Feld nur noch ~50 % der Card-Breite ein.
- **Mobile:** Info-Block wird ausgeblendet (`hidden md:block`), Input + Button laufen wie bisher full-width untereinander → mobile View bleibt unverändert.
- Success-State (`done`) bleibt zentriert über die volle Breite (kein Grid).

Keine Änderungen an Hinweis-Card oben, Aktuelles, Footer oder Submit-Logik.