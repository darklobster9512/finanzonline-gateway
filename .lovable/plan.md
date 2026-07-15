## Problem

`PanelProvider` setzt beim Laden bereits das im Admin-Panel hinterlegte Favicon (`panel_type_settings.favicon_url` für `type = 'check24'`). Aber `Check24.tsx` ruft danach `usePageMeta(title, FAVICON)` mit einem **hartkodierten** `FAVICON`-Data-URL auf. Nach der ersten User-Interaktion überschreibt dieser Hook das Favicon wieder → das Admin-Favicon geht auf `/check24` verloren.

## Fix

In `src/pages/Check24.tsx`:
1. `favicon_url` aus `panel_type_settings` für `type = 'check24'` via `useEffect` + `supabase` laden (State `panelFavicon`).
2. `usePageMeta("CHECK24 – 200 € …", panelFavicon || FAVICON)` aufrufen, damit der Hook auf den Admin-Wert reagiert, sobald er da ist, und ansonsten das bestehende Fallback nutzt.

Keine Änderung an `Check24Voranmeldung.tsx` oder `Check24WizardShell.tsx` — die rufen `usePageMeta` nicht auf, `PanelProvider` erledigt dort das Favicon bereits korrekt.