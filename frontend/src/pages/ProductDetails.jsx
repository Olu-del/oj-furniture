import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

 
  // State variables
  const [product, setProduct] = useState(null); // The main product details
  const [related, setRelated] = useState([]);   // Related products (same subcategory)

  
  // Helper function to format price in GBP
  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(Number(amount));

 
  // Fetch product details and related products on mount or when `id` changes
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/product/${id}`);
      setProduct(res.data);

      // If product has a subcategory, fetch related products
      if (res.data.subCategoryId) {
        const relatedRes = await api.get(
          `/product?subCategoryId=${res.data.subCategoryId}`
        );

        // Exclude the current product from related list
        const filtered = relatedRes.data.filter(
          (p) => p.id !== res.data.id
        );

        setRelated(filtered.slice(0, 4)); // Limit to 4 related products
      }
    };

    fetchProduct();
  }, [id]);

  
  // Add product to cart (handles signed-in users and guests)
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        // Signed-in user and add to server-side cart
        await api.post("/cart/add", {
          productId,
          quantity: 1
        });
      } else {
        // Guest user, store in localStorage
        const guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || [];

        const existing = guestCart.find(
          (item) => item.productId === productId
        );

        if (existing) {
          existing.quantity += 1; // Increment if already in cart
        } else {
          guestCart.push({ productId, quantity: 1 }); // Add new item
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }

      alert("Product added to cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  
  // Loading state
  if (!product) return <p>Loading...</p>;

  
  // Render
  return (
    <div className="page">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Products
      </button>

      {/* Product Name */}
      <h2>{product.name}</h2>

      {/* Product Image */}
      {product.imageUrl && (
        <img
          src={`${api.defaults.baseURL.replace("/api", "")}${product.imageUrl}`}
          alt={product.name}
          style={{
            width: "350px",
            objectFit: "cover",
            marginBottom: "20px"
          }}
        />
      )}

      {/* Multi-line Description */}
      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.6",
          maxWidth: "600px"
        }}
      >
        <strong>Description:</strong> {product.description}
      </p>

      {/* Price & Delivery */}
      <p><strong>Price:</strong> {formatGBP(product.price)}</p>
      <p><strong>Delivery:</strong> {formatGBP(product.deliveryPrice)}</p>

      {/* Add to Cart Button / Out of Stock */}
      <button
        disabled={product.stock === 0}
        onClick={() => addToCart(product.id)}
        style={{
          padding: "10px 20px",
          marginTop: "15px",
          cursor: product.stock === 0 ? "not-allowed" : "pointer"
        }}
      >
        {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
      </button>

      {/* Related Products Section */}
      {related.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px" }}>
            Related Products
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "20px",
              marginTop: "20px"
            }}
          >
            {related.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "center"
                }}           
                onClick={() => navigate(`/product/${r.id}`)}
              >
                {r.imageUrl && (
                  <img
                    src={`${api.defaults.baseURL.replace("/api", "")}${r.imageUrl}`}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                  />
                )}
                <p style={{ marginTop: "10px" }}>{r.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}