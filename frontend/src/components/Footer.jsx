import React from "react";
import { NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer-section text-light pt-5 mt-auto">
            <div className="container pb-4">
                <div className="row text-start align-items-start">
                    {/* 🌊 About Cartify */}
                    <div className="col-lg-4 col-md-6 mb-5">
                        <h5 className="fw-bold text-light">Cartify</h5>
                        <p className="text-light opacity-75 small mt-3">
                            Making shopping accessible and enjoyable for everyone. Explore,
                            buy, and grow with our modern e-commerce platform built for
                            simplicity, security, and speed.
                        </p>

                        <div className="d-flex gap-3 mt-4">
                            <NavLink to="#" className="footer-social">
                                <FaYoutube size={22} />
                            </NavLink>
                            <NavLink to="#" className="footer-social">
                                <FaInstagram size={22} />
                            </NavLink>
                            <NavLink to="#" className="footer-social">
                                <FaLinkedin size={22} />
                            </NavLink>
                            <NavLink to="#" className="footer-social">
                                <FaGithub size={22} />
                            </NavLink>
                        </div>
                    </div>

                    {/* 🐚 About Section */}
                    <div className="col-lg-2 col-md-3 col-6 mb-4">
                        <h6 className="fw-semibold text-light mb-3">About</h6>
                        <ul className="list-unstyled text-light opacity-75 small">
                            <li>
                                <NavLink to="/about" className="footer-link">
                                    Our Story
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="footer-link">
                                    Careers
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="footer-link">
                                    Blog
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* 🏄 Customer Service */}
                    <div className="col-lg-2 col-md-3 col-6 mb-4">
                        <h6 className="fw-semibold text-light mb-3">Customer Service</h6>
                        <ul className="list-unstyled text-light opacity-75 small">
                            <li>
                                <NavLink to="/customer-service" className="footer-link">
                                    Help Center
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customer-service" className="footer-link">
                                    Returns
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customer-service" className="footer-link">
                                    Shipping Info
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* ⚓ Quick Links */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6 className="fw-semibold text-light mb-3">Quick Links</h6>
                        <ul className="list-unstyled text-light opacity-75 small">
                            <li>
                                <NavLink to="/quick-Links" className="footer-link">
                                    Privacy Policy
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/quick-Links" className="footer-link">
                                    Terms of Service
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/quick-Links" className="footer-link">
                                    FAQs
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-light opacity-25" />

                {/* 🧾 Bottom Line */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 text-light opacity-75 small">
                    <p className="mb-2 mb-md-0">
                        © {new Date().getFullYear()} <strong>Cartify</strong>. All rights reserved.
                    </p>
                    <p className="mb-0">
                        Built with <span className="text-danger">❤️</span> in <span>🇮🇳</span>
                    </p>
                    <p className="mb-0 text-secondary">Made for shoppers, by developers</p>
                </div>
            </div>

            {/* 🌊 Footer Styling */}
            <style jsx>{`
        .footer-section {
          background: linear-gradient(180deg, #03045e 0%, #000814 100%);
          color: #eaeaea;
          font-family: "Poppins", sans-serif;
        }

        .footer-link {
          display: block;
          color: #bfbfbf;
          text-decoration: none;
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #00b4d8;
        }

        .footer-social {
          color: #bfbfbf;
          background: rgba(255, 255, 255, 0.05);
          padding: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .footer-social:hover {
          color: #00b4d8;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        hr {
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 767px) {
          .footer-section {
            text-align: center;
          }
          .footer-social {
            margin: 0 auto;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
