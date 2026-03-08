import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/order/my").then((res) => {
      setOrders(res.data);
    });
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

      {orders.map((order) => (
        <div key={order.id} className="order-card">

          <div className="order-header">
            <span>Order #{order.id}</span>
            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          {/* Order Items */}
          {order.orderItems.map((item) => (
            <div key={item.id} className="order-item" style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px"
            }}>

              {item.imageUrl && (
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
              )}

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
          </div>

        </div>
      ))}
    </div>
  );
}