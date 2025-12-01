import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OceanAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import.meta.env
// bcz vite exposes env variables via import.meta.env 

const Login = () => {
  const { oceanLogin, oceanSetGoogleLogin } = useContext(OceanAuthContext);//destructuring the context values
  const navigate = useNavigate(); // for navigation after login 
  const [tideForm, setTideForm] = useState({ username: "", password: "" }); // form state
  const [waveError, setWaveError] = useState("");
  const [atlanticFade, setAtlanticFade] = useState(false);

  useEffect(() => {
    setTimeout(() => setAtlanticFade(true), 150);
  }, []);

  const handleTideChange = (e) => {
    setTideForm({ ...tideForm, [e.target.name]: e.target.value });
  };

  // 🌊 Normal username/password login
  const handleWaveSubmit = async (e) => {
    e.preventDefault(); // for preventing default behaviour of refresh 
    const success = await oceanLogin(tideForm.username, tideForm.password);
    if (success) {
      toast.success(`🌊 Login successful! Welcome ${tideForm.username}`, { theme: "colored" });
      navigate("/");
    } else {
      setWaveError("Login failed. Please check your credentials 🌊");
      toast.error("❌ Invalid username or password", { theme: "colored" });
    }
  };

  // 🌊 Google OAuth
  const handleGoogleSuccess = async (response) => {
    try {
      const credential = response.credential;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      if (!res.ok) throw new Error("Google login failed 🌊");

      const data = await res.json();
      if (import.meta.env.MODE === "development") {
        console.log("✅ Google login success:", data);// once project is ready to deploy , have to remove console statements 
      }

      // Save JWT tokens localstorage but i have to change it to cookie or memory 
      localStorage.setItem("oceanTokens", JSON.stringify(data));
      localStorage.setItem("oceanUser", JSON.stringify(data.user))

      // Fetch user profile
      const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (profileRes.ok) {
        const userProfile = await profileRes.json();
        const mergedUser = {
          ...userProfile,
          picture: data.user.picture,
        }
        localStorage.setItem("oceanUser", JSON.stringify(mergedUser));
        if (import.meta.env.MODE === "development") { // before deploying remove the console or change the mode
          console.log("🌊 User profile:", mergedUser);
        }
        // update context
        oceanSetGoogleLogin(data, mergedUser);
        toast.success(`Welcome back, ${mergedUser.username}!`, { theme: "colored" });

        // Give AuthContext time to update before redirect
        setTimeout(() => navigate("/"), 400);
      }

    } catch (error) {
      console.error("❌ Google login error:", error);
      toast.error("Google login failed. Please try again!", { theme: "colored" });
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Google login failed");
    toast.error("Google Sign-In was not successful.", { theme: "colored" });
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #0077b6, #90e0ef)" }}
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
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={tideForm.password}
              onChange={handleTideChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              backgroundColor: "#023e8a",
              border: "none",
              color: "white",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#03045e";
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#023e8a";
              e.target.style.transform = "scale(1)";
            }}
          >
            🌍 Login
          </button>

          <div className="text-center mt-3">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </form>

        <div className="text-center mt-3">
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
