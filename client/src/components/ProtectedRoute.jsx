import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
