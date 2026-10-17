import { useNavigate } from "react-router-dom";
import LandingNeutral from "@/pages/LandingNeutral";

const LandingSwitch = () => {
  const navigate = useNavigate();

  const renderLanding = () => <LandingNeutral />;

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
