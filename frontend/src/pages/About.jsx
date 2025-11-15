import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const About = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setFadeIn(true);

        const timers = [1, 2, 3, 4, 5, 6].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 300)
        );

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="ocean-about-wrapper">

            {/* Fog Layers */}
            <div className="fog fog-1"></div>
            <div className="fog fog-2"></div>

            {/* Bubbles */}
            <div className="bubble b1"></div>
            <div className="bubble b2"></div>
            <div className="bubble b3"></div>
            <div className="bubble b4"></div>
            <div className="bubble b5"></div>

            <div
                className={`container py-5 position-relative ${fadeIn ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    transition: "opacity 1.2s ease, transform 0.8s ease",
                    transform: fadeIn ? "translateY(0)" : "translateY(20px)",
                    color: "white",
                }}
            >
                <h1 className="text-center fw-bold mb-5 text-white">
                    About OceanCart 🌊
                </h1>

                <div className="d-flex flex-column gap-5">
                    {/* SECTION 1 */}
                    {visibleSections.includes(1) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">📖 Our Story</h3>
                            <p>
                                OceanCart began with a simple mission:
                                <strong> to bring clarity, trust, and a refreshing experience to online shopping.</strong>
                            </p>
                            <p>
                                What started as a small experiment has grown into a powerful e-commerce platform
                                built with modern technologies — smooth navigation, secure payments,
                                and an ocean-deep commitment to quality.
                            </p>
                        </section>
                    )}

                    {/* SECTION 2 */}
                    {visibleSections.includes(2) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">👩‍💻 Careers</h3>
                            <p>
                                At OceanCart, we believe great things happen when great minds come together.
                                We’re growing — and always searching for creative designers, passionate
                                developers, product thinkers, and customer-first problem solvers.
                            </p>
                            <p>
                                Whether you're a seasoned engineer or an enthusiastic intern,
                                you’ll find opportunities to build meaningful features and shape the
                                future of e-commerce.
                            </p>
                            <p className="fw-semibold">
                                Email your resume to
                                <span className="text-info"> careers@oceancart.com</span>
                            </p>
                        </section>
                    )}

                    {/* SECTION 3 */}
                    {visibleSections.includes(3) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">📝 Blog</h3>
                            <p>
                                Dive into the OceanCart Blog for product updates, shopping ideas,
                                behind-the-scenes stories, and expert tips on making the most of
                                your purchases.
                            </p>
                            <p>
                                Our blog is where we share community highlights, inspiration,
                                tech updates, and the journey of building a modern shopping platform.
                            </p>
                        </section>
                    )}

                    {/* SECTION 4 */}
                    {visibleSections.includes(4) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">👤 Founder’s Message</h3>
                            <p>
                                “When we started OceanCart, our dream wasn’t just to build another shopping platform —
                                it was to build <strong>a place people trust.</strong>
                            </p>
                            <p>
                                A place that feels modern, secure, and enjoyable.
                                Every line of code, every design decision,
                                and every customer interaction reflects that vision.
                            </p>
                            <p className="fw-semibold mt-2">— Team OceanCart 🌊</p>
                        </section>
                    )}

                    {/* SECTION 5 */}
                    {visibleSections.includes(5) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">👥 Meet the Crew</h3>
                            <p className="mb-3">
                                Behind OceanCart is a passionate crew of engineers, designers, analysts,
                                and customer champions.
                            </p>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="card shadow-sm p-3 ocean-card">
                                        <h5 className="text-info">Bhagyesh Yadav</h5>
                                        <p>Founder & Full Stack Developer</p>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card shadow-sm p-3 ocean-card">
                                        <h5 className="text-info">AquaTech Team</h5>
                                        <p>UI/UX & Frontend Design</p>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card shadow-sm p-3 ocean-card">
                                        <h5 className="text-info">Coral Support</h5>
                                        <p>Customer Happiness Team</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION 6 */}
                    {visibleSections.includes(6) && (
                        <section className="fade-up">
                            <h3 className="fw-bold">🕒 Our Journey</h3>

                            <div className="timeline">
                                <div className="time-box">
                                    <div className="time-circle"></div>
                                    <p><strong>2024</strong> — OceanCart idea born.</p>
                                </div>

                                <div className="time-box">
                                    <div className="time-circle"></div>
                                    <p><strong>2025 (Early)</strong> — First prototype launched.</p>
                                </div>

                                <div className="time-box">
                                    <div className="time-circle"></div>
                                    <p><strong>2025 (Now)</strong> — Growing platform with modern UI, payments, invoices & more.</p>
                                </div>
                            </div>

                            <NavLink to="/customer-service" className="btn btn-outline-light mt-3">
                                Visit Help Center
                            </NavLink>
                        </section>
                    )}
                </div>

                {/* STYLES */}
                <style jsx="true">{`
                    /* Fade Animation */
                    .fade-up {
                        animation: fadeUp 0.9s ease both;
                    }
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }

                    /* Timeline */
                    .timeline {
                        margin-top: 15px;
                        padding-left: 20px;
                        border-left: 3px solid #90e0ef;
                    }
                    .time-box {
                        position: relative;
                        margin-bottom: 15px;
                    }
                    .time-circle {
                        width: 12px;
                        height: 12px;
                        background: #00b4d8;
                        border-radius: 50%;
                        position: absolute;
                        left: -26px;
                        top: 4px;
                    }

                    /* Cards */
                    .ocean-card {
                        background: rgba(255,255,255,0.08);
                        border: 1px solid rgba(255,255,255,0.2);
                        backdrop-filter: blur(6px);
                        color: white;
                    }

                    /* Underwater Wrapper */
                    .ocean-about-wrapper {
                        position: relative;
                        min-height: 100vh;
                        overflow: hidden;
                        background: linear-gradient(180deg, #003459, #005b96, #0088c7);
                        padding-top: 20px;
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
                    .b1 { left: 10%; animation-duration: 11s; }
                    .b2 { left: 30%; width: 14px; height: 14px; animation-duration: 13s; }
                    .b3 { left: 55%; animation-duration: 12s; }
                    .b4 { left: 75%; width: 10px; height: 10px; animation-duration: 15s; }
                    .b5 { left: 90%; animation-duration: 14s; }

                    @keyframes rise {
                        0%   { transform: translateY(0) scale(1); opacity: 0.4; }
                        50%  { opacity: 1; }
                        100% { transform: translateY(-900px) scale(1.4); opacity: 0; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default About;
