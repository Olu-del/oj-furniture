import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/sustainability")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load sustainability stats", err));
  }, []);

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

        {/* Sustainability Overview Card */}
        <div className="admin-card sustainability-card">
          <h3>Sustainability Overview</h3>

          {!stats ? (
            <p>Loading sustainability data...</p>
          ) : (
            <div className="sustainability-stats">
              <p><strong>Total Waste Saved:</strong> {stats.totalWasteSaved} kg</p>
              <p><strong>Total CO₂ Saved:</strong> {stats.totalCO2Saved} kg</p>
              <p><strong>Average Sustainability Score:</strong> {stats.avgScore}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
