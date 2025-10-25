import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const OceanAuthContext = createContext();

export const OceanAuthProvider = ({ children }) => {
    const [oceanUser, setOceanUser] = useState(null);
    const [oceanTokens, setOceanTokens] = useState(() =>
        localStorage.getItem("oceanTokens")
            ? JSON.parse(localStorage.getItem("oceanTokens"))
            : null
    );

    const apiUrl = "http://127.0.0.1:8000/api";

    // 🌊 LOGIN
    const oceanLogin = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}/token/`, {
                username,
                password,
            });
            setOceanTokens(response.data);
            localStorage.setItem("oceanTokens", JSON.stringify(response.data));

            await fetchProfile(response.data.access);
            return true;
        } catch (err) {
            console.error("Login failed:", err.response?.data);
            return false;
        }
    };

    // 🌊 REGISTER
    const oceanRegister = async (username, email, password, confirmPassword) => {
        try {
            const response = await axios.post(`${apiUrl}/register/`, {
                username,
                email,
                password,
                password2: confirmPassword,
            });

            console.log("Registration successful:", response.data);
            return await oceanLogin(username, password);
        } catch (err) {
            console.error("Registration failed:", err.response?.data);
            return false;
        }
    };

    // 🌊 PROFILE
    const fetchProfile = async (token) => {
        try {
            const response = await axios.get(`${apiUrl}/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOceanUser(response.data);
            localStorage.setItem("oceanUser", JSON.stringify(response.data));
        } catch (err) {
            console.error("Fetching profile failed:", err);
            logoutUser();
        }
    };

    // 🌊 GOOGLE LOGIN helper (new)
    const oceanSetGoogleLogin = (tokens, user) => {
        localStorage.setItem("oceanTokens", JSON.stringify(tokens));
        localStorage.setItem("oceanUser", JSON.stringify(user));
        setOceanTokens(tokens);
        setOceanUser(user);
    };

    // 🌊 LOGOUT
    const logoutUser = () => {
        setOceanUser(null);
        setOceanTokens(null);
        localStorage.removeItem("oceanUser");
        localStorage.removeItem("oceanTokens");
    };

    // 🌊 auto-load saved login
    useEffect(() => {
        const storedTokens = localStorage.getItem("oceanTokens");
        const storedUser = localStorage.getItem("oceanUser");
        if (storedTokens && storedUser) {
            setOceanTokens(JSON.parse(storedTokens));
            setOceanUser(JSON.parse(storedUser));
        } else if (storedTokens) {
            const parsedTokens = JSON.parse(storedTokens);
            setOceanTokens(parsedTokens);
            fetchProfile(parsedTokens.access);
        }
    }, []);

    return (
        <OceanAuthContext.Provider
            value={{
                oceanUser,
                oceanTokens,
                oceanLogin,
                oceanRegister,
                logoutUser,
                oceanSetGoogleLogin, // added for Google login
            }}
        >
            {children}
        </OceanAuthContext.Provider>
    );
};
