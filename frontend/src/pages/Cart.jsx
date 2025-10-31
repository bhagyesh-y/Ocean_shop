import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cartcontext";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Cart = () => {
    const { cart, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
    const [fadeIn, setFadeIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 150);
    }, []);

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
            const user = JSON.parse(localStorage.getItem("oceanUser"));
            const user_id = user?.id;

            if (!user_id) {
                toast.error("Please log in before checkout.", { theme: "colored" });
                return;
            }

            const amount = totalPrice;

            // 1️⃣ Create order in Django + Razorpay
            const response = await fetch("http://127.0.0.1:8000/api/payments/create-order/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amount,
                    user_id: user_id, // ✅ include user id
                }),
            });

            const data = await response.json();
            console.log("✅ Order response:", data);

            if (!data.key || !data.order_id) {
                toast.error("Payment setup failed. Try again!", { theme: "colored" });
                return;
            }

            // 2️⃣ Razorpay Checkout
            const options = {
                key: data.key,
                amount: data.amount * 100,
                currency: "INR",
                name: "OceanCart",
                description: "Order Payment",
                order_id: data.order_id,

                handler: async function (response) {
                    console.log("💰 Payment Response", response);

                    // 3️⃣ Verify payment in Django
                    const verifyResponse = await fetch("http://127.0.0.1:8000/api/payments/verify-payment/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            user_id: user_id, // ✅ send user ID for mapping
                        }),
                    });

                    const verifyData = await verifyResponse.json();
                    console.log("Verify response:", verifyData);

                    if (verifyData.status === "Payment Successful") {
                        toast.success("Payment Successful 🌊", {
                            position: "top-right",
                            autoClose: 3000,
                            theme: "colored",
                            transition: Bounce,
                        });
                        clearCart();
                    } else {
                        toast.error("Payment verification failed.", { theme: "colored" });
                    }

                    setShowModal(false);
                },

                prefill: {
                    name: user?.first_name || "Ocean User",
                    email: user?.email || "test@example.com",
                    contact: "9588459493",
                },
                theme: { color: "#0077b6" },
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded properly. Check your script tag.");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while processing payment.");
        }
    };



    if (cart.length === 0) {
        return (
            <div
                className="container text-center py-5"
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #caf0f8 0%, #ade8f4 100%)",
                    borderRadius: "15px",
                    transition: "all 0.6s ease",
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

    return (
        <>
            <div
                className={`container py-5 ocean-fade ${fadeIn ? "fade-in" : ""}`}
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(180deg, #ade8f4 0%, #48cae4 100%)",
                    borderRadius: "15px",
                    transition: "all 0.6s ease-in-out",
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
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.price * item.quantity}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemove(item.id, item.name)}
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

            {/* 🌊 Checkout Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{
                            maxWidth: "450px",
                        }}
                    >
                        <div className="modal-content rounded-4 shadow-lg border-0">
                            <div
                                className="modal-header text-white"
                                style={{ background: "#0077b6" }}
                            >
                                <h5 className="modal-title">Confirm Purchase</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <h5 className="fw-semibold mb-3 text-primary">
                                    Total: ₹{totalPrice}
                                </h5>
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
        </>
    );
};

export default Cart;
