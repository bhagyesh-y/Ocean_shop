import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { fetchProducts } from "../api/OceanAPI.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../index.css";

const Products = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const { addToCart } = useContext(CartContext);
    const [addedProducts, setAddedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [oceanProducts, setOceanProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🌊 Fade-in page mount
    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    // 🌐 Fetch products from backend
    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            } catch (err) {
                toast.error("Error while fetching products");
                setError("Failed to load products from server");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    // 🛒 Add to cart handler
    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success("🛒 Added to cart successfully!", { theme: "colored" });
        setTimeout(() => {
            setAddedProducts((prev) => prev.filter((id) => id !== product.id));
        }, 2000);
    };

    // 🔍 Search functionality
    const filteredProducts = oceanProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🎞️ Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            className={`container-fluid py-4 px-3 ${atlanticFade ? "opacity-100" : "opacity-0"
                }`}
            style={{
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                background: "linear-gradient(180deg, #caf0f8 0%, #90e0ef 100%)",
                minHeight: "100vh",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.h1
                className="text-center fw-bold mb-4 text-primary"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                All Products 🌊
            </motion.h1>

            {/* 🌊 Search Bar */}
            <div className="text-center mb-4 position-relative d-flex justify-content-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="form-control w-50 shadow-sm border-0 px-4 py-2"
                    style={{
                        borderRadius: "30px",
                        background: "rgba(255,255,255,0.8)",
                        transition: "box-shadow 0.3s ease",
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(0, 119, 182, 0.4)")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="btn border-0 position-absolute"
                        style={{
                            right: "26%",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            color: "#03045e",
                            fontSize: "1.2rem",
                            animation: "slideInRight 0.3s ease forwards",
                        }}
                    >
                        ❌
                    </button>
                )}
            </div>

            {/* 🌀 Loading / Error */}
            {loading && (
                <div className="text-center text-white py-5">
                    <h4>Loading products... 🌊</h4>
                </div>
            )}
            {error && (
                <div className="text-center text-danger py-5">
                    <h4>{error}</h4>
                </div>
            )}

            {/* 🌊 Product Grid */}
            {!loading && (
                <motion.div
                    className="container pb-5"
                    style={{
                        background: "linear-gradient(180deg, #ade8f4, #00b4d8, #0077b6)",
                        borderRadius: "15px",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        padding: "30px",
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                                    variants={cardVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    {/* 🧱 Updated Card for Equal Height + Consistent Layout */}
                                    <div className="product-card">
                                        {/* 🌅 Product Image */}
                                        <motion.div
                                            className="product-image"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <img src={product.image} alt={product.name} />
                                        </motion.div>

                                        {/* 🌊 Product Info */}
                                        <div className="product-body">
                                            <h5>{product.name}</h5>
                                            <p>{product.description}</p>
                                            <p className="price">₹{product.price}</p>

                                            <div className="d-flex justify-content-center gap-2">
                                                <Link to={`/product/${product.id}`}>
                                                    <button className="btn btn-outline-primary btn-sm">
                                                        View Details
                                                    </button>
                                                </Link>
                                                <button
                                                    className={`btn btn-sm ${addedProducts.includes(product.id)
                                                            ? "btn-success"
                                                            : "btn-outline-success"
                                                        }`}
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    {addedProducts.includes(product.id)
                                                        ? "Added ✅"
                                                        : "Add to Cart"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-white py-5">
                                <h4>No products found matching "{searchTerm}" 😔</h4>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Products;
