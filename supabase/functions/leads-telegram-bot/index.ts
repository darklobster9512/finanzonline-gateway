import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "https://esm.sh/jszip@3.10.1";

const BOT_TOKEN = Deno.env.get("TELEGRAM_LEADS_BOT_TOKEN") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const TG_MAX_FILE = 45 * 1024 * 1024; // 45 MB safety margin (limit is 50)
const DEL_BATCH = 500;
const PAGE = 1000;

function supa() {
  return createClient(SUPABASE_URL, SERVICE_ROLE);
}

// ---- Helpers ----------------------------------------------------------------

function parseHumanNumber(input: string): number | null {
  if (!input) return null;
  const s = input.trim().toLowerCase().replace(/\s+/g, "");
  // strip thousand separators (.,)
  const m = s.match(/^([0-9]+(?:[.,][0-9]+)?)([km])?$/);
  if (!m) {
    // try: 50.000 style (dots as thousand sep) -> strip dots/commas
    const stripped = s.replace(/[.,]/g, "");
    if (/^\d+$/.test(stripped)) return parseInt(stripped, 10);
    return null;
  }
  let num = parseFloat(m[1].replace(",", "."));
  const suffix = m[2];
  if (suffix === "k") num *= 1000;
  else if (suffix === "m") num *= 1_000_000;
  else {
    // no suffix -> the dot/comma in m[1] is a thousand separator, not decimal
    if (m[1].includes(".") || m[1].includes(",")) {
      const stripped = m[1].replace(/[.,]/g, "");
      num = parseInt(stripped, 10);
    }
  }
  if (!Number.isFinite(num) || num < 1) return null;
  return Math.floor(num);
}

function buildChunks(numbers: string[], chunkSize: number): { name: string; content: string }[] {
  const files: { name: string; content: string }[] = [];
  const total = Math.ceil(numbers.length / chunkSize);
  const pad = String(total).length;
  for (let i = 0; i < total; i++) {
    const slice = numbers.slice(i * chunkSize, (i + 1) * chunkSize);
    const idx = String(i + 1).padStart(pad, "0");
    files.push({ name: `nummern-${idx}.txt`, content: slice.join("\n") });
  }
  return files;
}

async function tg(method: string, payload: Record<string, unknown>) {
  const res = await fetch(`${TG_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function tgSendDocument(chatId: string | number, filename: string, bytes: Uint8Array, caption?: string) {
  const fd = new FormData();
  fd.append("chat_id", String(chatId));
  if (caption) fd.append("caption", caption);
  fd.append("document", new Blob([bytes], { type: "application/octet-stream" }), filename);
  const res = await fetch(`${TG_API}/sendDocument`, { method: "POST", body: fd });
  return res.json();
}

async function sendMessage(chatId: string | number, text: string, extra: Record<string, unknown> = {}) {
  return tg("sendMessage", { chat_id: chatId, text, ...extra });
}

function extractButton() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "📤 Leads extrahieren", callback_data: "extract" }]],
    },
  };
}

async function isAuthorized(chatId: string): Promise<boolean> {
  const { data } = await supa()
    .from("leads_bot_authorized_chats")
    .select("chat_id")
    .eq("chat_id", chatId)
    .maybeSingle();
  return !!data;
}

async function setState(chatId: string, state: string, amount: number | null = null) {
  await supa()
    .from("leads_bot_sessions")
    .upsert(
      { chat_id: chatId, state, amount, updated_at: new Date().toISOString() },
      { onConflict: "chat_id" },
    );
}

async function getState(chatId: string): Promise<{ state: string; amount: number | null }> {
  const { data } = await supa()
    .from("leads_bot_sessions")
    .select("state, amount")
    .eq("chat_id", chatId)
    .maybeSingle();
  return data ?? { state: "idle", amount: null };
}

async function getLeadCount(): Promise<number> {
  const { count } = await supa().from("leads").select("*", { count: "exact", head: true });
  return count ?? 0;
}

// ---- Command handlers -------------------------------------------------------

async function handleStart(chatId: string) {
  const count = await getLeadCount();
  await setState(chatId, "idle");
  await sendMessage(
    chatId,
    `👋 Willkommen!\n\n📦 Aktueller Bestand: ${count.toLocaleString("de-AT")} Leads\n\nKlicke unten um Leads zu extrahieren.`,
    extractButton(),
  );
}

async function handleExtractCallback(chatId: string) {
  await setState(chatId, "awaiting_amount");
  await sendMessage(
    chatId,
    "Wie viele Leads möchtest du extrahieren?\n\nBeispiele: 50000, 50.000, 50k",
  );
}

async function handleAmountInput(chatId: string, text: string) {
  const n = parseHumanNumber(text);
  if (!n) {
    await sendMessage(chatId, "❌ Ungültige Zahl. Bitte z.B. 50000, 50.000 oder 50k senden.");
    return;
  }
  await setState(chatId, "awaiting_chunk", n);
  await sendMessage(
    chatId,
    `✅ ${n.toLocaleString("de-AT")} Leads.\n\nIn welcher Stückelung (pro Datei)?\n\nBeispiele: 1500, 1.500, 1.5k`,
  );
}

async function handleChunkInput(chatId: string, text: string) {
  const chunkSize = parseHumanNumber(text);
  if (!chunkSize) {
    await sendMessage(chatId, "❌ Ungültige Zahl. Bitte z.B. 1500, 1.500 oder 1.5k senden.");
    return;
  }
  const { amount } = await getState(chatId);
  if (!amount) {
    await sendMessage(chatId, "⚠️ Session verloren, bitte /start erneut senden.");
    await setState(chatId, "idle");
    return;
  }

  await sendMessage(chatId, `⏳ Extrahiere ${amount.toLocaleString("de-AT")} Leads in ${chunkSize.toLocaleString("de-AT")}er-Chunks...`);

  try {
    const client = supa();

    // 1) Fetch oldest N leads (may need to page if > 1000)
    const toExtract: { id: string; phone: string }[] = [];
    let remainingNeeded = amount;
    let cursor = 0;
    while (remainingNeeded > 0) {
      const take = Math.min(remainingNeeded, PAGE);
      const { data, error } = await client
        .from("leads")
        .select("id, phone")
        .order("created_at", { ascending: true })
        .range(cursor, cursor + take - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      toExtract.push(...data);
      remainingNeeded -= data.length;
      cursor += data.length;
      if (data.length < take) break;
    }

    if (toExtract.length === 0) {
      await sendMessage(chatId, "❌ Keine Leads in der Datenbank.");
      await setState(chatId, "idle");
      return;
    }

    if (toExtract.length < amount) {
      await sendMessage(
        chatId,
        `ℹ️ Nur ${toExtract.length.toLocaleString("de-AT")} von ${amount.toLocaleString("de-AT")} Leads verfügbar — extrahiere alle.`,
      );
    }

    const extractedPhones = toExtract.map((r) => r.phone);
    const extractedIds = toExtract.map((r) => r.id);
    const chunks = buildChunks(extractedPhones, chunkSize);
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    // 2) Build the aggregated ZIP (used both for Telegram send when it fits, and always for Storage)
    const aggZip = new JSZip();
    chunks.forEach((f) => aggZip.file(f.name, f.content));
    const aggZipBytes: Uint8Array = await aggZip.generateAsync({ type: "uint8array" });

    // Split into Telegram parts if the aggregated ZIP is too big
    if (aggZipBytes.length <= TG_MAX_FILE) {
      await tgSendDocument(
        chatId,
        `leads-${ts}.zip`,
        aggZipBytes,
        `${chunks.length} Datei(en), ${extractedPhones.length.toLocaleString("de-AT")} Nummern`,
      );
    } else {
      // group chunks by cumulative size and send multiple ZIPs
      const groups: { name: string; content: string }[][] = [];
      let current: { name: string; content: string }[] = [];
      let currentBytes = 0;
      for (const f of chunks) {
        const size = new TextEncoder().encode(f.content).length + f.name.length + 200;
        if (currentBytes + size > TG_MAX_FILE && current.length > 0) {
          groups.push(current);
          current = [];
          currentBytes = 0;
        }
        current.push(f);
        currentBytes += size;
      }
      if (current.length) groups.push(current);
      for (let gi = 0; gi < groups.length; gi++) {
        const zip = new JSZip();
        groups[gi].forEach((f) => zip.file(f.name, f.content));
        const blob: Uint8Array = await zip.generateAsync({ type: "uint8array" });
        await tgSendDocument(
          chatId,
          `leads-${ts}-teil${gi + 1}von${groups.length}.zip`,
          blob,
          `Teil ${gi + 1}/${groups.length} — ${groups[gi].length} Datei(en)`,
        );
      }
    }

    // 3) Build backup file with remaining leads (excluding extracted ids)
    const extractedSet = new Set(extractedIds);
    const remaining: string[] = [];
    let from = 0;
    while (true) {
      const { data, error } = await client
        .from("leads")
        .select("id, phone")
        .order("created_at", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      for (const r of data) if (!extractedSet.has(r.id)) remaining.push(r.phone);
      if (data.length < PAGE) break;
      from += PAGE;
    }
    const backupBytes = new TextEncoder().encode(remaining.join("\n"));
    if (backupBytes.length <= TG_MAX_FILE) {
      await tgSendDocument(chatId, `leads-backup-${ts}.txt`, backupBytes, `Backup: ${remaining.length.toLocaleString("de-AT")} verbleibende Leads`);
    } else {
      const perPart = Math.max(1, Math.floor(remaining.length * (TG_MAX_FILE / backupBytes.length)));
      const parts = Math.ceil(remaining.length / perPart);
      for (let i = 0; i < parts; i++) {
        const slice = remaining.slice(i * perPart, (i + 1) * perPart);
        const bytes = new TextEncoder().encode(slice.join("\n"));
        await tgSendDocument(
          chatId,
          `leads-backup-${ts}-teil${i + 1}von${parts}.txt`,
          bytes,
          `Backup Teil ${i + 1}/${parts}`,
        );
      }
    }

    // 3b) Upload aggregated ZIP + backup to Storage and log history
    try {
      const historyId = crypto.randomUUID();
      const zipPath = `${historyId}/leads-${ts}.zip`;
      const backupPath = `${historyId}/leads-backup-${ts}.txt`;
      const up1 = await client.storage.from("leads-exports").upload(zipPath, aggZipBytes, {
        contentType: "application/zip",
        upsert: false,
      });
      if (up1.error) throw up1.error;
      const up2 = await client.storage.from("leads-exports").upload(backupPath, backupBytes, {
        contentType: "text/plain",
        upsert: false,
      });
      if (up2.error) throw up2.error;
      await client.from("leads_extraction_history").insert({
        id: historyId,
        extracted_count: extractedPhones.length,
        chunk_size: chunkSize,
        backup_count: remaining.length,
        zip_path: zipPath,
        backup_path: backupPath,
        source: "telegram",
        telegram_chat_id: chatId,
      });
    } catch (histErr) {
      console.error("history log failed", histErr);
    }


    // 4) Delete extracted leads (chunked)
    for (let i = 0; i < extractedIds.length; i += DEL_BATCH) {
      const idsChunk = extractedIds.slice(i, i + DEL_BATCH);
      const { error } = await client.from("leads").delete().in("id", idsChunk);
      if (error) throw error;
    }

    const newCount = await getLeadCount();
    await setState(chatId, "idle");
    await sendMessage(
      chatId,
      `✅ Fertig!\n\n📤 ${extractedPhones.length.toLocaleString("de-AT")} Leads extrahiert\n💾 ${remaining.length.toLocaleString("de-AT")} als Backup gesichert\n📦 Neuer Bestand: ${newCount.toLocaleString("de-AT")}`,
      extractButton(),
    );
  } catch (err) {
    console.error("extraction failed", err);
    await setState(chatId, "idle");
    await sendMessage(chatId, `❌ Fehler: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---- Webhook & control endpoints -------------------------------------------

async function handleUpdate(update: any) {
  // Callback query (inline button)
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = String(cq.message?.chat?.id ?? cq.from?.id);
    await tg("answerCallbackQuery", { callback_query_id: cq.id });
    if (!(await isAuthorized(chatId))) {
      await sendMessage(chatId, `🚫 Nicht autorisiert.\n\nDeine Chat-ID: ${chatId}\n\nBitte im Admin freischalten.`);
      return;
    }
    if (cq.data === "extract") await handleExtractCallback(chatId);
    return;
  }

  const msg = update.message ?? update.edited_message;
  if (!msg?.chat?.id) return;
  const chatId = String(msg.chat.id);
  const text = (msg.text ?? "").trim();

  // /start always works to surface chat id
  if (text === "/start") {
    if (!(await isAuthorized(chatId))) {
      await sendMessage(chatId, `🚫 Nicht autorisiert.\n\nDeine Chat-ID: ${chatId}\n\nBitte im Admin-Panel unter /admin/leads freischalten.`);
      return;
    }
    await handleStart(chatId);
    return;
  }

  if (!(await isAuthorized(chatId))) {
    await sendMessage(chatId, `🚫 Nicht autorisiert.\n\nDeine Chat-ID: ${chatId}`);
    return;
  }

  const { state } = await getState(chatId);
  if (state === "awaiting_amount") return handleAmountInput(chatId, text);
  if (state === "awaiting_chunk") return handleChunkInput(chatId, text);

  await sendMessage(chatId, "ℹ️ Sende /start um zu beginnen.", extractButton());
}

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  if (!BOT_TOKEN) {
    return new Response(JSON.stringify({ error: "TELEGRAM_LEADS_BOT_TOKEN not set" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    // Control actions from admin UI
    if (body?.action === "get_me") {
      const data = await tg("getMe", {});
      return new Response(JSON.stringify(data), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (body?.action === "set_webhook") {
      const webhookUrl = `${SUPABASE_URL}/functions/v1/leads-telegram-bot`;
      const data = await tg("setWebhook", {
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
      });
      return new Response(JSON.stringify({ webhook_url: webhookUrl, ...data }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    if (body?.action === "get_webhook_info") {
      const data = await tg("getWebhookInfo", {});
      return new Response(JSON.stringify(data), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Telegram webhook update
    if (body?.update_id !== undefined) {
      // Fire-and-forget to answer Telegram fast (avoids 10s timeout on long extractions)
      (async () => {
        try {
          await handleUpdate(body);
        } catch (e) {
          console.error("handleUpdate error", e);
        }
      })();
      return new Response("ok", { headers: cors });
    }

    return new Response(JSON.stringify({ ok: true, note: "no-op", path: url.pathname }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
