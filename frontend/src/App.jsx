import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/Cartcontext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Feedback from "./pages/Feedback";
import { OceanAuthProvider, OceanAuthContext } from "./context/AuthContext";
import About from "./pages/About";
import CustomerService from "./pages/CustomerService";
import QuickLinks from "./pages/QuickLinks";

const AppRoutes = () => {
  const { oceanUser } = useContext(OceanAuthContext);

  // 🌊 If user is not logged in, restrict access
  if (!oceanUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Redirect any other route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ✅ Logged-in user — full site access
  return (
    <>
      <Navbar />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/quick-links" element={<QuickLinks />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <OceanAuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <AppRoutes />
          </div>
          <ToastContainer />
        </Router>
      </CartProvider>
    </OceanAuthProvider>
  );
};

export default App;
