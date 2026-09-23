import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(user.role || "").trim().toLowerCase();
  const hasAllowedRole = allowedRoles.some(
    (allowedRole) => String(allowedRole).toLowerCase() === userRole
  );

  if (allowedRoles.length && !hasAllowedRole) {
    return (
      <div className="p-6 text-center text-red-600">
        You are not authorized to view this page
      </div>
    );
  }

  return children;
};

export default PrivateRoute;