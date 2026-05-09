import axios from "axios";
import { API_BASE } from "../config";

export const api = axios.create({
    baseURL: API_BASE || undefined,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const cfg = error.config;
        if (!cfg || cfg._retry || error.response?.status !== 401) {
            return Promise.reject(error);
        }
        const reqUrl = `${cfg.baseURL || ""}${cfg.url || ""}`;
        if (reqUrl.includes("/api/token/") || reqUrl.includes("/api/register/")) {
            return Promise.reject(error);
        }
        cfg._retry = true;
        try {
            await api.post("/api/token/refresh/");
            return api(cfg);
        } catch {
            return Promise.reject(error);
        }
    }
);
