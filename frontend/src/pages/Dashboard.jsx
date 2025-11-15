import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cartcontext";
import { OceanAuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
    const { cart, totalPrice } = useContext(CartContext);
    const { oceanUser } = useContext(OceanAuthContext);
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const userOcean = {
        name: oceanUser?.first_name || oceanUser?.username || "Guest User",
        email: oceanUser?.email || "guest@example.com",
        avatar: oceanUser?.picture || "https://i.ibb.co/bP5fX6x/default-avatar.png",
    };
    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150)
    })
    // 🔹 Fetch recent paid orders
    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
                const accessToken = tokens?.access;
                if (!accessToken) {
                    setLoadingOrders(false);
                    return;
                }

                const res = await fetch("http://127.0.0.1:8000/api/payments/recent/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setRecentOrders(data);
            } catch (err) {
                console.error("Error fetching recent orders:", err);
                toast.error("Could not load recent orders");
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchRecentOrders();
    }, []);

    return (
        <div
            className={`min-vh-100 py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
            style={{
                background: "linear-gradient(135deg, #0077b6, #00b4d8)",
                overflowX: "hidden",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
            }}
        >
            <div className="container">
                {/* Profile Card */}
                <div
                    className="card border-0 shadow-lg text-center mb-5 p-4"
                    style={{
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.85)",
                    }}
                >
                    <img
                        src={
                            userOcean.avatar && userOcean.avatar !== ""
                                ? userOcean.avatar
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png" // default avatar
                        }
                        alt="profile avatar"
                        className="rounded-circle mx-auto mb-3 shadow-sm"
                        width="110"
                        height="110"
                        style={{
                            objectFit: "cover",
                            border: "4px solid #0077b6",
                            transition: "transform 0.3s ease",
                        }}
                        onError={(e) => {
                            // fallback if google avatar fails
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />

                    <h4 className="text-primary fw-bold mb-0">{userOcean.name}</h4>
                    <p className="text-muted">{userOcean.email}</p>
                </div>

                {/* Recent Orders */}
                <div
                    className="card border-0 shadow-lg mb-5 p-4"
                    style={{
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.9)",
                    }}
                >
                    <h4 className="text-info text-center mb-4">Recent Orders 🌊</h4>

                    {loadingOrders ? (
                        <div className="text-center text-secondary py-4">
                            <div className="spinner-border text-info" role="status"></div>
                            <p className="mt-2">Fetching your latest orders...</p>
                        </div>
                    ) : recentOrders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table align-middle text-center">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.order_id}</td>
                                            <td>₹{order.amount}</td>
                                            <td>{order.method?.toUpperCase()}</td>
                                            <td>
                                                <span className="badge bg-success px-3 py-2">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted mb-0">
                            No recent paid orders found.
                        </p>
                    )}

                    {recentOrders.length > 0 && (
                        <div className="text-center mt-3">
                            <NavLink
                                to="/payment-history"
                                className="btn btn-outline-info rounded-pill"
                            >
                                View More
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* 🌊 Cart Summary */}
                <div
                    className="card border-0 shadow-lg text-center p-4"
                    style={{
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <h4 className="text-info mb-3">Your Cart Summary 🛒</h4>

                    {cart.length > 0 ? (
                        <>
                            <p className="fw-bold mb-1">
                                Total Items:{" "}
                                <span className="text-primary">{cart.length}</span>
                            </p>
                            <p className="fw-bold mb-3">
                                Total Price:{" "}
                                <span className="text-success">₹{totalPrice}</span>
                            </p>
                            <NavLink
                                to="/cart"
                                className="btn w-100 fw-semibold"
                                style={{
                                    backgroundColor: "#03045e",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "12px 20px",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0077b6";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#03045e";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Go to Cart
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <p className="text-muted mb-3">Your cart is empty.</p>
                            <NavLink
                                to="/products"
                                className="btn w-100 fw-semibold"
                                style={{
                                    backgroundColor: "#00b4d8",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "12px 20px",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0077b6";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#00b4d8";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Go Shopping
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
