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

  // Build API base for images (remove /api)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "";

  // Initialise filters from URL
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

  // GBP formatter
  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(Number(amount || 0));

  // Fetch products safely
  const fetchProducts = useCallback(async () => {
    const res = await getProducts(filters);
    setProducts(Array.isArray(res.data) ? res.data : []);
  }, [filters]);

  // Fetch categories safely
  const fetchCategories = async () => {
    const res = await api.get("/category");
    setCategories(Array.isArray(res.data) ? res.data : []);
  };

  // Search handler
  const handleSearch = async () => {
    if (!query) return fetchProducts();
    const res = await searchProducts(query);
    setProducts(Array.isArray(res.data) ? res.data : []);
  };

  // Category dropdown change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setFilters({ ...filters, categoryId, subCategoryId: "" });

    const selected = categories.find((c) => c.id === Number(categoryId));

    setSubCategories(
      selected && Array.isArray(selected.subCategories)
        ? selected.subCategories
        : []
    );
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync subcategory from URL
  useEffect(() => {
    if (!filters.subCategoryId || !categories.length) return;

    const selectedCategory = categories.find(
      (cat) =>
        Array.isArray(cat.subCategories) &&
        cat.subCategories.some(
          (sc) => sc.id === Number(filters.subCategoryId)
        )
    );

    if (selectedCategory) {
      setSubCategories(
        Array.isArray(selectedCategory.subCategories)
          ? selectedCategory.subCategories
          : []
      );

      setFilters((prev) => ({
        ...prev,
        categoryId: selectedCategory.id
      }));
    }
  }, [filters.subCategoryId, categories]);

  // Add to cart
// Add to cart
const addToCart = async (productId) => {
  const token = localStorage.getItem("token");

  try {
    // Always fetch product to get real stock
    const productRes = await api.get(`/product/${productId}`);
    const product = productRes.data;
    const availableStock = product.stock;

    if (availableStock === 0) {
      alert("This product is out of stock");
      return;
    }

    if (token) {
      // Logged‑in user → backend validates stock
      await api.post("/cart/add", { productId, quantity: 1 });
    } else {
      // Guest user → validate stock manually
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];

      const existing = guestCart.find(
        (item) => item.productId === productId
      );

      const currentQty = existing ? existing.quantity : 0;

      if (currentQty + 1 > availableStock) {
        alert(`Only ${availableStock} left in stock`);
        return;
      }

      // Add or update item
      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({ productId, quantity: 1 });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }

    // Redirect only if successfully added
    navigate("/cart");

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
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      <select
        value={filters.subCategoryId}
        onChange={(e) =>
          setFilters({ ...filters, subCategoryId: e.target.value })
        }
        disabled={!subCategories.length}
      >
        <option value="">All Subcategories</option>
        {subCategories.map((sc) => (
          <option key={sc.id} value={sc.id}>
            {sc.name}
          </option>
        ))}
      </select>

      {/* Colour Filter */}
      <select
        value={filters.colour}
        onChange={(e) =>
          setFilters({ ...filters, colour: e.target.value })
        }
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
        onChange={(e) =>
          setFilters({ ...filters, sort: e.target.value })
        }
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
            {p.imageUrl && (
              <img
                src={`${API_BASE}${p.imageUrl}`}
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
              {p.condition
                ?.replaceAll("_", " ")
                .toLowerCase()
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
            </p>

            {p.dimensions && (
              <p>
                <strong>Dimensions:</strong> {p.dimensions}
              </p>
            )}

            {p.material && (
              <p>
                <strong>Material:</strong> {p.material}
              </p>
            )}

            {p.age && (
              <p>
                <strong>Age:</strong> {p.age} years old
              </p>
            )}

            {p.sustainabilityScore && (
              <p>
                <strong>Sustainability Score:</strong>{" "}
                {p.sustainabilityScore}/10
              </p>
            )}

            <p>
              <strong>Price:</strong> {formatGBP(p.price)}
            </p>
            <p>
              <strong>Delivery:</strong> {formatGBP(p.deliveryPrice)}
            </p>

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
