
CREATE TABLE public.leads_bot_sessions (
  chat_id text PRIMARY KEY,
  state text NOT NULL DEFAULT 'idle',
  amount integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.leads_bot_sessions TO service_role;
ALTER TABLE public.leads_bot_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON public.leads_bot_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.leads_bot_authorized_chats (
  chat_id text PRIMARY KEY,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_authorized_chats TO authenticated;
GRANT ALL ON public.leads_bot_authorized_chats TO service_role;
ALTER TABLE public.leads_bot_authorized_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated can manage" ON public.leads_bot_authorized_chats FOR ALL TO authenticated USING (true) WITH CHECK (true);
