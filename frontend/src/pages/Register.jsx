import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OceanAuthContext } from "../context/AuthContext";

const Register = () => {
    const { oceanRegister } = useContext(OceanAuthContext);// destructuring the context values
    const navigate = useNavigate();


    const [pacificForm, setPacificForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [atlanticFade, setAtlanticFade] = useState(false);
    const [errorWave, setErrorWave] = useState("");
    const [successWave, setSuccessWave] = useState("");
    const [loadingWave, setLoadingWave] = useState(false);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);
    // handling form input changes 
    const handleTideChange = (e) => {
        setPacificForm({ ...pacificForm, [e.target.name]: e.target.value });
        setErrorWave("");
        setSuccessWave("");
        setLoadingWave(false);

    };

    const handleWaveSubmit = async (e) => {
        e.preventDefault();

        if (pacificForm.password !== pacificForm.confirmPassword) {
            setErrorWave("Passwords did't match ⚠️");
            return;
        }
        setLoadingWave(true);

        const success = await oceanRegister(
            pacificForm.username,
            pacificForm.email,
            pacificForm.password,
            pacificForm.confirmPassword
        );

        if (success) {
            setSuccessWave(`Account created successfully! ${pacificForm.username} 🌊 Redirecting...`);
            setTimeout(() => navigate("/"), 1500);
        } else {
            setErrorWave("Registration failed. Please try again 🌀");
            setLoadingWave(false);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(135deg, #0077b6, #90e0ef)",
            }}
        >
            <div
                className={`card shadow-lg p-4 border-0 ${atlanticFade ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    maxWidth: "420px",
                    width: "100%",
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.9)",
                    transition: "opacity 1s ease, transform 0.5s ease",
                    transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                }}
            >
                <h2 className="text-center mb-4 fw-bold text-primary">
                    Create A  Ocean Account 🌊
                </h2>

                {errorWave && (
                    <div className="alert alert-danger py-2 text-center">{errorWave}</div>
                )}
                {successWave && (
                    <div className="alert alert-success py-2 text-center">
                        {successWave}
                    </div>
                )}

                <form onSubmit={handleWaveSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={pacificForm.username}
                            onChange={handleTideChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={pacificForm.email}
                            onChange={handleTideChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={pacificForm.password}
                            onChange={handleTideChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Re-enter password"
                            value={pacificForm.confirmPassword}
                            onChange={handleTideChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 fw-semibold"
                        disabled={loadingWave}
                        style={{
                            backgroundColor: loadingWave ? "#012a57" : "#023e8a",
                            border: "none",
                            color: "white",
                            transition: "all 0.3s ease",
                            opacity: loadingWave ? 0.7 : 1,
                            cursor: loadingWave ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={(e) => {
                            if (!loadingWave) {
                                e.target.style.backgroundColor = "#03045e";
                                e.target.style.transform = "scale(1.03)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loadingWave) {
                                e.target.style.backgroundColor = "#023e8a";
                                e.target.style.transform = "scale(1)";
                            }
                        }}
                    >
                        {loadingWave ? "Registering..." : "🌍 Register"}

                    </button>
                </form>

                <div className="text-center mt-3">
                    <small className="text-muted">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-decoration-none fw-semibold text-primary"
                        >
                            Login
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Register;
