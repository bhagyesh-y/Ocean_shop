import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const About = () => {
    const [visible, setVisible] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setVisible(true);
        const timers = [1, 2, 3, 4, 5, 6].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 280)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className={`ocean-static-page ${visible ? "ocean-static-page--visible" : ""}`}>
            <div className="ocean-static-sheen" aria-hidden />
            <div className="ocean-static-fog" aria-hidden />
            <div className="ocean-static-fog ocean-static-fog--2" aria-hidden />
            <span className="ocean-static-bubble ocean-static-bubble--1" aria-hidden />
            <span className="ocean-static-bubble ocean-static-bubble--2" aria-hidden />
            <span className="ocean-static-bubble ocean-static-bubble--3" aria-hidden />
            <span className="ocean-static-bubble ocean-static-bubble--4" aria-hidden />
            <span className="ocean-static-bubble ocean-static-bubble--5" aria-hidden />

            <div className="container py-4 py-md-5 position-relative">
                <div className="ocean-static-inner">
                    <header className="ocean-static-hero">
                        <p className="ocean-static-eyebrow text-uppercase fw-semibold mb-2">Our story</p>
                        <h1 className="h2 fw-bold ocean-static-title mb-3">About Ocean Shop</h1>
                        <p className="ocean-static-lead mb-0">
                            Depth, clarity, and trust — the same current that runs through the rest of the app.
                        </p>
                    </header>

                    <div className="d-flex flex-column gap-3">
                        {visibleSections.includes(1) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Our story</h2>
                                <p>
                                    Ocean Shop began with a simple mission:{" "}
                                    <strong>to bring clarity, trust, and a refreshing experience to online shopping.</strong>
                                </p>
                                <p className="mb-0">
                                    What started as a small experiment has grown into a modern storefront — smooth
                                    navigation, secure payments, and an ocean-deep commitment to quality.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(2) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Careers</h2>
                                <p>
                                    We&apos;re growing — designers, developers, product thinkers, and customer-first
                                    problem solvers.
                                </p>
                                <p className="mb-0">
                                    Email{" "}
                                    <a href="mailto:careers@oceanshop.com">careers@oceanshop.com</a> with your resume.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(3) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Blog</h2>
                                <p className="mb-0">
                                    Product updates, shopping ideas, and behind-the-scenes notes from the crew building
                                    Ocean Shop.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(4) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Founder&apos;s message</h2>
                                <p>
                                    “When we started Ocean Shop, our dream wasn&apos;t just another platform — it was{" "}
                                    <strong>a place where people can trust.</strong>
                                </p>
                                <p className="fw-semibold mb-0">— Team Ocean Shop</p>
                            </article>
                        )}

                        {visibleSections.includes(5) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Meet the crew</h2>
                                <div className="ocean-static-crew">
                                    <div className="ocean-static-crew-card">
                                        <h4>Mr. Bhagyesh Yadav</h4>
                                        <p className="small mb-0">Founder &amp; full stack developer</p>
                                    </div>
                                    <div className="ocean-static-crew-card">
                                        <h4>AquaTech team</h4>
                                        <p className="small mb-0">UI/UX &amp; frontend</p>
                                    </div>
                                    <div className="ocean-static-crew-card">
                                        <h4>Coral support</h4>
                                        <p className="small mb-0">Customer happiness</p>
                                    </div>
                                </div>
                            </article>
                        )}

                        {visibleSections.includes(6) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Our journey</h2>
                                <div className="ocean-static-timeline">
                                    <div className="ocean-static-timebox">
                                        <p className="mb-0">
                                            <strong>2024</strong> — Ocean Shop idea born.
                                        </p>
                                    </div>
                                    <div className="ocean-static-timebox">
                                        <p className="mb-0">
                                            <strong>2025</strong> — First prototype and growing platform.
                                        </p>
                                    </div>
                                    <div className="ocean-static-timebox">
                                        <p className="mb-0">
                                            <strong>Now</strong> — Modern UI, payments, invoices, and more.
                                        </p>
                                    </div>
                                </div>
                                <div className="ocean-static-actions mt-3">
                                    <NavLink
                                        to="/customer-service"
                                        className="btn btn-outline-primary px-4 fw-semibold"
                                    >
                                        Help center
                                    </NavLink>
                                </div>
                            </article>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
