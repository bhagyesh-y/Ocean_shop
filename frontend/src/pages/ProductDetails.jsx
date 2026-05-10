import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/OceanAPI.js";
import { CartContext } from "../context/Cartcontext.jsx";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const ProductDetails = () => {
    const { id } = useParams();
    const [oceanProducts, setOceanProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [added, setAdded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();

    const product = oceanProducts.find((p) => p.id === parseInt(id, 10));

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 150);
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
            } catch {
                toast.error("Could not load products");
                setFetchError("Failed to load products from the server.");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    if (loading) {
        return (
            <div className="ocean-products-page ocean-products-page--visible d-flex align-items-center justify-content-center py-5">
                <div className="text-center text-white">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading</span>
                    </div>
                    <p className="mt-3 small mb-0">Loading product…</p>
                </div>
            </div>
        );
    }

    if (fetchError || !product) {
        return (
            <div className="ocean-products-page ocean-products-page--visible py-5 px-3">
                <div className="ocean-products-empty text-center py-5 rounded-4 mx-auto" style={{ maxWidth: 420 }}>
                    <h2 className="h5 fw-bold mb-3">{fetchError || "Product not found"}</h2>
                    <Link to="/products" className="btn ocean-dash-btn-primary px-4 rounded-pill">
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = async () => {
        const ok = await addToCart(product);
        if (!ok) return;
        setAdded(true);
        toast.success(`${product.name} added to your cart`, { theme: "colored" });
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = async () => {
        const ok = await addToCart(product);
        if (!ok) return;
        navigate("/cart");
        toast.info(`Review your cart for ${product.name}`, { theme: "colored" });
    };

    return (
        <div
            className={`ocean-products-page ${fadeIn ? "ocean-products-page--visible" : ""}`}
        >
            <div className="ocean-products-sheen" aria-hidden />
            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <div className="mb-3">
                    <Link
                        to="/products"
                        className="btn btn-sm ocean-products-back text-decoration-none d-inline-flex align-items-center gap-2"
                    >
                        <FaArrowLeft aria-hidden />
                        All products
                    </Link>
                </div>

                <div className="ocean-product-detail-card mx-auto">
                    <div className="row align-items-center g-4 g-md-5 p-3 p-md-4 p-lg-5">
                        <div className="col-md-6 text-center">
                            <img
                                src={product.image}
                                alt=""
                                className="img-fluid rounded-4 ocean-product-detail-img"
                            />
                        </div>
                        <div className="col-md-6">
                            <h1 className="h3 fw-bold text-primary mb-3">{product.name}</h1>
                            <p className="text-muted mb-4">{product.description}</p>
                            <p className="h4 text-success fw-bold mb-4">₹{product.price}</p>

                            <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 gap-sm-3">
                                <button
                                    type="button"
                                    className={`btn flex-grow-1 flex-sm-grow-0 ocean-product-detail-cta ${
                                        added ? "btn-success" : "btn-primary"
                                    }`}
                                    onClick={handleAddToCart}
                                >
                                    {added ? "Added ✓" : "Add to cart"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary flex-grow-1 flex-sm-grow-0 ocean-product-detail-cta"
                                    onClick={handleBuyNow}
                                >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
