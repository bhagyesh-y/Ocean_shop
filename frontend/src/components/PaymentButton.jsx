import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PaymentButton = ({ totalAmount, user }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/payments/create-order/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalAmount,
                    user_id: user.id,
                }),
            });

            const data = await res.json();
            setLoading(false);

            const options = {
                key: data.key,
                amount: totalAmount * 100,
                currency: "INR",
                name: "Ocean Store 🌊",
                description: "Order Payment",
                order_id: data.order_id,
                handler: async function (response) {
                    const verify = await fetch("http://127.0.0.1:8000/api/payments/verify-payment/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const verifyData = await verify.json();

                    if (verifyData.status === "Payment Successful") {
                        toast.success("✅ Payment Successful!");
                    } else {
                        toast.error("❌ Payment Failed!");
                    }
                },
                prefill: {
                    name: user.first_name || "Guest",
                    email: user.email,
                },
                theme: { color: "#0077b6" },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong with payment!");
            setLoading(false);
        }
    };

    return (
        <button className="btn btn-primary px-4 py-2" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Proceed to Pay"}
        </button>
    );
};

export default PaymentButton;
