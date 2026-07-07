import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders } from "../api/OceanAPI";
import { FaReceipt } from "react-icons/fa";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="ocean-dashboard-page ocean-dashboard-page--visible">
            <div className="ocean-dashboard-sheen" aria-hidden />
            <div className="container-fluid px-3 py-4 py-md-5">
                <div className="ocean-dashboard-inner mx-auto" style={{ maxWidth: 960 }}>
                    <header className="text-center mb-4">
                        <FaReceipt className="text-info mb-2" style={{ fontSize: "2rem" }} />
                        <h1 className="h2 fw-bold ocean-dashboard-title">My orders</h1>
                        <p className="ocean-dashboard-lead">Every voyage you&apos;ve paid for.</p>
                    </header>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-light" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="ocean-surface-card text-center">
                            <p className="mb-3">No orders yet.</p>
                            <Link to="/products" className="btn ocean-dash-btn-accent">
                                Start shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <article key={order.id} className="ocean-surface-card mb-3">
                                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                                    <div>
                                        <strong className="text-primary">#{order.order_id?.slice(-8)}</strong>
                                        <span className="text-muted small ms-2">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span
                                        className={`badge rounded-pill ${
                                            order.is_paid ? "ocean-badge-success" : "bg-warning text-dark"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="mb-2">
                                    <strong>₹{order.amount}</strong>
                                    {order.discount_amount > 0 && (
                                        <span className="text-success small ms-2">
                                            (saved ₹{order.discount_amount}
                                            {order.coupon_code ? ` — ${order.coupon_code}` : ""})
                                        </span>
                                    )}
                                </p>
                                {Array.isArray(order.line_items_snapshot) &&
                                    order.line_items_snapshot.length > 0 && (
                                        <ul className="small text-muted mb-0 ps-3">
                                            {order.line_items_snapshot.map((line, i) => (
                                                <li key={i}>
                                                    {line.name} × {line.qty} — ₹{line.subtotal}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </article>
                        ))
                    )}

                    <div className="text-center mt-3">
                        <Link to="/payment-history" className="btn ocean-dash-btn-secondary">
                            Payment history & invoices
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
