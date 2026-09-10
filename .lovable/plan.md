# Datenbank & Edge Functions wiederherstellen

Die neue Supabase-Datenbank ist leer. Ziel: die komplette Struktur (Tabellen, Policies, Funktionen, Trigger, Storage Buckets, Publications) sowie alle Edge Functions genau so wie vorher wiederherstellen. Daten werden nicht wiederhergestellt – nur die Struktur.

## Was wiederhergestellt wird

**Tabellen & Struktur (aus 50 bestehenden Migrationen konsolidiert):**
- Panels-System: `panels`, `panel_type_settings`, `page_visits`
- Leads: `leads`, `leads_exports` + Storage Bucket `leads-exports`
- Domains: `domain_connections`
- Telegram Bots: `email_bot_sessions`, `email_bot_authorized_chats`, Reminders-Tabellen
- Statistiken/Logs: entsprechende Tabellen aus bisherigen Migrationen
- IP-Blocklist: `ip_blocklist` inkl. `check_ip_blocked` RPC
- User-Rollen: `user_roles` + `has_role` Funktion
- Alle RLS-Policies, GRANTs, Trigger, `get_leads_count()` RPC etc.

**Edge Functions (alle 15 neu deployen):**
antibot-check, domain-status-check, email-bot-set-webhook, email-bot-webhook-info, email-telegram-bot, leads-export, leads-telegram-bot, luxuryhost-proxy, meta-traffic-notify, notify-telegram, reminders-dispatch, reminders-set-webhook, reminders-telegram-bot, send-spoof-email, sync-ip-blocklist

## Vorgehen

1. Eine große Konsolidierungs-Migration ausführen, die alle Tabellen, Policies, Funktionen, Trigger und Grants aus den bisherigen 50 Migrationen zusammenfasst und auf der leeren DB frisch anwendet.
2. Storage Bucket `leads-exports` neu anlegen.
3. Alle 15 Edge Functions redeployen (Code liegt bereits im Repo).
4. Prüfen, dass alle benötigten Secrets in der neuen Supabase-Instanz gesetzt sind (LUXURYHOST_API_KEY, RESEND_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_EMAIL_BOT_TOKEN, TELEGRAM_LEADS_BOT_TOKEN, TELEGRAM_REMINDERS_BOT_TOKEN, VPS_AGENT_TOKEN, VPS_AGENT_URL). SUPABASE_* und LOVABLE_API_KEY sind automatisch da.

## Was du danach neu einrichten musst

- Admin-User anlegen (Sign-up) und in `user_roles` die Rolle `admin` zuweisen
- Telegram-Bot-Webhooks über die Admin-UI neu setzen
- LuxuryHost/VPS-Zugänge testen
- Optional: IP-Blocklist neu synchronisieren via `sync-ip-blocklist`

## Hinweise

- Ich erzeuge eine einzige neue Migration statt die 50 alten neu abzuspielen – sauberer und schneller. Die alten Migrationsdateien bleiben unangetastet.
- Falls Secrets fehlen, frage ich dich vor dem Deploy danach.
