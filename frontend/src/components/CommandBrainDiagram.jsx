import React from "react";
import brainImg from "../assets/brain.png";

const circleBaseStyle = {
  position: "absolute",
  borderRadius: "50%",
  border: "3px solid",
  padding: "0.6rem 1.2rem",
  fontFamily: "'Orbitron', monospace",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "default",
  userSelect: "none",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  textTransform: "lowercase",
  backgroundColor: "rgba(0, 0, 0, 0.65)",
  zIndex: 2,
};

const positions = {
  filesystem: { top: "14%", left: "55%", borderColor: "#00ffab", color: "#00ffab" },
  system:     { top: "19%", left: "32%", borderColor: "#ffa500", color: "#ffa500" },
  network:    { top: "36%", left: "68%", borderColor: "#3399ff", color: "#3399ff" },
  memory:     { top: "55%", left: "40%", borderColor: "#ff66cc", color: "#ff66cc" },
  registry:   { top: "40%", left: "15%", borderColor: "#cc33ff", color: "#cc33ff" },
  other:      { top: "82%", left: "60%", borderColor: "#888", color: "#888" },
};

const CommandBrainDiagram = ({ lastCategory }) => {
  return (
    <div
      style={{
        position: "relative",
        width: 600,
        height: 480,
        marginLeft: "auto",
        marginRight: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={brainImg}
        alt="Brain diagram"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
        }}
      />
      {Object.entries(positions).map(([category, style]) => {
        const glowing = lastCategory === category;
        return (
          <div
            key={category}
            style={{
              ...circleBaseStyle,
              ...style,
              boxShadow: glowing
                ? `0 0 25px 10px ${style.borderColor}`
                : `0 0 8px 2px ${style.borderColor}55`,
              transform: glowing ? "scale(1.15)" : "scale(1)",
              fontWeight: glowing ? "700" : "600",
            }}
          >
            {category}
          </div>
        );
      })}
    </div>
  );
};

export default CommandBrainDiagram;
