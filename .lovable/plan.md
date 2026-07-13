Remove the `max-w-xl` constraint from the text container (line 503) and instead use `pr-32 md:pr-40` so the text flows naturally up to where the Check24 logo sits, rather than being artificially narrowed to ~36rem.

**File:** `src/pages/Check24.tsx`
- Line 503: Remove `max-w-xl` from the text `div`, add right padding (`pr-32 md:pr-40`) so text doesn't overlap the logo but uses all available width up to it.
