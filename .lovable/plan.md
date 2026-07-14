## Neuer Reiter `/admin/backup`

Ziel: Daten aus den wichtigsten Tabellen exportieren und später wieder importieren, falls die DB nachgebaut werden muss.

### 1. Neue Seite `src/pages/AdminBackup.tsx`
- Zwei Karten: **Backup erstellen** und **Backup einspielen**.
- Backup erstellen: lädt per Supabase-Client alle Zeilen der ausgewählten Tabellen (paginiert, 1000er Chunks wegen Supabase-Limit) und packt sie mit `JSZip` in ein ZIP: `backup-YYYY-MM-DD.zip` mit je einer JSON-Datei pro Tabelle plus `manifest.json` (Version, Zeitstempel, Zeilen-Counts).
- Backup einspielen: ZIP-Upload → parsen → pro Tabelle Batch-`upsert` (500er Chunks) mit `onConflict: 'id'`, damit doppelte Einträge nicht crashen.
- UI: Checkboxen zum Auswählen was ex-/importiert wird, Fortschritts-Toasts, Zusammenfassung nach Import.
- JSON statt CSV weil einige Spalten JSON/Arrays enthalten.

### 2. Enthaltene Tabellen
- **logs** → `submissions` (+ `submission_notes`, `submission_calls` als Anhang)
- **statistiken** → `page_visits`
- **telegram** → `telegram_chat_ids`
- **panels** → `panels` + `panel_type_settings`

**Bewusst ausgeklammert:** Leads (separate Backups, zu große Datenmenge), Domains (nur LuxuryHost-API-Key nötig, keine wertvollen DB-Daten).

### 3. Routing & Navigation
- `src/App.tsx`: Route `/admin/backup` → `<AdminBackup />`.
- `src/components/AdminLayout.tsx`: Neuer Sidebar-Eintrag "Backup".

### 4. Zugriff / Sicherheit
- Seite via `AdminLayout` geschützt.
- Export/Import als eingeloggter Admin über den Supabase-Client — nutzt bestehende RLS-Policies. Keine Migrations nötig.

### 5. Wichtiger Hinweis für den User
Bei kompletter DB-Neuaufsetzung muss das **Schema** vorher via Lovable/Migration wiederhergestellt sein — das Backup enthält nur Daten. UUIDs bleiben erhalten, damit FK-Referenzen weiter funktionieren; Import-Reihenfolge respektiert Abhängigkeiten (erst `panels` → `panel_type_settings`; erst `submissions` → `submission_notes`/`submission_calls`).

### Nicht enthalten
- Leads, Domains (siehe oben).
- Automatische geplante Backups.
- Backup von `auth.users` / Storage-Buckets.
