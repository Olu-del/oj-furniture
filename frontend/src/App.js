import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/auth.context";

import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Welcome from "./pages/Welcome";


export default function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signout" element={<Signout />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


