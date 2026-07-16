import { useEffect } from "react";
import { CalendarDays, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePanel } from "@/components/PanelProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PRIMARY = "#a52a2a"; // Austria red-ish
const PRIMARY_DARK = "#7f1d1d";
const SECONDARY = "#1f2937"; // slate-800
const SURFACE = "#f8fafc";
const BORDER = "#e5e7eb";
const MUTED = "#64748b";
const TEXT = "#0f172a";

function AustriaFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-col overflow-hidden rounded-[2px] border ${className}`}
      style={{ borderColor: "rgba(255,255,255,0.2)" }}
    >
      <span className="h-1/3" style={{ background: PRIMARY }} />
      <span className="h-1/3 bg-white" />
      <span className="h-1/3" style={{ background: PRIMARY }} />
    </span>
  );
}

function AustriaFlagLight({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-col overflow-hidden rounded-[2px] border ${className}`}
      style={{ borderColor: BORDER }}
    >
      <span className="h-1/3" style={{ background: PRIMARY }} />
      <span className="h-1/3 bg-white" />
      <span className="h-1/3" style={{ background: PRIMARY }} />
    </span>
  );
}

export function Nav() {
  const links = [
    { hash: "ueberblick", label: "Überblick" },
    { hash: "anspruch", label: "Anspruch" },
    { hash: "ablauf", label: "Ablauf" },
    { hash: "fristen", label: "Fristen" },
    { hash: "faq", label: "FAQ" },
  ];
  const onSectionClick = (hash: string) => (e: React.MouseEvent) => {
    if (window.location.pathname === "/klima-white") {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${hash}`);
    }
  };
  return (
    <header id="top">
      <div className="border-b" style={{ background: SECONDARY, color: "#fff", borderColor: BORDER }}>
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 text-xs">
          <AustriaFlag className="h-3 w-4" />
          <span className="opacity-90">Information zum Klimabonus 2026 · Republik Österreich</span>
          <span className="ml-auto hidden opacity-70 sm:inline">Deutsch (AT)</span>
        </div>
      </div>
      <div
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ borderColor: BORDER, background: "rgba(255,255,255,0.95)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/klima-white" className="flex items-center gap-3">
            <AustriaFlagLight className="h-6 w-9" />
            <div className="leading-tight">
              <div className="text-base font-semibold" style={{ color: TEXT }}>
                Klimabonus 2026
              </div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
                Informationsportal
              </div>
            </div>
          </Link>
          <nav className="hidden gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.hash}
                href={`#${l.hash}`}
                onClick={onSectionClick(l.hash)}
                className="text-sm transition"
                style={{ color: "rgba(15,23,42,0.75)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="border-b" style={{ borderColor: BORDER, background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr]">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-xs font-medium"
              style={{ borderColor: BORDER, background: SURFACE, color: MUTED }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: PRIMARY }} />
              Klimabonus 2026 · Antragsfrist läuft
            </div>
            <h1 className="mt-5 text-4xl leading-[1.1] md:text-5xl" style={{ color: TEXT }}>
              Klimabonus 2026
            </h1>
            <p className="mt-4 text-lg md:text-xl" style={{ color: "rgba(15,23,42,0.8)" }}>
              400 Euro Entlastung für Menschen mit Hauptwohnsitz in Österreich.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: MUTED }}>
              Der Klimabonus ist eine jährliche Direktzahlung des Bundes zum Ausgleich der
              CO₂-Bepreisung. Anspruchsberechtigte Personen erhalten den Bonus nach Prüfung der
              Voraussetzungen im Laufe des Jahres 2026 – automatisch oder nach rechtzeitiger
              Anmeldung bis zum <strong style={{ color: TEXT }}>1. August 2026</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onCta}
                className="inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 text-sm font-medium transition cursor-pointer"
                style={{ borderColor: BORDER, background: "#fff", color: TEXT }}
              >
                Überblick lesen
              </button>
            </div>
          </div>

          <aside className="rounded-sm border p-6" style={{ borderColor: BORDER, background: SURFACE }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
              <CalendarDays className="h-4 w-4" />
              Einreichfrist
            </div>
            <div className="mt-2 text-3xl font-semibold" style={{ color: TEXT }}>
              1. August 2026
            </div>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              Anträge müssen bis zu diesem Datum eingebracht sein. Automatisch erfasste Personen benötigen keine gesonderte Anmeldung.
            </p>
            <div className="mt-5 border-t pt-4 text-sm" style={{ borderColor: BORDER }}>
              {[
                ["Bonus je Person", "400 €"],
                ["Kinder & Jugendliche", "200 €"],
                ["Auszahlungsphase", "2026"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5">
                  <span style={{ color: MUTED }}>{k}</span>
                  <span className="font-medium" style={{ color: TEXT }}>{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div
          className="mt-10 flex items-start gap-3 rounded-sm border p-4 text-sm"
          style={{ borderColor: BORDER, background: SURFACE, color: MUTED }}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: PRIMARY }} />
          <p>
            Dies ist ein unabhängiges Informationsangebot. Rechtsverbindliche Auskünfte und die
            offizielle Antragstellung erfolgen ausschließlich über die zuständigen Bundesstellen
            der Republik Österreich.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: PRIMARY }}>{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl" style={{ color: TEXT }}>{title}</h2>
      {description && <p className="mt-3 text-base" style={{ color: MUTED }}>{description}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="ueberblick" className="border-b py-16 md:py-20" style={{ borderColor: BORDER, background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Überblick" title="Was ist der Klimabonus?" />
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <p className="text-base leading-relaxed" style={{ color: "rgba(15,23,42,0.85)" }}>
            Der Klimabonus ist eine gesetzlich vorgesehene, jährliche Zahlung des Bundes an in Österreich
            lebende Personen. Er dient dem sozialen Ausgleich der CO₂-Bepreisung und wird unabhängig von
            Einkommen oder Erwerbsstatus gewährt.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "rgba(15,23,42,0.85)" }}>
            Für das Jahr 2026 beträgt der Bonus einheitlich 400 Euro pro anspruchsberechtigter volljähriger
            Person. Kinder und Jugendliche unter 18 Jahren erhalten den halben Betrag. Die Auszahlung erfolgt
            in mehreren Wellen im Laufe des Jahres.
          </p>
        </div>
        <dl
          className="mt-10 grid gap-px overflow-hidden rounded-sm border md:grid-cols-3"
          style={{ borderColor: BORDER, background: BORDER }}
        >
          {[
            { k: "Bonushöhe 2026", v: "400 € pro Person" },
            { k: "Kinder & Jugendliche", v: "200 € pro Person" },
            { k: "Einreichfrist", v: "1. August 2026" },
          ].map((i) => (
            <div key={i.k} className="px-6 py-5" style={{ background: "#fff" }}>
              <dt className="text-xs uppercase tracking-wider" style={{ color: MUTED }}>{i.k}</dt>
              <dd className="mt-1 text-2xl font-semibold" style={{ color: TEXT }}>{i.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Eligibility() {
  const items = [
    { title: "Hauptwohnsitz in Österreich", text: "Anspruchsberechtigt sind Personen, die im Bezugsjahr über einen gemeldeten Hauptwohnsitz in Österreich verfügen." },
    { title: "Aufenthaltsdauer", text: "Der Wohnsitz muss im Kalenderjahr 2026 an mindestens 183 Tagen bestehen. Kurzfristige Auslandsaufenthalte sind unschädlich." },
    { title: "Kinder und Jugendliche", text: "Personen unter 18 Jahren erhalten 50 Prozent des Bonus. Die Auszahlung erfolgt an die obsorgeberechtigte Person." },
    { title: "Sonderfälle", text: "Für Personen in stationärer Pflege, Haft oder mit längerem Auslandsaufenthalt gelten gesonderte Regelungen. Details siehe klimabonus.gv.at." },
  ];
  return (
    <section id="anspruch" className="border-b py-16 md:py-20" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Anspruch"
          title="Wer erhält den Klimabonus?"
          description="Der Bonus steht grundsätzlich allen Personen mit Lebensmittelpunkt in Österreich zu. Folgende Voraussetzungen müssen erfüllt sein."
        />
        <dl className="mt-10 overflow-hidden rounded-sm border" style={{ borderColor: BORDER, background: "#fff" }}>
          {items.map((i, idx) => (
            <div
              key={i.title}
              className="grid gap-2 px-6 py-5 md:grid-cols-[280px_1fr] md:gap-8"
              style={{ borderTop: idx === 0 ? "none" : `1px solid ${BORDER}` }}
            >
              <dt className="text-sm font-semibold" style={{ color: TEXT }}>{i.title}</dt>
              <dd className="text-sm leading-relaxed" style={{ color: MUTED }}>{i.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: 1, title: "Voraussetzungen prüfen", text: "Kontrolle des Hauptwohnsitzes und der Aufenthaltsdauer im Kalenderjahr 2026." },
    { n: 2, title: "Automatische Erfassung prüfen", text: "In den meisten Fällen erfolgt die Bearbeitung automatisch über die beim Finanzamt hinterlegten Daten." },
    { n: 3, title: "Bei Bedarf anmelden", text: "Ist keine Kontoverbindung hinterlegt oder liegen besondere Umstände vor, ist bis 1. August 2026 ein Antrag zu stellen." },
    { n: 4, title: "Auszahlung erhalten", text: "Die Überweisung erfolgt auf das hinterlegte Konto. In Ausnahmefällen wird ein RSa-Brief mit Gutschein zugestellt." },
  ];
  return (
    <section id="ablauf" className="border-b py-16 md:py-20" style={{ borderColor: BORDER, background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Ablauf"
          title="So funktioniert die Auszahlung"
          description="Der Ablauf ist gesetzlich geregelt und läuft für den Großteil der Berechtigten automatisch."
        />
        <ol className="mt-10 overflow-hidden rounded-sm border" style={{ borderColor: BORDER, background: "#fff" }}>
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="grid gap-3 px-6 py-5 md:grid-cols-[64px_260px_1fr] md:items-baseline md:gap-6"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${BORDER}` }}
            >
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>Schritt {s.n}</span>
              <span className="text-base font-semibold" style={{ color: TEXT }}>{s.title}</span>
              <span className="text-sm leading-relaxed" style={{ color: MUTED }}>{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const DEADLINE = new Date("2026-08-01T23:59:59+02:00").getTime();
function Deadlines() {
  const days = Math.max(0, Math.ceil((DEADLINE - Date.now()) / 86_400_000));
  const rows = [
    { phase: "Automatische Bearbeitung", period: "laufend ab Frühjahr 2026", note: "Kein Handeln erforderlich, sofern Kontodaten aktuell sind." },
    { phase: "Antragsfrist", period: "bis 1. August 2026", note: "Frist für Personen, die nicht automatisch erfasst werden." },
    { phase: "Auszahlungsphase", period: "Kalenderjahr 2026", note: "Überweisung erfolgt gestaffelt nach Bearbeitung." },
    { phase: "Nachfrist / Einspruch", period: "nach Zustellung des Bescheids", note: "Details und Rechtsmittelbelehrung im Auszahlungsbescheid." },
  ];
  return (
    <section id="fristen" className="border-b py-16 md:py-20" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Fristen"
          title="Wichtige Termine im Überblick"
          description="Die Antragsfrist ist die zentrale Deadline. Wer sie versäumt, verliert den Anspruch für 2026."
        />
        <div className="mt-8 rounded-sm border p-6 md:p-8" style={{ borderColor: BORDER, background: "#fff" }}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                Verbleibende Zeit bis zur Antragsfrist
              </div>
              <div className="mt-1 text-3xl font-semibold" style={{ color: TEXT }}>
                Noch {days} {days === 1 ? "Tag" : "Tage"}
              </div>
            </div>
            <div className="text-sm" style={{ color: MUTED }}>
              Stichtag: <span className="font-medium" style={{ color: TEXT }}>1. August 2026, 23:59 Uhr (MEZ)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-sm border" style={{ borderColor: BORDER, background: "#fff" }}>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider" style={{ background: SURFACE, color: MUTED }}>
              <tr>
                <th className="px-6 py-3 font-semibold">Phase</th>
                <th className="px-6 py-3 font-semibold">Zeitraum</th>
                <th className="px-6 py-3 font-semibold">Hinweis</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.phase} style={{ borderTop: i === 0 ? "none" : `1px solid ${BORDER}` }}>
                  <td className="px-6 py-4 font-medium" style={{ color: TEXT }}>{r.phase}</td>
                  <td className="px-6 py-4" style={{ color: "rgba(15,23,42,0.8)" }}>{r.period}</td>
                  <td className="px-6 py-4" style={{ color: MUTED }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Muss ich mich aktiv anmelden?", a: "In vielen Fällen erfolgt die Auszahlung automatisch. Wer nicht automatisch erfasst ist – z. B. ohne aktuelle Kontoverbindung beim Finanzamt – muss sich bis 01.08.2026 aktiv anmelden." },
    { q: "Wann wird der Klimabonus 2026 ausgezahlt?", a: "Die Auszahlung erfolgt fortlaufend im Laufe des Jahres 2026, in der Regel per Überweisung, in Einzelfällen per RSa-Brief mit Gutschein." },
    { q: "Bekommen Kinder auch den Klimabonus?", a: "Ja. Kinder und Jugendliche unter 18 Jahren erhalten 50 % des regulären Bonus. Die Auszahlung erfolgt an die Erziehungsberechtigten." },
    { q: "Was passiert, wenn ich innerhalb Österreichs umgezogen bin?", a: "Der Anspruch bleibt bestehen. Wichtig ist ein gemeldeter Hauptwohnsitz in Österreich für mindestens 183 Tage im Jahr 2026." },
    { q: "Ist der Klimabonus steuerpflichtig?", a: "Nein, der Klimabonus ist steuerfrei und wird nicht auf Sozialleistungen angerechnet." },
    { q: "Wo bekomme ich offizielle Hilfe?", a: "Die offizielle Anlaufstelle ist klimabonus.gv.at sowie die kostenlose Service-Hotline der Republik Österreich." },
  ];
  return (
    <section id="faq" className="border-b py-16 md:py-20" style={{ borderColor: BORDER, background: "#fff" }}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Häufige Fragen" title="Antworten auf einen Blick" />
        <Accordion type="single" collapsible className="mt-8 overflow-hidden rounded-sm border" style={{ borderColor: BORDER, background: "#fff" } as React.CSSProperties}>
          {items.map((it, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="last:border-0" style={{ borderColor: BORDER } as React.CSSProperties}>
              <AccordionTrigger className="px-6 py-4 text-left text-base font-medium hover:no-underline" style={{ color: TEXT }}>
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-sm leading-relaxed" style={{ color: MUTED }}>
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background: SECONDARY, color: "#fff" }}>
      <div className="mx-auto max-w-6xl px-4 py-14 text-sm">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <AustriaFlag className="h-6 w-9" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">Klimabonus 2026</div>
                <div className="text-[11px] uppercase tracking-wider opacity-70">Informationsportal</div>
              </div>
            </div>
            <p className="mt-4 max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>
              Diese Website ist ein unabhängiges Informationsangebot zum österreichischen Klimabonus 2026.
              Sie ist keine offizielle Seite der Republik Österreich. Rechtsverbindliche Auskünfte erteilen
              ausschließlich die zuständigen Bundesstellen.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)" }}>
              Rechtliches
            </h4>
            <ul className="mt-3 space-y-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              <li>
                <Link to="/klima-white/impressum" className="hover:text-white">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-10 flex flex-col justify-between gap-3 border-t pt-6 text-xs md:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
        >
          <p>© {new Date().getFullYear()} Klimabonus 2026 Informationsportal · Alle Angaben ohne Gewähr</p>
          <p>Stand: Juli 2026</p>
        </div>
      </div>
    </footer>
  );
}

const KlimaWhite = () => {
  const panel = usePanel();
  const navigate = useNavigate();

  const pixelActive =
    panel.matched &&
    (panel.type === "klimabonus" || panel.type === "klimabonus_2") &&
    panel.metaTagEnabled &&
    !!panel.metaTagSnippet;

  // Inject Meta-Tag-Snippet (pixel)
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
    navigate("/klima-white/impressum");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#fff",
        color: TEXT,
        fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif",
      }}
    >
      <Nav />
      <main>
        <Hero onCta={handleCta} />
        <About />
        <Eligibility />
        <Steps />
        <Deadlines />
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
};

export default KlimaWhite;

export { PRIMARY as KW_PRIMARY, SECONDARY as KW_SECONDARY, BORDER as KW_BORDER, TEXT as KW_TEXT, MUTED as KW_MUTED, SURFACE as KW_SURFACE };
