import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [colour, setColour] = useState("");
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [stock, setStock] = useState("");

  // Load categories
  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data));
  }, []);

  // Load product if editing
  useEffect(() => {
    if (!isEditing) return;

    api.get(`/product/${id}`).then((res) => {
      const p = res.data;

      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setDeliveryPrice(p.deliveryPrice);
      setColour(p.colour);
      setCategoryId(p.categoryId);
      setSubCategoryId(p.subCategoryId);
      setStock(p.stock);
    });
  }, [id, isEditing]);

  // Load subcategories when category changes
  useEffect(() => {
    const selected = categories.find((c) => c.id === Number(categoryId));
    setSubCategories(selected ? selected.subCategories : []);
  }, [categoryId, categories]);

  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    setCategoryId(id);

    const selected = categories.find((c) => c.id === id);
    setSubCategories(selected ? selected.subCategories : []);
    setSubCategoryId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("deliveryPrice", deliveryPrice);
    formData.append("colour", colour);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("stock", stock);

    if (image) formData.append("image", image);

    if (isEditing) {
      await api.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await api.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    navigate("/admin/product");
  };

  return (
    <div className="page">
      <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Delivery Price"
          value={deliveryPrice}
          onChange={(e) => setDeliveryPrice(e.target.value)}
          required
        />


        <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            />

        <select
          value={colour}
          onChange={(e) => setColour(e.target.value)}
          required
        >
          <option value="">Select Colour</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Grey">Grey</option>
          <option value="Oak">Oak</option>
          <option value="Brown">Brown</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <select value={categoryId} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          required
          disabled={!subCategories.length}
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.name}
            </option>
          ))}
        </select>

        <button type="submit">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}