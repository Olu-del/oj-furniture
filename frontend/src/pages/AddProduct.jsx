import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("deliveryPrice", deliveryPrice);
    formData.append("image", image);

    await api.post("/product/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    navigate("/product");
  };

  return (
    <div className="page">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        
        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Delivery Price"
          value={deliveryPrice}
          onChange={e => setDeliveryPrice(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Add Product</button>
      
  

      </form>
    </div>
  );
}


