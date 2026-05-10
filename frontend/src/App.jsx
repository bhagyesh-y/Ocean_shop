import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { OceanAuthContext } from "./context/AuthContext";
import OceanPrivateRoute from "./utils/OceanPrivateRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

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

const AppRoutes = () => {
  const { oceanUser, isAuthReady } = useContext(OceanAuthContext);

  if (!isAuthReady) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!oceanUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-fill">
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />

          <Route
            path="/"
            element={
              <OceanPrivateRoute>
                <Home />
              </OceanPrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <OceanPrivateRoute>
                <Product />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <OceanPrivateRoute>
                <ProductDetails />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <OceanPrivateRoute>
                <About />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/customer-service"
            element={
              <OceanPrivateRoute>
                <CustomerService />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/quick-links"
            element={
              <OceanPrivateRoute>
                <QuickLinks />
              </OceanPrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <OceanPrivateRoute>
                <Cart />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <OceanPrivateRoute>
                <Dashboard />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <OceanPrivateRoute>
                <Feedback />
              </OceanPrivateRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <OceanPrivateRoute>
                <PaymentHistory />
              </OceanPrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <BackToTop />
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
        <AppRoutes />
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
