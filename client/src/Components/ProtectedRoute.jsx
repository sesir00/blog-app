import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-lg animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → redirect to unauthorized
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
