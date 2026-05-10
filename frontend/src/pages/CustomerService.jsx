import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CustomerService = () => {
    const [visible, setVisible] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setVisible(true);
        const timers = [1, 2, 3, 4, 5].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 260)
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
                        <p className="ocean-static-eyebrow text-uppercase fw-semibold mb-2">Support</p>
                        <h1 className="h2 fw-bold ocean-static-title mb-3">Customer service</h1>
                        <p className="ocean-static-lead mb-0">
                            Help, returns, shipping, and quick answers — all in one calm harbor.
                        </p>
                    </header>

                    <div className="d-flex flex-column gap-3">
                        {visibleSections.includes(1) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Help center</h2>
                                <p className="mb-0">
                                    We&apos;re here via email and in-app flows. Your satisfaction is our priority.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(2) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Returns &amp; refunds</h2>
                                <p className="mb-0">
                                    Return within <strong>7 days</strong> for a full refund when items meet policy
                                    conditions — check your order email for steps.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(3) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Shipping &amp; delivery</h2>
                                <p className="mb-0">
                                    We ship with tracked carriers. Delivery windows and tracking appear in your
                                    dashboard after purchase.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(4) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>Troubleshooting</h2>
                                <p className="mb-0">
                                    Payment or login issues? Try a fresh sign-in, clear site data for this origin, or
                                    contact us with your order ID.
                                </p>
                            </article>
                        )}

                        {visibleSections.includes(5) && (
                            <article className="ocean-static-card ocean-static-reveal">
                                <h2>FAQ snapshot</h2>
                                <ul className="mb-3">
                                    <li>Cancel orders from your dashboard before dispatch.</li>
                                    <li>Typical delivery: a few business days; varies by region.</li>
                                    <li>Invoices live under Payment history.</li>
                                </ul>
                                <NavLink to="/quick-links" className="btn btn-outline-primary fw-semibold px-4">
                                    Policies &amp; quick links
                                </NavLink>
                            </article>
                        )}

                        <section className="ocean-static-card ocean-static-reveal text-center">
                            <h2 className="h5">Need quick help?</h2>
                            <p className="mb-3">Reach out through Feedback — we read every message.</p>
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center ocean-static-actions">
                                <NavLink to="/feedback" className="btn ocean-dash-btn-primary px-4">
                                    Send feedback
                                </NavLink>
                                <NavLink to="/products" className="btn ocean-dash-btn-secondary px-4">
                                    Browse products
                                </NavLink>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerService;
