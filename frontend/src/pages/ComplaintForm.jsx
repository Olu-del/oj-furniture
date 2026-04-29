import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Form for submitting order complaints and return requests
export default function ComplaintForm() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "Wrong Item Delivered",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/complaints", {
        orderId: parseInt(orderId),
        ...form
      });

      setStatus(res.data.message);

      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to submit complaint.");
    }
  };

  return (
    <div className="page">
      <h2>Report an Issue</h2>

      <p>Order ID: {orderId}</p>

      <form onSubmit={handleSubmit} className="form">

        <label>Issue</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="Wrong Item Delivered">Wrong Item Delivered</option>
          <option value="Not as Described">Not as Described</option>
          <option value="Request Return">Request Return</option>
          <option value="Damaged Item">Damaged Item</option>
          <option value="Other">Other</option>
        </select>

        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Complaint</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
