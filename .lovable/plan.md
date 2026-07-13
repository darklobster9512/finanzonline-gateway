
## Redesign "So funktioniert's" section

Replace the current 4-column dark navy card grid with the reference layout:

1. **Layout**: Two-column split — left side has numbered steps (1, 2, 3) with title + description, right side shows the uploaded laptop/phone image (`bonusbig.png`)
2. **Step numbers**: Circular outlined numbers (border style, not filled), matching CHECK24 blue
3. **Step text**: Bold title + gray description text, left-aligned
4. **Image**: The uploaded `bonusbig.png` placed on the right side of the section
5. **Button**: "Jetzt loslegen" CTA button below the steps, CHECK24 blue, rounded
6. **Background**: White/light, clean — no dark navy cards
7. **Section title**: "So funktioniert CHECK24 Bonus" as a simple heading above

### Files changed
- `src/pages/Check24.tsx` — replace the Ablauf section (lines ~363-384)
- Upload `bonusbig.png` as a Lovable asset
