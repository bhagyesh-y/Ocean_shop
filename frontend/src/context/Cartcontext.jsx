import React, { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { OceanAuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { oceanUser } = useContext(OceanAuthContext);

    const addToCart = async (item) => {
        try {
            if (!oceanUser) {
                toast.info("Please log in to add items to your cart.", { theme: "colored" });
                return;
            }

            const response = await fetch(apiUrl("/api/cart/"), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
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

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = async () => {
        try {
            if (!oceanUser) {
                setCart([]);
                return;
            }

            await fetch(apiUrl("/api/cart/clear/"), {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setCart([]);
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
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                totalPrice,
                cartCount,
                setCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
