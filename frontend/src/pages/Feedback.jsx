import React, { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const Feedback = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150); // soft fade-in
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .send(
                "service_gwk09xj",
                "template_vah1asa",
                formData,
                "KoHt-tm8TuPNI2e6x"
            )
            .then(
                () => {
                    toast.success("Feedback sent successfully 🌊", { theme: "colored" });
                    setFormData({ name: "", email: "", message: "" });
                },
                (error) => {
                    toast.error("Failed to send feedback 😕", { theme: "colored" });
                    console.error(error);
                }
            );
    };

    return (
        <div
            className={`container py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
            style={{
                background: "linear-gradient(180deg, #ade8f4 0%, #48cae4 100%)",
                borderRadius: "15px",
                minHeight: "80vh",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",

            }}
        >
            <h2 className="text-center fw-bold text-white mb-4">We’d love your Feedback 💬</h2>

            <form
                onSubmit={handleSubmit}
                className="mx-auto p-4 bg-white shadow-lg rounded-4"
                style={{ maxWidth: "500px" }}
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
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-2">
                    Send Feedback
                </button>
            </form>
        </div>
    );
};

export default Feedback;
