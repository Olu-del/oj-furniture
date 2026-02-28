import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { getProducts, searchProducts } from "../services/productApi";

// Product listing page with filters and search
export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [query, setQuery] = useState("");
  

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
            <p>{p.description}</p>
            <p>Price: {formatGBP(p.price)}</p>
            <p>Delivery: {formatGBP(p.deliveryPrice)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}