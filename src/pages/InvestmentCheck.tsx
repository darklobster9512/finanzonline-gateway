import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ArrowRight, Check, Info } from "lucide-react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankIcon from "@/assets/volksbank.png";
import heroImg from "@/assets/investmentcheck-hero.jpg";
import teaser1 from "@/assets/investmentcheck-teaser-1.jpg";
import teaser2 from "@/assets/investmentcheck-teaser-2.jpg";
import teaser3 from "@/assets/investmentcheck-teaser-3.jpg";

const NAVY = "#003882";
const NAVY_DARK = "#002356";
const TEXT = "#333333";
const MUTED_BG = "#f5f7fa";

const InvestmentCheck = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Volksbank Investment-Check für Bestandskunden", volksbankIcon);

  const handleStart = () => {
    console.log("Investment-Check gestartet");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: TEXT, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4">
          <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-12" />
          <span className="hidden sm:inline text-xs uppercase tracking-widest font-semibold" style={{ color: NAVY }}>
            Investment-Check
          </span>
        </div>
      </header>

      {/* Hero — full bleed image with overlay text */}
      <section className="relative w-full overflow-hidden" style={{ height: "min(70vh, 720px)", minHeight: 480 }}>
        <img
          src={heroImg}
          alt="Volksbank Investment Beratung"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,20,50,0.75) 0%, rgba(0,20,50,0.25) 45%, rgba(0,20,50,0) 70%)",
          }}
        />
        <div className="relative h-full max-w-[1440px] mx-auto px-6 flex flex-col justify-end pb-12 md:pb-20">
          <h1
            className="text-white font-bold tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Der Volksbank<br />Investment-Check
          </h1>
          <p className="mt-6 text-white/90 max-w-2xl text-lg md:text-xl leading-relaxed">
            Für Bestandskunden: Prüfen Sie in 3 Minuten, ob Ihr Erspartes wirklich für Sie arbeitet.
          </p>
        </div>
      </section>

      {/* CTA link directly below hero */}
      <section className="border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-wrap items-center gap-6">
          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-3 font-semibold text-base transition-colors"
            style={{ color: NAVY }}
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform group-hover:translate-x-1"
              style={{ backgroundColor: NAVY, color: "#fff" }}
            >
              <ArrowRight className="w-5 h-5" />
            </span>
            Jetzt Investment-Check starten
          </button>
          <span className="text-sm text-slate-500">Dauer: ca. 3 Minuten · exklusiv für Bestandskunden</span>
        </div>
      </section>

      {/* Intro block */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[780px]">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: NAVY }}>
              Der persönliche Anlage-Check
            </p>
            <h2 className="font-bold tracking-tight leading-tight" style={{ color: NAVY_DARK, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>
              Wann haben Sie zuletzt Ihre Geldanlage überprüft?
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed">
              <p>
                Zinssituation, Inflation und Märkte verändern sich laufend. Damit Ihr Vermögen
                optimal für Sie arbeitet, lohnt sich regelmäßig ein professioneller Blick auf
                Ihre Anlagen.
              </p>
              <p>
                Mit dem Volksbank Investment-Check erhalten Sie als Bestandskunde eine kostenlose
                Ersteinschätzung — persönlich, unabhängig und diskret. In wenigen Minuten
                sehen Sie, welche Chancen in Ihrer aktuellen Situation stecken.
              </p>
              <p className="text-base text-slate-500 italic">
                Hinweis: Veranlagungen können mit Wertschwankungen verbunden sein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teaser cards */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: NAVY }}>
            Was Sie erwartet
          </p>
          <h2 className="font-bold tracking-tight mb-10" style={{ color: NAVY_DARK, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)" }}>
            Ihr Weg zum Investment-Check
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: teaser1,
                title: "Individuelle Auswertung",
                text: "Wir analysieren Ihre aktuelle Anlagesituation und zeigen konkrete Optimierungspotenziale — zugeschnitten auf Ihre Lebensphase.",
              },
              {
                img: teaser2,
                title: "Persönliche Beratung",
                text: "Ihre Volksbank-Experten begleiten Sie mit einer ehrlichen Einschätzung und beantworten alle offenen Fragen.",
              },
              {
                img: teaser3,
                title: "In 3 Minuten erledigt",
                text: "Kein Papierkram, keine langen Termine. Der Check startet direkt online — jederzeit abbrechbar.",
              },
            ].map((c) => (
              <article key={c.title} className="group flex flex-col">
                <div className="relative overflow-hidden mb-6" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={c.img}
                    alt={c.title}
                    width={720}
                    height={540}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: NAVY_DARK }}>
                  {c.title}
                </h3>
                <p className="text-slate-700 leading-relaxed mb-5 flex-1">{c.text}</p>
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 text-sm font-semibold self-start border-b border-transparent hover:border-current pb-0.5 transition-colors"
                  style={{ color: NAVY }}
                >
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vorteile / Was Sie erwartet — Two columns */}
      <section className="py-16 md:py-20 border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-[780px] mb-12">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: NAVY }}>
              Vorteile & Rahmen
            </p>
            <h2 className="font-bold tracking-tight leading-tight" style={{ color: NAVY_DARK, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)" }}>
              Klare Vorteile für Bestandskunden
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h3 className="text-lg font-bold mb-6 pb-3 border-b" style={{ color: NAVY_DARK, borderColor: NAVY }}>
                Ihre Vorteile
              </h3>
              <ul className="space-y-4">
                {[
                  "Kostenlos und unverbindlich",
                  "Individuelle Auswertung Ihrer Anlagesituation",
                  "Persönliche Empfehlungen von Ihren Volksbank-Experten",
                  "Exklusiv für Volksbank-Bestandskunden",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: NAVY }} />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 pb-3 border-b border-slate-300" style={{ color: NAVY_DARK }}>
                Was Sie wissen sollten
              </h3>
              <ul className="space-y-4">
                {[
                  "Der Check dauert ca. 3 Minuten und ist jederzeit abbrechbar.",
                  "Die Auswertung dient als erste Orientierung, ersetzt keine vollständige Beratung.",
                  "Ihre Angaben werden vertraulich behandelt und nur zur Vorbereitung Ihres Termins genutzt.",
                  "Veranlagungen können mit Wertschwankungen und Verlusten verbunden sein.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed text-slate-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-16 md:py-24" style={{ backgroundColor: MUTED_BG }}>
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: NAVY }}>
            Jetzt starten
          </p>
          <h2 className="font-bold tracking-tight leading-tight mb-5" style={{ color: NAVY_DARK, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>
            Starten Sie Ihren persönlichen Investment-Check
          </h2>
          <p className="text-lg text-slate-700 mb-10 leading-relaxed">
            Kostenlos, unverbindlich und exklusiv für Volksbank-Bestandskunden.
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white transition-all hover:brightness-110 shadow-sm"
            style={{ backgroundColor: NAVY }}
          >
            Jetzt Investment-Check starten
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-5 text-sm text-slate-500">Dauer: ca. 3 Minuten</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Volksbank. Alle Rechte vorbehalten.</span>
          <span>Nur für Bestandskunden der Volksbank Österreich.</span>
        </div>
      </footer>
    </div>
  );
};

export default InvestmentCheck;
