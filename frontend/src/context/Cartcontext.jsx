import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_URL;

    // Add item to cart
    const addToCart = async (item) => {
        try {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const accessToken = tokens?.access;

            const response = await fetch(`${BASE_URL}/cart/`, {
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
                setCart((prev) => [...prev, data]);
            } else {
                console.error("Failed to add item to backend cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove item from cart (frontend only)
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // Clear cart (backend + frontend)
    const clearCart = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem("oceanTokens"));
            const accessToken = tokens?.access;

            if (!accessToken) {
                console.warn("No access token found");
                setCart([]);
                return;
            }

            await fetch(`${BASE_URL}/cart/clear/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setCart([]);
            console.log("Cart cleared (backend + frontend)");
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.product?.price * item.quantity),
        0
    );

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, totalPrice, cartCount, setCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
