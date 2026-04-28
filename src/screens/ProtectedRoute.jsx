import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasPermission, hasAnyPermission } from "../auth/roles";

export default function ProtectedRoute({ children, requiredPermission, requiredAnyPermissions }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredAnyPermissions && !hasAnyPermission(role, requiredAnyPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}