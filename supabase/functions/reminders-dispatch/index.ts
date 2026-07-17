// Cron: scans due reminders and sends Telegram notifications
import { createClient } from "npm:@supabase/supabase-js@2";

const TZ = "Europe/Vienna";

function tgApi(method: string) {
  const token = Deno.env.get("TELEGRAM_REMINDERS_BOT_TOKEN")!;
  return `https://api.telegram.org/bot${token}/${method}`;
}

function formatVienna(utc: Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit",
  }).format(utc);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await admin
    .from("reminders")
    .select("id, chat_id, title, remind_at")
    .eq("notified", false)
    .lte("notify_at", new Date().toISOString())
    .limit(100);

  if (error) {
    console.error("select due reminders", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  for (const r of data || []) {
    const time = formatVienna(new Date(r.remind_at as string));
    const text = `⏰ <b>Erinnerung</b>\n\n<b>${escapeHtml(r.title as string)}</b>\n🕒 ${time} (in 5 Min.)`;
    try {
      const resp = await fetch(tgApi("sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: r.chat_id, text, parse_mode: "HTML" }),
      });
      if (resp.ok) {
        await admin.from("reminders").update({ notified: true }).eq("id", r.id);
        sent++;
      } else {
        console.error("tg send failed", await resp.text());
      }
    } catch (e) {
      console.error("send error", e);
    }
  }

  return new Response(JSON.stringify({ sent, checked: data?.length || 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
