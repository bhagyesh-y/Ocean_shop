import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { OceanAuthContext } from "../context/AuthContext.jsx";
import { FaShoppingCart, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const PacificNavbar = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { logoutUser } = useContext(OceanAuthContext);
    const [pacificOpen, setPacificOpen] = useState(false);
    const location = useLocation();
    const reefRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setPacificOpen(false);
    }, [location]);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setPacificOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (pacificOpen && reefRef.current) reefRef.current.focus();
    }, [pacificOpen]);

    useEffect(() => {
        if (!pacificOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [pacificOpen]);

    const desktopNavClass = ({ isActive }) =>
        `nav-link pacificNavLink${isActive ? " pacificNavLink--active" : ""}`;

    const reefLinkClass = ({ isActive }) => `reefLink${isActive ? " reefLink--active" : ""}`;

    const closeReef = () => setPacificOpen(false);

    const handleLogout = async () => {
        closeReef();
        await clearCart();
        await logoutUser();
        navigate("/login", { replace: true });
    };

    return (
        <header className="pacificNavShell sticky-top">
            <nav
                className="navbar navbar-expand-lg navbar-dark pacificNavbar"
                aria-label="Main navigation"
            >
                <div className="container-fluid px-2 px-sm-3 align-items-center gap-2">
                    <NavLink to="/" className="navbar-brand fw-bold pacificBrand mb-0" onClick={closeReef}>
                        <span className="pacificBrand__icon" aria-hidden>
                            <FaShoppingCart />
                        </span>
                        <span className="pacificBrand__text">Ocean Shop</span>
                    </NavLink>

                    <div className="pacificLinks d-none d-lg-flex ms-auto align-items-center flex-wrap justify-content-end gap-1">
                        <NavLink to="/" end className={desktopNavClass}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={desktopNavClass}>
                            Products
                        </NavLink>
                        <NavLink to="/about" className={desktopNavClass}>
                            About
                        </NavLink>
                        <NavLink to="/dashboard" className={desktopNavClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/feedback" className={desktopNavClass}>
                            Feedback
                        </NavLink>

                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                `btn pacificCartBtn position-relative ms-lg-2${isActive ? " pacificCartBtn--active" : ""}`
                            }
                        >
                            <FaShoppingCart className="me-1" aria-hidden />
                            <span className="d-none d-xl-inline">Cart</span>
                            {cart?.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill pacificCartBadge">
                                    {cart.length}
                                </span>
                            )}
                        </NavLink>

                        <NavLink to="/payment-history" className={desktopNavClass}>
                            <span className="d-none d-xl-inline">Payment </span>History
                        </NavLink>

                        <button type="button" onClick={handleLogout} className="btn pacificLogoutBtn ms-lg-2">
                            <FaSignOutAlt className="me-1" aria-hidden />
                            Logout
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn atlanticToggle d-lg-none ms-auto flex-shrink-0"
                        aria-label={pacificOpen ? "Close menu" : "Open menu"}
                        aria-expanded={pacificOpen}
                        aria-controls="reef-drawer"
                        onClick={() => setPacificOpen((o) => !o)}
                    >
                        {pacificOpen ? (
                            <FaTimes className="atlanticToggle__icon" aria-hidden />
                        ) : (
                            <FaBars className="atlanticToggle__icon" aria-hidden />
                        )}
                    </button>
                </div>
            </nav>

            {pacificOpen && (
                <button
                    type="button"
                    className="reefBackdrop"
                    aria-label="Close menu"
                    onClick={closeReef}
                />
            )}

            <div
                id="reef-drawer"
                className={`reefSidebar ${pacificOpen ? "reef-open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile menu"
                aria-hidden={!pacificOpen}
                ref={reefRef}
                tabIndex={-1}
            >
                <div className="reefHeader d-flex align-items-center justify-content-between px-3 py-3">
                    <div className="reefHeader__brand text-light fw-bold d-flex align-items-center gap-2">
                        <FaShoppingCart className="text-info" aria-hidden />
                        <span>Ocean Shop</span>
                    </div>
                    <button type="button" className="btn reefClose" aria-label="Close menu" onClick={closeReef}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="reefBody px-3 pb-4" aria-label="Mobile navigation">
                    <NavLink to="/" end className={reefLinkClass} onClick={closeReef}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={reefLinkClass} onClick={closeReef}>
                        Products
                    </NavLink>
                    <NavLink to="/about" className={reefLinkClass} onClick={closeReef}>
                        About
                    </NavLink>
                    <NavLink to="/dashboard" className={reefLinkClass} onClick={closeReef}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/feedback" className={reefLinkClass} onClick={closeReef}>
                        Feedback
                    </NavLink>
                    <NavLink to="/payment-history" className={reefLinkClass} onClick={closeReef}>
                        Payment history
                    </NavLink>
                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `btn pacificReefCart w-100 mt-2 position-relative${isActive ? " pacificReefCart--active" : ""}`
                        }
                        onClick={closeReef}
                    >
                        <FaShoppingCart className="me-2" aria-hidden />
                        Your cart
                        {cart?.length > 0 && (
                            <span className="badge rounded-pill pacificCartBadge pacificReefCart__badge">
                                {cart.length}
                            </span>
                        )}
                    </NavLink>
                    <button type="button" onClick={handleLogout} className="btn pacificReefLogout w-100 mt-3">
                        <FaSignOutAlt className="me-2" aria-hidden />
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default PacificNavbar;
