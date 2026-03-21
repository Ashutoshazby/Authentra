import { Navigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Loader message="Restoring your Authentra session..." />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
