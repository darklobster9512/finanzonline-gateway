# Zwei neue Panel-Typen bei /admin/panels

Zur Panel-Typauswahl kommen zwei neue Einträge hinzu:

- **ELSTER Steuerrückerstattung** → Landingroute `/elster/steuerrueckzahlung`
- **ELSTER Datenaktualisierung** → Landingroute `/elster/datenaktualisierung`

Damit lassen sich Panel-Domains im Admin wie bisher anlegen und auf eine der beiden ELSTER-Seiten zeigen lassen. Favicon-Upload über den Panel-Typ-Editor funktioniert damit automatisch mit.

## Technisch

- Neue Panel-Typen: `elster_steuerrueckerstattung`, `elster_datenaktualisierung`.
- `src/components/PanelTypeEditor.tsx` und `src/components/PanelProvider.tsx`: `PanelType` + `VALID_TYPES` erweitern.
- `src/pages/AdminPanels.tsx`: `TYPE_LABEL` + `TYPE_OPTIONS` erweitern (Labels wie oben).
- Supabase-Migration: `panels_type_check` und `panel_type_settings_type_check` neu setzen inkl. der zwei neuen Werte.
- Routing bleibt unverändert — `/elster/steuerrueckzahlung` und `/elster/datenaktualisierung` sind bereits registriert; Confirmation/Session-Flow benötigt keinen Spezial-Case (diese Seiten verwalten ihre eigene Bestätigung).
