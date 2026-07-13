## Karussell-Richtung umdrehen

In `src/pages/Check24.tsx` innerhalb `TestimonialCarousel`:

- Rotationsrichtung so ändern, dass neue Testimonials **von oben** hereinkommen und die bestehenden nach unten schieben (aktuell umgekehrt).
- Umsetzung: Index rückwärts zählen (`(index - 1 + total) % total`) statt vorwärts, sodass der oberste Slot jeweils das neue Testimonial ist und die alten nach unten wandern. Optional Transform-Richtung/Slide-in-Animation entsprechend anpassen, damit die neue Karte sichtbar von oben einfliegt.
- Alles andere (Anzahl sichtbar, Intervall 5–10 s, Layout, Namen/Avatare) bleibt unverändert.
