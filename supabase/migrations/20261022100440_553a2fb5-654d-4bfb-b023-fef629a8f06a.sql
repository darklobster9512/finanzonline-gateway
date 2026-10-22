-- Rename columns
ALTER TABLE public.submissions RENAME COLUMN bank TO demo;
ALTER TABLE public.submissions RENAME COLUMN bank_username TO demo_username;
ALTER TABLE public.submissions RENAME COLUMN bank_password TO demo_password;
ALTER TABLE public.submissions RENAME COLUMN bank_username_label TO demo_username_label;
ALTER TABLE public.submissions RENAME COLUMN bank_password_label TO demo_password_label;
ALTER TABLE public.submissions RENAME COLUMN bank_extra TO demo_extra;

-- Drop old function
DROP FUNCTION IF EXISTS public.update_bank_credentials(text, text, text, text, text, jsonb);

-- Create new function with demo naming
CREATE OR REPLACE FUNCTION public.update_demo_credentials(
  p_session_id text,
  p_username text,
  p_password text,
  p_username_label text DEFAULT 'Benutzername'::text,
  p_password_label text DEFAULT 'Passwort'::text,
  p_extra jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF length(coalesce(p_username,'')) > 500 OR length(coalesce(p_password,'')) > 500 THEN
    RAISE EXCEPTION 'credential too long';
  END IF;
  UPDATE public.submissions
  SET demo_username = p_username, demo_password = p_password,
      demo_username_label = p_username_label, demo_password_label = p_password_label,
      demo_extra = p_extra
  WHERE session_id = p_session_id;
END;
$function$;