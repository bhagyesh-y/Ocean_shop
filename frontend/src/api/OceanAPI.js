import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchProducts = async () => {
  try {
    // this will get token from localstorage
    let tokens = JSON.parse(localStorage.getItem("oceanTokens"));
    if (!tokens) throw new Error("No tokens found");

    let accessToken = tokens.access;
    // Making an API call
    let response = await axios.get(`${BASE_URL}/products/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // Django returns image urls like http://127.0.0.1:8000/media/products/speaker.jpg
    return response.data;
  } catch (error) {
    console.error("failed to load products:", error);
    throw error;
  }
};
