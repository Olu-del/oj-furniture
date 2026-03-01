import { useEffect, useState } from "react";
import api from "../services/api";
// import "./Orders.css"; // CSS file not yet created

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/order/my").then((res) => {
      setOrders(res.data);
    });
  }, []);

  if (!orders.length)
    return <div className="page"><h2>No orders yet</h2></div>;

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

          {order.orderItems.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.quantity} × Product #{item.productId}</span>
              <span>£{item.price}</span>
            </div>
          ))}

          <h4>Total: £{order.total}</h4>
        </div>
      ))}
    </div>
  );
}