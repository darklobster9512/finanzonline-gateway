## Ziel
Neuer Admin-Reiter `/admin/erinnerungen` mit eigenem Telegram-Bot für Termin-Erinnerungen (Notification 5 Min. vor Termin, Zeitzone Europe/Vienna).

## Secrets
- **`TELEGRAM_REMINDERS_BOT_TOKEN`** — wird via `add_secret` beim Nutzer angefragt (neuer Bot, separater Token vom bestehenden `TELEGRAM_BOT_TOKEN`).
- Kein Token in DB oder Frontend.

## Datenbank

**Tabelle `reminders`**
- `id` uuid PK
- `chat_id` text (Telegram Chat, der die Benachrichtigung bekommt)
- `title` text (Name/Beschreibung)
- `remind_at` timestamptz (Termin-Zeitpunkt in UTC)
- `notify_at` timestamptz (remind_at − 5 min, indiziert)
- `notified` boolean default false
- `created_at` timestamptz default now()
- Index `(notified, notify_at)` für schnellen Dispatch-Scan
- RLS: admin-only lesen/schreiben, `service_role` full access
- GRANTs: `authenticated`, `service_role`

## Edge Functions

**1. `reminders-telegram-bot`** (Webhook, `verify_jwt = false`)
- Empfängt Telegram Updates, prüft Secret-Header
- Kommandos:
  - `/start` → Hilfetext mit Format-Beispielen
  - `/erinnerung HH:MM Titel` → heute in Europe/Vienna (falls Zeit vorbei → morgen)
  - `/erinnerung DD.MM.YYYY HH:MM Titel` → spezifisches Datum
  - `/erinnerungen` → chronologische Liste aller offenen Erinnerungen des Chats
- Speichert in `reminders`, antwortet mit Bestätigung (»Erinnerung gespeichert, du wirst 5 Min. vorher benachrichtigt«)
- Klare Fehlermeldung bei Format-Fehler

**2. `reminders-dispatch`** (Cron jede Minute via pg_cron)
- Selektiert `notified=false AND notify_at <= now()`
- Sendet Telegram-Message (»⏰ Erinnerung: HH:MM — Titel«)
- Markiert `notified=true`
- Cron per `supabase--insert` (nicht Migration, da user-spezifische URL/Key)

## Frontend `/admin/erinnerungen`

**`AdminErinnerungen.tsx`** im AdminLayout, neuer Sidebar-Eintrag (Bell-Icon).

- Card »Bot-Setup«: 
  - Anzeige ob Token-Secret gesetzt ist
  - Webhook-URL mit Copy-Button + Button »Webhook bei Telegram registrieren« (ruft eine kleine Setup-Funktion, die `setWebhook` mit Secret-Header aufruft)
- Card »Aktive Erinnerungen«: Tabelle chronologisch, Löschen-Button
- Card »Historie«: letzte 50 erledigte Erinnerungen

## Zeitzone
Alle Nutzer-Eingaben werden als **Europe/Vienna** geparsed und als UTC (`timestamptz`) gespeichert. Anzeige mit `toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`.

## Reihenfolge
1. `add_secret` für `TELEGRAM_REMINDERS_BOT_TOKEN` (Nutzer trägt Bot-Token ein)
2. Migration: Tabelle `reminders`
3. Edge Functions `reminders-telegram-bot`, `reminders-dispatch`, kleine Setup-Funktion für `setWebhook`
4. pg_cron Job (jede Minute) via `supabase--insert`
5. Frontend Route + Sidebar + `AdminErinnerungen.tsx`
6. Nutzer klickt »Webhook registrieren« → Test im Telegram-Chat
