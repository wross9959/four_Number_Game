import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const TopBar = () => {
  
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() =>
        document.body.classList.contains("dark")
    );


    const toggleDark = () => {
        document.body.classList.toggle("dark");
        setDarkMode(!darkMode);
    };

    return (
        <div
        style={{
            width: "100%",
            backgroundColor: darkMode ? "#000" : "#fff",
            color: darkMode ? "#fff" : "#000",
            borderBottom: "1px solid #ccc",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
        }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} onClick={() => navigate("/")}>
            <img src="/Logo.png" alt="Logo" style={{ height: "36px" }} />
            <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
                Willy.org Games
            </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* <button onClick={toggleDark}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button> */}
            {/* <button >👤 Profile</button> */}
        </div>
        </div>
    );
};

export default TopBar;
