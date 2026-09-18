import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { chat_id, text } = await req.json();
    if (!chat_id || !text) {
      return new Response(JSON.stringify({ ok: false, error: "chat_id and text required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: "TELEGRAM_BOT_TOKEN missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, disable_web_page_preview: true }),
    });
    const data = await r.json();
    if (!data.ok) {
      return new Response(JSON.stringify({
        ok: false,
        retry_after: data.parameters?.retry_after,
        error_code: data.error_code,
        description: data.description,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
