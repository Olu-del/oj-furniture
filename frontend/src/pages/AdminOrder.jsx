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

  return (
    <div className="page orders-page">
      <h2>All Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.id}</span>
            <span>{order.user.email}</span>
          </div>

          <p>Total: £{order.total}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>
      ))}
    </div>
  );
}