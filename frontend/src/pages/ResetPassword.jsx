import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
 
  // Hooks for navigation and location
  const location = useLocation(); // Access location.state passed from previous page
  const navigate = useNavigate(); // For redirecting user after reset

  // Email passed via state from RequestReset page
  const email = location.state?.email || "";

 
  // Local state for form inputs
  const [code, setCode] = useState("");           // 6-digit reset code
  const [newPassword, setNewPassword] = useState(""); // New password input

 
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send reset request to backend
      await api.post("/auth/reset-password", {
        email,
        code,
        newPassword
      });

      // Show success alert
      alert("Password successfully reset.");

      // Redirect to sign-in page
      navigate("/signin");

    } catch (err) {
      // Show error message from backend, or fallback
      alert(err.response?.data?.message || "Reset failed.");
    }
  };


  // Redirect to request-reset if email not provided
  useEffect(() => {
    if (!email) navigate("/request-reset");
  }, [email, navigate]);

  
  // Render UI
  return (
    <div className="page">
      <h2>Enter Reset Code</h2>

      {/* Form for reset code and new password */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="6-digit code"
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button>Reset Password</button>
      </form>
    </div>
  );
}