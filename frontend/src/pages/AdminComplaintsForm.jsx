import { useEffect, useState } from "react";
import api from "../services/api";

// Admin page for viewing and managing customer complaints
export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load complaints", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      console.error("Failed to update complaint status", err);
    }
  };

  const filteredComplaints =
    filter === "ALL"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="page admin-dashboard">
      <h2>Customer Complaints & Returns</h2>

      <div className="filters">
        {["ALL", "OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active-filter" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Order</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <td colSpan="8">No complaints found.</td>
            </tr>
          ) : (
            filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.user.firstName} {c.user.lastName}</td>
                <td>#{c.orderId}</td>
                <td>{c.type}</td>
                <td>{c.message}</td>
                <td>
                  <span className={`status-badge status-${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>

                <td>
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
