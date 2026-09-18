import { useState, useEffect, useRef, KeyboardEvent } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Trash2, Send, Plus, ExternalLink, MessageCircle, Bot, Pencil, Check, X, Activity, Upload } from "lucide-react";

interface ChatIdEntry {
  id: string;
  chat_id: string;
  label: string | null;
  domains: string[];
  created_at: string;
}

const normalizeDomain = (d: string) =>
  d.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").trim();

function DomainChips({
  domains,
  onRemove,
}: {
  domains: string[];
  onRemove: (d: string) => void;
}) {
  if (domains.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {domains.map((d) => (
        <span
          key={d}
          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-mono text-blue-700"
        >
          {d}
          <button
            type="button"
            onClick={() => onRemove(d)}
            className="text-blue-400 hover:text-blue-700"
            aria-label={`${d} entfernen`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

function DomainInput({
  domains,
  setDomains,
  placeholder,
}: {
  domains: string[];
  setDomains: (d: string[]) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const commit = () => {
    const parts = value
      .split(/[,\s]+/)
      .map(normalizeDomain)
      .filter((d) => d && !domains.includes(d));
    if (parts.length) setDomains([...domains, ...parts]);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !value && domains.length) {
      setDomains(domains.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <DomainChips domains={domains} onRemove={(d) => setDomains(domains.filter((x) => x !== d))} />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={placeholder}
      />
    </div>
  );
}

function TelegramContent() {
  const [chatIds, setChatIds] = useState<ChatIdEntry[]>([]);
  const [newChatId, setNewChatId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDomains, setNewDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusCheckId, setStatusCheckId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDomains, setEditingDomains] = useState<string[]>([]);
  const [editingLabel, setEditingLabel] = useState<string>("");
  const { toast } = useToast();

  // Import state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const importTargetRef = useRef<ChatIdEntry | null>(null);
  const cancelRef = useRef(false);
  const [importTarget, setImportTarget] = useState<ChatIdEntry | null>(null);
  const [importBlocks, setImportBlocks] = useState<string[]>([]);
  const [importSent, setImportSent] = useState(0);
  const [importFailed, setImportFailed] = useState(0);
  const [importRunning, setImportRunning] = useState(false);
  const [importDone, setImportDone] = useState(false);

  const openImport = (entry: ChatIdEntry) => {
    importTargetRef.current = entry;
    fileInputRef.current?.click();
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const target = importTargetRef.current;
    if (!file || !target) return;
    const text = await file.text();
    const markerRe = /(?:🔔\s*)?Neuer Log/gi;
    let blocks: string[];
    if (markerRe.test(text)) {
      const indices: number[] = [];
      const re = /(?:🔔\s*)?Neuer Log/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) indices.push(m.index);
      blocks = indices.map((start, i) => {
        const end = i + 1 < indices.length ? indices[i + 1] : text.length;
        let block = text.slice(start, end).trim();
        if (!/^🔔/.test(block)) block = "🔔 " + block.replace(/^(?:🔔\s*)?/, "");
        return block;
      }).filter(Boolean);
    } else {
      blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    }
    if (blocks.length === 0) {
      toast({ title: "Keine Logs gefunden", description: "Datei enthält keine durch Leerzeile getrennten Blöcke", variant: "destructive" });
      return;
    }
    setImportTarget(target);
    setImportBlocks(blocks);
    setImportSent(0);
    setImportFailed(0);
    setImportRunning(false);
    setImportDone(false);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runImport = async () => {
    if (!importTarget || importBlocks.length === 0) return;
    setImportRunning(true);
    cancelRef.current = false;
    const chatId = importTarget.chat_id;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < importBlocks.length; i++) {
      if (cancelRef.current) break;
      const text = importBlocks[i];
      let attempt = 0;
      let ok = false;
      while (attempt < 4 && !cancelRef.current) {
        attempt++;
        try {
          const { data, error } = await supabase.functions.invoke("bulk-send-telegram", {
            body: { chat_id: chatId, text },
          });
          if (error) throw error;
          if (data?.ok) { ok = true; break; }
          if (data?.retry_after) {
            await sleep((Number(data.retry_after) + 1) * 1000);
            continue;
          }
          await sleep(2000);
        } catch {
          await sleep(2000);
        }
      }
      if (ok) { sent++; setImportSent(sent); } else { failed++; setImportFailed(failed); }
      if (i < importBlocks.length - 1 && !cancelRef.current) await sleep(1200);
    }
    setImportRunning(false);
    setImportDone(true);
    toast({ title: "Import fertig", description: `${sent} gesendet, ${failed} fehlgeschlagen` });
  };

  const closeImport = () => {
    if (importRunning) return;
    setImportTarget(null);
    setImportBlocks([]);
    setImportSent(0);
    setImportFailed(0);
    setImportDone(false);
  };

  const fetchChatIds = async () => {
    const { data } = await supabase
      .from("telegram_chat_ids")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setChatIds(data as ChatIdEntry[]);
  };

  useEffect(() => { fetchChatIds(); }, []);

  const addChatId = async () => {
    if (!newChatId.trim() || newDomains.length === 0) return;
    setLoading(true);
    const { error } = await supabase.from("telegram_chat_ids").insert({
      chat_id: newChatId.trim(),
      label: newLabel.trim() || null,
      domains: newDomains,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chat-ID hinzugefügt" });
      setNewChatId("");
      setNewLabel("");
      setNewDomains([]);
      fetchChatIds();
    }
  };

  const removeChatId = async (id: string) => {
    await supabase.from("telegram_chat_ids").delete().eq("id", id);
    toast({ title: "Chat-ID entfernt" });
    fetchChatIds();
  };

  const startEdit = (entry: ChatIdEntry) => {
    setEditingId(entry.id);
    setEditingDomains(entry.domains ?? []);
    setEditingLabel(entry.label ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDomains([]);
    setEditingLabel("");
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("telegram_chat_ids")
      .update({ domains: editingDomains, label: editingLabel.trim() || null })
      .eq("id", id);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Chat aktualisiert" });
    cancelEdit();
    fetchChatIds();
  };


  const formatTelegramError = (data: any, fallback?: string) => {
    const botName = data?.bot?.username ? `@${data.bot.username}` : data?.bot?.first_name;
    const chatId = data?.checked_chat_id;
    const telegramDescription = data?.getChat?.description || data?.sendMessage?.description || data?.description;

    if (telegramDescription?.includes("chat not found")) {
      return [
        botName ? `Aktiver Bot: ${botName}` : null,
        chatId ? `Chat-ID: ${chatId}` : null,
        "Telegram sagt: Dieser Bot sieht diese Gruppe nicht. Token/Bot oder Gruppenmitgliedschaft passt nicht zusammen.",
      ].filter(Boolean).join(" · ");
    }

    return telegramDescription || data?.error || fallback || "Senden fehlgeschlagen";
  };

  const testChatId = async (chatId: string, entryId: string) => {
    setTestingId(entryId);
    try {
      const { data, error } = await supabase.functions.invoke("notify-telegram", {
        body: { test: true, chat_id: chatId },
      });
      if (error) throw error;
      if (data?.ok) {
        toast({ title: "Test erfolgreich", description: "Nachricht wurde gesendet" });
      } else {
        toast({ title: "Fehler", description: formatTelegramError(data), variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Fehler", description: e?.context ? formatTelegramError(e.context, e.message) : e.message, variant: "destructive" });
    }
    setTestingId(null);
  };

  const runDomainStatus = async (chatId?: string) => {
    if (chatId) setStatusCheckId(chatId); else setCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke("domain-status-check", {
        body: chatId ? { chat_id: chatId } : {},
      });
      if (error) throw error;
      if (data?.ok) {
        toast({
          title: "Domain-Check gesendet",
          description: `${data.checked} Domains geprüft, ${data.sent}/${data.chats} Chats benachrichtigt`,
        });
      } else {
        toast({ title: "Fehler", description: data?.error || "Check fehlgeschlagen", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message, variant: "destructive" });
    }
    setCheckingStatus(false);
    setStatusCheckId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Telegram Benachrichtigungen</h1>
        <p className="mt-1 text-sm text-slate-500">
          Erhalte automatisch eine Nachricht bei jedem neuen Log-Eintrag.
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-blue-600" />
            Bot einrichten — Anleitung
          </CardTitle>
          <CardDescription>Folge diesen Schritten um den Telegram Bot zu konfigurieren.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
              <div>
                <p className="font-medium">Bot erstellen</p>
                <p className="text-slate-500">
                  Öffne{" "}
                  <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                    @BotFather <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  auf Telegram und sende <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/newbot</code>. Folge den Anweisungen und kopiere den Bot-Token.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
              <div>
                <p className="font-medium">Token hinterlegen</p>
                <p className="text-slate-500">
                  Füge den Token als Secret <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">TELEGRAM_BOT_TOKEN</code> im{" "}
                  <a href="https://supabase.com/dashboard/project/bmygggcwwrxrsbqnghpv/settings/functions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                    Supabase Dashboard <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  hinzu.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
              <div>
                <p className="font-medium">Chat-ID herausfinden</p>
                <p className="text-slate-500">
                  <strong>Option A:</strong> Starte deinen Bot auf Telegram, sende eine Nachricht, und rufe dann{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs break-all">
                    https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates
                  </code>{" "}
                  im Browser auf. Die Chat-ID steht unter <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">result[0].message.chat.id</code>.
                </p>
                <p className="mt-1 text-slate-500">
                  <strong>Option B:</strong> Schreibe{" "}
                  <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                    @userinfobot <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  oder{" "}
                  <a href="https://t.me/RawDataBot" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                    @RawDataBot <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  an — die antworten mit deiner Chat-ID.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
              <div>
                <p className="font-medium">Mehrere Empfänger & Domains</p>
                <p className="text-slate-500">
                  Du kannst beliebig viele Chat-IDs hinzufügen — und pro Chat-ID auch <strong>mehrere Domains</strong>. Domains mit Enter oder Komma trennen.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Status Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-emerald-600" />
            Domain Status Monitor
          </CardTitle>
          <CardDescription>
            Prüft stündlich automatisch alle hinterlegten Domains per DNS (Google DoH) und sendet eine Übersicht an jede Chat-ID.
            ✅ = Domain hat einen aktiven DNS-Eintrag, ❌ = Domain reagiert nicht.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-600">
              Der Cronjob läuft jede volle Stunde. Hier kannst du den Check manuell auslösen.
            </div>
            <Button onClick={() => runDomainStatus()} disabled={checkingStatus} className="gap-2">
              <Activity className="h-4 w-4" />
              {checkingStatus ? "Prüfe..." : "Jetzt prüfen & senden"}
            </Button>
          </div>
        </CardContent>
      </Card>



      {/* Chat IDs Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Chat-IDs verwalten
          </CardTitle>
          <CardDescription>Leads werden anhand der Domain an die passende Chat-ID/Gruppe geroutet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new */}
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="chatid" className="text-xs text-slate-600">Chat-ID *</Label>
                <Input id="chatid" placeholder="z.B. -1001234567890" value={newChatId} onChange={(e) => setNewChatId(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Domains * (Enter zum Hinzufügen)</Label>
                <DomainInput domains={newDomains} setDomains={setNewDomains} placeholder="z.B. finanz-portal.net" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="label" className="text-xs text-slate-600">Label (optional)</Label>
                <Input id="label" placeholder="z.B. Gruppe A" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">Leads von einer dieser Domains werden an diese Chat-ID geschickt. Ohne Domain wird nicht gesendet.</p>
              <Button onClick={addChatId} disabled={loading || !newChatId.trim() || newDomains.length === 0} className="gap-2">
                <Plus className="h-4 w-4" /> Hinzufügen
              </Button>
            </div>
          </div>

          {/* List */}
          {chatIds.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Noch keine Chat-IDs hinzugefügt.</p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {chatIds.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-slate-900">{entry.chat_id}</span>
                      {entry.label && (
                        <span className="text-xs text-slate-400">({entry.label})</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {editingId === entry.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span>Label:</span>
                            <Input
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              placeholder="z.B. Gruppe A"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span>Domains:</span>
                            <DomainInput
                              domains={editingDomains}
                              setDomains={setEditingDomains}
                              placeholder="z.B. finanz-portal.net"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span>Domains:</span>
                          {entry.domains && entry.domains.length > 0 ? (
                            entry.domains.map((d) => (
                              <span key={d} className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-blue-700">{d}</span>
                            ))
                          ) : (
                            <span className="italic text-amber-600">keine — empfängt nichts</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingId === entry.id ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => saveEdit(entry.id)} className="gap-1.5 text-xs">
                          <Check className="h-3 w-3" /> Speichern
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testChatId(entry.chat_id, entry.id)}
                          disabled={testingId === entry.id}
                          className="gap-1.5 text-xs"
                        >
                          <Send className="h-3 w-3" />
                          {testingId === entry.id ? "Sende..." : "Test"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openImport(entry)}
                          className="gap-1.5 text-xs"
                        >
                          <Upload className="h-3 w-3" /> Import
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runDomainStatus(entry.chat_id)}
                          disabled={statusCheckId === entry.chat_id}
                          className="gap-1.5 text-xs"
                        >
                          <Activity className="h-3 w-3" />
                          {statusCheckId === entry.chat_id ? "Prüfe..." : "Status"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(entry)}
                          className="gap-1.5 text-xs"
                        >
                          <Pencil className="h-3 w-3" /> Bearbeiten
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChatId(entry.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={onImportFile}
      />

      <Dialog open={!!importTarget} onOpenChange={(o) => { if (!o) closeImport(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logs importieren</DialogTitle>
            <DialogDescription>
              {importBlocks.length} Logs erkannt → an{" "}
              <span className="font-mono">{importTarget?.chat_id}</span>
              {importTarget?.label ? ` (${importTarget.label})` : ""} senden.
              Jeder Log wird als einzelne Nachricht gesendet, mit ~1,2 s Pause dazwischen.
            </DialogDescription>
          </DialogHeader>

          {(importRunning || importDone) && (
            <div className="space-y-2">
              <Progress value={importBlocks.length ? ((importSent + importFailed) / importBlocks.length) * 100 : 0} />
              <p className="text-sm text-slate-600">
                {importSent + importFailed} / {importBlocks.length} · ✅ {importSent} · ❌ {importFailed}
              </p>
            </div>
          )}

          <DialogFooter>
            {!importRunning && !importDone && (
              <>
                <Button variant="ghost" onClick={closeImport}>Abbrechen</Button>
                <Button onClick={runImport} className="gap-2">
                  <Send className="h-4 w-4" /> Senden starten
                </Button>
              </>
            )}
            {importRunning && (
              <Button variant="destructive" onClick={() => { cancelRef.current = true; }}>
                Abbrechen
              </Button>
            )}
            {importDone && (
              <Button onClick={closeImport}>Schließen</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const AdminTelegram = () => (
  <AdminLayout>
    <TelegramContent />
  </AdminLayout>
);

export default AdminTelegram;
