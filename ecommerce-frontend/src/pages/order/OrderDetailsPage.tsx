import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrder';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/formatPrice';

/**
 * Order Details Page Component
 * Displays detailed information for a specific order
 * Features:
 * - Full order details with items
 * - Order timeline/status tracking
 * - Shipping information
 * - Payment details
 * - Cancel order option
 * - Re-order button
 * - Proper loading and error states
 */
export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { fetchOrderById, selectedOrder, loading, error, cancelOrder } = useOrder();
  const [canceling, setCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch order on mount
  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /**
   * Handle cancel order
   * Automatically includes JWT token
   */
  const handleCancelOrder = async () => {
    if (!orderId) return;

    try {
      setCanceling(true);
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      setShowCancelConfirm(false);
      // Fetch updated order
      fetchOrderById(orderId);
    } catch (err) {
      toast.error('Failed to cancel order');
    } finally {
      setCanceling(false);
    }
  };

  /**
   * Handle re-order
   */
  const handleReorder = () => {
    if (!selectedOrder?.items) return;
    // TODO: Implement re-order logic (add items to cart)
    toast.info('Re-order feature coming soon');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Order not found</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Order timeline
  const timeline = [
    {
      status: 'pending',
      label: 'Order Placed',
      completed: ['pending', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status),
    },
    {
      status: 'processing',
      label: 'Processing',
      completed: ['processing', 'shipped', 'delivered'].includes(selectedOrder.status),
    },
    {
      status: 'shipped',
      label: 'Shipped',
      completed: ['shipped', 'delivered'].includes(selectedOrder.status),
    },
    {
      status: 'delivered',
      label: 'Delivered',
      completed: selectedOrder.status === 'delivered',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            ← Back to Orders
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-2">Order #{selectedOrder.id}</p>
            </div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="flex justify-between">
            {timeline.map((item, index) => (
              <div key={item.status} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 ${
                    item.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  {item.completed ? '✓' : index + 1}
                </div>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        SKU: {item.product.sku || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(selectedOrder.total * 0.91)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(selectedOrder.total * 0.1)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <p className="text-gray-600 text-sm">{selectedOrder.shippingAddress}</p>
                {selectedOrder.trackingNumber && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Tracking Number:</p>
                    <p className="font-mono font-bold text-blue-600">
                      {selectedOrder.trackingNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <p className="text-gray-600 text-sm">
                  {selectedOrder.paymentMethod
                    ?.split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ') || 'Card'}
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Ordered on:{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-900">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="text-gray-900">{selectedOrder.items?.length || 0}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleReorder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Reorder
                </button>

                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={canceling}
                    className="w-full bg-red-100 hover:bg-red-200 disabled:bg-gray-300 text-red-700 disabled:text-gray-600 font-bold py-2 px-4 rounded-lg transition"
                  >
                    {canceling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}

                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Back to Orders
                </button>
              </div>

              {selectedOrder.status === 'delivered' && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ Delivered on{' '}
                    {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Order?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg"
              >
                {canceling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

