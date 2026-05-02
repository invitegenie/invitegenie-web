import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { hasAnyPermission, hasPermission } from "../services/roles";

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8B5CF6] border-t-transparent" />
    </div>
  );
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermission,
  requiredAnyPermissions,
}) {
  const location = useLocation();
  const { isAuthenticated, loading, profile, role } = useAuth();

  if (loading) return <RouteLoading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(profile || role, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredAnyPermissions && !hasAnyPermission(profile || role, requiredAnyPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
