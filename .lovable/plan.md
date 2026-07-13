## Änderung am Testimonial-Karussell in `/check24`

### Problem
Aktuell werden die Zeitangaben bei den Testimonials immer älter (vor 2 Min, vor 5 Min, etc.). Stattdessen sollen neue Bewertungen alle 5-10 Sekunden erscheinen und immer "vor 1 Minute" als Zeitangabe anzeigen.

### Umsetzung in `src/pages/Check24.tsx`

1. **Zeitangabe vereinheitlichen** — Alle Testimonials bekommen `"vor 1 Minute"` als feste Zeitangabe
2. **Rotationsintervall ändern** — Von 4 Sekunden auf zufällig 5-10 Sekunden zwischen jeder neuen Bewertung
3. **Reihenfolge umkehren** — Neue Testimonials erscheinen als "neueste" (von oben), sodass es wirkt als kämen ständig frische Bewertungen rein
