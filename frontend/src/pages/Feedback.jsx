import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

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
                        toast.success("Feedback sent successfully 🌊", { theme: "colored" });
                        setFormData({ name: "", email: "", message: "" });

                        // ⏱ Auto return to form after 2s
                        setTimeout(() => {
                            setSuccess(false);
                        }, 2000);
                    }, 600);
                },
                () => {
                    setSending(false);
                    toast.error("Failed to send feedback 😕", { theme: "colored" });
                }
            );
    };

    return (
        <div
            className={`container py-5 ${atlanticFade ? "opacity-100" : "opacity-0"
                }`}
            style={{
                background: "linear-gradient(180deg, #ade8f4 0%, #48cae4 100%)",
                borderRadius: "15px",
                minHeight: "80vh",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
            }}
        >
            <h2 className="text-center fw-bold text-white mb-4">
                We’d love your Feedback 💬
            </h2>

            <div className={`feedback-card mx-auto ${sending ? "sending" : ""}`}>
                {/* 🌊 WAVE SPLASH */}
                {sending && <div className="wave-splash"></div>}

                {!success ? (
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 bg-white shadow-lg rounded-4 feedback-form"
                    >
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Message</label>
                            <textarea
                                name="message"
                                className="form-control"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-2"
                            disabled={sending}
                        >
                            {sending ? "⏳ Sending feedback..." : "🌊 Send Feedback"}
                        </button>
                    </form>
                ) : (
                    <div className="feedback-success bg-white shadow-lg rounded-4 p-5">
                        <div className="checkmark">✓</div>
                        <h4 className="fw-bold mt-3">Thank you!</h4>
                        <p className="text-muted">
                            Your feedback has been sent 🌊
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
