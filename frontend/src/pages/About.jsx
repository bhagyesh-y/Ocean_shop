import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const About = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [visibleSections, setVisibleSections] = useState([]);

    useEffect(() => {
        setFadeIn(true);
        const timers = [1, 2, 3].map((i) =>
            setTimeout(() => setVisibleSections((prev) => [...prev, i]), i * 300)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div
            className={`container py-5 ${fadeIn ? "opacity-100" : "opacity-0"}`}
            style={{
                background: "linear-gradient(180deg, #caf0f8, #90e0ef, #0077b6)",
                borderRadius: "12px",
                color: "#023e8a",
                transition: "opacity 1.2s ease, transform 0.8s ease",
                transform: fadeIn ? "translateY(0)" : "translateY(20px)",
            }}
        >
            <h1 className="text-center fw-bold mb-5">About Cartify 🌊</h1>

            <div className="d-flex flex-column gap-5">
                {visibleSections.includes(1) && (
                    <section className="fade-up">
                        <h3>📖 Our Story</h3>
                        <p>
                            Cartify began with a simple idea — making online shopping smoother, faster,
                            and more delightful. We’ve grown from a small startup to a thriving global platform.
                        </p>
                    </section>
                )}

                {visibleSections.includes(2) && (
                    <section className="fade-up">
                        <h3>👩‍💻 Careers</h3>
                        <p>
                            We believe great products come from great people. If you’re passionate about
                            technology or design — join our ocean of talent. Email:
                            <strong> careers@cartify.com</strong>
                        </p>
                    </section>
                )}

                {visibleSections.includes(3) && (
                    <section className="fade-up">
                        <h3>📝 Blog</h3>
                        <p>
                            Explore our blog for stories, product tips, and updates about what’s new at Cartify.
                        </p>
                        <NavLink to="/customer-service" className="btn btn-outline-info mt-3">
                            Visit Help Center
                        </NavLink>
                    </section>
                )}
            </div>

            <style jsx="true">{`
        .fade-up {
          animation: fadeUp 0.9s ease both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default About;
