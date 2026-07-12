import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Landmark, IdCard, CalendarClock,
  FileEdit, ShieldCheck, Mail, Wallet,
  User, Calendar, MapPin, CreditCard, Phone, Map, Building2,
  ArrowRight, Lock, Info,
} from "lucide-react";
import bmfLogo from "@/assets/bmf_logo.svg";
import heroImage from "@/assets/klimabonus-hero-v2.png";
import { usePanel } from "@/components/PanelProvider";


const MONATE = [
  "Jänner", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const JAHR = "2026";
const BMF_RED = "#E6320F";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SectionHeading = ({ children, kicker }: { children: React.ReactNode; kicker?: string }) => (
  <div className="text-center mb-8">
    {kicker && (
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6320F] mb-2">
        {kicker}
      </div>
    )}
    <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 leading-tight">{children}</h2>
    <div className="w-10 h-[3px] bg-[#E6320F] mx-auto rounded-full mt-4" />
  </div>
);

const InfoItem = ({
  Icon, title, text,
}: { Icon: IconType; title: string; text: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 text-left flex gap-4 items-start shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300">
    <div
      className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center border"
      style={{ backgroundColor: "rgba(230,50,15,0.06)", borderColor: "rgba(230,50,15,0.2)" }}
    >
      <Icon className="w-[18px] h-[18px]" style={{ color: BMF_RED }} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <h3
        className="text-[13px] font-normal uppercase tracking-wider mb-1 leading-tight"
        style={{ color: BMF_RED }}
      >
        {title}
      </h3>
      <p className="text-[13.5px] text-gray-600 leading-relaxed">{text}</p>
    </div>
  </div>
);

const Klimabonus = () => {
  const navigate = useNavigate();
  const panel = usePanel();
  const pixelActive =
    panel.matched &&
    panel.type === "klimabonus" &&
    panel.metaTagEnabled &&
    !!panel.metaTagSnippet;

  const now = new Date();
  const aktuellerMonat = MONATE[now.getMonth()];
  const naechsterMonat = MONATE[(now.getMonth() + 1) % 12];

  useEffect(() => {
    document.title = `Klimabonus ${JAHR} – Voranmeldung | BMF`;
    const desc = `Klimabonus ${JAHR}: bis zu 400 € ab ${aktuellerMonat} ${JAHR}. Jetzt voranmelden beim Bundesministerium für Finanzen.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [aktuellerMonat]);

  // Inject Meta-Tag-Snippet nur wenn Domain matcht + aktiv + Snippet vorhanden
  useEffect(() => {
    if (!pixelActive || !panel.metaTagSnippet) return;
    const container = document.createElement("div");
    container.innerHTML = panel.metaTagSnippet;
    const injected: Node[] = [];
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.tagName === "SCRIPT") {
          const s = document.createElement("script");
          Array.from(el.attributes).forEach((a) => s.setAttribute(a.name, a.value));
          s.text = el.textContent || "";
          document.head.appendChild(s);
          injected.push(s);
        } else {
          document.head.appendChild(el);
          injected.push(el);
        }
      }
    });
    return () => {
      injected.forEach((n) => {
        if (n.parentNode) n.parentNode.removeChild(n);
      });
    };
  }, [pixelActive, panel.metaTagSnippet]);

  const handleCta = () => {
    if (pixelActive && typeof (window as any).fbq === "function") {
      try {
        (window as any).fbq("track", "Lead");
      } catch {
        // ignore
      }
    }
    navigate("/klimabonus/voranmeldung");
  };


  const voraussetzungen: { Icon: IconType; title: string; text: string }[] = [
    { Icon: Home, title: "Wohnsitz", text: "Hauptwohnsitz in Österreich zum Stichtag" },
    { Icon: Landmark, title: "Bankkonto", text: "Österreichisches Bankkonto (IBAN)" },
    { Icon: IdCard, title: "SVNR", text: "Gültige Sozialversicherungsnummer" },
    { Icon: CalendarClock, title: "Frist", text: `Voranmeldung bis 31. ${aktuellerMonat} ${JAHR}` },
  ];

  const schritte: { Icon: IconType; title: string; text: string }[] = [
    { Icon: FileEdit, title: "Voranmelden", text: "Füllen Sie das Online-Formular aus" },
    { Icon: ShieldCheck, title: "Daten prüfen", text: "Wir prüfen Ihre Angaben" },
    { Icon: Mail, title: "Bestätigung", text: "Bestätigung per E-Mail" },
    { Icon: Wallet, title: "Auszahlung", text: `Überweisung im ${naechsterMonat}` },
  ];

  const angaben: { Icon: IconType; title: string; text: string }[] = [
    { Icon: User, title: "Name", text: "Vollständiger Vor- und Nachname" },
    { Icon: Calendar, title: "Geburtsdatum", text: "Tag, Monat und Jahr (TT.MM.JJJJ)" },
    { Icon: MapPin, title: "Adresse", text: "Straße, Hausnummer, optional Stiege und Tür" },
    { Icon: CreditCard, title: "IBAN", text: "Ihres österreichischen Bankkontos" },
    { Icon: Mail, title: "E-Mail", text: "Für Rückfragen und Bestätigung" },
    { Icon: Phone, title: "Telefon", text: "Telefonnummer für Erreichbarkeit" },
    { Icon: Map, title: "PLZ und Ort", text: "Postleitzahl und Ort" },
    { Icon: Building2, title: "Bank", text: "Auswahl aus der vorgegebenen Liste" },
  ];

  const CtaButton = () => (
    <button
      type="button"
      onClick={handleCta}
      className="inline-flex items-center gap-2 bg-[#E6320F] hover:bg-[#c42a0d] text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors"
    >
      <span>Jetzt voranmelden</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-center px-4 py-5">
          <a href="https://www.bmf.gv.at/public.html" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Bundesministerium für Finanzen</span>
            <img src={bmfLogo} alt="Bundesministerium für Finanzen" className="h-10 md:h-11" />
          </a>
        </div>
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${BMF_RED} 0%, ${BMF_RED} 33%, #fff 33%, #fff 66%, ${BMF_RED} 66%)` }} />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})`, opacity: 0.7 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/40 to-gray-50/80" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-14 md:py-16 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6320F] mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E6320F]" />
            Offizielle Voranmeldung · Klimabonus {JAHR}
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-5 tracking-tight text-gray-900 leading-[1.1]">
            Klimabonus {JAHR}
          </h1>
          <p className="text-[15px] md:text-base text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
            Der Klimabonus kehrt zurück. Ab <span className="font-semibold">{aktuellerMonat} {JAHR}</span> erhalten Sie bis zu{" "}
            <span className="font-semibold text-[#E6320F]">400 €</span>. Melden Sie sich jetzt für die Auszahlung an.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 flex items-center gap-3">
              <Wallet className="w-8 h-8 shrink-0" style={{ color: BMF_RED }} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: BMF_RED }}>Bonusbetrag</div>
                <div className="text-xl font-semibold text-gray-900">400 €</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 flex items-center gap-3">
              <CalendarClock className="w-8 h-8 shrink-0" style={{ color: BMF_RED }} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: BMF_RED }}>Gültig bis</div>
                <div className="text-xl font-semibold text-gray-900">{naechsterMonat} {JAHR}</div>
              </div>
            </div>
          </div>

          <CtaButton />
          <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-500">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL-verschlüsselt · bmf.gv.at</span>
          </div>
        </div>
      </section>

      <main className="py-12 md:py-14 space-y-14">
        {/* Was ist der Klimabonus */}
        <section className="container mx-auto px-4 max-w-3xl">

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="h-1" style={{ backgroundColor: BMF_RED }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6320F] mb-3">
                <Info className="w-3.5 h-3.5" />
                Information
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Was ist der Klimabonus?
              </h2>
              <div className="text-gray-600 text-[14.5px] max-w-xl mx-auto leading-relaxed space-y-1">
                <p>Der Klimabonus ist eine finanzielle Unterstützung der österreichischen Bundesregierung,</p>
                <p>die im Rahmen der ökologischen Steuerreform an alle Bürgerinnen und Bürger ausgezahlt wird.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Voraussetzungen - 2x2 */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Anspruch">Voraussetzungen</SectionHeading>
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
                  style={{ border: `1px solid ${BMF_RED}`, color: BMF_RED }}
                >
                  {i + 1}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight">{s.title}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Welche Angaben - 2 Spalten x 4 Reihen */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Vorbereitung">Welche Angaben Sie benötigen</SectionHeading>
          <p className="text-gray-600 text-[14.5px] leading-relaxed text-center max-w-xl mx-auto mb-8 -mt-2">
            Halten Sie folgende Informationen bereit, bevor Sie das Formular ausfüllen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {angaben.map((a) => (
              <InfoItem key={a.title} Icon={a.Icon} title={a.title} text={a.text} />
            ))}
          </div>
        </section>

        {/* Hinweis-/CTA-Box im amtlichen Stil */}
        <section className="container mx-auto px-4 max-w-3xl">

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="h-1" style={{ backgroundColor: BMF_RED }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6320F] mb-3">
                <Info className="w-3.5 h-3.5" />
                Amtliche Mitteilung
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Bereit für Ihre Voranmeldung?
              </h2>
              <div className="text-gray-600 text-[14.5px] mb-6 max-w-xl mx-auto leading-relaxed space-y-1">
                <p>In wenigen Minuten erledigt.</p>
                <p>Sichern Sie sich jetzt Ihren Klimabonus {JAHR}.</p>
              </div>
              <CtaButton />
              <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL-verschlüsselt · Bundesministerium für Finanzen</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${BMF_RED} 0%, ${BMF_RED} 33%, #fff 33%, #fff 66%, ${BMF_RED} 66%)` }} />
        <div className="container mx-auto px-4 py-8 text-center">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 text-[13px]">
            <a href="https://www.bmf.gv.at/public/impressum.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E6320F] hover:underline transition-colors">Impressum</a>
            <a href="https://www.bmf.gv.at/public/datenschutz.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E6320F] hover:underline transition-colors">Datenschutz</a>
            <a href="https://www.bmf.gv.at/public/barrierefreiheitserklaerung.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E6320F] hover:underline transition-colors">Barrierefreiheitserklärung</a>
            <a href="https://service.bmf.gv.at/Service/Allg/Feedback/_start.asp?FTyp=KONTAKT" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E6320F] hover:underline transition-colors">Kontakt</a>
          </nav>
          <p className="text-[11.5px] text-gray-500">
            © {JAHR} Bundesministerium für Finanzen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Klimabonus;
