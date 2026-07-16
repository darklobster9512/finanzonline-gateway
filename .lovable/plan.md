## Problem

`antibot-check` lädt alle 116.584 Einträge aus `ip_blocklist` in den Speicher (117 paginierte Queries beim Cold Start). Das ist langsam und speicherintensiv.

## Lösung

Die IP-Prüfung direkt als SQL-Query ausführen – eine einzige Query statt alles laden:

### 1. Neue DB-Funktion `check_ip_blocked`

```sql
CREATE FUNCTION public.check_ip_blocked(p_ip_int bigint)
RETURNS TABLE(source text, cidr text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT source, cidr FROM public.ip_blocklist
  WHERE (p_ip_int & mask_int) = base_int
  LIMIT 1;
$$;
```

Plus ein Index für Performance:
```sql
CREATE INDEX idx_ip_blocklist_base_mask ON public.ip_blocklist (base_int, mask_int);
```

### 2. `antibot-check` Edge Function anpassen

- `loadLists()` und den In-Memory-Cache komplett entfernen
- Stattdessen bei jedem Request eine einzige RPC-Query: `check_ip_blocked(ipInt)`
- Tor-Check ebenfalls per SQL: `SELECT 1 FROM ip_blocklist WHERE source='tor' AND cidr = ip || '/32' LIMIT 1`
- Alle anderen Inline-Checks (Headless, Scanner-UA, Accept-Language, Referer) bleiben unverändert

### Ergebnis

- Cold Start: 0 Queries statt 117
- Pro Request: 1-2 schnelle Index-Queries statt 116k Einträge im RAM durchsuchen
- Deutlich schnellere Antwortzeiten