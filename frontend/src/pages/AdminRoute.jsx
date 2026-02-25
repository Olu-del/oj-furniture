import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Still loading user (undefined)
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (user === null) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in but not admin
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  console.log("ADMIN ROUTE USER:", user);


  // Authorized admin
  return children;

  
  
}
