import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/auth.context";

import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Welcome from "./pages/Welcome";
import Contact from "./pages/Contact";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


