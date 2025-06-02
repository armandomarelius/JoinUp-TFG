import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/" />;
  return children;
};

export default AdminRoute;
