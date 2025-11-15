import React, { useEffect, useState } from "react";

const QuickLinks = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    return (
        <div className="ocean-wrapper">
            {/* Fog Layers */}
            <div className="fog fog-1"></div>
            <div className="fog fog-2"></div>

            {/* Bubble Layers */}
            <div className="bubble b1"></div>
            <div className="bubble b2"></div>
            <div className="bubble b3"></div>
            <div className="bubble b4"></div>
            <div className="bubble b5"></div>

            <div
                className={`container py-5 position-relative ${atlanticFade ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    transition: "opacity 1s ease, transform 0.6s ease",
                    transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                    borderRadius: "12px",
                    color: "white",
                }}
            >
                <h1 className="text-center fw-bold mb-4">Quick Links ⚓</h1>

                {/* Privacy Policy */}
                <section className="fade-up mb-5">
                    <h3>🔐 Privacy Policy</h3>
                    <p>
                        At OceanCart, your privacy is our anchor. We collect only essential
                        information required to process your orders and improve your shopping
                        experience. Your data is encrypted, securely stored, and never shared
                        with third-party advertisers.
                    </p>
                    <p>
                        You may request data deletion, account closure, or a full data report
                        anytime by contacting our support team.
                    </p>
                </section>

                {/* Terms of Service */}
                <section className="fade-up mb-5">
                    <h3>📜 Terms of Service</h3>
                    <p>
                        By using our platform, you agree to follow our fair usage guidelines,
                        enjoy ethical commerce, and interact respectfully with our community.
                    </p>
                    <p>
                        All orders, warranties, and returns are governed by global e-commerce standards
                        to ensure transparency and trust between you and OceanCart.
                    </p>
                </section>

                {/* Security Info */}
                <section className="fade-up mb-5">
                    <h3>🛡️ Security & Data Protection</h3>
                    <p>
                        Your transactions are protected using industry-grade SSL encryption.
                        We also comply with international data protection standards including
                        GDPR-aligned privacy rules.
                    </p>
                    <p>
                        Payment information is handled securely through verified payment gateways
                        like Razorpay — we never store card or UPI details on our servers.
                    </p>
                </section>

                {/* FAQs */}
                <section className="fade-up">
                    <h3>❓ Frequently Asked Questions</h3>
                    <ul style={{ lineHeight: "1.9" }}>
                        <li><strong>How do I cancel an order?</strong>
                            You can cancel from your Dashboard under “My Orders” before dispatch.</li>

                        <li><strong>How long does delivery take?</strong>
                            3–7 days depending on your location. Real-time tracking available.</li>

                        <li><strong>How do I reset my password?</strong>
                            Use the “Forgot Password” option on the login page to generate a reset link.</li>

                        <li><strong>Where do I download my invoices?</strong>
                            Visit “Payment History” — invoices are always available in one click.</li>
                    </ul>
                </section>
            </div>

            {/* Underwater Styling */}
            <style jsx="true">{`
                .ocean-wrapper {
                    position: relative;
                    min-height: 100vh;
                    overflow: hidden;
                    background: linear-gradient(180deg, #003459, #005b96, #0088c7);
                }

                /* Fog Effects */
                .fog {
                    position: absolute;
                    width: 200%;
                    height: 200px;
                    top: 25%;
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                    filter: blur(40px);
                    animation: drift 20s infinite linear;
                }
                .fog-1 { left: -40%; animation-duration: 18s; }
                .fog-2 { left: -20%; top: 45%; animation-duration: 23s; }

                @keyframes drift {
                    from { transform: translateX(-20%); }
                    to   { transform: translateX(20%); }
                }

                /* Bubbles */
                .bubble {
                    position: absolute;
                    bottom: -60px;
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    animation: rise 11s infinite ease-in;
                    filter: blur(1px);
                }
                .b1 { left: 12%; animation-duration: 10s; }
                .b2 { left: 32%; width: 15px; height: 15px; animation-duration: 12s; }
                .b3 { left: 52%; animation-duration: 14s; }
                .b4 { left: 72%; width: 10px; height: 10px; animation-duration: 11s; }
                .b5 { left: 88%; animation-duration: 13s; }

                @keyframes rise {
                    0%   { transform: translateY(0) scale(1); opacity: 0.4; }
                    50%  { opacity: 1; }
                    100% { transform: translateY(-900px) scale(1.4); opacity: 0; }
                }

                .fade-up { animation: fadeUp 0.9s ease both; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default QuickLinks;
