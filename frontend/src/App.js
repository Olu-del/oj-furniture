import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Welcome from "./pages/Welcome";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signout" element={<Signout />} />
      </Routes>
    </BrowserRouter>
  );
}


