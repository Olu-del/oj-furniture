import { useState, useEffect } from "react";
import { getProducts, searchProducts } from "../services/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const fetchAll = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleSearch = async () => {
    if (!query) return fetchAll();
    const res = await searchProducts(query);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="page">
      <h2>Products</h2>

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
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>Price: ${p.price.toFixed(2)}</p>
            <p>Delivery: ${p.deliveryPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
