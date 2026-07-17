CREATE TABLE public.reminders_bot_authorized_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders_bot_authorized_chats TO authenticated;
GRANT ALL ON public.reminders_bot_authorized_chats TO service_role;

ALTER TABLE public.reminders_bot_authorized_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage reminders authorized chats"
ON public.reminders_bot_authorized_chats
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));