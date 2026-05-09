import { api } from "./http";

export const fetchProducts = async () => {
  const response = await api.get("/api/products/");
  return response.data;
};
