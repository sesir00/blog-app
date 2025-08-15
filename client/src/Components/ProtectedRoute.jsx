import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// Dark mode dashboard loader
const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <div className="animate-pulse text-lg">Loading dashboard...</div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;


  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → redirect to unauthorized
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
