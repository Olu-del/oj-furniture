import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { getProducts, searchProducts } from "../services/productApi";

// Product listing page with filters and search
export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  

  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    colour: "",
    sort: ""
  });

  // Helper function to format price in GBP
  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(Number(amount));

  const fetchProducts = useCallback(async () => {
    const res = await getProducts(filters);
    setProducts(res.data);
  }, [filters]);

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


  const handleCategoryChange = (e) => {
  const categoryId = e.target.value;

  setFilters({ ...filters, categoryId, subCategoryId: "" });

  const selected = categories.find(c => c.id === Number(categoryId));
  setSubCategories(selected ? selected.subCategories : []);
};


  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add product to cart (signed-in or guest)
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        // Signed-in user → DB cart
        await api.post("/cart/add", {
          productId,
          quantity: 1,
        });
      } else {
        // Guest → localStorage cart
        const guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || [];

        const existing = guestCart.find(
          (item) => item.productId === productId
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1 });
        }

        localStorage.setItem(
          "guestCart",
          JSON.stringify(guestCart)
        );
      }

      const goToCart = window.confirm(
        "Product added to cart.\n\nGo to cart?"
      );

      if (goToCart) {
        navigate("/cart");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  // When category changes, reset subcategory filter
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
        onChange={(e) =>
          setFilters({ ...filters, colour: e.target.value })
        }
      >
        <option value="">All Colours</option>
        <option value="Black">Black</option>
        <option value="White">White</option>
        <option value="Grey">Grey</option>
        <option value="Oak">Oak</option>
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

      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            {p.imageUrl && (
              <img
                src={`http://localhost:5000${p.imageUrl}`}
                alt={p.name}
                className="product-image"
              />
            )}


            <h3>{p.name}</h3>
            <p>
             <strong>Description:</strong> {p.description}</p>
             <p>{p.productDescription}</p>
            <p>
            <strong>Condition:</strong>{" "}
            {p.condition
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
          </p>
        
          <p>
          <strong>Price:</strong> {formatGBP(p.price)}</p>
          
          <p>
            <strong>Delivery:</strong> {formatGBP(p.deliveryPrice)}</p> 


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