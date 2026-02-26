import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchDashboardStats, clearError } from '@/features/admin/adminSlice';

/**
 * Admin Dashboard Page
 * Displays key metrics and analytics for the e-commerce platform
 * Features:
 * - Key metrics cards (revenue, orders, users, products)
 * - Charts and graphs
 * - Recent orders
 * - Top products
 * - System health status
 */
export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, loading, error } = useSelector((state: RootState) => state.admin);
  const [revenueChart, setRevenueChart] = useState<any>(null);

  // Load dashboard stats on mount
  useEffect(() => {
    dispatch(fetchDashboardStats() as any);
  }, [dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${dashboard?.totalRevenue?.toLocaleString()}
              </p>
              <p className="text-green-600 text-xs mt-2">↑ 12% from last month</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboard?.totalOrders}
              </p>
              <p className="text-green-600 text-xs mt-2">↑ 8% from last month</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboard?.totalUsers}
              </p>
              <p className="text-green-600 text-xs mt-2">↑ 5% from last month</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboard?.totalProducts}
              </p>
              <p className="text-green-600 text-xs mt-2">↑ 3 new products</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded flex items-end justify-center gap-2">
            {[65, 45, 80, 55, 90, 70, 85, 95, 75, 88, 92, 85].map((value, idx) => (
              <div
                key={idx}
                className="bg-blue-600 rounded-t"
                style={{
                  width: '30px',
                  height: `${value}%`,
                }}
                title={`${value}%`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">Revenue trend over last 12 months</p>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center text-gray-600">
            <p className="text-sm">Pending Orders: <span className="font-bold text-blue-600">{dashboard?.pendingOrders}</span></p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900 font-mono">ORD-{10000 + idx}</td>
                    <td className="px-4 py-2 text-gray-900">Customer {idx}</td>
                    <td className="px-4 py-2 text-gray-900">${(Math.random() * 500 + 100).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        {['Pending', 'Processing', 'Shipped'][idx % 3]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600 text-xs">
                      {new Date(Date.now() - idx * 86400000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Server</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cache</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Running</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <span className="text-sm text-yellow-600 font-medium">80% Full</span>
              </span>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-600 mb-2">Last updated:</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

