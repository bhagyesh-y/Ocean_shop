import React from "react";
import PaymentButton from "../components/PaymentButton";

const CheckoutPage = ({ cartItems, totalAmount, user }) => {
    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">Checkout Summary 🛒</h2>

            <div className="card p-4 shadow-sm">
                {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                        <span>{item.name}</span>
                        <strong>₹{item.price}</strong>
                    </div>
                ))}
                <hr />
                <h5 className="text-end">Total: ₹{totalAmount}</h5>
            </div>

            <div className="text-center mt-4">
                <PaymentButton totalAmount={totalAmount} user={user} />
            </div>
        </div>
    );
};

export default CheckoutPage;
