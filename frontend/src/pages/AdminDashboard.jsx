import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// AdminDashboard component – main admin landing page with navigation cards and stats
export default function AdminDashboard() {
  // State to hold sustainability stats fetched from backend
  const [stats, setStats] = useState(null);

  // Fetch sustainability statistics on component mount
  useEffect(() => {
    api.get("/admin/sustainability") // GET request to backend API
      .then((res) => setStats(res.data)) // store response in state
      .catch((err) => console.error("Failed to load sustainability stats", err)); // handle errors
  }, []); // empty dependency array ensures this runs once on mount

  return (
    <div className="page admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Grid container for admin cards */}
      <div className="admin-product-grid">

        {/* Card linking to Product Management */}
        <Link to="/admin/product" className="admin-product-card">
          <h3>Manage Products</h3>
          <p>Add, edit, and delete products.</p>
        </Link>

        {/* Card linking to Order Management */}
        <Link to="/admin/orders" className="admin-product-card">
          <h3>Manage Orders</h3>
          <p>View and update customer orders.</p>
        </Link>

        {/* Card linking to Complaints & Returns Management */}
        <Link to="/admin/complaints/form" className="admin-product-card">
          <h3>Complaints & Returns</h3>
          <p>Review and resolve customer issues.</p>
        </Link>

        {/* Sustainability Overview Card – shows stats fetched from backend */}
        <div className="admin-product-card sustainability-card">
          <h3>Sustainability Overview</h3>

          {/* Show loading message until stats are fetched */}
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