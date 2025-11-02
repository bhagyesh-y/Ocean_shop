import React, { createContext, useState } from "react";

// Create the Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Add item to cart
    const addToCart = async (item) => {
        try {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const accessToken = tokens?.access;

            const response = await fetch("http://127.0.0.1:8000/api/cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    product_id: item.id,
                    quantity: 1,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setCart((prev) => [...prev, data]); // ✅ add backend response item
            } else {
                console.error("Failed to add item to backend cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };


    // Remove item from cart
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // Clear all items
    // Clear all items (frontend + backend)
    const clearCart = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const accessToken = tokens?.access;

            if (!accessToken) {
                console.warn("No access token found");
                setCart([]);
                return;
            }

            // 🔹 Call backend to clear user's cart
            await fetch("http://127.0.0.1:8000/api/cart/clear/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // 🔹 Clear cart in React state
            setCart([]);
            console.log("Cart cleared (backend + frontend)");
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };


    // Total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);


    // Total items in cart
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, totalPrice, cartCount, setCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
