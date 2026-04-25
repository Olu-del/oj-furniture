// Simple welcome page component
// export default function Welcome() {
//   return (
//     <div className="page">
//       {/* Main heading */}
//       <h1>Welcome to OJ Furniture</h1>

//       {/* Brief description / instructions */}
//       <p>Browse products and manage your cart.</p>
//     </div>
//   );
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Welcome() {
  const { user } = useAuth();

  // Still loading auth state
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