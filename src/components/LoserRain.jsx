import React from "react";

const LoserRain = () => {
  const drops = Array.from({ length: 25 });

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1000 }}>
      {drops.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            animation: "fall 2s infinite",
            animationDelay: `${Math.random() * 2}s`,
            fontSize: "2rem",
            top: "-2rem",
          }}
        >
          😢
        </div>
      ))}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default LoserRain;
