import { useEffect, useState } from "react";
import api from "../services/api";

// AdminOrdersPage component – displays all orders for admins and allows status updates
export default function AdminOrdersPage() {
  // State to hold the list of all orders
  const [orders, setOrders] = useState([]);

  // Function to fetch all orders from backend API
  const fetchOrders = async () => {
    const res = await api.get("/order"); // GET request to fetch all orders
    setOrders(res.data); // store response data in state
  };

  // useEffect to fetch orders once when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to update the order status (PENDING, PAID, SHIPPED, DELIVERED)
  const updateStatus = async (id, status) => {
    await api.put(`/order/${id}/status`, { status }); // send update to backend
    fetchOrders(); // refresh orders list to reflect changes
  };

  // Function to update the delivery status (Scheduled, Out for Delivery, Delivered)
  const updateDeliveryStatus = async (id, deliveryStatus) => {
    await api.put(`/order/${id}/delivery-status`, { deliveryStatus });
    fetchOrders(); // refresh list after update
  };

  return (
    <div className="page orders-page">
      <h2>All Orders</h2>

      {/* Map over orders and render each one as a card */}
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          
          {/* Order header showing order number and customer email */}
          <div className="order-header">
            <span>Order number: {order.id}</span>
            <span>{order.user.email}</span>
          </div>

          {/* Total amount for the order */}
          <p>Total: £{order.total}</p>


          {/* Order Items */}
            <div className="order-items">
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item" style={{ display: "flex", marginBottom: "10px" }}>
                  
                  {item.imageUrl && (
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", marginRight: "10px" }}
                    />
                  )}

                  <div>
                    <p><strong>{item.name}</strong></p>
                    <p>Qty: {item.quantity}</p>
                    <p>£{item.price}</p>
                  </div>

                </div>
              ))}
            </div>


          {/* Dropdown to update order status */}
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

          {/* Display delivery slot (if selected) */}
          <p><strong>Delivery Slot:</strong> {order.deliverySlot || "Not selected"}</p>

          {/* Display delivery date (formatted as YYYY-MM-DD) */}
          <p><strong>Delivery Date:</strong> {order.deliveryDate?.slice(0, 10) || "Not selected"}</p>

          {/* Dropdown to update delivery status */}
          <label><strong>Delivery Status:</strong></label>
          <select
            value={order.deliveryStatus || "SCHEDULED"}
            onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>


        </div>
      ))}
    </div>
  );
}