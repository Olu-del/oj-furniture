import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Still loading user (undefined)
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // Not signed in
  if (user === null) {
    return <Navigate to="/signin" replace />;
  }

  // Signed in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  

  // Authorised admin
  return children;

  
  
}
