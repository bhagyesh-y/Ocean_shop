import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

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
            const tokens = JSON.parse(localStorage.getItem("oceanTokens") || "null");
            if (!tokens?.access) {
                toast.error("Please log in to pay.");
                setLoading(false);
                return;
            }

            const res = await fetch(`${BASE_URL}/api/payments/create-order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokens.access}`,
                },
                body: JSON.stringify({
                    amount: totalAmount,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                toast.error(data.error || "Could not start payment.");
                return;
            }

            const options = {
                key: RAZORPAY_KEY || data.key,
                amount: totalAmount * 100,
                currency: "INR",
                name: "Ocean Store 🌊",
                description: "Order Payment",
                order_id: data.order_id,

                handler: async function (response) {
                    const verify = await fetch(`${BASE_URL}/api/payments/verify-payment/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${tokens.access}`,
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
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
                    email: user.email || "",
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
