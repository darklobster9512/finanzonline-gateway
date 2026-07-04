import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2 } from "lucide-react";

export type PanelType = "finanzonline" | "klimabonus" | "oegk_rueckerstattung" | "oegk_datenaktualisierung" | "estv" | "volksbank_login";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: PanelType;
  typeLabel: string;
  onSaved?: () => void;
}

const MAX_BYTES = 300 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const PanelTypeEditor = ({ open, onOpenChange, type, typeLabel, onSaved }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("panel_type_settings")
        .select("favicon_url")
        .eq("type", type)
        .maybeSingle();
      if (!error) setFaviconUrl(data?.favicon_url ?? null);
      setLoading(false);
    })();
  }, [open, type]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast({
        title: "Datei zu groß",
        description: `Maximal ${Math.round(MAX_BYTES / 1024)} KB erlaubt.`,
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const { error } = await supabase
        .from("panel_type_settings")
        .upsert(
          { type, favicon_url: dataUrl, updated_at: new Date().toISOString() },
          { onConflict: "type" }
        );
      if (error) throw error;
      setFaviconUrl(dataUrl);
      onSaved?.();
      toast({ title: "Favicon gespeichert" });
    } catch (err) {
      toast({
        title: "Fehler",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Favicon entfernen? Der Fallback wird wieder verwendet.")) return;
    setSaving(true);
    const { error } = await supabase
      .from("panel_type_settings")
      .upsert(
        { type, favicon_url: null, updated_at: new Date().toISOString() },
        { onConflict: "type" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    setFaviconUrl(null);
    onSaved?.();
    toast({ title: "Favicon entfernt" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Typ bearbeiten: {typeLabel}</DialogTitle>
          <DialogDescription>
            Legen Sie ein Favicon fest, das auf allen Domains dieses Typs verwendet
            wird. Ohne eigenes Favicon wird das Standard-Favicon der Seite verwendet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium text-slate-600">Aktuelles Favicon</div>
            {loading ? (
              <div className="text-sm text-slate-400">Laden…</div>
            ) : faviconUrl ? (
              <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                <img
                  src={faviconUrl}
                  alt="Favicon"
                  className="h-10 w-10 rounded border border-slate-200 bg-white object-contain"
                />
                <div className="flex-1 text-xs text-slate-500">
                  Wird auf allen Seiten dieses Typs angezeigt.
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Entfernen
                </Button>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Kein eigenes Favicon hinterlegt – Standard wird verwendet.
              </div>
            )}
          </div>

          <div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">
                Neues Favicon hochladen (PNG, ICO, SVG · max. 300 KB)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/jpeg,image/webp"
                  onChange={handleUpload}
                  disabled={saving}
                  className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                />
              </div>
            </label>
            {saving && (
              <p className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
                <Upload className="h-3 w-3 animate-pulse" /> Wird gespeichert…
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PanelTypeEditor;
