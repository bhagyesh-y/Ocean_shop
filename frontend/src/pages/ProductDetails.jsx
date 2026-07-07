import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProducts, fetchProductReviews, submitProductReview } from "../api/OceanAPI.js";
import { CartContext } from "../context/Cartcontext.jsx";
import { WishlistContext } from "../context/WishlistContext.jsx";
import { OceanAuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { FaArrowLeft, FaHeart, FaStar } from "react-icons/fa";

const ProductDetails = () => {
    const { id } = useParams();
    const [oceanProducts, setOceanProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
    const { oceanUser } = useContext(OceanAuthContext);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [added, setAdded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [reviews, setReviews] = useState({ reviews: [], average_rating: null, count: 0 });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);
    const navigate = useNavigate();

    const product = oceanProducts.find((p) => p.id === parseInt(id, 10));

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 150);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProducts();
                setOceanProducts(data);
                const rev = await fetchProductReviews(id);
                setReviews(rev);
            } catch {
                toast.error("Could not load product");
                setFetchError("Failed to load products from the server.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="ocean-products-page ocean-products-page--visible d-flex align-items-center justify-content-center py-5">
                <div className="spinner-border text-light" />
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
        if (product.stock <= 0) {
            toast.error("Out of stock", { theme: "colored" });
            return;
        }
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
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await submitProductReview(product.id, reviewForm);
            toast.success("Review submitted — thank you!", { theme: "colored" });
            const rev = await fetchProductReviews(product.id);
            setReviews(rev);
            setReviewForm({ rating: 5, comment: "" });
        } catch (err) {
            toast.error(err.response?.data?.detail || "Could not submit review", { theme: "colored" });
        } finally {
            setSubmittingReview(false);
        }
    };

    const avg = reviews.average_rating ?? product.average_rating;

    return (
        <div className={`ocean-products-page ${fadeIn ? "ocean-products-page--visible" : ""}`}>
            <div className="ocean-products-sheen" aria-hidden />
            <div className="container-fluid px-3 px-sm-4 py-4 py-md-5">
                <Link to="/products" className="btn btn-sm ocean-products-back text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
                    <FaArrowLeft aria-hidden /> All products
                </Link>

                <div className="ocean-product-detail-card mx-auto mb-4">
                    <div className="row align-items-center g-4 p-3 p-md-4 p-lg-5">
                        <div className="col-md-6 text-center position-relative">
                            <button
                                type="button"
                                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow"
                                onClick={() => toggleWishlist(product)}
                            >
                                <FaHeart color={isWishlisted(product.id) ? "#e63946" : "#aaa"} />
                            </button>
                            <img src={product.image} alt="" className="img-fluid rounded-4 ocean-product-detail-img" />
                        </div>
                        <div className="col-md-6">
                            {product.category && <span className="badge bg-info text-dark mb-2">{product.category}</span>}
                            <h1 className="h3 fw-bold text-primary mb-2">{product.name}</h1>
                            {avg != null && (
                                <p className="text-warning mb-2">
                                    <FaStar className="me-1" />
                                    {avg} ({reviews.count || product.review_count || 0} reviews)
                                </p>
                            )}
                            <p className="text-muted mb-3">{product.description}</p>
                            <p className="h4 text-success fw-bold mb-2">₹{product.price}</p>
                            <p className="mb-4">
                                {product.stock <= 0 ? (
                                    <span className="badge bg-danger">Out of stock</span>
                                ) : product.stock <= 5 ? (
                                    <span className="badge bg-warning text-dark">Only {product.stock} left</span>
                                ) : (
                                    <span className="badge bg-success">In stock</span>
                                )}
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    disabled={product.stock <= 0}
                                    className={`btn ocean-product-detail-cta ${added ? "btn-success" : "btn-primary"}`}
                                    onClick={handleAddToCart}
                                >
                                    {added ? "Added ✓" : "Add to cart"}
                                </button>
                                <button
                                    type="button"
                                    disabled={product.stock <= 0}
                                    className="btn btn-outline-primary ocean-product-detail-cta"
                                    onClick={handleBuyNow}
                                >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ocean-surface-card mx-auto" style={{ maxWidth: 720 }}>
                    <h2 className="h5 fw-bold text-primary mb-3">Reviews</h2>
                    {reviews.reviews?.length > 0 ? (
                        <ul className="list-unstyled mb-4">
                            {reviews.reviews.map((r) => (
                                <li key={r.id} className="border-bottom pb-2 mb-2">
                                    <strong>{r.username}</strong>
                                    <span className="text-warning ms-2">{"★".repeat(r.rating)}</span>
                                    {r.comment && <p className="small text-muted mb-0 mt-1">{r.comment}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted small mb-3">No reviews yet — be the first.</p>
                    )}

                    {oceanUser && (
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Your rating</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>
                                            {n} stars
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <textarea
                                    className="form-control form-control-sm"
                                    rows={3}
                                    placeholder="Share your thoughts…"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                                {submittingReview ? "Posting…" : "Post review"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
