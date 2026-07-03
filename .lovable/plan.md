## Ziel

In `/admin/statistiken` eine neue Spalte **„Besuche"** in der Tabelle „Einträge pro Domain" hinzufügen, die zeigt, wie viele Personen die Seite über die jeweilige Domain besucht haben (Page-Views, unabhängig davon ob ein Formular abgeschickt wurde).

## Änderungen

### 1. Neue Tabelle `page_visits` (Migration)

```sql
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_visits_domain_idx ON public.page_visits(domain);
CREATE INDEX page_visits_created_at_idx ON public.page_visits(created_at DESC);

GRANT SELECT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Admins dürfen lesen (nutzt vorhandene has_role Funktion)
CREATE POLICY "Admins can read page visits"
ON public.page_visits FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

Kein Insert-Policy nötig — Insert läuft ausschließlich über die Edge Function mit `service_role`.

### 2. Edge Function `antibot-check` erweitern

Wenn ein Request als **erlaubt** eingestuft wird (also ein echter Nutzer, kein Bot / Scanner), zusätzlich einen Row-Insert in `page_visits` mit `domain` + `path` aus dem Request-Body ausführen. Fehler beim Insert werden geschluckt (blockieren Nutzer nicht). Für Bots / geblockte Requests wird **nicht** eingefügt — dadurch entspricht der Zähler tatsächlichen menschlichen Besuchern.

### 3. `AdminStatistiken.tsx`

- Neuer `useQuery` `stats-page-visits`, holt paginiert alle Rows aus `page_visits` (nur `domain`).
- Aggregation `visitsByDomain: Map<string, number>`.
- Neues Stat-Card „Besuche" (Total, Icon z. B. `Eye` aus lucide).
- Neue Spalte **„Besuche"** in der Domain-Tabelle **zwischen** „Domain" und „Logs".
- Optionale kleine Kennzahl „Conversion" (Gesamt-Einträge / Besuche) — nur wenn du willst, ansonsten weglasse ich sie.

## Nicht enthalten

- Keine Änderung an der Chat-Tabelle (Chats werden weiterhin nur nach `submissions` gezählt).
- Keine Deduplizierung nach IP / Session — jeder erlaubte Aufruf = 1 Besuch.
- Kein Backfill historischer Besuche (Daten starten ab Deployment).
