import { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";

const NAVY = "#012169";
const TEAL = "#009999";
const LABEL_COLOR = "#333";
const BORDER_COLOR = "#c5c5c5";
const FOCUS_BORDER = NAVY;

const steps = [
  { label: "Datenaktualisierung", icon: "user", active: true },
  { label: "Bestätigung", icon: "check", active: false },
];

const SelectField = ({
  label,
  required,
  placeholder = "Bitte wählen",
  extra,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  extra?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm" style={{ color: LABEL_COLOR }}>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
      {extra}
    </label>
    <div className="relative">
      <select
        className="w-full appearance-none rounded border bg-white px-3 py-2.5 text-sm outline-none transition-colors"
        style={{ borderColor: BORDER_COLOR }}
        onFocus={(e) => (e.currentTarget.style.borderColor = FOCUS_BORDER)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER_COLOR)}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
      >
        <path d="M1 1l5 5 5-5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

const InputField = ({
  label,
  required,
  placeholder,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm" style={{ color: LABEL_COLOR }}>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded border bg-white px-3 py-2.5 text-sm outline-none transition-colors"
      style={{ borderColor: BORDER_COLOR }}
      onFocus={(e) => (e.currentTarget.style.borderColor = FOCUS_BORDER)}
      onBlur={(e) => (e.currentTarget.style.borderColor = BORDER_COLOR)}
      autoComplete="off"
    />
  </div>
);

const DatenAktualisierungNeu = () => {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "'TypoPRO Source Sans Pro', 'Source Sans Pro', Arial, sans-serif", backgroundColor: "#fff" }}
    >
      {/* Header placeholder – eigenes Logo hier einfügen */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: "#e0e0e0" }}
      >
        <div className="mx-auto max-w-[960px]">
          <div className="h-8" />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-8">
        {/* Title */}
        <h1
          className="mb-1 text-[28px] font-normal leading-tight"
          style={{ color: NAVY }}
        >
          Aktualisieren Sie Ihre Daten
        </h1>
        <div className="mb-8 h-[3px] w-full rounded" style={{ backgroundColor: TEAL }} />

        {/* Stepper */}
        <div className="relative mx-auto mb-10 flex max-w-[480px] items-start justify-between">
          {/* Line behind */}
          <div
            className="absolute left-[25%] right-[25%] top-[28px] h-[2px]"
            style={{ backgroundColor: "#c5c5c5" }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border-2"
              style={{ borderColor: TEAL, backgroundColor: "#fff" }}
            >
              <User size={28} color={TEAL} />
            </div>
            <span className="text-sm font-semibold" style={{ color: NAVY }}>
              Datenaktualisierung
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border-2"
              style={{ borderColor: "#c5c5c5", backgroundColor: "#fff" }}
            >
              <CheckCircle2 size={28} color="#c5c5c5" />
            </div>
            <span className="text-sm" style={{ color: "#999" }}>
              Bestätigung
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#e0e0e0" }}>
          {/* Section header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ backgroundColor: NAVY }}
          >
            <User size={24} color="#fff" />
            <span className="text-base font-semibold text-white">
              Persönliche Informationen
            </span>
          </div>

          {/* Fields */}
          <div className="space-y-5 p-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField label="Anrede" required />
              <SelectField
                label="Titel (falls zutreffend)"
                extra={
                  <span className="ml-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded border text-[10px]" style={{ borderColor: NAVY, color: NAVY }}>
                    +
                  </span>
                }
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField label="Alle Vornamen gemäß Ausweis" required />
              <InputField label="Alle Nachnamen gemäß Ausweis" required />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField label="Abw. Geburtsname gemäß Ausweis" />
              <InputField label="Geburtsdatum" required placeholder="TT.MM.JJJJ" />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField label="Geschlecht" required />
              <SelectField label="Familienstand" required />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="rounded px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: NAVY }}
          >
            Weiter zur Anstellung
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-[960px] space-y-2 text-sm" style={{ color: "#555" }}>
          <p className="font-semibold" style={{ color: NAVY }}>
            Können wir Ihnen helfen?
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DatenAktualisierungNeu;
