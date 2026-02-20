import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [locked, setLocked] = useState(false);
  const [ setError] = useState("");
  
  const { signin } = useAuth();
  const navigate = useNavigate();


  
  
  //Signin handler with lockout logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLocked(false);

    try {
       await signin(email, password);
       navigate("/welcome");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) {
        // Account locked
        setError(message);
        setLocked(true);

        // Set lock expiry to 15 minutes from now
        // const expires = new Date(Date.now() + 15 * 60 * 1000);
        // setLockExpiresAt(expires);

        return;
      }

      if (status === 401) {
        setError("Invalid email or password");
        return;
      }

      setError("Something went wrong. Try again.");
    }
  };


   // -------------------------------
  // ACCOUNT LOCKED SCREEN
  // -------------------------------
  if (locked) {
    return (
      <div className="page locked-screen">
        <h2>Account Locked</h2>
        <p>
        You have entered an incorrect password 3 times. Your account is now locked. Please reset your password.
      </p>
        

        

        <button
          onClick={() => navigate("/request-reset", { state: { email } })}
          className="primary-btn"
          style={{ marginTop: "20px" }}
        >
          Reset Password
        </button>
      </div>
    );
  }

  //Normal signin form
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

          <p
        style={{
          marginTop: "10px",
          textDecoration: "underline",
          cursor: "pointer",
          color: "#0077cc"
        }}
        onClick={() => navigate("/request-reset")}
      >
        Forgot password?
      </p>
        </form>

        <div className="auth-footer">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>

    
  );
}
