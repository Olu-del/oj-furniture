import { useState } from "react";
import { createProduct } from "../services/productApi";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct({ name, description, price: parseFloat(price), deliveryPrice: parseFloat(deliveryPrice) });
    navigate("/products");
  };

  return (
    <div className="page">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required />
        <input type="number" step="0.01" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} required />
        <input type="number" step="0.01" placeholder="Delivery Price" value={deliveryPrice} onChange={e=>setDeliveryPrice(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
