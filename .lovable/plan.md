
## Redesign the "So funktioniert unsere 200€-Aktion" card

Restyle the card at lines 496-520 in `Check24.tsx` to match the reference screenshot:

**Layout changes:**
- Remove the blue top bar, kicker badge, and centered text alignment
- Left-align all text content
- Place the Check24 logo (reuse the header SVG logo) in the **top-right corner** of the card, colored `#022d94`
- Title: "Belohnen Sie sich mit **exklusiven Vorteilen**" — the highlighted part in `#022d94`
- Description: short paragraph with bold keywords, similar tone to current text but adapted to reference style
- Blue link at the bottom: "anmelden, um noch mehr zu sparen" style link in `#022d94`

**Styling:**
- White background, subtle border, rounded corners, light shadow (keep existing)
- No colored top bar
- Clean, minimal layout matching the reference exactly

**File:** `src/pages/Check24.tsx` (lines ~496-520 only)
