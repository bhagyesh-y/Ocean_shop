import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmPasswordReset } from "../api/OceanAPI";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const uid = params.get("uid") || "";
    const token = params.get("token") || "";

    const [form, setForm] = useState({ new_password: "", new_password2: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.new_password !== form.new_password2) {
            toast.error("Passwords do not match", { theme: "colored" });
            return;
        }
        setLoading(true);
        try {
            await confirmPasswordReset({
                uid,
                token,
                new_password: form.new_password,
                new_password2: form.new_password2,
            });
            toast.success("Password updated — you can log in now", { theme: "colored" });
            navigate("/login", { replace: true });
        } catch (err) {
            const msg = err.response?.data?.detail || "Reset link invalid or expired";
            toast.error(msg, { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    if (!uid || !token) {
        return (
            <div className="ocean-login-bg d-flex justify-content-center align-items-center py-5">
                <div className="card p-4 text-center" style={{ maxWidth: 420 }}>
                    <p className="text-danger">Invalid reset link.</p>
                    <Link to="/forgot-password" className="btn btn-primary mt-2">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="ocean-login-bg d-flex justify-content-center align-items-center py-5">
            <div
                className="card shadow-lg p-4 border-0"
                style={{ maxWidth: 420, width: "93%", borderRadius: 15, background: "rgba(255,255,255,0.92)" }}
            >
                <h2 className="text-center mb-4 fw-bold text-primary">Set new password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">New password</label>
                        <div className="ocean-password-field">
                            <input
                                type={showPw ? "text" : "password"}
                                className="form-control"
                                value={form.new_password}
                                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="ocean-password-toggle"
                                onClick={() => setShowPw((p) => !p)}
                                aria-label="Toggle password visibility"
                            >
                                {showPw ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Confirm password</label>
                        <input
                            type={showPw ? "text" : "password"}
                            className="form-control"
                            value={form.new_password2}
                            onChange={(e) => setForm({ ...form, new_password2: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Saving…" : "Update password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
