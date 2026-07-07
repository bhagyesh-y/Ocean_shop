import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
    const { wishlist, wishlistReady, toggleWishlist } = useContext(WishlistContext);

    return (
        <div className="ocean-products-page ocean-products-page--visible">
            <div className="ocean-products-sheen" aria-hidden />
            <div className="container-fluid px-3 py-4 py-md-5">
                <header className="text-center mb-4">
                    <FaHeart className="text-danger mb-2" style={{ fontSize: "2rem" }} />
                    <h1 className="h2 fw-bold ocean-products-title">Your wishlist</h1>
                    <p className="ocean-products-lead">Treasures you&apos;ve marked for later.</p>
                </header>

                {!wishlistReady ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-light" />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="ocean-products-empty text-center py-5 rounded-4 mx-auto" style={{ maxWidth: 420 }}>
                        <p className="fw-semibold mb-3">Your wishlist is empty.</p>
                        <Link to="/products" className="btn ocean-dash-btn-primary">
                            Browse products
                        </Link>
                    </div>
                ) : (
                    <div className="ocean-products-panel mx-auto">
                        <div className="row g-3">
                            {wishlist.map((item) => {
                                const p = item.product;
                                if (!p) return null;
                                return (
                                    <div key={item.id} className="col-6 col-md-4 col-lg-3">
                                        <div className="product-card ocean-product-card-shell h-100">
                                            <div className="product-image">
                                                <img src={p.image} alt={p.name} />
                                            </div>
                                            <div className="product-body d-flex flex-column">
                                                <h5 className="text-primary small">{p.name}</h5>
                                                <p className="price">₹{p.price}</p>
                                                <div className="mt-auto d-flex flex-column gap-2">
                                                    <Link
                                                        to={`/product/${p.id}`}
                                                        className="btn btn-outline-primary btn-sm ocean-product-btn"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => toggleWishlist(p)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
