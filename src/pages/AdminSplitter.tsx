import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Download, FileArchive, Mail, Scissors, Upload } from "lucide-react";

import { buildFiles, downloadBlob, type SplitFile } from "@/lib/splitter";

const AdminSplitter = () => {
  const [input, setInput] = useState("");
  const [chunkSize, setChunkSize] = useState(1500);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [files, setFiles] = useState<SplitFile[]>([]);

  const parsedNumbers = useMemo(() => {
    let lines = input.split(/\r?\n/).map((l) => l.trim());
    if (skipEmpty) lines = lines.filter((l) => l.length > 0);
    if (removeDuplicates) lines = Array.from(new Set(lines));
    return lines;
  }, [input, removeDuplicates, skipEmpty]);

  const handleSplit = (): SplitFile[] | null => {
    if (parsedNumbers.length === 0) {
      toast({ title: "Keine Nummern", description: "Bitte Nummern einfügen.", variant: "destructive" });
      return null;
    }
    if (!chunkSize || chunkSize < 1) {
      toast({ title: "Ungültige Stückelung", description: "Stückelung muss ≥ 1 sein.", variant: "destructive" });
      return null;
    }
    const result = buildFiles(parsedNumbers, chunkSize);
    setFiles(result);
    return result;
  };

  const handleZip = async () => {
    const result = handleSplit();
    if (!result) return;
    const zip = new JSZip();
    result.forEach((f) => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadBlob(blob, `nummern-split-${ts}.zip`);
    toast({ title: "ZIP erstellt", description: `${result.length} Datei(en) heruntergeladen.` });
  };

  const handleIndividual = () => {
    const result = handleSplit();
    if (!result) return;
    result.forEach((f) => downloadBlob(new Blob([f.content], { type: "text/plain" }), f.name));
    toast({ title: "Download gestartet", description: `${result.length} Datei(en).` });
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-3">
          <Scissors className="h-6 w-6 text-slate-700" />
          <h1 className="text-2xl font-semibold text-slate-900">Splitter</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Nummern (eine pro Zeile)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="436641234567&#10;436641234568&#10;..."
                className="min-h-[600px] font-mono text-sm"
              />
              <p className="text-sm text-slate-500">
                {parsedNumbers.length.toLocaleString("de-AT")} Nummer(n) erkannt
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chunk">Stückelung</Label>
                  <Input
                    id="chunk"
                    type="number"
                    min={1}
                    value={chunkSize}
                    onChange={(e) => setChunkSize(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dup"
                    checked={removeDuplicates}
                    onCheckedChange={(v) => setRemoveDuplicates(!!v)}
                  />
                  <Label htmlFor="dup" className="cursor-pointer">Duplikate entfernen</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="empty"
                    checked={skipEmpty}
                    onCheckedChange={(v) => setSkipEmpty(!!v)}
                  />
                  <Label htmlFor="empty" className="cursor-pointer">Leere Zeilen ignorieren</Label>
                </div>
                <div className="space-y-2 pt-2">
                  <Button onClick={handleZip} className="w-full gap-2">
                    <FileArchive className="h-4 w-4" />
                    Split & ZIP herunterladen
                  </Button>
                  <Button onClick={handleIndividual} variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Einzeln herunterladen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Erzeugte Dateien ({files.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {files.map((f, i) => (
                      <li key={i} className="flex justify-between border-b border-slate-100 py-1 last:border-0">
                        <span className="font-mono text-slate-700">{f.name}</span>
                        <span className="text-slate-500">{f.count.toLocaleString("de-AT")}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <EmailSorter />
      </div>
    </AdminLayout>
  );
};

interface EmailGroup {
  domain: string;
  emails: string[];
}

const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const EmailSorter = () => {
  const [fileName, setFileName] = useState<string>("");
  const [rawText, setRawText] = useState<string>("");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());

  const groups = useMemo<EmailGroup[]>(() => {
    if (!rawText) return [];
    const matches = rawText.match(EMAIL_REGEX) ?? [];
    const normalized = matches.map((m) => (lowercase ? m.toLowerCase() : m));
    const map = new Map<string, string[]>();
    for (const email of normalized) {
      const domain = email.split("@")[1]?.toLowerCase();
      if (!domain) continue;
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)!.push(email);
    }
    const result: EmailGroup[] = [];
    for (const [domain, emails] of map.entries()) {
      const finalEmails = removeDuplicates ? Array.from(new Set(emails)) : emails;
      result.push({ domain, emails: finalEmails });
    }
    result.sort((a, b) => b.emails.length - a.emails.length);
    return result;
  }, [rawText, removeDuplicates, lowercase]);

  // Beim Wechsel der Gruppen alle Provider standardmäßig auswählen
  useEffect(() => {
    setSelectedDomains(new Set(groups.map((g) => g.domain)));
  }, [groups]);

  const totalEmails = useMemo(() => groups.reduce((s, g) => s + g.emails.length, 0), [groups]);
  const selectedGroups = useMemo(
    () => groups.filter((g) => selectedDomains.has(g.domain)),
    [groups, selectedDomains],
  );
  const selectedEmails = useMemo(
    () => selectedGroups.reduce((s, g) => s + g.emails.length, 0),
    [selectedGroups],
  );
  const allSelected = groups.length > 0 && selectedDomains.size === groups.length;

  const toggleDomain = (domain: string, checked: boolean) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      if (checked) next.add(domain);
      else next.delete(domain);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedDomains(new Set());
    else setSelectedDomains(new Set(groups.map((g) => g.domain)));
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setFileName(file.name);
    setRawText(text);
  };

  const handleZip = async () => {
    if (selectedGroups.length === 0) {
      toast({ title: "Keine Provider ausgewählt", description: "Bitte mindestens einen Provider auswählen.", variant: "destructive" });
      return;
    }
    const zip = new JSZip();
    selectedGroups.forEach((g) => zip.file(`${g.domain}.txt`, g.emails.join("\n")));
    const blob = await zip.generateAsync({ type: "blob" });
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadBlob(blob, `email-sortiert-${ts}.zip`);
    toast({ title: "ZIP erstellt", description: `${selectedGroups.length} Provider, ${selectedEmails} Emails.` });
  };

  const handleReset = () => {
    setFileName("");
    setRawText("");
    setSelectedDomains(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pt-4">
        <Mail className="h-6 w-6 text-slate-700" />
        <h2 className="text-2xl font-semibold text-slate-900">Email Sorter</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Email-Datei (.txt)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="email-file"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                Datei auswählen
              </Label>
              <Input
                id="email-file"
                type="file"
                accept=".txt,text/plain"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {fileName && <span className="text-sm text-slate-600">{fileName}</span>}
            </div>
            <p className="text-sm text-slate-500">
              {totalEmails.toLocaleString("de-AT")} Email(s) in {groups.length} Provider(n) erkannt
              {groups.length > 0 && (
                <> · {selectedEmails.toLocaleString("de-AT")} ausgewählt</>
              )}
            </p>

            {groups.length > 0 && (
              <div className="rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-medium text-slate-600">
                    Provider auswählen
                  </span>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs font-medium text-slate-700 underline-offset-2 hover:underline"
                  >
                    {allSelected ? "Alle abwählen" : "Alle auswählen"}
                  </button>
                </div>
                <ul className="max-h-[400px] divide-y divide-slate-100 overflow-y-auto text-sm">
                  {groups.map((g) => {
                    const checked = selectedDomains.has(g.domain);
                    return (
                      <li key={g.domain} className="flex items-center justify-between px-3 py-2">
                        <Label
                          htmlFor={`dom-${g.domain}`}
                          className="flex flex-1 cursor-pointer items-center gap-3"
                        >
                          <Checkbox
                            id={`dom-${g.domain}`}
                            checked={checked}
                            onCheckedChange={(v) => toggleDomain(g.domain, !!v)}
                          />
                          <span className="font-mono text-slate-700">{g.domain}.txt</span>
                        </Label>
                        <span className="text-slate-500">{g.emails.length.toLocaleString("de-AT")}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="email-dup"
                  checked={removeDuplicates}
                  onCheckedChange={(v) => setRemoveDuplicates(!!v)}
                />
                <Label htmlFor="email-dup" className="cursor-pointer">Duplikate entfernen</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="email-lower"
                  checked={lowercase}
                  onCheckedChange={(v) => setLowercase(!!v)}
                />
                <Label htmlFor="email-lower" className="cursor-pointer">In Kleinbuchstaben umwandeln</Label>
              </div>
              <div className="space-y-2 pt-2">
                <Button onClick={handleZip} className="w-full gap-2">
                  <FileArchive className="h-4 w-4" />
                  ZIP herunterladen
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Zurücksetzen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSplitter;
