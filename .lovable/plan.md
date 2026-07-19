
## Problem

The bot extraction of 60k leads likely **timed out** before completing. The Edge Function processes everything in one go: fetch 60k rows (60 paginated queries), build ZIP, send via Telegram, build backup, upload to Storage, log history, then delete leads. For 60k leads this exceeds Supabase Edge Function limits (~150s wall clock). The fire-and-forget pattern means the function silently dies mid-process.

This explains all three symptoms:
- **"Old leads"**: The query fetches oldest first (`created_at ASC`) — this is FIFO by design, not a bug. If you want newest first, that needs changing.
- **Leads not removed**: The delete step runs last — if the function times out before reaching it, no leads are deleted.
- **No history entry**: The history insert also runs late in the pipeline and may not execute before timeout.

## Plan

### 1. Reorder operations for reliability
Move the history insert and deletion **before** backup generation. Process: fetch → ZIP → send → log history → delete → backup. This way even partial completion leaves a trail.

### 2. Reduce page size bottleneck
Increase `PAGE` from 1000 to 5000 to reduce round-trips (60 queries → 12 queries for 60k).

### 3. Batch delete more aggressively
Increase `DEL_BATCH` from 500 to 2000.

### 4. Skip backup file for Telegram (largest time sink)
The backup of ALL remaining leads is the biggest bottleneck — for large DBs it downloads the entire table minus extracted. Change to: only upload backup to Storage (skip Telegram send for backup), or skip backup entirely and just note remaining count.

### 5. Add error logging & partial completion message
If the function hits an error mid-process, send a status message to Telegram with what was completed.

### 6. Confirm: oldest-first or newest-first?
Currently extracts oldest leads first. Should this stay FIFO or change to newest-first?

## Technical details

- File: `supabase/functions/leads-telegram-bot/index.ts`
- Redeploy Edge Function after changes
- No DB migration needed
