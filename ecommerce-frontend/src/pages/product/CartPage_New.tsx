import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced Cart Page with Beautiful UI
 * Features:
 * - Product card design
 * - Quantity controls
 * - Discount calculations
 * - Order summary
 * - Coupon code input
 * - Empty cart state
 */
const CartPageNew = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 199.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: 299.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setDiscountPercent(10);
    } else if (couponCode === 'SAVE20') {
      setDiscountPercent(20);
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="mt-2 opacity-90">Review and manage your items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started shopping</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left - Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                          <div className="flex items-center border-2 border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="w-12 px-2 py-2 text-center border-0 outline-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-4">
                          Subtotal: <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                        <button
                          onClick={() => handleQuantityChange(item.id, 0)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Promo Code</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter coupon code (SAVE10, SAVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountPercent > 0 && (
                  <p className="mt-3 text-sm text-green-600 font-semibold">
                    ✓ {discountPercent}% discount applied!
                  </p>
                )}
              </div>
            </div>

            {/* Right - Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 mb-3"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Badges */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM15 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Free Returns
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM15 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPageNew;
