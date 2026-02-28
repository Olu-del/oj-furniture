import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="page admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-grid">
        <Link to="/admin/product" className="admin-card">
          <h3>Manage Products</h3>
          <p>Add, edit, and delete products.</p>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <h3>Manage Orders</h3>
          <p>View and update customer orders.</p>
        </Link>
      </div>
    </div>
  );
}