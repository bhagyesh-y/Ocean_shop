import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { OceanAuthContext } from "../context/OceanAuthContext";

const OceanPrivateRoute = ({ children }) => {
    const { oceanUser } = useContext(OceanAuthContext);

    // If user is not logged in, redirect to login
    if (!oceanUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default OceanPrivateRoute;
