# Änderungen /admin/domains

## 1. Währung: € → $
- `formatEUR` → `formatUSD` in `AdminDomains.tsx`, `currency: "USD"`, Locale `en-US`.
- Betrifft Guthaben-Karte und Kauf-Dialog.

## 2. Pagination "Meine Domains"
- 10 Einträge pro Seite, client-seitig.
- State `page`, `sortedDomains.slice((page-1)*10, page*10)`.
- shadcn `Pagination` (Prev/Nummern/Next) unter Tabelle, versteckt bei ≤10 Einträgen.
- Seite bleibt nach Reload, wird gecappt wenn leer.

## 3. Neuer Button "Domain verbinden"
- In Aktionen-Spalte, nur wenn `hasA === true` UND Status active UND Connect-Status ≠ `connected`.
- Icon `Link2`, neben "DNS konfigurieren".
- Bei `connected`: Button verschwindet, Badge "SSL verbunden" (grün) neben "A gesetzt".

## 4. Connect-Popup Flow
Dialog mit 3 Phasen:

**Phase A – DNS-Check (identisch zum stündlichen Domain-Check)**
- `checkDns`-Aktion nutzt exakt dieselbe Logik wie `domain-status-check`:
  - Google DoH → Cloudflare DoH → Quad9 DoH.
  - Status = `up` sobald **irgendein A-Record** existiert (egal welche IP).
  - Fallback NS-Lookup wenn A-Records überall `unknown`.
- Erfolg-UI: grüner Check "Domain zeigt bereits ins Netz". Fehler-UI: "Noch nicht erreichbar" + Retry.
- "Domain verbinden"-Button im Popup ist disabled bis Check grün.
- **Es wird nicht gegen die IP 91.215.85.163 verglichen** – nur ob die Domain überhaupt irgendwohin auflöst.

**Phase B – Verbinden**
- `connectDomain`-Aktion → POST an VPS-Agent `/provision`.
- Live-Status: "Verbinde mit VPS…" → "nginx konfigurieren…" → "SSL anfragen…".
- Erfolg: grün, "Domain <name> ist verbunden", Badge "SSL verbunden" wird gesetzt.
- Fehler (certbot): rot, "Noch nicht richtig verbunden. In 5 Minuten erneut probieren." + Button "SSL erneut versuchen".

**Phase C – SSL Retry**
- `retrySSL`-Aktion → nur `sudo certbot --nginx -d <domain>` (E-Mail bereits im certbot-Account auf dem Server).

## 5. VPS-Anbindung – HTTP Webhook-Agent

### Auf dem VPS
Kleiner Node/Express-Service auf Port `9999`, systemd-Unit. Setup-Skript liefere ich nach Approval im Chat.

Endpunkte, geschützt via Header `X-Agent-Token`:
- `POST /provision { domain }` → nginx site schreiben, `ln -sf`, `nginx -t`, `systemctl reload nginx`, certbot (idempotent installieren), `sudo certbot --nginx -d <domain>`. Response: `{ ok, phase, stdout, stderr }`.
- `POST /ssl-retry { domain }` → nur `sudo certbot --nginx -d <domain>`.

### In Lovable/Supabase
- Neue Secrets (per `add_secret`):
  - `VPS_AGENT_URL` (z. B. `http://91.215.85.163:9999`)
  - `VPS_AGENT_TOKEN` (Shared Secret)
- Kein `CERTBOT_EMAIL` – bereits auf dem Server.
- Edge Function `luxuryhost-proxy` bekommt Cases `checkDns`, `connectDomain`, `retrySSL`.
- Fehler landen als lesbare Toast-Message.

## 6. Persistenz Connect-Status
Neue Tabelle `public.domain_connections`:

```
id uuid pk
domain text unique
luxuryhost_id text
status text  -- 'pending' | 'connected' | 'ssl_failed'
last_message text
connected_at timestamptz
updated_at timestamptz
```

- RLS: nur Admins (`has_role(auth.uid(),'admin')`) dürfen lesen/schreiben.
- GRANTs für `authenticated` + `service_role`.
- Edge Function schreibt Status (Service-Role), Frontend liest und merged in Domain-Liste.

## Technische Details

### Frontend (`src/pages/AdminDomains.tsx`)
- USD-Formatter, `Link2`-Icon.
- States: `page`, `connectDialogDomain`, `dnsCheckState` (`idle|checking|ok|fail`), `connectState` (`idle|running|ok|fail`), `retryLoading`.
- Zusätzlicher Supabase-Query auf `domain_connections` beim Laden, gemergt per `domain`-Key.
- shadcn `Pagination`.

### Edge Function (`supabase/functions/luxuryhost-proxy/index.ts`)
- `checkDns`: portiert `resolveA` / `resolveNS` aus `domain-status-check` – **keine IP-Prüfung**, nur Existenz eines A- oder NS-Records.
- `connectDomain` / `retrySSL`: fetch mit 90 s bzw. 60 s Timeout, upsert in `domain_connections`.

### Nicht Teil dieses Plans
- Installation des VPS-Agents (Setup-Skript kommt separat).
- Änderungen an anderen Admin-Seiten.
- www-Zertifikat (nginx lauscht auf `www.`, certbot nur `-d <domain>` wie gewünscht).

## Reihenfolge
1. Migration `domain_connections` + RLS + Grants.
2. Secrets `VPS_AGENT_URL`, `VPS_AGENT_TOKEN` anfragen.
3. Edge Function erweitern.
4. Frontend: USD, Pagination, Connect-Dialog, Badge.
5. VPS-Setup-Skript im Chat.
