import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

const Feedback = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        emailjs
            .send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setTimeout(() => {
                        setSending(false);
                        setSuccess(true);
                        toast.success("Message carried on the tide — thank you!", { theme: "colored" });
                        setFormData({ name: "", email: "", message: "" });

                        setTimeout(() => {
                            setSuccess(false);
                        }, 2800);
                    }, 600);
                },
                () => {
                    setSending(false);
                    toast.error("Could not send — please try again.", { theme: "colored" });
                }
            );
    };

    return (
        <div
            className={`ocean-feedback-page ${atlanticFade ? "ocean-feedback-page--visible" : ""}`}
        >
            <div className="ocean-feedback-wave" aria-hidden />

            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <div className="ocean-feedback-inner mx-auto">
                    <header className="text-center mb-4 mb-md-5">
                        <p className="ocean-feedback-eyebrow text-uppercase small fw-semibold mb-2">
                            Send a bottle from the shore
                        </p>
                        <h1 className="h2 fw-bold ocean-feedback-title mb-3">
                            We&apos;d love your feedback
                        </h1>
                        <p className="mx-auto ocean-feedback-lead mb-0">
                            Drop us a line about your voyage through Ocean Shop — every ripple helps us improve.
                        </p>
                    </header>

                    <div className={`feedback-card mx-auto position-relative ${sending ? "sending" : ""}`}>
                        {sending && <div className="wave-splash" aria-hidden />}

                        {!success ? (
                            <form
                                onSubmit={handleSubmit}
                                className="ocean-feedback-form shadow-lg"
                                noValidate
                            >
                                <div className="ocean-feedback-form__fields">
                                    <div className="mb-3 mb-md-4">
                                        <label htmlFor="feedback-name" className="form-label ocean-feedback-label">
                                            <FaUser className="ocean-feedback-label__icon" aria-hidden />
                                            Your name
                                        </label>
                                        <input
                                            id="feedback-name"
                                            type="text"
                                            name="name"
                                            className="form-control ocean-feedback-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            required
                                            placeholder="Captain Coral"
                                        />
                                    </div>

                                    <div className="mb-3 mb-md-4">
                                        <label htmlFor="feedback-email" className="form-label ocean-feedback-label">
                                            <FaEnvelope className="ocean-feedback-label__icon" aria-hidden />
                                            Email
                                        </label>
                                        <input
                                            id="feedback-email"
                                            type="email"
                                            name="email"
                                            className="form-control ocean-feedback-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            inputMode="email"
                                            required
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="feedback-message" className="form-label ocean-feedback-label">
                                            <FaCommentDots className="ocean-feedback-label__icon" aria-hidden />
                                            Message
                                        </label>
                                        <textarea
                                            id="feedback-message"
                                            name="message"
                                            className="form-control ocean-feedback-control ocean-feedback-textarea"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Tell us what worked, what sank, or what you'd like to see next…"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn ocean-feedback-submit w-100"
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden
                                            />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="me-2" aria-hidden />
                                            Send message
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="feedback-success ocean-feedback-success shadow-lg">
                                <div className="checkmark" aria-hidden>
                                    ✓
                                </div>
                                <h2 className="h4 fw-bold mt-3">Message received</h2>
                                <p className="text-muted mb-0 small">
                                    Thanks for helping us chart calmer waters.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
