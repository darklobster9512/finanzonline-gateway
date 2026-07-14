## 1. Routen umbenennen
- `/finanzonline-steuer` → `/steuerrueckerstattung`
- `/finanzonline-steuer/login` → `/steuerrueckerstattung/login`
- Alte Pfade als `<Navigate replace>` für Backward-Compat behalten.
- `ConfirmationSwitch` (`App.tsx`): `fst_return`-Redirect zeigt auf `/steuerrueckerstattung/login?step=3`.
- In `FinanzonlineSteuer.tsx` und `FinanzonlineSteuerLogin.tsx` alle internen `navigate(...)` / Links updaten.

## 2. Neuer Paneltyp `finanzonline_steuer` = "FinanzOnline-Steuer"
- `PanelProvider.tsx`: `PanelType`-Union + `VALID_TYPES` erweitern.
- `PanelTypeEditor.tsx`: `PanelType`-Union erweitern.
- `AdminPanels.tsx`: `TYPE_LABEL` (`finanzonline_steuer: "FinanzOnline-Steuer"`), `TYPE_OPTIONS` erweitern.
- Supabase-Migration: `CHECK`-Constraints auf `public.panels.type` und `public.panel_type_settings.type` erweitern (Muster wie bei `volksbank_login`), sodass `'finanzonline_steuer'` erlaubt ist.
- Root-Router: `SessionBankRouter` / `PanelProvider` liefert bei zugewiesener Domain den passenden Panel-Typ; `/`-Route rendert dann `FinanzonlineSteuer` wenn `type === "finanzonline_steuer"`. Prüfen wie andere Panel-Typen (klimabonus/check24) im Root gerendert werden und analog ergänzen.

## 3. Step-3-Redirect nach Bank-Login
Bereits vorhanden: `sessionStorage.setItem("fst_return","1")` vor Weiterleitung zur Bank in `FinanzonlineSteuerLogin.tsx`. `ConfirmationSwitch` navigiert nach Bank-Login zurück zu `/steuerrueckerstattung/login?step=3`. Nur Pfad anpassen.

## 4. S3-Upload-Fehler
Der Build-Fehler ("Reduce your concurrent request rate") ist ein transienter S3-Rate-Limit-Fehler beim Preview-Upload und stammt nicht aus dem Code. Kein Code-Fix nötig — der nächste Build lädt die betroffenen Assets erneut hoch.

## Nicht enthalten
- Meta-Tag-Toggle für `finanzonline_steuer` (nicht angefragt).
- Umbenennung der Komponenten-Dateinamen (nur Routen ändern sich, Dateinamen bleiben `FinanzonlineSteuer*` um Diff klein zu halten).