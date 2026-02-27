import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatusThunk, clearError } from '@/features/admin/adminSlice';
import type { RootState } from '@/app/store';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'react-toastify';

export default function ManageOrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      const pageIndex = currentPage - 1;
      console.log('ManageOrdersPage: dispatching fetchOrders', { page: pageIndex, limit: itemsPerPage });
      try {
        await dispatch(fetchOrders({ page: pageIndex, limit: itemsPerPage }) as any).unwrap();
        console.log('ManageOrdersPage: fetchOrders fulfilled');
      } catch (err: any) {
        console.error('ManageOrdersPage: fetchOrders error', err);
        toast.error(err?.message || 'Failed to load orders from server');
      }
    };
    fetch();
  }, [dispatch, currentPage]);

  useEffect(() => {
    return () => {
      if (error) dispatch(clearError());
    };
  }, [dispatch, error]);

  const paginatedOrders = (orders.data && Array.isArray(orders.data)) ? orders.data : [];
  const totalPages = orders.total ? Math.ceil(orders.total / itemsPerPage) : 0;

  const handleChangeStatus = async (id: string, status: string) => {
    try {
      await dispatch(updateOrderStatusThunk({ id, status }) as any).unwrap();
      toast.success('Order status updated');
      dispatch(fetchOrders({ page: currentPage - 1, limit: itemsPerPage }) as any);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  return (
    <AdminLayout title="Manage Orders">
      <div className="bg-white rounded-lg shadow p-4">
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">No orders found</td>
                  </tr>
                ) : (
                  paginatedOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.orderNumber || order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.customerName || order.customer?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                          className="px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer bg-gray-100"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {orders.total > 0 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orders.total)} of {orders.total} orders
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
