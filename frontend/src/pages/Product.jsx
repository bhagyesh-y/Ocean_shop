import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cartcontext.jsx"; // from backend
import { fetchProducts } from "../api/OceanAPI.js";
import { toast } from "react-toastify";

const Products = () => {
    const [atlanticFade, setAtlanticFade] = useState(false);// fade in effect
    const { addToCart } = useContext(CartContext);
    const [addedProducts, setAddedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");// for searching products 
    const [oceanProducts, setOceanProducts] = useState([]); //  products from backend
    const [loading, setLoading] = useState(true);// for loading 
    const [error, setError] = useState("");
    // fade-in effect on mount 
    useEffect(() => {
        setTimeout(() => setAtlanticFade(true), 150);
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

    // handle add to cart with temporary button state change 
    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts((prev) => [...prev, product.id]);
        toast.success("🛒 Added to cart successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setTimeout(() => {
            setAddedProducts((prev) => prev.filter((id) => id !== product.id));
        }, 2000);
    };

    // for clearing search 
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // filter products based on search 
    const filteredProducts = oceanProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className={`container-fluid py-4 px-3 ${atlanticFade ? "opacity-100" : "opacity-0"
                }`}
            style={{
                transition: "opacity 1s ease, transform 0.6s ease",
                transform: atlanticFade ? "translateY(0)" : "translateY(20px)",
                background: "linear-gradient(180deg, #caf0f8 0%, #90e0ef 100%)",
                minHeight: "100vh",
            }}
        >
            <h1 className="text-center fw-bold mb-4 text-primary">All Products 🌊</h1>

            {/* 🌊 Search Bar with slide-in clear icon */}
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
                        (e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 119, 182, 0.4)")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />

                {/* ❌ Clear icon (slides in/out) */}
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

                <style>
                    {`
      @keyframes slideInRight {
        from { opacity: 0; transform: translate(15px, -50%); }
        to { opacity: 1; transform: translate(0, -50%); }
      }
    `}
                </style>
            </div>


            <div
                className="container pb-5"
                style={{
                    background: "linear-gradient(180deg, #ade8f4, #00b4d8, #0077b6)",
                    borderRadius: "15px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    padding: "30px",
                }}
            >
                <div className="row">
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
                    {/* Products starts from here */}
                    {!loading && (
                        <>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        className="col-md-4 mb-4"
                                        key={product.id}
                                        style={{
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        }}
                                    >
                                        <div
                                            className="card h-100 shadow-sm border-0 pacificCard"
                                            style={{
                                                borderRadius: "15px",
                                                overflow: "hidden",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-6px)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 8px 20px rgba(0, 123, 255, 0.2)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            {/* 🌅 Product Image Container */}
                                            <div
                                                className="d-flex justify-content-center align-items-center bg-light"
                                                style={{
                                                    height: "220px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
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
                                            <div className="card-body text-center">
                                                <h5 className="card-title fw-semibold">{product.name}</h5>
                                                <p className="text-muted">{product.description}</p>
                                                <p className="fw-bold text-success">₹{product.price}</p>

                                                <div className="d-flex justify-content-center gap-2">
                                                    <Link to={`/product/${product.id}`}>
                                                        <button className="btn btn-outline-primary">
                                                            View Details
                                                        </button>
                                                    </Link>

                                                    <button
                                                        className={`btn ${addedProducts.includes(product.id)
                                                            ? "btn-success"
                                                            : "btn-outline-success"
                                                            }`}
                                                        onClick={() => handleAddToCart(product)}

                                                        style={{
                                                            transition: "all 0.3s ease",
                                                            minWidth: "120px",
                                                        }}

                                                    >
                                                        {addedProducts.includes(product.id)
                                                            ? "Added ✅"
                                                            : "Add to Cart"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-white py-5">
                                    <h4>No products found matching "{searchTerm}" 😔</h4>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Products;
