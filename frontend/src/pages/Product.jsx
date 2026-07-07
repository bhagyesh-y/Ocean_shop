import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { WishlistContext } from "../context/WishlistContext.jsx";
import { fetchProducts, fetchCategories } from "../api/OceanAPI.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaSearch, FaTimes, FaWater, FaHeart } from "react-icons/fa";

const StockBadge = ({ stock }) => {
    if (stock <= 0) return <span className="badge bg-danger mb-1">Out of stock</span>;
    if (stock <= 5) return <span className="badge bg-warning text-dark mb-1">Low stock ({stock})</span>;
    return <span className="badge bg-success mb-1">In stock</span>;
};

const Products = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const { addToCart } = useContext(CartContext);
    const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
    const [addedProducts, setAddedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [oceanProducts, setOceanProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (category) params.category = category;
                if (searchTerm) params.search = searchTerm;
                const data = await fetchProducts(params);
                setOceanProducts(data);
                setError("");
            } catch {
                toast.error("Could not load products");
                setError("Failed to load products from the server.");
            } finally {
                setLoading(false);
            }
        };
        const t = setTimeout(getProducts, 300);
        return () => clearTimeout(t);
    }, [category, searchTerm]);

    const handleAddToCart = async (product) => {
        if (product.stock <= 0) {
            toast.error("Out of stock", { theme: "colored" });
            return;
        }
        const ok = await addToCart(product);
        if (!ok) return;
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success("Added to your cart", { theme: "colored" });
        setTimeout(() => {
            setAddedProducts((prev) => prev.filter((id) => id !== product.id));
        }, 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    };

    return (
        <div className={`ocean-products-page ${atlanticFade ? "ocean-products-page--visible" : ""}`}>
            <div className="ocean-products-sheen" aria-hidden />
            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <header className="text-center mb-4">
                    <FaWater className="text-info mb-2" style={{ fontSize: "2rem" }} aria-hidden />
                    <p className="ocean-products-eyebrow text-uppercase small fw-semibold mb-2">The whole school</p>
                    <h1 className="h2 fw-bold ocean-products-title mb-2">All products</h1>
                </header>

                <div className="ocean-products-search-wrap mx-auto mb-3 position-relative">
                    <FaSearch className="ocean-products-search-icon text-muted" aria-hidden />
                    <input
                        type="search"
                        placeholder="Search by name…"
                        className="form-control ocean-products-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button type="button" className="btn ocean-products-search-clear" onClick={() => setSearchTerm("")}>
                            <FaTimes aria-hidden />
                        </button>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                        <button
                            type="button"
                            className={`btn btn-sm rounded-pill ${!category ? "btn-primary" : "btn-outline-light"}`}
                            onClick={() => setCategory("")}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`btn btn-sm rounded-pill ${
                                    category === cat ? "btn-primary" : "btn-outline-light"
                                }`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="ocean-products-state text-center py-5 rounded-4">
                        <div className="spinner-border text-light" />
                    </div>
                )}

                {error && !loading && (
                    <div className="ocean-products-state ocean-products-state--error text-center py-4 rounded-4 mb-4">
                        <p className="mb-0 fw-semibold">{error}</p>
                    </div>
                )}

                {!loading && (
                    <motion.div className="ocean-products-panel mx-auto" variants={containerVariants} initial="hidden" animate="visible">
                        <div className="row g-3 g-md-4">
                            {oceanProducts.length > 0 ? (
                                oceanProducts.map((product) => (
                                    <motion.div key={product.id} className="col-6 col-md-4 col-lg-3" variants={cardVariants}>
                                        <div className="product-card ocean-product-card-shell h-100 position-relative">
                                            <button
                                                type="button"
                                                className="btn btn-sm position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm"
                                                style={{ zIndex: 2 }}
                                                onClick={() => toggleWishlist(product)}
                                                aria-label="Wishlist"
                                            >
                                                <FaHeart color={isWishlisted(product.id) ? "#e63946" : "#ccc"} />
                                            </button>
                                            <div className="product-image">
                                                <img src={product.image} alt={product.name} />
                                            </div>
                                            <div className="product-body d-flex flex-column">
                                                {product.category && (
                                                    <span className="badge bg-info text-dark mb-1 align-self-center small">
                                                        {product.category}
                                                    </span>
                                                )}
                                                <StockBadge stock={product.stock} />
                                                <h5 className="text-primary">{product.name}</h5>
                                                <p className="small text-truncate">{product.description}</p>
                                                <p className="price">₹{product.price}</p>
                                                <div className="mt-auto d-flex flex-column flex-sm-row justify-content-center gap-2">
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className="btn btn-outline-primary btn-sm ocean-product-btn text-center text-decoration-none"
                                                    >
                                                        Details
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={product.stock <= 0}
                                                        className={`btn btn-sm ocean-product-btn ${
                                                            addedProducts.includes(product.id)
                                                                ? "btn-success"
                                                                : "btn-outline-success"
                                                        }`}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        {product.stock <= 0
                                                            ? "Unavailable"
                                                            : addedProducts.includes(product.id)
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
                                        <p className="fw-semibold mb-0">No products match your filters.</p>
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
