import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// ComplaintForm – allows users to submit a complaint or return request for a specific order
export default function ComplaintForm() {
  
  // Get orderId from URL query parameter
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate(); // for programmatic navigation after submission

  
  // Form state
  // const [form, setForm] = useState({
  //   type: "Damaged Item", // default complaint type
  //   message: "" // user's message
  // });

  const [form, setForm] = useState({
    message: ""
});


  // Status message after submission
  const [status, setStatus] = useState("");

  
  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission

    try {
      // Send POST request to create a complaint
      const res = await api.post("/complaints", {
        orderId: parseInt(orderId), // ensure orderId is a number
        ...form // spread type and message
      });

      setStatus(res.data.message); // show server response message

      // Redirect to /orders after 1.5 seconds
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      // setStatus("Failed to submit complaint."); 
      // // show error message if request fails
      setStatus(err.response?.data?.message || "Failed to submit complaint.");

    }
  };

  
  // Render form
  return (
    <div className="page">
      <h2>Report an Issue</h2>

      {/* Display the order ID */}
      <p>Order ID: {orderId}</p>

      {/* Complaint submission form */}
      <form onSubmit={handleSubmit} className="form">
        {/* <label>Issue Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option>Damaged Item</option>
          <option>Wrong Item Delivered</option>
          <option>Not as Described</option>
          <option>Request Return</option>
          <option>Other</option>
        </select> */}

        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Complaint</button>
      </form>

      {/* Show status message if present */}
      {status && <p>{status}</p>}
    </div>
  );
}