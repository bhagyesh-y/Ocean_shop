import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { OceanAuthContext } from "./AuthContext";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../api/OceanAPI";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { oceanUser } = useContext(OceanAuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [ready, setReady] = useState(false);

    const syncWishlist = useCallback(async () => {
        if (!oceanUser) {
            setWishlist([]);
            setReady(true);
            return;
        }
        try {
            const data = await fetchWishlist();
            setWishlist(Array.isArray(data) ? data : []);
        } catch {
            setWishlist([]);
        } finally {
            setReady(true);
        }
    }, [oceanUser]);

    useEffect(() => {
        setReady(false);
        syncWishlist();
    }, [syncWishlist]);

    const isWishlisted = (productId) =>
        wishlist.some((w) => w.product?.id === productId);

    const toggleWishlist = async (product) => {
        if (!oceanUser) {
            toast.info("Log in to save items to your wishlist.", { theme: "colored" });
            return false;
        }
        const id = product.id;
        if (isWishlisted(id)) {
            try {
                await removeFromWishlist(id);
                setWishlist((prev) => prev.filter((w) => w.product?.id !== id));
                toast.info("Removed from wishlist", { theme: "colored" });
                return true;
            } catch {
                toast.error("Could not update wishlist", { theme: "colored" });
                return false;
            }
        }
        try {
            const item = await addToWishlist(id);
            setWishlist((prev) => [...prev, item]);
            toast.success("Saved to wishlist", { theme: "colored" });
            return true;
        } catch {
            toast.error("Could not add to wishlist", { theme: "colored" });
            return false;
        }
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, wishlistReady: ready, isWishlisted, toggleWishlist, syncWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
