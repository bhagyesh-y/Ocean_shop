import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CustomerService = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setFadeIn(true);
        const timers = [1, 2, 3].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 300)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div
            className={`container py-5 ${fadeIn ? "opacity-100" : "opacity-0"}`}
            style={{
                background: "linear-gradient(180deg, #ade8f4, #00b4d8, #0077b6)",
                borderRadius: "12px",
                color: "#03045e",
                transition: "opacity 1.2s ease, transform 0.8s ease",
                transform: fadeIn ? "translateY(0)" : "translateY(20px)",
            }}
        >
            <h1 className="text-center fw-bold mb-5">Customer Service 🪸</h1>

            {visibleSections.includes(1) && (
                <section className="fade-up mb-5">
                    <h3>📞 Help Center</h3>
                    <p>
                        Need help? Our support team is available 24/7 via live chat, email, or the Contact Us page.
                    </p>
                </section>
            )}

            {visibleSections.includes(2) && (
                <section className="fade-up mb-5">
                    <h3>🔄 Returns</h3>
                    <p>
                        Not satisfied with your product? You can return it within 7 days for a full refund.
                    </p>
                </section>
            )}

            {visibleSections.includes(3) && (
                <section className="fade-up">
                    <h3>🚚 Shipping Info</h3>
                    <p>
                        We deliver worldwide 🌍. Track your orders in real time from your Cartify dashboard.
                    </p>
                    <NavLink to="/quick-links" className="btn btn-outline-primary mt-3">
                        View Policies
                    </NavLink>
                </section>
            )}

            <style jsx="true">{`
        .fade-up {
          animation: fadeUp 0.9s ease both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default CustomerService;
