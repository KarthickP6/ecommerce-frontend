import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { formatPrice } from '@/utils/formatPrice';

/**
 * User Dashboard Page
 * Shows user welcome message and links to main functionalities
 * Features:
 * - User greeting with name
 * - Quick access links to features
 * - Recent orders
 * - Account management options
 */
export default function UserDashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">EcommerceFurniture</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Shop
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                Orders
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                Profile
              </Link>
              <Link to="/cart" className="relative">
                <button className="text-gray-700 hover:text-blue-600 font-medium">
                  🛒 Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {user?.email}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Account Type: <span className="font-semibold capitalize">{user?.role || 'User'}</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Browse Products */}
          <Link to="/products">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-blue-500 hover:border-blue-600">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Products</h3>
              <p className="text-gray-600 mb-4">
                Explore our collection of furniture products and find what you're looking for.
              </p>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium">
                Start Shopping →
              </span>
            </div>
          </Link>

          {/* My Orders */}
          <Link to="/orders">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-green-500 hover:border-green-600">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Orders</h3>
              <p className="text-gray-600 mb-4">
                Track your orders, view order history, and manage your purchases.
              </p>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-lg font-medium">
                View Orders →
              </span>
            </div>
          </Link>

          {/* Shopping Cart */}
          <Link to="/cart">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-purple-500 hover:border-purple-600">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Shopping Cart</h3>
              <p className="text-gray-600 mb-4">
                View and manage items in your cart. Proceed to checkout anytime.
              </p>
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-medium">
                Go to Cart →
              </span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-red-500 hover:border-red-600">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wishlist</h3>
              <p className="text-gray-600 mb-4">
                Save your favorite items and get notified when they go on sale.
              </p>
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium">
                View Wishlist →
              </span>
            </div>
          </Link>

          {/* Profile Settings */}
          <Link to="/profile">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-orange-500 hover:border-orange-600">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600 mb-4">
                Update your personal information and manage your account preferences.
              </p>
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium">
                Edit Profile →
              </span>
            </div>
          </Link>

          {/* Address Management */}
          <Link to="/address">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer h-full border-t-4 border-teal-500 hover:border-teal-600">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Addresses</h3>
              <p className="text-gray-600 mb-4">
                Manage your delivery addresses and billing information.
              </p>
              <span className="inline-block px-4 py-2 bg-teal-100 text-teal-600 rounded-lg font-medium">
                Manage Addresses →
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-gray-600 text-sm mt-2">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{formatPrice(0)}</div>
            <p className="text-gray-600 text-sm mt-2">Total Spent</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-gray-600 text-sm mt-2">Wishlist Items</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <p className="text-gray-600 text-sm mt-2">Cart Items</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">📚 Documentation</h3>
              <p className="text-blue-100 text-sm">
                Learn how to use our platform and make the most of your shopping experience.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">💬 Contact Support</h3>
              <p className="text-blue-100 text-sm">
                Have questions? Our support team is here to help you 24/7.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">🔒 Account Security</h3>
              <p className="text-blue-100 text-sm">
                Your privacy and security are our top priority. Learn about our policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
