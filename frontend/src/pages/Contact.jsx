import { useState } from "react";
import api from "../services/api";

// Contact component – allows users to send messages to site admins
export default function Contact() {
  
  // Form state
  const [form, setForm] = useState({
    name: "",    // user's name
    email: "",   // user's email
    message: ""  // message content
  });

  // Status message after submission (success or error)
  const [status, setStatus] = useState("");

   
  // Handle input changes
  const handleChange = (e) => {
    // Update form state dynamically based on input name
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      // Send form data to backend
      const res = await api.post("/contact", form);

      // Show backend success message
      setStatus(res.data.message);

      // Clear form fields
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      // Show error message if request fails
      setStatus("Something went wrong.");
    }
  };

  
  // If a status message exists, show it instead of the form
  
  if (status) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>{status}</p>
        </div>
      </div>
    );
  }

  
  // Render contact form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Contact Us</h2>

        <form onSubmit={handleSubmit} className="form">
          {/* Name input */}
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email input */}
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Message textarea */}
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}