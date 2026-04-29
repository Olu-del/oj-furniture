import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();

  
  // Local state variables
  const [loading, setLoading] = useState(false); // To show processing state during checkout
  const [saveAddress, setSaveAddress] = useState(true); // Whether to save new address
  const [savedAddress, setSavedAddress] = useState(null); // User's saved address
  const [useSavedAddress, setUseSavedAddress] = useState(true); // Toggle between saved or new address
  const [deliverySlot, setDeliverySlot] = useState(""); // Selected time slot
  const [deliveryDate, setDeliveryDate] = useState(""); // Selected delivery date

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "",
  });

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryPrice: 0,
    total: 0,
  });

  const slotTimes = {
    Morning: 8,      // 8 AM
    Afternoon: 12,   // 12 AM
    Evening: 16      // 4 PM
  };


  
  // Fetch signed-in user and saved address
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        const user = res.data;

        const addr = user.address?.[0] || {};

        const formattedAddress = {
          address: addr.address || "",
          line1: addr.line1 || "",
          line2: addr.line2 || "",
          city: addr.city || "",
          postcode: addr.postcode || "",
          country: addr.country || "",
        };

        setSavedAddress(formattedAddress);

        // Auto-fill shipping address if using saved address
        if (useSavedAddress) {
          setShippingAddress(formattedAddress);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setSavedAddress(null);
      }
    };

    fetchUser();
  }, [useSavedAddress]);

  
  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart({ items: [], subtotal: 0, deliveryPrice: 0, total: 0 });
      }
    };

    fetchCart();
  }, []);

  
    // Validate address fields before checkout
    function validateAddress(addr) {
    const errors = {};

    if (!addr.line1?.trim()) errors.line1 = "Street is required";
    if (!addr.city?.trim()) errors.city = "City is required";
    if (!addr.postcode?.trim()) errors.postcode = "Postcode is required";
    if (!addr.country?.trim()) errors.country = "Country is required";

    return errors;
  }

  function isSlotValid(slot) {
    if (!deliveryDate) return true;

    const today = new Date();
    const selected = new Date(deliveryDate);

    today.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);

    // If delivery date is not today, all slots valid
    if (today.getTime() !== selected.getTime()) return true;

    // If today, check time
    const nowHour = new Date().getHours();
    const slotHour = slotTimes[slot];

    return nowHour < slotHour;
  }


    
    // Handle checkout form submission
    const handleCheckout = async (e) => {
      e.preventDefault();

      // Decide which address to use
      const addressToUse = useSavedAddress
        ? savedAddress || shippingAddress
        : shippingAddress;

      const errors = validateAddress(addressToUse);
      if (Object.keys(errors).length > 0) {
        alert("Please complete all required address fields");
        return;
      }

      if (!deliverySlot || !deliveryDate) {
        alert("Please select a delivery date and time slot");
        return;
      }

      try {
        setLoading(true);

        // Submit checkout request
        await api.post("/checkout", {
          shippingAddress: addressToUse,
          saveAddress,
          deliverySlot,
          deliveryDate,
        });

        alert("Order placed successfully!");
        navigate("/orders"); // Redirect to orders page
      } catch (err) {
        console.error("Checkout error:", err);
        alert(err.response?.data?.message || "Checkout failed");
      } finally {
        setLoading(false);
      }
    };

    
    // Group cart items by productId for summary
    const groupedItems = cart.items.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { ...item };
      } else {
        acc[item.productId].quantity += item.quantity;
      }
      return acc;
    }, {});

    const summaryItems = Object.values(groupedItems);

  
  // Render checkout page
  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">
        {/* LEFT SIDE: Delivery Address Form */}
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h3>Delivery Address</h3>

          {/* Option to use saved address */}
          {savedAddress && (
            <div className="saved-address-box">
              <label>
                <input
                  type="radio"
                  checked={useSavedAddress}
                  onChange={() => setUseSavedAddress(true)}
                />
                Use saved address
              </label>

              <div className="saved-address">
                {savedAddress.address && <>{savedAddress.address}, </>}
                {savedAddress.line1}
                {savedAddress.line2 && <>, {savedAddress.line2}</>}
                <br />
                {savedAddress.city}, {savedAddress.postcode}
                <br />
                {savedAddress.country}
              </div>

              <label>
                <input
                  type="radio"
                  checked={!useSavedAddress}
                  onChange={() => setUseSavedAddress(false)}
                />
                Use a different address
              </label>
            </div>
          )}

          {/* New address form if not using saved address */}
          {!useSavedAddress && (
            <div className="new-address">
              <input
                placeholder="House / Flat"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
              />
              <input
                placeholder="Street"
                value={shippingAddress.line1}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    line1: e.target.value,
                  })
                }
              />
              <input
                placeholder="Address line 2 (optional)"
                value={shippingAddress.line2}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    line2: e.target.value,
                  })
                }
              />
              <input
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
              <input
                placeholder="Postcode"
                value={shippingAddress.postcode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postcode: e.target.value,
                  })
                }
              />
              <input
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* Delivery options */}
          <h3>Delivery Options</h3>
          <label>Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />

          <label>Delivery Slot</label>
          <select
            value={deliverySlot}
            onChange={(e) => setDeliverySlot(e.target.value)}
            required
          >
            <option value="">Select Delivery Slot</option>

            <option value="Morning" disabled={!isSlotValid("Morning")}>
              Morning (8am–12pm)
            </option>

            <option value="Afternoon" disabled={!isSlotValid("Afternoon")}>
              Afternoon (12pm–4pm)
            </option>

            <option value="Evening" disabled={!isSlotValid("Evening")}>
              Evening (4pm–8pm)
            </option>
          </select>

          {/* Save address checkbox */}
          <label>
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={() => setSaveAddress(!saveAddress)}
            />
            Save this address for future orders
          </label>

          <button disabled={loading} className="checkout-btn">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* RIGHT SIDE: Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          {summaryItems.map((item) => (
            <div key={item.productId} className="summary-item">
              <span>
                {item.product?.name || "Your Purchase"}

                {item.quantity}
              </span>
              <span>
                £{((item.product?.price ?? 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>£{(cart.subtotal || 0).toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>£{(cart.deliveryPrice || 0).toFixed(2)}</span>
          </div>

          <div className="summary-total">
            <strong>Total</strong>
            <strong>£{(cart.total || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}