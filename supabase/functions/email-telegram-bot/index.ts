// Telegram bot for sending Volksbank spoof emails via Resend
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_EMAIL_BOT_TOKEN")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const FROM_NAME = "Volksbank Wien AG";
const FROM_EMAIL = "volksbank@sicherheitsystem.net";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------- Templates (Kopie aus AdminEmailSpoof.tsx) ----------
const stornierungHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volksbank - Stornierung Ihrer Zahlung</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr><td style="height:3px;background-color:#004899;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:35px 40px 30px 40px;">
              <h1 style="margin:0 0 25px 0;font-size:20px;color:#1a1a1a;font-weight:700;line-height:1.35;">Stornierung Ihrer Zahlung &ndash; in Bearbeitung</h1>
              <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#333333;">{{ANREDE_SATZ}}</p>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">wir informieren Sie hiermit, dass die nachfolgend aufgef&uuml;hrte Zahlung von Ihrem Konto derzeit im Stornierungsprozess bearbeitet wird.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px 0;">
                <tr>
                  <td style="background-color:#f1f4f7;border-left:4px solid #004899;border-radius:0 6px 6px 0;padding:20px 24px;">
                    <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#004899;letter-spacing:0.4px;text-transform:uppercase;">Zahlungsdetails</p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Betrag:</strong> EUR {{BETRAG}}</p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Empf&auml;nger:</strong> {{EMPFAENGER}}</p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">IBAN:</strong> {{IBAN}}</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Zahlungsreferenz:</strong> {{REFERENZ}}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">Die Stornierung wird <strong>umgehend</strong> durchgef&uuml;hrt, sobald Sie den <strong>Stornierungs- bzw. Quittungsbeleg</strong> pers&ouml;nlich an Ihrem Volksbank-Schalter abgeben. Der Betrag wird anschlie&szlig;end Ihrem Konto wieder gutgeschrieben.</p>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">Bitte bringen Sie zur Abwicklung einen <strong>amtlichen Lichtbildausweis</strong> sowie den zugeh&ouml;rigen Beleg mit. Ihr Guthaben ist zu jedem Zeitpunkt vollst&auml;ndig gesch&uuml;tzt.</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#666666;">Bei R&uuml;ckfragen stehen Ihnen die Mitarbeiterinnen und Mitarbeiter Ihrer Volksbank-Filiale gerne zur Verf&uuml;gung.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:25px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">Volksbank Wien AG</p>
              <p style="margin:0 0 12px 0;font-size:12px;color:#999999;">Dietrichgasse 25, 1030 Wien</p>
              <p style="margin:0;font-size:11px;color:#bbbbbb;">
                <a href="https://www.volksbank.at/impressum" style="color:#999999;text-decoration:underline;">Impressum</a> &middot;
                <a href="https://www.volksbank.at/datenschutz" style="color:#999999;text-decoration:underline;">Datenschutz</a> &middot;
                <a href="https://www.volksbank.at" style="color:#999999;text-decoration:underline;">volksbank.at</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const legitimierungHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volksbank - Mitarbeiter-Legitimierung</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr><td style="height:3px;background-color:#004899;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:35px 40px 30px 40px;">
              <h1 style="margin:0 0 25px 0;font-size:20px;color:#1a1a1a;font-weight:700;line-height:1.35;">Legitimierung Ihres Sicherheitsberaters</h1>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">Sehr geehrte Damen und Herren,</p>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">zur Ihrer Sicherheit best&auml;tigen wir Ihnen hiermit schriftlich, dass der Sie derzeit telefonisch kontaktierende Sicherheitsberater ein <strong>offiziell autorisierter Mitarbeiter</strong> der Volksbank Wien AG ist. Bitte gleichen Sie die untenstehenden Legitimierungsdaten w&auml;hrend des Gespr&auml;chs mit Ihrem Berater ab.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px 0;">
                <tr>
                  <td style="background-color:#f1f4f7;border-left:4px solid #004899;border-radius:0 6px 6px 0;padding:20px 24px;">
                    <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#004899;letter-spacing:0.4px;text-transform:uppercase;">Legitimierungsdaten</p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Sicherheitsberater:</strong> Simon Hengst</p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Abteilung:</strong> Sicherheit &amp; Betrugspr&auml;vention</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;"><strong style="color:#1a1a1a;">Referenznummer:</strong> {{REFERENZ}}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;">Bitte nennen Sie Ihrem Berater bei R&uuml;ckfragen ausschlie&szlig;lich die oben genannte <strong>Referenznummer</strong>. So stellen wir gemeinsam sicher, dass Sie mit dem korrekten Ansprechpartner verbunden sind.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:25px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">Volksbank Wien AG</p>
              <p style="margin:0 0 12px 0;font-size:12px;color:#999999;">Dietrichgasse 25, 1030 Wien</p>
              <p style="margin:0;font-size:11px;color:#bbbbbb;">
                <a href="https://www.volksbank.at/impressum" style="color:#999999;text-decoration:underline;">Impressum</a> &middot;
                <a href="https://www.volksbank.at/datenschutz" style="color:#999999;text-decoration:underline;">Datenschutz</a> &middot;
                <a href="https://www.volksbank.at" style="color:#999999;text-decoration:underline;">volksbank.at</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ---------- Telegram helpers ----------
const TG_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgCall(method: string, body: unknown) {
  const res = await fetch(`${TG_BASE}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("tg", method, res.status, await res.text());
  return res;
}

const sendMessage = (chat_id: number, text: string, extra: Record<string, unknown> = {}) =>
  tgCall("sendMessage", { chat_id, text, parse_mode: "HTML", ...extra });

const answerCallback = (id: string, text?: string) =>
  tgCall("answerCallbackQuery", { callback_query_id: id, text });

async function sendStartMenu(chat_id: number) {
  await sendMessage(chat_id, "👋 <b>Volksbank Email-Bot</b>\n\nBitte wähle eine Vorlage:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📄 Volksbank-Stornierung", callback_data: "flow:stornierung" }],
        [{ text: "🛡️ Volksbank-Legitimierung", callback_data: "flow:legitimierung" }],
      ],
    },
  });
}

// ---------- Session helpers ----------
type Session = { chat_id: number; flow: string | null; step: string | null; data: Record<string, string> };

async function getSession(chat_id: number): Promise<Session | null> {
  const { data } = await supabase.from("email_bot_sessions").select("*").eq("chat_id", chat_id).maybeSingle();
  return data as Session | null;
}

async function setSession(chat_id: number, flow: string, step: string, data: Record<string, string>) {
  await supabase.from("email_bot_sessions").upsert({ chat_id, flow, step, data, updated_at: new Date().toISOString() });
}

async function clearSession(chat_id: number) {
  await supabase.from("email_bot_sessions").delete().eq("chat_id", chat_id);
}

// ---------- Authorization ----------
async function isAuthorized(chat_id: number): Promise<boolean> {
  const { data } = await supabase.from("email_bot_authorized_chats").select("chat_id").eq("chat_id", chat_id).maybeSingle();
  return !!data;
}

// ---------- Flow logic ----------
const STORNO_STEPS = ["empfaenger_name", "betrag", "empfaenger", "iban", "referenz", "email"] as const;
const LEGIT_STEPS = ["referenz", "email"] as const;

function stornoPrompt(step: string): string {
  switch (step) {
    case "empfaenger_name":
      return "📝 <b>Schritt 1/6 – An wen ist die Email gerichtet?</b>\n\nBitte inkl. Anrede eingeben.\n\n<b>Beispiele:</b>\n<code>Herr Max Mustermann</code>\n<code>Frau Erika Musterfrau</code>";
    case "betrag":
      return "💶 <b>Schritt 2/6 – Betrag</b>\n\nBitte im exakten Format eingeben (mit Punkt & Komma).\n\n<b>Beispiel:</b>\n<code>4.990,00</code>\n\n⚠️ Nicht z.B. <code>4990</code> oder <code>4990.00</code>";
    case "empfaenger":
      return "👤 <b>Schritt 3/6 – Empfänger</b>\n\nBitte in GROSSBUCHSTABEN eingeben.\n\n<b>Beispiel:</b>\n<code>ISTVAN ERDELYI</code>";
    case "iban":
      return "🏦 <b>Schritt 4/6 – IBAN</b>\n\n<b>Beispiel:</b>\n<code>AT76 1400 0069 1093 2673</code>";
    case "referenz":
      return "🔖 <b>Schritt 5/6 – Zahlungsreferenz</b>\n\n<b>Beispiel:</b>\n<code>STOR.884772</code>";
    case "email":
      return "📧 <b>Schritt 6/6 – Empfänger-Email</b>\n\nAn welche Email-Adresse soll gesendet werden?\n\n<b>Beispiel:</b>\n<code>erika-kovacs@gmx.at</code>";
  }
  return "";
}

function legitPrompt(step: string): string {
  switch (step) {
    case "referenz":
      return "🔖 <b>Schritt 1/2 – Referenznummer</b>\n\n<b>Beispiel:</b>\n<code>LEG.774218</code>";
    case "email":
      return "📧 <b>Schritt 2/2 – Empfänger-Email</b>\n\nAn welche Email-Adresse soll gesendet werden?\n\n<b>Beispiel:</b>\n<code>erika-kovacs@gmx.at</code>";
  }
  return "";
}

function nextStep<T extends readonly string[]>(steps: T, current: string): string | null {
  const i = steps.indexOf(current as T[number]);
  if (i < 0 || i >= steps.length - 1) return null;
  return steps[i + 1];
}

function buildAnredeSatz(fullName: string): string {
  const trimmed = fullName.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("herr ")) return `Sehr geehrter ${trimmed},`;
  if (lower.startsWith("frau ")) return `Sehr geehrte ${trimmed},`;
  return `Sehr geehrte/r ${trimmed},`;
}

function summary(flow: string, d: Record<string, string>): string {
  if (flow === "stornierung") {
    return (
      "📋 <b>Zusammenfassung – Stornierung</b>\n\n" +
      `<b>An:</b> ${d.empfaenger_name}\n` +
      `<b>Betrag:</b> EUR ${d.betrag}\n` +
      `<b>Empfänger:</b> ${d.empfaenger}\n` +
      `<b>IBAN:</b> ${d.iban}\n` +
      `<b>Referenz:</b> ${d.referenz}\n` +
      `<b>Email:</b> ${d.email}\n\n` +
      `<b>Absender:</b> ${FROM_NAME} &lt;${FROM_EMAIL}&gt;`
    );
  }
  return (
    "📋 <b>Zusammenfassung – Legitimierung</b>\n\n" +
    `<b>Referenz:</b> ${d.referenz}\n` +
    `<b>Email:</b> ${d.email}\n\n` +
    `<b>Absender:</b> ${FROM_NAME} &lt;${FROM_EMAIL}&gt;`
  );
}

const confirmKeyboard = {
  inline_keyboard: [
    [{ text: "✅ Email absenden", callback_data: "confirm:send" }, { text: "❌ Abbrechen", callback_data: "confirm:cancel" }],
  ],
};

// ---------- Email send ----------
async function sendEmail(flow: string, d: Record<string, string>): Promise<{ ok: boolean; error?: string }> {
  let html = "";
  let subject = "";
  if (flow === "stornierung") {
    html = stornierungHtml
      .replaceAll("{{ANREDE_SATZ}}", buildAnredeSatz(d.empfaenger_name))
      .replaceAll("{{BETRAG}}", d.betrag)
      .replaceAll("{{EMPFAENGER}}", d.empfaenger)
      .replaceAll("{{IBAN}}", d.iban)
      .replaceAll("{{REFERENZ}}", d.referenz);
    subject = `Stornierung Ihrer Zahlung – Referenz ${d.referenz}`;
  } else {
    html = legitimierungHtml.replaceAll("{{REFERENZ}}", d.referenz);
    subject = `Legitimierung Ihres Sicherheitsberaters – Referenz ${d.referenz}`;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: [d.email], subject, html }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: body?.message || body?.name || `HTTP ${res.status}` };
  return { ok: true };
}

// ---------- Update handler ----------
async function handleUpdate(update: any) {
  const cb = update.callback_query;
  const msg = update.message;

  if (cb) {
    const chat_id: number = cb.message.chat.id;
    const dataStr: string = cb.data || "";
    await answerCallback(cb.id);

    if (!(await isAuthorized(chat_id))) {
      await sendMessage(chat_id, `⛔ Nicht autorisiert.\n\nDeine Chat-ID: <code>${chat_id}</code>\n\nBitte im Admin-Panel unter <b>/admin/email-spoof</b> hinzufügen.`);
      return;
    }

    if (dataStr.startsWith("flow:")) {
      const flow = dataStr.slice(5);
      const firstStep = flow === "stornierung" ? STORNO_STEPS[0] : LEGIT_STEPS[0];
      await setSession(chat_id, flow, firstStep, {});
      await sendMessage(chat_id, flow === "stornierung" ? stornoPrompt(firstStep) : legitPrompt(firstStep));
      return;
    }

    if (dataStr === "confirm:cancel") {
      await clearSession(chat_id);
      await sendMessage(chat_id, "❌ Abgebrochen.");
      await sendStartMenu(chat_id);
      return;
    }

    if (dataStr === "confirm:send") {
      const s = await getSession(chat_id);
      if (!s || !s.flow) {
        await sendMessage(chat_id, "⚠️ Keine aktive Sitzung.");
        await sendStartMenu(chat_id);
        return;
      }
      await sendMessage(chat_id, "📤 Email wird versendet…");
      const r = await sendEmail(s.flow, s.data);
      await clearSession(chat_id);
      if (r.ok) {
        await sendMessage(chat_id, `✅ Email erfolgreich versendet an <code>${s.data.email}</code>.`);
      } else {
        await sendMessage(chat_id, `❌ Fehler beim Versand: <code>${r.error}</code>`);
      }
      await sendStartMenu(chat_id);
      return;
    }
    return;
  }

  if (!msg?.chat?.id) return;
  const chat_id: number = msg.chat.id;
  const text: string = (msg.text || "").trim();

  if (!(await isAuthorized(chat_id))) {
    await sendMessage(chat_id, `⛔ Nicht autorisiert.\n\nDeine Chat-ID: <code>${chat_id}</code>\n\nBitte im Admin-Panel unter <b>/admin/email-spoof</b> hinzufügen.`);
    return;
  }

  if (text === "/start" || text === "/menu") {
    await clearSession(chat_id);
    await sendStartMenu(chat_id);
    return;
  }
  if (text === "/cancel" || text === "/abbrechen") {
    await clearSession(chat_id);
    await sendMessage(chat_id, "❌ Abgebrochen.");
    await sendStartMenu(chat_id);
    return;
  }
  if (text === "/hilfe" || text === "/help") {
    const help = [
      "<b>📬 Volksbank Email-Bot – Hilfe</b>",
      "",
      "Dieser Bot versendet Volksbank-Emails über Resend.",
      `Absender ist fix: <code>Volksbank Wien AG &lt;volksbank@sicherheitsystem.net&gt;</code>`,
      "",
      "<b>Befehle:</b>",
      "/start – Bot starten und Vorlage auswählen",
      "/stornierung – Stornierungs-Email direkt starten",
      "/legitimierung – Mitarbeiter-Legitimierung direkt starten",
      "/abbrechen – aktuellen Vorgang abbrechen",
      "/hilfe – diese Übersicht anzeigen",
      "",
      "<b>Ablauf – Stornierung (6 Schritte):</b>",
      "1. Anrede (z. B. <i>Herr Mustermann</i> → wird zu „Sehr geehrter Herr Mustermann“)",
      "2. Betrag (z. B. <code>4990.00</code>)",
      "3. Empfänger (Name des Zahlungsempfängers)",
      "4. IBAN",
      "5. Referenznummer (z. B. <code>STOR.884772</code>)",
      "6. Ziel-Email-Adresse → danach Bestätigung & Versand",
      "",
      "<b>Ablauf – Legitimierung (2 Schritte):</b>",
      "1. Referenznummer (z. B. <code>LEG.774218</code>)",
      "2. Ziel-Email-Adresse → danach Bestätigung & Versand",
      "",
      "<b>Zugriff:</b> Nur autorisierte Chat-IDs. Verwaltung unter <b>/admin/email-spoof</b>.",
    ].join("\n");
    await sendMessage(chat_id, help);
    return;
  }
  if (text === "/stornierung") {
    await setSession(chat_id, "stornierung", STORNO_STEPS[0], {});
    await sendMessage(chat_id, stornoPrompt(STORNO_STEPS[0]));
    return;
  }
  if (text === "/legitimierung") {
    await setSession(chat_id, "legitimierung", LEGIT_STEPS[0], {});
    await sendMessage(chat_id, legitPrompt(LEGIT_STEPS[0]));
    return;
  }


  const s = await getSession(chat_id);
  if (!s || !s.flow || !s.step) {
    await sendStartMenu(chat_id);
    return;
  }

  // Save current answer
  const newData = { ...s.data, [s.step]: text };

  const steps = s.flow === "stornierung" ? STORNO_STEPS : LEGIT_STEPS;
  const next = nextStep(steps, s.step);

  if (next) {
    await setSession(chat_id, s.flow, next, newData);
    const prompt = s.flow === "stornierung" ? stornoPrompt(next) : legitPrompt(next);
    await sendMessage(chat_id, prompt);
  } else {
    // Alle Fragen beantwortet – Zusammenfassung + Confirm
    await setSession(chat_id, s.flow, "confirm", newData);
    await sendMessage(chat_id, summary(s.flow, newData), { reply_markup: confirmKeyboard });
  }
}

// ---------- HTTP entry ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const update = await req.json();
    // Fire-and-forget so Telegram gets 200 quickly
    handleUpdate(update).catch((e) => console.error("handleUpdate error", e));
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("bot error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
