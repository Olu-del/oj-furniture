import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <nav>
    <div className="page">
      <h2>Admin Dashboard</h2>
    
      <div className="admin-links">
        <Link to="/admin/product">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
      </div>
    </div>
    </nav>
  );
  
}
