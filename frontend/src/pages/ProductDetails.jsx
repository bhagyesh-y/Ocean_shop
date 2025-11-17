import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/OceanAPI.js";
import { CartContext } from "../context/Cartcontext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
    const { id } = useParams();
    const [oceanProducts, setOceanProducts] = useState([]); //  products from backend
    const { addToCart } = useContext(CartContext);
    const product = oceanProducts.find((p) => p.id === parseInt(id));
    const [loading, setLoading] = useState(true);// for loading 
    const [added, setAdded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 150);
    }, []);
    // fetching products from backend 
    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            }
            catch (err) {
                toast.error("Error while fetching products");
                setError("failed to load products from server");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [])

    if (!product) {
        return (
            <div className="container text-center mt-5">
                <h3>Product not found 😕</h3>
                <Link to="/products" className="btn btn-primary mt-3">
                    Back to Products
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        toast.success(`${product.name} added to cart! 🛒`, {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
        });
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate("/cart");
        toast.info(`Proceeding to checkout for ${product.name} 💳`, {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
        });
    };

    return (
        <div
            className={`container-fluid py-5 px-3 ${fadeIn ? "opacity-100" : "opacity-0"
                }`}
            style={{
                minHeight: "100vh",
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: fadeIn ? "translateY(0)" : "translateY(20px)",
                background: "linear-gradient(135deg, #caf0f8, #ade8f4, #90e0ef, #00b4d8)",
            }}
        >
            <div className="container mt-4">
                <div className="row align-items-center bg-white shadow-lg rounded-4 p-4">
                    {/* 🖼️ Product Image */}
                    <div className="col-md-6 text-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid rounded-4 shadow"
                            style={{
                                maxHeight: "400px",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        />
                    </div>

                    {/* 🌊 Product Info */}
                    <div className="col-md-6 mt-4 mt-md-0">
                        <h2 className="fw-bold text-primary">{product.name}</h2>
                        <p className="text-muted">{product.description}</p>
                        <h4 className="text-success fw-bold mb-4">₹{product.price}</h4>

                        <div className="d-flex flex-wrap gap-3">
                            <button
                                className={`btn ${added ? "btn-success" : "btn-primary"
                                    } px-4 py-2`}
                                onClick={handleAddToCart}
                            >
                                {added ? "✅ Added to Cart" : "Add to Cart"}
                            </button>

                            <button
                                className="btn btn-outline-info px-4 py-2"
                                onClick={handleBuyNow}
                            >
                                💳 Buy Now
                            </button>

                            <Link
                                to="/products"
                                className="btn btn-outline-secondary px-4 py-2"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
