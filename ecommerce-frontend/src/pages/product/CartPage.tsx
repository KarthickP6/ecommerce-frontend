import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { formatPrice } from '@/utils/formatPrice';

/**
 * CartPage Component
 * Displays shopping cart with add, remove, and update quantity functionality
 * Uses JWT authentication automatically through useCart hook
 */
export default function CartPage() {
  const {
    items,
    total,
    itemCount,
    loading,
    syncLoading,
    error,
    loadCart,
    removeItemAsync,
    updateItemQuantityAsync,
    emptyCartAsync,
  } = useCart();

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /**
   * Handle remove item from cart
   * Automatically sends JWT token
   */
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItemAsync(itemId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  /**
   * Handle update item quantity
   * Automatically sends JWT token
   */
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await updateItemQuantityAsync(itemId, newQuantity);
      toast.success('Quantity updated');
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  /**
   * Handle clear entire cart
   * Automatically sends JWT token
   */
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await emptyCartAsync();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error('Failed to clear cart');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <a href="/products" className="mt-4 inline-block text-blue-500 hover:underline">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Cart Items */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">Subtotal</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id || item.product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded mr-4"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">{item.product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  {formatPrice(item.product.price)}
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id || item.product.id,
                          item.quantity - 1
                        )
                      }
                      disabled={syncLoading}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.id || item.product.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      disabled={syncLoading}
                      className="w-12 text-center border rounded px-2 py-1 disabled:opacity-50"
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id || item.product.id,
                          item.quantity + 1
                        )
                      }
                      disabled={syncLoading}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-3 text-center font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleRemoveItem(item.id || item.product.id)}
                    disabled={syncLoading}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex justify-between mb-4">
              <span>Items: {itemCount}</span>
              <span>{itemCount} item(s)</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => (window.location.href = '/checkout')}
                disabled={syncLoading || items.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button
                onClick={() => (window.location.href = '/products')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleClearCart}
                disabled={syncLoading}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
