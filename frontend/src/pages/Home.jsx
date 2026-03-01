import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/product")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);



    return (
      <div className="page">
        <h2>Home</h2>
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
            </div>
          ))}
        </div>
      </div>
    );
}