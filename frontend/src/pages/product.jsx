import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, searchProducts } from "../services/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [query, setQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    return {
      categoryId: "",
      subCategoryId: params.get("subCategoryId") || "",
      colour: "",
      sort: ""
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);

  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(amount));

  // ⭐ FIX 1 — Always ensure products is an array
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts(filters);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    }
  }, [filters]);

  // ⭐ FIX 2 — Always ensure categories have subCategories as arrays
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");

      const safeCategories = (Array.isArray(res.data) ? res.data : []).map((c) => ({
        ...c,
        subCategories: Array.isArray(c.subCategories) ? c.subCategories : []
      }));

      setCategories(safeCategories);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  const handleSearch = async () => {
    if (!query) return fetchProducts();

    try {
      const res = await searchProducts(query);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setProducts([]);
    }
  };

  // ⭐ FIX 3 — Safe subcategory selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setFilters({ ...filters, categoryId, subCategoryId: "" });

    const selected = categories.find((c) => c.id === Number(categoryId));
    setSubCategories(selected?.subCategories || []);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ⭐ FIX 4 — Safe URL sync
  useEffect(() => {
    if (!filters.subCategoryId || !categories.length) return;

    const selectedCategory = categories.find((cat) =>
      (cat.subCategories || []).some((sc) => sc.id === Number(filters.subCategoryId))
    );

    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories || []);
      setFilters((prev) => ({ ...prev, categoryId: selectedCategory.id }));
    }
  }, [filters.subCategoryId, categories]);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await api.post("/cart/add", { productId, quantity: 1 });
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1 });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }

      if (window.confirm("Product added to cart.\n\nGo to cart?")) {
        navigate("/cart");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="page">
      <h2>Products</h2>

      {/* Category Dropdown */}
      <select value={filters.categoryId} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      <select
        value={filters.subCategoryId}
        onChange={(e) => setFilters({ ...filters, subCategoryId: e.target.value })}
        disabled={!subCategories.length}
      >
        <option value="">All Subcategories</option>
        {(subCategories || []).map((sc) => (
          <option key={sc.id} value={sc.id}>{sc.name}</option>
        ))}
      </select>

      {/* Colour Filter */}
      <select
        value={filters.colour}
        onChange={(e) => setFilters({ ...filters, colour: e.target.value })}
      >
        <option value="">All Colours</option>
        <option value="Black">Black</option>
        <option value="White">White</option>
        <option value="Grey">Grey</option>
        <option value="Blue">Blue</option>
        <option value="Green">Green</option>
        <option value="Oak">Oak</option>
        <option value="Brown">Brown</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        <option value="">Sort By</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
      </select>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Product List */}
      <div className="product-list">
        {(products || []).map((p) => (
          <div key={p.id} className="product-card">
            {p.imageUrl && (
              <img
                src={`${api.defaults.baseURL.replace("/api", "")}${p.imageUrl}`}
                alt={p.name}
                className="product-image"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/product/${p.id}`)}
              />
            )}

            <h3>{p.name}</h3>

            <p className="product-description">
              <strong>Description:</strong> {p.description}
            </p>

            <p>
              <strong>Condition:</strong>{" "}
              {p.condition.replaceAll("_", " ")
                .toLowerCase()
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
            </p>

            {p.dimensions && <p><strong>Dimensions:</strong> {p.dimensions}</p>}
            {p.material && <p><strong>Material:</strong> {p.material}</p>}
            {p.age && <p><strong>Age:</strong> {p.age} years old</p>}
            {p.sustainabilityScore && (
              <p><strong>Sustainability Score:</strong> {p.sustainabilityScore}/10</p>
            )}

            <p><strong>Price:</strong> {formatGBP(p.price)}</p>
            <p><strong>Delivery:</strong> {formatGBP(p.deliveryPrice)}</p>

            <button
              className="primary-btn"
              disabled={p.stock === 0}
              onClick={() => addToCart(p.id)}
            >
              {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
