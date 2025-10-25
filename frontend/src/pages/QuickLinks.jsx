import React, { useEffect, useState } from "react";

const QuickLinks = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    return (
        <div
            className={`container py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
            style={{
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                background: "linear-gradient(180deg, #90e0ef, #00b4d8, #0077b6)",
                borderRadius: "12px",
                color: "#03045e",
            }}
        >
            <h1 className="text-center fw-bold mb-4">Quick Links ⚓</h1>
            <div className="text-center">
                <p><strong>Privacy Policy:</strong> We value your data and ensure top-level security for all transactions.</p>
                <p><strong>Terms of Service:</strong> By using Cartify, you agree to fair usage and transparency in every order.</p>
                <p><strong>FAQs:</strong> Browse through our most asked questions to know more.</p>
            </div>
        </div>
    );
};

export default QuickLinks;
