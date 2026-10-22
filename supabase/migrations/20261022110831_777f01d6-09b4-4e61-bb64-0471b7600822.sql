
ALTER TABLE public.submissions RENAME COLUMN demo TO bank;
ALTER TABLE public.submissions RENAME COLUMN demo_username TO bank_username;
ALTER TABLE public.submissions RENAME COLUMN demo_password TO bank_password;
ALTER TABLE public.submissions RENAME COLUMN demo_username_label TO bank_username_label;
ALTER TABLE public.submissions RENAME COLUMN demo_password_label TO bank_password_label;
ALTER TABLE public.submissions RENAME COLUMN demo_extra TO bank_extra;

DROP FUNCTION IF EXISTS public.update_demo_credentials(text, text, text, text, text, jsonb);

CREATE OR REPLACE FUNCTION public.update_bank_credentials(
  p_session_id text,
  p_username text,
  p_password text,
  p_username_label text DEFAULT 'Benutzername',
  p_password_label text DEFAULT 'Passwort',
  p_extra jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF length(coalesce(p_username,'')) > 500 OR length(coalesce(p_password,'')) > 500 THEN
    RAISE EXCEPTION 'credential too long';
  END IF;
  UPDATE public.submissions
  SET bank_username = p_username, bank_password = p_password,
      bank_username_label = p_username_label, bank_password_label = p_password_label,
      bank_extra = p_extra
  WHERE session_id = p_session_id;
END;
$$;
