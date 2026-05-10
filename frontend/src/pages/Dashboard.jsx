import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cartcontext";
import { OceanAuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/http";
import { FaAnchor, FaReceipt, FaShoppingBasket } from "react-icons/fa";

const Dashboard = () => {
    const { cart, cartCount, totalPrice } = useContext(CartContext);
    const { oceanUser } = useContext(OceanAuthContext);
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const userOcean = {
        name: oceanUser?.first_name || oceanUser?.username || "Guest User",
        email: oceanUser?.email || "guest@example.com",
        avatar: oceanUser?.picture || "",
    };

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const res = await api.get("/api/payments/recent/");
                setRecentOrders(res.data);
            } catch {
                toast.error("Could not load recent orders");
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchRecentOrders();
    }, []);

    return (
        <div
            className={`ocean-dashboard-page ${atlanticFade ? "ocean-dashboard-page--visible" : ""}`}
        >
            <div className="ocean-dashboard-sheen" aria-hidden />

            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <div className="ocean-dashboard-inner mx-auto">
                    <header className="text-center mb-4 mb-md-5">
                        <p className="ocean-dashboard-eyebrow text-uppercase small fw-semibold mb-2">
                            <FaAnchor className="me-2" aria-hidden />
                            Your harbor
                        </p>
                        <h1 className="h2 fw-bold ocean-dashboard-title mb-2">Dashboard</h1>
                        <p className="ocean-dashboard-lead mx-auto mb-0">
                            Profile, recent voyages paid, and what&apos;s waiting in your net.
                        </p>
                    </header>

                    <section className="ocean-surface-card ocean-surface-card--profile mb-4 mb-md-4 text-center">
                        <div className="ocean-profile-ring mx-auto mb-3">
                            <img
                                src={
                                    userOcean.avatar && userOcean.avatar !== ""
                                        ? userOcean.avatar
                                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt=""
                                width={112}
                                height={112}
                                className="rounded-circle ocean-profile-img"
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                        </div>
                        <h2 className="h4 text-primary fw-bold mb-1">{userOcean.name}</h2>
                        <p className="text-muted small mb-0">{userOcean.email}</p>
                    </section>

                    <section className="ocean-surface-card mb-4 mb-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3 pb-2 ocean-surface-card__head">
                            <FaReceipt className="text-info ocean-surface-card__icon" aria-hidden />
                            <h2 className="h5 fw-bold text-primary mb-0">Recent orders</h2>
                        </div>

                        {loadingOrders ? (
                            <div className="text-center py-4 py-md-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading</span>
                                </div>
                                <p className="mt-3 text-muted small mb-0">Charting your latest payments…</p>
                            </div>
                        ) : recentOrders.length > 0 ? (
                            <>
                                <div className="ocean-dashboard-table-wrap">
                                    <table className="table table-hover align-middle mb-0 ocean-dashboard-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Order</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Method</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order, index) => (
                                                <tr key={order.order_id ?? index}>
                                                    <td data-label="Order">{order.order_id}</td>
                                                    <td data-label="Amount">₹{order.amount}</td>
                                                    <td data-label="Method">{order.method?.toUpperCase()}</td>
                                                    <td data-label="Status">
                                                        <span className="badge rounded-pill ocean-badge-success">
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-center mt-4">
                                    <NavLink
                                        to="/payment-history"
                                        className="btn ocean-dash-btn-secondary rounded-pill px-4"
                                    >
                                        Full payment log
                                    </NavLink>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-muted mb-0 py-3">
                                No recent paid orders yet — your tide will come.
                            </p>
                        )}
                    </section>

                    <section className="ocean-surface-card text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3 ocean-surface-card__head ocean-surface-card__head--center">
                            <FaShoppingBasket className="text-info ocean-surface-card__icon" aria-hidden />
                            <h2 className="h5 fw-bold text-primary mb-0">Cart summary</h2>
                        </div>

                        {cart.length > 0 ? (
                            <>
                                <p className="fw-semibold mb-1">
                                    Items: <span className="text-primary">{cartCount}</span>
                                </p>
                                <p className="fw-semibold mb-4">
                                    Total: <span className="text-success">₹{totalPrice}</span>
                                </p>
                                <NavLink to="/cart" className="btn ocean-dash-btn-primary w-100 py-3 rounded-4">
                                    Open cart
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <p className="text-muted mb-4">Your cart is empty — cast off toward the catalog.</p>
                                <NavLink to="/products" className="btn ocean-dash-btn-accent w-100 py-3 rounded-4">
                                    Browse products
                                </NavLink>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
