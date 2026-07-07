import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, Users, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildFiles, downloadBlob } from "@/lib/splitter";

const BATCH = 500;

const AdminLeads = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [importing, setImporting] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [chunkSize, setChunkSize] = useState(500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCount = async () => {
    setLoadingCount(true);
    const { count: c, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      setCount(c ?? 0);
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
                {loadingCount ? "…" : (count ?? 0).toLocaleString("de-AT")}
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
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
