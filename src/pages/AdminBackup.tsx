import { useState } from "react";
import JSZip from "jszip";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Upload, Database, AlertTriangle } from "lucide-react";

type TableName =
  | "submissions"
  | "submission_notes"
  | "submission_calls"
  | "page_visits"
  | "telegram_chat_ids"
  | "panels"
  | "panel_type_settings";

interface Group {
  key: string;
  label: string;
  tables: TableName[];
}

// Order matters for import (parents before children)
const GROUPS: Group[] = [
  { key: "logs", label: "Logs (Submissions, Notes, Calls)", tables: ["submissions", "submission_notes", "submission_calls"] },
  { key: "statistiken", label: "Statistiken (Page Visits)", tables: ["page_visits"] },
  { key: "telegram", label: "Telegram (Chat IDs)", tables: ["telegram_chat_ids"] },
  { key: "panels", label: "Panels (+ Type Settings)", tables: ["panels", "panel_type_settings"] },
];

const PAGE_SIZE = 1000;
const UPSERT_CHUNK = 500;

async function fetchAll(table: TableName): Promise<any[]> {
  const rows: any[] = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await (supabase as any)
      .from(table)
      .select("*")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

async function upsertAll(table: TableName, rows: any[]): Promise<number> {
  let done = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK);
    const { error } = await (supabase as any).from(table).upsert(chunk, { onConflict: "id" });
    if (error) throw new Error(`${table}: ${error.message}`);
    done += chunk.length;
  }
  return done;
}

function DashboardContent() {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map((g) => [g.key, true])),
  );
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const toggle = (key: string) =>
    setSelected((s) => ({ ...s, [key]: !s[key] }));

  const handleExport = async () => {
    const activeGroups = GROUPS.filter((g) => selected[g.key]);
    if (activeGroups.length === 0) {
      toast.error("Bitte mindestens eine Gruppe auswählen");
      return;
    }
    setExporting(true);
    setLastResult(null);
    try {
      const zip = new JSZip();
      const counts: Record<string, number> = {};
      for (const group of activeGroups) {
        for (const table of group.tables) {
          toast.message(`Lade ${table}…`);
          const rows = await fetchAll(table);
          counts[table] = rows.length;
          zip.file(`${table}.json`, JSON.stringify(rows, null, 2));
        }
      }
      const manifest = {
        version: 1,
        created_at: new Date().toISOString(),
        groups: activeGroups.map((g) => g.key),
        counts,
      };
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `backup-${date}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const summary = Object.entries(counts).map(([t, c]) => `${t}: ${c}`).join(", ");
      setLastResult(`Export: ${summary}`);
      toast.success("Backup erstellt");
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Bitte ZIP-Datei auswählen");
      return;
    }
    const activeGroups = GROUPS.filter((g) => selected[g.key]);
    if (activeGroups.length === 0) {
      toast.error("Bitte mindestens eine Gruppe auswählen");
      return;
    }
    setImporting(true);
    setLastResult(null);
    try {
      const zip = await JSZip.loadAsync(importFile);
      const counts: Record<string, number> = {};
      for (const group of activeGroups) {
        for (const table of group.tables) {
          const file = zip.file(`${table}.json`);
          if (!file) {
            counts[table] = 0;
            continue;
          }
          const text = await file.async("string");
          const rows = JSON.parse(text) as any[];
          if (!Array.isArray(rows) || rows.length === 0) {
            counts[table] = 0;
            continue;
          }
          toast.message(`Importiere ${table} (${rows.length})…`);
          counts[table] = await upsertAll(table, rows);
        }
      }
      const summary = Object.entries(counts).map(([t, c]) => `${t}: ${c}`).join(", ");
      setLastResult(`Import: ${summary}`);
      toast.success("Import fertig");
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backup</h1>
        <p className="mt-1 text-sm text-slate-500">
          Exportiere und importiere Datenbank-Daten als ZIP mit JSON-Dateien.
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            Das Backup enthält nur <strong>Daten</strong>, nicht das Schema. Wenn die DB neu
            aufgesetzt wurde, müssen zuerst die Tabellenstrukturen (via Migration) wiederhergestellt werden.
            UUIDs bleiben erhalten, sodass Referenzen (z.B. panel_id, submission_id) weiter funktionieren.
            Leads und Domains sind bewusst nicht enthalten.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auswahl</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {GROUPS.map((g) => (
            <label key={g.key} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={!!selected[g.key]} onCheckedChange={() => toggle(g.key)} />
              <div>
                <div className="text-sm font-medium text-slate-900">{g.label}</div>
                <div className="text-xs text-slate-500">{g.tables.join(", ")}</div>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" /> Backup erstellen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Lädt alle Zeilen der gewählten Tabellen und packt sie in ein ZIP.
            </p>
            <Button onClick={handleExport} disabled={exporting} className="w-full">
              {exporting ? "Erstelle…" : "ZIP herunterladen"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4" /> Backup einspielen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              ZIP-Datei hochladen und Daten in die gewählten Tabellen einspielen (Upsert).
            </p>
            <Input
              type="file"
              accept=".zip"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleImport}
              disabled={importing || !importFile}
              variant="secondary"
              className="w-full"
            >
              {importing ? "Importiere…" : "Import starten"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {lastResult && (
        <Card>
          <CardContent className="p-4 flex gap-3 items-start">
            <Database className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{lastResult}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const AdminBackup = () => (
  <AdminLayout>
    <DashboardContent />
  </AdminLayout>
);

export default AdminBackup;
