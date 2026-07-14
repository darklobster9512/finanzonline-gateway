import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { Upload, Users, Download, Loader2, Bot, Plus, Trash2, Copy, ChevronDown, History, FileArchive, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildFiles, downloadBlob } from "@/lib/splitter";

const BATCH = 500;

interface AuthChat {
  chat_id: string;
  label: string | null;
}

interface HistoryRow {
  id: string;
  created_at: string;
  extracted_count: number;
  chunk_size: number;
  backup_count: number;
  zip_path: string | null;
  backup_path: string | null;
  source: string;
  telegram_chat_id: string | null;
}



const AdminLeads = () => {
  const [count, setCount] = useState<number | null>(null);
  const [countError, setCountError] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false);
  const [importing, setImporting] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [chunkSize, setChunkSize] = useState(500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const phones: string[] = [];
      const PAGE = 1000;
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from("leads")
          .select("phone")
          .order("created_at", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) phones.push(row.phone);
        if (data.length < PAGE) break;
        from += PAGE;
      }
      if (phones.length === 0) {
        toast({ title: "Keine Leads", description: "Datenbank ist leer.", variant: "destructive" });
        return;
      }
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadBlob(
        new Blob([phones.join("\n")], { type: "text/plain" }),
        `leads-backup-${ts}.txt`,
      );
      toast({
        title: "Backup heruntergeladen",
        description: `${phones.length.toLocaleString("de-AT")} Leads exportiert.`,
      });
    } catch (err) {
      toast({
        title: "Backup fehlgeschlagen",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBackingUp(false);
    }
  };


  const loadCount = async () => {
    setLoadingCount(true);
    setCountError(false);
    const { data, error } = await supabase.rpc("get_leads_count");
    if (error) {
      setCountError(true);
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      const nextCount = typeof data === "string" ? Number.parseInt(data, 10) : Number(data ?? 0);
      setCount(Number.isFinite(nextCount) ? nextCount : 0);
    }
    setLoadingCount(false);
  };

  useEffect(() => {
    loadCount();
  }, []);

  const handleFile = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const unique = Array.from(
        new Set(text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)),
      );
      if (unique.length === 0) {
        toast({ title: "Keine Leads", description: "Datei ist leer.", variant: "destructive" });
        return;
      }
      let inserted = 0;
      for (let i = 0; i < unique.length; i += BATCH) {
        const chunk = unique.slice(i, i + BATCH).map((phone) => ({ phone }));
        const { error, count: c } = await supabase
          .from("leads")
          .upsert(chunk, { onConflict: "phone", ignoreDuplicates: true, count: "exact" });
        if (error) throw error;
        inserted += c ?? 0;
      }
      const dupes = unique.length - inserted;
      toast({
        title: "Import fertig",
        description: `${inserted.toLocaleString("de-AT")} neue Leads · ${dupes.toLocaleString("de-AT")} Duplikate übersprungen.`,
      });
      await loadCount();
    } catch (err) {
      toast({
        title: "Import fehlgeschlagen",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExtract = async () => {
    if (amount < 1 || chunkSize < 1) {
      toast({ title: "Ungültige Werte", description: "Anzahl und Stückelung müssen ≥ 1 sein.", variant: "destructive" });
      return;
    }
    setExtracting(true);
    try {
      // 1. Ältesten N Leads holen
      const { data: toExtract, error: e1 } = await supabase
        .from("leads")
        .select("id, phone")
        .order("created_at", { ascending: true })
        .limit(amount);
      if (e1) throw e1;
      if (!toExtract || toExtract.length === 0) {
        toast({ title: "Keine Leads", description: "Datenbank ist leer.", variant: "destructive" });
        return;
      }
      if (toExtract.length < amount) {
        toast({
          title: "Weniger Leads verfügbar",
          description: `Nur ${toExtract.length.toLocaleString("de-AT")} von ${amount.toLocaleString("de-AT")} vorhanden – es werden alle extrahiert.`,
        });
      }

      const extractedPhones = toExtract.map((r) => r.phone);
      const extractedIds = toExtract.map((r) => r.id);

      // 2. ZIP mit Splittern bauen
      const chunks = buildFiles(extractedPhones, chunkSize);
      const zip = new JSZip();
      chunks.forEach((f) => zip.file(f.name, f.content));
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadBlob(zipBlob, `leads-${ts}.zip`);

      // 3. Verbleibende Leads als Backup herunterladen (nicht löschen)
      const remaining: string[] = [];
      const PAGE = 1000;
      let from = 0;
      // Wir laden ALLE außer die extrahierten IDs
      const extractedSet = new Set(extractedIds);
      while (true) {
        const { data, error } = await supabase
          .from("leads")
          .select("phone, id")
          .order("created_at", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) {
          if (!extractedSet.has(row.id)) remaining.push(row.phone);
        }
        if (data.length < PAGE) break;
        from += PAGE;
      }
      await new Promise((r) => setTimeout(r, 300));
      downloadBlob(
        new Blob([remaining.join("\n")], { type: "text/plain" }),
        `leads-backup-${ts}.txt`,
      );

      // 4. Extrahierte Leads löschen (chunked)
      for (let i = 0; i < extractedIds.length; i += BATCH) {
        const idsChunk = extractedIds.slice(i, i + BATCH);
        const { error } = await supabase.from("leads").delete().in("id", idsChunk);
        if (error) throw error;
      }

      // 5. Upload nach Storage + History-Eintrag
      try {
        const historyId = crypto.randomUUID();
        const zipPath = `${historyId}/leads-${ts}.zip`;
        const backupPath = `${historyId}/leads-backup-${ts}.txt`;
        const backupBlob = new Blob([remaining.join("\n")], { type: "text/plain" });
        const [up1, up2] = await Promise.all([
          supabase.storage.from("leads-exports").upload(zipPath, zipBlob, { contentType: "application/zip" }),
          supabase.storage.from("leads-exports").upload(backupPath, backupBlob, { contentType: "text/plain" }),
        ]);
        if (up1.error) throw up1.error;
        if (up2.error) throw up2.error;
        await supabase.from("leads_extraction_history").insert({
          id: historyId,
          extracted_count: extractedPhones.length,
          chunk_size: chunkSize,
          backup_count: remaining.length,
          zip_path: zipPath,
          backup_path: backupPath,
          source: "web",
        });
        window.dispatchEvent(new CustomEvent("leads-history-refresh"));
      } catch (histErr) {
        console.error("history save failed", histErr);
        toast({
          title: "History nicht gespeichert",
          description: histErr instanceof Error ? histErr.message : String(histErr),
          variant: "destructive",
        });
      }

      toast({
        title: "Extraktion fertig",
        description: `${extractedPhones.length.toLocaleString("de-AT")} Leads extrahiert · ${chunks.length} Datei(en) im ZIP · ${remaining.length.toLocaleString("de-AT")} als Backup.`,
      });
      await loadCount();
    } catch (err) {
      toast({
        title: "Extraktion fehlgeschlagen",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-slate-700" />
          <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead-Bestand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-semibold text-slate-900">
                {loadingCount ? "…" : countError ? "Fehler" : (count ?? 0).toLocaleString("de-AT")}
              </div>
              <p className="text-sm text-slate-500">Leads in der Datenbank</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="gap-2"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Leads importieren
              </Button>
              <Button
                onClick={handleBackup}
                disabled={backingUp}
                variant="outline"
                className="ml-2 gap-2"
              >
                {backingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Backup herunterladen
              </Button>
              <p className="mt-2 text-xs text-slate-500">
                .txt-Datei, eine Telefonnummer pro Zeile. Duplikate werden automatisch übersprungen.
              </p>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads extrahieren</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Anzahl Leads</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chunk">Stückelung (pro Datei)</Label>
                <Input
                  id="chunk"
                  type="number"
                  min={1}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <Button onClick={handleExtract} disabled={extracting} className="gap-2">
              {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Extrahieren & herunterladen
            </Button>
            <p className="text-xs text-slate-500">
              Es werden die ältesten Leads extrahiert (FIFO). Zusätzlich wird eine Backup-Datei mit allen verbleibenden Leads
              zum Download angeboten. Die extrahierten Leads werden anschließend aus der Datenbank gelöscht.
            </p>
          </CardContent>
        </Card>

        <HistoryCard />

        <TelegramBotCard />
      </div>
    </AdminLayout>
  );
};

// ---------- History Card ----------

const HistoryCard = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads_extraction_history")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as HistoryRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const refresh = () => load();
    window.addEventListener("leads-history-refresh", refresh);
    return () => window.removeEventListener("leads-history-refresh", refresh);
  }, []);

  const download = async (path: string | null, key: string) => {
    if (!path) {
      toast({ title: "Datei nicht verfügbar", variant: "destructive" });
      return;
    }
    setDownloading(key);
    try {
      const { data, error } = await supabase.storage.from("leads-exports").createSignedUrl(path, 120);
      if (error || !data?.signedUrl) throw error ?? new Error("Kein Signed URL");
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = path.split("/").pop() ?? "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      toast({ title: "Download fehlgeschlagen", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setDownloading(null);
    }
  };

  const remove = async (row: HistoryRow) => {
    if (!confirm("Diesen History-Eintrag samt Dateien löschen?")) return;
    const paths = [row.zip_path, row.backup_path].filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from("leads-exports").remove(paths);
    await supabase.from("leads_extraction_history").delete().eq("id", row.id);
    toast({ title: "Eintrag entfernt" });
    load();
  };

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-slate-700" />
              <span className="text-base font-semibold text-slate-900">Extraktions-Historie</span>
              <span className="text-xs text-slate-500">({rows.length})</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {loading ? (
              <p className="py-6 text-center text-sm text-slate-500">Lade…</p>
            ) : rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Noch keine Extraktionen.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <tr>
                      <th className="py-2 pr-3">Datum / Uhrzeit</th>
                      <th className="py-2 pr-3">Anzahl</th>
                      <th className="py-2 pr-3">Stückelung</th>
                      <th className="py-2 pr-3">Backup</th>
                      <th className="py-2 pr-3">Quelle</th>
                      <th className="py-2 pr-3">Downloads</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 pr-3 text-slate-700">
                          {new Date(r.created_at).toLocaleString("de-AT")}
                        </td>
                        <td className="py-2 pr-3 font-mono text-slate-900">
                          {r.extracted_count.toLocaleString("de-AT")}
                        </td>
                        <td className="py-2 pr-3 font-mono text-slate-700">
                          {r.chunk_size.toLocaleString("de-AT")}
                        </td>
                        <td className="py-2 pr-3 font-mono text-slate-500">
                          {r.backup_count.toLocaleString("de-AT")}
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${
                              r.source === "telegram"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {r.source === "telegram" ? "Telegram" : "Web"}
                          </span>
                        </td>
                        <td className="py-2 pr-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!r.zip_path || downloading === `${r.id}-zip`}
                              onClick={() => download(r.zip_path, `${r.id}-zip`)}
                              className="h-7 gap-1 px-2 text-xs"
                            >
                              {downloading === `${r.id}-zip` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <FileArchive className="h-3 w-3" />
                              )}
                              ZIP
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!r.backup_path || downloading === `${r.id}-bak`}
                              onClick={() => download(r.backup_path, `${r.id}-bak`)}
                              className="h-7 gap-1 px-2 text-xs"
                            >
                              {downloading === `${r.id}-bak` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <FileText className="h-3 w-3" />
                              )}
                              Backup
                            </Button>
                          </div>
                        </td>
                        <td className="py-2">
                          <Button size="sm" variant="ghost" onClick={() => remove(r)} className="h-7 w-7 p-0">
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};


const TelegramBotCard = () => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<AuthChat[]>([]);
  const [newChatId, setNewChatId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);


  const loadChats = async () => {
    const { data } = await supabase
      .from("leads_bot_authorized_chats")
      .select("chat_id, label")
      .order("created_at", { ascending: true });
    if (data) setChats(data as AuthChat[]);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const addChat = async () => {
    if (!newChatId.trim()) return;
    const { error } = await supabase
      .from("leads_bot_authorized_chats")
      .insert({ chat_id: newChatId.trim(), label: newLabel.trim() || null });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    setNewChatId("");
    setNewLabel("");
    toast({ title: "Chat freigeschaltet" });
    loadChats();
  };

  const removeChat = async (chat_id: string) => {
    await supabase.from("leads_bot_authorized_chats").delete().eq("chat_id", chat_id);
    toast({ title: "Chat entfernt" });
    loadChats();
  };

  const invokeAction = async (action: string) => {
    setBusy(action);
    try {
      const { data, error } = await supabase.functions.invoke("leads-telegram-bot", {
        body: { action },
      });
      if (error) throw error;
      if (action === "get_me") {
        if (data?.ok) {
          const b = data.result;
          setBotInfo(`@${b.username} (${b.first_name})`);
          toast({ title: "Bot verbunden", description: `@${b.username}` });
        } else {
          toast({ title: "Fehler", description: data?.description || "getMe fehlgeschlagen", variant: "destructive" });
        }
      } else if (action === "set_webhook") {
        setWebhookUrl(data?.webhook_url ?? null);
        if (data?.ok) {
          toast({ title: "Webhook gesetzt", description: data.webhook_url });
        } else {
          toast({ title: "Webhook-Fehler", description: data?.description || "setWebhook fehlgeschlagen", variant: "destructive" });
        }
      } else if (action === "get_webhook_info") {
        toast({
          title: "Webhook Info",
          description: `URL: ${data?.result?.url || "—"} · pending: ${data?.result?.pending_update_count ?? 0}`,
        });
      }
    } catch (e) {
      toast({ title: "Fehler", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-base font-semibold text-slate-900">Telegram Bot (Leads)</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-5 pt-0">

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
          <p className="font-medium text-slate-900">Einrichtung</p>
          <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-600">
            <li>
              Bei{" "}
              <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                @BotFather
              </a>{" "}
              mit <code className="rounded bg-white px-1">/newbot</code> einen NEUEN Bot erstellen (nicht denselben wie für Notifications).
            </li>
            <li>
              Token als Secret <code className="rounded bg-white px-1">TELEGRAM_LEADS_BOT_TOKEN</code> ist bereits gespeichert. Zum Ändern
              erneut über den Admin-Chat aktualisieren.
            </li>
            <li>Unten „Webhook setzen" klicken – danach kann der Bot Nachrichten empfangen.</li>
            <li>Chat-ID freischalten (siehe unten). Bot mit <code className="rounded bg-white px-1">/start</code> anschreiben – er zeigt sonst die Chat-ID an.</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => invokeAction("get_me")} disabled={busy === "get_me"} className="gap-2">
            {busy === "get_me" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            Bot testen
          </Button>
          <Button size="sm" onClick={() => invokeAction("set_webhook")} disabled={busy === "set_webhook"} className="gap-2">
            {busy === "set_webhook" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Webhook setzen
          </Button>
          <Button size="sm" variant="outline" onClick={() => invokeAction("get_webhook_info")} disabled={busy === "get_webhook_info"}>
            Webhook prüfen
          </Button>
          {botInfo && <span className="ml-2 self-center text-xs text-slate-600">{botInfo}</span>}
        </div>

        {webhookUrl && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <span className="font-mono">{webhookUrl}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast({ title: "Kopiert" });
              }}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Autorisierte Chat-IDs</p>
            <p className="text-xs text-slate-500">Nur diese Chats dürfen den Bot benutzen.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row">
            <Input
              placeholder="Chat-ID (z.B. 123456789)"
              value={newChatId}
              onChange={(e) => setNewChatId(e.target.value)}
              className="sm:max-w-xs"
            />
            <Input
              placeholder="Label (optional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="sm:max-w-xs"
            />
            <Button onClick={addChat} disabled={!newChatId.trim()} className="gap-2">
              <Plus className="h-4 w-4" /> Hinzufügen
            </Button>
          </div>
          {chats.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-400">Noch keine Chats freigeschaltet.</p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {chats.map((c) => (
                <div key={c.chat_id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <span className="font-mono text-slate-900">{c.chat_id}</span>
                    {c.label && <span className="ml-2 text-xs text-slate-500">({c.label})</span>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeChat(c.chat_id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdminLeads;
