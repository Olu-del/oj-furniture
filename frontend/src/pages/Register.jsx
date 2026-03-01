import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  
  const submit = async (e) => {
  e.preventDefault();

  try {
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


    // Registration successful → redirect
    window.location.href = "/";

  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message); // show backend message
    } else {
      alert("Something went wrong.");
    }
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

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

          

          <button type="submit">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/signin">Sign in</a>
        </div>
      </div>
    </div>
  );
}
