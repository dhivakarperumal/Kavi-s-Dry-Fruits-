import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const userRole = String(user?.role || "").trim().toLowerCase();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return (
      <div className="p-6 text-center text-red-600">
        You are not authorized to view this page
      </div>
    );
  }

  return children;
};

export default PrivateRoute;