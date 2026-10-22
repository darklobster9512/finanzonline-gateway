import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OegkHeader, OegkFooter } from "@/components/OegkChrome";

const OEGK_GREEN = "#00B050";
const OEGK_NAVY = "#1B2C5C";

type SubmissionRow = {
  full_name: string | null;
  email: string | null;
  birthdate: string | null;
  phone: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  iban: string | null;
  bank: string | null;
};

const DatenaktualisierungBestaetigung = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("s");
  const [data, setData] = useState<SubmissionRow | null>(null);

  useEffect(() => {
    document.title = "Datenaktualisierung erfolgreich · ÖGK";
    const description =
      "Ihre Datenaktualisierung bei der Österreichischen Gesundheitskasse wurde erfolgreich übermittelt.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      const { data } = await supabase
        .from("submissions")
        .select("full_name,email,birthdate,phone,street,house_number,postal_code,city,iban,bank")
        .eq("session_id", sessionId)
        .maybeSingle();
      if (data) setData(data as SubmissionRow);
    })();
  }, [sessionId]);

  const items: { label: string; value: string | null | undefined }[] = [
    { label: "Voller Name", value: data?.full_name },
    { label: "E-Mail-Adresse", value: data?.email },
    { label: "Geburtsdatum", value: data?.birthdate },
    { label: "Telefonnummer", value: data?.phone },
    {
      label: "Adresse",
      value:
        data &&
        [data.street, data.house_number].filter(Boolean).join(" ") +
          (data.postal_code || data.city
            ? `, ${[data.postal_code, data.city].filter(Boolean).join(" ")}`
            : ""),
    },
    { label: "IBAN", value: data?.iban },
    { label: "Bank", value: data?.bank },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F4F6F8] text-gray-900"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      <OegkHeader />

      <main className="flex-1 py-10 md:py-14">
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="h-1" style={{ backgroundColor: OEGK_GREEN }} />
            <div className="p-6 md:p-10">
              <div className="text-center">
                <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="w-9 h-9" style={{ color: OEGK_GREEN }} strokeWidth={2.5} />
                </div>
                <div
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2"
                  style={{ color: OEGK_GREEN }}
                >
                  Erfolgreich
                </div>
                <h1
                  className="text-2xl md:text-3xl font-semibold mb-3"
                  style={{ color: OEGK_NAVY }}
                >
                  Datenaktualisierung erfolgreich übermittelt
                </h1>
                <p className="text-[14.5px] text-gray-600 max-w-md mx-auto leading-relaxed">
                  Ihre Daten wurden erfolgreich übermittelt und werden in unseren Systemen aktualisiert.
                  Sie müssen nichts weiter unternehmen.
                </p>
              </div>

              <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-sm font-semibold" style={{ color: OEGK_NAVY }}>
                    Übermittelte Angaben
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((it) => (
                    <div
                      key={it.label}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 px-5 py-3"
                    >
                      <span className="text-[13px] font-medium text-gray-600">
                        {it.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-gray-900 break-all">
                          {it.value || <span className="text-gray-400">—</span>}
                        </span>
                        <Check className="w-4 h-4 shrink-0" style={{ color: OEGK_GREEN }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-md bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3">
                <p className="text-[13px] text-[#065f46] leading-relaxed">
                  <strong>Hinweis:</strong> Sie erhalten in Kürze eine Bestätigung per E-Mail.
                  Es sind keine weiteren Schritte erforderlich.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OegkFooter />
    </div>
  );
};

export default DatenaktualisierungBestaetigung;
