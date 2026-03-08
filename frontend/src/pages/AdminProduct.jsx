import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const res = await api.get("/product");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/product/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("Product deleted successfully.");
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="page admin-page">
      <h2>Manage Products</h2>

      <button
        className="add-btn"
        onClick={() => navigate("/admin/product/new")}
        style={{ marginBottom: "20px" }}
      >
        + Add New Product
      </button>

      <div className="admin-product-grid">
        {products.map((p) => (
          <div key={p.id} className="admin-product-card">
            {p.imageUrl && (
              <img
                src={`http://localhost:5000${p.imageUrl}`}
                alt={p.name}
                className="admin-product-thumbnail"
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ cursor: "pointer" }}
              />
            )}

            <h4>{p.name}</h4>
            <p>{p.category?.name} → {p.subCategory?.name}</p>

            <div className="admin-product-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/admin/product/edit/${p.id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}