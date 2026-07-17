import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bell, Copy, Trash2, Webhook, ShieldCheck } from "lucide-react";

interface Reminder {
  id: string;
  chat_id: string;
  title: string;
  remind_at: string;
  notified: boolean;
  created_at: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("de-AT", {
    timeZone: "Europe/Vienna",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Content() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [newChatId, setNewChatId] = useState("");
  const [newLabel, setNewLabel] = useState("");


  const projectRef = "aanollewetntdojenubs";
  const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/reminders-telegram-bot`;

  const { data: active = [] } = useQuery({
    queryKey: ["reminders-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("notified", false)
        .order("remind_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Reminder[];
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["reminders-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("notified", true)
        .order("remind_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as Reminder[];
    },
  });

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast({ title: "Kopiert" });
  }

  async function registerWebhook() {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("reminders-set-webhook", { body: {} });
      if (error) throw error;
      if (data?.ok) {
        toast({ title: "Webhook registriert", description: data?.telegram?.description || "OK" });
      } else {
        toast({ title: "Fehler", description: JSON.stringify(data), variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Fehler", description: e?.message || String(e), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function del(id: string) {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      qc.invalidateQueries({ queryKey: ["reminders-active"] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="h-6 w-6 text-slate-400" /> Erinnerungen
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Termin-Erinnerungen per Telegram-Bot (Benachrichtigung 5 Min. vor dem Termin, Zeitzone Europe/Vienna).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Webhook className="h-4 w-4" /> Bot-Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Webhook-URL</div>
            <div className="flex gap-2">
              <code className="flex-1 rounded border bg-slate-50 px-3 py-2 text-xs font-mono break-all">{webhookUrl}</code>
              <Button variant="outline" size="sm" onClick={() => copy(webhookUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={registerWebhook} disabled={busy}>
              {busy ? "Registriere…" : "Webhook bei Telegram registrieren"}
            </Button>
            <span className="text-xs text-slate-500">
              Token wird sicher aus dem Secret <code>TELEGRAM_REMINDERS_BOT_TOKEN</code> gelesen.
            </span>
          </div>
          <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
            <p><strong>Verwendung im Telegram Chat:</strong></p>
            <p><code>/start</code> – Hilfe anzeigen</p>
            <p><code>/erinnerung 21:30 Stefan Müller</code> – heute (oder morgen falls Zeit vorbei)</p>
            <p><code>/erinnerung 20.07.2026 21:30 Stefan Müller</code> – spezifisches Datum</p>
            <p><code>/erinnerungen</code> – Liste aller offenen Erinnerungen</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aktive Erinnerungen ({active.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Termin</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Chat ID</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{fmt(r.remind_at)}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{r.chat_id}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => del(r.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {active.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-400 py-8">Keine offenen Erinnerungen</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historie</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Termin</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Chat ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{fmt(r.remind_at)}</TableCell>
                  <TableCell className="text-slate-500">{r.title}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{r.chat_id}</TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-slate-400 py-8">Noch keine Historie</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminErinnerungen() {
  return <AdminLayout><Content /></AdminLayout>;
}
