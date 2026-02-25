import { useState, useEffect } from "react";
import { getProducts, searchProducts } from "../services/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(Number(amount));

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
