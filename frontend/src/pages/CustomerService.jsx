import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CustomerService = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setFadeIn(true);
        const timers = [1, 2, 3, 4, 5].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 300)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="ocean-wrapper">
            {/* Floating FOG */}
            <div className="fog fog-1"></div>
            <div className="fog fog-2"></div>

            {/* Floating bubbles */}
            <div className="bubble b1"></div>
            <div className="bubble b2"></div>
            <div className="bubble b3"></div>
            <div className="bubble b4"></div>
            <div className="bubble b5"></div>

            <div
                className={`container py-5 position-relative ${fadeIn ? "opacity-100" : "opacity-0"}`}
                style={{
                    borderRadius: "12px",
                    color: "white",
                    transition: "opacity 1.2s ease, transform 0.8s ease",
                    transform: fadeIn ? "translateY(0)" : "translateY(20px)",
                }}
            >
                <h1 className="text-center fw-bold mb-5">Customer Service 🪸</h1>

                {/* --- Help Center --- */}
                {visibleSections.includes(1) && (
                    <section className="fade-up mb-5">
                        <h3>📞 Help Center</h3>
                        <p>
                            We are available 24/7 via live chat, email, and our Help Center.
                            Your satisfaction is our top priority! 💙
                        </p>
                    </section>
                )}

                {/* --- Returns --- */}
                {visibleSections.includes(2) && (
                    <section className="fade-up mb-5">
                        <h3>🔄 Returns & Refunds</h3>
                        <p>
                            You can return your product within <strong>7 days</strong> for a full refund —
                            no questions asked. Your peace of mind matters.
                        </p>
                    </section>
                )}

                {/* --- Shipping --- */}
                {visibleSections.includes(3) && (
                    <section className="fade-up mb-5">
                        <h3>🚚 Shipping & Delivery</h3>
                        <p>
                            We ship worldwide 🌍 with fast delivery options and real-time tracking from
                            your OceanCart dashboard.
                        </p>
                    </section>
                )}

                {/* --- Troubleshooting --- */}
                {visibleSections.includes(4) && (
                    <section className="fade-up mb-5">
                        <h3>🛠️ Troubleshooting</h3>
                        <p>
                            Having issues with payments, orders, or your account?
                            Visit our step-by-step troubleshooting guides.
                        </p>
                    </section>
                )}

                {/* --- FAQ --- */}
                {visibleSections.includes(5) && (
                    <section className="fade-up mb-5">
                        <h3>❓ Frequently Asked Questions</h3>
                        <ul>
                            <li>📦 How do I cancel an order?</li>
                            <li>🚚 How long does delivery take?</li>
                            <li>🔐 How do I reset my password?</li>
                            <li>🧾 Where can I download invoices?</li>
                        </ul>
                        <NavLink to="/quick-links" className="btn btn-outline-light mt-2">
                            View Shipping Policies
                        </NavLink>
                    </section>
                )}

                <div className="text-center mt-4 fade-up">
                    <h4>🤝 Need Quick Help?</h4>
                    <p>Start a live chat with our support team. We’re here to assist you!</p>
                    <button className="btn btn-light px-4">Start Live Chat</button>
                </div>
            </div>

            {/* CSS */}
            <style jsx="true">{`
                .ocean-wrapper {
                    position: relative;
                    min-height: 100vh;
                    overflow: hidden;
                    background: linear-gradient(180deg, #003459, #005b96, #0088c7);
                }

                /* Fog Animation */
                .fog {
                    position: absolute;
                    width: 200%;
                    height: 200px;
                    top: 20%;
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                    filter: blur(40px);
                    animation: drift 12s infinite linear;
                }
                .fog-1 { left: -50%; animation-duration: 18s; }
                .fog-2 { left: -30%; top: 40%; animation-duration: 22s; }

                @keyframes drift {
                    from { transform: translateX(-20%); }
                    to   { transform: translateX(20%); }
                }

                /* Bubbles */
                .bubble {
                    position: absolute;
                    bottom: -50px;
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    animation: rise 10s infinite ease-in;
                    filter: blur(1px);
                }
                .b1 { left: 15%; animation-duration: 9s; }
                .b2 { left: 35%; animation-duration: 11s; width: 15px; height: 15px; }
                .b3 { left: 55%; animation-duration: 13s; }
                .b4 { left: 75%; animation-duration: 10s; width: 10px; height: 10px; }
                .b5 { left: 90%; animation-duration: 12s; }

                @keyframes rise {
                    0%   { transform: translateY(0) scale(1); opacity: 0.4; }
                    50%  { opacity: 1; }
                    100% { transform: translateY(-900px) scale(1.4); opacity: 0; }
                }

                .fade-up {
                    animation: fadeUp 0.9s ease both;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CustomerService;
