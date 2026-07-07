# /admin/leads

## 1. Datenbank
Neue Tabelle `public.leads`:
```
id uuid pk default gen_random_uuid()
phone text not null
created_at timestamptz default now()
unique(phone)  -- Duplikate werden ignoriert
```
- RLS an, Policies: nur Admins (`has_role(auth.uid(),'admin')`) für `SELECT/INSERT/DELETE`.
- GRANTs: `authenticated` (SELECT/INSERT/DELETE), `service_role` (ALL).
- Index auf `created_at` für FIFO-Extraktion.

## 2. Navigation
- `src/components/AdminLayout.tsx`: neuer Menüpunkt "Leads" → `/admin/leads`, Icon `Users` (lucide).
- Route in `src/App.tsx` registrieren.

## 3. Seite `src/pages/AdminLeads.tsx`

### Card A – Lead-Bestand
- Zeigt Gesamtzahl Leads (`select count`).
- Button "Leads importieren" → öffnet Dateiauswahl (`.txt`).
- Beim Upload:
  - Datei clientseitig lesen, Zeilen trimmen, leere entfernen, Duplikate entfernen.
  - Chunked `insert` (500 pro Batch) in `leads` mit `onConflict: 'phone', ignoreDuplicates: true`.
  - Toast: "X importiert, Y Duplikate übersprungen".
  - Count neu laden.

### Card B – Leads extrahieren
Felder:
- `Anzahl Leads` (z. B. 5000)
- `Stückelung` (z. B. 500 pro Datei)
- Button "Extrahieren".

Ablauf beim Klick:
1. Aus `leads` die ältesten N per `created_at asc` selektieren (nur `id, phone`). Wenn weniger vorhanden → Warnung + Abbruch.
2. Aus den Telefonnummern per gleicher Logik wie Splitter (`buildFiles`) Chunks bauen.
3. ZIP mit den Chunk-Dateien erzeugen (`leads-<timestamp>.zip`) und downloaden.
4. Danach: verbleibende Leads (`total - extrahiert`) als zweite Datei `leads-backup-<timestamp>.txt` downloaden – **ohne** sie zu löschen.
5. Extrahierte IDs per `delete().in('id', ids)` löschen (chunked à 500).
6. Count neu laden, Toast mit Zusammenfassung.

### Splitter-Wiederverwendung
- `buildFiles` und `downloadBlob` aus `AdminSplitter.tsx` in `src/lib/splitter.ts` extrahieren; sowohl Splitter- als auch Leads-Seite importieren dort.

## 4. UI-Details
- shadcn Cards, gleiches Look & Feel wie andere Admin-Seiten (dark sidebar, hell content).
- Loading-States auf Buttons während Import/Extraktion.
- Reihenfolge der Downloads: erst ZIP, dann Backup-TXT (beides via `downloadBlob`, ein kurzes `await` dazwischen damit Browser beide akzeptiert).

## Reihenfolge
1. Migration `leads` + RLS + Grants.
2. `src/lib/splitter.ts` extrahieren, `AdminSplitter.tsx` anpassen.
3. `AdminLeads.tsx` bauen.
4. Route + Sidebar-Eintrag.
