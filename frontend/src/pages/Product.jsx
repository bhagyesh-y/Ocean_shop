import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { fetchProducts } from "../api/OceanAPI.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaSearch, FaTimes, FaWater } from "react-icons/fa";

const Products = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const { addToCart } = useContext(CartContext);
    const [addedProducts, setAddedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [oceanProducts, setOceanProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            } catch {
                toast.error("Could not load products");
                setError("Failed to load products from the server.");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success("Added to your cart", { theme: "colored" });
        setTimeout(() => {
            setAddedProducts((prev) => prev.filter((id) => id !== product.id));
        }, 2000);
    };

    const filteredProducts = oceanProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.06 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 22 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: "easeOut" },
        },
    };

    return (
        <div
            className={`ocean-products-page ${atlanticFade ? "ocean-products-page--visible" : ""}`}
        >
            <div className="ocean-products-sheen" aria-hidden />

            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <header className="text-center mb-4">
                    <div className="mb-2 text-info">
                        <FaWater style={{ fontSize: "2rem" }} aria-hidden />
                    </div>
                    <p className="ocean-products-eyebrow text-uppercase small fw-semibold mb-2">
                        The whole school
                    </p>
                    <h1 className="h2 fw-bold ocean-products-title mb-2">All products</h1>
                    <p className="ocean-products-lead mx-auto mb-0">
                        Search the shallows, then reel in what you need — same cards as home, tuned for every screen.
                    </p>
                </header>

                <div className="ocean-products-search-wrap mx-auto mb-4 position-relative">
                    <FaSearch className="ocean-products-search-icon text-muted" aria-hidden />
                    <input
                        type="search"
                        placeholder="Search by name…"
                        className="form-control ocean-products-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="btn ocean-products-search-clear"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            <FaTimes aria-hidden />
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="ocean-products-state text-center py-5 rounded-4">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading</span>
                        </div>
                        <p className="mt-3 text-white mb-0 small">Gathering the catch…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="ocean-products-state ocean-products-state--error text-center py-4 rounded-4 mb-4">
                        <p className="mb-0 fw-semibold">{error}</p>
                    </div>
                )}

                {!loading && (
                    <motion.div
                        className="ocean-products-panel mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="row g-3 g-md-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        className="col-6 col-md-4 col-lg-3"
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="product-card ocean-product-card-shell h-100">
                                            <motion.div
                                                className="product-image"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.35 }}
                                            >
                                                <img src={product.image} alt={product.name} />
                                            </motion.div>
                                            <div className="product-body d-flex flex-column">
                                                <h5 className="text-primary">{product.name}</h5>
                                                <p className="small text-truncate">{product.description}</p>
                                                <p className="price">₹{product.price}</p>
                                                <div className="mt-auto d-flex flex-column flex-sm-row justify-content-center gap-2">
                                                    <Link to={`/product/${product.id}`} className="d-grid">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm ocean-product-btn"
                                                        >
                                                            Details
                                                        </button>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ocean-product-btn ${
                                                            addedProducts.includes(product.id)
                                                                ? "btn-success"
                                                                : "btn-outline-success"
                                                        }`}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        {addedProducts.includes(product.id)
                                                            ? "In cart ✓"
                                                            : "Add to cart"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="ocean-products-empty text-center py-5 rounded-4">
                                        <p className="fw-semibold mb-1">Nothing matches that search.</p>
                                        <p className="text-muted small mb-0">Try another name or clear the filter.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Products;
