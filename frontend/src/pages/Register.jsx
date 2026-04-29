import { useState } from "react";
import api from "../services/api";

export default function Register() {

  // State variables for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); // House name/number
  const [line1, setLine1] = useState("");     // Street/road
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

 
  // Form submission handler
  const submit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send registration data to backend
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        address,
        line1,
        city,
        postcode,
        country
      });

      // Registration successful and redirect to homepage
      window.location.href = "/";

    } catch (err) {
      // Show error message from backend if available
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong.");
      }
    }
  };


  // Render registration form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={submit}>
          {/* First Name Input */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          {/* Last Name Input */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input with toggle visibility */}
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

          {/* Address Inputs */}
          <input
            type="text"
            placeholder="House Name/Number"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Street/Road"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button type="submit">Register</button>
        </form>

        {/* Footer with link to Sign In page */}
        <div className="auth-footer">
          Already have an account? <a href="/signin">Sign in</a>
        </div>
      </div>
    </div>
  );
}