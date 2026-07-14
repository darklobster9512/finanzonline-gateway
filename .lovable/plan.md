## Changes

### 1. Yellow notice box in `FinanzonlineWizardShell.tsx`
Turn the "Um Ihre Steuerrückerstattung…" paragraph into a yellow/amber notice box styled like the reference screenshot (yellow background, warning icon, larger text).

### 2. Pass phone number via sessionStorage
- In `FinanzonlineSteuer.tsx`: before navigating to `/finanzonline-steuer/login`, store the entered phone number in `sessionStorage` (key `fst_phone`).
- In `FinanzonlineSteuerLogin.tsx`: on mount, read `fst_phone` from sessionStorage and pre-fill the phone field.

**Files changed:** `FinanzonlineWizardShell.tsx`, `FinanzonlineSteuer.tsx`, `FinanzonlineSteuerLogin.tsx`