import { CheckCheck, CopyPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./DatenAktualisierungNeu.css";

type PreviewFieldProps = {
  label: string;
  required?: boolean;
  value?: string;
  type?: "text" | "tel" | "email";
  dropdown?: boolean;
  options?: string[];
  extra?: boolean;
};

function PreviewField({ label, required, value = "", type = "text", dropdown, options = [], extra }: PreviewFieldProps) {
  return (
    <div className="data-preview-field">
      <div className="data-preview-label">
        <span>{label}{required && <em aria-hidden="true">*</em>}</span>
        {extra && <CopyPlus aria-hidden="true" />}
      </div>
      <div className="data-preview-value">
        {dropdown ? (
          <Select>
            <SelectTrigger className="data-preview-select" aria-label={label}>
              <SelectValue placeholder="Bitte wählen" />
            </SelectTrigger>
            <SelectContent className={`data-preview-dropdown${label === "Titel (falls zutreffend)" ? " data-preview-title-dropdown" : ""}`} position="popper">
              {options.map((option) => (
                <SelectItem className="data-preview-option" key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <input
            type={type}
            className="data-preview-input"
            aria-label={label}
            defaultValue=""
            placeholder={value || "\u00a0"}
          />
        )}
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
            <PreviewField label="Titel (falls zutreffend)" dropdown options={["Dr.", "Dr. Dr.", "Dr. Dr. Dr.", "MUDr."]} extra />
            <PreviewField label="Alle Vornamen gemäß Ausweis" required />
            <PreviewField label="Alle Nachnamen gemäß Ausweis" required />
            <PreviewField label="Telefonnummer" type="tel" />
            <PreviewField label="E-Mail Adresse" type="email" />
            <PreviewField label="Straße" />
            <PreviewField label="Hausnummer" />
            <PreviewField label="PLZ" />
            <PreviewField label="Stadt" />
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
