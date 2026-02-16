import { useState } from "react";
import api from "../services/api";


export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth/signin", { email, password });
    window.location.href = "/welcome";
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Sign in</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Sign in</button>
    </form>
  );
}