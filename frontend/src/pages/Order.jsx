import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// OrdersPage – displays logged-in user's past orders
export default function OrdersPage() {
  const [orders, setOrders] = useState([]); // state to store user's orders
  const navigate = useNavigate();

  
  // Fetch user's orders on component mount
  useEffect(() => {
    api.get("/order/my")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  
  // Handle empty orders 
  if (!orders.length)
    return (
      <div className="page">
        <h2>No orders yet</h2>
      </div>
    );

  
  // Render orders list 
  return (
    <div className="page orders-page">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">

          {/* Header – order ID and status */}
          <div className="order-header">
            <span>Order number: {order.id}</span>
            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          {/* Order Items – loop through each item in the order */}
          {order.orderItems.map((item) => (
            <div key={item.id} className="order-item" style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px"
            }}>

              {/* Product image */}
              {item.imageUrl && (
                <img
                  src={`${api.defaults.baseURL.replace("/api", "")}${item.imageUrl}`}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
              )}

              {/* Product details */}
              <div style={{ flex: 1 }}>
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: £{Number(item.price).toFixed(2)}</p>
                <p>Delivery: £{Number(item.deliveryPrice || 0).toFixed(2)}</p>
              </div>

            </div>
          ))}

          {/* Order Summary */}
          <div className="order-summary" style={{ marginTop: "15px" }}>
            <p>Subtotal: £{Number(order.subtotal || 0).toFixed(2)}</p>
            <p>Delivery: £{Number(order.deliveryTotal || 0).toFixed(2)}</p>
            <h3>Total: £{Number(order.total).toFixed(2)}</h3>
            <p>Delivery Slot: {order.deliverySlot}</p>
            <p>Delivery Status: {order.deliveryStatus}</p>
          </div>

          {/* Button to report issues or request return */}
          <button
            onClick={() => navigate(`/complaints/new?orderId=${order.id}`)}
            className="btn"
          >
            Report an Issue / Request Return
          </button>

          <button
            onClick={() => navigate(`/survey/${order.id}`)}
            className="btn"
          >
          Leave Feedback
        </button>

        </div>
      ))}
    </div>
  );
}