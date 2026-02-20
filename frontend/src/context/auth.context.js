import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  // const fetchUser = async () => {
  //   try {
  //     const res = await api.get("/user/me");
  //     setUser(res.data);
  //   } catch {
  //     setUser(null);
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, []);



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

useEffect(() => {
  fetchUser();
}, []);

  const signin = async (email, password) => {
    await api.post("/auth/signin", { email, password });
    await fetchUser();
  };

  const signout = async () => {
    await api.post("/auth/signout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
