import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function Signout() {
  
  // Get signout function from AuthContext
  const { signout } = useAuth();
  const navigate = useNavigate(); // For redirecting after signout

  
  // Automatically sign out on component mount
  useEffect(() => {
    const handleSignout = async () => {
      await signout();       // Clear auth tokens / session
      navigate("/");          // Redirect to home page
    };

    handleSignout();          // Call signout function immediately
  }, [signout, navigate]);

  
  
}