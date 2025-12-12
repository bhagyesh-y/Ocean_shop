import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { OceanAuthContext } from "../context/AuthContext.jsx";
import { FaShoppingCart, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

/* Responsive ocean-themed Navbar */
const PacificNavbar = () => {
    const { cart } = useContext(CartContext);
    const { oceanUser, logoutUser } = useContext(OceanAuthContext);
    const [pacificOpen, setPacificOpen] = useState(false);//mobile sidebar state
    const location = useLocation(); // to track current route
    const reefRef = useRef(null);
    const navigate = useNavigate();

    // Close sidebar on route change
    useEffect(() => {
        setPacificOpen(false);
    }, [location]);

    // Close on ESC key
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setPacificOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Focus trap
    useEffect(() => {
        if (pacificOpen && reefRef.current) reefRef.current.focus();
    }, [pacificOpen]);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };


    return (
        <nav className="navbar navbar-dark bg-dark pacificNavbar">
            <div className="container-fluid">

                <NavLink to="/" className="navbar-brand fw-bold text-light">
                    Ocean Shop <FaShoppingCart className="ms-1" />
                </NavLink>

                <div className="pacificLinks d-none d-lg-flex ms-auto align-items-center">
                    {oceanUser ? (
                        <>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/products"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Products
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/feedback"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Feedback
                            </NavLink>

                            <NavLink
                                to="/cart"
                                className="btn btn-outline-light position-relative ms-3"
                            >
                                <FaShoppingCart className="me-1" />
                                {cart?.length > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </NavLink>

                            <NavLink to="/payment-history"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }>
                                Payment History
                            </NavLink>

                            {/* 🌊 Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger ms-3"
                            >
                                <FaSignOutAlt className="me-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link text-info fw-bold"
                                        : "nav-link text-light"
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="btn atlanticToggle d-lg-none ms-auto"
                    aria-label="Open menu"
                    onClick={() => setPacificOpen(true)}
                >
                    <FaBars className="text-light" />
                </button>

                {/* Mobile Sidebar */}
                <div
                    className={`reefSidebar ${pacificOpen ? "reef-open" : ""}`}
                    role="dialog"
                    aria-hidden={!pacificOpen}
                    ref={reefRef}
                    tabIndex={-1}
                >
                    <div className="reefHeader d-flex align-items-center justify-content-between px-3 py-2">
                        <div className="text-light fw-bold d-flex align-items-center">
                            <FaShoppingCart className="me-2" /> Ocean Shop
                        </div>
                        <button
                            className="btn reefClose"
                            aria-label="Close menu"
                            onClick={() => setPacificOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="reefBody px-3 py-3">
                        {oceanUser ? (
                            <>
                                <NavLink to="/" end className="reefLink">
                                    Home
                                </NavLink>
                                <NavLink to="/products" className="reefLink">
                                    Products
                                </NavLink>
                                <NavLink to="/dashboard" className="reefLink">
                                    Dashboard
                                </NavLink>
                                <NavLink to="/feedback" className="reefLink">
                                    Feedback
                                </NavLink>
                                <NavLink to="/about" className="reefLink">
                                    About</NavLink>
                                <NavLink to="/payment-history" className="reefLink">
                                    Payment History
                                    <NavLink
                                        to="/cart"
                                        className="btn btn-light w-100 mt-3 position-relative"
                                    >
                                        <FaShoppingCart className="me-1" />
                                        {cart?.length > 0 && (
                                            <span
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                                style={{ fontSize: "0.7rem" }}
                                            >
                                                {cart.length}
                                            </span>
                                        )}
                                    </NavLink>

                                    {/* 🌊 Mobile Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-danger w-100 mt-3"
                                    >
                                        <FaSignOutAlt className="me-1" /> Logout
                                    </button>
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="reefLink">
                                    Login
                                </NavLink>
                                <NavLink to="/register" className="reefLink">
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PacificNavbar;
