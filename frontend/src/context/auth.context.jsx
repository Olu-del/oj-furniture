import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide auth state and functions
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);


// Function to fetch current user info
  const fetchUser = async () => {
  try {
    const res = await api.get("/user/me");
    setUser(res.data);
  } catch (err) {
    // Ignore 401 errors (unauthenticated)
    if (err.response?.status !== 401) console.error(err);
    setUser(null);
  }
};


//useEffect to check auth status on app load
useEffect(() => {
  fetchUser();
}, []);

  const signin = async (email, password) => {
    const res = await api.post("/auth/signin", { email, password });
    // Store token from response
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    await fetchUser();
    return res;
  };

  const signout = async () => {
    await api.post("/auth/signout");
    // clear stored token and update user state
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}


//export custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);
