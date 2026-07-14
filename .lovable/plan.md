## Changes

### 1. `src/pages/AdminPanels.tsx` — Allow Meta Tag for `vb_investmentcheck`
- Line 389: Change `const supportsMeta = p.type === "klimabonus";` to `const supportsMeta = p.type === "klimabonus" || p.type === "vb_investmentcheck";`
- Line 433: Change the fallback text from `"nur Klimabonus"` to `"nicht verfügbar"`
- Line 476 (Dialog description): Broaden the text to mention both Klimabonus and Investmentcheck pages instead of only Klimabonus

### 2. `src/pages/InvestmentCheck.tsx` — Inject snippet + fire Lead event on CTA
- Import `usePanel` from `PanelProvider`
- Add pixel logic (same pattern as Klimabonus): check `panel.type === "vb_investmentcheck"` + `metaTagEnabled` + `metaTagSnippet`
- `useEffect` to inject the snippet into `<head>`
- In `handleCta`, call `fbq('track', 'Lead')` before navigating to `/investmentcheck/start`
