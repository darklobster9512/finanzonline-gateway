import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet, RefreshCw, Search, ShoppingCart, Check, X, Loader2, Settings2, Link2, ShieldCheck, AlertTriangle, Copy,
} from "lucide-react";
import xmrLogo from "@/assets/xmr-logo.png.asset.json";

const XMR_WALLET = "88Cd3npFKaK9gp5cazd1QFgbqXN9w5yUXQymnHSykmN4B88MxaUbRLYUYrawuPw6JoNtopdbHp4LJe619NLiCYaGTecwAXs";

const TLDS = [".com", ".net", ".cc", ".co"] as const;
const DEFAULT_IP = "91.215.85.163";
const PAGE_SIZE = 10;

type SearchResult = {
  status: { domain: string; available: boolean; premium: boolean };
  tld: string;
  actualPrice: number;
  prices?: Record<string, number>;
  isContactless?: boolean;
};

type Domain = {
  id: string;
  domain: string;
  status: string;
  createdAt: string;
  ns?: string[];
  records?: Array<{ _id?: string; name: string; type: string; value: string }>;
};

type ConnectionRow = {
  domain: string;
  status: string;
  last_message: string | null;
  connected_at: string | null;
};

const invoke = async <T,>(action: string, payload?: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke("luxuryhost-proxy", {
    body: { action, payload },
  });
  if (error) throw new Error(error.message);
  const res = data as { status: number; data: T; error?: string };
  if (res.error) throw new Error(res.error);
  if (res.status && res.status >= 400) {
    const msg = (res.data as { message?: string; error?: string })?.message
      ?? (res.data as { error?: string })?.error
      ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.data;
};

const formatUSD = (cents: number | null | undefined) =>
  typeof cents === "number"
    ? (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "–";

const statusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s === "active") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s === "pending" || s === "processing") return "bg-amber-100 text-amber-700 border-amber-200";
  if (s === "failed" || s === "error") return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const AdminDomains = () => {
  const { toast } = useToast();

  // Balance
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [buyingDomain, setBuyingDomain] = useState<string | null>(null);
  const [confirmBuy, setConfirmBuy] = useState<SearchResult | null>(null);

  // Domains
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [connections, setConnections] = useState<Record<string, ConnectionRow>>({});
  const [page, setPage] = useState(1);

  // DNS Dialog
  const [dnsDomain, setDnsDomain] = useState<Domain | null>(null);
  const [dnsIp, setDnsIp] = useState(DEFAULT_IP);
  const [dnsSaving, setDnsSaving] = useState(false);

  // Connect Dialog
  const [connectDomain, setConnectDomain] = useState<Domain | null>(null);
  const [dnsCheckState, setDnsCheckState] = useState<"idle" | "checking" | "ok" | "fail">("idle");
  const [connectState, setConnectState] = useState<"idle" | "running" | "ok" | "fail">("idle");
  const [connectMessage, setConnectMessage] = useState<string>("");
  const [retryLoading, setRetryLoading] = useState(false);

  const loadBalance = async () => {
    setBalanceLoading(true);
    try {
      const me = await invoke<{ balance: number }>("getBalance");
      setBalance(me.balance);
    } catch (err) {
      toast({ title: "Guthaben-Fehler", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setBalanceLoading(false);
    }
  };

  const loadConnections = async () => {
    const { data } = await supabase.from("domain_connections").select("domain,status,last_message,connected_at");
    if (data) {
      const map: Record<string, ConnectionRow> = {};
      for (const row of data as ConnectionRow[]) map[row.domain.toLowerCase()] = row;
      setConnections(map);
    }
  };

  const loadDomains = async () => {
    try {
      const res = await invoke<{ domains: Domain[] }>("list");
      setDomains(res.domains ?? []);
    } catch (err) {
      toast({ title: "Domains laden fehlgeschlagen", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setDomainsLoading(false);
    }
    loadConnections();
  };

  useEffect(() => {
    loadBalance();
    loadDomains();
  }, []);

  // Poll non-active domains every 5s
  const pollingRef = useRef<number | null>(null);
  useEffect(() => {
    const hasPending = domains.some((d) => d.status.toLowerCase() !== "active");
    if (!hasPending) {
      if (pollingRef.current) { window.clearInterval(pollingRef.current); pollingRef.current = null; }
      return;
    }
    if (pollingRef.current) return;
    pollingRef.current = window.setInterval(() => loadDomains(), 5000);
    return () => {
      if (pollingRef.current) { window.clearInterval(pollingRef.current); pollingRef.current = null; }
    };
  }, [domains]);

  const handleSearch = async () => {
    const base = query.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\.[a-z]+$/, "");
    if (!base) return;
    setSearching(true);
    setResults([]);
    try {
      const list = TLDS.map((t) => `${base}${t}`);
      const data = await invoke<SearchResult[]>("bulkSearch", { domains: list });
      const ordered = TLDS
        .map((t) => data.find((r) => r.tld === t.slice(1)))
        .filter(Boolean) as SearchResult[];
      setResults(ordered);
    } catch (err) {
      toast({ title: "Suche fehlgeschlagen", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const handleBuy = async (r: SearchResult) => {
    setBuyingDomain(r.status.domain);
    try {
      await invoke("purchase", { domain: r.status.domain });
      toast({ title: "Domain gekauft", description: r.status.domain });
      setConfirmBuy(null);
      setResults((prev) => prev.map((x) => x.status.domain === r.status.domain ? { ...x, status: { ...x.status, available: false } } : x));
      loadBalance();
      loadDomains();
    } catch (err) {
      toast({ title: "Kauf fehlgeschlagen", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setBuyingDomain(null);
    }
  };

  const openDns = (d: Domain) => {
    setDnsIp(DEFAULT_IP);
    setDnsDomain(d);
  };

  const handleDnsSave = async () => {
    if (!dnsDomain) return;
    setDnsSaving(true);
    try {
      await invoke("addRecord", { id: dnsDomain.id, domain: "@", ip: dnsIp });
      toast({ title: "DNS gesetzt", description: `A @ → ${dnsIp}` });
      setDnsDomain(null);
      loadDomains();
    } catch (err) {
      toast({ title: "DNS-Fehler", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setDnsSaving(false);
    }
  };

  // Connect flow
  const openConnect = async (d: Domain) => {
    setConnectDomain(d);
    setConnectState("idle");
    setConnectMessage("");
    setDnsCheckState("checking");
    try {
      const res = await invoke<{ resolves: boolean }>("checkDns", { domain: d.domain });
      setDnsCheckState(res.resolves ? "ok" : "fail");
    } catch {
      setDnsCheckState("fail");
    }
  };

  const rerunDnsCheck = async () => {
    if (!connectDomain) return;
    setDnsCheckState("checking");
    try {
      const res = await invoke<{ resolves: boolean }>("checkDns", { domain: connectDomain.domain });
      setDnsCheckState(res.resolves ? "ok" : "fail");
    } catch {
      setDnsCheckState("fail");
    }
  };

  const runConnect = async () => {
    if (!connectDomain) return;
    setConnectState("running");
    setConnectMessage("Verbinde mit VPS, konfiguriere nginx und beantrage SSL…");
    try {
      const res = await invoke<{ ok: boolean; message: string }>("connectDomain", {
        domain: connectDomain.domain,
        id: connectDomain.id,
      });
      if (res.ok) {
        setConnectState("ok");
        setConnectMessage(`Domain ${connectDomain.domain} ist verbunden. https://${connectDomain.domain} ist live.`);
      } else {
        setConnectState("fail");
        setConnectMessage("Die Domain wurde noch nicht richtig verbunden. Bitte in 5 Minuten erneut probieren.");
      }
    } catch (err) {
      setConnectState("fail");
      setConnectMessage(err instanceof Error ? err.message : String(err));
    } finally {
      loadConnections();
    }
  };

  const retrySSL = async () => {
    if (!connectDomain) return;
    setRetryLoading(true);
    try {
      const res = await invoke<{ ok: boolean; message: string }>("retrySSL", {
        domain: connectDomain.domain,
        id: connectDomain.id,
      });
      if (res.ok) {
        setConnectState("ok");
        setConnectMessage(`Domain ${connectDomain.domain} ist verbunden. https://${connectDomain.domain} ist live.`);
      } else {
        setConnectState("fail");
        setConnectMessage("Die Domain wurde noch nicht richtig verbunden. Bitte in 5 Minuten erneut probieren.");
      }
    } catch (err) {
      setConnectState("fail");
      setConnectMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setRetryLoading(false);
      loadConnections();
    }
  };

  const sortedDomains = useMemo(
    () => [...domains].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    [domains]
  );

  const totalPages = Math.max(1, Math.ceil(sortedDomains.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const pagedDomains = sortedDomains.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    const push = (n: number | "…") => nums.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      push(1);
      if (page > 3) push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i);
      if (page < totalPages - 2) push("…");
      push(totalPages);
    }
    return nums;
  }, [totalPages, page]);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Domains</h1>
            <p className="text-sm text-slate-500">LuxuryHost – Guthaben, Suche, Kauf und DNS-Konfiguration.</p>
          </div>
        </div>

        {/* Balance */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Aktuelles Guthaben</div>
              <div className="mt-1 text-3xl font-semibold text-slate-900">
                {balanceLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : formatUSD(balance)}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={loadBalance} disabled={balanceLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${balanceLoading ? "animate-spin" : ""}`} />
              Aktualisieren
            </Button>
          </div>

          <div className="rounded-md border border-orange-200 bg-orange-50/50 p-4">
            <div className="flex items-center gap-2">
              <img src={xmrLogo.url} alt="Monero (XMR)" className="h-5 w-5" />
              <div className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Einzahlungswallet (nur XMR)
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Nur Monero (XMR) Einzahlungen werden akzeptiert. Andere Kryptowährungen gehen verloren.
            </p>
            <div className="mt-3 flex items-stretch gap-2">
              <code className="flex-1 break-all rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800">
                {XMR_WALLET}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(XMR_WALLET);
                    toast({ title: "Wallet kopiert", description: "XMR-Adresse in die Zwischenablage kopiert." });
                  } catch {
                    toast({ title: "Fehler", description: "Konnte nicht kopieren.", variant: "destructive" });
                  }
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Kopieren
              </Button>
            </div>
          </div>
        </div>


        {/* Search */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Domain suchen &amp; kaufen</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="z.B. onlinesign"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searching || !query.trim()}>
              {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Prüfen ({TLDS.join(" ")})
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-4 divide-y divide-slate-100 rounded-md border border-slate-200">
              {results.map((r) => {
                const available = r.status.available;
                return (
                  <div key={r.status.domain} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {available ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="font-medium text-slate-800">{r.status.domain}</span>
                      {r.status.premium && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Premium</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${available ? "text-slate-900 font-medium" : "text-slate-400"}`}>
                        {available ? `${formatUSD(r.actualPrice)} / Jahr` : "vergeben"}
                      </span>
                      {available && (
                        <Button size="sm" onClick={() => setConfirmBuy(r)} disabled={buyingDomain === r.status.domain}>
                          {buyingDomain === r.status.domain ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <><ShoppingCart className="mr-1 h-4 w-4" />Kaufen</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Domains list */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="text-sm font-semibold text-slate-700">Meine Domains</h2>
            <Button variant="ghost" size="sm" onClick={loadDomains}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Neu laden
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-40">Gekauft</TableHead>
                <TableHead className="w-80 text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domainsLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">Laden…</TableCell>
                </TableRow>
              )}
              {!domainsLoading && sortedDomains.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">Noch keine Domains gekauft.</TableCell>
                </TableRow>
              )}
              {pagedDomains.map((d) => {
                const isActive = d.status.toLowerCase() === "active";
                const hasA = d.records?.some((r) => r.type === "A" && (r.name === "@" || r.name === d.domain));
                const conn = connections[d.domain.toLowerCase()];
                const isConnected = conn?.status === "connected";
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-slate-800">
                      {d.domain}
                      {hasA && (
                        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">A gesetzt</span>
                      )}
                      {isConnected && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> SSL verbunden
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadgeClass(d.status)}`}>
                        {!isActive && <Loader2 className="h-3 w-3 animate-spin" />}
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString("de-DE") : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" disabled={!isActive} onClick={() => openDns(d)}>
                          <Settings2 className="mr-1 h-3.5 w-3.5" /> DNS konfigurieren
                        </Button>
                        {isActive && hasA && !isConnected && (
                          <Button size="sm" onClick={() => openConnect(d)}>
                            <Link2 className="mr-1 h-3.5 w-3.5" /> Domain verbinden
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="border-t border-slate-100 p-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {pageNumbers.map((n, i) =>
                    n === "…" ? (
                      <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href="#"
                          isActive={n === page}
                          onClick={(e) => { e.preventDefault(); setPage(n); }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Confirm buy */}
      <Dialog open={!!confirmBuy} onOpenChange={(o) => !o && setConfirmBuy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain kaufen</DialogTitle>
            <DialogDescription>
              {confirmBuy && (
                <>Möchtest du <span className="font-semibold text-slate-900">{confirmBuy.status.domain}</span> für{" "}
                <span className="font-semibold text-slate-900">{formatUSD(confirmBuy.actualPrice)}</span> registrieren?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBuy(null)}>Abbrechen</Button>
            <Button onClick={() => confirmBuy && handleBuy(confirmBuy)} disabled={!!buyingDomain}>
              {buyingDomain ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
              Kostenpflichtig kaufen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DNS config */}
      <Dialog open={!!dnsDomain} onOpenChange={(o) => !o && setDnsDomain(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>DNS konfigurieren</DialogTitle>
            <DialogDescription>
              {dnsDomain && (<>Setzt einen <strong>A-Record</strong> auf <strong>@</strong> für <strong>{dnsDomain.domain}</strong>.</>)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-600">IP-Adresse</label>
            <Input value={dnsIp} onChange={(e) => setDnsIp(e.target.value)} placeholder={DEFAULT_IP} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDnsDomain(null)} disabled={dnsSaving}>Abbrechen</Button>
            <Button onClick={handleDnsSave} disabled={dnsSaving || !dnsIp.trim()}>
              {dnsSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect domain */}
      <Dialog open={!!connectDomain} onOpenChange={(o) => { if (!o) { setConnectDomain(null); setConnectState("idle"); setDnsCheckState("idle"); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain verbinden</DialogTitle>
            <DialogDescription>
              {connectDomain && (<><strong>{connectDomain.domain}</strong> mit dem Server verbinden und SSL-Zertifikat ausstellen.</>)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* DNS Check */}
            <div className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                {dnsCheckState === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                {dnsCheckState === "ok" && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>}
                {dnsCheckState === "fail" && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700"><X className="h-3 w-3" /></span>}
                <span className="text-sm font-medium text-slate-700">
                  {dnsCheckState === "checking" && "DNS wird geprüft…"}
                  {dnsCheckState === "ok" && "Domain zeigt bereits ins Netz"}
                  {dnsCheckState === "fail" && "Domain ist noch nicht erreichbar"}
                </span>
                {dnsCheckState === "fail" && (
                  <Button size="sm" variant="outline" className="ml-auto" onClick={rerunDnsCheck}>
                    <RefreshCw className="mr-1 h-3 w-3" /> Erneut prüfen
                  </Button>
                )}
              </div>
              {dnsCheckState === "fail" && (
                <p className="mt-2 text-xs text-slate-500">DNS-Änderungen können ein paar Minuten dauern. Bitte gleich noch mal versuchen.</p>
              )}
            </div>

            {/* Connect status */}
            {connectState !== "idle" && (
              <div className={`rounded-md border p-3 ${
                connectState === "ok" ? "border-emerald-200 bg-emerald-50" :
                connectState === "fail" ? "border-red-200 bg-red-50" :
                "border-slate-200 bg-slate-50"
              }`}>
                <div className="flex items-center gap-2">
                  {connectState === "running" && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                  {connectState === "ok" && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                  {connectState === "fail" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  <span className="text-sm font-medium text-slate-800">
                    {connectState === "running" && "Verbinde…"}
                    {connectState === "ok" && "Domain verbunden"}
                    {connectState === "fail" && "Verbindung fehlgeschlagen"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{connectMessage}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {connectState === "ok" ? (
              <Button onClick={() => setConnectDomain(null)}>Schließen</Button>
            ) : connectState === "fail" ? (
              <>
                <Button variant="outline" onClick={() => setConnectDomain(null)}>Schließen</Button>
                <Button onClick={retrySSL} disabled={retryLoading}>
                  {retryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  SSL erneut versuchen
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setConnectDomain(null)} disabled={connectState === "running"}>Abbrechen</Button>
                <Button
                  onClick={runConnect}
                  disabled={dnsCheckState !== "ok" || connectState === "running"}
                >
                  {connectState === "running" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                  Domain verbinden
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDomains;
