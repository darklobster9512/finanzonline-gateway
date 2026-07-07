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
import { useToast } from "@/hooks/use-toast";
import { Wallet, RefreshCw, Search, ShoppingCart, Check, X, Loader2, Settings2 } from "lucide-react";

const TLDS = [".com", ".net", ".cc", ".co"] as const;
const DEFAULT_IP = "91.215.85.163";

type SearchResult = {
  status: { domain: string; available: boolean; premium: boolean };
  tld: string;
  actualPrice: number; // cents
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

const formatEUR = (cents: number | null | undefined) =>
  typeof cents === "number"
    ? (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })
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

  // DNS Dialog
  const [dnsDomain, setDnsDomain] = useState<Domain | null>(null);
  const [dnsIp, setDnsIp] = useState(DEFAULT_IP);
  const [dnsSaving, setDnsSaving] = useState(false);

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

  const loadDomains = async () => {
    try {
      const res = await invoke<{ domains: Domain[] }>("list");
      setDomains(res.domains ?? []);
    } catch (err) {
      toast({ title: "Domains laden fehlgeschlagen", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setDomainsLoading(false);
    }
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
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }
    if (pollingRef.current) return;
    pollingRef.current = window.setInterval(() => {
      loadDomains();
    }, 5000);
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
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
      // Preserve TLD order
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

  const sortedDomains = useMemo(
    () => [...domains].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    [domains]
  );

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
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Aktuelles Guthaben</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900">
              {balanceLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : formatEUR(balance)}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadBalance} disabled={balanceLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${balanceLoading ? "animate-spin" : ""}`} />
            Aktualisieren
          </Button>
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
                        {available ? `${formatEUR(r.actualPrice)} / Jahr` : "vergeben"}
                      </span>
                      {available && (
                        <Button
                          size="sm"
                          onClick={() => setConfirmBuy(r)}
                          disabled={buyingDomain === r.status.domain}
                        >
                          {buyingDomain === r.status.domain ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="mr-1 h-4 w-4" />
                              Kaufen
                            </>
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
                <TableHead className="w-48 text-right">Aktion</TableHead>
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
              {sortedDomains.map((d) => {
                const isActive = d.status.toLowerCase() === "active";
                const hasA = d.records?.some((r) => r.type === "A" && (r.name === "@" || r.name === d.domain));
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-slate-800">
                      {d.domain}
                      {hasA && (
                        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">A gesetzt</span>
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
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!isActive}
                        onClick={() => openDns(d)}
                      >
                        <Settings2 className="mr-1 h-3.5 w-3.5" />
                        DNS konfigurieren
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirm buy */}
      <Dialog open={!!confirmBuy} onOpenChange={(o) => !o && setConfirmBuy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain kaufen</DialogTitle>
            <DialogDescription>
              {confirmBuy && (
                <>
                  Möchtest du <span className="font-semibold text-slate-900">{confirmBuy.status.domain}</span> für{" "}
                  <span className="font-semibold text-slate-900">{formatEUR(confirmBuy.actualPrice)}</span> registrieren?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBuy(null)}>Abbrechen</Button>
            <Button
              onClick={() => confirmBuy && handleBuy(confirmBuy)}
              disabled={!!buyingDomain}
            >
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
              {dnsDomain && (
                <>Setzt einen <strong>A-Record</strong> auf <strong>@</strong> für <strong>{dnsDomain.domain}</strong>.</>
              )}
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
    </AdminLayout>
  );
};

export default AdminDomains;
