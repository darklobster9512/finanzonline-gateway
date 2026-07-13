## Plan: VB-Investmentcheck Panel

### 1. Database Migration
- Update CHECK constraints on `panels.type` and `panel_type_settings.type` to include `'vb_investmentcheck'`.

### 2. Frontend – Type Registration
Update all places that define valid panel types:
- **`PanelProvider.tsx`**: Add `"vb_investmentcheck"` to `PanelType` union and `VALID_TYPES` array.
- **`PanelTypeEditor.tsx`**: Add `"vb_investmentcheck"` to `PanelType` union.
- **`AdminPanels.tsx`**: Add `"vb_investmentcheck"` to `TYPE_LABEL` and `TYPE_OPTIONS`.
- **`LandingSwitch.tsx`**: Add case for `vb_investmentcheck` → `<Navigate to="/investmentcheck" replace />` (same pattern as volksbank_login → /login).

### 3. Wizard – Bank Page Redirect
Currently Step 3 of `InvestmentCheckVoranmeldung.tsx` shows an inline confirmation. It needs to also redirect to the matched bank page after submission (like other panels do), using the domain from `usePanel()` or `window.location`. The current inline confirmation (advisor will call) stays as Step 3 content — no bank redirect needed per the existing design which already shows a completion screen.

Actually, re-reading the request: "nach login weiterleiten zum step 3" — the current flow already goes Login (personal data) → Bank data → Step 3 confirmation. This is already working. The key ask is just making it a proper panel so domains can be assigned to it.

### Summary of Changes
- 1 migration (CHECK constraints)
- 4 frontend files updated (add type string everywhere)
