// productService.js – functions for interacting with the product API

import api from "./api"; // axios instance configured with base URL and headers

// Fetch products from the backend with optional filters (category, subcategory, color, sort, etc.)
export const getProducts = (filters) =>
  api.get("/product", { params: filters }); // filters are sent as query parameters

// Create a new product (admin only)
export const createProduct = (data) =>
  api.post("/product/create", data); // send product data in request body

// Search products by name or keyword
export const searchProducts = (query) =>
  api.get(`/product/search?q=${query}`); // query string search parameter