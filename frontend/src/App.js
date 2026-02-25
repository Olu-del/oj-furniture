//React imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/auth.context";

// Importing page components
import './App.css';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Welcome from "./pages/Welcome";
import Contact from "./pages/Contact";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import Product from "./pages/product";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import AdminRoute from "./pages/AdminRoute";



// Main App component with routing and auth context
export default function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/signout" element={<Signout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />

<Route path="/admin" element={ <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route path="/admin/product" element={ <AdminRoute>
      <AddProduct />
    </AdminRoute>
  }
/>

        {/* <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/product" element={<AddProduct />} />
         */}

        {/* {user?.role === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} /> */}
{/* )} */}

      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


