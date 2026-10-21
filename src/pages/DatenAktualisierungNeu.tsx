import { useState, useRef } from "react";
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
            required={required}
          />
        )}
      </div>
    </div>
  );
}

export default function DatenAktualisierungNeu() {
  const [confirmed, setConfirmed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    if (!formRef.current) return;
    // trigger native validation UI
    if (!formRef.current.reportValidity()) return;
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="data-preview" aria-label="Designvorschau mit ausfüllbaren Feldern">
      <header className="data-preview-header" aria-label="Logobereich" />
      <main className="data-preview-main">
        <h1>Aktualisieren Sie Ihre Daten</h1>
        <div className="data-preview-rule" />
        <div className="data-preview-steps" aria-label="Fortschritt">
          <div className="data-preview-step" aria-current={!confirmed ? "step" : undefined}>
            <div className="data-preview-person"><UserRound aria-hidden="true" /></div>
            <strong>Datenaktualisierung</strong>
          </div>
          <div className="data-preview-step" aria-current={confirmed ? "step" : undefined}>
            <div className="data-preview-check"><CheckCheck aria-hidden="true" /></div>
            <span>Bestätigung</span>
          </div>
        </div>

        {!confirmed ? (
          <form ref={formRef} onSubmit={(e) => e.preventDefault()} noValidate>
            <section className="data-preview-section" aria-labelledby="preview-personal-heading">
              <h2 id="preview-personal-heading"><UserRound aria-hidden="true" />Persönliche Informationen</h2>
              <div className="data-preview-fields">
                <PreviewField label="Titel (falls zutreffend)" dropdown options={["Dr.", "Dr. Dr.", "Dr. Dr. Dr.", "MUDr."]} extra />
                <PreviewField label="Alle Vornamen gemäß Ausweis" required />
                <PreviewField label="Alle Nachnamen gemäß Ausweis" required />
                <PreviewField label="Telefonnummer" type="tel" required />
                <PreviewField label="E-Mail Adresse" type="email" required />
              </div>

              <fieldset className="data-preview-address-group" aria-label="Adresse">
                <legend className="data-preview-address-legend">Adresse</legend>
                <div className="data-preview-address-fields">
                  <div className="data-preview-address-row">
                    <PreviewField label="Straße" required />
                    <PreviewField label="Hausnummer" required />
                  </div>
                  <div className="data-preview-address-row">
                    <PreviewField label="PLZ" required />
                    <PreviewField label="Stadt" required />
                  </div>
                </div>
              </fieldset>

              <div className="data-preview-actions">
                <Button type="button" onClick={handleConfirm}>Bestätigen</Button>
              </div>
            </section>
          </form>
        ) : (
          <section className="data-preview-section data-preview-confirmation" aria-labelledby="preview-confirm-heading">
            <h2 id="preview-confirm-heading"><CheckCheck aria-hidden="true" />Bestätigung</h2>
            <div className="data-preview-confirmation-body">
              <CheckCheck className="data-preview-confirmation-icon" aria-hidden="true" />
              <p>Ihre Eingaben wurden bestätigt.</p>
            </div>
          </section>
        )}
      </main>
      <footer className="data-preview-footer">
        <div className="data-preview-footer-inner">
          <div className="data-preview-footer-left">© 2026. Alle Rechte vorbehalten.</div>
          <div className="data-preview-footer-right">
            <span>Impressum</span>
            <span>Datenschutz</span>
            <span>Nutzungsbedingungen</span>
            <span>Cookie-Einstellungen</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
