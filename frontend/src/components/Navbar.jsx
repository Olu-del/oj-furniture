import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";


// Navigation bar showing links based on user authentication status
export default function Navbar() {
  const { user } = useAuth();

  if (user === undefined) return <nav>Loading...</nav>;

  return (
    // Navigation bar with Links
    <nav >
      <Link to="/Home">Home</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/product">Products</Link>
      <Link to="/cart">Basket</Link>
      <Link to="/help">Help</Link>
    

      {!user && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/signin">Sign in</Link>
        </>
      )}

      {user && (
        <div className="user-links">
          <span>Hello, {user.firstName}</span>
          <Link to="/orders">Order History</Link>
          <Link to="/signout">Sign out</Link>
        </div>
)}

    </nav>
  );
}
