import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, searchProducts } from "../services/productApi";

// Products page – displays products with filters, search, and add-to-cart functionality
export default function Products() {
  
  // State declarations
  const [products, setProducts] = useState([]); // Products to display
  const [categories, setCategories] = useState([]); // Categories dropdown
  const [subCategories, setSubCategories] = useState([]); // Subcategories dropdown
  const [query, setQuery] = useState(""); // Search query
  const location = useLocation();
  const navigate = useNavigate();

        
  // Initialise filters from URL query parameters
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

  
  // Helper: format price in GBP
  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(amount));

  
  // Fetch products based on current filters
  // useCallback ensures fetchProducts doesn't recreate unless filters change
  const fetchProducts = useCallback(async () => {
    const res = await getProducts(filters);
    setProducts(res.data);
  }, [filters]);

  
  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    const res = await api.get("/category");
    setCategories(res.data);
  };

  
  // Handle search button click
  const handleSearch = async () => {
    if (!query) return fetchProducts();
    const res = await searchProducts(query);
    setProducts(res.data);
  };

  
  // Handle category dropdown change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    // Reset subcategory when category changes
    setFilters({ ...filters, categoryId, subCategoryId: "" });

    // Load subcategories for selected category
    const selected = categories.find(c => c.id === Number(categoryId));
    setSubCategories(selected ? selected.subCategories : []);
  };

  
  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  
  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  
  // Sync subcategory with category if URL query param is present
  useEffect(() => {
    if (!filters.subCategoryId || !categories.length) return;

    const selectedCategory = categories.find(cat =>
      cat.subCategories.some(sc => sc.id === Number(filters.subCategoryId))
    );

    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories);
      setFilters(prev => ({ ...prev, categoryId: selectedCategory.id }));
    }
  }, [filters.subCategoryId, categories]);

  
  // Add product to cart (signed-in or guest)
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        // Signed-in user and add to server-side cart
        await api.post("/cart/add", { productId, quantity: 1 });
      } else {
        // Guest user, store in localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

        const existing = guestCart.find(item => item.productId === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1 });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }

      // Prompt user to go to cart
      const goToCart = window.confirm("Product added to cart.\n\nGo to cart?");
      if (goToCart) navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  
  // Render
  return (
    <div className="page">
      <h2>Products</h2>

      {/* Category Dropdown */}
      <select value={filters.categoryId} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(c => (
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
        {subCategories.map(sc => (
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

      {/* Price Sorting */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        <option value="">Sort By</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
      </select>

      {/* Search Box */}
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
        {products.map((p) => (
          <div key={p.id} className="product-card">

  {/* Product Image */}
  {p.imageUrl && (
    <img
      src={`${api.defaults.baseURL.replace("/api", "")}${p.imageUrl}`}
      alt={p.name}
      className="product-image"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/product/${p.id}`)}
    />
  )}

  {/* Product Info */}
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

  {/*  Extra Details */}
  {p.dimensions && (
    <p><strong>Dimensions:</strong> {p.dimensions}</p>
  )}

  {p.material && (
    <p><strong>Material:</strong> {p.material}</p>
  )}

  {p.age && (
    <p><strong>Age:</strong> {p.age} years old</p>
  )}

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