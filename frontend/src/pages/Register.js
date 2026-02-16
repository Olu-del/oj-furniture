import { useState } from "react";
import api from "../services/api";


export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password
    });
    window.location.href = "/signin";
  };

  return (
    <form onSubmit={submit} className="form">
      <h2>Register</h2>

      <input
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Register</button>
    </form>
  );
}
