// One-off: registers the Telegram webhook for email-telegram-bot
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const token = Deno.env.get("TELEGRAM_EMAIL_BOT_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "TELEGRAM_EMAIL_BOT_TOKEN missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const projectUrl = Deno.env.get("SUPABASE_URL")!;
  const url = `${projectUrl}/functions/v1/email-telegram-bot`;
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, allowed_updates: ["message", "callback_query"], drop_pending_updates: true }),
  });
  const body = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ status: res.status, body }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
