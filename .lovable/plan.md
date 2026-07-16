## Ziel

FireHOL/Tor IPs lokal in Supabase speichern, damit `antibot-check` keine externen Downloads mehr braucht. AntiBot wieder aktivieren.

## Umsetzung

### 1. Neue Tabelle `ip_blocklist` (Migration)
```sql
CREATE TABLE public.ip_blocklist (
  id bigint generated always as identity primary key,
  base_int bigint not null,      -- IPv4 als int für schnelle Matches
  mask_int bigint not null,      -- Netmask als int
  cidr text not null,            -- z.B. "1.2.3.0/24" (für Tor: /32)
  source text not null,          -- firehol_level1 | firehol_webclient | datacenter | tor
  created_at timestamptz default now()
);
```
Mit Unique-Index auf `(cidr, source)`, RLS an, nur Admin darf lesen. Service-Rolle schreibt aus der Edge Function.

### 2. Neue Edge Function `sync-ip-blocklist`
- Lädt die 4 externen Listen (FireHOL L1, FireHOL Webclient, Datacenter-Ranges, Tor)
- Parst jede Zeile zu `{cidr, base_int, mask_int}`
- Löscht alte Einträge pro Source, fügt neue in 1000er-Batches ein
- Gibt Counts + Errors pro Source zurück
- Aufrufbar manuell (später Button in `/admin/blocks`) oder per Cron

### 3. `antibot-check` umbauen
- `loadLists()` liest jetzt aus `ip_blocklist` (paginiert 1000er-Seiten) statt fetch von GitHub
- Cache-TTL bleibt bei 6h (Warm-Start noch schneller)
- **Alle anderen Checks bleiben aktiv**: `missing_accept_language`, `HEADLESS_MARKERS`, `SCANNER_UA_MARKERS`, `REFERER_BLACKLIST`, Tor, CIDR
- Externe UA-Liste (`crawler-user-agents.json`) wird entfernt — die statischen `SCANNER_UA_MARKERS` reichen (haben laut Statistik alle `ua_pattern`-Blocks abgedeckt)

### 4. AntiBot wieder aktivieren
- `src/hooks/use-antibot.ts`: Original-Implementierung wiederherstellen (mit 4s Timeout, fail-open)
- `src/components/AntiBotGuard.tsx`: Guard-Logik reaktivieren (Kinder werden sofort gerendert, Prüfung läuft parallel — nur bei `blocked` wird die `BlockedPage` gezeigt)

### 5. Initiales Befüllen
Nach Deploy einmal `sync-ip-blocklist` per Supabase Dashboard aufrufen, um die ~9.000 IPs in die DB zu laden. (Optional später: Sync-Button in `/admin/blocks` + täglicher Cron.)

## Technische Details

- ~9.000 Einträge total (FireHOL L1 ~4.582 + Webclient + Datacenter + Tor)
- DB-Load beim Cold Start: ~9 paginierte Selects, deutlich schneller als 4 externe HTTP-Downloads
- Kein Schema-Change an bestehenden Tabellen, nur additiv
