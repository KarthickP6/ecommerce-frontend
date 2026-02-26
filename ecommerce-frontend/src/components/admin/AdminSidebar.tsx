import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { logoutUser } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';

/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel with menu items
 * Features:
 * - Collapsible sidebar
 * - Active route highlighting
 * - Admin menu items with icons
 * - User profile section
 * - Logout button
 */
export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(true);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser() as any);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: '📊',
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: '📦',
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: '👥',
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: '📋',
    },
    {
      label: 'Categories',
      path: '/admin/categories',
      icon: '🏷️',
    },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
    },
    {
      label: 'Payments',
      path: '/admin/payments',
      icon: '💳',
    },
  ];

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-800 p-2 rounded transition"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* User Profile */}
      {isOpen && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 transition ${
              isActive(item.path)
                ? 'bg-blue-600 border-r-4 border-blue-400'
                : 'hover:bg-gray-800'
            }`}
            title={!isOpen ? item.label : ''}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-800 rounded transition"
          title={!isOpen ? 'Profile' : ''}
        >
          <span className="text-xl">👤</span>
          {isOpen && <span>Profile</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-2 hover:bg-red-700 rounded transition text-left"
          title={!isOpen ? 'Logout' : ''}
        >
          <span className="text-xl">🚪</span>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

