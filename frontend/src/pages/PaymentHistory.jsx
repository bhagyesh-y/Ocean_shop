import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const res = await fetch("http://127.0.0.1:8000/api/payments/history/", {
                headers: { Authorization: `Bearer ${tokens.access}` },
            });
            const data = await res.json();
            setHistory(data);
        };
        fetchHistory();
    }, []);

    return (
        <div className="container py-4">
            <h3 className="text-primary fw-bold mb-3">🧾 Payment History</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((h) => (
                        <tr key={h.id}>
                            <td>{h.order_id}</td>
                            <td>₹{h.amount}</td>
                            <td>{h.status}</td>
                            <td>{h.method}</td>
                            <td>{new Date(h.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;
