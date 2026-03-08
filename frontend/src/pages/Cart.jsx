import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function CartPage() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserCart();
    } else {
      loadGuestCart();
    }
  }, []);

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
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
    }
  };

  // -----------------------------
  // Modal removal logic
  // -----------------------------
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
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedCart = guestCart.filter((i) => i.productId !== itemToRemove);
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setItems(updatedCart);
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


const subtotal = items.reduce((sum, item) => {
  return sum + (item.product?.price || 0) * item.quantity;
}, 0);

const deliveryTotal = items.reduce((sum, item) => {
  return sum + (item.product?.deliveryPrice || 0) * item.quantity;
}, 0);

const grandTotal = subtotal + deliveryTotal;


  return (
    <div className="page cart-page">
      <h2>Your Cart</h2>




{items.map((item) => (
  <div key={item.productId} className="cart-item">
    
    {item.product?.imageUrl && (
      <img
        src={`http://localhost:5000${item.product.imageUrl}`}
        alt={item.product.name}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "6px"
        }}
      />
    )}

    <div className="cart-info">
      <h4>{item.product?.name || `Product #${item.productId}`}</h4>
      <p>Price: £{item.product?.price || 0}</p>
      <p>Delivery: £{item.product?.deliveryPrice || 0}</p>
      <p>
        Item Total: £
        {(
          (item.product?.price || 0) * item.quantity +
          (item.product?.deliveryPrice || 0) * item.quantity
        ).toFixed(2)}
      </p>
    </div>

    <div className="cart-controls">
      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
      <span>{item.quantity}</span>
      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
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
  <h3>Delivery: £{deliveryTotal.toFixed(2)}</h3>
  <h2>Total: £{grandTotal.toFixed(2)}</h2>

  <button
    className="primary-btn"
    onClick={() => {
  if (!isLoggedIn) {
    navigate("/signin");
  } else {
    navigate("/checkout");
  }
}}
  >
    Proceed to Checkout
  </button>
</div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to remove this item?</p>
            <button onClick={handleRemove} className="primary-btn">Yes</button>
            <button onClick={() => setModalOpen(false)} className="secondary-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}