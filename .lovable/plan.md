## Ursache

Die Tabelle `public.leads` (und die anderen leads-bezogenen Tabellen) haben **keine** Data-API-GRANTs — geprüft via `information_schema.role_table_grants`: leer.

Auch wenn RLS-Policies existieren (`has_role(auth.uid(), 'admin')`), verweigert PostgREST den Zugriff mit „permission denied for table leads", weil die Rolle `authenticated` keine Tabellen-Privilegien hat. Deshalb der „Fehler"-Toast trotz Admin-Login.

Warum es „vorher ging": Neue Supabase-Projekte haben explicit-by-default Permissions — beim Anlegen der Tabellen wurden die GRANTs vergessen. Der Count-Fetch fiel evtl. bisher auf `0` zurück ohne sichtbaren Fehler, jetzt schlägt der History-Fetch komplett fehl.

## Fix (eine Migration)

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_extraction_history TO authenticated;
GRANT ALL ON public.leads_extraction_history TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_sessions TO authenticated;
GRANT ALL ON public.leads_bot_sessions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_authorized_chats TO authenticated;
GRANT ALL ON public.leads_bot_authorized_chats TO service_role;
```

Kein `anon`-Grant (alle Policies sind admin-only). Keine Code-Änderung nötig — die Edge Functions nutzen bereits `service_role`, die App-Fetches nutzen `authenticated`.

## Nicht enthalten
- Keine RLS-Änderungen — die bestehenden Admin-Policies bleiben.
- Keine UI-Änderungen an `AdminLeads.tsx`.
