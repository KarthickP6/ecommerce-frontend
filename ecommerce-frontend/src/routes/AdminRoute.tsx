import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

/**
 * AdminRoute Component
 * Protects routes that require admin role
 * Redirects non-admin users to home
 */
const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

