import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

/**
 * useAuth Hook
 * Provides easy access to authentication state and user data
 */
export const useAuth = () => {
  const { isAuthenticated, user, loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    isAuthenticated,
    user,
    loading,
    error,
    accessToken,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  };
};

export default useAuth;

