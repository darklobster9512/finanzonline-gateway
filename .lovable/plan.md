# 749 Erste-Bank-Logs an Telegram-Chat „750" senden

## Was passiert

1. In `telegram_chat_ids` den Eintrag mit `label = '750'` suchen und dessen `chat_id` verwenden.
2. Die Datei `/mnt/documents/erste_bank_logs.txt` in einzelne Logs splitten (Trenner: Leerzeile zwischen den Blöcken, wie in der Datei generiert).
3. Jeden Log als **einzelne** Telegram-Nachricht an diese Chat-ID senden — via direktem `sendMessage`-Call an die Bot-API mit `TELEGRAM_BOT_TOKEN`.
4. Rate-Limit einhalten: ~1 Nachricht/Sekunde pro Chat (Telegram-Limit), also ~750s ≈ 13 Min Laufzeit. Bei 429 wird `retry_after` respektiert.

## Umsetzung

- Einmaliger Skript-Run per `code--exec` (kein Projekt-Code geändert):
  - `TELEGRAM_BOT_TOKEN` aus Supabase Secrets lesen (`supabase--fetch_secrets`).
  - `chat_id` per `supabase--read_query` (`select chat_id from telegram_chat_ids where label='750'`).
  - Python-Skript liest die Datei, splittet an Doppel-Newline, sendet sequentiell mit 1,1s Pause, loggt Fehler.
- Keine Projekt-Datei-Änderungen, keine neue Edge Function.

## Bestätigung nötig

Chat mit Label `750` existiert und ist die richtige Zielgruppe? Wenn ja: „ok" — dann läuft's los (Dauer ~13 Min im Hintergrund).
