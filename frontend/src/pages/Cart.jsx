import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// CartPage – displays the user's cart, allows quantity updates, removal, and checkout
export default function CartPage() {
  // --- State variables ---
  const [items, setItems] = useState([]); // cart items
  const [isLoggedIn, setIsLoggedIn] = useState(false); // user authentication status
  const [modalOpen, setModalOpen] = useState(false); // remove item confirmation modal
  const [itemToRemove, setItemToRemove] = useState(null); // currently selected item to remove
  const navigate = useNavigate();

   
  // Load cart on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // user is logged in
      fetchUserCart(); // fetch cart from server
    } else {
      loadGuestCart(); // fetch cart from local storage
    }
  }, []);

  
  // Load guest cart from localStorage
  const loadGuestCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (!guestCart.length) return setItems([]);

    try {
      // Fetch product details from server using IDs in guest cart
      const productIds = guestCart.map((i) => i.productId);
      const res = await api.post("/product/by-ids", { ids: productIds });
      const products = res.data;

      // Merge product details with guest cart quantities
      const merged = guestCart.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));

      setItems(merged);
    } catch (err) {
      console.error(err);
    }
  };

   
  // Load logged-in user cart from API 
  const fetchUserCart = async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  
  // Update item quantity 
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // prevent quantity less than 1

    if (isLoggedIn) {
      // Update cart on server
      await api.put("/cart/update", { productId, quantity });
      fetchUserCart(); // refresh cart
    } else {
      // Update guest cart in localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
    }
  };

  
  // Modal removal logic
  const confirmRemove = (productId) => {
    setItemToRemove(productId); // set selected item
    setModalOpen(true); // open confirmation modal
  };

  const handleRemove = async () => {
    if (itemToRemove !== null) {
      if (isLoggedIn) {
        // Remove from server cart
        await api.delete(`/cart/remove/${itemToRemove}`);
        fetchUserCart(); // refresh cart
      } else {
        // Remove from guest cart in localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedCart = guestCart.filter((i) => i.productId !== itemToRemove);
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setItems(updatedCart);
      }
    }
    setModalOpen(false); // close modal
    setItemToRemove(null); // reset selected item
  };

   
  // Empty cart UI 
  if (!items.length)
    return (
      <div className="page">
        <h2>Your cart is empty</h2>
      </div>
    );

   
  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const freeDeliveryThreshold = 50; // threshold for free delivery
  const amountLeft = Math.max(0, freeDeliveryThreshold - subtotal); // amount left to qualify

  const highestDelivery = Math.max(
    ...items.map((item) => item.product?.deliveryPrice || 0)
  );

  const deliveryTotal = subtotal >= freeDeliveryThreshold ? 0 : highestDelivery; // delivery charge
  const grandTotal = subtotal + deliveryTotal;
 
  // Render cart page
  return (
    <div className="page cart-page">
      <h2>Your Cart</h2>

      {/* Free delivery banner */}
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

      {/* Cart items */}
      {items.map((item) => (
        <div key={item.productId} className="cart-item">
          {/* Product image */}
          {item.product?.imageUrl && (
            <img
              src={`${api.defaults.baseURL.replace("/api", "")}${item.product.imageUrl}`}
              alt={item.product.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          {/* Product details */}
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

          {/* Quantity controls */}
          <div className="cart-controls">
            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
              +
            </button>
          </div>

          {/* Remove button */}
          <button className="remove-btn" onClick={() => confirmRemove(item.productId)}>
            Remove
          </button>
        </div>
      ))}

      {/* Cart summary */}
      <div className="cart-summary">
        <h3>Subtotal: £{subtotal.toFixed(2)}</h3>
        <h3>Delivery: £{deliveryTotal.toFixed(2)}</h3>
        <h2>Total: £{grandTotal.toFixed(2)}</h2>

        {/* Checkout button */}
        <button
          className="primary-btn"
          onClick={() => {
            if (!isLoggedIn) {
              navigate("/signin"); // redirect guest to sign in
            } else {
              navigate("/checkout"); // proceed to checkout
            }
          }}
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to remove this item?</p>
            <button onClick={handleRemove} className="primary-btn">
              Yes
            </button>
            <button onClick={() => setModalOpen(false)} className="secondary-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}