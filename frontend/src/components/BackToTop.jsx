import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {visible && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        padding: "12px 14px",
                        borderRadius: "50%",
                        background: "#00b4d8",
                        color: "white",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        zIndex: 9999,
                        transition: "0.3s",
                    }}
                >
                    <FaArrowUp size={18} />
                </button>
            )}
        </>
    );
};

export default BackToTop;
