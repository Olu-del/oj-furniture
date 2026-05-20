import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// CartPage – displays the user's cart, allows quantity updates, removal, and checkout
export default function CartPage() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [total, setTotal] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const navigate = useNavigate();

  // Build API base for images (remove /api)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "";

  // Load cart on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      fetchUserCart();
    } else {
      loadGuestCart();
    }
  }, []);

  // Load guest cart
  const loadGuestCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (!guestCart.length) return setItems([]);

    try {
      const productIds = guestCart.map((i) => i.productId);
      const res = await api.post("/product/by-ids", { ids: productIds });
      const products = res.data;

      const merged = guestCart.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));

      setItems(merged);

      const sub = merged.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
      const highestDelivery = Math.max(
        ...merged.map((i) => i.product.deliveryPrice)
      );
      const del = sub >= 50 ? 0 : highestDelivery;

      setSubtotal(sub);
      setDelivery(del);
      setTotal(sub + del);
    } catch (err) {
      console.error(err);
    }
  };

  // Load logged-in cart
  const fetchUserCart = async () => {
    try {
      const res = await api.get("/cart");

      setItems(res.data.items);
      setSubtotal(res.data.subtotal);
      setDelivery(res.data.deliveryPrice);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity (with guest stock validation)
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (isLoggedIn) {
      try {
        await api.put("/cart/update", { productId, quantity });
        fetchUserCart();
      } catch (err) {
        const message =
          err.response?.data?.error || "Failed to update quantity";

        alert(message);
        fetchUserCart();
      }
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];

      const updated = guestCart.map((item) => {
        if (item.productId === productId) {
          const product = items.find((i) => i.productId === productId)?.product;

          if (!product) return item;

          // STOCK VALIDATION
          if (quantity > product.stock) {
            alert(`Only ${product.stock} left in stock`);
            return item; // do not update
          }

          return { ...item, quantity };
        }
        return item;
      });

      localStorage.setItem("guestCart", JSON.stringify(updated));
      loadGuestCart();
    }
  };

  // Remove item modal
  const confirmRemove = (productId) => {
    setItemToRemove(productId);
    setModalOpen(true);
  };

  const handleRemove = async () => {
    if (itemToRemove !== null) {
      if (isLoggedIn) {
        await api.delete(`/cart/remove/${itemToRemove}`);
        fetchUserCart();
      } else {
        const guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || [];

        const updated = guestCart.filter(
          (i) => i.productId !== itemToRemove
        );

        localStorage.setItem("guestCart", JSON.stringify(updated));
        loadGuestCart();
      }
    }

    setModalOpen(false);
    setItemToRemove(null);
  };

  if (!items.length)
    return (
      <div className="page">
        <h2>Your cart is empty</h2>
      </div>
    );

  const freeDeliveryThreshold = 50;
  const amountLeft = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="page cart-page">
      <h2>Your Cart</h2>

      {amountLeft > 0 && (
        <p className="free-delivery-banner">
          Spend £{amountLeft.toFixed(2)} more to get FREE delivery!
        </p>
      )}

      {subtotal >= freeDeliveryThreshold && (
        <p className="free-delivery-banner success">
          You qualify for FREE delivery!
        </p>
      )}

      {items.map((item) => (
        <div key={item.productId} className="cart-item">
          {item.product?.imageUrl && (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          <div className="cart-info">
            <h4>
              {item.product?.name || `Product #${item.productId}`}
            </h4>
            <p>Price: £{item.product?.price}</p>
            <p>Delivery: £{item.product?.deliveryPrice}</p>
            <p>
              Item Total: £
              {(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>

          <div className="cart-controls">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1)
              }
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1)
              }
            >
              +
            </button>
          </div>

          <button
            className="remove-btn"
            onClick={() => confirmRemove(item.productId)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Subtotal: £{subtotal.toFixed(2)}</h3>
        <h3>Delivery: £{delivery.toFixed(2)}</h3>
        <h2>Total: £{total.toFixed(2)}</h2>

        <button
          className="primary-btn"
          onClick={() => {
            if (!isLoggedIn) navigate("/signin");
            else navigate("/checkout");
          }}
        >
          Proceed to Checkout
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to remove this item?</p>
            <button onClick={handleRemove} className="primary-btn">
              Yes
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="secondary-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
