## Ziel

Zweiter Telegram-Bot für Lead-Extraktion via Chat. Bot antwortet auf `/start`, zeigt Bestand + Button, fragt nach Menge & Stückelung, liefert ZIP + Backup, löscht extrahierte Leads.

## Komponenten

### 1. Neues Secret
- `TELEGRAM_LEADS_BOT_TOKEN` — separater BotFather-Token (der User legt ihn nach BotFather-Setup ab).

### 2. Neue Tabelle `leads_bot_sessions` (Konversationsstate)
Telegram ist stateless — wir merken pro Chat, in welchem Schritt (Menge fragen / Stückelung fragen) er ist.
Felder: `chat_id text pk`, `state text` (`idle`|`awaiting_amount`|`awaiting_chunk`), `amount int null`, `updated_at timestamptz`.
RLS: nur `service_role` (Edge Function nutzt Service Role).

### 3. Neue Tabelle `leads_bot_authorized_chats`
Whitelist welche Telegram-Chat-IDs den Bot benutzen dürfen (sonst könnte jeder Fremde deinen Bestand leeren).
Felder: `chat_id text pk`, `label text null`, `created_at timestamptz`.
RLS: `authenticated` full, `service_role` full.

### 4. Edge Function `leads-telegram-bot`
Empfängt Telegram Webhook Updates. Logik:

- **`/start`** → prüft ob `chat_id` in `leads_bot_authorized_chats`. Wenn nicht: „Nicht autorisiert. Chat-ID: <id>" (damit User sie im Admin freischalten kann). Wenn ja: liest `count(*)` aus `leads`, sendet Nachricht mit Bestand + Inline-Button „📤 Leads extrahieren" (callback_data `extract`). Setzt State `idle`.
- **Callback `extract`** → sendet „Wie viele Leads möchtest du? (z.B. 50000, 50.000, 50k)", State `awaiting_amount`.
- **Text in `awaiting_amount`** → parst via Helper `parseHumanNumber` (unterstützt `.`, `,`, `k`/`K`, `m`/`M`). Ungültig → Nachfrage. Gültig → speichert `amount`, fragt „In welcher Stückelung? (z.B. 1500, 1.500, 1.5k)", State `awaiting_chunk`.
- **Text in `awaiting_chunk`** → parst gleich. Antwortet „⏳ Extrahiere …", dann:
  1. Holt älteste `amount` Leads (`order created_at asc limit`).
  2. Baut Chunks à `chunkSize` (Server-Side, gleiche Logik wie `buildFiles`).
  3. Baut ZIP mit `jszip` (via `https://esm.sh/jszip@3`).
  4. Sendet ZIP per `sendDocument` (multipart/form-data) an den Chat, Dateiname `leads-<ts>.zip`.
  5. Holt verbleibende Leads paginiert, baut `leads-backup-<ts>.txt`, sendet als zweites Dokument.
  6. Löscht extrahierte Leads chunked à 500 per `.in("id", …)`.
  7. Sendet Zusammenfassung + neuen Bestand + Button.
  State → `idle`.
- **Sonstiger Text im `idle`** → Hinweis „Sende /start".
- Fehler → freundliche Nachricht + State reset.

Telegram-Dateilimit: `sendDocument` erlaubt bis 50 MB pro Datei. Sollte ZIP größer werden, splittet der Bot automatisch in mehrere ZIPs (Teil 1/N, 2/N).

### 5. Webhook-Setup
Edge Function ist public (verify_jwt=false in `supabase/config.toml`). Nach Deploy einmalig setzen:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<ref>.functions.supabase.co/leads-telegram-bot
```
Das erklären wir dem User im Admin-UI.

### 6. Admin-UI Erweiterung `/admin/leads`
Neue Card **„Telegram Bot"**:
- Kurz-Anleitung (BotFather → Token als `TELEGRAM_LEADS_BOT_TOKEN` Secret → Webhook-URL kopieren → curl-Befehl anzeigen).
- Button „Webhook setzen" ruft Edge Function mit `{ action: "set_webhook" }` auf (bequemer als curl).
- Button „Bot testen" (`getMe`) — zeigt Bot-Username.
- Liste **autorisierte Chat-IDs** (`leads_bot_authorized_chats`) mit Add/Remove.

### 7. Kleinigkeiten
- `parseHumanNumber(s)` — geteilt zwischen Edge Function und ggf. Frontend, aber Edge Function ist Deno → einfach direkt in Function-File.
- Splitter-Logik (`buildFiles`) wird in Edge Function dupliziert (Deno/Browser trennen), sehr kurz.

## Reihenfolge Implementierung

1. Migration: `leads_bot_sessions` + `leads_bot_authorized_chats` (+ GRANTs).
2. Secret `TELEGRAM_LEADS_BOT_TOKEN` (User setzt Wert).
3. Edge Function `leads-telegram-bot` inkl. `verify_jwt = false` in `supabase/config.toml`.
4. Admin-UI: neue Card „Telegram Bot" in `AdminLeads.tsx` mit Anleitung, Webhook-Setter, Chat-Whitelist-Verwaltung.

## Offene Frage

Soll der User selbst die Chat-IDs im Admin-UI freischalten (Whitelist wie oben skizziert) — oder darf **jede** Chat-ID mit dem Bot chatten, die den Token kennt? Whitelist ist sicherer und wird hier vorgeschlagen.