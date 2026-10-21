import { CheckCheck, ChevronDown, CopyPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./DatenAktualisierungNeu.css";

type PreviewFieldProps = {
  label: string;
  required?: boolean;
  value?: string;
  dropdown?: boolean;
  options?: string[];
  extra?: boolean;
};

function PreviewField({ label, required, value = "", dropdown, options = [], extra }: PreviewFieldProps) {
  return (
    <div className="data-preview-field">
      <div className="data-preview-label">
        <span>{label}{required && <em aria-hidden="true">*</em>}</span>
        {extra && <CopyPlus aria-hidden="true" />}
      </div>
      <div className="data-preview-value">
        {dropdown ? (
          <select
            className="data-preview-input data-preview-select"
            aria-label={label}
            defaultValue=""
          >
            <option value="" disabled>Bitte wählen</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            className="data-preview-input"
            aria-label={label}
            defaultValue={value}
            placeholder={value || "\u00a0"}
          />
        )}
        {dropdown && <ChevronDown aria-hidden="true" />}
      </div>
    </div>
  );
}

export default function DatenAktualisierungNeu() {
  return (
    <div className="data-preview" aria-label="Designvorschau mit ausfüllbaren Feldern">
      <header className="data-preview-header" aria-label="Logobereich" />
      <main className="data-preview-main">
        <h1>Aktualisieren Sie Ihre Daten</h1>
        <div className="data-preview-rule" />
        <div className="data-preview-steps" aria-label="Fortschritt">
          <div className="data-preview-step" aria-current="step">
            <div className="data-preview-person"><UserRound aria-hidden="true" /></div>
            <strong>Datenaktualisierung</strong>
          </div>
          <div className="data-preview-step">
            <div className="data-preview-check"><CheckCheck aria-hidden="true" /></div>
            <span>Bestätigung</span>
          </div>
        </div>
        <section className="data-preview-section" aria-labelledby="preview-personal-heading">
          <h2 id="preview-personal-heading"><UserRound aria-hidden="true" />Persönliche Informationen</h2>
          <div className="data-preview-fields">
            <PreviewField label="Anrede" required dropdown options={["Herr", "Frau", "Divers"]} />
            <PreviewField label="Titel (falls zutreffend)" dropdown options={["Dr.", "Prof.", "Mag.", "DI"]} extra />
            <PreviewField label="Alle Vornamen gemäß Ausweis" required />
            <PreviewField label="Alle Nachnamen gemäß Ausweis" required />
            <PreviewField label="Abw. Geburtsname gemäß Ausweis" />
            <PreviewField label="Geburtsdatum" required value="TT.MM.JJJJ" />
            <div className="data-preview-last-row">
              <PreviewField label="Geschlecht" required dropdown options={["männlich", "weiblich", "divers"]} />
              <PreviewField label="Familienstand" required dropdown options={["ledig", "verheiratet", "geschieden", "verwitwet", "eingetragene Partnerschaft"]} />
            </div>
          </div>
          <div className="data-preview-actions">
            <Button type="button" disabled>Weiter zur Anstellung</Button>
          </div>
        </section>
      </main>
      <footer className="data-preview-footer">
        <div className="data-preview-footer-inner">Können wir Ihnen helfen?</div>
      </footer>
      <div className="data-preview-bottom" />
    </div>
  );
}
