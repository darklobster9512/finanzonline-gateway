// Registers the Telegram webhook for the reminders bot.
// Callable only by authenticated admins.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: cErr } = await supabase.auth.getClaims(token);
  if (cErr || !claims?.claims?.sub) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: isAdmin } = await admin.rpc("has_role", {
    _user_id: claims.claims.sub,
    _role: "admin",
  });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }

  const botToken = Deno.env.get("TELEGRAM_REMINDERS_BOT_TOKEN");
  if (!botToken) {
    return new Response(JSON.stringify({ error: "TELEGRAM_REMINDERS_BOT_TOKEN not set" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const projectUrl = Deno.env.get("SUPABASE_URL")!;
  const webhookUrl = `${projectUrl}/functions/v1/reminders-telegram-bot`;

  const resp = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message", "edited_message"],
      drop_pending_updates: true,
    }),
  });
  const body = await resp.json();

  return new Response(JSON.stringify({ ok: resp.ok, telegram: body, webhookUrl }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
