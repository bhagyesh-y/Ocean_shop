import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OceanAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl } from "../config";

const Login = () => {
  const { oceanLogin, oceanSetGoogleUser } = useContext(OceanAuthContext);
  const navigate = useNavigate();
  const [tideForm, setTideForm] = useState({ username: "", password: "" });
  const [waveError, setWaveError] = useState("");
  const [atlanticFade, setAtlanticFade] = useState(false);
  const [loadingWave, setloadingWave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => setAtlanticFade(true), 150);
  }, []);

  const handleTideChange = (e) => {
    setTideForm({ ...tideForm, [e.target.name]: e.target.value });
  };

  const handleWaveSubmit = async (e) => {
    e.preventDefault();
    setloadingWave(true);
    const success = await oceanLogin(tideForm.username, tideForm.password);
    if (success) {
      toast.success(`🌊 Login successful! Welcome ${tideForm.username}`, { theme: "colored" });
      navigate("/");
    } else {
      setWaveError("Login failed. Please check your credentials 🌊");
      toast.error("❌ Invalid username or password", { theme: "colored" });
    }
    setloadingWave(false);
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const credential = response.credential;

      const res = await fetch(apiUrl("/api/google-login/"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      if (!res.ok) throw new Error("Google login failed 🌊");

      const data = await res.json();

      oceanSetGoogleUser(data.user);
      const displayName =
        data.user.first_name || data.user.username || "User";
      toast.success(` 🌊 Welcome onboard ${displayName}! `, { theme: "colored" });

      navigate("/");
    } catch (error) {
      toast.error("Google login failed. Please try again!", { theme: "colored" });
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Google login failed");
    toast.error("Google Sign-In was not successful.", { theme: "colored" });
  };

  return (
    <div className="ocean-login-bg d-flex justify-content-center align-items-center py-5">
      <div className="top-wave"></div>
      <div className="ocean-login-topwave-1"></div>
      <div className="ocean-login-topwave-2"></div>

      <div
        className={`card shadow-lg p-4 border-0  ${atlanticFade ? "opacity-100" : "opacity-0"
          }`}
        style={{
          maxWidth: "420px",
          width: "93%",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.9)",
          transition: "opacity 1s ease, transform 0.5s ease",
          transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">
          Welcome Back 🌊
        </h2>

        {waveError && <div className="alert alert-danger py-2 text-center">{waveError}</div>}

        <form onSubmit={handleWaveSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={tideForm.username}
              onChange={handleTideChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <div className="ocean-password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={tideForm.password}
                onChange={handleTideChange}
                required
              />
              <button
                type="button"
                className="ocean-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingWave}
            className="btn w-100 fw-semibold d-flex justify-content-center align-items-center gap-2"
            style={{
              backgroundColor: loadingWave ? "#0a3d86" : "#023e8a",
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
            {loadingWave ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "🌍 Login"
            )}
          </button>

          <div className="text-center mt-3">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted d-block">
            <Link to="/forgot-password" className="text-decoration-none fw-semibold text-primary">
              Forgot password?
            </Link>
          </small>
          <small className="text-muted">
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-semibold text-primary">
              Register
            </Link>
          </small>
        </div>
      </div>
    </div>

  );
};

export default Login;
