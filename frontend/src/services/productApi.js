
import api from "./api";

export const getProducts = (filters) =>
  api.get("/product", { params: filters });

export const createProduct = (data) =>
  api.post("/product/create", data);

export const searchProducts = (query) =>
  api.get(`/product/search?q=${query}`);