import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Build API base for images (remove /api)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "";

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  // GBP formatter
  const formatGBP = (amount) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(Number(amount || 0));

  // Fetch product + related items
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/product/${id}`);
      setProduct(res.data);

      if (res.data.subCategoryId) {
        const relatedRes = await api.get(
          `/product?subCategoryId=${res.data.subCategoryId}`
        );

        const filtered = relatedRes.data.filter(
          (p) => p.id !== res.data.id
        );

        setRelated(filtered.slice(0, 4));
      }
    };

    fetchProduct();
  }, [id]);

  // Add to cart
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await api.post("/cart/add", { productId, quantity: 1 });
     
       } else {
  const guestCart =
    JSON.parse(localStorage.getItem("guestCart")) || [];

  const existing = guestCart.find(
    (item) => item.productId === productId
  );

  // Find the full product object
  const currentProduct = product; // already loaded from API

  if (existing) {
    if (existing.quantity + 1 > currentProduct.stock) {
      alert("Not enough stock available");
      return;
    }
    existing.quantity += 1;
  } else {
    if (currentProduct.stock < 1) {
      alert("This product is out of stock");
      return;
    }
    guestCart.push({ productId, quantity: 1 });
  }

  localStorage.setItem("guestCart", JSON.stringify(guestCart));
}


      alert("Product added to cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  if (!product) return <p>Loading...</p>;

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
          src={`${API_BASE}${product.imageUrl}`}
          alt={product.name}
          style={{
            width: "350px",
            objectFit: "cover",
            marginBottom: "20px"
          }}
        />
      )}

      {/* Description */}
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

      {/* Add to Cart */}
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

      {/* Related Products */}
      {related.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px" }}>Related Products</h3>

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
                    src={`${API_BASE}${r.imageUrl}`}
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

