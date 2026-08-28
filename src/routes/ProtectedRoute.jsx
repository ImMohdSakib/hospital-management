import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({ allowedRoles = [] }) {
    const { isAuthenticated, role, loading } = useAuth();
    const location = useLocation();
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "role:", role);

  // Auth check hone tak wait karo
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-lg font-semibold text-teal-600">
          Loading...
        </div>
      </div>
    );
  }

  // Login nahi hai
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/webadmin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}