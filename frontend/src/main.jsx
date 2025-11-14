import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/Cartcontext.jsx";
import { OceanAuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google"
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import "./index.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="814347402171-qjrami4vbk4lu29tm1n490ank0apn35e.apps.googleusercontent.com">
      <OceanAuthProvider>
        <CartProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </CartProvider>
      </OceanAuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
