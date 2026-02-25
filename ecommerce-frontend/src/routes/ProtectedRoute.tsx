import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface ProtectedRouteProps {
  requiredRole?: string;
}

/**
 * ProtectedRoute Component
 * Redirects unauthenticated users to login
 * Optionally checks for specific role
 */
const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

