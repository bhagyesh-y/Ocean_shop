import React, { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🌊 Fetch payment history
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
                const accessToken = tokens?.access;

                if (!accessToken) {
                    toast.error("Please log in to view payment history", { theme: "colored" });
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://127.0.0.1:8000/api/payments/history/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to load payment history");

                const data = await response.json();
                setPayments(data);
            } catch (error) {
                console.error("Error loading payments:", error);
                toast.error("Failed to load payment history", { theme: "colored" });
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // 🌀 Loading State
    if (loading) {
        return (
            <div className="container text-center py-5">
                <h4 className="text-info">Loading your payment history...</h4>
            </div>
        );
    }

    // 🪸 No Payment History
    if (payments.length === 0) {
        return (
            <div
                className="container text-center py-5"
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #caf0f8 0%, #ade8f4 100%)",
                    borderRadius: "15px",
                }}
            >
                <h3 className="fw-bold text-primary mt-5">No Payments Yet 💳</h3>
                <p className="text-muted">Your completed orders will appear here.</p>
            </div>
        );
    }

    // 🌊 Payment History Table
    return (
        <div
            className="container py-5"
            style={{
                minHeight: "80vh",
                background: "linear-gradient(180deg, #90e0ef 0%, #0077b6 100%)",
                borderRadius: "15px",
                transition: "all 0.4s ease",
            }}
        >
            <h2 className="text-center text-white fw-bold mb-4">
                🌊 Payment History
            </h2>

            <div className="table-responsive d-none d-sm-block shadow-lg rounded-4 overflow-hidden">
                <table className="table table-striped align-middle text-center bg-white">
                    <thead className="table-info">
                        <tr>
                            <th>Order ID</th>
                            <th>Payment ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={index}>
                                <td>{payment.order_id}</td>
                                <td>{payment.payment_id}</td>
                                <td>₹{payment.amount}</td>
                                <td>
                                    <span className="badge bg-primary text-light px-3 py-2 rounded-pill">
                                        {payment.method ? payment.method.toUpperCase() : "N/A"}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`badge px-3 py-2 rounded-pill ${payment.status === "success"
                                            ? "bg-success"
                                            : payment.status === "failed"
                                                ? "bg-danger"
                                                : "bg-warning text-dark"
                                            }`}
                                    >
                                        {payment.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {new Date(payment.created_at).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🌊 Card View for Mobile */}
            <div className="d-block d-sm-none">
                {payments.map((payment, index) => (
                    <div
                        key={index}
                        className="card mb-3 shadow-sm"
                        style={{
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "none",
                        }}
                    >
                        <div className="card-body">
                            <h6 className="fw-bold text-primary">
                                Order ID: <span className="text-dark">{payment.order_id}</span>
                            </h6>
                            <p className="mb-1">
                                <strong>Payment ID:</strong> {payment.payment_id}
                            </p>
                            <p className="mb-1">
                                <strong>Amount:</strong> ₹{payment.amount}
                            </p>
                            <p className="mb-1">
                                <strong>Method:</strong>{" "}
                                <span className="badge bg-info text-dark">
                                    {payment.method ? payment.method.toUpperCase() : "N/A"}
                                </span>
                            </p>
                            <p className="mb-1">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`badge ${payment.status === "success"
                                        ? "bg-success"
                                        : payment.status === "failed"
                                            ? "bg-danger"
                                            : "bg-warning text-dark"
                                        }`}
                                >
                                    {payment.status.toUpperCase()}
                                </span>
                            </p>
                            <p className="text-muted small">
                                {new Date(payment.created_at).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;
