import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { hasPermission, isAdminRole, USER_ROLES } from "../services/roles";

const SUPER_ADMIN_2FA_KEY = "super_admin_2fa_verified";

function AdminRouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080B12]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#A78BFA] border-t-transparent" />
    </div>
  );
}

function isSuperAdmin2FAVerified() {
  return sessionStorage.getItem(SUPER_ADMIN_2FA_KEY) === "true";
}

export default function AdminProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermission,
  requireSuperAdmin2FA = true,
}) {
  const location = useLocation();
  const { isAuthenticated, loading, profile, role } = useAuth();

  if (loading) return <AdminRouteLoading />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdminRole(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requireSuperAdmin2FA &&
    role === USER_ROLES.SUPER_ADMIN &&
    location.pathname !== "/admin/2fa" &&
    !isSuperAdmin2FAVerified()
  ) {
    return <Navigate to="/admin/2fa" replace state={{ from: location }} />;
  }

  if (requiredPermission && !hasPermission(profile || role, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
