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
  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const body = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ status: res.status, body }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
