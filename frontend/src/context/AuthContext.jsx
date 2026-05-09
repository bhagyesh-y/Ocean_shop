import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const OceanAuthContext = createContext();

export const OceanAuthProvider = ({ children }) => {
    const [oceanUser, setOceanUser] = useState(null);
    const [oceanTokens, setOceanTokens] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const logoutUser = useCallback(() => {
        setOceanUser(null);
        setOceanTokens(null);
        localStorage.removeItem("oceanUser");
        localStorage.removeItem("oceanTokens");
    }, []);

    const fetchProfile = useCallback(
        async (token) => {
            const response = await axios.get(`${apiUrl}/api/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOceanUser(response.data);
            localStorage.setItem("oceanUser", JSON.stringify(response.data));
        },
        [apiUrl]
    );

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            const storedTokens = localStorage.getItem("oceanTokens");
            if (!storedTokens) {
                setOceanTokens(null);
                setOceanUser(null);
                if (!cancelled) setIsAuthReady(true);
                return;
            }

            let parsed;
            try {
                parsed = JSON.parse(storedTokens);
            } catch {
                logoutUser();
                if (!cancelled) setIsAuthReady(true);
                return;
            }

            setOceanTokens(parsed);

            try {
                await fetchProfile(parsed.access);
            } catch {
                logoutUser();
            } finally {
                if (!cancelled) setIsAuthReady(true);
            }
        };

        bootstrap();
        return () => {
            cancelled = true;
        };
    }, [fetchProfile, logoutUser]);

    const oceanLogin = async (username, password) => {
        try {
            const response = await axios.post(`${apiUrl}/api/token/`, {
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

    const oceanRegister = async (username, email, password, confirmPassword) => {
        try {
            await axios.post(`${apiUrl}/api/register/`, {
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

    const oceanSetGoogleLogin = (tokens, user) => {
        localStorage.setItem("oceanTokens", JSON.stringify(tokens));
        localStorage.setItem("oceanUser", JSON.stringify(user));
        setOceanTokens(tokens);
        setOceanUser(user);
    };

    return (
        <OceanAuthContext.Provider
            value={{
                oceanUser,
                oceanTokens,
                isAuthReady,
                oceanLogin,
                oceanRegister,
                logoutUser,
                oceanSetGoogleLogin,
            }}
        >
            {children}
        </OceanAuthContext.Provider>
    );
};
