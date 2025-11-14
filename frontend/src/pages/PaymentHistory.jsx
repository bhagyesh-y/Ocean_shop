import React, { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { motion } from "framer-motion";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [atlanticFade, setAtlanticFade] = useState(false);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    // handle invoice download
    const handleDownloadInvoice = (invoice_url) => {

        if (!invoice_url) {
            toast.error("Invoice not available", { theme: "colored" });
            return;
        }
        const downloadUrl = invoice_url + "?fl_attachment=true";

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.download = "OceanCart_Invoice.pdf";
        link.click();

        toast.success("Invoice downloaded! 🌊", {
            theme: "colored",
            transition: Bounce,
        });
    };


    // Fetch payment history
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
    // Fetch analytics
    useEffect(() => {
        const fetchAnalytics = async () => {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const res = await fetch("http://127.0.0.1:8000/api/payments/analytics/user/", {
                headers: { Authorization: `Bearer ${tokens.access}` },
            });
            const data = await res.json();
            setAnalytics(data);
        };
        fetchAnalytics();
    }, []);


    // 🌀 Loading State
    if (loading) {
        return (
            <div className="container text-center py-5">
                <h4 className="text-info">Loading your payment history...</h4>
            </div>
        );
    }

    // 🪸 Empty Payment History
    if (payments.length === 0) {
        return (
            <motion.div
                className={`container text-center py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #caf0f8 0%, #ade8f4 100%)",
                    borderRadius: "15px",
                    transition: "opacity 1s ease, transform 0.6s ease",
                    transform: atlanticFade ? "translateY(0)" : "translateY(20px)",

                }}
            >
                <h3 className="fw-bold text-primary mt-5">No Payments Yet 💳</h3>
                <p className="text-muted">Your completed orders will appear here.</p>
            </motion.div>
        );
    }

    // 🌊 Payment History Page
    return (
        <motion.div
            className={`container py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
            style={{
                minHeight: "80vh",
                background: "linear-gradient(180deg, #90e0ef 0%, #0077b6 100%)",
                borderRadius: "15px",
                overflow: "hidden",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                overflow: "hidden",

            }}
        >
            <h2 className="text-center text-white fw-bold mb-4">🌊 Payment History</h2>

            {/* Analytics Section */}
            {analytics && (
                <motion.div
                    className="row mb-4 g-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="col-sm-4 col-12">
                        <div className="card text-center p-3 shadow-sm ocean-analytics">
                            <h6>Total Spent</h6>
                            <h4 className="fw-bold text-primary">₹{analytics.total_spent}</h4>
                        </div>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="card text-center p-3 shadow-sm ocean-analytics">
                            <h6>Total Payments</h6>
                            <h4 className="fw-bold text-success">{analytics.total_payments}</h4>
                        </div>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="card text-center p-3 shadow-sm ocean-analytics">
                            <h6>Top Methods</h6>
                            {analytics.per_method.map((m) => (
                                <div key={m.method}>
                                    {m.method}: ₹{m.sum} ({m.count})
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Table View for Desktop */}
            <div className="table-responsive d-none d-md-block shadow-lg rounded-4 overflow-hidden">
                <table className="table table-striped align-middle text-center bg-white">
                    <thead className="table-info">
                        <tr>
                            <th>Order ID</th>
                            <th>Payment ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Invoice</th>
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
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleDownloadInvoice(payment.invoice_url)}
                                    >
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Cards with Scroll Animation */}
            <motion.div
                className="d-block d-md-none mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "15px",
                    padding: "10px",
                    scrollSnapType: "x mandatory",
                }}
            >
                {payments.map((payment, index) => (
                    <motion.div
                        key={index}
                        className="card shadow-sm p-3"
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            flex: "0 0 85%",
                            scrollSnapAlign: "center",
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(5px)",
                            border: "none",
                        }}
                    >
                        <h6 className="fw-bold text-primary">Order ID: {payment.order_id}</h6>
                        <p className="mb-1"><strong>Payment ID:</strong> {payment.payment_id}</p>
                        <p className="mb-1"><strong>Amount:</strong> ₹{payment.amount}</p>
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
                        <button
                            className="btn btn-outline-primary btn-sm w-100 mt-2"
                            onClick={() => handleDownloadInvoice(payment.invoice_url)}
                        >
                            Download Invoice
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default PaymentHistory;
