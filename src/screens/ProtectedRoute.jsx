import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasPermission, hasAnyPermission } from "../services/roles";

export default function ProtectedRoute({ children, requiredPermission, requiredAnyPermissions }) {
  const { isAuthenticated, role: authRole, profile } = useAuth();

  // DEMO ONLY: Allow temporary admin session for development
  const demoUser = JSON.parse(localStorage.getItem("ig_demo_admin_user") || "null");
  const isDemoAuthenticated = !!demoUser;
  const actor = isDemoAuthenticated ? demoUser || "super_admin" : profile || authRole;

  if (!isAuthenticated && !isDemoAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(actor, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredAnyPermissions && !hasAnyPermission(actor, requiredAnyPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
