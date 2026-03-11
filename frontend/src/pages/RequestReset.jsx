import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RequestReset() {
  
  // State variables
  const [email, setEmail] = useState("");      // User's email input
  const [message, setMessage] = useState("");  // Status message (success/error)
  const navigate = useNavigate();              // For navigation after request

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send request to backend to initiate password reset
      await api.post("/auth/request-reset", { email });

      // Show success message
      setMessage("A reset code has been sent to your email.");

      // Navigate to the reset password page and pass email via state
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      // Show error message from backend, or fallback message
      setMessage(err.response?.data?.message || "Request failed.");
    }
  };

 
  // Render UI
  return (
    <div className="page">
      <h2>Reset Password</h2>

      {/* Email input form */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Send Code</button>
      </form>

      {/* Display status message */}
      {message && <p>{message}</p>}
    </div>
  );
}