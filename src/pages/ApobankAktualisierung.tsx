import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-page-meta";
import faviconAsset from "@/assets/favicons/apobank.webp.asset.json";
import logoAsset from "@/assets/apobank-logo.svg.asset.json";

const FONT = "'TypoPRO Source Sans Pro', sans-serif";
const PRIMARY = "#012169";
const BODY_BG = "#F0F3F5";
const TEXT = "#1e325f";
const BORDER = "#ced4da";

const DEMO_DATA = {
  anrede: "Herr",
  titel: "Dr.",
  vorname: "Max",
  nachname: "Mustermann",
  geburtsname: "",
  geburtsdatum: "01.01.1985",
  geschlecht: "Männlich",
  familienstand: "Ledig",
};

const Field = ({ label, value, required }: { label: string; value: string; required?: boolean }) => (
  <div style={{ flex: "1 1 45%", minWidth: 220, marginBottom: 20 }}>
    <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: TEXT }}>
      {label}{required && <span style={{ color: "#c00" }}>*</span>}
    </label>
    <div
      style={{
        padding: "8px 12px",
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        backgroundColor: "#e9ecef",
        color: "#495057",
        fontSize: 15,
        minHeight: 38,
        lineHeight: "22px",
      }}
    >
      {value || "\u00A0"}
    </div>
  </div>
);

const ApobankAktualisierung = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Demo – Datenaktualisierung", faviconAsset.url);

  return (
    <div style={{ fontFamily: FONT, color: TEXT, backgroundColor: "#fff", minHeight: "100vh", fontSize: "1rem", lineHeight: 1.5 }}>
      {/* Demo banner */}
      <div style={{ background: "#fff3cd", color: "#856404", textAlign: "center", padding: "8px 16px", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #ffc107" }}>
        Demo – ausschließlich fiktive Testdaten
      </div>

      <div style={{ height: "2.5rem" }} />

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "0 12px" }}>
        {/* Title */}
        <h1 style={{ color: PRIMARY, fontSize: 28, fontWeight: 400, marginBottom: 4, fontFamily: "Arial, sans-serif" }}>
          Aktualisieren Sie Ihre Daten
        </h1>
        <div style={{ height: 3, width: 200, background: "#009b8d", marginBottom: 32 }} />

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          {/* Step 1 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              border: `2px solid ${step === 1 ? "#009b8d" : "#009b8d"}`,
              background: step >= 1 ? "#fff" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {step > 1 ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009b8d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009b8d" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
            </div>
            <span style={{ marginTop: 6, fontSize: 13, fontWeight: step === 1 ? 700 : 400, color: PRIMARY }}>Datenaktualisierung</span>
          </div>

          {/* Line */}
          <div style={{ flex: "1 1 auto", height: 2, background: step > 1 ? "#009b8d" : "#ccc", margin: "0 8px", alignSelf: "flex-start", marginTop: 28 }} />

          {/* Step 2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              border: `2px solid ${step === 2 ? "#009b8d" : "#ccc"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={step === 2 ? "#009b8d" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span style={{ marginTop: 6, fontSize: 13, fontWeight: step === 2 ? 700 : 400, color: step === 2 ? PRIMARY : "#999" }}>Bestätigung</span>
          </div>
        </div>

        {step === 1 && (
          <div style={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.18)", marginBottom: 32 }}>
            {/* Section header */}
            <div style={{ background: PRIMARY, color: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", gap: 14 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span style={{ fontWeight: 700, fontSize: 17 }}>Persönliche Informationen</span>
            </div>

            {/* Fields */}
            <div style={{ background: "#fff", padding: "28px 32px 12px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
                <Field label="Anrede" value={DEMO_DATA.anrede} required />
                <Field label="Titel (falls zutreffend)" value={DEMO_DATA.titel} />
                <Field label="Alle Vornamen gemäß Ausweis" value={DEMO_DATA.vorname} required />
                <Field label="Alle Nachnamen gemäß Ausweis" value={DEMO_DATA.nachname} required />
                <Field label="Abw. Geburtsname gemäß Ausweis" value={DEMO_DATA.geburtsname} />
                <Field label="Geburtsdatum" value={DEMO_DATA.geburtsdatum} required />
                <Field label="Geschlecht" value={DEMO_DATA.geschlecht} required />
                <Field label="Familienstand" value={DEMO_DATA.familienstand} required />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 8 }}>
                <button
                  onClick={() => { setStep(2); window.scrollTo(0, 0); }}
                  style={{
                    background: PRIMARY, color: "#fff", border: "none", borderRadius: 4,
                    padding: "10px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Weiter zur Bestätigung
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.18)", marginBottom: 32 }}>
            <div style={{ background: PRIMARY, color: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", gap: 14 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{ fontWeight: 700, fontSize: 17 }}>Bestätigung</span>
            </div>
            <div style={{ background: "#fff", padding: "32px 32px" }}>
              <p style={{ fontSize: 16, marginBottom: 24 }}>
                Die Datenaktualisierung wurde erfolgreich abgeschlossen. Dies ist eine reine Demo-Ansicht – es wurden keine echten Daten verarbeitet.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => { setStep(1); window.scrollTo(0, 0); }}
                  style={{
                    background: "transparent", color: PRIMARY, border: `1px solid ${PRIMARY}`, borderRadius: 4,
                    padding: "10px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                  }}
                >
                  Zurück
                </button>
                <button
                  onClick={() => navigate("/apobank")}
                  style={{
                    background: PRIMARY, color: "#fff", border: "none", borderRadius: 4,
                    padding: "10px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                  }}
                >
                  Zum Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer help */}
        <div style={{ borderTop: "1px solid #dee2e6", paddingTop: 24, marginTop: 8, marginBottom: 32 }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>Können wir Ihnen helfen?</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.68A2 2 0 0 1 22 16.92z"/></svg>
            <a href="#" style={{ color: TEXT, textDecoration: "underline" }}>0211 5998 0</a>
          </div>
          <div style={{ fontSize: 13, color: "#666", marginLeft: 24, marginBottom: 4 }}>
            Mo - Fr: 07:00 - 20:00 Uhr<br/>Sa: 09:00 - 16:00 Uhr
          </div>
          <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
            Alternativ können Sie einen Termin vereinbaren:<br/>
            <a href="#" style={{ color: TEXT, textDecoration: "underline" }}>apoBank Termine</a>
          </p>
        </div>
      </main>

      <footer style={{ padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #dee2e6" }}>
        <img src={logoAsset.url} alt="Logo" style={{ height: 48, width: "auto" }} />
      </footer>
    </div>
  );
};

export default ApobankAktualisierung;
