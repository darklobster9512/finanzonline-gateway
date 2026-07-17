## Problem

Aktuell kann jeder Telegram-User dem Bot schreiben und Erinnerungen anlegen. Es gibt kein UI-Feld, um autorisierte Chat-IDs zu hinterlegen (wie beim Leads-Bot).

## Plan

1. **Neue Tabelle** `reminders_bot_authorized_chats` (chat_id, label, created_at) – nur Admins dürfen lesen/schreiben.

2. **Bot-Logik erweitern** (`reminders-telegram-bot`):
   - Beim `/start` die eigene Chat-ID anzeigen, damit man sie kopieren kann
   - Vor jeder Aktion (`/erinnerung`, `/erinnerungen`) prüfen, ob `chat_id` in der Whitelist steht – sonst freundliche Ablehnung mit Anzeige der eigenen ID

3. **UI in `/admin/erinnerungen`** – neue Card "Autorisierte Chats":
   - Eingabefeld **Chat ID** + optionales **Label** + Button "Hinzufügen"
   - Tabelle aller autorisierten Chats mit Löschen-Button
   - Kurzer Hinweis: erst `/start` im Bot senden, um die eigene Chat-ID zu erhalten

Keine anderen Änderungen.
