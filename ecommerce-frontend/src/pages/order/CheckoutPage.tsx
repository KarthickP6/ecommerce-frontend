import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { toast } from 'react-toastify';

/**
 * Checkout Page Component
 * Handles checkout process with order creation and payment
 * Features:
 * - Order review
 * - Shipping address selection
 * - Payment method selection
 * - Order creation with JWT
 * - Proper loading and error states
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, itemCount } = useCart();
  const { createOrder, processPayment, createLoading, paymentLoading, error, currentOrder } = useOrder();
  const { user } = useSelector((state: RootState) => state.auth);

  const [shippingAddressId, setShippingAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderCreated) {
      toast.warning('Your cart is empty');
      navigate('/products');
    }
  }, [items.length, orderCreated, navigate]);

  /**
   * Handle order creation
   * Automatically includes JWT token
   */
  const handleCreateOrder = async () => {
    // Validation
    if (!shippingAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      // Create order with JWT automatic
      const result = await createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddressId,
        paymentMethod,
        notes: notes || undefined,
      });

      if (result.payload) {
        setOrderCreated(true);
        toast.success('Order created successfully!');
        // Proceed to payment
        await handlePayment(result.payload.id);
      }
    } catch (err) {
      toast.error('Failed to create order');
    }
  };

  /**
   * Handle payment processing
   * Automatically includes JWT token
   */
  const handlePayment = async (orderId: string) => {
    try {
      const paymentData = {
        method: paymentMethod,
        transactionId: `TXN-${Date.now()}`,
      };

      const result = await processPayment(orderId, paymentData);

      if (result.payload) {
        toast.success('Payment processed successfully!');
        // Redirect to success page
        navigate(`/order-success?orderId=${orderId}`);
      }
    } catch (err) {
      toast.error('Payment processing failed');
    }
  };

  // Loading state
  if (createLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-2">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id || item.product.id} className="flex justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <select
                  value={shippingAddressId}
                  onChange={(e) => setShippingAddressId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an address</option>
                  <option value="addr-1">Home Address</option>
                  <option value="addr-2">Work Address</option>
                  <option value="addr-3">Other Address</option>
                </select>
                <p className="text-sm text-gray-600">
                  Shipping to: {user?.name}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="debit_card"
                    checked={paymentMethod === 'debit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Debit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for the order..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-600">
                  I agree to the terms and conditions and privacy policy
                </span>
              </label>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Items Count */}
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span>Items ({itemCount}):</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span>Tax:</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleCreateOrder}
                disabled={
                  createLoading ||
                  paymentLoading ||
                  !shippingAddressId ||
                  !agreedToTerms ||
                  items.length === 0
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg mb-3 transition"
              >
                {createLoading || paymentLoading ? 'Processing...' : 'Place Order'}
              </button>

              <button
                onClick={() => navigate('/cart')}
                disabled={createLoading || paymentLoading}
                className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

