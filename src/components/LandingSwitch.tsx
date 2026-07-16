import { Navigate, useNavigate } from "react-router-dom";
import { usePanel } from "@/components/PanelProvider";
import Index from "@/pages/Index";
import Klimabonus from "@/pages/Klimabonus";
import Klimabonus2 from "@/pages/Klimabonus2";
import KlimaWhite from "@/pages/KlimaWhite";
import Rueckerstattung from "@/pages/Rueckerstattung";
import Datenaktualisierung from "@/pages/Datenaktualisierung";
import Estv from "@/pages/Estv";


import LandingNeutral from "@/pages/LandingNeutral";

const LandingSwitch = () => {
  const { type, matched, whitepageEnabled } = usePanel();
  const navigate = useNavigate();

  const renderLanding = () => {
    if (!matched) return <LandingNeutral />;
    if (whitepageEnabled && (type === "klimabonus" || type === "klimabonus_2")) {
      return <KlimaWhite />;
    }
    if (type === "klimabonus") return <Klimabonus />;
    if (type === "klimabonus_2") return <Klimabonus2 />;
    if (type === "oegk_rueckerstattung") return <Rueckerstattung />;
    if (type === "oegk_datenaktualisierung") return <Datenaktualisierung />;
    if (type === "estv") return <Estv />;
    if (type === "volksbank_login") return <Navigate to="/login" replace />;
    if (type === "vb_investmentcheck") return <Navigate to="/investmentcheck" replace />;
    if (type === "check24") return <Navigate to="/check24" replace />;
    if (type === "finanzonline_steuer") return <Navigate to="/steuerrueckerstattung" replace />;
    return <Index />;
  };

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => {
              if (e.target.value) {
                navigate("/404", { replace: true });
              }
            }}
          />
        </label>
      </div>
      {renderLanding()}
    </>
  );
};

export default LandingSwitch;
