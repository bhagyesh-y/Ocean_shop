import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { OceanAuthContext } from "../context/AuthContext";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentButton = ({ totalAmount, user }) => {
    const [loading, setLoading] = useState(false);
    const { oceanUser } = useContext(OceanAuthContext);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (!oceanUser) {
                toast.error("Please log in to pay.");
                setLoading(false);
                return;
            }

            const res = await fetch(apiUrl("/api/payments/create-order/"), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
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
                    const verify = await fetch(apiUrl("/api/payments/verify-payment/"), {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
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
