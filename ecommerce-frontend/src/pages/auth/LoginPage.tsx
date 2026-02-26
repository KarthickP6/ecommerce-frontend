import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { loginUser, clearError } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';

// Type definition for login response from authSlice
interface LoginResponse {
  user: {
    id: string;
    name?: string;
    email: string;
    roles: string[];
    createdAt?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Ref to prevent double submissions during redirect
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clears input field errors
   */
  const handleClearError = useCallback(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  /**
   * Handles email input changes with error clearing
   */
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    handleClearError();
  }, [handleClearError]);

  /**
   * Handles password input changes with error clearing
   */
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    handleClearError();
  }, [handleClearError]);

  /**
   * Validates email format
   */
  const isValidEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  /**
   * Helper function to derive role from roles array
   * Matches the logic in authSlice.ts
   */
  const deriveRoleFromRoles = (roles?: string[]): 'user' | 'admin' => {
    if (!roles || roles.length === 0) return 'user';
    return roles.some(r => r.toUpperCase() === 'ADMIN') ? 'admin' : 'user';
  };

  /**
   * Determines redirect path based on user role derived from roles array
   * Uses the same deriveRoleFromRoles logic as authSlice
   */
  const getRedirectPath = (roles?: string[]): string => {
    const role = deriveRoleFromRoles(roles);
    return role === 'admin' ? '/admin' : '/dashboard';
  };

  /**
   * Handles login form submission with role-based redirection
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting || loading) {
      return;
    }

    // Validate inputs
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dispatch login action and unwrap the result
      const result = await dispatch(loginUser({ email, password })).unwrap();

      console.log('Login response:', result);

      // Validate response structure
      // Result structure from authSlice: { user, accessToken, refreshToken }
      if (!result?.user) {
        console.error('Invalid response structure - missing user', result);
        toast.error('Invalid response from server');
        setIsSubmitting(false);
        return;
      }

      if (!result.user.email) {
        console.error('Invalid user data - missing email', result.user);
        toast.error('Invalid user data from server');
        setIsSubmitting(false);
        return;
      }

      if (!result?.accessToken) {
        console.error('Invalid response structure - missing accessToken', result);
        toast.error('Invalid response from server');
        setIsSubmitting(false);
        return;
      }

      // Show success message
      toast.success('Login successful');

      // Get roles from response and determine redirect path
      const roles = result.user.roles;
      console.log('User roles:', roles);

      const redirectPath = getRedirectPath(roles);
      console.log('Redirect path:', redirectPath);

      // Clear any previous timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Navigate with replace to prevent back button returning to login
      navigationTimeoutRef.current = setTimeout(() => {
        console.log('Navigating to:', redirectPath);
        navigate(redirectPath, { replace: true });
      }, 300);

    } catch (err) {
      // Redux slice handles error state - just ensure UI is responsive
      setIsSubmitting(false);
      console.error('Login error caught:', err);

      // The error message from Redux is already displayed via the error state
      // Redux slice sets state.error which is used in the error display component
      // If user sees "Invalid response from server", it means:
      // 1. The backend didn't return the expected structure
      // 2. Check Network tab to verify the response
      // 3. Check console logs for which validation failed
    }
  };

  /**
   * Cleanup timeout on component unmount
   */
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main card with better background */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
          {/* Header section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3">Sign In</h1>
            <p className="text-gray-300 text-lg">Welcome back to ShopHub</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm font-medium">
                {error === 'Login failed' ? 'Invalid username or password. Please try again.' : error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading || isSubmitting}
                className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-200">Password</label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading || isSubmitting}
                  className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isSubmitting}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  {showPassword ? '🔓' : '🔒'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={loading || isSubmitting}
                className="w-4 h-4 rounded bg-white/20 border border-white/30 text-cyan-400 cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full py-3 px-6 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Social buttons - text only */}
          <div className="space-y-3">
            <button type="button" disabled={loading || isSubmitting} className="w-full py-2.5 px-4 border border-white/30 rounded-xl text-gray-200 font-medium hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue with Google
            </button>
            <button type="button" disabled={loading || isSubmitting} className="w-full py-2.5 px-4 border border-white/30 rounded-xl text-gray-200 font-medium hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue with GitHub
            </button>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition">
              Sign up
            </Link>
          </p>

          {/* Footer text */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

