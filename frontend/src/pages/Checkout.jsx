import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
// import "./Checkout.css"; // CSS file not yet created

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) return alert("Enter shipping address");

    try {
      setLoading(true);
      await api.post("/checkout", {
        shippingAddress: address,
      });

      alert("Payment successful! Order created.");
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page checkout-page">
      <h2>Checkout</h2>

      <form onSubmit={handleCheckout} className="checkout-form">
        <textarea
          placeholder="Enter full shipping address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Processing..." : "Confirm & Pay (Demo)"}
        </button>
      </form>
    </div>
  );
}