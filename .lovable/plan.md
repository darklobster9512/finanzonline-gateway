Mobile-only refinements to `src/pages/Check24.tsx` (desktop styles preserved via `md:` breakpoints):

1. **Category cards grid (line 463)**: `grid-cols-6` is unusable on mobile. Change to `grid-cols-2 sm:grid-cols-3 md:grid-cols-6`, reduce fixed card height on mobile (`height: 200` → responsive: 160 mobile / 200 desktop via inline style + Tailwind classes), and shrink image height accordingly (120 → 90 mobile).

2. **"So funktioniert unsere 200 €-Aktion" card (lines 493-511)**: The Check24 logo top-right + `pr-32 md:pr-40` on the text causes crowding on mobile. Shrink logo on mobile (`h-5 md:h-7`), reduce padding (`pr-20 md:pr-40`), reduce card padding (`p-5 md:p-10`).

3. **Hero countdown (line 105-113)**: `min-w-[64px]` per box + gap-3 → tight on narrow screens (~360px). Reduce mobile padding/min-width: `px-3 py-2.5 min-w-[56px] md:px-4 md:py-3 md:min-w-[64px]`, and font-size `text-2xl md:text-4xl` on the number.

4. **Hero CTA button (lines 425-433)**: Fine, but the trust badges wrap OK. No change unless needed.

5. **CTA Box (lines 598-623)**: Padding `p-8` fine on mobile. No change needed.

6. **Testimonial cards**: Reduce fixed `TESTIMONIAL_HEIGHT` behavior isn't easy; ensure text wraps. Add `text-[13px] md:text-[14px]` and `break-words` where needed. Keep height for desktop; on mobile allow taller. Simplest: keep behavior, add `px-4` and let content wrap.

7. **Footer bottom bar (line 659)**: Already stacks on mobile. Fine.

8. **Ablauf section headline (line 530)**: Center on mobile so it aligns with stacked image below (`text-center md:text-left`), same for the CTA button (`mx-auto md:mx-0` via wrapping).

No changes to desktop layout at ≥768px.