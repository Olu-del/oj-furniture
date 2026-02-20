import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin(email, password);
    navigate("/welcome");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit">Sign in</button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
