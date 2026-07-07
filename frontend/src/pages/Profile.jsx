import React, { useContext, useState } from "react";
import { OceanAuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/OceanAPI";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

const Profile = () => {
    const { oceanUser, oceanSetUser } = useContext(OceanAuthContext);
    const [form, setForm] = useState({
        first_name: oceanUser?.first_name || "",
        last_name: oceanUser?.last_name || "",
        email: oceanUser?.email || "",
        current_password: "",
        new_password: "",
        new_password2: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
            };
            if (form.new_password) {
                payload.current_password = form.current_password;
                payload.new_password = form.new_password;
                payload.new_password2 = form.new_password2;
            }
            const updated = await updateProfile(payload);
            oceanSetUser({ ...oceanUser, ...updated });
            toast.success("Profile updated", { theme: "colored" });
            setForm((f) => ({
                ...f,
                current_password: "",
                new_password: "",
                new_password2: "",
            }));
        } catch (err) {
            const data = err.response?.data;
            const msg =
                data?.current_password?.[0] ||
                data?.email?.[0] ||
                data?.new_password?.[0] ||
                data?.detail ||
                "Could not update profile";
            toast.error(msg, { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ocean-dashboard-page ocean-dashboard-page--visible">
            <div className="ocean-dashboard-sheen" aria-hidden />
            <div className="container-fluid px-3 py-4 py-md-5">
                <div className="ocean-dashboard-inner mx-auto">
                    <header className="text-center mb-4">
                        <FaUser className="text-info mb-2" style={{ fontSize: "2rem" }} />
                        <h1 className="h2 fw-bold ocean-dashboard-title">Your profile</h1>
                        <p className="ocean-dashboard-lead">Update your details and password.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="ocean-surface-card">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">First name</label>
                                <input
                                    name="first_name"
                                    className="form-control ocean-feedback-control"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Last name</label>
                                <input
                                    name="last_name"
                                    className="form-control ocean-feedback-control"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control ocean-feedback-control"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <hr />
                                <p className="small text-muted mb-2">Change password (optional)</p>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold">Current password</label>
                                <div className="ocean-password-field">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        name="current_password"
                                        className="form-control ocean-feedback-control"
                                        value={form.current_password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="ocean-password-toggle"
                                        onClick={() => setShowPw((p) => !p)}
                                    >
                                        {showPw ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">New password</label>
                                <input
                                    type={showPw ? "text" : "password"}
                                    name="new_password"
                                    className="form-control ocean-feedback-control"
                                    value={form.new_password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Confirm new password</label>
                                <input
                                    type={showPw ? "text" : "password"}
                                    name="new_password2"
                                    className="form-control ocean-feedback-control"
                                    value={form.new_password2}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn ocean-dash-btn-primary w-100 mt-4 py-3"
                            disabled={loading}
                        >
                            {loading ? "Saving…" : "Save changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
