// import axios from "./api"; 


// export const getProducts = (filters) =>
//   axios.get("/product", { params: filters });
// export const createProduct = (data) => axios.post("/product/create", data);
// export const searchProducts = (query) => axios.get(`/product/search?q=${query}`);


import api from "./api";

export const getProducts = (filters) =>
  api.get("/product", { params: filters });

export const createProduct = (data) =>
  api.post("/product/create", data);

export const searchProducts = (query) =>
  api.get(`/product/search?q=${query}`);