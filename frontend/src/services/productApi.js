import api from "./api";

// Fetch products with filters
export const getProducts = (filters) =>
  api.get("/product", { params: filters });

// Create a new product (admin only)
export const createProduct = (data) =>
  api.post("/product/create", data);

// Search products safely
export const searchProducts = (query) =>
  api.get("/product/search", { params: { q: query } });
