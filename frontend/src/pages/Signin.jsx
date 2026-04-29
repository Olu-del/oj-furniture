import { useState } from "react"; 
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Signin() {
  // Local state for form inputs
  
  const [email, setEmail] = useState("");          // User email
  const [password, setPassword] = useState("");    // User password
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [locked, setLocked] = useState(false);     // Account lock status
  const [error, setError] = useState("");          // Error messages

  // Auth context provides signin function
   const { signin } = useAuth();
  const navigate = useNavigate();                  // For page navigation

  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");   // Clear previous errors
    setLocked(false);

   

      try {

        const loggedInUser = await signin(email, password);

        // Merge guest cart...
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        if (guestCart.length > 0) {
          await api.post("/cart/merge", { items: guestCart });
          localStorage.removeItem("guestCart");
        }

        // Redirect based on role
        if (loggedInUser.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/orders");   // or navigate("/")
        }

      } catch (err) {

          const status = err.response?.status;
          const message = err.response?.data?.message;


            // Handle account locked
            if (status === 403) {
              setError(message);
              setLocked(true);
              return;
            }

            // Invalid credentials
            if (status === 401) {
              setError("Invalid email or password");
              return;
            }

            // Generic error fallbacks
            setError("Something went wrong. Try again.");
          }
        };

        
        // ACCOUNT LOCKED SCREEN
        if (locked) {
          return (
            <div className="page locked-screen">
              <h2>Account Locked</h2>
              <p>{error}</p>
              <p>
                You have entered an incorrect password 3 times. Your account is now locked. 
                Please reset your password.
              </p>

              {/* Button to navigate to password reset */}
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

        
        // NORMAL SIGN-IN FORM
        return (
          <div className="auth-container">
            <div className="auth-card">
              <h2>Sign in</h2>

              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Password Input with show/hide toggle */}
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

                {/* Forgot password link */}
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

              {/* Footer link to registration */}
              <div className="auth-footer">
                Don’t have an account? <a href="/register">Register</a>
              </div>
            </div>
          </div>
        );
      }