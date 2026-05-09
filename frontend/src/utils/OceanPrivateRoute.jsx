import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { OceanAuthContext } from "../context/AuthContext";

const OceanPrivateRoute = ({ children }) => {
    const { oceanUser, isAuthReady } = useContext(OceanAuthContext);
    const location = useLocation();

    if (!isAuthReady) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading…</span>
                </div>
            </div>
        );
    }

    if (!oceanUser) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default OceanPrivateRoute;
