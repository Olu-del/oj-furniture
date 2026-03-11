//React imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";


// Admin-specific pages and routes
import AdminOrders from "./pages/AdminOrder";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./pages/AdminRoute";
import AdminProducts from "./pages/AdminProduct";
import AdminProductForm from "./pages/AdminProductForm";
import AdminComplaintsForm from "./pages/AdminComplaintsForm";
import ProductDetails from "./pages/ProductDetails";
import ComplaintForm from "./pages/ComplaintForm";





// Main App component with routing and auth context
export default function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Welcome />} /> */}
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/signout" element={<Signout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/complaints/form" element={<AdminComplaintsForm />} />
        <Route path="/complaints/new" element={<ComplaintForm />} />

        

    
      <Route
        path="/admin/product"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <AdminRoute>
            <AdminProductForm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/product/edit/:id"
        element={
          <AdminRoute>
            <AdminProductForm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      /> 


          

      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


