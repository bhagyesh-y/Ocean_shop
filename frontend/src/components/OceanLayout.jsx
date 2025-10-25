// src/components/OceanLayout.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx"; // adjust path if needed
import Footer from "./Footer.jsx"; // adjust path if needed

const OceanLayout = ({ children }) => {
    const [atlanticFade, setAtlanticFade] = useState(false);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    return (
        <div
            className={`container-fluid p-0 ${atlanticFade ? "opacity-100" : "opacity-0"
                }`}
            style={{
                minHeight: "100vh",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                background: "linear-gradient(180deg, #caf0f8 0%, #00b4d8 100%)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Navbar />

            {/* 🌊 Main content section */}
            <div style={{ flex: "1" }}>{children}</div>

            <Footer />
        </div>
    );
};

export default OceanLayout;
