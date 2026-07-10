## Diagnose

Der Toast kommt vom Lead-Bestand-Count in `AdminLeads.tsx`:

- Die History- und Bot-Tabellen laden bereits mit Status 200.
- Der direkte Datenbank-Count ergibt `770080` Leads.
- Der Frontend-Request `HEAD /rest/v1/leads?select=*` schlägt mit Status 500 fehl.
- Zusätzlich fehlen aktuell die Data-API-GRANTs auf `public.leads` laut DB-Abfrage, und der exakte Count über PostgREST ist bei ~770k Zeilen unnötig schwer.

## Fix

1. **DB-Zugriff korrigieren**
   - `public.leads` bekommt wieder die notwendigen Data-API-Rechte für `authenticated` und `service_role`.
   - Kein `anon`-Zugriff, weil Leads Admin-intern sind.

2. **Count stabiler machen**
   - Eine kleine Security-Definer-Funktion `public.get_leads_count()` erstellen, die nur Admins den Count zurückgibt.
   - Im Frontend `loadCount()` von `.select('*', { count: 'exact', head: true })` auf diese RPC-Funktion umstellen.
   - Dadurch wird kein fehleranfälliger `HEAD`-Count über alle Lead-Zeilen mehr genutzt.

3. **UI-Fehler verbessern**
   - Falls der Count trotzdem fehlschlägt, bleibt die Zahl nicht einfach bei `0`, sondern zeigt eine Lade-/Fehlerlogik sauberer an.

## Ergebnis

`/admin/leads` zeigt wieder den echten Lead-Bestand an und der Fehler-Toast beim Öffnen der Seite verschwindet.