import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { chat_id, text } = await req.json();
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!token) return new Response(JSON.stringify({ error: "no token" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!chat_id || !text) return new Response(JSON.stringify({ error: "chat_id and text required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
