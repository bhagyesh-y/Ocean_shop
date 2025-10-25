import React from "react";
import { NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 mt-auto">
            <div className="container">
                <div className="row text-start">
                    {/* 🌊 About Section */}
                    <div className="col-md-3 mb-4">
                        <h6 className="text-uppercase fw-bold">About Cartify</h6>
                        <ul className="list-unstyled">
                            <li>
                                <NavLink to="/about" className="footer-link text-decoration-none text-light">
                                    Our Story
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="footer-link text-decoration-none text-light">
                                    Careers
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="footer-link text-decoration-none text-light">
                                    Blog
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* 🐚 Customer Service */}
                    <div className="col-md-3 mb-4">
                        <h6 className="text-uppercase fw-bold">Customer Service</h6>
                        <ul className="list-unstyled">
                            <li>
                                <NavLink to="/customer-service" className="footer-link text-decoration-none text-light">
                                    Help Center
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customer-service" className="footer-link text-decoration-none text-light">
                                    Returns
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/customer-service" className="footer-link text-decoration-none text-light">
                                    Shipping Info
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* 🌴 Quick Links */}
                    <div className="col-md-3 mb-4">
                        <h6 className="text-uppercase fw-bold">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li>
                                <NavLink to="/quick-links" className="footer-link text-decoration-none text-light">
                                    Privacy Policy
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/quick-links" className="footer-link text-decoration-none text-light">
                                    Terms of Service
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/quick-links" className="footer-link text-decoration-none text-light">
                                    FAQs
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* 🌐 Connect with Us */}
                    <div className="col-md-3 mb-4">
                        <h6 className="text-uppercase fw-bold">Connect with Us</h6>
                        <ul className="list-unstyled d-flex gap-3">
                            <li>
                                <a href="mailto:bhagyeshyadav29@gmail.com" className="text-light footer-icon">
                                    <FaEnvelope size={20} />
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com" className="text-light footer-icon">
                                    <FaLinkedin size={20} />
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com" className="text-light footer-icon">
                                    <FaGithub size={20} />
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com" className="text-light footer-icon">
                                    <FaTwitter size={20} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="bg-light" />

                <div className="text-center pb-3">
                    <p className="mb-1">© {new Date().getFullYear()} Cartify. All rights reserved.</p>
                    <p className="mb-0">Designed and developed by Bhagyesh</p>
                </div>
            </div>

            {/* 🌊 Footer Styling */}
            <style jsx>{`
                .footer-link {
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                .footer-link:hover {
                    color: #00b4d8;
                    text-decoration: underline;
                }
                .footer-icon {
                    transition: transform 0.3s ease, color 0.3s ease;
                }
                .footer-icon:hover {
                    color: #00b4d8;
                    transform: scale(1.2);
                }
            `}</style>
        </footer>
    );
};

export default Footer;
