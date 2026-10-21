import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FlaskConical, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DEMO_PERSON = [
  ["Anrede", "Herr"],
  ["Titel (falls zutreffend)", "Dr."],
  ["Alle Vornamen gemäß Ausweis", "Max"],
  ["Alle Nachnamen gemäß Ausweis", "Mustermann"],
  ["Abw. Geburtsname gemäß Ausweis", "Nicht zutreffend"],
  ["Geburtsdatum", "01.01.1985"],
  ["Geschlecht", "Männlich"],
  ["Familienstand", "Ledig"],
] as const;

export function DemoHeader() {
  return <header className="border-b border-border bg-background">
    <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-5"><FlaskConical className="h-7 w-7 text-primary" aria-hidden="true" /><span className="text-lg">Musterportal · Demo</span></div>
    <p className="bg-accent px-5 py-3 text-center text-sm text-accent-foreground">Demo – ausschließlich fiktive Testdaten</p>
  </header>;
}

export default function ApobankAktualisierung() {
  const [step, setStep] = useState<1 | 2>(1);
  useEffect(() => { document.title = "Datenaktualisierung – Demo"; }, []);
  return <div className="min-h-screen bg-background text-foreground">
    <DemoHeader />
    <main className="mx-auto max-w-4xl px-5 py-8 lg:py-10">
      <h1 className="text-3xl">Datenaktualisierung · Demo</h1>
      <div className="mb-8 mt-4 h-0.5 w-48 bg-primary" />
      <ol aria-label="Fortschritt" className="mb-9 grid grid-cols-2 border-b border-border pb-6">
        {["Datenaktualisierung", "Bestätigung"].map((label, index) => <li key={label} aria-current={step === index + 1 ? "step" : undefined} className="flex min-w-0 flex-col items-center gap-3 text-center text-sm">
          <span className={step === index + 1 ? "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground" : "flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"}>{index === 0 ? <UserRound aria-hidden="true" /> : <Check aria-hidden="true" />}</span>
          {label}
        </li>)}
      </ol>
      {step === 1 ? <section aria-labelledby="personal-heading">
        <div className="flex items-center gap-3 bg-primary px-5 py-5 text-primary-foreground"><UserRound aria-hidden="true" /><h2 id="personal-heading" className="text-xl">Persönliche Informationen · Muster</h2></div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 border-x border-b border-border p-5 lg:grid-cols-2 lg:p-7">
          {DEMO_PERSON.map(([label, value]) => <div key={label} className="min-w-0"><dt className="mb-2 text-sm text-muted-foreground">{label}</dt><dd className="min-h-11 break-words border border-border bg-muted px-3 py-3">{value}</dd></div>)}
        </dl>
        <div className="mt-8 flex justify-end"><Button className="h-auto min-h-11 whitespace-normal text-left" onClick={() => setStep(2)}>Weiter zur Demo-Bestätigung<ArrowRight aria-hidden="true" /></Button></div>
      </section> : <section aria-labelledby="confirmation-heading" className="py-8">
        <Check className="mb-5 h-12 w-12 text-primary" aria-hidden="true" />
        <h2 id="confirmation-heading" className="mb-3 text-2xl" tabIndex={-1}>Demo abgeschlossen</h2>
        <p role="status" className="max-w-xl text-muted-foreground">Die fiktiven Musterangaben wurden angezeigt. Es wurden keine Anmelde- oder Personendaten gespeichert oder übertragen.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />Zurück</Button><Button asChild><Link to="/apobank">Zum Demo-Einstieg</Link></Button></div>
      </section>}
    </main>
    <footer className="mx-auto mt-8 max-w-4xl border-t border-border px-5 py-6 text-sm text-muted-foreground">Musterportal · Kein Bankdienst</footer>
  </div>;
}
