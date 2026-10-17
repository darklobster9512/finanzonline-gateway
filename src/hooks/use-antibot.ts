import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type State = { status: "checking" | "allowed" | "blocked"; reason?: string };

function clientHeadlessSignal(): string | null {
  try {
    if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return "client_webdriver";
    const ua = (navigator.userAgent || "").toLowerCase();
    const markers = ["headlesschrome", "phantomjs", "puppeteer", "selenium", "playwright"];
    for (const m of markers) if (ua.includes(m)) return `client_${m}`;
    if (
      /chrome/.test(ua) &&
      !/mobile|android|iphone|ipad/.test(ua) &&
      navigator.plugins &&
      navigator.plugins.length === 0
    ) {
      return "client_no_plugins";
    }
  } catch {
    // ignore
  }
  return null;
}

export function useAntiBot(): State {
  const [state, setState] = useState<State>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;
    const clientSignal = clientHeadlessSignal();
    if (clientSignal) {
      setState({ status: "blocked", reason: clientSignal });
      return;
    }
    const TIMEOUT_MS = 4000;
    (async () => {
      try {
        const edgeCall = supabase.functions.invoke("antibot-check", {
          body: {
            domain: typeof window !== "undefined" ? window.location.hostname : "",
            path: typeof window !== "undefined" ? window.location.pathname : "",
          },
        });
        const timeout = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), TIMEOUT_MS)
        );
        const { data, error } = await Promise.race([edgeCall, timeout]);
        if (cancelled) return;
        if (error) { setState({ status: "allowed" }); return; }
        if (data?.allowed === false) {
          setState({ status: "blocked", reason: data?.reason });
        } else {
          setState({ status: "allowed" });
        }
      } catch {
        if (!cancelled) setState({ status: "allowed" });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}
