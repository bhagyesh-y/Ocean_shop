import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cartcontext";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { motion } from "framer-motion";


const Cart = () => {
    const { cart, removeFromCart, clearCart, totalPrice, setCart } = useContext(CartContext);
    const [fadeIn, setFadeIn] = useState(false);
    const [atlanticFade, setAtlanticFade] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false); // 🌀 Loader
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150); // soft fade-in
    }, []);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 150);

        // Fetch user-specific cart when component loads
        const fetchUserCart = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("oceanUser"));
                const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
                const accessToken = tokens?.access;

                if (!user || !accessToken) return;
                const response = await fetch(`${BASE_URL}/api/cart/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                } else {
                    console.error("Failed to fetch user cart");
                }
            } catch (error) {
                console.error("Error loading user cart:", error);
            }
        };

        fetchUserCart();
    }, [setCart]);

    const handleRemove = (id, name) => {
        removeFromCart(id);
        toast.info(`${name} removed from cart ❌`, {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
        });
    };

    const handleCheckout = () => {
        setShowModal(true);
    };

    const confirmCheckout = async () => {
        try {
            setLoadingPayment(true); // 🌀 Start loader

            const user = JSON.parse(localStorage.getItem("oceanUser"));
            const user_id = user?.id;

            if (!user_id) {
                toast.error("Please log in before checkout.", { theme: "colored" });
                setLoadingPayment(false);
                return;
            }

            const amount = totalPrice;

            // Create order
            const response = await fetch(`${BASE_URL}/api/payments/create-order/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amount,
                    user_id: user_id,
                }),
            });

            const data = await response.json();
            if (!data.key || !data.order_id) {
                toast.error("Payment setup failed. Try again!", { theme: "colored" });
                setLoadingPayment(false);
                return;
            }

            // console.log("🔵 FRONTEND KEY BEFORE OPENING RAZORPAY:", data.key);
            const options = {
                key: data.key,
                amount: data.amount * 100,
                currency: "INR",
                name: "OceanCart",
                description: "Order Payment",
                order_id: data.order_id,
                theme: { color: "#0077b6" },
                method: ["upi", "card", "wallet", "netbanking", "paylater"],

                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch(
                            `${BASE_URL}/api/payments/verify-payment/`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    user_id: user.id,
                                    key: data.key
                                }),
                            }
                        );

                        const verifyData = await verifyResponse.json();

                        if (verifyData.status === "Payment Successful") {
                            toast.success("Payment Successful 🌊", { theme: "colored" });

                            // small success flash before redirect
                            setTimeout(() => {
                                clearCart();
                                navigate("/payment-history");
                            }, 1000);
                        } else {
                            toast.error("Payment verification failed.", { theme: "colored" });
                        }
                    } catch (err) {
                        toast.error("Error verifying payment.", { theme: "colored" });
                    } finally {
                        setLoadingPayment(false); // ✅ Stop loader after completion
                        setShowModal(false);
                    }
                },
                prefill: {
                    name: user?.first_name || "Ocean User",
                    email: user?.email || "test@example.com",
                    contact: "9588459493",
                },
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded properly. Check your script tag.");
                setLoadingPayment(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while processing payment.");
            setLoadingPayment(false);
        }
    };
    //  If cart is empty 
    if (cart.length === 0) {
        return (
            <div
                className={`"container text-center py-5 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #caf0f8 0%, #ade8f4 100%)",
                    borderRadius: "15px",
                    transition: "opacity 1s ease, transform 0.6s ease",
                    transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                    overflow: "hidden"
                }}
            >
                <h3 className="fw-bold text-primary mt-5">Your cart is empty 🛒</h3>
                <p className="text-muted">Add some products to get started!</p>
                <Link to="/products" className="btn btn-primary mt-3 px-4">
                    Go Shopping
                </Link>
            </div>
        );
    }

    // Main cart UI when cart is loaded
    return (
        <>
            <div
                className={`container py-5 ocean-fade ${atlanticFade ? "opacity-100" : "opacity-0"}`}
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #ade8f4 0%, #48cae4 100%)",
                    borderRadius: "15px",
                    transition: "opacity 1s ease, transform 0.6s ease",
                    transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                    overflow: "hidden",
                }}
            >
                <h2 className="text-center mb-4 text-white fw-bold">Your Cart 🛍️</h2>

                <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
                    <table className="table table-bordered align-middle text-center bg-white mb-4">
                        <thead className="table-info">
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <img
                                            src={item.product?.image || item.image}
                                            alt={item.product?.name || item.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    </td>
                                    <td>{item.product?.name || item.name}</td>
                                    <td>₹{item.product?.price || item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        ₹
                                        {(
                                            (parseFloat(item.product?.price || item.price || 0) *
                                                item.quantity) || 0
                                        ).toFixed(2)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                handleRemove(item.id, item.product?.name || item.name)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 px-2">
                    <h4 className="text-white fw-bold">Total: ₹{totalPrice}</h4>
                    <div>
                        <button className="btn btn-outline-light me-3" onClick={clearCart}>
                            Clear Cart
                        </button>
                        <button className="btn btn-success px-4" onClick={handleCheckout}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Checkout Confirmation Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "450px" }}>
                        <div className="modal-content rounded-4 shadow-lg border-0">
                            <div className="modal-header text-white" style={{ background: "#0077b6" }}>
                                <h5 className="modal-title">Confirm Purchase</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <h5 className="fw-semibold mb-3 text-primary">Total: ₹{totalPrice}</h5>
                                <p>Are you sure you want to place your order? 🌊</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-success px-4" onClick={confirmCheckout}>
                                    Confirm
                                </button>
                                <button
                                    className="btn btn-info text-white"
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate("/products");
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*  Loader Overlay During Payment */}
            {loadingPayment && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{
                        background: "rgba(0,0,0,0.6)",
                        zIndex: 2000,
                        color: "#fff",
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            width: "270px",
                            height: "180px",
                            background: "linear-gradient(180deg, #0077b6, #0096c7, #00b4d8)",
                            borderRadius: "20px",
                            textAlign: "center",
                            padding: "30px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "12px",
                                borderRadius: "5px",
                                background:
                                    "linear-gradient(90deg, #caf0f8 25%, #90e0ef 50%, #caf0f8 75%)",
                                backgroundSize: "400% 100%",
                                animation: "shimmer 1.3s infinite linear",
                            }}
                        ></div>
                        <h5 className="fw-bold mt-4 mb-2">Processing Payment...</h5>
                        <p style={{ fontSize: "14px" }}>Generating your invoice 🌊</p>

                        <style>{`
                            @keyframes shimmer {
                                0% { background-position: 100% 0; }
                                100% { background-position: -100% 0; }
                            }
                        `}</style>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default Cart;
