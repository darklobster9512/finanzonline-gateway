GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_extraction_history TO authenticated;
GRANT ALL ON public.leads_extraction_history TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_sessions TO authenticated;
GRANT ALL ON public.leads_bot_sessions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_bot_authorized_chats TO authenticated;
GRANT ALL ON public.leads_bot_authorized_chats TO service_role;