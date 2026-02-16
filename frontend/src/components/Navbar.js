import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/signin">Sign in</Link>
      <Link to="/signout">Sign out</Link>
    </nav>
  );
}
 