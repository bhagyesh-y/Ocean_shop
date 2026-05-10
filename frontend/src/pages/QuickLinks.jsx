import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const QuickLinks = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 120);
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
                        <p className="ocean-static-eyebrow text-uppercase fw-semibold mb-2">Policies</p>
                        <h1 className="h2 fw-bold ocean-static-title mb-3">Quick links</h1>
                        <p className="ocean-static-lead mb-0">
                            Privacy, terms, security, and FAQs — anchored in plain language.
                        </p>
                    </header>

                    <article className="ocean-static-card">
                        <h2>Privacy policy</h2>
                        <p>
                            We collect only what we need to fulfill orders and improve your experience. Data is
                            encrypted in transit; we don&apos;t sell your shopping profile to advertisers.
                        </p>
                        <p className="mb-0">
                            You may request account closure or export by contacting support with the email on your
                            account.
                        </p>
                    </article>

                    <article className="ocean-static-card">
                        <h2>Terms of service</h2>
                        <p>
                            By using Ocean Shop you agree to fair use: honest listings, respectful communication, and
                            compliance with payment and shipping policies shown at checkout.
                        </p>
                        <p className="mb-0">
                            Orders, warranties, and returns follow the terms presented on the site at the time of
                            purchase.
                        </p>
                    </article>

                    <article className="ocean-static-card">
                        <h2>Security &amp; data protection</h2>
                        <p>
                            Connections use HTTPS. Payments are processed by trusted gateways (e.g. Razorpay); we
                            don&apos;t store full card or UPI secrets on our servers.
                        </p>
                        <p className="mb-0">Rotate passwords periodically and never share OTPs or login links.</p>
                    </article>

                    <article className="ocean-static-card">
                        <h2>FAQs</h2>
                        <ul>
                            <li>
                                <strong>Cancel an order?</strong> Use your dashboard before dispatch when cancellation
                                is available.
                            </li>
                            <li>
                                <strong>Delivery time?</strong> Usually a few business days; tracking updates by
                                carrier.
                            </li>
                            <li>
                                <strong>Password reset?</strong> Use the flow on the login page.
                            </li>
                            <li>
                                <strong>Invoices?</strong> Open <NavLink to="/payment-history">Payment history</NavLink>.
                            </li>
                        </ul>
                    </article>

                    <div className="text-center ocean-static-actions mt-2">
                        <NavLink to="/customer-service" className="btn ocean-dash-btn-secondary px-4 me-sm-2 mb-2 mb-sm-0">
                            Customer service
                        </NavLink>
                        <NavLink to="/feedback" className="btn ocean-dash-btn-primary px-4">
                            Contact us
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickLinks;
