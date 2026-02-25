import axios from "./api"; 

// export const getProducts = () => axios.get("/product");
export const getProducts = (filters) =>
  axios.get("/product", { params: filters });
export const createProduct = (data) => axios.post("/product/create", data);
export const searchProducts = (query) => axios.get(`/product/search?q=${query}`);
