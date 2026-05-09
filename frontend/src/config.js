/**
 * API origin without trailing slash.
 * Leave VITE_API_URL unset in dev to use the Vite proxy (same-origin cookies).
 */
const raw = import.meta.env.VITE_API_URL;
export const API_BASE = raw ? String(raw).replace(/\/$/, "") : "";

export function apiUrl(path) {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (!API_BASE) return p;
    return `${API_BASE}${p}`;
}
