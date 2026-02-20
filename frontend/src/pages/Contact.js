 import { useState } from "react";
 import api from "../services/api";




export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact", form);
      setStatus(res.data.message); // use backend message
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };

  // If status exists, show ONLY the message
  if (status) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Contact Us</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
