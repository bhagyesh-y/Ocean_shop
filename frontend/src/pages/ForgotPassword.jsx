import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { requestPasswordReset } from "../api/OceanAPI";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setSent(true);
            toast.success("Check your email for a reset link", { theme: "colored" });
        } catch {
            toast.error("Could not send reset email", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ocean-login-bg d-flex justify-content-center align-items-center py-5">
            <div className="ocean-login-topwave-1" />
            <div className="ocean-login-topwave-2" />
            <div
                className="card shadow-lg p-4 border-0"
                style={{ maxWidth: 420, width: "93%", borderRadius: 15, background: "rgba(255,255,255,0.92)" }}
            >
                <h2 className="text-center mb-3 fw-bold text-primary">Forgot password</h2>
                <p className="text-muted small text-center mb-4">
                    Enter your account email and we&apos;ll send a link to reset your password.
                </p>
                {sent ? (
                    <div className="alert alert-success text-center">
                        If an account exists for that email, a reset link has been sent.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Sending…" : "Send reset link"}
                        </button>
                    </form>
                )}
                <div className="text-center mt-3">
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
