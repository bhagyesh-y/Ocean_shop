import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Public product catalog — no login required.
 * Sends Bearer token when present so staff can still use authenticated flows.
 */
export const fetchProducts = async () => {
  const headers = {};
  try {
    const raw = localStorage.getItem("oceanTokens");
    if (raw) {
      const tokens = JSON.parse(raw);
      if (tokens?.access) {
        headers.Authorization = `Bearer ${tokens.access}`;
      }
    }
  } catch {
    // ignore invalid token JSON
  }

  const response = await axios.get(`${BASE_URL}/api/products/`, { headers });
  return response.data;
};
