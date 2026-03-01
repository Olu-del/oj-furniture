import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";


export default function Signout() {
  const { signout } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  handleSignout();
}, [signout, navigate]);

  
}
