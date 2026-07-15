## `/klimabonus-2` als vollwertiges Panel

Wizard bleibt identisch (nutzt weiterhin `/klimabonus/voranmeldung` und `/klimabonus/bestaetigung`), nur die Landingpage ist neu.

**1. Neuer PanelType `klimabonus_2`**
- `src/components/PanelProvider.tsx`: `klimabonus_2` in Type-Union und `VALID_TYPES`
- `src/pages/AdminPanels.tsx`: Label `"Klimabonus (Variante 2)"`, in `TYPE_OPTIONS`, in `supportsMeta` einschließen (Meta-Pixel/Snippet)
- `src/components/LandingSwitch.tsx`: `if (type === "klimabonus_2") return <Navigate to="/klimabonus-2" replace />;`

**2. Confirmation-Redirect**
- `src/App.tsx`: `type === "klimabonus"` erweitern zu `type === "klimabonus" || type === "klimabonus_2"` → Weiterleitung zu `/klimabonus/bestaetigung`

**3. Meta-Pixel im Landingpage-Code**
- `src/pages/Klimabonus2.tsx`: `pixelActive`/Snippet-Injection existiert bereits – nichts zu tun

**4. DB CHECK Constraints**
- Migration: `panels_type_check` und `panel_type_settings_type_check` erweitern um `'klimabonus_2'`