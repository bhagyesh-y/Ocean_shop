import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { CartProvider } from "./context/Cartcontext";
import { OceanAuthProvider, OceanAuthContext } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Scroll To Top Component
import ScrollToTop from "./components/Scrolltotop";
import BackToTop from "./components/BackToTop";

// Page Components
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import CustomerService from "./pages/CustomerService";
import QuickLinks from "./pages/QuickLinks";
import PaymentHistory from "./pages/PaymentHistory";

// main app routes component 
const AppRoutes = () => {
  const { oceanUser } = useContext(OceanAuthContext);

  // If user is not logged in, restrict access
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

  // Logged-in user — full site access
  return (
    <>
      <Navbar />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/quick-links" element={<QuickLinks />} />
          <Route path="/payment-history" element={<PaymentHistory />} />

          {/* Redirect any other route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
          <BackToTop />
          <ScrollToTop />
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