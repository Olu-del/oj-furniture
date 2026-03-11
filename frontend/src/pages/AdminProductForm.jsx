import { useEffect, useState } from "react";                                                                                                                         
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

// AdminProductForm – used for creating a new product or editing an existing one
export default function AdminProductForm() {
  // Get the product ID from route params (if editing)
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id); // determines if the form is in edit mode

  // --- State variables for product fields ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [colour, setColour] = useState("");
  const [condition, setCondition] = useState("");
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [age, setAge] = useState("");
  const [sustainabilityScore, setSustainabilityScore] = useState("");
  const [stock, setStock] = useState("");

  // --- Category and Subcategory state ---
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  // Load all categories on component mount
  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data));
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (!isEditing) return;

    api.get(`/product/${id}`).then((res) => {
      const p = res.data;

      // Populate state with existing product values
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setDeliveryPrice(p.deliveryPrice);
      setColour(p.colour);
      setCondition(p.condition);
      setCategoryId(p.categoryId);
      setSubCategoryId(p.subCategoryId);
      setStock(p.stock);
    });
  }, [id, isEditing]);

  // Update subcategories whenever the selected category changes
  useEffect(() => {
    const selected = categories.find((c) => c.id === Number(categoryId));
    setSubCategories(selected ? selected.subCategories : []);
  }, [categoryId, categories]);

  // Handle category change – reset subcategory list and selection
  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    setCategoryId(id);

    const selected = categories.find((c) => c.id === id);
    setSubCategories(selected ? selected.subCategories : []);
    setSubCategoryId(""); // reset subcategory
  };

  // Handle form submission for creating or updating product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("deliveryPrice", deliveryPrice);
    formData.append("colour", colour);
    formData.append("condition", condition);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("dimensions", dimensions);
    formData.append("material", material);
    formData.append("age", age);
    formData.append("sustainabilityScore", sustainabilityScore);
    formData.append("stock", stock);

    if (image) formData.append("image", image);

    try {
      if (isEditing) {
        // Update existing product
        await api.put(`/product/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Product updated successfully.");
      } else {
        // Create new product
        await api.post("/product/create", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Product created successfully.");
      }

      // Navigate back to product list
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

        {/* Product Description */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          style={{ width: "100%", resize: "vertical" }}
        />

        {/* Product Condition */}
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

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Category and Subcategory */}
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

        {/* Submit Button */}
        <button type="submit">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}