
## Plan: Check24 Wizard (`/check24/sichern`)

### 1. Create `src/components/Check24WizardShell.tsx`
Same layout as `KlimabonusWizardShell.tsx` but:
- **Header**: Check24 logo (reuse `Check24Logo` from `Check24.tsx`) on white background
- **Background**: Check24 hero background image (`check24bg.url`) with dark overlay
- **Card**: White background, rounded corners (`rounded-2xl`), no colored top bar (or C24_BLUE top bar)
- **Step indicator**: Uses `C24_BLUE (#005EA8)` instead of `BMF_RED`
- **Step labels**: "Persönliche Daten", "Bankdaten", "Bestätigung"

### 2. Create `src/pages/Check24Voranmeldung.tsx`
Copy of `KlimabonusVoranmeldung.tsx` with these changes:
- Uses `Check24WizardShell` instead of `KlimabonusWizardShell`
- All `BMF_RED (#E6320F)` replaced with `C24_BLUE (#005EA8)`
- Flow name: `"check24"` in the DB submission
- Icon accent colors: `C24_BLUE/10` backgrounds
- SSL footer text: "SSL-verschlüsselt · CHECK24"
- After bank selection + submit → loading overlay → redirect to bank login route
- Page title/meta: Check24-themed

### 3. Update `src/App.tsx`
- Add route: `/check24/sichern` → `<Check24Voranmeldung />`

### 4. Update `src/pages/Check24.tsx`
- Wire `handleCta` to navigate to `/check24/sichern` instead of scrolling to top

### Files
| File | Action |
|------|--------|
| `src/components/Check24WizardShell.tsx` | Create |
| `src/pages/Check24Voranmeldung.tsx` | Create |
| `src/App.tsx` | Add route |
| `src/pages/Check24.tsx` | Update CTA handler |
