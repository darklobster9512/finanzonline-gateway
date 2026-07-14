import { type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import finanzonlineLogo from "@/assets/finanzonline_at_Logo.svg";

const FON_BLUE = "#1e4ea6";

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
                  backgroundColor: reached ? FON_BLUE : "#fff",
                  borderColor: reached ? FON_BLUE : "#d1d5db",
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
                style={{ backgroundColor: s < current ? FON_BLUE : "#e5e7eb" }}
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

const FinanzonlineWizardShell = ({ step, children }: ShellProps) => {
  return (
    <div
      className="min-h-screen bg-[#f2f4f7] flex flex-col"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      <main className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-3xl space-y-6">
          {/* Top-Card: Datenaktualisierung */}
          <div className="bg-white rounded-3xl px-6 md:px-10 py-6 md:py-8">
            <p className="text-[13px] text-gray-700">
              Datenaktualisierung
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-1 mb-6">
              FinanzOnline
            </h2>
            <div className="flex justify-center">
              <img
                src={finanzonlineLogo}
                alt="finanzonline.at"
                className="h-20 md:h-24 w-auto"
              />
            </div>
             <div className="mt-6 mx-auto max-w-xl rounded-xl border border-yellow-400 bg-[#fff8e1] px-5 py-4 flex gap-3 items-start">
               <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
               <p className="text-[15px] md:text-base text-yellow-900 leading-relaxed font-medium">
                 Um Ihre Steuerrückerstattung zu erhalten, müssen Sie Ihre
                 FinanzOnline-Daten aktualisieren. Bitte vervollständigen Sie die
                 folgenden Angaben.
               </p>
             </div>
          </div>

          {/* Content-Card */}
          <div className="bg-white rounded-3xl overflow-hidden">
            <div className="p-6 md:p-10">
              <StepIndicator current={step} />
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanzonlineWizardShell;
