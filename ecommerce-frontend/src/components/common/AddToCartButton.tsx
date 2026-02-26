import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import type { Product } from '@/features/product/productSlice';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * AddToCartButton Component
 * Reusable button for adding products to cart
 * Automatically sends JWT token through useCart hook
 */
export const AddToCartButton = ({
  product,
  className = '',
  variant = 'primary',
  size = 'md',
}: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItemToCartAsync, syncLoading } = useCart();

  /**
   * Handle adding item to cart
   * Automatically includes JWT token in request
   */
  const handleAddToCart = async () => {
    try {
      await addItemToCartAsync(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  // Style variants
  const baseStyles = 'font-bold rounded transition-colors';
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300',
    secondary: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50',
  };
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <div className="flex items-center gap-1 border rounded">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={syncLoading}
          className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={syncLoading}
          className="w-12 text-center border-l border-r py-1 disabled:opacity-50"
        />
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={syncLoading || quantity >= product.stock}
          className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={syncLoading || product.stock === 0}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      >
        {syncLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Adding...
          </span>
        ) : product.stock === 0 ? (
          'Out of Stock'
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;

