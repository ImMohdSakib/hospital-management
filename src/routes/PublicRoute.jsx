import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Auth loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-lg font-semibold text-teal-600">
          Loading...
        </div>
      </div>
    );
  }

  // Agar already login hai to login page mat dikhao
  if (isAuthenticated) {
    return <Navigate to="/webadmin/dashboard" replace />;
  }

  return <Outlet />;
}