import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CartContext } from "../context/Cartcontext.jsx";
import { OceanAuthContext } from "../context/AuthContext.jsx";
import { fetchProducts } from "../api/OceanAPI.js";
import { toast } from "react-toastify";
import { FaFish, FaShippingFast, FaShieldAlt, FaWater } from "react-icons/fa";

const WAVE_DIVIDER_COLOR = "#caf0f8";

const HomeWaveDivider = () => (
    <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{ width: "100%", height: "72px", display: "block", marginTop: "-1px" }}
    >
        <path
            fill={WAVE_DIVIDER_COLOR}
            d="M0,40 C240,100 480,0 720,50 C960,100 1200,20 1440,55 L1440,100 L0,100 Z"
        />
    </svg>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

const Home = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [oceanProducts, setOceanProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { oceanUser } = useContext(OceanAuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState([]);

    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            } catch {
                toast.error("Could not load the tide of products. Try again soon.");
                setError("Failed to load products from the server.");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const handleAddToCart = async (product) => {
        const ok = await addToCart(product);
        if (!ok) return;
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success("Swept into your cart", { theme: "colored" });
        setTimeout(() => {
            setAddedProducts((prev) => prev.filter((id) => id !== product.id));
        }, 2000);
    };

    const featured = oceanProducts.slice(0, 8);
    const displayName =
        oceanUser?.first_name?.trim() ||
        oceanUser?.username ||
        "explorer";

    return (
        <div
            className={`home-ocean-root p-0 ${atlanticFade ? "opacity-100" : "opacity-0"}`}
            style={{
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(16px)",
            }}
        >
            {/* Hero — deep current */}
            <section
                className="text-white text-center position-relative overflow-hidden"
                style={{
                    minHeight: "52vh",
                    padding: "clamp(3rem, 8vw, 5rem) 1rem 0",
                    background:
                        "linear-gradient(165deg, #03045e 0%, #0077b6 42%, #00b4d8 88%, #48cae4 100%)",
                }}
            >
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-25 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.35), transparent 55%)",
                    }}
                />
                <motion.div
                    className="position-relative mx-auto"
                    style={{ maxWidth: "820px" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65 }}
                >
                    <p className="text-info mb-2 small text-uppercase tracking-wide fw-semibold">
                        Ahoy, {displayName}
                    </p>
                    <h1 className="display-4 fw-bold mb-3" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.25)" }}>
                        Ride the swell at Ocean Shop
                    </h1>
                    <p className="lead opacity-90 mb-4 px-2">
                        Fresh finds from the reef to your doorstep — curated waves of quality, fair tide on
                        prices, and a checkout as smooth as calm water.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3 pb-2">
                        <Link
                            to="/products"
                            className="btn btn-light btn-lg fw-semibold px-4 home-hero-btn"
                        >
                            Browse all products
                        </Link>
                        <Link
                            to="/dashboard"
                            className="btn btn-outline-light btn-lg fw-semibold px-4 border-2 home-hero-btn-outline"
                        >
                            Your cove
                        </Link>
                    </div>
                </motion.div>
                <HomeWaveDivider />
            </section>

            {/* Featured catch — product grid */}
            <section
                className="px-3 pb-5 pt-0"
                style={{
                    background: `linear-gradient(180deg, ${WAVE_DIVIDER_COLOR} 0%, #ade8f4 45%, #90e0ef 100%)`,
                }}
            >
                <div className="container py-4">
                    <div className="text-center mb-2">
                        <FaWater className="text-primary mb-2" style={{ fontSize: "2rem" }} />
                    </div>
                    <h2 className="text-center fw-bold text-primary mb-2">Today&apos;s tide picks</h2>
                    <p className="text-center text-muted mx-auto mb-4" style={{ maxWidth: "540px" }}>
                        A shimmering sample from our full school — tap through for details or net them straight
                        into your cart.
                    </p>

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading products</span>
                            </div>
                            <p className="mt-3 text-primary fw-semibold">Casting the net…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="alert alert-danger text-center shadow-sm rounded-4">
                            {error}
                        </div>
                    )}

                    {!loading && !error && featured.length === 0 && (
                        <div className="text-center py-5 text-primary">
                            <p className="fw-semibold mb-0">The bay is quiet — new stock is sailing in soon.</p>
                        </div>
                    )}

                    {!loading && !error && featured.length > 0 && (
                        <motion.div
                            className="rounded-4 p-3 p-md-4 shadow"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(173,232,244,0.5) 100%)",
                                border: "1px solid rgba(0, 119, 182, 0.12)",
                            }}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="row g-3">
                                {featured.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        className="col-6 col-md-4 col-lg-3"
                                        variants={cardVariants}
                                    >
                                        <div className="product-card h-100 home-product-shell">
                                            <div className="product-image">
                                                <img src={product.image} alt={product.name} />
                                            </div>
                                            <div className="product-body d-flex flex-column">
                                                <h5 className="text-primary">{product.name}</h5>
                                                <p className="small text-truncate px-1">{product.description}</p>
                                                <p className="price">₹{product.price}</p>
                                                <div className="mt-auto d-flex flex-column flex-sm-row justify-content-center gap-2">
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className="btn btn-outline-primary btn-sm text-center text-decoration-none"
                                                    >
                                                        View details
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${
                                                            addedProducts.includes(product.id)
                                                                ? "btn-success"
                                                                : "btn-outline-success"
                                                        }`}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        {addedProducts.includes(product.id)
                                                            ? "In net ✓"
                                                            : "Add to cart"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to="/products"
                                    className="btn btn-primary btn-lg rounded-pill px-5 fw-semibold shadow-sm"
                                >
                                    Dive into the full catalog
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Why sail with us */}
            <section
                className="py-5 px-3 text-white"
                style={{
                    background: "linear-gradient(180deg, #023e8a 0%, #03045e 100%)",
                }}
            >
                <div className="container">
                    <h2 className="text-center fw-bold mb-2">Why sailors trust this harbor</h2>
                    <p className="text-center opacity-75 mb-5 mx-auto" style={{ maxWidth: "560px" }}>
                        Three anchors we never slip — so every voyage with us feels steady, secure, and a little
                        more magical.
                    </p>
                    <div className="row g-4">
                        {[
                            {
                                Icon: FaShippingFast,
                                title: "Swift currents",
                                text: "Orders ship on the next favorable tide whenever possible — track every ripple to your door.",
                            },
                            {
                                Icon: FaShieldAlt,
                                title: "Reef-safe checkout",
                                text: "Payments glide through trusted channels; your data stays locked tighter than a pearl.",
                            },
                            {
                                Icon: FaFish,
                                title: "Quality from the deep",
                                text: "We surface products we would net ourselves — honest listings and clear depths on every page.",
                            },
                        ].map(({ Icon, title, text }) => (
                            <div key={title} className="col-md-4">
                                <div
                                    className="h-100 p-4 rounded-4 text-center"
                                    style={{
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(6px)",
                                    }}
                                >
                                    <Icon className="mb-3 text-info" style={{ fontSize: "2.25rem" }} />
                                    <h3 className="h5 fw-bold">{title}</h3>
                                    <p className="small opacity-85 mb-0">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
        .home-ocean-root .home-hero-btn {
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .home-ocean-root .home-hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
        }
        .home-ocean-root .home-hero-btn-outline {
          border-radius: 999px;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .home-ocean-root .home-hero-btn-outline:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
          transform: translateY(-2px);
        }
        .home-product-shell {
          border: 1px solid rgba(0, 119, 182, 0.15);
        }
      `}</style>
        </div>
    );
};

export default Home;
