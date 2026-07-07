import { api } from "./http";

export const fetchProducts = async (params = {}) => {
  const response = await api.get("/api/products/", { params });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get("/api/products/categories/");
  return response.data;
};

export const fetchWishlist = async () => {
  const response = await api.get("/api/wishlist/");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post("/api/wishlist/", { product_id: productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  await api.delete(`/api/wishlist/product/${productId}/`);
};

export const fetchProductReviews = async (productId) => {
  const response = await api.get(`/api/products/${productId}/reviews/`);
  return response.data;
};

export const submitProductReview = async (productId, { rating, comment }) => {
  const response = await api.post(`/api/products/${productId}/reviews/create/`, {
    rating,
    comment,
  });
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get("/api/payments/orders/");
  return response.data;
};

export const validateCoupon = async (code, subtotal) => {
  const response = await api.post("/api/payments/validate-coupon/", {
    code,
    subtotal,
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/api/profile/", data);
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post("/api/password-reset/", { email });
  return response.data;
};

export const confirmPasswordReset = async (payload) => {
  const response = await api.post("/api/password-reset/confirm/", payload);
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.patch(`/api/cart/${cartItemId}/`, { quantity });
  return response.data;
};

export const deleteCartItem = async (cartItemId) => {
  await api.delete(`/api/cart/${cartItemId}/`);
};
