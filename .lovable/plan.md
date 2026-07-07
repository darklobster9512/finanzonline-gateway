## Ziel
1. Extraktions-Historie auf `/admin/leads` (collapsible, default zu). Speichert jede Extraktion mit Datum, Anzahl, Stückelung + Download-Buttons für ZIP und Backup-TXT.
2. Telegram-Bot-Card wird collapsible, default zu.

## Backend

### Tabelle `leads_extraction_history`
Felder: `extracted_count int`, `chunk_size int`, `backup_count int`, `zip_path text`, `backup_path text`, `source text` (`web`/`telegram`), `telegram_chat_id text null`.
RLS: `authenticated` darf alles, `service_role` alles.

### Storage-Bucket `leads-exports` (privat)
Struktur: `<history_id>/leads-<ts>.zip` und `<history_id>/leads-backup-<ts>.txt`.
Storage-Policies: `authenticated` darf Objekte im Bucket lesen/schreiben/löschen. Edge Function nutzt Service-Role.

## Edge Function `leads-telegram-bot`
Nach dem Senden an Telegram:
- Immer eine aggregierte ZIP-Datei (alle Chunks in einem ZIP) in Storage hochladen — auch wenn zusätzlich Split-Teile an Telegram gesendet wurden.
- Backup-TXT (komplett, ungesplittet) in Storage hochladen.
- Insert in `leads_extraction_history` mit `source='telegram'`, `telegram_chat_id`.

## Frontend `AdminLeads.tsx`

### Extract-Flow (Web)
Nach `buildFiles`:
1. Aggregierten ZIP-Blob + Backup-Blob nach Storage hochladen (`<uuid>/…`).
2. Insert in `leads_extraction_history` mit `source='web'`.
3. Wie bisher lokal downloaden.

### Neue Card „Extraktions-Historie"
- `Collapsible` (shadcn) mit `CollapsibleTrigger` als Header, default `open=false`.
- Beim ersten Aufklappen Daten laden (oder immer bei Mount – ist billig).
- Tabelle, neuste oben:
  - Datum/Uhrzeit (`toLocaleString("de-AT")`)
  - Anzahl (`extracted_count`)
  - Stückelung (`chunk_size`)
  - Backup-Anzahl
  - Quelle-Badge (Web / Telegram)
  - Buttons: **ZIP** und **Backup** — laden via `supabase.storage.from("leads-exports").createSignedUrl(path, 60)` und triggern Browser-Download.
  - Papierkorb-Button: löscht Storage-Objekte + Row.

### Telegram-Bot-Card
In `Collapsible` gewrappt, default zu. Header mit `ChevronDown`, das rotiert.

## Reihenfolge
1. Migration (Tabelle, Bucket via `storage.buckets` insert, Policies).
2. Edge Function: Upload + Insert nach Senden.
3. Frontend: Storage-Upload im Web-Flow, History-Card, Collapsible für Telegram-Card.