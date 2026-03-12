import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// AdminProducts component – allows admins to view, add, edit, and delete products
export default function AdminProducts() {
  // State to hold all products
  const [products, setProducts] = useState([]);
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to fetch all products from backend API
  const fetchProducts = async () => {
    const res = await api.get("/product"); // GET request to fetch products
    setProducts(res.data); // update state with response
  };

  // Fetch products once when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle product deletion
  const handleDelete = async (id) => {
    // Confirm deletion with the admin
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      // Send DELETE request to backend
      await api.delete(`/product/${id}`);
      // Remove deleted product from state to update UI
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("Product deleted successfully.");
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="page admin-page">
      <h2>Manage Products</h2>

      {/* Button to navigate to create new product form */}
      <button
        className="add-btn"
        onClick={() => navigate("/admin/product/new")}
        style={{ marginBottom: "20px" }}
      >
        + Add New Product
      </button>

      {/* Grid displaying all products */}
      <div className="admin-product-grid">
        {products.map((p) => (
          <div key={p.id} className="admin-product-card">

            {/* Product image, clickable to navigate to product details */}
            {p.imageUrl && (
              <img
                src={`http://localhost:5000${p.imageUrl}`}
                alt={p.name}
                className="admin-product-thumbnail"
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ cursor: "pointer" }}
              />
            )}

            {/* Product name and category/subcategory */}
            <h4>{p.name}</h4>
            <p>{p.category?.name} → {p.subCategory?.name}</p>

            {/* Edit and Delete buttons for each product */}
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