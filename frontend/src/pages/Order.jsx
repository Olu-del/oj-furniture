import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/order/my")
      .then((res) => {
        const safeOrders = Array.isArray(res.data) ? res.data : [];
        setOrders(safeOrders);
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  if (!orders.length)
    return (
      <div className="page">
        <h2>No orders yet</h2>
      </div>
    );

  return (
    <div className="page orders-page">
      <h2>My Orders</h2>

      {orders.map((order) => {
        const items = Array.isArray(order.orderItems)
          ? order.orderItems
          : [];

        return (
          <div key={order.id} className="order-card">

            <div className="order-header">
              <span>Order number: {order.id}</span>
              <span className={`status ${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="order-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h4>{item.name || "Product"}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: £{Number(item.price || 0).toFixed(2)}</p>
                  <p>Delivery: £{Number(item.deliveryPrice || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="order-summary" style={{ marginTop: "15px" }}>
              <p>Subtotal: £{Number(order.subtotal || 0).toFixed(2)}</p>
              <p>Delivery: £{Number(order.deliveryTotal || 0).toFixed(2)}</p>
              <h3>Total: £{Number(order.total || 0).toFixed(2)}</h3>
              <p>Delivery Slot: {order.deliverySlot || "Not selected"}</p>
              <p>Delivery Status: {order.deliveryStatus || "Pending"}</p>
            </div>

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
        );
      })}
    </div>
  );
}
