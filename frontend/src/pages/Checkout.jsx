import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import api from "../services/api";

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Address fields
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

 


  useEffect(() => {
  if (user) {
    setAddress(user.address || "");
    setLine1(user.line1 || "");
    setCity(user.city || "");
    setPostcode(user.postcode || "");
    setCountry(user.country || "");
  }
}, [user]);




  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!address || !line1 || !city || !postcode || !country) {
      return alert("Please fill in all address fields");
    }

    try {
      setLoading(true);

      await api.post("/checkout", {
        shippingAddress: { address, line1, city, postcode, country },
      });

      alert("Order placed successfully! (Demo)");
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

        <input
          type="text"
          placeholder="House Name/Number"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Street/Road"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Processing..." : "Confirm & Pay (Demo)"}
        </button>
      </form>
    </div>
  );
}