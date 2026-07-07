import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/http";
import { apiUrl } from "../config";

export const OceanAuthContext = createContext();

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem("oceanUser");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const OceanAuthProvider = ({ children }) => {
    // Hydrate from localStorage so a refresh doesn't flash back to /login
    // before the cookie-based profile check completes.
    const [oceanUser, setOceanUser] = useState(readStoredUser);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const logoutUser = useCallback(async () => {
        try {
            await fetch(apiUrl("/api/logout/"), {
                method: "POST",
                credentials: "include",
            });
        } catch {
            /* ignore */
        }
        setOceanUser(null);
        localStorage.removeItem("oceanUser");
    }, []);

    const fetchProfile = useCallback(async () => {
        const response = await api.get("/api/profile/");
        setOceanUser(response.data);
        localStorage.setItem("oceanUser", JSON.stringify(response.data));
    }, []);

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            try {
                await fetchProfile();
            } catch (err) {
                // Only log out on a real "unauthenticated" response (after the
                // interceptor's refresh attempt). Network/other errors keep the
                // cached user so a hiccup doesn't kick you to /login.
                if (!cancelled && err?.response?.status === 401) {
                    setOceanUser(null);
                    localStorage.removeItem("oceanUser");
                }
            } finally {
                if (!cancelled) setIsAuthReady(true);
            }
        };

        bootstrap();
        return () => {
            cancelled = true;
        };
    }, [fetchProfile]);

    const oceanLogin = async (username, password) => {
        try {
            const { data } = await api.post("/api/token/", { username, password });
            if (data.user) {
                setOceanUser(data.user);
                localStorage.setItem("oceanUser", JSON.stringify(data.user));
            } else {
                await fetchProfile();
            }
            return true;
        } catch (err) {
            console.error("Login failed:", err.response?.data);
            return false;
        }
    };

    const oceanRegister = async (username, email, password, confirmPassword) => {
        try {
            await api.post("/api/register/", {
                username,
                email,
                password,
                password2: confirmPassword,
            });
            return await oceanLogin(username, password);
        } catch (err) {
            console.error("Registration failed:", err.response?.data);
            return false;
        }
    };

    const oceanSetUser = useCallback((user) => {
        setOceanUser(user);
        localStorage.setItem("oceanUser", JSON.stringify(user));
    }, []);

    /** After Google OAuth: same shape as /api/profile/ plus picture (set in one response). */
    const oceanSetGoogleUser = (user) => {
        oceanSetUser(user);
    };

    return (
        <OceanAuthContext.Provider
            value={{
                oceanUser,
                isAuthReady,
                oceanLogin,
                oceanRegister,
                logoutUser,
                oceanSetGoogleUser,
                oceanSetUser,
            }}
        >
            {children}
        </OceanAuthContext.Provider>
    );
};
