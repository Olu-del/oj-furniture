import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [colour, setColour] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Cloudinary URL
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [age, setAge] = useState("");
  const [sustainabilityScore, setSustainabilityScore] = useState("");
  const [stock, setStock] = useState("");

  // Categories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

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
      setCondition(p.condition);
      setCategoryId(p.categoryId);
      setSubCategoryId(p.subCategoryId);
      setStock(p.stock);
      setImageUrl(p.imageUrl || "");
      setDimensions(p.dimensions || "");
      setMaterial(p.material || "");
      setAge(p.age || "");
      setSustainabilityScore(p.sustainabilityScore || "");
    });
  }, [id, isEditing]);

  // Update subcategories when category changes
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      price,
      deliveryPrice,
      colour,
      condition,
      categoryId,
      subCategoryId,
      dimensions,
      material,
      age,
      sustainabilityScore,
      stock,
      imageUrl, // Cloudinary URL
    };

    try {
      if (isEditing) {
        await api.put(`/product/${id}`, payload);
        alert("Product updated successfully.");
      } else {
        await api.post("/product/create", payload);
        alert("Product created successfully.");
      }

      navigate("/admin/product");
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMsg = err.response?.data?.message || err.message;
      alert("Failed to save product: " + errorMsg);
    }
  };

  return (
    <div className="page">
      <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Product Name */}
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          style={{ width: "100%", resize: "vertical" }}
        />

        {/* Condition */}
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
        >
          <option value="">Select Condition</option>
          <option value="AS_GOOD_AS_NEW">As Good As New</option>
          <option value="VERY_GOOD">Very Good</option>
          <option value="GOOD">Good</option>
          <option value="ACCEPTABLE">Acceptable</option>
          <option value="DAMAGED">Damaged</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>

        {/* Pricing */}
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

        {/* Dimensions, Material, Age, Sustainability */}
        <input
          placeholder="Dimensions (e.g., 120cm x 60cm)"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          required
        />
        <input
          placeholder="Material (e.g., Oak, Metal, Fabric)"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age (years)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Sustainability Score (1–10)"
          value={sustainabilityScore}
          onChange={(e) => setSustainabilityScore(e.target.value)}
          required
        />

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        {/* Colour */}
        <select value={colour} onChange={(e) => setColour(e.target.value)} required>
          <option value="">Select Colour</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Grey">Grey</option>
          <option value="Blue">Blue</option>
          <option value="Green">Green</option>
          <option value="Oak">Oak</option>
          <option value="Brown">Brown</option>
        </select>

        {/* Cloudinary Image URL */}
        <input
          type="text"
          placeholder="Image URL (Cloudinary)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Upload your image to Cloudinary and paste the secure URL here.
        </p>

        <div
          style={{
            background: "#f7f7f7",
            padding: "10px",
            borderRadius: "6px",
            marginTop: "8px",
            fontSize: "13px",
            color: "#444",
            lineHeight: "1.4",
          }}
        >
          <strong>Note:</strong> Image uploads are now handled through Cloudinary.
          Please upload your image to Cloudinary and paste the secure URL above.
          <br />
          <a
            href="https://console.cloudinary.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0077cc", textDecoration: "underline" }}
          >
            Open Cloudinary
          </a>
        </div>

        {/* Category */}
        <select value={categoryId} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Subcategory */}
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

        {/* Submit */}
        <button type="submit">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
