import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Navbar() {
  const { user } = useAuth();

  if (user === undefined) return <nav>Loading...</nav>;

  return (
    <nav style={{ display: "flex", gap: "20px" }}>
      <Link to="/">Home</Link>
      <Link to="/contact">Contact</Link>

      {!user && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/signin">Sign in</Link>
        </>
      )}

      {user && (
        <>
          <span>Hello, {user.firstName}</span>
          <Link to="/signout">Sign out</Link>
        </>
      )}
    </nav>
  );
}
