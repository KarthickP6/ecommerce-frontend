import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

/**
 * User Header/Navigation Component
 * Provides navigation for authenticated users
 * Features:
 * - Shop link
 * - Cart with item count
 * - Orders link
 * - Profile link
 * - Logout button
 */
export default function UserHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            🛋️ Furniture
          </button>
        </div>

        {/* Navigation Links */}
        {isAuthenticated && (
          <nav className="flex items-center gap-6">
            {/* Shop */}
            <button
              onClick={() => navigate('/products')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Shop
            </button>

            {/* Orders */}
            <button
              onClick={() => navigate('/orders')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Orders
            </button>

            {/* Wishlist/Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-2"
            >
              <span>🛒 Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Profile
            </button>

            {/* User Menu Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-2">
                <span>{user?.name?.split(' ')[0] || 'User'}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg border-t"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Guest Navigation */}
        {!isAuthenticated && (
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Shop
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Login
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

