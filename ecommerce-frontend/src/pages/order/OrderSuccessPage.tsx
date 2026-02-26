import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrder';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';

/**
 * Order Success Page Component
 * Displays order confirmation and success message
 * Features:
 * - Order confirmation details
 * - Order tracking information
 * - Continue shopping button
 * - View order history button
 * - Proper loading and error states
 */
export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchOrderById, selectedOrder, loading, error } = useOrder();
  const { emptyCartAsync } = useCart();
  const [orderFetched, setOrderFetched] = useState(false);

  const orderId = searchParams.get('orderId');

  // Fetch order details on mount
  useEffect(() => {
    if (orderId && !orderFetched) {
      fetchOrderById(orderId);
      setOrderFetched(true);
      // Clear cart after successful order
      emptyCartAsync();
    }
  }, [orderId, orderFetched, fetchOrderById, emptyCartAsync]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-4xl text-green-600">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* Order Header */}
            <div className="border-b pb-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="text-lg text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-semibold">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${(selectedOrder.total * 0.91).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold text-gray-900">
                    ${(selectedOrder.total * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-blue-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-600">
                {selectedOrder.paymentMethod
                  ?.split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') || 'Card'}
              </p>
            </div>

            {/* Tracking Information */}
            {selectedOrder.trackingNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Track Your Order</h3>
                <p className="text-blue-800">
                  Tracking Number: <span className="font-mono font-bold">{selectedOrder.trackingNumber}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h2>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0">
                1
              </span>
              <span className="text-gray-700">
                We'll send you an order confirmation email with tracking details
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0">
                2
              </span>
              <span className="text-gray-700">
                Your order will be processed and prepared for shipment
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0">
                3
              </span>
              <span className="text-gray-700">
                You'll receive a shipping notification when your order is on the way
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0">
                4
              </span>
              <span className="text-gray-700">
                Enjoy your new products! Please leave us a review
              </span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Message */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have questions?{' '}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

