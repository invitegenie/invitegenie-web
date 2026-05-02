import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminProtectedRoute() {
  const { isAuthenticated, role: authRole, loading } = useAuth();
  
  if (loading) return null;

  const role = authRole;
  const is2FAVerified = sessionStorage.getItem("super_admin_2fa_verified") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role === "super_admin" && !is2FAVerified) {
    return <Navigate to="/admin/2fa" replace />;
  }

  return <Outlet />;
}
