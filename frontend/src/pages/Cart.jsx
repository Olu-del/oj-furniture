import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function CartPage() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      fetchUserCart();
    } else {
      // const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      // setItems(guestCart);
      loadGuestCart();
    }
  }, []);

const loadGuestCart = async () => {
  const guestCart =
    JSON.parse(localStorage.getItem("guestCart")) || [];

  if (!guestCart.length) {
    setItems([]);
    return;
  }

  try {
    const productIds = guestCart.map(i => i.productId);

    const res = await api.post("/product/by-ids", {
      ids: productIds,
    });

    const products = res.data;

    const merged = guestCart.map(item => {
      const product = products.find(
        p => p.id === item.productId
      );

      return {
        ...item,
        product,
      };
    });

    setItems(merged);
  } catch (err) {
    console.error(err);
  }
};


  const fetchUserCart = async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (isLoggedIn) {
      await api.put("/cart/update", { productId, quantity });
      fetchUserCart();
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const updatedCart = guestCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm("Remove this item?")) return;

    if (isLoggedIn) {
      await api.delete(`/cart/remove/${productId}`);
      fetchUserCart();
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const updatedCart = guestCart.filter(
        (item) => item.productId !== productId
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
    }
  };

  if (!items.length)
    return (
      <div className="page">
        <h2>Your cart is empty</h2>
      </div>
    );

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0);

  return (
    <div className="page cart-page">
      <h2>Your Cart</h2>

      {items.map((item) => (
        <div key={item.productId} className="cart-item">
          <div className="cart-info">
            <h4>
              {item.product?.name || `Product #${item.productId}`}
            </h4>
            <p>£{item.product?.price || "N/A"}</p>
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
            onClick={() => removeItem(item.productId)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: £{total.toFixed(2)}</h3>

        <button
          className="primary-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}