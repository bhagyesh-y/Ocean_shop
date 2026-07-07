import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { deleteCartItem, updateCartItem } from "../api/OceanAPI";
import { OceanAuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { oceanUser } = useContext(OceanAuthContext);

    const syncCartFromServer = useCallback(async () => {
        if (!oceanUser) {
            setCart([]);
            return;
        }
        try {
            const response = await fetch(apiUrl("/api/cart/"), {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setCart(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    }, [oceanUser]);

    useEffect(() => {
        syncCartFromServer();
    }, [syncCartFromServer]);

    const addToCart = async (item) => {
        if (!oceanUser) {
            toast.info("Please log in to add items to your cart.", { theme: "colored" });
            return false;
        }
        try {
            const response = await fetch(apiUrl("/api/cart/"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: item.id,
                    quantity: 1,
                }),
            });

            if (response.ok) {
                await syncCartFromServer();
                return true;
            }

            let detail = "Could not add this item to your cart.";
            try {
                const errBody = await response.json();
                if (typeof errBody === "object" && errBody !== null) {
                    const first =
                        errBody.detail ||
                        errBody.message ||
                        (Array.isArray(errBody.non_field_errors) && errBody.non_field_errors[0]) ||
                        Object.values(errBody).flat().find((v) => typeof v === "string");
                    if (first) detail = String(first);
                }
            } catch {
                /* ignore parse errors */
            }
            toast.error(detail, { theme: "colored" });
            return false;
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Network error — try again.", { theme: "colored" });
            return false;
        }
    };

    const removeFromCart = async (id) => {
        try {
            await deleteCartItem(id);
            setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error removing from cart:", error);
            toast.error("Could not remove item", { theme: "colored" });
        }
    };

    const updateCartQuantity = async (id, quantity) => {
        if (quantity < 1) {
            return removeFromCart(id);
        }
        try {
            await updateCartItem(id, quantity);
            await syncCartFromServer();
            return true;
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Could not update quantity", { theme: "colored" });
            return false;
        }
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
                headers: { "Content-Type": "application/json" },
            });

            setCart([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
        0
    );

    const cartCount = cart.reduce((total, item) => total + (item.quantity ?? 0), 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateCartQuantity,
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
