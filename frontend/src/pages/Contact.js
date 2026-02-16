import { useState } from "react";
import api from "../services/api";


// Contact page with form to submit messages to the support team
export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Status message to show after form submission
  const [status, setStatus] = useState("");


  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", form);
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };


  // Render contact form
  return (
    <div className="page">
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

      {status && <p>{status}</p>}
    </div>
  );
}
