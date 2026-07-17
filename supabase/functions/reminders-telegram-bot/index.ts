// Reminders Telegram bot webhook
import { createClient } from "npm:@supabase/supabase-js@2";

const TZ = "Europe/Vienna";

function tgApi(method: string) {
  const token = Deno.env.get("TELEGRAM_REMINDERS_BOT_TOKEN")!;
  return `https://api.telegram.org/bot${token}/${method}`;
}

async function sendMessage(chatId: string | number, text: string) {
  try {
    await fetch(tgApi("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (e) {
    console.error("sendMessage failed", e);
  }
}

// Get offset in minutes for Europe/Vienna at a given UTC instant
function viennaOffsetMinutes(utcDate: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const parts = dtf.formatToParts(utcDate);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
  const asUtc = Date.UTC(
    Number(map.year), Number(map.month) - 1, Number(map.day),
    Number(map.hour === "24" ? "0" : map.hour), Number(map.minute), Number(map.second)
  );
  return (asUtc - utcDate.getTime()) / 60000;
}

// Convert Vienna wall-clock (Y,M,D,h,m) to a UTC Date
function viennaToUtc(y: number, mo: number, d: number, h: number, mi: number): Date {
  // First guess using UTC
  const guess = new Date(Date.UTC(y, mo - 1, d, h, mi, 0));
  const off1 = viennaOffsetMinutes(guess);
  const utc = new Date(guess.getTime() - off1 * 60000);
  // Adjust for DST edge
  const off2 = viennaOffsetMinutes(utc);
  if (off2 !== off1) return new Date(guess.getTime() - off2 * 60000);
  return utc;
}

function nowVienna(): { y: number; mo: number; d: number; h: number; mi: number } {
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = dtf.formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
  return {
    y: Number(map.year), mo: Number(map.month), d: Number(map.day),
    h: Number(map.hour === "24" ? "0" : map.hour), mi: Number(map.minute),
  };
}

function formatVienna(utc: Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(utc);
}

function parseReminder(argStr: string): { remindAt: Date; title: string } | { error: string } {
  const s = argStr.trim();
  if (!s) return { error: "Format: /erinnerung HH:MM Titel  oder  /erinnerung DD.MM.YYYY HH:MM Titel" };

  // Try DD.MM.YYYY HH:MM Titel
  const mDate = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})\s+(.+)$/);
  if (mDate) {
    const [, dd, mm, yyyy, hh, mi, title] = mDate;
    const d = viennaToUtc(Number(yyyy), Number(mm), Number(dd), Number(hh), Number(mi));
    if (isNaN(d.getTime())) return { error: "Ungültiges Datum." };
    if (d.getTime() <= Date.now()) return { error: "Der Termin liegt in der Vergangenheit." };
    return { remindAt: d, title: title.trim() };
  }

  // Try HH:MM Titel  (heute in Vienna, sonst morgen)
  const mTime = s.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
  if (mTime) {
    const [, hh, mi, title] = mTime;
    const now = nowVienna();
    let d = viennaToUtc(now.y, now.mo, now.d, Number(hh), Number(mi));
    if (d.getTime() <= Date.now()) {
      // add 24h in Vienna wall-clock
      const tomorrow = new Date(Date.UTC(now.y, now.mo - 1, now.d) + 24 * 3600 * 1000);
      const tParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      }).formatToParts(tomorrow);
      const m: Record<string, string> = {};
      for (const p of tParts) if (p.type !== "literal") m[p.type] = p.value;
      d = viennaToUtc(Number(m.year), Number(m.month), Number(m.day), Number(hh), Number(mi));
    }
    return { remindAt: d, title: title.trim() };
  }

  return { error: "Format nicht erkannt.\nBeispiel:\n<code>/erinnerung 21:30 Stefan Müller</code>\n<code>/erinnerung 20.07.2026 21:30 Stefan Müller</code>" };
}

const HELP = `👋 <b>Willkommen beim Erinnerungs-Bot</b>

So legst du eine Erinnerung an:

<b>Heute / morgen (nur Uhrzeit):</b>
<code>/erinnerung 21:30 Stefan Müller</code>

<b>An einem bestimmten Datum:</b>
<code>/erinnerung 20.07.2026 21:30 Stefan Müller</code>

Du bekommst <b>5 Minuten vor</b> dem Termin eine Benachrichtigung.

<b>Weitere Kommandos:</b>
/erinnerungen – zeigt alle offenen Erinnerungen
/start – zeigt diese Hilfe`;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let update: any;
  try { update = await req.json(); } catch { return new Response("ok"); }

  const msg = update?.message ?? update?.edited_message;
  if (!msg?.chat?.id) return new Response(JSON.stringify({ ok: true }));

  const chatId = msg.chat.id as number;
  const text: string = (msg.text || "").toString();

  const cmdMatch = text.match(/^\/(\w+)(?:@\w+)?(?:\s+([\s\S]*))?$/);
  const cmd = cmdMatch?.[1]?.toLowerCase();
  const args = cmdMatch?.[2] ?? "";

  // Authorization check (except /start & /help which show the chat id)
  const { data: authRow } = await admin
    .from("reminders_bot_authorized_chats")
    .select("chat_id")
    .eq("chat_id", String(chatId))
    .maybeSingle();
  const authorized = !!authRow;

  try {
    if (cmd === "start" || cmd === "help") {
      const authNote = authorized
        ? "✅ Dieser Chat ist <b>autorisiert</b>."
        : `🔒 Dieser Chat ist <b>nicht autorisiert</b>.\nDeine Chat-ID: <code>${chatId}</code>\nBitte im Admin-Panel unter <i>Erinnerungen → Autorisierte Chats</i> hinzufügen.`;
      await sendMessage(chatId, `${HELP}\n\n${authNote}`);
    } else if (!authorized) {
      await sendMessage(
        chatId,
        `🔒 Dieser Chat ist nicht autorisiert.\n\nDeine Chat-ID: <code>${chatId}</code>\n\nBitte im Admin-Panel hinzufügen.`,
      );
    } else if (cmd === "erinnerung") {

      const parsed = parseReminder(args);
      if ("error" in parsed) {
        await sendMessage(chatId, "❌ " + parsed.error);
      } else {
        const notifyAt = new Date(parsed.remindAt.getTime() - 5 * 60000);
        const { error } = await admin.from("reminders").insert({
          chat_id: String(chatId),
          title: parsed.title.slice(0, 500),
          remind_at: parsed.remindAt.toISOString(),
          notify_at: notifyAt.toISOString(),
        });
        if (error) {
          console.error("insert reminder error", error);
          await sendMessage(chatId, "❌ Konnte Erinnerung nicht speichern.");
        } else {
          await sendMessage(
            chatId,
            `✅ Erinnerung gespeichert.\n\n<b>${escapeHtml(parsed.title)}</b>\n📅 ${formatVienna(parsed.remindAt)}\n\nDu wirst 5 Minuten vorher benachrichtigt.`,
          );
        }
      }
    } else if (cmd === "erinnerungen") {
      const { data, error } = await admin
        .from("reminders")
        .select("id, title, remind_at, notified")
        .eq("chat_id", String(chatId))
        .eq("notified", false)
        .order("remind_at", { ascending: true })
        .limit(50);
      if (error) {
        await sendMessage(chatId, "❌ Fehler beim Laden.");
      } else if (!data || data.length === 0) {
        await sendMessage(chatId, "📭 Keine offenen Erinnerungen.");
      } else {
        const lines = data.map((r, i) =>
          `${i + 1}. <b>${escapeHtml(r.title)}</b>\n   📅 ${formatVienna(new Date(r.remind_at as string))}`
        );
        await sendMessage(chatId, "📋 <b>Deine Erinnerungen</b>\n\n" + lines.join("\n\n"));
      }
    } else {
      await sendMessage(chatId, "Unbekanntes Kommando. Sende /start für Hilfe.");
    }
  } catch (e) {
    console.error("bot handler error", e);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
