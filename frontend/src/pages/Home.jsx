import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx";
import { fetchProducts } from "../api/OceanAPI.js";
import { toast } from "react-toastify";

const Home = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);
    const [oceanProducts, setOceanProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fade in effect
    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
    }, []);

    // Fetch products
    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            } catch (err) {
                toast.error("Error while fetching products ❌");
                setError("Failed to load products from server");
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    return (
        <div
            className={`container-fluid p-0 ${atlanticFade ? "opacity-100" : "opacity-0"
                }`}
            style={{
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
            }}
        >
            {/* 🌅 Hero Section */}
            <div
                className="text-white text-center d-flex flex-column justify-content-center align-items-center"
                style={{
                    height: "50vh",
                    background: "linear-gradient(135deg, #0077b6, #00b4d8)",
                }}
            >
                <h1 className="display-3 fw-bold">Welcome to Ocean Shop 🛒</h1>
                <p className="lead mt-3">
                    Dive into deals from every corner of the world 🌍
                </p>

                <Link
                    to="/products"
                    className="btn btn-light btn-lg mt-3 fw-semibold pacificWaveBtn"
                >
                    Shop Now
                </Link>
            </div>

            {/* 🌊 Featured Products */}
            <div
                className="container mt-5 position-relative"
                style={{
                    background: "linear-gradient(180deg, #caf0f8 0%, #ade8f4 100%)",
                    borderRadius: "25px",
                    padding: "3rem 2rem",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
            >
                <h2 className="text-center mb-4 fw-bold text-primary">
                    Featured Products 🌴
                </h2>

                <div className="row home-featured-row">
                    {oceanProducts.slice(0, 6).map((product, index) => (
                        <div
                            className="col-md-4 mb-4"
                            key={product.id}
                            style={{
                                animation: `floatWave ${3 + index * 0.3
                                    }s ease-in-out infinite alternate`,
                            }}
                        >
                            <div
                                className="product-card shadow-sm"
                                style={{
                                    borderRadius: "20px",
                                    background: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-8px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 12px 26px rgba(0, 123, 255, 0.28)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {/* 🔵 Product Image */}
                                <div
                                    className="product-image"
                                    style={{
                                        overflow: "hidden",
                                        borderTopLeftRadius: "20px",
                                        borderTopRightRadius: "20px",
                                    }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: "100%",
                                            height: "230px",
                                            objectFit: "cover",
                                            transition: "transform 0.4s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform =
                                            "scale(1.06)")
                                        }
                                        onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform =
                                            "scale(1)")
                                        }
                                    />
                                </div>

                                {/* 🌊 Product Body */}
                                <div
                                    className="product-body text-center"
                                    style={{ padding: "15px" }}
                                >
                                    <h5 className="fw-semibold text-primary">
                                        {product.name}
                                    </h5>

                                    <p className="text-muted" style={{ minHeight: "40px" }}>
                                        {product.description}
                                    </p>

                                    <p className="fw-bold text-success">
                                        ₹{product.price}
                                    </p>

                                    <Link to={`/product/${product.id}`}>
                                        <button className="btn btn-outline-primary rounded-pill px-4">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🌊 Animations + Button CSS */}
                <style>
                    {`
                        @keyframes floatWave {
                            0% { transform: translateY(0px); }
                            100% { transform: translateY(-10px); }
                        }

                        .pacificWaveBtn {
                            border-radius: 30px;
                            transition: all 0.3s ease;
                            background: white;
                            color: #0077b6;
                            border: 2px solid #0077b6;
                        }

                        .pacificWaveBtn:hover {
                            background: #0077b6;
                            color: white;
                            transform: translateY(-3px);
                            box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
                        }

                        .product-card {
                            border-radius: 20px;
                            overflow: hidden;
                        }

                        .product-image img {
                            width: 100%;
                            height: 230px;
                            object-fit: cover;
                            display: block;
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Home;
