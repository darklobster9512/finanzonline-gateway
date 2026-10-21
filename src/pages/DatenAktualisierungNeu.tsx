import { CheckCheck, ChevronDown, CopyPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./DatenAktualisierungNeu.css";

type PreviewFieldProps = {
  label: string;
  required?: boolean;
  value?: string;
  dropdown?: boolean;
  extra?: boolean;
};

function PreviewField({ label, required, value = "", dropdown, extra }: PreviewFieldProps) {
  return (
    <div className="data-preview-field">
      <div className="data-preview-label">
        <span>{label}{required && <em aria-hidden="true">*</em>}</span>
        {extra && <CopyPlus aria-hidden="true" />}
      </div>
      <div className="data-preview-value">
        <span>{value || (dropdown ? "Bitte wählen" : "\u00a0")}</span>
        {dropdown && <ChevronDown aria-hidden="true" />}
      </div>
    </div>
  );
}

export default function DatenAktualisierungNeu() {
  return (
    <div className="data-preview" aria-label="Statische Designvorschau">
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
            <PreviewField label="Anrede" required dropdown />
            <PreviewField label="Titel (falls zutreffend)" dropdown extra />
            <PreviewField label="Alle Vornamen gemäß Ausweis" required />
            <PreviewField label="Alle Nachnamen gemäß Ausweis" required />
            <PreviewField label="Abw. Geburtsname gemäß Ausweis" />
            <PreviewField label="Geburtsdatum" required value="TT.MM.JJJJ" />
            <div className="data-preview-last-row">
              <PreviewField label="Geschlecht" required dropdown />
              <PreviewField label="Familienstand" required dropdown />
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
