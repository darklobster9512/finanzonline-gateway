## Change

Add a prominent red CTA button labeled **"Jetzt beantragen"** in the Hero section of `KlimaWhite.tsx`. The button will:
1. Fire `fbq('track', 'Lead')` (same as existing `handleCta`)
2. Navigate to `/klima-white/impressum` (which already sends the Telegram notification on mount)

The existing subtle "Überblick lesen" button will be replaced with the red CTA.

## File: `src/pages/KlimaWhite.tsx`

- Replace the current white-bordered "Überblick lesen" button (lines 131-137) with a red, filled button saying "Jetzt beantragen" using the existing `PRIMARY` color (`#a52a2a`) as background and white text.
