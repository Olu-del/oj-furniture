import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await api.post("/auth/request-reset", { email });
//     navigate("/reset-password", { state: { email } });
//   };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/auth/request-reset", { email });
    setMessage("A reset code has been sent to your email.");
    navigate("/reset-password", { state: { email } });
  } catch (err) {
    setMessage("Something went wrong. Please try again.");
  }
};


  return (
    <div className="page">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Send Code</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
