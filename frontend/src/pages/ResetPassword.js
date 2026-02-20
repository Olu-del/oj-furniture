import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/auth/reset-password", {
      email,
      code,
      newPassword
    });

    navigate("/login");
  };

  return (
    <div className="page">
      <h2>Enter Reset Code</h2>

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
