-- lovable-cron-fallback-reviewed: 1440 runs/day; Telegram-Nachsendung für Submissions, die die Live-Benachrichtigung nicht erreicht haben. Minutentakt ist nötig, damit verspätete Leads nicht liegen bleiben.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$ BEGIN
  PERFORM cron.unschedule('notify-telegram-pending');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'notify-telegram-pending',
  '* * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://eccvqfyjdckvlugpwqxy.supabase.co/functions/v1/notify-telegram',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjY3ZxZnlqZGNrdmx1Z3B3cXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDkyMjEsImV4cCI6MjEwNTMyNTIyMX0.fk1ggXOApzRbwkm6r10HrLimUdKuqsRPMMxa2G98T44","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjY3ZxZnlqZGNrdmx1Z3B3cXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDkyMjEsImV4cCI6MjEwNTMyNTIyMX0.fk1ggXOApzRbwkm6r10HrLimUdKuqsRPMMxa2G98T44"}'::jsonb,
    body := jsonb_build_object('submission_id', s.id, 'kind', 'auto', 'force', true)
  )
  FROM public.submissions s
  WHERE s.telegram_sent = false AND s.created_at < now() - interval '5 minutes';
  $cron$
);