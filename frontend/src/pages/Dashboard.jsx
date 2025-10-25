import React, { useContext } from "react";
import { CartContext } from "../context/Cartcontext";
import { OceanAuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
    const { cart, totalPrice } = useContext(CartContext);
    const { oceanUser } = useContext(OceanAuthContext);

    // ✅ user info: Google / JWT / fallback
    const userOcean = {
        name: oceanUser?.username || oceanUser?.name || "Guest User",
        email: oceanUser?.email || "guest@example.com",
        avatar: oceanUser?.picture || "",
    };

    // ✅ Use cart items as recent orders
    const recentOrdersAtlantic =
        cart.length > 0
            ? cart.map((item, index) => ({
                id: index + 1,
                name: item.name || item.title || "Ocean Item",
                price: item.price || 0,
                status: index % 2 === 0 ? "Delivered" : "In Transit",
            }))
            : [
                { id: 1, name: "Blue Coral Mug", price: 299, status: "Delivered" },
                { id: 2, name: "Ocean Hoodie", price: 1299, status: "In Transit" },
                { id: 3, name: "Wave Bottle", price: 499, status: "Delivered" },
            ];

    return (
        <div
            className="min-vh-100 py-5"
            style={{
                background: "linear-gradient(135deg, #0077b6, #00b4d8)",
                overflowX: "hidden",
            }}
        >
            <div className="container">
                {/* 🌊 Profile Card */}
                <div
                    className="card border-0 shadow-lg text-center mb-5 p-4"
                    style={{
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(10px)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
                    }}
                >
                    <img
                        src={userOcean.avatar}
                        alt="avatar"
                        className="rounded-circle mx-auto mb-3 shadow-sm"
                        width="100"
                        height="100"
                        style={{ objectFit: "cover" }}
                    />
                    <h4 className="text-primary fw-bold mb-0">{userOcean.name}</h4>
                    <p className="text-muted">{userOcean.email}</p>
                </div>

                {/* 🌊 Recent Orders (Dynamic) */}
                <div
                    className="card border-0 shadow-lg mb-5 p-4"
                    style={{
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <h4 className="text-info text-center mb-4">Recent Orders 🌊</h4>
                    <div className="table-responsive">
                        <table className="table align-middle text-center">
                            <thead className="table-primary">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrdersAtlantic.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.name}</td>
                                        <td>₹{order.price}</td>
                                        <td>
                                            <span
                                                className={`badge ${order.status === "Delivered"
                                                    ? "bg-success"
                                                    : "bg-warning text-dark"
                                                    } px-3 py-2`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
