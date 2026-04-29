import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Welcome() {
  const { user } = useAuth();

  // Show loading state while user data is being fetched
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // If admin, redirect away
  if (user?.role?.toUpperCase() === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="page">
      <h1>Welcome to OJ Furniture</h1>
      <p>Browse products and manage your cart.</p>
    </div>
  );
}