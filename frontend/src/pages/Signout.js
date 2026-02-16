import { useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signout() {
  const navigate = useNavigate();

  useEffect(() => {
    api.post("/auth/signout").finally(() => {
      navigate("/signin");
    });
  }, [navigate]);

  return <p>Signing out...</p>;
}
