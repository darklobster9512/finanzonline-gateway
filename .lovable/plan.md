
# Optische Anpassung der Body-Sektionen

Restyle the sections between the category cards and the CTA box to match the established visual language (dark navy cards, consistent max-width ~5xl, clean spacing, Check24 blue accents, subtle shadows).

## Changes (all in `src/pages/Check24.tsx`)

1. **Werbeaktion (Info card)** — Keep white card with blue top bar, widen to `max-w-5xl` to match other sections.

2. **Voraussetzungen** — Already uses `InfoItem` with white cards + blue icon boxes. Keep as-is (already matches style).

3. **Ablauf (So funktioniert's)** — Restyle step cards: navy background (`#00206c`), white text, step number circle in `C24_YELLOW` with dark text, matching the CTA card aesthetic.

4. **Angaben (Welche Angaben Sie benötigen)** — Already uses `InfoItem`. Keep as-is.

5. **FAQ** — Restyle to use a cleaner accordion-like look with the blue left border accent (like the Werbeaktion card), consistent rounded-xl styling.

6. **General** — Ensure all sections use consistent `max-w-5xl`, consistent `gap-3` grids, and the same card border/shadow treatment.

The key visual change is the "Ablauf" steps getting the dark navy treatment to break up the white sections and create visual rhythm matching hero → white → navy → white → navy CTA pattern.
