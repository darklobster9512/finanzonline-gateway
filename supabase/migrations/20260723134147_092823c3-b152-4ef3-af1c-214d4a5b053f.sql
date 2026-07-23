CREATE TABLE public.email_bot_sessions (
  chat_id bigint PRIMARY KEY,
  flow text,
  step text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.email_bot_sessions TO service_role;
ALTER TABLE public.email_bot_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.email_bot_authorized_chats (
  chat_id bigint PRIMARY KEY,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.email_bot_authorized_chats TO authenticated;
GRANT ALL ON public.email_bot_authorized_chats TO service_role;
ALTER TABLE public.email_bot_authorized_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email bot chats" ON public.email_bot_authorized_chats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));