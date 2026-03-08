import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/order");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/order/${id}/status`, { status });
    fetchOrders();
  };

  const updateDeliveryStatus = async (id, deliveryStatus) => {
    await api.put(`/order/${id}/delivery-status`, { deliveryStatus });
    fetchOrders();
  };

  return (
    <div className="page orders-page">
      <h2>All Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          
          {/* Header */}
          <div className="order-header">
            <span>Order #{order.id}</span>
            <span>{order.user.email}</span>
          </div>

          <p>Total: £{order.total}</p>

          {/* Order Status */}
          <label><strong>Order Status:</strong></label>
          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>

          {/* Delivery Slot */}
          <p><strong>Delivery Slot:</strong> {order.deliverySlot || "Not selected"}</p>

          {/* Delivery Date */}
          <p><strong>Delivery Date:</strong> {order.deliveryDate?.slice(0, 10) || "Not selected"}</p>

          {/* Delivery Status */}
          <label><strong>Delivery Status:</strong></label>
          <select
            value={order.deliveryStatus || "Scheduled"}
            onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

        </div>
      ))}
    </div>
  );
}
