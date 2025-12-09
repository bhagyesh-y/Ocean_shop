import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async () => {
  try {
    let tokens = JSON.parse(localStorage.getItem("oceanTokens"));
    if (!tokens) throw new Error("No tokens found");

    let accessToken = tokens.access;

    let response = await axios.get(`${BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("failed to load products:", error);
    throw error;
  }
};
